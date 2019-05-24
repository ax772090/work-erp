<template>
  <div>
    <el-dialog title="往来对账单"
               :visible.sync="dialogVisible"
               :append-to-body="true"
               :close-on-click-modal="false"
               width="70%">
      <el-button type="success"
                 @click="print()"><i class="iconfont erp-icon-dayin"></i>打印</el-button>
      <el-button type="success"
                 @click="dialogVisible = false"><i class="iconfont erp-icon-quxiao"></i>取消</el-button>
      <div ref="prints">
        <div class="headTitle">
          <h2 class="text-center">往来对账单</h2>
          <p>TO:{{ dataForm.supplierName }}</p>
          <p>收件人:{{ dataForm.contact }}</p>
          <p>电话:{{ dataForm.contactPhone }}<span class="fr">传真:</span></p>
        </div>
        <div class="contenTitle">
          <p class="h20">
            <span class="fl">FROM:{{ dataForm.compName }}</span>
            <span class="fr">对账月份:{{ dataForm.month }}</span>
          </p>
          <p>联系人:</p>
          <p>电话:</p>
          <p style="text-align:right;padding-right:15px">币种:{{dataForm.currencyName}}</p>
        </div>
        <table border="1"
               class="gridtable">
          <thead>
            <tr>
              <th v-for="(item,index) in theadata"
                  :key="index">{{item}}</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(item,index) in dataForm.accountStatementDetailList"
                :key="index">
              <td>{{ item.date }}</td>
              <td>{{ item.docCode }}</td>
              <td>{{ item.contractCode }}</td>
              <td>{{ item.prodCode }}</td>
              <td>{{ item.prodName }}</td>
              <td>{{ item.specifications }}</td>
              <td>{{ item.unitName }}</td>
              <td>{{ item.qty }}</td>
              <td>{{ item.price }}</td>
              <td>{{ item.amount }}</td>
            </tr>
            <tr>
              <td colspan='9'
                  style="text-align:right;padding-right:20px">合计:</td>
              <td>{{ dataForm.currentPayableAmount }}</td>
            </tr>
          </tbody>
        </table>
        <table border="1"
               class="table">
          <thead>
            <tr>
              <th>序号</th>
              <th>项目</th>
              <th>金额</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>1</td>
              <td>上期应付款余额</td>
              <td>{{ dataForm.stagelaPayableAmount }}</td>
            </tr>
            <tr>
              <td>2</td>
              <td>本期预付</td>
              <td>{{ dataForm.currentAdvanceAmount }}</td>
            </tr>
            <tr>
              <td>3</td>
              <td>本期应付款</td>
              <td>{{ dataForm.currentPayableAmount }}</td>
            </tr>
            <tr>
              <td>4</td>
              <td>本期应付调整</td>
              <td>{{ dataForm.currentPayableAdjustAmount }}</td>
            </tr>
            <tr>
              <td>5</td>
              <td>本期已支付金额</td>
              <td>{{ dataForm.currentPaidAmount }}</td>
            </tr>
            <tr>
              <td>6</td>
              <td>本期应付余额</td>
              <td>{{ dataForm.currentPayableSurplusAmount }}</td>
            </tr>
          </tbody>
        </table>
        <div class="btom">
          <div class="leftBox">
            请确认并回传！
          </div>
          <div class="rightBox">
            <div>
              <p>供货单位：</p>
            </div>
            <div>
              <p>签字：</p>
            </div>
            <div>
              <p>日期：</p>
            </div>
          </div>
        </div>
      </div>
    </el-dialog>
  </div>
</template>
<script>
export default {
  data () {
    return {
      dialogVisible: false,
      theadata: ['入库日期', '入库单号', '采购订单', 'SKU', '名称', '规格', '单位', '数量', '单价', '金额'],
      dataForm: {
        accountStatementDetailList: []
      }
    }
  },
  methods: {
    init (data) {
      this.dialogVisible = true
      this.dataForm = data
    },
    // 获取数据列表
    print () {
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
<style lang="scss" scoped>
p {
  margin: 8px 0;
}
.fl {
  float: left;
}
.fr {
  float: right;
  margin-right: 150px;
  width: 120px;
}
.text-center {
  text-align: center;
}
.gridtable,
.table {
  width: 100%;
  text-align: center;
  font-size: 11px;
  color: #000;
  border-width: 1px;
  border-color: #000;
  border-collapse: collapse;
  th,
  td {
    padding: 8px 0;
  }
}
.table {
  width: 50%;
  margin-top: 20px;
}
.headTitle {
  border-bottom: 1px solid #000;
}
.h20 {
  height: 15px;
}
@media print {
  body {
    -webkit-print-color-adjust: exact;
  }
}
.btom {
  margin-top: 20px;
  font-size: 14px;
  .leftBox {
    color: #000;
    vertical-align: top;
    margin-left: 18%;
    width: 30%;
    display: inline-block;
  }
  .rightBox {
    display: inline-block;
    div {
      color: #000;
      p {
        width: 80px;
        text-align: right;
        display: inline-block;
        margin: 6px 0;
      }
    }
  }
}
</style>
