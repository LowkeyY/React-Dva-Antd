import axios from 'axios'
import qs from 'qs'
import { YQL, CORS, baseURL, ajaxTimeout, notRedirectSign } from './config'
import jsonp from 'jsonp'
import lodash from 'lodash'
import pathToRegexp from 'path-to-regexp'
import { message } from 'antd'
import Cookie from 'js-cookie'
import { routerRedux } from 'dva/router'

axios.defaults.baseURL = baseURL
// axios.defaults.withCredentials = true

const fetch = (options) => {
  let {
    method = 'get',
    data,
    fetchType,
    url,
  } = options

  let isAsync = true

  const cloneData = lodash.cloneDeep(data)
  cloneData[notRedirectSign] = 'true'

  try {
    let domin = ''
    if (url.match(/[a-zA-z]+:\/\/[^/]*/)) {
      domin = url.match(/[a-zA-z]+:\/\/[^/]*/)[0]
      url = url.slice(domin.length)
    }
    const match = pathToRegexp.parse(url)
    url = pathToRegexp.compile(url)(data)
    for (let item of match) {
      if (item instanceof Object && item.name in cloneData) {
        delete cloneData[item.name]
      }
    }
    url = domin + url
  } catch (e) {
    message.error(e.message)
  }

  if (fetchType === 'JSONP') {
    return new Promise((resolve, reject) => {
      jsonp(url, {
        param: `${qs.stringify(data)}&_callback_`,
        name: `jsonp_${new Date().getTime()}`,
        timeout: ajaxTimeout,
      }, (error, result) => {
        if (error) {
          reject(error)
        }
        resolve({ statusText: 'OK', status: 200, data: result })
      })
    })
  } else if (fetchType === 'YQL') {
    isAsync = false
    url = `http://query.yahooapis.com/v1/public/yql?q=select * from json where url='${options.url}?${qs.stringify(options.data)}'&format=json`
    data = null
  }

  if (isAsync) { axios.defaults.headers.common['x-requested-with'] = 'XMLHttpRequest' } else { delete axios.defaults.headers.common['x-requested-with'] }

  switch (method.toLowerCase()) {
    case 'get':
      return axios.get(url, {
        params: cloneData,
      })
    case 'delete':
      return axios.delete(url, {
        data: cloneData,
      })
    case 'post':
      return axios.post(url, qs.stringify(cloneData))
    case 'put':
      return axios.put(url, cloneData)
    case 'patch':
      return axios.patch(url, cloneData)
    default:
      return axios(options)
  }
}


const getResponeseErrMsg = (status) => {
  let msg = '未知错误'
  if (status > 199 && status < 300) { return '' }
  switch (status) {
    case 500 :
      msg = '服务器发生未知错误.'
      break
    case 403 :
      msg = '访问服务器被拒绝'
      break
    case 404 :
      msg = '未找到请求的页面'
      break
    case 405 :
      msg = '不允许访问本页面的当前方法'
      break
    case 408 :
    case -1 :// 目前没有人为调用Connection.abort
      msg = '访问超时'
      break
    case 502 :
      msg = '无法连接'
      break
    case 504 :
    case 0 :
    case undefined :
      msg = '网络已断开,不能连接到服务器'
      break
    default :
      msg = `系统错误,错误代码:${status}`
  }
  return msg
}

export default function request (options) {
  if (options.url && options.url.indexOf('//') > -1) {
    const origin = `${options.url.split('//')[0]}//${options.url.split('//')[1].split('/')[0]}`
    if (window.location.origin !== origin) {
      if (CORS && CORS.indexOf(origin) > -1) {
        options.fetchType = 'CORS'
      } else if (YQL && YQL.indexOf(origin) > -1) {
        options.fetchType = 'YQL'
      } else {
        options.fetchType = 'JSONP'
      }
    }
  }
  if (!options.fetchType) { console.log('untils/request:default -> url : ', options.method || 'none', baseURL + options.url) }

  return fetch(options).then((response) => {
    // console.log('untils/request:default -> then : ' , options.url , response);
    const { statusText, status } = response
    let data = options.fetchType === 'YQL' ? response.data.query.results.json : response.data
    return {
      success: true,
      message: statusText,
      status,
      ...data,
    }
  }).catch((error) => {
    // console.log('untils/request:default -> error :' , options.url , error);
    const { response } = error
    let msg
    let status
    let otherData = {}
    if (response) {
      const { data, statusText } = response
      otherData = data
      status = response.status
      msg = getResponeseErrMsg(status) || data.message || statusText
      if (status === 401) {
        window.location = `${location.origin}/login?from=${location.pathname}`
      }
    } else {
      status = 600
      msg = '网络连接错误，请稍后重试。'
    }
    return { success: false, status, message: msg, ...otherData }
  })
}
