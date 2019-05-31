 <!-- 盘点方案列表 -->
<template>
  <div>
    <el-row @keyup.enter.native="getDataList()">
      <erp-search-panel v-model="searchData"
                        :searchOptions="searchOptions"
                        @search="getDataList(1)"></erp-search-panel>
    </el-row>
    <el-row>
      <el-button type="primary"
                 v-if="isAuth('warehouse:whstocktakingplan:save')"
                 @click="addOrUpdateHandle()">
        <i class="iconfont erp-icon-xinzeng"></i>新增
      </el-button>
      <el-button type="danger"
                 v-if="isAuth('warehouse:whstocktakingplan:delete')"
                 :disabled="isDeleteHandle"
                 @click="deleteHandle()">
        <i class="iconfont erp-icon-shanchu"></i>删除
      </el-button>
    </el-row>
    <el-table :data="dataList"
              stripe
              border
              highlight-current-row
              max-height="800"
              v-loading="dataListLoading"
              @selection-change="selectionChangeHandle">
      <el-table-column type="selection"
                       header-align="center"
                       align="center"
                       width="50"></el-table-column>
      <el-table-column prop="code"
                       sortable
                       label="方案编号">
        <template slot-scope="scope">
          <a class="a-click-hover"
             @click="addOrUpdateHandle(scope.row.id, 'isDisabled')">{{scope.row.code}}</a>
        </template>
      </el-table-column>
      <el-table-column prop="compName"
                       label="库存公司"></el-table-column>
      <el-table-column prop="dimensionName"
                       label="盘点表分单维度"></el-table-column>
      <el-table-column prop="bGenerate"
                       label="是否已生成盘点表">
        <template slot-scope="scope">
          <el-tag v-if="scope.row.bGenerate == true"
                  size="small"
                  type="success">是</el-tag>
          <el-tag v-else
                  size="danger">否</el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="stocktakingDate"
                       sortable
                       label="盘点日期"></el-table-column>
      <el-table-column prop="updUserName"
                       label="修改人"></el-table-column>
      <el-table-column prop="updTime"
                       sortable
                       label="修改时间"></el-table-column>
      <el-table-column fixed="right"
                       width="80"
                       label="操作">
        <template slot-scope="scope">
          <el-dropdown :show-timeout="20">
            <span class="el-dropdown-link">操作
              <i class="el-icon-arrow-down el-icon--right"></i>
            </span>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item command="addOrUpdateHandle"
                                v-if="isAuth('warehouse:whstocktakingplan:update')"
                                :disabled="!(scope.row.bGenerate === false)"
                                @click.native="addOrUpdateHandle(scope.row.id)">编辑</el-dropdown-item>
              <el-dropdown-item command="revokeHandle"
                                v-if="isAuth('warehouse:whstocktakingplan:revoke')"
                                :disabled="!(scope.row.bGenerate === true)"
                                @click.native="revokeHandle(scope.row.id, scope.row)">撤销</el-dropdown-item>
              <el-dropdown-item command="deleteHandle"
                                v-if="isAuth('warehouse:whstocktakingplan:delete')"
                                :disabled="!(scope.row.bGenerate === false)"
                                @click.native="deleteHandle(scope.row.id, scope.row)">删除</el-dropdown-item>
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
    <planAddorupdate v-if="planAddorupdateVisible"
                     ref="planAddorupdate"
                     @refreshDataList="getDataList"></planAddorupdate>
  </div>
</template>

<script>
// 搜索
import erpSearchPanel from '@/components/erp-search-panel'
// 分页
import paginationAll from '@/components/erp-pagination/pagination-all'
import planAddorupdate from './plan-addorupdate'
import { initData } from '@/mixins/initData.js'
export default {
  mixins: [initData],
  components: {
    erpSearchPanel,
    paginationAll,
    planAddorupdate
  },
  data () {
    return {
      // 数据过滤器
      searchData: {},
      // 时间过滤
      expectDate: '',
      // 下拉
      searchOptions: [{
        label: '库存公司',
        value: 'compId',
        inputType: 'el-select',

        httpUrl: 'sys/organization/select',
        dataSource: 'companyList',
        title: 'compIdList',
        dataValue: 'orgId',
        dataLabel: 'name',
        placeholder: '库存公司'
      }, {
        label: '方案编号',
        value: 'code',
        inputType: 'el-input'
      }, {
        label: '盘点表分单维度',
        value: 'dimension',
        inputType: 'el-select',
        httpUrl: 'basicData/queryDataDict2List',
        requestParams: { dataDictKey: 'STOCKTAKINGDIMENSION' },
        dataSource: 'fontMaps',
        title: 'dimension',
        dataValue: 'key',
        dataLabel: 'value',
        placeholder: '盘点表分单维度'
      }, {
        label: '盘点日期',
        value: 'dateRange',
        inputType: 'el-daterangeArr'
      }, {
        label: '是否已生成盘点表',
        value: 'bGenerate',
        inputType: 'el-select',
        dataList: [{ status: 1, name: '是' }, { status: 0, name: '否' }],
        dataValue: 'status',
        dataLabel: 'name',
        placeholder: '是/否'
      }],

      dataList: [],
      dataListLoading: false,
      dataListSelections: [],
      planAddorupdateVisible: false,
      isDeleteHandle: false
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
      this.dataListLoading = true
      this.$http({
        url: this.$http.adornUrl('warehouse/whstocktakingplan/list'),
        method: 'post',
        data: Object.assign(
          {},
          this.paginationData,
          this.searchData === undefined ? {} : this.searchData
        )
      }).then(({ data }) => {
        if (data && data.code === 0) {
          this.dataList = data.pageList.dataList
          this.paginationData.totalCount = data.pageList.page.totalCount
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
        this.isDeleteHandle = true
      } else {
        this.isDeleteHandle = false
      }
      for (const item of this.dataListSelections) {
        // 删除
        if (!(item.bGenerate === false)) {
          this.isDeleteHandle = true
        }
      }
    },

    // 新增 / 修改
    addOrUpdateHandle (id, type) {
      this.planAddorupdateVisible = true
      this.$nextTick(() => {
        this.$refs.planAddorupdate.init(id, type)
      })
    },

    // 撤销
    revokeHandle: _.debounce(
      async function revokeHandle (id, row) {
        // var ids = id ? [id] : this.dataListSelections.map(item => { return item.id })
        this.$confirm(`确定要【撤销】所选择的数据信息吗？`, '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.$http({
            url: this.$http.adornUrl('warehouse/whstocktakingplan/revoke'),
            method: 'put',
            params: { id: id }
          }).then(({ data }) => {
            if (data && data.code === 0) {
              this.getDataList(1)
              this.$notify.success({
                title: '成功',
                message: '撤销成功',
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
      }, 1000, {
        leading: true,
        trailing: false
      }
    ),

    // 删除
    deleteHandle (id, row) {
      var ids = id
        ? [id]
        : this.dataListSelections.map(item => {
          return item.id
        })
      this.$confirm(
        `确定要${row ? '删除' : '批量删除'}所选择的数据信息吗？`,
        '提示',
        {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }
      ).then(() => {
        this.$http({
          url: this.$http.adornUrl('warehouse/whstocktakingplan/delete'),
          method: 'delete',
          data: ids
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
              title: '错误',
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