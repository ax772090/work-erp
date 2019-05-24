<template>
  <div>
    <el-form :inline="true"
             :model="dataForm"
             @keyup.enter.native="getDataList()">
      <el-row>
        <erp-search-panel v-model="searchData"
                          :searchOptions="searchOptions"
                          @search="getDataList(1)"></erp-search-panel>
      </el-row>
      <el-row>
        <el-button type="primary"
                   v-if="isAuth('warehouse:whconvertinventory:save')"
                   @click="addOrUpdateHandle()"><i class="iconfont erp-icon-xinzeng"></i>新增</el-button>
      </el-row>
    </el-form>
    <el-table stripe
              border
              highlight-current-row
              max-height="800"
              :data="dataList"
              v-loading="dataListLoading"
              @expand-change="rowExpand"
              @selection-change="selectionChangeHandle">
      <el-table-column type="expand"
                       header-align="center"
                       align="center"
                       label="展开">
        <template slot-scope="scope">
          <el-table :data="scope.row.whConvertInventoryDetailList">
            <el-table-column prop="imageUrl"
                             label="产品图片">
              <template slot-scope="scope">
                <tableImg :imageUrl='scope.row.imageUrl'></tableImg>
              </template>
            </el-table-column>
            <el-table-column prop="prodCode"
                             label="产品编码"
                             sortable></el-table-column>
            <el-table-column prop="prodName"
                             label="产品名称"></el-table-column>
            <el-table-column prop="specifications"
                             label="规格型号"></el-table-column>
            <el-table-column prop="statusBeforeName"
                             label="始发仓库存状态"></el-table-column>
            <el-table-column prop="statusAfterName"
                             label="目的仓库存状态"></el-table-column>
            <el-table-column prop="convQty"
                             label="转换数量"
                             sortable></el-table-column>
          </el-table>
        </template>
      </el-table-column>
      <el-table-column prop="code"
                       label="单号"
                       sortable>
        <template slot-scope="scope">
          <a @click="addOrUpdateHandle(scope.row.id, 'isDisabled')"
             class="a-click-hover">{{scope.row.code}}</a>
        </template>
      </el-table-column>
      <el-table-column prop="date"
                       label="日期"
                       width="130"
                       sortable></el-table-column>
      <el-table-column prop="warehouseName"
                       label="始发仓库"></el-table-column>
      <el-table-column prop="toWarehouseName"
                       label="目的仓库"></el-table-column>
      <el-table-column prop="warehouseUserName"
                       width="130"
                       label="仓管员"></el-table-column>
      <el-table-column prop="dictDocStatusName"
                       width="80"
                       label="单据状态"></el-table-column>
      <el-table-column prop="remark"
                       label="备注"></el-table-column>
      <el-table-column prop="updUserName"
                       width="130"
                       label="修改人"></el-table-column>
      <el-table-column prop="updTime"
                       label="修改时间"
                       sortable></el-table-column>
      <el-table-column prop="confirmUserName"
                       width="130"
                       label="确认人"></el-table-column>
      <el-table-column prop="confirmTime"
                       label="确认时间"
                       sortable></el-table-column>
      <el-table-column label="操作"
                       fixed="right"
                       width="80">
        <template slot-scope="scope">
          <el-dropdown :show-timeout="20">
            <span class="el-dropdown-link">操作
              <i class="el-icon-arrow-down el-icon--right"></i>
            </span>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item ommand="addOrUpdateHandle"
                                v-if="isAuth('warehouse:whconvertinventory:update')"
                                :disabled="!(scope.row.dictDocStatus === dictDocStatusOption[0].key || scope.row.dictDocStatus === dictDocStatusOption[3].key)"
                                @click.native="addOrUpdateHandle(scope.row.id)">编辑</el-dropdown-item>
              <el-dropdown-item command="switchingConfirm"
                                v-if="isAuth('warehouse:whconvertinventory:confirm')"
                                :disabled="!(scope.row.dictDocStatus === dictDocStatusOption[0].key || scope.row.dictDocStatus === dictDocStatusOption[3].key)"
                                @click.native="switchingConfirm(scope.row.id)">确认转换</el-dropdown-item>
              <el-dropdown-item command="switchingRevocation"
                                v-if="isAuth('warehouse:whconvertinventory:revoke')"
                                :disabled="!(scope.row.dictDocStatus === dictDocStatusOption[2].key)"
                                @click.native="switchingRevocation(scope.row.id)">撤销</el-dropdown-item>
              <el-dropdown-item command="switchingPrint"
                                v-if="isAuth('warehouse:whconvertinventory:print')"
                                @click.native="switchingPrint(scope.row.id)">打印</el-dropdown-item>
              <el-dropdown-item command="switchingDelete"
                                v-if="isAuth('warehouse:whconvertinventory:delete')"
                                :disabled="!(scope.row.dictDocStatus === dictDocStatusOption[0].key || scope.row.dictDocStatus === dictDocStatusOption[3].key)"
                                @click.native="switchingDelete(scope.row.id)">删除</el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页 -->
    <el-row>
      <pagination-all v-model="paginationData"
                      @paginationChangeHandle="getDataList"></pagination-all>
    </el-row>
    <!-- 弹窗,修改 -->
    <switchingOrdersEdit v-if="switchingOrdersEdit"
                         ref="switchingOrdersEdit"
                         @refreshDataList="getDataList"></switchingOrdersEdit>
    <!-- 打印 -->
    <print ref="print"
           @refreshDataList="getDataList"></print>
  </div>
