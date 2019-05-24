<!-- 采购付款申请 -->
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
                          @resetHandle="resetHandle()"></erp-search-panel>
      </el-row>
      <el-row>
        <el-radio-group :radioListData='docTypeOption'
                        v-model="docType"
                        @change="stockAll"></el-radio-group>
      </el-row>
      <el-row>
        <el-button v-if="isAuth('fin:finpopayment:save')"
                   type="primary"
                   @click="editHandle('','canAdd')"><i class="iconfont erp-icon-xinzeng"></i>新增</el-button>
      </el-row>
    </el-form>
    <el-table stripe
              border
              highlight-current-row
              :data="dataList"
              v-loading="dataListLoading"
              @selection-change="selectionChangeHandle">
      <el-table-column prop="code"
                       label="单据编号"
                       min-width="180"
                       sortable>
        <template slot-scope="scope">
          <a @click="editHandle(scope.row.id, 'canCheck')"
             class="a-click-hover">{{scope.row.code}}</a>
        </template>
      </el-table-column>
      <el-table-column prop="docTypeName"
                       label="单据类型"
                       min-width="100px"></el-table-column>
      <el-table-column prop="supplierName"
                       label="供应商"
                       sortable
                       min-width="200px"></el-table-column>
      <el-table-column prop="requestDate"
                       label="申请日期"
                       min-width="100px"></el-table-column>
      <el-table-column prop="payDate"
                       label="付款日期"
                       min-width="100px"></el-table-column>
      <el-table-column prop="currencyName"
                       label="结算币别"
                       min-width="100px"></el-table-column>
      <el-table-column prop="paymentModeName"
                       label="付款方式"
                       min-width="80px"></el-table-column>
      <el-table-column prop="payAmount"
                       label="付款金额"
                       sortable
                       min-width="100px"></el-table-column>
      <el-table-column prop="compName"
                       label="付款公司"
                       min-width="200px"></el-table-column>
      <el-table-column prop="dictDocStatusName"
                       label="单据状态"
                       sortable
                       min-width="120px">
        <template slot-scope="scope">
          <a @click="approveDetailHandle(scope.row.id,scope.row)"
             class="a-click-hover">{{scope.row.dictDocStatusName}}</a>
          <el-row v-if="scope.row.dictDocStatus === dictDocStatusOption[1].key">
            ({{scope.row.nodeName}})
          </el-row>
        </template>
      </el-table-column>
      <el-table-column label="操作"
                       fixed="right"
                       width="80">
        <template slot-scope="scope">
          <el-dropdown :show-timeout="20">
            <span class="el-dropdown-link">操作
              <i class="el-icon-arrow-down el-icon--right"></i>
            </span>
            <!-- 未审核,审核中,已审核,已撤销 -->
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item v-if="isAuth('fin:finpopayment:update')"
                                command="update"
                                :disabled="!(scope.row.dictDocStatus === dictDocStatusOption[0].key || scope.row.dictDocStatus === dictDocStatusOption[3].key)"
                                @click.native="editHandle(scope.row.id, 'canEdit')">编辑</el-dropdown-item>
              <el-dropdown-item v-if="isAuth('fin:finpopayment:submit')"
                                :disabled="!(scope.row.dictDocStatus === dictDocStatusOption[0].key || scope.row.dictDocStatus === dictDocStatusOption[3].key)"
                                command="checked"
                                @click.native="checkedHandle(scope.row.id)">提交</el-dropdown-item>
              <el-dropdown-item v-if="isAuth('fin:finpopayment:approvaltemp')"
                                :disabled="!(scope.row.dictDocStatus === dictDocStatusOption[1].key)"
                                command="uncheck"
                                @click.native="approvalHandle(scope.row.id, 'canApproval', scope.row)">审核</el-dropdown-item>
              <el-dropdown-item v-if="isAuth('fin:finpopayment:repealsapproval')"
                                :disabled="!(scope.row.dictDocStatus === dictDocStatusOption[1].key)"
                                command="revocationApproval"
                                @click.native="revocationApproval(scope.row.id, 'canRevocationApproval', scope.row)">撤回审核</el-dropdown-item>
              <el-dropdown-item v-if="isAuth('fin:finpopayment:revoke')"
                                :disabled="!(scope.row.dictDocStatus === dictDocStatusOption[2].key)"
                                command="undone"
                                @click.native="undoneHandle(scope.row.id, 'canUndone', scope.row)">撤销</el-dropdown-item>
              <el-dropdown-item v-if="isAuth('fin:finpopayment:delete')"
                                :disabled="!(scope.row.dictDocStatus === dictDocStatusOption[0].key || scope.row.dictDocStatus === dictDocStatusOption[3].key)"
                                command="delete"
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
    <!-- 弹窗,修改 -->
    <payment-edit v-if="paymentEdit"
                  ref="paymentEdit"
                  @refreshDataList="getDataList"></payment-edit>
    <!-- 弹窗, 审批详情 -->
    <approval-detaile v-if="approvalDetaileVisible"
                      ref="approvalDetaile"></approval-detaile>
  </div>
