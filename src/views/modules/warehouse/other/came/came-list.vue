 <!-- 其他入库 -->
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
      <el-button v-if="isAuth('warehouse:whinstock:save')"
                 type="primary"
                 @click="addOrUpdateHandle()"><i class="iconfont erp-icon-xinzeng"></i>新增</el-button>
      <el-button type="danger"
                 v-if="isAuth('warehouse:whinstock:delete')"
                 :disabled="isCameDelete"
                 @click="cameDelete()"><i class="iconfont erp-icon-shanchu"></i>删除</el-button>
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
          <el-table :data="scope.row.whInstockDetail">
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
            <el-table-column prop="inQty"
                             sortable
                             label="入库数量"></el-table-column>
            <el-table-column prop="inventoryStatusName"
                             label="库存状态"></el-table-column>
            <el-table-column prop="remark"
                             label="备注"></el-table-column>
          </el-table>
        </template>
      </el-table-column>
      <el-table-column prop="code"
                       sortable
                       label="入库单号">
        <template slot-scope="scope">
          <a @click="addOrUpdateHandle(scope.row.id, 'isDisabled')"
             class="a-click-hover">{{scope.row.code}}</a>
        </template>
      </el-table-column>
      <el-table-column prop="instockDate"
                       sortable
                       width="130"
                       label="入库日期"></el-table-column>
      <el-table-column prop="compName"
                       width="200"
                       label="库存公司"></el-table-column>
      <el-table-column prop="dictInstockTypeName"
                       label="入库类型"></el-table-column>
      <el-table-column prop="warehouseUserName"
                       width="130"
                       label="仓管员"></el-table-column>
      <el-table-column prop="dictDocStatusName"
                       width="80"
                       label="单据状态"></el-table-column>
      <el-table-column prop="updUserName"
                       width="130"
                       label="修改人"></el-table-column>
      <el-table-column prop="updTime"
                       sortable
                       label="修改时间"></el-table-column>
      <el-table-column prop="confirmUserName"
                       width="130"
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
              <el-dropdown-item v-if="isAuth('warehouse:whinstock:update')"
                                :disabled="!(scope.row.dictDocStatus === dictDocStatusOption[0].key || scope.row.dictDocStatus === dictDocStatusOption[3].key)"
                                command="addOrUpdateHandle"
                                @click.native="addOrUpdateHandle(scope.row.id)">编辑</el-dropdown-item>
              <el-dropdown-item v-if="isAuth('warehouse:whinstock:confirm')"
                                :disabled="!(scope.row.dictDocStatus === dictDocStatusOption[0].key)"
                                command="comeConfirm"
                                @click.native="comeConfirm(scope.row.id)">确认</el-dropdown-item>
              <el-dropdown-item v-if="isAuth('warehouse:whinstock:revoke')"
                                :disabled="!(scope.row.dictDocStatus === dictDocStatusOption[2].key)"
                                command="cameRevocation"
                                @click.native="cameRevocation(scope.row.id)">撤销</el-dropdown-item>
              <el-dropdown-item command="camePrint"
                                v-if="isAuth('warehouse:whinstock:billprint')"
                                @click.native="camePrint(scope.row.id)">打印</el-dropdown-item>
              <el-dropdown-item v-if="isAuth('warehouse:whinstock:delete')"
                                :disabled="!(scope.row.dictDocStatus === dictDocStatusOption[0].key || scope.row.dictDocStatus === dictDocStatusOption[3].key)"
                                command="cameDelete"
                                @click.native="cameDelete(scope.row.id, scope.row)">删除</el-dropdown-item>
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
    <cameAddorupdate ref="cameAddorupdate"
                     @refreshDataList="getDataList"></cameAddorupdate>
    <!-- 打印 -->
    <camePrint ref="camePrint"
               @refreshDataList="getDataList"></camePrint>
  </div>
