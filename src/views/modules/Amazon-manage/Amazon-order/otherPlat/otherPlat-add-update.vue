<template>
  <el-dialog :title="dialogTile"
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
          <el-form-item label="销售公司"
                        prop="amazonOrderId">
            <select-all v-model="dataForm.compId"
                        :listDataOption="compIdOptions"
                        placeholder='请选择销售公司'
                        data-value="id"
                        data-label="name"></select-all>
          </el-form-item>
          <el-form-item label="销售平台"
                        prop="dictplatformType">
            <select-all v-model="dataForm.dictplatformType"
                        :listDataOption="dictplatformTypeOptions"
                        data-value="key"
                        data-label="value"
                        placeholder="请选择要货平台"></select-all>
          </el-form-item>
          <el-form-item label="订单编号"
                        prop="orderNum">
            <el-input v-model="dataForm.orderNum"
                      placeholder="未生成"
                      disabled></el-input>
          </el-form-item>
          <el-form-item label="购买日期"
                        prop="orderDate">
            <el-date-picker v-model="dataForm.orderDate"
                            type="date"
                            value-format="yyyy-MM-dd"
                            default-time
                            placeholder="选择日期"></el-date-picker>
          </el-form-item>

        </el-col>
        <el-col :span="6">
          <el-form-item label="状态"
                        prop="status">
            <select-all v-model="dataForm.status"
                        :listDataOption="dictDocStatusOptions"
                        :isDisabled="true"
                        data-value="key"
                        data-label="value"
                        placeholder='状态'></select-all>
          </el-form-item>
          <el-form-item label="买家全名"
                        prop="buyerName">
            <el-input v-model="dataForm.buyerName"
                      disabled></el-input>
          </el-form-item>
          <el-form-item label="邮政编码"
                        prop="postalCode">
            <el-input v-model="dataForm.postalCode"
                      disabled></el-input>
          </el-form-item>
          <el-form-item label="订单总金额"
                        prop="amount">
            <el-input v-model="dataForm.amount"
                      disabled></el-input>
          </el-form-item>

        </el-col>
        <el-col :span="6">
          <el-form-item label="所在国家"
                        prop="countryCode">
            <select-all v-model="dataForm.countryCode"
                        :listDataOption="countryCodeOptions"
                        data-value="id"
                        data-label="nameCn"
                        placeholder="请选择所在国家"></select-all>
          </el-form-item>
          <el-form-item label="发货日期"
                        prop="shippingDate">
            <el-date-picker v-model="dataForm.shippingDate"
                            type="date"
                            value-format="yyyy-MM-dd"
                            default-time
                            placeholder="选择日期"></el-date-picker>
          </el-form-item>
          <el-form-item label="结算币种"
                        prop="currencyCode">
            <select-all v-model="dataForm.currencyCode"
                        :listDataOption="currencyCodeOptions"
                        :isDisabled="true"
                        data-value="id"
                        data-label="name"
                        placeholder="选择币种"></select-all>
          </el-form-item>
          <el-form-item label="平台佣金费"
                        prop="platformCommision">
            <el-input v-model="dataForm.platformCommision"
                      disabled></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="买家电话"
                        prop="phoneNumber">
            <el-input v-model="dataForm.phoneNumber"></el-input>
          </el-form-item>
          <el-form-item label="买家邮件"
                        prop="email">
            <el-input v-model="dataForm.email"></el-input>
          </el-form-item>
          <el-form-item label="物流跟踪号"
                        prop="trackNumber">
            <el-input v-model="dataForm.trackNumber"></el-input>
          </el-form-item>
          <el-form-item label="配送地址"
                        prop="shippingAddress">
            <textarea-all v-model="dataForm.shippingAddress"></textarea-all>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
    <div>
      <!-- 表格 -->
      <el-table :data="dataList"
                stripe
                border
                highlight-current-row
                v-loading="dataListLoading">
        <el-table-column fixed
                         prop="status"
                         label="状态"></el-table-column>
        <el-table-column prop="quantity"
                         label="购买数量"></el-table-column>
        <el-table-column prop="shippedQuantity"
                         label="已发货数量"></el-table-column>
        <el-table-column prop="sku"
                         label="SKU"></el-table-column>
        <el-table-column prop="item"
                         label="Item"></el-table-column>
        <el-table-column prop="price"
                         label="商品单价"></el-table-column>
      </el-table>
    </div>
    <span slot="footer"
          class="dialog-footer">
      <el-button @click="visible = false"><i class="iconfont erp-icon-quxiao"></i>取消</el-button>
    </span>
  </el-dialog>
</template>

<script>
import selectAll from '@/components/erp-select/select-all'
// 备注
import textareaAll from '@/components/erp-input/textarea-all.vue'
export default {
  components: {
    selectAll,
    textareaAll
  },
  data () {
    return {
      dictDocStatusOptions: [],
      compIdOptions: [],
      currencyCodeOptions: [],
      countryCodeOptions: [],
      dictplatformTypeOptions: [],
      dialogTile: '',
      formDisabled: false, // 查看时设置为true
      dataList: [],
      dataListLoading: false,
      visible: false,
      dataForm: {
        dictplatformType: '',
        orderNum: '',
        orderDate: '',
        countryCode: '',
        shippingDate: '',
        currencyCode: '',
        platformCommision: '',
        currencyCode: '',
        amount: '',
        shipmentServiceLevelCategory: '',
        status: '',
        buyerName: '',
        postalCode: '',
        shippingAddress: '',
        phoneNumber: '',
        email: '',
        trackNumber: '',
        buyerName: ''
      },
      dataRule: {}
    }
  },
  methods: {
    // 关闭清除本次缓存
    clearCache (formName) {
      this.$nextTick(() => {
        this.dataList = []
        this.visible = false
      })
    },
    // 弹窗关闭之前
    handleClose (done) {
      this.clearCache('dataForm')

      done()
    },
    getDataUrl () {
      // 平台
      this.$http.get(this.$http.adornUrl('basicData/queryDataDict2List'), {
        params: {
          dataDictKey: 'PLANTFORM_TYPE'
        }
      }).then(({ data }) => {
        this.dictplatformTypeOptions = data.fontMaps
      })
      // 所在国家
      this.$http.get(this.$http.adornUrl('/basicData/queryAllCountry')).then(({ data }) => {
        this.countryCodeOptions = data.countries
      })
      // 结算币种
      this.$http.get(this.$http.adornUrl('/basicData/queryAllCurrency')).then(({ data }) => {
        this.currencyCodeOptions = data.currencyList
      })
      // 发货公司
      this.$http
        .get(this.$http.adornUrl('list/combobox/company'))
        .then(({
          data
        }) => {
          this.compIdOptions = data.list
        })
      // 状态
      this.$http
        .get(this.$http.adornUrl('basicData/queryDataDict2List'), {
          params: {
            dataDictKey: 'APPROVAL_STATUS'
          }
        })
        .then(({
          data
        }) => {
          this.dictDocStatusOptions = data.fontMaps
        })
    },
    init (id, type) {
      Object.assign(this.$data, this.$options.data())
      this.visible = true
      this.getDataUrl()
      if (id && type === 'check') {
        this.dialogTile = '订单详情'
        this.formDisabled = true
      } else {
        this.dialogTile = '订单编辑'
      }
      if (id) {
        this.$nextTick(() => {
          this.$http({
            url: this.$http.adornUrl(`dataService/mwsotherplatformorder/info/${id}`),
            method: 'get'
          }).then(({ data }) => {
            if (data && data.code === 0) {
              this.dataForm = data.order || {}
              this.dataList = data.orderDetails
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

