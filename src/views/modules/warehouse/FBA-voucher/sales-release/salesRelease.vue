<!-- 销售出库（FBA主表） -->
<template>
  <div class="mod-config">
    <el-form :inline="true"
             :model="dataForm"
             @keyup.enter.native="getDataList()">
      <el-row>
        <erp-search-panel v-model="searchData"
                          :searchOptions="searchOptions"
                          @search="getDataList(1)"
                          :isResetHandle="true"
                          @resetHandle="resetHandle()" />
      </el-row>
    </el-form>

    <el-table stripe
              border
              highlight-current-row
              max-height="800"
              v-loading="dataListLoading"
              :data="dataList">
      <el-table-column prop="code"
                       width="160"
                       label="销售出库单号"
                       sortable>
        <template slot-scope="scope">
          <a @click="seacher(scope.row.id,'check')"
             class="a-click-hover">{{scope.row.code}}</a>
        </template>
      </el-table-column>
      <el-table-column prop="shippedDate"
                       label="出库日期"
                       width="130"
                       sortable></el-table-column>
      <el-table-column prop="compName"
                       width="200"
                       label="库存公司"></el-table-column>
      <el-table-column prop="channelName"
                       width="200"
                       label="来源店铺"></el-table-column>
      <el-table-column prop="status"
                       width="100"
                       label="单据状态"></el-table-column>
      <el-table-column prop="currencyName"
                       width="100"
                       label="结算币别"></el-table-column>
      <el-table-column prop="warehouseName"
                       width="180"
                       label="仓库"></el-table-column>
      <el-table-column prop="remark"
                       label="备注"></el-table-column>
      <el-table-column fixed="right"
                       label="操作"
                       width="100">
        <template slot-scope="scope">
          <el-dropdown :show-timeout="20">
            <span class="el-dropdown-link">操作
              <i class="el-icon-arrow-down el-icon--right"></i>
            </span>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item command="seacher"
                                @click.native="seacher(scope.row.id,'canEdit')"
                                v-if="isAuth('warehouse:whoutstockso:update')"
                                :disabled="!(scope.row.bMwsOut && (scope.row.statusCode === dictDocStatusOption[0].key || scope.row.statusCode == dictDocStatusOption[3].key))">编辑</el-dropdown-item>
              <el-dropdown-item command="submitHandle"
                                @click.native="submitHandle(scope.row.id)"
                                v-if="isAuth('warehouse:whoutstockso:confirm')"
                                :disabled="!(scope.row.bMwsOut && (scope.row.statusCode === dictDocStatusOption[0].key || scope.row.statusCode == dictDocStatusOption[3].key))">确认</el-dropdown-item>
              <el-dropdown-item command="revokeHandle"
                                @click.native="revokeHandle(scope.row.id)"
                                v-if="isAuth('warehouse:whoutstockso:revoke')"
                                :disabled=" !(scope.row.bMwsOut && (scope.row.statusCode === dictDocStatusOption[2].key))">撤销</el-dropdown-item>
              <el-dropdown-item command="deleteHandle"
                                @click.native="deleteHandle(scope.row.id)"
                                v-if="isAuth('warehouse:whoutstockso:delete')"
                                :disabled="!(scope.row.bMwsOut && (scope.row.statusCode === dictDocStatusOption[0].key || scope.row.statusCode == dictDocStatusOption[3].key))">删除</el-dropdown-item>
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
    <!-- 弹窗, 查看 -->
    <salesRelease-search ref="salesReleaseSearch"
                         @refreshDataList="getDataList"></salesRelease-search>
  </div>
</template>
<script>
// 搜索
import erpSearchPanel from '@/components/erp-search-panel'
// 分页
import paginationAll from '@/components/erp-pagination/pagination-all'
import salesReleaseSearch from './salesRelease-search'
export default {
  components: {
    erpSearchPanel,
    paginationAll,
    salesReleaseSearch
  },
  data () {
    return {
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
      // 下拉
      searchOptions: [
        {
          label: '出库日期',
          value: 'startDate,endDate',
          inputType: 'el-daterange'
        },
        {
          label: '销售出库单号',
          value: 'code',
          inputType: 'el-input'
        },
        {
          label: '来源店铺',
          value: 'channelId',
          inputType: 'el-select',
          httpUrl: 'list/combobox/ownChannel',
          dataSource: 'list',
          title: 'channelIdList',
          dataValue: 'id',
          dataLabel: 'name',
          placeholder: '来源店铺'
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
        }
      ],
      dataForm: {},
      dateValue: '', // 时间
      tableData: [],
      dataList: [],
      dataListLoading: false,
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
      }
    }
  },
  created () {
    this.getDataList()
  },
  methods: {
    // 获取数据列表
    getDataList (val) {
      if (val) {
        this.paginationData.currPage = val
      }
      let searchValue
      if (this.searchData) {
        searchValue = Object.assign({}, searchValue, this.searchData)
      }
      this.dataListLoading = true
      this.$http({
        url: this.$http.adornUrl('warehouse/whoutstockso/list'),
        method: 'get',
        params: Object.assign({}, this.paginationData, searchValue)
      }).then(({ data }) => {
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
          return
        }
        this.dataListLoading = false
      })
    },
    // 销售出库单查看、编辑
    seacher (id, type) {
      this.editorVisible = true
      this.$nextTick(() => {
        this.$refs.salesReleaseSearch.init(id, '', type)
      })
    },
    // 确认
    submitHandle: _.debounce(
      async function submitHandle (id) {
        this.$http({
          url: this.$http.adornUrl(`warehouse/whoutstockso/confirm/${id}`),
          method: 'get'
        }).then(({ data }) => {
          if (data && data.code === 0) {
            this.getDataList()
            this.$notify({
              message: '操作成功',
              type: 'success',
              title: '提示',
              duration: 1500
            })
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

    // 撤销
    revokeHandle: _.debounce(
      async function revokeHandle (id) {
        this.$http({
          url: this.$http.adornUrl(`warehouse/whoutstockso/revoke/${id}`),
          method: 'put'
        }).then(({ data }) => {
          if (data && data.code === 0) {
            this.getDataList()
            this.$notify({
              title: '提示',
              message: '操作成功',
              type: 'success',
              duration: 1500
            })
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

    // 删除
    deleteHandle (id) {
      this.$http({
        url: this.$http.adornUrl(`warehouse/whoutstockso/delete`),
        method: 'delete',
        data: [id]
      }).then(({ data }) => {
        if (data && data.code === 0) {
          this.getDataList()
          this.$notify({
            title: '提示',
            message: '操作成功',
            type: 'success',
            duration: 1500
          })
        } else {
          this.$notify.error({
            title: '错误',
            message: data.msg,
            duration: 5000
          })
        }
      })
    }
  }
}
</script>
