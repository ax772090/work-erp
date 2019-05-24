<!--异常报告-->
<template>
  <div>
    <el-row @keyup.enter.native="getDataList()">
      <erp-search-panel v-model="searchData"
                        :searchOptions="searchOptions"
                        @search="getDataList(1)"></erp-search-panel>
    </el-row>
    <el-row>
      <el-button v-if="isAuth('warehouse:whabnormalrpttotrading:abnormalexport')"
                 type="primary"
                 class="grid-content-right"
                 @click="exportFile()"><i class="iconfont erp-icon-daochu"></i>导出</el-button>
    </el-row>
    <el-table :data="dataList"
              stripe
              border
              highlight-current-row
              @selection-change="selectionChangeHandle"
              v-loading="dataListLoading">
      <el-table-column type="selection"
                       header-align="center"
                       align="center"
                       width="50"></el-table-column>
      <el-table-column label="报告类型"
                       prop="reportTypeName"></el-table-column>
      <el-table-column label="店铺"
                       prop="channelName"></el-table-column>
      <el-table-column label="数据业务日期"
                       prop="reportTime"></el-table-column>
      <el-table-column label="生成库存单据"
                       prop="generatedDocType"></el-table-column>
      <el-table-column label="生成结果"
                       prop="processResult"></el-table-column>
      <el-table-column label="生成单号"
                       prop="generatedDocCode"
                       sortable></el-table-column>
      <el-table-column label="失败原因"
                       width="80"
                       prop="failedReason">
        <template slot-scope="scope">
          <el-button title="查看"
                     type="primary"
                     circle
                     @click="check(scope.row)">
            <i class="iconfont erp-icon-chakanlishi"></i>
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页 -->
    <el-row>
      <pagination-all v-model="paginationData"
                      @paginationChangeHandle="getDataList"></pagination-all>
    </el-row>
    <!-- 查看失败原因 -->
    <check-reason ref="checkReason"
                  @refreshDataList="getDataList"></check-reason>
  </div>
</template>
<script>
// 搜索
import erpSearchPanel from '@/components/erp-search-panel'
// 分页
import paginationAll from '@/components/erp-pagination/pagination-all'
import { initData } from '@/mixins/initData.js'
import checkReason from './exception-reporting-checkReason.vue'
export default {
  mixins: [initData],
  components: {
    erpSearchPanel,
    paginationAll,
    checkReason
  },
  data () {
    return {
      // 数据过滤器
      searchData: {},
      settlementIds: [],   // 导出数据的id
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
      },
      {
        label: '生成库存单据',
        value: 'generatedDocType',
        inputType: 'el-input'
      },
      {
        label: '生成结果',
        value: 'processResult',
        inputType: 'el-select',
        dataList: [{ key: '成功', name: '成功' }, { key: '失败', name: '失败' }],
        title: 'processResult',
        dataValue: 'key',
        dataLabel: 'name',
        placeholder: '生成结果'
      }
      ],
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
          for (const item of this.dataList) {
            this.settlementIds.push(item.id)
          }
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
    // 查看
    check (row) {
      this.$nextTick(() => {
        this.$refs.checkReason.init(row.id, row.processResult)
      })
    },
    // 导出
    exportFile () {
      // 没有勾选不能导出
      if (this.dataListSelections.length <= 0) {
        this.$notify.warning({
          title: '警告',
          message: '请先勾选要导出的数据！',
          duration: 2000
        })
        return
      }
      let arrtemp = []
      if (this.dataListSelections.length > 0) {
        for (let i = 0; i < this.dataListSelections.length; i++) {
          arrtemp.push(this.dataListSelections[i].id)
        }
      } else {
        arrtemp = this.settlementIds
      }
      let obj = Object.assign({}, this.searchForm, { ids: arrtemp })
      console.log('ids', obj)
      window.open(this.$http.tokens('warehouse/whabnormalrpttotrading/abnormalexport', obj))
    }
  }
}
</script>
<style scoped>
.reportCode {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
</style>

