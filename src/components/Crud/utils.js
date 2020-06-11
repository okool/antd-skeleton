/**
 * 判断变量是否为空,空字符,空数组,空对象
 * @param {*} obj 变量
 */
export function isEmpty(obj) {
  if (obj === undefined || typeof obj === 'undefined' || obj == null || obj === '') {
    return true
  }
  if (typeof (obj) === 'number' && isNaN(obj)) {
    return true
  }
  // 空数组
  if (obj instanceof Array && 'length' in obj && obj.length < 1) {
    return true
  }
  // 空对象
  if (typeof (obj) === 'object' && Object.keys(obj).length < 1) {
    return true
  }

  return false
}

/**
 * 删除空值
 * @param {Symbol} params
 */
export function cleanObjectEmpty(params) {
  const keys = Object.keys(params);
  keys.forEach(key => {
    if (isEmpty(params[key])) {
      delete params[key]
    }
  })
  return params
}

/**
 * 格式化请求参数
 * @param {Symbol} params 请求参数
 */
export function parserQuerys(params) {
  const {
    search = {},
    sorter,
    filter = {},
    current_page = 1,
    page_size = 20,
  } = params || {}

  return JSON.stringify({
    ...params,
    current_page,
    page_size,
    search: cleanObjectEmpty(search),
    filter: cleanObjectEmpty(filter),
    sorter,
  })
}

/**
 * 格式化日期
 * @param {Date} date Date
 * @param {string} fmt 
 */
export function dateFormat(date, fmt = 'yyyy-MM-dd HH:mm') {
  var o = {
    "M+": date.getMonth() + 1, //月份           
    "d+": date.getDate(), //日           
    "h+": date.getHours() % 12 == 0 ? 12 : date.getHours() % 12, //小时           
    "H+": date.getHours(), //小时           
    "m+": date.getMinutes(), //分           
    "s+": date.getSeconds(), //秒           
    "q+": Math.floor((date.getMonth() + 3) / 3), //季度           
    "S": date.getMilliseconds() //毫秒           
  };
  var week = {
    "0": "日",
    "1": "一",
    "2": "二",
    "3": "三",
    "4": "四",
    "5": "五",
    "6": "六"
  };
  if (/(y+)/.test(fmt)) {
    fmt = fmt.replace(RegExp.$1, (date.getFullYear() + "").substr(4 - RegExp.$1.length));
  }
  if (/(E+)/.test(fmt)) {
    fmt = fmt.replace(RegExp.$1, ((RegExp.$1.length > 1) ? (RegExp.$1.length > 2 ? "星期" : "周") : "") + week[date.getDay() + ""]);
  }
  for (var k in o) {
    if (new RegExp("(" + k + ")").test(fmt)) {
      fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
    }
  }
  return fmt;
}