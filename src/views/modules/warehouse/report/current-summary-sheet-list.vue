 <!-- 实时库存汇总表 -->
<template>
  <div>
    <el-form :inline="true"
             :model="dataForm"
             @keyup.enter.native="getDataList()">
      <el-row>
        <erp-search-panel v-model="searchData"
                          :searchOptions="searchOptions"
                          @search="getDataList(1)" />
      </el-row>
      <el-row>
        <el-button v-if="isAuth('pur:whinventory:collectexport')"
                   type="primary"
                   @click="exportHandle()"><i class="iconfont erp-icon-daochu"></i>导出</el-button>
      </el-row>
    </el-form>
    <el-table :data="dataList"
              max-height="800"
              stripe
              border
              highlight-current-row
              v-loading="dataListLoading"
              show-summary
              :summary-method="getSummaries">
      <el-table-column prop="prodCode"
                       sortable
                       width="160"
                       label="产品编码"></el-table-column>
      <el-table-column prop="imageUrl"
                       width="120"
                       label="产品图片">
        <template slot-scope="scope">
          <tableImg :imageUrl='scope.row.imageUrl'></tableImg>
        </template>
      </el-table-column>
      <el-table-column prop="prodName"
                       label="产品名称"></el-table-column>
      <el-table-column prop="specifications"
                       label="规格型号"></el-table-column>
      <el-table-column prop="warehouseName"
                       width="150"
                       label="仓库"></el-table-column>
      <el-table-column prop="RECEIVED"
                       sortable
                       width="100"
                       label="待检库存"></el-table-column>
      <el-table-column prop="AVALIBLE"
                       sortable
                       width="100"
                       label="可用库存"></el-table-column>
      <el-table-column prop="INTRANSIT"
                       sortable
                       width="100"
                       label="在途库存"></el-table-column>
      <el-table-column prop="INFERIOR"
                       sortable
                       width="100"
                       label="次品库存"></el-table-column>
      <el-table-column prop="FROZEN"
                       sortable
                       width="100"
                       label="冻结库存"></el-table-column>
      <el-table-column prop="WASTE"
                       sortable
                       width="100"
                       label="废品库存"></el-table-column>
      <el-table-column prop="SUMQTY"
                       sortable
                       width="100"
                       label="库存合计"></el-table-column>
      <el-table-column prop="compName"
                       width="210"
                       label="库存公司"></el-table-column>
    </el-table>
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
// 引入图片
import tableImg from '@/components/list-table/table-img'
export default {
  mixins: [initData],
  components: {
    erpSearchPanel,
    paginationAll,
    tableImg
  },
  data () {
    return {
      // 数据过滤器
      searchData: {},
      // 下拉
      searchOptions: [
        {
          label: '仓库',
          value: 'warehouseId',
          inputType: 'el-select',

          httpUrl: 'list/combobox/warehouse',
          dataSource: 'list',
          title: 'warehouseIdList',
          dataValue: 'id',
          dataLabel: 'name',
          placeholder: '仓库'
        },
        {
          label: '产品编码',
          value: 'code',
          inputType: 'el-input'
        },
        {
          label: '产品名称',
          value: 'prodName',
          inputType: 'el-input'
        },
        {
          label: '库存公司',
          value: 'compId',
          inputType: 'el-select',

          httpUrl: 'sys/organization/select',
          dataSource: 'companyList',
          title: 'compIdList',
          dataValue: 'orgId',
          dataLabel: 'name',
          placeholder: '库存公司'
        }
      ],
      dataList: [],
      dataForm: {},
      dataListLoading: false,
      dataListSelections: []
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
        url: this.$http.adornUrl('pur/whinventory/collectList'),
        method: 'get',
        params: Object.assign(
          {},
          this.paginationData,
          this.searchData === undefined ? {} : this.searchData
        )
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
          if (
            column.property === 'RECEIVED' ||
            column.property === 'AVALIBLE' ||
            column.property === 'INTRANSIT' ||
            column.property === 'INFERIOR' ||
            column.property === 'FROZEN' ||
            column.property === 'WASTE' ||
            column.property === 'SUMQTY'
          ) {
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
    // 库存导出
    exportHandle (url) {
      window.open(
        this.$http.tokens('pur/whinventory/collectexport', this.searchData)
      )
    }
  }
}
</script>
