<template>
  <el-dialog :title="dialogTitle"
             :close-on-click-modal="false"
             :visible.sync="visible"
             @close="$refs['dataForm'].resetFields()"
             width="90%">
    <!-- 装箱清单表单 -->
    <el-form :model="dataForm"
             :rules="dataRule"
             ref="dataForm"
             label-width="110px"
             :disabled="formDisabled">
      <el-row>
        <el-col :span="6">
          <el-form-item label="单据编号"
                        prop="code">
            <el-input v-model="dataForm.code"
                      placeholder
                      disabled></el-input>
          </el-form-item>
          <el-form-item label="装箱员"
                        prop="packingUserId">
            <select-seach v-model="dataForm.packingUserId"
                          httpUrl="list/search/user"
                          httpMethod="get"
                          data-label="name"
                          data-value="id"
                          :isDisabled="isDisabled"
                          data-source="list"
                          placeholder="未生成"
                          :listDataOptionStatic="packingUserIdOption"></select-seach>
          </el-form-item>
          <el-form-item label="装箱日期"
                        prop="packingDate">
            <el-date-picker v-model="dataForm.packingDate"
                            type="date"
                            :disabled="isDisabled"
                            value-format="yyyy-MM-dd"
                            default-time
                            placeholder="选择日期"></el-date-picker>
          </el-form-item>

        </el-col>
        <el-col :span="6">
          <el-form-item label="物流承运商"
                        prop="shipperId">
            <select-all v-model="dataForm.shipperId"
                        :listDataOption="shipperIdOptions"
                        :isDisabled="true"
                        data-value="key"
                        data-label="value"></select-all>
          </el-form-item>
          <el-form-item label="物流跟踪号"
                        prop="trackingNo">
            <el-input v-model="dataForm.trackingNo"
                      :disabled="isDisabled"></el-input>
          </el-form-item>

          <el-form-item label="FBAShipmentID"
                        prop="fbaShipmentId">
            <div class="form-item-row">
              <select-all v-model="dataForm.fbaShipmentId"
                          :listDataOption="fbaShipmentIdOptions"
                          data-value="key"
                          data-label="value"
                          :isDisabled="isDisabled"></select-all>
              <question-icon :messages="messages"></question-icon>
            </div>
          </el-form-item>

        </el-col>
        <el-col :span="6">
          <el-form-item label="物流方式"
                        prop="dictExpectTransit">
            <select-all v-model="dataForm.dictExpectTransit"
                        :listDataOption="dictExpectTransitOptions"
                        :isDisabled="true"
                        data-value="key"
                        data-label="value"></select-all>
          </el-form-item>
          <el-form-item label="预计到达时间"
                        prop="shipArriveDate">
            <el-date-picker v-model="dataForm.shipArriveDate"
                            type="date"
                            value-format="yyyy-MM-dd"
                            :disabled="isDisabled"
                            placeholder="选择日期"></el-date-picker>
          </el-form-item>
          <el-form-item label="要货计划单号"
                        prop="planCode">
            <el-input v-model="dataForm.planCode"
                      :disabled="true"></el-input>
          </el-form-item>

        </el-col>
        <el-col :span="6">
          <el-form-item label="要货店铺"
                        prop="channelId">
            <select-seach v-model="dataForm.channelId"
                          httpUrl="basic/basicchannel/listcombobox"
                          httpMethod="get"
                          data-label="name"
                          data-value="id"
                          data-source="list"
                          :isDisabled="true"
                          placeholder></select-seach>
          </el-form-item>
          <el-form-item label="单据状态"
                        prop="dictDocStatus">
            <select-all v-model="dataForm.dictDocStatus"
                        :isDisabled="true"
                        :listDataOption="dictDocStatusOption"
                        data-value="key"
                        data-label="value"></select-all>
          </el-form-item>
          <el-form-item prop="remarks"
                        label="备注"
                        width="100">
            <textarea-all v-model="dataForm.remarks"
                          :disabled="isDisabled"></textarea-all>
          </el-form-item>
        </el-col>
      </el-row>

      <!-- 装箱明细 -->
      <el-table :data="dataForm.whPackingDetailList"
                stripe
                border
                highlight-current-row
                v-loading="dataListLoading"
                max-height="400"
                show-summary
                :summary-method="getSummaries">
        <el-table-column prop="cartonNo"
                         label="起始箱号">
          <template slot-scope="scope">
            <el-input v-model="scope.row.cartonNo"
                      placeholder
                      :disabled="isDisabled"
                      type="Number"
                      @mousewheel.native.prevent></el-input>
          </template>
        </el-table-column>
        <el-table-column prop="cartonCount"
                         label="箱数"></el-table-column>
        <el-table-column prop="prodCode"
                         label="产品编码"></el-table-column>
        <el-table-column prop="prodName"
                         label="产品名称"></el-table-column>
        <el-table-column prop="channelSku"
                         label="渠道SKU"></el-table-column>
        <el-table-column prop="fnsku"
                         label="FNSKU"></el-table-column>
        <el-table-column prop="dictProductPropertiesName"
                         label="产品属性">
        </el-table-column>
        <el-table-column prop="qty"
                         label="Quantity(PCS)/数量（PCS）"
                         :render-header="renderheader">
          <template slot-scope="scope">
            <div>
              <p>{{scope.row.qty}}</p>
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="grossHeight"
                         label="G.W(KG)/毛重(KG)"
                         :render-header="renderheader">
          <template slot-scope="scope">
            <el-form-item :prop="'whPackingDetailList[' + scope.$index + '].grossHeight'"
                          :rules="dataRule.grossHeight"
                          label-width="0px">
              <el-input v-model="scope.row.grossHeight"
                        :disabled="isDisabled"
                        type="Number"
                        @mousewheel.native.prevent></el-input>
            </el-form-item>
          </template>
        </el-table-column>
        <el-table-column prop="cartonSize"
                         label="Size of Ctns(cm)/箱子尺寸(cm)"
                         :render-header="renderheader">
          <template slot-scope="scope">
            <div>
              <p>{{scope.row.cartonSize}}</p>
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="remark"
                         label="备注">
          <template slot-scope="scope">
            <textarea-all v-model="scope.row.remark"
                          :disabled="isDisabled"></textarea-all>
          </template>
        </el-table-column>
      </el-table>
    </el-form>
    <span slot="footer"
          class="dialog-footer">
      <el-button @click="visible=false"><i class="iconfont erp-icon-quxiao"></i>取消</el-button>
      <el-button type="primary"
                 @click="save()"
                 v-if="!isDisabled"><i class="iconfont erp-icon-baocun"></i>保存</el-button>
    </span>
  </el-dialog>
