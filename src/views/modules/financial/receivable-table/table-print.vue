<template>
  <div>
    <el-dialog title="打印选择"
               :visible.sync="dialogVisible"
               :close-on-click-modal="false"
               width="30%"
               @close="$refs['dataForm'].resetFields()">
      <el-form :model="dataForm"
               :rules="rules"
               ref="dataForm"
               label-width="100px"
               class="demo-ruleForm">
        <el-form-item label="对账月份"
                      :rules="rules.isRequired"
                      prop="month">
          <el-date-picker v-model="dataForm.month"
                          value-format="yyyy-MM"
                          type="month"
                          placeholder="选择月">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="结算公司"
                      :rules="rules.isRequired"
                      prop="compId">
          <select-all v-model="dataForm.compId"
                      :listDataOption="compIdOption"
                      data-value="orgId"
                      data-label="name"
                      placeholder=""></select-all>
        </el-form-item>
        <el-form-item label="供应商"
                      :rules="rules.isRequired"
                      prop="supplierId">
          <select-seach v-model="dataForm.supplierId"
                        httpUrl="basic/basicsupplier/list-used?b_used=true"
                        httpMethod="get"
                        data-label="name"
                        data-value="id"
                        data-source="list"
                        placeholder=''
                        isSelectChange="true"></select-seach>
        </el-form-item>
        <el-form-item label="结算币种"
                      :rules="rules.isRequired"
                      prop="currencyId">
          <select-all v-model="dataForm.currencyId"
                      :listDataOption="currencyCodeOptions"
                      data-value="id"
                      data-label="name"
                      placeholder=""></select-all>
        </el-form-item>
      </el-form>
      <div slot="footer">
        <el-button type="primary"
                   @click="download('dataForm')">下载</el-button>
        <el-button type="primary"
                   @click="print('dataForm')">打印</el-button>
      </div>
      <!--打印详情 -->
      <print-detail ref="printDetail"></print-detail>
    </el-dialog>
  </div>
</template>
<script>
import selectAll from '@/components/erp-select/select-all'
import selectSeach from '@/components/erp-select/select-seach'
import printDetail from './print-detail'
export default {
  components: {
    selectAll,
    selectSeach,
    printDetail
  },
  data () {
    return {
      dialogVisible: false,
      dataForm: {
        month: '',
        compId: '',
        supplierId: '',
        currencyId: ''
      },
      compIdOption: [],  // 结算公司
      currencyCodeOptions: [], // 结算币种
      rules: {
        isRequired: [
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
        this.compIdOption = data.companyList
      })
    // 结算币种
    this.$http.get(this.$http.adornUrl('/basicData/queryAllCurrency')).then(({ data }) => {
      this.currencyCodeOptions = data.currencyList
    })
  },
  methods: {
    init () {
      this.dialogVisible = true
    },
    handleClose () {

    },
    // 下载
    download (dataForm) {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          this.$http({
            url: this.$http.adornUrl('fin/finpopayable/creditprint'),
            method: 'get',
            params: this.dataForm
          }).then(({ data }) => {
            if (data && data.code === 0) {
              window.open(
                this.$http.tokens(`fin/finpopayable/creditdownload`, this.dataForm)
              )
            } else {
              this.$notify.warning({
                title: '提示',
                message: data.msg,
                duration: 5000
              })
            }
          })
        }
      })
    },
    // 打印
    print (dataForm) {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          this.$http({
            url: this.$http.adornUrl('fin/finpopayable/creditprint'),
            method: 'get',
            params: this.dataForm
          }).then(({ data }) => {
            if (data && data.code === 0) {
              this.$refs.printDetail.init(data.AccountStatementDto)
            } else {
              this.$notify.error({
                title: '错误',
                message: data.msg,
                duration: 5000
              })
            }
            this.dataListLoading = false
          })
        }
      })
    }
  }
}
</script>
