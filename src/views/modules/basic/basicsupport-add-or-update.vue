<template>
  <el-dialog :title="!dataForm.id ? '辅助资料新增' : '辅助资料修改'"
             :close-on-click-modal="false"
             :visible.sync="visible"
             :before-close="handleClose"
             width="30%">
    <el-form :model="dataForm"
             :rules="dataRule"
             ref="dataForm"
             label-width="110px">
      <el-form-item label="辅助类型"
                    prop="key">
        <select-all v-model="dataForm.key"
                    :listDataOption="keyOptions"
                    data-value="key"
                    data-label="name"></select-all>
      </el-form-item>
      <el-form-item label="编码"
                    prop="code">
        <el-input v-model="dataForm.code"
                  placeholder=""></el-input>
      </el-form-item>
      <el-form-item label="名称"
                    prop="name">
        <el-input v-model="dataForm.name"
                  placeholder=""></el-input>
      </el-form-item>
    </el-form>
    <span slot="footer"
          class="dialog-footer">
      <el-button @click="cancel('dataForm')">取消</el-button>
      <el-button type="primary"
                 @click="dataFormSubmit()">保存</el-button>
    </span>
  </el-dialog>
</template>
<script>
import selectSeach from '@/components/erp-select/select-seach'
import selectAll from '@/components/erp-select/select-all'
export default {
  components: {
    selectSeach,
    selectAll
  },
  data () {
    return {
      keyOptions: [],
      visible: false,
      dataForm: {
        key: '',
        code: '',
        name: ''
      },
      dataRule: {
        key: [
          { required: true, message: '必填项', trigger: 'change' }
        ],
        code: [
          { required: true, message: '必填项', trigger: 'blur' }
        ],
        name: [
          { required: true, message: '必填项', trigger: 'blur' }
        ]
      }
    }
  },
  created () {
    this.$http.get(this.$http.adornUrl('prod/prodskuparams/listrulesparams')).then(({ data }) => {
      this.keyOptions = data.list
    })
  },
  methods: {
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

    init (id, type) {
      this.visible = true
      this.dataForm.id = id
      this.dataForm.addTime = null
      this.dataForm.addUser = null
      this.$nextTick(() => {
        if (this.dataForm.id) {
          this.$http({
            url: this.$http.adornUrl(
              `prod/prodskuparams/info/${this.dataForm.id}`
            ),
            method: 'get'
          }).then(({ data }) => {
            if (data && data.code === 0) {
              this.dataForm = Object.assign({}, data.prodSkuParams, { updTime: null, updUser: null })
            } else {
              this.$notify.error({
                title: '失败',
                message: data.msg,
                duration: 5000
              })
            }
          })
        }
      })
    },
    // 表单提交
    dataFormSubmit: _.debounce(
      async function dataFormSubmit () {
        this.$refs['dataForm'].validate(valid => {
          if (valid) {
            this.$http({
              url: this.$http.adornUrl(
                `prod/prodskuparams/${!this.dataForm.id ? 'save' : 'update'}`
              ),
              method: !this.dataForm.id ? 'post' : 'put',
              data: this.$http.adornData(this.dataForm, false)
            }).then(({ data }) => {
              if (data && data.code === 0) {
                this.$refs['dataForm'].resetFields()
                this.$emit('refreshDataList')
                this.visible = false
                this.$notify.success({
                  title: '成功',
                  message: '操作成功',
                  duration: 1500
                })
              } else {
                this.$notify.error({
                  title: '失败',
                  message: data.msg,
                  duration: 5000
                })
              }
            })
          }
        })
      },
      1000,
      {
        leading: true,
        trailing: false
      }
    )
  }
}
</script>