</template>

<script>
import selectSeach from '@/components/erp-select/select-seach'
import selectAll from '@/components/erp-select/select-all'
import { isNumber } from '@/utils/validate.js'
// 备注
import textareaAll from '@/components/erp-input/textarea-all.vue'
export default {
  components: {
    selectSeach,
    selectAll,
    textareaAll
  },
  data () {
    var validQty = (rule, value, callback) => {
      if (!/^([0-9]\d*(.\d*[0-9])?)|(0.\d*[0-9])$/.test(value) && value != null) {
        callback(new Error('大于或等于0的数'))
      } else {
        callback()
      }
    }
    return {
      dialogTitle: '',
      visible: false,
      isShowFromDel: true, // 从要货计划下来的去掉操作列
      isDisabled: false, // 查看设置为true
      formDisabled: false, // 查看时设置为true
      dataListLoading: false,
      addProdVisible: false,
      isClick: false,
      dictProductPropertiesOption: [], // 产品属性
      messages: '若下拉无数据，请到FBAShipment列表进行手动下载FBAShipmentID数据。',
      // 单据状态
      dictDocStatusOption: [],
      dataForm: {
        id: '',
        channelId: '',
        // 装箱清单
        whPackingDetailList: []
      },
      // 物流承运商
      shipperIdOptions: [],
      // 物流方式
      dictExpectTransitOptions: [],
      // FBAShipmentID
      fbaShipmentIdOptions: [],
      // 装箱员
      packingUserIdOption: [],
      type: '',
      dataRule: {
        grossHeight: [
          { required: false, message: '大于或等于0的数', trigger: 'change' },
          { validator: validQty, trigger: 'blur' }
        ]
      }
    }
  },
  created () {
    this.getDataUrl()
  },
  methods: {
    init (id, type) {
      this.dataForm.id = id
      this.type = type
      this.dataForm.whPackingDetailList = []
      this.formDisabled = false
      this.isDisabled = false
      this.isShowFromDel = false // 目前该操作按钮都要求去掉
      this.visible = true

      this.$nextTick(() => {
        if (type === 'canEdit' && this.dataForm.id) {
          this.dialogTitle = '装箱清单编辑'
          this.initEdit(id)
        }
        if (type === 'canCheck' && this.dataForm.id) {
          this.dialogTitle = '装箱清单查看'

          this.initCheck(id)
        }
      })
    },
    initEdit (id) {
      this.dataCall(id)
    },
    initCheck (id) {
      this.isDisabled = true
      this.dataCall(id)
    },
    dataCall (id) {
      this.$http({
        url: this.$http.adornUrl(`warehouse/whpacking/info/${id}`),
        method: 'get'
      }).then(({ data }) => {
        if (data && data.code === 0) {
          this.dataForm = data.whPackingDto
          this.getFBAshipmentId(this.dataForm.channelId)
          for (let i = 0; i < this.dataForm.whPackingDetailList.length; i++) {
            if (this.dataForm.whPackingDetailList[i].dictProductProperties) {
              this.dataForm.whPackingDetailList[i].dictProductProperties = this.dataForm.whPackingDetailList[i].dictProductProperties.split(',')
            }
          }
        } else {
          this.$notify.error({
            title: '错误',
            message: data.msg,
            duration: 3000
          })
        }
      })
    },
    // 统计数量
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
          // 这里写自定义逻辑
          if (column.property === 'qty') {
            sums[index] = sums[index]
          } else {
            sums[index] = ''
          }
        } else {
          sums[index] = ''
        }
      })

      return sums
    },
    // 处理表格标题分行显示
    renderheader (h, { column, $index }) {
      return h('span', {}, [
        h('span', {}, column.label.split('/')[0]),
        h('br'),
        h('span', {}, column.label.split('/')[1])
      ])
    },
    // 删除装箱清单
    deleteHandle (index) {
      this.dataForm.whPackingDetailList.splice(index, 1)
    },
    getDataUrl () {
      // 物流方式
      this.$http.get(this.$http.adornUrl('basicData/queryDataDict2List'), { params: { dataDictKey: 'TRANSPORT_MODE' } }).then(({ data }) => {
        this.dictExpectTransitOptions = data.fontMaps
      })
      // 产品属性
      this.$http.get(this.$http.adornUrl('basicData/queryDataDict2List'), { params: { dataDictKey: 'PRODUCT_PROPERTIES' } }).then(({ data }) => {
        this.dictProductPropertiesOption = data.fontMaps
      })
      // 单据状态
      this.$http.get(this.$http.adornUrl('basicData/queryDataDict2List'), { params: { dataDictKey: 'APPROVAL_STATUS' } }).then(({ data }) => {
        this.dictDocStatusOption = data.fontMaps
      })
    },
    getFBAshipmentId (channelId) {
      this.$http({
        url: this.$http.adornUrl(`warehouse/whpacking/queryfba`),
        method: 'get',
        params: {
          id: channelId
        }
      }).then(({ data }) => {
        if (data && data.code === 0) {
          this.fbaShipmentIdOptions = data.list
        }
      })
    },

    save: _.debounce(
      async function save () {
        this.$refs['dataForm'].validate(valid => {
          if (valid) {
            // 保存时将产品属性数组转化成字符串
            for (let i = 0; i < this.dataForm.whPackingDetailList.length; i++) {
              if (this.dataForm.whPackingDetailList[i].dictProductProperties) {
                this.dataForm.whPackingDetailList[
                  i
                ].dictProductProperties = this.dataForm.whPackingDetailList[
                  i
                ].dictProductProperties.join(',')
              }
            }
            this.$http({
              url: this.$http.adornUrl('warehouse/whpacking/update'),
              method: 'put',
              data: this.dataForm
            }).then(({ data }) => {
              if (data && data.code === 0) {
                this.$emit('refreshDataList')
                this.visible = false
                this.$notify({
                  type: 'success',
                  title: '提示',
                  message: '保存成功',
                  duration: 3000
                })
              } else {
                this.$notify.error({
                  title: '错误',
                  message: data.msg,
                  duration: 3000
                })
              }
            })
          }
        })
      }, 1000, {
        leading: true,
        trailing: false
      }
    )
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
