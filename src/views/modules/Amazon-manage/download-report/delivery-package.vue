<!-- 亚马逊出库货件（主表） -->
<template>
  <div>
    <el-form :inline="true"
             :model="searchForm"
             ref="searchForm"
             :rules="dataRule">
      <el-row>
        <el-form-item label="店铺名称"
                      :rules="dataRule.isRequired"
                      prop="channelId">
          <select-all v-model="searchForm.channelId"
                      :listDataOption="channelIdOptions"
                      data-value="id"
                      :isSelectChange="true"
                      @selectChange="channelIdExchange"
                      data-label="name"></select-all>
        </el-form-item>

      </el-row>
      <el-row @keyup.enter.native="getDataList()">
        <erp-search-panel :searchOptions="searchOptions"
                          @search="getDataList(1)"
                          v-model="searchData"
                          :isResetHandle="true"
                          @resetHandle="resetHandle('searchForm')" />
      </el-row>
      <el-row>
        <el-button type="primary"
                   v-if="isAuth('mws:rptfulshipments:export')"
                   @click="fbaReceivedExport()"><i class="iconfont erp-icon-daochu"></i>导出</el-button>
        <div class="fr">最近一次同步时间:{{update}}</div>
      </el-row>
    </el-form>
    <!-- 表格 -->
    <el-table :data="receivedInventoryList"
              stripe
              border
              highlight-current-row
              @selection-change="selectionChangeHandle"
              v-loading="dataListLoading">
      <el-table-column fixed
                       label="账号"
                       width="120"
                       prop="sellerName"></el-table-column>
      <el-table-column fixed
                       label="销售公司"
                       width="150"
                       :show-overflow-tooltip="true"
                       prop="saleComp"></el-table-column>
      <el-table-column label="店铺"
                       width="130"
                       prop="channelName"></el-table-column>
      <el-table-column label="亚马逊订单号"
                       width="160"
                       :show-overflow-tooltip="true"
                       prop="amazonOrderId"></el-table-column>
      <el-table-column label="产品名称"
                       width="120"
                       :show-overflow-tooltip="true"
                       prop="prodName"></el-table-column>
      <el-table-column label="产品描述"
                       width="120"
                       :show-overflow-tooltip="true"
                       prop="productName"></el-table-column>
      <el-table-column label="自定义订单号"
                       width="150"
                       prop="merchantOrderId"></el-table-column>
      <el-table-column label="FBAShipmentID"
                       width="120"
                       :show-overflow-tooltip="true"
                       prop="shipmentId"></el-table-column>
      <el-table-column label="更新日期"
                       width="120"
                       :show-overflow-tooltip="true"
                       prop="purchaseDate"></el-table-column>
      <el-table-column label="运输日期"
                       width="150"
                       :show-overflow-tooltip="true"
                       prop="shipmentDate"></el-table-column>
      <el-table-column label="sellsku"
                       width="230"
                       :show-overflow-tooltip="true"
                       prop="sku"></el-table-column>
      <el-table-column label="发货数量"
                       :show-overflow-tooltip="true"
                       prop="quantityShipped"></el-table-column>
      <el-table-column label="承运商"
                       :show-overflow-tooltip="true"
                       prop="carrier"></el-table-column>
      <el-table-column label="运营跟踪号"
                       width="120"
                       :show-overflow-tooltip="true"
                       prop="trackingNumber"></el-table-column>
      <el-table-column label="预计送达日期"
                       width="120"
                       :show-overflow-tooltip="true"
                       prop="estimatedArrivalDate"></el-table-column>
      <el-table-column :show-overflow-tooltip="true"
                       label="运输渠道"
                       prop="fulfillmentChannel"></el-table-column>
      <el-table-column label="销售渠道"
                       prop="salesChannel"></el-table-column>
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
// 表头处理
import { renderHeaderUtil } from '@/utils/index.js'
export default {
  components: {
    erpSearchPanel,
    paginationAll,
    selectAll
  },
  data () {
    return {
      dataListLoading: false,
      channelIdOptions: [],
      // 多选
      list: [],
      update: '',
      searchForm: {
        channelId: ''
      },
      receivedInventoryList: [],
      dataRule: {
        channelId: [{ required: true, message: '必填项', trigger: 'change' }]
      },
      // 数据过滤器
      searchData: {},
      // 下拉
      searchOptions: [
        {
          label: '亚马逊订单号',
          value: 'amazonOrderId',
          inputType: 'el-input'
        },
        {
          label: 'FBAShipmentID',
          value: 'shipmentId',
          inputType: 'el-input'
        },
        {
          label: 'sellsku',
          value: 'sku',
          inputType: 'el-input'
        },
        {
          label: '运营跟踪号',
          value: 'trackingNumber',
          inputType: 'el-input'
        },
        {
          label: '运输日期',
          value: 'shipmentStartDate,shipmentEndDate',
          inputType: 'el-datetimerange'
        },
        {
          label: '预计送达日期',
          value: 'arrivalStartDate,arrivalEndDate',
          inputType: 'el-datetimerange'
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
    this.$http
      .get(this.$http.adornUrl('list/combobox/ownChannel'), {
        params: { platformType: '' }
      })
      .then(({ data }) => {
        this.channelIdOptions = data.list
      })
  },
  methods: {
    // 表头内容过长处理
    renderHeader (h, g) {
      return renderHeaderUtil(h, g)
    },
    // 获取数据列表
    getDataList (val) {
      this.$refs['searchForm'].validate(valid => {
        if (valid) {
          if (val) {
            this.paginationData.currPage = val
          }
          let dataObj = {}
          if (this.searchForm) {
            dataObj = Object.assign({}, dataObj, this.searchForm)
          }
          if (this.searchData) {
            dataObj = Object.assign({}, dataObj, this.searchData)
          }
          this.dataListLoading = true
          this.$http({
            url: this.$http.adornUrl('mws/rptfulshipments/list'),
            method: 'post',
            data: Object.assign(
              {},
              this.paginationData,
              dataObj
            )
          }).then(({ data }) => {
            if (data && data.code === 0) {
              this.receivedInventoryList = data.pageList.dataList
              this.paginationData.totalCount = data.pageList.page.totalCount
              for (let i = 0; i < this.receivedInventoryList.length; i++) {
                this.update = this.receivedInventoryList[i].updTime
              }
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
    // 多选
    selectionChangeHandle (val) {
      for (let i = 0; i < val.length; i++) {
        const id = val[i].id
        this.list.push(id)
      }
    },
    channelIdExchange () {
      this.getDataList(1)
    },
    // 重置
    resetHandle (formName) {
      this.$refs[formName].resetFields()
    },
    // 导出
    fbaReceivedExport () {
      this.$refs['searchForm'].validate(valid => {
        if (valid) {
          let dataObj = {}
          if (this.searchForm.channelId) {
            dataObj = Object.assign({}, dataObj, {
              channelId: this.searchForm.channelId
            })
          }
          if (this.searchData) {
            dataObj = Object.assign({}, dataObj, this.searchData)
          }
          window.open(
            this.$http.tokens('mws/rptfulshipments/export', dataObj)
          )
        }
      })
    }
  }
}
</script>



