import $request from '@/utils/requestFunction'
import * as dictEnumData from './dict_enum.data.js'
import * as commonData from './common.data'

/**
 * 方法名命名规则:
 * 数据字典公共方法
 */
function dict (dataDictKey) {
  return $request('basicData/queryDataDict2List', 'GET', {
    dataDictKey: dataDictKey
  })
}
/**
 *
 * @param {Object} dictEnumData 字典类型
 */
export function dictPayableType () {
  return dict(dictEnumData.PAYABLE_TYPE)
}

export function dictApprovalStatus () {
  return dict(dictEnumData.APPROVAL_STATUS)
}
// 账号类型
export function dictBankAccountType () {
  return dict(dictEnumData.BANK_ACCOUNT_TYPE)
}

export function dictBizStatus () {
  return dict(dictEnumData.BIZ_STATUS)
}
// 舍入类型
export function dictCurrencyRound () {
  return dict(dictEnumData.CURRENCY_ROUND)
}
// 货币符号
export function dictCurrencySymbol () {
  return dict(dictEnumData.CURRENCY_SYMBOL)
}

export function dictCustomerLevel () {
  return dict(dictEnumData.CUSTOMER_LEVEL)
}

export function dictCustomerType () {
  return dict(dictEnumData.CUSTOMER_TYPE)
}
// 保质期单位
export function dictDateUnit () {
  return dict(dictEnumData.DATE_UNIT)
}

export function dictDefectiveStrategy () {
  return dict(dictEnumData.DEFECTIVE_STRATEGY)
}

export function dictExchangeReteType () {
  return dict(dictEnumData.EXCHANGE_RETE_TYPE)
}

export function dictInspectionBizStatus () {
  return dict(dictEnumData.INSPECTION_BIZ_STATUS)
}

export function dictInspectionType () {
  return dict(dictEnumData.INSPECTION_TYPE)
}

export function dictInstockType () {
  return dict(dictEnumData.INSTOCK_TYPE)
}
// 开票方式
export function dictInvoiceType () {
  return dict(dictEnumData.INVOICE_TYPE)
}

export function dictOutstockType () {
  return dict(dictEnumData.OUTSTOCK_TYPE)
}
// 付款方式
export function dictPayMode () {
  return dict(dictEnumData.PAY_MODE)
}
// 销售平台
export function dictPlantformType () {
  return dict(dictEnumData.PLANTFORM_TYPE)
}

export function dictPlanBusinessStatus () {
  return dict(dictEnumData.PLAN_BUSINESS_STATUS)
}

export function dictPoInfoBizStatus () {
  return dict(dictEnumData.PO_INFO_BIZ_STATUS)
}

export function dictPoInventoryStatus () {
  return dict(dictEnumData.PO_INVENTORY_STATUS)
}

export function dictProductPlug () {
  return dict(dictEnumData.PRODUCT_PLUG)
}
// 产品属性
export function dictProductProperties () {
  return dict(dictEnumData.PRODUCT_PROPERTIES)
}
// 产品来源
export function dictProductResource () {
  return dict(dictEnumData.PRODUCT_RESOURCE)
}

export function dictProfitLossesSource () {
  return dict(dictEnumData.PROFIT_LOSSES_SOURCE)
}

export function dictProfitLossesSymbol () {
  return dict(dictEnumData.PROFIT_LOSSES_SYMBOL)
}
// 采购方式
export function dictPurchaseMode () {
  return dict(dictEnumData.PURCHASE_MODE)
}
// 采购类型
export function dictPurchaseType () {
  return dict(dictEnumData.PURCHASE_TYPE)
}

export function dictPurPayMode () {
  return dict(dictEnumData.PUR_PAY_MODE)
}

export function dictPurPayType () {
  return dict(dictEnumData.PUR_PAY_TYPE)
}
// 销售状态
export function dictSaleStatus () {
  return dict(dictEnumData.SALE_STATUS)
}
// 销售类型
export function dictSaleType () {
  return dict(dictEnumData.SALE_TYPE)
}

export function dictStocktakingdimension () {
  return dict(dictEnumData.STOCKTAKINGDIMENSION)
}

export function dictStockBusinessStatus () {
  return dict(dictEnumData.STOCK_BUSINESS_STATUS)
}

export function dictStockDocumentStatus () {
  return dict(dictEnumData.STOCK_DOCUMENT_STATUS)
}
// 合作状态
export function dictSupplierStatus () {
  return dict(dictEnumData.SUPPLIER_STATUS)
}

export function dictTortRisk () {
  return dict(dictEnumData.TORT_RISK)
}

export function dictTransportMode () {
  return dict(dictEnumData.TRANSPORT_MODE)
}

export function dictTransOutBizType () {
  return dict(dictEnumData.TRANS_OUT_BIZ_TYPE)
}

export function dictWarehouseInventoryStatus () {
  return dict(dictEnumData.WAREHOUSE_INVENTORY_STATUS)
}
// 仓库属性
export function dictWarehousePropertires () {
  return dict(dictEnumData.WAREHOUSE_PROPERTIRES)
}

export function dictWarehouseTradingType () {
  return dict(dictEnumData.WAREHOUSE_TRADING_TYPE)
}

export function dictWarehouseType () {
  return dict(dictEnumData.WAREHOUSE_TYPE)
}

export function dictBussinessType () {
  return dict(dictEnumData.BUSSINESS_TYPE)
}

export function dictFbaCondition () {
  return dict(dictEnumData.FBA_CONDITION)
}

