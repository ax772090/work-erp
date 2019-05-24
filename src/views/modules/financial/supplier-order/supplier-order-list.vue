<template>
  <div class="mt-10">
    <el-form :model="dataForm"
             :inline="true"
             :rules="dataRule"
             ref="dataForm">
      <el-row>
        <el-form-item label=" "
                      prop="dateRange"
                      class="date-picker">
          <el-date-picker v-model="dataForm.dateRange"
                          value-format="yyyy-MM-dd"
                          type="daterange"
                          range-separator="至"
                          start-placeholder="开始日期"
                          end-placeholder="结束日期">
          </el-date-picker>
          <!-- <el-date-picker v-model="dataForm.billDate"
                          type="date"
                          value-format="yyyy-MM-dd"
                          placeholder="年/月/日"></el-date-picker> -->
        </el-form-item>
        <el-form-item label=""
                      prop="compId">
          <select-all v-model="dataForm.compId"
                      :listDataOption="compIdOption"
                      data-value="orgId"
                      data-label="name"
                      placeholder='选择结算公司'></select-all>
        </el-form-item>
        <el-form-item label=""
                      prop="supplierId">
          <select-seach v-model="dataForm.supplierId"
                        httpUrl="basic/basicsupplier/list-used?b_used=true"
                        httpMethod="get"
                        data-label="name"
                        data-value="id"
                        data-source="list"
                        placeholder='选择供应商'></select-seach>
        </el-form-item>
        <el-form-item label=""
                      prop="currencyId">
          <select-all v-model="dataForm.currencyId"
                      :listDataOption="currencyIdOptions"
                      data-value="id"
                      data-label="name"
                      placeholder="选择结算币种"></select-all>
        </el-form-item>
        <el-form-item>
          <el-button type="primary"
                     @click="submitForm('dataForm')"><i class="iconfont erp-icon-sousuo"></i>搜索</el-button>
          <el-button type="primary"
                     @click="resetForm('dataForm')"><i class="iconfont erp-icon-chongzhi"></i>重置</el-button>
        </el-form-item>

      </el-row>
      <el-row>
        <el-button v-if="isAuth('fin:supplierbillsum:download')"
                   type="primary"
                   @click="download()"><i class="iconfont erp-icon-xiazai"></i>下载
        </el-button>
      </el-row>
    </el-form>
    <el-table stripe
              border
              highlight-current-row
              max-height="800"
              :data="dataList"
              v-loading="dataListLoading">
      <el-table-column prop="compName"
                       label="结算公司"
                       width="260px"></el-table-column>
      <el-table-column prop="supplierCode"
                       label="供应商代码"
                       width="100px;"></el-table-column>
      <el-table-column prop="supplierName"
                       label="供应商名称"
                       width="260px"></el-table-column>
      <el-table-column prop="currencyName"
                       label="结算币别"
                       width="150px"></el-table-column>
      <el-table-column prop="qcAmount"
                       label="期初余额"
                       sortable></el-table-column>
      <el-table-column prop="payableAmountHJ"
                       label="应付金额"
                       sortable></el-table-column>
      <el-table-column prop="adjustAmountHJ"
                       label="调整金额"
                       sortable></el-table-column>
      <el-table-column prop="paidAmountHJ"
                       label="已付金额"
                       sortable></el-table-column>
      <el-table-column prop="surplusAmount"
                       label="余额"
                       sortable></el-table-column>
    </el-table>
    <el-row>
      <pagination-all v-model="paginationData"
                      @paginationChangeHandle="getDataList"></pagination-all>
    </el-row>
  </div>
</template>
<script>
import selectSeach from '@/components/erp-select/select-seach'
import selectAll from '@/components/erp-select/select-all'
import paginationAll from '@/components/erp-pagination/pagination-all'

export default {
  components: {
    selectSeach,
    selectAll,
    paginationAll
  },
  created () {
    // 结算公司
    this.$http
      .get(this.$http.adornUrl('sys/organization/select'))
      .then(({ data }) => {
        this.compIdOption = data.companyList
      })
    // 结算币种
    this.$http
      .get(this.$http.adornUrl('/basicData/queryAllCurrency'))
      .then(({ data }) => {
        this.currencyIdOptions = data.currencyList
      })
  },
  data () {
    return {
      dataListLoading: false,
      dataList: [],
      compIdOption: [],
      currencyIdOptions: [],
      dataForm: {
        dateRange: [],
        supplierId: '',
        compId: '',
        currencyId: ''
      },
      dataRule: {
        dateRange: [{ required: true, message: '必填项', trigger: 'change' }]
        // supplierId: [{ required: true, message: '必填项', trigger: 'change' }],
        // compId: [{ required: true, message: '必填项', trigger: 'change' }],
        // currencyId: [{ required: true, message: '必填项', trigger: 'change' }]
      },
      paginationData: {
        // 当前页数
        currPage: 1,
        // 一页显示的条数
        pageSize: 10,
        // 总条数
        totalCount: 0,
        // 总页数
        totalPage: 0
      }
    }
  },
  methods: {
    // 获取数据列表
    getDataList (val) {
      if (val != undefined) {
        this.paginationData.currPage = val
      }
      this.dataListLoading = true
      this.$http({
        url: this.$http.adornUrl('fin/supplierbillsum/list'),
        method: 'post',
        data: Object.assign(
          {},
          this.paginationData,
          this.dataForm
        )
      }).then(({ data }) => {
        if (data && data.code === 0) {
          this.dataList = data.pageList.dataList
          this.paginationData.totalCount = data.pageList.page.totalCount
        } else {
          this.dataList = []
          this.paginationData.totalCount = 0
          this.$notify.error({
            title: '失败',
            message: data.msg,
            duration: 5000
          })
        }
        this.dataListLoading = false
      })
    },
    download () {
      this.$refs['dataForm'].validate(valid => {
        if (valid) {
          window.open(this.$http.tokens(`fin/supplierbillsum/download`, this.dataForm))
        } else {
          return false
        }
      })
    },
    submitForm (formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.getDataList(1)
        } else {
          return false
        }
      })
    },
    resetForm (formName) {
      this.$refs[formName].resetFields()
    }
  }
}
</script>
<style lang="scss">
.date-picker {
  .el-form-item__label {
    padding: 0;
  }
}
</style>