</template>
<script>
// 搜索
import erpSearchPanel from '@/components/erp-search-panel'
// 分页
import paginationAll from '@/components/erp-pagination/pagination-all'
import cameAddorupdate from './came-addorupdate'
import camePrint from './came-print'
import { initData } from '@/mixins/initData.js'
// 引入图片
import tableImg from '@/components/list-table/table-img'
export default {
  mixins: [initData],
  components: {
    erpSearchPanel,
    paginationAll,
    cameAddorupdate,
    camePrint,
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
      searchOptions: [
        {
          label: '入库单号',
          value: 'code',
          inputType: 'el-input'
        },
        {
          label: '入库日期',
          value: 'startDate,endDate',
          inputType: 'el-daterange'
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
          label: '单据状态',
          value: 'dictDocStatus',
          inputType: 'el-select',
          httpUrl: 'basicData/queryDataDict2List',
          requestParams: { dataDictKey: 'APPROVAL_STATUS' },
          dataSource: 'fontMaps',
          title: 'dictDocStatus',
          dataValue: 'key',
          dataLabel: 'value',
          placeholder: '单据状态'
        },
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
          label: '入库类型',
          value: 'dictInstockType',
          inputType: 'el-select',

          httpUrl: 'basicData/queryDataDict2List',
          requestParams: { dataDictKey: 'INSTOCK_TYPE' },
          dataSource: 'fontMaps',
          title: 'dictInstockTypeList',
          dataValue: 'key',
          dataLabel: 'value',
          placeholder: '入库类型'
        },
        {
          label: '仓管员',
          value: 'warehouseUserId',
          inputType: 'el-select-remote',

          httpUrl: '/list/search/user',
          queryKey: 'name',
          dataSource: 'list',
          title: 'warehouseUserIdList',
          dataValue: 'id',
          dataLabel: 'name',
          placeholder: '仓管员'
        }
      ],
      dataForm: {},
      dataList: [],

      dataListLoading: false,
      dataListSelections: [],
      isCameDelete: false
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
        url: this.$http.adornUrl(`warehouse/whinstock/info/${row.id}`),
        method: 'get'
      }).then(({ data }) => {
        if (data && data.code === 0) {
          this.$set(row, 'whInstockDetail', data.whInstockDto.whInstockDetail)
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
        url: this.$http.adornUrl('warehouse/whinstock/list'),
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
            this.$set(this.dataList[i], 'whInstockDetail', [])
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
        this.isCameDelete = true
        return
      } else {
        this.isCameDelete = false
      }
      for (var i = 0; i < this.dataListSelections.length; i++) {
        // 删除
        if (
          !(
            this.dataListSelections[i].dictDocStatus === '01' ||
            this.dataListSelections[i].dictDocStatus === '04'
          )
        ) {
          this.isCameDelete = true
        }
      }
    },

    // 新增 / 修改
    addOrUpdateHandle (id, type) {
      this.$nextTick(() => {
        this.$refs.cameAddorupdate.init(id, type)
      })
    },

    // 确认入库
    comeConfirm: _.debounce(
      async function comeConfirm (id) {
        this.$http({
          url: this.$http.adornUrl('warehouse/whinstock/confirm'),
          method: 'post',
          data: id
        }).then(({ data }) => {
          if (data && data.code === 0) {
            this.getDataList()
            this.$notify.success({
              title: '成功',
              dangerouslyUseHTMLString: true,
              message: `确认入库成功, 编码为:${data.entity.code}`,
              duration: 5000
            })
          } else {
            this.$notify.error({
              title: '提示',
              dangerouslyUseHTMLString: true,
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

    // 撤销
    cameRevocation: _.debounce(
      async function cameRevocation (id) {
        this.$http({
          url: this.$http.adornUrl('warehouse/whinstock/revoke'),
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
              message: `撤销失败:${data.msg}`,
              duration: 5000
            })
          }
        })
      }, 1000, {
        leading: true,
        trailing: false
      }
    ),

    // 打印
    camePrint: _.debounce(
      async function camePrint (id) {
        this.$http({
          url: this.$http.adornUrl(`warehouse/whinstock/billprint/${id}`),
          method: 'get'
        }).then(({ data }) => {
          if (data && data.code === 0) {
            this.$refs.camePrint.init(data)
            // this.dataForm = data.WhOutstockDto
          }
        })
      }, 1000, {
        leading: true,
        trailing: false
      }
    ),

    // 删除
    cameDelete (id, row) {
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
          url: this.$http.adornUrl('warehouse/whinstock/delete'),
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
              title: '错误',
              message: `删除失败:${data.msg}`,
              duration: 5000
            })
          }
        })
      })
    }
  }
}
</script>