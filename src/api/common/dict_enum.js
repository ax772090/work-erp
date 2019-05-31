import $request from '@/utils/requestFunction'
import * as dictEnumData from './dict_enum.data.js'

/**
 * 方法名命名规则:
 * 数据字典公共方法
 */
function dict (dataDictKeya) {
  return $request('basicData/queryDataDict2List', 'GET', {
    dataDictKeya: dataDictKeya
  })
}
/**
 *
 * @param {Object} dictEnumData 字典类型
 */
export function dictPayableType () {
  dict(dictEnumData.PAYABLE_TYPE)
}

export function dictApprovalStatus () {
  dict(dictEnumData.APPROVAL_STATUS)
}

export function dictBankAccountType () {
  dict(dictEnumData.BANK_ACCOUNT_TYPE)
}

export function dictBizStatus () {
  dict(dictEnumData.BIZ_STATUS)
}

export function dictCurrencyRound () {
  dict(dictEnumData.CURRENCY_ROUND)
}

export function dictCurrencySymbol () {
  dict(dictEnumData.CURRENCY_SYMBOL)
}

export function dictCustomerLevel () {
  dict(dictEnumData.CUSTOMER_LEVEL)
}

export function dictCustomerType () {
  dict(dictEnumData.CUSTOMER_TYPE)
}

export function dictDateUnit () {
  dict(dictEnumData.DATE_UNIT)
}

export function dictDefectiveStrategy () {
  dict(dictEnumData.DEFECTIVE_STRATEGY)
}

export function dictExchangeReteType () {
  dict(dictEnumData.EXCHANGE_RETE_TYPE)
}

export function dictInspectionBizStatus () {
  dict(dictEnumData.INSPECTION_BIZ_STATUS)
}

export function dictInspectionType () {
  dict(dictEnumData.INSPECTION_TYPE)
}

export function dictInstockType () {
  dict(dictEnumData.INSTOCK_TYPE)
}

export function dictInvoiceType () {
  dict(dictEnumData.INVOICE_TYPE)
}

export function dictOutstockType () {
  dict(dictEnumData.OUTSTOCK_TYPE)
}

export function dictPayMode () {
  dict(dictEnumData.PAY_MODE)
}

export function dictPlantformType () {
  dict(dictEnumData.PLANTFORM_TYPE)
}

export function dictPlanBusinessStatus () {
  dict(dictEnumData.PLAN_BUSINESS_STATUS)
}

export function dictPoInfoBizStatus () {
  dict(dictEnumData.PO_INFO_BIZ_STATUS)
}

export function dictPoInventoryStatus () {
  dict(dictEnumData.PO_INVENTORY_STATUS)
}

export function dictProductPlug () {
  dict(dictEnumData.PRODUCT_PLUG)
}

export function dictProductProperties () {
  dict(dictEnumData.PRODUCT_PROPERTIES)
}

export function dictProductResource () {
  dict(dictEnumData.PRODUCT_RESOURCE)
}

export function dictProfitLossesSource () {
  dict(dictEnumData.PROFIT_LOSSES_SOURCE)
}

export function dictProfitLossesSymbol () {
  dict(dictEnumData.PROFIT_LOSSES_SYMBOL)
}

export function dictPurchaseMode () {
  dict(dictEnumData.PURCHASE_MODE)
}

export function dictPurchaseType () {
  dict(dictEnumData.PURCHASE_TYPE)
}

export function dictPurPayMode () {
  dict(dictEnumData.PUR_PAY_MODE)
}

export function dictPurPayType () {
  dict(dictEnumData.PUR_PAY_TYPE)
}

export function dictSaleStatus () {
  dict(dictEnumData.SALE_STATUS)
}

export function dictSaleType () {
  dict(dictEnumData.SALE_TYPE)
}

export function dictStocktakingdimension () {
  dict(dictEnumData.STOCKTAKINGDIMENSION)
}

export function dictStockBusinessStatus () {
  dict(dictEnumData.STOCK_BUSINESS_STATUS)
}

export function dictStockDocumentStatus () {
  dict(dictEnumData.STOCK_DOCUMENT_STATUS)
}

export function dictSupplierStatus () {
  dict(dictEnumData.SUPPLIER_STATUS)
}

export function dictTortRisk () {
  dict(dictEnumData.TORT_RISK)
}

export function dictTransportMode () {
  dict(dictEnumData.TRANSPORT_MODE)
}

export function dictTransOutBizType () {
  dict(dictEnumData.TRANS_OUT_BIZ_TYPE)
}

export function dictWarehouseInventoryStatus () {
  dict(dictEnumData.WAREHOUSE_INVENTORY_STATUS)
}

export function dictWarehousePropertires () {
  dict(dictEnumData.WAREHOUSE_PROPERTIRES)
}

export function dictWarehouseTradingType () {
  dict(dictEnumData.WAREHOUSE_TRADING_TYPE)
}

export function dictWarehouseType () {
  dict(dictEnumData.WAREHOUSE_TYPE)
}

export function dictBussinessType () {
  dict(dictEnumData.BUSSINESS_TYPE)
}

export function dictFbaCondition () {
  dict(dictEnumData.FBA_CONDITION)
}

export function dictFbaFulfillmentShipping () {
  dict(dictEnumData.FBA_FULFILLMENT_SHIPPING)
}

export function dictFbaFulfillmentStatus () {
  dict(dictEnumData.FBA_FULFILLMENT_STATUS)
}

export function dictFbaOrderShipmentSvc () {
  dict(dictEnumData.FBA_ORDER_SHIPMENT_SVC)
}

export function dictFbaOrderStatus () {
  dict(dictEnumData.FBA_ORDER_STATUS)
}

export function dictFbaOrderType () {
  dict(dictEnumData.FBA_ORDER_TYPE)
}

export function dictFbaShipmentType () {
  dict(dictEnumData.FBA_SHIPMENT_TYPE)
}

export function dictFinPlatformType () {
  dict(dictEnumData.FIN_PLATFORM_TYPE)
}

export function dictFinVerifyType () {
  dict(dictEnumData.FIN_VERIFY_TYPE)
}

export function dictFollowingCondition () {
  dict(dictEnumData.FOLLOWING_CONDITION)
}

export function dictInspectionStatus () {
  dict(dictEnumData.INSPECTION_STATUS)
}

export function dictMwsRptTransactionType () {
  dict(dictEnumData.MWS_RPT_TRANSACTION_TYPE)
}

export function dictMwsRptType () {
  dict(dictEnumData.MWS_RPT_TYPE)
}

export function dictPaymentMode () {
  dict(dictEnumData.PAYMENT_MODE)
}

export function dictPaymentType () {
  dict(dictEnumData.PAYMENT_TYPE)
}

export function dictPickStatus () {
  dict(dictEnumData.PICK_STATUS)
}

export function dictProductUnit () {
  dict(dictEnumData.PRODUCT_UNIT)
}

export function dictReturnSourceType () {
  dict(dictEnumData.RETURN_SOURCE_TYPE)

}
export function dictShipType () {
  dict(dictEnumData.SHIP_TYPE)
}

export function dictTemporarilyType () {
  dict(dictEnumData.TEMPORARILY_TYPE)
}

export function dictWhInstockType () {
  dict(dictEnumData.WH_INSTOCK_TYPE)
}

export function dictYesNo () {
  dict(dictEnumData.YES_NO)
}
