<template>
  <el-dialog :title="!dataForm.id ? '供应商新增' : '供应商修改'"
             :close-on-click-modal="false"
             :visible.sync="visible"
             @close="$refs['dataForm'].resetFields()"
             append-to-body>
    <el-form :model="dataForm"
             :rules="dataRule"
             ref="dataForm"
             label-width="110px">
      <el-row>
        <el-badge class="item">基础信息：</el-badge>
      </el-row>
      <el-row>
        <el-col :span="12">
          <el-form-item label="供应商编码"
                        prop="code">
            <el-input v-model="dataForm.code"
                      placeholder="为空时系统自动生成，可手工修改"></el-input>
          </el-form-item>
          <el-form-item label="付款方式"
                        prop="dictPayMode">
            <select-all v-model="dataForm.dictPayMode"
                        :listDataOption="dictPayModeOptions"
                        data-value="key"
                        data-label="value"></select-all>
          </el-form-item>
          <el-form-item label="预付比例"
                        prop="prePercent">
            <el-input v-model="dataForm.prePercent"
                      type="Number"
                      @mousewheel.native.prevent></el-input>
          </el-form-item>
          <el-form-item label="款到发货"
                        prop="payDelivery">
            <el-input v-model="dataForm.payDelivery"
                      type="Number"
                      @mousewheel.native.prevent></el-input>
          </el-form-item>
          <el-form-item label="货到付款">
            <el-col :span="9">
              <el-form-item prop="cashDelivery">
                <el-input v-model="dataForm.cashDelivery"
                          type="Number"
                          @mousewheel.native.prevent></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="9">
              <el-form-item label=""
                            prop="day">
                <el-input v-model="dataForm.day"
                          type="Number"
                          @mousewheel.native.prevent></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="2">
              <label>天</label>
            </el-col>
          </el-form-item>
          <el-form-item label="月结">
            <el-col :span="9">
              <el-form-item prop="monthStatement">
                <el-input v-model="dataForm.monthStatement"
                          type="Number"
                          @mousewheel.native.prevent></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="9">
              <el-form-item label=""
                            prop="month">
                <el-input v-model="dataForm.month"
                          type="Number"
                          @mousewheel.native.prevent></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="2">
              <label>天</label>
            </el-col>
          </el-form-item>
          <!-- 账期 -->
          <el-form-item label="账期(天)"
                        prop="accountPeriodNum">
            <el-input v-model="dataForm.accountPeriodNum"
                      type="Number"
                      @mousewheel.native.prevent></el-input>
          </el-form-item>
          <el-form-item label="网络链接"
                        prop="url">
            <el-input v-model="dataForm.url"></el-input>
          </el-form-item>

          <el-form-item label="对应结算公司"
                        prop="srcCompId">
            <select-all v-model="dataForm.srcCompId"
                        :listDataOption="compIdOption"
                        data-value="orgId"
                        data-label="name"
                        placeholder="针对跨公司结算业务需指定对应结算公司"></select-all>
          </el-form-item>
          <el-form-item label="备注"
                        prop="remark">
            <textarea-all v-model="dataForm.remark"></textarea-all>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="供应商名称"
                        prop="name">
            <el-input v-model="dataForm.name"></el-input>
          </el-form-item>
          <el-form-item label="采购方式"
                        prop="dictPurchaseMode">
            <select-all v-model="dataForm.dictPurchaseMode"
                        :listDataOption="dictPurchaseModeOptions"
                        data-value="key"
                        data-label="value"></select-all>
          </el-form-item>
          <el-form-item label="公司地址"
                        prop="companyAddress">
            <textarea-all v-model="dataForm.companyAddress"></textarea-all>
          </el-form-item>
          <el-form-item label="发货地址"
                        prop="shippingAddress">
            <textarea-all v-model="dataForm.shippingAddress"></textarea-all>
          </el-form-item>
          <el-form-item label="采购类型"
                        prop="dictPurchaseType">
            <select-all v-model="dataForm.dictPurchaseType"
                        :listDataOption="dictPurchaseTypeOptions"
                        data-value="key"
                        data-label="value"></select-all>
          </el-form-item>
          <el-form-item label="合作状态"
                        prop="dictSupplierStatus">
            <select-all v-model="dataForm.dictSupplierStatus"
                        :listDataOption="dictSupplierStatusOptions"
                        data-value="key"
                        data-label="value"></select-all>
          </el-form-item>
          <el-form-item label="联系人"
                        prop="contact">
            <el-input v-model="dataForm.contact"></el-input>
          </el-form-item>
          <el-form-item label="联系电话"
                        prop="contactPhone">
            <el-input v-model="dataForm.contactPhone"></el-input>
          </el-form-item>
          <el-form-item label="联系邮箱"
                        prop="contactEmail">
            <el-input v-model="dataForm.contactEmail"></el-input>
          </el-form-item>

        </el-col>
      </el-row>
      <el-row>
        <el-badge class="item">财务信息：</el-badge>
      </el-row>
      <el-row>
        <el-col :span="12">
          <!-- 是否开票 -->
          <el-form-item label="是否开票"
                        prop="usedInvoice">
            <el-radio-group v-model="dataForm.supplierBank.usedInvoice">
              <el-radio :label="true">是</el-radio>
              <el-radio :label="false">否</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="开票方式"
                        prop="dictInvoiceType">
            <select-all v-model="dataForm.supplierBank.dictInvoiceType"
                        :listDataOption="dictInvoiceTypeOptions"
                        data-value="key"
                        data-label="value"></select-all>
          </el-form-item>
          <el-form-item label="税率"
                        prop="supplierBank.taxRate">
            <el-input v-model="dataForm.supplierBank.taxRate"></el-input>
          </el-form-item>
          <el-form-item label="结算币别"
                        prop="currencyId">
            <select-all v-model="dataForm.supplierBank.currencyId"
                        :listDataOption="currencyIdOptions"
                        data-value="id"
                        data-label="name"></select-all>
          </el-form-item>
          <el-form-item label="状态"
                        size="mini"
                        prop="bUsed">
            <el-radio-group v-model="dataForm.bUsed">
              <el-radio :label="false">禁用</el-radio>
              <el-radio :label="true">正常</el-radio>
            </el-radio-group>
          </el-form-item>

        </el-col>
        <el-col :span="12">
          <el-form-item label="账号类型"
                        prop="dictBankAccountType">
            <select-all v-model="dataForm.supplierBank.dictBankAccountType"
                        :listDataOption="dictBankAccountTypeOptions"
                        data-value="key"
                        data-label="value"></select-all>
          </el-form-item>
          <el-form-item label="开户行"
                        prop="accountBank">
            <el-input v-model="dataForm.supplierBank.accountBank"></el-input>
          </el-form-item>
          <el-form-item label="银行账号"
                        prop="accountNum">
            <el-input v-model="dataForm.supplierBank.accountNum"></el-input>
          </el-form-item>
          <el-form-item label="账户名称"
                        prop="accountName">
            <el-input v-model="dataForm.supplierBank.accountName"></el-input>
          </el-form-item>

        </el-col>
      </el-row>
    </el-form>
    <span slot="footer"
          class="dialog-footer">
      <el-button @click="cancel('dataForm')"><i class="iconfont erp-icon-quxiao"></i>取消</el-button>
      <el-button type="primary"
                 @click="dataFormSubmit()"><i class="iconfont erp-icon-queding"></i>确定</el-button>
    </span>
  </el-dialog>
