<template>
  <el-dialog :visible.sync="visible"
             :append-to-body="true"
             width="60%">
    <div class="mb-10">
      <el-badge :value="waitNum === 0 ? '': waitNum "
                class="item">
        <button @click="Process('01')"
                :class="'br-4' + (Index == '01' ?　 ' btn active' :　' btn')">待我审批的</button>
      </el-badge>
      <el-badge class="item">
        <button @click="Process('02')"
                :class="'br-4' + (Index == '02' ?　' btn active' :　' btn')">我已审批的</button>
      </el-badge>
      <el-badge class="item"
                type="primary">
        <button @click="Process('03')"
                :class="'br-4'　+ (Index == '03' ?　' btn active' :　' btn')">我发起的</button>
      </el-badge>
    </div>
    <div class="min-h">
      <div class="content"
           v-for="(item,index) in List"
           :key="index">
        <div v-if="searchData.type === '01'">
          <div class="title"><span>{{item.originatorId === userId ? '您' : item.originatorName}}</span>{{item.titleName}}需要您审批</div>
          <div @click="approver(item)"
               class="check"
               v-if="searchData.type === '01'">点我审批</div>
        </div>
        <div v-if="searchData.type === '02'">
          <div class="title"><span>{{item.originatorId === userId ? '您' : item.originatorName}}</span>{{item.titleName}}{{item.isLastNode? '已审核通过' : '您已审批'}}</div>
          <div @click="approver(item)"
               class="check"
               v-if="searchData.type === '01'">点我审批</div>
        </div>
        <div v-if="searchData.type === '03'">
          <div class="title"><span>{{item.originatorId === userId ? '您' : item.originatorName}}</span>{{item.titleName}}{{item.isLastNode? item.approveResult : `当前审批节点:${item.nodeName}`}}</div>
          <div @click="approver(item)"
               class="check"
               v-if="searchData.type === '01'">点我审批</div>
        </div>
      </div>
    </div>
    <p v-if="List.length == 0">暂无数据</p>
    <pagination-all v-model="paginationData"
                    class="pag-all"
                    @paginationChangeHandle="query"></pagination-all>
  </el-dialog>
</template>

<script>
import Bus from '@/components/js/bus.js'
// 分页
import paginationAll from '@/components/erp-pagination/pagination-all'
export default {
  components: {
    paginationAll
  },
  data () {
    return {
      paginationData: {},
      visible: false,
      activeName: 'second',
      Index: '01',
      message: '',
      selectIndex: '',
      waitNum: 0, // 待办流程数量
      finishNum: 0, // 已办流程数量
      Num: 0, // 在办流程数量
      obj: {
        code: 1,
        id: 2
      },
      params: [],
      List: [], // 待办列表
      searchData: {
        type: '01'
      },
      userId: '',
      paginationData: {
        // 当前页数
        currPage: 1,
        // 一页显示的条数
        pageSize: 10,
        // 总条数
        totalCount: 0,
        // 总页数
        totalPage: 0
      }
    }
  },
  created () {
    this.userId = sessionStorage.getItem('userId') // 获取当前用户
  },
  methods: {
    // 初始化
    init () {
      this.Index = '01'
      this.searchData.type = '01'
      this.visible = true
      this.query(1)
    },
    // 查询数据
    query (num) {
      if (num != undefined) {
        this.paginationData.currPage = num
      }
      this.$http({
        url: this.$http.adornUrl('activiti/actapprovalinfo/list'),
        method: 'get',
        params: Object.assign({}, this.paginationData, this.searchData)
      }).then(({ data }) => {
        if (data && data.code === 0) {
          if (this.searchData.type == '01') {
            this.waitNum = data.pageList.page.totalCount
          }
          this.List = data.pageList.dataList;
          this.paginationData = data.pageList.page;
          this.paginationData.totalCount = data.pageList.page.totalCount;
        } else {
          this.List = []
          this.paginationData.totalCount = 0;
          this.$notify.error({
            title: "错误",
            message: data.msg,
            duration: 5000
          });
        }
      })
    },
    // 切换tab
    Process (selectIndex) {
      this.Index = selectIndex
      this.searchData.type = selectIndex
      this.query(1)
    },
    // 审核
    approver (item) {
      this.visible = false
      // json字符串转化成对象
      let str = item.params
      let obj = JSON.parse(str)
      this.encodeSearchParams(obj)
      this.$router.push({ path: `${item.routeUrl}?${this.params}` })
      // 更新状态
      this.$http({
        url: this.$http.adornUrl('activiti/actapprovalinfo/updateview'),
        method: 'put',
        data: item.id
      }).then(({ data }) => {
        if (data && data.code === 0) {

        }
      })
    },

    // url的参数拼接
    encodeSearchParams (obj) {
      this.params = []
      Object.keys(obj).forEach(key => {
        let value = obj[key]
        // 如果值为undefined我们将其置空
        if (typeof value === 'undefined') {
          value = ''
        }
        // 对于需要编码的文本（比如说中文）我们要进行编码
        this.params.push([key, encodeURIComponent(value)].join('='))
      })
      return this.params.join('&')
    }
  }
}
</script>
<style scoped>
.item {
  margin-top: 10px;
  margin-right: 40px;
}
.content {
  border-bottom: 1px solid #dcdfe6;
  position: relative;
  height: 40px;
  line-height: 40px;
}
.btn.active {
  border: 1px solid transparent;
  outline: none;
  color: #fff;
  padding: 8px 15px;
  background-color: #17b3a3;
}
.btn {
  border: 1px solid transparent;
  outline: none;
  color: #606266;
  background-color: #fff;
  border: 1px solid #606266;
  padding: 8px 15px;
}
.title {
  float: left;
  cursor: pointer;
  line-height: 40px;
  line-height: 40px;
}
.check {
  float: right;
  cursor: pointer;
  color: #409eff;
}
.br-4 {
  border-radius: 4px;
}
.min-h {
  min-height: 300px;
}
p {
  text-align: center;
  position: absolute;
  top: 40%;
  left: 45%;
}
.pag-all {
  padding: 10px 0;
}
</style>
