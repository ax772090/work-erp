<template>
  <el-dialog :title="!dataForm.id ? '汇率新增' : isClick === true ? '汇率编辑' : '汇率查看'"
             :close-on-click-modal="false"
             :visible.sync="visible"
             append-to-body
             width="30%"
             @close="$refs['dataForm'].resetFields()">
    <el-form :model="dataForm"
             :rules="dataRule"
             ref="dataForm"
             label-width="110px">
      <el-row>
        <el-col :span="24">
          <el-form-item label="汇率类型"
                        prop="exchangeRateType">
            <select-all v-model="dataForm.exchangeRateType"
                        :listDataOption="exchangeRateTypeOptions"
                        data-value="key"
                        data-label="value"
                        :isDisabled="isDisabled"></select-all>

          </el-form-item>
          <el-form-item label="原币"
                        prop="originalCurrency">
            <select-all v-model="dataForm.originalCurrency"
                        :listDataOption="originalCurrencyOptions"
                        :isDisabled="isDisabled || isoriginalCurrency"
                        data-value="id"
                        data-label="name"></select-all>
          </el-form-item>
          <el-form-item label="本位币"
                        prop="localCurrency">
            <select-all v-model="dataForm.localCurrency"
                        :listDataOption="localCurrencyOptions"
                        :isDisabled="true"
                        data-value="id"
                        data-label="name"></select-all>
          </el-form-item>
          <el-form-item label="直接汇率"
                        prop="exchangeRate">
            <el-input v-model="dataForm.exchangeRate"></el-input>
          </el-form-item>
          <el-form-item label="生效日期"
                        prop="effectiveDate">
            <el-date-picker v-model="dataForm.effectiveDate"
                            type="date"
                            value-format="yyyy-MM-dd"
                            :disabled="isDisabled"></el-date-picker>
          </el-form-item>
          <el-form-item label="失效日期"
                        prop="expirationDate">
            <el-date-picker v-model="dataForm.expirationDate"
                            type="date"
                            value-format="yyyy-MM-dd"
                            :disabled="isDisabled"></el-date-picker>
          </el-form-item>
        </el-col>
      </el-row>

    </el-form>
    <div slot="footer"
         class="dialog-footer">
      <el-button @click="visible = false"><i class="iconfont erp-icon-quxiao"></i>取消</el-button>
      <el-button type="primary"
                 @click="save()"
                 :disabled="isSave"><i class="iconfont erp-icon-baocun"></i>保存</el-button>
    </div>
  </el-dialog>
</template>
<script>
import selectSeach from '@/components/erp-select/select-seach'
import selectAll from '@/components/erp-select/select-all'
import { dateFormatter } from '@/utils/index.js'
import { basicDataQueryAllCurrency, dictExchangeReteType } from '@/api/common/common.api'
import { basicRateInfo, basicRateSave, basicRateUpdate } from '@/api/basic/basic.js'

