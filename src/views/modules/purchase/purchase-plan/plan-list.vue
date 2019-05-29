 <!-- 采购计划（从表） -->
<template>
  <div class="mod-config">
    <el-form :inline="true"
             :model="dataForm"
             @keyup.enter.native="getDataList()">
      <el-row>
        <erp-search-panel v-model="searchData"
                          :searchOptions="searchOptions"
                          @search="getDataList(1)"></erp-search-panel>
      </el-row>
      <el-row>
        <div class="grid-content">
          <el-button v-if="isAuth('pur:poplan:save')"
                     type="primary"
                     @click="addOrUpdateHandle('','canAdd')"><i class="iconfont erp-icon-xinzeng"></i>新增</el-button>
        </div>
      </el-row>
    </el-form>
    <el-table :data="dataList"
              stripe
              border
              highlight-current-row
              v-loading="dataListLoading"
              @selection-change="selectionChangeHandle"
              :default-sort="{prop:'code',order:'descending'}">
      <el-table-column prop="code"
                       sortable
                       label="采购计划单号">
        <template slot-scope="scope">
          <a @click="addOrUpdateHandle(scope.row.id, 'canCheck')"
             class="a-click-hover">{{scope.row.code}}</a>
        </template>
      </el-table-column>
      <el-table-column prop="planDate"
                       sortable
                       label="计划日期"></el-table-column>
      <el-table-column prop="planUserName"
                       label="计划员"></el-table-column>
      <el-table-column prop="dictDocStatus"
                       label="单据状态">
        <template slot-scope="scope">
          <a @click="approveDetailHandle(scope.row.id,scope.row)"
             class="a-click-hover">{{scope.row.dictDocStatusValue}}</a>
          <div v-if="(scope.row.node == 'T01') || (scope.row.node == 'T02') || (scope.row.node == 'T03')">({{scope.row.nodeName}})</div>
        </template>

      </el-table-column>
      <el-table-column prop="addUserName"
                       label="创建人"></el-table-column>
      <el-table-column prop="addTime"
                       sortable
                       label="创建时间"></el-table-column>
      <el-table-column prop="updUserName"
                       label="修改人"></el-table-column>
      <el-table-column prop="updTime"
                       sortable
                       label="修改时间"></el-table-column>
      <el-table-column fixed="right"
                       width="80"
                       label="操作">
        <template slot-scope="scope">
          <el-dropdown :show-timeout="20">
            <span class="el-dropdown-link">
              操作
              <i class="el-icon-arrow-down el-icon--right"></i>
            </span>
            <!-- 01正常      02计划确认     03订单已下达 -->
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item v-if="isAuth('pur:poplan:update')"
                                command="UpdatePlan"
                                :disabled="!(scope.row.dictDocStatus === dictDocStatusOption[0].key || scope.row.dictDocStatus === dictDocStatusOption[3].key)"
                                @click.native="addOrUpdateHandle(scope.row.id,'canEdit')">编辑</el-dropdown-item>
              <el-dropdown-item v-if="isAuth('pur:poplan:approvalTemp')"
                                command="approval"
                                :disabled="!(scope.row.dictDocStatus === dictDocStatusOption[1].key)"
                                @click.native="addOrUpdateHandle(scope.row.id,'approve',scope.row)">审核</el-dropdown-item>
              <el-dropdown-item v-if="isAuth('pur:poplan:remokeApprove')"
                                command="approval"
                                :disabled="!(scope.row.dictDocStatus === dictDocStatusOption[1].key)"
                                @click.native="remokeApprove(scope.row)">撤回审核</el-dropdown-item>
              <el-dropdown-item v-if="isAuth('pur:poplan:submit')"
                                command="submitHandle"
                                :disabled="!(scope.row.dictDocStatus === dictDocStatusOption[0].key || scope.row.dictDocStatus === dictDocStatusOption[3].key)"
                                @click.native="submitHandle(scope.row)">提交</el-dropdown-item>
              <el-dropdown-item v-if="isAuth('pur:poplan:revoke')"
                                command="UpdatePlan"
                                :disabled="scope.row.dictDocStatus === dictDocStatusOption[0].key || scope.row.dictDocStatus === dictDocStatusOption[3].key || scope.row.dictDocStatus === dictDocStatusOption[1].key"
                                @click.native="revocation(scope.row)">撤销</el-dropdown-item>
              <el-dropdown-item v-if="isAuth('pur:poplan:delete')"
                                command="deleteHandle"
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
    <add-or-update v-if="addOrUpdateVisible"
                   ref="addOrUpdate"
                   @refreshDataList="getDataList"></add-or-update>
    <!-- 弹窗, 审批详情 -->
    <approval-detaile v-if="approvalDetaileVisible"
                      ref="approvalDetaile"></approval-detaile>
  </div>
