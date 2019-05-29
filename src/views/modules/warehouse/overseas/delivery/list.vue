<!-- 要货计划列表 -->
<template>
  <div class="mod-config">
    <el-form :inline="true"
             :model="dataForm"
             @keyup.enter.native="getDataList()">
      <el-row>
        <erp-search-panel v-model="searchData"
                          :searchOptions="searchOptions"
                          :isResetHandle='true'
                          @resetHandle='resetHandle'
                          @search="getDataList(1)" />
      </el-row>
      <el-row>
        <label>发货类型:</label>
        <el-radio-group :radioListData='shipTypeOptions'
                        v-model="filterableAllValue"
                        @change="filterableAll"></el-radio-group>
      </el-row>
      <el-row>
        <!-- <el-button @click="show()" :loading="loadingNew">新窗口</el-button> -->
        <el-button v-if="isAuth('warehouse:whdeliveryplan:save')"
                   type="primary"
                   @click="addOrUpdateHandle('', 'canAdd')"><i class="iconfont erp-icon-xinzeng"></i>新增
        </el-button>
        <el-button v-if="isAuth('warehouse:whdeliveryplan:print')"
                   type="primary"
                   @click="uploadHandle()"
                   :disabled="uploadPickDisable"><i class="iconfont erp-icon-xiazai"></i>下载拣货</el-button>
        <el-dropdown>
          <el-button type="primary"
                     v-if="isAuth('warehouse:whdeliveryplan:updatePickStatus')"
                     :disabled="markPickDisable">
            标记拣货
            <i class="el-icon-arrow-down el-icon--right"></i>
          </el-button>

          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item command="markPickHandle"
                              @click.native="markPickHandle('02')">完成</el-dropdown-item>
            <el-dropdown-item command="markPickHandle"
                              @click.native="markPickHandle('01')">未检</el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
      </el-row>
    </el-form>
    <el-table :data="dataList"
              max-height="800"
              stripe
              border
              highlight-current-row
              v-loading="dataListLoading"
              element-loading-text="拼命加载中"
              @expand-change="rowExpand"
              @selection-change="selectionChangeHandle"
              :default-sort="{prop: 'code', order: 'descending'}">
      <el-table-column type="selection"
                       header-align="center"
                       align="center"
                       width="50"></el-table-column>
      <el-table-column type="expand"
                       label="展开"
                       header-align="center"
                       align="center"
                       width="50">
        <template slot-scope="scope">
          <el-table :data="scope.row.tableDataExpand">
            <el-table-column prop="imageUrl"
                             label="产品图片">
              <template slot-scope="scope">
                <tableImg :imageUrl='scope.row.imageUrl'></tableImg>
              </template>
            </el-table-column>
            <el-table-column prop="prodCode"
                             label="产品编码"></el-table-column>
            <el-table-column prop="prodName"
                             label="产品名称"></el-table-column>
            <el-table-column prop="sellSku"
                             label="SellSKU"></el-table-column>
            <el-table-column prop="fnSku"
                             label="FNSKU"></el-table-column>
            <el-table-column prop="asin"
                             label="ASIN"></el-table-column>
            <el-table-column prop="confirmQty"
                             label="最终确认数量"></el-table-column>
            <el-table-column prop="expectArriveDate"
                             label="期望送达日期"></el-table-column>
            <el-table-column prop="transitValue"
                             label="物流方式">
            </el-table-column>
            <el-table-column prop="shipPlanDate"
                             label="预计派送日期"></el-table-column>
            <el-table-column prop="outboxQty"
                             label="单箱数量"
                             min-width="60"></el-table-column>
            <el-table-column prop="outboxWeight"
                             label="单箱重量"
                             min-width="60"></el-table-column>
            <el-table-column prop="countOutboxQty"
                             label="总箱数"
                             min-width="60"></el-table-column>
            <el-table-column prop="outboxSize"
                             label="单箱体积"></el-table-column>
            <el-table-column prop="countOutboxWeight"
                             label="总重量"></el-table-column>
            <el-table-column fixed="right"
                             label="操作"
                             width="120">
              <template slot-scope="scope">
                <el-button type="danger"
                           size="mini"
                           v-if="isAuth('warehouse:whdeliveryplan:getSkuLabel')"
                           @click="printProdLabel(scope.row)">
                  打印产品标签
                </el-button>
              </template>
            </el-table-column>

          </el-table>
        </template>
      </el-table-column>
      <el-table-column prop="code"
                       label="发货计划单号"
                       sortable
                       width="150"
                       :show-overflow-tooltip="true">
        <template slot-scope="scope">
          <a @click="addOrUpdateHandle(scope.row.id,'canCheck')"
             class="a-click-hover">{{scope.row.code}}</a>
        </template>
      </el-table-column>
      <el-table-column prop="planDate"
                       label="要求发货日期"
                       sortable></el-table-column>
      <el-table-column prop="seller"
                       label="销售员"></el-table-column>
      <el-table-column prop="platform"
                       label="要货平台"
                       width="80"></el-table-column>
      <el-table-column prop="channel_name"
                       :show-overflow-tooltip="true"
                       label="要货店铺"></el-table-column>
      <el-table-column prop="shipType"
                       label="发货类型"
                       width="80"></el-table-column>
      <el-table-column prop="docStatus"
                       label="单据状态">
        <template slot-scope="scope">
          <a @click="approveDetailHandle(scope.row.id,scope.row)"
             class="a-click-hover">{{scope.row.docStatus}}</a>
          <div v-if="scope.row.dictDocStatus == dictDocStatusOption[1].key">({{scope.row.nodeName}})</div>
        </template>
      </el-table-column>
      <el-table-column prop="pickStatus"
                       label="拣货状态"
                       width="80"></el-table-column>
      <el-table-column prop="bTransferout"
                       label="生成出库单"
                       width="100">
        <template slot-scope="scope">
          <el-tag v-if="scope.row.bTransferout == false"
                  size="small"
                  type="danger">否</el-tag>
          <el-tag v-else
                  size="small">是</el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="fbaShipmentId"
                       label="FBAshipmentID"></el-table-column>
      <el-table-column prop="updUser"
                       label="修改人"></el-table-column>
      <el-table-column prop="updTime"
                       label="修改时间"
                       sortable
                       :show-overflow-tooltip="true"></el-table-column>
      <el-table-column prop="confirmUser"
                       label="审核人"></el-table-column>
      <el-table-column prop="confirmTime"
                       label="审核时间"
                       sortable
                       :show-overflow-tooltip="true"></el-table-column>
      <el-table-column fixed="right"
                       label="操作"
                       width="80">
        <template slot-scope="scope">
          <el-dropdown :show-timeout="20">
            <span class="el-dropdown-link">操作
              <i class="el-icon-arrow-down el-icon--right"></i>
            </span>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item command="addOrUpdateHandle"
                                @click.native="addOrUpdateHandle(scope.row.id,'canEdit')"
                                v-if="isAuth('warehouse:whdeliveryplan:update')"
                                :disabled="!(scope.row.dictDocStatus === dictDocStatusOption[0].key || scope.row.dictDocStatus == dictDocStatusOption[3].key)">编辑</el-dropdown-item>
              <el-dropdown-item command="submitHandle"
                                @click.native="submitHandle(scope.row)"
                                v-if="isAuth('overseas:whdeliveryplan:submit')"
                                :disabled="!(scope.row.dictDocStatus === dictDocStatusOption[0].key || scope.row.dictDocStatus == dictDocStatusOption[3].key)">提交</el-dropdown-item>
              <el-dropdown-item command="approvalHandle"
                                @click.native="addOrUpdateHandle(scope.row.id,'canApproval',scope.row)"
                                v-if="isAuth('overseas:whdeliveryplan:approval')"
                                :disabled="!(scope.row.dictDocStatus === dictDocStatusOption[1].key)">审核</el-dropdown-item>
              <el-dropdown-item command="packHandle"
                                @click.native="packHandle(scope.row)"
                                v-if="isAuth('warehouse:whpacking:dopacking')"
                                :disabled="!(scope.row.dictDocStatus === dictDocStatusOption[2].key)">装箱</el-dropdown-item>
              <el-dropdown-item command="transferOutHandle"
                                @click.native="transferOutHandle(scope.row.id,'delivery')"
                                v-if="isAuth('overseas:whdeliveryplan:transfer-out')"
                                :disabled="!(scope.row.dictDocStatus === dictDocStatusOption[2].key)">调拨出库</el-dropdown-item>
              <el-dropdown-item command="revokeHandle"
                                @click.native="revokeHandle(scope.row.id)"
                                v-if="isAuth('warehouse:whdeliveryplan:revoke')"
                                :disabled="!(scope.row.dictDocStatus === dictDocStatusOption[2].key)">撤销</el-dropdown-item>
              <el-dropdown-item command="deleteHandle"
                                @click.native="deleteHandle(scope.row.id)"
                                v-if="isAuth('warehouse:whdeliveryplan:delete')"
                                :disabled="!(scope.row.dictDocStatus === dictDocStatusOption[0].key || scope.row.dictDocStatus == dictDocStatusOption[3].key)">删除</el-dropdown-item>
              <el-dropdown-item command="uploadHandle"
                                @click.native="uploadHandle(scope.row.id)"
                                v-if="isAuth('warehouse:whdeliveryplan:print')">下载拣货单</el-dropdown-item>
              <el-dropdown-item command="printBox"
                                @click.native="printBox(scope.row)"
                                v-if="isAuth('warehouse:whdeliveryplan:getPackageLabel')">打印箱唛</el-dropdown-item>
              <el-dropdown-item command="register"
                                @click.native="register(scope.row.id)"
                                v-if="isAuth('warehouse:whdeliveryplan:registerShipmentId')">登记FBAshipmentID</el-dropdown-item>
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
    <!-- 弹窗, 库存调拨(新) -->
    <trans-out-detaile v-if="transOutDetaileVisible"
                       ref="transOutDetaile"
                       @refreshDataList="getDataList"></trans-out-detaile>
    <!-- 弹窗, 审批详情 -->
    <approval-detaile v-if="approvalDetaileVisible"
                      ref="approvalDetaile"></approval-detaile>
    <!-- 审核弹窗(新) -->
    <approval-dialog ref="approvalDialog"
                     @approval="getDataList()"></approval-dialog>
    <!-- 登记 -->
    <register ref="register"
              @refreshDataList="getDataList"></register>
    <!-- 打印产品标签 -->
    <print-prodlabel ref="prodlabel"></print-prodlabel>
    <!--打印箱唛 -->
    <print-box ref="printBox"></print-box>
  </div>
