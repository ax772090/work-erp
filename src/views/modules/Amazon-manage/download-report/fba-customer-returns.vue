<template>
  <!-- fba-customer-returns(销售退货报告) -->
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
                      :listDataOption='channelIdOption'
                      dataValue='id'
                      :isSelectChange="true"
                      @selectChange="channelIdExchange"
                      dataLabel='name'></select-all>
        </el-form-item>
      </el-row>
      <el-row>
        <erp-search-panel v-model="searchData"
                          :searchOptions="searchOptions"
                          @search="getDataList(1)"
                          :isResetHandle="true"
                          @resetHandle="resetHandle('searchForm')"></erp-search-panel>
      </el-row>
      <el-row>
        <el-button type="primary"
                   v-if="isAuth('report:returnreport:export')"
                   @click="exportFile()"><i class="iconfont erp-icon-daochu"></i>导出</el-button>
        <div class="fr">
          最近一次更新时间:{{lastUpdateTime}}
        </div>
      </el-row>
    </el-form>
    <el-table stripe
              border
              highlight-current-row
              max-height="800"
              :data="dataList"
              v-loading="dataListLoading"
              @selection-change="selectionChangeHandle">
      <el-table-column prop="compName"
                       width="200"
                       label="销售公司"></el-table-column>
      <el-table-column prop="channelName"
                       width="150"
                       label="店铺"></el-table-column>
      <el-table-column prop="sellerName"
                       width="150"
                       label="账号"></el-table-column>
      <el-table-column prop="returnDate"
                       width="180"
                       label="退货日期"></el-table-column>
      <el-table-column prop="orderId"
                       width="150"
                       label="订单编号"></el-table-column>
      <el-table-column prop="productName"
                       :show-overflow-tooltip="true"
                       label="产品描述"></el-table-column>
      <el-table-column prop="sku"
                       width="170"
                       label="sellsku"></el-table-column>
      <el-table-column prop="asin"
                       width="120"
                       label="ASIN"></el-table-column>
      <el-table-column prop="fnsku"
                       width="120"
                       label="FNSKU"></el-table-column>
      <el-table-column prop="prodName"
                       width="180"
                       label="产品名称"></el-table-column>
      <el-table-column prop="quantity"
                       label="数量"></el-table-column>
      <el-table-column prop="fulfillmentCenterId"
                       label="运营中心"></el-table-column>
      <el-table-column prop="detailedDisposition"
                       width="100"
                       label="库存属性"></el-table-column>
      <el-table-column prop="reason"
                       width="130"
                       label="买家退货原因"></el-table-column>
      <el-table-column prop="status"
                       label="状态"></el-table-column>
      <el-table-column prop="licensePlateNumber"
                       label="运输单号"></el-table-column>
      <el-table-column prop="customerComments"
                       show-overflow-tooltip
                       width="130"
                       label="买家退货评论"></el-table-column>
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
  mixins: [
    initData
  ],
  components: {
    erpSearchPanel,
    paginationAll,
    selectAll
  },
  data () {
    return {
      searchData: {},
      searchOptions: [{
        label: '退货日期',
        value: 'dateRange',
        inputType: 'el-daterangeArr'
      },
      {
        label: '订单编号',
        value: 'orderId',
        inputType: 'el-input'
      },
      {
        label: '运输单号',
        value: 'licensePlateNumber',
        inputType: 'el-input'
      },
      {
        label: 'sellsku',
        value: 'sku',
        inputType: 'el-input'
      }],
      searchForm: {
        channelId: ''
      },
      channelIdOption: [], // 店铺账号
      lastUpdateTime: '',
      dataList: [],
      dataListLoading: false,
      dataListSelections: [],
      dataRule: {
        channelId: [
          { required: true, message: '必填项', trigger: 'change' }
        ]
      }
    }
  },
  created () {
    this.getDataUrl()
  },
  methods: {
    // 表头内容过长处理
    renderHeader (h, g) {
      return renderHeaderUtil(h, g)
    },
    getDataUrl () {
      this.$http.get(this.$http.adornUrl('list/combobox/ownChannel'), { params: { platformType: '' } }).then(({ data }) => { this.channelIdOption = data.list })
    },
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
            url: this.$http.adornUrl('report/returnreport/list'),
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

    // 多选
    selectionChangeHandle (val) {
      this.dataListSelections = val
    },
    channelIdExchange () {
      this.getDataList(1)
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
          window.open(
            this.$http.tokens(
              'report/returnreport/export',
              dataObj
            )
          )
        }
      })
    },

    // 表头内容过长处理
    renderHeader (h, g) {
      return renderHeaderUtil(h, g)
    }
  }
}
</script>


