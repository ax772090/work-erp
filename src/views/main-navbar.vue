<template>
  <nav class="site-navbar"
       :class="'site-navbar--' + navbarLayoutType">
    <div class="site-navbar__header">
      <h1 class="site-navbar__brand"
          @click="$router.push({ name: 'home' })">
        <a class="site-navbar__brand-lg"
           href="javascript:;">
          <img class="left-top-logo-b"
               src="~@/assets/img/logo-b.png"
               alt="宏博伟智">
        </a>
        <a class="site-navbar__brand-mini"
           href="javascript:;">
          <img class="left-top-logo-m"
               src="~@/assets/img/logo-m.png"
               alt="宏博伟智">
        </a>
      </h1>
    </div>
    <div class="site-navbar__body clearfix">
      <el-menu class="site-navbar__menu"
               mode="horizontal">
        <el-menu-item class="site-navbar__switch"
                      index="0"
                      @click="sidebarFold = !sidebarFold">
          <icon-svg name="zhedie"></icon-svg>
        </el-menu-item>
      </el-menu>

      <el-menu class="site-navbar__menu site-navbar__menu--right"
               mode="horizontal">
        <!-- <el-menu-item index="1" @click="$router.push({ name: 'theme' })">
          <template slot="title">
            <el-badge value="new">
              <icon-svg name="shezhi" class="el-icon-setting"></icon-svg>
            </el-badge>
          </template>
        </el-menu-item>-->
        <!-- 帮助 -->
        <!-- <el-menu-item index="2">
          <el-badge value="hot">
            <a href="www.baidu.com" target="_blank">帮助</a>
          </el-badge>
        </el-menu-item>-->
        <!-- 公司 -->
        <el-menu-item index="3">
          <el-select v-model="currCompId"
                     placeholder="请选择"
                     v-on:change="change">
            <el-option v-for="(item,index) in comaniesList"
                       :key="index"
                       :label="item.name"
                       :value="item.orgId"></el-option>
          </el-select>
        </el-menu-item>
        <el-menu-item index="4">
          <el-badge :value="notifyNum"
                    :max="99"
                    class="item">
            <div class="notify-num"
                 @click="notication">
              <i class="el-icon-bell"></i>
            </div>
          </el-badge>
        </el-menu-item>
        <!-- 语言 -->
        <el-submenu index="5">
          <template slot="title">语言</template>
          <el-menu-item index="2-1">
            <a href="###"
               target="_blank">English</a>
          </el-menu-item>
          <el-menu-item index="2-2">
            <a href="###"
               target="_blank">中文</a>
          </el-menu-item>
        </el-submenu>
        <!-- 个人 -->
        <el-menu-item class="site-navbar__avatar"
                      index="6">
          <el-dropdown :show-timeout="0"
                       placement="bottom">
            <span class="el-dropdown-link">
              <!-- <img src="~@/assets/img/avatar.png"
                   :alt="userName"> -->
              <img :src="imageUrl"
                   :alt="userName">
              {{ userName }}
            </span>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item @click.native="updatePasswordHandle()">修改密码</el-dropdown-item>
              <!-- <el-dropdown-item @click.native="versionPulish()"
                                v-if="isAuth('sys:message:publish')">版本发布</el-dropdown-item> -->
              <el-dropdown-item @click.native="versionUpdate()">版本更新</el-dropdown-item>
              <el-dropdown-item @click.native="logoutHandle()">退出</el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </el-menu-item>
      </el-menu>
    </div>
    <!-- 弹窗, 修改密码 -->
    <update-password v-if="updatePassowrdVisible"
                     ref="updatePassowrd"></update-password>
    <!-- 消息中心 -->
    <notify v-if="notityVisible"
            ref="notify"></notify>
  </nav>
</template>
<script>
import UpdatePassword from './main-navbar-update-password'
import Bus from '@/components/js/bus.js'
import notify from './modules/approval-notification/main-notification'

