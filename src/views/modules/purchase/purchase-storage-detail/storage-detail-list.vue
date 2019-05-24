<!-- 入库明细报表 -->
<template>
  <div class="mod-config">
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
        <el-button type="primary"
                   v-if="isAuth('warehouse:whinstockpo:instockdetailexport')"
                   :disabled="this.dataList.length <= 0"
                   @click="Export()"><i class="iconfont erp-icon-daochu"></i>导出</el-button>
      </el-row>
    </el-form>

    <el-table stripe
              border
              v-loading="dataListLoading"
              highlight-current-row
              :data="dataList"
              max-height="800">
      <el-table-column label="采购日期"
                       prop="purDate"
                       width="100"
                       sortable>
      </el-table-column>
      <el-table-column label="采购合同号"
                       width="120"
                       prop="contractCode"
                       sortable></el-table-column>
      <el-table-column label="采购订单号"
                       width="110"
                       sortable
                       prop="poCode"></el-table-column>
      <el-table-column label="采购员"
                       prop="userName"></el-table-column>
      <el-table-column label="产品编码"
                       prop="prodCode"
                       width="100"
                       sortable></el-table-column>
      <el-table-column label="产品名称"
                       width="140"
                       prop="prodName"></el-table-column>
      <el-table-column label="数量"
                       prop="instockQty"
                       width="80"
                       sortable></el-table-column>
      <el-table-column label="预计交货日期"
                       prop="expectDate"
                       width="120"
                       sortable></el-table-column>
      <el-table-column label="订单状态"
                       prop="orderStatusName"
                       width="100"
                       sortable></el-table-column>
      <el-table-column label="入库日期"
                       prop="instockDate"
                       width="100"
                       sortable></el-table-column>
      <el-table-column label="入库单号"
                       prop="instockCode"
                       width="100"
                       sortable></el-table-column>
      <el-table-column label="仓库"
                       prop="warehouseName"
                       width="100"
                       sortable></el-table-column>
      <el-table-column label="供应商代码"
                       prop="supplierCode"
                       width="110"
                       sortable></el-table-column>
      <el-table-column label="供应商名称"
                       prop="supplierName"
                       width="110"
                       sortable></el-table-column>
      <el-table-column label="单价"
                       prop="price"
                       width="100"
                       sortable></el-table-column>
      <el-table-column label="结算币别"
                       prop="currencyName"
                       width="100"
                       sortable></el-table-column>
      <el-table-column label="税率"
                       prop="taxRate"
                       width="100"
                       sortable></el-table-column>
      <el-table-column label="总金额"
                       prop="totalAmount"
                       width="100"
                       sortable></el-table-column>
      <el-table-column label="总金额（本位币）"
                       prop="baseTotalAmount"
                       width="140"></el-table-column>
      <el-table-column label="不含税金额（本位币）"
                       prop="baseNoTaxAmount"
                       width="160"></el-table-column>
      <el-table-column label="付款方式"
                       prop="payModeName"
                       width="100"></el-table-column>
      <el-table-column label="采购公司"
                       prop="compName"
                       width="150"></el-table-column>
      <el-table-column label="业务状态"
                       prop="dictBizStatusName"
                       width="100"></el-table-column>
      <el-table-column label="是否含税"
                       prop="bIncludeTaxName"
                       width="100"
                       sortable></el-table-column>
    </el-table>
    <!-- 分页 -->
    <el-row>
      <pagination-all v-model="paginationData"
                      @paginationChangeHandle="getDataList"></pagination-all>
    </el-row>
  </div>
</template>
<script>
// 搜索
import erpSearchPanel from '@/components/erp-search-panel'
// 分页
import paginationAll from '@/components/erp-pagination/pagination-all'
import { initData } from '@/mixins/initData.js'

export default {
  mixins: [initData],
  components: {
    erpSearchPanel,
    paginationAll
  },
  data () {
    return {
      isShow: true,
      searchData: {},
      dateValue: '', // 时间
      // 下拉
      searchOptions: [
        {
          label: '采购合同号',
          value: 'contractCode',
          inputType: 'el-input'
        },
        {
          label: '采购订单号',
          value: 'poCode',
          inputType: 'el-input'
        },
        {
          label: '采购员',
          value: 'userId',
          inputType: 'el-select-remote',
          httpUrl: '/list/search/user',
          queryKey: 'name',
          dataSource: 'list',
          title: 'devUserList',
          dataValue: 'id',
          dataLabel: 'name',
          placeholder: '采购员'
        },
        {
          label: '订单状态',
          value: 'orderStatus',
          inputType: 'el-select',
          dataList: [{
            orderStatus: '0',
            value: '已入库'
          }, {
            orderStatus: '1',
            value: '待收货'
          }],
          title: 'orderStatus',
          dataValue: 'orderStatus',
          dataLabel: 'value',
          placeholder: '订单状态'
        },
        {
          label: '采购日期',
          value: 'purDateStart,purDateEnd',
          inputType: 'el-daterange'
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
          label: '仓库',
          value: 'warehouseId',
          inputType: 'el-select',
          httpUrl: 'list/combobox/warehouse',
          dataSource: 'list',
          title: 'warehouseNameList',
          dataValue: 'id',
          dataLabel: 'name',
          placeholder: '仓库'
        },
        {
          label: '入库单号',
          value: 'instockCode',
          inputType: 'el-input'
        },
        {
          label: '入库日期',
          value: 'instockDateStart,instockDateEnd',
          inputType: 'el-daterange'
        }
      ],
      // 是否禁用
      searchTF: true,
      // 时间过滤
      expectDate: '',
      // 发送批量禁用启用的数据
      searchTFs: {},
      dataForm: {
      },
      tableDataExpand: [], // 展开行
      dataList: [],
      dataListLoading: false,
      dataListSelections: [],
      editorVisible: false
    }
  },

  created () {
    this.getDataList()
  },
  methods: {
    handleCommand (command) {
      // this.$message("click on item " + command);
    },
    // 获取数据列表
    getDataList (val) {
      if (val) {
        this.paginationData.currPage = val
      }
      this.dataListLoading = true
      this.$http({
        url: this.$http.adornUrl('warehouse/whinstockpo/instockdetaillist'),
        method: 'post',
        data:
          this.searchData === undefined
            ? this.paginationData
            : Object.assign({}, this.paginationData, this.searchData)
      }).then(({ data }) => {
        if (data && data.code === 0) {
          this.dataList = data.pageList.dataList
          this.paginationData.totalCount = data.pageList.page.totalCount
          // 初始化，防止点击展开行立马收缩起来
          for (let i = 0; i < this.dataList.length; i++) {
            this.$set(this.dataList[i], 'tableDataExpand', [])
          }
        } else {
          this.paginationData.totalCount = 0
        }
        this.dataListLoading = false
      })
    },

    resetHandle () {
      this.dateValue = ''
    },

    // 导出
    Export () {
      let SearchObj = Object.assign({}, this.searchObj)
      window.open(
        this.$http.tokens(
          'warehouse/whinstockpo/instockdetailexport',
          SearchObj
        )
      )
    }
  }
}
</script>
