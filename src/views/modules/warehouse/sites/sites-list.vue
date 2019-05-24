<template>
  <div class="mod-config">
    <el-form :inline="true"
             :model="dataForm"
             @keyup.enter.native="getDataList()">
      <el-row>
        <erp-search-panel v-model="searchData"
                          :searchOptions="searchOptions"
                          @search="getDataList(1)" />
      </el-row>
      <el-row>
        <el-button v-if="isAuth('warehouse:sitedelinfo:save')"
                   type="primary"
                   @click="addOrUpdateHandle()"><i class="iconfont erp-icon-xinzeng"></i>新增</el-button>
        <el-button v-if="isAuth('warehouse:sitedelinfo:delete')"
                   :disabled="isDeleteHandle"
                   type="danger"
                   @click="deleteHandle()"><i class="iconfont erp-icon-shanchu"></i>删除</el-button>
        <el-button v-if="isAuth('warehouse:sitedelinfo:approveTemp')"
                   type="primary"
                   :disabled="isbatchReview"
                   @click="batchReview()"><i class="iconfont erp-icon-piliangshenhe"></i>批量审核</el-button>
      </el-row>
      <!-- 表格 -->
      <el-table :data="dataList"
                max-height="800"
                stripe
                border
                highlight-current-row
                v-loading="dataListLoading"
                @expand-change="rowExpand"
                @selection-change="selectionChangeHandle"
                :default-sort="{prop: 'code', order: 'descending'}">
        <el-table-column type="selection"
                         header-align="center"
                         align="center"
                         width="50"></el-table-column>
        <el-table-column type="expand"
                         header-align="center"
                         align="center"
                         label="展开"
                         width="50">
          <template slot-scope="scope">
            <el-table :data="scope.row.tableDataExpand">
              <el-table-column prop="outProdCode"
                               label="调出方SKU"></el-table-column>
              <el-table-column prop="outProdName"
                               label="调出方产品名称"></el-table-column>
              <el-table-column prop="specifications"
                               label="规格型号"></el-table-column>
              <el-table-column prop="inProdCode"
                               label="调入方SKU"></el-table-column>
              <el-table-column prop="inProdName"
                               label="调入方产品名称"></el-table-column>
              <el-table-column prop="applyQty"
                               label="申请借调数量"
                               sortable></el-table-column>
              <el-table-column prop="approveQty"
                               label="批准数量"
                               sortable></el-table-column>
            </el-table>
          </template>
        </el-table-column>
        <el-table-column prop="code"
                         label="单据编号"
                         @click.native="addOrUpdateHandle(id)"
                         sortable
                         :show-overflow-tooltip="true">
          <template slot-scope="scope">
            <a @click="addOrUpdateHandle(scope.row.id,'check')"
               class="a-click-hover">{{scope.row.code}}</a>
          </template>
        </el-table-column>
        <el-table-column prop="applyDate"
                         label="申请日期"
                         sortable></el-table-column>
        <el-table-column prop="applyUser"
                         label="申请人"></el-table-column>
        <el-table-column prop="temporarliyType"
                         label="申请类型"></el-table-column>
        <el-table-column prop="outPart"
                         :show-overflow-tooltip="true"
                         label="调出方"></el-table-column>
        <el-table-column prop="outSite"
                         label="调出方站点"></el-table-column>
        <el-table-column prop="inPart"
                         label="调入方"></el-table-column>
        <el-table-column prop="inSite"
                         label="调入方站点"></el-table-column>
        <el-table-column prop="outSaleUser"
                         label="调出方销售员"></el-table-column>
        <el-table-column prop="docStatus"
                         label="单据状态">
          <template slot-scope="scope">
            <a @click="approveDetailHandle(scope.row.id,scope.row)"
               class="a-click-hover">{{scope.row.docStatus}}</a>
            <div v-if="(scope.row.node == 'T01') || (scope.row.node == 'T02') || (scope.row.node == 'T03')">({{scope.row.nodeName}})</div>
          </template>
        </el-table-column>
        <el-table-column prop="reason"
                         label="调拨原因"></el-table-column>
        <el-table-column fixed="right"
                         label="操作"
                         width="80">
          <template slot-scope="scope">
            <el-dropdown :show-timeout="20">
              <span class="el-dropdown-link">
                操作
                <i class="el-icon-arrow-down el-icon--right"></i>
              </span>
              <el-dropdown-menu slot="dropdown">
                <el-dropdown-item command="addOrUpdateHandle"
                                  v-if="isAuth('warehouse:sitedelinfo:update')"
                                  @click.native="addOrUpdateHandle(scope.row.id)"
                                  :disabled="!(scope.row.dictDocStatus === dictDocStatusOption[0].key || scope.row.dictDocStatus == dictDocStatusOption[3].key)">编辑</el-dropdown-item>
                <el-dropdown-item command="submitHandle"
                                  @click.native="submitHandle(scope.row)"
                                  v-if="isAuth('warehouse:sitedelinfo:submit')"
                                  :disabled="!(scope.row.dictDocStatus === dictDocStatusOption[0].key || scope.row.dictDocStatus == dictDocStatusOption[3].key)">提交</el-dropdown-item>
                <el-dropdown-item command="addOrUpdateHandle"
                                  @click.native="addOrUpdateHandle(scope.row.id,'approve',scope.row)"
                                  v-if="isAuth('warehouse:sitedelinfo:approveTemp')"
                                  :disabled="!(scope.row.dictDocStatus === dictDocStatusOption[1].key)">审核</el-dropdown-item>
                <el-dropdown-item command="revokeHandle"
                                  @click.native="revokeHandle(scope.row.id)"
                                  v-if="isAuth('warehouse:sitedelinfo:revoke')"
                                  :disabled="!(scope.row.dictDocStatus === dictDocStatusOption[2].key)">撤销</el-dropdown-item>
                <el-dropdown-item command="revokeHandle"
                                  @click.native="revokeApproveHandle(scope.row)"
                                  v-if="isAuth('warehouse:sitedelinfo:revokeApprove')"
                                  :disabled="!(scope.row.dictDocStatus === dictDocStatusOption[1].key)">撤回审批</el-dropdown-item>
                <el-dropdown-item command="deleteHandle"
                                  @click.native="deleteHandle(scope.row.id)"
                                  v-if="isAuth('warehouse:sitedelinfo:delete')"
                                  :disabled="!(scope.row.dictDocStatus === dictDocStatusOption[0].key || scope.row.dictDocStatus == '04')">删除</el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown>
          </template>
        </el-table-column>
      </el-table>
      <el-row>
        <pagination-all v-model="paginationData"
                        @paginationChangeHandle="getDataList"></pagination-all>
      </el-row>
    </el-form>

    <!-- 弹窗, 新增 / 修改 /查看 / 审批-->
    <add-or-update v-if="addOrUpdateVisible"
                   ref="addOrUpdate"
                   @refreshDataList="getDataList"></add-or-update>
    <!-- 弹窗, 审批详情 -->
    <approval-detaile v-if="approvalDetaileVisible"
                      ref="approvalDetaile"></approval-detaile>
    <!-- 批量审核弹窗-->
    <approval-dialog ref="approvalDialog"
                     @approval="getDataList()"></approval-dialog>
  </div>
