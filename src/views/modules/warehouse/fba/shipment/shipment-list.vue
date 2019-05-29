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
        <el-form-item label="店铺"
                      prop="channelId">
          <select-all v-model="dataForm.channelId"
                      :listDataOption="channelIdOptions"
                      data-value="id"
                      data-label="name"></select-all>
        </el-form-item>
        <el-form-item label="日期">
          <el-date-picker v-model="date"
                          type="daterange"
                          placeholder="选择日期"
                          range-separator="至"
                          start-placeholder="开始日期"
                          end-placeholder="结束日期"
                          value-format="yyyy-MM-dd"></el-date-picker>
        </el-form-item>
        <el-form-item label="">
          <el-button type="primary"
                     @click="updateList"
                     v-if="isAuth('warehouse:mwslistinbound:downloadData')"><i class="iconfont erp-icon-xiazai"></i>下载</el-button>
        </el-form-item>
      </el-row>
    </el-form>
    <el-table :data="dataList"
              stripe
              border
              highlight-current-row
              max-height="800"
              v-loading="dataListLoading"
              @selection-change="selectionChangeHandle">
      <el-table-column prop="channelName"
                       fixed
                       label="来源店铺"></el-table-column>
      <el-table-column prop="fbaName"
                       label="FBAShipment名称"
                       width="250"
                       :show-overflow-tooltip="true"></el-table-column>
      <el-table-column prop="shipmentId"
                       label="FBAShipmentID"
                       @click.native="addOrUpdateHandle(id)"
                       sortable>
        <template slot-scope="scope">
          <a @click="detailHandle(scope.row.shipmentId,'canCheck')"
             class="a-click-hover">{{scope.row.shipmentId}}</a>
        </template>
      </el-table-column>
      <el-table-column prop="labelType"
                       label="贴标方式"></el-table-column>
      <el-table-column prop="logisticsNo"
                       label="物流追踪号"></el-table-column>

      <el-table-column prop="warehouse"
                       label="FBA仓库"></el-table-column>
      <el-table-column prop="status"
                       width="100"
                       label="货件状态"></el-table-column>
      <el-table-column prop="bTransferOut"
                       width="80"
                       label="是否出库">
        <template slot-scope="scope">
          <el-tag v-if="scope.row.bTransferOut == false"
                  size="small"
                  type="danger">否</el-tag>
          <el-tag v-else
                  size="small">是</el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="lastTime"
                       label="最后更新时间"
                       :show-overflow-tooltip="true"></el-table-column>
      <el-table-column prop="syncTime"
                       label="同步时间"
                       :show-overflow-tooltip="true"></el-table-column>
      <el-table-column fixed="right"
                       width="80"
                       label="操作">
        <template slot-scope="scope">
          <el-dropdown :show-timeout="20">
            <span class="el-dropdown-link">操作
              <i class="el-icon-arrow-down el-icon--right"></i>
            </span>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item command="submitHandle"
                                @click.native="printProdLabelHandle(scope.row.id)"
                                v-if="isAuth('activiti:submit')"
                                :disabled="!(scope.row.docStatus === '未审核' || scope.row.docStatus == '已撤销')">打印产品标签</el-dropdown-item>
              <el-dropdown-item command="approvalHandle"
                                @click.native="printOutLabelHandle(scope.row.id)"
                                v-if="isAuth('activiti:approval')"
                                :disabled="!(scope.row.docStatus === '审核中')">打印外箱标签</el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </template>
      </el-table-column>
    </el-table>
    <el-row>
      <pagination-all v-model="paginationData"
                      @paginationChangeHandle="getDataList"></pagination-all>
    </el-row>

    <!-- 弹窗, 详情 -->
    <shipment-detail v-if="shipmentDetailVisible"
                     ref="shipmentDetail"></shipment-detail>
    <!-- 弹窗, FBA调拨出库弹窗 -->
    <trans-out-newtabs v-if="transOutNewtabsVisible"
                       ref="transOutNewtabs"
                       @refreshDataList="getDataList"></trans-out-newtabs>
  </div>
</template>

