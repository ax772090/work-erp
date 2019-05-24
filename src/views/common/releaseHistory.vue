<template>
  <div>
    <!-- 这里使用aside组件和隐藏的scrollbar组件 -->
    <el-container>
      <el-aside class="aside-left"
                width="200px">
        <el-scrollbar wrap-class='scrollbar-warp' wrap-style='max-height: 760px;' :native="false">
          <ul>
            <li v-for="(item,index) in dataList"
                :key="index"
                class="nav-item">
              <a @click="versionHandle(item.topic)">{{item.topic}}</a>
            </li>
          </ul>
        </el-scrollbar>
      </el-aside>
      <el-container>
        <el-main>
          <el-scrollbar>
            <el-card v-for="(item,index) in dataList"
                     :key="index"
                     v-show="item.topic === curVersion">
              <div slot="header"
                   class="card-head">
                <span v-text="item.topic" class="card-topic"></span>
                <span class="upd-time">{{item.lastUpdTime}}</span>
              </div>
              <div v-html="item.content" class="card-content"></div>
            </el-card>
          </el-scrollbar>
        </el-main>
      </el-container>
    </el-container>
  </div>
</template>

<script>
export default {
  components: {
  },
  data () {
    return {
      // versionList: [{ topic: '1.07', content: '<p>1. 增加备货申请生成采购计划的功能</p><p>2. 优化采购计划（汇总备货数据，查看备货源明细数据）</p>' }, { topic: '1.06', content: '<p>1. 增加备货申请生成采购计划的功能</p><p>2. 优化采购计划（汇总备货数据，查看备货源明细数据）</p>' }],
      // content: '<p>1. 增加备货申请生成采购计划的功能</p><p>2. 优化采购计划（汇总备货数据，查看备货源明细数据）</p>',
      // userList: [{ topic: '1.07', name: '1.07' }, { topic: '1.06', name: '1.06' }],
      dataList: [],
      // dataObj: this.$route.params || {},
      curVersion: ''

    }
  },
  created () {
    this.getVerHistory()
  },
  methods: {
    getVerHistory () {
      this.$http({
        url: this.$http.adornUrl('sys/message/getSubscribList'),
        method: 'get'
      }).then(({ data }) => {
        if (data && data.code === 0) {
          this.dataList = data.list || []
          this.curVersion = data.list.length > 0 ? data.list[0].topic : ''
        } else {
          this.$notify.error({
            title: '版本更新',
            message: data.msg,
            duration: 2000
          })
        }
      })
    },
    versionHandle (topic) {
      console.log(topic)
      this.curVersion = topic
    }
  }
  // watch: {
  //   '$route' (to, from) {
  //     this.dataObj = this.$route.params || {}
  //     console.log(this.dataObj)
  //   },
  //   deep: true
  // }
}
</script>

<style scoped>
/* .sidebar {
  position: fixed;
  border-right: 1px solid rgba(0, 0, 0, 0.07);
  overflow-y: auto;
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  transition: transform 0.25s ease-out;
  z-index: 3;
}
.sidebar::-webkit-scrollbar {
  width: 4px;
}

.sidebar::-webkit-scrollbar-thumb {
  background: transparent;
  border-radius: 4px;
}

.sidebar:hover::-webkit-scrollbar-thumb {
  background: hsla(0, 0%, 53%, 0.4);
}

.sidebar:hover::-webkit-scrollbar-track {
  background: hsla(0, 0%, 53%, 0.1);
} */

.aside-left {
  padding: 20px 20px 20px 0;
  
}
.scrollbar-warp li {
  list-style: none;
}
.scrollbar-warp li a {
  display: block;
  height: 40px;
  line-height: 40px;
  font-size: 16px;
  color: #444;
  font-weight: 600;
  text-decoration: none;
}
.scrollbar-warp li a:hover {
  color: #409eff;
  cursor: pointer;
}

.card-head .card-topic {
  margin-right: 20px;
  font-size: 16px;
  color: #444;
  font-weight: 600;
}
.card-head .upd-time {
  color: rgb(156, 154, 154);
}

</style>
