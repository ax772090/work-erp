<template>
  <div class="site-wrapper site-page--login">
    <div class="site-content__wrapper">
      <div class="logo">
        <img src="~@/assets/img/logo-b.png"
             alt="">
      </div>
      <div class="site-content">
        <div class="login-main">
          <h3 class="login-title">用户登录</h3>
          <el-form :model="dataForm"
                   :rules="dataRule"
                   ref="dataForm"
                   @keyup.enter.native="dataFormSubmit()"
                   status-icon
                   class="medium-regain">
            <el-form-item prop="merchantId">
              <select-seach v-model='dataForm.merchantId'
                            httpUrl='sys/organization/queryLikeOrgNameOrId'
                            httpMethod='get'
                            requestParamsKey='orgNameOrId'
                            dataLabel='orgName'
                            dataValue='merchantId'
                            dataSource='list'
                            showIcon=true
                            placeholder='请输入公司名称或公司代号'></select-seach>
            </el-form-item>
            <el-form-item prop="userName">
              <el-input v-model="dataForm.userName"
                        type="text"
                        placeholder="帐号"><i slot="prefix"
                   class="el-input__icon el-icon-tickets"></i></el-input>
            </el-form-item>
            <el-form-item prop="password">
              <el-input v-model="dataForm.password"
                        type="password"
                        placeholder="密码"
                        autocomplete="off"><i slot="prefix"
                   class="el-input__icon el-icon-view"></i></el-input>
            </el-form-item>
            <!-- <el-form-item prop="captcha">
              <el-row :gutter="20">
                <el-col :span="14">
                  <el-input v-model="dataForm.captcha" placeholder="验证码"><i slot="prefix" class="el-input__icon el-icon-circle-check-outline"></i>
                  </el-input>
                </el-col>
                <el-col :span="10" class="login-captcha">
                  <img :src="captchaPath" @click="getCaptcha()" alt="">
                </el-col>
              </el-row>
            </el-form-item> -->
            <el-checkbox v-model="dataForm.remember"
                         class="mgbot"
                         @change="rememberChange">记住账号</el-checkbox>
            <el-form-item>
              <el-button class="login-btn-submit"
                         size="medium"
                         type="primary"
                         @click="dataFormSubmit()">登录</el-button>
            </el-form-item>
          </el-form>
          <div class="login-register">
            <!-- <el-button type="text" class="loginbtn">登陆</el-button> -->
            <!-- <el-button type="text" class="registerbtn">注册</el-button> -->
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { getUUID, setCookie, getCookie, clearCookie } from '@/utils'
import selectSeach from '@/components/erp-select/select-seach'

export default {
  components: {
    selectSeach
  },

  data () {
    return {
      dataForm: {
        merchantId: '',
        userName: '',
        password: '',
        remember: true,
        uuid: '',
        captcha: ''
      },
      dataRule: {
        // selectName: [
        //   { required: true, message: "123不能为空", trigger: "blur" }
        // ],
        // userName: [
        //   { required: true, message: "帐号不能为空", trigger: "blur" }
        // ],
        // password: [
        //   { required: true, message: "密码不能为空", trigger: "blur" }
        // ],
        // captcha: [
        //   { required: true, message: "验证码不能为空", trigger: "blur" }
        // ]
      },
      captchaPath: '',
      // 搜索
      restaurants: [],
      org: {
        orgName: ''
      }
    }
  },
  mounted () {
    if (getCookie('userName')) {
      this.dataForm.userName = getCookie('userName')
    }
    if (getCookie('merchantId')) {
      this.dataForm.merchantId = Number(getCookie('merchantId'))
    }
    if (getCookie('remember') === 'false') {
      this.dataForm.remember = false
    } else {
      this.dataForm.remember = true
    }
  },

  methods: {
    dataFormSubmit () {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          this.loginHttp().then(({ data }) => {
            if (data && data.code === 0) {
              if (data.comaniesList.length) {
                sessionStorage.setItem('comaniesData', JSON.stringify(data || '[]'))// 所有公司[]
                sessionStorage.setItem('orgId', data.currentCompany.orgId)// 当前公司
                sessionStorage.setItem('userId', data.userId)// 当前用户,中文, 当前用户id
                sessionStorage.setItem('merchantId', this.dataForm.merchantId)
                sessionStorage.setItem('userName', this.dataForm.userName)
                sessionStorage.setItem('pwd', this.dataForm.password)
                this.$cookie.set('token', data.token)

                setCookie('merchantId', this.dataForm.merchantId, 7)
                if (this.dataForm.remember) {
                  setCookie('userName', this.dataForm.userName, 7)
                } else {
                  clearCookie('userName')
                }
              } else {
                this.$message.error('用户未分配角色权限，请联系管理员处理')
              }
            } else {
              this.getCaptcha()
              this.$message.error(data.msg)
            }
          }).then((res) => {
            this.$router.replace({ name: 'home',
              params: {
                isLogin: true
              } })
          })
        } else {
          return false
        }
      })
    },
    loginHttp () {
      return this.$http({
        url: this.$http.adornUrl('sys/login'),
        method: 'post',
        data: this.$http.adornData({
          merchantId: this.dataForm.merchantId,
          username: this.dataForm.userName,
          password: this.dataForm.password
        })
      })
    },
    rememberChange (value) {
      if (value) {
        setCookie('remember', 'true', 7)
      } else {
        setCookie('remember', 'false', 7)
      }
    },
    // 获取验证码
    getCaptcha () {
      this.dataForm.uuid = getUUID()
      this.captchaPath = this.$http.adornUrl(`/captcha.jpg?uuid=${this.dataForm.uuid}`)
    },

    handleSelect (item) {
      this.org = item
    }
  },

  created () {
    this.getCaptcha()
  }
}
</script>

<style scoped lang="scss">
.logo {
  height: 50px;
  position: absolute;
  top: 100px;
  left: 100px;
}

.el-select {
  width: 100%;
}

.login-register {
  float: right;
}

.site-wrapper.site-page--login {
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  background-color: rgba(38, 50, 56, 0.6);
  overflow: hidden;
  &:before {
    position: fixed;
    top: 0;
    left: 0;
    z-index: -1;
    width: 100%;
    height: 100%;
  }
  .site-content__wrapper {
    position: absolute;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    padding: 0;
    margin: 0;
    overflow-x: hidden;
    overflow-y: auto;
    background-color: #fff;
  }
  .site-content {
    position: absolute;
    top: 20%;
    left: 0;
    width: 100%;
    height: 600px;
    min-height: 460px;
    background-image: url(~@/assets/img/login_bg2.png);
    background-size: 100% 100%;
  }
  .login-main {
    position: absolute;
    top: 70px;
    right: 10%;
    padding: 50px 60px 0px;
    width: 420px;
    height: 460px;
    background-color: #fff;
  }
  .login-title {
    font-size: 16px;
  }
  .login-captcha {
    overflow: hidden;
    > img {
      width: 100%;
      cursor: pointer;
    }
  }
  .login-btn-submit {
    width: 100%;
  }
  .mgbot {
    margin-bottom: 10px;
  }
}
</style>
