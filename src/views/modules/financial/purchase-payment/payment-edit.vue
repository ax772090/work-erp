<template>
  <el-dialog :title="dialogTitle"
             :close-on-click-modal="false"
             :visible.sync="visible"
             @close="$refs['dataForm'].resetFields()"
             width="90%">
    <!-- 审核头 -->
    <approval-new v-model="approvalData"
                  v-if='isApproval'></approval-new>
    <el-form :model="dataForm"
             ref="dataForm"
             :rules="dataRule"
             label-width="110px">
      <el-row>
        <el-col :span="6">
          <el-form-item label="单据类型"
                        :rules="dataRule.isRequired"
                        prop="docType">
            <select-all v-model="dataForm.docType"
                        :listDataOption="docTypeOption"
                        :isDisabled="isCheck || isApproval"
                        data-value="key"
                        data-label="value"
                        :isSelectChange="true"
                        @selectChange="docTypeChange"></select-all>
          </el-form-item>
          <el-form-item label="付款公司"
                        :rules="dataRule.isRequired"
                        prop="compId">
            <select-all v-model="dataForm.compId"
                        :listDataOption="compIdOption"
                        :isDisabled="isCheck || isApproval || dataForm.finPoPaymentDetailList.length>0"
                        data-value="orgId"
                        data-label="name"></select-all>
          </el-form-item>
          <el-form-item label="供应商"
                        :rules="dataRule.isRequired"
                        prop="supplierId">
            <select-seach v-model="dataForm.supplierId"
                          httpUrl="basic/basicsupplier/list-used"
                          requestParamsKey="name"
                          httpMethod="get"
                          data-label="name"
                          :isDisabled="isCheck || isApproval || dataForm.finPoPaymentDetailList.length>0"
                          data-value="id"
                          data-source="list"
                          @selectChange="supplierIdChange"></select-seach>
          </el-form-item>
          <el-form-item label="付款方式"
                        :rules="dataRule.isRequired"
                        prop="paymentMode">
            <select-all v-model="dataForm.paymentMode"
                        :listDataOption="paymentModeOption"
                        :isDisabled="isCheck || isApproval"
                        data-value="key"
                        data-label="value"></select-all>
          </el-form-item>
          <el-form-item label="采购合同号"
                        prop="contractCodeList">
            <select-seach v-model="dataForm.contractCodeList"
                          httpUrl="fin/finpopayment/getcontractcode"
                          httpMethod="get"
                          requestParamsKey="contractCode"
                          :requestParams="{supplierId: dataForm.supplierId}"
                          data-label="contractCode"
                          data-value="contractCode"
                          data-source="list"
                          :showName='true'
                          :isDisabled="isCheck || isApproval"
                          :isMultiple="true"
                          :isSelectChange="true"
                          @selectChange="contractCodeHander"></select-seach>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="结算币种"
                        :rules="dataRule.isRequired"
                        prop="currencyId">
            <select-all v-model="dataForm.currencyId"
                        :listDataOption="currencyIdOptions"
                        :isDisabled="isCheck || isApproval || dataForm.finPoPaymentDetailList.length>0"
                        data-value="id"
                        data-label="name"></select-all>
          </el-form-item>
          <el-form-item label="银行账号"
                        prop="accountNum">
            <el-input v-model="dataForm.accountNum"
                      :disabled="isCheck || isApproval"></el-input>
          </el-form-item>
          <el-form-item label="账号名称"
                        prop="accountName">
            <el-input v-model="dataForm.accountName"
                      :disabled="isCheck || isApproval"></el-input>
          </el-form-item>
          <el-form-item label="账号类型"
                        prop="bankAccountType">
            <select-all v-model="dataForm.bankAccountType"
                        :listDataOption="bankAccountTypeOption"
                        :isDisabled="isCheck || isApproval"
                        data-value="key"
                        data-label="value"></select-all>
          </el-form-item>
          <el-form-item label="开户行"
                        prop="accountBank">
            <el-input v-model="dataForm.accountBank"
                      :disabled="isCheck || isApproval"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="申请日期"
                        :rules="dataRule.isRequired"
                        prop="requestDate">
            <el-date-picker v-model="dataForm.requestDate"
                            type="date"
                            :disabled="isCheck || isApproval"
                            value-format="yyyy-MM-dd"></el-date-picker>
          </el-form-item>
          <el-form-item label="结算日期"
                        :rules="dataRule.isRequired"
                        prop="settleDate">
            <el-date-picker v-model="dataForm.settleDate"
                            type="date"
                            :disabled="isCheck || isApproval"
                            value-format="yyyy-MM-dd"></el-date-picker>
          </el-form-item>
          <el-form-item label="付款日期"
                        :rules="dataRule.isRequired"
                        prop="payDate">
            <el-date-picker v-model="dataForm.payDate"
                            :disabled="isCheck"
                            type="date"
                            value-format="yyyy-MM-dd"></el-date-picker>
          </el-form-item>
          <el-form-item label="付款金额"
                        ref="againValue"
                        :rules="isPayAmount ? dataRule.isNO : dataRule.isNatural"
                        prop="payAmount">
            <el-input v-model="dataForm.payAmount"
                      :disabled="isCheck || isApproval || isPayAmount"></el-input>
          </el-form-item>
          <el-form-item label="大写金额"
                        prop="numberToCN">
            <el-input v-model="dataForm.numberToCN"
                      :disabled="isCheck || isApproval"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="单据状态"
                        prop="dictDocStatus">
            <select-all v-model="dataForm.dictDocStatus"
                        :listDataOption="dictDocStatusOption"
                        :isDisabled="true"
                        data-value="key"
                        data-label="value"></select-all>
          </el-form-item>
          <el-form-item label="单据编号"
                        prop="code">
            <el-input v-model="dataForm.code"
                      :disabled="true"
                      placeholder="系统自动生成"></el-input>
          </el-form-item>
          <el-form-item label="申请人"
                        prop="requestUser">
            <select-seach v-model="dataForm.requestUser"
                          httpUrl="list/search/user"
                          data-source="list"
                          title="user"
                          data-value="id"
                          data-label="name"
                          :isDisabled="isCheck || isApproval"></select-seach>
          </el-form-item>
          <el-form-item label="结算方式"
                        prop="settleMode">
            <textarea-all v-model="dataForm.settleMode"
                      :disabled="isCheck || isApproval"></textarea-all>
          </el-form-item>
          <el-form-item label="付款用途"
                        prop="remarks">
            <textarea-all v-model="dataForm.remarks"
                          :disabled="isCheck || isApproval"></textarea-all>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-button type="text"
                   v-if="!(isCheck || isDetailAdd || isApproval)"
                   :disabled="isCheck || isApproval"
                   @click="detailAddHandle()">
          <i class="iconfont erp-icon-tianjiamingxi"></i>选择付款来源</el-button>
      </el-row>
      <!-- 明细 -->
      <el-row>
        <el-table :data="dataForm.finPoPaymentDetailList"
                  stripe
                  border
                  highlight-current-row
                  fit
                  max-height="400"
                  id="table__one"
                  show-summary
                  :summary-method="getSummaries"
                  v-loading="dataListLoading"
                  @selection-change="selectionChangeHandle"
                  class="tableInfo">
          <el-table-column label="序号"
                           type="index"
                           width="40"></el-table-column>
          <el-table-column prop="contractCode"
                           label="采购合同号"
                           width="120px;"></el-table-column>
          <el-table-column prop="sourceTypeName"
                           label="入库类型"
                           width="100px;"></el-table-column>
          <el-table-column prop="sourceCode"
                           label="应付单号"
                           width="150px;"></el-table-column>
          <el-table-column prop="date"
                           label="日期"
                           width="100px;">
            <template slot-scope="scope">
              {{scope.row.date.slice(0,10)}}
            </template></el-table-column>
          <el-table-column prop="prodCode"
                           label="产品编号"
                           width="120px;"></el-table-column>
          <el-table-column prop="prodName"
                           label="产品名称"></el-table-column>
          <el-table-column prop="specifications"
                           label="规格型号"></el-table-column>
          <el-table-column prop="price"
                           label="单价"
                           width="80px;"></el-table-column>
          <el-table-column prop="qty"
                           label="数量"
                           width="60px;"></el-table-column>
          <el-table-column label="税率"
                           prop="taxRate"
                           width="50px;"></el-table-column>
          <el-table-column prop="noTaxAmount"
                           label="不含税金额"
                           width="100px;"></el-table-column>
          <el-table-column prop="taxAmount"
                           label="税额"
                           width="100px;"></el-table-column>
          <el-table-column prop="payableAmount"
                           label="总金额"
                           width="100px;"></el-table-column>
          <el-table-column prop="payAmount"
                           label="付款金额"
                           width="100px;">
            <template slot-scope="scope">
              <el-form-item :prop="'finPoPaymentDetailList[' + scope.$index + '].payAmount'"
                            :rules="dataRule.isNatural"
                            label-width="0px">
                <el-input v-model="scope.row.payAmount"
                          type="Number"
                          @mousewheel.native.prevent
                          :disabled="isCheck || isApproval || scope.row.payableAmount < 0"></el-input>
              </el-form-item>
            </template>
          </el-table-column>
          <el-table-column v-if="!(isCheck || isApproval)"
                           width="80"
                           fixed="right"
                           label="操作">
            <template slot-scope="scope">
              <el-button type="danger"
                         size="small"
                         circle
                         title="删除"
                         @click="deleteHandle(scope)">
                <i class="iconfont erp-icon-shanchu"></i>
              </el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-row>
    </el-form>
    <span slot="footer">
      <el-button @click="visible = false"><i class="iconfont erp-icon-quxiao"></i>取消</el-button>
      <el-button v-if="isAdd"
                 type="primary"
                 @click="dataFormSubmit()"><i class="iconfont erp-icon-baocun"></i>保存</el-button>
      <el-button v-if="isAdd"
                 type="primary"
                 @click="workflowSubmit()"><i class="iconfont erp-icon-queding"></i>提交</el-button>
      <el-button v-if="isApproval"
                 type="primary"
                 @click="approvalHander()"><i class="iconfont erp-icon-queding"></i>审核</el-button>
    </span>
    <!-- 添加明细 -->
    <add-details ref="addDetails"
                 @addDetailsList="addList"></add-details>
  </el-dialog>
