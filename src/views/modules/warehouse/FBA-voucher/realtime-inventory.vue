<template>
  <div>
    <el-row @keyup.enter.native="getDataList()">
      <erp-search-panel v-model="searchData"
                        :searchOptions="searchOptions"
                        @search="getDataList(1)"
                        :isResetHandle="true"
                        @resetHandle="resetHandle()"></erp-search-panel>
    </el-row>
    <el-table :data="dataList"
              stripe
              border
              highlight-current-row
              v-loading="dataListLoading"
              show-summary
              :summary-method="getSummaries"
              @select="selectionChangeHandle">
      <el-table-column label="店铺"
                       width="180"
                       prop="channelName"></el-table-column>
      <el-table-column label="产品编码"
                       width="140"
                       prop="prodCode"></el-table-column>
      <el-table-column label="产品名称"
                       prop="prodName"></el-table-column>
      <el-table-column label="仓库"
                       prop="warehousName"></el-table-column>
      <el-table-column label="待检库存数"
                       prop="receiveQty"
                       width="110"
                       sortable></el-table-column>
      <el-table-column label="可用库存数"
                       prop="availableQty"
                       width="110"
                       sortable></el-table-column>
      <el-table-column label="在途库存数"
                       prop="onPassageQty"
                       width="110"
                       sortable></el-table-column>
      <el-table-column label="次品库存数"
                       prop="defectiveQty"
                       width="110"
                       sortable></el-table-column>
      <el-table-column label="废品库存数"
                       prop="wasteQty"
                       width="110"
                       sortable></el-table-column>
      <el-table-column label="冻结库存数"
                       prop="frozenQty"
                       width="110"
                       sortable></el-table-column>
      <el-table-column label="库存合计"
                       prop="sumQty"
                       width="100"
                       sortable></el-table-column>
      <el-table-column label="库存公司"
                       width="200"
                       prop="compName"></el-table-column>
    </el-table>
    <!-- 分页 -->
    <el-row>
      <pagination-all v-model="paginationData"
                      @paginationChangeHandle="getDataList"></pagination-all>
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
  mixins: [initData],
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
        label: '仓库',
        value: 'warehouseId',
        inputType: 'el-select',
        httpUrl: 'list/combobox/fbawarehouse?type=FBA',
        dataSource: 'list',
        title: 'warehouseIdList',
        dataValue: 'id',
        dataLabel: 'name',
        placeholder: '仓库'
      }, {
        label: '产品编码',
        value: 'prodCode',
        inputType: 'el-input'
      }, {
        label: '产品名称',
        value: 'prodName',
        inputType: 'el-input'
      }, {
        label: '店铺',
        value: 'channelId',
        inputType: 'el-select',
        httpUrl: 'list/combobox/ownChannel',
        dataSource: 'list',
        title: 'channelIdList',
        dataValue: 'id',
        dataLabel: 'name',
        placeholder: '店铺'
      }],
      dataForm: {},
      dataList: [],

      dataListLoading: false,
      dataListSelections: []
    }
  },

  created () {
    this.getDataList()
  },
  methods: {
    // 获取数据列表
    getDataList (val, dateVal) {
      if (val) {
        this.paginationData.currPage = val
      }
      this.dataListLoading = true
      this.$http({
        url: this.$http.adornUrl('pur/whinventory/fbalist'),
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

    // 多选
    selectionChangeHandle (val) {
      this.dataListSelections = val
    },

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
          if (column.property === 'receiveQty' ||
            column.property === 'availableQty' ||
            column.property === 'onPassageQty' ||
            column.property === 'defectiveQty' ||
            column.property === 'frozenQty' || column.property === 'wasteQty' ||
            column.property === 'sumQty') {
            sums[index] += ''
          } else {
            sums[index] = ''
          }
        } else {
          sums[index] = ''
        }
      })
      return sums
    },
    // 过滤条件
    resetHandle () {
      this.expectDate = ''
    }
  }
}
</script>
