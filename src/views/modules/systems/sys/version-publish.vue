<template>
  <div class="mod-ueditor">
    <el-form :model="dataForm"
             :inline="true"
             ref='dataForm'
             :rules="dataRule">
      <el-form-item label="版本号"
                    prop="topic">
        <el-input v-model="dataForm.topic"
                  placeholder="输入版本号"></el-input>
      </el-form-item>
      <div class="editor-main">
        <script :id="ueId"
                class="ueditor-box"
                type="text/plain"></script>

      </div>
      <el-form-item>
        <el-button type="primary"
                   @click="onSubmit('dataForm')"
                   v-if="isAuth('sys:message:publish')"><i class="iconfont erp-icon-queren"></i>发布</el-button>
        <el-button @click="resetForm('dataForm')"><i class="iconfont erp-icon-chongzhi"></i>重置</el-button>
      </el-form-item>
    </el-form>
    <!-- <el-dialog title="内容"
               :visible.sync="dialogVisible"
               v-if="dialogVisible"
               :append-to-body="true">
      {{ ueContent }}
      <span slot="footer"
            class="dialog-footer">
        <el-button type="primary"
                   @click="dialogVisible = false">确 定</el-button>
      </span>
    </el-dialog> -->
  </div>
</template>

<script>
import ueditor from 'ueditor'
export default {
  data () {
    return {
      dataForm: {
        topic: ''
      },
      dataRule: {
        topic: [
          { required: true, message: '必填项', trigger: 'blur' }
        ]
      },
      ue: null,
      ueId: `J_ueditorBox_${new Date().getTime()}`,
      ueContent: '',
      dialogVisible: false
    }
  },
  mounted () {
    this.ue = ueditor.getEditor(this.ueId, {
      // serverUrl: '', // 服务器统一请求接口路径
      initialFrameHeight: 320,
      initialContent: '请输入版本发布内容...',
      autoClearinitialContent: true
    })

    this.ue.ready(() => {
      // 默认显示内容
      // this.ue.setContent('<p style="color:silver">请输入版本发布内容</p>')
      // // 文本框获取焦点时清空默认内容
      // this.ue.addListener('focus', () => {
      //   this.ue.setContent('')
      // })
      // 文本框是去焦点时,若内容为空则显示默认显示的内容
      // this.ue.addListener('blur', () => {
      //   if (!this.ue.getContent()) {
      //     this.ue.setContent('<p style="color:silver">请输入版本发布内容</p>')
      //   }
      // })
      // this.ueContent = this.ue.getContent()
    })
  },
  methods: {
    // getContent () {
    //   this.ue.ready(() => {
    //     // 默认显示内容
    //     this.ue.setContent('<p style="color:silver">请输入版本发布内容</p>')
    //     // 文本框获取焦点时清空默认内容
    //     this.ue.addListener('focus', () => {
    //       this.ue.setContent('')
    //     })
    //     // 文本框是去焦点时,若内容为空则显示默认显示的内容
    //     this.ue.addListener('blur', () => {
    //       if (!this.ue.getContent()) {
    //         this.ue.setContent('<p style="color:silver">请输入版本发布内容</p>')
    //       }
    //     })
    //     // this.ueContent = this.ue.getContent()
    //   })
    //   // return this.ueContent
    // },
    onSubmit (formName) {
      if (!this.ue.getContent()) {
        this.$notify.warning({
          title: '警告',
          message: '版本内容不能为空',
          duration: 3000
        })
        } else {
          this.$refs[formName].validate((valid) => {
            if (valid) {
              this.$http({
                url: this.$http.adornUrl('sys/message/publish'),
                method: 'post',
                data: {
                  topic: this.dataForm.topic,
                  content: this.ue.getContent()
                }
              }).then(({ data }) => {
                if (data && data.code === 0) {
                  this.$notify({
                    message: '发布成功',
                    type: 'success',
                    duration: 3000,
                    title: '提示'
                  })
                  // 发布成功后是否跳转到home页面？
                  // this.$router.push({name: 'home'})
                } else {
                  this.$notify.error({
                    title: '错误',
                    message: data.msg,
                    duration: 5000
                  })
                }
              })
            } else {
              return false
            }
          })
      }
    },
    resetForm (formName) {
      this.$refs[formName].resetFields()
      this.ue.setContent('')
    }
  }
}
</script>

<style lang="scss">
.mod-ueditor {
  margin-top: 10px;
}
.editor-main {
  margin: 10px;
}
.ueditor-box {
  width: 100%;
}
</style>