</template>
<script>
// 搜索
import erpSearchPanel from '@/components/erp-search-panel'
// 分页
import paginationAll from '@/components/erp-pagination/pagination-all'
import AddOrUpdate from './plan-addorupdate'
// 审批详情
import approvalDetaile from '@/components/workflow/approval-detaile'
import { initData } from '@/mixins/initData.js'
import { getUrl, getRequest } from '@/utils'
export default {
  mixins: [initData],
  components: {
    erpSearchPanel,
    paginationAll,
    approvalDetaile,
    AddOrUpdate
  },
  data () {
    return {
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
          label: '采购计划单号',
          value: 'code',
          inputType: 'el-input'
        },
        {
          label: '产品编码',
          value: 'prodCode',
          inputType: 'el-input'
        },
        {
          label: '产品名称',
          value: 'prodName',
          inputType: 'el-input'
        },
        {
          label: '计划日期',
          value: 'planDate,planDateEnd',
          inputType: 'el-daterange' // 这里要日期
        },
        {
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
        }
      ],

      dataForm: {

      },
      dataList: [],
      approvalDetaileVisible: false,
      dataListLoading: false,
      dataListSelections: [],
      addOrUpdateVisible: false,
      isUnitOrder: false // 按钮控制
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
      if (type === 'route') {
        searchValue = Object.assign({}, searchObj)
      }
      this.dataListLoading = true
      this.$http({
        url: this.$http.adornUrl('pur/poplan/list'),
        method: 'get',
        params: Object.assign({}, this.paginationData, searchValue)
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
    // 审批详情
    approveDetailHandle (id, row) {
      this.approvalDetaileVisible = true
      this.$nextTick(() => {
        this.$refs.approvalDetaile.init(id, row)
      })
    },
    // 多选
    selectionChangeHandle (val) {
      this.dataListSelections = val
      if (this.dataListSelections.length <= 0) {
        this.isUnitOrder = true
        return
      } else {
        this.isUnitOrder = false
      }
      for (var i = 0; i < this.dataListSelections.length; i++) {
        // 合并生成采购订单
        if (!(this.dataListSelections[i].dictBizStatus === '02')) {
          this.isUnitOrder = true
        }
      }
    },

    // 新增 / 修改
    addOrUpdateHandle (id, type, row) {
      this.addOrUpdateVisible = true
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
          docName: '采购计划',
          comments: '',
          variablesMap: {}
        }
      }
      this.$nextTick(() => {
        this.$refs.addOrUpdate.init(id, type, obj)
      })
    },

    // 提交
    submitHandle: _.debounce(
      async function submitHandle (row) {
        this.$confirm(`确定要发起审批吗？`, '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.$http({
            url: this.$http.adornUrl(`pur/poplan/submitById`),
            method: 'post',
            data: {
              id: row.id,
              routeUrl: getUrl()
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
      }, 1000, {
        leading: true,
        trailing: false
      }
    ),

    // 撤销
    revocation: _.debounce(
      async function revocation (row) {
        this.$http({
          url: this.$http.adornUrl('pur/poplan/revoke'),
          method: 'post',
          data: {
            id: row.id,
            routeUrl: getUrl(),
            taskId: row.taskId,
            code: row.code
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
              title: '失败',
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

    // 合并生成采购订单==下达采购订单
    unitOrder: _.debounce(
      async function unitOrder (id) {
        var ids = id
          ? [id]
          : this.dataListSelections.map(item => {
            return item.id
          })
        this.$http({
          url: this.$http.adornUrl('pur/poplan/planComposeInfo'),
          method: 'post',
          data: ids
        }).then(({ data }) => {
          if (data && data.code === 0) {
            let dataArr = data.poInfoCode.join('</br>')
            this.getDataList()
            this.$notify.success({
              title: '提示',
              dangerouslyUseHTMLString: true,
              message: `合并生成采购订单成功,采购订单号为：${dataArr}`,
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

    // 下达采购订单
    // 删除
    deleteHandle: _.debounce(
      async function deleteHandle (id) {
        var ids = id ? [id] : this.dataListSelections.map(item => { return item.id })
        this.$confirm(`确定要删除所选择的数据信息吗？`, '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.$http({
            url: this.$http.adornUrl('pur/poplan/delete'),
            method: 'delete',
            data: this.$http.adornData(ids, false)
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
      }, 1000, {
        leading: true,
        trailing: false
      }
    ),
    // 审核
    approval: _.debounce(
      async function approval (id) {
        var ids = id
          ? [id]
          : this.dataListSelections.map(item => {
            return item.id
          })
        this.$http({
          url: this.$http.adornUrl('pur/poplan/approval'),
          method: 'post',
          data: ids
        }).then(({ data }) => {
          if (data && data.code === 0) {

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

    // 撤回审批
    remokeApprove (row) {
      // 撤回审批opration为‘4’
      this.approvalData = {
        node: row.node,
        taskId: row.taskId,
        operation: '4',
        businessId: row.id,
        routeUrl: getUrl(),
        code: row.code,
        docName: '采购计划单',
        comments: '',
        variablesMap: {}
      }
      this.$http({
        url: this.$http.adornUrl(`pur/poplan/approval`),
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
    }
  },
  watch: {
    '$route' (to, from) {
      let urlData = getRequest()
      if (urlData.taskId && urlData.urlPath === '/purchase-purchase-plan/plan-list') {
        delete urlData['urlPath']
        this.getDataList(1, 'route', urlData)
      }
    },
    deep: true
  }
}
</script>
