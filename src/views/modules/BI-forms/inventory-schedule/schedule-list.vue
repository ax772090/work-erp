<!-- 库存计划表 -->
<template>
  <div>
    <el-form :model="searchForm"
             :inline="true"
             :rules="dataRule"
             ref="searchForm"
             label-width="80px">
      <el-form-item label="小组"
                    prop="channelId">
        <select-all v-model="searchForm.tradingType"
                    :listDataOption="orderTypeOptions"
                    data-value="key"
                    data-label="value"
                    placeholder="小组"
                    :isSelectChange="true"></select-all>
      </el-form-item>
      <el-form-item label="销售"
                    prop="channelId">
        <select-all v-model="searchForm.tradingType"
                    :listDataOption="orderTypeOptions"
                    data-value="key"
                    data-label="value"
                    placeholder=""
                    :isSelectChange="true"></select-all>
      </el-form-item>
      <el-form-item label="型号">
        <el-input v-model="searchForm.tradingType">
        </el-input>
      </el-form-item>
      <el-form-item label="E登SKU">
        <el-input v-model="searchForm.tradingType">
        </el-input>
      </el-form-item>
      <el-form-item label="产品名">
        <el-input v-model="searchForm.tradingType">
        </el-input>
      </el-form-item>
      <el-form-item label="库存差异"
                    prop="channelId">
        <select-all v-model="searchForm.tradingType"
                    :listDataOption="orderTypeOptions"
                    data-value="key"
                    data-label="value"
                    placeholder="全部"
                    :isSelectChange="true"></select-all>
      </el-form-item>
      <el-row>
        <el-button type="primary"
                   @click="submitForm('dataForm')"><i class="iconfont erp-icon-sousuo"></i>搜索</el-button>
        <el-button type="primary"
                   @click="resetForm('dataForm')"><i class="iconfont erp-icon-chongzhi"></i>重置</el-button>
        <el-button type="primary"
                   @click="exportFile()"
                   v-if="isAuth('mws:mwsrptallorders:export')"><i class="iconfont erp-icon-daochu"></i>Excel</el-button>
      </el-row>
    </el-form>
    <el-table stripe
              border
              highlight-current-row
              max-height="800"
              :data="dataList"
              v-loading="dataListLoading">
      <el-table-column prop="amazonOrderId"
                       label="小组"></el-table-column>
      <el-table-column prop="merchantOrderId"
                       label="负责人"
                       :show-overflow-tooltip="true"></el-table-column>
      <el-table-column prop="sellerName"
                       label="产品名"></el-table-column>
      <el-table-column prop="purchaseDate"
                       label="E登SKU"></el-table-column>
      <el-table-column prop="lastUpdatedDate"
                       width="80"
                       align='center'
                       :render-header="renderheader"
                       label=" 周转天数/(不含在途)"></el-table-column>
      <el-table-column prop="orderStatus"
                       label="总金额"></el-table-column>
      <el-table-column prop="fulfillmentChannel"
                       label="总库存"></el-table-column>
      <el-table-column prop="salesChannel"
                       width="100"
                       label="国内待交货"></el-table-column>
      <el-table-column prop="shipServiceLevel"
                       label="FBA库存"></el-table-column>
      <el-table-column prop="productName"
                       width="100"
                       label="中转仓库存"
                       :show-overflow-tooltip="true"></el-table-column>
      <el-table-column prop="sku"
                       label="采购%"></el-table-column>
      <el-table-column prop="asin"
                       label="毛利%"></el-table-column>
      <el-table-column prop="itemStatus"
                       label="30天日均"></el-table-column>
      <el-table-column prop="quantity"
                       label="本月日均"></el-table-column>
      <el-table-column prop="currency"
                       align='center'
                       :render-header="renderheader"
                       label="5月/目标日均"></el-table-column>
      <el-table-column prop="itemPrice"
                       :render-header="renderheader"
                       align='center'
                       label="6月/目标日均"></el-table-column>
      <el-table-column prop="itemTax"
                       align='center'
                       :render-header="renderheader"
                       label="7月/目标日均"></el-table-column>
      <el-table-column prop="shippingPrice"
                       align='center'
                       :render-header="renderheader"
                       label="8月/目标日均"></el-table-column>
      <el-table-column prop=""
                       :render-header="renderheader"
                       align='center'
                       width="100"
                       label="5-8月/可消化库存"></el-table-column>
      <el-table-column prop="giftWrapPrice"
                       align='center'
                       :render-header="renderheader"
                       label="库存差异/(已交)"></el-table-column>
      <el-table-column prop="promotionIds"
                       align='center'
                       :render-header="renderheader"
                       label="库存差异/(含未交货)"></el-table-column>
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
import selectAll from '@/components/erp-select/select-all'
// 分页
import paginationAll from '@/components/erp-pagination/pagination-all'
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
      searchForm: {
        dataForm: '',
        dateRange: []
      },
      orderTypeOptions: [],
      searchOptions: [
        {
          label: '订单编号',
          value: 'order',
          inputType: 'el-input'
        },
        {
          label: '自定义订单号',
          value: 'merchantOrderId',
          inputType: 'el-input'
        },
        {
          label: 'sellsku',
          value: 'sku',
          inputType: 'el-input'
        }
      ],
      lastUpdateTime: '',
      dataList: [],
      dataListLoading: false,
      dataRule: {
        isRequired: [{ required: true, message: '必填项', trigger: 'change' }],
        dateRange: [{ required: true, message: '必填项', trigger: 'change' }]
      }
    }
  },
  methods: {
    renderheader (h, { column, $index }) {
      return h('span', {}, [
        h('span', {}, column.label.split('/')[0]),
        h('br'),
        h('span', {}, column.label.split('/')[1])
      ])
    },
    getDataList () {

    },
    // 搜索
    submitForm () {

    },
    // 重置
    resetForm () {

    },
    // 导出
    exportFile () {

    }
  }
}
</script>




