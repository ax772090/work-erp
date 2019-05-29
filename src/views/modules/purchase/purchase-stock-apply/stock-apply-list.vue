 <!-- 备货申请（主表） -->
<template>
  <div>
    <el-form :inline="true"
             :model="dataForm"
             @keyup.enter.native="getDataList()">
      <el-row>
        <erp-search-panel v-model="searchData"
                          :searchOptions="searchOptions"
                          @search="getDataList(1)"
                          :isResetHandle="true"
                          @resetHandle="resetHandle(1)"></erp-search-panel>
      </el-row>
      <el-row>
        <el-radio-group :radioListData='dictBizStatusOption'
                        v-model="dictBizStatus"
                        @change="stockAll"></el-radio-group>
      </el-row>
    </el-form>
    <el-row>
      <el-button type="primary"
                 v-if="isAuth('pur:postock:save')"
                 @click="addOrUpdateHandle('','canAdd')"><i class="iconfont erp-icon-xinzeng"></i>新增</el-button>
      <el-button type="danger"
                 v-if="isAuth('pur:postock:delete')"
                 :disabled="isDeleteHandle"
                 @click="deleteHandle()"><i class="iconfont erp-icon-shanchu"></i>删除</el-button>
      <el-button type="primary"
                 v-if="isAuth('pur:postock:stockComposePlan')"
                 :disabled="isMergeOrder"
                 @click="mergePlan()">合并生成采购计划</el-button>
      <el-button type="primary"
                 v-if="isAuth('pur:postock:approval')"
                 :disabled="isbatchReview"
                 @click="batchReview()"><i class="iconfont erp-icon-piliangshenhe"></i>批量审核</el-button>
    </el-row>
    <el-table :data="dataList"
              stripe
              border
              highlight-current-row
              v-loading="dataListLoading"
              @selection-change="selectionChangeHandle"
              @expand-change="rowExpand"
              max-height="800"
              :row-class-name="tableRowClassName">
      <el-table-column type="selection"
                       align="center"
                       header-align="center"
                       width="50"></el-table-column>
      <el-table-column type="expand"
                       label="展开"
                       header-align="center"
                       align="center"
                       width="50">
        <template slot-scope="scope">
          <el-table :data="scope.row.tableDataExpand">
            <el-table-column prop="prodBasicEntity.code"
                             sortable
                             label="产品编码">
            </el-table-column>
            <el-table-column prop="prodBasicEntity.nameCh"
                             label="产品名称"></el-table-column>
            <el-table-column prop="specifications"
                             label="规格型号"></el-table-column>
            <el-table-column prop="allStock"
                             sortable
                             label="总备货数"></el-table-column>
            <el-table-column prop="allStock"
                             label="采购相关">
              <template slot-scope="scope">
                <el-tooltip placement="right"
                            effect="light">
                  <div slot="content">
                    <el-table :data="scope.row.poInfoList"
                              border>
                      <el-table-column prop="nameCh"
                                       label="采购物品"></el-table-column>
                      <el-table-column prop="confirmTime"
                                       label="采购下单日期"
                                       width="100"></el-table-column>
                      <el-table-column prop="qty"
                                       label="采购数量"></el-table-column>
                      <el-table-column prop="expectDate"
                                       width="100"
                                       label="预计到货日期"></el-table-column>
                    </el-table>
                  </div>
                  <p class="pointer">查看</p>
                </el-tooltip>
              </template>
            </el-table-column>
            <el-table-column prop="leaderAdvice"
                             sortable
                             label="最终确认数"></el-table-column>
            <el-table-column prop="stockReason"
                             label="备货原因"></el-table-column>
          </el-table>
        </template>
      </el-table-column>
      <el-table-column prop="code"
                       sortable
                       label="单据编号">
        <template slot-scope="scope">
          <a @click="addOrUpdateHandle(scope.row.id, 'canCheck')"
             class="a-click-hover">{{scope.row.code}}</a>
        </template>
      </el-table-column>
      <el-table-column prop="dictBizStatusValue"
                       width="120"
                       label="业务状态"></el-table-column>
      <el-table-column prop="dictDocStatus"
                       label="单据状态">
        <template slot-scope="scope">
          <a @click="approveDetailHandle(scope.row.id,scope.row)"
             class="a-click-hover">{{scope.row.dictDocStatusValue}}</a>
          <div v-if="scope.row.dictDocStatus === dictDocStatusOption[1].key">({{scope.row.nodeName}})</div>
        </template>
      </el-table-column>
      <el-table-column prop="platform"
                       label="要货平台">
      </el-table-column>
      <el-table-column prop="marketName"
                       label="市场">
      </el-table-column>
      <el-table-column prop="detpName"
                       label="销售部门">
      </el-table-column>
      <el-table-column prop="userName"
                       label="销售员">
      </el-table-column>
      <el-table-column prop="requestDate"
                       sortable
                       label="申请日期"></el-table-column>
      <el-table-column prop="expectDate"
                       sortable
                       label="要求到货日期">
      </el-table-column>
      <el-table-column fixed="right"
                       width="80"
                       label="操作">
        <template slot-scope="scope">
          <el-dropdown :show-timeout="20">
            <span class="el-dropdown-link">
              操作
              <i class="el-icon-arrow-down el-icon--right"></i>
            </span>
            <!-- 01未审核 02审核中 03已审核 04已撤销 -->
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item command="addOrUpdateHandle"
                                v-if="isAuth('pur:postock:update')"
                                :disabled="!(scope.row.dictDocStatus === dictDocStatusOption[0].key || scope.row.dictDocStatus === dictDocStatusOption[3].key)"
                                @click.native="addOrUpdateHandle(scope.row.id,'canEdit')">编辑</el-dropdown-item>
              <el-dropdown-item command="submitHandle"
                                v-if="isAuth('pur:postock:submit')"
                                :disabled="!(scope.row.dictDocStatus === dictDocStatusOption[0].key || scope.row.dictDocStatus === dictDocStatusOption[3].key)"
                                @click.native="submitHandle(scope.row)">提交</el-dropdown-item>
              <el-dropdown-item command="addOrUpdateHandle"
                                v-if="isAuth('pur:postock:approval')"
                                :disabled="!(scope.row.dictDocStatus === dictDocStatusOption[1].key)"
                                @click.native="addOrUpdateHandle(scope.row.id,'approve',scope.row)">审核</el-dropdown-item>
              <el-dropdown-item command="revocationOrder"
                                v-if="isAuth('pur:postock:revokeOrder')"
                                :disabled="!(scope.row.dictDocStatus === dictDocStatusOption[2].key && (scope.row.dictBizStatus === dictBizStatusOption1[1].key || scope.row.dictBizStatus === dictBizStatusOption1[0].key))"
                                @click.native="revocationOrder(scope.row.id)">撤销</el-dropdown-item>
              <el-dropdown-item command="mergeOrder"
                                v-if="isAuth('pur:postock:stockComposePlan')"
                                :disabled="!(scope.row.dictDocStatus === dictDocStatusOption[2].key && scope.row.dictBizStatus === dictBizStatusOption1[1].key)"
                                @click.native="mergePlan(scope.row.id)">生成采购计划</el-dropdown-item>
              <el-dropdown-item command="deleteHandle"
                                v-if="isAuth('pur:postock:delete')"
                                :disabled="!(scope.row.dictDocStatus === dictDocStatusOption[0].key || scope.row.dictDocStatus === dictDocStatusOption[3].key)"
                                @click.native="deleteHandle(scope.row.id)">删除</el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页 -->
    <el-row>
      <pagination-all v-model="paginationData"
                      @paginationChangeHandle="getDataList"></pagination-all>
    </el-row>
    <!-- 弹窗, 新增 / 修改 -->
    <add-or-update ref="addOrUpdate"
                   @refreshDataList="getDataList"></add-or-update>
    <!-- 审核弹窗 -->
    <approval ref="approval"
              @approval="getDataList()"></approval>

    <!-- 弹窗, 审批详情 -->
    <approval-detaile v-if="approvalDetaileVisible"
                      ref="approvalDetaile"></approval-detaile>
    <!-- 审核弹窗(新) -->
    <approval-dialog ref="approvalDialog"
                     @approval="getDataList()"></approval-dialog>
    <!-- 合成采购计划新增 -->
    <purchase-plan-add ref="purchasePlanAdd"
                       @refreshDataList="getDataList"></purchase-plan-add>
  </div>
