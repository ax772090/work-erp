import Vue from 'vue'
import axios from 'axios'
import router from '@/router'
import apiBaseUrl from '@/api/apiBaseUrl'

// var BASE_API = ''
// if (process.env.NODE_ENV === 'production' && process.env.OPEN_PROXY) {
//   BASE_API = '/proxyApi/'
// } else {
//   BASE_API = window.SITE_CONFIG.baseUrl
// }

const request = axios.create({
  baseURL: apiBaseUrl(), // api的base_url
  timeout: 1000 * 30,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json; charset=utf-8'
  }
})

/**
 * 请求拦截
 */
request.interceptors.request.use(config => {
  config.headers['token'] = Vue.cookie.get('token') // 请求头带上token
  return config
}, error => {
  return Promise.reject(error)
})

/**
 * 响应拦截
 */
request.interceptors.response.use(response => {
  if (response.data && response.data.code === 401) { // 401, token失效
    Vue.cookie.delete('token')
    router.options.isAddDynamicMenuRoutes = false
    router.push({
      name: 'login'
    })
  }
  return response
}, error => {
  console.log(error)
  return Promise.reject(error)
})

export default request
