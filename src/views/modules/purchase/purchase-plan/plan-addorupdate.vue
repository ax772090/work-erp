<template>
  <div>
    <el-dialog :title="(!dataForm.id || type === 'stockApply') ? '采购计划新增' : type === 'approve' ? '审核':isClick === true ? '采购计划编辑' : '采购计划查看'"
               :close-on-click-modal="false"
               :visible.sync="visible"
               width="90%"
               @close="$refs['dataForm'].resetFields()">
      <!-- 审核头 -->
      <approval-new v-model="approvalData"
                    v-if='isShowApproval'></approval-new>
      <el-form :model="dataForm"
               ref="dataForm"
               :rules="dataRule"
               :disabled="isDisabled"
               label-width="110px">
        <el-row>
          <el-col :span="6">
            <el-form-item label="单据编号"
                          prop="code">
              <el-input v-model="dataForm.code"
                        :disabled="true"
                        placeholder="系统自动生成"></el-input>
            </el-form-item>
            <el-form-item label="计划员"
                          prop="planUserId">
              <select-seach v-model="dataForm.planUserId"
                            httpUrl="list/search/user"
                            httpMethod="get"
                            data-label="name"
                            data-value="id"
                            data-source="list"
                            :listDataOptionStatic="planUserIdOption"
                            :isDisabled="isDisabled"></select-seach>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="计划日期"
                          prop="planDate">
              <el-date-picker v-model="dataForm.planDate"
                              type="date"
                              size="large"
                              format="yyyy-MM-dd"
                              value-format="yyyy-MM-dd"
                              :disabled="isDisabled"></el-date-picker>
            </el-form-item>
            <el-form-item label="备注"
                          prop="remark">
              <textarea-all v-model="dataForm.remark"
                            :disabled="isDisabled"></textarea-all>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="单据状态"
                          prop="dictDocStatus">
              <select-all v-model="dataForm.dictDocStatus"
                          :isDisabled="true"
                          :listDataOption="dictDocStatusOptions"
                          data-value="key"
                          data-label="value"></select-all>
            </el-form-item>
          </el-col>
        </el-row>
        <div class="mod-config">
          <el-button :disabled="forbidAdd"
                     type="text"
                     @click="addHandle()">
            <i class="iconfont erp-icon-tianjiamingxi"></i>新增明细行
          </el-button>
          <el-col :span="24">
            <el-tabs type="border-card"
                     v-model="activeName2">
              <el-tab-pane label="计划汇总"
                           name="first">
                <template>
                  <el-table :data="dataForm.detailList"
                            stripe
                            border
                            max-height="400"
                            highlight-current-row
                            v-loading="dataListLoading"
                            show-summary
                            :summary-method="getSummaries"
                            @selection-change="selectionChangeHandle">
                    <el-table-column type="index"
                                     width="50"
                                     align="center"
                                     label="序号"></el-table-column>
                    <el-table-column prop="prodName"
                                     sortable
                                     @filter-change="handleFilterChange"
                                     label="产品名称"></el-table-column>
                    <el-table-column prop="prodCode"
                                     sortable
                                     label="产品编码"></el-table-column>
                    <el-table-column prop="specifications"
                                     label="规格型号"></el-table-column>
                    <el-table-column prop="unit"
                                     label="采购单位"></el-table-column>
                    <el-table-column prop="applyQty"
                                     label="申请数量"></el-table-column>
                    <el-table-column prop="planQty"
                                     sortable
                                     label="计划数量">
                      <template slot-scope="scope">
                        <el-form-item :prop="'detailList[' + scope.$index + '].planQty'"
                                      :rules="dataRule.isNatural"
                                      label-width="0px">
                          <el-input v-model="scope.row.planQty"
                                    :disabled="isDisabled"
                                    type="Number"
                                    @mousewheel.native.prevent></el-input>
                        </el-form-item>
                      </template>
                    </el-table-column>
                    <el-table-column prop="expectDate"
                                     width="170"
                                     sortable
                                     label="要求到货日期">
                      <template slot-scope="scope">
                        <el-form-item :prop="'detailList[' + scope.$index + '].expectDate'"
                                      :rules="dataRule.isRequired"
                                      label-width="0px">
                          <el-date-picker v-model="scope.row.expectDate"
                                          type="date"
                                          size="large"
                                          format="yyyy-MM-dd"
                                          value-format="yyyy-MM-dd"
                                          :disabled="isDisabled"></el-date-picker>
                        </el-form-item>
                      </template>

                    </el-table-column>
                    <!-- <el-table-column prop="orderQty"
                                     label="已下单数量"></el-table-column> -->
                    <el-table-column prop="availableQty"
                                     label="国内仓可用库存"></el-table-column>
                    <el-table-column prop="waitQty"
                                     label="累计采购在途数量"></el-table-column>
                    <el-table-column v-if="isClick"
                                     fixed="right"
                                     width="80"
                                     label="操作">
                      <template slot-scope="scope">
                        <!-- <el-button type="primary"
                                   size="small"
                                   circle
                                   title="查看走势图"
                                   @click="ViewChart()">
                          <i class="iconfont erp-icon-sousuo"></i>
                        </el-button> -->
                        <el-button type="danger"
                                   size="small"
                                   circle
                                   title="删除"
                                   @click="deleteHandle(scope)">
                          <i class="iconfont erp-icon-shanchu"></i>
                        </el-button>
                      </template>
                    </el-table-column>
                  </el-table>
                </template>

              </el-tab-pane>
              <el-tab-pane label="源备货明细"
                           name="second">
                <template>
                  <el-table :data="dataForm.srcStockList"
                            stripe
                            border
                            max-height="400"
                            highlight-current-row
                            v-loading="dataListLoading"
                            show-summary
                            :summary-method="getSummariesSrcStock"
                            v-if="activeName2 === 'second'"
                            @selection-change="selectionChangeHandle">
                    <el-table-column type="index"
                                     width="50"
                                     align="center"
                                     label="序号"></el-table-column>
                    <el-table-column prop="platform"
                                     :filters="filterPlatform"
                                     :filter-method="filterHandler"
                                     label="平台"></el-table-column>
                    <el-table-column prop="market"
                                     label="站点"></el-table-column>
                    <el-table-column prop="prodCode"
                                     label="产品编码"></el-table-column>
                    <el-table-column prop="nameCh"
                                     label="产品名称"></el-table-column>
                    <el-table-column prop="inventoryQty"
                                     label="FBA库存">
                      <template slot-scope="scope">
                        <div><span>可售：{{scope.row.inventoryQty}}</span></div>
                        <div><span>在途：{{scope.row.transitQty}}</span></div>
                      </template>
                    </el-table-column>
                    <el-table-column prop="planQty"
                                     label="最近销售情况">
                      <template slot-scope="scope">
                        <div><span>7天：</span></div>
                        <div><span>15天：</span></div>
                        <div><span>30天：</span></div>
                      </template>
                    </el-table-column>
                    <el-table-column prop="unitName"
                                     label="预估销量">
                      <template slot-scope="scope">
                        <div>
                          <span>日销量：{{scope.row.sales}}</span>
                        </div>
                        <div><span>Deal天数：{{scope.row.totalDays}}</span></div>
                        <div><span>Deal总销量：{{scope.row.totalSales}}</span></div>
                      </template>
                    </el-table-column>
                    <el-table-column prop="remainedQty"
                                     label="剩余未发货数量"></el-table-column>
                    <el-table-column prop="leaderAdvice"
                                     label="本次备货数量"></el-table-column>
                    <el-table-column prop="expectDate"
                                     label="要求到货日期"></el-table-column>
                    <el-table-column prop="srcCode"
                                     label="源单单号"></el-table-column>
                  </el-table>
                </template>
              </el-tab-pane>
            </el-tabs>
          </el-col>
        </div>
      </el-form>

      <!-- ===================================== 订单详情 =============================================== -->
      <div slot="footer">
        <el-button @click="visible = false"><i class="iconfont erp-icon-quxiao"></i>取消</el-button>
        <el-button v-if="isClick"
                   type="primary"
                   :disabled="isDisabled"
                   @click="dataFormSubmit()"><i class="iconfont erp-icon-baocun"></i>保存</el-button>
        <el-button v-if="isClick"
                   type="primary"
                   :disabled="isDisabled"
                   @click="workflowSubmit()"><i class="iconfont erp-icon-queren"></i>提交</el-button>
        <el-button type="primary"
                   :disabled="!isShowApproval"
                   v-if="isAprove"
                   @click="workflowApproval()"><i class="iconfont erp-icon-shenhe"></i>审核</el-button>
      </div>
      <!-- 走势图 -->
      <add-details ref="addDetails"
                   @addDetailsList="addList"></add-details>
      <viewChart ref="viewChart"></viewChart>
    </el-dialog>
  </div>
