<!-- Payments每月明细报告（主表） -->
<template>
  <div class="mod-config">
    <el-form :model="searchForm"
             :rules="dataRule"
             ref="searchForm"
             label-width="100px"
             @keyup.enter.native="getDataList()">
      <el-row>
        <el-col :span="6">
          <el-form-item label="店铺名称"
                        prop="channelId"
                        :rules="dataRule.isRequired">
            <select-all v-model="searchForm.channelId"
                        :listDataOption="accountOptions"
                        data-value="id"
                        data-label="name"></select-all>
          </el-form-item>
          <el-form-item label="按具体交易号"
                        prop="orderId">
            <el-input placeholder="输入订单编号"
                      v-model="searchForm.orderId"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="8"
                :offset="2">
          <el-form-item label="交易类型"
                        prop="orderType">
            <select-all v-model="searchForm.orderType"
                        :listDataOption="accountOptions"
                        data-value="id"
                        data-label="name"></select-all>
          </el-form-item>
          <el-form-item label="时间范围"
                        prop="dateRange">
            <el-date-picker value-format="yyyy-MM-dd"
                            v-model="searchForm.dateValue"
                            type="daterange"
                            range-separator="至"
                            start-placeholder="开始日期"
                            end-placeholder="结束日期"></el-date-picker>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-button @click="getDataList(1)"
                   type="primary"><i class="iconfont erp-icon-sousuo"></i>搜索</el-button>
        <el-button @click="resetHandle()"
                   type="primary"><i class="iconfont erp-icon-chongzhi"></i>重置</el-button>
        <el-button @click="fbaReceivedExport()"
                   type="primary"
                   v-if="isAuth('mws:rptfulshipments:export')">
          <i class="iconfont erp-icon-daochu"></i>导出</el-button>
        <div class="grid-content-right">最近一次同步时间：</div>
      </el-row>
    </el-form>

    <el-table stripe
              border
              highlight-current-row
              max-height="800"
              :data="dataList"
              v-loading="dataListLoading"
              >
      <el-table-column prop="saleComp"
                       width="100"
                       label="销售公司"></el-table-column>
      <el-table-column prop="channelName"
                       width="100"
                       label="店铺"></el-table-column>
      <el-table-column prop="code"
                       width="100"
                       label="付款日期"></el-table-column>
      <el-table-column prop="settlementId"
                       width="100"
                       label="结算ID"></el-table-column>
      <el-table-column prop="type"
                       width="100"
                       label="类型"></el-table-column>
      <el-table-column prop="orderId"
                       width="100"
                       label="订单id"></el-table-column>
      <el-table-column prop="sku"
                       width="100"
                       label="sellsku"></el-table-column>
      <el-table-column prop="total"
                       width="100"
                       label="产品名称"></el-table-column>
      <el-table-column prop="description"
                       width="100"
                       label="描述"></el-table-column>
      <el-table-column prop="quantity"
                       width="100"
                       label="数量"></el-table-column>
      <el-table-column prop="marketplace"
                       width="100"
                       label="市场"></el-table-column>
      <el-table-column prop="fulfillment"
                       width="100"
                       label="发货渠道"></el-table-column>
      <el-table-column prop="orderState"
                       width="100"
                       label="订单状态"></el-table-column>
      <el-table-column prop="productSales"
                       width="100"
                       label="产品价格"></el-table-column>
      <el-table-column prop="shippingCredits"
                       width="100"
                       label="运输优惠"></el-table-column>
      <el-table-column prop="giftWrapCredits"
                       width="100"
                       label="大礼包积分"></el-table-column>
      <el-table-column prop="promotionalRebates"
                       width="100"
                       label="促销折扣"></el-table-column>
      <el-table-column prop="salesTaxCollected"
                       width="100"
                       label="销售税收集"></el-table-column>
      <el-table-column prop="marketplaceFacilitatorTax"
                       width="100"
                       label="市场税"></el-table-column>
      <el-table-column prop="sellingFees"
                       width="100"
                       label="销售费用"></el-table-column>
      <el-table-column prop="fbaFees"
                       width="100"
                       label="FBA运费"></el-table-column>
      <el-table-column prop="otherTransactionFees"
                       width="100"
                       label="其他交易费用"></el-table-column>
      <el-table-column prop="other"
                       width="100"
                       label="其他"></el-table-column>
      <el-table-column prop="total"
                       width="100"
                       label="总计"></el-table-column>
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
      accountOptions: [], // 店铺账号
      // 下拉
      searchOptions: [
        {
          label: '店铺账号',
          value: 'code',
          inputType: 'el-input'
        },
        {
          label: 'sellsku',
          value: 'date',
          inputType: 'el-input'
        },
        {
          label: 'FNSKU',
          value: '1',
          inputType: 'el-input'
        }
      ],
      searchForm: {
        channelId: '',
        orderId: '',
        orderType: '',
        dateValue: []
      },
      dataForm: {},
      dateValue: '', // 时间
      dataList: [],
      dataListLoading: false,
      // 分页
      paginationData: {
        // 当前页数
        currPage: 1,
        // 一页显示的条数
        pageSize: 10,
        // 总条数
        totalCount: 0,
        // 总页数
        totalPage: 0
      },
      dataRule: {
        isRequired: [{ required: true, message: '必填项', trigger: 'change' }]
      }
    }
  },

  created () {
    this.$http
      .get(this.$http.adornUrl('list/combobox/ownChannel'), {
        params: { platformType: '' }
      })
      .then(({ data }) => {
        this.accountOptions = data.list
      })
  },
  methods: {
    // 表头内容过长处理
    renderHeader (h, g) {
      return renderHeaderUtil(h, g)
    },

    // 获取数据列表
    getDataList (val) {
      this.$refs['searchForm'].validate(valid => {
        if (valid) {
          if (val) {
            this.paginationData.currPage = val
          }
          let dataObj = {}
          if (this.searchForm) {
            dataObj = Object.assign({}, dataObj, this.searchForm)
          }
          this.dataListLoading = true
          this.$http({
            url: this.$http.adornUrl('mws/monthinventory/list'),
            method: 'post',
            data: Object.assign({}, this.paginationData, dataObj)
          }).then(({ data }) => {
            if (data && data.code === 0) {
              // this.dataList = data.pageList.dataList
            } else {
              this.paginationData.totalCount = 0
            }
            this.dataListLoading = false
          })
        }
      })
    },

    // 重置
    resetHandle () {
      this.searchData = {}
      this.searchForm = {}
    },

    // 导出
    fbaReceivedExport () {
       this.$refs['searchForm'].validate(valid => {
         if (valid) {

         }
       })
    }
  }
}
</script>


