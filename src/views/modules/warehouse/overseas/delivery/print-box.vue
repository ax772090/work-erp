<template>
  <el-dialog :title="dialogTitle"
             width="20%"
             :close-on-click-modal="false"
             :visible.sync="visible"
             :before-close="handleClose">
    <el-form :model="dataForm"
             ref="dataForm"
             :rules="dataRule"
             label-width="80px">
      <el-form-item label="箱数"
                    prop="boxQty">
        <el-input v-model="dataForm.boxQty"
                  type="Number"
                  @mousewheel.native.prevent></el-input>
      </el-form-item>
    </el-form>
    <span slot="footer"
          class="dialog-footer">
      <el-button @click="cancel('dataForm')"><i class="iconfont erp-icon-quxiao"></i>取消</el-button>
      <el-button type="primary"
                 @click="saveOrSubmit()"><i class="iconfont erp-icon-dayin"></i>打印</el-button>
    </span>
  </el-dialog>
</template>
<script>
export default {
  components: {
  },
  data () {
    return {
      dialogTitle: '',
      visible: false,
      dataForm: {
        id: '',
        fbaShipmentId: '',
        boxQty: ''
      },
      dataRule: {
        boxQty: [
          {required: true, message: '必填项', trigger: 'change'},
          { pattern: /^[1-9]\d*$/, message: '正整数', trigger: 'change' }]
      }

    }
  },
  methods: {
    init (row) {
      this.visible = true
      this.dataForm.id = row.id
      this.dataForm.fbaShipmentId = row.fbaShipmentId
      this.dialogTitle = '打印箱唛'
    },
    // 关闭清除本次缓存
    clearCache (formName) {
      this.$refs[formName].resetFields()
      this.visible = false
    },
    // 弹窗关闭之前
    handleClose (done) {
      this.clearCache('dataForm')
      done()
    },
    // 取消按钮
    cancel (formName) {
      this.clearCache(formName)
    },
    saveOrSubmit () {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          window.open(this.$http.tokens(`warehouse/whdeliveryplan/getPackageLabel`, this.dataForm))
          this.visible = false
        } else {
          return false
        }
      })
    }
  }
}
</script>
