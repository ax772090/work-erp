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
    </el-form>
    <!--采购订单列表-->
    <el-table :data="dataList"
              max-height="600"
              stripe
              border
              highlight-current-row
              v-loading="dataListLoading">
      <el-table-column prop="contractCode"
                       :show-overflow-tooltip="true"
                       sortable
                       width="130"
                       label="合同号"
                       fixed></el-table-column>
      <el-table-column prop="poCode"
                       width="150"
                       :show-overflow-tooltip="true"
                       sortable
                       label="采购订单号"
                       fixed>
      </el-table-column>
      <el-table-column prop="date"
                       sortable
                       label="采购日期"
                       width="110"
                       :show-overflow-tooltip="true"
                       readonly></el-table-column>
      <el-table-column prop="userName"
                       width="120"
                       :show-overflow-tooltip="true"
                       label="采购员"
                       readonly></el-table-column>
      <el-table-column prop="warehouseName"
                       width="110"
                       :show-overflow-tooltip="true"
                       label="收货仓库"
                       readonly></el-table-column>
      <el-table-column prop="imageUrl"
                       :show-overflow-tooltip="true"
                       label="产品图片"
                       width="130">
        <template slot-scope="scope">
          <tableImg :imageUrl="scope.row.imageUrl"></tableImg>
        </template>
      </el-table-column>
      <el-table-column prop="prodCode"
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
      <el-table-column prop="expectDate"
                       sortable
                       label="预计交货日期"
                       width="120"
                       :show-overflow-tooltip="true"
                       readonly></el-table-column>
      <el-table-column prop="poQty"
                       sortable
                       :show-overflow-tooltip="true"
                       label="采购数量"
                       width="100"
                       readonly></el-table-column>
      <el-table-column prop="poQty"
                       label="收货/退货"
                       width="120"
                       :render-header="renderHeaderdelivery">
        <template slot-scope="scope">
          <div>已收：{{scope.row.receiveQty}}</div>
          <div>退货：{{scope.row.returnQty}}</div>
          <div>待收：{{scope.row.waitQty}}</div>
        </template>
      </el-table-column>
      <el-table-column prop="poQty"
                       width="140"
                       :show-overflow-tooltip="true"
                       label="质检相关"
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
                       width="120"
                       :render-header="renderHeaderstorage">
        <template slot-scope="scope">
          <div>已入库：{{scope.row.instockQty}}</div>
          <div>未入库：{{scope.row.unStockQty}}</div>
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
// 引入图片
import tableImg from '@/components/list-table/table-img'
// 紧急入库==>采购入库的编辑
// import purchaseQuality from "../purchase-quality/quality-editor";
// 收货
// import receiveRecordAddorupdate from "../purchase-receive-record/receive-record-addorupdate";
// 入库
// import storageEditor from "../purchase-storage/storage-editor";
// 退货
// import returnEdit from "../purchase-return/stock-return-edit";
import { initData } from '@/mixins/initData.js'
// 引入radio组件
import elRadioGroup from '@/components/erp-radio/radio-all'
export default {
  mixins: [initData],
  components: {
    tableImg,
    erpSearchPanel,
    paginationAll,
    // orderAddorupdate,
    receiveRecordAddorupdate,
    qualityEditor,
    storageEditor,
    returnEdit,
    tableImg,
    elRadioGroup
  },
  data () {
    return {
      // 数据过滤器
      searchData: {},
      // 二级过滤
      dictInventoryStatus: '01',
      isAutofocus: true,
      dataForm: {},
      dataList: [{ message: 11 }],
      // 多选
      dataListSelections: [],
      radioListData: [],
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
          label: '预计交货日期',
          value: 'exportStart,exportEnd',
          inputType: 'el-daterange'
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
    // 表头内容过长处理
    renderHeader (h, g) {
      return renderHeaderUtil(h, g)
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

    // table采购订单号==>采购订单编辑=>查看
    order (id) {
      this.$refs.storageEditor.init(id, 'isDisable')
    },

    // 全部
    dictInventoryAll (value) {
      this.getDataList(1)
    },
    resetHandle () {
      this.dictInventoryStatus = '01'
    },

    // 下载
    download () {
      this.searchData = Object.assign({}, this.searchData, { dictInventoryStatus: this.dictInventoryStatus }, { fileName: 'potrackingno.xlsx' })
      window.open(
        this.$http.tokens(`warehouse/whreceivepo/purDownload`, this.searchData)
      )
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
