 <!-- 其他出库 -->
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
    </el-form>
    <el-row>
      <el-button type="primary"
                 v-if="isAuth('warehouse:whoutstock:save')"
                 @click="addOrUpdateHandle('','canAdd')"><i class="iconfont erp-icon-xinzeng"></i>新增</el-button>
      <el-button type="danger"
                 v-if="isAuth('warehouse:whoutstock:delete')"
                 :disabled="isBeputDelete"
                 @click="beputDelete()"><i class="iconfont erp-icon-shanchu"></i>删除</el-button>
    </el-row>
    <el-table :data="dataList"
              stripe
              border
              highlight-current-row
              max-height="800"
              v-loading="dataListLoading"
              @expand-change="rowExpand"
              @selection-change="selectionChangeHandle">
      <el-table-column type="selection"
                       header-align="center"
                       align="center"
                       width="50"></el-table-column>
      <el-table-column type="expand"
                       header-align="center"
                       align="center"
                       label="展开"
                       width="50">
        <template slot-scope="scope">
          <el-table :data="scope.row.whOutstockDetail">
            <el-table-column prop="imageUrl"
                             label="产品图片">
              <template slot-scope="scope">
                <tableImg :imageUrl='scope.row.imageUrl'></tableImg>
              </template>
            </el-table-column>
            <el-table-column prop="prodCode"
                             sortable
                             label="产品编码"></el-table-column>
            <el-table-column prop="prodName"
                             label="产品名称"></el-table-column>
            <el-table-column prop="specifications"
                             label="规格型号"></el-table-column>
            <el-table-column prop="warehouseName"
                             label="仓库"></el-table-column>
            <el-table-column prop="outQty"
                             sortable
                             label="出库数量"></el-table-column>
            <el-table-column prop="dictInventoryStatusName"
                             label="库存状态"></el-table-column>
            <el-table-column prop="remark"
                             label="备注"></el-table-column>
          </el-table>
        </template>
      </el-table-column>
      <el-table-column prop="code"
                       sortable
                       label="出库单号">
        <template slot-scope="scope">
          <a @click="addOrUpdateHandle(scope.row.id, 'canCheck')"
             class="a-click-hover">{{scope.row.code}}</a>
        </template>
      </el-table-column>
      <el-table-column prop="outstockDate"
                       sortable
                       label="出库日期"></el-table-column>
      <el-table-column prop="deptName"
                       label="部门"></el-table-column>
      <el-table-column prop="warehouseUserName"
                       label="仓管员"></el-table-column>
      <el-table-column prop="warehouseName"
                       label="仓库"></el-table-column>
      <el-table-column prop="dictDocStatusName"
                       label="单据状态"></el-table-column>
      <el-table-column prop="updUserName"
                       label="修改人"></el-table-column>
      <el-table-column prop="updTime"
                       sortable
                       label="修改时间"></el-table-column>
      <el-table-column prop="confirmUserName"
                       label="确认人"></el-table-column>
      <el-table-column prop="confirmTime"
                       sortable
                       label="确认时间"></el-table-column>
      <el-table-column fixed="right"
                       width="80"
                       label="操作">
        <template slot-scope="scope">
          <el-dropdown :show-timeout="20">
            <span class="el-dropdown-link">操作
              <i class="el-icon-arrow-down el-icon--right"></i>
            </span>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item v-if="isAuth('warehouse:whoutstock:update')"
                                :disabled="!(scope.row.dictDocStatus === dictDocStatusOption[0].key || scope.row.dictDocStatus === dictDocStatusOption[3].key)"
                                command="purchase"
                                @click.native="addOrUpdateHandle(scope.row.id,'canEdit')">编辑</el-dropdown-item>
              <el-dropdown-item v-if="isAuth('warehouse:whoutstock:confirm')"
                                :disabled="!(scope.row.dictDocStatus === dictDocStatusOption[0].key)"
                                command="purchase"
                                @click.native="beputVerify(scope.row.id)">确认</el-dropdown-item>
              <el-dropdown-item v-if="isAuth('warehouse:whoutstock:revoke')"
                                :disabled="!(scope.row.dictDocStatus === dictDocStatusOption[1].key || scope.row.dictDocStatus === dictDocStatusOption[2].key)"
                                command="manualClosed"
                                @click.native="beputRevocation(scope.row.id)">撤销</el-dropdown-item>
              <el-dropdown-item command="printContract"
                                v-if="isAuth('warehouse:whoutstock:billprint')"
                                @click.native="beputPrint(scope.row.id)">打印</el-dropdown-item>
              <el-dropdown-item v-if="isAuth('warehouse:whoutstock:delete')"
                                :disabled="!(scope.row.dictDocStatus === dictDocStatusOption[0].key || scope.row.dictDocStatus === dictDocStatusOption[3].key)"
                                command="deleteConditional"
                                @click.native="beputDelete(scope.row.id, scope.row)">删除</el-dropdown-item>
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
    <!-- 弹窗, 新增 / 修改 -->
    <bePutAddorupdate ref="bePutAddorupdate"
                      @refreshDataList="getDataList"></bePutAddorupdate>
    <!-- 打印 -->
    <bePutPrint ref="bePutPrint"
                @refreshDataList="getDataList"></bePutPrint>
  </div>
