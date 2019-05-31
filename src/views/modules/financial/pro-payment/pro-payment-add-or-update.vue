<template>
  <div class="pro-payment-add-or-update">
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
            <el-form-item label="单据编号"
                          prop="code">
              <el-input v-model="dataForm.code"
                        :disabled="true"
                        placeholder="系统自动生成"></el-input>
            </el-form-item>
            <el-form-item label="单据类型"
                          prop="docType">
              <select-all v-model="dataForm.docType"
                          :listDataOption="docTypeOption"
                          :isDisabled="true"
                          data-value="key"
                          data-label="value"></select-all>
            </el-form-item>
            <el-form-item label="备注"
                          prop="remarks">
              <textarea-all v-model="dataForm.remarks"
                            :disabled="isCheck || isApproval || dataForm.docType === docTypeOption[0].key"></textarea-all>
            </el-form-item>

          </el-col>
          <el-col :span="6">
            <el-form-item label="应付日期"
                          :rules="dataRule.isRequired"
                          prop="payableDate">
              <el-date-picker v-model="dataForm.payableDate"
                              type="date"
                              format="yyyy-MM-dd"
                              value-format="yyyy-MM-dd"
                              :disabled="isCheck || isApproval || dataForm.docType === docTypeOption[0].key"></el-date-picker>
            </el-form-item>
            <el-form-item label="供应商"
                          :rules="dataRule.isRequired"
                          prop="supplierId">
              <select-seach v-model="dataForm.supplierId"
                            httpUrl="list/search/supplier"
                            httpMethod="get"
                            data-label="name"
                            data-value="id"
                            data-source="list"
                            :isDisabled="isCheck || isApproval || dataForm.finPoPayableDetailList.length>0"></select-seach>
            </el-form-item>

            <el-form-item label="应付公司"
                          :rules="dataRule.isRequired"
                          prop="compId">
              <select-all v-model="dataForm.compId"
                          :listDataOption="compIdOptions"
                          :isDisabled="isCheck || isApproval || dataForm.finPoPayableDetailList.length>0"
                          data-value="id"
                          data-label="name"></select-all>
            </el-form-item>
          </el-col>
          <el-col :span="6">

            <el-form-item label="结算币种"
                          :rules="dataRule.isRequired"
                          prop="currencyId">
              <select-all v-model="dataForm.currencyId"
                          :listDataOption="currencyIdOptions"
                          :isDisabled="isCheck || isApproval || dataForm.finPoPayableDetailList.length>0"
                          data-value="id"
                          data-label="name"></select-all>
            </el-form-item>

            <el-form-item label="总金额"
                          prop="totalAmount">
              <el-input v-model="dataForm.totalAmount"
                        type="Number"
                        :disabled="true"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="源单据类型"
                          prop="sourceType">
              <select-all v-model="dataForm.sourceType"
                          :listDataOption="sourceTypeOption"
                          :isDisabled="true"
                          data-value="key"
                          data-label="value"></select-all>
            </el-form-item>
            <el-form-item label="源单据编号"
                          prop="sourceCode">
              <el-input v-model="dataForm.sourceCode"
                        :disabled="true"
                        placeholder="系统自动生成"></el-input>
            </el-form-item>
            <el-form-item label="单据状态"
                          prop="dictDocStatus">
              <select-all v-model="dataForm.dictDocStatus"
                          :listDataOption="dictDocStatusOption"
                          :isDisabled="true"
                          data-value="key"
                          data-label="value"></select-all>
            </el-form-item>
          </el-col>
        </el-row>
        <!-- ============================== 应付单 ============================= -->
        <div>
          <el-button type="text"
                     v-if="!(isCheck ||isApproval ||  dataForm.docType === docTypeOption[0].key)"
                     :disabled="isCheck"
                     @click="detailAddHandle()">
            <i class="iconfont erp-icon-tianjiamingxi"></i>添加明细行</el-button>
          <el-table :data="dataForm.finPoPayableDetailList"
                    stripe
                    border
                    max-height="800"
                    highlight-current-row
                    v-loading="dataListLoading"
                    show-summary
                    @selection-change="selectionChangeHandle"
                    :summary-method="getSummaries"
                    fit
                    id="table__one"
                    class="tableInfo">
            <el-table-column label="采购合同号"
                             prop="contractCode"
                             width="150px"></el-table-column>
            <el-table-column label="产品编码"
                             prop="prodCode"
                             width="120px"></el-table-column>
            <el-table-column label="产品名称"
                             prop="prodName"></el-table-column>
            <el-table-column label="规格型号"
                             prop="specifications"
                             width="80px"></el-table-column>
            <el-table-column label="单位"
                             prop="unitName"
                             width="50px"></el-table-column>
            <el-table-column label="数量"
                             prop="qty"
                             min-width="30px"></el-table-column>
            <el-table-column label="单价"
                             prop="price"
                             width="140px">
              <template slot-scope="scope">
                <div v-if="dataForm.docType === docTypeOption[0].key">
                  原: &nbsp; {{scope.row.origPrice}}
                </div>
                <span v-if="dataForm.docType === docTypeOption[0].key">现:</span>
                <el-input v-model.number="scope.row.price"
                          type="Number"
                          @input="priceHander(scope.row)"
                          @mousewheel.native.prevent
                          :disabled="isCheck || isApproval || dataForm.docType === docTypeOption[1].key"
                          class="w-input"></el-input>
                <div v-if="dataForm.docType === docTypeOption[0].key">
                  差异: &nbsp; {{scope.row.priceDiff}}
                </div>
              </template>
            </el-table-column>
            <el-table-column label="税率"
                             prop="taxRate"
                             width="140px">
              <template slot-scope="scope">
                <div v-if="dataForm.docType === docTypeOption[0].key">
                  原: &nbsp; {{scope.row.origTaxRate}}
                </div>
                <div>
                  <span v-if="dataForm.docType === docTypeOption[0].key">现:</span>
                  <el-input v-model.number="scope.row.taxRate"
                            type="Number"
                            @input="taxRateHander(scope.row)"
                            @mousewheel.native.prevent
                            :disabled="isCheck || isApproval || dataForm.docType === docTypeOption[1].key"
                            class="w-input"></el-input>
                </div>
                <div v-if="dataForm.docType === docTypeOption[0].key">
                  差异: &nbsp; {{scope.row.taxRateDiff}}
                </div>
              </template>
            </el-table-column>
            <el-table-column label="不含税金额"
                             prop="noTaxAmount"
                             width="120px">
              <template slot-scope="scope">
                <div v-if="dataForm.docType === docTypeOption[0].key">
                  原: &nbsp; {{scope.row.origNoTaxAmount}}
                </div>
                <div>
                  <span v-if="dataForm.docType === docTypeOption[0].key">现:</span>
                  &nbsp; {{scope.row.noTaxAmount}}
                </div>
                <div v-if="dataForm.docType === docTypeOption[0].key">
                  差异: &nbsp; {{scope.row.noTaxDiff}}
                </div>
              </template>
            </el-table-column>
            <el-table-column label="税额"
                             prop="taxAmount"
                             width="120px">
              <template slot-scope="scope">
                <div v-if="dataForm.docType === docTypeOption[0].key">
                  原: &nbsp; {{scope.row.origTaxAmount}}
                </div>
                <div>
                  <span v-if="dataForm.docType === docTypeOption[0].key">现:</span>
                  &nbsp; {{scope.row.taxAmount}}
                </div>
                <div v-if="dataForm.docType === docTypeOption[0].key">
                  差异: &nbsp; {{scope.row.taxDiff}}
                </div>
              </template>
            </el-table-column>
            <el-table-column label="汇率"
                             prop="exchangeRate"
                             width="40px"></el-table-column>
            <el-table-column :label="dataForm.docType === docTypeOption[1].key ? '调整金额' : '总金额'"
                             prop="totalAmount"
                             width="150px">
              <template slot-scope="scope">
                <div v-if="dataForm.docType === docTypeOption[0].key">
                  原: &nbsp; {{scope.row.origTotalAmount}}
                </div>
                <div>
                  <el-form-item :prop="'finPoPayableDetailList[' + scope.$index + '].totalAmount'"
                                :rules="dataRule.totalAmount"
                                :label-width="dataForm.docType === docTypeOption[0].key ? '40px' : '0px'"
                                :label="dataForm.docType === docTypeOption[0].key ? '现:' : ''">
                    <el-input v-model.number="scope.row.totalAmount"
                              type="Number"
                              @input="totalAmountHander(scope.row)"
                              @mousewheel.native.prevent
                              :disabled="isCheck || isApproval || dataForm.docType === docTypeOption[0].key"></el-input>
                  </el-form-item>
                </div>
                <div v-if="dataForm.docType === docTypeOption[0].key">
                  差异: &nbsp; {{scope.row.totalDiff}}
                </div>
              </template>
            </el-table-column>
            <el-table-column label="调整原因"
                             prop="remark"
                             min-width="50px">
              <template slot-scope="scope">
                <el-form-item :prop="'finPoPayableDetailList[' + scope.$index + '].remark'"
                              :rules="dataForm.docType === docTypeOption[1].key ? dataRule.isRequired : dataRule.isNO"
                              label-width="0px">
                  <textarea-all v-model="scope.row.remark"
                                :disabled="isCheck || isApproval"></textarea-all>
                </el-form-item>
              </template>
            </el-table-column>
            <el-table-column v-if="!(isCheck || isApproval || dataForm.docType === docTypeOption[0].key)"
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

        </div>
      </el-form>
      <span slot="footer"
            class="dialog-footer">
        <el-button @click="visible = false"><i class="iconfont erp-icon-quxiao"></i>取消</el-button>
        <el-button v-if="isAdd"
                   type="primary"
                   @click="dataFormSave()"><i class="iconfont erp-icon-baocun"></i>保存</el-button>
        <el-button v-if="isAuth('fin:finpopayable:submit') && isAdd"
                   type="primary"
                   @click="workflowSubmit()"><i class="iconfont erp-icon-queding"></i>提交</el-button>
        <el-button type="primary"
                   v-if="isApproval"
                   @click="approvalHander()"><i class="iconfont erp-icon-shenhe"></i>审核</el-button>
      </span>
      <!-- 添加明细 -->
      <add-details ref="addDetails"
                   @addDetailsList="addList"></add-details>
    </el-dialog>
  </div>
