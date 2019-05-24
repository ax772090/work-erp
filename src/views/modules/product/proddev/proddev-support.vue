<template>
  <div>
    <el-form :model="dataForm"
             :rules="dataRule"
             ref="dataForm"
             label-width="111px"
             :disabled="formDisabled">
      <el-row>
        <el-col :span="8">
          <el-badge class="item">产品信息:</el-badge>
          <el-form-item type="Number"
                        @mousewheel.native.prevent
                        label="产品重量(kg)"
                        prop="prodWeight"
                        :rules="dataRule.isWeight">
            <el-input v-model="dataForm.prodWeight"
                      type="Number"
                      @mousewheel.native.prevent></el-input>
          </el-form-item>
          <el-form-item label="长度单位"
                        prop="prodUnit"
                        :rules="dataRule.isPositive">
            <select-all v-model="dataForm.prodUnit"
                        :listDataOption="prodUnitOption"
                        data-value="key"
                        data-label="value"></select-all>
          </el-form-item>
          <el-form-item label="长"
                        prop="prodLength"
                        :rules="dataRule.isPositive">
            <el-input v-model="dataForm.prodLength"
                      type="Number"
                      @mousewheel.native.prevent></el-input>
          </el-form-item>
          <el-form-item label="宽"
                        prop="prodWide"
                        :rules="dataRule.isPositive">
            <el-input v-model="dataForm.prodWide"
                      type="Number"
                      @mousewheel.native.prevent></el-input>
          </el-form-item>
          <el-form-item label="高"
                        prop="prodHeight"
                        :rules="dataRule.isPositive">
            <el-input v-model="dataForm.prodHeight"
                      type="Number"
                      @mousewheel.native.prevent></el-input>
          </el-form-item>
          <el-form-item label="体积"
                        prop="prodSize">
            <el-input v-model="dataForm.prodSize"
                      disabled></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-badge class="item">彩盒(包装)信息:</el-badge>
          <el-form-item label="重量(kg)"
                        prop="inboxWeight"
                        :rules="dataRule.isWeight">
            <el-input v-model="dataForm.inboxWeight"
                      type="Number"
                      @mousewheel.native.prevent></el-input>
          </el-form-item>
          <el-form-item label="长度单位"
                        prop="inboxUnit"
                        :rules="dataRule.isPositive">
            <select-all v-model="dataForm.inboxUnit"
                        :listDataOption="prodUnitOption"
                        data-value="key"
                        data-label="value"></select-all>
          </el-form-item>
          <el-form-item label="长"
                        prop="inboxLength"
                        :rules="dataRule.isPositive">
            <el-input v-model="dataForm.inboxLength"
                      type="Number"
                      @mousewheel.native.prevent></el-input>
          </el-form-item>
          <el-form-item label="宽"
                        prop="inboxWide"
                        :rules="dataRule.isPositive">
            <el-input v-model="dataForm.inboxWide"
                      type="Number"
                      @mousewheel.native.prevent></el-input>
          </el-form-item>
          <el-form-item label="高"
                        prop="inboxHeight"
                        :rules="dataRule.isPositive">
            <el-input v-model="dataForm.inboxHeight"
                      type="Number"
                      @mousewheel.native.prevent></el-input>
          </el-form-item>
          <el-form-item label="体积"
                        prop="inboxSize">
            <el-input v-model="dataForm.inboxSize"
                      disabled></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-badge class="item">外箱信息:</el-badge>
          <el-form-item label="整箱单位"
                        prop="outboxUnitId">
            <select-all v-model="dataForm.outboxUnitId"
                        :listDataOption="outboxUnitIdOptions"
                        data-value="id"
                        data-label="name"></select-all>
          </el-form-item>
          <el-form-item label="长(cm)"
                        prop="outboxLength"
                        :rules="dataRule.isPositive">
            <el-input v-model="dataForm.outboxLength"
                      type="Number"
                      @mousewheel.native.prevent></el-input>
          </el-form-item>
          <el-form-item label="宽(cm)"
                        prop="outboxWide"
                        :rules="dataRule.isPositive">
            <el-input v-model="dataForm.outboxWide"
                      type="Number"
                      @mousewheel.native.prevent></el-input>
          </el-form-item>
          <el-form-item label="高(cm)"
                        prop="outboxHeight"
                        :rules="dataRule.isPositive">
            <el-input v-model="dataForm.outboxHeight"
                      type="Number"
                      @mousewheel.native.prevent></el-input>
          </el-form-item>
          <el-form-item label="单箱体积(cm³)"
                        prop="outboxSize">
            <el-input v-model="dataForm.outboxSize"
                      disabled></el-input>
          </el-form-item>
          <el-form-item label="单箱重量(kg)"
                        prop="outboxWeight"
                        :rules="dataRule.isWeight">
            <el-input v-model="dataForm.outboxWeight"
                      type="Number"
                      @mousewheel.native.prevent></el-input>
          </el-form-item>
          <el-form-item label="单箱数量"
                        prop="outboxQty"
                        :rules="dataRule.isInteger">
            <el-input v-model="dataForm.outboxQty"
                      type="Number"
                      @mousewheel.native.prevent></el-input>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
  </div>
