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
                        :listDataOption="symbolOption"
                        :isDisabled="isDisabled"
                        data-value="id"
                        data-label="name"></select-all>
          </el-form-item>
          <el-form-item label='来源类型'
                        prop='source'>
            <select-all v-model="dataForm.source"
                        :listDataOption="sourceOption"
                        :isDisabled="isDisabled"
                        data-value="id"
                        data-label="name"></select-all>
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
                            value-format='yyyy-MM-dd'></el-date-picker>
          </el-form-item>
        </el-col>
        <el-col :span='6'>
          <el-form-item label='单据状态'
                        prop='dictDocStatus'>
            <select-all v-model="dataForm.dictDocStatus"
                        :listDataOption="dictDocStatusOption"
                        :isDisabled="isDisabled"
                        data-value="key"
                        data-label="value"></select-all>
          </el-form-item>
          <el-form-item label='库存公司'
                        prop='compId'>
            <select-all v-model="dataForm.compId"
                        :listDataOption="compIdOption"
                        :isDisabled="isDisabled"
                        data-value="orgId"
                        data-label="name"></select-all>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label='备注'
                        prop='remark'>
            <textarea-all v-model="dataForm.remark"
                          :disabled='isDisabled'></textarea-all>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-table :data='dataForm.docDetail'
                  border
                  stripe
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
                          :listDataOption="warehouseIdOption"
                          :isDisabled="isDisabled"
                          data-value="id"
                          data-label="name"
                          placeholder="仓库"></select-all>
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
                          :listDataOption="dictInventoryStatusOption"
                          :isDisabled="isDisabled"
                          data-value="key"
                          data-label="value"
                          placeholder="库存状态"></select-all>
            </template>
          </el-table-column>
          <el-table-column prop='remark'
                           label='备注'>
            <template slot-scope='scope'>
              <textarea-all v-model="scope.row.remark"
                            :disabled='isDisabled'></textarea-all>
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
// 备注组件
import textareaAll from '@/components/erp-input/textarea-all'
export default {
  components: {
    selectSeach,
    selectAll,
    tableImg,
    textareaAll
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
    this.$http.get(this.$http.adornUrl('basicData/queryDataDict2List'), { params: { dataDictKey: 'APPROVAL_STATUS' } }).then(({ data }) => { this.dictDocStatusOption = data.fontMaps })
    this.$http.get(this.$http.adornUrl('basicData/queryDataDict2List'), { params: { dataDictKey: 'WAREHOUSE_INVENTORY_STATUS' } }).then(({ data }) => { this.dictInventoryStatusOption = data.fontMaps })
  },
  methods: {
    init (id, type, parentData) {
      this.visible = true
      this.dataForm.id = id
      // this.$nextTick(() => {
      //   if (type === 'isDisabled') {
      //     this.isDisabled = true
      //     this.isClick = false
      //   } else {
      //     // 新增
      //     this.isDisabled = false
      //     this.isClick = true
      //     this.dataForm.userId = ''
      //     // 默认公司
      //     this.dataForm.compId = sessionStorage.getItem('orgId')
      //     this.$nextTick(() => {
      //       this.compIdChange(this.dataForm.compId)
      //     })
      //   }
      // })
      this.add(id, type)
      this.editorCheck(id, type)
      if (this.dataForm.id) {
        if (id) {
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
        }
      }
    },
    // 新增
    add (id, type) {
      if (!id) {
        // 新增
        this.isDisabled = false
        this.isClick = true
        this.dataForm.userId = ''
        // 默认公司
        this.dataForm.compId = sessionStorage.getItem('orgId')
        this.$nextTick(() => {
          this.compIdChange(this.dataForm.compId)
        })
      }
    },
    // 编辑或者查看
    editorCheck (id, type) {
      // 查看
      if (id && type === 'isDisabled') {
        this.isDisabled = true
        this.isClick = false
        return
      }
      // 编辑
      if (id && !type) {
        this.isDisabled = false
        this.isClick = true
      }
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
