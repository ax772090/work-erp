<template>
  <el-dialog title="FBAShipment"
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
          <el-form-item label="来源店铺"
                        prop="channelName">
            {{dataForm.channelName}}
          </el-form-item>
          <el-form-item label="Shipment名称"
                        prop="fbaName">
            {{dataForm.fbaName}}
          </el-form-item>
          <el-form-item label="Shipment ID"
                        prop="shipmengId">
            {{dataForm.shipmengId}}
          </el-form-item>
          <el-form-item label="货件状态"
                        prop="status">
            {{dataForm.status}}
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="配送地址"
                        prop="addressLine">
            {{dataForm.addressLine}}
          </el-form-item>
          <el-form-item label="物流追踪号"
                        prop="logisticsNo">
            <el-input v-model="dataForm.logisticsNo"
                      disabled></el-input>
          </el-form-item>
          <el-form-item>
            <el-checkbox v-model="dataForm.areCasesRequired"
                         disabled>原厂包装发货商品</el-checkbox>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="人工费用"
                        prop="artificialCost">
            {{dataForm.artificialCost}}
          </el-form-item>
          <el-form-item label="运费"
                        prop="freight">
            {{dataForm.freight}}
          </el-form-item>
          <el-form-item label="贴标方式"
                        prop="labelType">
            {{dataForm.labelType}}
          </el-form-item>

        </el-col>
        <el-col :span="6">
          <el-form-item label="商品货件数"
                        prop="skuCount">
            {{dataForm.skuCount}}
          </el-form-item>
          <el-form-item label="商品总数量"
                        prop="countQty">
            {{dataForm.countQty}}
          </el-form-item>
          <el-form-item label="装箱方式"
                        prop="packingMothod">
            {{dataForm.packingMothod}}
          </el-form-item>

        </el-col>
      </el-row>
    </el-form>
    <div>
      <!-- 表格 -->
      <el-table :data="fbaDetailsList"
                stripe
                border
                highlight-current-row
                max-height="400"
                v-loading="dataListLoading"
                show-summary>
        <el-table-column fixed
                         prop="msku"
                         label="MSKU"></el-table-column>
        <el-table-column prop="title"
                         label="Title"></el-table-column>
        <el-table-column prop="asin"
                         label="ASIN"></el-table-column>
        <el-table-column prop="fnsku"
                         label="FNSKU"></el-table-column>
        <el-table-column prop="countQty"
                         label="总数量"></el-table-column>
        <el-table-column prop="qty"
                         label="每箱数量"></el-table-column>
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
      fbaDetailsList: [],
      dataListLoading: false,
      visible: false,
      dataForm: {
        shipmengId: '',
        channelName: '',
        fbaName: '',
        skuCount: '',
        countQty: '',
        addressLine: '',
        logisticsNo: '',
        artificialCost: '',
        areCasesRequired: false,

        freight: '',
        labelType: '',
        packingMothod: '',
        status: ''
      },
      dataRule: {}
    }
  },
  methods: {
    // 关闭清除本次缓存
    clearCache (formName) {
      this.$nextTick(() => {
        this.fbaDetailsList = []
        this.$refs[formName].resetFields()
        this.visible = false
      })
    },
    // 弹窗关闭之前
    handleClose (done) {
      this.clearCache('dataForm')
      done()
    },
    init (id, type) {
      this.visible = true
      this.dataForm.id = id
      this.fbaDetailsList = []
      this.formDisabled = false
      if (id) {
        this.$nextTick(() => {
          if (this.dataForm.id) {
            this.$http({
              url: this.$http.adornUrl(`warehouse/mwslistinbound/info/${id}`),
              method: 'get'
            }).then(({ data }) => {
              if (data && data.code === 0) {
                this.dataForm = data.wmsListBoundEntity || {}
                this.fbaDetailsList = data.mwsShipmentDetailList || []
              } else {
                this.$notify.error({
                  title: '错误',
                  message: data.msg,
                  duration: 5000
                })
              }
            })
          }
        })
      }
    }
  }
}
</script>