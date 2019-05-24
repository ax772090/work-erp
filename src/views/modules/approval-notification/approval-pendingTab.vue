<template>
  <el-table :data="tableData"
            stripe
            style="width: 100%">
    <el-table-column prop="originatorName"
                     width="170"
                     label="发起人">
    </el-table-column>
    <el-table-column prop="docName"
                     width="220"
                     label="单据名称">
    </el-table-column>
    <el-table-column prop="code"
                     width="240"
                     label="单号">
    </el-table-column>
    <el-table-column prop="launchDate"
                     width="220"
                     v-if="type !== '02'"
                     label="发起时间">
    </el-table-column>
    <el-table-column prop="approveTime"
                     v-if="type ==='02'"
                     width="220"
                     label="审批时间">
    </el-table-column>
    <el-table-column prop="originatorName"
                     :label="type ==='01'? '操作': '状态'">
      <template slot-scope="scope">
        <div @click="approver(scope.row)"
             class="check"
             v-if="type === '01'">
          点我审批
        </div>
        <div v-if="type === '02'">
          {{scope.row.isLastNode? '已审核通过' : '已审批'}}
        </div>
        <div v-if="type === '03'">
          <div class="title">{{scope.row.isLastNode? scope.row.approveResult : `当前审批节点:${scope.row.nodeName}`}}</div>
        </div>
      </template>
    </el-table-column>
  </el-table>
</template>
<script>
export default {
  data () {
    return {
      tableData: [],
      type: '',    //审批类型
      userId: '',
    }
  },
  methods: {
    init (data, type) {
      this.$nextTick(() => {
        this.userId = sessionStorage.getItem('userId') // 获取当前用户
        this.tableData = data;
        this.type = type;
      })
    },
    //审批
    approver (item) {
      //json字符串转化成对象
      let str = item.params
      let obj = JSON.parse(str)
      this.encodeSearchParams(obj)
      this.$emit('parentVisible', false)    //点击审核时，需要关闭父组件的弹框
      this.$router.push({ path: `${item.routeUrl}?${this.params}` })
      //更新状态
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
          value = '';
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
.check {
  cursor: pointer;
  color: #17b3a3;
}
</style>
