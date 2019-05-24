<template>
  <el-dialog title="库存情况"
             :close-on-click-modal="false"
             :visible.sync="visible"
             @close="$refs['dataForm'].resetFields()"
             :append-to-body="true"
             width="50%">
    <el-form :inline="true"
             :model="dataForm"
             ref="dataForm">
      <div v-for="(item,index) in table"
           :key="index"
           class="mb-15">
        <div class="prod-info">
          <span>{{item.prodName}}</span>
          <span>国内可用库存:<u>{{item.prodQty}}</u></span>
          <span>组合产品如下:</span>
        </div>
        <el-table :data="item.list"
                  stripe
                  border
                  highlight-current-row
                  max-height="500"
                  show-summary
                  :summary-method="getSummaries">
          <el-table-column prop="code"
                           label="子项产品编码"></el-table-column>
          <el-table-column prop="nameCh"
                           label="子项产品名称"></el-table-column>
          <el-table-column prop="usedQty"
                           label="组合用量"></el-table-column>
          <el-table-column prop="waitQty"
                           label="待检数量"></el-table-column>
          <el-table-column prop="avalibleQty"
                           label="可用数量"></el-table-column>
        </el-table>
      </div>
    </el-form>
    <span slot="footer"
          class="dialog-footer">
      <el-button @click="visible = false">
        <i class="iconfont erp-icon-quxiao"></i>
        取消</el-button>
      <el-tooltip class="item"
                  effect="dark"
                  v-if="this.type !== '1'"
                  :content="continueContent"
                  placement="right">
        <el-button type="primary"
                   @click="continueHandle">
          <i class="iconfont erp-icon-queren"></i>继续</el-button>
      </el-tooltip>
    </span>
  </el-dialog>
</template>
<script>
export default {
  components: {
  },
  data () {
    return {
      continueContent: '',
      type: '',
      table: [],
      visible: false,
      dataForm: {},
      // 原有的数据
      parentData: [],
      // 当前组件数据
      dataList: []
    }
  },
  methods: {
    init (data, type) {
      this.continueContent = ''
      this.type = type
      // if (type === '2') {
      this.continueContent = `将会执行您刚刚的${type === '2' ? ' [保存] ' : ' [提交] '}操作，请确认是否要点击！`
      // }
      this.table = data
      this.visible = true
    },
    continueHandle () {
      this.visible = false
      this.$emit('continue', this.type)
    },
    // 统计数量
    getSummaries (param) {
      const { columns, data } = param
      const sums = []
      columns.forEach((column, index) => {
        if (index === 0) {
          sums[index] = '合计(可用)'
          return
        }
        if (index === 1) {
          sums[index] = '组合品库存数+配件可组装数量'
          return
        }
        if (column.property === 'avalibleQty') {
          const values = data.map(item => Number(item[column.property]) / Number(item['usedQty']))
          const prodQty = data.map(item => Number(item['prodQty']))
          values.sort((a, b) => { return a - b })
          sums[index] = Math.floor(values[0]) + prodQty[0]
        } else {
          sums[index] = ''
        }
      })
      return sums
    }
  }
}
</script>
<style scoped>
/* 误删 */
div .prod-info {
  margin-bottom: 10px;
}
.prod-info span {
  margin-right: 10px;
  color: #409eff;
  font-size: 16px;
}
.mb-15{
  margin-bottom: 15px;
}
</style>
