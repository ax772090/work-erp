<template>
  <el-dialog :title="!dataForm.id ? '销售退货新增' : isClick === true ? '销售退货编辑' : '销售退货查看'"
             :close-on-click-modal="false"
             :visible.sync="visible"
             @close="$refs['dataForm'].resetFields()"
             width='90%'>
    <el-form :model="dataForm"
             :rules="dataRule"
             ref="dataForm"
             label-width="110px">
      <el-row>
        <el-col :span="6">
          <el-form-item label="退货单号"
                        prop="code">
            <el-input v-model="dataForm.code"
                      :disabled='true'
                      placeholder="系统自动生成"></el-input>
          </el-form-item>
          <el-form-item label="退货日期"
                        prop="returnDate">
            <el-date-picker v-model="dataForm.returnDate"
                            type="date"
                            value-format="yyyy-MM-dd"
                            placeholder="出库日期"
                            :disabled='isDisabled'>
            </el-date-picker>
          </el-form-item>
          <el-form-item label="来源店铺"
                        prop="channelId">
            <select-all v-model="dataForm.channelId"
                        :isDisabled="isDisabled"
                        :listDataOption="channelIdOption"
                        data-value="id"
                        data-label="name"></select-all>
          </el-form-item>

        </el-col>
        <el-col :span="6">

          <el-form-item label="库存公司"
                        prop="compId">
            <select-all v-model="dataForm.compId"
                        :isDisabled="isDisabled"
                        :listDataOption="compIdOption"
                        data-value="orgId"
                        data-label="name"
                        :isSelectChange="true"
                        @selectChange="compIdChange"></select-all>
          </el-form-item>
          <el-form-item label="仓库"
                        prop="warehouseId">
            <select-all v-model="dataForm.warehouseId"
                        :isDisabled="isDisabled"
                        :listDataOption="warehouseIdOption"
                        data-value="id"
                        data-label="name"></select-all>
          </el-form-item>

        </el-col>
        <el-col :span="6">

          <el-form-item label="仓管员"
                        prop="warehouseUserId">
            <select-seach v-model='dataForm.warehouseUserId'
                          httpUrl='list/search/user'
                          httpMethod='get'
                          dataLabel='name'
                          dataValue='id'
                          dataSource='list'
                          placeholder='搜索仓管员'
                          :isDisabled='isDisabled'></select-seach>
          </el-form-item>
          <el-form-item label="客户"
                        prop="customerGroup">
            <el-input v-model="dataForm.customerGroup"
                      :disabled='true'
                      placeholder="客户"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="单据状态"
                        prop="dictDocStatus">
            <select-all v-model="dataForm.dictDocStatus"
                        :isDisabled="true"
                        :listDataOption="dictDocStatusOption"
                        data-value="key"
                        data-label="value"></select-all>
          </el-form-item>
          <el-form-item label="备注"
                        prop="remark">
            <textarea-all v-model="dataForm.remark"
                          :autosize="[2,4]"
                          :disabled='isDisabled'></textarea-all>
          </el-form-item>
        </el-col>
      </el-row>
      <!-- ============================== 其他出库明细 ============================== -->
      <el-table :data="dataForm.whReturnSoDetail"
                stripe
                border
                show-summary
                :summary-method="getSummaries"
                highlight-current-row
                max-height="450"
                v-loading="dataListLoading"
                @selection-change="selectionChangeHandle">
        <el-table-column prop="sellerSku"
                         label="SellSKU"></el-table-column>
        <el-table-column prop="prodCode"
                         label="产品编码"></el-table-column>
        <el-table-column prop="prodName"
                         label="产品名称"></el-table-column>
        <el-table-column prop="unitName"
                         label="单位"></el-table-column>
        <el-table-column prop="dictInventoryStatusName"
                         label="库存状态"></el-table-column>
        <el-table-column prop="qty"
                         label="退货数量">
          <template slot-scope="scope">
            <el-form-item :prop="'whReturnSoDetail.' + scope.$index + '.qty'"
                          :rules='dataRule.isNatural'
                          label-width="0px">
              <el-input v-model="scope.row.qty"
                        :disabled='isDisabled'
                        placeholder="退货数量"></el-input>
            </el-form-item>
          </template>
        </el-table-column>
        <el-table-column prop="remark"
                         label="备注">
          <template slot-scope="scope">
            <textarea-all v-model="scope.row.remark"
                          :disabled='isDisabled'></textarea-all>
          </template>
        </el-table-column>
      </el-table>
    </el-form>
    <span slot="footer">
      <el-button @click="visible = false"><i class="iconfont erp-icon-quxiao"></i>取消</el-button>
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
  data () {
    return {
      visible: false,
      isDisabled: false,
      isClick: true,
      type: '',
      dataForm: {
        id: '',
        code: '',
        returnDate: '',
        remark: '',
        compId: '',
        warehouseId: '',
        customerGroup: '',
        dictDocStatus: '01',
        warehouseUserId: '',
        channelId: '',
        whReturnSoDetail: []
      },
      // 仓库
      warehouseIdOption: [],
      // 公司
      compIdOption: [],
      // 单据状态
      dictDocStatusOption: [],
      // 来源店铺
      channelIdOption: [],
      // 多选
      dataListSelections: [],
      dataListLoading: false,

      dataRule: {
        compId: [
          { required: true, message: '公司不能为空', trigger: 'change' }
        ],
        returnDate: [
          { required: true, message: '退货日期不能为空', trigger: 'change' }
        ],
        warehouseId: [
          { required: true, message: '仓库不能为空', trigger: 'change' }
        ],
        isNatural: [
          { required: true, message: '必填项', trigger: 'change' },
          { pattern: /^[1-9]\d*$/, message: '大于零的整数', trigger: 'blur' }
        ]
      }
    }
  },
  created () {
    // 公司
    this.$http.get(this.$http.adornUrl('sys/organization/select')).then(({ data }) => { this.compIdOption = data.companyList })
    // 单据状态
    this.$http.get(this.$http.adornUrl('basicData/queryDataDict2List'), { params: { dataDictKey: 'APPROVAL_STATUS' } }).then(({ data }) => { this.dictDocStatusOption = data.fontMaps })
    // 来源店铺
    this.$http.get(this.$http.adornUrl('basic/basicchannel/listcombobox')).then(({ data }) => { this.channelIdOption = data.list })
  },

  methods: {
    init (id, type, parentData) {
      this.visible = true
      this.dataForm.id = id
      this.type = type
      this.dataForm.whReturnSoDetail = []
      this.$nextTick(() => {
        if (type === 'canCheck') {
          this.initCheck(id)
        } else {
          this.initAdd()
        }
      })
      // this.$nextTick(() => {
      //   if (this.dataForm.id) {
      //     this.$http({
      //       url: this.$http.adornUrl(`warehouse/whreturnso/info/${this.dataForm.id}`),
      //       method: 'get',
      //       params: this.$http.adornParams()
      //     }).then(({ data }) => {
      //       if (data && data.code === 0) {
      //         this.compIdChange(data.whReturnSo.compId)
      //         this.dataForm = data.whReturnSo
      //         this.dataForm.whReturnSoDetail = data.whReturnSoDetail
      //       }
      //     })
      //   }
      // })
    },
    initAdd () {
      // 新增
      this.isDisabled = false
      this.isDisabledTaxRate = false
      this.isClick = true
      // // 默认公司
      this.dataForm.compId = sessionStorage.getItem('orgId')
      this.$nextTick(() => {
        this.compIdChange(this.dataForm.compId)
      })
    },
    initCheck (id) {
      this.isDisabled = true
      this.isDisabledTaxRate = true
      this.isClick = false
      this.dataCallInfo(id)
    },
    dataCallInfo (id) {
      this.$http({
        url: this.$http.adornUrl(`warehouse/whreturnso/info/${id}`),
        method: 'get',
        params: this.$http.adornParams()
      }).then(({ data }) => {
        if (data && data.code === 0) {
          this.compIdChange(data.whReturnSo.compId)
          this.dataForm = data.whReturnSo
          this.dataForm.whReturnSoDetail = data.whReturnSoDetail
        }
      })
    },

    // 选择公司触发
    compIdChange (value) {
      this.dataForm.warehouseId = ''
      // 仓库
      this.$http.get(this.$http.adornUrl('list/combobox/warehouse-comp'), {
        params: { compId: value }
      })
        .then(({ data }) => {
          this.warehouseIdOption = data.list
        })
    },

    // 多选
    selectionChangeHandle (val) {
      this.dataListSelections = val
    },

    // 删除=>其他出库明细
    deleteHandle (scope) {
      this.dataForm.whReturnSoDetail.splice(scope.$index, 1)
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
    }
  }
}
</script>
