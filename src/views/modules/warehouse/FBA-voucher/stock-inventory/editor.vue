<template>
  <el-dialog :title="dialogTitle"
             :close-on-click-modal="false"
             :visible.sync="visible"
             width="90%">
    <!-- 表单 -->
    <el-form :model="dataForm"
             ref="dataForm"
             label-width="110px"
             :disabled="formDisabled">
      <el-row>
        <el-col :span="6">
          <el-form-item label="调出单号"
                        prop="code">
            <el-input v-model="dataForm.code"
                      placeholder="未生成"
                      disabled></el-input>
          </el-form-item>
          <el-form-item label="调出日期"
                        prop="date">
            <el-date-picker v-model="dataForm.date"
                            type="date"
                            value-format="yyyy-MM-dd"
                            default-time
                            placeholder="选择日期"></el-date-picker>
          </el-form-item>
          <el-form-item label="来源店铺"
                        prop="channelId">
            <select-all v-model="dataForm.channelId"
                        :isDisabled="true"
                        :listDataOption="channelIdOption"
                        data-value="id"
                        data-label="name"></select-all>
          </el-form-item>

        </el-col>
        <el-col :span="6">
          <el-form-item label="库存公司"
                        prop="compId">
            <select-all v-model="dataForm.compId"
                        :listDataOption="compIdOptions"
                        data-value="id"
                        data-label="name"
                        placeholder="请选择库存公司"></select-all>
          </el-form-item>
          <el-form-item label="调出仓库"
                        prop="fromWarehouseId">
            <el-select v-model="dataForm.fromWarehouseId"
                       placeholder="请选择调出仓库">
              <el-option v-for="item in fromWarehouseIdOptions"
                         :key="item.id"
                         :label="item.name"
                         :value="item.id"
                         :disabled="item.disabled"></el-option>
            </el-select>
          </el-form-item>

        </el-col>
        <el-col :span="6">

          <el-form-item label="仓管员"
                        prop="adminId">
            <select-seach v-model="dataForm.adminId"
                          httpUrl="list/search/user"
                          httpMethod="get"
                          data-label="name"
                          data-value="id"
                          data-source="list"
                          :listDataOptionStatic="adminIdOption"></select-seach>
          </el-form-item>
          <el-form-item label="调入仓库"
                        prop="toWarehouseId">
            <el-select v-model="dataForm.toWarehouseId"
                       placeholder="请选择调入仓库">
              <el-option v-for="item in toWarehouseIdOptions"
                         :key="item.id"
                         :label="item.name"
                         :value="item.id"
                         :disabled="item.disabled"></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="单据状态"
                        prop="dictDocStatus">
            <select-all v-model="dataForm.dictDocStatus"
                        :listDataOption="dictDocStatusOption"
                        :isDisabled="true"
                        data-value="key"
                        data-label="value"
                        placeholder="单据状态"></select-all>
          </el-form-item>
          <el-form-item label="备注"
                        prop="remark">
            <textarea-all v-model="dataForm.remark"></textarea-all>
          </el-form-item>
        </el-col>
      </el-row>
      <div>
        <!-- 表格 -->
        <el-table :data="dataForm.transferOutDetailsList"
                  stripe
                  border
                  show-summary
                  :summary-method="getSummaries"
                  max-height="450"
                  highlight-current-row
                  v-loading="dataListLoading">
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
          <el-table-column prop="dictFromInventoryStatus"
                           label="调出仓库存状态">
            <template slot-scope="scope">
              <select-all v-model="scope.row.dictFromInventoryStatus"
                          :listDataOption="dictInventoryStatusOption"
                          :isDisabled="true"
                          data-value="key"
                          data-label="value"
                          placeholder="调出仓库存状态"></select-all>
            </template>
          </el-table-column>
          <el-table-column prop="qty"
                           label="调出数量"></el-table-column>
          <el-table-column prop="dictToInventoryStatus"
                           label="调入仓库存状态">
            <template slot-scope="scope">
              <select-all v-model="scope.row.dictToInventoryStatus"
                          :listDataOption="dictToInventoryStatusOption"
                          :isDisabled="true"
                          data-value="key"
                          data-label="value"
                          placeholder="调入仓库存状态"></select-all>
            </template>
          </el-table-column>
          <el-table-column prop="remark"
                           label="备注">
            <template slot-scope="scope">
              <el-input v-model="scope.row.remark"
                        placeholder
                        :disabled="isDisabled"></el-input>
            </template>
          </el-table-column>
          <el-table-column prop="sourceCode"
                           label="源单号"></el-table-column>
          <el-table-column prop="trackingNumber"
                           label="货件号"></el-table-column>
          <!-- 操作列 -->
          <el-table-column fixed="right"
                           width="80"
                           label="操作">
            <template slot-scope="scope">
              <el-button type="danger"
                         size="small"
                         circle
                         @click="deleteHandle(scope.$index)"
                         :disabled="isDisabled">
                <i class="iconfont erp-icon-shanchu"></i>
              </el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </el-form>
    <span slot="footer"
          class="dialog-footer">
      <el-button @click="visible = false"><i class="iconfont erp-icon-quxiao"></i>取消</el-button>
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
      isDisabled: false, // 查看设置为true
      dialogTitle: '', // dialog标题
      formDisabled: true, // 查看时设置为true
      dataListLoading: false,
      addProdVisible: false,
      visible: false,
      dataForm: {
      },
      // 库存公司
      compIdOptions: [],
      // 调出仓库
      fromWarehouseIdOptions: [],
      // 调入仓库
      toWarehouseIdOptions: [],
      // 单据状态
      dictDocStatusOption: [],
      // 调入仓库存状态
      dictToInventoryStatusOption: [],
      // 调出仓库存状态
      dictInventoryStatusOption: [],
      // 来源店铺
      channelIdOption: [],
      // 仓管员
      adminIdOption: [],
      // // 要货店铺下拉
      channelIdOptions: []
    }
  },
  created () {
    this.getDataUrl()
  },
  methods: {
    // 关闭清除本次缓存
    clearCache (formName) {
      this.$nextTick(() => {
        this.dataForm.transferOutDetailsList = []
      })
    },
    // 取消按钮
    cancel (formName) {
      this.clearCache(formName)
    },
    // 删除调出明细
    deleteHandle (index) {
      this.dataForm.transferOutDetailsList.splice(index, 1)
    },
    getDataUrl () {
      // 单据状态
      this.$http.get(this.$http.adornUrl('basicData/queryDataDict2List'), { params: { dataDictKey: 'APPROVAL_STATUS' } }).then(({ data }) => {
        this.dictDocStatusOption = data.fontMaps
      })
      // 库存公司
      this.$http.get(this.$http.adornUrl('list/combobox/company')).then(({ data }) => {
        this.compIdOptions = data.list
      })
      // 仓库库存状态
      this.$http.get(this.$http.adornUrl('basicData/queryDataDict2List'), { params: { dataDictKey: 'WAREHOUSE_INVENTORY_STATUS' } }).then(({ data }) => {
        this.dictInventoryStatusOption = data.fontMaps
        this.dictToInventoryStatusOption = data.fontMaps
      })
      //   要货平台下的店铺
      this.$http.get(this.$http.adornUrl('basic/basicchannel/listcombobox'), { params: { platformType: '' } }).then(({ data }) => {
        this.channelIdOptions = data.list
      })
      // 仓库
      this.$http.get(this.$http.adornUrl('list/combobox/warehouse')).then(({ data }) => {
        this.toWarehouseIdOptions = data.list
        this.fromWarehouseIdOptions = data.list
      })
      // 来源店铺
      this.$http.get(this.$http.adornUrl('basic/basicchannel/listcombobox')).then(({ data }) => {
        this.channelIdOption = data.list
      })
    },
    init (id, type) {
      // this.getDataUrl()
      this.dataForm.id = id
      this.dataForm.transferOutDetailsList = []
      this.isDisabled = false
      this.visible = true
      this.$nextTick(() => {
        if (id && type === 'canCheck') {
          this.dialogTitle = '库存调出单查看'
          this.initCheck(id)
        }
      })
    },
    initCheck (id) {
      this.dataCallInfo(id)
    },
    dataCallInfo (id) {
      this.$http({
        url: this.$http.adornUrl(`warehouse/whtransferout/info/${id}`),
        method: 'get',
        params: this.$http.adornParams({
          id: id
        })
      }).then(({ data }) => {
        if (data && data.code === 0) {
          this.dataForm = data.transferPackingInfo.whTransferOutEntity
          // 需要对调出详情添加部分字段
          let arr = data.transferPackingInfo.whTransferOutDetailList
          this.dataForm.transferOutDetailsList = arr
        } else {
          this.$notify.error({
            title: '错误',
            message: data.msg,
            duration: 5000
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
    value: {
      handler (val, oldVal) {
        this.dataForm = this.value
        this.$emit('change', this.dataForm)
      },
      deep: true
    },
    dataForm: {
      handler (val, oldVal) {
        this.$emit('input', this.dataForm)
      },
      deep: true
    }
  }
}
</script>

