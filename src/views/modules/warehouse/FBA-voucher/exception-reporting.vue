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
              @select="selectionChangeHandle">
      <el-table-column label="报告类型"
                       prop="reportTypeName"></el-table-column>
      <el-table-column label="店铺"
                       prop="channelName"></el-table-column>
      <el-table-column label="数据业务日期"
                       prop="reportTime"></el-table-column>
      <el-table-column label="数据ID"
                       prop="reportCode">
      </el-table-column>
      <el-table-column label="生成库存单据"
                       prop="generatedDocType"></el-table-column>
      <el-table-column label="生成结果"
                       prop="processResult"></el-table-column>
      <el-table-column label="生成单号"
                       prop="generatedDocCode"
                       sortable></el-table-column>
      <el-table-column label="失败原因"
                       prop="failedReason"></el-table-column>
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
        label: '店铺',
        value: 'channelId',
        inputType: 'el-select',
        httpUrl: 'list/combobox/ownChannel',
        dataSource: 'list',
        title: 'channelIdList',
        dataValue: 'id',
        dataLabel: 'name',
        placeholder: '店铺'
      },
      {
        label: '报告类型',
        value: 'reportType',
        inputType: 'el-select',
        httpUrl: 'basicData/queryDataDict2List',
        requestParams: { dataDictKey: 'MWS_RPT_TYPE' },
        dataSource: 'fontMaps',
        dataValue: 'key',
        dataLabel: 'value',
        placeholder: '报告类型'
      },
      {
        label: '业务日期',
        value: 'startDate,endDate',
        inputType: 'el-daterange'
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
        url: this.$http.adornUrl('warehouse/whabnormalrpttotrading/list'),
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

    // 过滤条件
    resetHandle () {
      this.expectDate = ''
    }
  }
}
</script>
