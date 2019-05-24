<template>
  <div>
    <el-form :model="dataForm" ref="dataForm" label-width="0px" :disabled="formDisabled">
      <el-form-item label prop="paramGroup" v-for="(item, index) in prodskurules" :key="index">
        <el-tag>{{ item.name }}</el-tag>
        <div class="mg-15-50">
          <el-checkbox-group v-model="dataForm.paramGroup[item.key]">
            <el-checkbox
              v-for="list in item.params"
              :label="list.id"
              :key="list.id"
              border
            >{{list.name}}</el-checkbox>
          </el-checkbox-group>
        </div>
      </el-form-item>
    </el-form>
  </div>
</template>
<script>
import Bus from '@/components/js/bus.js'

export default {
  name: 'proddevSkuparams',
  props: ['value'],
  data () {
    return {
      formDisabled: false,
      type: '',
      dataForm: {
        id: '',
        paramGroup: {}
      },
      prodskurules: []
    }
  },
  created () {
    this.$http
      .get(this.$http.adornUrl('prod/prodskurules/listrulesparams'))
      .then(({ data }) => {
        for (var i = 0; i < data.list.length; i++) {
          this.$set(this.dataForm.paramGroup, data.list[i].key, [])
        }
        this.prodskurules = data.list
      })
  },
  methods: {
    // 规格
    specificationData () {
      // 判断是否已经请求过
      if (this.prodskurules.length !== 0) {
        return
      }
      this.$http
        .get(this.$http.adornUrl('prod/prodskurules/listrulesparams'))
        .then(({ data }) => {
          for (var i = 0; i < data.list.length; i++) {
            this.$set(this.dataForm.paramGroup, data.list[i].key, [])
          }
          this.prodskurules = data.list
        })
    },

    init (id, type, handleType) {
      // 2
      this.dataForm.id = id
      this.type = type
      if (handleType === 'canCheck') {
        this.formDisabled = true
      }
      // 审核
      if (handleType === 'canApproval') {
        this.formDisabled = true
      }
      this.$nextTick(() => {
        if (this.dataForm.id) {
          this.$http({
            url: this.$http.adornUrl(
              `prod/proddevbasic/info/${this.dataForm.id}/${this.type}`
            ),
            method: 'get'
          }).then(({ data }) => {
            if (data && data.code === 0) {
              this.dataForm.paramGroup = data.skuParams
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
            let isFlag = true
            for (const key in this.dataForm.paramGroup) {
              if (!(this.dataForm.paramGroup['Spec'].length > 0 && this.dataForm.paramGroup['Color'].length > 0)) {
                isFlag = false
              } else {
                isFlag = true
                break
              }
            }
            if (!isFlag) {
              this.$notify.error({
                title: '提示',
                message: '请选择[规格]和[颜色]',
                duration: 5000
              })
            } else {
              this.$http({
                url: this.$http.adornUrl('prod/proddevbasic/update'),
                method: 'put',
                data: this.$http.adornData({
                  prodId: id,
                  type: type,
                  skuParams: this.dataForm.paramGroup
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
          }
        })
      },
      1000,
      {
        leading: true,
        trailing: false
      }
    ),

    // 校验
    validate () {
      return new Promise((resolve, reject) => {
        this.$refs['dataForm'].validate(valid => {
          if (valid) {
            let isFlag = true
            for (const key in this.dataForm.paramGroup) {
              if (!(this.dataForm.paramGroup['Spec'].length > 0 && this.dataForm.paramGroup['Color'].length > 0)) {
                isFlag = false
              } else {
                isFlag = true
                break
              }
            }
            if (isFlag) {
              resolve(valid)
              // this.$emit('nextStep')
            } else {
              this.$notify.error({
                title: '提示',
                message: '请选择[规格]和[颜色]',
                duration: 5000
              })
              reject(valid)
            }
          }
        })
      })
    }
  },
  watch: {
    value: {
      handler (val, oldVal) {
        this.dataForm.paramGroup = this.value
        this.$emit('change', this.dataForm.paramGroup)
      },
      deep: true
    },
    dataForm: {
      handler (val, oldVal) {
        this.$emit('input', this.dataForm.paramGroup)
      },
      deep: true
    }
  }
}
</script>
