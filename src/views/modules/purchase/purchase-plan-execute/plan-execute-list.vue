 <!-- 采购计划执行情况（从表） -->
<template>
  <div class="mod-config">
    <el-form :inline="true"
             :model="dataForm"
             @keyup.enter.native="getDataList()">
      <el-row>
        <erp-search-panel v-model="searchData"
                          :searchOptions="searchOptions"
                          @search="getDataList(1)"></erp-search-panel>
      </el-row>
      <el-row>
        <div class="grid-content">
          <el-button type="primary"
                     v-if="isAuth('pur:poplandetail:export')"
                     @click="Export()"><i class="iconfont erp-icon-daochu"></i>导出</el-button>
        </div>
      </el-row>
    </el-form>
    <el-table :data="dataList"
              stripe
              border
              highlight-current-row
              v-loading="dataListLoading"
              @selection-change="selectionChangeHandle"
              :default-sort="{prop:'code',order:'descending'}">
      <el-table-column type="selection"
                       align="center"
                       header-align="center"
                       width="50"></el-table-column>
      <el-table-column prop="planCode"
                       sortable
                       label="采购计划单号"></el-table-column>
      <el-table-column prop="planDate"
                       sortable
                       label="采购计划日期"></el-table-column>
      <el-table-column prop="planDate"
                       sortable
                       label="单据状态"></el-table-column>
      <el-table-column prop="expectDate"
                       sortable
                       label="要求到货日期">
      </el-table-column>
      <el-table-column prop="prodCode"
                       sortable
                       label="产品编码"></el-table-column>
      <el-table-column prop="prodName"
                       width="250"
                       label="产品名称"></el-table-column>
      <el-table-column prop="planQty"
                       sortable
                       label="计划数量"></el-table-column>
      <el-table-column prop="orderQty"
                       sortable
                       width="120"
                       label="已下单数量"></el-table-column>
      <el-table-column prop="line"
                       sortable
                       label="计划明细行号"></el-table-column>
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
      searchOptions: [
        {
          label: '采购计划日期',
          value: 'planStart,planEnd',
          inputType: 'el-daterange' // 这里要日期
        },
        {
          label: '要求到货日期',
          value: 'expectStart,expectEnd',
          inputType: 'el-daterange' // 这里要日期
        },
        {
          label: '采购计划单号',
          value: 'planCode',
          inputType: 'el-input'
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
        }
      ],

      dataForm: {},
      dataList: [],
      flag: true,
      dataListLoading: false,
      dataListSelections: [],
      addOrUpdateVisible: false,
      isUnitOrder: false // 按钮控制
    }
  },

  created () {
    this.getDataList()
    this.selectionChangeHandle([])
  },
  methods: {
    // 获取数据列表
    getDataList (val) {
      if (val) {
        this.paginationData.currPage = val
      }
      this.dataListLoading = true
      this.$http({
        url: this.$http.adornUrl('pur/poplandetail/list'),
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

    // 多选
    selectionChangeHandle (val) {
      this.dataListSelections = val
      if (this.dataListSelections.length <= 0) {
        this.isUnitOrder = true
      } else {
        this.isUnitOrder = false
      }
    },

    // 导出
    Export () {
      let ids = []
      for (const item of this.dataListSelections) {
        ids.push(item.id)
      }
      let obj = Object.assign({}, this.searchData, { detailIds: ids })
      window.open(
        this.$http.tokens(
          'pur/poplandetail/export',
          obj
        )
      )
    }
  }
}
</script>
