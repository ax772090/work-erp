<!-- 测评费用 -->
<template>
  <div>
    <el-form :inline="true"
             :model="dataForm"
             @keyup.enter.native="getDataList()">
      <el-row>
        <erp-search-panel v-model="searchData"
                          :searchOptions="searchOptions"
                          @search="getDataList(1)" />
      </el-row>
      <el-row>
        <el-button v-if="isAuth('fin:platformfee:save')"
                   type="primary"
                   @click="addOrUpdateHandle('', 'canAdd')"><i class="iconfont erp-icon-xinzeng"></i>新增
        </el-button>
        <el-button type="primary"
                   @click="excelImport()"
                   v-if="isAuth('fin:platformfee:import')"><i class="iconfont erp-icon-daoru"></i>导入</el-button>
        <el-button type="primary"
                   @click="excelExport()"
                   v-if="isAuth('fin:platformfee:export')"><i class="iconfont erp-icon-daochu"></i>导出</el-button>
      </el-row>
    </el-form>
    <el-table stripe
              border
              highlight-current-row
              max-height="800"
              :data="dataList"
              v-loading="dataListLoading">
      <el-table-column prop="type"
                       label="费用类型"></el-table-column>
      <el-table-column prop="yearMonth"
                       label="年/月"></el-table-column>
      <el-table-column prop="channelName"
                       label="店铺"
                       v-if="feeType ==='assess' || feeType ==='othersell'"></el-table-column>
      <el-table-column prop="countryName"
                       label="国家"
                       v-if="feeType ==='overseas' || feeType ==='vat'"></el-table-column>
      <el-table-column prop="prodCode"
                       label="自定义SKU"
                       v-if="feeType ==='overseas'"></el-table-column>
      <el-table-column prop="sellersku"
                       label="SellerSKU"
                       v-if="feeType !=='vat'"></el-table-column>
      <el-table-column prop="amount"
                       label="总金额"
                       v-if="feeType !=='vat'"></el-table-column>
      <el-table-column prop="addUserName"
                       label="创建人"></el-table-column>
      <el-table-column prop="addTime"
                       label="创建时间"></el-table-column>
      <el-table-column prop="updUserName"
                       label="修改人"></el-table-column>
      <el-table-column prop="updTime"
                       label="修改时间"></el-table-column>
      <el-table-column fixed="right"
                       label="操作"
                       width="80">
        <template slot-scope="scope">
          <el-dropdown :show-timeout="20">
            <span class="el-dropdown-link">操作
              <i class="el-icon-arrow-down el-icon--right"></i>
            </span>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item command="addOrUpdateHandle"
                                @click.native="addOrUpdateHandle(scope.row.id,'canEdit')"
                                v-if="isAuth('fin:platformfee:update')">编辑</el-dropdown-item>

              <el-dropdown-item command="deleteHandle"
                                @click.native="deleteHandle(scope.row.id)"
                                v-if="isAuth('fin:platformfee:delete')">删除</el-dropdown-item>

            </el-dropdown-menu>
          </el-dropdown>
        </template>
      </el-table-column>
    </el-table>
    <el-row>
      <pagination-all v-model="paginationData"
                      @paginationChangeHandle="getDataList"></pagination-all>
    </el-row>
    <!-- 弹窗, 新增  -->
    <add-or-update ref="addOrUpdate"
                   @refreshDataList="getDataList"></add-or-update>
    <xlsImport ref="xlsImport"
               title="导入"
               @refreshDataList="getDataList"></xlsImport>
    <xls-export ref="xlsExport"
                title="数据导出"
                @refreshDataList="getDataList"></xls-export>
  </div>
</template>

