// import {$http} from 'vue'
import $http from '@/utils/httpRequest'
// import { promises } from 'fs';
// import Vue from 'vue'

// 少量公用数据
const config = {
  request_prefix: 'http://localhost:8001',
  base_img: 'http://www.baidu.com',
  messageName: '成功',
  messageType: 'message'
}

/**
 * 操作成功的提示
 * @param {string} url 请求地址
 * @param {*} params 发送的数据
 * @param {string} resdata 发送的数据
 */
// const message = function (message, type) {
//   let ParamsData = params === undefined ? {} : params
//   return new Promise((resolve, reject) => {
//     $http({
//       url: $http.adornUrl(url),
//       method: 'get',
//       params: $http.adornParams(ParamsData, false)
//     }).then(({data}) => {
//       resolve(data)
//     }).catch(error => {
//       reject(error)
//     })
//   })
// }

/**
 * init下的查询，get数组
 * @param {string} url 请求地址
 * @param {*} params 发送的数据
 * @param {string} resdata 发送的数据
 */
const getQueryData = function (url, params) {
  let ParamsData = params === undefined ? {} : params
  return new Promise((resolve, reject) => {
    $http({
      url: $http.adornUrl(url),
      method: 'get',
      params: $http.adornParams(ParamsData, false)
    }).then(({data}) => {
      resolve(data)
    }).catch(error => {
      reject(error)
    })
  })
}

/**
 * 根据图片id查找图片
 * @param {Array}  ImgIddataList 需要查找的id数组
 * @param {string} url           请求的id
 */
const getImgData = (url, ImgIddata) => {
  // 执行了两次,需要优化
  let urls = url + ImgIddata
  return new Promise((resolve, reject) => {
    console.log('ajax前,图片：id为', ImgIddata)
    $http({
      url: $http.adornUrl(urls),
      method: 'get',
      params: $http.adornParams({}, false)
    }).then(res => {
      resolve(res)
    }).catch(error => {
      reject(error)
    })
  })
}

/**
 * 提交表单=>修改的保存
 * @param {string} url  请求地址
 * @param {} id   id
 * @param {} type 表示
 * @param {} url  请求地址
 * 注意：暂时适用与产品开发和产品列表模块
 */
const putData = function (url, data, dataAll) {
  return new Promise((resolve, reject) => {
    $http({
      url: $http.adornUrl(url),
      method: 'put',
      data: $http.adornData(data, false)
    }).then(({data}) => {
      if (data && data.code === 0) {
        this.$message({
          message: '修改成功',
          type: 'success',
          duration: 1500
        })
        resolve(data)
      }
    }).catch(error => {
      reject(error)
    })
  })
}

/**
 * 提交=>保存
 * @param {string} url  请求地址
 * @param {*} data   data
 * @param {string} dataAll 表示
 */
const postData = (url, data, dataAll) => {
  return new Promise((resolve, reject) => {
    $http({
      url: $http.adornUrl(url),
      method: 'post',
      data: $http.adornData(data, false)
    }).then(({data}) => {
      if (data && data.code === 0) {
        this.$message({
          message: '修改成功',
          type: 'success',
          duration: 1000
        })
        resolve(data)
      }
    }).catch(error => {
      reject(error)
    })
  })
}

// get请求数据
// post根据id获得数据
// 禁用启用
// 撤销，审批，批示等

export {
  config,
  getQueryData,
  getImgData,
  putData,
  postData
}
