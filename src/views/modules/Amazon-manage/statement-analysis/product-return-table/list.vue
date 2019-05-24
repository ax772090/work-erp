<!-- 产品退货分析表（主表） -->
<template>
  <div class="mod-config">
    <el-form :model="searchForm"
             :rules="dataRule"
             ref="searchForm"
             label-width="80px"
             @keyup.enter.native="getDataList()">
      <el-row>
        <el-form-item label="月份选择"
                      prop="month"
                      :rules="dataRule.isRequired">
          <el-date-picker v-model="searchForm.month"
                          type="month"
                          placeholder="选择月">
          </el-date-picker>
        </el-form-item>
      </el-row>
      <el-row>
        <erp-search-panel v-model="searchData"
                          :searchOptions="searchOptions"
                          @search="getDataList(1)"
                          :isResetHandle='true'
                          @resetHandle="resetHandle('searchForm')"></erp-search-panel>
      </el-row>
    </el-form>
    <el-tabs type="border-card">
      <el-tab-pane label="按自定义SKU统计">
        <selfdefine-sku></selfdefine-sku>
      </el-tab-pane>
      <el-tab-pane label="按店铺SKU统计">
        <shop-sku></shop-sku>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>
<script>
// 搜索
import erpSearchPanel from '@/components/erp-search-panel'
// 自定义的sku
import selfdefineSku from './selfdefine-sku'
// 店铺的sku
import shopSku from './shop-sku'
// 表头处理
import { renderHeaderUtil } from '@/utils/index.js'
import { initData } from '@/mixins/initData.js'
export default {
  mixins: [initData],
  components: {
    erpSearchPanel,
    selfdefineSku,
    shopSku
  },
  data () {
    return {
      searchData: {},
      accountOptions: [],    // 店铺账号
      // 下拉
      searchOptions: [
        {
          label: '店铺',
          value: 'channel',
          inputType: 'el-select',
          httpUrl: 'list/combobox/ownChannel',
          dataSource: 'list',
          dataValue: 'id',
          dataLabel: 'name',
          placeholder: '店铺'
        },
        {
          label: '国家',
          value: 'country',
          inputType: 'el-select',
          httpUrl: 'basicData/queryAllCountry',
          dataSource: 'countries',
          dataValue: 'id',
          dataLabel: 'nameCn',
          placeholder: '国家'
        },
        {
          label: '自定义SKU',
          value: 'sku',
          inputType: 'el-input'
        },
        {
          label: '卖家SKU',
          value: 'sellerSku',
          inputType: 'el-input'
        },
        {
          label: '负责人',
          value: 'inChargeOf',
          inputType: 'el-input'
        }
      ],
      dataForm: {
      },
      searchForm: {
        channelId: ''
      },
      dictInventoryStatusOptions: [], // 调入仓库状态
      dataList: [],
      dataListLoading: false,
      dataListSelections: [],
      editorVisible: false,
      dataRule: {
        isRequired: [{ required: true, message: '必填项', trigger: 'change' }]
      }
    }
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
            url: this.$http.adornUrl('warehouse/whtransfercomp/list'),
            method: 'get',
            params: Object.assign({}, this.paginationData, dataObj)
          }).then(({ data }) => {
            if (data && data.code === 0) {
              this.getDataUrl()
            } else {
              this.paginationData.totalCount = 0
            }
            this.dataListLoading = false
          })
        }
      })
    },
    getDataUrl () {
      // 仓库库存状态
      this.$http
        .get(this.$http.adornUrl('basicData/queryDataDict2List'), {
          params: { dataDictKey: 'WAREHOUSE_INVENTORY_STATUS' }
        })
        .then(({ data }) => {
          this.dictInventoryStatusOptions = data.fontMaps
          this.dictToInventoryStatusOption = data.fontMaps
        })
    },
    // 重置
    resetHandle (formName) {
      this.$refs[formName].resetFields()
    }
  }
}
</script>