</template>

<script>
// 搜索
import erpSearchPanel from '@/components/erp-search-panel'
import AddOrUpdate from './sites-add-or-update'
// 审批详情
import approvalDetaile from '@/components/workflow/approval-detaile'
// 分页
import paginationAll from '@/components/erp-pagination/pagination-all'
// 表格
import erpTable from '@/components/erp-table/table-usually'
// 表头处理
import { renderHeaderUtil } from '@/utils/index.js'
import { initData } from '@/mixins/initData.js'

// 批量审核
import approvalDialog from '@/components/workflow/approval-dialog'

// 消息中心跳转
import { getUrl, getRequest } from '@/utils'

export default {
  mixins: [initData],
  components: {
    erpSearchPanel,
    AddOrUpdate,
    paginationAll,
    erpTable,
    approvalDetaile,
    approvalDialog
  },
  data () {
    return {
      isDeleteHandle: true, // 删除按钮控制
      isbatchReview: true,  // 批量审核
      uploadPickDisable: true, // 下载
      // 审批详情
      approvalDetaileVisible: false,
      // 数据过滤器
      searchData: {},
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
      // 下拉
      searchOptions: [
        {
          label: '单据编号',
          value: 'code',
          inputType: 'el-input'
        },
        {
          label: '单据状态',
          value: 'dictDocStatus',
          inputType: 'el-select',

          httpUrl: '/basicData/queryDataDict2List',
          requestParams: { dataDictKey: 'APPROVAL_STATUS' },
          dataSource: 'fontMaps',
          title: 'dictDocStatus',
          dataValue: 'key',
          dataLabel: 'value',
          placeholder: '单据状态'
        },
        {
          label: '申请日期',
          value: 'startDate,endDate',
          inputType: 'el-daterange'
        },
        {
          label: '申请人',
          value: 'applyUserId',
          inputType: 'el-select-remote',
          httpUrl: '/list/search/user',
          queryKey: 'name',
          dataSource: 'list',
          title: 'applyUserId',
          dataValue: 'id',
          dataLabel: 'name',
          placeholder: '申请人'
        },
        {
          label: '申请类型',
          value: 'dictTemporarily',
          inputType: 'el-select',

          httpUrl: 'basicData/queryDataDict2List',
          requestParams: { dataDictKey: 'TEMPORARILY_TYPE' },
          dataSource: 'fontMaps',
          dataValue: 'key',
          dataLabel: 'value',
          placeholder: '申请类型'
        },
        {
          label: '调出方',
          value: 'outPart',
          inputType: 'el-select',

          httpUrl: 'basicData/queryDataDict2List',
          requestParams: { dataDictKey: 'PLANTFORM_TYPE' },
          dataSource: 'fontMaps',
          dataValue: 'key',
          dataLabel: 'value',
          placeholder: '调出方平台'
        },
        {
          label: '调出方站点',
          value: 'outSite',
          inputType: 'el-select',

          httpUrl: 'mwsData/mwsAuthorize',
          dataSource: 'mwsAuthorize',
          dataValue: 'id',
          dataLabel: 'displayName',
          placeholder: '调出方站点'
        },
        {
          label: '调入方',
          value: 'inPart',
          inputType: 'el-select',
          httpUrl: 'basicData/queryDataDict2List',
          requestParams: { dataDictKey: 'PLANTFORM_TYPE' },
          dataSource: 'fontMaps',
          dataValue: 'key',
          dataLabel: 'value',
          placeholder: '调入方平台'
        },
        {
          label: '调入方站点',
          value: 'inSite',
          inputType: 'el-select',
          httpUrl: 'mwsData/mwsAuthorize',
          dataSource: 'mwsAuthorize',
          dataValue: 'id',
          dataLabel: 'displayName',
          placeholder: '调入方站点'
        },
        {
          label: '调出方SKU',
          value: 'prodCode',
          inputType: 'el-input'
        }
      ],
      // 单条数据展开
      tableDataExpand: [],
      dataForm: {
      },
      dataList: [],
      dataListLoading: false,
      dataListSelections: [],
      addOrUpdateVisible: false
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
  },
  methods: {
    // 表头内容过长处理
    renderHeader (h, g) {
      return renderHeaderUtil(h, g)
    },
    // 展开行
    rowExpand (row) {
      this.getDetailData(row)
    },
    // 获取展开行数据新
    getDetailData (row) {
      this.$http({
        url: this.$http.adornUrl(`warehouse/sitedelinfo/info/${row.id}`),
        method: 'get'
      }).then(({ data }) => {
        if (data && data.code === 0) {
          this.$set(row, 'tableDataExpand', data.siteDelInfo.detailList)
        } else {
          this.$notify.error({
            title: '查询失败',
            message: data.msg,
            duration: 5000
          })
        }
      })
    },
    // 获取数据列表
    getDataList (val, type, searchObj) {
      if (val != undefined) {
        this.paginationData.currPage = val
      }
      let searchValue = {}
      if (type === 'route') {
        searchValue = Object.assign({}, searchObj)
        this.searchData = {}
      }
      this.dataListLoading = true
      this.$http({
        url: this.$http.adornUrl('warehouse/sitedelinfo/list'),
        method: 'post',
        data: Object.assign(
          {},
          this.paginationData,
          this.searchData == undefined ? {} : this.searchData,
          searchValue
        )
      }).then(({ data }) => {
        if (data && data.code === 0) {
          this.dataList = data.pageList.dataList
          this.paginationData.totalCount = data.pageList.page.totalCount
          this.dataList.forEach(item => {
            this.$set(item, 'tableDataExpand', [])
          })
        } else {
          this.dataList = []
          this.paginationData.totalCount = 0
          this.$notify.error({
            title: '失败',
            message: data.msg,
            duration: 5000
          })
        }
        this.dataListLoading = false
      })
    },
    // 多选
    selectionChangeHandle (val) {
      this.dataListSelections = val
      if (this.dataListSelections.length <= 0) {
        this.uploadPickDisable = true
        this.isDeleteHandle = true
        this.isbatchReview = true
        return
      }

      let isDelete = this.dataListSelections.every(item => {
        return (item.dictDocStatus === '01' || item.dictDocStatus === '04')
      })
      let isApprove = this.dataListSelections.every((item, index, arr) => {
        return (item.node && (item.node === arr[0].node))
      })
      this.isDeleteHandle = !isDelete
      this.isbatchReview = !isApprove
      this.uploadPickDisable = true// 目前先不做
    },
    // 新增 / 修改 /查看 /审核
    addOrUpdateHandle (id, type, row) {
      this.addOrUpdateVisible = true
      var obj = {}
      if (type === 'approve') {
        obj = {
          node: row.node,
          taskId: row.taskId,
          operation: '1',
          businessId: row.id,
          processKey: 'site_delivery',
          routeUrl: getUrl(),
          code: row.code,
          docName: '站点间调拨申请单',
          comments: '',
          variablesMap: {}
        }
      }
      this.$nextTick(() => {
        this.$refs.addOrUpdate.init(id, type, obj)
      })
    },

    // 批量审核
    batchReview () {
      for (const item of this.dataListSelections) {
        this.$set(item, 'businessId', item.id)
        this.$set(item, 'variablesMap', { lendDept: item.lendDept })
        this.$set(item, 'routeUrl', getUrl())
        this.$set(item, 'docName', '站点间调拨申请单')
      }
      this.$nextTick(() => {
        this.$refs.approvalDialog.init(this.dataListSelections, 'batchReview')
      })
    },

    // 删除
    deleteHandle (id) {
      var ids = id
        ? [id]
        : this.dataListSelections.map(item => {
          return item.id
        })
      this.$confirm(`确定要删除所选择的数据信息吗？`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$http({
          url: this.$http.adornUrl('warehouse/sitedelinfo/delete'),
          method: 'delete',
          data: this.$http.adornData(ids, false)
        }).then(({ data }) => {
          if (data && data.code === 0) {
            this.getDataList(1)
            this.$notify.success({
              title: '成功',
              message: '操作成功',
              duration: 5000
            })
          } else {
            this.$notify.error({
              title: '删除失败',
              message: data.msg,
              duration: 5000
            })
          }
        })
      })
    },

    // 撤销
    revokeHandle: _.debounce(
      async function revokeHandle (id) {
        this.$http({
          url: this.$http.adornUrl(`warehouse/sitedelinfo/revoke/${id}`),
          method: 'put'
        }).then(({ data }) => {
          if (data && data.code === 0) {
            this.getDataList()
            this.$notify.success({
              message: '撤销成功',
              duration: 5000
            })
          } else {
            this.$notify.error({
              title: '撤销失败',
              message: data.msg,
              duration: 5000
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

    // 提交
    submitHandle: _.debounce(
      async function submitHandle (row) {
        this.$http({
          url: this.$http.adornUrl('warehouse/sitedelinfo/listSubmit'),
          method: 'post',
          data: row.id

        }).then(({ data }) => {
          if (data && data.code === 0) {
            this.getDataList()
            this.$notify.success({
              message: '提交成功',
              duration: 5000
            })
          } else {
            this.$notify.error({
              title: '提交失败',
              message: data.msg,
              duration: 5000
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

    // 审核接口
    initApproval () {
      return this.$http({
        url: this.$http.adornUrl(`warehouse/sitedelinfo/approve`),
        method: 'post',
        data: Object.assign({}, this.dataForm, {
          flowParams: this.approvalData
        })
      })
    },

    // 撤回审批
    revokeApproveHandle (row) {
      // 撤回审批operation为‘4’
      this.approvalData = {
        node: row.node,
        taskId: row.taskId,
        operation: '4',
        businessId: row.id,
        processKey: 'site_delivery',
        routeUrl: getUrl(),
        code: row.code,
        docName: '站点间调拨申请单',
        comments: '',
        variablesMap: {}
      }
      this.$http({
        url: this.$http.adornUrl(`warehouse/sitedelinfo/approve`),
        method: 'post',
        data: Object.assign({}, { id: row.id }, {
          flowParams: this.approvalData
        })
      }).then(({ data }) => {
        if (data && data.code === 0) {
          this.getDataList()
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
    },

    // 审批详情
    approveDetailHandle (id, row) {
      this.approvalDetaileVisible = true
      this.$nextTick(() => {
        this.$refs.approvalDetaile.init(id, row)
      })
    },
    // 下载
    uploadHandle (id) {
      var ids = id || this.dataListSelections.map(item => {
        return item.id
      })
      if (Array.isArray(ids)) {
        ids = ids.join(',')
      }

      window.open(
        this.$http.tokens(`warehouse/sitedelinfo/print`, { 'ids': ids })
      )
    }
  },
  watch: {
    '$route' (to, from) {
      let urlData = getRequest()
      if (urlData.taskId && urlData.urlPath === '/warehouse-sites/sites-list') {
        delete urlData['urlPath']
        this.getDataList(1, 'route', urlData)
      }
    },
    deep: true
  }
}
</script>
