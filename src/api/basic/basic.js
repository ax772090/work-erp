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
  return $request(basicData.basicCategoryActiveOrDis, 'POST', data)
}

/**
 * 详情页面=>详情查询
 * @param {Object} data
 */
export function basicCategoryInfo (data, isString) {
  return $request(basicData.basicCategoryInfo, 'GET', data, isString)
}

/**
 * 详情页面=>上级分类
 * @param {Object} data
 */
export function basicCategoryTreeList (data) {
  return $request(basicData.basicCategoryTreeList, 'GET', data)
}

/**
 * 详情页面=>新增
 * @param {Object} data
 */
export function basicCategorySave (data) {
  return $request(basicData.basicCategorySave, 'POST', data)
}

/**
 * 详情页面=>编辑
 * @param {Object} data
 */
export function basicCategoryUpdate (data) {
  return $request(basicData.basicCategoryUpdate, 'PUT', data)
}

// ====================================================================== basicchannel页面 ==========

/**
 * 列表
 * @param {Object} data
 */
export function basicChannelList (data) {
  return $request(basicData.basicChannelList, 'GET', data)
}

/**
 * 禁用
 * @param {Object} data
 */
export function basicChannelActiveOrDis (data) {
  return $request(basicData.basicChannelActiveOrDis, 'POST', data)
}

/**
 * 详情页面=>详情查询
 * @param {Object} data
 */
export function basicChannelInfo (data, isString) {
  return $request(basicData.basicChannelInfo, 'GET', data, isString)
}

/**
 * 详情页面=>新增
 * @param {Object} data
 */
export function basicChannelSave (data) {
  return $request(basicData.basicChannelSave, 'POST', data)
}

/**
 * 详情页面=>编辑
 * @param {Object} data
 */
export function basicChannelUpdate (data) {
  return $request(basicData.basicChannelUpdate, 'POST', data)
}

// ====================================================================== basicbrand页面 ==========

/**
 * 列表
 * @param {Object} data
 */
export function basicbrandList (data) {
  return $request(basicData.basicbrandList, 'GET', data)
}

/**
 * 禁用
 * @param {Object} data
 */
export function basicbrandActiveOrDis (data) {
  return $request(basicData.basicbrandActiveOrDis, 'POST', data)
}
/**
 * 上传品牌logo
 * @param {Object} data
 */
export function prodimageSave (data) {
  return $request(basicData.prodimageSave, 'POST', data)
}

/**
 * 编辑查询
 * @param {Object} data
 */
export function basicbrandInfo (data, isString) {
  return $request(basicData.basicbrandInfo, 'GET', data, isString)
}

/**
 * 新增保存
 * @param {Object} data
 */
export function basicbrandSave (data) {
  return $request(basicData.basicbrandSave, 'POST', data)
}

/**
 * 编辑更新
 * @param {Object} data
 */
export function basicbrandUpdate (data) {
  return $request(basicData.basicbrandUpdate, 'PUT', data)
}

// ====================================================================== basicsupport页面 ==========

/**
 * 辅助资料类型-列表
 * @param {Object} data
 */
export function prodskurulesList (data) {
  return $request(basicData.prodskurulesList, 'GET', data)
}
/**
 * 辅助资料类型-编辑查询
 * @param {Object} data
 */
export function prodskurulesInfo (data, isString) {
  return $request(basicData.prodskurulesInfo, 'GET', data, isString)
}
/**
 * 辅助资料类型-删除
 * @param {Object} data
 */
export function prodskurulesDelete (data) {
  return $request(basicData.prodskurulesDelete, 'DELETE', data)
}

/**
 * 辅助资料类型-新增保存
 * @param {Object} data
 */
export function prodskurulesSave (data) {
  return $request(basicData.prodskurulesSave, 'POST', data)
}
/**
 * 辅助资料类型-编辑更新
 * @param {Object} data
 */
export function prodskurulesUpdate (data) {
  return $request(basicData.prodskurulesUpdate, 'PUT', data)
}

/**
 * 辅助资料-列表
 * @param {Object} data
 */
export function prodskuparamsList (data) {
  return $request(basicData.prodskuparamsList, 'GET', data)
}
/**
 * 辅助资料-编辑查询
 * @param {Object} data
 */
export function prodskuparamsInfo (data, isString) {
  return $request(basicData.prodskuparamsInfo, 'GET', data, isString)
}
/**
 * 辅助资料-删除
 * @param {Object} data
 */
export function prodskuparamsDelete (data) {
  return $request(basicData.prodskuparamsDelete, 'DELETE', data)
}
/**
 * 辅助资料-新增保存
 * @param {Object} data
 */
export function prodskuparamsSave (data) {
  return $request(basicData.prodskuparamsSave, 'POST', data)
}
/**
 * 辅助资料-编辑更新
 * @param {Object} data
 */
export function prodskuparamsUpdate (data) {
  return $request(basicData.prodskuparamsUpdate, 'PUT', data)
}

// ====================================================================== basicsupplier页面 ==========

/**
 * 列表
 * @param {Object} data
 */
export function basicSupplierList (data) {
  return $request(basicData.basicSupplierList, 'GET', data)
}

/**
 * 禁用
 * @param {Object} data
 */
export function basicSupplierActiveOrDis (data) {
  return $request(basicData.basicSupplierActiveOrDis, 'POST', data)
}

/**
 * 编辑查询
 * @param {Object} data
 */
export function basicSupplierInfo (data, isString) {
  return $request(basicData.basicSupplierInfo, 'GET', data, isString)
}

/**
 * 新增保存
 * @param {Object} data
 */
