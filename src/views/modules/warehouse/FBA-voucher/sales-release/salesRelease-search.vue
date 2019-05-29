<!-- 销售出库单（FBA仓）查看 -->
<template>
  <el-dialog :visible.sync="visible"
             :title="dialogTitle"
             width="90%"
             :close-on-click-modal="false"
             @close="$refs['dataForm'].resetFields()">
    <el-form :model="dataForm"
             ref="dataForm"
             label-width="100px"
             :rules="dataRule"
             :disabled="formDisabled">
      <el-row>
        <el-col :span="6">
          <el-form-item label="出库单号"
                        prop="code">
            <el-input v-model="dataForm.code"
                      disabled
                      placeholder="系统自动生成"></el-input>
          </el-form-item>
          <el-form-item label="仓管员"
                        prop="adminId">
            <select-seach :isDisabled="isDisabled"
                          v-model="dataForm.adminId"
                          httpUrl="/list/search/user"
                          httpMethod="get"
                          requestParamsKey="name"
                          data-label="name"
                          data-value="id"
                          data-source="list"
                          placeholder="搜索仓管员"></select-seach>
          </el-form-item>
          <el-form-item label="来源店铺"
                        prop="channelId">
            <select-all v-model="dataForm.channelId"
                        :listDataOption="channelIdOptions"
                        :isDisabled="true"
                        data-value="id"
                        data-label="name"></select-all>
          </el-form-item>
          <el-form-item label="备注"
                        prop="remark">
            <textarea-all v-model="dataForm.remark"></textarea-all>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="库存公司"
                        prop="compId">
            <select-all v-model="dataForm.compId"
                        :listDataOption="CompIdOptions"
                        data-value="id"
                        data-label="name"
                        :isSelectChange="true"
                        @selectChange="compNameChange"></select-all>
          </el-form-item>
          <el-form-item label="仓库"
                        prop="fromWarehouseId">
            <select-all v-model="dataForm.fromWarehouseId"
                        :listDataOption="fromWarehouseIdOptions"
                        data-value="id"
                        data-label="name"></select-all>
          </el-form-item>
          <el-form-item label="客户分组"
                        prop="customerGroup">
            <el-input v-model="dataForm.customerGroup"
                      placeholder="请输入客户分组"
                      disabled></el-input>
          </el-form-item>

        </el-col>
        <el-col :span="6">
          <el-form-item label="结算币种"
                        prop="currencyId">
            <select-all v-model="dataForm.currencyId"
                        :listDataOption="currencyIdOptions"
                        :isDisabled="true"
                        data-value="id"
                        data-label="name"
                        placeholder="选择币种"></select-all>
          </el-form-item>
          <el-form-item label="本位币"
                        prop="curCurrencyId">
            <select-all v-model="dataForm.curCurrencyId"
                        :listDataOption="curCurrencyIdOptions"
                        :isDisabled="true"
                        data-value="id"
                        data-label="name"
                        placeholder="选择币种"></select-all>
          </el-form-item>
          <el-form-item label="汇率"
                        prop="currencyRate">
            <el-input v-model="dataForm.currencyRate"
                      disabled></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="出库日期"
                        prop="shippedDate">
            <el-date-picker v-model="dataForm.shippedDate"
                            type="date"
                            value-format="yyyy-MM-dd"
                            placeholder="选择要货日期"></el-date-picker>
          </el-form-item>
          <el-form-item label="单据状态"
                        prop="dictDocStatus">
            <select-all v-model="dataForm.dictDocStatus"
                        :listDataOption="dictDocStatusOption"
                        :isDisabled="true"
                        data-value="key"
                        data-label="value"></select-all>
          </el-form-item>
          <el-form-item label="业务类型"
                        prop="dictShipmentType">
            <select-all v-model="dataForm.dictShipmentType"
                        :listDataOption="dictBizStatusOption"
                        :isDisabled="true"
                        data-value="key"
                        data-label="value"></select-all>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-table :data="dataForm.dataList"
                  stripe
                  border
                  highlight-current-row
                  v-loading="dataListLoading"
                  show-summary
                  :summary-method="getSummaries"
                  max-height="450">
          <el-table-column prop="imageUrl"
                           label="产品图片"
                           width="120">
            <template slot-scope="scope">
              <tableImg :imageUrl='scope.row.imageUrl'></tableImg>

            </template>
          </el-table-column>
          <el-table-column prop="prodCode"
                           label="产品编码"></el-table-column>
          <el-table-column prop="prodName"
                           label="产品名称"></el-table-column>
          <el-table-column prop="unitName"
                           label="单位"></el-table-column>
          <el-table-column prop="dictInventoryStatus"
                           label="库存状态">
            <template slot-scope="scope">
              <select-all v-model="scope.row.dictInventoryStatus"
                          :listDataOption="defectiveStatusOptions"
                          :isDisabled="isDisabled"
                          data-value="key"
                          data-label="value"></select-all>
            </template>
          </el-table-column>
          <el-table-column prop="qty"
                           label="出库数量"></el-table-column>
          <el-table-column prop="price"
                           label="单价"></el-table-column>
          <el-table-column prop="orderDetailId"
                           label="源单单号"></el-table-column>
        </el-table>
      </el-row>
    </el-form>
    <span slot="footer"
          class="dialog-footer">
      <el-button @click="visible = false"><i class="iconfont erp-icon-quxiao"></i>取消</el-button>
      <el-button type="primary"
                 @click="dataFormSave()"
                 v-if="isShowSave"><i class="iconfont erp-icon-baocun"></i>保存</el-button>
    </span>
  </el-dialog>
