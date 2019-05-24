<template>
  <el-dialog :title="!dataForm.id ? '盘盈/盘亏单新增' : isClick === true ? '盘盈/盘亏单修改' : '盘盈/盘亏单查看'"
             :close-on-click-modal='false'
             :visible.sync='visible'
             @close="$refs['dataForm'].resetFields()"
             width='90%'>
    <el-form :model='dataForm'
             :rules='dataRule'
             ref='dataForm'
             label-width='110px'>
      <el-row>
        <el-col :span='6'>
          <el-form-item label='单据类型'
                        prop='symbol'>
            <select-all v-model="dataForm.symbol"
                        :isDisabled="isDisabled"
                        :listDataOption="symbolOption"
                        data-value="key"
                        data-label="value"></select-all>
          </el-form-item>
          <el-form-item label='来源类型'
                        prop='source'>
            <select-all v-model="dataForm.source"
                        :isDisabled="isDisabled"
                        :listDataOption="sourceOption"
                        data-value="key"
                        data-label="value"></select-all>
          </el-form-item>
        </el-col>
        <el-col :span='6'>
          <el-form-item label='单号'
                        prop='code'>
            <el-input v-model="dataForm.code"
                      disabled
                      placeholder="系统自动生成"></el-input>
          </el-form-item>
          <el-form-item label='盘点日期'
                        prop='stocktakingDate'>
            <el-date-picker :disabled='isDisabled'
                            v-model='dataForm.stocktakingDate'
                            type='date'
                            value-format='yyyy-MM-dd'
                            placeholder='盘点日期'></el-date-picker>
          </el-form-item>
        </el-col>
        <el-col :span='6'>
          <el-form-item label='库存公司'
                        prop='compId'>
            <select-all v-model="dataForm.compId"
                        :isDisabled="isDisabled"
                        :listDataOption="compIdOption"
                        data-value="orgId"
                        data-label="name"></select-all>
          </el-form-item>
          <el-form-item label='来源店铺'
                        prop='channelId'>
            <select-all v-model="dataForm.channelId"
                        :isDisabled="isDisabled"
                        :listDataOption="channelIdOption"
                        data-value="id"
                        data-label="name"></select-all>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label='单据状态'
                        prop='dictDocStatus'>
            <select-all v-model="dataForm.dictDocStatus"
                        :isDisabled="isDisabled"
                        :listDataOption="dictDocStatusOption"
                        data-value="key"
                        data-label="value"></select-all>
          </el-form-item>
          <el-form-item label='备注'
                        prop='remark'>
            <el-input :disabled='isDisabled'
                      type='textarea'
                      :autosize='{ minRows: 1, maxRows: 3 }'
                      v-model='dataForm.remark'></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-table :data='dataForm.docDetail'
                  stripe
                  border
                  max-height="450"
                  highlight-current-row
                  v-loading='dataListLoading'
                  @selection-change='selectionChangeHandle'
                  show-summary
                  :summary-method="getSummaries">
          <el-table-column prop='prodImageUrl'
                           label='产品图片'
                           width="120px;">
            <template slot-scope="scope">
              <tableImg :imageUrl='scope.row.prodImageUrl'></tableImg>
            </template>
          </el-table-column>
          <el-table-column prop='prodCode'
                           label='产品编码'></el-table-column>
          <el-table-column prop='prodName'
                           label='产品名称'></el-table-column>
          <el-table-column prop='prodUnitName'
                           label='单位'></el-table-column>
          <el-table-column prop='warehouseId'
                           label='仓库'>
            <template slot-scope='scope'>
              <select-all v-model="scope.row.warehouseId"
                          :isDisabled="isDisabled"
                          :listDataOption="warehouseIdOption"
                          data-value="id"
                          data-label="name"></select-all>
            </template>
          </el-table-column>
          <el-table-column prop='qty'
                           label='盘盈/盘亏数量'>
            <template slot-scope='scope'>
              <el-input v-model='scope.row.qty'
                        placeholder='盘盈/盘亏数量'
                        :disabled='isDisabled'></el-input>
            </template>
          </el-table-column>
          <el-table-column prop='dictInventoryStatus'
                           label='库存状态'>
            <template slot-scope='scope'>
              <select-all v-model="scope.row.dictInventoryStatus"
                          :isDisabled="isDisabled"
                          :listDataOption="dictInventoryStatusOption"
                          data-value="key"
                          data-label="value"></select-all>
            </template>
          </el-table-column>
          <el-table-column prop='sourceBusinessId'
                           label='源单单号'></el-table-column>
          <el-table-column prop='sourceType'
                           label='来源类型'></el-table-column>
          <el-table-column prop='remark'
                           label='备注'>
            <template slot-scope='scope'>
              <el-input v-model='scope.row.remark'
                        :disabled='isDisabled'></el-input>
            </template>
          </el-table-column>
        </el-table>
      </el-row>
    </el-form>
    <span slot="footer">
      <el-button @click='visible = false'><i class="iconfont erp-icon-quxiao"></i>取消</el-button>
    </span>
  </el-dialog>