</template>
<script>
// 采购付款申请页面

// 新增行
import selectSeach from '@/components/erp-select/select-seach'
import selectAll from '@/components/erp-select/select-all'
import { getUrl, dateFormatter, hasTypeOf } from '@/utils/index.js'
import { ruleData } from '@/mixins/initData.js'
// 备注
import textareaAll from '@/components/erp-input/textarea-all.vue'
// 审核
import approvalNew from '@/components/workflow/approval-new'
// 添加付款来源（新组件）
import addDetails from '@/components/add-details/payment-source'
import _ from 'lodash'
export default {
  mixins: [ruleData],
  components: {
    selectSeach,
    textareaAll,
    selectAll,
    addDetails,
    approvalNew
  },

  data () {
    return {
      visible: false,
      dialogTitle: '采购付款申请',
      isAdd: true,
      isCheck: false,
      isApproval: false,
      isWorkflow: false,
      isPayAmount: false,
      isDetailAdd: false,
      handerType: '',
      // 单据类型
      docTypeOption: [],
      // 结算币种
      currencyIdOptions: [],
      // 单据状态
      dictDocStatusOption: [],
      // 付款公司
      compIdOption: [],
      // 付款方式
      paymentModeOption: [],
      // 账号类型
      bankAccountTypeOption: [],
      dataForm: {
        id: '',
        line: '',
        code: '',
        docType: '',
        dictDocStatus: '',
        remarks: '',
        supplierId: '',
        requestDate: '',
        payDate: '',
        contractCodeList: [],
        compId: '',
        currencyId: '',
        payAmount: '',

        requestUser: '',
        settleDate: '',
        accountNum: '',
        accountName: '',
        paymentMode: '',
        bankAccountType: '',
        accountBank: '',
        settleMode: '',
        numberToCN: '',
        // 表数据
        finPoPaymentDetailList: [],
        approvalData: {}
      },
      dataListLoading: false,
      // 多选
      dataListSelections: [],
      approvalData: {},
      dictDocStatusOption: [{
        key: '01',
        value: '未审核'
      }, {
        key: '02',
        value: '审核中'
      }, {
        key: '03',
        value: '已审核'
      }, {
        key: '04',
        value: '已撤销'
      }],
      docTypeOption: [{
        key: '01',
        value: '采购付款'
      }, {
        key: '02',
        value: '预付款'
      }],
      dataRule: {
        isRequired: [
          { required: true, message: '必填项', trigger: 'blur' }
        ],
        isNatural: [
          { required: true, message: '必填项', trigger: 'blur' },
          { pattern: /^(-?[1-9]\d*)|(-?[1-9]\d*\.\d*|-?0\.\d*[1-9]\d*)$/, message: '不能为零', trigger: 'blur' }
        ]
      }
    }
  },
  created () {
    // 单据类型
    this.$http.get(this.$http.adornUrl('basicData/queryDataDict2List'), { params: { dataDictKey: 'PAYMENT_TYPE' } }).then(({ data }) => { this.docTypeOption = data.fontMaps })
    // 单据状态
    this.$http.get(this.$http.adornUrl('basicData/queryDataDict2List'), { params: { dataDictKey: 'APPROVAL_STATUS' } }).then(({ data }) => { this.dictDocStatusOption = data.fontMaps })
    // 付款公司
    this.$http.get(this.$http.adornUrl('sys/organization/select')).then(({ data }) => { this.compIdOption = data.companyList })
    // 结算币种
    this.$http.get(this.$http.adornUrl('basicData/queryAllCurrency')).then(({ data }) => { this.currencyIdOptions = data.currencyList })
    // 账号类型
    this.$http.get(this.$http.adornUrl('basicData/queryDataDict2List'), { params: { dataDictKey: 'BANK_ACCOUNT_TYPE' } }).then(({ data }) => { this.bankAccountTypeOption = data.fontMaps })
    // 付款方式
    this.$http.get(this.$http.adornUrl('basicData/queryDataDict2List'), { params: { dataDictKey: 'PAYMENT_MODE' } }).then(({ data }) => { this.paymentModeOption = data.fontMaps })
  },
  methods: {
    init (id, type, row) {
      this.handerType = type
      this.dataForm.code = ''
      this.dataForm.addTime = ''
      this.dataForm.addUser = ''
      this.dataForm.updTime = ''
      this.dataForm.updUser = ''
      this.dataForm.confirmUser = null
      this.dataForm.confirmUserName = null
      this.dataForm.confirmTime = null
      this.dataForm.userId = sessionStorage.getItem('userId')
      this.visible = true
      this.dataForm.id = id
      this.dataForm.finPoPaymentDetailList = []
      this.$nextTick(() => {
        if (type === 'canAdd') {
          this.dialogTitle = '采购付款申请新增'
          this.initAdd()
        }
        if (type === 'canEdit' && this.dataForm.id) {
          this.dialogTitle = '采购付款申请编辑'
          this.initEdit(id)
        }
        if (type === 'canCheck' && this.dataForm.id) {
          this.dialogTitle = '采购付款申请查看'
          this.initCheck(id)
        }
        if (type === 'canApproval' && this.dataForm.id) {
          this.dialogTitle = '采购付款申请审核'
          this.initApproval(id, row)
        }
      })
    },

    // 新增
    initAdd () {
      for (const key in this.dataForm) {
        if (this.dataForm.hasOwnProperty(key)) {
          const element = this.dataForm[key]
          if (hasTypeOf(element) === 'array') {
            this.dataForm[key] = []
          } else if (hasTypeOf(element) === 'object') {
            this.dataForm[key] = {}
          } else if (hasTypeOf(element) === 'null') {
            this.dataForm[key] = null
          } else {
            this.dataForm[key] = ''
          }
        }
      }
      this.dataForm.requestDate = dateFormatter(new Date(), false)
      this.dataForm.settleDate = dateFormatter(new Date(), false)
      this.dataForm.payDate = dateFormatter(new Date(), false)
      this.dataForm.requestUser = sessionStorage.getItem('userId')
      this.dataForm.currencyId = 'CNY'
      this.dataForm.paymentMode = '01'
      this.dataForm.dictDocStatus = this.dictDocStatusOption[0].key
      // this.dataForm.userId = sessionStorage.getItem('userId')
      this.isAdd = true
      this.isCheck = false
      this.isApproval = false
      this.workflow = true
      this.isDetailAdd = false
    },

    // 编辑
    initEdit (id) {
      this.finpopaymentInfo(id)
      this.isAdd = true
      this.isCheck = false
      this.isApproval = false
      this.isWorkflow = true
    },

    //  查看
    initCheck (id) {
      this.finpopaymentInfo(id)
      this.isAdd = false
      this.isCheck = true
      this.isApproval = false
      this.isWorkflow = false
    },

    // 审核
    initApproval (id, row) {
      this.finpopaymentInfo(id)
      this.isAdd = false
      this.isCheck = false
      this.isApproval = true
      this.isWorkflow = false
      this.approvalData = {
        businessId: row.id,
        code: row.code,
        comments: '',
        docName: '采购付款申请单',
        node: row.node,
        operation: '1',
        processKey: row.processKey,
        routeUrl: getUrl(),
        taskId: row.taskId,
        variablesMap: {},
        isShowNode2: false,
        isShowNode3: true
      }
    },

    // 数据调用
    finpopaymentInfo (id) {
      this.$http({
        url: this.$http.adornUrl(`fin/finpopayment/info/${id}`),
        method: 'get'
      }).then(({ data }) => {
        if (data && data.code === 0) {
          this.dataForm = data.finPoPaymentDto
          // this.dataForm.contractCodeList = data.finPoPaymentDto.contractCode
          this.docTypeChange(this.dataForm.docType)
        }
      })
    },

    // 审核按钮
    approvalHander () {
      if (this.detailValidate()) return

      this.$refs['dataForm'].validate(valid => {
        if (valid) {
          this.$http({
            url: this.$http.adornUrl(`fin/finpopayment/approval`),
            method: 'post',
            data: Object.assign({}, this.dataForm, { flowParams: this.approvalData })
          }).then(({ data }) => {
            if (data && data.code === 0) {
              this.$emit('refreshDataList')
              this.visible = false
              this.$notify.success({
                title: '成功',
                message: `审核成功`,
                duration: 5000
              })
            } else {
              this.$notify.error({
                title: '错误',
                message: data.msg,
                duration: 5000
              })
            }
          })
        }
      })
    },

    // 增加行
    detailAddHandle () {
      if (!(this.dataForm.supplierId && this.dataForm.compId && this.dataForm.currencyId)) {
        this.$notify.error({
          title: '错误',
          message: '需填写： 供应商，应付公司，结算币种',
          duration: 5000
        })
        return
      }
      this.$nextTick(() => {
        this.$refs.addDetails.init(
          this.dataForm.id,
          this.dataForm.finPoPaymentDetailList,
          {
            supplierId: this.dataForm.supplierId,
            compId: this.dataForm.compId,
            currencyId: this.dataForm.currencyId
          }
        )
      })
    },

    // 提交
    workflowSubmit: _.debounce(
      async function workflowSubmit () {
        if (this.detailValidate()) return

        this.$refs['dataForm'].validate(valid => {
          if (valid) {
            this.$http({
              url: this.$http.adornUrl(`fin/finpopayment/submit`),
              method: 'post',
              data: Object.assign({}, this.dataForm, {
                routeUrl: getUrl()
              })
            }).then(({ data }) => {
              if (data && data.code === 0) {
                this.visible = false
                this.$emit('refreshDataList')
                this.$notify.success({
                  title: '成功',
                  message: `提交成功, 单号为: ${data.entity.code}`,
                  duration: 5000
                })
              } else {
                this.$notify.error({
                  title: '警告',
                  message: data.msg,
                  duration: 5000
                })
              }
            })
          }
        })
      }, 1000, {
        leading: true,
        trailing: false
      }
    ),

    // 新增/修改
    dataFormSubmit: _.debounce(
      async function dataFormSubmit () {
        if (this.detailValidate()) return
        this.$refs['dataForm'].validate(valid => {
          if (valid) {
            this.$http({
              url: this.$http.adornUrl(`fin/finpopayment/${!this.dataForm.id ? 'save' : 'update'}`),
              method: !this.dataForm.id ? 'post' : 'put',
              data: this.dataForm
            }).then(({ data }) => {
              if (data && data.code === 0) {
                this.$emit('refreshDataList')
                this.visible = false
                this.$notify.success({
                  title: '提示',
                  message: `保存成功, 编码为: ${data.entity.code}`,
                  duration: 5000
                })
              } else {
                this.$notify.error({
                  title: '错误',
                  message: data.msg,
                  duration: 5000
                })
              }
            })
          }
        })
      }, 1000, {
        leading: true,
        trailing: false
      }
    ),

    // 明细行合计
    getSummaries (param) {
      const { columns, data } = param
      const sums = []
      columns.forEach((column, index) => {
        if (index === 0) {
          sums[index] = '合计'
          return
        }
        if (column.property !== 'payAmount' && column.property !== 'payableAmount' && column.property !== 'qty') {
          sums[index] = ''
          return
        }
        const values = data.map(item => Number(item[column.property]))
        if (!values.every(value => isNaN(value))) {
          sums[index] = values.reduce((prev, curr) => {
            const value = Number(curr)
            if (!isNaN(value)) {
              return prev + curr
            } else {
              return prev
            }
          }, 0).toFixed(2)
          if (column.property === 'payAmount') {
            this.dataForm.payAmount = sums[index]
          }
        } else {
          sums[index] = ''
        }
      })
      return sums
    },

    // 供应商change
    supplierIdChange (item) {
      // 判断是否是新增
      // 通过供应商id调用接口,带出数据
      this.$http({
        url: this.$http.adornUrl('fin/finpopayment/querySupplierInfo'),
        method: 'get',
        params: { val: item.id }
      }).then(({ data }) => {
        if (data && data.code === 0) {
          let dataList = data.list[0]
          this.dataForm.accountBank = dataList.accountBank
          this.dataForm.accountName = dataList.accountName
          this.dataForm.accountNum = dataList.accountNum
          this.dataForm.bankAccountType = dataList.dictBankAccountType
          this.dataForm.settleMode = dataList.settleMode
        } else {
          this.$notify.error({
            title: '错误',
            message: '供应商带出数据错误',
            duration: 5000
          })
        }
      })
    },

    // 单据类型change
    docTypeChange (val) {
      if (val === this.docTypeOption[0].key || this.isCheck) {
        this.isPayAmount = true
        this.isDetailAdd = false
        if (this.dataForm.finPoPaymentDetailList.length <= 0 && this.dataForm.docType === this.docTypeOption[0].key) {
          this.dataForm.payAmount = ''
        }
      } else {
        this.isPayAmount = false
        this.isDetailAdd = true
        this.dataForm.finPoPaymentDetailList = []
      }
      this.$refs['againValue'].clearValidate()
    },

    // 明细校验
    detailValidate () {
      if (!(this.dataForm.finPoPaymentDetailList.length > 0) && this.dataForm.docType === this.docTypeOption[0].key) {
        this.$notify.error({
          title: '错误',
          message: `明细不能为空`,
          duration: 5000
        })
        return true
      } else {
        this.dataForm.finPoPaymentDetailList.forEach((item, index) => {
          this.$set(item, 'line', index + 1)
        })
        return false
      }
    },

    // 多选
    selectionChangeHandle (val) {
      this.dataListSelections = val
    },

    // 子组件添加的数据
    addList (list) {
      let mapData = []
      mapData = list.map(item => {
        return {
          sourceCode: item.code,
          compName: item.compName,
          contractCode: item.contractCode,
          dictDocStatusName: item.dictDocStatusName,
          payableId: item.payableId,
          payableType: item.docType,
          // docTypeName: item.docTypeName,
          paidAmount: item.paidAmount,
          payableDetailId: item.payableDetailId,
          poDetailId: item.poDetailId,
          requestAmount: item.requestAmount,
          sourceType: item.sourceType,
          sourceTypeName: item.sourceTypeName,
          date: item.payableDate,
          prodId: item.prodId,
          prodCode: item.prodCode,
          prodName: item.prodName,
          price: item.price,
          qty: item.qty,
          taxRate: item.taxRate,
          payableAmount: item.totalAmount,
          payAmount: item.defaultAmount,
          taxAmount: item.taxAmount,
          noTaxAmount: item.noTaxAmount,
          specifications: item.specifications
        }
      })
      for (const data of mapData) {
        let isFind = false
        for (const item of this.dataForm.finPoPaymentDetailList) {
          if (data.payableDetailId === item.payableDetailId) {
            isFind = true
            break
          }
        }
        if (!isFind) {
          this.dataForm.finPoPaymentDetailList.push(data)
        }
      }
    },

    // 采购合同号多选
    contractCodeHander (val) {
      console.log(val)
    },

    // 删除
    deleteHandle (scope) {
      this.dataForm.finPoPaymentDetailList.splice(scope.$index, 1)
      if (this.dataForm.finPoPaymentDetailList.length <= 0) {
        this.dataForm.payAmount = ''
      }
    }
  }
}
</script>

