<template>
  <el-dialog :title="dialogTitle"
             width="90%"
             :close-on-click-modal="false"
             :visible.sync="visible"
             :before-close="handleClose">
    <el-form :model="dataForm"
             :rules="dataRule"
             ref="dataForm"
             label-width="130px"
             :disabled="formDisabled">
      <el-row>
        <el-col :span="12">
          <!-- 配送地址 -->
          <el-badge class="item">配送地址（允许国际邮政地址）</el-badge>
        </el-col>
        <el-col :span="12">
          <!-- 指定发货店铺 -->
          <el-badge class="item">指定发货店铺</el-badge>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12">
          <el-form-item label="收货人姓名"
                        prop="name">
            <el-input v-model="dataForm.name"
                      placeholder="收货人姓名"></el-input>
          </el-form-item>
          <el-form-item label="地址1"
                        prop="line1">
            <el-input v-model="dataForm.line1"
                      placeholder="地址1"></el-input>
          </el-form-item>
          <el-form-item label="地址2"
                        prop="line2">
            <el-input v-model="dataForm.line2"
                      placeholder="地址2"></el-input>
          </el-form-item>
          <el-form-item label="邮政编码"
                        prop="postalCode">
            <el-input v-model="dataForm.postalCode"
                      placeholder="邮政编码"></el-input>
          </el-form-item>
          <el-form-item label="国家/地区"
                        prop="countryCode">
            <el-input v-model="dataForm.countryCode"
                      placeholder="国家/地区"></el-input>
          </el-form-item>
          <el-form-item label="电话号码"
                        prop="phoneNumber">
            <el-input v-model="dataForm.phoneNumber"
                      placeholder="电话号码"></el-input>
          </el-form-item>
          <el-form-item label="买家电子邮件地址"
                        prop="email">
            <el-input v-model="dataForm.email"
                      placeholder="买家电子邮件地址"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="店铺"
                        prop="channelId">
            <select-all v-model="dataForm.channelId"
                        :listDataOption="channelIdOptions"
                        data-value="id"
                        data-label="name"></select-all>
          </el-form-item>
          <el-badge class="item">设置订单编号</el-badge>
          <el-form-item label="源平台订单号"
                        prop="sellerFulfillmentOrderId">
            <el-input v-model="dataForm.sellerFulfillmentOrderId"
                      placeholder="源平台订单号"></el-input>
          </el-form-item>
          <el-badge class="item">打印在装箱单上</el-badge>
          <el-form-item label="订单编号"
                        prop="displayableOrderId">
            <el-input v-model="dataForm.displayableOrderId"
                      placeholder="订单编号"></el-input>
          </el-form-item>
          <el-form-item label="订单日期"
                        prop="receivedDate">
            <el-date-picker v-model="dataForm.receivedDate"
                            type="date"
                            value-format="yyyy-MM-dd"
                            default-time
                            placeholder="选择日期"></el-date-picker>
          </el-form-item>
          <el-form-item label="配送方式"
                        prop="shippingSpeedCategory">
            <select-all v-model="dataForm.shippingSpeedCategory"
                        :listDataOption="deliveryModeOptions"
                        data-value="key"
                        data-label="value"></select-all>
          </el-form-item>
          <el-form-item label="备注"
                        prop="displayableOrderComment">
            <textarea-all v-model="dataForm.displayableOrderComment"></textarea-all>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
    <el-button class="mb-10"
               type="primary"
               size="mini"
               @click="addSkuHandle()"
               v-if="!isDisabled">
      <i class="iconfont el-icon--left el-icon-erp-numpickerplus"></i>指定订单SKU
    </el-button>
    <div>
      <!-- 表格 -->
      <el-table :data="amazonOrderList"
                stripe
                border
                highlight-current-row
                v-loading="dataListLoading">
        <el-table-column fixed
                         prop="sku"
                         label="SKU"></el-table-column>
        <el-table-column prop="asin"
                         label="ASIN"></el-table-column>
        <el-table-column prop="fnsku"
                         label="FNSKU"></el-table-column>
        <el-table-column prop="currencyCode"
                         label="申报币种"></el-table-column>
        <el-table-column prop="value"
                         label="申报价值"></el-table-column>
        <el-table-column prop="quantity"
                         label="订购数量"></el-table-column>
        <el-table-column prop="cancelledQuantity"
                         label="已取消"></el-table-column>
        <el-table-column prop="unfulfillableQuantity"
                         label="不可售"></el-table-column>
        <!-- 操作列 -->
        <el-table-column fixed="right"
                         width="80"
                         label="操作">
          <template slot-scope="scope">
            <el-button type="danger"
                       size="small"
                       circle
                       title="删除"
                       @click="deleteHandle(scope.$index)"
                       :disabled="isDisabled">
              <i class="iconfont erp-icon-shanchu"></i>
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <!-- 添加明细 -->
    <add-details ref="addDetails"
                 @addDetailsList="addList"></add-details>
    <span slot="footer"
          class="dialog-footer">
      <el-button @click="cancel('dataForm')"><i class="iconfont erp-icon-quxiao"></i>取消</el-button>
      <el-button type="primary"
                 @click="dataFormSave()"
                 v-if="!isDisabled"><i class="iconfont erp-icon-baocun"></i>保存</el-button>
      <el-button type="primary"
                 @click="dataFormSubmit()"
                 v-if="!isDisabled">上传Amazon后台</el-button>
    </span>
  </el-dialog>
