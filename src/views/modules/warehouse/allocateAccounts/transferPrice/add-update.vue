<template>
  <el-dialog :title="!dataForm.id ? '内部转移单价新增' : isClick === true ? '内部转移单价编辑' : '内部转移单价查看'"
             :close-on-click-modal="false"
             :visible.sync="visible"
             @close="$refs['dataForm'].resetFields()"
             width="50%">
    <el-form :model="dataForm"
             :rules="dataRule"
             ref="dataForm"
             label-width="110px">
      <el-row>
        <el-col :span="12">
          <el-form-item label="销售公司"
                        prop="saleCompId">
            <select-all v-model="dataForm.saleCompId"
                        :isDisabled="isDisabled"
                        :listDataOption="saleCompOptions"
                        data-value="id"
                        data-label="name"
                        :isSelectChange="true"
                        @selectChange="saleCompchange"></select-all>
          </el-form-item>
          <el-form-item label="付款公司"
                        prop="payCompId">
            <el-select v-model="dataForm.payCompId"
                       :disabled="isDisabled">
              <el-option v-for="item in payCompOptions"
                         :key="item.id"
                         :label="item.name"
                         :value="item.id"
                         :disabled="item.disabled"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="产品编码"
                        prop="code">
            <select-seach :isDisabled="isDisabled"
                          v-model="dataForm.code"
                          httpUrl="/prod/prodbasic/queryForComplete"
                          httpMethod="get"
                          requestParamsKey="code"
                          data-label-right='name_ch'
                          :showName='true'
                          data-label="code"
                          data-value="id"
                          data-source="list"
                          isSelectChange="true"
                          @selectChange="codeValue"></select-seach>
          </el-form-item>
          <el-form-item label="产品名称"
                        prop="prodName">
            <el-input v-model="dataForm.prodName"
                      :disabled="isDisabled || iscode"
                      min-width="50px;"></el-input>
          </el-form-item>
          <el-form-item label="规格型号"
                        prop="specifications">
            <el-input v-model="dataForm.specifications"
                      :disabled="isDisabled || iscode"
                      min-width="50px;"></el-input>
          </el-form-item>
          <el-form-item label="备注"
                        prop="remark">
            <textarea-all :disabled="isDisabled"
                          v-model="dataForm.remark"></textarea-all>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="结算币种"
                        prop="currencyName">
            <el-input v-model="dataForm.currencyName"
                      disabled></el-input>
          </el-form-item>
          <el-form-item label="税率"
                        prop="tax">
            <el-input v-model="dataForm.tax"
                      type="Number"
                      :disabled="isDisabled"
                      @mousewheel.native.prevent></el-input>
          </el-form-item>
          <el-form-item label="结算单价"
                        prop="salesPrice">
            <el-tooltip :content="message"
                        placement="right">
              <el-input v-model="dataForm.salesPrice"
                        type="Number"
                        @mousewheel.native.prevent
                        :placeholder="message"
                        :disabled="isDisabled"></el-input>
            </el-tooltip>
          </el-form-item>
          <el-form-item label="生效日期"
                        prop="startDate">
            <el-date-picker v-model="dataForm.startDate"
                            type="date"
                            value-format="yyyy-MM-dd"
                            :disabled="isDisabled"></el-date-picker>
          </el-form-item>
          <el-form-item label="失效日期"
                        prop="endDate">
            <el-date-picker v-model="dataForm.endDate"
                            type="date"
                            value-format="yyyy-MM-dd"
                            :disabled="isDisabled"></el-date-picker>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
    <span slot="footer"
          class="dialog-footer">
      <el-button @click="visible = false;"><i class="iconfont erp-icon-quxiao"></i>取消</el-button>
      <el-button type="primary"
                 @click="savess()"
                 :disabled="isSave"
                 v-if='!isSave'><i class="iconfont erp-icon-baocun"></i>保存</el-button>
    </span>
  </el-dialog>
</template>
<script>
import selectSeach from '@/components/erp-select/select-seach'
import selectAll from '@/components/erp-select/select-all'

