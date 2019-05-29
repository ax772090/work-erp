<template>
  <div>
    <el-form :model="dataForm"
             :rules="dataRule"
             ref="dataForm"
             label-width="110px"
             :disabled="formDisabled">
      <el-row>
        <el-form-item label="海关编码"
                      prop="code">
          <el-input v-model="dataForm.code"></el-input>
          <a class="a-text"
             href="http://kw.hscode.net/"
             target="_Blank">海关编码查询</a>
        </el-form-item>
      </el-row>
      <el-row>
        <el-form-item label="报关单位"
                      prop="customsUnitId">
          <select-all v-model="dataForm.customsUnitId"
                      :listDataOption="customsUnitIdOptions"
                      data-value="id"
                      data-label="name"></select-all>
        </el-form-item>
      </el-row>
      <el-row>
        <el-form-item label="中文申报名"
                      prop="cnName">
          <el-input v-model="dataForm.cnName"></el-input>
        </el-form-item>
      </el-row>
      <el-row>
        <el-form-item label="英文申报名"
                      prop="enName">
          <el-input v-model="dataForm.enName"></el-input>
        </el-form-item>
      </el-row>
      <el-row>
        <el-form-item label="申报价值"
                      prop="declareMoney">
          <el-input type="Number"
                    @mousewheel.native.prevent
                    v-model="dataForm.declareMoney"
                    placeholder="请输入数字"></el-input>
        </el-form-item>
      </el-row>
      <el-row>
        <el-form-item label="申报币别"
                      prop="currencyId">
          <select-all v-model="dataForm.currencyId"
                      :listDataOption="currencyIdOptions"
                      data-value="id"
                      data-label="name"></select-all>
        </el-form-item>
      </el-row>
      <el-row>
        <el-form-item label="申报要素"
                      prop="declareFactor">
          <textarea-all v-model="dataForm.declareFactor"></textarea-all>
        </el-form-item>
      </el-row>
    </el-form>
  </div>
</template>
<script>
import selectSeach from '@/components/erp-select/select-seach'
import selectAll from '@/components/erp-select/select-all'
import Bus from '@/components/js/bus.js'
// 备注组件
import textareaAll from '@/components/erp-input/textarea-all'
import { ruleData } from '@/mixins/initData.js'
export default {
  name: 'proddevCustoms',
  props: ['value'],
  mixins: [ruleData],
  components: {
    selectSeach,
    selectAll,
    textareaAll
  },
  data () {
    return {
      isCheck: false,
      customsUnitIdOptions: [], // 报关单位
      currencyIdOptions: [], // 申报价值
      formDisabled: false,
      rowList: {
        node: ''
      },
      dataForm: {
        id: '',
        code: '',
        cnName: '',
        enName: '',
        customsUnitId: '',
        declareMoney: '',
        currencyId: '',
        declareFactor: '',
        customsId: '',
        pordId: ''
      },
      dataRule: {
      }
    }
  },
  created () {
    // 币种主键
    this.$http.get(this.$http.adornUrl('dict/dictcurrency/listcombobox')).then(({ data }) => { this.currencyIdOptions = data.list })
    // 报关单位
    this.$http.get(this.$http.adornUrl('/dict/dictunit/listcombobox')).then(({ data }) => { this.customsUnitIdOptions = data.list })
  },
  methods: {
    init (id, type, handleType, row) {
      this.isCheck = false
      this.rowList = row
      // this.$refs['dataForm'].clearValidate()
      // 5
      if (handleType === 'canCheck') {
        this.formDisabled = true
        this.isCheck = true
      }
      // 审核
      if (handleType === 'canApproval') {
        this.formDisabled = true
        if (row.node === 'T02') {
          this.formDisabled = false
        }
      }
      this.dataForm.pordId = id
      this.type = type
      this.$nextTick(() => {
        if (this.dataForm.pordId) {
          this.$http({
            url: this.$http.adornUrl(`prod/proddevbasic/info/${this.dataForm.pordId}/${this.type}`),
            method: 'get'
          }).then(({ data }) => {
            if (data && data.code === 0) {
              // this.dataForm.customsId = data.prodDevBasicEntity.customsId
              this.dataForm.id = data.prodDevBasicEntity.customsId
              this.dataForm.code = data.prodDevBasicEntity.customsCode
              this.dataForm.customsUnitId = data.prodDevBasicEntity.customsUnitId
              this.dataForm.cnName = data.prodDevBasicEntity.customsCnName
              this.dataForm.enName = data.prodDevBasicEntity.customsEnName
              this.dataForm.declareMoney = data.prodDevBasicEntity.customsDeclareMoney
              this.dataForm.currencyId = data.prodDevBasicEntity.customsCurrencyId
              this.dataForm.declareFactor = data.prodDevBasicEntity.customsDeclareFactor
            }
          })
        }
      })
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
                type: '11',
                basicCustomsEntity: this.dataForm
              }, false)
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

    // 校验
    validate () {
      return new Promise((resolve, reject) => {
        if (this.isCheck) {
          resolve(true)
          return
        }
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
        this.$emit('input', this.dataForm)
      },
      deep: true
    }
  }
}
</script>
