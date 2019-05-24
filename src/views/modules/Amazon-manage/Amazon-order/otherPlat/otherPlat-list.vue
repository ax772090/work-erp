<template>
  <div>
    <el-form :inline="true"
             :model="dataForm"
             :rules="dataRule"
             @keyup.enter.native="getDataList()">
      <el-row>
        <erp-search-panel :searchOptions="searchOptions"
                          @search="getDataList(1)"
                          v-model="searchData" />
      </el-row>
      <el-row>
        <el-button type="primary"
                   v-if="isAuth('dataService:mwsotherplatformorder:import')"
                   @click="excelImport()">
          <i class="iconfont erp-icon-daoru"></i>导入</el-button>
        <el-button type="primary"
                   @click="otherPlatExport()"
                   v-if="isAuth('dataService:mwsotherplatformorder:export')"><i class="iconfont erp-icon-daochu"></i>导出</el-button>
      </el-row>
    </el-form>
    <!-- 表格 -->
    <el-table :data="dataForm.otherPlatList"
              stripe
              border
              highlight-current-row
              :span-method="objectSpanMethod"
              v-loading="dataListLoading">
      <el-table-column fixed
                       label="销售平台"
                       prop="salePlatform"
                       min-width="60"></el-table-column>
      <el-table-column align="left"
                       label="订单"
                       prop="channelName"
                       min-width="70">
        <template slot-scope="scope">
          <div class="table-column-flex">
            <div>
              <label>订单编号：</label>
              <a @click="addOrUpdateHandle(scope.row.orderNum,'check')"
                 class="a-click-hover">{{scope.row.orderNum}}</a>
            </div>
            <div>
              <label>国家/地区：</label>
              <span>{{scope.row.countryName}}</span>
            </div>
            <div>
              <label>订单日期：</label>
              <span>{{scope.row.orderDate}}</span>
            </div>
          </div>
        </template>
      </el-table-column>
      <el-table-column label="订单详情"
                       prop="channelName"
                       min-width="120">
        <template slot-scope="scope">
          <div class="table-row-flex">
            <div>
              <strong>SKU：</strong>
              <span>{{scope.row.sku}}</span>
            </div>
            <div>
              <strong>item：</strong>
              <span>{{scope.row.item}}</span>
            </div>
            <div>
              <strong>数量：</strong>
              <span>{{scope.row.quantity}}</span>
            </div>
          </div>
        </template>
      </el-table-column>
      <el-table-column align="left"
                       label="配送"
                       prop="channelName">
        <template slot-scope="scope">
          <div class="table-column-flex">
            <div>
              <label>发货方式：</label>
              <span>{{scope.row.shipmentServiceLevelCategory}}</span>
            </div>
            <div>
              <label>物流跟踪号：</label>
              <span>{{scope.row.trackNumber}}</span>
            </div>
            <div>
              <label>发货日期：</label>
              <span>{{scope.row.fulfillmentDate}}</span>
            </div>
          </div>
        </template>
      </el-table-column>
      <el-table-column label="状态"
                       prop="status"
                       width="80"></el-table-column>
      <el-table-column label="已发货"
                       prop="bShipped"
                       width="80">
        <template slot-scope="scope">
          <el-tag v-if="scope.row.bShipped == false"
                  size="small"
                  type="danger">否</el-tag>
          <el-tag v-else-if="scope.row.bShipped == true"
                  size="small">是</el-tag>
        </template>
      </el-table-column>
      <el-table-column fixed="right"
                       label="操作"
                       width="110">
        <template slot-scope="scope">
          <el-dropdown :show-timeout="20">
            <span class="el-dropdown-link">
              操作
              <i class="el-icon-arrow-down el-icon--right"></i>
            </span>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item command="addOrUpdateHandle"
                                @click.native="addOrUpdateHandle(scope.row.id)"
                                v-if="isAuth('mws:listorder:whshipment')"
                                :disabled="!(scope.row.orderStatus === 'Pending')">编辑</el-dropdown-item>
              <el-dropdown-item command="addOrUpdateHandle"
                                :disabled="true">转FBA出库</el-dropdown-item>
              <el-dropdown-item command="overseasHandle"
                                @click.native="overseasHandle(scope.row.id)"
                                v-if="isAuth('mws:listorder:whshipment')"
                                :disabled="!(scope.row.orderStatus === 'Pending')">海外仓出库</el-dropdown-item>
              <el-dropdown-item command="deleteHandle"
                                @click.native="deleteHandle(scope.row.orderNum)"
                                v-if="isAuth('dataService:mwsotherplatformorder:delete')">删除</el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </template>
      </el-table-column>
    </el-table>

    <el-row>
      <pagination-all @paginationChangeHandle="getDataList"
                      v-model="paginationData"></pagination-all>
    </el-row>
    <!-- 弹窗, 查看 / 修改 -->
    <other-plat-add-update v-if="otherPlatVisible"
                           ref="otherPlatAddUpdate"
                           @refreshDataList="getDataList"></other-plat-add-update>
    <!-- 海外仓出库 -->
    <!-- 弹窗, 销售出库新增、编辑 -->
    <salesRelease-search ref="salesReleaseSearch"
                         @refreshDataList="getDataList"></salesRelease-search>
    <!-- 导入模板 -->
    <xlsImport ref="xlsImport"
               title="导入"
               @refreshDataList="getDataList"></xlsImport>
    <xls-export ref="xlsExport"
                title="数据导出"
                @refreshDataList="getDataList"></xls-export>
  </div>
