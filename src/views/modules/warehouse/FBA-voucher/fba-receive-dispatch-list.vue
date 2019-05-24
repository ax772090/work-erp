<template>
  <div>
    <el-form :inline="true"
             :model="dataForm"
             ref="dataForm"
             :rules="dataRule"
             class="demo-form-inline">
      <el-row>
        <el-form-item label="库存公司"
                      prop="compId">
          <select-all v-model="dataForm.compId"
                      :listDataOption="compIdOptions"
                      data-value="orgId"
                      data-label="name"></select-all>
        </el-form-item>
      </el-row>
      <el-row>
        <el-form-item label="日期"
                      prop="expectDate">
          <el-date-picker v-model="dataForm.expectDate"
                          type="daterange"
                          size="small"
                          placeholder="选择日期"
                          range-separator="至"
                          start-placeholder="开始日期"
                          end-placeholder="结束日期"
                          value-format="yyyy-MM-dd"></el-date-picker>
        </el-form-item>
      </el-row>
      <el-row>
        <el-form-item>
          <erp-search-panel :searchOptions="searchOptions"
                            @search="getDataList(1)"
                            v-model="searchData" />
        </el-form-item>
        <el-button type="primary"
                   class="fr"
                   @click="exportList()"
                   v-if="isAuth('pur:warehousetradingrec:export')">导出</el-button>
      </el-row>
    </el-form>
    <!-- 表格 -->
    <el-table :data="dataForm.receiveDispatchList"
              stripe
              v-loading="dataListLoading">
      <el-table-column type="index"
                       label="序号"
                       width="50"
                       align="center"></el-table-column>
      <el-table-column label="产品图片"
                       prop="imageUrl"
                       width="120">
        <template slot-scope="scope">

          <tableImg :imageUrl='scope.row.imageUrl'></tableImg>

        </template>
      </el-table-column>
      <el-table-column label="产品编码"
                       prop="prodCode"></el-table-column>
      <el-table-column label="产品名称"
                       prop="prodName"></el-table-column>
      <el-table-column label="仓库"
                       prop="warehouseName"></el-table-column>
      <el-table-column label="库存状态"
                       prop="invertoryStatus"></el-table-column>
      <el-table-column label="单据类型"
                       prop="tradingType"></el-table-column>
      <el-table-column label="单号"
                       prop="tradingDocCode"></el-table-column>
      <el-table-column label="日期"
                       prop="tradingTime"></el-table-column>
      <el-table-column label="收入"
                       prop="instock"></el-table-column>
      <el-table-column label="发出"
                       prop="outstock"></el-table-column>
      <el-table-column label="结余"
                       prop="surplus"></el-table-column>
    </el-table>

    <el-row>
      <pagination-all @paginationChangeHandle="getDataList"
                      v-model="paginationData"></pagination-all>
    </el-row>
  </div>
</template>
<script>
// 搜索
import erpSearchPanel from '@/components/erp-search-panel'
import selectAll from '@/components/erp-select/select-all'

// 引入图片
import tableImg from '@/components/list-table/table-img'
// 分页
import paginationAll from '@/components/erp-pagination/pagination-all'
export default {
  components: {
    erpSearchPanel,
    selectAll,
    paginationAll,
    tableImg
  },
  data () {
    return {
      dateObj: {},
      compIdOptions: [],
      orderDetaileVisible: false,
      isShow: true,
      dataListLoading: false,
      dataForm: {
        compId: '',
        expectDate: '',
        receiveDispatchList: []
      },
      dataRule: {
        compId: [
          { required: true, message: '请选择要货店铺', trigger: 'change' }
        ],
        expectDate: [
          {
            required: true,
            message: '请选择日期',
            trigger: 'change'
          }
        ]
      },
      // 数据过滤器
      searchData: {},

      // 下拉
      searchOptions: [
        {
          label: '产品编码',
          value: 'prodCode',
          inputType: 'el-select-remote',
          httpUrl: 'prod/prodbasic/queryForComplete',
          queryKey: 'code',
          dataSource: 'list',
          dataValue: 'code',
          dataLabel: 'code',
          placeholder: '开发人员'
        },
        {
          label: '产品名称',
          value: 'prodName',
          inputType: 'el-input'
        },
        {
          label: '仓库',
          value: 'warehouseId',
          inputType: 'el-select',
          httpUrl: 'list/combobox/warehouse',
          dataSource: 'list',
          title: 'warehouseIdList',
          dataValue: 'id',
          dataLabel: 'name',
          placeholder: '仓库'
        },
        {
          label: '库存状态',
          value: 'inventoryStatus',
          inputType: 'el-select',
          httpUrl: 'basicData/queryDataDict2List',
          requestParams: { dataDictKey: 'WAREHOUSE_INVENTORY_STATUS' },
          dataSource: 'fontMaps',
          dataValue: 'key',
          dataLabel: 'value',
          placeholder: '库存状态'
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
    getDataUrl () {
      // 库存公司
      this.$http
        .get(this.$http.adornUrl('sys/organization/select'))
        .then(({ data }) => {
          this.compIdOptions = data.companyList
          this.dataForm.compId = sessionStorage.getItem('orgId')
        })
    },
    // 新增 / 修改 /查看
    addOrUpdateHandle (id) {
      this.orderDetaileVisible = true
      this.$nextTick(() => {
        this.$refs.orderDetaile.init(id)
      })
    },
    // 获取数据列表
    getDataList (val) {
      //   有必填字段，先校验
      this.$refs['dataForm'].validate(valid => {
        if (valid) {
          this.searchData = Object.assign({}, this.searchData, {
            compId: this.dataForm.compId,
            startDate: this.dataForm.expectDate[0],
            endDate: this.dataForm.expectDate[1]
          })
          if (val != undefined) {
            this.paginationData.currPage = val
          }
          this.dataListLoading = true
          this.$http({
            url: this.$http.adornUrl(`pur/warehousetradingrec/fbalist`),
            method: 'get',
            params: Object.assign(
              {},
              this.paginationData,
              this.searchData == undefined ? {} : this.searchData
            )
          }).then(({ data }) => {
            if (data && data.code === 0) {
              this.dataForm.receiveDispatchList = data.pageList.dataList
              this.paginationData.totalCount = data.pageList.page.totalCount
            } else {
              this.dataForm.receiveDispatchList = []
              this.paginationData.totalCount = 0
            }
            this.dataListLoading = false
          })
        } else {
          return false
        }
      })
    },
    // 导出
    exportList () {
      window.open(
        this.$http.tokens('pur/warehousetradingrec/export', this.searchData)
      )
    }
  }
}
</script>