export function dictFbaFulfillmentShipping () {
  return dict(dictEnumData.FBA_FULFILLMENT_SHIPPING)
}

export function dictFbaFulfillmentStatus () {
  return dict(dictEnumData.FBA_FULFILLMENT_STATUS)
}

export function dictFbaOrderShipmentSvc () {
  return dict(dictEnumData.FBA_ORDER_SHIPMENT_SVC)
}

export function dictFbaOrderStatus () {
  return dict(dictEnumData.FBA_ORDER_STATUS)
}

export function dictFbaOrderType () {
  return dict(dictEnumData.FBA_ORDER_TYPE)
}

export function dictFbaShipmentType () {
  return dict(dictEnumData.FBA_SHIPMENT_TYPE)
}

export function dictFinPlatformType () {
  return dict(dictEnumData.FIN_PLATFORM_TYPE)
}

export function dictFinVerifyType () {
  return dict(dictEnumData.FIN_VERIFY_TYPE)
}

export function dictFollowingCondition () {
  return dict(dictEnumData.FOLLOWING_CONDITION)
}

export function dictInspectionStatus () {
  return dict(dictEnumData.INSPECTION_STATUS)
}

export function dictMwsRptTransactionType () {
  return dict(dictEnumData.MWS_RPT_TRANSACTION_TYPE)
}

export function dictMwsRptType () {
  return dict(dictEnumData.MWS_RPT_TYPE)
}

export function dictPaymentMode () {
  return dict(dictEnumData.PAYMENT_MODE)
}

export function dictPaymentType () {
  return dict(dictEnumData.PAYMENT_TYPE)
}

export function dictPickStatus () {
  return dict(dictEnumData.PICK_STATUS)
}
// 长度单位
export function dictProductUnit () {
  return dict(dictEnumData.PRODUCT_UNIT)
}

export function dictReturnSourceType () {
  return dict(dictEnumData.RETURN_SOURCE_TYPE)
}
export function dictShipType () {
  return dict(dictEnumData.SHIP_TYPE)
}

export function dictTemporarilyType () {
  return dict(dictEnumData.TEMPORARILY_TYPE)
}

export function dictWhInstockType () {
  return dict(dictEnumData.WH_INSTOCK_TYPE)
}

export function dictYesNo () {
  return dict(dictEnumData.YES_NO)
}
/**
 * 销售公司
 * @param {Object}
 */
export function listComboboxCompany () {
  return $request(commonData.LIST_COMBOBOX_COMPANY, 'GET')
}
/**
 * 仓库过滤
 * @param {Object}
 */
export function basecBasicwarehouseQuerywhbyproperty (data) {
  return $request(commonData.BASEC_BASICWAREHOUSE_QUERYWHBYPROPERTY, 'GET', data)
}
/**
 * 国家
 * @param {Object}
 */
export function basicdataQueryallcountry (data) {
  return $request(commonData.BASICDATA_QUERYALLCOUNTRY, 'GET', data)
}
/**
 * 市场
 * @param {Object}
 */
export function mwsdatamwsauthorize () {
  return $request(commonData.MWSDATA_MWSAUTHORIZE, 'GET')
}
/**
 * 结算公司
 * @param {Object}
 */
export function sysorganizationselect () {
  return $request(commonData.SYS_ORGANIZATION_SELECT, 'GET')
}
/**
 * 城市
 * @param {Object}
 */
export function basicdataQuerycitybycountry (data) {
  return $request(commonData.BASICDATA_QUERYCITYBYCOUNTRY, 'GET', data)
}
/**
 * 原币/本位币
 * @param {Object}
 */
export function basicDataQueryAllCurrency () {
  return $request(commonData.BASICDATA_QUERYALLCURRENCY, 'GET')
}
/**
 * 结算币别
 * @param {Object}
 */
export function basicBasicsupplierQueryCurrency () {
  return $request(commonData.BASIC_BASICSUPPLIER_QUERYCURRENCY, 'GET')
}
/**
 * 辅助类型
 * @param {Object}
 */
export function prodProdskuparamsListrulesparams () {
  return $request(commonData.PROD_PRODSKUPARAMS_LISTRULESPARAMS, 'GET')
}
/**
 * 对应店铺
 * @param {Object}
 */
export function basicBasicchannelListcombobox (data) {
  return $request(commonData.BASIC_BASICCHANNEL_LISTCOMBOBOX, 'GET', data)
}
/**
 * 销售人员
 * @param {Object}
 */
export function listSearchUser (data) {
  return $request(commonData.LIST_SEARCH_USER, 'GET', data)
}
/**
 * 品牌
 * @param {Object}
 */
export function basicBasicbrandListcombobox () {
  return $request(commonData.BASIC_BASICBRAND_LISTCOMBOBOX, 'GET')
}
/**
 * 单位
 * @param {Object}
 */
export function dictDictunitListcombobox () {
  return $request(commonData.DICT_DICTUNIT_LISTCOMBOBOX, 'GET')
}
/**
 * 销售国家
 * @param {Object}
 */
export function dictDictcountryListcombobox () {
  return $request(commonData.DICT_DICTCOUNTRY_LISTCOMBOBOX, 'GET')
}
/**
 * 币种
 * @param {Object}
 */
export function dictDictcurrencyListcombobox () {
  return $request(commonData.DICT_DICTCURRENCY_LISTCOMBOBOX, 'GET')
}
/**
 * 仓库
 * @param {Object}
 */
export function basicBasicwarehouseListcombobox () {
  return $request(commonData.BASIC_BASICWAREHOUSE_LISTCOMBOBOX, 'GET')
}
