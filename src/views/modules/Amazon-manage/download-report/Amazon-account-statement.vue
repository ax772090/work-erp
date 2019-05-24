<!--亚马逊结算一览表（主表）-->
<template>
  <div class="mod-config">
    <el-form :model="searchForm"
             ref="searchForm"
             label-width="80px">
      <el-row>
        <el-form-item label="店铺名称"
                      prop="channelId">
          <select-all v-model="searchForm.channelId"
                      :listDataOption="channelIdOption"
                      data-value="id"
                      data-label="name"
                      :isSelectChange="true"
                      @selectChange="channelIdChangeHandle"></select-all>
        </el-form-item>
        <el-form-item label="结算周期"
                      prop="code">
          <el-select v-model="searchForm.dateRange"
                     placeholder="请选择"
                     clearable>
            <el-option v-for="item in dateRangeOption"
                       :key="item.value"
                       :label="`${item.settlementStartDate}至${item.settlementEndDate}`"
                       :value="`${item.settlementStartDate},${item.settlementEndDate}`">
              <span>{{ item.settlementStartDate}}</span>
              <span>至</span>
              <span>{{ item.settlementEndDate }}</span>
            </el-option>
          </el-select>
        </el-form-item>
      </el-row>
      <el-row>
        <el-button @click="getDataList(1)"
                   type="primary"><i class="iconfont erp-icon-sousuo"></i>搜索</el-button>
        <el-button @click="resetHandle()"
                   type="primary"><i class="iconfont erp-icon-chongzhi"></i>重置</el-button>
        <el-button @click="fbaReceivedExport()"
                   :disabled="dataList.length <= 0"
                   v-if="isAuth('mws:mwsrptsettlement:export')"
                   type="primary"><i class="iconfont erp-icon-daochu"></i>导出明细数据</el-button>
        <div class="grid-content-right">最近一次更新时间：{{lastUpdateTime}}</div>
      </el-row>
    </el-form>
    <el-table stripe
              border
              highlight-current-row
              v-loading="dataListLoading"
              max-height="800"
              show-summary
              :summary-method="getSummaries"
              @selection-change="selectionChangeHandle"
              :data="dataList">
      <el-table-column type="selection"
                       header-align="center"
                       align="center"
                       width="50"></el-table-column>
      <el-table-column prop="channelName"
                       fixed
                       label="店铺"
                       width="180"></el-table-column>
      <el-table-column prop="sellerName"
                       label="账号"
                       width="200"></el-table-column>
      <el-table-column prop="compName"
                       label="销售公司"
                       width="200"></el-table-column>
      <el-table-column prop="currencyName"
                       width="80"
                       label="结算币种"></el-table-column>
      <el-table-column prop="settlementDate"
                       label="结算周期"
                       min-width="300"
                       sortable></el-table-column>
      <el-table-column prop="initialAmount"
                       label="期初金额"
                       width="100"></el-table-column>
      <el-table-column prop="orderAmount"
                       width="100"
                       label="订单"
                       sortable></el-table-column>
      <el-table-column prop="refundAmount"
                       width="100"
                       label="退款"
                       sortable></el-table-column>
      <el-table-column prop="otherServiceAmount"
                       width="150"
                       :render-header="renderHeaderdelivery"
                       label="其他服务费用"
                       sortable></el-table-column>
      <el-table-column prop="otherTransactionAmount"
                       width="100"
                       label="其他交易"
                       sortable></el-table-column>
      <el-table-column prop="total"
                       label="本期总计"
                       width="100"
                       sortable></el-table-column>
      <el-table-column prop="reservedAmount"
                       label="预留金额"
                       width="100"
                       sortable></el-table-column>
      <el-table-column prop="totalAmount"
                       label="转账金额"
                       width="100"
                       sortable></el-table-column>
      <el-table-column prop="depositDate"
                       label="转账日期"
                       width="150"
                       sortable></el-table-column>
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
import selectAll from '@/components/erp-select/select-all'
export default {
  mixins: [initData],
  components: {
    erpSearchPanel,
    paginationAll,
    selectAll
  },
  data () {
    return {
      searchData: {},
      lastUpdateTime: '',
      searchForm: {
        channelId: '',
        dateRange: ''
      },
      channelIdOption: [], // 店铺账号
      dateRangeOption: [], // 结算周期
      settlementIds: [],   // 导出明细数据的id
      dataListSelections: [],
      dataList: [],
      dataListLoading: false
    }
  },

  created () {
    this.$http
      .get(this.$http.adornUrl('list/combobox/ownChannel'), {
        params: { platformType: '' }
      })
      .then(({ data }) => {
        this.channelIdOption = data.list
      })
     this.getDataList()
  },
  methods: {
    // 获取数据列表
    getDataList (val) {
      if (val) {
        this.paginationData.currPage = val
      }
      let dataObj = {}
      if (this.searchForm) {
        dataObj = Object.assign({}, dataObj, this.searchForm)
      }
      this.dataListLoading = true
      this.$http({
        url: this.$http.adornUrl('mws/mwsrptsettlement/list'),
        method: 'get',
        params: Object.assign({}, this.paginationData, dataObj)
      }).then(({ data }) => {
        if (data && data.code === 0) {
          this.dataList = data.pageList.dataList
          for (const item of this.dataList) {
            this.settlementIds.push(item.settlementId)
          }
          this.paginationData.totalCount = data.pageList.page.totalCount
          this.lastUpdateTime = data.lastUpdateTime
        } else {
          this.paginationData.totalCount = 0
        }
        this.dataListLoading = false
      })
    },
    // 给表格加上批注
    renderHeaderdelivery (h, { column }) {
      let l = column.label.length
      let f = 16
      column.minWidth = f * (l + 1)
      return h(
        'div',
        {
          style: 'margin-left: 10px;padding:5px'
        },
        [
          column.label,
          h('question-icon', {
            props: { messages: '包含佣金费、FBA费用、广告费、秒杀费、仓储费和其他销售费用' }
          })
        ]
      )
    },
    // 选择店铺，获取到相应的结算周期
    channelIdChangeHandle (val) {
      this.searchForm.dateRange = ''
      this.$http({
        url: this.$http.adornUrl(`mws/mwsrptsettlement/query/${val}`),
        method: 'get'
      }).then(({ data }) => {
        if (data && data.code === 0) {
          if (data.list) {
            this.dateRangeOption = data.list
          }
        } else {
          this.dateRangeOption = []
        }
      })
    },
    // 多选
    selectionChangeHandle (val) {
      this.dataListSelections = val
    },
    // 重置
    resetHandle () {
      this.searchData = {}
      this.searchForm.channelId = ''
      this.searchForm.dateRange = ''
    },
    // 导出
    fbaReceivedExport () {
      // 没有勾选不能导出明细数据
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
          arrtemp.push(this.dataListSelections[i].settlementId)
        }
      } else {
        arrtemp = this.settlementIds
      }
      let obj = Object.assign({}, this.searchForm, { settlementIds: arrtemp })
      window.open(
        this.$http.tokens('mws/mwsrptsettlement/export', obj)
      )
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
              return (prev + curr)
            } else {
              return prev
            }
          }, 0)
          if (!(index === 1 || index === 2 || index === 3 || index === 4)) {
            sums[index] = sums[index].toFixed(2)
          } else {
            sums[index] = ''
          }
        } else {
          sums[index] = ''
        }
      })

      return sums
    }
  }
}
</script>
