<template>
  <el-dialog :title="title"
             :close-on-click-modal="false"
             :visible.sync="visible"
             @close="$refs['dataForm'].resetFields()"
             append-to-body
             width="50%">
    <div>
      <el-form :model="dataForm"
               :rules="dataRule"
               ref="dataForm"
               label-width="110px">
        <el-row>
          <el-col :span="12">
            <el-form-item label="付款单号"
                          prop="code">
              <el-input v-model="dataForm.code"
                        disabled
                        min-width="50px;"></el-input>
            </el-form-item>
            <el-form-item label="付款类型"
                          prop="dictPayType">
              <select-all v-model="dataForm.dictPayType"
                          :listDataOption="dictPayModeOptions"
                          :isDisabled="isDisabled"
                          data-value="key"
                          data-label="value"></select-all>
            </el-form-item>
            <el-form-item label="付款日期"
                          prop="payDate">
              <el-date-picker v-model="dataForm.payDate"
                              type="date"
                              value-format="yyyy-MM-dd"
                              :disabled="isDisabled"></el-date-picker>
            </el-form-item>
            <el-form-item label="付款方式"
                          prop="dictPayMode">
              <select-all v-model="dataForm.dictPayMode"
                          :listDataOption="paymentOptions"
                          :isDisabled="isDisabled"
                          data-value="key"
                          data-label="value"></select-all>
            </el-form-item>
            <el-form-item label="确认付款金额"
                          prop="paidAmount">
              <el-input v-model="dataForm.paidAmount"
                        type="Number"
                        @mousewheel.native.prevent
                        :disabled="isDisabled"></el-input>
            </el-form-item>
            <el-form-item label="本次申请金额"
                          prop="requestAmount">
              <el-input v-model="dataForm.requestAmount"
                        type="Number"
                        @mousewheel.native.prevent
                        :disabled="isDisabled"
                        :max="100"></el-input>
            </el-form-item>
            <el-form-item label="是否开票"
                          prop="bInvoice">
              <el-input v-model="dataForm.bInvoice"
                        :disabled="isDisabled"></el-input>
            </el-form-item>
            <el-form-item label="物品数量"
                          prop="qty">
              <el-input v-model="dataForm.qty"
                        :disabled="isDisabled"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="供应商名称"
                          prop="supplierId">
              <select-seach v-model="dataForm.supplierId"
                            httpUrl="/list/search/supplier"
                            httpMethod="get"
                            data-label="name"
                            data-value="id"
                            data-source="list"
                            :isDisabled="supplierDisabled"></select-seach>
            </el-form-item>
            <el-form-item label="采购订单号"
                          prop="code">
              <el-input v-model="dataForm.poInfoEntity.code"
                        disabled></el-input>
            </el-form-item>
            <el-form-item label="订单金额"
                          prop="totalAmount">
              <el-input v-model="dataForm.poInfoEntity.totalAmount"
                        disabled
                        type="Number"
                        @mousewheel.native.prevent></el-input>
            </el-form-item>
            <el-form-item label="已预付金额"
                          prop="paidAmount1">
              <el-input v-model="dataForm.advanceAmount"
                        type="Number"
                        @mousewheel.native.prevent
                        disabled></el-input>
            </el-form-item>
            <el-form-item label="累计已付金额"
                          prop="totalAmount">
              <el-input v-model="dataForm.totalAmount"
                        type="Number"
                        @mousewheel.native.prevent
                        disabled></el-input>
            </el-form-item>
            <el-form-item label="累计申请金额"
                          prop="totalRequestAmount">
              <el-input v-model="dataForm.totalRequestAmount"
                        type="Number"
                        @mousewheel.native.prevent
                        disabled></el-input>
            </el-form-item>
            <el-form-item label="单据状态"
                          prop="dictDocStatus">
              <select-all v-model="dataForm.dictDocStatus"
                          :listDataOption="stutasOptions"
                          :isDisabled="true"
                          data-value="key"
                          data-label="value"></select-all>
            </el-form-item>
            <el-form-item label="备注说明"
                          prop="remark">
              <textarea-all v-model="dataForm.remark"
                            :disabled="isDisabled"></textarea-all>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
    </div>
    <span slot='footer'
          class="dialog-footer">
      <el-button @click="visible = false"><i class="iconfont erp-icon-quxiao"></i>取消</el-button>
      <el-button type="primary"
                 @click="save()"
                 v-if="isShow"
                 :disabled="saveControl"><i class="iconfont erp-icon-baocun"></i>保存</el-button>
      <el-button type="primary"
                 @click="commit()"
                 v-if="isShow"
                 :disabled="commitControl"><i class="iconfont erp-icon-queding"></i>确认付款</el-button>
    </span>
  </el-dialog>
