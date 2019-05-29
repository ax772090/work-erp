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
    </el-form>
    <el-row>
      <el-button v-if="isAuth('fin:finpopayable:save')"
                 type="primary"
                 @click="addOrUpdateHandle('', 'canAdd')"><i class="iconfont erp-icon-xinzeng"></i>新增</el-button>
    </el-row>
    <el-table :data="dataList"
              stripe
              border
              highlight-current-row
              v-loading="dataListLoading"
              max-height="800"
              :row-class-name="tableRowClassName">
      <el-table-column label="应付日期"
                       prop="payableDate"
                       min-width="100px"></el-table-column>
      <el-table-column label="应付公司"
                       prop="compName"
                       min-width="200px"></el-table-column>
      <el-table-column label="应付单号"
                       prop="code"
                       min-width="150px">
        <template slot-scope="scope">
          <a @click="addOrUpdateHandle(scope.row.id, 'canCheck')"
             class="a-click-hover">{{scope.row.code}}</a>
        </template>
      </el-table-column>
      <el-table-column label="应付类型"
                       prop="docTypeName"
                       min-width="100px"></el-table-column>
      <el-table-column label="供应商"
                       prop="supplierName"
                       min-width="200px"></el-table-column>
      <el-table-column label="币别"
                       prop="currencyName"
                       min-width="60px"></el-table-column>
      <el-table-column label="总金额"
                       prop="totalAmount"
                       min-width="100px"></el-table-column>
      <el-table-column label="源单类型"
                       prop="sourceTypeName"
                       min-width="100px"></el-table-column>
      <el-table-column label="源单单号"
                       prop="sourceCode"
                       min-width="150px"></el-table-column>
      <el-table-column label="单据状态"
                       prop="dictDocStatusName"
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
            <span class="el-dropdown-link">
              操作
              <i class="el-icon-arrow-down el-icon--right"></i>
            </span>
            <!-- 未审核,审核中,已审核,已撤销 -->
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item command="addOrUpdateHandle"
                                v-if="isAuth('fin:finpopayable:update')"
                                :disabled="!(scope.row.dictDocStatus === dictDocStatusOption[0].key || scope.row.dictDocStatus === dictDocStatusOption[3].key)"
                                @click.native="addOrUpdateHandle(scope.row.id, 'canEdit')">编辑</el-dropdown-item>
              <el-dropdown-item command="submitHandle"
                                v-if="isAuth('fin:finpopayable:submit')"
                                :disabled="!(scope.row.dictDocStatus === dictDocStatusOption[0].key || scope.row.dictDocStatus === dictDocStatusOption[3].key)"
                                @click.native="submitHandle(scope.row.id)">提交</el-dropdown-item>
              <el-dropdown-item command="addOrUpdateHandle"
                                v-if="isAuth('fin:finpopayable:approvaltemp')"
                                :disabled="!(scope.row.dictDocStatus === dictDocStatusOption[1].key)"
                                @click.native="addOrUpdateHandle(scope.row.id, 'canApproval', scope.row)">审核</el-dropdown-item>
              <el-dropdown-item command="revocationApproval"
                                v-if="isAuth('fin:finpopayable:repealsapproval')"
                                :disabled="!(scope.row.dictDocStatus === dictDocStatusOption[1].key)"
                                @click.native="revocationApproval(scope.row.id, 'canRevocationApproval', scope.row)">撤回审核</el-dropdown-item>
              <el-dropdown-item command="revocationHander"
                                v-if="isAuth('fin:finpopayable:revoke')"
                                :disabled="!(scope.row.dictDocStatus === dictDocStatusOption[2].key)"
                                @click.native="revocationHander(scope.row.id, 'canUndone', scope.row)">撤销</el-dropdown-item>
              <el-dropdown-item command="deleteHander"
                                v-if="isAuth('fin:finpopayable:delete')"
                                :disabled="!(scope.row.dictDocStatus === dictDocStatusOption[0].key || scope.row.dictDocStatus === dictDocStatusOption[3].key)"
                                @click.native="deleteHander(scope.row.id)">删除</el-dropdown-item>
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
  </div>
</template>

<script>
// 应付单
// 搜索
import erpSearchPanel from '@/components/erp-search-panel'
import tableHaederSearch from '@/components/list-table/table-haeder-search'
// 分页
import paginationAll from '@/components/erp-pagination/pagination-all'
import AddOrUpdate from './pro-payment-add-or-update'
import approval from '@/components/workflow/approval'
// 审批详情
import approvalDetaile from '@/components/workflow/approval-detaile'
import { initData } from '@/mixins/initData.js'
import { getUrl, getRequest } from '@/utils'

