<!-- 内部成本及费用的导入(主表) -->
<template>
  <div class="mod-config">
    <el-form :model="searchForm"
             :rules="dataRule"
             ref="searchForm"
             label-width="80px"
             @keyup.enter.native="getDataList()">
      <el-row>
        <el-form-item label="月份选择"
                      prop="date"
                      :rules="dataRule.isRequired">
          <el-date-picker v-model="searchForm.date"
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
    <el-table stripe
              border
              highlight-current-row
              max-height="800"
              :data="dataList"
              @selection-change="selectionChangeHandle">
      <el-table-column prop="confirmUserName"
                       label="时间范围"></el-table-column>
      <el-table-column prop="confirmUserName"
                       label="市场"></el-table-column>
      <el-table-column prop="confirmUserName"
                       label="内部SKU"></el-table-column>
      <el-table-column prop="confirmUserName"
                       label="品名"></el-table-column>
      <el-table-column prop="confirmUserName"
                       label="汇率">
      </el-table-column>
      <el-table-column prop="confirmUserName"
                       label="采购单价"></el-table-column>
      <el-table-column prop="confirmUserName"
                       label="头程单价"></el-table-column>
      <el-table-column prop="confirmUserName"
                       label="广告费（人民币）"></el-table-column>
      <el-table-column prop="confirmUserName"
                       label="测评费（人民币）"></el-table-column>
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
// 表头处理
import { renderHeaderUtil } from '@/utils/index.js'
import { initData } from '@/mixins/initData.js'
export default {
  mixins: [initData],
  components: {
    erpSearchPanel,
    paginationAll
  },
  data () {
    return {
      searchData: {},
      accountOptions: [],    // 店铺账号
      // 下拉
      searchOptions: [
        {
          label: '产品编码',
          value: 'code',
          inputType: 'el-input'
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
        }
      ],
      dataForm: {
      },
      searchForm: {
        date: ''
      },
      dictInventoryStatusOptions: [], // 调入仓库状态
      dateValue: '', // 时间
      tableData: [],
      dataList: [],
      dataListLoading: false,
      dataListSelections: [],
      editorVisible: false,
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
      },
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
    // 多选
    selectionChangeHandle (val) {
      this.dataListSelections = val
    },
    // 重置
    resetHandle (formName) {
      this.$refs[formName].resetFields()
    }
  }
}
</script>
