<template>
  <el-dialog title="采购退货单"
             :close-on-click-modal="false"
             :visible.sync="visible"
             :append-to-body="true"
             width='70%'>
    <el-button type="success"
               @click="print()"><i class="iconfont erp-icon-dayin"></i>打印</el-button>
    <div ref="prints"
         class="prints">
      <div class="print-header">
        <div>
          <span>{{dataForm.compName}}</span>
          <span class="header-right">打印时间：{{dataForm.printDate}}</span>
        </div>
        <div>
          <div class="spanchp">&nbsp;&nbsp;采购退货单&nbsp;&nbsp;</div>
        </div>
      </div>
      <el-row class="print-center">
        <el-col :span="8">
          <div>供应商：{{dataForm.supplierName}}</div>
          <div>退货员：{{dataForm.userName}}</div>
        </el-col>
        <el-col :span="8"
                class="pL-20">
          <div>退货单号：{{dataForm.code}}</div>
          <div>退货仓库：{{dataForm.warehouseName}}</div>
        </el-col>
        <el-col :span="8"
                class="pL-30">
          <div>单据状态：{{dataForm.dictStatusName}}</div>
          <div>
            退货类型：<i v-if="dataForm.mode === 1" style="font-style:normal">已收货再退</i><i v-if="dataForm.mode === 0" style="font-style:normal">已入库再退</i>
          </div>
        </el-col>
      </el-row>
      <table border="1"
             class="gridtable">
        <thead style="display:table-header-group;font-weight:bold">
          <tr>
            <th>源采购订单号</th>
            <th>产品编码</th>
            <th>产品名称</th>
            <th>单位</th>
            <th>退货数量</th>
            <th>库存状态</th>
            <th>备注</th>
          </tr>
        </thead>
        <tr v-for="(item, index) in dataForm.poReturnDetail"
            :key="index">
          <td>{{item.poCode}}</td>
          <td>{{item.prodCode}}</td>
          <td>{{item.prodName}}</td>
          <td>{{item.unitName}}</td>
          <td>{{item.qty}}</td>
          <td>{{item.inventoryStatusName}}</td>
          <td>{{item.remark}}</td>
        </tr>
      </table>
      <el-row type="flex"
              class="row-bg"
              justify="space-around"
              v-for="(item,index) in dataForm.detail1"
              :key="index">
        <el-col :span="6">
          <el-form-item :label="item.label"
                        prop="item.prop"></el-form-item>
        </el-col>
      </el-row>
      <el-row class="print-bottom">
        <el-col :span="6">
          <div>制单：{{dataForm.addUserName}}</div>
        </el-col>
        <el-col :span="6">
          <div>审核：{{dataForm.confirmUserName}}</div>
        </el-col>
        <el-col :span="6">
          <div>退货：</div>
        </el-col>
        <el-col :span="6">
          <div>记账：</div>
        </el-col>
      </el-row>
    </div>
  </el-dialog>
</template>
<script>
// 表格
import erpTable from '@/components/erp-table/table-usually'
import { StringDecoder } from 'string_decoder'
export default {
  components: {
    erpTable
  },
  name: 'storageEditor',
  data () {
    return {
      visible: false,
      dataObj: {},
      dataList: [],
      Checked: '',
      dataForm: {
      }
    }
  },

  methods: {
    init (dataForm) {
      this.visible = true
      this.dataForm = dataForm.poReturnDto
      if (this.dataForm.mode === 0) {
        this.Checked = '1'
      } else {
        this.Checked = '2'
      }
    },
    // 获取数据列表
    getDataList () {
      this.$nextTick(() => {
        let newContent = this.$refs.prints.innerHTML
        document.body.innerHTML = newContent
        window.print()
        window.location.reload()
      })
    },
    // 打印
    print () {
      this.$nextTick(() => {
        this.getDataList()
      })
    }
  }
}
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
    padding: 5px 0px;
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
.row-bg {
  padding: 10px 20px;
}
.pL-30 {
  padding-left: 30px;
}
.in-block {
  display: inline-block;
}
.pL-20 {
  padding-left: 20px;
}
</style>