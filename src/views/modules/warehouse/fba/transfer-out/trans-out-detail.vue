<template>
  <div>
    <!-- 表单 -->
    <el-form :model="dataForm"
             :rules="dataRule"
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
          <el-form-item label="备注"
                        prop="remark">
            <textarea-all v-model="dataForm.remark"></textarea-all>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="库存公司"
                        prop="compId">
            <select-all v-model="dataForm.compId"
                        :listDataOption="compIdOptions"
                        :isDisabled="isDisabledFromDel"
                        data-value="id"
                        data-label="name"
                        :isSelectChange="true"
                        @selectChange="compNameChange"
                        placeholder="请选择库存公司"></select-all>
          </el-form-item>
          <el-form-item label="调出仓库"
                        prop="fromWarehouseId">
            <el-select v-model="dataForm.fromWarehouseId"
                       placeholder="请选择调出仓库"
                       @change="fromWarehouseChange">
              <el-option v-for="item in fromWarehouseIdOptions"
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
          <el-form-item label="调入仓库"
                        prop="toWarehouseId">
            <el-select v-model="dataForm.toWarehouseId"
                       placeholder="请选择调入仓库"
                       @change="toWarehouseChange">
              <el-option v-for="item in toWarehouseIdOptions"
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
                          placeholder="搜索"
                          :listDataOptionStatic="adminIdOption"></select-seach>
          </el-form-item>
          <el-form-item label="店铺"
                        prop="channelId">
            <select-all v-model="dataForm.channelId"
                        :listDataOption="channelIdOptions"
                        :isDisabled="true"
                        data-value="id"
                        data-label="name"
                        placeholder="选择店铺"></select-all>
          </el-form-item>
        </el-col>
      </el-row>
      <!-- 调出明细 -->
      <div>
        <!-- 表格 -->
        <el-table :data="dataForm.transferOutDetailsList"
                  border
                  v-loading="dataListLoading">
          <el-table-column prop="imageUrl"
                           header-align="center"
                           align="center"
                           label="产品图片"
                           width="120">
            <template slot-scope="scope">
              <tableImg :imageUrl='scope.row.imageUrl'></tableImg>
            </template>
          </el-table-column>
          <el-table-column prop="prodCode"
                           header-align="center"
                           align="center"
                           label="产品编码"></el-table-column>
          <el-table-column prop="prodName"
                           header-align="center"
                           align="center"
                           label="产品名称"></el-table-column>
          <el-table-column prop="dictFromInventoryStatus"
                           header-align="center"
                           align="center"
                           label="调出仓库存状态"
                           width="120">
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
                           header-align="center"
                           align="center"
                           label="调出数量"
                           width="100">
            <template slot-scope="scope">
              <el-form-item :prop="'transferOutDetailsList[' + scope.$index + '].qty'"
                            :rules="dataRule.qty"
                            label-width="0px">
                <el-input v-model="scope.row.qty"
                          type="Number"
                          @mousewheel.native.prevent
                          placeholder="调出数量"></el-input>
              </el-form-item>
            </template>
          </el-table-column>
          <el-table-column prop="outboxQty"
                           header-align="center"
                           align="center"
                           label="单箱数量"
                           width="100">
            <template slot-scope="scope">
              <el-form-item :prop="'transferOutDetailsList[' + scope.$index + '].outboxQty'"
                            :rules="dataRule.outboxQty"
                            label-width="0px">
                <el-input v-model="scope.row.outboxQty"
                          type="Number"
                          @mousewheel.native.prevent
                          placeholder="单箱数量"></el-input>
              </el-form-item>
            </template>
          </el-table-column>
          <el-table-column prop="boxQty"
                           header-align="center"
                           align="center"
                           label="箱数"
                           width="100">
            <template slot-scope="scope">
              <el-input v-model="scope.row.boxQty"
                        value="number"
                        placeholder="自动计算"
                        disabled></el-input>
            </template>
          </el-table-column>
          <el-table-column prop="outboxWeight"
                           header-align="center"
                           align="center"
                           label="单箱重量(kg)"
                           width="100">
            <template slot-scope="scope">
              <el-input v-model="scope.row.outboxWeight"
                        type="Number"
                        @mousewheel.native.prevent
                        placeholder
                        :disabled="isDisabled"></el-input>
            </template>
          </el-table-column>
          <el-table-column prop="outboxSize"
                           header-align="center"
                           align="center"
                           label="单箱体积(cm³)"
                           width="120">
            <template slot-scope="scope">
              <el-input v-model="scope.row.outboxSize"
                        type="Number"
                        @mousewheel.native.prevent
                        placeholder
                        :disabled="isDisabled"></el-input>
            </template>
          </el-table-column>
          <el-table-column prop="dictToInventoryStatus"
                           header-align="center"
                           align="center"
                           label="调入仓库存状态"
                           width="120">
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
                           header-align="center"
                           align="center"
                           label="备注"
                           width="100">
            <template slot-scope="scope">
              <el-input v-model="scope.row.remark"
                        placeholder
                        :autosize="{minRows: 1, maxRows: 3}"
                        :disabled="isDisabled"></el-input>
            </template>
          </el-table-column>
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
    </el-form>
  </div>
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
    var validateInteger = (rule, value, callback) => {
      let index = Number(rule.field.indexOf('['))
      let rowIndexValue = Number(rule.field[index + 1])
      let row = this.dataForm.transferOutDetailsList[rowIndexValue]
      if (Number(value) === 0) {
        row.boxQty = ''
      }
      if (!/^[1-9]\d*$/.test(value) && value != null) {
        callback(new Error('请输入正整数'))
        return
      } else if (Number(row.qty) > Number(row.qtyDefault)) {
        this.$notify.error({
          title: '错误',
          message: `调出数量不能大于${row.qtyDefault}`,
          duration: 2000
        })
        // callback(new Error(`调出数量不能大于${row.qtyDefault}`))
        return
      } else if (Number(row.outboxQty) !== 0) {
        row.boxQty = Math.ceil(Number(row.qty) / Number(row.outboxQty))
      }
      callback()
    }
    return {
      isDisabledFromDel: false, // 控制从要货计划下来的部分下拉是否可选
      isDisabledAdd: false, // 新增按钮控制
      isDisabled: false, // 查看设置为true
      dialogTitle: '', // dialog标题
      formDisabled: false, // 查看时设置为true
      dataListLoading: false,
      addProdVisible: false,
      dataForm: {
        sourceType: '01', // 02表示库存调拨的新增，01表示上游要货计划的调拨出库
        id: '',
        code: '',
        date: '',
        remark: '',
        compId: '',
        fromWarehouseId: '',
        toWarehouseId: '',
        dictDocStatus: '01', // 单据状态，新增：01
        adminId: '',
        channelId: '',
        dictTransferOutType: '02', // 业务类型，01：海外仓，02：FBA仓
        dictFromInventoryStatus: '', // 调出仓库存状态
        dictToInventoryStatus: '', // 调入仓库存状态
        // 调出明细
        transferOutDetailsList: []
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
      // 仓管员
      adminIdOption: [],
      // // 要货店铺下拉
      channelIdOptions: [],
      // // 期望物流方式
      // dictExpectTransitOptions: [],
      // // 销售员
      // // sellerIdOptions: [],
      // // 要货平台
      // dictNeedPlatformOptions: [],
      // // 确认物流方式
      // dictConfirmTransitOptions: [],
      // // 物流承运商
      // shipperIdOptions: [],
      dataRule: {
        compId: [{
          required: true,
          message: '请选择库存公司',
          trigger: 'change'
        }],
        date: [{
          required: true,
          message: '调出日期必填',
          trigger: 'change'
        }],
        fromWarehouseId: [{
          required: true,
          message: '调出仓库',
          trigger: 'change'
        }],
        //   toWarehouseId: [{
        //     required: true,
        //     message: '调入仓库',
        //     trigger: 'change'
        //   }],
        qty: [{
          required: true,
          message: '必填项',
          trigger: 'blur'
        },
        {
          validator: validateInteger,
          trigger: 'blur'
        }
        ],
        outboxQty: [{
          required: true,
          message: '必填项',
          trigger: 'blur'
        },
        {
          validator: validateInteger,
          trigger: 'blur'
        }
        ]
      }
    }
  },
  methods: {
    // 调出仓库改变
    fromWarehouseChange (value) {
      this.toWarehouseIdOptions.forEach(item => {
        item.id === value || item.id === this.dataForm.toWarehouseId
          ? (item.disabled = true)
          : (item.disabled = false)
      })
    },
    // 调入仓库改变
    toWarehouseChange (value) {
      this.fromWarehouseIdOptions.forEach(item => {
        item.id === value || item.id === this.dataForm.fromWarehouseId
          ? (item.disabled = true)
          : (item.disabled = false)
      })
    },
    // 选择公司触发
    compNameChange (value, type) {
      if (type) {
        this.$http
          .get(this.$http.adornUrl('list/combobox/warehouse-comp'), {
            params: {
              compId: value
            }
          })
          .then(({
            data
          }) => {
            this.fromWarehouseIdOptions = data.list
            this.toWarehouseIdOptions = data.list
            //   初始化
            this.toWarehouseChange(this.dataForm.toWarehouseId)// 控制调出仓库和调入仓库不一样
          })
      } else {
        this.dataForm.fromWarehouseId = ''
        this.dataForm.toWarehouseId = ''
        this.$http
          .get(this.$http.adornUrl('list/combobox/warehouse-comp'), {
            params: {
              compId: value
            }
          })
          .then(({
            data
          }) => {
            this.fromWarehouseIdOptions = data.list
            this.toWarehouseIdOptions = data.list
          })
      }
    },
    // 关闭清除本次缓存
    clearCache (formName) {
      this.$nextTick(() => {
        this.$refs[formName].resetFields()
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
      this.$http
        .get(this.$http.adornUrl('basicData/queryDataDict2List'), {
          params: {
            dataDictKey: 'APPROVAL_STATUS'
          }
        })
        .then(({
          data
        }) => {
          this.dictDocStatusOption = data.fontMaps
        })
      // 库存公司
      this.$http
        .get(this.$http.adornUrl('list/combobox/company'))
        .then(({
          data
        }) => {
          this.compIdOptions = data.list
        })
      // 仓库库存状态
      this.$http
        .get(this.$http.adornUrl('basicData/queryDataDict2List'), {
          params: {
            dataDictKey: 'WAREHOUSE_INVENTORY_STATUS'
          }
        })
        .then(({
          data
        }) => {
          this.dictInventoryStatusOption = data.fontMaps
          this.dictToInventoryStatusOption = data.fontMaps
        })
      //   要货平台下的店铺
      this.$http
        .get(this.$http.adornUrl('basic/basicchannel/listcombobox'), {
          params: { platformType: '' }
        })
        .then(({ data }) => {
          this.channelIdOptions = data.list
        })
    },
    init (id, dataForm, name) {
      this.getDataUrl()
      this.dataForm.id = id
      this.dataForm.transferOutDetailsList = []
      this.formDisabled = false
      this.isDisabled = false
      this.isDisabledAdd = false

      // 查看操作
      if (id && name === 'check') {
        this.formDisabled = true
        this.isDisabled = true
        this.isDisabledAdd = true
      }
      // 如果name存在，则说明是从要货计划操作里面的调拨出库传过来的
      if (id && name == 'delivery') {
        this.isDisabledAdd = true
        this.isDisabledFromDel = true
        this.$nextTick(() => {
          this.$http({
            url: this.$http.adornUrl(
              `warehouse/whdeliveryplan/transfer-out/${id}`
            ),
            method: 'get'
          }).then(({
            data
          }) => {
            if (data && data.code === 0) {
              this.dataForm.id = '' // 新增这里传空
              this.dataForm.sourceType = '01' // 01表示上游要货计划的库存调拨
              this.dataForm.deliveryPlanId = id
              this.dataForm = Object.assign({}, this.dataForm, data.transferout)
              if (this.dataForm.compId) {
                this.compNameChange(this.dataForm.compId, id)
              }

              // 需要对调出明细添加部分字段
              let arr = data.transferoutDetail
              arr.forEach(element => {
                this.$set(element, 'outboxQty', element.unitQty) // 单箱数量
                this.$set(element, 'outboxWeight', element.weight) // 单箱重量
                this.$set(element, 'outboxSize', element.outboxSize) // 单箱体积
                this.$set(element, 'qty', element.confirmQty) // 调出数量
                this.$set(element, 'qtyDefault', element.confirmQty) // 默认调出数量
                this.$set(element, 'boxQty', element.unitQty ? Math.ceil(Number(element.confirmQty) /
                  Number(element.unitQty)) : '') // 默认箱数
                this.$set(element, 'dictFromInventoryStatus', '03') // 调出仓库存状态03冻结
                this.$set(element, 'dictToInventoryStatus', '05') // 调入仓库存状态05在途
              })
              this.dataForm.transferOutDetailsList = arr
            } else {
              this.$notify.error({
                title: '错误',
                message: data.msg,
                duration: 5000
              })
            }
          })
        })
      } else if (id) {
        this.$nextTick(() => {
          this.$refs['dataForm'].resetFields()
          if (this.dataForm.id) {
            this.$http({
              url: this.$http.adornUrl(`warehouse/whtransferout/info/${id}`),
              method: 'get',
              params: this.$http.adornParams({
                id: id
              })
            }).then(({
              data
            }) => {
              if (data && data.code === 0) {
                this.dataForm = data.transferPackingInfo.whTransferOutEntity
                this.compNameChange(this.dataForm.compId, id)
                // 这里拿到数据后判断下sourceType是'01'
                if (data.transferPackingInfo.whTransferOutEntity.sourceType === '01') {
                  this.isDisabledAdd = true // 新增按钮不显示
                  this.isDisabledFromDel = true // 从要货下来的这几个下拉不能改变
                }
                // 需要对调出详情添加部分字段
                let arr = data.transferPackingInfo.whTransferOutDetailList
                arr.forEach(element => {
                  this.$set(element, 'outboxQty', element.unitQty) // 单箱数量
                  this.$set(element, 'outboxWeight', element.weight) // 单箱重量
                  this.$set(element, 'outboxSize', element.volume) // 单箱体积
                  this.$set(element, 'dictFromInventoryStatus', element.dictFromInventoryStatus) // 调出仓库存状态
                })
                this.dataForm.transferOutDetailsList = arr
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
    },
    // 校验
    validate () {
      this.$refs['dataForm'].validate(valid => {
        if (this.dataForm.transferOutDetailsList.length === 0) {
          this.$notify({
            title: '警告',
            message: '库存调出明细不能为空',
            type: 'warning',
            duration: 3000
          })
          return false
        }
        if (valid) {
          this.$emit('validate', {
            obj: true
          })
        } else {
          this.$emit('validate', {
            obj: false
          })
          return false
        }
      })
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
