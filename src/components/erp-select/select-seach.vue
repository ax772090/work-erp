<!--
  功能描述：
    1，根据URL自动从后台请求数据并绑定
    2，实现Remote Search(远程搜索)
          
  调用样例:
    <select-seach
      v-model='selectSeachData'
      httpUrl='/list/search/user'
      httpMethod='get'
      dataLabel='name'
      dataValue='id'
      dataSource='list'
      placeholder='搜索xxx'
      :listDataOptionStatic='listDataOptionStatic'
    />
  待优化问题：
    1，如果使用穿透,会造成查询时无法根据id自动在查询一次

  filterable
  remote
  :remote-method="remoteMethod"搜索远程的方法
  :loading="loadingloading="loading"是否正在远程搜索
  @change="change"当选择时
  传搜索内容出去,传得到的数据体进来===================还没有封装完成
  :placeholder="placeholder"
  :disabled='isDisabled'
  v-bind="$props"
  :loading="loading"
--> 
<template>
  <el-select v-model="seachData"
             filterable
             clearable
             :multiple='isMultiple'
             remote
             :loading="loading"
             loading-text='请搜索'
             :placeholder='placeholder'
             :disabled='isDisabled'
             :remote-method="remoteQuery"
             @clear='clearHandle'
             @change='selectChange'
             @visible-change='selectvisibleChange'>
    <el-option v-for="(item, index) in listDataOption"
               :key="item[dataValue]"
               :label="item[dataLabel]"
               :value="item[dataValue]"
               :disabled="bUsedHander(item)">
      <span style="float: left" v-if="showName">{{ item[dataLabel] }}</span>
      <span style="float: right;  font-size: 14px;margin-left:20px" v-if="showName">{{ item[dataLabelRight] }}</span>
    </el-option>
    <i class="el-icon-search el-input__icon"
       slot="prefix"
       v-if="showIcon"></i>
  </el-select>
</template>
<script>
// import { Select } from 'element-ui';  //用于继承Select组件信息

export default {
  name: 'select-seach',
  props: {
    // ...Select.props, // 这里继承内在组件的props

    // 接受外部v-model传入的值// 选择后的数据
    value: { default: '' },
    // event: 'change',
    // 请求的地址
    httpUrl: { default: '' },
    // 请求方式
    httpMethod: { default: 'get' },
    // 发送请求的数据key
    requestParamsKey: { default: 'name' },
    // 自定义模板
    showName: { default: false },
    // 发送请求的数据体
    requestParams: {
      type: Object,
      default: function () {
        return {}
      }
    },
    // 得到数据后拿到的数据体名
    dataSource: { default: 'list' },
    // 是否正在远程搜索
    // loading: { default: false },
    // 数据体
    listDataOptionStatic: {
      default: ''
      // type: Array
    },
    // 得到数据后的key
    dataValue: { default: 'id' },
    // 得到数据后的name
    dataLabel: { default: 'name' },
    // label右边文字
    dataLabelRight: { default: 'name' },
    // 提示文字
    placeholder: { default: '可搜索' },
    // 是否禁用
    isDisabled: { default: false },
    // 是否要触发,防止我不需要触发方法的时候还要在父组件写监听
    isSelectChange: { default: false },
    // 是否支持多选
    isMultiple: { default: false },
    // 是否显示搜索图标
    showIcon: { default: false },
    // 判断是否选择禁用
    canSelectDisabled: { default: false }
  },
  data () {
    return {
      seachData: '',
      listDataOption: [],
      isSelectVisible: false,
      loading: false
    }
  },
  methods: {
    // 输入时请求
    remoteQuery (queryString) {
      if (!queryString) {
        return
      }
      let queryCondition = {}
      this.$set(queryCondition, this.requestParamsKey, queryString.toString().trim())
      if (this.requestParams) {
        queryCondition = Object.assign({}, queryCondition, this.requestParams)
      }
      this.loading = true
      clearTimeout(this.timeout)
      this.timeout = setTimeout(() => {
        this.$http({
          url: this.$http.adornUrl(this.httpUrl),
          method: this.httpMethod,
          params: this.$http.adornParams(queryCondition, false)
        }).then(({ data }) => {
          if (data && data.code === 0) {
            this.loading = false
            this.listDataOption = data[this.dataSource]
            // this.listDataOption = eval('data.' + this.dataSource)
            // 会导致触发两次
            if (this.isSelectChange) {
              this.selectChangecopy(queryString)
              // this.selectChange(queryString)
            }
          }
        })
      }, 500 * Math.random())
    },
    selectChange (value) {
      this.$nextTick(() => {
        if (this.isSelectVisible) {
          for (let item of this.listDataOption) {
            if (item[this.dataValue] === value) {
              this.$emit('selectChange', item)
            }
          }
        }
      })
    },
    selectChangecopy (value) {
      this.$nextTick(() => {
        if (this.isSelectChange) {
          for (let item of this.listDataOption) {
            if (item[this.dataValue] === value) {
              this.$emit('selectChange', item)
            }
          }
        }
      })
    },
    // 可清空的单选模式下用户点击清空按钮时触发
    clearHandle () {
      this.$emit('clearHandle')
    },
    selectvisibleChange (val) {
      this.isSelectVisible = true
    },
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
        this.seachData = this.value
        var finded = false

        if (this.value) {
          for (const item of this.listDataOption) {
            if (item[this.dataValue] === this.value) {
              finded = true
              break
            }
          }

          if (!finded) {
            this.$nextTick(() => {
              if (this.isMultiple === true) {
                this.remoteQuery(this.value.join(','))
              } else {
                this.remoteQuery(this.value)
              }
            })
          }
        }

        this.seachData = this.value
        this.$emit('change', this.seachData)
      },
      deep: true,
      immediate: true
    },

    seachData: {
      handler (val, oldVal) {
        this.$emit('input', this.seachData)
      },
      deep: true,
      immediate: true
    },

    listDataOptionStatic: {
      handler (val, oldVal) {
        this.listDataOption = this.listDataOptionStatic
      },
      deep: true
    }
  }

}
</script>
