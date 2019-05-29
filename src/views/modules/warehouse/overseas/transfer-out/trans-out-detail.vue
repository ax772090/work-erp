<template>
  <el-dialog :title="dialogTitle"
             width="90%"
             :close-on-click-modal="false"
             :visible.sync="visible"
             v-if="visible"
             :before-close="handleClose">
    <!-- 表单 -->
    <el-form :disabled="formDisabled"
             :model="dataForm"
             :rules="dataRule"
             label-width="110px"
             ref="dataForm">
      <el-row>
        <el-col :span="6">
          <el-form-item label="调出单号"
                        prop="code">
            <el-input disabled
                      placeholder="未生成"
                      v-model="dataForm.code"></el-input>
          </el-form-item>
          <el-form-item label="调出日期"
                        prop="date">
            <el-date-picker default-time
                            placeholder="选择日期"
                            type="date"
                            v-model="dataForm.date"
                            value-format="yyyy-MM-dd"></el-date-picker>
          </el-form-item>
          <el-form-item label="备注"
                        prop="remark">
            <textarea-all v-model="dataForm.remark"></textarea-all>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="库存公司"
                        prop="compId"
                        ref="compId">
            <select-all v-model="dataForm.compId"
                        :listDataOption="compIdOptions"
                        :isDisabled="isDisabledFromDel || isDisableFromAdd"
                        data-value="id"
                        data-label="name"
                        :isSelectChange="true"
                        @selectChange="compNameChange"
                        placeholder="请选择库存公司"></select-all>
          </el-form-item>
          <el-form-item label="调出仓库"
                        prop="fromWarehouseId">
            <select-all v-model="dataForm.fromWarehouseId"
                        :listDataOption="fromWarehouseIdOptions"
                        :isDisabled="isDisabledFromDel || isDisableFromAdd"
                        :linkDisable='toWarehouseLink'
                        data-value="id"
                        data-label="name"
                        :isSelectChange="true"
                        @selectChange="fromWarehouseChange"></select-all>
          </el-form-item>
          <el-form-item label="调入仓库"
                        prop="toWarehouseId">
            <select-all v-model="dataForm.toWarehouseId"
                        :listDataOption="toWarehouseIdOptions"
                        :linkDisable='fromWarehouseLink'
                        data-value="id"
                        data-label="name"
                        :isSelectChange="true"
                        @selectChange="toWarehouseChange"></select-all>
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
          <el-form-item label="仓管员"
                        prop="adminId">
            <select-seach :listDataOptionStatic="adminIdOption"
                          data-label="name"
                          data-source="list"
                          data-value="id"
                          httpMethod="get"
                          httpUrl="list/search/user"
                          placeholder="搜索"
                          v-model="dataForm.adminId"></select-seach>
          </el-form-item>

        </el-col>
        <el-col :span="6">
          <el-form-item label="要货计划单号"
                        prop="deliveryPlanCode">
            <el-input placeholder="要货计划单号"
                      v-model="dataForm.deliveryPlanCode"
                      :disabled="true"></el-input>
          </el-form-item>
          <el-form-item label="业务类型"
                        prop="dictTransferOutType">
            <select-all v-model="dataForm.dictTransferOutType"
                        :listDataOption="deliveryTypeOptions"
                        data-value="key"
                        data-label="value"></select-all>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <!-- 调出明细 -->
        <el-button type="text"
                   v-if="!isDisabledAdd"
                   @click="addProdHandle()">
          <i class="iconfont erp-icon-tianjiamingxi"></i>添加明细行</el-button>
      </el-row>
      <!-- 表格 -->
      <el-table :data="dataForm.transferOutDetailsList"
                stripe
                border
                highlight-current-row
                max-height="400"
                v-loading="dataListLoading"
                show-summary
                :summary-method="getSummaries">
        <el-table-column label="产品图片"
                         prop="imageUrl"
                         width="120">
          <template slot-scope="scope">
            <tableImg :imageUrl='scope.row.imageUrl'></tableImg>
          </template>
        </el-table-column>
        <el-table-column label="产品编码"
                         prop="prodCode"></el-table-column>
        <el-table-column label="产品名称"
                         prop="prodName"></el-table-column>
        <el-table-column prop="specifications"
                         label="规格型号"></el-table-column>
        <el-table-column label="调出仓库存状态"
                         prop="dictFromInventoryStatus">
          <template slot-scope="scope">
            <select-all v-model="scope.row.dictFromInventoryStatus"
                        :listDataOption="dictInventoryStatusOption"
                        :isDisabled="true"
                        data-value="key"
                        data-label="value"
                        placeholder="调出仓库存状态"></select-all>
          </template>
        </el-table-column>
        <el-table-column label="调出数量"
                         prop="qty">
          <template slot-scope="scope">
            <el-form-item :prop="'transferOutDetailsList[' + scope.$index + '].qty'"
                          :rules="dataRule.qty"
                          label-width="0px">
              <el-input placeholder="调出数量"
                        v-model="scope.row.qty"
                        type="Number"
                        @mousewheel.native.prevent></el-input>
            </el-form-item>
          </template>
        </el-table-column>
        <el-table-column label="调入仓库存状态"
                         prop="dictToInventoryStatus">
          <template slot-scope="scope">
            <select-all v-model="scope.row.dictToInventoryStatus"
                        :listDataOption="dictToInventoryStatusOption"
                        :isDisabled="true"
                        data-value="key"
                        data-label="value"
                        placeholder="调入仓库存状态"></select-all>
          </template>
        </el-table-column>
        <el-table-column label="备注"
                         prop="remark">
          <template slot-scope="scope">
            <el-input :disabled="isDisabled"
                      placeholder
                      v-model="scope.row.remark"></el-input>
          </template>
        </el-table-column>
        <!-- 操作列 -->
        <el-table-column label="操作"
                         fixed="right"
                         width="80">
          <template slot-scope="scope">
            <el-button :disabled="isDisabled"
                       @click="deleteHandle(scope.$index)"
                       circle
                       title="删除"
                       type="danger">
              <i class="iconfont erp-icon-shanchu"></i>
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-form>
    <!-- 添加明细 -->
    <add-details ref="addDetails"
                 @addDetailsList="addList"></add-details>
    <span slot="footer"
          class="dialog-footer">
      <el-button @click="cancel('dataForm')"><i class="iconfont erp-icon-quxiao"></i>取消</el-button>
      <el-button v-if="!isDisabled"
                 type="primary"
                 @click="dataFormSave()"><i class="iconfont erp-icon-baocun"></i>保存</el-button>
      <el-button v-if="!isDisabled"
                 type="primary"
                 @click="dataFormSubmit()"><i class="iconfont erp-icon-queding"></i>确认</el-button>
    </span>
  </el-dialog>