</template>
<script>
import selectSeach from '@/components/erp-select/select-seach'
// 分页
import selectAll from '@/components/erp-select/select-all'
// 添加明细（新组件）
import addDetails from '@/components/add-details/prod-detail.vue'
import _ from 'lodash'
// 引入图片
import tableImg from '@/components/list-table/table-img'
// 查看走势图
import viewChart from '@/components/erp-chart/view-chart'
// 审核
import approvalNew from '@/components/workflow/approval-new'
import { getUrl, getRequest, clearTaskId } from '@/utils'
// 备注组件
import textareaAll from '@/components/erp-input/textarea-all'
export default {
  components: {
    selectSeach,
    selectAll,
    addDetails,
    tableImg,
    viewChart,
    textareaAll,
    approvalNew
  },
  data () {
    return {
      visible: false,
      isShowApproval: false,
      ViewChartVisible: false,
      forbidAdd: false,
      activeName2: 'first',
      isAprove: true,
      filterPlatform: [
        {
          text: '法国第三方平台',
          value: '法国第三方平台'
        },
        {
          text: 'Amazon',
          value: 'Amazon'
        }
      ],
      dataForm: {
        id: '',
        dictPlatformType: '',
        requestDate: '',
        poplanCode: '',
        salesUserId: '',
        deptId: '',
        expectDate: '',
        dictBizStatus: '01',
        dictDocStatus: '01',
        remark: '',
        detailList: [],
        srcStockList: [],
        addTime: '',
        addUser: '',
        updTime: '',
        updUser: '',
        planDate: ''
      },
      // 单据状态
      dictDocStatusOptions: [],
      // 需求仓库
      warehouseIdOptions: [],
      // 计划员
      planUserIdOption: [],
      // ==================== table数据集
      dataListLoading: false,
      // 删除行,多
      dataListSelections: [],
      isDisabled: false,
      isClick: true,
      dataRule: {
        isNatural: [
          { required: true, message: '必填项', trigger: 'blur' },
          { pattern: /^[0-9]\d*$/, message: '整数', trigger: 'change' }
        ],
        isRequired: [
          { required: true, message: '必填项', trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
    init (id, type, parentData) {
      this.activeName2 = 'first'
      this.dataForm.code = ''
      this.dataForm.addTime = ''
      this.dataForm.addUser = ''
      this.dataForm.updTime = ''
      this.dataForm.updUser = ''
      this.dataForm.comfirmUserId = ''
      this.dataForm.comfirmUserTime = null
      this.dataForm.detailList = []
      this.dataForm.srcStockList = []
      this.visible = true
      this.forbidAdd = false
      this.isShowApproval = false // 不显示审核头
      this.dataForm.planUserId = sessionStorage.getItem('userId')
      // 单据状态
      this.$http
        .get(this.$http.adornUrl('basicData/queryDataDict2List'), {
          params: { dataDictKey: 'APPROVAL_STATUS' }
        })
        .then(({ data }) => {
          this.dictDocStatusOptions = data.fontMaps
        })
      // 需求仓库
      this.$http
        .get(this.$http.adornUrl('basicData/queryAllWarehouse'))
        .then(({ data }) => {
          this.warehouseIdOptions = data.warehouses
        })
      this.dataForm.id = id
      this.type = type
      this.$nextTick(() => {
        // table采购订单号==>采购订单编辑=>查看
        if (type === 'receiveList') {
          this.dataForm = parentData
          this.isDisabled = false
          this.type = 'receiveList'
          this.isAprove = false
          return
        }
        // 备货申请生成的采购计划 =》新增
        if (type === 'stockApply') {
          this.isDisabled = false
          this.type = 'stockApply'
          this.dataForm = parentData
          this.forbidAdd = true
          this.isAprove = false
          this.dataForm.planDate = new Date()
        }
        // 查看
        if (type === 'canCheck') {
          this.isDisabled = true
          this.isClick = false
          this.forbidAdd = true
          this.isAprove = false
        } else {
          this.isDisabled = false
          this.isClick = true
          this.isAprove = false
          // 新增时，计划日期默认为当前日期
          if (!this.dataForm.id) {
            this.dataForm.planDate = new Date()
          }
        }
        // 审核
        if (type === 'approve') {
          this.isDisabled = true
          this.isClick = false
          this.isAprove = true
          this.isShowApproval = true // 显示审核头
          this.approvalData = parentData
          // 如果是节点1，则去掉驳回上一级按钮
          if (this.approvalData.node === 'T01' || this.approvalData.node === null) {
            this.approvalData.isShowNode2 = false
            this.approvalData.isShowNode3 = true
            this.isDisabled = true
          } else if (this.approvalData.node === 'T02') {
            this.approvalData.isShowNode2 = true
            this.approvalData.isShowNode3 = true
            this.isDisabled = true
          }
        }
      })
      this.$nextTick(() => {
        if (this.dataForm.id) {
          this.dataListLoading = true
          this.$http({
            url: this.$http.adornUrl(`pur/poplan/info/${this.dataForm.id}`),
            method: 'get',
            params: this.$http.adornParams()
          }).then(({ data }) => {
            if (data && data.code === 0) {
              this.dataForm = data.poPlanDto
              this.planUserIdOption = []
              if (data.poPlanDto.sysUserEntity) {
                this.planUserIdOption.push({
                  id: data.poPlanDto.planUserId,
                  name: data.poPlanDto.sysUserEntity.username
                })
              }
              // 如果有源备货明细则不能新增产品
              if (this.dataForm.srcStockList.length > 0) {
                this.forbidAdd = true
              } else {
                this.forbidAdd = false
              }
            }
          })
          this.dataListLoading = false
        }
      })
    },

    // table方法集
    // 多选
    selectionChangeHandle (val) {
      this.dataListSelections = val
    },
    // 新增 / 修改
    addHandle () {
      this.$nextTick(() => {
        this.$refs.addDetails.init(
          this.dataForm.id,
          this.dataForm.detailList,
          { 'bAssemble': false }
        )
      })
    },
    // 删除=>本地
    deleteHandle (scope) {
      this.dataForm.detailList.splice(scope.$index, 1)
    },
    // 子组件添加的数据
    async addList (list) {
      let ids = []
      list.forEach((item, index) => {
        ids.push(item.id)
      })
      await this.$http({
        url: this.$http.adornUrl(`pur/poplan/initProdByProdId`),
        method: 'post',
        data: ids
      }).then(({ data }) => {
        if (data && data.code === 0) {
          list = data.poDetails || []
        } else {
          this.$notify.error({
            title: '错误',
            message: data.msg,
            duration: 5000
          })
        }
      })
      for (const data of list) {
        this.dataForm.detailList.push(data)
      }
    },
    // 保存
    dataFormSubmit: _.debounce(
      async function dataFormSubmit () {
        if (!(this.dataForm.detailList.length > 0)) {
          this.$notify.error({
            title: '错误',
            message: `明细不能为空`,
            duration: 5000
          })
          return
        }
        this.$refs['dataForm'].validate(valid => {
          if (valid) {
            // 备货中的明细ID（只有备货合成采购的时候才需要传，其他任何情况都不需要）
            if (this.type === 'stockApply') {
              if (this.dataForm.srcStockList) {
                let itemList = []
                for (const item of this.dataForm.srcStockList) {
                  // this.$set(item,'tarPoPlanId',item.tarPoPlanId)
                  itemList.push({ tarPoPlanId: item.tarPoPlanId, id: item.id })
                }
                this.dataForm.srcStockList = itemList
              }
            }
            // 传行号给后台
            for (let i = 0; i < this.dataForm.detailList.length; i++) {
              this.$set(this.dataForm.detailList[i], 'line', i + 1)
            }
            // 进行数据处理
            let dataProcess = Object.assign({}, this.dataForm, {
              detailList: this.dataForm.detailList
            })
            this.$http({
              url: this.$http.adornUrl(
                `pur/poplan/${!this.dataForm.id ? 'save' : 'update'}`
              ),
              method: !this.dataForm.id ? 'post' : 'put',
              data: dataProcess
            }).then(({ data }) => {
              if (data && data.code === 0) {
                this.visible = false
                this.$emit('refreshDataList')
                this.$notify({
                  type: 'success',
                  title: '提示',
                  message: `${
                    !this.dataForm.id ? '新增' : '修改'
                    }成功,单号为:${!data.poPlanDto.code ? data.poPlanDto : data.poPlanDto.code}`,
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
          }
        })
      },
      1000,
      {
        leading: true,
        trailing: false
      }
    ),

    // 表单提交 ==> 确认按钮
    workflowSubmit: _.debounce(
      async function workflowSubmit () {
        if (!(this.dataForm.detailList.length > 0)) {
          this.$notify.error({
            title: '错误',
            message: `明细不能为空`,
            duration: 5000
          })
          return
        }
        this.$refs['dataForm'].validate(valid => {
          if (valid) {
            // 传计划汇总行号给后台
            for (let i = 0; i < this.dataForm.detailList.length; i++) {
              this.$set(this.dataForm.detailList[i], 'line', i + 1)
            }
            // 进行数据处理
            let dataProcess = Object.assign({}, this.dataForm, {
              detailList: this.dataForm.detailList
            }, { routeUrl: getUrl() })
            this.$http({
              url: this.$http.adornUrl(
                `pur/poplan/submit `
              ),
              method: 'post',
              data: dataProcess
            }).then(({ data }) => {
              if (data && data.code === 0) {
                this.visible = false
                this.$emit('refreshDataList')
                this.$notify({
                  type: 'success',
                  title: '提示',
                  message: `提交成功，单号为:${data.entity.code}`,
                  duration: 5000
                })
              } else {
                this.$notify.error({
                  title: '提示',
                  message: '提交失败:' + data.msg,
                  duration: 5000
                })
              }
            })
          }
        })
      },
      1000,
      {
        leading: true,
        trailing: false
      }
    ),

    // 审核 ==> 审核按钮
    workflowApproval: _.debounce(
      async function workflowApproval () {
        // 如果审核驳回发起人，不再去校验字段
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
          this.$refs['dataForm'].validate(valid => {
            if (valid) {
              this.initApproval().then(({ data }) => {
                if (data && data.code === 0) {
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
            }
          })
        }
      }, 1000, {
        leading: true,
        trailing: false
      }),

    // 审核接口
    initApproval () {
      this.approvalData.variablesMap.dictBizStatus = this.dataForm.dictBizStatus
      return this.$http({
        url: this.$http.adornUrl(`pur/poplan/approval`),
        method: 'post',
        data: Object.assign({}, this.dataForm, {
          flowParams: this.approvalData
        })
      })
    },

    // 数据筛选
    handleFilterChange (filters) {

    },
    // 合计计划汇总
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
          if (index == 5 || index == 6 || index == 10 || index == 9 || index == 8) {
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
    filterHandler (value, row, column) {
      const property = column['property']
      return row[property] === value
    },
    // 合计源备货明细
    getSummariesSrcStock (param) {
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
          if (index == 8 || index == 9) {
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
    // 查看走势图
    ViewChart () {
      this.$nextTick(() => {
        // 请求数据的url
        let url = 'prod/prodbasic/list'
        this.$refs.viewChart.init(url)
      })
    }
  }
}
</script>
