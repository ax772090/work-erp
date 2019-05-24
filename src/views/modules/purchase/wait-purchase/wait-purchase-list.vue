 <!-- 待采购列表（从表） -->
<template>
  <div class="mod-config">
    <el-form :inline="true"
             :model="dataForm"
             @keyup.enter.native="getDataList()">
      <el-row>
        <erp-search-panel v-model="searchData"
                          :searchOptions="searchOptions"
                          @search="getDataList(1)"></erp-search-panel>
      </el-row>
      <el-row>
        <div class="grid-content">
          <el-button type="primary"
                     :disabled="isUnitOrder"
                     v-if="isAuth('pur:poplandetail:composePlan2Info')"
                     @click="generatePurseorder">生成采购订单</el-button>
          <el-button type="primary"
                     v-if="isAuth('pur:poplandetail:export')"
                     @click="Export()"><i class="iconfont erp-icon-daochu"></i>导出</el-button>
        </div>
      </el-row>
    </el-form>
    <el-table :data="dataList"
              stripe
              border
              highlight-current-row
              v-loading="dataListLoading"
              @selection-change="selectionChangeHandle"
              :default-sort="{prop:'code',order:'descending'}">
      <el-table-column type="selection"
                       align="center"
                       header-align="center"
                       width="50"></el-table-column>
      <el-table-column prop="planDate"
                       sortable
                       label="采购计划日期"></el-table-column>
      <el-table-column prop="expectDate"
                       sortable
                       label="要求到货日期">
      </el-table-column>
      <el-table-column prop="prodCode"
                       sortable
                       label="产品编码"></el-table-column>
      <el-table-column prop="prodName"
                       width="250"
                       label="产品名称"></el-table-column>
      <el-table-column prop="specifications"
                       label="规格型号"></el-table-column>
      <el-table-column prop="planQty"
                       sortable
                       label="计划数量"></el-table-column>
      <el-table-column prop="orderQty"
                       sortable
                       width="120"
                       label="已下单数量"></el-table-column>
      <el-table-column prop="supName"
                       sortable
                       v-if="isShowsupplierId"
                       width="270"
                       label="首选供应商"></el-table-column>
      <el-table-column prop="planCode"
                       sortable
                       label="采购计划单号"></el-table-column>
      <el-table-column prop="line"
                       sortable
                       label="计划明细行号"></el-table-column>
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
import { initData } from '@/mixins/initData.js'
export default {
  mixins: [initData],
  components: {
    erpSearchPanel,
    paginationAll
  },
  data () {
    return {
      // 数据过滤器
      searchData: {},
      // 下拉
      searchOptions: [
        {
          label: '采购计划日期',
          value: 'planStart,planEnd',
          inputType: 'el-daterange' // 这里要日期
        },
        {
          label: '要求到货日期',
          value: 'expectStart,expectEnd',
          inputType: 'el-daterange' // 这里要日期
        },
        {
          label: '采购计划单号',
          value: 'planCode',
          inputType: 'el-input'
        },
        {
          label: '产品编码',
          value: 'prodCode',
          inputType: 'el-input'
        },
        {
          label: '产品名称',
          value: 'prodName',
          inputType: 'el-input'
        },
        {
          label: '首选供应商',
          value: 'supplierId',
          inputType: 'el-select-remote',
          httpUrl: 'basic/basicsupplier/list-used?b_used=true',
          queryKey: 'name',
          dataSource: 'list',
          title: 'supplierIdList',
          dataValue: 'id',
          dataLabel: 'name',
          placeholder: '供应商'
        }
      ],

      dataForm: {},
      dataList: [],
      flag: true,
      dataListLoading: false,
      dataListSelections: [],
      addOrUpdateVisible: false,
      isUnitOrder: false, // 按钮控制
      isShowsupplierId: true   // 是否显示首选供应商

    }
  },

  created () {
    this.getDataList()
    this.selectionChangeHandle([])
    this.getsupplierIdallow()
  },
  methods: {
    // 首选供应商字段权限
    getsupplierIdallow () {
      this.$http({
        url: this.$http.adornUrl('pur/poplandetail/allow'),
        method: 'get',
        params: Object.assign(
          {},
          this.paginationData,
          this.searchData === undefined ? {} : this.searchData
        )
      }).then(({ data }) => {
        if (data && data.code === 0) {
          if (!data.allow) {
            this.searchOptions.forEach((element, index) => {
              if (element.value === 'supplierId') {
                this.searchOptions.splice(index, 1)
              }
            })
          }
        }
      })
    },
    // 获取数据列表
    getDataList (val) {
      if (val) {
        this.paginationData.currPage = val
      }
      this.dataListLoading = true
      this.$http({
        url: this.$http.adornUrl('pur/poplandetail/list'),
        method: 'get',
        params: Object.assign(
          {},
          this.paginationData,
          this.searchData === undefined ? {} : this.searchData
        )
      }).then(({ data }) => {
        if (data && data.code === 0) {
          this.dataList = data.pageList.dataList
          this.paginationData.totalCount = data.pageList.page.totalCount
          this.isShowsupplierId = data.pageList.extraData.extraData
        } else {
          this.dataList = []
          this.paginationData.totalCount = 0
        }
        this.dataListLoading = false
      })
    },

    // 多选
    selectionChangeHandle (val) {
      this.dataListSelections = val
      if (this.dataListSelections.length <= 0) {
        this.isUnitOrder = true
      } else {
        this.isUnitOrder = false
      }
    },
    // 生成采购订单
    generatePurseorder () {
      if (this.dataListSelections) {
        let ids = []
        for (const item of this.dataListSelections) {
          ids.push(item.id)
        }
        // 判断勾选的供应商是否相同
        this.flag = this.dataListSelections.every((item) => {
          return (item.supName !== null)
        })

        if (this.flag) {
          this.$confirm('是否生成采购订单?', '提示', {
            distinguishCancelAndClose: true,
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          })
            .then(() => {
              this.$http({
                url: this.$http.adornUrl('pur/poplandetail/composePlan2Info'),
                method: 'post',
                data: ids
              }).then(({ data }) => {
                if (data && data.code === 0) {
                  this.getDataList()
                  this.$notify({
                    title: '成功',
                    dangerouslyUseHTMLString: true,
                    message: `操作成功,生成的采购订单为:</br>${data.codeList.join('</br>')}`,
                    type: 'success',
                    duration: 5000
                  })
                } else {
                  this.$notify.error({
                    title: '错误',
                    message: data.msg,
                    duration: 5000
                  })
                  this.dataList = []
                  this.paginationData.totalCount = 0
                }
                this.dataListLoading = false
              })
            })
        } else {
          this.$confirm('没有首选供应商的将会生成同一张采购订单, 是否继续?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            this.$http({
              url: this.$http.adornUrl('pur/poplandetail/composePlan2Info'),
              method: 'post',
              data: ids
            }).then(({ data }) => {
              if (data && data.code === 0) {
                this.getDataList()
                this.$notify({
                  title: '成功',
                  dangerouslyUseHTMLString: true,
                  message: `操作成功,生成的采购订单为:</br>${data.codeList.join('</br>')}`,
                  type: 'success',
                  duration: 5000
                })
              } else {
                this.$notify.error({
                  title: '错误',
                  message: data.msg,
                  duration: 5000
                })
              }
              this.dataListLoading = false
            })
          })
        }
      }
    },
    // 导出
    Export () {
      let ids = []
      for (const item of this.dataListSelections) {
        ids.push(item.id)
      }
      let obj = Object.assign({}, this.searchData, { detailIds: ids })
      window.open(
        this.$http.tokens(
          'pur/poplandetail/export',
          obj
        )
      )
    }
  }
}
</script>