</template>

<script>
// 搜索
import erpSearchPanel from '@/components/erp-search-panel'
import AddOrUpdate from './seas-add-or-update'
// 库存调拨
import transOutNewtabs from './../transfer-out/trans-out-newtabs'
// 调拨出库（新）
import transOutDetaile from './../transfer-out/trans-out-detail'
// 审批详情
import approvalDetaile from '@/components/workflow/approval-detaile'
// 批量审核
import approvalDialog from '@/components/workflow/approval-dialog'
// 分页
import paginationAll from '@/components/erp-pagination/pagination-all'
// 表格
import erpTable from '@/components/erp-table/table-usually'
// 引入图片
import tableImg from '@/components/list-table/table-img'
// 表头处理
import { renderHeaderUtil } from '@/utils/index.js'
import { initData } from '@/mixins/initData.js'

// 消息中心跳转
import { getUrl, getRequest } from '@/utils'
// 引入radio组件
import elRadioGroup from '@/components/erp-radio/radio-all'
import register from './register-fbashipId'
// 打印产品标签
import printProdlabel from './print-prod-label'
import printBox from './print-box'
export default {
  mixins: [initData],
  components: {
    erpSearchPanel,
    AddOrUpdate,
    paginationAll,
    approvalDialog,
    transOutNewtabs,
    tableImg,
    erpTable,
    approvalDetaile,
    transOutDetaile,
    elRadioGroup,
    register,
    printProdlabel,
    printBox
  },
  data () {
    return {
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
      loadingNew: false,
      // 测试table
      dataTable: {
        dataListLoading: false, // 加载中动画
        border: true, // 是否带有纵向边框，默认为false
        hasSelect: false, // 有无复选框选中功能
        hasExpand: true, // 有无展开行功能
        hasOperation: true, // 有无操作功能
        tr: [
          // 表头数据 —— className:列的class名
          {
            label: '发货计划单号',
            prop: 'code',
            sortable: true,
            show: 'template' // show有三种值：false隐藏当前列，true常规表格列，template自定义表格列
          },
          {
            label: '计划日期',
            prop: 'planDate',
            show: true
          },
          {
            label: '销售员',
            prop: 'seller',
            show: true
          },
          {
            label: '目的地仓库',
            prop: 'toWarehouse',
            show: true
          },
          {
            label: '单据状态',
            prop: 'docStatus',
            show: true
          },
          {
            label: '修改人',
            prop: 'updUser',
            show: true
          },
          {
            label: '修改时间',
            prop: 'updTime',
            show: true
          },
          {
            label: '确认人',
            prop: 'confirmUser',
            show: true
          },
          {
            label: '确认时间',
            prop: 'confirmTime',
            show: true
          }
        ],
        data: [], // 表格数据 —— 如需添加行class，处理数据时则需要传入class名， class需为数组
        operation: {
          // 操作功能
          label: '操作', // 操作列的行首文字
          width: '80', // 操作列的宽度
          className: '', // 操作列的class名
          data: [
            // 操作列数据
            {
              id: '',
              label: '编辑', // 按钮文字
              command: 'handleSubmit',
              Fun: 'handleSubmit', // 点击按钮后触发的父组件事件
              isShow: "isAuth('warehouse:whdeliveryplan:info')", // 是否显示
              disabled: false // 是否可用
            }
          ]
        }
      },

      shipTypeOptions: [],
      filterableAllValue: '', // 默认选中空
      transOutDetaileVisible: false,
      uploadPickDisable: true, // 下载拣货
      markPickDisable: true, // 标记拣货
      isDeleteHandle: true, // 批量删除控制
      // 审批
      approvalDeliveryVisible: false,
      // 审批详情
      approvalDetaileVisible: false,
      // 数据过滤器
      searchData: {},

      // 下拉
      searchOptions: [
        {
          label: '要货计划单号',
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
          label: 'SellSKU',
          value: 'sellSKU',
          inputType: 'el-input'
        },
        {
          label: '物流方式',
          value: 'dictConfirmTransit',
          inputType: 'el-select',

          httpUrl: '/basicData/queryDataDict2List',
          requestParams: { dataDictKey: 'TRANSPORT_MODE' },
          dataSource: 'fontMaps',
          title: 'dictConfirmTransit',
          dataValue: 'key',
          dataLabel: 'value',
          placeholder: '物流方式'
        },
        {
          label: '要求发货日期',
          value: 'startDate,endDate',
          inputType: 'el-daterange'
        },
        {
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
        },
        {
          label: '要货平台',
          value: 'platform',
          inputType: 'el-select',

          httpUrl: 'basicData/queryDataDict2List',
          requestParams: { dataDictKey: 'PLANTFORM_TYPE' },
          dataSource: 'fontMaps',
          dataValue: 'key',
          dataLabel: 'value',
          placeholder: '要货平台'
        },
        {
          label: '要货店铺',
          value: 'channelId',
          inputType: 'el-select',

          httpUrl: 'basic/basicchannel/listcombobox',
          requestParams: { platformType: '' },
          dataSource: 'list',
          dataValue: 'id',
          dataLabel: 'name',
          placeholder: '要货店铺'
        },
        {
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
        },
        {
          label: '拣货状态',
          value: 'dictPickStatus',
          inputType: 'el-select',

          dataList: [{ id: '01', name: '未拣' }, { id: '02', name: '完成' }],
          title: 'dictPickStatus',
          dataValue: 'id',
          dataLabel: 'name',
          placeholder: '拣货状态'
        },
        {
          label: '生成出库单',
          value: 'bTransferout',
          inputType: 'el-select',

          dataList: [{ id: true, name: '是' }, { id: false, name: '否' }],
          title: 'bTransferout',
          dataValue: 'id',
          dataLabel: 'name',
          placeholder: '生成出库单'
        },
        {
          label: '修改人',
          value: 'updUser',
          inputType: 'el-select-remote',
          httpUrl: '/list/search/user',
          queryKey: 'name',
          dataSource: 'list',
          title: 'updUser',
          dataValue: 'id',
          dataLabel: 'name',
          placeholder: '修改人'
        },
        {
          label: '修改日期',
          value: 'updStartTime,updEndTime',
          inputType: 'el-daterange'
        },
        {
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
        },
        {
          label: '审核日期',
          value: 'confirmStartTime,confirmEndTime',
          inputType: 'el-daterange'
        }
      ],
      // 库存调拨弹窗
      transOutNewtabsVisible: false,
      // 单条数据展开
      tableDataExpand: [],
      // 发送批量禁用启用的数据
      searchTFs: {},
      dataForm: {
        dictConfirmTransit: ''
      },
      dataList: [],
      dataListLoading: false,
      dataListSelections: [],
      addOrUpdateVisible: false,
      businessType: '01',
      expandKeys: [] // 展开行
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
    this.getShipType()
  },
  methods: {
    getShipType () {
      // 发货类型
      this.$http
        .get(this.$http.adornUrl('basicData/queryDataDict2List'), {
          params: {
            dataDictKey: 'SHIP_TYPE'
          }
        })
        .then(({
          data
        }) => {
          this.shipTypeOptions = data.fontMaps
          this.shipTypeOptions.unshift({ key: '', value: '全部' })
        })
    },
    // 封装的操作列
    handleOperate (a, b) { },
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
            this.$set(item, 'expectArriveDate', whDeliveryPlanEntity.expectArriveDate)
          })
          this.$set(row, 'tableDataExpand', whDeliveryPlanDetailList)
        } else {
          this.$notify.error({
            title: '查询失败',
            message: data.msg,
            duration: 5000
          })
        }
      })
    },

    // 固定值过滤
    filterableAll (val) {
      this.getDataList(1)
    },

    // 重置
    resetHandle () {
      this.filterableAllValue = ''
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
      if (this.filterableAllValue) {
        searchValue = Object.assign({}, searchValue, {
          shipType: this.filterableAllValue
        })
      }
      this.dataListLoading = true
      this.$http({
        url: this.$http.adornUrl('warehouse/whdeliveryplan/list'),
        method: 'post',
        data: Object.assign(
          { businessType: '01' },
          this.paginationData,
          this.searchData == undefined ? {} : this.searchData,
          searchValue
        )
      }).then(({ data }) => {
        if (data && data.code === 0) {
          this.dataTable.data = data.pageList.dataList
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
        this.markPickDisable = true
        return
      }
      let isUpload = this.dataListSelections.every(item => {
        return item.dictDocStatus === '03'
      })
      let isMark = this.dataListSelections.every(item => {
        return item.dictDocStatus === '03'
      })
      this.uploadPickDisable = false
      this.markPickDisable = !isMark
    },
    show () {
      window.open(window.location.href, '_blank', 'scrollbars=yes,resizable=1,channelmode=yes,alwaysRaised=yes')
    },
    // 新增 / 修改 /查看 /审核
    addOrUpdateHandle (id, type, row) {
      this.addOrUpdateVisible = true
      this.$nextTick(() => {
        this.$refs.addOrUpdate.init(id, type, row)
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
              this.transOutDetaileVisible = true
              this.$nextTick(() => {
                this.$refs.transOutDetaile.init(id, deliveryName)
              })
            } else {
              this.transOutDetaileVisible = false
              this.$notify.error({
                title: '失败',
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
    revokeHandle: _.debounce(
      async function revokeHandle (id) {
        this.$http({
          url: this.$http.adornUrl(`warehouse/whdeliveryplan/revoke/${id}`),
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
      }, 1000, {
        leading: true,
        trailing: false
      }
    ),

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
      }, 1000, {
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
    // 装箱
    packHandle (row) {
      this.$http({
        url: this.$http.adornUrl(`warehouse/whpacking/dopacking/${row.id}`),
        method: 'get'
      }).then(({ data }) => {
        if (data && data.code === 0) {
          this.getDataList(1)
          this.$notify.success({
            title: '成功',
            message: `装箱成功，生成装箱清单，单号为：${data.whPackingCodes.join(',')}`,
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
    // 下载拣货单
    uploadHandle (id) {
      var ids = id || this.dataListSelections.map(item => {
        return item.id
      })
      if (Array.isArray(ids)) {
        ids = ids.join(',')
      }
      window.open(
        this.$http.tokens(`warehouse/whdeliveryplan/print`, { 'ids': ids })
      )
    },
    // 标记拣货
    markPickHandle (status) {
      var ids = this.dataListSelections.map(item => {
        return item.id
      })
      this.$http({
        url: this.$http.adornUrl('warehouse/whdeliveryplan/updatePickStatus'),
        method: 'post',
        data: { ids: ids, status: status }
      }).then(({ data }) => {
        if (data && data.code === 0) {
          this.getDataList(1)
          this.$notify.success({
            title: '成功',
            message: '成功',
            duration: 5000
          })
        } else {
          this.$notify.error({
            title: '拣货失败',
            message: data.msg,
            duration: 5000
          })
        }
      })
    },
    // 打印箱唛
    printBox (row) {
      if (!row.fbaShipmentId) {
        this.$notify.warning({
          title: '提示',
          message: 'FBAshipment为空，获取不到箱唛信息，无法打印，请先登记FBAshipmentID!',
          duration: 3000
        })
      } else {
        this.$nextTick(() => {
          this.$refs.printBox.init(row)
        })
        // window.open(
        //   this.$http.tokens(`warehouse/whdeliveryplan/getPackageLabel`,
        //     { 'id': row.id,
        //       'fbaShipmentId': row.fbaShipmentId,
        //       'boxQty': 4
        //     })
        // )
      }
    },
    register (id) {
      this.$nextTick(() => {
        this.$refs.register.init(id)
      })
    },
    // 打印产品标签
    printProdLabel (row) {
      if (!row.fbaShipmentId) {
        this.$notify.warning({
          title: '提示',
          message: 'FBAshipment为空，获取不到箱唛信息，无法打印，请先登记FBAshipmentID!',
          duration: 3000
        })
      } else {
        this.$nextTick(() => {
          this.$refs.prodlabel.init(row)
        })
      }
    }
    // printProdLabel (row) {
    //   if (!row.fbaShipmentId) {
    //     this.$notify.warning({
    //       title: '提示',
    //       message: 'FBAshipment为空，获取不到箱唛信息，无法打印，请先登记FBAshipmentID!',
    //       duration: 3000
    //     })
    //   } else {
    //     window.open(
    //       this.$http.tokens(`warehouse/whdeliveryplan/getSkuLabel`, { 'id': row.id, 'fbaShipmentId': row.fbaShipmentId })
    //     )
    //   }
    // }
  },
  watch: {
    '$route' (to, from) {
      let urlData = getRequest()
      if (urlData.taskId && urlData.urlPath === '/warehouse-overseas/delivery/list') {
        delete urlData['urlPath']
        this.getDataList(1, 'route', urlData)
      }
    },
    deep: true
  }
}
</script>
<style>
.el-table .el-table__expanded-cell {
  padding: 20px 80px 20px 50px;
}
</style>
