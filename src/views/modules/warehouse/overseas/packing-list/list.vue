<!-- 装箱清单列表 -->
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
                       fixed
                       width="50"
                       label="展开">
        <template slot-scope="scope">
          <el-table :data="scope.row.tableDataExpand">
            <el-table-column prop="cartonNo"
                             label="起始箱号"
                             width="120">
            </el-table-column>
            <el-table-column prop="cartonCount"
                             label="箱数"
                             width="120"></el-table-column>
            <el-table-column prop="channelSku"
                             label="SellSKU"></el-table-column>
            <el-table-column prop="asin"
                             label="ASIN"></el-table-column>
            <el-table-column prop="fnsku"
                             label="FNSKU"></el-table-column>
            <el-table-column prop="prodCode"
                             label="产品编码"></el-table-column>
            <el-table-column prop="prodName"
                             label="产品名称"></el-table-column>
            <el-table-column prop="dictProductPropertiesName"
                             label="产品属性"></el-table-column>
            <el-table-column prop="qty"
                             label="单箱数量"></el-table-column>
            <el-table-column prop="grossHeight"
                             label="单箱重量"></el-table-column>
            <el-table-column prop="cartonSize"
                             label="单箱体积"></el-table-column>
            <el-table-column prop="remark"
                             label="备注"></el-table-column>
          </el-table>
        </template>
      </el-table-column>
      <el-table-column prop="code"
                       label="装箱单号"
                       sortable
                       :show-overflow-tooltip="true">
        <template slot-scope="scope">
          <a @click="addOrUpdateHandle(scope.row.id,'canCheck')"
             class="a-click-hover">{{scope.row.code}}</a>
        </template>
      </el-table-column>
      <el-table-column prop="packingDate"
                       label="装箱日期"
                       width="110"
                       sortable></el-table-column>
      <el-table-column prop="packingUserName"
                       label="装箱员"></el-table-column>
      <el-table-column prop="planCode"
                       label="要货计划单号"
                       width="180"
                       sortable></el-table-column>
      <el-table-column prop="channelName"
                       label="要货店铺"></el-table-column>
      <el-table-column prop="bTransferout"
                       label="已出库"
                       width="80">
        <template slot-scope="scope">
          <el-tag v-if="scope.row.bTransferout == false"
                  size="small"
                  type="danger">否</el-tag>
          <el-tag v-else
                  size="small">是</el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="fbaShipmentId"
                       label="FBAShipmentID"
                       width="120"></el-table-column>
      <el-table-column prop="trackingNo"
                       label="物流跟踪号"
                       width="120"></el-table-column>
      <el-table-column prop="dictExpectTransitName"
                       width="100"
                       label="物流方式"></el-table-column>
      <el-table-column prop="dictDocStatusName"
                       width="100"
                       label="单据状态"></el-table-column>
      <el-table-column prop="addUserName"
                       label="创建人"></el-table-column>
      <el-table-column prop="addTime"
                       label="创建时间"
                       width="170"
                       sortable></el-table-column>
      <el-table-column label="操作"
                       fixed="right"
                       width="80">
        <template slot-scope="scope">
          <el-button type="primary"
                     circle
                     size="small"
                     title="编辑"
                     v-if="isAuth('warehouse:whpacking:update')"
                     @click="addOrUpdateHandle(scope.row.id,'canEdit')">
            <i class="iconfont erp-icon-bianji"></i></el-button>
          <el-button type="danger"
                     circle
                     :disabled="!(scope.row.statusCode === dictDocStatusOption[0].key || scope.row.statusCode === dictDocStatusOption[3].key)"
                     size="small"
                     title="删除"
                     v-if="isAuth('warehouse:whpacking:delete')"
                     @click="deleteHandle(scope.row.id)">
            <i class="iconfont erp-icon-shanchu"></i></el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-row>
      <pagination-all v-model="paginationData"
                      @paginationChangeHandle="getDataList"></pagination-all>
    </el-row>

    <!-- 弹窗, 到货签收 -->
    <packingList-edit v-if="addOrUpdateVisible"
                      ref="addOrUpdate"
                      @refreshDataList="getDataList"></packingList-edit>
  </div>
</template>

