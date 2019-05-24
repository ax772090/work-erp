<template>
  <div>
    <el-form :model="dataForm"
             :rules="dataRule"
             ref="dataForm"
             label-width="0px"
             :disabled="formDisabled">
      <el-form-item label=""
                    v-for="(item, index) in prodskurules"
                    :key="index">
        <el-tag>{{item.name}}</el-tag>
        <div class="mg-15-50">
          <el-checkbox-group v-model="dataForm.paramGroup[item.key]"
                             @change="handleCheckedCitiesChange">
            <el-checkbox v-for="list in item.params"
                         :key="list.id"
                         :label="list.id"
                         border
                         :disabled='!!dataForm.id || copyType== 2 '>{{list.name}}</el-checkbox>
          </el-checkbox-group>
        </div>
      </el-form-item>
    </el-form>
  </div>
</template>
<script>
export default {
  props: ['value'],
  data () {
    return {
      copyType: '',
      formDisabled: false,
      visible: false,
      idDisabled: false,
      max: 1,
      type: '',
      dataForm: {
        id: '',
        paramGroup: {}
      },
      prodskurules: {},
      dataRule: {
        bplug: [
          { required: true, message: '至少选择一项', trigger: 'change' }
        ]
      }
    }
  },
  created () {
    this.$http.get(this.$http.adornUrl('prod/prodskurules/listrulesparams')).then(({ data }) => {
      for (var i = 0; i < data.list.length; i++) {
        this.$set(this.dataForm.paramGroup, data.list[i].key, [])
      }
      this.prodskurules = data.list
    })
  },
  methods: {
    // 规格
    specificationData () {
      this.$http.get(this.$http.adornUrl('prod/prodskurules/listrulesparams')).then(({ data }) => {
        for (var i = 0; i < data.list.length; i++) {
          this.$set(this.dataForm.paramGroup, data.list[i].key, [])
        }
        this.prodskurules = data.list
      })
    },

    init (id, type, handleType, dataForm) { // 2
      this.visible = true
      this.dataForm.id = id
      this.type = type
      this.copyType = ''
      if (handleType === '1') {
        this.formDisabled = true
      } else if (handleType === 'copy') {
        this.copyType = dataForm.prodBasicEntity.copiedType
        for (const item in dataForm.skuParams) {
          this.dataForm.paramGroup[item] = dataForm.skuParams[item]
        }
      }
      this.$nextTick(() => {
        if (this.dataForm.id) {
          this.$http({
            url: this.$http.adornUrl(`prod/prodbasic/info/${this.dataForm.id}/${this.type}`),
            method: 'get',
            params: this.$http.adornParams({}, false)
          }).then(({ data }) => {
            if (data && data.code === 0) {
              for (const item in data.skuParams) {
                this.dataForm.paramGroup[item] = data.skuParams[item]
              }
            }
          })
        }
      })
    },
    handleCheckedCitiesChange (value) {
      if (value.length > 1) {
        value.splice(0, 1)
      }
    },
    // 表单提交
    dataFormSubmit: _.debounce(
      async function dataFormSubmit () {
        this.$notify.success({
          message: '不能修改',
          duration: 5000
        })
      }, 1000, {
        leading: true,
        trailing: false
      }),
    // dataFormSubmit () {
    // this.$notify.success({
    //   message: '不能修改',
    //   duration: 5000
    // })
    // this.$emit('nextStep')

    // this.$refs['dataForm'].validate((valid) => {
    //   if (valid) {
    //     this.$http({
    //       url: this.$http.adornUrl(`prod/proddevbasic/${!this.dataForm.id ? 'save' : 'update'}`),
    //       method: !this.dataForm.id ? 'post' : 'put',
    //       data: this.$http.adornData(this.dataForm, false)
    //     }).then(({data}) => {
    //       if (data && data.code === 0) {
    //         this.$message({
    //           message: '操作成功',
    //           type: 'success',
    //           duration: 1500,
    //           onClose: () => {
    //             this.visible = false
    //             this.$emit('refreshDataList')
    //           }
    //         })
    //       } else {
    //         this.$message.error(data.msg)
    //       }
    //     })
    //   }
    // })
    // },

    // 校验
    validate (activeName) {
      return new Promise((resolve, reject) => {
        this.$refs['dataForm'].validate((valid) => {
          if (valid) {
            let isFlag = true

            for (const key in this.dataForm.paramGroup) {
              if (!(this.dataForm.paramGroup['Spec'].length > 0 && this.dataForm.paramGroup['Color'].length > 0)) {
                isFlag = false
              } else {
                isFlag = true
                break
              }
              // 之前的逻辑
              // if (!(this.dataForm.paramGroup[key].length > 0)) {
              //   isFlag = false
              // } else {
              //   isFlag = true
              //   break
              // }
            }
            if (isFlag) {
              // this.$emit('nextStep', activeName)
              resolve(true)
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
    // validate () {
    //   return new Promise((resolve, reject) => {
    //     this.$refs['dataForm'].validate((valid) => {
    //       if (valid) {
    //         resolve(true)
    //       } else {
    //         reject(valid)
    //       }
    //     })
    //   })
    // }
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
