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
        <el-form-item label="sellsku"
                      prop="sku">
          <el-input placeholder
                    v-model="searchForm.sku"
                    clearable></el-input>
        </el-form-item>
        <el-form-item label="月份"
                      prop="month"
                      :rules="dataRule.dateValue">
          <el-date-picker v-model="searchForm.month"
                          value-format="MM/yyyy"
                          type="month"
                          placeholder="选择月"></el-date-picker>
        </el-form-item>
      </el-row>
    </el-form>
    <el-row>
      <el-button @click="getDataList(1)"
                 type="primary"><i class="iconfont erp-icon-sousuo"></i>搜索</el-button>
      <el-button @click="resetHandle()"
                 type="primary"><i class="iconfont erp-icon-chongzhi"></i>重置</el-button>
      <el-button @click="fbaReceivedExport()"
                 v-if="isAuth('mws:monthinventory:export')"
                 type="primary"><i class="iconfont erp-icon-daochu"></i>导出</el-button>

      <div class="fr">
        最近一次同步时间：{{update}}
      </div>
    </el-row>
    <el-table stripe
              border
              highlight-current-row
              max-height="800"
              :data="dataList"
              v-loading="dataListLoading">
      <el-table-column label="账号"
                       width="150"
                       prop="sellerName"></el-table-column>
      <el-table-column prop="month"
                       width="100"
                       sortable
                       label="月份"></el-table-column>
      <el-table-column prop="saleCompany"
                       width="200"
                       label="销售公司"></el-table-column>
      <el-table-column prop="chanelName"
                       label="店铺"></el-table-column>
      <el-table-column prop="fnSku"
                       width="130"
                       label="fnsku"></el-table-column>
      <el-table-column prop="sellerSku"
                       label="sellsku"></el-table-column>
      <el-table-column prop="customSku"
                       label="产品名称"></el-table-column>
      <el-table-column prop="productName"
                       show-overflow-tooltip
                       label="产品描述"></el-table-column>
      <el-table-column prop="averageQuantity"
                       width="100"
                       label="平均数量"></el-table-column>
      <el-table-column prop="endQuantity"
                       width="100"
                       label="月底数量"></el-table-column>
      <el-table-column prop="fulfillmentCenterId"
                       width="100"
                       label="运营中心"></el-table-column>
      <el-table-column prop="detailedDisposition"
                       width="100"
                       label="库存状态"></el-table-column>
      <el-table-column prop="country"
                       width="100"
                       label="国家/地区"></el-table-column>
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
      update: '',
      searchForm: {
        channelId: '',
        sku: '',
        month: []
      },
      channelIdOption: [], // 店铺账号
      dataForm: {
        date: ''
      },
      month: '', // 时间
      dataList: [],
      dataListLoading: false,
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
            url: this.$http.adornUrl('mws/monthinventory/list'),
            method: 'post',
            data: Object.assign(
              {},
              this.paginationData,
              dataObj
            )
          }).then(({ data }) => {
            if (data && data.code === 0) {
              this.dataList = data.pageList.dataList
              this.paginationData.totalCount = data.pageList.page.totalCount
              for (let i = 0; i < this.dataList.length; i++) {
                this.update = this.dataList[i].updTime
              }
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
            this.$http.tokens('mws/monthinventory/export', this.searchForm)
          )
        }
      })
    }
  }
}
</script>


