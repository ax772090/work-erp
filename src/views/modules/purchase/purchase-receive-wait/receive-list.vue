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
        <el-radio-group :radioListData='radioListData'
                        v-model="dictInventoryStatus"
                        @change="dictInventoryAll"></el-radio-group>
        <el-button type="primary"
                   @click="download()"
                   class="grid-content-right"
                   v-if="isAuth('warehouse:whreceivepo:purDownload')"><i class="iconfont erp-icon-xiazai"></i>下载</el-button>
      </el-row>
      <el-row>
        <el-button type="primary"
                   @click="batchGoods()"
                   :disabled="dataListSelections.length <= 0">批量收货</el-button>
        <el-button type="primary"
                   @click="batchQuality()"
                   :disabled="dataListSelections.length <= 0">批量质检</el-button>
        <el-button type="primary"
                   @click="batchStorage()"
                   :disabled="dataListSelections.length <= 0">批量入库</el-button>
        <el-dropdown>
          <el-button type="primary"
                     :disabled="dataListSelections.length <= 0">
            质检状态
            <i class="el-icon-arrow-down el-icon--right"></i>
          </el-button>
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item command="qualityStatus"
                              @click.native="qualityStatus('no')">待检</el-dropdown-item>
            <el-dropdown-item command="qualityStatus"
                              @click.native="qualityStatus('yes')">完成</el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
        <!-- <el-button type="primary"
                   @click="manualClosed()"
                   v-if="isAuth('warehouse:whreceivepo:purClose')"
                   :disabled='isDisabled || dataListSelections.length <= 0'>手工关闭</el-button> -->
        <div class="grid-content-right">
          <el-button type="primary"
                     @click="batchReturns()"
                     :disabled="dataListSelections.length <= 0">批量退货</el-button>
          <el-button type="primary"
                     @click="urgencyStorage()"
                     :disabled="dataListSelections.length <= 0">紧急入库</el-button>
        </div>
      </el-row>
    </el-form>
    <!--采购订单列表-->
    <el-table :data="dataList"
              max-height="600"
              stripe
              border
              highlight-current-row
              v-loading="dataListLoading"
              @selection-change="selectionChangeHandle">
      <el-table-column type="selection"
                       width="50"
                       align="center"
                       header-align="center"
                       :show-overflow-tooltip="true"
                       fixed></el-table-column>
      <el-table-column prop="contractCode"
                       :show-overflow-tooltip="true"
                       sortable
                       label="合同号"
                       width="130"
                       fixed></el-table-column>
      <el-table-column prop="poCode"
                       :show-overflow-tooltip="true"
                       sortable
                       label="采购订单号"
                       width="150"
                       fixed>
      </el-table-column>
      <el-table-column prop="date"
                       sortable
                       label="采购日期"
                       width="100"
                       :show-overflow-tooltip="true"
                       readonly></el-table-column>
      <el-table-column prop="expectDate"
                       sortable
                       width="100"
                       label="到货日期"
                       :show-overflow-tooltip="true"
                       readonly></el-table-column>
      <el-table-column prop="expectDate"
                       sortable
                       width="100"
                       label="是否关闭"
                       :show-overflow-tooltip="true"
                       readonly>
        <template slot-scope="scope">
          <el-tag v-if="scope.row.closeStatus === 'NORAML'"
                  size="small"
                  type="danger">否</el-tag>
          <el-tag v-else
                  size="small">是</el-tag>
        </template>

      </el-table-column>
      <el-table-column prop="supplierName"
                       :show-overflow-tooltip="true"
                       label="供应商名称"
                       width="200"
                       readonly></el-table-column>
      <el-table-column prop="userName"
                       :show-overflow-tooltip="true"
                       label="采购员"
                       width="100"
                       readonly></el-table-column>
      <el-table-column prop="warehouseName"
                       :show-overflow-tooltip="true"
                       label="收货仓库"
                       width="100"
                       readonly></el-table-column>
      <el-table-column prop="imageUrl"
                       :show-overflow-tooltip="true"
                       label="产品图片"
                       width="120">
        <template slot-scope="scope">
          <tableImg :imageUrl='scope.row.imageUrl'></tableImg>

        </template>
      </el-table-column>
      <el-table-column prop="prodCode"
                       width="200"
                       :show-overflow-tooltip="true"
                       label="产品编码 / 名称"
                       readonly>
        <template slot-scope="scope">
          <div class="ellipsis">{{scope.row.prodCode}}</div>
          <div class="ellipsis">{{scope.row.prodName}}</div>
        </template>
      </el-table-column>
      <el-table-column prop="specifications"
                       label="规格型号"></el-table-column>
      <el-table-column prop="poQty"
                       sortable
                       :show-overflow-tooltip="true"
                       label="采购数量"
                       width="100"
                       readonly></el-table-column>
      <el-table-column prop="poQty"
                       label="收货/退货"
                       width="110"
                       :render-header="renderHeaderdelivery">
        <template slot-scope="scope">
          <div>已收：{{scope.row.receiveQty}}</div>
          <div>退货：{{scope.row.returnQty}}</div>
          <div>待收：{{scope.row.waitQty}}</div>
        </template>
      </el-table-column>
      <el-table-column prop="poQty"
                       :show-overflow-tooltip="true"
                       label="质检相关"
                       width="130"
                       readonly>
        <template slot-scope="scope">
          <div>是否质检：
            <el-tag v-if="scope.row.isNeedInspect === true"
                    size="small">是</el-tag>
            <el-tag v-else
                    type="danger"
                    size="small">否</el-tag>
          </div>
          <div>合格：{{scope.row.qualifiedQty}}</div>
          <div>不合格：{{scope.row.defectiveQty}}</div>
        </template>
      </el-table-column>
      <el-table-column prop="poQty"
                       label="入库相关"
                       width="110"
                       :render-header="renderHeaderstorage">
        <template slot-scope="scope">
          <div>已入库：{{scope.row.instockQty}}</div>
          <div>未入库：{{scope.row.unStockQty}}</div>
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
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item command="receive"
                                @click.native="receiveHandle(scope.row)"
                                :disabled="!scope.row.waitQty > 0">收货</el-dropdown-item>
              <el-dropdown-item command="instock"
                                @click.native="storageHandle(scope.row)"
                                :disabled="!scope.row.unStockQty > 0">入库</el-dropdown-item>
              <el-dropdown-item command="outstock"
                                @click.native="returnHandle(scope.row)"
                                :disabled="!scope.row.defectiveQty > 0">退货</el-dropdown-item>
              <el-dropdown-item command="outstock"
                                v-if="isAuth('pur:posncode:save')"
                                @click.native="registerSN(scope.row)">登记SN码</el-dropdown-item>
              <el-dropdown-item command="outstock"
                                :disabled="scope.row.closeStatus !== 'NORAML'"
                                @click.native="manualClosed(scope.row)"
                                v-if="isAuth('warehouse:whreceivepo:purClose')">手工关闭</el-dropdown-item>
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
    <receiveRecordAddorupdate ref="receiveRecordAddorupdate"
                              :receiveData="getDataList"
                              @refreshDataList="getDataList"></receiveRecordAddorupdate>
    <qualityEditor ref="qualityEditor"
                   :receiveData="getDataList"
                   @refreshDataList="getDataList"></qualityEditor>
    <storageEditor ref="storageEditor"
                   :receiveData="getDataList"
                   @refreshDataList="getDataList"></storageEditor>
    <returnEdit ref="returnEdit"
                :receiveData="getDataList"
                @refreshDataList="getDataList"></returnEdit>
    <!-- 弹窗,修改 -->
    <receiveSN ref="receiveSN"
               @refreshDataList="getDataList()"></receiveSN>
    <!-- 手工关闭 -->
    <orderClose ref="orderClose"
                @refreshDataList="getDataList"></orderClose>
  </div>
