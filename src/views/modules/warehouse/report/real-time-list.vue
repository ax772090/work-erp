 <!-- 实时库存查看 -->
<template>
  <div>
    <el-form :inline="true"
             :model="dataForm"
             @keyup.enter.native="getDataList()">
      <el-row>
        <erp-search-panel v-model="searchData"
                          :searchOptions="searchOptions"
                          @search="getDataList(1)"
                          :isResetHandle="true"
                          @resetHandle="resetHandle()" />
      </el-row>
      <el-row>
        库存状态:
        <el-radio-group :radioListData='inventoryStatusList'
                        v-model="inventoryStatusValue"
                        @change="inventoryStatus"></el-radio-group>

        <el-button v-if="isAuth('pur:whinventory:export')"
                   type="primary"
                   class="grid-content-right"
                   @click="exportFile()"><i class="iconfont erp-icon-daochu"></i>导出</el-button>
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
                       width="160"
                       sortable
                       label="产品编码"></el-table-column>
      <el-table-column prop="imageUrl"
                       width="150"
                       label="产品图片">
        <template slot-scope="scope">
          <tableImg :imageUrl='scope.row.imageUrl'></tableImg>
        </template>
      </el-table-column>
      <el-table-column prop="prodName"
                       label="产品名称"></el-table-column>
      <el-table-column prop="warehouseName"
                       width="180"
                       label="仓库"></el-table-column>
      <el-table-column prop="qty"
                       sortable
                       width="150"
                       label="库存数量"></el-table-column>
      <el-table-column prop="statusName"
                       width="150"
                       label="库存状态"></el-table-column>
      <el-table-column prop="compName"
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
// 引入radio组件
import elRadioGroup from '@/components/erp-radio/radio-all'
export default {
  mixins: [initData],
  components: {
    erpSearchPanel,
    paginationAll,
    tableImg,
    elRadioGroup
  },
  data () {
    return {
      // 数据过滤器
      searchData: {},
      inventoryStatusList: [],
      // 库存状态过滤
      inventoryStatusValue: '',
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
          value: 'prodCode',
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
      dataForm: {},
      dataList: [],

      dataListLoading: false,
      dataListSelections: []
    }
  },

  created () {
    this.getInventoryStatus()
    this.getDataList()
  },
  methods: {
    /**
     * 库存状态
     */
    getInventoryStatus () {
      this.$http
        .get(this.$http.adornUrl('basicData/queryDataDict2List'), {
          params: { dataDictKey: 'WAREHOUSE_INVENTORY_STATUS' }
        })
        .then(({ data }) => {
          this.inventoryStatusList = data.fontMaps
          this.inventoryStatusList.unshift({ key: '', value: '全部' })
        })
    },

    // 获取数据列表
    getDataList (val) {
      if (val) {
        this.paginationData.currPage = val
      }
      let searchValue
      if (this.searchData) {
        searchValue = Object.assign({}, searchValue, this.searchData)
      }
      if (this.inventoryStatusValue) {
        searchValue = Object.assign({}, searchValue, {
          status: this.inventoryStatusValue
        })
      }

      this.dataListLoading = true
      this.$http({
        url: this.$http.adornUrl('pur/whinventory/list'),
        method: 'get',
        params: Object.assign({}, this.paginationData, searchValue)
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

    // 库存状态
    inventoryStatus (value) {
      this.inventoryStatusValue = value
      this.getDataList(1)
    },

    resetHandle () {
      this.inventoryStatusValue = ''
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
    exportFile () {
      let searchValue = {}
      if (this.searchData) {
        searchValue = Object.assign({}, searchValue, this.searchData)
      }
      if (this.inventoryStatusValue) {
        searchValue = Object.assign({}, searchValue, {
          status: this.inventoryStatusValue
        })
      }
      window.open(this.$http.tokens('pur/whinventory/export', searchValue))
    }
  }
}
</script>