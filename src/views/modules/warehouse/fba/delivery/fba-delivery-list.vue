<!-- 要货计划列表 -->
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
        <el-button v-if="isAuth('warehouse:whdeliveryFbaplan:save')"
                   type="primary"
                   @click="addOrUpdateHandle()">
          <i class="iconfont erp-icon-xinzeng"></i>新增
        </el-button>
      </el-row>
    </el-form>

    <el-table :data="dataList"
              stripe
              border
              highlight-current-row
              max-height="800"
              v-loading="dataListLoading"
              @expand-change="rowExpand"
              @selection-change="selectionChangeHandle">
      <el-table-column type="expand"
                       label="展开"
                       header-align="center"
                       align="center"
                       width="50">
        <template slot-scope="scope">
          <el-table :data="scope.row.tableDataExpand">
            <el-table-column prop="imageUrl"
                             label="产品图片"
                             width="120">
              <template slot-scope="scope">
                <tableImg :imageUrl='scope.row.imageUrl'></tableImg>
              </template>
            </el-table-column>
            <el-table-column prop="prodCode"
                             label="产品编码"></el-table-column>
            <el-table-column prop="prodName"
                             label="产品名称"></el-table-column>
            <el-table-column prop="fnSku"
                             label="FNSKU"></el-table-column>
            <el-table-column prop="needQty"
                             label="要货数量"></el-table-column>
            <el-table-column prop="confirmQty"
                             label="最终确认数量"></el-table-column>
          </el-table>
        </template>
      </el-table-column>
      <el-table-column prop="code"
                       label="要货计划单号"
                       @click.native="addOrUpdateHandle(id)"
                       sortable
                       :show-overflow-tooltip="true">
        <template slot-scope="scope">
          <a @click="addOrUpdateHandle(scope.row.id,'check')"
             class="a-click-hover">{{scope.row.code}}</a>
        </template>
      </el-table-column>
      <el-table-column prop="planDate"
                       label="日期"></el-table-column>
      <el-table-column prop="seller"
                       label="销售员"></el-table-column>
      <el-table-column prop="platform"
                       label="要货平台"></el-table-column>
      <el-table-column prop="channel_name"
                       :show-overflow-tooltip="true"
                       label="要货店铺"></el-table-column>
      <el-table-column prop="docStatus"
                       label="单据状态">
        <template slot-scope="scope">
          {{scope.row.docStatus}}
          <div v-if="(scope.row.node == 'T01') || (scope.row.node == 'T02') || (scope.row.node == 'T03')">({{scope.row.nodeName}})</div>
        </template>
      </el-table-column>
      <el-table-column prop="confirmUser"
                       label="审核人"></el-table-column>
      <el-table-column prop="confirmTime"
                       :show-overflow-tooltip="true"
                       label="审核时间"></el-table-column>
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
                                @click.native="addOrUpdateHandle(scope.row.id)"
                                v-if="isAuth('warehouse:whdeliveryFbaplan:update')"
                                :disabled="!(scope.row.dictDocStatus === '01' || scope.row.dictDocStatus == '04')">编辑</el-dropdown-item>
              <el-dropdown-item command="submitHandle"
                                @click.native="submitHandle(scope.row)"
                                v-if="isAuth('warehouse:whdeliveryplanFba:submit')"
                                :disabled="!(scope.row.dictDocStatus === '01' || scope.row.dictDocStatus == '04')">提交</el-dropdown-item>
              <el-dropdown-item command="approvalHandle"
                                @click.native="approvalHandle(scope.row.id,scope.row)"
                                v-if="isAuth('warehouse:whdeliveryplanFba:approval')"
                                :disabled="!(scope.row.dictDocStatus === '02')">审核</el-dropdown-item>
              <el-dropdown-item command="transferOutHandle"
                                @click.native="transferOutHandle(scope.row.id,'delivery')"
                                v-if="isAuth('fba:whdeliveryplan:transfer-out')"
                                :disabled="!(scope.row.dictDocStatus === '03')">调拨出库</el-dropdown-item>
              <el-dropdown-item command="revokeHandle"
                                @click.native="revokeHandle(scope.row.id)"
                                v-if="isAuth('warehouse:whdeliveryFbaplan:revoke')"
                                :disabled="!(scope.row.dictDocStatus === '03')">撤销</el-dropdown-item>
              <el-dropdown-item command="deleteHandle"
                                @click.native="deleteHandle(scope.row.id)"
                                v-if="isAuth('warehouse:whdeliveryFbaplan:delete')"
                                :disabled="!(scope.row.dictDocStatus === '01' || scope.row.dictDocStatus == '04')">删除</el-dropdown-item>
              <el-dropdown-item command="approveDetailHandle"
                                @click.native="approveDetailHandle(scope.row.id,scope.row)"
                                v-if="isAuth('fba:activiti:getApproveHistory')"
                                :disabled="!(scope.row.dictDocStatus === '03' || scope.row.dictDocStatus == '04' || scope.row.dictDocStatus === '02')">审批详情</el-dropdown-item>
              <el-dropdown-item command="printHandle"
                                @click.native="printHandle(scope.row.id)"
                                disabled>打印</el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </template>
      </el-table-column>
    </el-table>
    <el-row>
      <pagination-all v-model="paginationData"
                      @paginationChangeHandle="getDataList"></pagination-all>
    </el-row>

    <!-- 弹窗, 新增 / 修改 -->
    <add-or-update v-if="addOrUpdateVisible"
                   ref="addOrUpdate"
                   @refreshDataList="getDataList"></add-or-update>
    <!-- 弹窗, 审批 -->
    <approval-delivery v-if="approvalDeliveryVisible"
                       ref="approvalDelivery"
                       @refreshDataList="getDataList"></approval-delivery>
    <!-- 弹窗, 库存调拨弹窗 -->
    <trans-out-newtabs v-if="transOutNewtabsVisible"
                       ref="transOutNewtabs"
                       @refreshDataList="getDataList"></trans-out-newtabs>
    <!-- 弹窗, 审批详情 -->
    <approval-detaile v-if="approvalDetaileVisible"
                      ref="approvalDetaile"></approval-detaile>
  </div>
