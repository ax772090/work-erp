
 <!-- 店铺sku可调拨库存一览表 -->
<template>
  <div>

    <el-row @keyup.enter.native="getDataList()">
      <erp-search-panel v-model="searchData"
                        :searchOptions="searchOptions"
                        @search="getDataList(1)" />
    </el-row>
    <el-table :data="dataList"
              stripe
              border
              highlight-current-row
              max-height="800"
              v-loading="dataListLoading">
      <el-table-column prop="displayName"
                       width="150"
                       label="站点/市场"></el-table-column>
      <el-table-column prop="platfromValue"
                       width="120"
                       label="平台名称"></el-table-column>
      <el-table-column prop="prodCode"
                       sortable
                       width="150"
                       label="系统产品编码"></el-table-column>
      <el-table-column prop="prodName"
                       label="系统产品名称"></el-table-column>
      <el-table-column prop="specifications"
                       label="规格型号"></el-table-column>
      <el-table-column prop="sumStockQty"
                       sortable
                       width="120"
                       label="累计备货数量"></el-table-column>
      <el-table-column prop="sumNeedQty"
                       sortable
                       width="120"
                       label="累计要货数量"></el-table-column>
      <el-table-column prop="prdNeedQty"
                       sortable
                       width="120"
                       label="预备要货数量"></el-table-column>
      <el-table-column prop="curNeedQty"
                       sortable
                       width="120"
                       label="当前可要货数"></el-table-column>
      <el-table-column prop="curTransQty"
                       sortable
                       width="120"
                       label="当前可调拨数"></el-table-column>
      <el-table-column prop="sumTransQty"
                       sortable
                       width="140"
                       label="累计已调拨出数"></el-table-column>
      <el-table-column prop="availableQty"
                       sortable
                       width="120"
                       label="当前可用数"></el-table-column>
    </el-table>
    <el-row>
      <pagination-all v-model="paginationData"
                      @paginationChangeHandle='getDataList'></pagination-all>
    </el-row>
  </div>
</template>
<script>
// 搜索
import erpSearchPanel from '@/components/erp-search-panel'
// 分页
import paginationAll from '@/components/erp-pagination/pagination-all'
import { initData } from '@/mixins/initData.js'
export default {
  mixins: [
    initData
  ],
  components: {
    erpSearchPanel,
    paginationAll
  },
  data () {
    return {
      // 数据过滤器
      searchData: {},
      // 下拉
      searchOptions: [{
        label: '平台',
        value: 'platform',
        inputType: 'el-select',

        httpUrl: 'basicData/queryDataDict2List',
        requestParams: { dataDictKey: 'PLANTFORM_TYPE' },
        dataSource: 'fontMaps',
        title: 'platformList',
        dataValue: 'key',
        dataLabel: 'value',
        placeholder: '平台'
      }, {
        label: '产品名称',
        value: 'prodName',
        inputType: 'el-input'
      }, {
        label: '站点/市场',
        value: 'market',
        inputType: 'el-select',

        httpUrl: 'mwsData/mwsAuthorize',
        dataSource: 'mwsAuthorize',
        title: 'marketList',
        dataValue: 'id',
        dataLabel: 'displayName',
        placeholder: '站点/市场'
      }, {
        label: '系统产品编码',
        value: 'code',
        inputType: 'el-input'
      }],

      dataList: [],

      dataListLoading: false
    }
  },

  created () {
    this.getDataList()
  },
  methods: {
    // 获取数据列表
    getDataList (val) {
      if (val) {
        this.paginationData.currPage = val
      }
      this.dataListLoading = true
      this.$http({
        url: this.$http.adornUrl('warehouse/whskutrans/list'),
        method: 'get',
        params: Object.assign({}, this.paginationData, this.searchData === undefined ? {} : this.searchData)
      }).then(({ data }) => {
        if (data && data.code === 0) {
          this.dataList = data.pageList.dataList
          this.paginationData.totalCount = data.pageList.page.totalCount
        } else {
          this.dataList = []
          this.paginationData.totalCount = 0
        }
        this.dataListLoading = false
      })
    },

    // 合计
    getSummaries (param) {
      const { columns, data } = param
      const sums = []
      columns.forEach((column, index) => {
        if (index === 0) {
          sums[index] = '合计'
          return
        }
        const values = data.map(item => Number(item[column.property]))
        if (!values.every(value => isNaN(value))) {
          sums[index] = values.reduce((prev, curr) => {
            const value = Number(curr)
            if (!isNaN(value)) {
              return prev + curr
            } else {
              return prev
            }
          }, 0)
          if (column.property === 'qty') {
            sums[index] += ''
            // this.dataForm.subtotalAmount = sums[index]
          } else {
            sums[index] = ''
          }
        } else {
          sums[index] = ''
        }
      })
      return sums
    },
    // 库存导入
    warehouseImport () { }
  }
}
</script>