import { clearTaskId } from '@/utils'
export default {
  data () {
    return {
      imageUrl: require('@/assets/img/avatar.png'),
      updatePassowrdVisible: false,
      notityVisible: false,
      // 公司切换
      comaniesList: [],
      currCompId: '',
      notifyNum: '', // 消息数量,
      count: 0,
      userId: '',
      timer: null, // 定时器名称
      publishData: {
        topic: '1.0.8',
        content: '<p>1、test版本发布</p><p>2、test版本发布dfasdasdfa</p>'
      }
    }
  },
  components: {
    UpdatePassword,
    notify
  },
  computed: {
    navbarLayoutType: {
      get () {
        return this.$store.state.common.navbarLayoutType
      }
    },
    sidebarFold: {
      get () {
        return this.$store.state.common.sidebarFold
      },
      set (val) {
        this.$store.commit('common/updateSidebarFold', val)
      }
    },
    mainTabs: {
      get () {
        return this.$store.state.common.mainTabs
      },
      set (val) {
        this.$store.commit('common/updateMainTabs', val)
      }
    },
    userName: {
      get () {
        return this.$store.state.user.name
      }
    }
  },
  created () {
    this.userId = sessionStorage.getItem('userId')
    this.sessionGet()
    this.notifyQuery()
    this.timer = window.setInterval(() => {
      setTimeout(this.notifyQuery, 0)
    }, 60000)
  },
  methods: {
    // 选择公司
    remoteMethod (query) {
      if (query !== '') {
        this.loading = true
        setTimeout(() => {
          this.loading = false
          this.options4 = this.list.filter(item => {
            return item.label.toLowerCase().indexOf(query.toLowerCase()) > -1
          })
        }, 200)
      } else {
        this.options4 = []
      }
    },

    // 切换公司时获得焦点
    queryCompanyList () {
      this.$http({
        url: this.$http.adornUrl('sys/queryAllComp'),
        method: 'get',
        params: this.$http.adornParams()
      }).then(({ data }) => {
        if (data && data.code === 0) {
          this.comaniesList = data.comaniesList
        }
      })
    },
    versionPulish () {
      this.$http({
        url: this.$http.adornUrl('sys/message/publish'),
        method: 'post',
        data: this.publishData
      }).then(({ data }) => {
        if (data && data.code === 0) {
          this.$notify.success({
            title: '版本发布',
            message: '版本发布成功',
            duration: 2000
          })
        } else {
          this.$notify.error({
            title: '版本更新',
            message: data.msg,
            duration: 2000
          })
        }
      })
    },
    // 右上角选定公司时
    change (orgId) {
      this.$http({
        url: this.$http.adornUrl('sys/resetCurrentOrg'),
        method: 'post',
        params: {
          orgId: orgId
        }
      }).then(({ data }) => {
        if (data && data.code === 0) {
          sessionStorage.setItem('orgId', orgId)
          Bus.$emit('MainNavbar-MainContent')
        }
      })
    },

    // 消息中心
    notication () {
      this.notityVisible = true
      this.$nextTick(() => {
        window.location.href = clearTaskId()
        this.$refs.notify.init()
      })
    },

    // 右下角的消息提醒
    open () {
      this.$notify({
        title: '温馨提示',
        message: '您有新的待办消息，请及时处理！',
        position: 'bottom-right',
        duration: 20000
      })
    },
    close () {
      this.$notify.close()
    },

    // 消息通知状态查询
    notifyQuery () {
      this.$http({
        url: this.$http.adornUrl('activiti/actapprovalinfo/list'),
        method: 'get',
        params: {
          type: '04',
          currentDate: new Date()
        }
      }).then(({ data }) => {
        if (data && data.code === 0) {
          if (data.list > 0) {
            this.notifyNum = data.list
            this.open()
          } else {
            this.notifyNum = ''
            this.close()
          }
        }
      })
    },

    sessionGet () {
      this.comaniesList = JSON.parse(
        sessionStorage.getItem('comaniesData') || '[]'
      ).comaniesList
      if (!this.comaniesList) {
        this.queryCompanyList()
      }

      this.currCompId = sessionStorage.getItem('orgId')
    },

    // 修改密码
    updatePasswordHandle () {
      this.updatePassowrdVisible = true
      this.$nextTick(() => {
        this.$refs.updatePassowrd.init()
      })
    },
    // 版本更新日志:type:'history'表示历史版本更新记录
    versionUpdate () {
      this.$router.push({ name: 'release-history' })
    },

    // 退出
    logoutHandle () {
      this.$confirm(`确定进行[退出]操作?`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          this.$http({
            url: this.$http.adornUrl('sys/logout'),
            method: 'post',
            data: this.$http.adornData()
          }).then(({ data }) => {
            if (data && data.code === 0) {
              this.$cookie.delete('token')
              this.$router.options.isAddDynamicMenuRoutes = false
              this.$router.push({ name: 'login' })
            }
          })
        })
        .catch(() => { })
    }
  },
  beforeDestroy () {
    // 清除计时器
    clearInterval(this.timer)
    this.timer = null
  }
}
</script>

<style scoped>
.site-navbar__header {
  background-color: #17b3a3;
}
.left-top-logo-b {
  /* width: 220px; */
  height: 40px;
  vertical-align: bottom;
  margin: 5px 0;
}

.left-top-logo-m {
  width: 40px;
  height: 40px;
}
.item {
  margin-top: 10px;
  margin-right: 40px;
  margin-left: 10px;
}
.notify-num {
  display: inline-block;
  width: 50px;
  text-align: right;
}
.el-menu--horizontal > .el-menu-item.is-active {
  border-bottom: none;
}
.el-icon-bell {
  margin-right: 0px;
}
</style>
