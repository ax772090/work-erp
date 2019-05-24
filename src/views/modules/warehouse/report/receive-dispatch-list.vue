<template>
  <div>
    <el-form :model="dataForm"
             ref="dataForm"
             label-width="80px"
             :rules="dataRule"
             @keyup.enter.native="getDataList()">
      <el-row>
        <el-form-item label="库存公司"
                      prop="compId">
          <select-all v-model="dataForm.compId"
                      :listDataOption='compIdOptions'
                      dataValue='orgId'
                      dataLabel='name'
                      placeholder="选择库存公司"></select-all>
        </el-form-item>
        <el-form-item label="单据日期"
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
        <erp-search-panel :searchOptions="searchOptions"
                          @search="getDataList(1)"
                          v-model="searchData"
                          :isResetHandle="true"
                          @resetHandle="resetHandle('dataForm')" />
      </el-row>
      <el-row>
        <el-button type="primary"
                   @click="exportList()"
                   v-if="isAuth('pur:warehousetradingrec:export')"><i class="iconfont erp-icon-daochu"></i>导出</el-button>
      </el-row>
    </el-form>
    <!-- 表格 -->
    <el-table :data="dataForm.receiveDispatchList"
              stripe
              border
              highlight-current-row
              max-height="800"
              :row-class-name="tableRowClassName"
              element-loading-text="拼命加载中"
              v-loading="dataListLoading">
      <el-table-column label="序号"
                       header-align="center"
                       align="center"
                       prop="num"
                       width="50"></el-table-column>
      <el-table-column label="产品编码"
                       width="160"
                       prop="prodCode"></el-table-column>
      <el-table-column label="产品名称"
                       prop="prodName"></el-table-column>
      <el-table-column label="仓库"
                       width="150"
                       prop="warehouseName"></el-table-column>
      <el-table-column label="库存状态"
                       width="100"
                       prop="invertoryStatus"></el-table-column>
      <el-table-column label="单据类型"
                       width="100"
                       prop="tradingType"></el-table-column>
      <el-table-column label="单号"
                       width="150"
                       prop="tradingDocCode"></el-table-column>
      <el-table-column label="单据日期"
                       width="130"
                       prop="tradingTime"></el-table-column>
      <el-table-column label="操作时间"
                       width="180"
                       prop="handleTime"></el-table-column>
      <el-table-column label="收入"
                       width="100"
                       prop="instock"></el-table-column>
      <el-table-column label="发出"
                       width="100"
                       prop="outstock"></el-table-column>
      <el-table-column label="结余"
                       width="100"
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

// 分页
import paginationAll from '@/components/erp-pagination/pagination-all'
export default {
  components: {
    // OrderDetaile,
    erpSearchPanel,
    paginationAll,
    selectAll
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
        expectDate: null,
        receiveDispatchList: []
      },
      dataRule: {
        compId: [
          { required: true, message: '请选择库存公司', trigger: 'change' }
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
          label: '产品编码/名称',
          value: 'prodId',
          inputType: 'el-select-remote',
          httpUrl: 'prod/prodbasic/queryForComplete',
          queryKey: 'code',
          dataSource: 'list',
          dataValue: 'id',
          dataLabel: 'codeName'
        },
        // {
        //   label: '产品名称',
        //   value: 'prodName',
        //   inputType: 'el-input'
        // },
        {
          label: '单号',
          value: 'docCode',
          inputType: 'el-input'
        },
        {
          label: '单据类型',
          value: 'dictTradingType',
          inputType: 'el-select',

          httpUrl: 'basicData/queryDataDict2List',
          requestParams: { dataDictKey: 'WAREHOUSE_TRADING_TYPE' },
          dataSource: 'fontMaps',
          title: 'dictTradingType',
          dataValue: 'key',
          dataLabel: 'value',
          placeholder: '单据类型'
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
    tableRowClassName ({ row }) {
      if (row.num === '小计') {
        return 'sum-row'
      }
      return ''
    },
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
              // 对发出参数进行取正数操作
              data.pageList.dataList.forEach(element => {
                this.$set(element, 'outstock', (element.outstock != '') ? Math.abs(Number(element.outstock)) : '')
                this.$set(element, 'instock', (element.instock != '') ? Math.abs(Number(element.instock)) : '')
              })
              this.dataForm.receiveDispatchList = data.pageList.dataList
              this.paginationData.totalCount = data.pageList.page.totalCount
            } else {
              this.dataForm.receiveDispatchList = []
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
        } else {
          return false
        }
      })
    },
    resetHandle (formName) {
      this.$refs[formName].resetFields()
      this.dataForm.expectDate = ''
    },
    // 导出
    exportList () {
      if (this.dataForm.compId && this.dataForm.expectDate) {
        window.open(
          this.$http.tokens('pur/warehousetradingrec/export', this.searchData)
        )
      } else {
        this.$notify.error({
          title: '错误',
          message: '暂无可导数据',
          duration: 5000
        })
      }
    }
  }
}
</script>