</template>
<script>
import selectAll from '@/components/erp-select/select-all'
import { isEmail, isMobile } from '@/utils/validate'
import { dictPayMode, dictPurchaseMode, dictPurchaseType, dictBankAccountType, dictSupplierStatus, basicBasicsupplierQueryCurrency, sysorganizationselect } from '@/api/common/common.api'
import { basicSupplierInfo, basicSupplierSave, basicSupplierUpdate } from '@/api/basic/basic.js'
// 备注组件
import textareaAll from '@/components/erp-input/textarea-all'
export default {
  name: 'basicsupplierAddOrUpdate',
  components: {
    selectAll,
    textareaAll
  },
  data () {
    const betweenInt = (min, max) => (rule, value, callback) => {
      const isBetween = value >= min && value <= max
      const isInt = /^0[1-9]$|^[1-9][0-9]?$|^00?\.(?:0[1-9]|[1-9][0-9]?)$|^(?:0[1-9]|[1-9][0-9]?)\.[0-9]$/.test(
        value
      )
      if (value && !(isBetween && isInt)) {
        callback(new Error(`${min}到${max}的两位小数`))
      } else {
        callback()
      }
    }
    const betweenTemp = (min, max) => (rule, value, callback) => {
      const isBetween = value >= min && value <= max
      const isInt = /^[0|1](\.[0-9]{1,2}){0,1}$/.test(
        value
      )
      if (value && !(isBetween && isInt)) {
        callback(new Error(`${min}到${max}之间最多两位小数`))
      } else {
        callback()
      }
    }
    // 不包括0的正整数（并且不是必填）
    var validateInteger = (rule, value, callback) => {
      if (!/^[1-9]\d*$/.test(value) && !!value) {
        callback(new Error('正整数'))
      } else {
        callback()
      }
    }
    return {
      visible: false,
      currencyIdOptions: '',
      dictPayModeOptions: '',
      dictPurchaseModeOptions: '',
      dictPurchaseTypeOptions: '',
      dictBankAccountTypeOptions: '',
      dictInvoiceTypeOptions: '',
      dictSupplierStatusOptions: '',
      compIdOption: [], // 对应结算公司
      dataForm: {
        monthStatement: '',
        day: '',
        month: '',
        cashDelivery: '',
        payDelivery: '',
        prePercent: '',
        id: '',
        code: '',
        name: '',
        dictPayMode: '',
        dictPurchaseMode: '',
        dictPurchaseType: '',
        url: '',
        contact: '',
        contactPhone: '',
        contactEmail: '',
        accountPeriodNum: '',
        companyAddress: '',
        shippingAddress: '',
        remark: '',
        dictSupplierStatus: '',
        taxRate: '',
        srcCompId: '',
        // 是否开票
        bUsed: true,
        supplierBank: {
          dictBankAccountType: '',
          usedInvoice: true,
          accountBank: '',
          accountNum: '',
          accountName: '',
          dictInvoiceType: '',
          // 币别
          currencyId: '',
          taxRate: null
        }
      },
      dataRule: {
        name: [
          { required: true, message: '供应商名称不能为空', trigger: 'blur' }
        ],
        accountPeriodNum: [
          // { required: true, message: '必填项', trigger: 'change' },
          { pattern: /^[+]{0,1}(\d+)$/, message: '正整数', trigger: 'change' }
        ],
        'supplierBank.taxRate': [
          { validator: betweenInt(0.01, 0.99), trigger: 'change' }
        ],
        prePercent: [{ validator: betweenTemp(0, 1), trigger: 'blur' }],
        payDelivery: [{ validator: betweenTemp(0, 1), trigger: 'blur' }],
        cashDelivery: [{ validator: betweenTemp(0, 1), trigger: 'blur' }],
        monthStatement: [{ validator: betweenTemp(0, 1), trigger: 'blur' }],
        day: [
          { pattern: /^[+]{0,1}(\d+)$/, message: '正整数', trigger: 'change' }
        ],
        month: [
          { pattern: /^[+]{0,1}(\d+)$/, message: '正整数', trigger: 'change' }
        ],
        isInteger: [
          { pattern: /^[1-9]\d*$/, message: '正整数', trigger: 'change' }
        ],
        isInteger1: [
          { validator: validateInteger, trigger: 'change' }
        ]
      }
    }
  },
  created () {
    // 付款方式
    dictPayMode().then(data => { this.dictPayModeOptions = data.fontMaps })
    // 采购方式
    dictPurchaseMode().then(data => { this.dictPurchaseModeOptions = data.fontMaps })
    // 采购类型
    dictPurchaseType().then(data => { this.dictPurchaseTypeOptions = data.fontMaps })
    // 账号类型
    dictBankAccountType().then(data => { this.dictBankAccountTypeOptions = data.fontMaps })
    // 开票方式
    dictBankAccountType().then(data => { this.dictInvoiceTypeOptions = data.fontMaps })
    // 合作状态
    dictSupplierStatus().then(data => { this.dictSupplierStatusOptions = data.fontMaps })
    // 结算币别
    basicBasicsupplierQueryCurrency().then(data => { this.currencyIdOptions = data.currency })
    // 结算公司
    sysorganizationselect().then(data => { this.compIdOption = data.companyList })
  },
  methods: {
    // 关闭清除本次缓存
    clearCache (formName) {
      this.$refs[formName].resetFields()
      this.dataForm.supplierBank = {}
      this.visible = false
    },
    // 弹窗关闭之前
    handleClose (done) {
      this.clearCache('dataForm')
      done()
    },

    // 取消按钮
    cancel (formName) {
      this.clearCache(formName)
    },
    init (id, type) {
      this.dataForm.addTime = ''
      this.dataForm.addUser = ''
      this.dataForm.updTime = ''
      this.dataForm.updUser = ''
      // 清缓存
      this.dataForm.supplierBank = {
        dictBankAccountType: '',
        usedInvoice: true,
        accountBank: '',
        accountNum: '',
        accountName: '',
        dictInvoiceType: '',
        // 币别
        currencyId: '',
        taxRate: null
      }
      this.visible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].resetFields()
        this.dataForm.supplierBank.usedInvoice = true
        this.dataForm.id = id
        if (this.dataForm.id) {
          basicSupplierInfo(this.dataForm.id, true).then(data => {
            this.dataForm = data.basicSupplier
          }).catch(e => {
            this.notifyError(e.data.msg)
          })
        }
      })
    },

    // 新增/编辑
    basicsupplierHttp () {
      // 新增
      if (!this.dataForm.id) {
        basicSupplierSave(this.dataForm).then((data) => {
          this.clearCache('dataForm')
          this.$emit('refreshDataList')
          this.visible = false
          this.notifySuccess('操作成功')
        }).catch((error) => {
          this.notifyError(error.data.msg)
        })
      }
      // 编辑
      if (this.dataForm.id) {
        basicSupplierUpdate(this.dataForm).then((data) => {
          this.clearCache('dataForm')
          this.$emit('refreshDataList')
          this.visible = false
          this.notifySuccess('操作成功')
        }).catch((error) => {
          this.notifyError(error.data.msg)
        })
      }
    },

    // 表单提交
    dataFormSubmit: _.debounce(
      async function dataFormSubmit () {
        this.$refs['dataForm'].validate(valid => {
          if (valid) {
            if (this.dataForm.srcCompId) {
              if (!this.dataForm.supplierBank.currencyId) {
                this.$notify.error({
                  title: '错误',
                  message: '请输入结算币别',
                  duration: 5000
                })
                return
              }
            }
            // 校验付款比例是否等于1
            let sumNum = (Number(this.dataForm.prePercent) * 100 + Number(this.dataForm.payDelivery) * 100 + Number(this.dataForm.cashDelivery) * 100 + Number(this.dataForm.monthStatement) * 100) / 100
            if (sumNum > 1 && sumNum !== 0) {
              this.$notify.warning({
                title: '警告',
                message: `[预付比例]+[款到发货]+[货到付款]+[月结]之和小于等于1`,
                duration: 3000
              })
              return
            }
            // 验证邮箱格式
            if (this.dataForm.contactEmail) {
              var filter = /^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/
              if (!filter.test(this.dataForm.contactEmail.trim())) {
                this.$notify.error({
                  title: '错误',
                  message: '邮箱格式错误',
                  duration: 5000
                })
              }
            }
            this.basicsupplierHttp()
          }
        })
      }, 1000, {
        leading: true,
        trailing: false
      }
    )
  }
}
</script>
<style scoped>
/* 误删 */
.item {
  font-size: 16px;
  font-weight: 600;
}
</style>