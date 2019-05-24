<!-- 所有订单报告 -->
<template>
  <div>
    <el-form :model="searchForm"
             :rules="dataRule"
             ref="searchForm"
             label-width="80px">
      <el-form-item label="店铺名称"
                    prop="channelId"
                    :rules="dataRule.isRequired">
        <select-all v-model="searchForm.channelId"
                    :listDataOption="channelIdOption"
                    data-value="id"
                    data-label="name"></select-all>
      </el-form-item>
      <!-- <el-form-item label="订单编号"
                    prop="order">
        <el-input v-model="searchForm.order"
                  placeholder
                  clearable></el-input>
      </el-form-item> -->

      <el-form-item label="时间范围"
                    prop="dateRange"
                    :rules="dataRule.isRequired">
        <el-date-picker type="daterange"
                        v-model="searchForm.dateRange"
                        value-format="yyyy-MM-dd"
                        range-separator="至"
                        start-placeholder="开始日期"
                        end-placeholder="结束日期"></el-date-picker>
      </el-form-item>
      <el-row>
        <erp-search-panel :searchOptions="searchOptions"
                          selectedOption="order"
                          @search="getDataList(1)"
                          v-model="searchData"
                          :isResetHandle="true"
                          @resetHandle="resetHandle()" />
      </el-row>
      <el-row>
        <!-- <el-button @click="getDataList(1)"
                   type="primary"><i class="iconfont erp-icon-sousuo"></i>搜索</el-button> -->
        <!-- <el-button @click="resetHandle()"
                   type="primary"><i class="iconfont erp-icon-chongzhi"></i>重置</el-button> -->
        <el-button type="primary"
                   @click="exportFile()"
                   v-if="isAuth('mws:mwsrptallorders:export')"><i class="iconfont erp-icon-daochu"></i>导出</el-button>
        <div class="fr">最近一次更新时间:{{lastUpdateTime}}</div>
      </el-row>
    </el-form>
    <el-table stripe
              border
              highlight-current-row
              max-height="800"
              :data="dataList"
              v-loading="dataListLoading"
              @selection-change="selectionChangeHandle">
      <el-table-column prop="amazonOrderId"
                       width="170"
                       label="亚马逊编号"></el-table-column>
      <el-table-column prop="merchantOrderId"
                       label="自定义订单号"
                       width="200px"
                       :show-overflow-tooltip="true"></el-table-column>
      <el-table-column prop="sellerName"
                       width="150"
                       label="账号"></el-table-column>
      <el-table-column prop="purchaseDate"
                       width="180"
                       label="订单日期"></el-table-column>
      <el-table-column prop="lastUpdatedDate"
                       width="180"
                       label="更新日期"></el-table-column>
      <el-table-column prop="orderStatus"
                       label="订单状态"></el-table-column>
      <el-table-column prop="fulfillmentChannel"
                       label="配送方式"></el-table-column>
      <el-table-column prop="salesChannel"
                       width="100"
                       label="销售渠道"></el-table-column>
      <el-table-column prop="shipServiceLevel"
                       width="100"
                       label="配送服务"></el-table-column>
      <el-table-column prop="productName"
                       label="产品描述"
                       :show-overflow-tooltip="true"></el-table-column>
      <el-table-column prop="sku"
                       width="180"
                       label="sellsku"></el-table-column>
      <el-table-column prop="asin"
                       width="130"
                       label="asin"></el-table-column>
      <el-table-column prop="itemStatus"
                       width="100"
                       label="状态"></el-table-column>
      <el-table-column prop="quantity"
                       label="数量"></el-table-column>
      <el-table-column prop="currency"
                       label="货币"></el-table-column>
      <el-table-column prop="itemPrice"
                       label="价格"></el-table-column>
      <el-table-column prop="itemTax"
                       label="税费"></el-table-column>
      <el-table-column prop="shippingPrice"
                       label="运费"></el-table-column>
      <el-table-column prop="shippingTax"
                       label="运输税"></el-table-column>
      <el-table-column prop="giftWrapPrice"
                       label="礼品费"></el-table-column>
      <el-table-column prop="promotionIds"
                       label="促销ID"></el-table-column>
      <el-table-column prop="itemPromotionDiscount"
                       label="促销折扣">
        <template slot-scope="scope">
          <div>
            {{scope.row.itemPromotionDiscount | filterData}}
          </div>
        </template>
      </el-table-column>
      <el-table-column prop="shipPromotionDiscount"
                       width="100"
                       label="配送促销折扣">
        <template slot-scope="scope">
          <div>
            {{scope.row.shipPromotionDiscount | filterData}}
          </div>
        </template>
      </el-table-column>
      <el-table-column prop="shipCity"
                       label="城市"></el-table-column>
      <el-table-column prop="shipState"
                       label="区"></el-table-column>
      <el-table-column prop="shipPostalCode"
                       label="邮政编码"></el-table-column>
      <el-table-column prop="shipCountry"
                       label="国家代码"></el-table-column>
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
      searchForm: {
        channelId: '',
        dateRange: []
      },
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
      channelIdOption: [], // 店铺账号
      lastUpdateTime: '',
      dataList: [],
      dataListLoading: false,
      dataListSelections: [],
      dataRule: {
        isRequired: [{ required: true, message: '必填项', trigger: 'change' }],
        dateRange: [{ required: true, message: '必填项', trigger: 'change' }]
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
  filters: {
    filterData (val) {
      if (val === 0) {
        return 0
      } else {
        return -(val)
      }
    }
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
          if (this.searchForm) {
            dataObj = Object.assign({}, this.searchData, this.searchForm)
          }
          this.dataListLoading = true
          this.$http({
            url: this.$http.adornUrl('mws/mwsrptallorders/list'),
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

    // 多选
    selectionChangeHandle (val) {
      this.dataListSelections = val
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
          let obj = Object.assign({}, this.searchData, this.searchForm)
          this.searchForm.dateRange.join()
          window.open(
            this.$http.tokens(
              'mws/mwsrptallorders/export',
              obj
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



