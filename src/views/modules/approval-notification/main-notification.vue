<template>
  <el-dialog :visible.sync="visible"
             :append-to-body="true"
             width="60%">
    <el-tabs @tab-click="handleClick"
             style="margin-top:10px;"
             v-model="activeTabs">
      <el-tab-pane name="pendingTab">
        <span slot="label"
              style="padding-right:0">
          <span>待我审批的</span>
          <el-badge :value="waitNum"
                    v-if="waitNum>0"
                    size="mini"></el-badge>
        </span>
        <approval-pendingTab ref="pendingTab"
                             @parentVisible='parentVisible'></approval-pendingTab>
      </el-tab-pane>
      <el-tab-pane label="我已审批的"
                   name="finishTab">
        <approval-pendingTab ref="finishTab"
                             @parentVisible='parentVisible'></approval-pendingTab>
      </el-tab-pane>
      <el-tab-pane label="我发起的"
                   name="initiateTab">
        <approval-pendingTab ref="initiateTab"
                             @parentVisible='parentVisible'></approval-pendingTab>
      </el-tab-pane>
    </el-tabs>
    <pagination-all v-model="paginationData"
                    class="pag-all"
                    @paginationChangeHandle="query"></pagination-all>
  </el-dialog>
</template>

<script>
import Bus from '@/components/js/bus.js'
// 分页
import paginationAll from '@/components/erp-pagination/pagination-all';
//引入审批组件
import approvalPendingTab from './approval-pendingTab';
export default {
  components: {
    paginationAll,
    approvalPendingTab,
  },
  data () {
    return {
      paginationData: {},
      visible: false,
      activeTabs: 'pendingTab',
      message: '',
      waitNum: 0, // 待办流程数量
      obj: {
        code: 1,
        id: 2
      },
      params: [],
      List: [], // 待办列表
      type: '01',    //第一个标签页被选中
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
      this.type = '01'
      this.visible = true
      this.activeTabs = 'pendingTab',
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
        params: Object.assign({}, this.paginationData, { type: this.type })
      }).then(({ data }) => {
        if (data && data.code === 0) {
          if (this.type == '01') {
            //解决首页进入页面 el-badge 视图不渲染，添加this.$forceUpdate();进行强制渲染
            //找到el-badge 的父组件的dom节点使用$forceUpdate()
            this.$children[0].$children[0].$children[0].$forceUpdate()
            this.waitNum = data.pageList.page.totalCount
          }
          this.List = data.pageList.dataList;
          this.paginationData = data.pageList.page;
          this.paginationData.totalCount = data.pageList.page.totalCount;
          this.$nextTick(() => {
            this.$refs[this.activeTabs].init(this.List, this.type)
          })
        } else {
          this.List = []
          this.paginationData.totalCount = 0;
          this.$notify.error({
            title: "错误",
            message: data.msg,
            duration: 5000
          });
          return;
        }
      })
    },

    //子组件传过来的数据------控制弹框的显示和隐藏
    parentVisible (data) {
      this.visible = data
    },

    //点击标签页
    handleClick (tab, event) {
      if (tab.name === 'pendingTab') {
        this.type = '01'
      }
      if (tab.name === 'finishTab') {
        this.type = '02'
      }
      if (tab.name === 'initiateTab') {
        this.type = '03'
      }
      this.query(1)
    }
  }
}
</script>
<style scoped>
.item {
  margin-top: 10px;
  margin-right: 40px;
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
.el-badge.item {
  margin-right: 0px;
  margin-top: 1px;
}
</style>
