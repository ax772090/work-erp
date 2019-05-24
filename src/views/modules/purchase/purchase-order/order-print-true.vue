<template>
  <el-dialog title="打印采购合同(含税)"
             :close-on-click-modal="false"
             :visible.sync="visible"
             :append-to-body="true"
             width='70%'>
    <el-button type="success"
               @click="getDataList()"><i class="iconfont erp-icon-dayin"></i>打印</el-button>
    <el-button type="success"
               @click="visible = false"><i class="iconfont erp-icon-quxiao"></i>取消</el-button>
    <div ref="prints"
         class="bg">
      <div class="box"><img src="../../../../../static/img/bg1.png"
             alt=""></div>
      <el-row class="text-center">
        <h2><span class="spanchp">&nbsp;&nbsp;{{printData.purComp}}&nbsp;&nbsp;</span></h2>
        <h2>合同书</h2>
        <div><span>合同号:<span class="spanchp">&nbsp;&nbsp;{{printData.contractCode}}&nbsp;&nbsp;</span></span></div>
      </el-row>
      <el-row style="margin-bottom: 5px;">
        <el-col :span="12">
          甲方:<span class="spanchp"
                style="border-bottom: 1px solid #000;">&nbsp;&nbsp;{{printData.purComp}}&nbsp;&nbsp;</span>
        </el-col>
        <el-col :span="12">
          乙方:<span class="spanchp"
                style="border-bottom: 1px solid #000;">&nbsp;&nbsp;{{printData.supplierName}}&nbsp;&nbsp;</span>
        </el-col>
      </el-row>
      <p>一、甲乙双方遵照《合同法》及有关合同管理规定，经双方协商签订本合同。甲方向乙方采购以下产品:</p>
      <table border="1"
             class="gridtable">
        <tr>
          <!-- <th>序号</th> -->
          <th>产品名称</th>
          <th>规格型号</th>
          <th>单位</th>
          <th>（税后）单价CNY</th>
          <th>税率</th>
          <th >数量</th>
          <th>（税后）总金额CNY</th>
          <th>到货日期</th>
        </tr>
        <tr v-for="(item, index) in printData.detail"
            :key="index">
          <!-- <td>{{index+1}}</td> -->
          <td>{{item.prodName}}</td>
          <td>{{item.specifications}}</td>
          <td>{{item.unitName}}</td>
          <td>{{item.price}}</td>
          <td>{{item.taxRate}}</td>
          <td style="width: 80px">{{item.qty}}</td>
          <td>{{item.amount}}</td>
          <td>{{item.expectDate}}</td>
        </tr>
        <tr>
          <td style="text-align:left">合同总金额（{{printData.currency}}）</td>
          <td>大写:</td>
          <td colspan='3'>{{printData.numberToCN}}</td>
          <td>小写：</td>
          <td>{{totalAmount}}</td>
          <td></td>
        </tr>
        <tr>
          <td colspan='8'
              style="text-align:left">备注:&nbsp;此价格含税，增值税专用发票需按照甲方指定要求提供。</td>
        </tr>
      </table>
      <div class="appoint">
        <div class="appoint-content">
          <p style="margin-top:20px">二、付款信息与方式
          </p>
          <p>付款方式：
            <!-- <span class="spanchp">&nbsp;&nbsp;{{printData.payMode}}&nbsp;&nbsp;</span> -->
          </p>
          <p>预付比例<u>&nbsp;&nbsp;{{printData.prePercent}}&nbsp;&nbsp;</u>%，预付金额<u>&nbsp;&nbsp;{{printData.prePercentAmount}}&nbsp;&nbsp;</u>；款到发货<u>&nbsp;&nbsp;{{printData.payDelivery}}&nbsp;&nbsp;</u>%，金额<u>&nbsp;&nbsp;{{printData.payDeliveryAmount}}&nbsp;&nbsp;</u>；货到<u>&nbsp;&nbsp;{{printData.day}}&nbsp;&nbsp;</u>天付款<u>&nbsp;&nbsp;{{printData.cashDelivery}}&nbsp;&nbsp;</u>%，金额<u>&nbsp;&nbsp;{{printData.cashDeliveryAmount}}&nbsp;&nbsp;</u>；月结<u>&nbsp;&nbsp;{{printData.month}}&nbsp;&nbsp;</u>天<u>&nbsp;&nbsp;{{printData.monthStatement}}&nbsp;&nbsp;</u>%，金额<u>&nbsp;&nbsp;{{printData.monthStatementAmount}}&nbsp;&nbsp;</u>({{printData.currency}})</p>
          <p>户名：<span class="spanchp">&nbsp;&nbsp;{{printData.accountName}}&nbsp;&nbsp;</span>
          </p>
          <p>收款账户：<span class="spanchp">&nbsp;&nbsp;{{printData.accountNum}}&nbsp;&nbsp;</span></p>
          <p>开户银行：<span class="spanchp">&nbsp;&nbsp;{{printData.accountBank}}&nbsp;&nbsp;</span>
          </p>
          <p style="margin-top:20px">三、交货地点：深圳市龙岗区坂田街道中兴路140号顺兴工业区A+栋602（货物由乙方负责承运，并承担运费）</p>
          <p><span>交货时间：见表格到货日期&nbsp;&nbsp;</span>&nbsp;&nbsp;&nbsp;&nbsp;联系人：<span class="spanchp"
                  style="margin-right:50px;">&nbsp;&nbsp;李先生&nbsp;&nbsp;</span> 联系电话：<span class="spanchp">&nbsp;&nbsp;18038058544&nbsp;&nbsp;</span></p>
          <p style="margin-top:10px;text-align: justify;">四、检验方法：乙方在交付前应对所交付的产品进行检验，同时提供生产厂商的检验报告；乙方交货时，甲方对产品按照AQL0.65标准进行随机抽查与核对数量，若发现产品质不符合约定标准或交付数量与订单不符，甲方有权拒绝收货，由此给甲方带来的损失由乙方承担。如甲方为异地交货，则甲方应在收到货物后七个工作日内提出异议，拒收不合格品并要求及时更换合格品交货。
          </p>
          <p style="margin-top:20px">五、违约责任：乙方交付货物不合格或不能按照合同规定时间交货或违反合同相关约定，乙方应承担违约责任。不合格产品应在限期七日内重新制作调换，乙方未按照合同时间按期交付合格品的，每逾期一日乙方应向甲方支付合同总金额千分之五的违约金；逾期超过10日的，甲方可解除合同，且乙方应当向甲方支付合同总金额30%的违约金，前期支付的合同定金应无条件返还给甲方。</p>
          <p style="margin-top:20px">六、处理争议：甲乙双方在履行合同中发生争议，可通过协商解决，协商不成，任何一方可向深圳市龙岗区人民法院提起诉讼。</p>
          <p style="margin-top:20px">七、本合同经双方代表签名、加盖公司印章后生效，本合同复印件具有同等法律效力。</p>
          <p>八、本合同一式两份，甲乙双方各持一份。</p>
          <p><span style="margin-right:50px">九、本合同签约地点：深圳市</span> 签约时间：{{ printData.date }}</p>
        </div>
        <div class="signature">
          <div class="width50">
            <div class="height50">甲方盖章：</div>
            <div class="height50" style="margin-top:5px">法定法人或代表：</div>
          </div>
          <div class="width50">
            <div class="height50">乙方盖章：</div>
            <div class="height50" style="margin-top:5px">法定法人或代表：</div>
          </div>
        </div>
      </div>
    </div>
  </el-dialog>
