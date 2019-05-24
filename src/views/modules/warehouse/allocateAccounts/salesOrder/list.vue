<!-- 销售订单(内部交易)（主表） -->
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
              max-height="800"
              @expand-change="rowExpand"
              v-loading="dataListLoading">
      <el-table-column type="expand"
                       header-align="center"
                       align="center"
                       fixed
                       width="50"
                       label="展开">
        <template slot-scope="scope">
          <el-table :data="scope.row.detail">
            <el-table-column prop="code"
                             label="产品编码"></el-table-column>
            <el-table-column prop="nameCh"
                             label="产品名称"></el-table-column>
            <el-table-column prop="unitName"
                             label="单位"></el-table-column>
            <el-table-column prop="qty"
                             sortable
                             label="购买数量"></el-table-column>
            <el-table-column prop="price"
                             sortable
                             label="单价"></el-table-column>
            <el-table-column prop="taxRate"
                             sortable
                             label="税率"></el-table-column>
            <el-table-column prop="totalAmount"
                             sortable
                             label="价税合计"></el-table-column>
          </el-table>
        </template>
      </el-table-column>
      <el-table-column prop="code"
                       sortable
                       label="订单编号">
        <template slot-scope="scope">
          <a @click="search(scope.row.id,'canCheck')"
             class="a-click-hover">
            {{scope.row.code}}
          </a>
        </template>
      </el-table-column>
      <el-table-column prop="compName"
                       label="销售公司">
      </el-table-column>
      <el-table-column prop="docStatusValue"
                       label="单据状态">
      </el-table-column>
      <el-table-column prop="orderDate"
                       label="订单日期"
                       sortable>
      </el-table-column>
      <el-table-column prop="customerName"
                       label="客户">
      </el-table-column>
      <el-table-column prop="currencyName"
                       label="结算币种">
      </el-table-column>
    </el-table>
    <!-- 分页 -->
    <el-row>
      <pagination-all v-model="paginationData"
                      @paginationChangeHandle='getDataList'></pagination-all>
    </el-row>
    <!-- 弹窗, 新增 / 修改 -->
    <search ref="search"
            @refreshDataList="getDataList"></search>
  </div>
</template>
<script>
// 搜索
import erpSearchPanel from '@/components/erp-search-panel'
// 分页
import paginationAll from '@/components/erp-pagination/pagination-all'
import search from './search'
import { initData } from '@/mixins/initData.js'
export default {
  mixins: [
    initData
  ],
  components: {
    erpSearchPanel,
    paginationAll,
    search
  },
  data () {
    return {
      isShow: true,
      searchData: {},
      // 下拉
      searchOptions: [
        {
          label: '销售公司',
          value: 'compId',
          inputType: 'el-select',

          httpUrl: 'sys/organization/select',
          dataSource: 'companyList',
          title: 'compIdList',
          dataValue: 'orgId',
          dataLabel: 'name',
          placeholder: '销售公司'
        },
        {
          label: '客户',
          value: 'customerId',
          inputType: 'el-select-remote',
          httpUrl: '/list/search/user',
          queryKey: 'name',
          dataSource: 'list',
          title: 'customerId',
          dataValue: 'id',
          dataLabel: 'name',
          placeholder: '客户'
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
          label: '订单编号',
          value: 'code',
          inputType: 'el-input'
        },
        {
          label: '调拨单号',
          value: 'remark',
          inputType: 'el-input'
        },
        {
          label: '订单日期',
          value: 'planDate,planDateEnd',
          inputType: 'el-daterange'
        }
      ],
      // 是否禁用
      searchTF: true,
      // 发送批量禁用启用的数据
      searchTFs: {},
      dataForm: {},
      dataList: [],
      dateValue: '', // 时间
      dataListLoading: false,
      dataListSelections: [],
      editorVisible: false
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
        url: this.$http.adornUrl(`sales/socompinfo/info/${row.id}`),
        method: 'get'
      }).then(({ data }) => {
        if (data && data.code === 0) {
          row.detail = data.soCompInfo.detailList
          for (let i = 0; i < row.detail.length; i++) {
            this.$set(row.detail[i], 'code', row.detail[i].prodBasicEntity.code)
            this.$set(row.detail[i], 'nameCh', row.detail[i].prodBasicEntity.nameCh)
            this.$set(row.detail[i], 'unitName', row.detail[i].prodBasicEntity.dictUnitEntity.name)
            row.detail[i].price = Number(row.detail[i].price).toFixed(2)
          }
        } else {
          this.$notify.error({
            title: '错误',
            message: data.msg,
            duration: 3000
          })
        }
      })
    },
    // 编辑
    addOrEditProductDev (id, status) {
      this.$nextTick(() => {
        this.$refs.storageEditor.init(id)
      })
      this.editorVisible = true
    },
    handleCommand (command) {
      // this.$message("click on item " + command);
    },

    // 获取数据列表
    getDataList (val, searchObj) {
      if (val != undefined) {
        this.paginationData.currPage = val
      }
      let searchValue
      if (this.searchData) {
        searchValue = Object.assign({}, searchValue, this.searchData)
      }
      this.dataListLoading = true
      this.$http({
        url: this.$http.adornUrl('sales/socompinfo/list'),
        method: 'get',
        params: Object.assign({}, this.paginationData, searchValue)
      }).then(({ data }) => {
        if (data && data.code === 0) {
          this.dataList = data.pageList.dataList
          this.paginationData.totalCount = data.pageList.page.totalCount
          for (const row of this.dataList) {
            this.$set(row, 'detail', [])
          }
        } else {
          // this.dataList = [];
          this.paginationData.totalCount = 0
        }
        this.dataListLoading = false
      })
    },

    // 选择日期进行搜索
    changeDate (dateValue) {
      this.getDataList(1)
    },
    // 采购入库单查看
    search (id, type) {
      this.editorVisible = true
      this.$nextTick(() => {
        this.$refs.search.init(id, type)
      })
    }
  }
}
</script>

