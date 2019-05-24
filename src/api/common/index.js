import * as commonData from './common.data.js'

// 获取定时任务信息
export function bankAccountType () {
  return {
    // isOpen: false,
    url: '/sys/schedule/info',
    type: 'get',
    data: {
      dataDictKey: commonData.BANK_ACCOUNT_TYPE
    }
  }
}
