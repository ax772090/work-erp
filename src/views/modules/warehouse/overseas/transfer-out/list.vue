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
        <el-button v-if="isAuth('overseas:whtransferout:save')"
                   type="primary"
                   @click="addOrUpdateHandle('', 'canAdd')">
          <i class="iconfont erp-icon-xinzeng"></i>新增
        </el-button>
      </el-row>
    </el-form>

    <el-table :data="dataList"
              max-height="800"
              stripe
              border
              highlight-current-row
              v-loading="dataListLoading"
              @expand-change="rowExpand"
              @selection-change="selectionChangeHandle"
              :default-sort="{prop: 'code', order: 'descending'}">
      <el-table-column type="expand"
                       header-align="center"
                       align="center"
                       label="展开"
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
            <el-table-column prop="specifications"
                             label="规格型号"></el-table-column>
            <el-table-column prop="fromWarehouseId"
                             label="调出仓库">
              <template slot-scope="scope">
                <select-all v-model="scope.row.fromWarehouseId"
                            :listDataOption="fromWarehouseIdOptions"
                            :isDisabled="true"
                            data-value="id"
                            data-label="name"></select-all>
              </template>
            </el-table-column>
            <el-table-column prop="qty"
                             label="调出数量"></el-table-column>
            <el-table-column prop="toWarehouseId"
                             label="调入仓库">
              <template slot-scope="scope">
                <select-all v-model="scope.row.toWarehouseId"
                            :listDataOption="toWarehouseIdOptions"
                            :isDisabled="true"
                            data-value="id"
                            data-label="name"></select-all>
              </template>
            </el-table-column>
          </el-table>
        </template>
      </el-table-column>
      <el-table-column prop="code"
                       label="调出单号"
                       width="150"
                       sortable
                       :show-overflow-tooltip="true">
        <template slot-scope="scope">
          <a @click="addOrUpdateHandle(scope.row.id,'canCheck')"
             class="a-click-hover">{{scope.row.code}}</a>
        </template>
      </el-table-column>
      <el-table-column prop="deliveryPlanCode"
                       label="要货计划单号"
                       width="160"
                       sortable></el-table-column>
      <el-table-column prop="date"
                       width="120"
                       label="调出日期"></el-table-column>
      <el-table-column prop="admin"
                       width="130"
                       label="仓管员"></el-table-column>
      <el-table-column prop="businessType"
                       width="100"
                       label="业务类型"></el-table-column>
      <el-table-column prop="comp"
                       width="200"
                       label="调出公司"></el-table-column>
      <el-table-column prop="fromWarehouse"
                       width="150"
                       label="调出仓库"></el-table-column>
      <el-table-column prop="toWarehouse"
                       width="150"
                       label="调入仓库"></el-table-column>
      <el-table-column prop="docStatus"
                       width="100"
                       label="单据状态"></el-table-column>
      <el-table-column prop="updUser"
                       width="130"
                       label="修改人"></el-table-column>
      <el-table-column prop="updTime"
                       width="170"
                       label="修改时间"
                       sortable></el-table-column>
      <el-table-column prop="confirmUser"
                       width="130"
                       label="确认人"></el-table-column>
      <el-table-column prop="confirmTime"
                       label="确认时间"
                       width="170"
                       sortable></el-table-column>
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
                                @click.native="addOrUpdateHandle(scope.row.id,'canEdit')"
                                v-if="isAuth('overseas:whtransferout:update')"
                                :disabled="!(scope.row.dictDocStatus === dictDocStatusOption[0].key || scope.row.dictDocStatus == dictDocStatusOption[3].key)">编辑</el-dropdown-item>
              <el-dropdown-item command="revokeHandle"
                                @click.native="revokeHandle(scope.row.id)"
                                v-if="isAuth('warehouse:whtransferout:revoke')"
                                :disabled="!(scope.row.dictDocStatus === dictDocStatusOption[2].key || scope.row.dictDocStatus === dictDocStatusOption[1].key)">撤销</el-dropdown-item>
              <el-dropdown-item command="deleteHandle"
                                @click.native="deleteHandle(scope.row.id)"
                                v-if="isAuth('overseas:whtransferout:delete')"
                                :disabled="!(scope.row.dictDocStatus === dictDocStatusOption[0].key || scope.row.dictDocStatus == dictDocStatusOption[3].key)">删除</el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </template>
      </el-table-column>
    </el-table>
    <el-row>
      <pagination-all v-model="paginationData"
                      @paginationChangeHandle="getDataList"></pagination-all>
    </el-row>

    <!-- 弹窗, 库存调拨(新) -->
    <trans-out-detaile v-if="transOutDetaileVisible"
                       ref="transOutDetaile"
                       @refreshDataList="getDataList"></trans-out-detaile>
  </div>
</template>

<script>
// 搜索
import erpSearchPanel from '@/components/erp-search-panel'
import selectAll from '@/components/erp-select/select-all'