</template>

<script>
// 添加明细（新组件）
import addDetails from '@/components/add-details/sku-detail'
import selectAll from '@/components/erp-select/select-all'

// 备注
import textareaAll from '@/components/erp-input/textarea-all.vue'
export default {
  components: {
    addDetails,
    selectAll,
    textareaAll
  },
  data () {
    return {
      channelIdOptions: [],
      // 配送方式
      deliveryModeOptions: [],
      isDisabled: false,
      addSkuVisible: false,
      dialogTitle: '', // dialog标题

      formDisabled: false, // 查看时设置为true
      amazonOrderList: [],
      dataListLoading: false,
      visible: false,
      dataForm: {},
      dataRule: {}
    }
  },
  created () {

  },
  methods: {
    // 关闭清除本次缓存
    clearCache (formName) {
      // this.$nextTick(() => {
      this.$refs[formName].resetFields()
      this.amazonOrderList = []
      this.visible = false
      // })
    },
    // 弹窗关闭之前
    handleClose (done) {
      this.clearCache('dataForm')
      done()
    },
    // 取消按钮
    cancel (formName) {
      this.clearCache(formName)
      // this.visible = false
    },
    // 新增产品SKU
    addSkuHandle () {
      this.addSkuVisible = true
      this.$nextTick(() => {
        this.$refs.addDetails.init('', this.amazonOrderList, {
          channelId: this.dataForm.channelId,
          dictSalePlatform: this.dataForm.dictNeedPlatform
        })
      })
    },
    // 子传过来的数据
    async addList (list) {
      let skuId = []
      list.forEach((item, index) => {
        skuId.push(item.id)
      })
      await this.$http({
        url: this.$http.adornUrl(`warehouse/whdeliveryplan/info-prod`),
        method: 'post',
        data: skuId
      }).then(({ data }) => {
        if (data && data.code === 0) {
          list = data.prodInfo
        } else {
          this.$notify.error({
            title: '错误',
            message: data.msg,
            duration: 5000
          })
        }
      })
      for (const data of list) {
        let isFind = false
        for (const item of this.dataForm.deliveryDetailsList) {
          if (data.channelSkuId === item.channelSkuId) {
            isFind = true
            break
          }
        }
        if (!isFind) {
          this.dataForm.deliveryDetailsList.push(data)
        }
      }
    },
    getDataUrl () {
      // 店铺
      this.$http
        .get(this.$http.adornUrl('basic/basicchannel/listcombobox'), {
          params: { platformType: '' }
        })
        .then(({ data }) => {
          this.channelIdOptions = data.list
        })
      // 配送方式
      this.$http
        .get(this.$http.adornUrl('basicData/queryDataDict2List'), {
          params: { dataDictKey: 'FBA_FULFILLMENT_SHIPPING' }
        })
        .then(({ data }) => {
          this.deliveryModeOptions = data.fontMaps
        })
    },
    init (id, type) {
      this.getDataUrl()
      this.visible = true
      this.amazonOrderList = []
      this.formDisabled = false
      // 查看操作
      if (id && type === 'check') {
        this.formDisabled = true
        this.isDisabled = true
        this.dialogTitle = '多渠道配送订单查看'
      } else if (!this.dataForm.id) {
        // this.dialogTitle = "要货计划新增";
      } else {
        this.dialogTitle = '要货计划修改'
      }
      if (id) {
        this.$nextTick(() => {
          this.$http({
            url: this.$http.adornUrl(`mws/fulfillmentlistorder/info/${id}`),
            method: 'get'
          }).then(({ data }) => {
            if (data && data.code === 0) {
              this.dataForm = data.orderInfo || {}
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
    },
    // 删除要货明细
    deleteHandle (index) {
      this.amazonOrderList.splice(index, 1)
    }
  }
}
</script>

<style scoped>
.item {
  margin-left: 5px;
  font-size: 14px;
  font-weight: 600;
  color: #d0a069;
}
.mb-10{
  margin-bottom: 10px;
}
</style>