 <!-- 盘点表 -->
<template>
  <div>
    <el-form :inline="true"
             :model="dataForm"
             @keyup.enter.native="getDataList()">
      <el-row>
        <erp-search-panel v-model="searchData"
                          :searchOptions="searchOptions"
                          @search="getDataList(1)" />
      </el-row>
    </el-form>
    <el-row>
      <el-button type="primary"
                 :disabled="isbatchReview"
                 v-if="isAuth('warehouse:whstocktaking:approval')"
                 @click="batchReview()"><i class="iconfont erp-icon-piliangshenhe"></i>批量审核</el-button>
    </el-row>
    <el-table :data="dataList"
              stripe
              border
              highlight-current-row
              max-height="800"
              v-loading="dataListLoading"
              @selection-change="selectionChangeHandle">
      <el-table-column type="selection"
                       align="center"
                       header-align="center"
                       width="50"></el-table-column>
      <el-table-column prop="code"
                       sortable
                       label="盘点单号">
        <template slot-scope="scope">
          <a @click="addOrUpdateHandle(scope.row, 'isDisabled')"
             class="a-click-hover">{{scope.row.code}}</a>
        </template>
      </el-table-column>
      <el-table-column prop="stocktakingDate"
                       sortable
                       width="130"
                       label="盘点日期"></el-table-column>
      <el-table-column prop="projectCode"
                       sortable
                       label="方案编号"></el-table-column>
      <el-table-column prop="compName"
                       width="200"
                       label="库存公司"></el-table-column>
      <el-table-column prop="stockUserName"
                       label="盘点员"></el-table-column>
      <el-table-column prop="docStatusName"
                       label="单据状态">
        <template slot-scope="scope">
          <a @click="approveDetailHandle(scope.row.id,scope.row)"
             class="a-click-hover">{{scope.row.docStatusName}}</a>
          <div v-if="scope.row.docStatus === '02'">({{scope.row.nodeName}})</div>
        </template>
      </el-table-column>
      <el-table-column prop="updUserName"
                       label="修改人"></el-table-column>
      <el-table-column prop="updTime"
                       sortable
                       label="修改时间"></el-table-column>
      <el-table-column prop="confirmUserName"
                       label="确认人"></el-table-column>
      <el-table-column prop="confirmTime"
                       sortable
                       label="确认时间"></el-table-column>
      <el-table-column fixed="right"
                       width="80"
                       label="操作">
        <template slot-scope="scope">
          <el-dropdown :show-timeout="20">
            <span class="el-dropdown-link">操作
              <i class="el-icon-arrow-down el-icon--right"></i>
            </span>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item command="addOrUpdateHandle"
                                v-if="isAuth('warehouse:whstocktaking:update')"
                                :disabled="!(scope.row.docStatus === '01' || scope.row.docStatus === '04')"
                                @click.native="addOrUpdateHandle(scope.row)">编辑</el-dropdown-item>
              <el-dropdown-item command="performSubmit"
                                v-if="isAuth('warehouse:whstocktaking:submit')"
                                :disabled="!(scope.row.docStatus === '01' || scope.row.docStatus === '04')"
                                @click.native="performSubmit(scope.row)">提交</el-dropdown-item>
              <el-dropdown-item command="performAudit"
                                v-if="isAuth('warehouse:whstocktaking:approval')"
                                :disabled="!(scope.row.docStatus === '02')"
                                @click.native="addOrUpdateHandle(scope.row, 'approve')">审核</el-dropdown-item>
              <el-dropdown-item command="performRevocation"
                                v-if="isAuth('warehouse:whstocktaking:revoke')"
                                :disabled="!(scope.row.docStatus === '03')"
                                @click.native="performRevocation(scope.row.id)">撤销</el-dropdown-item>
              <el-dropdown-item command="performPrint"
                                v-if="isAuth('warehouse:whstocktaking:print')"
                                @click.native="performPrint(scope.row.id)">打印</el-dropdown-item>
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
    <performAddorupdate v-if="performAddorupdateVisible"
                        ref="performAddorupdate"
                        @refreshDataList="getDataList"></performAddorupdate>
    <!-- 弹窗, 审批详情 -->
    <approval-detaile v-if="approvalDetaileVisible"
                      ref="approvalDetaile"></approval-detaile>
    <!-- 审核弹窗(新) -->
    <approval-dialog ref="approvalDialog"
                     @approval="getDataList()"></approval-dialog>
    <!-- 打印 -->
    <performPrint ref="performPrint"
                  @refreshDataList="getDataList"></performPrint>
    <xlsImport ref="xlsImport"
               title="导入"></xlsImport>
  </div>
