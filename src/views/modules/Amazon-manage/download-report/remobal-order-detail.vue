<template>
  <!-- remobal-order-detail(移除订单详情) -->
  <div>
    <el-form :inline="true"
             :model="searchForm"
             ref="searchForm"
             :rules="dataRule"
             @keyup.enter.native="getDataList()">
      <el-row>
        <el-form-item label="店铺名称"
                      prop="channelId"
                      :rules="dataRule.isRequired">
          <select-all v-model="searchForm.channelId"
                      :listDataOption="channelIdOption"
                      data-value="id"
                      :isSelectChange="true"
                      @selectChange="channelIdExchange"
                      data-label="name"></select-all>
        </el-form-item>
      </el-row>
      <el-row>
        <erp-search-panel v-model="searchData"
                          :searchOptions="searchOptions"
                          @search="getDataList(1)"
                          :isResetHandle="true"
                          @resetHandle="resetHandle()"></erp-search-panel>
      </el-row>
      <el-row>
        <el-button type="primary"
                   @click="exportFile()"
                   v-if="isAuth('report:removalorder:export')"><i class="iconfont erp-icon-daochu"></i>导出</el-button>
        <div class="grid-content-right">最近一次更新时间:{{lastUpdateTime}}</div>
      </el-row>
    </el-form>
    <el-table stripe
              border
              highlight-current-row
              max-height="800"
              :data="dataList"
              v-loading="dataListLoading">
      <el-table-column prop="compName"
                       width="160"
                       label="销售公司"></el-table-column>
      <el-table-column prop="channelName"
                       width="150"
                       label="店铺"></el-table-column>
      <el-table-column prop="sellerName"
                       width="150"
                       label="账号"></el-table-column>
      <el-table-column prop="requestDate"
                       width="100"
                       label="请求日期"></el-table-column>
      <el-table-column prop="orderId"
                       width="100"
                       label="订单号"></el-table-column>
      <el-table-column prop="orderType"
                       label="订单类型"></el-table-column>
      <el-table-column prop="orderStatus"
                       label="订单状态"></el-table-column>
      <el-table-column prop="lastUpdatedDate"
                       width="100"
                       label="最近更新日期"></el-table-column>
      <el-table-column prop="sku"
                       label="sellsku"
                       width="150"></el-table-column>
      <el-table-column prop="fnsku"
                       width="130"
                       label="FNSKU"></el-table-column>
      <el-table-column prop="prodName"
                       label="产品名称"></el-table-column>
      <el-table-column prop="disposition"
                       label="状态"></el-table-column>
      <el-table-column prop="requestedQuantity"
                       label="申请"></el-table-column>
      <el-table-column prop="cancelledQuantity"
                       label="取消"></el-table-column>
      <el-table-column prop="disposedQuantity"
                       label="已销毁"></el-table-column>
      <el-table-column prop="shippedQuantity"
                       label="已退回"></el-table-column>
      <el-table-column prop="inProcessQuantity"
                       label="处理中"></el-table-column>
      <el-table-column prop="removalFee"
                       label="移除费用"></el-table-column>
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
import selectAll from '@/components/erp-select/select-all'

// 表头处理
import { renderHeaderUtil } from '@/utils/index.js'
import { initData } from '@/mixins/initData.js'
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
      searchOptions: [
        {
          label: '订单号',
          value: 'orderId',
          inputType: 'el-input'
        },
        {
          label: 'sellsku',
          value: 'sku',
          inputType: 'el-input'
        },
        {
          label: 'FNSKU',
          value: 'fnsku',
          inputType: 'el-input'
        },
        {
          label: '订单状态',
          value: 'orderStatus',
          inputType: 'el-select',
          httpUrl: 'basicData/queryDataDict2List',
          requestParams: { dataDictKey: 'MWS_ORDER_TYPE' },
          dataSource: 'fontMaps',
          title: 'status',
          dataValue: 'key',
          dataLabel: 'value',
          placeholder: '订单状态'
        },
        {
          label: '订单类型',
          value: 'orderType',
          inputType: 'el-select',
          httpUrl: 'basicData/queryDataDict2List',
          dataList: [{ orderType: 'Return' }, { orderType: 'Disposal' }],
          dataSource: 'fontMaps',
          title: 'status',
          dataValue: 'orderType',
          dataLabel: 'orderType',
          placeholder: '订单类型'
        },
        {
          label: '最近更新日期',
          value: 'dateRange',
          inputType: 'el-daterangeArr'
        },
        {
          label: '请求日期',
          value: 'dateValue',
          inputType: 'el-daterangeArr'
        }
      ],
      searchForm: {
        channelId: ''
      },
      channelIdOption: [], // 店铺账号
      dateValue: [], // 时间
      lastUpdateTime: '',
      dataList: [],
      dataListLoading: false,
      dataRule: {
        channelId: [{ required: true, message: '必填项', trigger: 'change' }]
      }
    }
  },
  created () {
    this.getDataUrl()
  },
  methods: {
    getDataUrl () {
      this.$http
        .get(this.$http.adornUrl('list/combobox/ownChannel'), {
          params: { platformType: '' }
        })
        .then(({ data }) => {
          this.channelIdOption = data.list
        })
    },
    // 获取数据列表
    getDataList (val) {
      // 有必填字段，先校验
      this.$refs['searchForm'].validate(valid => {
        if (valid) {
          if (val) {
            this.paginationData.currPage = val
          }
          let dataObj = {}
          if (this.searchForm.channelId) {
            dataObj = Object.assign({}, dataObj, {
              channelId: this.searchForm.channelId
            })
          }
          if (this.searchData) {
            dataObj = Object.assign({}, dataObj, this.searchData)
          }
          this.dataListLoading = true
          this.$http({
            url: this.$http.adornUrl('report/removalorder/list'),
            method: 'post',
            data: Object.assign({}, this.paginationData, dataObj)
          }).then(({ data }) => {
            if (data && data.code === 0) {
              this.lastUpdateTime = data.lastUpdateTime
              this.dataList = data.pageList.dataList
              this.paginationData.totalCount = data.pageList.page.totalCount
            } else {
              this.dataList = []
              this.paginationData.totalCount = 0
            }
            this.dataListLoading = false
          })
        } else {
          return false
        }
      })
    },

    // 时间
    dateValueChange (value) {
      if (value) {
        this.$set(this.searchForm, 'startDate', value[0])
        this.$set(this.searchForm, 'endDate', value[1])
      }
    },
    // 重置
    resetHandle () {
      this.searchData = {}
      this.searchForm = {}
    },
    // 导出
    exportFile () {
      this.$refs['searchForm'].validate(valid => {
        if (valid) {
          let dataObj = {}
          if (this.searchForm.channelId) {
            dataObj = Object.assign({}, dataObj, {
              channelId: this.searchForm.channelId
            })
          }
          if (this.searchData) {
            dataObj = Object.assign({}, dataObj, this.searchData)
          }
          window.open(this.$http.tokens('report/removalorder/export', dataObj))
        }
      })
    },
    channelIdExchange () {
      this.getDataList(1)
    },
    // 表头内容过长处理
    renderHeader (h, g) {
      return renderHeaderUtil(h, g)
    }
  }
}
</script>