</template>

<script>
// 搜索
import erpSearchPanel from '@/components/erp-search-panel'
import tableHaederSearch from '@/components/list-table/table-haeder-search'
import tagAll from '@/components/erp-tag/tag-all'
// 分页
import paginationAll from '@/components/erp-pagination/pagination-all'
import AddOrUpdate from './stock-apply-addorupdate'
import approval from '@/components/workflow/approval'
// 审批详情
import approvalDetaile from '@/components/workflow/approval-detaile'
import { initData } from '@/mixins/initData.js'
import { getUrl, getRequest } from '@/utils'
// 批量审核
import approvalDialog from '@/components/workflow/approval-dialog'
// 引入radio组件
import elRadioGroup from '@/components/erp-radio/radio-all'
// 合成采购计划新增
import purchasePlanAdd from '../purchase-plan/plan-addorupdate.vue'

export default {
  mixins: [initData],
  components: {
    erpSearchPanel,
    tableHaederSearch,
    tagAll,
    paginationAll,
    AddOrUpdate,
    approval,
    approvalDialog,
    approvalDetaile,
    elRadioGroup,
    purchasePlanAdd
  },
  data () {
    return {
      // 审批详情
      approvalDetaileVisible: false,
      radio3: '',
      // 表头搜索
      headerSearchData: {},
      // 高级搜索
      searchData: {},
      dictBizStatusOption: [],    // 业务状态
      // 业务状态过滤
      dictBizStatus: '',
      dictDocStatusOption: [{
        key: '01',
        value: '未审核'
      }, {
        key: '02',
        value: '审核中'
      }, {
        key: '03',
        value: '已审核'
      }, {
        key: '04',
        value: '已撤销'
      }],
      dictBizStatusOption1: [{
        key: '00',
        value: '期初补单'
      }, {
        key: '01',
        value: '未下单'
      }, {
        key: '02',
        value: '计划已下达'
      }, {
        key: '03',
        value: '订单已下达'
      }],
      // 下拉
      searchOptions: [{
        label: '销售员',
        value: 'salesUserId',
        inputType: 'el-select-remote',

        httpUrl: '/list/search/user',
        queryKey: 'name',
        dataSource: 'list',
        title: 'salesUserId',
        dataValue: 'id',
        dataLabel: 'name',
        placeholder: '销售员'
      }, {
        label: '产品编码',
        value: 'prodCode',
        inputType: 'el-input'
      }, {
        label: '产品中文名',
        value: 'nameCh',
        inputType: 'el-input'
      }, {
        label: '销售部门',
        value: 'deptId',
        inputType: 'el-cascader',

        httpUrl: 'sys/organization/sortSpecifyNodeId',
        requestParams: { nodeId: sessionStorage.getItem('orgId') },
        dataSource: 'list',
        title: 'deptId',
        dataValue: 'orgId',
        dataLabel: 'name',
        dataChildren: 'subOrgList',
        placeholder: '所属部门'
      }, {
        label: '市场',
        value: 'market',
        inputType: 'el-select',

        httpUrl: 'mwsData/mwsAuthorize',
        dataSource: 'mwsAuthorize',
        title: 'market',
        dataValue: 'id',
        dataLabel: 'displayName',
        placeholder: '市场'
      }, {
        label: '单据编号',
        value: 'code',
        inputType: 'el-input'
      }, {
        label: '单据状态',
        value: 'dictDocStatus',
        inputType: 'el-select',

        httpUrl: 'basicData/queryDataDict2List',
        requestParams: { dataDictKey: 'APPROVAL_STATUS' },
        dataSource: 'fontMaps',
        title: 'dictDocStatus',
        dataValue: 'key',
        dataLabel: 'value',
        placeholder: '单据状态'
      }, {
        label: '要货平台',
        value: 'dictPlatformType',
        inputType: 'el-select',

        httpUrl: 'basicData/queryDataDict2List',
        requestParams: { dataDictKey: 'PLANTFORM_TYPE' },
        dataSource: 'fontMaps',
        title: 'dictPlatformType',
        dataValue: 'key',
        dataLabel: 'value',
        placeholder: '要货平台'
      }, {
        label: '要求到货日期',
        value: 'expectStart,expectEnd',
        inputType: 'el-daterange'
      }, {
        label: '申请日期',
        value: 'requestStart,requestEnd',
        inputType: 'el-daterange'
      }],
      dataForm: {},
      // 数据list体
      dataList: [],

      dataListLoading: false,
      // 多选
      dataListSelections: [],
      tableDataExpand: [], // 展开行
      isDeleteHandle: false, // 删除按钮控制
      isMergeOrder: false, // 合并生成采购订单
      isbatchReview: true  // 批量审核
    }
  },
  created () {
    this.request = getRequest()
    if (this.request.taskId) {
      delete this.request['urlPath']
      this.getDataList(1, 'route', this.request)
    } else {
      this.getDataList()
    }
    this.selectionChangeHandle([])
    // 获取业务状态
    this.$http
      .get(this.$http.adornUrl('basicData/queryDataDict2List'), {
        params: { dataDictKey: 'STOCK_BUSINESS_STATUS' }
      })
      .then(({ data }) => {
        this.dictBizStatusOption = data.fontMaps
        this.dictBizStatusOption.unshift({ key: '', value: '全部' })
      })
  },
  methods: {
    // 设置表头的颜色
    getRowClass ({ row, column, rowIndex, columnIndex }) {
      if (rowIndex === 0) {
        return 'background:#EFEFEF'
      } else {
        return ''
      }
    },
    // 展开行
    rowExpand (row) {
      this.getDetailData(row)
    },
    // 获取展开行数据新
    getDetailData (mainData) {
      this.$http({
        url: this.$http.adornUrl(`pur/postock/info/${mainData.id}`),
        method: 'get'
      }).then(({ data }) => {
        if (data && data.code === 0) {
          this.$set(
            mainData,
            'tableDataExpand',
            data.poStockDto.poStockDetails
          )
        } else {
          this.$notify.error({
            title: '错误',
            message: data.msg,
            duration: 5000
          })
        }
      })
    },
    // 获取数据列表
    getDataList (val, type, searchObj) {
      if (val) {
        this.paginationData.currPage = val
      }

      let searchValue
      if (this.searchData) {
        searchValue = Object.assign({}, searchValue, this.searchData)
      }

      if (this.dictBizStatus) {
        searchValue = Object.assign({}, searchValue, {
          dictBizStatus: this.dictBizStatus
        })
      }

      if (type === 'route') {
        searchValue = Object.assign({}, searchObj)
      }
      this.dataListLoading = true
      this.$http({
        url: this.$http.adornUrl('pur/postock/list'),
        method: 'get',
        params: Object.assign({}, this.paginationData, searchValue)
      }).then(({ data }) => {
        if (data && data.code === 0) {
          this.dataList = data.pageList.dataList
          this.paginationData.totalCount = data.pageList.page.totalCount
          // 初始化，防止点击展开行立马收缩起来
          for (let i = 0; i < this.dataList.length; i++) {
            this.$set(this.dataList[i], 'tableDataExpand', [])
          }
        } else {
          this.dataList = []
          this.paginationData.totalCount = 0
        }
        this.dataListLoading = false
      })
    },

    // 批量审核
    batchReview () {
      for (let i = 0; i < this.dataListSelections.length; i++) {
        this.$set(this.dataListSelections[i], 'businessId', this.dataListSelections[i].id)
        this.$set(this.dataListSelections[i], 'variablesMap', { dictBizStatus: this.dataListSelections[i].dictBizStatus })
        this.$set(this.dataListSelections[i], 'routeUrl', getUrl())
        this.$set(this.dataListSelections[i], 'docName', '备货申请单')
      }
      this.$nextTick(() => {
        this.$refs.approvalDialog.init(this.dataListSelections, 'batchReview')
      })
    },

    // 过滤条件=>全部查询
    stockAll (value) {
      this.dictBizStatus = value
      this.getDataList(1)
    },
    resetHandle () {
      this.dictBizStatus = ''
      // this.headerSearchData = {}
    },

    // 合并生成采购订单
    mergeOrder: _.debounce(
      async function mergeOrder (id) {
        var ids = id
          ? [id]
          : this.dataListSelections.map(item => {
            return item.id
          })
        this.$http({
          url: this.$http.adornUrl('pur/postock/stockComposeInfo'),
          method: 'post',
          data: ids
        }).then(({ data }) => {
          if (data && data.code === 0) {
            let dataArr = data.poInfoCode.join('</br>')
            this.getDataList()
            this.$notify.success({
              dangerouslyUseHTMLString: true,
              title: '提示',
              message: `生成采购订单成功，采购订单单号为：${dataArr}`,
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
      }, 1000, {
        leading: true,
        trailing: false
      }
    ),

    // 合并生成采购计划
    mergePlan (id) {
      var ids = id
        ? [id]
        : this.dataListSelections.map(item => {
          return item.id
        })
      this.$http({
        url: this.$http.adornUrl('pur/postock/stockComposePlan'),
        method: 'post',
        data: ids
      }).then(({ data }) => {
        if (data && data.code === 0) {
          this.$nextTick(() => {
            this.$refs.purchasePlanAdd.init(ids, 'stockApply', data.poPlanDto)
          })
        } else {
          this.$notify.error({
            title: '错误',
            message: data.msg,
            duration: 5000
          })
        }
      })
    },

    // 提交
    submitHandle (row) {
      this.$confirm(`确定要发起审批吗？`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$http({
          url: this.$http.adornUrl(`activiti/submit`),
          method: 'post',
          data: {
            businessId: row.id,
            processKey: 'po_stock_wf',
            routeUrl: getUrl(),
            code: row.code,
            docName: '备货申请单',
            variablesMap: {
              dictBizStatus: row.dictBizStatus
            }
          }
        }).then(({ data }) => {
          if (data && data.code === 0) {
            this.getDataList()
            this.$notify.success({
              title: '提示',
              message: `提交成功`,
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
      })
    },

    // 审核
    auditOrder (row) {
      this.$nextTick(() => {
        this.$refs.stockApprove.init({
          node: row.node,
          taskId: row.taskId,
          operation: '1',
          businessId: row.id,
          processKey: 'po_stock_wf',
          routeUrl: getUrl(),
          code: row.code,
          docName: '备货申请单',
          comments: '',
          variablesMap: {}
        })
      })
    },

    // 审批详情
    approveDetailHandle (id, row) {
      this.approvalDetaileVisible = true
      this.$nextTick(() => {
        this.$refs.approvalDetaile.init(id, row)
      })
    },

    // 撤销
    revocationOrder: _.debounce(
      async function revocationOrder (id) {
        this.$http({
          url: this.$http.adornUrl('pur/postock/revokeOrder'),
          method: 'post',
          data: id
        }).then(({ data }) => {
          if (data && data.code === 0) {
            this.getDataList()
            this.$notify({
              type: 'success',
              title: '提示',
              message: '撤销成功',
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
      }, 1000, {
        leading: true,
        trailing: false
      }
    ),

    // 多选
    selectionChangeHandle (val) {
      this.dataListSelections = val
      if (this.dataListSelections.length <= 0) {
        this.isDeleteHandle = true
        this.isMergeOrder = true
        this.isbatchReview = true
        return
      } else {
        this.isDeleteHandle = false
        this.isMergeOrder = false
      }
      for (var i = 0; i < this.dataListSelections.length; i++) {
        // 删除
        if (!(this.dataListSelections[i].dictDocStatus === '01' || this.dataListSelections[i].dictDocStatus === '04')
        ) {
          this.isDeleteHandle = true
        }
        // 合并生成
        if (!(this.dataListSelections[i].dictDocStatus === '03' && this.dataListSelections[i].dictBizStatus === '01')
        ) {
          this.isMergeOrder = true
        }
      }
      // 批量审批
      this.dataListSelections.every((item, index, arr) => {
        return arr[0].node === arr[index].node && arr[index].node
      })
        ? (this.isbatchReview = false)
        : (this.isbatchReview = true)
    },
    // 新增 / 修改
    addOrUpdateHandle (id, type, row) {
      var obj = {}
      if (type === 'approve') {
        obj = {
          node: row.node,
          taskId: row.taskId,
          operation: '1',
          businessId: row.id,
          processKey: 'po_stock_wf',
          routeUrl: getUrl(),
          code: row.code,
          docName: '备货申请单',
          comments: '',
          variablesMap: {}
        }
      }
      this.$nextTick(() => {
        this.$refs.addOrUpdate.init(id, type, obj)
      })
    },
    // 删除
    deleteHandle (id) {
      var ids = id
        ? [id]
        : this.dataListSelections.map(item => {
          return item.id
        })
      this.$confirm(
        `确定要${id ? '删除' : '批量删除'}所选择的数据信息吗？`,
        '提示',
        {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }
      ).then(() => {
        this.$http({
          url: this.$http.adornUrl('pur/postock/delete'),
          method: 'delete',
          data: this.$http.adornData(ids, false)
        }).then(({ data }) => {
          if (data && data.code === 0) {
            this.getDataList(1)
            this.$notify.success({
              message: '成功',
              message: '删除成功',
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
      })
    },
    tableRowClassName ({ row, rowIndex }) {
      if (rowIndex % 2 === 1) {
        return 'warning-row'
      }
      return ''
    }
  },
  watch: {
    '$route' (to, from) {
      let urlData = getRequest()
      if (urlData.taskId && urlData.urlPath === '/purchase-purchase-stock-apply/stock-apply-list') {
        delete urlData['urlPath']
        this.getDataList(1, 'route', urlData)
      }
    },
    deep: true,
    headerSearchData: {
      handler (val, oldVal) {
        this.searchData = Object.assign({}, this.searchData, val)
      },
      deep: true
    }
  }
}
</script>
<style scoped>
.pointer {
  color: #17b3a3;
  cursor: pointer;
}
</style>
