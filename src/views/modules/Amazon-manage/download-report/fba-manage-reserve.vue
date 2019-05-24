<!-- FBA管理库存（主表） -->
<template>
  <div class="mod-config">
    <el-form :model="searchForm"
             :rules="dataRule"
             ref="searchForm"
             :inline="true"
             @keyup.enter.native="getDataList()">
      <el-row>
        <el-form-item label="店铺名称"
                      prop="channelId">
          <select-all v-model="searchForm.channelId"
                      :listDataOption="channelIdOptions"
                      data-value="id"
                      :isSelectChange="true"
                      @selectChange="channelIdExchange"
                      data-label="name"></select-all>
        </el-form-item>
      </el-row>
      <el-row>
        <erp-search-panel v-model="searchData"
                          :searchOptions="searchOptions"
                          @search="getDataList(1)"
                          :isResetHandle="true"
                          @resetHandle="resetHandle('searchForm')" />
      </el-row>
      <el-row>
        <el-button type="primary"
                   @click="fbaReserveUpload()"
                   v-if="isAuth('mws:mwsrptunsuppressedinventory:export')">
          <i class="iconfont erp-icon-daochu"></i>导出</el-button>
        <div class="fr">最后更新时间：{{lastUpdateTime}}</div>
      </el-row>
    </el-form>
    <el-table stripe
              border
              highlight-current-row
              max-height="800"
              :data="dataList"
              v-loading="dataListLoading">
      <el-table-column prop="compName"
                       min-width="160"
                       label="销售公司"></el-table-column>
      <el-table-column prop="channelName"
                       width="120"
                       label="店铺"></el-table-column>
      <el-table-column prop="sellerName"
                       width="120"
                       label="账号"></el-table-column>
      <el-table-column prop="warehouseName"
                       width="150"
                       label="仓库"></el-table-column>
      <el-table-column prop="sku"
                       width="160"
                       label="sellsku"></el-table-column>
      <el-table-column prop="fnsku"
                       width="120"
                       label="FNSKU"></el-table-column>
      <el-table-column prop="asin"
                       width="120"
                       label="ASIN"></el-table-column>
      <el-table-column prop="productName"
                       label="产品描述"
                       min-width="150"
                       show-overflow-tooltip></el-table-column>
      <el-table-column prop="condition"
                       label="状态"></el-table-column>
      <el-table-column prop="yourPrice"
                       label="价格"></el-table-column>
      <el-table-column prop="mfnListingExists"
                       label="自配送"></el-table-column>
      <el-table-column prop="mfnFulfillableQuantity"
                       width="90"
                       label="自配送数量"></el-table-column>
      <el-table-column prop="afnListingExists"
                       width="90"
                       label="亚马逊配送"></el-table-column>
      <el-table-column prop="afnWarehouseQuantity"
                       label="入库数"></el-table-column>
      <el-table-column prop="afnFulfillableQuantity"
                       label="可售数"></el-table-column>
      <el-table-column prop="afnUnsellableQuantity"
                       label="不可售数"></el-table-column>
      <el-table-column prop="afnReservedQuantity"
                       label="预留数"></el-table-column>
      <el-table-column prop="afnTotalQuantity"
                       label="总计"></el-table-column>
      <el-table-column prop="perUnitVolume"
                       width="90"
                       label="每立方体积"></el-table-column>
      <el-table-column prop="afnInboundWorkingQuantity"
                       label="发货数量"></el-table-column>
      <el-table-column prop="afnInboundShippedQuantity"
                       label="在途数量"></el-table-column>
      <el-table-column prop="afnInboundReceivingQuantity"
                       label="接收数量"></el-table-column>
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
import selectAll from '@/components/erp-select/select-all'
import {
  initData
} from '@/mixins/initData.js'
export default {
  mixins: [
    initData
  ],
  components: {
    erpSearchPanel,
    paginationAll,
    selectAll
  },
  data () {
    return {
      channelIdOptions: [],
      lastUpdateTime: '',
      searchData: {},
      searchForm: {
        channelId: '',
        sellerId: ''
      },
      // 下拉
      searchOptions: [
        {
          label: 'sellsku',
          value: 'sku',
          inputType: 'el-input'
        },
        {
          label: 'FNSKU',
          value: 'fnsku',
          inputType: 'el-input'
        },
        {
          label: '状态',
          value: 'condition',
          inputType: 'el-select',
          httpUrl: 'basicData/queryDataDict2List',
          requestParams: { dataDictKey: 'FBA_CONDITION' },
          dataSource: 'fontMaps',
          dataValue: 'key',
          dataLabel: 'value',
          placeholder: '状态'
        }
      ],
      dataForm: {},
      dataList: [],
      dataListLoading: false,
      dataListSelections: [],
      dataRule: {
        channelId: [
          { required: true, message: '必填项', trigger: 'change' }
        ]
      }
    }
  },

  created () {
    this.getDataUrl()
  },
  methods: {
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
      // 有必填字段，先校验必填
      this.$refs['searchForm'].validate((valid) => {
        if (valid) {
          if (val) {
            this.paginationData.currPage = val
          }
          let dataObj = {}
          if (this.searchForm.channelId) {
            dataObj = Object.assign({}, dataObj, {
              channelId: this.searchForm.channelId
            })
          }
          if (this.searchData) {
            dataObj = Object.assign({}, dataObj, this.searchData)
          }
          this.dataListLoading = true
          this.$http({
            url: this.$http.adornUrl('mws/mwsrptunsuppressedinventory/list'),
            method: 'get',
            params: Object.assign({}, this.paginationData, dataObj)
          }).then(({
            data
          }) => {
            if (data && data.code === 0) {
              this.dataList = data.pageList.dataList
              this.paginationData.totalCount = data.pageList.page.totalCount
              this.lastUpdateTime = data.lastUpdateTime
            } else {
              this.dataList = []
              this.paginationData.totalCount = 0
              this.lastUpdateTime = ''
            }
            this.dataListLoading = false
          })
        } else {
          return false
        }
      })
    },

    // 重置
    resetHandle (formName) {
      this.$refs[formName].resetFields()
    },
    channelIdExchange () {
      this.getDataList(1)
    },
    fbaReserveUpload () {
      let obj = Object.assign({}, this.searchData, this.searchForm)
      this.$refs['searchForm'].validate(valid => {
        if (valid) {
          window.open(
            this.$http.tokens(
              'mws/mwsrptunsuppressedinventory/export',
              obj
            )
          )
        }
      })
    }
  }
}
</script>