</template>
<script>
// 搜索
import erpSearchPanel from '@/components/erp-search-panel'
// 引入radio组件
import elRadioGroup from '@/components/erp-radio/radio-all'
// 分页
import paginationAll from '@/components/erp-pagination/pagination-all'
// 编辑
import paymentEdit from './payment-edit'
// 审批详情
import approvalDetaile from '@/components/workflow/approval-detaile'
import { getUrl, getRequest } from '@/utils'
import { initData } from '@/mixins/initData.js'
export default {
  mixins: [initData],
  components: {
    erpSearchPanel,
    paginationAll,
    paymentEdit,
    elRadioGroup,
    approvalDetaile
  },
  data () {
    return {
      // 数据过滤器
      searchData: {},
      // 付款方式
      docType: '',
      docTypeOption: [{
        value: '全部',
        key: ''
      }],
      // 搜索下拉
      searchOptions: [{
        label: '单据编号',
        value: 'code',
        inputType: 'el-input'
      }, {
        label: '供应商',
        value: 'supplierId',
        inputType: 'el-select-remote',
        httpUrl: 'basic/basicsupplier/list-used?b_used=true',
        queryKey: 'name',
        dataSource: 'list',
        title: 'supplierIdList',
        dataValue: 'id',
        dataLabel: 'name',
        placeholder: '供应商'
      }, {
        label: '表头采购合同号',
        value: 'headContractCode',
        inputType: 'el-input'
      }, {
        label: '付款公司',
        value: 'compId',
        inputType: 'el-select',
        httpUrl: 'list/combobox/company',
        dataSource: 'list',
        title: 'compId',
        dataValue: 'id',
        dataLabel: 'name'
      }, {
        label: '单据状态',
        value: 'dictDocStatus',
        inputType: 'el-select',
        httpUrl: 'basicData/queryDataDict2List',
        requestParams: { dataDictKey: 'APPROVAL_STATUS' },
        dataSource: 'fontMaps',
        title: 'dictDocStatusList',
        dataValue: 'key',
        dataLabel: 'value',
        placeholder: '单据状态'
      }, {
        label: '付款日期',
        value: 'dateRange',
        inputType: 'el-daterangeArr'
      }, {
        label: '付款金额',
        value: 'payAmount',
        inputType: 'el-input'
      }, {
        label: '结算币别',
        value: 'currencyId',
        inputType: 'el-select',
        httpUrl: 'basicData/queryAllCurrency',
        dataSource: 'currencyList',
        title: 'currencyIdList',
        dataValue: 'id',
        dataLabel: 'name',
        placeholder: '结算币别'
      }, {
        label: '表体采购合同号',
        value: 'detailContractCode',
        inputType: 'el-input'
      }, {
        label: '付款方式',
        value: 'paymentMode',
        inputType: 'el-select',

        httpUrl: 'basicData/queryDataDict2List',
        requestParams: { dataDictKey: 'PAYMENT_MODE' },
        dataSource: 'fontMaps',
        title: 'paymentModeList',
        dataValue: 'key',
        dataLabel: 'value',
        placeholder: '单据状态'
      }],
      dataForm: {},
      dataList: [],
      dataListLoading: false,
      dataListSelections: [],
      // 编辑弹窗if
      paymentEdit: false,
      // 审批详情
      approvalDetaileVisible: false,
      // 单据状态
      dictDocStatusOption: [
        { key: '01', value: '未审核' },
        { key: '02', value: '审核中' },
        { key: '03', value: '已审核' },
        { key: '04', value: '已撤销' }
      ]

    }
  },

  created () {
    this.$http.get(this.$http.adornUrl('basicData/queryDataDict2List'), { params: { dataDictKey: 'PAYMENT_TYPE' } }).then(({ data }) => { this.docTypeOption = this.docTypeOption.concat(data.fontMaps) })
    this.request = getRequest()
    if (this.request.taskId) {
      delete this.request['urlPath']
      this.getDataList(1, 'route', this.request)
    } else {
      this.getDataList()
    }
  },

  methods: {
    // 获取数据列表
    getDataList (val, type, searchObj) {
      if (val) {
        this.paginationData.currPage = val
      }
      let searchValue
      if (this.searchData) {
        searchValue = Object.assign({}, searchValue, this.searchData)
      }
      // 付款方式
      if (this.docType) {
        searchValue = Object.assign({}, searchValue, { docType: this.docType })
      }
      if (type === 'route') {
        searchValue = Object.assign({}, searchObj)
      }
      this.dataListLoading = true
      this.$http({
        url: this.$http.adornUrl('fin/finpopayment/list'),
        method: 'post',
        data: Object.assign({}, this.paginationData, searchValue)
      }).then(({ data }) => {
        if (data && data.code === 0) {
          this.dataList = data.pageList.dataList
          this.paginationData.totalCount = data.pageList.page.totalCount
        } else {
          this.dataList = []
          this.paginationData.totalCount = 0
        }
        this.dataListLoading = false
      })
    },

    // 编辑
    editHandle (id, type, row) {
      this.paymentEdit = true
      this.$nextTick(() => {
        this.$refs.paymentEdit.init(id, type, row)
      })
    },

    // 审核
    approvalHandle (id, type, row) {
      this.paymentEdit = true
      this.$nextTick(() => {
        this.$refs.paymentEdit.init(id, type, row)
      })
    },

    // 过滤条件=>全部查询
    stockAll (value) {
      this.docType = value
      this.getDataList(1)
    },

    // 提交
    checkedHandle: _.debounce(
      async function checkedHandle (id) {
        this.$confirm('确定要提交吗？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.$http({
            url: this.$http.adornUrl('fin/finpopayment/submitById'),
            method: 'post',
            data: {
              id: id,
              routeUrl: getUrl()
            }
          }).then(({ data }) => {
            if (data && data.code === 0) {
              this.getDataList()
              this.$notify.success({
                title: '提示',
                message: `提交成功, 单号为:${data.entity.code}`,
                duration: 5000
              })
            } else {
              this.$notify.error({
                title: '警告',
                message: '提交失败:' + data.msg,
                duration: 5000
              })
            }
            this.dataListLoading = false
          })
        })
      }, 1000, {
        leading: true,
        trailing: false
      }
    ),

    // 撤销审核
    revocationApproval: _.debounce(
      async function revocationApproval (id, type, row) {
        let approvalData = {
          businessId: row.id,
          code: row.code,
          comments: '',
          docName: '采购付款申请',
          node: row.node,
          operation: '4',
          processKey: row.processKey,
          routeUrl: getUrl(),
          taskId: row.taskId,
          variablesMap: {}
        }

        this.$confirm('确认要撤销审核吗？', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.$http({
            url: this.$http.adornUrl('fin/finpopayment/approval'),
            method: 'post',
            data: { flowParams: approvalData }
          }).then(({ data }) => {
            if (data && data.code === 0) {
              this.getDataList()
              this.$notify.success({
                title: '成功',
                message: '撤回审核成功',
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
      }, 1000, {
        leading: true,
        trailing: false
      }
    ),

    // 撤销
    undoneHandle (id, type, row) {
      this.$confirm('确认要撤销此行吗？', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$http({
          url: this.$http.adornUrl('fin/finpopayment/revoke'),
          method: 'post',
          data: {
            id: id,
            routeUrl: getUrl(),
            taskId: row.taskId
          }
        }).then(({ data }) => {
          if (data && data.code === 0) {
            this.getDataList(1)
            this.$notify.success({
              title: '成功',
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
      })
    },

    // 删除
    deleteHandle (id, type, row) {
      var ids = id ? [id] : this.dataListSelections.map(item => { return item.id })
      this.$confirm('确认要删除此行吗？', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$http({
          url: this.$http.adornUrl('fin/finpopayment/delete'),
          method: 'delete',
          data: ids
        }).then(({ data }) => {
          if (data && data.code === 0) {
            this.getDataList(1)
            this.$notify.success({
              title: '成功',
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

    // 审批详情
    approveDetailHandle (id, row) {
      this.approvalDetaileVisible = true
      this.$nextTick(() => {
        this.$refs.approvalDetaile.init(id, row)
      })
    },

    // 搜索重置
    resetHandle () {
      this.docType = ''
    },

    // 多选
    selectionChangeHandle (val) {
      this.dataListSelections = val
    }
  },
  watch: {
    '$route' (to, from) {
      let urlData = getRequest()
      if (urlData.taskId && urlData.urlPath === '/financial-purchase-payment/payment-list') {
        delete urlData['urlPath']
        this.getDataList(1, 'route', urlData)
      }
    },
    deep: true
  }
}
</script>

