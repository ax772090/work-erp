 <!-- 库存调出单 -->
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
              v-loading="dataListLoading">
      <el-table-column prop="code"
                       sortable
                       label="调出单号">
        <template slot-scope="scope">
          <a @click="addOrUpdateHandle(scope.row.id, 'canCheck')"
             class="a-click-hover">
            {{scope.row.code}}
          </a>
        </template>
      </el-table-column>
      <el-table-column prop="compName"
                       label="库存公司"></el-table-column>
      <el-table-column prop="date"
                       sortable
                       label="调出日期"></el-table-column>
      <el-table-column prop="channelName"
                       label="来源店铺"></el-table-column>
      <el-table-column prop="fromWarehouseName"
                       label="调出仓库"></el-table-column>
      <el-table-column prop="dictDocStatusName"
                       label="单据状态"></el-table-column>
    </el-table>
    <!-- 分页 -->
    <el-row>
      <pagination-all v-model="paginationData"
                      @paginationChangeHandle='getDataList'></pagination-all>
    </el-row>
    <!-- 弹窗, 新增 / 修改 -->
    <editor ref="editor"
            @refreshDataList="getDataList"></editor>
  </div>
</template>
<script>
// 搜索
import erpSearchPanel from '@/components/erp-search-panel'
// 分页
import paginationAll from '@/components/erp-pagination/pagination-all'
import editor from './editor'
import { initData } from '@/mixins/initData.js'
export default {
  mixins: [initData],
  components: {
    erpSearchPanel,
    paginationAll,
    editor
  },
  data () {
    return {
      // 数据过滤器
      searchData: {},
      // 下拉
      searchOptions: [{
        label: '库存公司',
        value: 'compId',
        inputType: 'el-select',
        httpUrl: 'sys/organization/select',
        dataSource: 'companyList',
        title: 'compIdList',
        dataValue: 'orgId',
        dataLabel: 'name',
        placeholder: '库存公司'
      }, {
        label: '调出单号',
        value: 'code',
        inputType: 'el-input'
      }, {
        label: '调出仓库',
        value: 'warehouseId',
        inputType: 'el-select',
        httpUrl: 'list/combobox/warehouse',
        dataSource: 'list',
        title: 'warehouseIdList',
        dataValue: 'id',
        dataLabel: 'name',
        placeholder: '调出仓库'
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
      },
      {
        label: '调出日期',
        value: 'dateRange',
        inputType: 'el-daterangeArr'
      }],
      dataForm: {},
      dataList: [],
      tableDataExpand: [],  // 展开行
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
        url: this.$http.adornUrl('warehouse/whtransferout/fbalist'),
        method: 'post',
        data: Object.assign({}, this.paginationData, this.searchData === undefined ? {} : this.searchData)
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

    // 新增 / 编辑 / 修改
    addOrUpdateHandle (id, type) {
      this.$nextTick(() => {
        this.$refs.editor.init(id, type)
      })
    }
  }
}
</script>