</template>

<script>
// 搜索
import erpSearchPanel from '@/components/erp-search-panel'
import AddOrUpdate from './fba-delivery-addorupdate'
// 库存调拨
import transOutNewtabs from './../transfer-out/trans-out-newtabs'
// 审批
import approvalDelivery from './fba-delivery-approve'
// 审批详情
import approvalDetaile from '@/components/workflow/approval-detaile'
// 分页
import paginationAll from '@/components/erp-pagination/pagination-all'
// 表头处理
import { getUrl, getRequest } from '@/utils'
import { renderHeaderUtil } from '@/utils/index.js'
import { initData } from '@/mixins/initData.js'
// 引入图片
import tableImg from '@/components/list-table/table-img'
import Bus from '@/components/js/bus.js'
export default {
  mixins: [initData],
  components: {
    erpSearchPanel,
    AddOrUpdate,
    paginationAll,
    approvalDelivery,
    transOutNewtabs,
    approvalDetaile
  },
  data () {
    return {
      isDeleteHandle: true, // 批量删除控制
      // 审批
      approvalDeliveryVisible: false,
      // 审批详情
      approvalDetaileVisible: false,
      // 数据过滤器
      searchData: {},

      // 下拉
      searchOptions: [{
        label: '要货计划单号',
        value: 'code',
        inputType: 'el-input'
      }, {
        label: '日期',
        value: 'startDate,endDate',
        inputType: 'el-daterange'
      }, {
        label: '要货平台',
        value: 'platform',
        inputType: 'el-select',

        httpUrl: 'basicData/queryDataDict2List',
        requestParams: { dataDictKey: 'PLANTFORM_TYPE' },
        dataSource: 'fontMaps',
        dataValue: 'key',
        dataLabel: 'value',
        placeholder: '要货平台'
      }, {
        label: '要货店铺',
        value: 'channelId',
        inputType: 'el-select',

        httpUrl: 'basic/basicchannel/listcombobox',
        requestParams: { platformType: '' },
        dataSource: 'list',
        dataValue: 'id',
        dataLabel: 'name',
        placeholder: '要货店铺'
      }, {
        label: '单据状态',
        value: 'docStatus',
        inputType: 'el-select',

        httpUrl: '/basicData/queryDataDict2List',
        requestParams: { dataDictKey: 'APPROVAL_STATUS' },
        dataSource: 'fontMaps',
        title: 'docStatus',
        dataValue: 'key',
        dataLabel: 'value',
        placeholder: '单据状态'
      }, {
        label: '销售员',
        value: 'sellerId',
        inputType: 'el-select-remote',
        httpUrl: '/list/search/user',
        queryKey: 'name',
        dataSource: 'list',
        title: 'saleUser',
        dataValue: 'id',
        dataLabel: 'name',
        placeholder: '销售员'
      }, {
        label: '审核人',
        value: 'confirmUser',
        inputType: 'el-select-remote',
        httpUrl: '/list/search/user',
        queryKey: 'name',
        dataSource: 'list',
        title: 'confirmUser',
        dataValue: 'id',
        dataLabel: 'name',
        placeholder: '审核人'
      }, {
        label: '审核日期',
        value: 'confirmStartTime,confirmEndTime',
        inputType: 'el-daterange'
      }],
      // 库存调拨弹窗
      transOutNewtabsVisible: false,
      // 单条数据展开
      tableDataExpand: [],
      // 发送批量禁用启用的数据
      searchTFs: {},
      dataForm: {},
      dictConfirmTransitOptions: [], // 确认物流方式
      dataList: [],
      dataListLoading: false,
      dataListSelections: [],
      addOrUpdateVisible: false,
      businessType: '02'
    }
  },

  created () {
    //   this.searchData['docStatus'] = '02'
    this.getDataList()
    //      Bus.$on('todoSth', (params) => { //获取传递的参数并进行操作
    //   //todo something
    //  })
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
        url: this.$http.adornUrl(`warehouse/whdeliveryplan/info/${row.id}`),
        method: 'get'
      }).then(({ data }) => {
        if (data && data.code === 0) {
          const whDeliveryPlanEntity =
            data.deliveryPlanInfo.whDeliveryPlanEntity
          const whDeliveryPlanDetailList = [
            ...data.deliveryPlanInfo.whDeliveryPlanDetailList
          ]
          whDeliveryPlanDetailList.forEach(item => {
            this.$set(
              item,
              'expectArriveDate',
              whDeliveryPlanEntity.expectArriveDate
            )
            this.$set(
              item,
              'dictConfirmTransit',
              whDeliveryPlanEntity.dictConfirmTransit
            )
            this.$set(item, 'shipPlanDate', whDeliveryPlanEntity.shipPlanDate)
          })
          this.$set(row, 'tableDataExpand', whDeliveryPlanDetailList)
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
    getDataList (val) {
      // 确认物流方式
      //   this.$http.get(this.$http.adornUrl('basicData/queryDataDict2List'), { params: { dataDictKey: 'TRANSPORT_MODE' } }).then(({ data }) => { this.dictConfirmTransitOptions = data.fontMaps })
      if (val != undefined) {
        this.paginationData.currPage = val
      }
      this.dataListLoading = true
      this.$http({
        url: this.$http.adornUrl('warehouse/whdeliveryplan/list'),
        method: 'post',
        data: Object.assign(
          { businessType: '02' },
          this.paginationData,
          this.searchData == undefined ? {} : this.searchData
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
        }
        this.dataListLoading = false
      })
    },
    // 多选
    selectionChangeHandle (val) {
      this.dataListSelections = val
      if (this.dataListSelections.length <= 0) {
        this.isDeleteHandle = true
        return
      }
      let isDelStatus = this.dataListSelections.every(item => {
        return item.docStatus === '未审核' || item.docStatus === '已撤销'
      })
      this.isDeleteHandle = !isDelStatus
    },
    // 新增 / 修改 /查看
    addOrUpdateHandle (id, type) {
      this.addOrUpdateVisible = true
      this.$nextTick(() => {
        this.$refs.addOrUpdate.init(id, type)
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
          url: this.$http.adornUrl('warehouse/whdeliveryplan/delete'),
          method: 'delete',
          data: this.$http.adornData(ids, false)
        }).then(({ data }) => {
          if (data && data.code === 0) {
            this.$notify({
              title: '成功',
              message: '操作成功',
              type: 'success',
              duration: 1500
            })
            this.getDataList(1)
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
    // 调拨出库-id：要货id
    transferOutHandle: _.debounce(
      async function transferOutHandle (id, deliveryName) {
        this.$nextTick(() => {
          this.$http({
            url: this.$http.adornUrl(
              `warehouse/whdeliveryplan/transfer-out/${id}`
            ),
            method: 'get'
          }).then(({ data }) => {
            if (data && data.code === 0) {
              this.transOutNewtabsVisible = true
              this.$nextTick(() => {
                this.$refs.transOutNewtabs.init(id, deliveryName)
              })
            } else {
              this.transOutNewtabsVisible = false
              this.$notify.error({
                title: '错误',
                message: data.msg,
                duration: 5000
              })
            }
          })
        })
      },
      1000,
      {
        leading: true,
        trailing: false
      }
    ),
    // 撤销
    revokeHandle (id) {
      this.$http({
        url: this.$http.adornUrl(`warehouse/whdeliveryplan/revoke/${id}`),
        method: 'put'
      }).then(({ data }) => {
        if (data && data.code === 0) {
          this.$notify({
            title: '成功',
            message: '撤销操作成功',
            type: 'success',
            duration: 1500
          })
          this.getDataList()
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
    submitHandle: _.debounce(
      async function submitHandle (row) {
        this.$http({
          url: this.$http.adornUrl('activiti/submit'),
          method: 'post',
          data: {
            businessId: row.id,
            processKey: 'wh_delivery_plan',

            routeUrl: getUrl(),
            code: row.code,
            docName: '要货计划申请单'
          }
        }).then(({ data }) => {
          if (data && data.code === 0) {
            this.$notify({
              title: '成功',
              message: '操作成功',
              type: 'success',
              duration: 1500
            })
            this.getDataList()
          } else {
            this.$notify.error({
              title: '错误',
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

    // 审批
    approvalHandle (id, row) {
      this.approvalDeliveryVisible = true
      this.$nextTick(() => {
        this.$refs.approvalDelivery.init(id, row)
      })
    },
    // 审批详情
    approveDetailHandle (id, row) {
      this.approvalDetaileVisible = true
      this.$nextTick(() => {
        this.$refs.approvalDetaile.init(id, row)
      })
    },
    // 打印-暂无
    printHandle (id) { }
  }
  // watch:{
  //    '$route' (to, from) {
  //     this.getDataList();
  //   }

  // },
}
</script>
