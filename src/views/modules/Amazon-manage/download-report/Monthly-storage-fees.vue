<!-- 每月库存历史记录（主表） -->
<template>
  <div class="mod-config">
    <el-form :model="searchForm"
             :rules="dataRule"
             ref="searchForm"
             label-width="80px">
      <el-row>
        <el-form-item label="店铺名称"
                      prop="channelId"
                      :rules="dataRule.isRequired">
          <select-all v-model="searchForm.channelId"
                      :listDataOption='channelIdOption'
                      dataValue='id'
                      dataLabel='name'></select-all>
        </el-form-item>
        <el-form-item label="FNSKU"
                      prop="sku">
          <el-input placeholder
                    v-model="searchForm.sku"
                    clearable></el-input>
        </el-form-item>
        <el-form-item label="选择月份"
                      prop="yearMonth"
                      :rules="dataRule.dateValue">
          <el-date-picker v-model="searchForm.yearMonth"
                          value-format="yyyy-MM"
                          type="month"
                          placeholder="选择月"></el-date-picker>
        </el-form-item>
      </el-row>
      <el-row>
        <el-button @click="getDataList(1)"
                   type="primary"><i class="iconfont erp-icon-sousuo"></i>搜索</el-button>
        <el-button @click="resetHandle()"
                   type="primary"><i class="iconfont erp-icon-chongzhi"></i>重置</el-button>
        <el-button @click="fbaReceivedExport()"
                   v-if="isAuth('mws:mwsrptstoragefeecharges:export')"
                   type="primary"><i class="iconfont erp-icon-daochu"></i>导出</el-button>
        <div class="grid-content-right">
          最近一次同步时间：{{lastUpdateTime}}
        </div>
      </el-row>
    </el-form>
    <el-table stripe
              border
              highlight-current-row
              max-height="800"
              :data="dataList"
              v-loading="dataListLoading">
      <el-table-column prop="channelName"
                       fixed
                       label="店铺"></el-table-column>
      <el-table-column prop="compName"
                       label="销售公司"></el-table-column>
      <el-table-column prop="sellerName"
                       width="150"
                       label="账号"></el-table-column>
      <el-table-column prop="asin"
                       label="ASIN"></el-table-column>
      <el-table-column prop="fnsku"
                       label="FNSKU"></el-table-column>
      <el-table-column prop="productName"
                       show-overflow-tooltip
                       width='150'
                       label="产品描述"></el-table-column>
      <el-table-column prop="fulfillmentCenter"
                       label="运营中心"></el-table-column>
      <el-table-column prop="countryCode"
                       width="120"
                       label="国家/地区代码"></el-table-column>
      <el-table-column prop="longestSide"
                       label="最长边"></el-table-column>
      <el-table-column prop="medianSide"
                       label="次长边"></el-table-column>
      <el-table-column prop="shortestSide"
                       label="最短边"></el-table-column>
      <el-table-column prop="measurementUnits"
                       label="计量单位"></el-table-column>
      <el-table-column prop="weight"
                       label="重量"></el-table-column>
      <el-table-column prop="weightUnits"
                       label="重量单位"></el-table-column>
      <el-table-column prop="itemVolume"
                       label="商品体积"></el-table-column>
      <el-table-column prop="volumeUnits"
                       label="体积单位"></el-table-column>
      <el-table-column prop="averageQuantityOnHand"
                       width="160"
                       label="现有库存的平均体积"></el-table-column>
      <el-table-column prop="averageQuantityPendingRemoval"
                       width="160"
                       label="待移除商品的平均体积"></el-table-column>
      <el-table-column prop="estimatedTotalItemVolume"
                       width="130"
                       label="预计商品总体积"></el-table-column>
      <el-table-column prop="monthOfCharge"
                       label="收费月份"></el-table-column>
      <el-table-column prop="storageRate"
                       label="仓储费用"></el-table-column>
      <el-table-column prop="currency"
                       label="货币"></el-table-column>
      <el-table-column prop="estimatedMonthlyStorageFee"
                       width="130"
                       label="每月预算仓储费"></el-table-column>
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
// 表头处理
import { renderHeaderUtil } from '@/utils/index.js'
import { initData } from '@/mixins/initData.js'
export default {
  mixins: [initData],
  components: {
    erpSearchPanel,
    paginationAll,
    selectAll
  },
  data () {
    return {
      searchData: {},
      lastUpdateTime: '',
      searchForm: {
        channelId: '',
        sku: '',
        yearMonth: []
      },
      channelIdOption: [], // 店铺账号
      dataForm: {
        date: ''
      },
      dataList: [],
      dataListLoading: false,
      dataListSelections: [],
      editorVisible: false,
      dataRule: {
        isRequired: [{ required: true, message: '必填项', trigger: 'change' }],
        dateValue: [{ required: true, message: '必填项', trigger: 'change' }]
      }
    }
  },

  created () {
    this.$http.get(this.$http.adornUrl('list/combobox/ownChannel'), { params: { platformType: '' } }).then(({ data }) => { this.channelIdOption = data.list })
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
          this.dataListLoading = true
          this.$http({
            url: this.$http.adornUrl('mws/mwsrptstoragefeecharges/list'),
            method: 'get',
            params: Object.assign(
              {},
              this.paginationData,
              dataObj
            )
          }).then(({ data }) => {
            if (data && data.code === 0) {
              this.dataList = data.pageList.dataList
              this.lastUpdateTime = data.lastUpdateTime
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
      })
    },
    // 重置
    resetHandle () {
      this.searchData = {}
      this.searchForm = {}
    },

    // 导出
    fbaReceivedExport () {
      this.$refs['searchForm'].validate(valid => {
        if (valid) {
          window.open(
            this.$http.tokens('mws/mwsrptstoragefeecharges/export', this.searchForm)
          )
        }
      })
    }
  }
}
</script>

