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
          <el-input v-model="dataForm.declareMoney"
                    placeholder="请输入数字"
                    type="Number"
                    @mousewheel.native.prevent></el-input>
        </el-form-item>
      </el-row>
      <el-row>
        <el-form-item label="申报币种"
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
import selectAll from '@/components/erp-select/select-all'
// 备注组件
import textareaAll from '@/components/erp-input/textarea-all'
import Bus from '@/components/js/bus.js'

export default {
  props: ['value'],
  components: {
    selectAll,
    textareaAll
  },
  data () {
    return {
      isCheck: false,
      currencyIdOptions: [], // 币种
      customsUnitIdOptions: [], // 报关单位
      formDisabled: false,
      // 是否正在远程搜索=>海关编码
      supplierLoading: false,
      type: '',
      dataForm: {
        id: '',
        code: '',
        customsUnitId: '',
        cnName: '',
        enName: '',
        customsId: '',
        pordId: '',
        declareMoney: '',
        currencyId: '',
        declareFactor: ''
      },
      dataRule: {
      }
    }
  },
  // mounted: {},
  created () {
    // 币种主键
    this.$http.get(this.$http.adornUrl('dict/dictcurrency/listcombobox')).then(({ data }) => { this.currencyIdOptions = data.list })
    // 报关单位
    this.$http.get(this.$http.adornUrl('/dict/dictunit/listcombobox')).then(({ data }) => { this.customsUnitIdOptions = data.list })
  },
  methods: {
    init (id, type, handleType, dataForm) {
      this.isCheck = false
      // 1
      this.dataForm.pordId = id
      this.type = type
      if (handleType === '1') {
        this.isCheck = true
        this.formDisabled = true
      } else if (handleType === 'copy') {
        this.dataForm.id = dataForm.prodBasicEntity.customsId
        // this.dataForm.customsId = dataForm.prodBasicEntity.customsId
        this.dataForm.code = dataForm.prodBasicEntity.customsCode
        this.dataForm.customsUnitId = dataForm.prodBasicEntity.customsUnitId
        this.dataForm.cnName = dataForm.prodBasicEntity.customsCnName
        this.dataForm.enName = dataForm.prodBasicEntity.customsEnName
        this.dataForm.declareMoney =
          dataForm.prodBasicEntity.customsDeclareMoney
        this.dataForm.currencyId = dataForm.prodBasicEntity.customsCurrencyId
        this.dataForm.declareFactor =
          dataForm.prodBasicEntity.customsDeclareFactor
      }
      this.$nextTick(() => {
        if (this.dataForm.pordId) {
          this.$http({
            url: this.$http.adornUrl(`prod/prodbasic/info/${this.dataForm.pordId}/${this.type}`),
            method: 'get',
            params: this.$http.adornParams({}, false)
          }).then(({ data }) => {
            if (data && data.code === 0) {
              this.dataForm.id = data.prodBasicEntity.customsId
              // this.dataForm.customsId = data.prodBasicEntity.customsId
              this.dataForm.code = data.prodBasicEntity.customsCode
              this.dataForm.customsUnitId = data.prodBasicEntity.customsUnitId
              this.dataForm.cnName = data.prodBasicEntity.customsCnName
              this.dataForm.enName = data.prodBasicEntity.customsEnName
              this.dataForm.declareMoney = data.prodBasicEntity.customsDeclareMoney
              this.dataForm.currencyId = data.prodBasicEntity.customsCurrencyId
              this.dataForm.declareFactor = data.prodBasicEntity.customsDeclareFactor
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
              url: this.$http.adornUrl('prod/prodbasic/update'),
              method: 'put',
              data: {
                prodId: id,
                type: type,
                basicCustomsEntity: this.dataForm
              }
            }).then(({ data }) => {
              if (data && data.code === 0) {
                Bus.$emit('prodTabChildren')
                this.$notify.success({
                  message: '保存成功',
                  duration: 5000
                })
                // this.$emit('nextStep')
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

    // // 校验
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