<script>
import erpSearchPanel from '@/components/erp-search-panel'
import paginationAll from '@/components/erp-pagination/pagination-all'
import AddOrUpdate from './outside-evaluate-add'
// 导入
import xlsImport from '@/components/xls-import/index'
// 导出
import xlsExport from '@/components/xls-export/index'
export default {
  components: {
    erpSearchPanel,
    paginationAll,
    AddOrUpdate,
    xlsImport,
    xlsExport
  },
  props: ['value'],
  data () {
    return {
      feeType: '',
      dataForm: {},
      dataList: [],
      dataListLoading: false,
      // 数据过滤器
      searchData: {},
      searchOptions: [
        {
          label: '月份',
          value: 'startDate,endDate',
          inputType: 'el-monthrange'
        },
        {
          label: '店铺',
          value: 'channelId',
          inputType: 'el-select',
          httpUrl: 'list/combobox/ownChannel',
          dataSource: 'list',
          dataValue: 'id',
          dataLabel: 'name',
          placeholder: '店铺'
        },
        {
          label: 'SellerSKU',
          value: 'sellersku',
          inputType: 'el-input'
        },
        {
          label: '总金额',
          value: 'amount',
          inputType: 'el-input'
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
  },
  methods: {
    init (tabName) {
      this.feeType = tabName || ''
      this.getDataList(1)
    },
    // 获取数据列表
    getDataList (val) {
      if (val != undefined) {
        this.paginationData.currPage = val
      }
      this.dataListLoading = true
      this.$set(this.searchData, 'feeType', this.feeType)
      this.$http({
        url: this.$http.adornUrl('fin/platformfee/list'),
        method: 'post',
        params: Object.assign({},
          this.paginationData,
          this.searchData == undefined ? {} : this.searchData
        )
      }).then(({
        data
      }) => {
        if (data && data.code === 0) {
          this.dataList = data.pageList.dataList
          this.paginationData.totalCount = data.pageList.page.totalCount
        } else {
          this.dataList = []
          this.paginationData.totalCount = 0
          this.$notify.error({
            title: '错误',
            message: data.msg,
            duration: 5000
          })
        }
        this.dataListLoading = false
      })
    },
    // 新增、编辑
    addOrUpdateHandle (id, type) {
      this.$nextTick(() => {
        this.$refs.addOrUpdate.init(id, type)
      })
    },
    // 删除
    deleteHandle (id) {
      var ids = id
        ? [id]
        : this.dataListSelections.map(item => {
          return item.id
        })
      this.$confirm(`确定要删除所选择的数据信息吗？`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$http({
          url: this.$http.adornUrl(`fin/platformfee/delete/${this.feeType}`),
          method: 'delete',
          data: this.$http.adornData(ids, false)
        }).then(({ data }) => {
          if (data && data.code === 0) {
            this.getDataList(1)
            this.$notify.success({
              title: '成功',
              message: '操作成功',
              duration: 5000
            })
          } else {
            this.$notify.error({
              title: '删除失败',
              message: data.msg,
              duration: 5000
            })
          }
        })
      })
    },
    // 导入
    excelImport () {
      this.$nextTick(() => {
        this.$refs.xlsImport.init({
          templateUrl: 'basicData/exportModel?fileName=platformAssessFee.xlsx',
          importUrl: 'fin/platformfee/import',
          isDisabled: true,
          feeType: this.feeType,
          uploadFailUrl: 'fin/platformfee/downloadFailed'
        })
      })
    },
    // 导出
    // excelExport () {
    //   console.log(this.searchData)
    //   window.open(
    //     this.$http.tokens(
    //       'fin/platformfee/export',
    //       this.searchData
    //     )
    //   )
    // }

    // 导出
    excelExport () {
      this.$nextTick(() => {
        this.$refs.xlsExport.init({
          exportUrl: 'fin/platformfee/export',
          searchData: this.searchData
        })
      })
    }
  },
  watch: {
    value: {
      handler (val, oldVal) {
        this.dataForm = this.value
        this.$emit('change', this.dataForm)
      },
      deep: true
    },
    dataForm: {
      handler (val, oldVal) {
        this.$emit('input', this.dataForm)
      },
      deep: true
    }
  }
}
</script>
