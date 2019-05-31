import {
  Notification
} from 'element-ui'

/**
 * 中转方法
 * @param {Object} data
 */
function objectData(data) {
  return Notification(Object.assign({}, {
    duration: 5000,
    dangerouslyUseHTMLString: true
  }, data))
}

/**
 * 默认红色=>错误
 * @param {String} message
 */
export function notifyErrorHander (message) {
  let data = {
    type: 'error',
    title: '错误',
    message: message
  }
  return objectData(data)
}

/**
 * 默认绿色=>成功
 * @param {String} message
 */
export function notifySuccessHander (message) {
  let data = {
    type: 'success',
    title: '成功',
    message: message
  }
  return objectData(data)
}

/**
 * 默认橙色=>警告
 * @param {String} message
 */
export function notifyWarningHander (message) {
  let data = {
    type: 'warning',
    title: '警告',
    message: message
  }
  return objectData(data)
}

/**
 * 默认灰色=>消息
 * @param {String} message
 */
export function notifyInfoHander (message) {
  let data = {
    type: 'info',
    title: '消息',
    message: message
  }
  return objectData(data)
}