<script>
// 搜索
import erpSearchPanel from '@/components/erp-search-panel'
import selectAll from '@/components/erp-select/select-all'
// 详情
import shipmentDetail from './shipment-detail'
// 库存调拨
import transOutNewtabs from './../transfer-out/trans-out-newtabs'
// 分页
import paginationAll from '@/components/erp-pagination/pagination-all'
// 表头处理
import { renderHeaderUtil } from '@/utils/index.js'
import { initData } from '@/mixins/initData.js'
export default {
  mixins: [initData],
  components: {
    erpSearchPanel,
    selectAll,
    shipmentDetail,
    paginationAll,
    transOutNewtabs
  },
  data () {
    return {
      channelIdOptions: [], // 店铺
      date: null,
      isDeleteHandle: true, // 批量删除控制
      // 审批
      approvalDeliveryVisible: false,
      // 数据过滤器
      searchData: {},

      // 下拉
      searchOptions: [
        {
          label: 'FBAShipmentID',
          value: 'shipmentId',
          inputType: 'el-input'
        },
        // {
        //     label: "来源店铺",
        //     value: "channelId",
        //     inputType: "el-input"
        // },
        {
          label: '来源店铺',
          value: 'channelId',
          inputType: 'el-select',
          httpUrl: 'basic/basicchannel/listcombobox',
          requestParams: { platformType: '' },
          dataSource: 'list',
          dataValue: 'id',
          dataLabel: 'name'
        },
        {
          label: '货件状态',
          value: 'status',
          inputType: 'el-select',

          httpUrl: 'warehouse/mwslistinbound/shipmentStatus',
          dataSource: 'list',
          title: 'status',
          dataValue: 'key',
          dataLabel: 'value',
          placeholder: '货件状态'
        },
        {
          label: '物流追踪号',
          value: 'logisticsNo',
          inputType: 'el-input'
        },
        {
          label: '是否出库',
          value: 'bTransferOut',
          inputType: 'el-select',

          dataList: [{ id: true, name: '是' }, { id: false, name: '否' }],
          title: 'bTransferOut',
          dataValue: 'id',
          dataLabel: 'name',
          placeholder: '是否出库'
        }
      ],
      // 详情
      shipmentDetailVisible: false,
      // 库存调拨弹窗
      transOutNewtabsVisible: false,
      // 单条数据展开
      tableDataExpand: [],
      // 发送批量禁用启用的数据
      searchTFs: {},
      dataForm: {},
      dataList: [],
      dataListLoading: false,
      dataListSelections: [],
      businessType: '02'
    }
  },
  created () {
    this.getDataList()
  },
  methods: {
    getDataUrl () {
      // 店铺
      this.$http
        .get(this.$http.adornUrl('basic/basicchannel/listcombobox'), {
          params: { platformType: '' }
        })
        .then(({ data }) => {
          this.channelIdOptions = data.list
        })
    },
    // 表头内容过长处理
    renderHeader (h, g) {
      return renderHeaderUtil(h, g)
    },
    // 详情处理
    detailHandle (shipmentId, type) {
      this.shipmentDetailVisible = true
      this.$nextTick(() => {
        this.$refs.shipmentDetail.init(shipmentId, type)
      })
    },
    // 获取数据列表
    getDataList (val) {
      this.getDataUrl()
      if (val !== undefined) {
        this.paginationData.currPage = val
      }
      this.dataListLoading = true
      this.$http({
        url: this.$http.adornUrl('warehouse/mwslistinbound/list'),
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
    // 调拨出库-id：要货id
    transferOutHandle: _.debounce(
      async function transferOutHandle (shipmentId, deliveryName) {
        // 这里判断是否是已出库
        this.$nextTick(() => {
          this.$http({
            url: this.$http.adornUrl(
              `warehouse/whdeliveryplan/fbatransfer-out/${shipmentId}`
            ),
            method: 'get'
          }).then(({ data }) => {
            if (data && data.code === 0) {
              this.transOutNewtabsVisible = true
              this.$nextTick(() => {
                this.$refs.transOutNewtabs.init(shipmentId, deliveryName)
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
      }, 1000, {
        leading: true,
        trailing: false
      }
    ),
    // 下载同步数据
    updateList: _.debounce(
      async function updateList () {
        // 下载同步按钮需要选择店铺和时间
        if (this.dataForm.channelId && this.date) {
          this.$http({
            url: this.$http.adornUrl(
              `warehouse/mwslistinbound/downloadData`
            ),
            method: 'post',
            data: {
              channelId: this.dataForm.channelId,
              requestStartDate: this.date[0],
              requestEndDate: this.date[1]
            }
          }).then(({ data }) => {
            if (data && data.code === 0) {
              this.$notify({
                title: '成功',
                message: '下载同步数据成功',
                type: 'success',
                duration: 3000
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
        } else {
          this.$notify({
            title: '警告',
            message: '请同时选择【店铺】和【日期】后，进行下载操作',
            type: 'warning',
            duration: 5000
          })
        }
      }, 1000, {
        leading: true,
        trailing: false
      }
    ),
    // 打印产品标签-暂无
    printProdLabelHandle (id) { },
    // 打印外箱标签-暂无
    printOutLabelHandle (id) { }
  }
}
</script>
