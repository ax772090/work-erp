<!--产品一键组合列表-->
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
        <el-button v-if="isAuth('warehouse:whassemblecomposite:save')"
                   type="primary"
                   @click="add()"><i class="iconfont erp-icon-xinzeng"></i>新增</el-button>
      </el-row>
    </el-form>

    <el-table :data="dataList"
              stripe
              border
              highlight-current-row
              max-height="800"
              v-loading="dataListLoading"
              @expand-change="rowExpand"
              @selection-change="selectionChangeHandle">
      <el-table-column type="expand"
                       fixed
                       label="展开"
                       width="50">
        <template slot-scope="scope">
          <el-table stripe
                    border
                    highlight-current-row
                    :data="scope.row.detail">
            <el-table-column prop="prodUrl"
                             label="产品图片"
                             width="120">
              <template slot-scope="scope">
                <tableImg :imageUrl='scope.row.prodUrl'></tableImg>
              </template>
            </el-table-column>
            <el-table-column prop="code"
                             label="产品编码"
                             sortable></el-table-column>
            <el-table-column prop="customsCnName"
                             label="产品名称"></el-table-column>
            <el-table-column prop="specifications"
                             label="规格型号"></el-table-column>
            <el-table-column prop="srcDeliveryCode"
                             label="要货计划单号"
                             sortable></el-table-column>
            <el-table-column prop="assembleQty"
                             label="组合数量"
                             sortable></el-table-column>
            <el-table-column prop="dictInventoryStatusValue"
                             label="库存状态"></el-table-column>
          </el-table>
        </template>
      </el-table-column>
      <el-table-column prop="code"
                       label="组装单号"
                       sortable>
        <template slot-scope="scope">
          <a @click="search(scope)"
             class="a-click-hover">{{scope.row.code}}</a>
        </template>
      </el-table-column>
      <el-table-column prop="date"
                       label="组装日期"
                       width="130"
                       sortable></el-table-column>
      <el-table-column prop="stockOrg"
                       width="200"
                       label="库存公司"></el-table-column>
      <el-table-column prop="warehouse"
                       width="150"
                       label="仓库"></el-table-column>
      <el-table-column prop="admin"
                       width="130"
                       label="仓管员"></el-table-column>
      <el-table-column prop="status"
                       width="100"
                       label="单据状态"></el-table-column>
      <el-table-column prop="updUser"
                       width="130"
                       label="修改人"></el-table-column>
      <el-table-column prop="updTime"
                       label="修改时间"
                       sortable></el-table-column>
      <el-table-column prop="confirmUser"
                       width="130"
                       label="确认人"></el-table-column>
      <el-table-column prop="confirmTime"
                       label="确认时间"
                       sortable></el-table-column>
      <el-table-column fixed="right"
                       width="80"
                       label="操作">
        <template slot-scope="scope">
          <el-dropdown :show-timeout="20">
            <span class="el-dropdown-link">操作
              <i class="el-icon-arrow-down el-icon--right"></i>
            </span>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item command="query"
                                @click.native="editor(scope.row.id)"
                                :disabled="!(scope.row.statusCode == dictDocStatusOption[0].key)"
                                v-if="isAuth('warehouse:whassemble:update')">编辑</el-dropdown-item>
              <el-dropdown-item command="affirm"
                                @click.native="cancel(scope.row.id)"
                                :disabled="!(scope.row.statusCode == dictDocStatusOption[2].key)"
                                v-if="isAuth('warehouse:whassemble:revoke')">撤销组合</el-dropdown-item>
              <el-dropdown-item command="delete"
                                @click.native="del(scope.row.id)"
                                :disabled="!(scope.row.statusCode == dictDocStatusOption[0].key)"
                                v-if="isAuth('warehouse:whassemble:delete')">删除</el-dropdown-item>
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
    <AddOrUpdate ref="addOrUpdate"
                 @refreshDataList="getDataList"></AddOrUpdate>
  </div>
