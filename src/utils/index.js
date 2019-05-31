
import { notifySuccessHander, notifyErrorHander } from '@/components/erp-notification/notification'

/**
 * 成功弹出提示
 */
export function notifySuccess (data) {
  return notifySuccessHander(data)
}

/**
 * 成功弹出提示
 */
export function notifyError (data) {
  return notifyErrorHander(data)
}

/**
 * 获取uuid
 */
export function getUUID () {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, c => {
    return (c === 'x' ? (Math.random() * 16 | 0) : ('r&0x3' | '0x8')).toString(16)
  })
}

/**
 * 是否有权限
 * @param {*} key
 */
export function isAuth (key) {
  return JSON.parse(sessionStorage.getItem('permissions') || '[]').indexOf(key) !== -1 || false
}

/**
 * 判断是否有数据
 * @param {*} is
 */
export function isNull (is) {
  return is !== null && is !== ''
}

/**
 * 树形数据转换
 * @param {*} data
 * @param {*} id
 * @param {*} pid
 */
export function treeDataTranslate (data, id = 'id', pid = 'parentId') {
  var res = []
  var temp = {}
  for (var i = 0; i < data.length; i++) {
    temp[data[i][id]] = data[i]
  }
  for (var k = 0; k < data.length; k++) {
    if (temp[data[k][pid]] && data[k][id] !== data[k][pid]) {
      if (!temp[data[k][pid]]['children']) {
        temp[data[k][pid]]['children'] = []
      }
      if (!temp[data[k][pid]]['_level']) {
        temp[data[k][pid]]['_level'] = 1
      }
      data[k]['_level'] = temp[data[k][pid]]._level + 1
      temp[data[k][pid]]['children'].push(data[k])
    } else {
      res.push(data[k])
    }
  }
  return res
}

/**
 * 删除数组中的其中一项
 * @param {*} val
 * @param {Array} Arr
 */
export function arrRemove (val, Arr) {
  var index = Arr.indexOf(val)
  if (index > -1) {
    return Arr.splice(index, 1)
  }
}

/**
 * 格式化标准日期 => 将"2018-11-08T09:07:37.648Z"转换为"2018-11-08"
 * @param {*} str
 */
export function dateFormatter (str) {
  // 默认返回yyyy-MM-dd HH-mm-ss
  var hasTime = arguments[1] !== false // 可传第二个参数false，返回yyyy-MM-dd
  var d = new Date(str)
  var year = d.getFullYear()
  var month =
    d.getMonth() + 1 < 10 ? '0' + (d.getMonth() + 1) : d.getMonth() + 1
  var day = d.getDate() < 10 ? '0' + d.getDate() : d.getDate()
  var hour = d.getHours() < 10 ? '0' + d.getHours() : d.getHours()
  var minute = d.getMinutes() < 10 ? '0' + d.getMinutes() : d.getMinutes()
  var second = d.getSeconds() < 10 ? '0' + d.getSeconds() : d.getSeconds()
  if (hasTime) {
    return (
      [year, month, day].join('-') + ' ' + [hour, minute, second].join(':')
    )
  } else {
    return [year, month, day].join('-')
  }
}
/* 表头内容过长处理 */
export function renderHeaderUtil (h, g) { // h即为cerateElement的简写
  let l = g.column.label.length
  let f = 19 // 每个字大小，其实是每个字的比例值，大概会比字体大小差不多大一点，
  g.column.minWidth = f * (l + 2) // 字体大小乘个数即长度 ,+2是为了排序图标正常显示,(+1太短)注意不要加px像素，这里minWidth只是一个比例值，不是真正的长度
  // 然后将列标题放在一个div块中，注意块的宽度一定要100%，否则表格显示不完全（这里我去掉了style: { width: '100%' }，添加之后排序图标和文字距离会拉大）
  // return h('div', { class: 'table-head',style: { width: '100%' } }, [column.label])
  return h('div', {
    class: 'table-head'
  }, [g.column.label])
}

/**
 * 获取url参数
 * @param {*} val
 * @param {Array} Arr
 */
