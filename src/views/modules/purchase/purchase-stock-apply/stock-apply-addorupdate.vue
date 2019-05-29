<template>
  <!-- fullscreen -->
  <el-dialog :title="!dataForm.id ? '备货申请新增' : type === 'approve' ? '审核' : isClick === true ? '备货申请编辑' : '备货申请查看'"
             :close-on-click-modal="false"
             :visible.sync="visible"
             @close="$refs['dataForm'].resetFields()"
             width="90%">
    <!-- 审核头 -->
    <approval-new v-model="approvalData"
                  v-if='isShowApproval'></approval-new>
    <el-form :model="dataForm"
             ref="dataForm"
             :rules="dataRule"
             label-width="110px">
      <el-row>
        <el-col :span="6">
          <el-form-item label="需求平台"
                        prop="dictPlatformType">
            <select-all v-model="dataForm.dictPlatformType"
                        :listDataOption="dictPlatformTypeOption"
                        :isDisabled="isDisabled"
                        data-value="key"
                        data-label="value"></select-all>
          </el-form-item>
          <el-form-item label="选择市场"
                        prop="market">
            <select-all v-model="dataForm.market"
                        :listDataOption="marketOptions"
                        data-value="id"
                        :isDisabled="isDisabled"
                        data-label="displayName"
                        :isSelectChange="true"></select-all>
          </el-form-item>
          <el-form-item label="销售员"
                        prop="salesUserId">
            <select-seach v-model="dataForm.salesUserId"
                          httpUrl="list/search/user"
                          httpMethod="get"
                          data-label="name"
                          data-value="id"
                          data-source="list"
                          requestParamsKey="name"
                          :isDisabled="isDisabled"
                          :isSelectChange="true"
                          @selectChange="salesUserIdChange"></select-seach>
          </el-form-item>

        </el-col>
        <el-col :span="6">
          <el-form-item label="申请日期"
                        prop="requestDate">
            <el-date-picker v-model="dataForm.requestDate"
                            type="date"
                            format="yyyy-MM-dd"
                            value-format="yyyy-MM-dd"
                            :disabled="isDisabled"></el-date-picker>
          </el-form-item>
          <el-form-item label="要求到货日期"
                        :rules="dataRule.isDate"
                        prop="expectDate">
            <el-date-picker v-model="dataForm.expectDate"
                            type="date"
                            format="yyyy-MM-dd"
                            value-format="yyyy-MM-dd"
                            :disabled="isDisabled"></el-date-picker>
          </el-form-item>
          <el-form-item label="销售部门"
                        prop="deptId">
            <el-cascader v-model="deptId"
                         :options="deptIdOption"
                         :props="{value: 'orgId', label: 'name', children: 'subOrgList'}"
                         :disabled="true"></el-cascader>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="单据编号"
                        prop="code">
            <el-input v-model="dataForm.code"
                      :disabled="true"
                      placeholder="系统自动生成"></el-input>
          </el-form-item>
          <el-form-item label="业务状态"
                        prop="dictBizStatus">
            <select-all v-model="dataForm.dictBizStatus"
                        :listDataOption="dictBizStatusOption"
                        :isDisabled="true"
                        data-value="key"
                        data-label="value"></select-all>
          </el-form-item>
          <el-form-item label="单据状态"
                        prop="dictDocStatus">
            <select-all v-model="dataForm.dictDocStatus"
                        :listDataOption="dictDocStatusOption"
                        :isDisabled="true"
                        data-value="key"
                        data-label="value"></select-all>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="期初补单">
            <el-switch v-model="dataForm.dictBizStatus"
                       :disabled="isDisabled"
                       active-color="#13ce66"
                       inactive-color="#ff4949"
                       active-value="00"
                       inactive-value="01"
                       active-text="是"
                       inactive-text="否"></el-switch>
          </el-form-item>
          <el-form-item label="备注"
                        prop="remark">
            <textarea-all v-model="dataForm.remark"
                          :disabled="isDisabled"></textarea-all>
          </el-form-item>
        </el-col>
      </el-row>
      <!-- ============================== 采购详情 ============================= -->
      <div>
        <el-button type="text"
                   v-if="isClick"
                   :disabled="isDisabled"
                   class="mb-10"
                   @click="addHandle()">
          <i class="iconfont erp-icon-tianjiamingxi"></i>添加明细行</el-button>
        <el-table :data="dataForm.poStockDetails"
                  stripe
                  border
                  max-height="400"
                  highlight-current-row
                  :cell-style="cellStyle"
                  v-loading="dataListLoading"
                  show-summary
                  :summary-method="getSummaries"
                  @selection-change="selectionChangeHandle"
                  fit
                  id="table__one"
                  class="tableInfo">
          <el-table-column type="index"
                           align="center"
                           label="序号"
                           width="50"></el-table-column>
          <el-table-column label="自定义SKU">
            <template slot-scope="scope">
              <div class="red">{{scope.row.prodCode}}</div>
              <div>{{scope.row.prodName}}</div>
            </template>
          </el-table-column>
          <el-table-column prop="specifications"
                           label="规格型号"></el-table-column>
          <el-table-column label="库存"
                           width="150">
            <template slot-scope="scope">
              <el-form-item label-width="50px"
                            label="仓库">
                <select-all v-model="scope.row.warehouseId"
                            :listDataOption="warehouseOption"
                            :isDisabled="isDisabled"
                            data-value="id"
                            data-label="name"></select-all>
              </el-form-item>
              <el-form-item :prop="'poStockDetails[' + scope.$index + '].inventoryQty'"
                            :rules="dataRule.isPosInteger"
                            label-width="50px"
                            label="现有">
                <el-input v-model.number="scope.row.inventoryQty"
                          @input="allStock(scope)"
                          :disabled="isDisabled"
                          type="Number"
                          @mousewheel.native.prevent></el-input>
              </el-form-item>
              <el-form-item :prop="'poStockDetails[' + scope.$index + '].transitQty'"
                            :rules="dataRule.isPosInteger"
                            label-width="50px"
                            label="在途">
                <el-input v-model.number="scope.row.transitQty"
                          @input="allStock(scope)"
                          type="Number"
                          @mousewheel.native.prevent
                          :disabled="isDisabled"></el-input>
              </el-form-item>
            </template>
          </el-table-column>
          <el-table-column label="15天销量"
                           width="150">
            <template slot-scope="scope">
              <el-form-item label="最高"
                            :prop="'poStockDetails[' + scope.$index + '].halfSalesMax'"
                            :rules="dataRule.isPosInteger"
                            label-width="50px">
                <el-input v-model.number="scope.row.halfSalesMax"
                          type="Number"
                          @mousewheel.native.prevent
                          :disabled="isDisabled"></el-input>
              </el-form-item>
              <el-form-item label="最低"
                            :prop="'poStockDetails[' + scope.$index + '].halfSales'"
                            :rules="dataRule.isPosInteger"
                            label-width="50px">
                <el-input v-model.number="scope.row.halfSales"
                          type="Number"
                          @mousewheel.native.prevent
                          :disabled="isDisabled"></el-input>
              </el-form-item>

              <el-form-item label="日均"
                            :prop="'poStockDetails[' + scope.$index + '].halfSalesMin'"
                            :rules="dataRule.isPosInteger"
                            label-width="50px">
                <el-input v-model.number="scope.row.halfSalesMin"
                          type="Number"
                          @mousewheel.native.prevent
                          :disabled="isDisabled"></el-input>
              </el-form-item>
            </template>
          </el-table-column>
          <el-table-column prop="expectSales"
                           label="预估销量">
            <template slot-scope="scope">
              <el-form-item :prop="'poStockDetails[' + scope.$index + '].expectSales'"
                            :rules="dataRule.isNatural"
                            label-width="0px">
                <el-input v-model.number="scope.row.expectSales"
                          type="Number"
                          @mousewheel.native.prevent
                          @input="monthStock(scope)"
                          :disabled="isDisabled"></el-input>
              </el-form-item>
            </template>
          </el-table-column>
          <el-table-column label="预计Deal"
                           width="180">
            <template slot-scope="scope">
              <el-form-item label="总天数"
                            :prop="'poStockDetails[' + scope.$index + '].expectTotalDays'"
                            :rules="dataRule.isPosInteger"
                            label-width="80px">
                <el-input v-model.number="scope.row.expectTotalDays"
                          type="Number"
                          @mousewheel.native.prevent
                          @input="needStock(scope)"
                          :disabled="isDisabled"></el-input>
              </el-form-item>
              <el-form-item label="总销量"
                            :prop="'poStockDetails[' + scope.$index + '].expectTotalSales'"
                            :rules="dataRule.isPosInteger"
                            label-width="80px">
                <el-input v-model.number="scope.row.expectTotalSales"
                          type="Number"
                          @mousewheel.native.prevent
                          @input="needStock(scope)"
                          :disabled="isDisabled"></el-input>
              </el-form-item>
              <el-form-item label="产品交期"
                            :prop="'poStockDetails[' + scope.$index + '].deliveryDays'"
                            :rules="dataRule.isIntegerNatural"
                            label-width="80px">
                <el-input v-model.number="scope.row.deliveryDays"
                          type="Number"
                          @mousewheel.native.prevent
                          @input="needStock(scope)"
                          :disabled="isDisabled"></el-input>
              </el-form-item>
            </template>
          </el-table-column>
          <el-table-column prop="transDays"
                           label="产品物流时间(天)">
            <template slot-scope="scope">
              <el-form-item label-width="0px">
                <select-all v-model="scope.row.dictTransType"
                            :listDataOption="dictTransTypeOption"
                            :isDisabled="isDisabled"
                            data-value="key"
                            data-label="value"></select-all>
              </el-form-item>
              <el-form-item :prop="'poStockDetails[' + scope.$index + '].transDays'"
                            :rules="dataRule.isInteger"
                            label-width="0px">
                <el-input v-model.number="scope.row.transDays"
                          type="Number"
                          @mousewheel.native.prevent
                          @input="needStock(scope)"
                          :disabled="isDisabled"></el-input>
              </el-form-item>
            </template>
          </el-table-column>
          <el-table-column label="必备现有库存数量"
                           width="200">
            <template slot-scope="scope">
              <div>
                <el-tooltip placement="top"
                            effect="light">
                  <div slot="content">(产品物流时间+产品交期-Deal总天数）*预估销量+预计Deal总销量</div>
                  <i class="el-icon-question erpicon-colse"></i>
                </el-tooltip>
                <span class="padd">必备现有库存数量:</span>
                {{scope.row.needStock}}
              </div>
              <div>
                <el-tooltip placement="top"
                            effect="light">
                  <div slot="content">30天备货数量=30*预估数量</div>
                  <i class="el-icon-question erpicon-colse"></i>
                </el-tooltip>
                <span class="padd">30天备货数量:</span>
                {{scope.row.monthStock}}
              </div>
              <div>
                <el-tooltip placement="top"
                            effect="light">
                  <div slot="content">总备货数量=30天备货数量+必备现有库存数量-在途库存-现有库存</div>
                  <i class="el-icon-question erpicon-colse"></i>
                </el-tooltip>
                <span class="padd">总备货数量:</span>
                {{scope.row.allStock}}
              </div>
            </template>
          </el-table-column>
          <el-table-column label="最终确认数"
                           prop="leaderAdvice">
            <template slot-scope="scope">
              <el-form-item :prop="'poStockDetails[' + scope.$index + '].leaderAdvice'"
                            :rules="dataRule.isIntegerNatural"
                            label-width="0px">
                <el-input v-model.number="scope.row.leaderAdvice"
                          type="Number"
                          @mousewheel.native.prevent
                          :disabled="confirmQtyDisable"></el-input>
              </el-form-item>
            </template>
          </el-table-column>
          <el-table-column prop="stockReason"
                           label="备货原因"
                           width="100">
            <template slot-scope="scope">
              <el-form-item label-width="0px">
                <textarea-all v-model="scope.row.stockReason"
                              :autosize='[4,4]'
                              :disabled="confirmQtyDisable"></textarea-all>
              </el-form-item>
            </template>
          </el-table-column>
          <el-table-column prop="adviceReason"
                           label="原因"
                           width="100">
            <template slot-scope="scope">
              <el-form-item label-width="0px">
                <textarea-all v-model="scope.row.adviceReason"
                              :autosize='[4,4]'
                              :disabled="isDisabled"></textarea-all>
              </el-form-item>
            </template>
          </el-table-column>
          <el-table-column fixed="right"
                           label="操作"
                           v-if="isClick">
            <template slot-scope="scope">
              <el-button type="danger"
                         circle
                         title="删除"
                         :disabled="isDisabled"
                         @click="deleteHandle(scope)">
                <i class="iconfont erp-icon-shanchu"></i>
              </el-button>
            </template>
          </el-table-column>
        </el-table>
        <!-- 添加明细 -->
        <add-details ref="addDetails"
                     @addDetailsList="addList"></add-details>
      </div>
    </el-form>

    <span slot="footer"
          class="dialog-footer">
      <el-button @click="visible = false"><i class="iconfont erp-icon-quxiao"></i>取消</el-button>
      <el-button v-if="isClick"
                 type="primary"
                 :disabled="isDisabled"
                 @click="dataFormSave()"><i class="iconfont erp-icon-baocun"></i>保存</el-button>
      <el-button v-if="isAuth('pur:postock:submit') && isClick"
                 type="primary"
                 :disabled="isDisabled"
                 @click="workflowSubmit()"><i class="iconfont erp-icon-queding"></i>提交</el-button>
      <el-button type="primary"
                 v-if="isAprove"
                 :disabled="!isShowApproval"
                 @click="workflowApproval()"><i class="iconfont erp-icon-shenhe"></i>审核</el-button>
    </span>
  </el-dialog>
</template>
<script>
// 下拉,不带接口
import selectAll from '@/components/erp-select/select-all'
import selectSeach from '@/components/erp-select/select-seach'
import approvalNew from '@/components/workflow/approval-new'
// 添加明细（新组件）
import addDetails from '@/components/add-details/prod-detail'
import { getUrl, deptCascader, dateFormatter, clearTaskId } from '@/utils'
// 备注组件
import textareaAll from '@/components/erp-input/textarea-all'

export default {
  props: ['value'],
  components: {
    selectAll,
    selectSeach,
    approvalNew,
    addDetails,
    textareaAll
  },
  data () {
    return {
      deptId: [], // 部门数组
      confirmQtyDisable: false, // 最终确认数量和原因是否可编辑
      isShowApproval: false, // 审核头是否显示
      visible: false,
      isClick: true,
      isAprove: true,
      isDisabled: false,
      orgId: '', // 公司Id
      dataForm: {
        id: '',
        dictPlatformType: '01',
        requestDate: dateFormatter(new Date(), false),
        code: '',
        salesUserId: '',
        deptId: '',
        expectDate: '',
        dictBizStatus: '01',
        dictDocStatus: '01',
        remark: '',

        // 采购详情
        poStockDetails: [
          {
            leaderAdvice: ''
          }
        ]
      },
      // 采购详情数据
      // 查找时建议框的数据
      // salesUserIdOption: [],
      // 需求平台
      dictPlatformTypeOption: [],
      // 所属部门
      deptIdOption: [],
      // 业务状态
      dictBizStatusOption: [],
      // 单据状态
      dictDocStatusOption: [],
      // 市场
      marketOptions: [],

      // ==================================== table数据
      // 产品物流方式
      dictTransTypeOption: [],
      // 海外仓库
      warehouseOption: [],

      dataListLoading: false,
      // 删除行,多选情况
      dataListSelections: [],
      dataRule: {
        isDate: [
          { required: true, message: '必填项', trigger: 'blur' }
        ],
        dictPlatformType: [
          { required: true, message: '必填项', trigger: 'change' }
        ],
        isPosInteger: [
          {
            pattern: /^([1-9]\d*|[0]{1,1})$/,
            message: '整数',
            trigger: 'change'
          }
        ],
        isInteger: [
          { pattern: /^[1-9]\d*$/, message: '正整数', trigger: 'change' }
        ],
        isIntegerNatural: [
          { required: true, message: '必填项', trigger: 'change' },
          { pattern: /^[1-9]\d*$/, message: '正整数', trigger: 'change' }
        ],
        isNatural: [
          { required: true, message: '必填项', trigger: 'change' },
          {
            transform: Number,
            pattern: /^\d+$/,
            message: '整数',
            trigger: 'change'
          }
        ]

      }
    }
  },
  methods: {
    getDataUrl () {
      this.$http
        .get(this.$http.adornUrl('basicData/queryDataDict2List'), {
          params: { dataDictKey: 'PLANTFORM_TYPE' }
        })
        .then(({ data }) => {
          this.dictPlatformTypeOption = data.fontMaps
        })
      this.$http
        .get(this.$http.adornUrl('basicData/queryDataDict2List'), {
          params: { dataDictKey: 'STOCK_BUSINESS_STATUS' }
        })
        .then(({ data }) => {
          this.dictBizStatusOption = data.fontMaps
        })
      this.$http
        .get(this.$http.adornUrl('basicData/queryDataDict2List'), {
          params: { dataDictKey: 'APPROVAL_STATUS' }
        })
        .then(({ data }) => {
          this.dictDocStatusOption = data.fontMaps
        })
      // 市场
      this.$http
        .get(this.$http.adornUrl('mwsData/mwsAuthorize'))
        .then(({ data }) => {
          this.marketOptions = data.mwsAuthorize
        })
      // table数据
      // 物流方式
      this.$http
        .get(this.$http.adornUrl('basicData/queryDataDict2List'), {
          params: { dataDictKey: 'TRANSPORT_MODE' }
        })
        .then(({ data }) => {
          this.dictTransTypeOption = data.fontMaps
        })
      // 海外仓仓库
      this.$http
        .get(this.$http.adornUrl('basicData/queryAllWarehouse'))
        .then(({ data }) => {
          this.warehouseOption = data.warehouses
        })
    },
    init (id, type, parentData) {
      this.dataForm.code = ''
      this.dataForm.addTime = ''
      this.dataForm.addUser = ''
      this.dataForm.updTime = ''
      this.dataForm.updUser = ''
      this.confirmQtyDisable = false
      this.getDataUrl()
      this.dataForm.id = id
      this.visible = true
      this.dataForm.poStockDetails = []
      this.type = type
      this.isShowApproval = false // 不显示审核头

      // table采购订单号==>采购订单编辑=>查看
      if (type === 'receiveList') {
        this.dataForm = parentData
        this.isDisabled = false
        this.isAprove = false
      }
      // 直接查看
      if (type === 'canCheck' && this.dataForm.id) {
        this.initCheck(id)
      }
      // 审核
      if (type === 'approve') {
        this.initApprovalData(id, parentData)
      }
      // 新增
      if (type === 'canAdd') {
        this.initAdd()
      }
      // 编辑
      if (this.dataForm.id && type === 'canEdit') {
        this.initEdit(id)
      }
    },
    // 审核
    initApprovalData (id, parentData) {
      this.getDataList(id)
      this.isAprove = true
      this.isClick = false
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
      } else if (this.approvalData.node === 'T03' || this.approvalData.node === 'T04') {
        this.approvalData.isShowNode2 = true
        this.approvalData.isShowNode3 = true
        this.isDisabled = true
        // 最终确认数量和原因不可编辑
        this.confirmQtyDisable = true
      }
    },
    // 查看
    initCheck (id) {
      this.getDataList(id)
      this.isDisabled = true
      this.isClick = false
      this.confirmQtyDisable = true
      this.isAprove = false
    },

    // 编辑
    initEdit (id) {
      this.getDataList(id)
      this.isDisabled = false
      this.isClick = true
      this.isAprove = false
    },

    // 新增
    initAdd () {
      this.isDisabled = false
      this.isClick = true
      this.isAprove = false
      // 新增
      this.dataForm.salesUserId = sessionStorage.getItem('userId') // 新增默认当前用户
      // this.orgId = sessionStorage.getItem("orgId"); //新增默认当前用户
      // 部门
      this.$http({
        url: this.$http.adornUrl('pur/postock/initAdd'),
        method: 'get'
        // params: this.$http.adornParams({}, false)
      }).then(({ data }) => {
        if (data && data.code === 0) {
          this.dataForm.deptId = data.entity.deptId
          this.dataForm.salesUserId = data.entity.userId
        }
      })
    },
    // 数据调用
    getDataList (id) {
      this.$http({
        url: this.$http.adornUrl(`pur/postock/info/${id}`),
        method: 'get'
      }).then(({ data }) => {
        if (data && data.code === 0) {
          this.dataForm = data.poStockDto
          let details = data.poStockDto.poStockDetails
          for (let i = 0; i < details.length; i++) {
            this.$set(details[i], 'prodName', details[i].prodBasicEntity.nameCh)
            this.$set(details[i], 'prodCode', details[i].prodBasicEntity.code)
            this.$set(details[i], 'specifications', details[i].prodBasicEntity.specifications)
          }
        }
      })
    },
    // 选择人员后,显示当前部门
    salesUserIdChange (item) {
      if (!item) {
        return
      }
      // 部门（新接口-级联）
      this.$http.get(this.$http.adornUrl(`sys/organization/sortSpecifyNodeId`), { params: { nodeId: item.compId } }).then(({ data }) => {
        this.deptIdOption = data.list
        // 对于‘查看’操作，这里直接拿数据库返回的levelPathArray，而不是拿查询返回的数据（新增，编辑用这种方式）
        if (this.type === 'isDisabled') {
          this.deptId = this.dataForm.sysOrganizationEntity.levelPathArray
        } else {
          let levelPathArray = deptCascader(data.list, item.deptId, 'subOrgList')
          levelPathArray.splice(0, 2)
          this.deptId = levelPathArray
        }
      })
    },

    // 多选
    selectionChangeHandle (val) {
      this.dataListSelections = val
    },

    // 新增 / 修改
    addHandle (id) {
      this.$nextTick(() => {
        this.$refs.addDetails.init(
          this.dataForm.id,
          this.dataForm.poStockDetails,
          { dictPlatformType: this.dataForm.dictPlatformType }
        )
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
          if (index === 8) {
            sums[index] = sums[index] === 0 ? '' : sums[index]
            console.log(sums[index])
          } else {
            sums[index] = ''
          }
        } else {
          sums[index] = ''
        }
      })

      return sums
    },

    // 子组件添加的数据
    addList (list) {
      list = list.map(item => {
        return {
          sellerSkuId: item.id,
          prodId: item.prodId,
          prodCode: item.prodCode,
          prodName: item.nameCh,
          expectSales: '',
          monthStock: '',
          deliveryDays: '',
          transDays: 0,
          expectTotalDays: '',
          expectTotalSales: '',
          needStock: '',
          transitQty: '',
          inventoryQty: '',
          allStock: '',
          leaderAdvice: '',
          prodId: item.id,
          specifications: item.specifications
        }
      })
      for (const data of list) {
        let isFind = false
        for (const item of this.dataForm.poStockDetails) {
          if (data.sellerSkuId === item.sellerSkuId) {
            isFind = true
            break
          }
        }
        if (!isFind) {
          this.dataForm.poStockDetails.push(data)
        }
      }
    },

    // 删除=>本地
    deleteHandle (scope) {
      this.dataForm.poStockDetails.splice(scope.$index, 1)
    },

    // 30天备货数量==>数据动态计算
    monthStock (scope) {
      let row = scope.row
      // 30天备货数量=30*预估数量
      let monthStockComputed = Number(row.expectSales) * 30
      row.monthStock = monthStockComputed <= 0 || isNaN(monthStockComputed) ? '' : monthStockComputed
      this.needStock(scope)
      this.allStock(scope)
    },

    // 必备现有库存==>数据动态计算
    needStock (scope) {
      let row = scope.row
      // (产品物流时间+产品交期-Deal总天数）*预估销量+预计Deal总销量
      // if (!row.deliveryDays) {
      //   row.deliveryDays = 0
      // }
      if (!row.transDays) {
        row.transDays = 0
      }
      // if (!row.expectTotalDays) {
      //   row.expectTotalDays = 0
      // }
      // if (!row.expectSales) {
      //   row.expectSales = 0
      // }
      // if (!row.expectTotalSales) {
      //   row.expectTotalSales = 0
      // }
      // if (!row.needStock) {
      //   row.needStock = 0
      // }
      var needStockComputed =
        (Number(row.deliveryDays) +
          Number(row.transDays) -
          Number(row.expectTotalDays)) *
        Number(row.expectSales) +
        Number(row.expectTotalSales)
      row.needStock = needStockComputed <= 0 || isNaN(needStockComputed) ? '' : needStockComputed
      this.allStock(scope)
    },

    // 总备货数量
    allStock (scope) {
      let row = scope.row
      // 总备货数量=30天备货数量+必备现有库存数量-在途库存-现有库存
      // if (!row.monthStock) {
      //   row.monthStock = 0
      // }
      // if (!row.needStock) {
      //   row.needStock = 0
      // }
      // if (!row.transitQty) {
      //   row.transitQty = 0
      // }
      // if (!row.inventoryQty) {
      //   row.inventoryQty = 0
      // }
      // if (!row.allStock) {
      //   row.allStock = 0
      // }
      var allStockComputed =
        Number(row.monthStock) +
        Number(row.needStock) -
        Number(row.transitQty) -
        Number(row.inventoryQty)
      row.allStock = allStockComputed <= 0 || isNaN(allStockComputed) ? '' : allStockComputed
      row.leaderAdvice = row.allStock
    },

    // 表单提交 ==> 保存按钮
    dataFormSave: _.debounce(
      async function dataFormSave () {
        if (!(this.dataForm.poStockDetails.length > 0)) {
          this.$notify.error({
            title: '错误',
            message: `明细不能为空`,
            duration: 5000
          })
          return
        }
        for (const item of this.dataForm.poStockDetails) {
          if (!(item.allStock > 0)) {
            this.$notify.error({
              title: '错误',
              message: `总备货数量须大于0`,
              duration: 5000
            })
            return
          }
        }
        if (this.dataForm.dictPlatformType === '01') {
          if (!this.dataForm.market) {
            this.$notify.error({
              title: '错误',
              message: `选择市场不能为空`,
              duration: 5000
            })
            return
          }
        }
        this.$refs['dataForm'].validate(valid => {
          if (valid) {
            this.$http({
              url: this.$http.adornUrl(`/pur/postock/${!this.dataForm.id ? 'save' : 'update'}`),
              method: !this.dataForm.id ? 'post' : 'put',
              data: Object.assign({}, this.dataForm, {
                poStockDetails: this.dataForm.poStockDetails
              })
            }).then(({ data }) => {
              if (data && data.code === 0) {
                this.visible = false
                this.$emit('refreshDataList')
                this.$notify({
                  type: 'success',
                  title: '提示',
                  message: `${
                    !this.dataForm.id ? '新增' : '修改'
                    }成功, 编码为:${data.entity.code}`,
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
      }, 1000, {
        leading: true,
        trailing: false
      }
    ),

    // 表单提交 ==> 提交按钮
    workflowSubmit: _.debounce(
      async function workflowSubmit () {
        if (!(this.dataForm.poStockDetails.length > 0)) {
          this.$notify.error({
            title: '错误',
            message: `明细不能为空`,
            duration: 5000
          })
          return
        }
        for (const item of this.dataForm.poStockDetails) {
          if (!(item.allStock > 0)) {
            this.$notify.error({
              title: '错误',
              message: `总备货数量须大于0`,
              duration: 5000
            })
            return
          }
        }
        if (this.dataForm.dictPlatformType === '01') {
          if (!this.dataForm.market) {
            this.$notify.error({
              title: '错误',
              message: `选择市场不能为空`,
              duration: 5000
            })
            return
          }
        }
        this.$refs['dataForm'].validate(valid => {
          if (valid) {
            let flowParams = {
              processKey: 'po_stock_wf',
              routeUrl: getUrl(),
              docName: '备货申请单'
            }
            this.$http({
              url: this.$http.adornUrl(`pur/postock/submit`),
              method: 'post',
              data: Object.assign({}, this.dataForm, {
                flowParams: flowParams
              })
            }).then(({ data }) => {
              if (data && data.code === 0) {
                this.visible = false
                this.$emit('refreshDataList')
                this.$notify.success({
                  title: '提示',
                  message: `提交成功, 编码为:${data.entity.code}`,
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
      }, 1000, {
        leading: true,
        trailing: false
      }
    ),

    // 审核接口
    initApproval () {
      this.approvalData.variablesMap.dictBizStatus = this.dataForm.dictBizStatus
      return this.$http({
        url: this.$http.adornUrl(`pur/postock/approval`),
        method: 'post',
        data: Object.assign({}, this.dataForm, {
          poStockDetails: this.dataForm.poStockDetails
        }, {
            flowParams: this.approvalData
          })
      })
    },

    // 审核 ==> 审核按钮
    workflowApproval: _.debounce(
      async function workflowApproval () {
        if (!(this.dataForm.poStockDetails.length > 0)) {
          this.$notify.error({
            title: '错误',
            message: `明细不能为空`,
            duration: 5000
          })
          return
        }
        for (const item of this.dataForm.poStockDetails) {
          if (!(item.allStock > 0)) {
            this.$notify.error({
              title: '错误',
              message: `总备货数量须大于0`,
              duration: 5000
            })
            return
          }
        }

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
            }
          })
        }
      }, 1000, {
        leading: true,
        trailing: false
      }),

    // 改变表格里面的样式
    cellStyle ({ row, column, rowIndex, columnIndex }) {
      if (columnIndex === 0) {
        // 指定坐标
        return 'height:100%'
      }
      if (columnIndex === 9) {
        // 指定坐标
        return 'text-align:center'
      }
    }
  }
}
</script>

<style scoped>
.padd {
  padding: 0 5px;
}
.red {
  color: red;
}
</style>
