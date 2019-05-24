<template>
  <el-dialog title="订单详情"
             width="90%"
             :close-on-click-modal="false"
             :visible.sync="visible"
             :before-close="handleClose">
    <el-form :model="dataForm"
             :rules="dataRule"
             ref="dataForm"
             label-width="110px"
             :disabled="formDisabled">
      <el-row>
        <el-col :span="6">
          <el-form-item label="订单编号"
                        prop="amazonOrderId">{{dataForm.amazonOrderId}}</el-form-item>
          <el-form-item label="购买日期"
                        prop="purchaseDate">{{dataForm.purchaseDate}}</el-form-item>
          <el-form-item label="销售市场"
                        prop="salesChannel">{{dataForm.salesChannel}}</el-form-item>
          <el-form-item label="买家邮件"
                        prop="buyerEmail">{{dataForm.buyerEmail}}</el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="配送服务"
                        prop="shipmentServiceLevelCategory">{{dataForm.shipmentServiceLevelCategory}}</el-form-item>
          <el-form-item label="配送渠道"
                        prop="fulfillmentChannel">{{dataForm.fulfillmentChannel}}</el-form-item>
          <el-form-item label="配送地址"
                        prop="addressLine1">{{dataForm.addressLine1}}</el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="送达日期"
                        prop="lastUpdateDate">{{dataForm.lastUpdateDate}}</el-form-item>
          <el-form-item label="账单国家/地区"
                        prop="countryCode">{{dataForm.countryCode}}</el-form-item>
          <el-form-item label="结算币别"
                        prop="currencyCode">{{dataForm.currencyCode}}</el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="订单总金额"
                        prop="amount">{{dataForm.amount}}</el-form-item>
          <el-form-item label="发货日期"
                        prop="earliestShipDate">{{dataForm.earliestShipDate}}</el-form-item>
          <el-form-item label="联系买家"
                        prop="buyerName">
            <template slot-scope="scope">
              <a @click="addOrUpdateHandle(scope.row.id,'check')"
                 class="a-click-hover">{{dataForm.buyerName}}</a>
            </template>
          </el-form-item>
          <el-form-item label="买家电话"
                        prop="buyerPhone">{{dataForm.buyerPhone}}</el-form-item>
        </el-col>
        <el-col :span="6">
        </el-col>
      </el-row>
    </el-form>
    <div>
      <!-- 表格 -->
      <el-table :data="amazonOrderList"
                stripe
                border
                highlight-current-row
                v-loading="dataListLoading">
        <el-table-column fixed
                         prop="orderStatus"
                         label="状态"></el-table-column>
        <el-table-column prop="quantityOrdered"
                         label="订购数量"></el-table-column>
        <el-table-column prop="quantityShipped"
                         label="已发货数量"></el-table-column>
        <el-table-column prop="sellerSku"
                         label="SKU"></el-table-column>
        <el-table-column prop="asin"
                         label="ASIN"></el-table-column>
        <el-table-column prop="itemAmount"
                         label="商品金额"></el-table-column>
        <el-table-column prop="discountAmount"
                         label="促销"></el-table-column>
      </el-table>
    </div>
    <span slot="footer"
          class="dialog-footer">
      <el-button @click="visible = false"><i class="iconfont erp-icon-quxiao"></i>取消</el-button>
    </span>
  </el-dialog>
</template>

<script>
export default {
  data () {
    return {
      formDisabled: false, // 查看时设置为true
      amazonOrderList: [],
      dataListLoading: false,
      visible: false,
      dataForm: {
        amazonOrderId: '',
        purchaseDate: '',
        salesChannel: '',
        earliestShipDate: '',
        lastUpdateDate: '',
        countryCode: '',
        currencyCode: '',
        amount: '',
        shipmentServiceLevelCategory: '',
        fulfillmentChannel: '',
        addressLine1: '',
        buyerPhone: '',
        buyerEmail: '',
        buyerName: ''
      },
      dataRule: {}
    }
  },
  methods: {
    // 关闭清除本次缓存
    clearCache (formName) {
      this.$nextTick(() => {
        this.amazonOrderList = []
        // this.$refs[formName].resetFields();
        this.visible = false
      })
    },
    // 弹窗关闭之前
    handleClose (done) {
      this.clearCache('dataForm')

      done()
    },
    init (id) {
      this.visible = true
      this.amazonOrderList = []
      this.formDisabled = false
      if (id) {
        this.$nextTick(() => {
          this.$http({
            url: this.$http.adornUrl(`mws/listorder/info/${id}`),
            method: 'get'
          }).then(({ data }) => {
            if (data && data.code === 0) {
              this.dataForm = data.order || {}
              this.amazonOrderList = data.orderDetails
            } else {
              this.$notify.error({
                title: '错误',
                message: data.msg,
                duration: 5000
              })
            }
          })
        })
      }
    }
  }
}
</script>

