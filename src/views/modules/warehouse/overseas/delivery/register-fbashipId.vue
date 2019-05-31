<template>
  <el-dialog :title="dialogTitle"
             width="20%"
             :close-on-click-modal="false"
             :visible.sync="visible"
             :before-close="handleClose">
    <el-form :model="dataForm"
             ref="dataForm"
             :rules="dataRule"
             label-width="120px">
      <el-form-item label="FBAShipmentID"
                    prop="fbaShipmentId">
        <el-input v-model.trim="dataForm.fbaShipmentId"
                  placeholder=""></el-input>
      </el-form-item>
    </el-form>
    <span slot="footer"
          class="dialog-footer">
      <el-button @click="cancel('dataForm')"><i class="iconfont erp-icon-quxiao"></i>取消</el-button>
      <el-button type="primary"
                 @click="saveOrSubmit()"><i class="iconfont erp-icon-queding"></i>确定</el-button>
    </span>
  </el-dialog>
</template>
<script>
export default {
  data () {
    return {
      dialogTitle: '',
      visible: false,
      dataForm: {
        id: '',
        fbaShipmentId: ''
      },
      dataRule: {
        fbaShipmentId: [
          { required: true, message: '必填项', trigger: 'change' }]
      }
    }
  },
  methods: {
    init (id) {
      this.visible = true
      this.dataForm.id = id
      this.dialogTitle = '登记FBAshipmentID'
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
          this.$http({
            url: this.$http.adornUrl('warehouse/whdeliveryplan/registerShipmentId'),
            method: 'get',
            params: this.dataForm
          }).then(({ data }) => {
            if (data && data.code === 0) {
              this.$emit('refreshDataList')
              this.$notify.success({
                message: '登记成功',
                duration: 1500,
                title: '成功'
              })
            } else {
              this.$notify.error({
                title: '错误',
                message: data.msg,
                duration: 5000
              })
            }
            this.clearCache('dataForm')
            this.visible = false
          })
        } else {
          return false
        }
      })
    }
  }
}
</script>
