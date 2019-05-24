<!-- inventory adjustments(盘库记录) -->
<template>
  <div>
    <el-form :model="searchForm"
             :rules="dataRule"
             ref="searchForm"
             label-width="80px">
      <el-row>
        <el-col :span="6">
          <el-form-item label="店铺名称"
                        prop="channelId"
                        :rules="dataRule.isRequired">
            <select-all v-model="searchForm.channelId"
                        :listDataOption="channelIdOption"
                        data-value="id"
                        data-label="name"></select-all>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12">
          <el-form-item label="时间范围"
                        prop="dateRange"
                        :rules="dataRule.isRequired">
            <el-date-picker type="daterange"
                            v-model="searchForm.dateRange"
                            value-format="yyyy-MM-dd"
                            range-separator="至"
                            start-placeholder="开始日期"
                            end-placeholder="结束日期"></el-date-picker>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <erp-search-panel :searchOptions="searchOptions"
                          selectedOption="sku"
                          @search="getDataList(1)"
                          v-model="searchData"
                          :isResetHandle="true"
                          @resetHandle="resetHandle('searchForm')" />
      </el-row>
      <el-row>
        <!-- <el-button @click="getDataList(1)"
                   type="primary"><i class="iconfont erp-icon-sousuo"></i>搜索</el-button> -->
        <!-- <el-button @click="resetHandle()"
                   type="primary"><i class="iconfont erp-icon-chongzhi"></i>重置</el-button> -->
        <el-button type="primary"
                   @click="exportFile()"
                   v-if="isAuth('report:inventoryadjustments:export')"><i class="iconfont erp-icon-daochu"></i>导出</el-button>
        <div class="fr">最近一次更新时间:{{lastUpdateTime}}</div>
      </el-row>
    </el-form>
    <el-table stripe
              border
              highlight-current-row
              max-height="800"
              :data="dataList"
              v-loading="dataListLoading">
      <el-table-column prop="compName"
                       width="200"
                       label="销售公司"></el-table-column>
      <el-table-column prop="channelName"
                       label="店铺"></el-table-column>
      <el-table-column prop="sellerName"
                       width="150"
                       label="账号"></el-table-column>
      <el-table-column prop="adjustedDate"
                       label="调整日期"></el-table-column>
      <el-table-column prop="transactionItemId"
                       label="明细ID"></el-table-column>
      <el-table-column prop="sku"
                       label="sellsku"></el-table-column>
      <el-table-column prop="fnsku"
                       label="fnsku"></el-table-column>
      <el-table-column prop="prodName"
                       label="产品名称"></el-table-column>
      <el-table-column prop="fulfillmentCenterId"
                       width="100"
                       label="运营中心"></el-table-column>
      <el-table-column prop="quantity"
                       width="100"
                       label="数量"></el-table-column>
      <el-table-column prop="reason"
                       label="理由"></el-table-column>
      <el-table-column prop="disposition"
                       label="状态"></el-table-column>
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
      searchForm: {
        channelId: '',
        dateRange: []
      },
      // 下拉
      searchOptions: [
        {
          label: 'sellsku',
          value: 'sku',
          inputType: 'el-input'
        }, {
          label: '明细ID',
          value: 'transactionItemId',
          inputType: 'el-input'
        }
      ],
      channelIdOption: [], // 店铺账号
      lastUpdateTime: '',
      dataList: [],
      dataListLoading: false,
      dataListSelections: [],
      dataRule: {
        isRequired: [{ required: true, message: '必填项', trigger: 'change' }],
        dateRange: [{ required: true, message: '必填项', trigger: 'change' }]
      }
    }
  },
  created () {
    this.$http
      .get(this.$http.adornUrl('list/combobox/ownChannel'), {
        params: { platformType: '' }
      })
      .then(({ data }) => {
        this.channelIdOption = data.list
      })
  },
  methods: {
    // 获取数据列表
    getDataList (val) {
      this.$refs['searchForm'].validate(valid => {
        if (valid) {
          if (val) {
            this.paginationData.currPage = val
          }
          let dataObj = {}
          if (this.searchForm) {
            dataObj = Object.assign({}, this.searchData, this.searchForm)
          }
          this.dataListLoading = true
          this.$http({
            url: this.$http.adornUrl('report/inventoryadjustments/list'),
            method: 'post',
            data: Object.assign({}, this.paginationData, dataObj)
          }).then(({ data }) => {
            if (data && data.code === 0) {
              this.lastUpdateTime = data.lastUpdateTime
              this.dataList = data.pageList.dataList
              this.paginationData.totalCount = data.pageList.page.totalCount
            } else {
              this.dataList = []
              this.paginationData.totalCount = 0
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
    exportFile () {
      this.$refs['searchForm'].validate(valid => {
        if (valid) {
          let obj
          if (this.searchData) {
            obj = Object.assign({}, this.searchForm, this.searchData)
          }
          window.open(
            this.$http.tokens(
              'report/inventoryadjustments/export',
              obj
            )
          )
        }
      })
    },

    // 表头内容过长处理
    renderHeader (h, g) {
      return renderHeaderUtil(h, g)
    }
  }
}
</script>
