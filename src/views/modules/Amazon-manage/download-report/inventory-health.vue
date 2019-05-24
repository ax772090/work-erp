<!--亚马逊库存状况(主表)-->
<template>
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
                      :isSelectChange="true"
                      @selectChange="channelIdExchange"
                      data-label="name"></select-all>
        </el-form-item>
      </el-row>
      <el-row>
        <erp-search-panel :searchOptions="searchOptions"
                          selectedOption="sku"
                          @search="getDataList(1)"
                          v-model="searchData"
                          :isResetHandle="true"
                          @resetHandle="resetHandle('dataForm')" />
      </el-row>
      <el-row>
        <el-button type="primary"
                   @click="fbaReceivedExport()"
                   v-if="isAuth('mws:rpthealth:exportPage')"><i class="iconfont erp-icon-daochu"></i>导出</el-button>
        <div class="fr">最近一次同步时间:{{lastUpdateTime}}</div>
      </el-row>
    </el-form>
    <!-- 表格 -->
    <el-table :data="receivedInventoryList"
              stripe
              border
              highlight-current-row
              v-loading="dataListLoading">
      <el-table-column fixed
                       label="账号"
                       width="150"
                       prop="sellerName"></el-table-column>
      <el-table-column fixed
                       label="更新日期"
                       width="150"
                       prop="snapshotDate"></el-table-column>
      <el-table-column label="销售公司/店铺"
                       width="170"
                       :show-overflow-tooltip="true"
                       prop="channelName">
        <template slot-scope="scope">
          <div>
            <p>{{scope.row.compName}}</p>
            <p>{{scope.row.channelName}}</p>
          </div>

        </template></el-table-column>
      <el-table-column label="sellsku"
                       width="250"
                       class="ellipsis"
                       prop="sku">
        <template slot-scope="scope">
          <div>sku:{{scope.row.sku}}</div>
          <div>fnsku:{{scope.row.fnsku}}</div>
          <div>asin:{{scope.row.asin}}</div>
        </template>
      </el-table-column>
      <el-table-column label="SKU情况"
                       width="250"
                       class="ellipsis"
                       prop="fnsku">
        <template slot-scope="scope">
          <div>状况：{{scope.row.condition}}</div>
          <div>分类：{{scope.row.productGroup}}</div>
          <div>排名：{{scope.row.salesRank}}</div>
        </template>
      </el-table-column>
      <el-table-column label="数量"
                       width="150"
                       :show-overflow-tooltip="true"
                       prop="sku">
        <template slot-scope="scope">
          <div>总数：{{scope.row.totalQuantity}}</div>
          <div>可售：{{scope.row.sellableQuantity}}</div>
          <div>不可售：{{scope.row.unsellableQuantity}}</div>
        </template>
      </el-table-column>
      <el-table-column label="可售数量（库龄天数）"
                       width="160"
                       prop="productName">
        <template slot-scope="scope">
          <div>0-90天：{{scope.row.invAge0To90Days}}</div>
          <div>91-180天：{{scope.row.invAge91To180Days}}</div>
          <div>181-270天：{{scope.row.invAge181To270Days}}</div>
          <div>271-365天：{{scope.row.invAge271To365Days}}</div>
          <div>>365天：{{scope.row.invAge365PlusDays}}</div>
        </template>
      </el-table-column>
      <el-table-column label="发货量"
                       width="150"
                       :show-overflow-tooltip="true"
                       prop="quantity">
        <template slot-scope="scope">
          <div>1天内：{{scope.row.unitsShippedLast24Hrs}}</div>
          <div>7天内：{{scope.row.unitsShippedLast7Days}}</div>
          <div>30天内：{{scope.row.unitsShippedLast30Days}}</div>
          <div>90天内：{{scope.row.unitsShippedLast90Days}}</div>
          <div>180天内：{{scope.row.unitsShippedLast180Days}}</div>
          <div>365天内：{{scope.row.unitsShippedLast365Days}}</div>
        </template>
      </el-table-column>
      <el-table-column label="周销售库存数"
                       width="250"
                       :show-overflow-tooltip="true"
                       prop="quantity">
        <template slot-scope="scope">
          <div>过去7天内：{{scope.row.weeksOfCoverT7}}</div>
          <div>过去30天内：{{scope.row.weeksOfCoverT30}}</div>
          <div>过去90天内：{{scope.row.weeksOfCoverT90}}</div>
          <div>过去180天内：{{scope.row.weeksOfCoverT180}}</div>
          <div>过去365天内：{{scope.row.weeksOfCoverT365}}</div>
        </template>
      </el-table-column>
      <el-table-column label="亚马逊库存数量"
                       width="120"
                       :show-overflow-tooltip="true"
                       prop="quantity">
        <template slot-scope="scope">
          <div>新品：{{scope.row.numAfnNewSellers}}</div>
          <div>二手：{{scope.row.numAfnUsedSellers}}</div>
        </template>
      </el-table-column>
      <el-table-column label="商品价格"
                       width="130"
                       :show-overflow-tooltip="true"
                       prop="quantity">
        <template slot-scope="scope">
          <div>货币：{{scope.row.currency}}</div>
          <div>商品价：{{scope.row.yourPrice}}</div>
          <div>销售价：{{scope.row.salesPrice}}</div>
        </template>
      </el-table-column>
      <el-table-column label="库存商品价格"
                       width="130"
                       :show-overflow-tooltip="true"
                       prop="quantity">
        <template slot-scope="scope">
          <div>新品最低：{{scope.row.lowestAfnNewPrice}}</div>
          <div>二手最低：{{scope.row.lowestAfnUsedPrice}}</div>
          <div>新品最高：{{scope.row.lowestMfnNewPrice}}</div>
          <div>二手最高：{{scope.row.lowestMfnUsedPrice}}</div>
        </template>
      </el-table-column>
      <el-table-column label="预计长期仓储数量/费用"
                       width="150"
                       prop="quantity">
        <template slot-scope="scope">
          <div>6个月以上：{{scope.row.qtyToBeChargedLtsf6Mo}}</div>
          <div>12个月以上：{{scope.row.qtyToBeChargedLtsf12Mo}}</div>
        </template>
      </el-table-column>
      <el-table-column label="出入库数量"
                       :show-overflow-tooltip="true"
                       width="100"
                       prop="quantity">
        <template slot-scope="scope">
          <div>移除中：{{scope.row.qtyWithRemovalsInProgress}}</div>
          <div>入库中：{{scope.row.inBoundQuantity}}</div>
          <div>推荐入库：{{scope.row.inboundRecommendQuantity}}</div>
        </template>
      </el-table-column>
      <el-table-column label="是否危险品"
                       :show-overflow-tooltip="true"
                       prop="quantity">
        <template slot-scope="scope">
          <div>危险品：{{scope.row.isHazmat}}</div>
          <div>限制：{{scope.row.asinLimit}}</div>
        </template>
      </el-table-column>
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
// 表头处理
import { renderHeaderUtil } from '@/utils/index.js'
import selectAll from '@/components/erp-select/select-all'

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
      lastUpdateTime: '',
      dataForm: {
        channelId: '',
        sku: '',
        FBAShipmentID: ''
      },
      receivedInventoryList: [],
      dataRule: {
        channelId: [
          { required: true, message: '必填项', trigger: 'change' }
        ]
      },
      // 数据过滤器
      searchData: {},
      // 下拉
      searchOptions: [
        {
          label: 'sellsku',
          value: 'sku',
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
    // 表头内容过长处理
    renderHeader (h, g) {
      return renderHeaderUtil(h, g)
    },
    getDataUrl () {
      this.$http
        .get(this.$http.adornUrl('list/combobox/ownChannel'), {
          params: { platformType: '' }
        })
        .then(({ data }) => {
          this.channelIdOptions = data.list
        })
    },
    // 获取数据列表
    getDataList (val) {
      // 有必填字段，先校验
      this.$refs['dataForm'].validate(valid => {
        if (valid) {
          this.$set(this.searchData, 'channelId', this.dataForm.channelId)
          if (val !== undefined) {
            this.paginationData.currPage = val
          }
          this.dataListLoading = true
          this.$http({
            url: this.$http.adornUrl('mws/rpthealth/list'),
            method: 'get',
            params: Object.assign(
              {},
              this.paginationData,
              this.searchData === undefined ? {} : this.searchData
            )
          }).then(({ data }) => {
            if (data && data.code === 0) {
              this.receivedInventoryList = data.pageList.dataList
              for (let i = 0; i < this.receivedInventoryList.length; i++) {
                this.lastUpdateTime = this.receivedInventoryList[i].updTime
              }
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
    channelIdExchange () {
      this.getDataList(1)
    },
    resetHandle (formName) {
      this.$refs[formName].resetFields()
    },
    // 导出
    fbaReceivedExport () {
      // 有必填字段，先校验
      this.$refs['dataForm'].validate(valid => {
        if (valid) {
          window.open(
            this.$http.tokens(
              'mws/rpthealth/exportPage',
              this.searchData
            )
          )
        }
      })
    }
  }
}
</script>
<style scoped>
.ellipsis {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
</style>




