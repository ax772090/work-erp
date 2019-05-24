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
                          @search="getDataList(1)"
                          v-model="searchData"
                          :isResetHandle="true"
                          @resetHandle="resetHandle('dataForm')" />
      </el-row>
      <el-row>
        <el-button type="primary"
                   @click="fbaReceivedExport()"
                   v-if="isAuth('mws:reportinventoryreceiptsdata:export')"><i class="iconfont erp-icon-daochu"></i>导出</el-button>
        <div class="fr">最近一次同步时间:{{lastSyncTime}}</div>
      </el-row>
    </el-form>
    <!-- 表格 -->
    <el-table :data="receivedInventoryList"
              stripe
              border
              highlight-current-row
              v-loading="dataListLoading">
      <el-table-column fixed
                       label="销售公司"
                       prop="compName"></el-table-column>
      <el-table-column label="账号"
                       width="150"
                       prop="sellerName"></el-table-column>
      <el-table-column label="店铺"
                       prop="channelName"></el-table-column>
      <el-table-column label="日期"
                       prop="receivedDate"></el-table-column>
      <el-table-column label="FNSKU"
                       prop="fnsku"></el-table-column>
      <el-table-column label="sellsku"
                       width="250"
                       prop="sku"></el-table-column>
      <el-table-column label="产品描述"
                       prop="productName"
                       :show-overflow-tooltip="true"></el-table-column>
      <el-table-column label="数量"
                       prop="quantity"></el-table-column>
      <el-table-column label="FBAShipmentID"
                       prop="fbaShipmentId"></el-table-column>
      <el-table-column label="运营中心"
                       prop="fulfillmentCenterId"></el-table-column>
    </el-table>
    <el-row>
      <pagination-all @paginationChangeHandle="getDataList"
                      v-model="paginationData"></pagination-all>
    </el-row>
  </div>
</template>
<script>
// 表头处理
import { renderHeaderUtil } from '@/utils/index.js'
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
      lastSyncTime: '',
      dataListLoading: false,
      channelIdOptions: [],
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
        },
        {
          label: 'FBAShipmentID',
          value: 'fbaShipmentId',
          inputType: 'el-input'
        },
        {
          label: '日期',
          value: 'dateRange',
          inputType: 'el-daterangeArr'
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
          if (val != undefined) {
            this.paginationData.currPage = val
          }
          this.dataListLoading = true
          this.$http({
            url: this.$http.adornUrl('mws/reportinventoryreceiptsdata/list'),
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
              this.lastSyncTime = data.lastUpdateTime
            } else {
              this.receivedInventoryList = []
              this.paginationData.totalCount = 0
              this.lastSyncTime = ''
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
      this.$refs['dataForm'].validate(valid => {
        if (valid) {
          if (this.dataForm.channelId) {
            window.open(
              this.$http.tokens(
                'mws/reportinventoryreceiptsdata/export',
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



