<!-- 月度经营分析表（主表） -->
<template>
  <div class="mod-config">
    <el-form :model="dataForm"
             :rules="dataRule"
             ref="dataForm"
             label-width="80px"
             @keyup.enter.native="getDataList()">
      <el-row>
        <el-form-item label="店铺账号"
                      prop="channelId">
          <select-all v-model="dataForm.channelId"
                      :listDataOption="accountOptions"
                      data-value="id"
                      data-label="name"
                      placeholder="选择店铺"></select-all>
        </el-form-item>

      </el-row>
      <el-row>
        <erp-search-panel v-model="searchData"
                          :searchOptions="searchOptions"
                          @search="getDataList(1)"
                          :isResetHandle="true"
                          @resetHandle="resetHandle('dataForm')"></erp-search-panel>
      </el-row>
      <el-row>
        <el-button @click="fbaReceivedExport()"
                   type="primary"><i class="iconfont erp-icon-daochu"></i>报表导出</el-button>
      </el-row>
    </el-form>
    <el-table stripe
              border
              highlight-current-row
              max-height="800"
              :data="dataList"
              @selection-change="selectionChangeHandle">
      <el-table-column prop="saleComp"
                       label="销售公司"></el-table-column>
      <el-table-column prop="dateRate"
                       label="时间范围"></el-table-column>
      <el-table-column prop="site"
                       label="站点"></el-table-column>
      <el-table-column prop="channelSku"
                       label="渠道sku"></el-table-column>
      <el-table-column prop="asin"
                       label="ASIN"></el-table-column>
      <el-table-column prop="sku"
                       label="内部SKU"></el-table-column>
      <el-table-column prop="confirmUserName"
                       label="品名"></el-table-column>
      <el-table-column prop="confirmUserName"
                       label="产品分类"></el-table-column>
      <el-table-column prop="prodType"
                       label="类型"></el-table-column>
      <el-table-column prop="newProd"
                       label="新品"></el-table-column>
      <el-table-column prop="inChangeOf"
                       label="负责人"></el-table-column>
      <el-table-column prop="exchangeRate"
                       label="汇率"></el-table-column>
      <el-table-column prop="refundQty"
                       label="退款数"></el-table-column>
      <el-table-column prop="orderQty"
                       label="订单数"></el-table-column>
      <el-table-column prop="adjustmentQty"
                       label="调整数"></el-table-column>
      <el-table-column prop="pssQty"
                       width="100"
                       label="进销存出库数"></el-table-column>
      <el-table-column prop="originalSales"
                       width="120"
                       label="销售额（原币）"></el-table-column>
      <el-table-column prop="baseSales"
                       width="130"
                       label="销售额（人民币）"></el-table-column>
      <el-table-column prop="originalRefund"
                       width="100"
                       label="退款（原币）"></el-table-column>
      <el-table-column prop="baseRefund"
                       width="120"
                       label="退款（人民币）"></el-table-column>
      <el-table-column prop="confirmUserName"
                       width="140"
                       label="销售收入（人民币）"></el-table-column>
      <el-table-column prop="originalCharge"
                       width="140"
                       label="平台手续费（原币）"></el-table-column>
      <el-table-column prop="baseCharge"
                       width="160"
                       label="平台手续费（人民币）"></el-table-column>
      <el-table-column prop="originalShipping"
                       width="140"
                       label="FBA运费（原币）"></el-table-column>
      <el-table-column prop="baseShipping"
                       width="140"
                       label="FBA运费（人民币）"></el-table-column>
      <el-table-column prop="originalOthers"
                       width="140"
                       label="其他费用（原币）"></el-table-column>
      <el-table-column prop="baseOthers"
                       width="140"
                       label="其他费用（人民币）"></el-table-column>
      <el-table-column prop="purPrice"
                       label="采购单价"></el-table-column>
      <el-table-column prop="headPrice"
                       label="头程单价"></el-table-column>
      <el-table-column prop="basePrincipal"
                       width="140"
                       label="采购成本（人民币）"></el-table-column>
      <el-table-column prop="baseHeadPrincipal"
                       width="140"
                       label="头程成本（人民币）"></el-table-column>
      <el-table-column prop="baseAds"
                       width="140"
                       label="广告费（人民币）"></el-table-column>
      <el-table-column prop="baseAssessment"
                       width="140"
                       label="测评费（人民币）"></el-table-column>
      <el-table-column prop="baseGrossProfit"
                       label="产品毛利"></el-table-column>
      <el-table-column prop="baseGrossProfitRate"
                       width="100"
                       label="产品毛利率"></el-table-column>
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
          label: '渠道SKU',
          value: 'channel',
          inputType: 'el-input'
        },
        {
          label: '自定义SKU',
          value: 'date',
          inputType: 'el-input'
        },
        {
          label: '产品分类',
          value: 'category',
          inputType: 'el-input'
        },
        {
          label: '负责人',
          value: 'userId',
          inputType: 'el-input'
        },
        {
          label: '时间范围',
          value: 'planDate,planDateEnd',
          inputType: 'el-daterange'
        }
      ],
      dataForm: {},
      dataList: [],
      dataListLoading: false,
      dataListSelections: [],
      editorVisible: false,
      dataRule: {
        channelId: [{
          required: true,
          message: '必填项',
          trigger: 'change'
        }]
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
    // 获取数据列表
    getDataList (val) {
      // 有必填字段，先校验
      this.$refs['dataForm'].validate(valid => {
        if (valid) {
          if (val) {
            this.paginationData.currPage = val
          }
          this.dataListLoading = true
          this.$http({
            url: this.$http.adornUrl('warehouse/whtransfercomp/list'),
            method: 'get',
            params:
              this.searchData == undefined
                ? this.paginationData
                : Object.assign({}, this.paginationData, this.searchData)
          }).then(({ data }) => {
            if (data && data.code === 0) {
            } else {
              this.paginationData.totalCount = 0
            }
            this.dataListLoading = false
          })
        } else {
          return false
        }
      })
    },
    resetHandle (formName) {
      this.$refs[formName].resetFields()
    },
    getDataUrl () {
      // 店铺账号
      this.$http
        .get(this.$http.adornUrl('list/combobox/ownChannel'), {
          params: { platformType: '' }
        })
        .then(({ data }) => {
          this.accountOptions = data.list
        })
    },
    // 多选
    selectionChangeHandle (val) {
      this.dataListSelections = val
    },
    fbaReceivedExport () {
      // 有必填字段，先校验
      this.$refs['dataForm'].validate(valid => {
        if (valid) {

        }
      })
    }
  }
}
</script>