// 调拨出库（新）
import transOutDetaile from './../transfer-out/trans-out-detail'
// 分页
import paginationAll from '@/components/erp-pagination/pagination-all'
// 表头处理
import { renderHeaderUtil } from '@/utils/index.js'
import { initData } from '@/mixins/initData.js'
// 引入图片
import tableImg from '@/components/list-table/table-img'
export default {
  mixins: [initData],
  components: {
    erpSearchPanel,
    selectAll,
    paginationAll,
    transOutDetaile,
    tableImg
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
      transOutDetaileVisible: false,
      isDeleteHandle: true, // 批量删除控制
      // 调出仓库
      fromWarehouseIdOptions: [],
      // 调入仓库
      toWarehouseIdOptions: [],
      // 数据过滤器
      searchData: {},

      // 下拉
      searchOptions: [
        {
          label: '产品名称',
          value: 'prodName',
          inputType: 'el-input'
        },
        {
          label: '产品编码',
          value: 'prodCode',
          inputType: 'el-input'
        },
        {
          label: '调出单号',
          value: 'code',
          inputType: 'el-input'
        },
        {
          label: '要货计划单号',
          value: 'deliveryPlanCode',
          inputType: 'el-input'
        },
        {
          label: '调出日期',
          value: 'startDate,endDate',
          inputType: 'el-daterange'
        },
        {
          label: '仓管员',
          value: 'adminId',
          inputType: 'el-select-remote',
          httpUrl: 'list/search/user',
          dataSource: 'list',
          title: 'adminId',
          dataValue: 'id',
          dataLabel: 'name',
          placeholder: '仓管员'
        },
        {
          label: '调出仓库',
          value: 'fromWarehouseId',
          inputType: 'el-select',

          httpUrl: '/list/combobox/warehouse',
          dataSource: 'list',
          title: 'fromWarehouseId',
          dataValue: 'id',
          dataLabel: 'name',
          placeholder: '调出仓库'
        },
        {
          label: '调入仓库',
          value: 'toWarehouseId',
          inputType: 'el-select',

          httpUrl: '/list/combobox/warehouse',
          dataSource: 'list',
          title: 'toWarehouseId',
          dataValue: 'id',
          dataLabel: 'name',
          placeholder: '调入仓库'
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
          label: '业务类型',
          value: 'businessType',
          inputType: 'el-select',

          httpUrl: '/basicData/queryDataDict2List',
          requestParams: { dataDictKey: 'BUSSINESS_TYPE' },
          dataSource: 'fontMaps',
          title: 'businessType',
          dataValue: 'key',
          dataLabel: 'value',
          placeholder: '业务类型'
        }
      ],
      // 单条数据展开
      tableDataExpand: [],

      // 发送批量禁用启用的数据
      searchTFs: {},
      dataForm: {},
      dataList: [],
      dataListLoading: false,
      dataListSelections: [],
      transOutNewtabsVisible: false,
      businessType: '01'
    }
  },

  created () {
    this.getDataList()
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
      // 调出仓库
      this.$http
        .get(this.$http.adornUrl('list/combobox/warehouse'))
        .then(({ data }) => {
          this.fromWarehouseIdOptions = data.list
          this.toWarehouseIdOptions = data.list
        })
      this.$http({
        url: this.$http.adornUrl(`warehouse/whtransferout/info/${row.id}`),
        method: 'get'
      }).then(({ data }) => {
        if (data && data.code === 0) {
          const whTransferOutEntity =
            data.transferPackingInfo.whTransferOutEntity
          const whTransferOutDetailList =
            data.transferPackingInfo.whTransferOutDetailList
          whTransferOutDetailList.forEach(item => {
            this.$set(
              item,
              'fromWarehouseId',
              whTransferOutEntity.fromWarehouseId
            )
            this.$set(item, 'toWarehouseId', whTransferOutEntity.toWarehouseId)
          })
          this.$set(row, 'tableDataExpand', whTransferOutDetailList)
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
      if (val != undefined) {
        this.paginationData.currPage = val
      }
      this.dataListLoading = true
      this.$http({
        url: this.$http.adornUrl('warehouse/whtransferout/list'),
        method: 'post',
        data: Object.assign(
          {},
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
      this.dataListSelections.every(item => {
        return item.dictDocStatus === '01' || item.dictDocStatus === '04'
      })
        ? (this.isDeleteHandle = false)
        : (this.isDeleteHandle = true)
    },
    // 新增 / 修改
    addOrUpdateHandle (id, type) {
      this.transOutDetaileVisible = true
      this.$nextTick(() => {
        this.$refs.transOutDetaile.init(id, type)
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
          url: this.$http.adornUrl('warehouse/whtransferout/delete'),
          method: 'delete',
          data: this.$http.adornData(ids, false)
        }).then(({ data }) => {
          if (data && data.code === 0) {
            this.getDataList(1)
            this.$notify.success({
              message: '操作成功',
              duration: 5000
            })
          } else {
            this.$notify.error({
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
          url: this.$http.adornUrl(`warehouse/whtransferout/revoke/${id}`),
          method: 'put'
        }).then(({ data }) => {
          if (data && data.code === 0) {
            this.getDataList()
            this.$notify({
              title: '提示',
              message: '操作成功',
              type: 'success',
              duration: 1000
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
    )
  }
}
</script>