</template>
<script>
// 新增行
import selectSeach from '@/components/erp-select/select-seach'
import selectAll from '@/components/erp-select/select-all'

// 引入图片
import tableImg from '@/components/list-table/table-img'

export default {
  components: {
    selectSeach,
    selectAll,
    tableImg
  },

  data () {
    return {
      visible: false,
      isClick: true,
      isDisabled: false,
      // 单据类型
      symbolOption: [{ id: '01', name: '盘盈' }, { id: '02', name: '盘亏' }],
      // 来源类型
      sourceOption: [{ id: '01', name: '盘点表生成' }, { id: '02', name: '手工新增' }],
      // 来源店铺
      channelIdOption: [],
      // 单据状态
      dictDocStatusOption: [],
      // 库存公司
      compIdOption: [],
      // 退货仓库
      warehouseIdOption: [],
      // 库存状态
      dictInventoryStatusOption: [],
      dataForm: {
        id: '',
        symbol: '',
        source: '',
        code: '',
        stocktakingDate: '',
        dictDocStatus: '',
        compId: '',
        remark: '',
        docDetail: []
      },

      dataListLoading: false,
      dataListSelections: [],
      dataRule: {
        sources: [
          { required: true, message: '必填项', trigger: 'change' }
        ],
        source: [
          { required: true, message: '必填项', trigger: 'change' }
        ],
        stocktakingDate: [
          { required: true, message: '必填项', trigger: 'change' }
        ]
      }
    }
  },
  created () {
    // 公司
    this.$http.get(this.$http.adornUrl('sys/organization/select')).then(({ data }) => { this.compIdOption = data.companyList })
    // 来源店铺
    this.$http.get(this.$http.adornUrl('basic/basicchannel/listcombobox')).then(({ data }) => { this.channelIdOption = data.list })
    this.$http.get(this.$http.adornUrl('basicData/queryDataDict2List'), { params: { dataDictKey: 'APPROVAL_STATUS' } }).then(({ data }) => { this.dictDocStatusOption = data.fontMaps })
    this.$http.get(this.$http.adornUrl('basicData/queryDataDict2List'), { params: { dataDictKey: 'WAREHOUSE_INVENTORY_STATUS' } }).then(({ data }) => { this.dictInventoryStatusOption = data.fontMaps })
    // 来源类型
    this.$http.get(this.$http.adornUrl('basicData/queryDataDict2List'), { params: { dataDictKey: 'PROFIT_LOSSES_SOURCE' } }).then(({ data }) => { this.sourceOption = data.fontMaps })
    // 单据类型
    this.$http.get(this.$http.adornUrl('basicData/queryDataDict2List'), { params: { dataDictKey: 'PROFIT_LOSSES_SYMBOL' } }).then(({ data }) => { this.symbolOption = data.fontMaps })
  },
  methods: {
    init (id, type) {
      this.visible = true
      this.dataForm.id = id
      this.$nextTick(() => {
        if (type === 'canCheck') {
          this.initCheck(id)
        } else {
          this.initAdd()
        }
      })
    },
    initAdd () {
      // 新增
      this.isDisabled = false
      this.isClick = true
      this.dataForm.userId = ''
      // 默认公司
      this.dataForm.compId = sessionStorage.getItem('orgId')
      this.$nextTick(() => {
        this.compIdChange(this.dataForm.compId)
      })
    },
    initCheck (id) {
      this.isDisabled = true
      this.isClick = false
      this.dataCallInfo(id)
    },
    dataCallInfo (id) {
      this.$http({
        url: this.$http.adornUrl(`warehouse/whprofitlosses/info/${id}`),
        method: 'get'
      }).then(({ data }) => {
        if (data && data.code === 0) {
          this.compIdChange(data.docInfo.compId)
          this.dataForm = data.docInfo
          this.dataForm.docDetail = data.docDetail
        }
      })
    },

    // 选择公司触发
    compIdChange (value) {
      if (value.orgId) {
        value = value.orgId
      }
      this.$http.get(this.$http.adornUrl('list/combobox/warehouse-comp'), { params: { compId: value } }).then(({ data }) => { this.warehouseIdOption = data.list })
    },

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
    },

    // 多选
    selectionChangeHandle (val) {
      this.dataListSelections = val
    }
  }
}
</script>