</template>

<script>
import selectSeach from '@/components/erp-select/select-seach'
import selectAll from '@/components/erp-select/select-all'
// 引入图片
import tableImg from '@/components/list-table/table-img'
// 添加明细（新组件）
import addDetails from '@/components/add-details/prod-warehouse-detail'
// 备注
import textareaAll from '@/components/erp-input/textarea-all.vue'
import {
  isNumber,
  types
} from 'util'
import {
  outside
} from 'semver'
export default {
  components: {
    selectSeach,
    selectAll,
    addDetails,
    tableImg,
    textareaAll
  },
  data () {
    var validateInteger = (rule, value, callback) => {
      let index = Number(rule.field.indexOf('['))
      let rowIndexValue = Number(rule.field[index + 1])
      let row = this.dataForm.transferOutDetailsList[rowIndexValue]
      if (!/^[1-9]\d*$/.test(value) && value != null) {
        callback(new Error('正整数'))
        //   return;
      } else if (Number(row.qty) > Number(row.qtyDefault)) {
        callback(new Error(`调出数量不能大于${row.qtyDefault}`))
      } else {
        callback()
      }
    }
    return {
      fromWarehouseLink: '',
      toWarehouseLink: '',
      deliveryTypeOptions: [], // 业务类型--字典
      visible: false,
      isDisableFromAdd: false, // 列表里面没有数据时，可选
      isDisabledFromDel: false, // 控制从要货计划下来的部分下拉是否可选
      isDisabledAdd: false, // 新增按钮控制
      isDisabled: false, // 查看设置为true
      dialogTitle: '', // dialog标题
      formDisabled: false, // 查看时设置为true
      dataListLoading: false,
      addProdVisible: false,
      dataForm: {
        sourceType: '02', // 02表示库存调拨的新增，01表示上游要货计划的调拨出库
        id: '',
        code: '',
        date: '',
        remark: '',
        compId: '',
        fromWarehouseId: '',
        toWarehouseId: '',
        dictDocStatus: '01', // 单据状态，新增：01
        adminId: '',
        //   businessType: "", //业务类型，目前调字典
        //   dictTransferOutType: "01", // 业务类型，01：海外仓，02：FBA仓
        dictFromInventoryStatus: '', // 调出仓库存状态
        dictToInventoryStatus: '', // 调入仓库存状态
        deliveryPlanCode: '', // 要货计划单
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
      dataRule: {
        compId: [{
          required: true,
          message: '库存公司',
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
        toWarehouseId: [{
          required: true,
          message: '调入仓库',
          trigger: 'change'
        }],
        dictTransferOutType: [{
          required: true,
          message: '请选择业务类型',
          trigger: 'change'
        }],
        qty: [{
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
    // 调出仓库改变
    fromWarehouseChange (value) {
      this.fromWarehouseLink = value
      // this.toWarehouseIdOptions.forEach(item => {
      //   item.id === value || item.id === this.dataForm.toWarehouseId
      //     ? (item.disabled = true)
      //     : (item.disabled = false)
      // })
    },
    // 调入仓库改变
    toWarehouseChange (value) {
      this.toWarehouseLink = value
      // this.fromWarehouseIdOptions.forEach(item => {
      //   item.id === value || item.id === this.dataForm.fromWarehouseId
      //     ? (item.disabled = true)
      //     : (item.disabled = false)
      // })
    },
    initWareHouse (val) {
      return this.$http.get(this.$http.adornUrl('basic/basicchannel/getChannelWarehouse'), {
        params: {
          channelId: val
        }
      })
    },
    initWareHouseComp (val) {
      return this.$http
        .get(this.$http.adornUrl('list/combobox/warehouse-comp'), {
          params: {
            compId: val
          }
        })
    },
    // 去重
    arrReduce (arr, objTemp) {
      let newArr = []
      let obj = {}
      newArr = [...arr, objTemp].reduce((pre, cur) => {
        obj[cur.id] ? '' : obj[cur.id] = true && pre.push(cur)
        return pre
      }, [])
      return newArr || []
    },
    // 选择公司触发
    compNameChange (value, type) {
      if (type) {
        this.initWareHouseComp(value)
          .then(({
            data
          }) => {
            this.fromWarehouseIdOptions = data.list
            if (this.dataForm.channelId) {
              //   请求要货店铺对应的仓库
              this.initWareHouse(this.dataForm.channelId)
                .then((res) => {
                  if (res.data && res.data.list && Object.keys(res.data.list).length > 0) {
                    let temp = {}
                    temp = {
                      id: res.data.list.warehouseId,
                      name: res.data.list.name
                    }
                    // this.toWarehouseIdOptions = [...data.list, ...temp]// 合并
                    this.toWarehouseIdOptions = this.arrReduce(data.list, temp)
                    //   this.dataForm.toWarehouseId = res.data.list.warehouseId
                    // 下拉选项哪些可选
                    this.fromWarehouseChange(this.dataForm.fromWarehouseId)
                    this.toWarehouseChange(this.dataForm.toWarehouseId)
                  } else {
                    // 如果店铺没有对应的仓库，取发货公司获取的仓库
                    this.toWarehouseIdOptions = data.list
                  }
                })
            } else {
              this.toWarehouseIdOptions = data.list
            }
          })
      } else {
        this.dataForm.fromWarehouseId = ''
        this.dataForm.toWarehouseId = ''
        this.initWareHouseComp(value)
          .then(({
            data
          }) => {
            this.fromWarehouseIdOptions = data.list
            this.toWarehouseIdOptions = data.list
          })
      }
    },
    // 删除调出明细
    deleteHandle (index) {
      this.dataForm.transferOutDetailsList.splice(index, 1)
      // 判断transferOutDetailsList是否为空，如果不为空了，库存公司和仓库不可以选择选择
      if (this.dataForm.transferOutDetailsList.length > 0) {
        this.isDisableFromAdd = true
      } else {
        this.isDisableFromAdd = false
      }
    },
    // 新增产品-调出明细
    addProdHandle: _.debounce(
      async function addProdHandle () {
        // 新增按钮控制权限（校验库存公司和调出仓库是否填写）
        if (!this.dataForm.compId && !this.dataForm.fromWarehouseId) {
          this.$notify.error({
            title: '错误',
            message: `请选择[库存公司]和[调出仓库]`,
            duration: 3000
          })
        } else {
          this.addProdVisible = true
          this.$nextTick(() => {
            this.$refs.addDetails.init(
              this.dataForm.id,
              this.dataForm.transferOutDetailsList,
              {
                compId: this.dataForm.compId ? this.dataForm.compId : '',
                warehouseId: this.dataForm.fromWarehouseId,
                status: '02'
              }
            )
          })
        }
      },
      1000, {
        leading: true,
        trailing: false
      }
    ),

    // 子传过来的数据
    addList (list) {
      // 添加了数据，禁掉库存公司和仓库的选择
      this.isDisableFromAdd = true
      if (list) {
        list.forEach(element => {
          this.$set(element, 'dictToInventoryStatus', '05') // 在途
          this.$set(
            element,
            'dictFromInventoryStatus',
            element.dictInventoryStatus
          ) // 调出仓库状态（因为名称不一样）
          this.$set(element, 'qtyDefault', element.qty) // 默认调出数量
          this.$set(
            element,
            'boxQty',
            element.outboxQty
              ? Math.ceil(Number(element.qty) / Number(element.outboxQty))
              : ''
          ) // 默认箱数
        })
        for (const data of list) {
          let isFind = false
          for (const item of this.dataForm.transferOutDetailsList) {
            if (data.prodId === item.prodId) {
              isFind = true
              break
            }
          }
          if (!isFind) {
            this.dataForm.transferOutDetailsList.push(data)
          }
        }
      }
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
      // 业务类型
      this.$http
        .get(this.$http.adornUrl('basicData/queryDataDict2List'), {
          params: {
            dataDictKey: 'BUSSINESS_TYPE'
          }
        })
        .then(({
          data
        }) => {
          this.deliveryTypeOptions = data.fontMaps
        })
    },
    // 关闭清除本次缓存
    clearCache (formName) {
      this.$nextTick(() => {
        this.$refs[formName].resetFields()
        this.dataForm.transferOutDetailsList = []
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
    },
    initDataForm () {
      this.dataForm = {
        sourceType: '02', // 02表示库存调拨的新增，01表示上游要货计划的调拨出库
        id: '',
        code: '',
        date: '',
        remark: '',
        compId: '',
        fromWarehouseId: '',
        toWarehouseId: '',
        dictDocStatus: '01', // 单据状态，新增：01
        adminId: '',
        //   businessType: "", //业务类型，目前调字典
        //   dictTransferOutType: "01", // 业务类型，01：海外仓，02：FBA仓
        dictFromInventoryStatus: '', // 调出仓库存状态
        dictToInventoryStatus: '', // 调入仓库存状态
        deliveryPlanCode: '', // 要货计划单
        // 调出明细
        transferOutDetailsList: []
      }
      // 调出仓库
      this.fromWarehouseIdOptions = []
      // 调入仓库
      this.toWarehouseIdOptions = []
      this.toWarehouseLink = ''
      this.fromWarehouseLink = ''
    },
    init (id, type) {
      this.initDataForm()// 初始化dataForm
      this.visible = true
      this.getDataUrl()
      this.dataForm.id = id
      this.dataForm.transferOutDetailsList = []
      this.formDisabled = false
      this.isDisabled = false
      this.isDisabledAdd = false// 新增按钮是否显示
      this.isDisabledFromDel = false
      this.isDisableFromAdd = false
      this.$nextTick(() => {
        if (type === 'canAdd') {
          this.dialogTitle = '库存调出新增'
          this.initAdd()
        }
        if (type === 'canEdit' && this.dataForm.id) {
          this.dialogTitle = '库存调出修改'
          this.initEdit(id)
        }
        if (type === 'canCheck' && this.dataForm.id) {
          this.dialogTitle = '库存调出查看'
          this.initCheck(id)
        }
        if (type === 'delivery' && this.dataForm.id) {
          this.dialogTitle = '库存调出新增'
          this.initDelivery(id)
        }
      })
    },
    initAdd () {
      this.dataForm.adminId = sessionStorage.getItem('userId') // 新增默认当前用户为仓管员
    },
    initEdit (id) {
      this.dataCallInfo(id)
    },
    initCheck (id) {
      this.formDisabled = true
      this.isDisabled = true
      this.isDisabledAdd = true
      this.dataCallInfo(id)
    },
    initDelivery (id) {
      this.isDisabledAdd = true
      this.isDisabledFromDel = true
      this.dataForm.adminId = sessionStorage.getItem('userId') // 新增默认当前用户为仓管员
      this.dataCallDelivery(id)
    },
    dataCallDelivery (id) {
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
          this.dataForm = Object.assign({},
            this.dataForm,
            { dictTransferOutType: data.transferout.businessType },
            data.transferout
          )
          this.compNameChange(this.dataForm.compId, id)

          // 需要对调出详情添加部分字段
          let arr = data.transferoutDetail
          arr.forEach(element => {
            this.$set(element, 'qty', element.confirmQty) // 调出数量
            this.$set(element, 'qtyDefault', element.confirmQty) // 默认调出数量
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
    },
    dataCallInfo (id) {
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
          if (
            data.transferPackingInfo.whTransferOutEntity.sourceType ===
            '01'
          ) {
            this.isDisabledAdd = true // 新增按钮不显示
            this.isDisabledFromDel = true // 从要货下来的这几个下拉不能改变
          } else {
            this.isDisableFromAdd = true // 其他编辑状态，库存公司不可选
          }
          // 需要对调出详情添加部分字段
          let arr = data.transferPackingInfo.whTransferOutDetailList
          arr.forEach(element => {
            this.$set(
              element,
              'dictFromInventoryStatus',
              element.dictFromInventoryStatus
            ) // 调出仓库存状态
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
    },
    // 保存
    dataFormSave: _.debounce(
      async function dataFormSave () {
        let transferOutDetailsList = this.dataForm.transferOutDetailsList
        if (transferOutDetailsList.length <= 0) {
          this.$notify.error({
            title: '错误',
            message: '库存调出模块，调出明细不能为空',
            duration: 2000
          })
        } else {
          this.$refs['dataForm'].validate(valid => {
            if (valid) {
              this.$http({
                url: this.$http.adornUrl(
                  `warehouse/whtransferout/${
                  !this.dataForm.id || !!name ? 'save' : 'update'
                  }`
                ),
                method: !this.dataForm.id || !!name ? 'post' : 'put',
                data: Object.assign(
                  {},
                  { whTransferOutEntity: this.dataForm },
                  {
                    whTransferOutDetailList: this.dataForm.transferOutDetailsList
                  }
                )
              }).then(({ data }) => {
                if (data && data.code === 0) {
                  // this.submitId = data.id
                  this.clearCache('dataForm')
                  this.$emit('refreshDataList')
                  this.$notify({
                    title: '提示',
                    message: '保存成功',
                    type: 'success',
                    duration: 1500
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
        }
      }, 1000, {
        leading: true,
        trailing: false
      }
    ),

    // 确认调出新接口
    dataFormSubmit: _.debounce(
      async function dataFormSubmit () {
        let transferOutDetailsList = this.dataForm.transferOutDetailsList
        if (transferOutDetailsList.length <= 0) {
          this.$notify.error({
            title: '错误',
            message: '库存调出模块，调出明细不能为空',
            duration: 2000
          })
        } else {
          this.$refs['dataForm'].validate(valid => {
            if (valid) {
              this.$http({
                url: this.$http.adornUrl(`warehouse/whtransferout/saveandconfirm`),
                method: 'post',
                data: Object.assign(
                  {},
                  { whTransferOutEntity: this.dataForm },
                  {
                    whTransferOutDetailList: this.dataForm.transferOutDetailsList
                  }
                )
              }).then(({ data }) => {
                if (data && data.code === 0) {
                  this.$emit('refreshDataList')
                  this.clearCache('dataForm')
                  this.$notify({
                    title: '提示',
                    message: '调出成功',
                    type: 'success',
                    duration: 1000
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
        }
      }, 1000, {
        leading: true,
        trailing: false
      }
    )
  }
}
</script>