</template>
<script>
// 搜索
import erpSearchPanel from '@/components/erp-search-panel'
// 分页
import paginationAll from '@/components/erp-pagination/pagination-all'
import performAddorupdate from './perform-addorupdate'
import performPrint from './perform-print'
import xlsImport from '@/components/xls-import/index'
// 批量审核
import approvalDialog from '@/components/workflow/approval-dialog'
import { initData } from '@/mixins/initData.js'
// 审批详情
import approvalDetaile from '@/components/workflow/approval-detaile'
// 消息中心跳转
import { getUrl, getRequest } from '@/utils'
export default {
  mixins: [initData],
  components: {
    erpSearchPanel,
    paginationAll,
    performAddorupdate,
    performPrint,
    xlsImport,
    approvalDetaile,
    approvalDialog
  },
  data () {
    return {
      // 审批详情
      approvalDetaileVisible: false,
      // 数据过滤器
      searchData: {},
      // 时间过滤
      expectDate: '',
      // 下拉
      searchOptions: [{
        label: '盘点员',
        value: 'stockUserId',
        inputType: 'el-select-remote',

        httpUrl: '/list/search/user',
        queryKey: 'name',
        dataSource: 'list',
        title: 'stockUserId',
        dataValue: 'id',
        dataLabel: 'name',
        placeholder: '盘点员'
      }, {
        label: '盘点编号',
        value: 'code',
        inputType: 'el-input'
      }, {
        label: '方案编号',
        value: 'projectCode',
        inputType: 'el-input'
      }, {
        label: '盘点日期',
        value: 'dateRange',
        inputType: 'el-daterangeArr'
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
        label: '库存公司',
        value: 'compId',
        inputType: 'el-select',

        httpUrl: 'sys/organization/select',
        dataSource: 'companyList',
        title: 'compIdList',
        dataValue: 'orgId',
        dataLabel: 'name',
        placeholder: '库存公司'
      }],

      dataList: [],
      dataForm: {},
      dataListLoading: false,
      dataListSelections: [],
      performAddorupdateVisible: false,
      performParticularsAudit: false,
      isbatchReview: true    // 批量审核
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
    // 获取数据列表
    getDataList (val, type, searchObj) {
      if (val) {
        this.paginationData.currPage = val
      }
      let searchValue = {}
      if (type === 'route') {
        searchValue = Object.assign({}, searchObj)
        this.searchData = {}
      }
      this.dataListLoading = true
      this.$http({
        url: this.$http.adornUrl('warehouse/whstocktaking/list'),
        method: 'post',
        data: Object.assign({}, this.paginationData, this.searchData === undefined ? {} : this.searchData, searchValue)
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

    // 多选
    selectionChangeHandle (val) {
      this.dataListSelections = val
      if (this.dataListSelections.length <= 0) {
        this.isbatchReview = true
        return
      }
      // 批量审批
      this.dataListSelections.every((item, index, arr) => {
        return (arr[0].node === arr[index].node && arr[index].node)      }) ? (this.isbatchReview = false) : (this.isbatchReview = true)
    },

    // 新增 / 修改
    addOrUpdateHandle (row, type) {
      this.performAddorupdateVisible = true
      let obj = {}
      if (type === 'approve') {
        obj = {
          node: row.node,
          taskId: row.taskId,
          operation: '1',
          businessId: row.id,
          processKey: 'wh_stocktaking',

          routeUrl: getUrl(),
          code: row.code,
          docName: '盘点单',
          comments: '',
          variablesMap: {}
        }
      }
      this.$nextTick(() => {
        this.$refs.performAddorupdate.init(row.id, type, obj)
      })
    },

    // 批量审核
    batchReview () {
      for (let i = 0; i < this.dataListSelections.length; i++) {
        this.$set(this.dataListSelections[i], 'businessId', this.dataListSelections[i].id)
        this.$set(this.dataListSelections[i], 'variablesMap', { dictBizStatus: this.dataListSelections[i].dictBizStatus })
        this.$set(this.dataListSelections[i], 'routeUrl', getUrl())
        this.$set(this.dataListSelections[i], 'docName', '盘点单')
      }
      this.$nextTick(() => {
        this.$refs.approvalDialog.init(this.dataListSelections, 'batchReview')
      })
    },

    // 导入
    ImportFile () {
      this.$nextTick(() => {
        this.$refs.xlsImport.init({ templateUrl: '12333', importUrl: '12333' })
      })
    },

    // 导出
    exportFile () {
      window.open(
        this.$http.tokens('warehouse/whinvewhstocktakingntory/export', this.searchData)
      )
    },

    // 提交
    performSubmit: _.debounce(
      async function performSubmit (row) {
        this.$http({
          url: this.$http.adornUrl('warehouse/whstocktaking/submit'),
          method: 'post',
          data: {
            businessId: row.id,
            routeUrl: getUrl(),
            code: row.code,
            docName: '盘点单'
          }
        }).then(({ data }) => {
          if (data && data.code === 0) {
            this.getDataList()
            this.$notify.success({
              title: '成功',
              message: '提交成功',
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

    // 审核
    performAudit (row, type) {
      this.performParticularsAudit = true
      this.$nextTick(() => {
        this.$refs.performParticularsAudit.init(
          { id: row.id, taskId: row.taskId },
          type
        )
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
    performRevocation: _.debounce(
      async function performRevocation (id) {
        this.$http({
          url: this.$http.adornUrl('warehouse/whstocktaking/revoke'),
          method: 'get',
          params: { id: id }
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
      }, 1000, {
        leading: true,
        trailing: false
      }
    ),

    // 打印
    performPrint: _.debounce(
      async function performPrint (id) {
        this.$http({
          url: this.$http.adornUrl(`warehouse/whstocktaking/print//${id}`),
          method: 'get'
        }).then(({ data }) => {
          if (data && data.code === 0) {
            this.$refs.performPrint.init(data)
            // this.dataForm = data.WhOutstockDto
          }
        })
      }, 1000, {
        leading: true,
        trailing: false
      }
    )

    // 删除
    // performDelete (id, row) {
    //   var ids = id ? [id] : this.dataListSelections.map(item => { return item.id })
    //   this.$confirm(`确定要${row ? '删除' : '批量删除'}所选择的数据信息吗？${row ? '[单号=' + row.code + ']' : ''}`, '提示', {
    //     confirmButtonText: '确定',
    //     cancelButtonText: '取消',
    //     type: 'warning'
    //   }).then(() => {
    //     this.$http({
    //       url: this.$http.adornUrl('warehouse/whstocktaking/delete'),
    //       method: 'delete',
    //       data: ids
    //     }).then(({ data }) => {
    //       if (data && data.code === 0) {
    //         this.getDataList()
    //         this.$notify.success({
    //           title: '成功',
    //           message: '删除成功',
    //           duration: 5000
    //         })
    //       } else {
    //         this.$notify.error({
    //           title: '错误',
    //           message: data.msg,
    //           duration: 5000
    //         })
    //       }
    //     })
    //   })
    // }
  },
  watch: {
    '$route' (to, from) {
      let urlData = getRequest()
      if (urlData.taskId && urlData.urlPath === '/warehouse-stocktaking/stocktaking-perform/perform-list') {
        delete urlData['urlPath']
        this.getDataList(1, 'route', urlData)
      }
    },
    deep: true
  }
}
</script>