</template>
<script>
import selectAll from '@/components/erp-select/select-all'
import selectSeach from '@/components/erp-select/select-seach'
// 备注组件
import textareaAll from '@/components/erp-input/textarea-all'
import _ from 'lodash'
export default {
  components: {
    selectAll,
    selectSeach,
    textareaAll
  },
  data () {
    // 申请金额校验
    var validrequestAmount = (rule, value, callback) => {
      if (
        !/^([1-9]\d*(\.\d*[1-9])?)|(0\.\d*[1-9])$/.test(value) &&
        value != null
      ) {
        callback(new Error('请输入大于0的数字'))
      } else {
        let money = (
          Number(this.dataForm.poInfoEntity.totalAmount) -
          Number(this.dataForm.totalRequestAmount)
        ).toFixed(2)
        if (Number(value) > money) {
          callback(new Error(`最大本次申请金额为${money}`))
        } else if (
          !/^(?!0+(?:\.0+)?$)(?:[1-9]\d*|0)(?:\.\d{1,2})?$/.test(Number(value))
        ) {
          callback(new Error(`最大小数位为两位`))
        } else {
          callback()
        }
      }
    }
    // 确认金额校验
    var validpaidAmount = (rule, value, callback) => {
      if (
        !/^([1-9]\d*(\.\d*[1-9])?)|(0\.\d*[1-9])$/.test(value) &&
        value != null
      ) {
        callback(new Error('请输入大于0的数字'))
      } else {
        let money = (
          Number(this.dataForm.poInfoEntity.totalAmount) -
          Number(this.dataForm.totalAmount)
        ).toFixed(2)
        if (Number(value) > money) {
          callback(new Error(`最大确认金额为${money}`))
        } else if (
          !/^(?!0+(?:\.0+)?$)(?:[1-9]\d*|0)(?:\.\d{1,2})?$/.test(Number(value))
        ) {
          callback(new Error(`最大小数位为两位`))
        } else {
          callback()
        }
      }
    }
    return {
      type: '', // 判断是新增还是查看，编辑
      id: '', // 保存成功后返回的id
      visible: false,
      isShow: true,
      isDisabled: false,
      supplierDisabled: false,
      commitControl: false,
      saveControl: false,
      confirmCode: '',
      title: '',
      paymentOptions: [], // 付款方式
      stutasOptions: [], // 单据状态
      dictPayModeOptions: [], // 付款类型
      dataForm: {
        id: 0,
        code: '', // 付款单号
        dictPayType: '',
        payDate: '',
        dictPayMode: '',
        requestAmount: '',
        paidAmount: '',
        currencyId: '',
        dictBizStatus: '',
        supplierId: '',
        poId: '',
        remark: '',
        addUser: '',
        addTime: '',
        updUser: '',
        updTime: '',
        merchantId: '',
        supplierEntity: [],
        poInfoEntity: []
      },
      dataRule: {
        dictPayType: [{ required: true, message: '必填项', trigger: 'blur' }],
        payDate: [{ required: true, message: '必填项', trigger: 'blur' }],
        dictPayMode: [{ required: true, message: '必填项', trigger: 'blur' }],
        requestAmount: [
          { required: true, message: '必填项', trigger: 'blur' },
          { validator: validrequestAmount, trigger: 'blur' }
        ],
        paidAmount: [
          { required: true, message: '必填项', trigger: 'blur' },
          { validator: validpaidAmount, trigger: 'blur' }
        ]
      }
    }
  },
  created () {
    let dictionaries
    // 付款方式
    this.queryDataDict2List((dictionaries = 'PUR_PAY_MODE'))
    // 单据状态
    this.queryDataDict2List((dictionaries = 'APPROVAL_STATUS'))
    // 付款类型
    this.queryDataDict2List((dictionaries = 'PUR_PAY_TYPE'))
  },

  methods: {
    // 查数据字典
    queryDataDict2List (dictionaries) {
      this.$http({
        url: this.$http.adornUrl('basicData/queryDataDict2List'),
        method: 'get',
        params: this.$http.adornParams({
          dataDictKey: dictionaries
        })
      }).then(({ data }) => {
        if (data && data.code === 0) {
          // 四舍五入
          if (dictionaries === 'APPROVAL_STATUS') {
            this.stutasOptions = data.fontMaps
          } else if (dictionaries === 'PUR_PAY_MODE') {
            this.paymentOptions = data.fontMaps
          } else if (dictionaries === 'PUR_PAY_TYPE') {
            this.dictPayModeOptions = data.fontMaps
          }
        }
      })
    },
    init (id, type, data) {
      this.dataForm.id = id
      this.$nextTick(() => {
        if (type === 'receiveList') {
          this.title = '采购付款单新增'
          this.initAdd(data)
        }
        if (type === 'canCheck' && this.dataForm.id) {
          this.title = '采购付款单查看'
          this.initCheck(id)
        }
        if (type === 'canEdit' && this.dataForm.id) {
          this.title = '采购付款单编辑'
          this.initEdit(id)
        }
      })
    },

    // 新增
    initAdd (data) {
      this.type = 'add'
      this.isDisabled = false
      this.supplierDisabled = true
      this.isShow = true
      this.visible = true
      this.dataForm = data.poPaymentDto
      if (this.dataForm.poInfoEntity.paidAmount == null) {
        this.dataForm.poInfoEntity.paidAmount = 0
      }
    },

    // 查看
    initCheck (id) {
      this.getdataList(id)
      this.isShow = false
      this.visible = true
      this.isDisabled = true
      this.supplierDisabled = true
    },

    // 编辑
    initEdit (id) {
      this.getdataList(id)
      this.isShow = true
      this.supplierDisabled = true
      this.visible = true
      this.isDisabled = false
    },

    // 数据调用
    getdataList (id) {
      this.$http({
        url: this.$http.adornUrl(`pur/popayment/info/${id}`),
        method: 'get',
        params: this.$http.adornParams()
      }).then(({ data }) => {
        if (data && data.code === 0) {
          this.dataForm = data.poPaymentDto
          this.dataForm.code = data.poPaymentDto.code
          if (this.dataForm.poInfoEntity.paidAmount == null) {
            this.dataForm.poInfoEntity.paidAmount = 0
          }
        }
      })
    },
    // 表单提交
    dataFormSubmit () {
      this.$refs['dataForm'].validate(valid => {
        if (valid) {
          this.$http({
            url: this.$http.adornUrl(
              `/pur/popayment/${!this.dataForm.id ? 'save' : 'update'}`
            ),
            method: !this.dataForm.id ? 'post' : 'put',
            data: this.$http.adornData({})
          }).then(({ data }) => {
            if (data && data.code === 0) {
              this.$notify({
                type: 'success',
                title: '提示',
                message: '操作成功',
                duration: 3000
              })
              this.visible = false
              this.$emit('refreshDataList')
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
    // 保存
    save: _.debounce(
      async function save () {
        this.$refs['dataForm'].validate(valid => {
          if (valid) {
            if (this.dataForm.requestAmount == 0) {
              this.$notify.error({
                title: '错误',
                message: '本次申请数量应大于0',
                duration: 5000
              })
              return
            }
            this.$http({
              url: this.$http.adornUrl('pur/popayment/save'),
              method: 'post',
              data: this.dataForm
            }).then(({ data }) => {
              if (data && data.code === 0) {
                this.$notify({
                  type: 'success',
                  title: '提示',
                  message: `付款单号${data.entity.code}保存成功`,
                  duration: 5000
                })
                this.visible = false
                this.$emit('refreshDataList')
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
      1000,
      {
        leading: true,
        trailing: false
      }
    ),

    // 确认付款
    commit: _.debounce(
      async function commit () {
        this.$refs['dataForm'].validate(valid => {
          if (valid) {
            if (this.dataForm.paidAmount == 0) {
              this.$notify.error({
                title: '错误',
                message: '确认付款金额应大于0',
                duration: 5000
              })
            } else {
              this.$http({
                url: this.$http.adornUrl('pur/popayment/saveAndConfirm'),
                method: 'post',
                data: this.dataForm
              }).then(({ data }) => {
                if (data && data.code === 0) {
                  this.id = data.entity.id
                  this.confirmCode = data.entity.code
                  this.$notify({
                    type: 'success',
                    title: '提示',
                    message: `付款单${data.entity.code}保存并确认付款成功`,
                    duration: 5000
                  })
                  this.visible = false
                  this.$emit('refreshDataList')
                } else {
                  this.$notify.error({
                    title: '错误',
                    message: data.msg,
                    duration: 5000
                  })
                }
              })
            }
          }
        })
      },
      1000,
      {
        leading: true,
        trailing: false
      }
    ),
    // 付款日期
    formatTime (time) {
      this.dataForm.payDate = time // date是绑定的值
    }
  }
}
</script>
