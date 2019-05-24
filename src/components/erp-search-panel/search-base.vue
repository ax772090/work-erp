<template>
  <span>
    <!-- 可搜素的下拉列表 -->
    <el-select v-model="selectedOption"
               placeholder="请选择搜索类型"
               class="select-panel">
      <el-option v-for="item in searchOptions"
                 :key="item.value"
                 :label="item.label"
                 :value="item.value"> </el-option>
    </el-select>

    <!-- 下拉级联（目前还有问题） -->
    <select-cascader v-for="(item,index) in searchOptions"
                     :key="index"
                     v-if="(item.value === selectedOption) && (item.inputType==='el-cascader')"
                     v-model="dataCascader"
                     :dataList='item.dataList'
                     :httpUrl='item.httpUrl'
                     :requestParams='item.requestParams'
                     :dataSource='item.dataSource'
                     :title='item.title'
                     :dataValue='item.dataValue'
                     :dataLabel='item.dataLabel'
                     :dataChildren='item.dataChildren'
                     :canSelectDisabled='true'
                     @listData='listDataHandle'>
    </select-cascader>

    <!-- 模糊查找 -->
    <el-input v-for="(item,index) in searchOptions"
              :key="index"
              v-if="(item.value === selectedOption) && (item.inputType==='el-input')"
              v-model.trim="searchData[selectedOption]"
              clearable
              :placeHolder="'输入'+item.label">
      <i slot="suffix"
         class="iconfont el-input__icon el-icon-erp-sousuo1"></i>
    </el-input>

    <!--下拉表方式-->
    <erp-select v-for="(item,index) in searchOptions"
                :key="index"
                v-if="(item.value === selectedOption) && (item.inputType==='el-select')"
                v-model="searchData[selectedOption]"
                :dataList='item.dataList'
                :httpUrl='item.httpUrl'
                :requestParams='item.requestParams'
                :dataSource='item.dataSource'
                :title='item.title'
                :dataValue='item.dataValue'
                :dataLabel='item.dataLabel'
                :canSelectDisabled='true'
                clearable
                :placeholder="'输入'+item.label">
      <i slot="suffix"
         class="iconfont el-input__icon el-icon-erp-sousuo1"></i>
    </erp-select>

    <!-- 远程查询方式 -->
    <select-seach v-for="(item,index) in searchOptions"
                  :key="index"
                  v-if="(item.value === selectedOption) && (item.inputType==='el-select-remote')"
                  v-model="searchData[selectedOption]"
                  :listDataOptionStatic='[]'
                  :httpUrl='item.httpUrl'
                  :httpMethod='item.httpMethod'
                  :requestParams='item.requestParams'
                  :requestParamsKey='item.queryKey'
                  :dataSource='item.dataSource'
                  :title='item.title'
                  :dataValue='item.dataValue'
                  :dataLabel='item.dataLabel'
                  :canSelectDisabled='true'
                  :showName='item.showName || false'
                  :dataLabelRight="item.dataLabelRight || 'name'"
                  :placeholder="'输入'+item.label">
      <i slot="suffix"
         class="iconfont el-input__icon el-icon-erp-sousuo1"></i>
    </select-seach>

    <!-- 远程查询方式, 显示两个参数 -->
    <!-- 
    <select-seach v-model="dataForm.prodId"
                  httpUrl="/prod/prodbasic/queryForComplete"
                  httpMethod="get"
                  requestParamsKey="code"
                  data-label="code"
                  data-value="id"
                  data-label-right='name_ch'
                  placeholder="请输入产品编码/产品名称"
                  data-source="list"
                  :showName='true'
                  isSelectChange="true"
                  @selectChange="codeValue"></select-seach> -->

    <select-seach v-for="(item,index) in searchOptions"
                  :key="index"
                  v-if="(item.value === selectedOption) && (item.inputType==='el-select-remote-slot')"
                  v-model="searchData[selectedOption]"
                  :listDataOptionStatic='[]'
                  :httpUrl='item.httpUrl'
                  :httpMethod='item.httpMethod'
                  :requestParams='item.requestParams'
                  :requestParamsKey='item.queryKey'
                  :dataSource='item.dataSource'
                  :title='item.title'
                  :dataValue='item.dataValue'
                  :dataLabel='item.dataLabel'
                  :canSelectDisabled='true'
                  :placeholder="'输入'+item.label"
                  :showName='true'
                  :dataLabelRight='item.dataLabelRight'>
      <i slot="suffix"
         class="iconfont el-input__icon el-icon-erp-sousuo1"></i>
    </select-seach>

    <!-- 日期时间范围方式[数组] -->
    <el-date-picker v-for="(item,index) in searchOptions"
                    :key="index"
                    v-if="(item.value === selectedOption) && (['el-daterangeArr','el-datetimerangeArr'].indexOf(item.inputType)>-1)"
                    v-model="searchData[selectedOption]"
                    align="right"
                    :type="item.inputType.replace('el-','').replace('Arr','')"
                    :value-format="item.inputType.indexOf('time')>-1?'yyyy-MM-dd HH:mm:ss':'yyyy-MM-dd'"
                    range-separator="至"
                    :start-placeholder="item.inputType.indexOf('time')>-1?'开始时间':'开始日期'"
                    :end-placeholder="item.inputType.indexOf('time')>-1?'结束时间':'结束日期'"
                    :placeholder="'输入'+item.label">
    </el-date-picker>

    <!-- 日期时间范围方式 -->
    <!-- :picker-options="pickerOptions1" 已去除 -->
    <el-date-picker v-for="(item,index) in searchOptions"
                    :key="index"
                    v-if="(item.value === selectedOption) && (['el-daterange','el-datetimerange','el-monthrange'].indexOf(item.inputType)>-1)"
                    v-model="dateArr"
                    align="right"
                    :type="item.inputType.replace('el-','').replace('Arr','')"
                    :value-format="item.inputType.indexOf('time')>-1?'yyyy-MM-dd HH:mm:ss':item.inputType.indexOf('month')>-1?'yyyy-MM':'yyyy-MM-dd'"
                    range-separator="至"
                    :start-placeholder="item.inputType.indexOf('time')>-1?'开始时间':'开始日期'"
                    :end-placeholder="item.inputType.indexOf('time')>-1?'结束时间':'结束日期'"
                    :placeholder="'输入'+item.label">
    </el-date-picker>

    <!-- 日期时间 -->
    <el-date-picker v-for="(item,index) in searchOptions"
                    :key="index"
                    v-if="(item.value === selectedOption) && (['el-datetime','el-date'].indexOf(item.inputType)>-1)"
                    v-model="searchData[selectedOption]"
                    align="right"
                    :type="item.inputType.replace('el-','')"
                    :picker-options="pickerOptions1"
                    :value-format="item.inputType.indexOf('time')>-1?'yyyy-MM-dd HH:mm:ss':'yyyy-MM-dd'"
                    range-separator="至"
                    :start-placeholder="item.inputType.indexOf('time')>-1?'开始时间':'开始日期'"
                    :end-placeholder="item.inputType.indexOf('time')>-1?'结束时间':'结束日期'"
                    :placeholder="'输入'+item.label">
    </el-date-picker>

    <el-button v-if="isExtension===false"
               type="primary"
               @click="searchHandel()"><i class="iconfont erp-icon-sousuo"></i>搜索</el-button>
    <el-button v-if="isExtension===false"
               type="primary"
               @click="resetHandel()"><i class="iconfont erp-icon-chongzhi"></i>重置</el-button>

    <!-- 添加条件 -->
    <div style="display:inline-block"
         v-if="isExtension===false">
      <el-dropdown @command="addCondition">
        <span class="el-dropdown-link">
          <i class="el-icon-circle-plus-outline"></i>添加查询条件
          <i class="el-icon-arrow-down el-icon--right"></i>
        </span>
        <el-dropdown-menu slot="dropdown">
          <el-dropdown-item v-for="item in searchOptions"
                            :key="item.value"
                            :command="item.value">{{item.label}}</el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
    </div>
  </span>