</template>
<script>
// 搜索
import erpSearchPanel from '@/components/erp-search-panel'
// 分页
import paginationAll from '@/components/erp-pagination/pagination-all'
// table采购订单号==>采购订单编辑=>查看
// import orderAddorupdate from "../purchase-order/order-addorupdate";
// 批量收货==>收货记录列表的编辑
import receiveRecordAddorupdate from '../purchase-receive-record/receive-record-addorupdate'
// 批量质检==>采购质检的编辑
import qualityEditor from '../purchase-quality/quality-editor'
// 批量入库==>采购入库的编辑
import storageEditor from '../purchase-storage/storage-editor'
// 批量退货==>退货列表的编辑
import returnEdit from '../purchase-return/return-edit'
// 表头处理
import { renderHeaderUtil } from '@/utils/index.js'
import orderClose from './order-close'
// 紧急入库==>采购入库的编辑
// import purchaseQuality from "../purchase-quality/quality-editor";
// 收货
// import receiveRecordAddorupdate from "../purchase-receive-record/receive-record-addorupdate";
// 入库
// import storageEditor from "../purchase-storage/storage-editor";
// 退货
// import returnEdit from "../purchase-return/stock-return-edit";
import { initData } from '@/mixins/initData.js'
// 引入图片
import tableImg from '@/components/list-table/table-img'
// 引入radio组件
import elRadioGroup from '@/components/erp-radio/radio-all'
// 登记SN
import receiveSN from './receive-SN'
export default {
  mixins: [initData],
  components: {
    erpSearchPanel,
    paginationAll,
    // orderAddorupdate,
    receiveRecordAddorupdate,
    qualityEditor,
    storageEditor,
    returnEdit,
    tableImg,
    elRadioGroup,
    receiveSN,
    orderClose
  },
  data () {
    return {
      isDisabled: false,
      radioListData: [],
      // 数据过滤器
      searchData: {},
      // 二级过滤
      dictInventoryStatus: '01',
      isAutofocus: true,
      dataForm: {},
      dataList: [{ message: 11 }],
      // 多选
      dataListSelections: [],
      ismanualClosed: true,
      // 搜索下拉
      searchOptions: [
        {
          label: '采购单号',
          value: 'code',
          inputType: 'el-input'
        },
        {
          label: '收货仓库',
          value: 'warehouseId',
          inputType: 'el-select',
          httpUrl: 'list/combobox/warehouse',
          dataSource: 'list',
          title: 'warehouseId',
          dataValue: 'id',
          dataLabel: 'name',
          placeholder: '仓库'
        },
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
          label: '采购日期',
          value: 'startDate,endDate',
          inputType: 'el-daterange'
        },
        {
          label: '到货日期',
          value: 'expectStart,expectEnd',
          inputType: 'el-daterange'
        },
        {
          label: '供应商名称',
          value: 'supplierId',
          inputType: 'el-select-remote',
          httpUrl: 'basic/basicsupplier/list-used?b_used=true',
          queryKey: 'name',
          dataSource: 'list',
          title: 'supplierIdList',
          dataValue: 'id',
          dataLabel: 'name',
          placeholder: '供应商'
        },
        {
          label: '合同编码',
          value: 'contractCode',
          inputType: 'el-input'
        }
      ],
      dataListLoading: false,
      recordEditVisible: false,
      orderAddVisible: false,
      purchaseQualityVisible: false
    }
  },

  created () {
    this.getDataList()
    this.getQualityType()
  },

  methods: {
    getQualityType () {
      // 质检类型
      this.$http
        .get(this.$http.adornUrl('basicData/queryDataDict2List'), {
          params: {
            dataDictKey: 'FOLLOWING_CONDITION'
          }
        })
        .then(({
          data
        }) => {
          this.radioListData = data.fontMaps
          this.radioListData.unshift({ key: '', value: '全部' })
        })
    },
    // 给表格加上批注
    renderHeaderdelivery (h, { column }) {
      let l = column.label.length
      let f = 16
      column.minWidth = f * (l + 1)
      return h(
        'div',
        {
          style: 'margin-left: 10px;padding:5px'
        },
        [
          column.label,
          h('question-icon', {
            props: { messages: '待收数量 = 采购数量 - 已收数量' }
          })
        ]
      )
    },
    renderHeaderstorage (h, { column }) {
      let l = column.label.length
      let f = 18
      column.minWidth = f * (l + 1)
      return h(
        'div',
        {
          style: 'margin-left: 10px;padding:5px'
        },
        [
          column.label,
          h('question-icon', {
            props: {
              messages:
                '未入库数量 = 已收货数 - 不合格数 - 已入库数（当已收货数 = 0时，不计算）'
            }
          })
        ]
      )
    },
    // 获取数据列表
    getDataList (val, searchObj) {
      if (val) {
        this.paginationData.currPage = val
      }
      let searchValue
      if (this.searchData) {
        searchValue = Object.assign({}, searchValue, this.searchData)
      }

      if (this.dictInventoryStatus) {
        searchValue = Object.assign({}, searchValue, {
          dictInventoryStatus: this.dictInventoryStatus
        })
      }

      this.dataListLoading = true
      this.$http({
        url: this.$http.adornUrl('warehouse/whreceivepo/purList'),
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

    // 多选
    selectionChangeHandle (val) {
      this.dataListSelections = val
      if (this.dataListSelections.length === 0) {
        this.isDisabled = true
      } else if (this.dataListSelections.length === 1) {
        this.isDisabled = false
      }
      // 判断每一个数组元素的调入仓库是否和第一个相同，如果每个都相同，产品一键组合按钮才可以用
      this.dataListSelections.every((item, index, arr) => {
        return (
          arr[index].closeStatus === 'NORAML'
        )
      })
        ? (this.isDisabled = false)
        : (this.isDisabled = true)
    },

    // table采购订单号==>采购订单编辑=>查看
    order (id) {
      this.$refs.storageEditor.init(id, 'isDisable')
    },

    // 全部
    dictInventoryAll (value) {
      // this.dictInventoryStatus = value
      this.getDataList(1)
      // this.getDataList(1, {dictInventoryStatus: 'all'})
    },

    // // 待收货
    // dictInventoryAll() {
    //   this.getDataList(1, {dictInventoryStatus: '01'})
    // },

    // // 待质检
    // dictInventoryAll() {
    //   this.getDataList(1, {dictInventoryStatus: '02'})
    // },

    // // 待入库
    // dictInventoryAll() {
    //   this.getDataList(1, {dictInventoryStatus: '03'})
    // },

    resetHandle () {
      this.dictInventoryStatus = '01'
    },

    // 收货
    receiveHandle: _.debounce(
      async function receiveHandle (row) {
        var ids = row.poDetailId
          ? [row.poDetailId]
          : this.dataListSelections.map(item => {
            return item.poDetailId
          })
        this.$http({
          url: this.$http.adornUrl('warehouse/whreceivepo/receiveBatch'),
          method: 'post',
          data: ids
        }).then(({ data }) => {
          if (data && data.code === 0) {
            this.$nextTick(() => {
              this.$refs.receiveRecordAddorupdate.init(
                '',
                'receiveList',
                data.poReceiveDto
              )
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
      1000,
      {
        leading: true,
        trailing: false
      }
    ),

    // 入库
    storageHandle: _.debounce(
      async function storageHandle (row) {
        var ids = row.poDetailId
          ? [row.poDetailId]
          : this.dataListSelections.map(item => {
            return item.poDetailId
          })
        this.$http({
          url: this.$http.adornUrl('warehouse/whinstockpo/instockBatch'),
          method: 'post',
          data: ids
        }).then(({ data }) => {
          if (data && data.code === 0) {
            this.$nextTick(() => {
              this.$refs.storageEditor.init(
                '',
                'receiveList',
                data.poInstockDto
              )
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
      1000,
      {
        leading: true,
        trailing: false
      }
    ),

    // 下载
    download () {
      this.searchData = Object.assign({}, this.searchData, { dictInventoryStatus: this.dictInventoryStatus }, { fileName: 'potracking.xlsx' })
      window.open(
        this.$http.tokens(`warehouse/whreceivepo/purDownload`, this.searchData)
      )
    },

    // 退货
    returnHandle: _.debounce(
      async function returnHandle (row) {
        var ids = row.poDetailId
          ? [row.poDetailId]
          : this.dataListSelections.map(item => {
            return item.poDetailId
          })
        this.$http({
          url: this.$http.adornUrl('warehouse/whreturnpo/returnBatch'),
          method: 'post',
          data: ids
        }).then(({ data }) => {
          if (data && data.code === 0) {
            this.$nextTick(() => {
              this.$refs.returnEdit.init('', 'receiveList', data)
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
      1000,
      {
        leading: true,
        trailing: false
      }
    ),

    // 批量收货
    batchGoods: _.debounce(
      async function batchGoods () {
        let id
        var ids = id
          ? [id]
          : this.dataListSelections.map(item => {
            return item.poDetailId
          })
        this.$http({
          url: this.$http.adornUrl('warehouse/whreceivepo/receiveBatch'),
          method: 'post',
          data: ids
        }).then(({ data }) => {
          if (data && data.code === 0) {
            this.$nextTick(() => {
              this.$refs.receiveRecordAddorupdate.init(
                '',
                'receiveList',
                data.poReceiveDto
              )
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
      1000,
      {
        leading: true,
        trailing: false
      }
    ),

    // 批量质检
    batchQuality: _.debounce(
      async function batchQuality () {
        let id
        var ids = id
          ? [id]
          : this.dataListSelections.map(item => {
            return item.poDetailId
          })
        this.$http({
          url: this.$http.adornUrl('qc/qcinspection/inspectionBatch'),
          method: 'post',
          data: ids
        }).then(({ data }) => {
          if (data && data.code === 0) {
            this.$nextTick(() => {
              this.$refs.qualityEditor.init('', 'receiveList', data)
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
      1000,
      {
        leading: true,
        trailing: false
      }
    ),

    // 批量入库
    batchStorage: _.debounce(
      async function batchStorage () {
        let id
        var ids = id
          ? [id]
          : this.dataListSelections.map(item => {
            return item.poDetailId
          })
        this.$http({
          url: this.$http.adornUrl('warehouse/whinstockpo/instockBatch'),
          method: 'post',
          data: ids
        }).then(({ data }) => {
          if (data && data.code === 0) {
            this.$nextTick(() => {
              this.$refs.storageEditor.init(
                '',
                'receiveList',
                data.poInstockDto
              )
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
      1000,
      {
        leading: true,
        trailing: false
      }
    ),

    // 批量退货
    batchReturns: _.debounce(
      async function batchReturns () {
        let id
        var ids = id
          ? [id]
          : this.dataListSelections.map(item => {
            return item.poDetailId
          })
        this.$http({
          url: this.$http.adornUrl('warehouse/whreturnpo/returnBatch'),
          method: 'post',
          data: ids
        }).then(({ data }) => {
          if (data && data.code === 0) {
            this.$nextTick(() => {
              this.$refs.returnEdit.init('', 'receiveList', data)
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
      1000,
      {
        leading: true,
        trailing: false
      }
    ),

    // 紧急入库
    urgencyStorage: _.debounce(
      async function urgencyStorage () {
        let id
        var ids = id
          ? [id]
          : this.dataListSelections.map(item => {
            return item.poDetailId
          })
        this.$http({
          url: this.$http.adornUrl('warehouse/whinstockpo/urgentInstock'),
          method: 'post',
          data: ids
        }).then(({ data }) => {
          if (data && data.code === 0) {
            this.$nextTick(() => {
              this.$refs.storageEditor.init(
                '',
                'receiveList',
                data.poInstockDto
              )
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
      1000,
      {
        leading: true,
        trailing: false
      }
    ),

    // 质检状态
    qualityStatus: _.debounce(
      async function qualityStatus (status) {
        let id
        var ids = id
          ? [id]
          : this.dataListSelections.map(item => {
            return item.poDetailId
          })
        this.$http({
          url: this.$http.adornUrl('warehouse/whreceivepo/openandclose'),
          method: 'post',
          data: { ids: ids, status: status }
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
    // 登记SN码
    registerSN (row) {
      this.$nextTick(() => {
        this.$refs.receiveSN.init(row)
      })
    },

    // 手工关闭
    manualClosed (item) {
      this.$refs.orderClose.init(item)
    }
  }
}
</script>
<style scoped>
.ellipsis {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
</style>
