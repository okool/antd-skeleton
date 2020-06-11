import { parse } from 'querystring';
import pathRegexp from 'path-to-regexp';
import env from '../../.env.json';
import packjson from '../../package.json';
import {
  getAuthority,
} from './authority';
const CryptoJS = require('crypto-js')

/* eslint no-useless-escape:0 import/prefer-default-export:0 */
const reg = /(((^https?:(?:\/\/)?)(?:[-;:&=\+\$,\w]+@)?[A-Za-z0-9.-]+(?::\d+)?|(?:www.|[-;:&=\+\$,\w]+@)[A-Za-z0-9.-]+)((?:\/[\+~%\/.\w-_]*)?\??(?:[-\+=&;%@.\w_]*)#?(?:[\w]*))?)$/;
export const isUrl = path => reg.test(path);
export const isAntDesignPro = () => {
  if (ANT_DESIGN_PRO_ONLY_DO_NOT_USE_IN_YOUR_PRODUCTION === 'site') {
    return true;
  }

  return window.location.hostname === 'preview.pro.ant.design';
}; // 给官方演示站点用，用于关闭真实开发环境不需要使用的特性

export const isAntDesignProOrDev = () => {
  const { NODE_ENV } = process.env;

  if (NODE_ENV === 'development') {
    return true;
  }

  return isAntDesignPro();
};
export const getPageQuery = () => parse(window.location.href.split('?')[1]);
/**
 * props.route.routes
 * @param router [{}]
 * @param pathname string
 */

export const getAuthorityFromRouter = (router = [], pathname) => {
  const authority = router.find(
    ({ routes, path = '/', target = '_self' }) =>
      (path && target !== '_blank' && pathRegexp(path).exec(pathname)) ||
      (routes && getAuthorityFromRouter(routes, pathname)),
  );
  if (authority) return authority;
  return undefined;
};
export const getRouteAuthority = (path, routeData) => {
  let authorities;
  routeData.forEach(route => {
    // match prefix
    if (pathRegexp(`${route.path}/(.*)`).test(`${path}/`)) {
      if (route.authority) {
        authorities = route.authority;
      } // exact match

      if (route.path === path) {
        authorities = route.authority || authorities;
      } // get children authority recursively

      if (route.routes) {
        authorities = getRouteAuthority(path, route.routes) || authorities;
      }
    }
  });
  return authorities;
};

export function guid() {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
    var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
}

export function getAccessToken() {
  const {
    token = '',
  } = getAuthority() || {};
  return token
}

/**
 * API_HOST
 */
export function getApiHost() {
  return env.API_HOST;
}

/**
 * 应用名称
 * @returns {string}
 */
export function getAppName() {
  return packjson.name || 'unknown';
}

/**
 * 获取版本号
 * @returns {string}
 */
export function getVersion() {
  return packjson.version || '0.0.0';
}

/**
 * 请求基础header头
 */
export function getRequestHeader() {
  return {
    Token: getAccessToken(),
    App: getAppName(),
    Ver: getVersion(),
  }
}

export function getPathName(url) {
  const urlInfo = pathRegexp.parse(url);
  return urlInfo[0];
}

/**
 * 接口签名
 * @param {string} url url
 * @param {object} params 
 */
export function makeApiSignature(url = '', params = {}) {
  const path = getPathName(url);
  const queryStr = makeQueryStr(params);
  const AppId = getAppName();
  const timestamp = parseInt(Date.now() / 1000).toString();
  const appStr = `${AppId}@${path}`;
  const signKey = CryptoJS.HmacSHA256(appStr, timestamp).toString()
  const str = CryptoJS.enc.Utf8.parse(CryptoJS.HmacSHA256(queryStr, signKey).toString());
  const signature = CryptoJS.enc.Base64.stringify(str)
  const sign = `lansent-auth-v1/${AppId}/${timestamp}/${signature}`

  return sign;
}


/**
 * 生成请求参数按顺序排
 * @param {*} params 请求参数
 */
export function makeQueryStr(params = {}) {
  const pKeys = Object.keys(params).sort((a, b) => {
    if (a.toString().toUpperCase() > b.toString().toUpperCase()) {
      return 1;
    } else if (a.toString().toUpperCase() == b.toString().toUpperCase()) {
      return 0;
    }
    else {
      return -1;
    }
  });
  let queryStr = '';
  for (let i = 0; i < pKeys.length; i++) {
    queryStr += '&' + pKeys[i] + '=' + params[pKeys[i]];
  }

  return queryStr.replace(/(^[\s|&]*)|([\s|&]*$)/g, '');
}

// 生成API名称
export function makeApiName(url = '', method = 'get') {
  const pathname = getPathName(url)
  const str = `${method}::${pathname}`.toLowerCase();
  return str;
}