<script>
// 搜索
import erpSearchPanel from '@/components/erp-search-panel'
import packingListEdit from './packingList-edit'
// 分页
import paginationAll from '@/components/erp-pagination/pagination-all'
// 表头处理
import { renderHeaderUtil } from '@/utils/index.js'
import { initData } from '@/mixins/initData.js'
export default {
  mixins: [initData],
  components: {
    erpSearchPanel,
    packingListEdit,
    paginationAll
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
      isTransferInHandle: true, // 到货签收控制
      // 数据过滤器
      searchData: {},

      // 下拉
      searchOptions: [
        {
          label: '要货店铺',
          value: 'channelId',
          inputType: 'el-select',
          httpUrl: 'basic/basicchannel/listcombobox',
          requestParams: { platformType: '' },
          dataSource: 'list',
          dataValue: 'id',
          dataLabel: 'name'
        },
        {
          label: 'SellSKU',
          value: 'sellSku',
          inputType: 'el-input'
        },
        {
          label: '装箱单号',
          value: 'code',
          inputType: 'el-input'
        },
        {
          label: '装箱日期',
          value: 'dateRange',
          inputType: 'el-daterangeArr'
        },
        {
          label: '物流跟踪号',
          value: 'trackingNo',
          inputType: 'el-input'
        },
        {
          label: '原要货计划单号',
          value: 'planCode',
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
          label: '装箱员',
          value: 'packingUserId',
          inputType: 'el-select-remote',
          httpUrl: 'list/search/user',
          dataSource: 'list',
          title: 'packingUserId',
          dataValue: 'id',
          dataLabel: 'name',
          placeholder: '装箱员'
        },
        {
          label: '物流方式',
          value: 'dictExpectTransit',
          inputType: 'el-select',
          httpUrl: 'basicData/queryDataDict2List',
          requestParams: { dataDictKey: 'TRANSPORT_MODE' },
          dataSource: 'fontMaps',
          title: 'dictExpectTransit',
          dataValue: 'key',
          dataLabel: 'value',
          placeholder: '物流方式'
        },
        {
          label: 'FBAShipmentID',
          value: 'fbaShipmentId',
          inputType: 'el-select',
          httpUrl: 'warehouse/whpacking/queryfba/',
          requestParams: { id: '' },
          dataSource: 'list',
          title: 'FBAShipmentID',
          dataValue: 'key',
          dataLabel: 'value',
          placeholder: 'FBAShipmentID'
        }
      ],

      // 发送批量禁用启用的数据
      searchTFs: {},
      dataList: [],
      dataListLoading: false,
      uploadPickDisable: true, // 下载
      dataListSelections: [],
      addOrUpdateVisible: false,
      businessType: '01',
      dataForm: {},
      tableDataExpand: [] // 展开行
    }
  },

  created () {
    this.getDataList()
  },
  methods: {
    // 展开行
    rowExpand (row) {
      this.getDetailData(row)
    },
    // 多选
    selectionChangeHandle (val) {
      this.dataListSelections = val
      if (this.dataListSelections.length <= 0) {
        this.uploadPickDisable = true
        return
      }
      this.uploadPickDisable = false
    },
    // 获取展开行数据新
    getDetailData (mainData) {
      this.$http({
        url: this.$http.adornUrl(`warehouse/whpacking/info/${mainData.id}`),
        method: 'get'
      }).then(({ data }) => {
        if (data && data.code === 0) {
          this.$set(
            mainData,
            'tableDataExpand',
            data.whPackingDto.whPackingDetailList
          )
        } else {
          this.$notify.error({
            title: '错误',
            message: data.msg,
            duration: 5000
          })
        }
      })
    },
    // 表头内容过长处理
    renderHeader (h, g) {
      return renderHeaderUtil(h, g)
    },
    // 获取数据列表
    getDataList (val) {
      if (val != undefined) {
        this.paginationData.currPage = val
      }
      this.dataListLoading = true
      this.$http({
        url: this.$http.adornUrl('warehouse/whpacking/list'),
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
          // 初始化，防止点击展开行立马收缩起来
          for (let i = 0; i < this.dataList.length; i++) {
            this.$set(this.dataList[i], 'tableDataExpand', [])
          }
        } else {
          this.dataList = []
          this.paginationData.totalCount = 0
        }
        this.dataListLoading = false
      })
    },
    // 编辑/查看
    addOrUpdateHandle (id, type) {
      this.addOrUpdateVisible = true
      this.$nextTick(() => {
        this.$refs.addOrUpdate.init(id, type)
      })
    },
    // 查看
    // seacher (id) {
    //   this.addOrUpdateVisible = true
    //   this.$nextTick(() => {
    //     this.$refs.addOrUpdate.init(id, 'search')
    //   })
    // },
    // 删除
    deleteHandle: _.debounce(
      async function deleteHandle (id) {
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
            url: this.$http.adornUrl('warehouse/whpacking/delete'),
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
      },
      1000,
      {
        leading: true,
        trailing: false
      }
    )
  }
}
</script>