export default {
  mixins: [initData],
  components: {
    erpSearchPanel,
    tableHaederSearch,
    paginationAll,
    AddOrUpdate,
    approval,
    approvalDetaile
  },
  data () {
    return {
      // 高级搜索
      searchData: {},
      // 下拉
      searchOptions: [{
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
        label: '应付日期',
        value: 'dateRange',
        inputType: 'el-daterangeArr'
      }, {
        label: '应付公司',
        value: 'compId',
        inputType: 'el-select',

        httpUrl: 'list/combobox/company',
        dataSource: 'list',
        title: 'compId',
        dataValue: 'id',
        dataLabel: 'name'
      }, {
        label: '应付单号',
        value: 'code',
        inputType: 'el-input'
      }, {
        label: '源单类型',
        value: 'sourceType',
        inputType: 'el-select',

        httpUrl: 'basicData/queryDataDict2List',
        requestParams: { dataDictKey: 'WH_INSTOCK_TYPE' },
        dataSource: 'fontMaps',
        title: 'sourceTypeList',
        dataValue: 'key',
        dataLabel: 'value',
        placeholder: '源单类型'
      }, {
        label: '源单编号',
        value: 'sourceCode',
        inputType: 'el-input'
      }, {
        label: '应付类型',
        value: 'docType',
        inputType: 'el-select',
        httpUrl: 'basicData/queryDataDict2List',
        requestParams: { dataDictKey: 'PAYABLE_TYPE' },
        dataSource: 'fontMaps',
        title: 'docTypeList',
        dataValue: 'key',
        dataLabel: 'value',
        placeholder: '应付类型'
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
        label: '币别',
        value: 'currencyId',
        inputType: 'el-select',

        httpUrl: 'basicData/queryAllCurrency',
        dataSource: 'currencyList',
        title: 'currencyIdList',
        dataValue: 'id',
        dataLabel: 'name',
        placeholder: '币别'
      }],
      dataForm: {},
      // 数据list体
      dataList: [],
      dataListLoading: false,
      // 多选
      dataListSelections: [],
      // 审批详情
      approvalDetaileVisible: false,
      docTypeOption: [{
        key: '01',
        value: '应付单'
      }, {
        key: '02',
        value: '应付调整单'
      }],
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
      }]
    }
  },
  created () {
    this.request = getRequest()
    console.log(this.request)
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
        url: this.$http.adornUrl('fin/finpopayable/list'),
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

    // 过滤条件=>全部查询
    stockAll (value) {
      this.getDataList(1)
    },

    // 搜索重置
    resetHandle () { },

    // 提交
    submitHandle (id) {
      this.$confirm(`确定要提交吗？`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$http({
          url: this.$http.adornUrl('fin/finpopayable/submitById'),
          method: 'post',
          data: {
            id: id,
            routeUrl: getUrl()
          }
        }).then(({ data }) => {
          if (data && data.code === 0) {
            this.getDataList()
            this.$notify.success({
              title: '成功',
              message: `提交成功,单号为:${data.entity.code}`,
              duration: 5000
            })
          } else {
            this.$notify.error({
              title: '警告',
              message: '提交失败:' + data.msg,
              duration: 5000
            })
          }
        })
      })
    },

    // 审核撤销
    revocationApproval: _.debounce(
      async function revocationApproval (id, type, row) {
        let approvalData = {
          businessId: row.id,
          code: row.code,
          comments: '',
          docName: '采购应付单',
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
            url: this.$http.adornUrl('fin/finpopayable/approval'),
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
    revocationHander: _.debounce(
      async function revocationHander (id, type, row) {
        this.$confirm('确认要撤销此行吗？', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.$http({
            url: this.$http.adornUrl('fin/finpopayable/revoke'),
            method: 'post',
            data: {
              id: id,
              routeUrl: getUrl(),
              taskId: row.taskId
            }
          }).then(({ data }) => {
            if (data && data.code === 0) {
              this.getDataList()
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
      }, 1000, {
        leading: true,
        trailing: false
      }
    ),

    // 审批详情
    approveDetailHandle (id, row) {
      // console.log(row)
      // if (row.docType === this.docTypeOption[0].key) {
      //   this.$notify.error({
      //     title: '提示',
      //     message: '应付单没有审批流程',
      //     duration: 5000
      //   })
      //   return
      // }
      this.approvalDetaileVisible = true
      this.$nextTick(() => {
        this.$refs.approvalDetaile.init(id, row)
      })
    },

    // 删除
    deleteHander: _.debounce(
      async function deleteHander (id) {
        var ids = id ? [id] : this.dataListSelections.map(item => { return item.id })
        this.$http({
          url: this.$http.adornUrl('fin/finpopayable/delete'),
          method: 'delete',
          data: ids
        }).then(({ data }) => {
          if (data && data.code === 0) {
            this.getDataList()
            this.$notify.success({
              title: '提示',
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
      }, 1000, {
        leading: true,
        trailing: false
      }
    ),
    // 新增-修改-审核
    addOrUpdateHandle (id, type, row) {
      this.$nextTick(() => {
        this.$refs.addOrUpdate.init(id, type, row)
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
      console.log('urlData', urlData)
      if (urlData.taskId && urlData.urlPath === '/financial-pro-payment/pro-payment-list') {
        delete urlData['urlPath']
        this.getDataList(1, 'route', urlData)
      }
    },
    deep: true
  }
}
</script>
