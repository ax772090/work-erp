<!-- 亚马逊的赔偿报告（主表） -->
<template>
  <div class="mod-config">
    <el-form :model="searchForm"
             :rules="dataRule"
             ref="searchForm"
             label-width="80px">
      <el-row>
        <el-form-item label="店铺名称"
                      prop="channelId"
                      :rules="dataRule.isRequired">
          <select-all v-model="searchForm.channelId"
                      :listDataOption="channelIdOption"
                      data-value="id"
                      data-label="name"
                      :isSelectChange="true"
                      @selectChange="channelIdExchange"></select-all>
        </el-form-item>
        <!-- <el-form-item label="订单编号"
                      prop="code">
          <el-input placeholder="输入订单编号"
                    v-model="searchForm.code"
                    clearable></el-input>
        </el-form-item>
        <el-form-item label="时间范围"
                      prop="FBAShipmentID">
          <el-date-picker value-format="yyyy-MM-dd"
                          v-model="searchForm.dateValue"
                          type="daterange"
                          range-separator="至"
                          start-placeholder="开始日期"
                          end-placeholder="结束日期"></el-date-picker>
        </el-form-item> -->
      </el-row>
      <el-row>
        <erp-search-panel :searchOptions="searchOptions"
                          @search="getDataList(1)"
                          v-model="searchData"
                          :isResetHandle="true"
                          @resetHandle="resetHandle('searchForm')" />
      </el-row>
      <el-row>
        <!-- <el-button @click="getDataList(1)"
                   type="primary"><i class="iconfont erp-icon-sousuo"></i>搜索</el-button>
        <el-button @click="resetHandle()"
                   type="primary"><i class="iconfont erp-icon-chongzhi"></i>重置</el-button> -->
        <el-button @click="fbaReceivedExport()"
                   type="primary"
                   v-if="isAuth('mws:rptreimbursements:export')"><i class="iconfont erp-icon-daochu"></i>导出</el-button>
        <div class="grid-content-right">最近一次更新时间：{{update}}</div>
      </el-row>
    </el-form>
    <el-table stripe
              border
              highlight-current-row
              max-height="800"
              :data="dataList"
              v-loading="dataListLoading">
      <el-table-column label="账号"
                       width="150"
                       prop="sellerName"></el-table-column>
      <el-table-column prop="saleCompany"
                       label="销售公司"></el-table-column>
      <el-table-column prop="channelName"
                       label="店铺"></el-table-column>
      <el-table-column prop="approvalDate"
                       label="日期"></el-table-column>
      <el-table-column prop="reimbursementId"
                       label="赔偿编号"></el-table-column>
      <el-table-column prop="caseId"
                       label="问题编号"></el-table-column>
      <el-table-column prop="amazonOrderId"
                       width="120"
                       label="亚马逊订单编号"></el-table-column>
      <el-table-column prop="sku"
                       width="120"
                       label="sellsku"></el-table-column>
      <el-table-column prop="fnSku"
                       label="FNSKU"></el-table-column>
      <el-table-column prop="asin"
                       label="ASIN"></el-table-column>
      <el-table-column prop="productName"
                       :show-overflow-tooltip="true"
                       label="产品描述"></el-table-column>
      <el-table-column prop="condition"
                       label="状况"></el-table-column>
      <el-table-column prop="currencyUnit"
                       label="币种"></el-table-column>
      <el-table-column prop="amountPerUnit"
                       label="单品金额"></el-table-column>
      <el-table-column prop="amountTotal"
                       label="总金额"></el-table-column>
      <el-table-column prop="quantityReimbursedCash"
                       width="130"
                       label="赔偿数量【现金】"></el-table-column>
      <el-table-column prop="quantityReimbursedInventory"
                       width="130"
                       label="赔偿数量【库存】"></el-table-column>
      <el-table-column prop="quantityReimbursedTotal"
                       width="130"
                       label="赔偿数量【总计】"></el-table-column>

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
// 表头处理
import { renderHeaderUtil } from '@/utils/index.js'
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
      update: '',
      searchForm: {
        channelId: ''
      },
      channelIdOption: [], // 店铺账号
      // 下拉
      searchOptions: [
        {
          label: '订单编号',
          value: 'amazonOrderId',
          inputType: 'el-input'
        },
        {
          label: '赔偿编号',
          value: 'reimbursementId',
          inputType: 'el-input'
        },
        {
          label: 'sellsku',
          value: 'sku',
          inputType: 'el-input'
        },
        {
          label: '日期范围',
          value: 'dateValue',
          inputType: 'el-daterangeArr'
        }
      ],
      dataForm: {},
      dateValue: '', // 时间
      dataList: [],
      dataListLoading: false,
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
        this.channelIdOption = data.list
      })
  },
  methods: {
    // 表头内容过长处理
    renderHeader (h, g) {
      return renderHeaderUtil(h, g)
    },

    channelIdExchange () {
      this.getDataList(1)
    },
    // 获取数据列表
    getDataList (val) {
      this.$refs['searchForm'].validate(valid => {
        if (valid) {
          this.$set(this.searchData, 'channelId', this.searchForm.channelId)

          if (val) {
            this.paginationData.currPage = val
          }
          this.dataListLoading = true
          this.$http({
            url: this.$http.adornUrl('mws/rptreimbursements/list'),
            method: 'post',
            data: Object.assign({},
              this.paginationData,
              this.searchData == undefined ? {} : this.searchData)
          }).then(({ data }) => {
            if (data && data.code === 0) {
              this.dataList = data.pageList.dataList
              this.paginationData.totalCount = data.pageList.page.totalCount
              for (let i = 0; i < this.dataList.length; i++) {
                this.update = this.dataList[i].updTime
              }
            } else {
              this.paginationData.totalCount = 0
            }
            this.dataListLoading = false
          })
        }
      })
    },

    // 重置
    resetHandle (formName) {
      this.$refs[formName].resetFields()
    },
    // 导出
    fbaReceivedExport () {
      this.$refs['searchForm'].validate(valid => {
        if (valid) {
          let obj
          if (this.searchData) {
            obj = Object.assign({}, this.searchForm, this.searchData)
          }
          window.open(
            this.$http.tokens('mws/rptreimbursements/export', obj)
          )
        }
      })
    }
  }
}
</script>


