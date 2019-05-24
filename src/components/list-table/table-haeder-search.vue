<template>
  <div class="table-header-search">
    <popoverAll buttomType="text"
                :buttomName="itemData.label"
                buttomClass=""
                class="popoverall">
      <template slot="content">
        <el-row>
          <el-input v-if="itemData.inputType === 'el-input'"
                    type="text"
                    v-model="headerSearch[keyValue]"
                    @blur="blurcs()"
                    v-bind="$attrs" />
          <selectAll v-if="itemData.inputType === 'el-select'"
                     v-model="headerSearch[keyValue]"
                     :listDataOption='listDataOption'
                     :dataValue='itemData.dataValue'
                     :dataLabel='itemData.dataLabel'
                     :placeholder="itemData.label"
                     v-bind="$attrs"></selectAll>
          <select-seach v-if="itemData.inputType === 'el-select-remote'"
                        v-model='headerSearch[keyValue]'
                        :httpUrl='itemData.httpUrl'
                        httpMethod='get'
                        :dataLabel='itemData.dataLabel'
                        :dataValue='itemData.dataValue'
                        :dataSource='itemData.dataSource'
                        :placeholder='itemData.placeholder' />
          <!-- :listDataOptionStatic='listDataOptionStatic' -->
          <!-- <popoverAll v-if="inputType === 'popoverTable'"
                buttomType="text"
                :buttomName="buttomName"
                buttomClass=""
                class="popoverall">
      <template slot="content">
        <el-table :data="[{date: '123', name: '456', address: '789'}]">
          <el-table-column width="150"
                           property="date"
                           label="日期"></el-table-column>
          <el-table-column width="100"
                           property="name"
                           label="姓名"></el-table-column>
          <el-table-column width="300"
                           property="address"
                           label="地址"></el-table-column>
        </el-table>
      </template>
    </popoverAll> -->
        </el-row>
        <el-button type="success"
                   @click="handerFiltra">过滤</el-button>
        <el-button type="info"
                   @click="handerReset">重置</el-button>
      </template>
    </popoverAll>
  </div>
</template>

<script>
import selectAll from '@/components/erp-select/select-all'
import selectSeach from '@/components/erp-select/select-seach'
import popoverAll from '@/components/erp-popover/popover-all'
import checkboxAll from '@/components/erp-checkbox/checkbox-all'
export default {
  components: {
    selectAll,
    selectSeach,
    popoverAll,
    checkboxAll
  },
  inheritAttrs: false,
  props: {
    value: {
      default: ''
    },

    // 高级搜索的数据体
    searchOptions: {
      required: true,
      type: Array,
      default: function () {
        return []
      }
    },

    // 为了解决for和if不在一块使用问题
    keyValue: {
      required: true,
      type: String
    },

    // 数据体:当下拉搜索的时候,必须的
    // listDataOption: {
    //   default: function () {
    //     return []
    //   }
    // },

    // 当popoverTable时需要传入一个图片前加入文字
    buttomName: {
      default: ''
    }
  },

  data () {
    return {
      headerSearch: {},
      // 过滤出来当前一条数据
      itemData: {},
      // 选择两个以上,不断累加过滤条件
      headerSearchList: {},
      // 当前组件请求到的数据
      listDataOption: []
    }
  },
  // computed: {
  //   headerSearch: {
  //     get: function () {
  //       return this.headerSearch[this.keyValue]
  //     },
  //     set: function(){
  //       this.$set(this.headerSearch, this.keyValue)
  //     }
  //   }
  // },
  methods: {
    blurcs () {
    },
    // 搜索
    handerFiltra () {
      this.$emit('handerFiltra')
    },
    // 重置
    handerReset () {
      if (this.headerSearch[this.keyValue] || this.headerSearch[this.keyValue] === '') {
        delete this.headerSearch[this.keyValue]
      }
    },
    // 当前行数据的进一步操作
    handerElement (element) {
      if (element.inputType === 'el-input') {

      }
      if (element.inputType === 'el-select') {
        this.$http({
          url: this.$http.adornUrl(element.httpUrl),
          method: 'get',
          params: element.requestParams ? element.requestParams : {}
        }).then(({ data }) => {
          if (data && data.code === 0) {
            this.listDataOption = data[element.dataSource]
          }
        })

        // this.$http.get(this.$http.adornUrl(element.httpUrl))
        //   .then(({ data }) => {
        //     if (data && data.code === 0) {
        //       this.listDataOption = data[element.dataSource]
        //     }
        //   })
      }
      if (element.inputType === 'el-select-remote') {

      }
      if (element.inputType === 'el-input') {

      }
    }
  },
  watch: {
    value: {
      handler (val, oldVal) {
        this.headerSearch = this.value
      },
      deep: true
    },

    headerSearch: {
      handler (val, oldVal) {
        // if (this.headerSearch) {
        //   this.headerSearchList = {}
        //   this.headerSearchList = Object.assign({}, this.headerSearch, this.headerSearchList)
        // }
        this.$emit('input', val)
      },
      deep: true
    },
    // 选出当前数据
    searchOptions: {
      handler (val, oldVal) {
        for (const element of val) {
          if (element.value === this.keyValue) {
            this.itemData = element
            this.handerElement(element)
          }
        }
      },
      deep: true,
      immediate: true
    }
  }
}
</script>

<style lang="sass">
.table-header-search
  .el-input
    >input
      padding: 0px
      border: 1px solid rgb(228, 228, 228)
      background-color: rgb(228, 228, 228)
      &::-webkit-input-placeholder
        color: #aab2bd
        font-size: 12px
        font-weight: 700
        font-size: 14px
      &::-webkit-input-placeholder /* WebKit, Blink, Edge */
        color: #000
      &:-moz-placeholder /* Mozilla Firefox 4 to 18 */
        color: #000
      &::-moz-placeholder /* Mozilla Firefox 19+ */
        color: #000
      &:-ms-input-placeholder /* Internet Explorer 10-11 */
        color: #000
  >.popoverall
    button
      color: #000
      font-size: 14px
      font-weight: 700
    .iconfont
      color: #c0c4cc

</style>