</template>
<script>
import selectSeach from '@/components/erp-select/select-seach'
import selectAll from '@/components/erp-select/select-all'
// 引入图片
import tableImg from '@/components/list-table/table-img'
import { dateFormatter } from '@/utils/index.js'
// 备注
import textareaAll from '@/components/erp-input/textarea-all.vue'
export default {
  components: {
    selectSeach,
    selectAll,
    tableImg,
    textareaAll
  },
  data () {
    return {
      curCurrencyIdOptions: [], // 本位币
      isShowSave: true,
      formDisabled: false,
      dialogTitle: '',
      isDisabled: false,
      dataListLoading: false, // loading加载
      visible: false,
      dataForm: {
        dataList: [],
        id: '',
        shippedDate: dateFormatter(new Date(), false) // 将"2018-11-08T09:07:37.648Z"转换为"2018-11-08"
      },
      currencyIdOptions: [], // 结算币种
      CompIdOptions: [], // 库存公司
      channelIdOptions: [], // 来源店铺
      fromWarehouseIdOptions: [], // 仓库
      dictDocStatusOption: [], // 单据状态
      dictBizStatusOption: [], // 业务状态
      defectiveStatusOptions: [], // 库存状态
      dataRule: {
        adminId: [{ required: true, message: '必填项', trigger: 'blur' }], // 仓管员
        compId: [{ required: true, message: '必填项', trigger: 'change' }], // 库存公司
        fromWarehouseId: [
          { required: true, message: '必填项', trigger: 'change' }
        ], // 仓库
        shippedDate: [{ required: true, message: '必填项', trigger: 'change' }] // 出库日期
      }
    }
  },
  created () {
    // 结算币种
    this.$http
      .get(this.$http.adornUrl('/basicData/queryAllCurrency'))
      .then(({ data }) => {
        this.currencyIdOptions = data.currencyList
        this.curCurrencyIdOptions = data.currencyList
      })
    this.getDataUrl()
  },
  methods: {
    // 库存公司下面的仓库
    compNameChange (value, type) {
      if (type) {
        this.$http
          .get(this.$http.adornUrl('list/combobox/warehouse-comp'), {
            params: { compId: value }
          })
          .then(({ data }) => {
            this.fromWarehouseIdOptions = data.list
          })
      } else {
        this.dataForm.fromWarehouseId = ''
        this.$http
          .get(this.$http.adornUrl('list/combobox/warehouse-comp'), {
            params: { compId: value }
          })
          .then(({ data }) => {
            this.fromWarehouseIdOptions = data.list
          })
      }
    },
    getDataUrl () {
      // 库存公司
      this.$http
        .get(this.$http.adornUrl('list/combobox/company'))
        .then(({ data }) => {
          this.CompIdOptions = data.list
        })
      // 来源店铺
      this.$http
        .get(this.$http.adornUrl('basic/basicchannel/listcombobox'), {
          params: { platformType: '' }
        })
        .then(({ data }) => {
          this.channelIdOptions = data.list
        })
      // 单据状态
      this.$http
        .get(this.$http.adornUrl('basicData/queryDataDict2List'), {
          params: { dataDictKey: 'APPROVAL_STATUS' }
        })
        .then(({ data }) => {
          this.dictDocStatusOption = data.fontMaps
        })
      // 业务状态
      this.$http
        .get(this.$http.adornUrl('basicData/queryDataDict2List'), {
          params: { dataDictKey: 'FBA_SHIPMENT_TYPE' }
        })
        .then(({ data }) => {
          this.dictBizStatusOption = data.fontMaps
        })
      // 库存状态
      this.$http
        .get(this.$http.adornUrl('basicData/queryDataDict2List'), {
          params: { dataDictKey: 'WAREHOUSE_INVENTORY_STATUS' }
        })
        .then(({ data }) => {
          this.defectiveStatusOptions = data.fontMaps
        })
    },
    // 初始化
    init (id, data, type) {
      this.visible = true
      // 来自Amazon订单管理的自发货出库
      if (id && type === 'amazonOrder') {
        this.dialogTitle = '销售出库新增'
        this.initAdd(id, data)
      }
      if (id && type === 'check') {
        this.dialogTitle = '销售出库查看'
        this.initCheck(id)
      }
      if (id && type === 'canEdit') {
        this.dialogTitle = '销售出库编辑'
        this.initEdit(id)
      }
    },
    initAdd (id, data) {
      this.dataForm = Object.assign({}, data.outstockSo, { id: '' })
      this.dataForm.dataList = data.outstockSoDetails
      this.compNameChange(this.dataForm.compId, id)
    },
    initCheck (id) {
      this.formDisabled = true
      this.isShowSave = false
      this.dataCallInfo(id)
    },
    initEdit (id) {
      this.dataCallInfo(id)
    },
    dataCallInfo (id) {
      this.$nextTick(() => {
        this.dataForm.id = id
        this.$http({
          url: this.$http.adornUrl(
            `warehouse/whoutstockso/info/${id}`
          ),
          method: 'get'
        }).then(({ data }) => {
          if (data && data.code === 0) {
            this.dataForm = data.outstockSo
            this.dataForm.dataList = data.outstockSoDetails
            this.compNameChange(this.dataForm.compId, id)
          } else {
            this.$notify.error({
              title: '错误',
              message: data.msg,
              duration: 3000
            })
          }
        })
      })
    },
    // 保存
    dataFormSave: _.debounce(
      async function dataFormSave () {
        let arr = []
        this.dataForm.dataList.forEach(item => {
          let obj = {}
          this.$set(obj, 'prodId', item.prodId)
          this.$set(obj, 'sellerSku', item.sellerSku)
          this.$set(obj, 'outstockSoId', item.outstockSoId)
          this.$set(obj, 'dictInventoryStatus', item.dictInventoryStatus)
          this.$set(obj, 'qty', item.qty)
          this.$set(obj, 'merchantId', item.merchantId)
          arr.push(obj)
        })
        this.$refs['dataForm'].validate(valid => {
          if (valid) {
            this.$http({
              url: this.$http.adornUrl(
                `warehouse/whoutstockso/${
                !this.dataForm.id ? 'save' : 'update'
                }`
              ),
              method: !this.dataForm.id ? 'post' : 'put',
              data: Object.assign(
                {},
                { outstockSo: this.dataForm },
                { whOutstockSoDetailList: arr }
              )
            }).then(({ data }) => {
              if (data && data.code === 0) {
                this.visible = false
                this.$emit('refreshDataList')
                this.$notify({
                  title: '提示',
                  message: '保存成功',
                  type: 'success',
                  duration: 5000
                })
              } else {
                this.$notify.error({
                  title: '错误',
                  message: data.msg,
                  duration: 5000
                })
              }
            })
          } else {
            return false
          }
        })
      }, 1000, {
        leading: true,
        trailing: false
      }
    ),
    // 合计
    getSummaries (param) {
      const { columns, data } = param
      const sums = []
      columns.forEach((column, index) => {
        if (index === 0) {
          sums[index] = '合计'
          return
        }
        const values = data.map(item => Number(item[column.property]))
        if (!values.every(value => isNaN(value))) {
          sums[index] = values.reduce((prev, curr) => {
            const value = Number(curr)
            if (!isNaN(value)) {
              return prev + curr
            } else {
              return prev
            }
          }, 0)
          if (column.property === 'qty') {
            sums[index] += ''
          } else {
            sums[index] = ''
          }
        } else {
          sums[index] = ''
        }
      })
      return sums
    }
  },
  watch: {
    // 初始外部用v-model传的值
    value: {
      // 深度监听，可监听到对象、数组的变化
      handler (val, oldVal) {
        this.dataForm = this.value
        this.$emit('change', this.dataForm)
      },
      deep: true
    },

    // 当前组件变动后，抛出事件
    dataForm: {
      // 深度监听，可监听到对象、数组的变化
      handler (val, oldVal) {
        this.$emit('input', this.dataForm) // 用于出发v-model原始事件，避免父级其他监听
      },
      deep: true
    }
  }
}
</script>