import { dateFormatter } from '@/utils/index.js'
// 备注
import textareaAll from '@/components/erp-input/textarea-all.vue'
import _ from 'lodash'
export default {
  components: {
    selectSeach,
    selectAll,
    textareaAll
  },
  data () {
    var validateInteger = (rule, value, callback) => {
      var startNum = parseInt(this.dataForm.startDate.replace(/-/g, ''), 10)
      var endNum = parseInt(value.replace(/-/g, ''), 10)
      if (startNum > endNum) {
        callback(new Error('失效日期不能小于生效日期'))
      } else if (!endNum) {
        callback(new Error('请选择失效日期'))
      } else {
        callback()
      }
    }
    var validpriceInteger = (rule, value, callback) => {
      if (!/^([1-9]\d*(.\d*[1-9])?)|(0.\d*[1-9])$/.test(value)) {
        callback(new Error('结算单价请输入大于0的数字'))
      } else {
        callback()
      }
    }
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
    return {
      visible: false,
      message: '请输入不含税单价',
      isSave: true,
      isDisabled: false,
      isClick: false,
      iscode: true,
      saleCompOptions: [], // 销售公司
      payCompOptions: [], // 付款公司

      dataForm: {
        id: '',
        startDate: '',
        endDate: '',
        remark: '',
        tax: '',
        prodId: '',
        prodName: '',
        specifications: '',
        comp: '',
        currencyId: '',
        saleCompId: '',
        currencyName: '',
        bUsed: false,
        hUsed: false
      },
      dataRule: {
        saleCompId: [{ required: true, message: '必填项', trigger: 'change' }], // 销售公司
        payCompId: [{ required: true, message: '必填项', trigger: 'change' }], // 付款公司
        prodName: [
          { message: '必填项', trigger: 'change' } // 产品名称
        ],
        salesPrice: [
          { required: true, message: '必填项', trigger: 'change' }, // 销售单价
          { validator: validpriceInteger, trigger: 'change' }
        ],
        tax: [{ validator: betweenInt(0.01, 0.99), trigger: 'change' }], // 税率
        startDate: [
          { required: true, message: '必填项', trigger: 'change' } // 生效日期
        ],
        endDate: [
          { required: true, message: '必填项', trigger: 'change' }, // 失效日期
          { validator: validateInteger, trigger: 'change' }
        ]
      }
    }
  },
  created () {
    // 销售公司
    this.$http
      .get(this.$http.adornUrl('list/combobox/company'))
      .then(({ data }) => {
        this.saleCompOptions = data.list
        this.payCompOptions = data.list
      })
  },
  methods: {
    init (id, type) {
      this.dataForm = {
        saleCompId: '',
        startDate: '',
        currencyName: ''
      }
      this.dataForm.confirmTime = ''
      this.dataForm.confirmUser = ''
      this.dataForm.addTime = ''
      this.dataForm.addUser = ''
      this.dataForm.updTime = ''
      this.dataForm.updUser = ''
      this.visible = true
      this.dataForm.id = id
      this.$nextTick(() => {
        if (id && type === 'canEdit') {
          this.initEdit(id)
        }
        if (id && type === 'canCheck') {
          this.initCheck(id)
        }
        if (type === 'canAdd') {
          this.initAdd()
        }
        if (!id) {
          this.dataForm.startDate = dateFormatter(new Date(), false)
        }
      })
    },

    // 新增
    initAdd () {
      this.isSave = false
      this.isDisabled = false
      // 默认公司
      this.dataForm.saleCompId = sessionStorage.getItem('orgId')
      this.$nextTick(() => {
        this.saleCompchange(this.dataForm.saleCompId, '1')
      })
    },

    // 查看
    initCheck (id) {
      this.getDataList(id)
      this.isClick = false
      this.isDisabled = true
      this.isSave = true
    },

    // 编辑
    initEdit (id) {
      this.getDataList(id)
      this.isClick = true
      this.isDisabled = false
      this.isSave = false
    },

    // 调取数据
    getDataList (id) {
      this.$http({
        url: this.$http.adornUrl(
          `warehouse/basictransferpricing/info/${this.dataForm.id}`
        ),
        method: 'get'
      }).then(({ data }) => {
        if (data && data.code === 0) {
          this.saleCompchange(data.basicTransferPricing.saleCompId, this.dataForm.id) // 初始化
          this.dataForm = data.basicTransferPricing
          this.dataForm.code = data.basicTransferPricing.prodEntity.code
          this.$set(
            this.dataForm,
            'prodName',
            data.basicTransferPricing.prodEntity.nameCh
          )
          this.$set(this.dataForm, 'specifications', data.basicTransferPricing.prodEntity.specifications)
        } else {
          this.$notify.error({
            title: '错误',
            message: data.msg,
            duration: 3000
          })
        }
      })
    },

    initCurrency (value) {
      this.$http
        .get(
          this.$http.adornUrl('warehouse/basictransferpricing/queryCurrency'),
          { params: { compId: value } }
        )
        .then(({ data }) => {
          if (data.currency) {
            this.$set(this.dataForm, 'currencyName', data.currency.name)
            this.dataForm.currencyName = data.currency.name
            this.dataForm.currencyId = data.currency.id
          }
        })
      this.payCompOptions.forEach(item => {
        item.id === value || item.id === this.dataForm.saleCompId
          ? (item.disabled = true)
          : (item.disabled = false)
      })
    },

    // 选择销售公司，禁用掉相同的付款公司
    saleCompchange (value, type) {
      if (type) {
        this.initCurrency(value)
      } else {
        this.dataForm.currencyName = ''
        this.initCurrency(value)
      }
    },
    codeValue (value) {
      this.dataForm.code = value.code
      this.dataForm.prodName = value.name_ch
      this.dataForm.specifications = value.specifications
      if (this.dataForm.prodName) {
        this.iscode = true
      } else {
        this.iscode = false
      }
      this.dataForm.prodId = value.id
    },
    // 保存
    savess: _.debounce(
      async function savess () {
        this.$refs['dataForm'].validate(valid => {
          if (valid) {
            if (!this.dataForm.code) {
              this.$notify.error({
                title: '错误',
                message: '产品编码不能为空',
                duration: 3000
              })
              return
            }
            // 判断结算币种是否为空
            if (!this.dataForm.currencyName) {
              this.$notify.error({
                title: '错误',
                message:
                  '销售公司作为付款公司的供应商，在供应商表中没有找到该公司，请先维护。',
                duration: 3000
              })
              return
            }
            // 销售公司和付款公司不能相同
            if (this.dataForm.saleCompId === this.dataForm.payCompId) {
              this.$notify.error({
                title: '错误',
                message: '销售公司和付款公司不能相同，请更改',
                duration: 3000
              })
              return
            }
            // 新增时，bUsed传true,hUsed传false
            if (!this.dataForm.id) {
              this.dataForm.bUsed = true
              this.dataForm.hUsed = false
            }
            this.$http({
              url: this.$http.adornUrl(
                `warehouse/basictransferpricing/${
                this.dataForm.id ? 'update' : 'save'
                }`
              ),
              method: `${this.dataForm.id ? 'put' : 'post'}`,
              data: this.dataForm
            }).then(({ data }) => {
              if (data && data.code === 0) {
                this.$emit('refreshDataList')
                this.visible = false
                this.$notify({
                  type: 'success',
                  title: '提示',
                  message: `${!this.dataForm.id ? '新增' : '修改'}成功`,
                  duration: 3000
                })
              } else {
                this.$notify.error({
                  title: '错误',
                  message: data.msg,
                  duration: 3000
                })
              }
            })
          }
        })
      }, 1000, {
        leading: true,
        trailing: false
      }
    )
  },
  watch: {
    // 父组件传值给当前子组件 对应 :value=...
    value: {
      handler (val, oldVal) {
        this.searchData = this.value
        // 该行与v-model无关，为的是让父级监听该事件并做其他事
        this.$emit('change', this.searchData)
      },
      // 深度监听，可监听到对象、数组的变化
      deep: true
    },
    // 当前组件变动后，抛出事件
    dataForm: {
      // 深度监听，可监听到对象、数组的变化
      handler (val, oldVal) {
        this.$emit('input', this.dataForm) // 用于出发v-model原始事件，避免父级其他监听
        if (this.dataForm.tax) {
          this.message = '请输入含税金额'
        } else {
          this.message = '请输入不含税金额'
        }
      },
      deep: true
    }
  }
}
</script>

