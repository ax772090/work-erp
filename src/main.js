import Vue from 'vue'
import App from '@/App'
import router from '@/router' // api: https://github.com/vuejs/vue-router
import store from '@/store' // api: https://github.com/vuejs/vuex
import VueCookie from 'vue-cookie' // api: https://github.com/alfhen/vue-cookie
import '@/element-ui' // api: https://github.com/ElemeFE/element
// import ElementUI from 'element-ui'
import '@/icons' // api: http://www.iconfont.cn/
// import 'element-ui/lib/theme-chalk/index.css'
import '@/element-ui-theme'// 设置主题
import '@/assets/scss/index.scss'
import httpRequest from '@/utils/httpRequest'
import { isAuth } from '@/utils'
import * as filters from '@/filters'
import QuestionIcon from '@/components/icon-svg/question-icon'
import '@/assets/iconfont/iconfont.css'
import '@/assets/css/common.css'
import '@/assets/css/tableHeader.css'
import _ from 'lodash'
import dialogDrag from '@/components/js/dialog-drag'
// import pinyin from 'node-pinyin'
// Vue.use(ElementUI)
Vue.component('question-icon', QuestionIcon)

Vue.use(VueCookie)

Vue.config.productionTip = false
// 非生产环境, 适配mockjs模拟数据                 // api: https://github.com/nuysoft/Mock
if (process.env.NODE_ENV !== 'production') {
  require('@/mock')
}
// Vue.prototype.$ELEMENT = { size: 'medium' }

// 挂载全局
Vue.prototype.$http = httpRequest // ajax请求方法
Vue.prototype.isAuth = isAuth // 权限方法

Object.keys(`filters`).forEach((key) => {
  Vue.filter(key, filters[key])
})

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  template: '<App/>',
  components: {
    App
  }
})
