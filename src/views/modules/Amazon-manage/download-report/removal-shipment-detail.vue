<template>
  <!-- removal-shipment-detail(移除货件详情) -->
  <div>
    <el-form :inline="true"
             :model="searchForm"
             ref="searchForm"
             :rules="dataRule"
             @keyup.enter.native="getDataList()">
      <el-row>
        <el-form-item label="店铺名称"
                      :rules="dataRule.isRequired"
                      prop="channelId">
          <selectAll v-model="searchForm.channelId"
                     :listDataOption="channelIdOption"
                     data-value="id"
                     :isSelectChange="true"
                     @selectChange="channelIdExchange"
                     data-label="name"></selectAll>
        </el-form-item>
      </el-row>
      <el-row @keyup.enter.native="getDataList()">
        <erp-search-panel v-model="searchData"
                          :searchOptions="searchOptions"
                          @search="getDataList(1)"
                          :isResetHandle="true"
                          @resetHandle="resetHandle()"></erp-search-panel>
      </el-row>
      <el-row>
        <el-button type="primary"
                   @click="exportFile()"
                   v-if="isAuth('report:removalshipment:export')"><i class="iconfont erp-icon-daochu"></i>导出</el-button>
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
                       width="170"
                       label="销售公司"></el-table-column>
      <el-table-column prop="channelName"
                       label="店铺"></el-table-column>
      <el-table-column prop="sellerName"
                       width="150"
                       label="账号"></el-table-column>
      <el-table-column prop="orderId"
                       label="订单编号"></el-table-column>
      <el-table-column prop="shipmentDate"
                       label="发货日期"></el-table-column>
      <el-table-column prop="sku"
                       label="sellsku"></el-table-column>
      <el-table-column prop="prodName"
                       label="产品名称"></el-table-column>
      <el-table-column prop="fnsku"
                       label="FNSKU"></el-table-column>
      <el-table-column prop="disposition"
                       label="状态"></el-table-column>
      <el-table-column prop="shippedQuantity"
                       label="发货数量"></el-table-column>
      <el-table-column prop="carrier"
                       label="承运商"></el-table-column>
      <el-table-column prop="trackingNumber"
                       label="运输跟踪号"></el-table-column>
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
          label: '订单编号',
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
          label: '状态',
          value: 'disposition',
          inputType: 'el-input'
        },
        {
          label: '发货日期',
          value: 'dateRange',
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
    this.$http
      .get(this.$http.adornUrl('list/combobox/ownChannel'), {
        params: { platformType: '' }
      })
      .then(({ data }) => {
        this.channelIdOption = data.list
      })
  },
  methods: {
    // 获取数据列表
    getDataList (val) {
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
            url: this.$http.adornUrl('report/removalshipment/list'),
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
          window.open(this.$http.tokens('report/removalshipment/export', dataObj))
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