</template>
<script>
// 应付单页面

// 下拉,不带接口
import selectAll from '@/components/erp-select/select-all'
import selectSeach from '@/components/erp-select/select-seach'
import approvalNew from '@/components/workflow/approval-new'
// 添加明细（新组件）
import addDetails from '@/components/add-details/detail-purchase-order'
import { getUrl, deptCascader, dateFormatter, clearTaskId, hasTypeOf, getRequest } from '@/utils'

// 备注组件
import textareaAll from '@/components/erp-input/textarea-all'
import { ruleData } from '@/mixins/initData.js'

export default {
  props: ['value'],
  mixins: [ruleData],
  components: {
    selectAll,
    selectSeach,
    approvalNew,
    addDetails,
    textareaAll
  },
  data () {
    return {
      visible: false,
      dialogTitle: '应付单',
      isAdd: true,
      isCheck: true,
      isApproval: false,
      isWorkflow: false,

      isDisabled: false,

      // 单据类型
      docTypeOption: [],
      // 原单据累心
      sourceTypeOption: [],
      // 结算币种
      currencyIdOptions: [],
      // 应付公司
      compIdOptions: [],
      dataForm: {
        id: '',
        code: '',
        docType: '',
        sourceCode: '',
        sourceType: '',
        payableDate: '',
        supplierId: '',
        totalAmount: '',
        remarks: '',
        compId: '',
        currencyId: '',
        exchangeRate: '',
        finPoPayableDetailList: [],
        flowParams: {},
        dictDocStatus: ''
      },
      // ==================================== table数据
      dataListLoading: false,
      // 多选情况
      dataListSelections: [],
      approvalData: {},
      docTypeOption: [{
        key: '01',
        value: '应付单'
      }, {
        key: '02',
        value: '应付调整单'
      }],
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
      // 校验
      dataRule: {
        totalAmount: [
          { required: true, message: '必填项', trigger: 'blur' },
          { pattern: /^(-?[1-9]\d*)|(-?[1-9]\d*\.\d*|-?0\.\d*[1-9]\d*)$/, message: '不等于0', trigger: 'blur' }
        ]
      }
    }
  },
  created () {
    // 单据类型
    this.$http.get(this.$http.adornUrl('basicData/queryDataDict2List'), { params: { dataDictKey: 'PAYABLE_TYPE' } }).then(({ data }) => { this.docTypeOption = data.fontMaps })
    // 源单据类型
    this.$http.get(this.$http.adornUrl('basicData/queryDataDict2List'), { params: { dataDictKey: 'WH_INSTOCK_TYPE' } }).then(({ data }) => { this.sourceTypeOption = data.fontMaps })
    // 结算币种
    this.$http.get(this.$http.adornUrl('basicData/queryAllCurrency')).then(({ data }) => { this.currencyIdOptions = data.currencyList })
    // 单据状态
    this.$http.get(this.$http.adornUrl('basicData/queryDataDict2List'), { params: { dataDictKey: 'APPROVAL_STATUS' } }).then(({ data }) => { this.dictDocStatusOption = data.fontMaps })
    // 应付公司
    this.$http.get(this.$http.adornUrl('list/combobox/company')).then(({ data }) => { this.compIdOptions = data.list })
  },
  methods: {
    init (id, type, row) {
      this.dataForm.id = id
      this.dataForm.finPoPayableDetailList = []
      this.dataForm.code = ''
      this.dataForm.addTime = ''
      this.dataForm.addUser = ''
      this.dataForm.updTime = ''
      this.dataForm.updUser = ''
      this.$nextTick(() => {
        if (type === 'canAdd') {
          this.dialogTitle = '采购应付单新增'
          this.initAdd()
        }
        if (type === 'canEdit' && this.dataForm.id) {
          this.dialogTitle = '采购应付单编辑'
          this.initEdit(id)
        }
        if (type === 'canCheck' && this.dataForm.id) {
          this.dialogTitle = '采购应付单查看'
          this.initCheck(id)
        }
        if (type === 'canApproval' && this.dataForm.id) {
          this.dialogTitle = '采购应付单审核'
          this.initApproval(id, row)
        }
      })
      this.visible = true
    },

    // 新增
    initAdd () {
      hasTypeOf(this.dataForm)
      this.dataForm.docType = '02'
      this.dataForm.payableDate = dateFormatter(new Date(), false)
      this.dataForm.dictDocStatus = this.dictDocStatusOption[0].key
      this.isAdd = true
      this.isCheck = false
      this.isApproval = false
      this.workflow = true
    },

    // 编辑
    initEdit (id) {
      this.finpopayableInfo(id)
      this.isAdd = true
      this.isCheck = false
      this.isApproval = false
      this.isWorkflow = true
    },

    //  查看
    initCheck (id) {
      this.finpopayableInfo(id)
      this.isAdd = false
      this.isCheck = true
      this.isApproval = false
      this.isWorkflow = false
    },

    // 审核
    initApproval (id, row) {
      this.finpopayableInfo(id)
      this.isAdd = false
      this.isCheck = false
      this.isApproval = true
      this.isWorkflow = false
      this.approvalData = {
        businessId: row.id,
        code: row.code,
        comments: '',
        docName: '采购应付单',
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
    finpopayableInfo (id) {
      this.$http({
        url: this.$http.adornUrl(`fin/finpopayable/info/${id}`),
        method: 'get'
      }).then(({ data }) => {
        if (data && data.code === 0) {
          this.dataForm = data.finPoPayableDto
        }
      })
    },

    // 审核按钮
    approvalHander () {
      if (!(this.dataForm.finPoPayableDetailList && this.dataForm.finPoPayableDetailList.length > 0)) {
        this.$notify.error({
          title: '错误',
          message: '明细不能为空',
          duration: 5000
        })
        return
      }
      this.$refs['dataForm'].validate(valid => {
        if (valid) {
          this.$http({
            url: this.$http.adornUrl('fin/finpopayable/approval'),
            method: 'post',
            data: Object.assign({}, this.dataForm, { flowParams: this.approvalData })
          }).then(({ data }) => {
            if (data && data.code === 0) {
              this.visible = false
              this.$emit('refreshDataList')
              this.$notify.success({
                title: '成功',
                message: '审核成功',
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

    // 新增 / 修改
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
        this.$refs.addDetails.init(this.dataForm.id, this.dataForm.finPoPayableDetailList, {
          supplierId: this.dataForm.supplierId,
          compId: this.dataForm.compId,
          currencyId: this.dataForm.currencyId
        }
        )
      })
    },

    // 表单提交 ==> 保存按钮
    dataFormSave: _.debounce(
      async function dataFormSave () {
        if (!(this.dataForm.finPoPayableDetailList && this.dataForm.finPoPayableDetailList.length > 0)) {
          this.$notify.error({
            title: '错误',
            message: `明细不能为空`,
            duration: 5000
          })
          return
        }
        this.$refs['dataForm'].validate(valid => {
          if (valid) {
            this.$http({
              url: this.$http.adornUrl(`fin/finpopayable/${!this.dataForm.id ? 'save' : 'update'}`),
              method: !this.dataForm.id ? 'post' : 'put',
              data: this.dataForm
            }).then(({ data }) => {
              if (data && data.code === 0) {
                this.visible = false
                this.$emit('refreshDataList')
                this.$notify.success({
                  title: '提示',
                  message: `${!this.dataForm.id ? '新增' : '修改'}成功, 编码为:${data.entity.code}`,
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

    // 表单提交 ==> 提交按钮
    workflowSubmit: _.debounce(
      async function workflowSubmit () {
        if (!(this.dataForm.finPoPayableDetailList.length > 0)) {
          this.$notify.error({
            title: '错误',
            message: `明细不能为空`,
            duration: 5000
          })
          return
        }

        this.$refs['dataForm'].validate(valid => {
          if (valid) {
            this.$http({
              url: this.$http.adornUrl('fin/finpopayable/submit'),
              method: 'post',
              data: Object.assign({}, this.dataForm, {
                routeUrl: getUrl()
              })
            }).then(({ data }) => {
              if (data && data.code === 0) {
                this.visible = false
                this.$emit('refreshDataList')
                this.$notify.success({
                  title: '提示',
                  message: `提交成功, 编码为:${data.entity.code}`,
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

        if (column.property !== 'totalAmount') {
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

          if (column.property === 'totalAmount') {
            this.dataForm.totalAmount = sums[index]
          }
        } else {
          sums[index] = ''
        }
      })

      return sums
    },

    // 审核 ==> 审核按钮
    workflowApproval: _.debounce(
      async function workflowApproval () {
        if (!(this.dataForm.finPoPayableDetailList.length > 0)) {
          this.$notify.error({
            title: '错误',
            message: `明细不能为空`,
            duration: 5000
          })
          return
        }

        // 如果审核驳回发起人，不再去校验字段
        // if (this.flowParams.operation === '3' || this.flowParams.operation === '2') {
        if (this.dataForm.flowParams) {
          // 如果审核驳回发起人，不再去校验字段
          this.initApproval().then(({ data }) => {
            if (data && data.code === 0) {
              // 清除url的taskId
              window.location.href = clearTaskId()
              this.$emit('refreshDataList')
              this.visible = false
              this.$notify.success({
                title: '成功',
                message: '操作成功',
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
        } else {
          this.$refs['dataForm'].validate(valid => {
            if (valid) {
              this.initApproval().then(({ data }) => {
                if (data && data.code === 0) {
                  // this.clearCache('dataForm')
                  // 清除url的taskId
                  window.location.href = clearTaskId()
                  this.$emit('refreshDataList')
                  this.visible = false
                  this.$notify.success({
                    title: '成功',
                    message: '操作成功',
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
        }
      }, 1000, {
        leading: true,
        trailing: false
      }),

    // 单价
    priceHander (row) {
      row.totalAmount = (row.qty * row.price).toFixed(2)
      row.noTaxAmount = (row.qty * row.price / (1 + Number(row.taxRate))).toFixed(2)
    },

    // 税率
    taxRateHander (row) {
      console.log(1 + row.taxRate)
      row.totalAmount = (row.qty * row.price).toFixed(2)
      row.noTaxAmount = (row.qty * row.price / (1 + Number(row.taxRate))).toFixed(2)
      row.taxAmount = (row.totalAmount - row.noTaxAmount).toFixed(2)
    },

    // 总金额
    totalAmountHander (row) {
      if (this.dataForm.docType === this.docTypeOption[1].key) {
        row.noTaxAmount = row.totalAmount.toFixed(2)
      }
      // row.noTaxAmount = (row.qty * row.price / (1 + Number(row.taxRate))).toFixed(2)
    },

    // 子组件添加的数据
    addList (list) {
      for (const data of list) {
        let isFind = false
        for (const item of this.dataForm.finPoPayableDetailList) {
          if (data.poDetailId === item.poDetailId) {
            isFind = true
            break
          }
        }
        // 针对应付调整单的数据操作=>逻辑需确立在类型为应付调整单的前提之下
        if (this.dataForm.docType === this.docTypeOption[1].key) {
          data.taxAmount = 0
          data.noTaxAmount = data.totalAmount
        }
        if (!isFind) {
          this.dataForm.finPoPayableDetailList.push(data)
        }
      }
    },

    // 多选
    selectionChangeHandle (val) {
      this.dataListSelections = val
    },

    // 删除
    deleteHandle (scope) {
      this.dataForm.finPoPayableDetailList.splice(scope.$index, 1)
      if (this.dataForm.finPoPayableDetailList.length <= 0) {
        this.dataForm.totalAmount = ''
      }
    }
  }
}
</script>

<style lang="scss">
.w-input {
  width: 100px;
  max-width: 100%;
}
</style>