export default {
  components: {
    selectSeach,
    selectAll
  },
  data () {
    var validateInteger = (rule, value, callback) => {
      var startNum = parseInt(
        this.dataForm.effectiveDate.replace(/-/g, ''),
        10
      )
      var endNum = parseInt(value.replace(/-/g, ''), 10)
      if (startNum > endNum) {
        callback(new Error('失效日期不能小于生效日期'))
      } else {
        callback()
      }
    }
    var validtaxInteger = (rule, value, callback) => {
      if (!/^(?!(0[0-9]{0,}$))[0-9]{1,}[.]{0,}[0-9]{0,}$/.test(value)) {
        callback(new Error('汇率请输入大于0的数字'))
      } else {
        if (value > 100000000) {
          callback(new Error('汇率请输入八位数以内的值'))
        } else {
          callback()
        }
      }
    }
    return {
      originalCurrencyOptions: [], //
      localCurrencyOptions: [], // 本位币
      visible: false,
      isSave: true,
      isDisabled: false,
      isClick: false,
      isoriginalCurrency: false,
      islocalCurrency: false,
      exchangeRateTypeOptions: [], // 汇率类型
      dataForm: {
        id: '',
        effectiveDate: '',
        expirationDate: '',
        addUser: ''
      },
      dataRule: {
        originalCurrency: [
          { required: true, message: '必填项', trigger: 'change' } // 原币
        ],
        localCurrency: [
          { required: true, message: '必填项', trigger: 'blur' } // 本位币
        ],
        exchangeRate: [
          { required: true, message: '必填项', trigger: 'blur' },
          { validator: validtaxInteger, trigger: 'blur' }
        ], // 直接汇率
        effectiveDate: [
          { required: true, message: '必填项', trigger: 'change' } // 生效日期
        ],
        expirationDate: [
          { required: true, message: '必填项', trigger: 'change' }, // 失效日期
          { validator: validateInteger, trigger: 'change' }
        ]
      }
    }
  },
  created () {
    // 原币/本位币
    basicDataQueryAllCurrency().then(data => {
      this.originalCurrencyOptions = data.currencyList
      this.localCurrencyOptions = data.currencyList
    })
    // 汇率类型
    dictExchangeReteType().then(data => { this.exchangeRateTypeOptions = data.fontMaps })
    this.$nextTick(() => {
      this.dataForm.effectiveDate = dateFormatter(new Date(), false)
      this.dataForm.expirationDate = dateFormatter(new Date(), false)
      this.dataForm.localCurrency = 'CNY' // 本位币默认为人民币
      this.dataForm.exchangeRateType = '01' // 汇率类型默认为固定汇率
    })
  },
  methods: {
    // // 取消按钮
    // cancel(formName) {
    //   this.clearCache(formName);
    // },
    // // 关闭清除本次缓存
    // clearCache(formName) {
    //   this.$refs[formName].resetFields();
    //   this.dataForm = {};
    //   this.visible = false;
    // },
    // // 弹窗关闭之前
    // handleClose(done) {
    //   this.clearCache("dataForm");
    //   done();
    // },
    init (id, type) {
      this.dataForm.addTime = ''
      this.dataForm.addUser = ''
      this.dataForm.updTime = ''
      this.dataForm.updUser = ''
      this.visible = true
      this.dataForm.id = id
      this.$nextTick(() => {
        this.editor(type)
        this.add()
      })
      this.$nextTick(() => {
        if (this.dataForm.id) {
          basicRateInfo(this.dataForm.id, true).then(data => {
            this.dataForm = data.exchangeRateEntity
          }).catch(e => {
            this.notifyError(e.data.msg)
          })
        }
      })
    },
    // 编辑页面
    editor (type) {
      if (this.dataForm.id && type === 'canEdit') {
        this.isClick = true
        this.isDisabled = false
        this.isSave = false
        this.isoriginalCurrency = true // 编辑锁定原币
        this.islocalCurrency = true // 编辑锁定本位币
      }
    },
    // 新增页面
    add () {
      if (!this.dataForm.id) {
        this.isSave = false
        this.isDisabled = false
        this.dataForm.addUser = ''
        this.dataForm.addTime = ''
        this.isoriginalCurrency = false
        this.islocalCurrency = false
      }
    },
    // 新增/编辑
    basicrateHttp () {
      // 新增
      if (!this.dataForm.id) {
        basicRateSave(this.dataForm).then((data) => {
          this.$emit('refreshDataList')
          this.visible = false
          this.notifySuccess('操作成功')
        }).catch((error) => {
          this.notifyError(error.data.msg)
        })
      }
      // 编辑
      if (this.dataForm.id) {
        basicRateUpdate(this.dataForm).then((data) => {
          this.$emit('refreshDataList')
          this.visible = false
          this.notifySuccess('操作成功')
        }).catch((error) => {
          this.notifyError(error.data.msg)
        })
      }
    },
    // 保存
    save: _.debounce(
      async function save () {
        this.$refs['dataForm'].validate(valid => {
          if (valid) {
            // 原币和本位币不能相同
            if (this.dataForm.originalCurrency === this.dataForm.localCurrency) {
              this.$notify.error({
                title: '错误',
                message: '原币和本位币不能相同',
                duration: 3000
              })
              return
            }
            this.basicrateHttp()
          } else {
            return false
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
      },
      deep: true
    }
  }
}
</script>
