 <!-- 销售退货单 -->
<template>
  <div>
    <el-row @keyup.enter.native="getDataList()">
      <erp-search-panel v-model="searchData"
                        :searchOptions="searchOptions"
                        @search="getDataList(1)" />
    </el-row>
    <el-table :data="dataList"
              stripe
              border
              highlight-current-row
              v-loading="dataListLoading"
              @selection-change="selectionChangeHandle">
      <el-table-column prop="code"
                       sortable
                       label="退货单号">
        <template slot-scope="scope">
          <a @click="addOrUpdateHandle(scope.row.id, 'canCheck')"
             class="a-click-hover">
            {{scope.row.code}}
          </a>
        </template>
      </el-table-column>
      <el-table-column prop="compName"
                       label="库存公司"></el-table-column>
      <el-table-column prop="returnDate"
                       sortable
                       label="退货日期"></el-table-column>
      <el-table-column prop="channelName"
                       label="来源店铺"></el-table-column>
      <el-table-column prop="warehouseName"
                       label="仓库"></el-table-column>
    </el-table>
    <!-- 分页 -->
    <el-row>
      <pagination-all v-model="paginationData"
                      @paginationChangeHandle='getDataList'></pagination-all>
    </el-row>
    <!-- 弹窗, 新增 / 修改 -->
    <salesAddorupdate ref="salesAddorupdate"
                      @refreshDataList="getDataList"></salesAddorupdate>
  </div>
</template>
<script>
// 搜索
import erpSearchPanel from '@/components/erp-search-panel'
// 分页
import paginationAll from '@/components/erp-pagination/pagination-all'
import salesAddorupdate from './sales-addorupdate'
import { initData } from '@/mixins/initData.js'
export default {
  mixins: [
    initData
  ],
  components: {
    erpSearchPanel,
    paginationAll,
    salesAddorupdate
  },
  data () {
    return {
      // 数据过滤器
      searchData: {},
      // 下拉
      searchOptions: [{
        label: '退货日期',
        value: 'dateRange',
        inputType: 'el-daterangeArr'
      }, {
        label: '退货单号',
        value: 'code',
        inputType: 'el-input'
      }, {
        label: '来源店铺',
        value: 'channelId',
        inputType: 'el-select',
        httpUrl: 'list/combobox/ownChannel',
        dataSource: 'list',
        title: 'channelIdList',
        dataValue: 'id',
        dataLabel: 'name',
        placeholder: '来源店铺'
      }, {
        label: '仓库',
        value: 'warehouseId',
        inputType: 'el-select',
        httpUrl: 'list/combobox/fbawarehouse?type=FBA',
        dataSource: 'list',
        title: 'warehouseIdList',
        dataValue: 'id',
        dataLabel: 'name',
        placeholder: '仓库'
      }],

      dataForm: {},
      dataList: [],
      dataListLoading: false,
      dataListSelections: [],
      isBeputDelete: false
    }
  },

  created () {
    this.getDataList()
  },
  methods: {
    // 获取数据列表
    getDataList (val) {
      if (val) {
        this.paginationData.currPage = val
      }
      this.dataListLoading = true
      this.$http({
        url: this.$http.adornUrl('warehouse/whreturnso/list'),
        method: 'post',
        data: Object.assign({}, this.paginationData, this.searchData === undefined ? {} : this.searchData)
      }).then(({ data }) => {
        if (data && data.code === 0) {
          this.dataList = data.pageList.dataList
          this.paginationData.totalCount = data.pageList.page.totalCount
          this.selectionChangeHandle([])
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
        this.isBeputDelete = true
      } else {
        this.isBeputDelete = false
      }
    },

    // 新增 / 编辑 / 修改
    addOrUpdateHandle (id, type) {
      this.$nextTick(() => {
        this.$refs.salesAddorupdate.init(id, type)
      })
    }
  }
}
</script>
