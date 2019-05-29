import Vue from 'vue'
import qs from 'qs' // JSON.stringify和JSON.parse会有双引号
import merge from 'lodash/merge' // Lodash.js：实用的工具库
import request from './request'

/**
 * token
 * @param {*} url 需要拼接token的地址
 */
function tokens (url, data) {
  url = request.dataJoint(url, data)
  if (url.indexOf('?') !== -1) {
    return request.adornUrl(url + '&token=' + Vue.cookie.get('token'))
  } else {
    return request.adornUrl(url + '?token=' + Vue.cookie.get('token'))
  }
}

// 数据拼接
function dataJoint (url, data = {}) {
  let dataStr = ''
  Object.keys(data).forEach(key => {
    dataStr += key + '=' + data[key] + '&'
  })

  if (dataStr !== '') {
    dataStr = dataStr.substr(0, dataStr.lastIndexOf('&'))
    url = url + '?' + dataStr
  }
  return url
}

/**
 * 请求地址处理
 * @param {*} actionName action方法名称
 */
function adornUrl (actionName) {
  // 非生产环境 && 开启代理, 接口前缀统一使用[/proxyApi/]前缀做代理拦截!
  return (process.env.NODE_ENV !== 'production' && process.env.OPEN_PROXY ? '/proxyApi/' : window.SITE_CONFIG.baseUrl) + actionName
}

/**
 * get请求参数处理
 * @param {*} params 参数对象
 * @param {*} openDefultParams 是否开启默认参数?
 */
function adornParams (params = {}, openDefultParams = true) {
  var defaults = {
    't': new Date().getTime()
  }
  return openDefultParams ? merge(defaults, params) : params
}

/**
 * post请求数据处理
 * @param {*} data 数据对象
 * @param {*} openDefultdata 是否开启默认数据?
 * @param {*} contentType 数据格式
 *  json: 'application/json; charset=utf-8'
 *  form: 'application/x-www-form-urlencoded; charset=utf-8'
 */
function adornData (data = {}, openDefultdata = true, contentType = 'json') {
  var defaults = {
    't': new Date().getTime()
  }
  data = openDefultdata ? merge(defaults, data) : data
  return contentType === 'json' ? JSON.stringify(data) : qs.stringify(data)
}

/**
 * 请求封装统一入口
 */
function $request (url, method, data, isString = false) {
  let obj = {}
  if (method === 'GET') {
    if (!isString) {
      obj = {
        url: adornUrl(url),
        method: method,
        params: adornParams(data, false)
      }
    }
    if (isString) {
      obj = {
        url: adornUrl(url) + '/' + data,
        method: method
      }
    }
  } else {
    obj = {
      url: adornUrl(url),
      method: method,
      data: adornData(data, false)
    }
  }

  return new Promise((resolve, reject) => {
    return request(obj).then((src) => {
      if (src.data && src.data.code === 0) {
        console.log('正确')
        resolve(src.data)
      } else {
        console.log('错误1')
        reject(src)
      }
    }).catch(err => {
      reject(err.data)
      console.log('错误2')
    })
  })
}

export default $request
