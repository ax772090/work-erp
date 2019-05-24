<template>
  <el-dialog :title="dialogTitle"
             width="90%"
             :close-on-click-modal="false"
             :visible.sync="visible"
             v-if="visible"
             :before-close="handleClose">
    <!-- 审核头 -->
    <approval-new v-model="approvalData"
                  v-if="isShowApproval"></approval-new>
    <!-- form表单 -->
    <el-form :model="dataForm"
             :rules="dataRule"
             ref="dataForm"
             label-width="110px"
             :disabled="formDisabled">
      <!-- 基本信息 -->
      <el-row>
        <el-col :span="6">
          <el-form-item label="单据编号"
                        prop="code">
            <el-input v-model="dataForm.code"
                      placeholder="系统自动生成"
                      disabled></el-input>
          </el-form-item>
          <el-form-item label="调出方"
                        prop="outPart">
            <select-all v-model="dataForm.outPart"
                        :listDataOption="outPartOptions"
                        data-value="key"
                        data-label="value"
                        :isDisabled="isDisabled"
                        :isSelectChange="true"
                        @selectChange="outPartChange"></select-all>
          </el-form-item>
          <el-form-item label="调出方站点"
                        prop="outSite"
                        :rules="dataForm.outPart === '01'?[{ required: true, message: '市场不能为空', trigger: 'change' }]:[{ required: false, message: '', trigger: 'change' }]">
            <select-all v-model="dataForm.outSite"
                        :listDataOption="outMarketOptions"
                        data-value="id"
                        data-label="displayName"
                        :isDisabled="isDisabled"
                        :isSelectChange="true"
                        @selectChange="marketChangeHandle"></select-all>
          </el-form-item>

        </el-col>
        <el-col :span="6">
          <el-form-item label="申请类型"
                        prop="dictTemporarily">
            <select-all v-model="dataForm.dictTemporarily"
                        :listDataOption="dictTemporarilyOptions"
                        data-value="key"
                        data-label="value"
                        :isDisabled="isDisabled"
                        :isSelectChange="true"
                        @selectChange="applyTypeChange"></select-all>
          </el-form-item>
          <el-form-item label="调入方"
                        prop="inPart"
                        :rules="dataForm.dictTemporarily === '02'?[{ required: true, message: '调入方不能为空', trigger: 'change' }]:[{ required: false, message: '', trigger: 'change' }]">
            <select-all v-model="dataForm.inPart"
                        :listDataOption="inPartOptions"
                        :isDisabled="inPartDisable"
                        data-value="key"
                        data-label="value"
                        :isSelectChange="true"
                        @selectChange="inPartChange"></select-all>
          </el-form-item>
          <el-form-item label="调入方站点"
                        prop="inSite"
                        :rules="dataForm.inPart === '01'?[{ required: true, message: '调入方站点不能为空', trigger: 'change' }]:[{ required: false, message: '', trigger: 'change' }]">
            <select-all v-model="dataForm.inSite"
                        :listDataOption="inMarketOptions"
                        :isDisabled="isDisabled"
                        data-value="id"
                        data-label="displayName"
                        :isSelectChange="true"
                        @selectChange="marketChangeHandle"></select-all>
          </el-form-item>

        </el-col>
        <el-col :span="6">
          <el-form-item label="调出方销售员"
                        prop="outSaleUserId">
            <select-seach v-model="dataForm.outSaleUserId"
                          httpUrl="list/search/user"
                          requestParamsKey="name"
                          httpMethod="get"
                          :isDisabled="isDisabled"
                          data-label="name"
                          data-value="id"
                          data-source="list"
                          placeholder="搜索"
                          :isSelectChange="true"
                          @selectChange="salesUserIdChange"></select-seach>
          </el-form-item>
          <el-form-item label="申请人"
                        prop="applyUserId">
            <select-seach v-model="dataForm.applyUserId"
                          httpUrl="list/search/user"
                          requestParamsKey="name"
                          :isDisabled="isDisabled"
                          httpMethod="get"
                          data-label="name"
                          data-value="id"
                          data-source="list"
                          placeholder="搜索"></select-seach>
          </el-form-item>
          <el-form-item label="申请日期"
                        prop="applyDate">
            <el-date-picker v-model="dataForm.applyDate"
                            type="date"
                            :disabled="isDisabled"
                            value-format="yyyy-MM-dd"
                            placeholder="选择要货日期"></el-date-picker>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="单据状态"
                        prop="dictDocStatus">
            <select-all v-model="dataForm.dictDocStatus"
                        :listDataOption="dictDocStatusOptions"
                        :isDisabled="true"
                        data-value="key"
                        data-label="value"
                        placeholder="单据状态"></select-all>
          </el-form-item>
          <el-form-item label="借调原因"
                        prop="reason">
            <textarea-all v-model="dataForm.reason"
                          :disabled="isDisabled"></textarea-all>
          </el-form-item>
        </el-col>
      </el-row>
      <div>
        <!-- 明细 -->
        <el-button type="text"
                   v-if="!isDisabled"
                   class="mb-10"
                   @click="addSkuHandle()">
          <i class="iconfont erp-icon-tianjiamingxi"></i>添加明细行</el-button>
        <!-- 表格 -->
        <el-table :data="dataForm.detailList"
                  stripe
                  border
                  highlight-current-row
                  v-loading="dataListLoading"
                  max-height="400"
                  show-summary
                  :summary-method="getSummaries">
          <el-table-column label="调出方SKU">
            <template slot-scope="scope">
              <el-row>
                <el-col :span="20">
                  <span>{{scope.row.outProdCode}}</span>
                </el-col>
                <!-- 是否组合产品 -->
                <el-col :span="4"
                        v-if="scope.row.bAssemble">
                  <div class="isCombine">
                    <span>组合</span>
                  </div>
                </el-col>
              </el-row>
            </template>
          </el-table-column>
          <el-table-column prop="outProdName"
                           label="调出方产品名称"></el-table-column>
          <el-table-column prop="specifications"
                           label="规格型号"></el-table-column>
          <el-table-column prop="inProdCode"
                           label="调入方SKU"></el-table-column>
          <el-table-column prop="inProdName"
                           label="调入方产品名称"></el-table-column>
          <el-table-column prop="applyQty"
                           label="申请借调数量">
            <template slot-scope="scope">
              <el-form-item :prop="'detailList.' + scope.$index + '.applyQty'"
                            :rules="dataRule.isIntegerNatural"
                            label-width="0px">
                <el-input v-model="scope.row.applyQty"
                          placeholder="借调数量"
                          :disabled="isDisabled"
                          type="Number"
                          @input="applyQtyInput(scope.row)"
                          @mousewheel.native.prevent></el-input>
              </el-form-item>
            </template>
          </el-table-column>
          <el-table-column prop="approveQty"
                           label="批准数量">
            <template slot-scope="scope">
              <el-form-item :prop="'detailList.' + scope.$index + '.approveQty'"
                            label-width="0px"
                            :rules="(approvalData && approvalData.node === 'T01')?dataRule.isIntegerNatural:[{ required: false, message: '', trigger: 'change' }]">
                <el-input v-model="scope.row.approveQty"
                          placeholder="批准数量"
                          :disabled="approveQtyDisabled"
                          type="Number"
                          @mousewheel.native.prevent></el-input>
              </el-form-item>
            </template>
          </el-table-column>
          <el-table-column prop="outPurQty"
                           label="调出方SKU已采购"></el-table-column>
          <el-table-column prop="bChange"
                           label="是否需要变更采购需求"></el-table-column>
          <!-- 操作列 -->
          <el-table-column fixed="right"
                           width="80"
                           label="操作">
            <template slot-scope="scope">
              <el-button type="danger"
                         title="删除"
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
    <!-- 添加明细 -->
    <add-details ref="addDetails"
                 @addDetailsList="addList"></add-details>
    <span slot="footer"
          class="dialog-footer">
      <el-button @click="cancel('dataForm')"><i class="iconfont erp-icon-quxiao"></i>取消</el-button>
      <el-button type="primary"
                 @click="dataFormSave"
                 v-if="!isDisabled"><i class="iconfont erp-icon-baocun"></i>保存</el-button>
      <el-button type="primary"
                 @click="dataFormSubmit"
                 v-if="!isDisabled && isAuth('warehouse:sitedelinfo:submit')"><i class="iconfont erp-icon-queding"></i>提交</el-button>
      <el-button type="primary"
                 :disabled="!isShowApproval"
                 @click="workflowApproval"
                 v-if='isShowApproval'>审核</el-button>
    </span>
  </el-dialog>