</template>
<script>
// 详情页面
import otherPlatAddUpdate from './otherPlat-add-update'
// 搜索
import erpSearchPanel from '@/components/erp-search-panel'
// 分页
import paginationAll from '@/components/erp-pagination/pagination-all'
// 销售出库（海外仓出库）
import salesReleaseSearch from '@/views/modules/warehouse/FBA-voucher/sales-release/salesRelease-search'
// 导入
import xlsImport from '@/components/xls-import/index'
// 导出弹窗
import xlsExport from '@/components/xls-export/index'
export default {
  components: {
    otherPlatAddUpdate,
    erpSearchPanel,
    paginationAll,
    salesReleaseSearch,
    xlsImport,
    xlsExport
  },
  data () {
    return {
      otherPlatVisible: false,
      dataListLoading: false,
      dataForm: {
        otherPlatList: []
      },
      dataRule: {},
      // 数据过滤器
      searchData: {},

      // 下拉
      searchOptions: [
        {
          label: '销售平台',
          value: 'dictPlantformType',
          inputType: 'el-select',
          httpUrl: 'basicData/queryDataDict2List',
          requestParams: {
            dataDictKey: 'PLANTFORM_TYPE'
          },
          dataSource: 'fontMaps',
          dataValue: 'key',
          dataLabel: 'value',
          placeholder: '销售平台'
        },
        {
          label: '订单日期',
          value: 'startDate,endDate',
          inputType: 'el-daterange'
        },
        {
          label: '订单编号',
          value: 'orderNum',
          inputType: 'el-input'
        },
        {
          label: '状态',
          value: 'status',
          inputType: 'el-select',

          httpUrl: '/basicData/queryDataDict2List',
          requestParams: {
            dataDictKey: 'FBA_ORDER_STATUS'
          },
          dataSource: 'fontMaps',
          title: 'status',
          dataValue: 'key',
          dataLabel: 'value',
          placeholder: '订单状态'
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
    this.getDataList()
  },
  methods: {
    // 新增 / 修改 /查看
    addOrUpdateHandle (id, type) {
      this.otherPlatVisible = true
      this.$nextTick(() => {
        this.$refs.otherPlatAddUpdate.init(id, type)
      })
    },
    // 获取数据列表
    getDataList (val) {
      if (val !== undefined) {
        this.paginationData.currPage = val
      }
      this.dataListLoading = true
      this.$http({
        url: this.$http.adornUrl(`dataService/mwsotherplatformorder/list`),
        method: 'get',
        params: Object.assign(
          {},
          this.paginationData,
          this.searchData === undefined ? {} : this.searchData
        )
      }).then(({ data }) => {
        if (data && data.code === 0) {
          this.dataForm.otherPlatList = data.pageList.dataList
          this.paginationData.totalCount = data.pageList.page.totalCount
          // 对后台返回的数据进行合并处理
          this.getSpanArr(this.dataForm.otherPlatList)
        } else {
          this.dataList = []
          this.paginationData.totalCount = 0
          this.$notify.error({
            title: '错误',
            showClose: true,
            message: data.msg
          })
        }
        this.dataListLoading = false
      })
    },
    getSpanArr (data) {
      this.spanArr = []
      for (var i = 0; i < data.length; i++) {
        if (i === 0) {
          this.spanArr.push(1)
          this.pos = 0
        } else {
          // 判断当前元素与上一个元素是否相同
          if (data[i].orderNum === data[i - 1].orderNum) {
            this.spanArr[this.pos] += 1
            this.spanArr.push(0)
          } else {
            this.spanArr.push(1)
            this.pos = i
          }
        }
      }
    },

    // 海外仓出库
    overseasHandle: _.debounce(
      async function overseasHandle (id) {
        this.$http({
          url: this.$http.adornUrl(`mws/listorder/whshipment/${id}`),
          method: 'get'
        }).then(({ data }) => {
          if (data && data.code === 0) {
            let selfShipmentList = data
            this.$refs.salesReleaseSearch.init(
              id,
              selfShipmentList,
              'amazonOrder'
            )
          } else {
            this.$notify.error({
              title: '错误',
              message: data.msg,
              duration: 5000
            })
          }
        })
      },
      1000,
      {
        leading: true,
        trailing: false
      }
    ),

    // 合并单元格
    objectSpanMethod ({ row, column, rowIndex, columnIndex }) {
      // 这里的2代表要合并列的索引，这里是第三列（如果列变了，这里也要变）
      if (columnIndex !== 2) {
        // 这里添加处理逻辑Todo
        const _row = this.spanArr[rowIndex]
        const _col = _row > 0 ? 1 : 0
        return {
          rowspan: _row,
          colspan: _col
        }
      }
    },
    // 导入
    excelImport () {
      this.$nextTick(() => {
        this.$refs.xlsImport.init({
          templateUrl: 'basicData/exportModel?fileName=otherPlatformOrder.xlsx',
          importUrl: 'dataService/mwsotherplatformorder/import',
          uploadFailUrl: 'dataService/mwsotherplatformorder/downloadFailed'

        })
      })
    },
    // 导出
    otherPlatExport () {
      this.$nextTick(() => {
        this.$refs.xlsExport.init({
          exportUrl: 'dataService/mwsotherplatformorder/export',
          searchData: this.searchData
        })
      })
    },

    // 删除
    deleteHandle (orderNum) {
      var orderNums = [orderNum]
      this.$confirm(`确定要删除所选择的数据信息吗？`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$http({
          url: this.$http.adornUrl('dataService/mwsotherplatformorder/delete'),
          method: 'delete',
          data: this.$http.adornData(orderNums, false)
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
    }
  }
}
</script>

