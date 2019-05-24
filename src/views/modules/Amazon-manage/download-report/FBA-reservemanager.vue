<!-- FBA库存管理（主表） -->
<template>
  <div class="mod-config">
    <el-form :model="searchForm"
             :rules="dataRule"
             :inline="true"
             ref="searchForm"
             @keyup.enter.native="getDataList()"
             class="demo-form-inline">
      <el-row>
        <el-form-item label="店铺名称"
                      :rules="dataRule.isRequired"
                      prop="channelId">
          <select-all v-model="searchForm.channelId"
                      :listDataOption="accountOptions"
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

        <el-button @click="download()"
                   type="primary"
                   v-if="isAuth('fba:mwsinventory:exportPage')"><i class="iconfont erp-icon-daochu"></i>导出</el-button>
      <div class="fr">最近一次同步时间：{{update}}</div>
    </el-row>
    </el-form>
    <el-table stripe
              border
              highlight-current-row
              max-height="800"
              :data="dataList"
              v-loading="dataListLoading"
              @selection-change="selectionChangeHandle">
      <el-table-column prop="compName"
                       :show-overflow-tooltip="true"
                       width="200"
                       label="销售公司"></el-table-column>
      <el-table-column prop="channelName"
                       :show-overflow-tooltip="true"
                       width="150"
                       label="店铺"></el-table-column>
      <el-table-column prop="condition"
                       :show-overflow-tooltip="true"
                       width="100"
                       label="状态"></el-table-column>
      <el-table-column prop="sellerSku"
                       width="200"
                       label="sellsku"></el-table-column>
      <el-table-column prop="asin"
                       width="150"
                       :show-overflow-tooltip="true"
                       label="ASIN"></el-table-column>
      <el-table-column prop="productName"
                       width="150"
                       :show-overflow-tooltip="true"
                       label="产品描述"></el-table-column>
      <el-table-column prop="fnSku"
                       width="150"
                       :show-overflow-tooltip="true"
                       label="FNSKU"></el-table-column>
      <el-table-column prop="price"
                       :show-overflow-tooltip="true"
                       label="价格"></el-table-column>
      <el-table-column prop="afnWarehouseQuantity"
                       :show-overflow-tooltip="true"
                       label="入库数量"></el-table-column>
      <el-table-column prop="afnFulfillableQuantity"
                       :show-overflow-tooltip="true"
                       label="可售数量"></el-table-column>
      <el-table-column prop="afnUnsellableQuantity"
                       :show-overflow-tooltip="true"
                       width="120"
                       label="不可售数量"></el-table-column>
      <el-table-column prop="afnReservedQuantity"
                       :show-overflow-tooltip="true"
                       label="预留数量"></el-table-column>
      <el-table-column prop="nameCh"
                       width="150"
                       :show-overflow-tooltip="true"
                       label="产品名称"></el-table-column>
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
import selectAll from '@/components/erp-select/select-all'
// 分页
import paginationAll from '@/components/erp-pagination/pagination-all'
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
      update: '',
      searchData: {},
      searchForm: {
        channelId: ''
      },
      status: 1,
      // 下拉
      searchOptions: [
        {
          label: 'sellsku',
          value: 'sellerSku',
          inputType: 'el-input'
        },
        {
          label: 'FNSKU',
          value: 'fnSku',
          inputType: 'el-input'
        },
        {
          label: '状态',
          value: 'condition',
          inputType: 'el-input'
        }
      ],
      dataForm: {},
      accountOptions: [], // 店铺账号
      dictInventoryStatusOptions: [], // 调入仓库状态
      dateValue: '', // 时间
      dataList: [],
      dataListLoading: false,
      dataListSelections: [],
      dataRule: {
        channelId: [{ required: true, message: '必填项', trigger: 'change' }]
      }
    }
  },

  created () {
    this.$http
      .get(this.$http.adornUrl('list/combobox/ownChannel'), {
        params: { platformType: '' }
      })
      .then(({ data }) => {
        this.accountOptions = data.list
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
            url: this.$http.adornUrl('fba/mwsinventory/list'),
            method: 'get',
            params: Object.assign({}, this.paginationData, dataObj)
          }).then(({ data }) => {
            if (data && data.code === 0) {
              this.dataList = data.page.dataList
              this.paginationData.totalCount = data.page.page.totalCount
              for (let i = 0; i < this.dataList.length; i++) {
                this.update = this.dataList[i].updTime
              }
            } else {
              this.paginationData.totalCount = 0
            }
            this.dataListLoading = false
          })
        }
      })
    },

    channelIdExchange () {
      this.getDataList(1)
    },
    // 多选
    selectionChangeHandle (val) {
      this.dataListSelections = val
    },
    resetHandle (formName) {
      this.$refs[formName].resetFields()
    },
    // 下载
    download () {
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
          window.open(this.$http.tokens('fba/mwsinventory/exportPage', dataObj))
        }
      })
    }
  }
}
</script>


