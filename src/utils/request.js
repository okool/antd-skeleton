import axios from 'axios';
import Qs from 'qs'
import { guid, getRequestHeader, getApiHost, makeApiSignature, makeApiName } from './utils'
import { notification, message } from 'antd';
import Queue from './queue'

const RequestQueue = new Queue('request');
var ses = 0;
var running = false;
const instance = axios.create({
  baseURL: getApiHost(),
  withCredentials: true,
  responseType: 'json',
  transformRequest: [function (data) {
    data = Qs.stringify(data);
    return data;
  }],
  transformResponse: [function (result) {
    // 转换非json
    if (typeof (result) != 'object') {
      result = JSON.parse(result);
    }
    return result;
  }],
});

const codeMessage = {
  400: '发出的请求有错误，服务器没有进行新建或修改数据的操作。',
  401: '用户没有权限（令牌、用户名、密码错误）。',
  403: '用户得到授权，但是访问是被禁止的。',
  404: '发出的请求针对的是不存在的记录，服务器没有进行操作。',
  406: '请求的格式不可得。',
  410: '请求的资源被永久删除，且不会再得到的。',
  422: '当创建一个对象时，发生一个验证错误。',
  500: '服务器发生错误，请检查服务器。',
  502: '网关错误。',
  503: '服务不可用，服务器暂时过载或维护。',
  504: '网关超时。',
};

// 异常拦截
instance.interceptors.response.use((response) => {
  const { data } = response || {};
  return data;
}, (error) => {
  const { config = {}, response, code, message = '' } = error || {};
  let { data = {} } = response || {};
  // 服务器有返回
  if (response && response.status) {
    const errorText = codeMessage[response.status] || response.statusText;
    data.msg = data.msg ? data.msg : errorText;
    data.status = 'exception';
  } else {
    data = { status: 'exception', error_code: '-500', msg: message ? message : '服务器错误.' };
  }

  if (code === 'ECONNABORTED') {
    data.msg = '网络超时,请重试.';
  }
  if (axios.isCancel(error)) {
    data = { status: 'cancel', error_code: '201', msg: '请求已经取消.' };
  }

  return data;
})

// 添加队列
const addQueue = async (req) => {
  RequestQueue.push(req);
}

// 删除队列
const removeQueue = async (id) => {
  RequestQueue.loop(async (index, item) => {
    if (item && item.id === id) {
      item.source && item.source.cancel()
      RequestQueue.delete();
    }
  })
}

// 停止重复请求
const abortRequest = async (name) => {
  RequestQueue.loop(async (index, item) => {
    if (item && item.name === name) {
      item.source && await item.source.cancel()
      RequestQueue.delete(index);
    }
  })
}

// 清空所有队列
export const clearAllQueue = async () => {
  RequestQueue.loop(async (index, item) => {
    if (item.abort) {
      item.source && await item.source.cancel()
      RequestQueue.delete(index);
    }
  })
}

export default async function (url, options = {}) {
  let params = {};
  // ignoreError: 忽略错误,abort取消上次请求
  const { name, method = 'get', abort = true, ignoreError = false, data = {} } = options;
  let headers = getRequestHeader();

  if ((method).toLowerCase() === 'get' || (method).toLowerCase() === 'header') {
    params = data;
  }
  // 接口签名
  const sign = makeApiSignature(url, params);
  const requestName = makeApiName(url, method);
  headers = { ...headers, 'Signature': sign }

  // 中断请求操作
  const CancelToken = axios.CancelToken;
  const source = CancelToken.source();
  const cancelToken = source.token;
  const n = ses++;
  if (abort) {
    await abortRequest(requestName);
  }
  const requestId = guid();

  const config = {
    headers,
    method,
    url,
    data,
    params,
    cancelToken
  };

  addQueue({
    id: requestId,
    name: requestName,
    source: source,
    abort: abort
  });

  return instance(config).then((result = {}) => {
    removeQueue(requestId);
    const { status, msg } = result;
    if (status === 'exception') {
      // 系统级异常
      console.error(msg);
      if (!ignoreError) {
        notification.destroy();
        notification.error({
          message: '服务异常',
          description: msg,
        });
      }
    }
    else if (status === 'cancel') {
      // 取消不反馈
      // console.log('取消请求')
    }
    else if (status != 'ok') {
      // 业务错误
      if (!ignoreError) {
        message.destroy();
        message.warning(msg || '错误.');
      }
    }

    return result;
  })
}