export function getRequest () {
  var url = window.location.href // 获取url中"?"符后的字串
  var theRequest = {}
  if (url.indexOf('?') !== -1) {
    var str = url.substr(url.indexOf('?') + 1)
    let strs = str.split('&')
    for (var i = 0; i < strs.length; i++) {
      theRequest[strs[i].split('=')[0]] = unescape(strs[i].split('=')[1])
    }
    theRequest['urlPath'] = url.slice(url.indexOf('#') + 1, url.indexOf('?'))
  } else {
    theRequest['urlPath'] = url.slice(url.indexOf('#') + 1)
  }
  return theRequest
}

export function getUrl () {
  var url = window.location.href
  if (url.indexOf('?') !== -1) {
    return url.slice(url.indexOf('#') + 1, url.indexOf('?'))
  } else {
    return url.slice(url.indexOf('#') + 1)
  }
}

/**
 * 设置cookie
 * @param {String} cookieName
 * @param {String} value
 * @param {Number} expiredays
 */
export function setCookie (cookieName, value, expiredays) {
  var exdata = new Date() // 获取时间
  exdata.setDate(exdata.getDate() + expiredays)
  // 拼接cookie
  document.cookie = cookieName + '=' + escape(value) + ((expiredays == null) ? '' : ';expires=' + exdata.toGMTString())
}

/**
 * 获取cookie
 * @param {String} cookieName
 */
export function getCookie (cookieName) {
  if (document.cookie.length > 0) {
    var cookieStr = unescape(document.cookie)
    var arr = cookieStr.split('; ')
    for (const item of arr) {
      var cookieItem = item.split('=')
      if (cookieItem[0].trim() === cookieName.trim()) {
        return cookieItem[1]
      }
    }
  }
  return null
}

export function clearCookie (cookieName) {
  var exp = new Date()
  exp.setTime(exp.getTime() - 1)
  var cval = getCookie(cookieName)
  if (cval != null) {
    document.cookie = cookieName + '=' + cval + ';expires=' + exp.toGMTString()
  }
}

let levelPathArray = []
/**
 * 通过人员的部门id匹配部门级联下拉
 * @param {Array} arr（部门级联数据）
 * @param {String} deptId（部门id）
 * @param {String} childrenName(级联下拉子项名称，如children)
 */
export function deptCascader (arr, deptId, childrenName) {
  if (!arr || !Array.isArray(arr)) return []
  for (const item of arr) {
    if (item.orgId === deptId) {
      levelPathArray = item.levelPathArray
      return levelPathArray
    } else if (Array.isArray(item[childrenName])) {
      deptCascader(item[childrenName], deptId, childrenName)
    }
  }
  return levelPathArray
}

/**
 * 清除url的taskId
 * @param {*} val
 * @param {String} url(地址)
 */
export function clearTaskId () {
  var url = window.location.href // 获取url
  if (url.indexOf('?') != -1) {
    var newUrl = url.split('?')[0]
  } else {
    var newUrl = url
  }
  //  返回url的？前面的地址
  return newUrl
}

/**
 * 类型检测
 * @param {String} value 值
 */
function typeOfValue (value) {
  if (value === null) {
    return 'null'
  }

  var type = typeof value
  if (type === 'undefined' || type === 'string') {
    return type
  }

  var typeString = toString.call(value)
  switch (typeString) {
    case '[object Array]':
      return 'array'
    case '[object Date]':
      return 'date'
    case '[object Boolean]':
      return 'boolean'
    case '[object Number]':
      return 'number'
    case '[object Function]':
      return 'function'
    case '[object RegExp]':
      return 'regexp'
    case '[object Object]':
      if (undefined !== value.nodeType) {
        if (value.nodeType === 3) {
          return (/\S/).test(value.nodeValue) ? 'textnode' : 'whitespace'
        } else {
          return 'element'
        }
      } else {
        return 'object'
      }
    default:
      return 'unknow'
  }
}

/**
 * 类型检测
 * @param {Object} data 值
 */
export function hasTypeOf (data) {
  let objectData = data
  for (const key in objectData) {
    if (objectData.hasOwnProperty(key)) {
      const element = objectData[key]
      if (typeOfValue(element) === 'array') {
        objectData[key] = []
      } else if (typeOfValue(element) === 'object') {
        objectData[key] = {}
      } else if (typeOfValue(element) === 'null') {
        objectData[key] = null
      } else {
        objectData[key] = ''
      }
    }
  }
  console.log(objectData)
  return objectData
}