</template>
<script>
export default {
  data () {
    return {
      visible: false,
      printData: {
        detail: []
      }
    }
  },
  computed: {
    totalAmount () {
      var num = 0
      for (let i = 0; i < this.printData.detail.length; i++) {
        num += this.printData.detail[i].amount
      }
      return num.toFixed(2)
    }
  },
  methods: {
    init (printData) {
      this.visible = true
      this.printData = printData.printContract.info
      this.printData.detail = printData.printContract.detail
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
.box img {
  max-width: 90%;
  max-height: 90%;
  position: absolute;
  left: 10%;
  opacity: 0.5;
  top: 10%;
}
.text-left {
  text-align: left;
}

.text-center {
  text-align: center;
  font-weight: 600;
  div {
    span {
      float: right;
    }
  }
}

.text-right {
  text-align: right;
}
.prodName > .el-row {
  padding: 3px 0;
  // opacity: 1;
}
.padding010 {
  padding: 0 10px;
}
h2,
h5 {
  margin: 0;
  padding: 5px 0;
}
p {
  margin: 5px 0;
}
.spanchp {
  display: inline-block;
  // border-bottom: 1px solid #000;
  color: #000;
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
    // background-color: #dedede;
  }
  td {
    border-width: 1px;
    padding: 8px;
    border-style: solid;
    border-color: #000;
    // background-color: #ffffff;
  }
}
.appoint {
  // border-width: 0 1px 1px 1px;
  // border-style: solid;
  // border-color: #000;
  .appoint-content {
    border-top: 0px;
    padding: 0 10px;
    .spanchp {
      display: inline-block;
      color: #000;
    }
  }
  .signature {
    display: -webkit-flex; /* Safari */
    display: flex;
    .width50 {
      flex: 1;
      padding: 0 10px;
      margin-left: -1px;
      // border-style: solid;
      // border-color: #000;
      div {
        height: 30px;
        line-height: 30px;
      }
    }
    &:nth-child(2) {
      margin-right: -1px;
    }
  }
}
</style>