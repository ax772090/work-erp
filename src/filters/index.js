import Vue from 'vue'

const filter = {
  // 数字转字符串
  dataNumStr: val => {
    if (val) {
      if (typeof val === 'string' || typeof val === 'number') {
        return val.toString()
      }
    } else {
      return []
    }
  },
  // 字符串转数组
  dateStringArray: (val) => {
    if (val) {
      if (typeof val === 'string' || typeof val === 'number') {
        return val.split(',')
      }
    } else {
      return []
    }
  },

  // 数组转字符串
  dateArrayString: (val) => {
    if (val) {
      if (typeof val === 'string' || typeof val === 'number') {
        return val.join(',')
      }
    } else {
      return ''
    }
  },

  // 转换成数字类型
  parseInt: val => window.window.parseInt(val),

  // 保留两位小数
  toFixed: (val, digits = 2) => window.parseFloat(val.toFixed(digits))
}

Object.keys(filter).forEach(key => Vue.filter(key, filter[key]))