</template>
<script>
// 搜索
import erpSearchPanel from '@/components/erp-search-panel'
// 分页
import paginationAll from '@/components/erp-pagination/pagination-all'
import AddOrUpdate from './add'
import { initData } from '@/mixins/initData.js'
// 引入图片
import tableImg from '@/components/list-table/table-img'
export default {
  mixins: [initData],
  components: {
    erpSearchPanel,
    paginationAll,
    AddOrUpdate,
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
      // 下拉
      searchOptions: [
        {
          label: '库存公司',
          value: 'compId',
          inputType: 'el-select',

          httpUrl: 'sys/organization/select',
          dataSource: 'companyList',
          title: 'compIdList',
          dataValue: 'orgId',
          dataLabel: 'name',
          placeholder: '库存公司'
        },
        {
          label: '要货计划单号',
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
          label: '组装单号',
          value: 'code',
          inputType: 'el-input'
        },
        {
          label: '组装日期',
          value: 'dateRange',
          inputType: 'el-daterangeArr'
        },
        {
          label: '仓库',
          value: 'warehouseId',
          inputType: 'el-select',
          httpUrl: '/list/combobox/warehouse',
          dataSource: 'list',
          title: 'warehouseId',
          dataValue: 'id',
          dataLabel: 'name',
          placeholder: '仓库'
        },
        {
          label: '单据状态',
          value: 'status',
          inputType: 'el-select',
          httpUrl: 'basicData/queryDataDict2List',
          requestParams: { dataDictKey: 'APPROVAL_STATUS' },
          dataSource: 'fontMaps',
          title: 'status',
          dataValue: 'key',
          dataLabel: 'value',
          placeholder: '业务状态'
        },
        {
          label: '仓管员',
          value: 'admin',
          inputType: 'el-select-remote',
          httpUrl: '/list/search/user',
          queryKey: 'name',
          dataSource: 'list',
          title: 'userId',
          dataValue: 'id',
          dataLabel: 'name',
          placeholder: '仓管员'
        }
      ],
      dataList: [],
      dataListLoading: false, // loading加载
      dataForm: {}
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
        url: this.$http.adornUrl(`warehouse/whassemble/info/${row.id}`),
        method: 'get'
      }).then(({ data }) => {
        if (data && data.code === 0) {
          this.$set(row, 'detail', data.whAssemble.whAssembleDetailEntities)
        } else {
          this.$notify.error({
            title: '错误',
            message: data.msg,
            duration: 5000
          })
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
        url: this.$http.adornUrl('warehouse/whassemble/list'),
        method: 'post',
        data:
          this.searchData == undefined
            ? this.paginationData
            : Object.assign({}, this.paginationData, this.searchData)
      }).then(({ data }) => {
        if (data && data.code === 0) {
          this.dataList = data.pageList.dataList
          this.paginationData.totalCount = data.pageList.page.totalCount
          for (let i = 0; i < this.dataList.length; i++) {
            this.$set(this.dataList[i], 'detail', [])
          }
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
    // 新增
    add () {
      this.$nextTick(() => {
        this.$refs.addOrUpdate.init('', 'add')
      })
    },
    // 查看
    search (scope) {
      this.$nextTick(() => {
        this.$refs.addOrUpdate.init(scope.row.id, 'search')
      })
    },
    // 编辑
    editor (id) {
      this.$nextTick(() => {
        this.$refs.addOrUpdate.init(id, 'editor', '', '')
      })
    },
    // 撤销
    cancel: _.debounce(
      async function cancel (id) {
        this.$http({
          url: this.$http.adornUrl('warehouse/whassemble/revoke'),
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
              title: '错误',
              message: data.msg,
              duration: 5000
            })
          }
        })
      }, 1000, {
        leading: true,
        trailing: false
      }
    ),

    // 删除
    del: _.debounce(
      async function del (id) {
        var id = [id]
        this.$http({
          url: this.$http.adornUrl('warehouse/whassemble/delete'),
          method: 'delete',
          data: this.$http.adornData(id, false)
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
      }, 1000, {
        leading: true,
        trailing: false
      }
    )
  }
}
</script>
