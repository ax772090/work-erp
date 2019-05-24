let nowDate = new Date()
// 今天是本周的第几天
let nowDayOfWeek = nowDate.getDay()
// 当前日
let nowDay = nowDate.getDate()
// 当前月
let nowMonth = nowDate.getMonth()
// 当前年
let nowYear = nowDate.getFullYear()

let lastMonthDate = new Date()
lastMonthDate.setDate(1)
lastMonthDate.setMonth(lastMonthDate.getMonth() - 1)
// 上月
let lastMonth = lastMonthDate.getMonth()

// 获取当天日期
exports.currentDate = function () {
  return new Date()
}
/* 这是一种方式 */
// 昨天
exports.yesTerDay = function () {
  let yesterDayDate = new Date(nowYear, nowMonth, nowDay - 1)
  let yesterDayFormat = exports.formatDate(yesterDayDate)
  return yesterDayFormat
}
// 前天
exports.beforeYesTerDay = function () {
  let yesterDayDate = new Date(nowYear, nowMonth, nowDay - 2)
  let yesterDayFormat = exports.formatDate(yesterDayDate)
  return yesterDayFormat
}
/* 这是另外一种方式
*base:0:今天，-1:昨天,-2前天,1:明天,2:后天
*/
exports.getDayStr = function (base = 0) {
  let date = new Date()
  date.setDate(date.getDate() + base)
  return exports.formatDate(date)
}
// 格式化日期
exports.formatDate = function (date) {
  let year = date.getFullYear()
  let month = date.getMonth() + 1
  let nowDay = date.getDate() // 当前日
  if (month < 10) {
    month = '0' + month
  }
  if (nowDay < 10) {
    nowDay = '0' + nowDay
  }
  return year + '-' + month + '-' + nowDay
}
// 获取某月的天数
exports.getMonthDays = function (month) {
  let monthStartDate = new Date(nowYear, month, 1)
  let monthEndDate = new Date(nowYear, month + 1, 1)
  let days = (monthEndDate - monthStartDate) / (1000 * 60 * 60 * 24)
  return days
}
// 本周起止日期
exports.getWeekRange = function () {
  let weekStartDate = new Date(nowYear, nowMonth, nowDay - nowDayOfWeek + 1)
  let weekEndDate = new Date(nowYear, nowMonth, nowDay + (7 - nowDayOfWeek))
  let weekStartFormat = exports.formatDate(weekStartDate)
  let weekEndFormat = exports.formatDate(weekEndDate)
  return [weekStartFormat, weekEndFormat]
}
// 上周起止日期
exports.getLastWeek = function () {
  let weekStartDate = new Date(nowYear, nowMonth, nowDay - nowDayOfWeek - 6)
  let weekEndDate = new Date(nowYear, nowMonth, nowDay + (7 - nowDayOfWeek - 7))
  let weekStartFormat = exports.formatDate(weekStartDate)
  let weekEndFormat = exports.formatDate(weekEndDate)
  return [weekStartFormat, weekEndFormat]
}
// 本月起止日期
exports.getMonthRange = function () {
  let monthStartDate = new Date(nowYear, nowMonth, 1)
  let monthEndDate = new Date(nowYear, nowMonth, exports.getMonthDays(nowMonth))
  let monthStartFormat = exports.formatDate(monthStartDate)
  let monthEndFormat = exports.formatDate(monthEndDate)
  return [monthStartFormat, monthEndFormat]
}
// 上月起止日期
exports.getLastMonthRange = function () {
  let lastMonthStartDate = new Date(nowYear, lastMonth, 1)
  let lastMonthEndDate = new Date(nowYear, lastMonth, exports.getMonthDays(lastMonth))
  let lastMonthStartFormat = exports.formatDate(lastMonthStartDate)
  let lastMonthEndFormat = exports.formatDate(lastMonthEndDate)
  return [lastMonthStartFormat, lastMonthEndFormat]
}
