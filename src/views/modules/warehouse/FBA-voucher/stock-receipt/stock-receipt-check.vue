<template>
  <el-dialog :title="dialogTitle"
             width="90%"
             :close-on-click-modal="false"
             :visible.sync="visible"
             v-if="visible"
             :before-close="handleClose">
    <el-form :model="dataForm"
             :rules="dataRule"
             ref="dataForm"
             label-width="110px">
      <!-- 基本信息 -->
      <el-row>
        <el-col :span="6">
          <el-form-item label="单号"
                        prop="code">
            <el-input v-model="dataForm.code"
                      disabled></el-input>
          </el-form-item>
          <el-form-item label="仓管员"
                        prop="admin">
            <select-seach v-model='dataForm.admin'
                          httpUrl='list/search/user'
                          httpMethod='get'
                          dataLabel='name'
                          dataValue='id'
                          dataSource='list'
                          placeholder='仓管员'
                          :isDisabled='isDisabled'></select-seach>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="入库日期"
                        prop="date">
            <el-date-picker v-model="dataForm.date"
                            type="date"
                            value-format="yyyy-MM-dd"
                            placeholder="选择日期"
                            :disabled='isDisabled'>
            </el-date-picker>
          </el-form-item>
          <el-form-item label="签收仓库"
                        prop="warehouseId">
            <select-all v-model="dataForm.warehouseId"
                        :isDisabled="isDisabled"
                        :listDataOption="warehouseIdOptions"
                        data-value="id"
                        data-label="name"></select-all>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="库存公司"
                        prop="compId">
            <select-all v-model="dataForm.compId"
                        :isDisabled="isDisabled"
                        :listDataOption="compIdOptions"
                        data-value="id"
                        data-label="name"></select-all>
          </el-form-item>
          <el-form-item label="来源店铺"
                        prop="channelId">
            <select-all v-model="dataForm.channelId"
                        :isDisabled="isDisabled"
                        :listDataOption="channelIdOptions"
                        data-value="id"
                        data-label="name"></select-all>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="单据状态"
                        prop="docStatus">
            <el-input v-model="dataForm.docStatus"
                      disabled></el-input>
          </el-form-item>
          <el-form-item label="备注"
                        prop="remark">
            <textarea-all v-model="dataForm.remark"
                          :disabled='isDisabled'></textarea-all>
          </el-form-item>
        </el-col>
      </el-row>
      <div>
        <!-- 调入明细 -->
        <el-table :data="dataForm.transferInDetailList"
                  stripe
                  border
                  highlight-current-row
                  v-loading="dataListLoading"
                  show-summary
                  max-height="450"
                  :summary-method="getSummaries"
                  >
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
          <el-table-column prop="qualifiedQty"
                           label="签收合格数量">
          </el-table-column>
          <el-table-column prop="defectiveQty"
                           label="破损数量">
          </el-table-column>
          <el-table-column label="破损入库状态"
                           prop="defectiveStatusName">
          </el-table-column>
          <el-table-column label="破损入库仓"
                           prop="defectiveWarehouseName">
          </el-table-column>

          <el-table-column label="备注"
                           prop="remark">
          </el-table-column>
          <el-table-column prop="shipmentId"
                           label="货件号"></el-table-column>
        </el-table>
      </div>
    </el-form>
    <span slot="footer"
          class="dialog-footer">
      <el-button @click="cancel('dataForm')"><i class="iconfont erp-icon-quxiao"></i>取消</el-button>
    </span>
  </el-dialog>
</template>

<script>
import selectSeach from '@/components/erp-select/select-seach'
import selectAll from '@/components/erp-select/select-all'

// 引入图片
import tableImg from '@/components/list-table/table-img'
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
      dialogTitle: '',
      channelIdOptions: [],
      defectiveWarehouseIdOptions: [], // 破损入库仓
      defectiveStatusOptions: [], // 破损入库状态
      isDisabled: false, // 查看设置为true
      dataListLoading: false,
      visible: false,
      dataForm: {
        id: '',
        code: '',
        admin: '',
        remark: '',
        date: '',
        warehouseName: '',
        compName: '',
        docStatus: '',
        channelName: '',
        // 调入明细
        transferInDetailList: []
      },
      // 签收仓库
      warehouseIdOptions: [],
      // 库存公司
      compIdOptions: [],
      // 单据状态
      dictDocStatusOptions: [],
      // 仓管员
      adminIdOption: [],

      dataRule: {
      }
    }
  },
  created () {
    this.getDataUrl()
  },
  methods: {
    // 关闭清除本次缓存
    clearCache (formName) {
      this.$nextTick(() => {
        this.$refs[formName].resetFields()
        this.dataForm.transferInDetailList = []
        this.visible = false
      })
    },
    // 弹窗关闭之前
    handleClose (done) {
      this.clearCache('dataForm')
      done()
    },
    // 取消按钮
    cancel (formName) {
      this.clearCache(formName)
      this.visible = false
    },
    getDataUrl () {
      // 库存公司
      this.$http.get(this.$http.adornUrl('list/combobox/company')).then(({ data }) => { this.compIdOptions = data.list })
      // 单据状态
      this.$http.get(this.$http.adornUrl('basicData/queryDataDict2List'), { params: { dataDictKey: 'APPROVAL_STATUS' } }).then(({ data }) => { this.dictDocStatusOptions = data.fontMaps })
      // 签收仓库
      this.$http.get(this.$http.adornUrl('list/combobox/warehouse')).then(({ data }) => { this.warehouseIdOptions = data.list })
      // 仓库库存状态
      this.$http.get(this.$http.adornUrl('basicData/queryDataDict2List'), { params: { dataDictKey: 'WAREHOUSE_INVENTORY_STATUS' } }).then(({ data }) => {
        this.defectiveStatusOptions = data.fontMaps
      })
      // 来源店铺
      this.$http.get(this.$http.adornUrl('basic/basicchannel/listcombobox')).then(({ data }) => { this.channelIdOptions = data.list })
    },
    init (ids, type) {
      // this.getDataUrl()
      this.dataForm.transferInDetailList = []
      this.isDisabled = true
      if (ids && type === 'canCheck') {
        this.dialogTitle = '库存接收单查看'
        this.initCheck(ids)
      }
    },
    initCheck (ids) {
      this.dataCallInfo(ids)
    },
    dataCallInfo (ids) {
        this.dataForm.id = ids
        this.$nextTick(() => {
          if (this.dataForm.id) {
            this.$http({
              url: this.$http.adornUrl(`warehouse/whtransferin/mwsinfo-in/${ids}`),
              method: 'get'
            }).then(({
              data
            }) => {
              if (data && data.code === 0) {
                this.visible = true
                this.dataForm = Object.assign({}, this.dataForm, data.transferIn)
                this.dataForm.transferInDetailList = data.transferInDetail
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
          if (column.property === 'qualifiedQty' || column.property === 'defectiveQty') {
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

