<template>
  <el-dialog title="修改密码"
             :visible.sync="visible"
             width="30%"
             :close-on-click-modal='false'
             @close="$refs['dataForm'].resetFields()"
             :append-to-body="true">
    <el-form :model="dataForm"
             :rules="dataRule"
             ref="dataForm"
             @keyup.enter.native="dataFormSubmit()"
             label-width="80px">
      <!-- <el-form-item label="账号">
        <span>{{ userName }}</span>
      </el-form-item> -->
      <el-form-item label="原密码"
                    prop="password">
        <el-input type="password"
                  v-model="dataForm.password"></el-input>
      </el-form-item>
      <el-form-item label="新密码"
                    prop="newPassword">
        <div class="form-item-row">
          <el-input type="password"
                  v-model="dataForm.newPassword"></el-input>
          <question-icon :messages="messages"></question-icon>
        </div>
        
      </el-form-item>
      <el-form-item label="确认密码"
                    prop="confirmPassword">
        <el-input type="password"
                  v-model="dataForm.confirmPassword"></el-input>
      </el-form-item>
    </el-form>
    <span slot="footer"
          class="dialog-footer">
      <el-button @click="visible = false">取消</el-button>
      <el-button type="primary"
                 @click="dataFormSubmit()">确定</el-button>
    </span>
  </el-dialog>
</template>

<script>
export default {
  data () {
    var validatePwd = (rule, value, callback) => {
      // let reg = /^.(?=.{6,16})(?=.*\d)(?=.*[A-Za-z]{1,})(?=.*[!@#$%^&*?\(\)]).*$/
      // let reg = /(?!^(\d+|[a-zA-Z]+|[~!@#$%^&*?]+)$)^[~!@#$%^&*?]{6,16}$/
      // let reg = /^(?![a-zA-z]+$)(?!\d+$)(?![`~!@#\$%\^&\*\(\)-_\+\|\{\}\[\]:";'<>\?,\.\\\/]+$)[a-zA-Z\d`~!@#\$%\^&\*\(\)-_\+\|\{\}\[\]:";'<>\?,\.\\\/]{6,16}$/
      let reg = /^(?![a-zA-Z]+$)(?![0-9]+$)(?![\W_]+$)[a-zA-Z0-9\W_]{6,16}$/
      if (!reg.test(value)) {
        // callback(new Error('6-16个字符,必须包含一个大写字母,一个小写字母,一个数字'))
        callback(new Error('6-16个字符，至少包含以下字符中的2种：字母、数字、特殊字符'))
      } else {
        if (value === this.dataForm.password) {
          callback(new Error('新密码与原密码不能相同'))
        }
        if (this.dataForm.confirmPassword !== '') {
          this.$refs['dataForm'].validateField('confirmPassword')
        }
        callback()
      }
    }
    var validateConfirmPassword = (rule, value, callback) => {
      if (value !== this.dataForm.newPassword) {
        callback(new Error('确认密码与新密码不一致'))
      } else {
        callback()
      }
    }
    return {
      visible: false,
      messages: '6-16个字符，至少包含以下字符中的2种：字母、数字、特殊字符。',
      dataForm: {
        password: '',
        newPassword: '',
        confirmPassword: ''
      },
      dataRule: {
        password: [
          { required: true, message: '原密码不能为空', trigger: 'blur' }
        ],
        newPassword: [
          { required: true, message: '新密码不能为空', trigger: 'blur' },
          { validator: validatePwd, trigger: 'blur' }
        ],
        confirmPassword: [
          { required: true, message: '确认密码不能为空', trigger: 'blur' },
          { validator: validateConfirmPassword, trigger: 'blur' }
        ]
      }
    }
  },
  computed: {
    userName: {
      get () { return this.$store.state.user.name }
    },
    mainTabs: {
      get () { return this.$store.state.common.mainTabs },
      set (val) { this.$store.commit('common/updateMainTabs', val) }
    }
  },
  methods: {
    // 初始化
    init () {
      this.visible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].resetFields()
      })
    },
    // 表单提交
    dataFormSubmit () {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          this.$http({
            url: this.$http.adornUrl('sys/user/password'),
            method: 'post',
            data: this.$http.adornData({
              'password': this.dataForm.password,
              'newPassword': this.dataForm.newPassword
            })
          }).then(({ data }) => {
            if (data && data.code === 0) {
              this.$message({
                message: '操作成功',
                type: 'success',
                duration: 1500,
                onClose: () => {
                  this.visible = false
                  this.$nextTick(() => {
                    this.mainTabs = []
                    this.$cookie.delete('token')
                    this.$router.replace({ name: 'login' })
                  })
                }
              })
            } else {
              this.$message.error(data.msg)
            }
          })
        }
      })
    }
  }
}
</script>