</template>
<script>
// 搜索
import erpSearchPanel from '@/components/erp-search-panel'
// 分页
import paginationAll from '@/components/erp-pagination/pagination-all'
import bePutAddorupdate from './be-put-addorupdate'
import bePutPrint from './be-put-print'
import { initData } from '@/mixins/initData.js'
// 引入图片
import tableImg from '@/components/list-table/table-img'
export default {
  mixins: [initData],
  components: {
    erpSearchPanel,
    paginationAll,
    bePutAddorupdate,
    bePutPrint,
    tableImg
  },
  data () {
    return {
      // 数据过滤器
      searchData: {},
      // 时间过滤
      expectDate: '',
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
      // 下拉
      searchOptions: [{
        label: '仓管员',
        value: 'warehouseUserId',
        inputType: 'el-select-remote',

        httpUrl: '/list/search/user',
        queryKey: 'name',
        dataSource: 'list',
        title: 'salesUserId',
        dataValue: 'id',
        dataLabel: 'name',
        placeholder: '仓管员'
      }, {
        label: '产品编码',
        value: 'prodCode',
        inputType: 'el-input'
      }, {
        label: '产品名称',
        value: 'prodName',
        inputType: 'el-input'
      }, {
        label: '出库单号',
        value: 'code',
        inputType: 'el-input'
      }, {
        label: '出库日期',
        value: 'startDate,endDate',
        inputType: 'el-daterange'
      }, {
        label: '部门',
        value: 'deptId',
        inputType: 'el-cascader',

        httpUrl: 'sys/organization/sortSpecifyNodeId',
        requestParams: { nodeId: sessionStorage.getItem('orgId') },
        dataSource: 'list',
        title: 'deptId',
        dataValue: 'orgId',
        dataLabel: 'name',
        dataChildren: 'subOrgList',
        placeholder: '所属部门'
      }, {
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
      }, {
        label: '出库类型',
        value: 'dictOutstockType',
        inputType: 'el-select',
        httpUrl: 'basicData/queryDataDict2List',
        requestParams: { dataDictKey: 'OUTSTOCK_TYPE' },
        dataSource: 'fontMaps',
        title: 'dictOutstockType',
        dataValue: 'key',
        dataLabel: 'value',
        placeholder: '出库类型'
      }, {
        label: '仓库',
        value: 'warehouseId',
        inputType: 'el-select',

        httpUrl: 'list/combobox/warehouse',
        dataSource: 'list',
        title: 'warehouseIdList',
        dataValue: 'id',
        dataLabel: 'name',
        placeholder: '仓库'
      }],

      dataForm: {},
      dataList: [],

      dataListLoading: false,
      dataListSelections: [],
      isBeputDelete: false
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
        url: this.$http.adornUrl(`warehouse/whoutstock/info/${row.id}`),
        method: 'get'
      }).then(({ data }) => {
        if (data && data.code === 0) {
          this.$set(
            row,
            'whOutstockDetail',
            data.WhOutstockDto.whOutstockDetail
          )
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
        url: this.$http.adornUrl('warehouse/whoutstock/list'),
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
          for (var i = 0; i < this.dataList.length; i++) {
            this.$set(this.dataList[i], 'whOutstockDetail', [])
          }
          //   })
          this.selectionChangeHandle([])
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
        this.isBeputDelete = true
        return
      } else {
        this.isBeputDelete = false
      }
      for (var i = 0; i < this.dataListSelections.length; i++) {
        // 删除
        if (
          !(
            this.dataListSelections[i].dictDocStatus === '01' ||
            this.dataListSelections[i].dictDocStatus === '04'
          )
        ) {
          this.isBeputDelete = true
        }
      }
    },

    // 新增 / 编辑 / 修改
    addOrUpdateHandle (id, type) {
      this.$nextTick(() => {
        this.$refs.bePutAddorupdate.init(id, type)
      })
    },

    // 确认
    beputVerify: _.debounce(
      async function beputVerify (id) {
        this.$http({
          url: this.$http.adornUrl('warehouse/whoutstock/confirm'),
          method: 'post',
          data: id
        }).then(({ data }) => {
          if (data && data.code === 0) {
            this.getDataList()
            this.$notify.success({
              title: '成功',
              message: '确认成功',
              duration: 5000
            })
          } else {
            this.$notify.error({
              title: '提示',
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

    // 撤销
    beputRevocation: _.debounce(
      async function beputRevocation (id) {
        this.$http({
          url: this.$http.adornUrl('warehouse/whoutstock/revoke'),
          method: 'post',
          data: id
        }).then(({ data }) => {
          if (data && data.code === 0) {
            this.getDataList()
            this.$notify.success({
              title: '成功',
              message: '撤销成功',
              duration: 5000
            })
          } else {
            this.$notify.error({
              title: '提示',
              message: `撤销失败:${data.msg}`,
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

    // 打印
    beputPrint (id) {
      this.$http({
        url: this.$http.adornUrl(`warehouse/whoutstock/billprint/${id}`),
        method: 'get'
      }).then(({ data }) => {
        if (data && data.code === 0) {
          this.$refs.bePutPrint.init(data)
        }
      })
    },

    // 删除
    beputDelete (id, row) {
      var ids = id
        ? [id]
        : this.dataListSelections.map(item => {
          return item.id
        })
      this.$confirm(
        `确定要${row ? '删除' : '批量删除'}所选择的数据信息吗？${
        row ? '[单号=' + row.code + ']' : ''
        }`,
        '提示',
        {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }
      ).then(() => {
        this.$http({
          url: this.$http.adornUrl('warehouse/whoutstock/delete'),
          method: 'delete',
          data: this.$http.adornData(ids, false)
        }).then(({ data }) => {
          if (data && data.code === 0) {
            this.getDataList(1)
            this.$notify.success({
              title: '成功',
              message: '删除成功',
              duration: 5000
            })
          } else {
            this.$notify.error({
              title: '提示',
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