</template>
<script>
// 搜索
import erpSearchPanel from '@/components/erp-search-panel'
// 分页
import paginationAll from '@/components/erp-pagination/pagination-all'
// 编辑
import switchingOrdersEdit from './switchingOrders-edit'
import { initData } from '@/mixins/initData.js'
import print from './switchingOrders-print'
// 引入图片
import tableImg from '@/components/list-table/table-img'

export default {
  mixins: [initData],
  components: {
    erpSearchPanel,
    paginationAll,
    switchingOrdersEdit,
    print,
    tableImg
  },
  data () {
    return {
      // 数据过滤器
      searchData: {},
      dictDocStatusOption: [{
        key: '01',
        value: '未审核'
      }, {
        key: '02',
        value: '审核中'
      }, {
        key: '03',
        value: '已审核'
      }, {
        key: '04',
        value: '已撤销'
      }],
      // 搜索下拉
      searchOptions: [
        {
          label: '仓管员',
          value: 'warehouseUserId',
          inputType: 'el-select-remote',

          httpUrl: '/list/search/user',
          queryKey: 'name',
          dataSource: 'list',
          title: 'warehouseUserId',
          dataValue: 'id',
          dataLabel: 'name',
          placeholder: '仓管员'
        },
        {
          label: '库存转换单号',
          value: 'code',
          inputType: 'el-input'
        },
        {
          label: '产品名称',
          value: 'prodName',
          inputType: 'el-input'
        },
        {
          label: '产品编码',
          value: 'prodCode',
          inputType: 'el-input'
        },
        {
          label: '日期',
          value: 'startDate,endDate',
          inputType: 'el-daterange'
        },
        {
          label: '始发仓库',
          value: 'warehouseId',
          inputType: 'el-select',

          httpUrl: 'list/combobox/warehouse',
          dataSource: 'list',
          title: 'warehouseIdList',
          dataValue: 'id',
          dataLabel: 'name',
          placeholder: '始发仓库'
        },
        {
          label: '目的仓库',
          value: 'toWarehouseId',
          inputType: 'el-select',

          httpUrl: 'list/combobox/warehouse',
          dataSource: 'list',
          title: 'toWarehouseIdList',
          dataValue: 'id',
          dataLabel: 'name',
          placeholder: '目的仓库'
        },
        {
          label: '单据状态',
          value: 'dictDocStatus',
          inputType: 'el-select',

          httpUrl: 'basicData/queryDataDict2List',
          requestParams: { dataDictKey: 'APPROVAL_STATUS' },
          dataSource: 'fontMaps',
          title: 'dictDocStatusList',
          dataValue: 'key',
          dataLabel: 'value',
          placeholder: '单据状态'
        }
      ],

      dataForm: {},
      dataList: [],
      dataListLoading: false,
      dataListSelections: [],
      switchingOrdersEdit: false
    }
  },

  created () {
    this.getDataList()
  },

  methods: {
    // 展开行
    rowExpand (row) {
      this.getDetailData(row)
    },
    // 获取展开行数据新
    getDetailData (row) {
      this.$http({
        url: this.$http.adornUrl(`warehouse/whconvertinventory/info/${row.id}`),
        method: 'get'
      }).then(({ data }) => {
        if (data && data.code === 0) {
          this.$set(
            row,
            'whConvertInventoryDetailList',
            data.whConvertInventoryEntity.whConvertInventoryDetailList
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
    // 获取收货订单数据列表
    getDataList (val) {
      if (val) {
        this.paginationData.currPage = val
      }
      this.dataListLoading = true
      this.$http({
        url: this.$http.adornUrl('warehouse/whconvertinventory/list'),
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
          //   this.$nextTick(() => {
          for (let i = 0; i < this.dataList.length; i++) {
            this.$set(this.dataList[i], 'whConvertInventoryDetailList', [])
          }
          //   })
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
    },

    // 编辑
    addOrUpdateHandle (id, type) {
      this.switchingOrdersEdit = true
      this.$nextTick(() => {
        this.$refs.switchingOrdersEdit.init(id, type)
      })
    },

    // 确认转换
    switchingConfirm: _.debounce(
      async function switchingConfirm (id) {
        this.$http({
          url: this.$http.adornUrl('warehouse/whconvertinventory/confirm'),
          method: 'post',
          data: id
        }).then(({ data }) => {
          if (data && data.code === 0) {
            this.getDataList()
            this.$notify.success({
              title: '成功',
              message: `确认转换成功:编码为${data.entity.code}`,
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
      },
      1000,
      {
        leading: true,
        trailing: false
      }
    ),

    // 撤销转换
    switchingRevocation (id) {
      this.$confirm('确认要撤销吗？', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$http({
          url: this.$http.adornUrl('warehouse/whconvertinventory/revoke'),
          method: 'post',
          data: id
        }).then(({ data }) => {
          if (data && data.code === 0) {
            this.getDataList()
            this.$notify.success({
              title: '成功',
              message: `撤销转换成功`,
              duration: 5000
            })
          } else {
            this.$notify.error({
              title: '错误',
              message: data.msg,
              duration: 5000
            })
          }
        })
      })
    },

    // 删除
    switchingDelete (id) {
      var ids = id
        ? [id]
        : this.dataListSelections.map(item => {
          return item.id
        })
      this.$confirm('确认要删除此行吗？', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$http({
          url: this.$http.adornUrl('warehouse/whconvertinventory/delete'),
          method: 'delete',
          data: ids
        }).then(({ data }) => {
          if (data && data.code === 0) {
            this.getDataList(1)
            this.$notify.success({
              title: '成功',
              message: `删除成功`,
              duration: 5000
            })
          } else {
            this.$notify.error({
              title: '错误',
              message: data.msg,
              duration: 5000
            })
          }
        })
      })
    },

    // 打印
    switchingPrint (id) {
      this.$http({
        url: this.$http.adornUrl(`warehouse/whconvertinventory/print/${id}`),
        method: 'get'
      }).then(({ data }) => {
        if (data && data.code === 0) {
          this.$refs.print.init(data)
        }
      })
    }
  }
}
</script>