</template>

<script>
import ErpSelect from '@/components/erp-select'
import selectSeach from '@/components/erp-select/select-seach'
import selectCascader from '@/components/erp-select/select-cascader'
import { getUUID } from '@/utils'

export default {
  name: 'erp-search-panel',

  components: {
    ErpSelect,
    selectSeach,
    selectCascader
  },

  // model: {
  //   prop: 'value',
  //   event: 'change'
  // },

  props: {
    // 查询选项
    searchOptions: {
      type: Array,
      default: []
    },

    // 默认查询条件名
    conditionName: { default: '' },
    value: { type: [String, Array, Object], default: '' },    // 接受外部v-model传入的值

    // 查询条件参数
    // searchData: {
    //   type: [String, Array, Object],
    //   default: ''
    // },    // 接受外部v-model传入的值

    isExtension: { default: true }
  },

  data () {
    return {
      listData: [], // 级联树形数据
      conditionList: [],  // 传给父组件的搜索条件
      selectedOption: this.conditionName,
      dateValueRange: [],  // 日期数组
      cascaderValue: [], // 级联数组
      searchData: this.value,
      pickerOptions1: {
        // Modified by Quyuzhong 2018-11-17 去除禁用选择未来日期选项，防止部分业务不适应
        // disabledDate(time) {
        //   return time.getTime() > Date.now();
        // },
        shortcuts: [{
          text: '今天',
          onClick (picker) {
            picker.$emit('pick', new Date())
          }
        }, {
          text: '昨天',
          onClick (picker) {
            const date = new Date()
            date.setTime(date.getTime() - 3600 * 1000 * 24)
            picker.$emit('pick', date)
          }
        }, {
          text: '一周前',
          onClick (picker) {
            const date = new Date()
            date.setTime(date.getTime() - 3600 * 1000 * 24 * 7)
            picker.$emit('pick', date)
          }
        }]
      }
    }
  },

  mounted () {
  },

  computed: {
    /**
     * 日期(数组)
     */
    dateArr: {
      get () {
        for (const item of this.searchOptions) {
          if (item.value !== this.selectedOption) {
            continue
          }
          // 日期范围处理办法
          if (item.inputType.indexOf('range') > -1) {
            this.dateValueRange = []
            var fieldNames = item.value.split(',')

            for (const fieldName of fieldNames) {
              if (this.searchData[fieldName]) {
                this.dateValueRange.push(this.searchData[fieldName])
              }
            }

            return this.dateValueRange
          }
        }
        return null
      },
      set (val) {
        this.dateValueRange = val
        for (const item of this.searchOptions) {
          if (item.value !== this.selectedOption) {
            continue
          }

          // //级联查询处理办法
          if (item.inputType === 'el-cascader') {
            this.searchData[this.selectedOption] = val[val.length - 1]
          }

          // 日期范围处理办法
          if (item.inputType.indexOf('range') > -1) {
            let fieldNames = this.selectedOption.split(',')
            for (let index = 0; index < fieldNames.length; index++) {
              if (!val) {
                delete this.searchData[fieldNames[index]]
              } else if (val[index]) {
                this.searchData[fieldNames[index]] = val[index]
              }
            }
          }
        }
      }

    },

    /**
     * 级联下拉数据
     */
    dataCascader: {
      get () {
        let _self = this
        for (const item of this.searchOptions) {
          if (item.value !== this.selectedOption) {
            continue
          }
          // 级联查询处理办法
          if (item.inputType === 'el-cascader' && _self.searchData[item.value]) {
            this.cascaderHandle(this.listData, _self.searchData[item.value], this.childrenName)
            // for (const item1 of this.listData) {
            //   if (item1.levelPath === _self.searchData[item.value]) {
            //     this.cascaderValue.push(item1.levelPath)
            //     break
            //   } else if (item1[this.childrenName]) {
            //     for (const item2 of item1[this.childrenName]) {
            //       if (item2[this.valId] === _self.searchData[item.value]) {
            //         this.cascaderValue = item2.levelPath.split('.')
            //         break
            //       }
            //     }
            //   }
            // }
            return this.cascaderValue
          }
        }
        // important!
        return []
      },
      set (val) {
        for (const item of this.searchOptions) {
          if (item.value !== this.selectedOption) {
            continue
          }

          // 级联查询处理办法
          if (item.inputType === 'el-cascader') {
            console.log('val1：', val[val.length - 1])
            this.searchData[this.selectedOption] = val[val.length - 1]
            // this.searchData[this.selectedOption] = val
          }
        }
      }

    }
  },

  methods: {
    cascaderHandle (arr, val, childrenName) {
      if (!arr || !Array.isArray(arr)) return []
      for (const item of arr) {
        if (item.levelPath === val) {
          this.cascaderValue = []
          this.cascaderValue.push(item.levelPath)
          break
        } else if (Array.isArray(item[childrenName])) {
          this.cascaderHandle(item[childrenName], val, childrenName)
        }
      }
    },
    /**
  * 添加查询条件传给父组件
  */
    addCondition (command) {
      this.$emit('childConditionList', command)
    },

    listDataHandle (list, val, children) {
      this.listData = list
      this.valId = val
      this.childrenName = children
    },
    /**
     * 搜索查询
     */
    searchHandel () {
      this.$emit('search', 1)
    },

    /**
     * 重置查询条件
     */
    resetHandel () {
      this.$emit('reset')
    }
  },

  watch: {
    /**
     * 监听选择条件的变化
     */
    selectedOption: {
      handler (val, oldVal) {
        if (!oldVal) {
          return
        }
        let fieldNames = oldVal.split(',')
        for (const fieldName of fieldNames) {
          delete this.searchData[fieldName]
        }
      },
      deep: true
    },

    /**
     * 监听父组件传值给当前子组件的值
     */
    value: {
      handler (val, oldVal) {
        this.searchData = this.value
        this.$emit('change', this.searchData)
      },
      deep: true
    },

    /**
     * 监听当前子组件传值给父组的值
     */
    searchData: {
      handler (val, oldVal) {
        // 父级的v-model 默认可以接收该事件,实现将值传递给父级
        this.$emit('input', val)
      },
      deep: true
    },
    dataCascader: {
      handler (newVal, oldVal) {
        // 父级的v-model 默认可以接收该事件,实现将值传递给父级
        // this.$emit('input', val)
      },
      deep: true
    }
  }
}
</script>
<style scoped>
.select-panel {
  max-width: 130px;
}
</style>
