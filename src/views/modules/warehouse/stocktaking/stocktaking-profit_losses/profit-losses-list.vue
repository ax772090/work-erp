<template>
  <div>
    <el-form :inline="true"
             :model="dataForm"
             @keyup.enter.native="getDataList()">
      <el-row>
        <erp-search-panel v-model="searchData"
                          :searchOptions="searchOptions"
                          @search="getDataList(1)"></erp-search-panel>
      </el-row>
    </el-form>
    <el-table stripe
              border
              highlight-current-row
              max-height="800"
              :data="dataList"
              v-loading="dataListLoading"
              @expand-change="rowExpand"
              @selection-change="selectionChangeHandle">
      <el-table-column type="expand"
                       align="center"
                       header-align="center"
                       label="展开"
                       width="50">
        <template slot-scope="scope">
          <el-table :data="scope.row.docDetail">
            <el-table-column prop="prodImageUrl"
                             label="产品图片"
                             width="120px;">
              <template slot-scope="scope">
                <tableImg :imageUrl='scope.row.prodImageUrl'></tableImg>
              </template>
            </el-table-column>
            <el-table-column prop="prodCode"
                             label="产品编码"
                             sortable></el-table-column>
            <el-table-column prop="prodName"
                             label="产品名称"></el-table-column>
            <el-table-column prop="warehouseName"
                             label="仓库"></el-table-column>
            <el-table-column prop="qty"
                             label="盘盈/盘亏量"
                             sortable></el-table-column>
            <el-table-column prop="dictInventoryStatusName"
                             label="库存状态"></el-table-column>
            <el-table-column prop="remark"
                             label="备注"></el-table-column>
          </el-table>
        </template>
      </el-table-column>
      <el-table-column prop="code"
                       label="单号"
                       sortable>
        <template slot-scope="scope">
          <a @click="addOrUpdateHandle(scope.row.id, 'isDisabled')"
             class="a-click-hover">{{scope.row.code}}</a>
        </template>
      </el-table-column>
      <el-table-column prop="symbolName"
                       width="100"
                       label="单据类型"></el-table-column>
      <el-table-column prop="stocktakingDate"
                       label="盘点日期"
                       width="130"
                       sortable></el-table-column>
      <el-table-column prop="warehouseName"
                       width="150"
                       label="仓库"></el-table-column>
      <el-table-column prop="stocktakingCode"
                       label="盘点单号"
                       sortable></el-table-column>
      <el-table-column prop="docStatusName"
                       width="100"
                       label="单据状态"></el-table-column>
      <el-table-column prop="remark"
                       label="备注"></el-table-column>
      <el-table-column prop="updUserName"
                       width="130"
                       label="修改人"></el-table-column>
      <el-table-column prop="updTime"
                       label="修改日期"
                       sortable></el-table-column>
      <el-table-column prop="confirmUserName"
                       width="130"
                       label="确认人"></el-table-column>
      <el-table-column prop="confirmTime"
                       label="确认时间"
                       sortable></el-table-column>
      <el-table-column label="操作"
                       fixed="right"
                       width="80">
        <template slot-scope="scope">
          <el-button type="primary"
                     circle
                     size="small"
                     title="打印"
                     @click="print(scope.row.id)">
            <i class="iconfont erp-icon-dayin"></i></el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页 -->
    <el-row>
      <pagination-all v-model="paginationData"
                      @paginationChangeHandle="getDataList"></pagination-all>
    </el-row>
    <!-- 弹窗,修改 -->
    <profitLossesAddorupdate ref="profitLossesAddorupdate"
                             @refreshDataList="getDataList"></profitLossesAddorupdate>
  </div>
</template>
<script>
// 搜索
import erpSearchPanel from '@/components/erp-search-panel'
// 分页
import paginationAll from '@/components/erp-pagination/pagination-all'
// 编辑
import profitLossesAddorupdate from './profit-losses-addorupdate'
import { initData } from '@/mixins/initData.js'
// 引入图片
import tableImg from '@/components/list-table/table-img'
export default {
  mixins: [initData],
  components: {
    erpSearchPanel,
    paginationAll,
    profitLossesAddorupdate,
    tableImg
  },
  data () {
    return {
      // 数据过滤器
      searchData: {},
      // 搜索下拉
      searchOptions: [
        {
          label: '单号',
          value: 'code',
          inputType: 'el-input'
        },
        {
          label: '盘点单号',
          value: 'stocktakingCode',
          inputType: 'el-input'
        },
        {
          label: '仓库',
          value: 'warehouseId',
          inputType: 'el-select',

          httpUrl: 'list/combobox/warehouse',
          dataSource: 'list',
          title: 'warehouseIdList',
          dataValue: 'id',
          dataLabel: 'name',
          placeholder: '仓库'
        },
        {
          label: '盘点日期',
          value: 'dateRange',
          inputType: 'el-daterangeArr'
        },
        {
          label: '单据类型',
          value: 'symbol',
          inputType: 'el-select',

          httpUrl: 'basicData/queryDataDict2List',
          requestParams: { dataDictKey: 'PROFIT_LOSSES_SYMBOL' },
          dataSource: 'fontMaps',
          title: 'symbol',
          dataValue: 'key',
          dataLabel: 'value',
          placeholder: '单据类型'
        }
      ],
      dataForm: {},
      dataList: [],
      dataListLoading: false,
      dataListSelections: []
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
    // 获取展开行数据新
    getDetailData (row) {
      this.$http({
        url: this.$http.adornUrl(`warehouse/whprofitlosses/info/${row.id}`),
        method: 'get'
      }).then(({ data }) => {
        if (data && data.code === 0) {
          this.$set(row, 'docDetail', data.docDetail)
        } else {
          this.$notify.error({
            title: '错误',
            message: data.msg,
            duration: 5000
          })
        }
      })
    },
    // 获取收货订单数据列表
    getDataList (val) {
      if (val) {
        this.paginationData.currPage = val
      }
      this.dataListLoading = true
      this.$http({
        url: this.$http.adornUrl('warehouse/whprofitlosses/list'),
        method: 'post',
        data: Object.assign(
          {},
          this.paginationData,
          this.searchData === undefined ? {} : this.searchData
        )
      }).then(({ data }) => {
        if (data && data.code === 0) {
          this.dataList = data.pageList.dataList
          this.paginationData.totalCount = data.pageList.page.totalCount
          for (const row of this.dataList) {
            this.$set(row, 'docDetail', [])
          }
        } else {
          this.dataList = []
          this.paginationData.totalCount = 0
        }
        this.dataListLoading = false
      })
    },

    // 展开行触发事件
    expandChange (row, expandedRows) {
      this.$http({
        url: this.$http.adornUrl(`warehouse/whprofitlosses/info/${row.id}`),
        method: 'get'
      }).then(({ data }) => {
        if (data && data.code === 0) {
          row.docDetail = data.docDetail
        } else {
          this.$notify.error({
            title: '错误',
            message: data.msg,
            duration: 5000
          })
        }
      })
    },

    // 编辑
    addOrUpdateHandle (id, type) {
      this.$nextTick(() => {
        this.$refs.profitLossesAddorupdate.init(id, type)
      })
    },

    // 多选
    selectionChangeHandle (val) {
      this.dataListSelections = val
    }
  }
}
</script>
