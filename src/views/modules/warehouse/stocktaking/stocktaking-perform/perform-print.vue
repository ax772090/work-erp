<template>
  <el-dialog title="盘点表打印"
             :close-on-click-modal="false"
             :visible.sync="visible"
             :append-to-body="true"
             width='70%'>
    <div ref="prints"
         class="prints">
      <table border="1"
             class="gridtable">
        <thead style="display:table-header-group;font-weight:bold">
          <tr>
            <th>序号</th>
            <th>盘点单号</th>
            <th>盘点日期</th>
            <th>产品</th>
            <th>仓库</th>
            <th>库存状态</th>
            <th>系统库存数</th>
            <th>盘点数量</th>
            <th>差异数量</th>
            <th>备注</th>
          </tr>
        </thead>
        <tr v-for="(item, index) in printdata.stocktaking"
            :key="index">
          <td>{{index+1}}</td>
          <td>{{item.code}}</td>
          <td>{{item.stocktakingDate}}</td>
          <td>
            <div class="pord">
              编号:{{item.prodCode}}
            </div>
            <div class="pord">
              名称:{{item.prodName}}
            </div>
            <div class="pord">
              单位:{{item.prodUnitName}}
            </div>
          </td>
          <td>{{item.warehouseName}}</td>
          <td>{{item.dictInventoryStatusName}}</td>
          <td>{{item.inventoryQty}}</td>
          <td>{{item.stocktakingQty}}</td>
          <td>{{item.diffQty}}</td>
          <td>{{item.remark}}</td>
        </tr>
      </table>
    </div>
  </el-dialog>
</template>
<script>
export default {
  data () {
    return {
      visible: false,
      printdata: {},
      dataList: [],
    }
  },
  methods: {
    init (printdata) {
      this.visible = true
      this.printdata = printdata
      this.$nextTick(() => {
        this.getDataList()
      })
    },
    // 获取数据列表
    getDataList () {
      this.$nextTick(() => {
        let newContent = this.$refs.prints.innerHTML
        document.body.innerHTML = newContent
        window.print()
        window.location.reload()
      })
    }
  }
}
</script>
<style lang='scss' scoped>
.gridtable {
  width: 100%;
  text-align: center;
  font-family: verdana, arial, sans-serif;
  font-size: 11px;
  color: #000;
  border-width: 1px;
  border-color: #000;
  border-collapse: collapse;
  th {
    border-width: 1px;
    padding: 8px;
    border-style: solid;
    border-color: #000;
    background-color: #dedede;
  }
  td {
    border-width: 1px;
    padding: 8px;
    border-style: solid;
    border-color: #000;
    background-color: #ffffff;
  }
}
.pord {
  padding: 0 0px 0 10px;
  text-align: left;
}
</style>