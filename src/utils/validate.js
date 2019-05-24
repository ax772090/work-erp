/**
 * 邮箱
 * @param {*} s
 */
export function isEmail (s) {
  return /^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+((.[a-zA-Z0-9_-]{2,3}){1,2})$/.test(s)
}

/**
 * 手机号码
 * @param {*} s
 */
export function isMobile (s) {
  return /^1[0-9]{10}$/.test(s)
}

/**
 * 电话号码
 * @param {*} s
 */
export function isPhone (s) {
  return /^([0-9]{3,4}-)?[0-9]{7,8}$/.test(s)
}

/**
 * URL地址
 * @param {*} s
 */
export function isURL (s) {
  return /^http[s]?:\/\/.*/.test(s)
}

/**
 * 税率
 * @param {*} s
 * valiDataTaxRate
 */
export function isTaxRate (s) {
  return /^([1-9]\d|\d)$/.test(s)
}

/**
 * 只能是数字
 * @param {number} s
 * valiDataTaxRate
 */
export function isNumber (s) {
  return /^[0-9]*$/.test(s)
}

/**
 * 税率
 * 从0.01到0.99
 */

export function betweenInt (value) {
  // const isBetween = value >= 0.01 && value <= 0.99
  // const isInt = /^0[1-9]$|^[1-9][0-9]?$|^00?\.(?:0[1-9]|[1-9][0-9]?)$|^(?:0[1-9]|[1-9][0-9]?)\.[0-9]$/.test(value)
  // if (value && !(isBetween && isInt)) {
  //   callback(new Error(`0.01到0.99的两位小数`))
  // } else {
  //   callback()
  // }
  return /^0[1-9]$|^[1-9][0-9]?$|^00?\.(?:0[1-9]|[1-9][0-9]?)$|^(?:0[1-9]|[1-9][0-9]?)\.[0-9]$/.test(value)
}

/**
 * 保留后4位小数
 */

export function BigDecimal (value) {
  return /^(.*\..{4}).*$/.test(value)
}
