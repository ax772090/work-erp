<!--销售出库单列表-->
<template>
  <div>
    <el-form :inline="true"
             :model="dataForm"
             @keyup.enter.native="getDataList()">
      <el-row>
        <erp-search-panel v-model="searchData"
                          :searchOptions="searchOptions"
                          @search="getDataList(1)" />
      </el-row>
    </el-form>

    <el-table :data="dataForm.dataList"
              stripe
              border
              highlight-current-row
              max-height="800"
              v-loading="dataListLoading"
              @selection-change="selectionChangeHandle">
      <el-table-column prop="code"
                       label="销售出库单号"
                       sortable>
        <template slot-scope="scope">
          <a @click="saleSearch(scope.row.id,'canCheck')"
             class="a-click-hover">{{scope.row.code}}</a>
        </template>
      </el-table-column>
      <el-table-column prop="date"
                       label="出库日期"
                       sortable>
      </el-table-column>
      <el-table-column prop="stockComp"
                       label="库存公司">
      </el-table-column>
      <el-table-column prop="whName"
                       label="仓库">
      </el-table-column>
      <el-table-column prop="userName"
                       label="仓管员">
      </el-table-column>
      <el-table-column prop="status"
                       label="单据状态">
      </el-table-column>
      <el-table-column prop="updUser"
                       label="修改人">
      </el-table-column>
      <el-table-column prop="updTime"
                       label="修改时间"
                       sortable>
      </el-table-column>
    </el-table>
    <!-- 分页 -->
    <el-row>
      <pagination-all v-model="paginationData"
                      @paginationChangeHandle='getDataList'></pagination-all>
    </el-row>
    <!-- 弹窗, 新增 / 修改 -->
    <AddOrUpdate ref="addOrUpdate"
                 @refreshDataList="getDataList"></AddOrUpdate>
  </div>
</template>
<script>
// 搜索
import erpSearchPanel from '@/components/erp-search-panel'
// 分页
import paginationAll from '@/components/erp-pagination/pagination-all'
import AddOrUpdate from './add-update'
import { initData } from '@/mixins/initData.js'
export default {
  mixins: [
    initData
  ],
  components: {
    erpSearchPanel,
    paginationAll,
    AddOrUpdate
  },
  data () {
    return {
      // 数据过滤器
      searchData: {},
      // 下拉
      searchOptions: [
        {
          label: '库存公司',
          value: 'compId',
          inputType: 'el-select',

          httpUrl: 'sys/organization/select',
          dataSource: 'companyList',
          title: 'compIdList',
          dataValue: 'orgId',
          dataLabel: 'name',
          placeholder: '库存公司'
        },
        {
          label: '仓库',
          value: 'fromWarehouseId',
          inputType: 'el-select',
          httpUrl: '/list/combobox/warehouse',
          dataSource: 'list',
          title: 'fromWarehouseId',
          dataValue: 'id',
          dataLabel: 'name',
          placeholder: '仓库'
        },
        {
          label: '仓管员',
          value: 'adminId',
          inputType: 'el-select-remote',

          httpUrl: '/list/search/user',
          queryKey: 'name',
          dataSource: 'list',
          title: 'adminId',
          dataValue: 'id',
          dataLabel: 'name',
          placeholder: '仓管员'
        },
        {
          label: '出库单号',
          value: 'code',
          inputType: 'el-input'
        },
        {
          label: '出库日期',
          value: 'dateRange',
          inputType: 'el-daterangeArr'
        },
        {
          label: '调拨单号',
          value: 'remark',
          inputType: 'el-input'
        }
      ],
      dataListLoading: false, // loading加载
      dataForm: {
        dataList: []
      }
    }
  },
  created () {
    this.getDataList()
  },
  methods: {
    //   获取数据列表
    getDataList (val) {
      if (val) {
        this.paginationData.currPage = val
      }
      this.dataListLoading = true
      this.$http({
        url: this.$http.adornUrl('warehouse/whtransfersale/list'),
        method: 'post',
        data:
          this.searchData == undefined
            ? this.paginationData
            : Object.assign({}, this.paginationData, this.searchData)
      }).then(({ data }) => {
        if (data && data.code === 0) {
          this.dataForm.dataList = data.pageList.dataList
          this.paginationData.totalCount = data.pageList.page.totalCount
        } else {
          this.paginationData.totalCount = 0
        }
        this.dataListLoading = false
      })
    },
    // 多选
    selectionChangeHandle (val) {
      this.dataListSelections = val
    },
    // 查看
    saleSearch (id, type) {
      this.$nextTick(() => {
        this.$refs.addOrUpdate.init(id, type)
      })
    }

  }
}
</script>
