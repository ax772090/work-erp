<template>
  <!-- 库存动作详情 -->
  <div>
    <el-form :inline="true"
             :model="dataForm"
             ref="dataForm"
             :rules="dataRule"
             @keyup.enter.native="getDataList()">
      <el-row>
        <el-form-item label="店铺名称"
                      prop="channelId">
          <select-all v-model="dataForm.channelId"
                      :listDataOption="channelIdOptions"
                      data-value="id"
                      data-label="name"
                      :isSelectChange="true"
                      @selectChange="channelIdExchange"></select-all>
        </el-form-item>

      </el-row>
      <el-row>
        <erp-search-panel :searchOptions="searchOptions"
                          @search="getDataList(1)"
                          v-model="searchData"
                          :isResetHandle="true"
                          @resetHandle="resetHandle('dataForm')" />
      </el-row>
      <el-row>
        <el-button type="primary"
                   @click="fbaReceivedExport()"
                   v-if="isAuth('mws:mwsrptinventorysummary:export')"><i class="iconfont erp-icon-daochu"></i>导出</el-button>
      </el-row>
    </el-form>
    <!-- 表格 -->
    <el-table :data="receivedInventoryList"
              stripe
              border
              highlight-current-row
              v-loading="dataListLoading"
              element-loading-text="拼命加载中">
      <el-table-column label="账号"
                       prop="sellerName"></el-table-column>
      <el-table-column label="店铺"
                       prop="channelName"></el-table-column>
      <el-table-column label="仓库"
                       prop="warehouseName"></el-table-column>
      <el-table-column label="日期"
                       prop="snapshotDate"></el-table-column>
      <el-table-column label="交易类型"
                       prop="transactionTypeName"
                       :render-header="renderHeaderdelivery"></el-table-column>
      <el-table-column label="FNSKU"
                       prop="fnsku"></el-table-column>
      <el-table-column label="SellerSKU"
                       prop="sku"
                       width="150"></el-table-column>
      <el-table-column label="自定义SKU"
                       prop="prodCode"></el-table-column>
      <el-table-column label="产品名称"
                       prop="prodName"
                       show-overflow-tooltip>
        <!-- <template slot-scope="scope">
          <el-tooltip placement="right"
                      :content="scope.row.prodName"
                      class="overflow-hidden">
            <div slot>
            <div enterable
                 placement="right">{{scope.row.prodName}}</div>
            </div>
          </el-tooltip>
        </template> -->
      </el-table-column>
      <el-table-column label="运营中心"
                       prop="fulfillmentCenterId"></el-table-column>
      <el-table-column label="数量"
                       prop="quantity"></el-table-column>
      <el-table-column label="库存属性"
                       prop="disposition"></el-table-column>
    </el-table>
    <el-row>
      <pagination-all @paginationChangeHandle="getDataList"
                      v-model="paginationData"></pagination-all>
    </el-row>
  </div>
</template>
<script>
// 分页
import paginationAll from '@/components/erp-pagination/pagination-all'
// 搜索
import erpSearchPanel from '@/components/erp-search-panel'
import selectAll from '@/components/erp-select/select-all'

export default {
  components: {
    erpSearchPanel,
    paginationAll,
    selectAll
  },
  data () {
    return {
      channelIdOptions: [],
      dataListLoading: false,
      dataForm: {
        channelId: ''
      },
      receivedInventoryList: [],

      // 数据过滤器
      searchData: {},
      dataRule: {
        channelId: [
          { required: true, message: '必填项', trigger: 'change' }
        ]
      },
      // 下拉
      searchOptions: [
        {
          label: '账号',
          value: 'sellerId',
          inputType: 'el-select',
          httpUrl: 'basic/basicseller/listcombobox',
          dataSource: 'list',
          dataValue: 'sellerId',
          dataLabel: 'name',
          placeholder: '账号'
        },
        {
          label: '仓库',
          value: 'warehouseId',
          inputType: 'el-select',
          httpUrl: '/list/combobox/warehouse',
          dataSource: 'list',
          title: 'warehouseId',
          dataValue: 'id',
          dataLabel: 'name',
          placeholder: '仓库'
        },
        {
          label: '日期',
          value: 'dateRange',
          inputType: 'el-daterangeArr'
        },
        {
          label: '交易类型',
          value: 'transactionType',
          inputType: 'el-select',
          httpUrl: '/basicData/queryDataDict2List',
          requestParams: { dataDictKey: 'MWS_RPT_TRANSACTION_TYPE' },
          dataSource: 'fontMaps',
          dataValue: 'key',
          dataLabel: 'value',
          placeholder: '交易类型'
        },
        {
          label: 'SellerSKU',
          value: 'sellersku',
          inputType: 'el-input'
        },
         {
          label: '自定义SKU',
          value: 'prodCode',
          inputType: 'el-input'
        }
      ],
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
    this.getDataUrl()
  },
  methods: {
    channelIdExchange () {
      this.getDataList(1)
    },
    getDataUrl () {
      this.$http.get(this.$http.adornUrl('list/combobox/ownChannel'), { params: { platformType: '' } }).then(({ data }) => {
        this.channelIdOptions = data.list
      })
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
            props: { messages: `shipment： 配送\nreceipt： 接收\nvendor return： 卖家退回(移除)\nwarehouse transfer：库房转仓\nadjustment：盘点\ncustomer return：买家退货` }
          })
        ]
      )
    },

    // 获取数据列表
    getDataList (val) {
      // 有必填字段，先校验
      this.$refs['dataForm'].validate(valid => {
        if (valid) {
          this.$set(this.searchData, 'channelId', this.dataForm.channelId)
          if (val != undefined) {
            this.paginationData.currPage = val
          }
          this.dataListLoading = true
          this.$http({
            url: this.$http.adornUrl('mws/mwsrptinventorysummary/list'),
            method: 'post',
            data: Object.assign(
              {},
              this.paginationData,
              this.searchData == undefined ? {} : this.searchData
            )
          }).then(({ data }) => {
            if (data && data.code === 0) {
              this.receivedInventoryList = data.pageList.dataList
              this.paginationData.totalCount = data.pageList.page.totalCount
            } else {
              this.receivedInventoryList = []
              this.paginationData.totalCount = 0
            }
            this.dataListLoading = false
          })
        } else {
          return false
        }
      })
    },
    resetHandle (formName) {
      this.$refs[formName].resetFields()
    },
    // 导出
    fbaReceivedExport () {
      this.$refs['dataForm'].validate(valid => {
        if (valid) {
          if (this.dataForm.channelId) {
            window.open(
              this.$http.tokens(
                'mws/mwsrptinventorysummary/export',
                this.searchData
              )
            )
          } else {
            this.$notify.error({
              title: '错误',
              message: '暂无可导出数据',
              duration: 5000
            })
          }
        }
      })
    }
  }
}
</script>



