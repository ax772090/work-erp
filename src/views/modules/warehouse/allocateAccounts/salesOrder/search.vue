<template>
  <el-dialog title="订单详情查看"
             :close-on-click-modal="false"
             :visible.sync="visible"
             @close="$refs['dataForm'].resetFields()"
             width='90%'>
    <el-form :model="dataForm"
             ref="dataForm"
             label-width="110px">
      <!-- 基本信息 -->
      <el-row>
        <el-col :span="6">
          <el-form-item label="订单编号"
                        prop="code">
            <el-input v-model="dataForm.code"
                      disabled></el-input>
          </el-form-item>
          <el-form-item label="客户"
                        prop="customerId">
            <select-seach :isDisabled="true"
                          v-model='dataForm.customerId'
                          httpUrl='/list/search/customer'
                          httpMethod='get'
                          requestParamsKey='idOrName'
                          dataLabel='name'
                          dataValue='id'
                          dataSource='list'>
            </select-seach>
          </el-form-item>
          <el-form-item label="所在国家"
                        prop="dictCountryId">
            <select-all v-model="dataForm.dictCountryId"
                        :listDataOption="CountryOption"
                        data-value="id"
                        data-label="nameCn"
                        :isDisabled="true"></select-all>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="购买日期"
                        prop="orderDate">
            <el-date-picker v-model="dataForm.orderDate"
                            type="date"
                            value-format="yyyy-MM-dd"
                            disabled></el-date-picker>
          </el-form-item>
          <el-form-item label="发货日期"
                        prop="shippedDate">
            <el-date-picker v-model="dataForm.shippedDate"
                            type="date"
                            value-format="yyyy-MM-dd"
                            disabled></el-date-picker>
          </el-form-item>
          <el-form-item label="销售公司"
                        prop="supplierName">
            <select-all v-model="dataForm.compId"
                        :listDataOption="compIdOption"
                        data-value="orgId"
                        data-label="name"
                        :isDisabled="true"></select-all>
            <!-- <el-select v-model='dataForm.compId'
                       disabled>
              <el-option v-for='item in compIdOption'
                         :key='item.orgId'
                         :label='item.name'
                         :value='item.orgId'></el-option>
            </el-select> -->
          </el-form-item>

        </el-col>
        <el-col :span="6">
          <el-form-item label="结算币种"
                        prop="currencyId">
            <el-input v-model="dataForm.currencyId"
                      disabled></el-input>
          </el-form-item>
          <el-form-item label="本位币"
                        prop="baseCurrencyId">
            <select-all v-model="dataForm.baseCurrencyId"
                        :listDataOption="baseCurrencyOption"
                        data-value="code"
                        data-label="name"
                        :isDisabled="true"></select-all>

          </el-form-item>
          <el-form-item label="汇率"
                        prop="exchangeRate">
            <el-input v-model="dataForm.exchangeRate"
                      disabled></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="单据状态"
                        prop="dictDocStatus">
            <select-all v-model="dataForm.dictDocStatus"
                        :listDataOption="dictDocStatusOption"
                        data-value="key"
                        data-label="value"
                        :isDisabled="true"></select-all>
            <!-- <el-select v-model="dataForm.dictDocStatus"
                       :disabled='true'>
              <el-option v-for="item in dictDocStatusOption"
                         :key="item.key"
                         :label="item.value"
                         :value="item.key"></el-option>
            </el-select> -->
          </el-form-item>
          <el-form-item label="摘要"
                        prop="remark">
            <textarea-all disabled
                          v-model="dataForm.remark"></textarea-all>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
    <el-table :data="dataForm.detailList"
              stripe
              border
              highlight-current-row
              max-height="400"
              show-summary
              :summary-method="getSummaries"
              v-loading="dataListLoading">
      <el-table-column type="index"
                       label="行号"
                       width="50"></el-table-column>
      <el-table-column prop="code"
                       label="产品编码"></el-table-column>
      <el-table-column prop="nameCh"
                       label="产品名称"
                       width="270"></el-table-column>
      <el-table-column prop="unitName"
                       label="单位">
      </el-table-column>
      <el-table-column prop="qty"
                       label="购买数量"
                       min-width='125px;'>
      </el-table-column>
      <el-table-column label="税率"
                       prop="taxRate"
                       width='100px;'>
      </el-table-column>
      <el-table-column prop="price"
                       label="单价"></el-table-column>
      <el-table-column prop="taxPrice"
                       label="含税单价">
      </el-table-column>
      <el-table-column prop="subtotalAmount"
                       label="金额">
      </el-table-column>
      <el-table-column prop="taxAmount"
                       label="税额"></el-table-column>
      <el-table-column prop="totalAmount"
                       label="价税合计"></el-table-column>
      <el-table-column prop="basePrice"
                       label="单价（本位币）"></el-table-column>
      <el-table-column prop="baseTaxPrice"
                       label="含税单价（本位币）"></el-table-column>
      <el-table-column prop="baseSubtotalAmount"
                       label="金额（本位币）"></el-table-column>
      <el-table-column prop="baseTaxAmount"
                       label="税额（本位币）"></el-table-column>
      <el-table-column prop="baseTotalAmount"
                       label="价税合计（本位币）"></el-table-column>
    </el-table>
    <span slot="footer"
          class="dialog-footer">
      <el-button @click="visible=false"><i class="iconfont erp-icon-quxiao"></i>取消</el-button>
    </span>
  </el-dialog>
