import $request from '@/utils/requestFunction'
import * as basicData from './basic_data.js'

// basicbrand页面
// export function inChargeOfList123 () {
//   return http({
//     url: 'basicData/queryAllUser',
//     method: 'get'
//   })
// }

// ====================================================================== basiccategory页面 ==========

// export function getDict (data) {
//   return $request('basicData/queryDataDict2List', 'GET', {
//     dataDictKeya: 'PAYABLE_TYPE'
//   })
// }

/**
 * 列表
 * @param {Object} data
 */
export function basicCategoryList (data) {
  return $request(basicData.basicCategoryList, 'GET', data)
  // return $request('basic/basiccategory/list', 'GET', data)
}
// export function isAuthBasicCategoryList (data) {
//   return basicData.basicCategoryList
// }

/**
 * 禁用
 * @param {Object} data
 */
export function basicCategoryActiveOrDis (data) {
  return $request('basic/basiccategory/activeOrDis', 'POST', data)
}

/**
 * 详情页面=>详情查询
 * @param {Object} data
 */
export function basicCategoryInfo (data, isString) {
  return $request('basic/basiccategory/info', 'GET', data, isString)
}

/**
 * 详情页面=>上级分类
 * @param {Object} data
 */
export function basicCategoryTreeList (data) {
  return $request('basic/basiccategory/treeList', 'GET', data)
}

/**
 * 详情页面=>新增
 * @param {Object} data
 */
export function basicCategorySave (data) {
  return $request('basic/basiccategory/save', 'POST', data)
}

/**
 * 详情页面=>编辑
 * @param {Object} data
 */
export function basicCategoryUpdate (data) {
  return $request('basic/basiccategory/update', 'PUT', data)
}

// ====================================================================== basicchannel页面 ==========

/**
 * 列表
 * @param {Object} data
 */
export function basicChannelList (data) {
  return $request('basic/basicchannel/list', 'GET', data)
}

/**
 * 禁用
 * @param {Object} data
 */
export function basicChannelActiveOrDis (data) {
  return $request('basic/basicchannel/activeOrDis', 'POST', data)
}

/**
 * 详情页面=>详情查询
 * @param {Object} data
 */
export function basicChannelInfo (data, isString) {
  return $request('basic/basicchannel/info', 'GET', data, isString)
}

/**
 * 详情页面=>新增
 * @param {Object} data
 */
export function basicChannelSave (data) {
  return $request('basic/basicchannel/save', 'POST', data)
}

/**
 * 详情页面=>编辑
 * @param {Object} data
 */
export function basicChannelUpdate (data) {
  return $request('basic/basicchannel/update', 'GET', data)
}

// basiccolor页面
// basiccustomer页面
// basicrate页面
// basicsupplier页面
// basicsupport页面
// basicwarehouse页面
