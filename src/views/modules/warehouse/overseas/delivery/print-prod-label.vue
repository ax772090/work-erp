<template>
  <el-dialog :title="dialogTitle"
             width="20%"
             :close-on-click-modal="false"
             :visible.sync="visible"
             :append-to-body="true"
             :before-close="handleClose">
    <el-form :model="dataForm"
             ref="dataForm"
             :rules="dataRule"
             label-width="80px">
      <el-form-item label="打印格式"
                    prop="skuSize">
        <select-all v-model="dataForm.skuSize"
                    :listDataOption="skuSizeOptions"
                    data-value="id"
                    data-label="name"></select-all>
      </el-form-item>
      <el-form-item label="打印张数"
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
import selectAll from '@/components/erp-select/select-all'
export default {
  components: {
    selectAll
  },
  data () {
    return {
      skuSizeOptions: [{
        id: '40*30',
        name: '40*30mm'
      }, {
        id: '80*50',
        name: '80*50mm'
      }],
      dialogTitle: '',
      visible: false,
      dataForm: {
        id: '',
        fbaShipmentId: '',
        skuSize: '40*30',
        boxQty: ''
      },
      dataRule: {
        boxQty: [
          {required: true, message: '必填项', trigger: 'change'},
          { pattern: /^[1-9]\d*$/, message: '正整数', trigger: 'change' }],
        skuSize: [
          {required: true, message: '必填项', trigger: 'change'}]
      }

    }
  },
  methods: {
    init (row) {
      this.visible = true
      this.dataForm.id = row.id
      this.dataForm.fbaShipmentId = row.fbaShipmentId
      this.dataForm.boxQty = row.confirmQty
      this.dialogTitle = '打印选项'
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
          // const newWindow = window.open()
          // this.$http({
          //   url: this.$http.adornUrl(`warehouse/whdeliveryplan/getSkuLabel`),
          //   method: 'get',
          //   params: this.dataForm
          // }).then(({data}) => {
          //   if (data && data.code === 0) {
          //     newWindow.location.href = this.$http.tokens(`warehouse/whdeliveryplan/getSkuLabel`, this.dataForm)
          //   }
          //   this.visible = false
          // }).catch((e) => {
          //   console.log(e)
          //   newWindow.close()
          // })
          window.open(this.$http.tokens(`warehouse/whdeliveryplan/getSkuLabel`, this.dataForm))
        } else {
          return false
        }
      })
    }
  }
}
</script>