</template>
<script>
import selectSeach from '@/components/erp-select/select-seach'
import selectAll from '@/components/erp-select/select-all'
// 备注
import textareaAll from '@/components/erp-input/textarea-all.vue'
export default {
  components: {
    selectSeach,
    selectAll,
    textareaAll
  },
  name: 'search',
  props: ['value'], // 接受外部v-model传入的值
  data () {
    return {
      isShow: true,
      isDisabled: false,
      controlDisabled: false,
      dataListLoading: false,
      visible: false,
      checked: false,
      type: '',
      baseCurrencyOption: [], // 本位币
      compIdOption: [],     // 销售公司,
      CountryOption: [],   // 所在国家
      dictDocStatusOption: [],   // 单据状态
      // 基本信息
      dataForm: {
        status: '01',
        code: '',
        warehouseName: '',
        compName: '',
        userName: '',
        date: new Date(),
        remarks: '',
        baseCurrencyId: '',
        status: '',
        id: '1',
        detailList: []
      },
      inventoryStatus: [] // 库存状态
    }
  },
  created () {
    this.getDataUrl()
  },

  methods: {
    // 初始化
    init (id, type, modules) {
      this.visible = true
      this.dataForm.id = id
      this.$nextTick(() => {
        if (type === 'canCheck') {
          this.initCheck(id)
        }
      })
    },
    initCheck (id) {
      this.$http({
        url: this.$http.adornUrl(`sales/socompinfo/info/${id}`),
        method: 'get'
      }).then(({ data }) => {
        if (data && data.code === 0) {
          let dataList = data.soCompInfo.detailList
          for (let i = 0; i < dataList.length; i++) {
            this.$set(dataList[i], 'code', dataList[i].prodBasicEntity.code)
            this.$set(dataList[i], 'nameCh', dataList[i].prodBasicEntity.nameCh)
            this.$set(dataList[i], 'unitName', dataList[i].prodBasicEntity.dictUnitEntity.name)
            this.$set(dataList[i], 'baseSubtotalAmount', (dataList[i].subtotalAmount * data.soCompInfo.exchangeRate).toFixed(2))
            this.$set(dataList[i], 'baseTaxAmount', ((dataList[i].totalAmount - dataList[i].subtotalAmount) * data.soCompInfo.exchangeRate).toFixed(2))
            this.$set(dataList[i], 'baseTotalAmount', (dataList[i].taxPrice * dataList[i].qty * data.soCompInfo.exchangeRate).toFixed(2))
            dataList[i].basePrice = Number(dataList[i].basePrice).toFixed(2)
            dataList[i].baseTaxPrice = Number(dataList[i].baseTaxPrice).toFixed(2)
            dataList[i].price = Number(dataList[i].price).toFixed(2)
          }
          this.dataForm = data.soCompInfo
          this.dataForm.currencyId = this.dataForm.dictCurrencyEntity.name
          this.dataForm.dataList = dataList
          this.dataForm.baseCurrencyId = 'CNY'
          let Data = this.dataForm.dataList

          // for (let i = 0; i < Data.length; i++) {
          //   Data[i].taxRate = Data[i].taxRate * 100
          // }
        }
      })
    },
    getDataUrl () {
      // 单据状态
      this.$http
        .get(this.$http.adornUrl('basicData/queryDataDict2List'), {
          params: { dataDictKey: 'APPROVAL_STATUS' }
        })
        .then(({ data }) => {
          this.dictDocStatusOption = data.fontMaps
        })
      this.$http
        .get(this.$http.adornUrl('basicData/queryDataDict2List'), {
          params: { dataDictKey: 'WAREHOUSE_INVENTORY_STATUS' }
        })
        .then(({ data }) => {
          this.inventoryStatus = data.fontMaps
        })
      // 本位币
      this.$http
        .get(this.$http.adornUrl('basicData/queryAllCurrency')
        )
        .then(({ data }) => {
          this.baseCurrencyOption = data.currencyList
        })
      // 所在国家
      this.$http
        .get(this.$http.adornUrl('/basicData/queryAllCountry'))
        .then(({ data }) => {
          this.CountryOption = data.countries
        })
      // 公司
      this.$http.get(this.$http.adornUrl('sys/organization/select')).then(({ data }) => { this.compIdOption = data.companyList })
    },
    // 合计求和
    getSummaries (param) {
      const { columns, data } = param
      const sums = []
      columns.forEach((column, index) => {
        if (index === 0) {
          sums[index] = '合计'
          return
        }
        if (column.property == 'qty' || column.property == 'noTaxAmount' || column.property == 'tax' || column.property == 'totalAmount' || column.property == 'subtotalAmount' || column.property == 'taxAmount' || column.property == 'baseSubtotalAmount' || column.property == 'baseTaxAmount' || column.property == 'baseTotalAmount') {
          const values = data.map(item => Number(item[column.property]))
          sums[index] = values.reduce((prev, curr) => {
            const value = Number(curr)
            if (!isNaN(value)) {
              return prev + curr
            } else {
              return prev
            }
          }, 0)
          sums[index]
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