</template>

<script>
import selectSeach from '@/components/erp-select/select-seach'
import selectAll from '@/components/erp-select/select-all'
import approvalNew from '@/components/workflow/approval-new'
// 添加明细（新组件）
import addDetails from '@/components/add-details/prod-detail.vue'
import { getUrl, getRequest, clearTaskId } from '@/utils'
// 备注
import textareaAll from '@/components/erp-input/textarea-all.vue'
import {
  dateFormatter
} from '@/utils/index.js'
export default {
  components: {
    selectSeach,
    selectAll,
    approvalNew,
    addDetails,
    textareaAll
  },
  data () {
    return {
      approvalData: [], // 审核数据
      approveQtyDisabled: true, // 批准数量是否可输入
      outMarketOptions: [], // 调出方市场
      inMarketOptions: [], // 调入方市场
      inPartDisable: true, // 调入方disable
      isShowApproval: false, // 审核头是否显示
      outPartOptions: [], // 调出方平台
      inPartOptions: [], // 调入方平台
      isDisableFromAdd: false, // 列表里面没有数据时，可选
      isDisabled: false, // 查看设置为true
      dialogTitle: '', // dialog标题
      formDisabled: false, // 查看时设置为true
      dataListLoading: false,
      visible: false,
      addSkuVisible: false,
      dataForm: {
        code: '',
        outPart: '', // 调出方平台
        inPart: '', // 调入方平台
        inSite: '',
        outSite: '',
        reason: '',
        dictTemporarily: '01', // 申请类型默认‘01’
        applyUserId: '', // 申请人
        applyDate: dateFormatter(new Date(), false), // 将"2018-11-08T09:07:37.648Z"转换为"2018-11-08"
        dictDocStatus: '01', // 单据状态默认'01'
        // 借调明细
        detailList: []
      },
      // 单据状态
      dictDocStatusOptions: [],
      // 申请类型
      dictTemporarilyOptions: [],
      dataRule: {
        outPart: [{
          required: true,
          message: '请选择调出方平台',
          trigger: 'change'
        }],
        dictTemporarily: [{
          required: true,
          message: '请选择申请类型',
          trigger: 'change'
        }],
        applyUserId: [{
          required: true,
          message: '申请人',
          trigger: 'blur'
        }],
        outSaleUserId: [{
          required: true,
          message: '请选择销售员',
          trigger: 'change'
        }],
        applyDate: [{
          required: true,
          message: '选择申请日期',
          trigger: 'change'
        }],
        reason: [{
          required: true,
          message: '借调原因',
          trigger: 'blur'
        }],
        isInteger: [
          { pattern: /^[1-9]\d*$/, message: '正整数', trigger: 'change' }
        ],
        isIntegerNatural: [
          { required: true, message: '必填项', trigger: 'change' },
          { pattern: /^[1-9]\d*$/, message: '正整数', trigger: 'change' }
        ]
      }
    }
  },
  methods: {
    // 选择人员后,拿到当前部门id
    salesUserIdChange (item) {
      if (!item) {
        return
      }
      this.dataForm.lendDept = item.deptId
    },
    // 申请借调数量改变
    applyQtyInput (row) {
      row.approveQty = row.applyQty
    },

    initPart (val) {
      return this.$http.get(
        this.$http.adornUrl('basicData/changePlantform'), {
          params: {
            plantform: val
          }
        })
    },

    // 调出方改变，改变调出方站点
    outPartChange (val) {
      // 如果申请类型为‘01’,调入方等于调出方
      if (this.dataForm.dictTemporarily === '01') {
        this.dataForm.inPart = val
      }
      this.initPart(val).then((res) => {
        if (res && res.data) {
          this.dataForm.outSite = ''
          this.dataForm.inSite = ''
          this.outMarketOptions = res.data
          this.inMarketOptions = res.data
        }
      })
    },
    // 调入方改变，改变调入方站点
    inPartChange (val) {
      this.initPart(val).then((res) => {
        if (res && res.data) {
          this.dataForm.inSite = ''
          this.inMarketOptions = res.data
        }
      })
    },
    // 申请类型改变
    applyTypeChange (val) {
      // 如果是跨平台借调，调入方解锁
      if (val === '02') {
        this.inPartDisable = false
      } else if (val === '01') {
        this.inPartDisable = true
        //
        this.dataForm.inPart = this.dataForm.outPart
      }
    },
    // 市场改变
    marketChangeHandle (val) {

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
          if (column.property === 'applyQty' || column.property === 'approveQty') {
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
    // 关闭清除本次缓存
    clearCache (formName) {
      this.$refs[formName].resetFields()
      this.dataForm.detailList = []
      this.visible = false
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
    // 删除要货明细
    deleteHandle (index) {
      this.dataForm.detailList.splice(index, 1)
      // 判断deliveryDetailsList是否为空，如果不为空了，要货平台和要货店铺不可以选择
      if (this.dataForm.detailList.length > 0) {
        this.isDisableFromAdd = true
      } else {
        this.isDisableFromAdd = false
      }
    },
    // 新增产品SKU
    addSkuHandle () {
      this.addSkuVisible = true
      this.$nextTick(() => {
        this.$refs.addDetails.init(this.dataForm.id, this.dataForm.detailList)
      })
    },
    // 子传过来的数据
    addList (list) {
      list = list.map(item => {
        return {
          bAssemble: item.bAssemble,
          outProdCode: item.prodCode,
          outProdId: item.id,
          outProdName: item.nameCh,
          specifications: item.specifications,
          inProdCode: item.prodCode,
          inProdId: item.id,
          inProdName: item.nameCh,
          applyQty: 0,
          approveQty: 0,
          outPurQty: '',
          bChange: ''
        }
      })
      // 目前可以重复添加
      for (const item of list) {
        this.dataForm.detailList.push(item)
      }
    },
    getDataUrl () {
      // 平台数据字典
      this.$http.get(this.$http.adornUrl('basicData/queryDataDict2List'), { params: { dataDictKey: 'PLANTFORM_TYPE' } }).then(({ data }) => {
        this.outPartOptions = data.fontMaps
        this.inPartOptions = data.fontMaps
      })
      // 单据状态
      this.$http.get(this.$http.adornUrl('basicData/queryDataDict2List'), { params: { dataDictKey: 'APPROVAL_STATUS' } }).then(({ data }) => {
        this.dictDocStatusOptions = data.fontMaps
      })
      // 申请类型
      this.$http.get(this.$http.adornUrl('basicData/queryDataDict2List'), { params: { dataDictKey: 'TEMPORARILY_TYPE' } }).then(({ data }) => {
        this.dictTemporarilyOptions = data.fontMaps
      })
    },
    init (id, type, obj) {
      this.getDataUrl()
      Object.assign(this.$data, this.$options.data())
      this.visible = true
      this.dataForm.id = id
      this.dataForm.detailList = []
      this.formDisabled = false
      this.isDisabled = false
      this.add(id, type)
      this.editorCheck(id, type)
      this.approve(id, type, obj)
    },
    // 新增
    add (id, type) {
      if (!this.dataForm.id) {
        this.dialogTitle = '新增'
        this.isDisableFromAdd = false
        this.dataForm.applyUserId = sessionStorage.getItem('userId') // 新增默认当前用户
      }
    },
    // 编辑或者查看
    editorCheck (id, type) {
      if (id && type === 'check') {
        this.formDisabled = true
        this.isDisabled = true
        this.dialogTitle = '查看'
      } else if (id && !type) {
        this.dialogTitle = '修改'
        this.isDisableFromAdd = true
      }
      this.dataCallInfo(id)
    },
    // 审核
    approve (id, type, obj) {
      // 审核
      if (id && type === 'approve') {
        this.dialogTitle = '审核'
        this.isShowApproval = true // 显示审核头
        this.approvalData = obj
        // 如果是节点1，则去掉驳回上一级按钮
        if (this.approvalData.node === 'T01' || this.approvalData.node === null) {
          this.approvalData.isShowNode2 = false
          this.approvalData.isShowNode3 = true
          this.isDisabled = true
          // T01批准数量可以输入
          this.approveQtyDisabled = false
        } else if (this.approvalData.node === 'T02') {
          this.approvalData.isShowNode2 = true
          this.approvalData.isShowNode3 = true
          this.isDisabled = true
          // T02批准数量锁定
          this.approveQtyDisabled = true
        }
      } else {
        this.isShowApproval = false // 不显示审核头
      }
      this.dataCallInfo(id)
    },
    dataCallInfo (id) {
      this.$nextTick(() => {
          this.$refs['dataForm'].resetFields()
          if (this.dataForm.id) {
            this.$http({
              url: this.$http.adornUrl(`warehouse/sitedelinfo/info/${id}`),
              method: 'get',
              params: this.$http.adornParams({
                id: id
              })
            }).then(({
              data
            }) => {
              if (data && data.code === 0) {
                this.dataForm = data.siteDelInfo
                this.initPart(this.dataForm.outPart).then((res) => {
                  if (res && res.data) {
                    // 调出方站点
                    this.outMarketOptions = res.data
                  }
                })
                this.initPart(this.dataForm.inPart).then((res) => {
                  if (res && res.data) {
                    // 调入方站点
                    this.inMarketOptions = res.data
                  }
                })
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

    partControl () {
      // 平台内借调01，若调出方选择“Amazon”，则调出方站点与调入方站点则控制不能相同;
      // 跨平台借调02，则调出方和调入方平台控制不能相同
      if (this.dataForm.detailList.length <= 0) {
        // 借调明细至少有一行数据
        this.$notify.error({
          title: '错误',
          message: '借调明细至少有一行数据',
          duration: 2000
        })
      } else if (this.dataForm.dictTemporarily === '01' && this.dataForm.outPart === '01' &&
        !!this.dataForm.outSite && !!this.dataForm.inSite && this.dataForm.outSite === this.dataForm.inSite) {
        this.$notify.error({
          title: '错误',
          message: '[平台内借调]时，若调出方为[Amazon],则调出方站点与调入方站点不能相同',
          duration: 2000
        })
      } else if (this.dataForm.dictTemporarily === '02' && !!this.dataForm.outPart &&
        !!this.dataForm.inPart && this.dataForm.outPart === this.dataForm.inPart) {
        this.$notify.error({
          title: '错误',
          message: '[跨平台借调]时，调出方和调入方平台不能相同',
          duration: 2000
        })
      } else {
        return true
      }
      return false
    },
    // },
    // 保存
    dataFormSave: _.debounce(
      async function dataFormSave () {
        let temp = this.partControl()
        if (temp) {
          this.$refs['dataForm'].validate(valid => {
            if (valid) {
              this.$http({
                url: this.$http.adornUrl(
                  `warehouse/sitedelinfo/${
                  !this.dataForm.id ? 'save' : 'update'
                  }`
                ),
                method: !this.dataForm.id ? 'post' : 'put',
                data: Object.assign({}, this.dataForm)
              }).then(({
                data
              }) => {
                if (data && data.code === 0) {
                  // this.submitId = data.id//保存成功后返回的id
                  this.$emit('refreshDataList')
                  this.clearCache('dataForm')
                  this.$notify({
                    message: '保存成功',
                    type: 'success',
                    duration: 1500,
                    title: '提示'
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
      },
      1000, {
        leading: true,
        trailing: false
      }
    ),

    // 提交
    dataFormSubmit: _.debounce(
      async function dataFormSubmit () {
        let temp = this.partControl()
        if (temp) {
          this.$refs['dataForm'].validate(valid => {
            if (valid) {
              let flowParams = {
                processKey: 'site_delivery',
                routeUrl: getUrl(),
                docName: '站点间调拨申请单',
                variablesMap: { lendDept: this.dataForm.lendDept }
              }
              this.$http({
                url: this.$http.adornUrl(
                  'warehouse/sitedelinfo/submit'
                ),
                method: 'post',
                data: Object.assign({}, this.dataForm, {
                  flowParams: flowParams
                })
              }).then(({
                data
              }) => {
                if (data && data.code === 0) {
                  this.$emit('refreshDataList')
                  this.clearCache('dataForm')
                  this.$notify({
                    title: '提示',
                    message: '提交成功',
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
      },
      1000, {
        leading: true,
        trailing: false
      }
    ),

    // 审核接口
    initApproval () {
      this.approvalData.variablesMap = { lendDept: this.dataForm.lendDept }
      return this.$http({
        url: this.$http.adornUrl(`warehouse/sitedelinfo/approve`),
        method: 'post',
        data: Object.assign({}, this.dataForm, {
          flowParams: this.approvalData
        })
      })
    },

    // 审核 按钮
    workflowApproval: _.debounce(
      async function workflowApproval () {
        if (this.approvalData.operation === '3' || this.approvalData.operation === '2') {
          // 如果审核驳回发起人，不再去校验字段
          this.initApproval().then(({ data }) => {
            if (data && data.code === 0) {
              // this.clearCache('dataForm')
              // 清除url的taskId
              window.location.href = clearTaskId()
              this.$emit('refreshDataList')
              this.visible = false
              this.$notify.success({
                title: '成功',
                message: '操作成功',
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
          // 审核时才去校验
          let temp = this.partControl()
          if (temp) {
            this.$refs['dataForm'].validate(valid => {
              if (valid) {
                this.initApproval().then(({ data }) => {
                  if (data && data.code === 0) {
                    // this.clearCache('dataForm')
                    // 清除url的taskId
                    window.location.href = clearTaskId()
                    this.$emit('refreshDataList')
                    this.visible = false
                    this.$notify.success({
                      title: '成功',
                      message: '操作成功',
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
          }
        }
      }, 1000, {
        leading: true,
        trailing: false
      })
  }}
</script>
<style scoped>
.isCombine span {
  position: relative;
  top: 3px;
}
</style>
