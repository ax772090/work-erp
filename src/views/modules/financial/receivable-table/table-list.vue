<template>
  <div>
    <el-row class="mar10">
      <el-form :model="searchData"
               :rules="rules"
               :inline='true'
               ref="searchData"
               class="demo-ruleForm">
        <el-form-item label=" "
                      class="date-picker"
                      prop="dateRange">
          <el-date-picker v-model="searchData.dateRange"
                          value-format="yyyy-MM-dd"
                          type="daterange"
                          range-separator="至"
                          start-placeholder="开始日期"
                          end-placeholder="结束日期">
          </el-date-picker>
        </el-form-item>
        <el-form-item>
          <select-all v-model="searchData.compId"
                      :listDataOption="compOptions"
                      data-value="orgId"
                      data-label="name"
                      placeholder="请选择结算公司"></select-all>
        </el-form-item>
        <el-form-item>
          <select-seach v-model="searchData.supplierId"
                        httpUrl="basic/basicsupplier/list-used?b_used=true"
                        httpMethod="get"
                        data-label="name"
                        data-value="id"
                        data-source="list"
                        placeholder='请选择供应商'
                        isSelectChange="true"></select-seach>
        </el-form-item>
        <el-form-item>
          <select-all v-model="searchData.currencyId"
                      :listDataOption="currencyCodeOptions"
                      data-value="id"
                      data-label="name"
                      placeholder="请选择币种"></select-all>
        </el-form-item>
        <el-form-item>
          <el-button type="primary"
                     @click="getDataList(1)">
            搜索
          </el-button>
          <el-button type="primary"
                     @click="resetData">
            重置
          </el-button>
        </el-form-item>
      </el-form>
    </el-row>
    <el-row>
      <el-button type="primary"
                 v-if="isAuth('fin:finpopayable:creditexport')"
                 @click="exportFile">
        导出
      </el-button>
      <el-button type="primary"
                 v-if="isAuth('fin:finpopayable:creditprint')"
                 @click="print">
        打印对账单
      </el-button>
    </el-row>
    <el-table border
              max-height="800"
              :row-class-name="tableRowClassName"
              :data="dataList"
              v-loading="dataListLoading">
      <el-table-column prop="compName"
                       sortable
                       label="结算公司"></el-table-column>
      <el-table-column prop="supplierCode"
                       sortable
                       width="110"
                       label="供应商代码"></el-table-column>
      <el-table-column prop="supplierName"
                       label="供应商名称"
                       sortable></el-table-column>
      <el-table-column prop="deptName"
                       width="120"
                       sortable
                       label="部门"></el-table-column>
      <el-table-column prop="userName"
                       width="100"
                       label="业务员"
                       sortable></el-table-column>
      <el-table-column prop="date"
                       width="100"
                       label="单据日期"
                       sortable></el-table-column>
      <el-table-column prop="docTypeName"
                       width="100"
                       label="单据类型"
                       sortable></el-table-column>
      <el-table-column prop="docCode"
                       width="140"
                       label="单据编号"
                       sortable></el-table-column>
      <el-table-column prop="remarks"
                       min-width="100"
                       show-overflow-tooltip
                       label="备注"
                       sortable></el-table-column>
      <el-table-column prop="currencyName"
                       width="100"
                       label="结算币别"
                       sortable></el-table-column>
      <el-table-column prop="payableAmount"
                       width="100"
                       label="应付金额"
                       sortable></el-table-column>
      <el-table-column prop="adjustAmount"
                       label="调整金额"
                       width="100"
                       sortable></el-table-column>
      <el-table-column prop="paidAmount"
                       width="100"
                       label="已付金额"
                       sortable></el-table-column>
      <el-table-column prop="surplusAmount"
                       width="100"
                       label="余额"
                       sortable></el-table-column>

    </el-table>
    <!-- 分页 -->
    <el-row>
      <pagination-all v-model="paginationData"
                      @paginationChangeHandle="getDataList"></pagination-all>
    </el-row>
    <!-- 打印选择 -->
    <table-print ref="tablePrint"></table-print>
  </div>
</template>
<script>
import selectAll from '@/components/erp-select/select-all'
import selectSeach from '@/components/erp-select/select-seach'
import paginationAll from '@/components/erp-pagination/pagination-all'
// 打印选择
import tablePrint from './table-print'
import { initData } from '@/mixins/initData.js'
export default {
  mixins: [initData],
  components: {
    tablePrint,
    selectAll,
    selectSeach,
    paginationAll
  },
  data () {
    return {
      searchData: {
        dateRange: '',
        compId: '',
        supplierId: '',
        currencyId: ''

      },
      compOptions: [],  // 结算公司
      dataList: [],
      dataListLoading: false,
      currencyCodeOptions: [],  // 结算币种
      rules: {
        dateRange: [
          { required: true, message: '必填项', trigger: 'blur' }
        ]
      }
    }
  },
  created () {
    // 结算公司
    this.$http
      .get(this.$http.adornUrl('sys/organization/select'))
      .then(({ data }) => {
        this.compOptions = data.companyList
      })
    // 结算币种
    this.$http.get(this.$http.adornUrl('/basicData/queryAllCurrency')).then(({ data }) => {
      this.currencyCodeOptions = data.currencyList
    })
  },
  methods: {
    // 获取数据列表
    getDataList (val) {
      this.$refs['searchData'].validate((valid) => {
        if (valid) {
          if (val) {
            this.paginationData.currPage = val
          }
          this.dataListLoading = true
          this.$http({
            url: this.$http.adornUrl('fin/finpopayable/creditlist'),
            method: 'post',
            data:
              this.searchData === undefined ? this.paginationData : Object.assign({}, this.paginationData, this.searchData)
          }).then(({ data }) => {
            if (data && data.code === 0) {
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
    print () {
      this.$refs.tablePrint.init()
    },
    // 给小计行背景色
    tableRowClassName ({ row, rowIndex }) {
      if (row.docTypeName === '小计') {
        return 'success-row'
      }
      return ''
    },
    // 重置
    resetData () {
      this.searchData = {}
    },
    // 导出
    exportFile () {
      this.$refs['searchData'].validate(valid => {
        if (valid) {
          this.searchData.dateRange.join()
          this.$http({
            url: this.$http.adornUrl('fin/finpopayable/creditlist'),
            method: 'post',
            data: this.searchData === undefined ? this.paginationData : Object.assign({}, this.paginationData, this.searchData)
          }).then(({ data }) => {
            if (data && data.code === 0) {
              if (data.pageList.dataList.length > 0) {
                window.open(
                  this.$http.tokens(
                    'fin/finpopayable/creditexport',
                    this.searchData
                  )
                )
              } else {
                this.$notify.warning({
                  title: '提示',
                  message: '暂无可导的数据！',
                  duration: 5000
                })
              }
            } else {
              this.$notify.warning({
                title: '提示',
                message: '暂无可导的数据！',
                duration: 5000
              })
            }
          })
        }
      })
    }
  }
}
</script>
<style lang="scss" scoped>
.mar10 {
  margin-top: 10px;
}
.marr10 {
  margin-right: 10px;
}
</style>
<style lang="scss">
.date-picker {
  .el-form-item__label {
    padding: 0;
  }
}
.el-table .success-row {
  background-color: #f0f9eb;
  font-weight: 700;
}
</style>
