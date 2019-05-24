 <!-- 出库 -->
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
              @expand-change="rowExpand"
              @selection-change="selectionChangeHandle">
      <el-table-column type="expand"
                       align="center"
                       label="展开"
                       width="50">
        <template slot-scope="scope">
          <el-table :data="scope.row.tableDataExpand">
            <el-table-column prop="imageUrl"
                             sortable
                             label="产品图片">
              <template slot-scope="scope">
                <tableImg :imageUrl='scope.row.imageUrl'></tableImg>
              </template>
            </el-table-column>
            <el-table-column prop="prodCode"
                             label="产品编码"></el-table-column>
            <el-table-column prop="prodName"
                             label="产品名称"></el-table-column>
            <el-table-column prop="warehouseName"
                             label="仓库"></el-table-column>
            <el-table-column prop="outQty"
                             sortable
                             label="出库数量"></el-table-column>
            <el-table-column prop="dictInventoryStatusName"
                             label="库存状态"></el-table-column>
            <el-table-column prop="remark"
                             label="备注"></el-table-column>
          </el-table>
        </template>
      </el-table-column>
      <el-table-column prop="code"
                       sortable
                       label="出库单号">
        <template slot-scope="scope">
          <a @click="addOrUpdateHandle(scope.row.id, 'canCheck')"
             class="a-click-hover">
            {{scope.row.code}}
          </a>
        </template>
      </el-table-column>
      <el-table-column prop="outstockDate"
                       sortable
                       label="出库日期"></el-table-column>
      <el-table-column prop="dictOutstockTypeName"
                       label="出库类型"></el-table-column>
      <el-table-column prop="channelName"
                       label="来源店铺"></el-table-column>
      <el-table-column prop="deptName"
                       label="部门"></el-table-column>
      <el-table-column prop="warehouseUserName"
                       label="仓管员"></el-table-column>
      <el-table-column prop="warehouseName"
                       label="仓库"></el-table-column>
      <el-table-column prop="dictDocStatusName"
                       label="单据状态"></el-table-column>
    </el-table>
    <!-- 分页 -->
    <el-row>
      <pagination-all v-model="paginationData"
                      @paginationChangeHandle='getDataList'></pagination-all>
    </el-row>
    <!-- 弹窗, 新增 / 修改 -->
    <elseAddorupdate ref="elseAddorupdate"
                     @refreshDataList="getDataList"></elseAddorupdate>
  </div>
</template>
<script>
// 搜索
import erpSearchPanel from '@/components/erp-search-panel'
// 分页
import paginationAll from '@/components/erp-pagination/pagination-all'
import elseAddorupdate from './else-addorupdate'
import { initData } from '@/mixins/initData.js'
// 引入图片
import tableImg from '@/components/list-table/table-img'

export default {
  mixins: [initData],
  components: {
    erpSearchPanel,
    paginationAll,
    elseAddorupdate,
    tableImg
  },
  data () {
    return {
      // 数据过滤器
      searchData: {},
      // 下拉
      searchOptions: [{
        label: '出库单号',
        value: 'code',
        inputType: 'el-input'
      }, {
        label: '出库日期',
        value: 'dateRange',
        inputType: 'el-daterangeArr'
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
    // 展开行
    rowExpand (row) {
      this.getDetailData(row)
    },
    // 获取展开行数据新
    getDetailData (mainData) {
      this.$http({
        url: this.$http.adornUrl(`warehouse/whoutstock/info/${mainData.id}`),
        method: 'get'
      }).then(({ data }) => {
        if (data && data.code === 0) {
          this.$set(mainData, 'tableDataExpand', data.WhOutstockDto.whOutstockDetail)
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
      if (val) {
        this.paginationData.currPage = val
      }
      this.dataListLoading = true
      this.$http({
        url: this.$http.adornUrl('warehouse/whoutstock/fbalist'),
        method: 'post',
        data: Object.assign({}, this.paginationData, this.searchData === undefined ? {} : this.searchData)
      }).then(({ data }) => {
        if (data && data.code === 0) {
          this.dataList = data.pageList.dataList
          this.paginationData.totalCount = data.pageList.page.totalCount
          // 初始化，防止点击展开行立马收缩起来
          for (let i = 0; i < this.dataList.length; i++) {
            this.$set(this.dataList[i], 'tableDataExpand', [])
          }
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
        this.$refs.elseAddorupdate.init(id, type)
      })
    }
  }
}
</script>
