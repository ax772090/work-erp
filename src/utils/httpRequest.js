import Vue from 'vue'
import axios from 'axios'
import router from '@/router'
import qs from 'qs' // JSON.stringify和JSON.parse会有双引号
import merge from 'lodash/merge' // Lodash.js：实用的工具库

const http = axios.create({
  timeout: 1000 * 30,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json; charset=utf-8'
  }
})

/**
 * 请求拦截
 */
http.interceptors.request.use(config => {
  config.headers['token'] = Vue.cookie.get('token') // 请求头带上token
  return config
}, error => {
  return Promise.reject(error)
})

/**
 * 响应拦截
 */
http.interceptors.response.use(response => {
  if (response.data && response.data.code === 401) { // 401, token失效
    Vue.cookie.delete('token')
    router.options.isAddDynamicMenuRoutes = false
    router.push({
      name: 'login'
    })
  }
  // if (!(response.data)) {
  //   console.log('报null', response.data)
  //   Vue.set(response, 'data', {})
  //   Vue.set(response.data, 'msg', '请联系管理员')
  //   Vue.set(response.data, 'code', 500)
  // }
  // if (!(response.data.msg)) {
  //   console.log('msg报null', response.data)
  //   Vue.set(response.data, 'msg', '请联系管理员')
  //   // Vue.set(response.data, 'code', 500)
  // }
  return response
}, error => {
  console.log(error)
  return Promise.reject(error)
})

/**
 * token
 * @param {*} url 需要拼接token的地址
 */
http.tokens = (url, data) => {
  url = http.dataJoint(url, data)
  if (url.indexOf('?') !== -1) {
    return http.adornUrl(url + '&token=' + Vue.cookie.get('token'))
  } else {
    return http.adornUrl(url + '?token=' + Vue.cookie.get('token'))
  }
}

// 数据拼接
http.dataJoint = (url, data = {}) => {
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
http.adornUrl = (actionName) => {
  // 非生产环境 && 开启代理, 接口前缀统一使用[/proxyApi/]前缀做代理拦截!
  return (process.env.NODE_ENV !== 'production' && process.env.OPEN_PROXY ? '/proxyApi/' : window.SITE_CONFIG.baseUrl) + actionName
}

/**
 * get请求参数处理
 * @param {*} params 参数对象
 * @param {*} openDefultParams 是否开启默认参数?
 */
http.adornParams = (params = {}, openDefultParams = true) => {
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
http.adornData = (data = {}, openDefultdata = true, contentType = 'json') => {
  var defaults = {
    't': new Date().getTime()
  }
  data = openDefultdata ? merge(defaults, data) : data
  return contentType === 'json' ? JSON.stringify(data) : qs.stringify(data)
}

export default http