</template>

<script>
import selectAll from '@/components/erp-select/select-all'
import Bus from '@/components/js/bus.js'

export default {
  name: 'proddevSupport',
  props: ['value'],

  components: {
    selectAll
  },

  data () {
    // 重量保留4位小数
    var validateDecimals = (rule, value, callback) => {
      // let subString = rule.field.split('[')[1]
      // let valueIndex = subString.split(']')[0]
      // if (!this.dataForm.poDetails[valueIndex].bGifts) {
      // 需大于0,保留两位小数
      if (!/(^[0-9](\d+)?(\.\d{1,2})?$)|(^\d\.\d{1,4}$)/.test(value) && value != null) {
        callback(new Error('需大于0,保留四位小数'))
      } else {
        callback()
      }
      // } else {
      //   if (this.dataForm.poDetails[valueIndex].price != 0) {
      //     callback(new Error('赠品单价为0'))
      //   } else {
      //     callback()
      //   }
      // }
    }
    return {
      outboxUnitIdOptions: [], // 整箱单位
      prodUnitOption: [],   // 长度单位
      formDisabled: false,

      filterProperty: { dataDictKey: 'PRODUCT_PROPERTIES' },

      // 空运币种
      airCurrencyIdOptions: '',
      // 海运币种
      seaCurrencyIdOptions: '',
      // 辅助属性类别
      supportTypeDictOptions: '',

      dataForm: {
        prodId: 0,
        prodWeight: 0,
        prodLength: 0,
        prodWide: 0,
        prodHeight: 0,
        prodSize: 0,
        inboxWeight: 0,
        inboxLength: 0,
        inboxWide: 0,
        inboxHeight: 0,
        inboxSize: 0,
        outboxUnitId: '',
        outboxLength: 0,
        outboxWeight: 0,
        outboxWide: 0,
        outboxHeight: 0,
        outboxSize: 0,
        outboxQty: 0,
        prodUnit: '01',  // 长度单位默认
        inboxUnit: '01'    // 长度单位默认
      },

      dataRule: {
        isInteger: [
          { required: true, message: '必填项', trigger: 'blur' },
          { pattern: /^\d+$/, message: '正整数', trigger: 'blur' }
        ],
        isWeight: [
          { required: true, message: '必填项', trigger: 'blur' },
          // { pattern: /^\d+(\.\d+)?$/, message: '须正数', trigger: 'blur' },
          { validator: validateDecimals, trigger: 'blur' }
        ],
        isPositive: [
          { required: true, message: '必填项', trigger: 'blur' },
          { pattern: /^\d+(\.\d+)?$/, message: '须正数', trigger: 'blur' }
        ],
        outboxSize: [
          { required: true, message: '必填项', trigger: 'blur' }
        ],
        outboxUnitId: [
          { required: true, message: '必填项', trigger: 'blur' }
        ],
        inboxSize: [
          { required: true, message: '必填项', trigger: 'blur' }
        ],
        prodSize: [
          { required: true, message: '必填项', trigger: 'blur' }
        ]
      }
    }
  },

  created () {
    // 空运币种
    this.$http.get(this.$http.adornUrl('dict/dictcurrency/listcombobox')).then(({ data }) => {
      this.airCurrencyIdOptions = data.list
      this.seaCurrencyIdOptions = data.list
    })
    // 海运币种
    this.$http.get(this.$http.adornUrl('dict/dictcurrency/listcombobox')).then(res => { })
    //   整箱单位
    this.$http.get(this.$http.adornUrl('/dict/dictunit/listcombobox')).then(({ data }) => { this.outboxUnitIdOptions = data.list })
  },
  methods: {
    init (id, type, handleType) {
      // 长度单位
      this.$http
        .get(this.$http.adornUrl('basicData/queryDataDict2List'), {
          params: { dataDictKey: 'PRODUCT_UNIT' }
        })
        .then(({ data }) => {
          this.prodUnitOption = data.fontMaps
        })
      this.dataForm.prodUnit = '01'
      this.dataForm.inboxUnit = '01'
      // 1
      if (handleType === 'canCheck') {
        this.formDisabled = true
      }
      // 审核
      if (handleType === 'canApproval') {
        this.formDisabled = true
      }
      this.$nextTick(() => {
        // this.resetData(id)
        this.dataForm.id = id
        this.type = type
        if (this.dataForm.id) {
          this.$http({
            url: this.$http.adornUrl(`prod/proddevbasic/info/${this.dataForm.id}/${this.type}`),
            method: 'get',
            params: this.$http.adornParams()
          }).then(({ data }) => {
            if (data && data.code === 0) {
              this.dataForm = data.prodDevSupportEntity
            }
          })
        }
      })
    },

    propertyChange (val) {
      if (val) {
        this.dataForm.supportTypeDict = ''
      }
    },

    // 表单提交
    dataFormSubmit: _.debounce(
      async function dataFormSubmit (id, type) {
        this.$refs['dataForm'].validate(valid => {
          if (valid) {
            this.$http({
              url: this.$http.adornUrl('prod/proddevbasic/update'),
              method: 'put',
              data: this.$http.adornData({
                prodId: id,
                type: type,
                prodDevSupportEntity: this.dataForm
              })
            }).then(({ data }) => {
              if (data && data.code === 0) {
                Bus.$emit('prodDevTabsChildren')
                // this.$emit('nextStep')
                this.$notify.success({
                  message: '保存成功',
                  duration: 5000
                })
              } else {
                this.$notify.error({
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

    // 清空
    resetData (isReset) {
      if (!isReset) {
        this.$nextTick(() => {
          this.$refs['dataForm'].resetFields()
        })
      }
    },

    // 校验
    validate () {
      return new Promise((resolve, reject) => {
        this.$refs['dataForm'].validate(valid => {
          if (valid) {
            resolve(valid)
          } else {
            reject(valid)
          }
        })
      })
    }
  },
  // 自动计算体积
  // computed:{
  //   prodSize() {
  //     return this.dataForm.prodLength *this.dataForm.prodWide*this.dataForm.prodHeight
  //   }
  // },
  watch: {
    value: {
      handler (val, oldVal) {
        this.dataForm = this.value
        this.$emit('change', this.dataForm)
      },
      deep: true
    },
    dataForm: {
      handler (val, oldVal) {
        // 动态计算体积
        if (val.prodLength && val.prodWide && val.prodHeight) {
          val.prodSize = (val.prodLength * val.prodWide * val.prodHeight).toFixed(2)
        } else {
          val.prodSize = 0
        }
        if (val.inboxLength && val.inboxWide && val.inboxHeight) {
          val.inboxSize = (val.inboxLength * val.inboxWide * val.inboxHeight).toFixed(2)
        } else {
          val.inboxSize = 0
        }
        if (val.outboxLength && val.outboxWide && val.outboxHeight) {
          val.outboxSize = (val.outboxLength * val.outboxWide * val.outboxHeight).toFixed(2)
        } else {
          val.outboxSize = 0
        }
        this.$emit('input', this.dataForm)
      },
      deep: true
    }
  }
}
</script>
<style scoped>
.item {
  margin-bottom: 20px;
  margin-left: 20px;
  font-size: 20px;
  font-weight: 600;
}
</style>