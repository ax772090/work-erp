<template>
  <el-dialog title="打印其他入库"
             :close-on-click-modal="false"
             :visible.sync="visible"
             :append-to-body="true"
             width="70%">
    <div ref="prints"
         class="prints">
      <div class="print-header">
        <div>
          <span>{{printdata.compName}}</span>
          <span class="header-right">打印时间：{{printdata.printDate}}</span>
        </div>
        <div>
          <div class="spanchp">&nbsp;&nbsp;其他入库单&nbsp;&nbsp;</div>
        </div>
      </div>
      <el-row class="print-center">
        <el-col :span="8">
          <div>入库类型：{{printdata.dictInstockTypeName}}</div>
          <div>入库日期：{{printdata.instockDate}}</div>
          <div>备注：{{printdata.remark}}</div>
        </el-col>
        <el-col :span="8">
          <div>仓库：{{printdata.warehouseName}}</div>
          <div>仓管员：{{printdata.warehouseUserName}}</div>
        </el-col>
        <el-col :span="8">
          <div>入库单号：{{printdata.code}}</div>
          <div>单据状态：{{printdata.dictDocStatusName}}</div>
          <div>供应商：{{printdata.supplierName}}</div>
        </el-col>
      </el-row>
      <table border="1"
             class="gridtable">
        <thead style="display:table-header-group;font-weight:bold">
          <tr>
            <th>序号</th>
            <th>产品编码</th>
            <th>产品名称</th>
            <th>规格型号</th>
            <th>单位</th>
            <th>入库数量</th>
            <th>库存状态</th>
          </tr>
        </thead>
        <tr v-for="(item, index) in printdata.whInstockDetail"
            :key="index">
          <td>{{index+1}}</td>
          <td>{{item.prodCode}}</td>
          <td>{{item.prodName}}</td>
          <td>{{item.specifications}}</td>
          <td>{{item.unitName}}</td>
          <td>{{item.inQty}}</td>
          <td>{{item.inventoryStatusName}}</td>
        </tr>
      </table>
      <el-row class="print-bottom">
        <el-col :span="12">
          <div>制单：{{printdata.addUserName}}</div>
        </el-col>
        <el-col :span="12">
          <div>审核：{{printdata.confirmUserName}}</div>
        </el-col>
      </el-row>
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
      tableData: [
        {
          date: "2016-05-03",
          name: "王小虎",
          province: "上海",
          city: "普陀区",
          address: "上海市普陀区金沙江路 1518 弄",
          zip: 200333,
          tag: "家"
        },
        {
          date: "2016-05-02",
          name: "王小虎",
          province: "上海",
          city: "普陀区",
          address: "上海市普陀区金沙江路 1518 弄",
          zip: 200333,
          tag: "公司"
        },
        {
          date: "2016-05-04",
          name: "王小虎",
          province: "上海",
          city: "普陀区",
          address: "上海市普陀区金沙江路 1518 弄",
          zip: 200333,
          tag: "家"
        },
        {
          date: "2016-05-01",
          name: "王小虎",
          province: "上海",
          city: "普陀区",
          address: "上海市普陀区金沙江路 1518 弄",
          zip: 200333,
          tag: "公司"
        }
      ]
    };
  },
  methods: {
    init (printdata) {
      this.visible = true;
      this.printdata = printdata.whInstockDto;
      this.$nextTick(() => {
        this.getDataList();
      });
    },
    // 获取数据列表
    getDataList () {
      this.$nextTick(() => {
        let newContent = this.$refs.prints.innerHTML;
        document.body.innerHTML = newContent;
        window.print();
        window.location.reload();
      });
    }
  }
};
</script>
<style lang='scss' scoped>
h2,
p {
  margin: 5px 0;
}
.print-header {
  .header-right {
    float: right;
  }
}
.spanchp {
  padding: 10px 0;
  margin: 0 auto;
  text-align: center;
  font-weight: 600;
  font-size: 18px;
}
.print-center {
  div {
    padding: 5px 0;
    span {
      float: right;
    }
  }
}

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

.print-bottom {
  div {
    font-weight: 600;
    padding: 5px 0;
  }
}
</style>