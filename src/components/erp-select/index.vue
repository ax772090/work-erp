<!-- 
  功能描述：1，根据URL自动从后台请求数据并绑定
            2，或者从父组件传入dataList后自动绑定
            3，支持继承el-select相关属性，如：filterable,clearable,multiple...
  调用样例：
          1,采用从父级传数据源的方式
          <erp-select
            v-model="returnValue"                     // 数据双向绑定      
            :dataList="dictProductResourceOption"     // 从父组件传数据源         
            data-value="key"                          // value 绑定项
            data-label="value"                        // label 帮定项
            placeholder="选择产品来源"                 // 输入提示
            clearable                                 // 可清除
            filterable                                // 可过滤
          />

          2,采用Url自动请求后台的方式
          <erp-select
            v-model="returnValue"                     // 数据双向绑定   
            httpUrl="dict/dictunit/listcombobox"      // 服务请求url
            :requestParams="filterProdResource"       // 过滤条件
            data-source="list"                        // 数据源对象 
            data-value="key"                          // value 绑定项
            data-label="value"                        // label 帮定项
            placeholder="选择产品来源"                 // 输入提示
            clearable                                 // 可清除
            filterable                                // 可过滤
          />
  待优化问题：
          1，v-bind="$props" (暂时会导致 filter-method不触发)    
          2，如果不加v-bind="$props" 则不能兼容el-select内容 
  -->
<template>
  <el-select :value='selectVal'
             v-on="inputListeners"
             filterable
             clearable
             :filter-method="selectFilter"
             @focus="selectFocus()">
    <el-option v-for="(item,index) in listData"
               :key="index"
               :label="item[dataLabel]"
               :value="item[dataValue]"
               :disabled="bUsedHander(item)">
    </el-option>
  </el-select>
</template>

<script>
import { Select } from 'element-ui'  // 用于继承Select组件信息
import { getFirstLetter } from '@/utils/pinyinUtils.js'

export default {
  name: 'erp-select',
  inheritAttrs: false, // 组件将不会把未被注册的props呈现为普通的HTML属性渲染在dom节点之上,但是在组件里我们可以通过其$attrs可以获取到没有使用的注册属性
  props: {
    ...Select.props, // 这里继承内在组件的props

    httpUrl: { default: '' },
    httpMethod: { default: 'get' },
    requestParams: { default: '' },
    title: { default: '' },
    dataList: { type: Array },
    // 得到数据后拿到的数据体名
    dataSource: { default: '' },
    dataValue: { default: 'id' },
    dataLabel: { default: 'name' },
    // 接受外部v-model传入的值
    value: { default: '' },
    // 判断是否选择不禁用
    canSelectDisabled: { default: false }
  },

  computed: {
    inputListeners: function () {
      var vm = this
      // `Object.assign` 将所有的对象合并为一个新对象
      return Object.assign({},
        this.$listeners,
        {
          // 这里确保组件配合 `v-model` 的工作
          input: function (event) {
            vm.$emit('input', event)
          }
        }
      )
    }
  },

  data () {
    return {
      listData: [],
      listDataCopy: [],
      selectVal: this.value
    }
  },

  created () {
    this.getDataList()
  },

  methods: {
    /**
     * 过滤选项
     */
    selectFilter (val) {
      if (val && val.trim() !== '') { // val存在
        this.listData = this.listDataCopy.filter((item) => {
          if (!!~item[this.dataValue].indexOf(val.trim()) || !!~item[this.dataLabel].toUpperCase().indexOf(val.trim().toUpperCase()) || !!~getFirstLetter(item[this.dataLabel]).indexOf(val.trim())) {
            return true
          }
        })
      } else { // val为空时，还原数组
        this.listData = this.listDataCopy
      }
      // 如果不添加这行，将会使输入的过滤值清空
      this.selectVal = val.trim()
    },
    // 当获得焦点的时候
    selectFocus () {
      this.selectVal = ''
      // this.listData = this.listDataCopy
    },
    /*
    加载列表数据
    */
    getDataList () {
      this.listData = []
      this.listDataCopy = []

      // 优先取数据列表
      if (this.dataList) {
        this.listDataCopy = this.dataList
        this.listData = this.dataList
        return
      }

      // 请求Url与dataSource均不能为空
      if (this.httpUrl === '' || this.dataSource === '') {
        if (this.httpUrl === '') {
          throw '{dataSource}未设置'
        }
        if (this.dataSource === '') {
          throw '{dataSource}未设置'
        }
        return
      }

      // 请求列表数据
      this.$http({
        url: this.$http.adornUrl(this.httpUrl),
        method: this.httpMethod,
        params: this.$http.adornParams(this.requestParams)
      }).then(({ data }) => {
        if (data && data.code === 0) {
          if (!data.hasOwnProperty(this.dataSource)) {
            throw '{DataSource}不正确'
          }
          this.listDataCopy = data[this.dataSource]
          this.listData = data[this.dataSource]
        }
      })
    },

    /**
     * 深度复制数组
     */
    copyArray (arr) {
      return arr.map((e) => {
        if (typeof e === 'object') {
          return Object.assign({}, e)
        } else {
          return e
        }
      })
    },

    // 判断选择项是否有bUsed
    bUsedHander (item) {
      if (this.canSelectDisabled) {
        return false
      }
      if (item && item.hasOwnProperty('bUsed')) {
        return !item.bUsed
      } else {
        return false
      }
    }
  },

  watch: {
    value: {
      handler (val, oldVal) {
        this.selectVal = this.value
        this.$emit('change', this.selectVal)
      },
      deep: true
    },
    selectVal: {
      handler (val, oldVal) {
        // 为空时
        if (!val) {
          this.selectFilter(val)
        }
        this.$emit('input', val)
      },
      deep: true
    },
    // 监听请求参数变化
    requestParams: {
      handler (val, oldVal) {
        this.getDataList()
      },
      deep: true
    },

    // 监听数据列表变化
    dataList: {
      handler (val, oldVal) {
        this.getDataList()
      },
      deep: true
    }
  }

}
</script>