export function basicSupplierSave (data) {
  return $request(basicData.basicSupplierSave, 'POST', data)
}

/**
 * 编辑更新
 * @param {Object} data
 */
export function basicSupplierUpdate (data) {
  return $request(basicData.basicSupplierUpdate, 'PUT', data)
}

// ====================================================================== basiccustomer页面 ==========
/**
 * 列表
 * @param {Object} data
 */
export function basicCustomerList (data) {
  return $request(basicData.basicCustomerList, 'GET', data)
}
/**
 * 编辑查询
 * @param {Object} data
 */
export function basicCustomerInfo (data, isString) {
  return $request(basicData.basicCustomerInfo, 'GET', data, isString)
}

/**
 * 新增保存
 * @param {Object} data
 */
export function basicCustomerSave (data) {
  return $request(basicData.basicCustomerSave, 'POST', data)
}

/**
 * 编辑更新
 * @param {Object} data
 */
export function basicCustomerUpdate (data) {
  return $request(basicData.basicCustomerUpdate, 'PUT', data)
}

// ====================================================================== basicwarehouse页面 ==========
/**
 * 列表
 * @param {Object} data
 */
export function basicWarehouseList (data) {
  return $request(basicData.basicWarehouseList, 'GET', data)
}
/**
 * 禁用
 * @param {Object} data
 */
export function basicWarehouseActiveOrDis (data) {
  return $request(basicData.basicWarehouseActiveOrDis, 'POST', data)
}
/**
 * 编辑查询
 * @param {Object} data
 */
export function basicWarehouseInfo (data, isString) {
  return $request(basicData.basicWarehouseInfo, 'GET', data, isString)
}

/**
 * 新增保存
 * @param {Object} data
 */
export function basicWarehouseSave (data) {
  return $request(basicData.basicWarehouseSave, 'POST', data)
}

/**
 * 编辑更新
 * @param {Object} data
 */
export function basicWarehouseUpdate (data) {
  return $request(basicData.basicWarehouseUpdate, 'PUT', data)
}

// ====================================================================== dictunit页面 ==========
/**
 * 列表
 * @param {Object} data
 */
export function dictUnitList (data) {
  return $request(basicData.dictUnitList, 'GET', data)
}
/**
 * 禁用
 * @param {Object} data
 */
export function dictUnitActiveOrDis (data) {
  return $request(basicData.dictUnitActiveOrDis, 'POST', data)
}
/**
 * 编辑查询
 * @param {Object} data
 */
export function dictUnitInfo (data, isString) {
  return $request(basicData.dictUnitInfo, 'GET', data, isString)
}

/**
 * 新增保存
 * @param {Object} data
 */
export function dictUnitSave (data) {
  return $request(basicData.dictUnitSave, 'POST', data)
}

/**
 * 编辑更新
 * @param {Object} data
 */
export function dictUnitUpdate (data) {
  return $request(basicData.dictUnitUpdate, 'PUT', data)
}
// ====================================================================== dictcurrency页面 ==========
/**
 * 列表
 * @param {Object} data
 */
export function dictCurrencyList (data) {
  return $request(basicData.dictCurrencyList, 'GET', data)
}
/**
 * 禁用
 * @param {Object} data
 */
export function dictCurrencyActiveOrDis (data) {
  return $request(basicData.dictCurrencyActiveOrDis, 'POST', data)
}
/**
 * 编辑查询
 * @param {Object} data
 */
export function dictCurrencyInfo (data, isString) {
  return $request(basicData.dictCurrencyInfo, 'GET', data, isString)
}

/**
 * 新增保存
 * @param {Object} data
 */
export function dictCurrencySave (data) {
  return $request(basicData.dictCurrencySave, 'POST', data)
}

/**
 * 编辑更新
 * @param {Object} data
 */
export function dictCurrencyUpdate (data) {
  return $request(basicData.dictCurrencyUpdate, 'PUT', data)
}

// ====================================================================== basicwarehouse页面 ==========
/**
 * 列表
 * @param {Object} data
 */
export function basicRateList (data) {
  return $request(basicData.basicRateList, 'GET', data)
}
/**
 * 编辑查询
 * @param {Object} data
 */
export function basicRateInfo (data, isString) {
  return $request(basicData.basicRateInfo, 'GET', data, isString)
}

/**
 * 新增保存
 * @param {Object} data
 */
export function basicRateSave (data) {
  return $request(basicData.basicRateSave, 'POST', data)
}

/**
 * 编辑更新
 * @param {Object} data
 */
export function basicRateUpdate (data) {
  return $request(basicData.basicRateUpdate, 'PUT', data)
}

// ====================================================================== dictcountry页面 ==========
/**
 * 列表
 * @param {Object} data
 */
export function dictCountryList (data) {
  return $request(basicData.dictCountryList, 'GET', data)
}

// ====================================================================== dictcity页面 ==========
/**
 * 列表
 * @param {Object} data
 */
export function dictcityList (data) {
  return $request(basicData.dictcityList, 'GET', data)
}
/**
 * 编辑查询
 * @param {Object} data
 */
export function dictcityInfo (data, isString) {
  return $request(basicData.dictcityInfo, 'GET', data, isString)
}

/**
 * 新增保存
 * @param {Object} data
 */
export function dictcitySave (data) {
  return $request(basicData.dictcitySave, 'POST', data)
}

/**
 * 编辑更新
 * @param {Object} data
 */
export function dictcityUpdate (data) {
  return $request(basicData.dictcityUpdate, 'PUT', data)
}
// basiccolor页面
// basiccustomer页面
// basicrate页面
// basicsupplier页面
// basicsupport页面
// basicwarehouse页面
