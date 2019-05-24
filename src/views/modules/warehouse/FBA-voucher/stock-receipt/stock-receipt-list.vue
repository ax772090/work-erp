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
              stripe
              border
              highlight-current-row
              v-loading="dataListLoading"
              :default-sort="{prop: 'code', order: 'descending'}">
      <el-table-column prop="code"
                       label="单号"
                       width="160"
                       @click.native="addOrUpdateHandle(id)"
                       sortable
                       :show-overflow-tooltip="true">
        <template slot-scope="scope">
          <a @click="addOrUpdateHandle(scope.row.id,'canCheck')"
             class="a-click-hover">{{scope.row.code}}</a>
        </template>
      </el-table-column>
      <el-table-column prop="compName"
                       width="200"
                       label="库存公司"></el-table-column>
      <el-table-column prop="date"
                       sortable
                       label="入库日期"></el-table-column>
      <el-table-column prop="channelName"
                       width="180"
                       label="来源店铺"></el-table-column>
      <el-table-column prop="wareHouseName"
                       width="180"
                       label="签收仓库"></el-table-column>
      <el-table-column prop="admin"
                       label="仓管员"></el-table-column>
      <el-table-column prop="docStatus"
                       label="单据状态"></el-table-column>
      <el-table-column prop="updUser"
                       label="修改人"></el-table-column>
      <el-table-column prop="updTime"
                       sortable
                       width="180"
                       label="修改时间"></el-table-column>
      <el-table-column prop="confirmUser"
                       label="确认人"></el-table-column>
      <el-table-column prop="confirmTime"
                       sortable
                       width="180"
                       label="确认时间"></el-table-column>
    </el-table>
    <el-row>
      <pagination-all v-model="paginationData"
                      @paginationChangeHandle="getDataList"></pagination-all>
    </el-row>

    <!-- 弹窗, 查看 -->
    <stock-edit v-if="addOrUpdateVisible"
                ref="addOrUpdate"
                @refreshDataList="getDataList"></stock-edit>
  </div>
</template>

<script>
// 搜索
import erpSearchPanel from '@/components/erp-search-panel'
// 查看
import stockEdit from './stock-receipt-check'
// 表头处理
import { renderHeaderUtil } from '@/utils/index.js'

// 分页
import paginationAll from '@/components/erp-pagination/pagination-all'
export default {
  components: {
    erpSearchPanel,
    stockEdit,
    paginationAll
  },
  data () {
    return {
      // 数据过滤器
      searchData: {},
      // 下拉
      searchOptions: [
        {
          label: '来源店铺',
          value: 'channelId',
          inputType: 'el-select',
          httpUrl: 'list/combobox/ownChannel',
          requestParams: { platformType: '' },
          dataSource: 'list',
          dataValue: 'id',
          dataLabel: 'name'
        },
        {
          label: '单号',
          value: 'code',
          inputType: 'el-input'
        },
        {
          label: '入库日期',
          value: 'startDate,endDate',
          inputType: 'el-daterange'
        },
        {
          label: '签收仓库',
          value: 'inWarehouseId',
          inputType: 'el-select',
          httpUrl: 'list/combobox/fbawarehouse?type=FBA',
          dataSource: 'list',
          title: 'inWarehouseId',
          dataValue: 'id',
          dataLabel: 'name',
          placeholder: '签收仓库'
        }
      ],
      dataForm: {},
      dataList: [],
      dataListLoading: false,
      addOrUpdateVisible: false,
      // 分页
      paginationData: {
        // 当前页数
        currPage: 1,
        // 一页显示的条数
        pageSize: 10,
        // 总条数
        totalCount: 0,
        // 总页数
        totalPage: 0
      }
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
    // 新增 / 修改/查看
    addOrUpdateHandle (id, type) {
      this.addOrUpdateVisible = true
      this.$nextTick(() => {
        this.$refs.addOrUpdate.init(id, type)
      })
    },
    // 获取数据列表
    getDataList (val) {
      if (val != undefined) {
        this.paginationData.currPage = val
      }
      this.dataListLoading = true
      this.$http({
        url: this.$http.adornUrl(`warehouse/whtransferin/mwslist-in`),
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
        } else {
          this.dataList = []
          this.paginationData.totalCount = 0
          this.$notify.error({
            title: '错误',
            message: data.msg,
            duration: 5000
          })
          return
        }
        this.dataListLoading = false
      })
    }
  }
}
</script>
