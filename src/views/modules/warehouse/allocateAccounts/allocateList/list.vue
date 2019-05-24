<!-- 跨公司调拨 -->
<template>
  <div class="mod-config">
    <el-form :inline="true"
             :model="dataForm"
             @keyup.enter.native="getDataList()">
      <el-row>
        <erp-search-panel v-model="searchData"
                          :searchOptions="searchOptions"
                          @search="getDataList(1)" />
      </el-row>
      <el-row>
        <el-button type="primary"
                   v-if="isAuth('warehouse:whtransfercomp:save')"
                   @click="add('','canAdd')"><i class="iconfont erp-icon-xinzeng"></i>新增</el-button>
      </el-row>
    </el-form>
    <el-table stripe
              border
              highlight-current-row
              max-height="800"
              :data="dataList"
              @expand-change="rowExpand"
              @selection-change="selectionChangeHandle">
      <el-table-column type="expand"
                       header-align="center"
                       align="center"
                       fixed
                       label="展开">
        <template slot-scope="scope">
          <el-table :data="scope.row.detail"
                    stripe
                    border
                    highlight-current-row>
            <el-table-column prop="url"
                             label="产品图片"
                             width="120">
              <template slot-scope="scope">
                <tableImg :imageUrl='scope.row.url'></tableImg>
              </template>
            </el-table-column>
            <el-table-column prop="code"
                             label="产品编码"></el-table-column>
            <el-table-column prop="customsCnName"
                             label="产品名称"></el-table-column>
            <el-table-column prop="specifications"
                             label="规格型号"></el-table-column>
            <el-table-column prop="fromWarehouseName"
                             label="调出仓库"></el-table-column>
            <el-table-column prop="qty"
                             label="调出数量"
                             sortable></el-table-column>
            <el-table-column prop="fromInventoryStatusValue"
                             label="调出库存状态"></el-table-column>
            <el-table-column prop="toWarehouseName"
                             label="调入仓库"></el-table-column>
            <el-table-column prop="qty"
                             label="调入数量"
                             sortable></el-table-column>
            <el-table-column prop="toInventoryStatusValue"
                             label="调入库存状态"></el-table-column>
          </el-table>
        </template>
      </el-table-column>
      <el-table-column label="调拨单号"
                       prop="code"
                       id="table"
                       sortable>
        <template slot-scope="scope">
          <a @click="seacher(scope.row.id,'canCheck')"
             class="a-click-hover">{{scope.row.code}}</a>
        </template>
      </el-table-column>
      <el-table-column label="调拨日期"
                       prop="date"
                       width="130"
                       sortable></el-table-column>
      <el-table-column label="仓管员"
                       width="130"
                       prop="adminUser"></el-table-column>
      <el-table-column label="调出公司"
                       width="200"
                       prop="outComp"></el-table-column>
      <el-table-column label="调入公司"
                       width="200"
                       prop="inComp"></el-table-column>
      <el-table-column label="单据状态"
                       width="100"
                       prop="status"></el-table-column>
      <el-table-column label="创建人"
                       width="130"
                       prop="updUser"></el-table-column>
      <el-table-column label="创建时间"
                       prop="updTime"
                       sortable></el-table-column>
      <el-table-column label="确认人"
                       width="130"
                       prop="confirmUser"></el-table-column>
      <el-table-column label="确认时间"
                       prop="confirmTime"
                       sortable></el-table-column>
      <el-table-column fixed="right"
                       width="80"
                       label="操作">
        <template slot-scope="scope">
          <el-dropdown @command="handleCommand"
                       :show-timeout="20">
            <span class="el-dropdown-link">
              操作
              <i class="el-icon-arrow-down el-icon--right"></i>
            </span>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item command="query"
                                @click.native="addOrEditProductDev(scope.row.id,'canEdit')"
                                :disabled="!(scope.row.statusCode == dictDocStatusOption[0].key)"
                                v-if="isAuth('warehouse:whtransfercomp:update')">编辑</el-dropdown-item>
              <el-dropdown-item command="revoke"
                                @click.native="Revoke(scope.row.id)"
                                :disabled="!(scope.row.statusCode == dictDocStatusOption[2].key)"
                                v-if="isAuth('warehouse:whtransfercomp:revoke')">撤销</el-dropdown-item>
              <el-dropdown-item command="inspectionConfirm"
                                @click.native="confirm(scope.row.id)"
                                v-if="isAuth('warehouse:whtransfercomp:confirm')"
                                :disabled="!(scope.row.statusCode == dictDocStatusOption[0].key)">确认</el-dropdown-item>
              <el-dropdown-item command="delete"
                                @click.native="del(scope.row.id)"
                                :disabled="!(scope.row.statusCode == dictDocStatusOption[0].key)"
                                v-if="isAuth('warehouse:whtransfercomp:delete')">删除</el-dropdown-item>
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
import AddOrUpdate from './add-update'
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
      plain: true,
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
          label: '调出公司',
          value: 'compId',
          inputType: 'el-select',

          httpUrl: 'sys/organization/select',
          dataSource: 'companyList',
          title: 'compIdList',
          dataValue: 'orgId',
          dataLabel: 'name',
          placeholder: '调出公司'
        },
        {
          label: '调入公司',
          value: 'toCompId',
          inputType: 'el-select',

          httpUrl: 'sys/organization/select',
          dataSource: 'companyList',
          title: 'compIdList',
          dataValue: 'orgId',
          dataLabel: 'name',
          placeholder: '调入公司'
        },
        {
          label: '调拨单号',
          value: 'code',
          inputType: 'el-input'
        },
        {
          label: '仓管员',
          value: 'adminId',
          inputType: 'el-select-remote',

          httpUrl: '/list/search/user',
          queryKey: 'name',
          dataSource: 'list',
          title: 'adminId',
          dataValue: 'id',
          dataLabel: 'name',
          placeholder: '仓管员'
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
          label: '调出仓',
          value: 'warehouseId',
          inputType: 'el-select',
          httpUrl: '/list/combobox/warehouse',
          dataSource: 'list',
          title: 'warehouseName',
          dataValue: 'id',
          dataLabel: 'name',
          placeholder: '调出仓'
        },
        {
          label: '调入仓',
          value: 'toWarehouseId',
          inputType: 'el-select',
          httpUrl: '/list/combobox/warehouse',
          dataSource: 'list',
          title: 'warehouseName',
          dataValue: 'id',
          dataLabel: 'name',
          placeholder: '调入仓'
        },
        {
          label: '调拨日期',
          value: 'dateRange',
          inputType: 'el-daterangeArr'
        },
        {
          label: '单据状态',
          value: 'dictDocStatus',
          inputType: 'el-select',
          httpUrl: 'basicData/queryDataDict2List',
          requestParams: { dataDictKey: 'APPROVAL_STATUS' },
          dataSource: 'fontMaps',
          title: 'status',
          dataValue: 'key',
          dataLabel: 'value',
          placeholder: '单据状态'
        }
      ],
      // 是否禁用
      searchTF: true,
      // 发送批量禁用启用的数据
      searchTFs: {},
      dataForm: {},
      dictInventoryStatusOptions: [], // 调入仓库状态
      dateValue: '', // 时间
      tableData: [],
      dataList: [],
      dataListLoading: false,
      dataListSelections: [],
      editorVisible: false
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
        url: this.$http.adornUrl(`warehouse/whtransfercomp/info/${row.id}`),
        method: 'get'
      }).then(({ data }) => {
        if (data && data.code === 0) {
          row.detail = data.whTransferComp.detailList
          for (let i = 0; i < row.detail.length; i++) {
            this.$set(row.detail[i], 'code', row.detail[i].prodEntity.code) // 产品编码
            this.$set(
              row.detail[i],
              'customsCnName',
              row.detail[i].prodEntity.nameCh
            ) // 产品名称
            // 新添加规格型号
            this.$set(row.detail[i], 'specifications', row.detail[i].prodEntity.specifications)
            this.$set(
              row.detail[i],
              'fromWarehouseName',
              data.whTransferComp.warehouseEntity.name
            ) // 调出仓库
            this.$set(
              row.detail[i],
              'toWarehouseName',
              data.whTransferComp.toWarehouseEntity.name
            ) // 调入仓库
          }
        } else {
          this.$notify.error({
            title: '错误',
            message: data.msg,
            duration: 5000
          })
        }
      })
    },
    // 新增
    add (id, type) {
      this.$nextTick(() => {
        this.$refs.addOrUpdate.init(id, type)
      })
    },
    // 编辑
    addOrEditProductDev (id, type) {
      this.$nextTick(() => {
        this.$refs.addOrUpdate.init(id, type)
      })
      this.editorVisible = true
    },
    handleCommand (command) {
      // this.$message("click on item " + command);
    },
    // 获取数据列表
    getDataList (val) {
      if (val) {
        this.paginationData.currPage = val
      }
      this.dataListLoading = true
      this.$http({
        url: this.$http.adornUrl('warehouse/whtransfercomp/list'),
        method: 'post',
        data:
          this.searchData === undefined
            ? this.paginationData
            : Object.assign({}, this.paginationData, this.searchData)
      }).then(({ data }) => {
        if (data && data.code === 0) {
          this.dataList = data.pageList.dataList
          this.paginationData.totalCount = data.pageList.page.totalCount
          this.getDataUrl()
          //   this.$nextTick(() => {
          for (let i = 0; i < this.dataList.length; i++) {
            this.$set(this.dataList[i], 'detail', [])
          }
          //   })
        } else {
          // this.dataList = [];
          this.paginationData.totalCount = 0
        }
        this.dataListLoading = false
      })
    },
    getDataUrl () {
      // 仓库库存状态
      this.$http
        .get(this.$http.adornUrl('basicData/queryDataDict2List'), {
          params: { dataDictKey: 'WAREHOUSE_INVENTORY_STATUS' }
        })
        .then(({ data }) => {
          this.dictInventoryStatusOptions = data.fontMaps
          this.dictToInventoryStatusOption = data.fontMaps
        })
    },
    // 调拨单查看
    seacher (id, type) {
      this.editorVisible = true
      this.$nextTick(() => {
        this.$refs.addOrUpdate.init(id, type)
      })
    },
    // 多选
    selectionChangeHandle (val) {
      this.dataListSelections = val
    },
    // 删除
    del (id) {
      var ids = id
        ? [id]
        : this.dataListSelections.map(item => {
          return item.id
        })
      this.$confirm(
        `确定要${id ? '删除' : '批量删除'}所选择的数据信息吗？`,
        '提示',
        {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }
      ).then(() => {
        this.$http({
          url: this.$http.adornUrl('warehouse/whtransfercomp/delete'),
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
              message: data.msg,
              duration: 5000
            })
          }
        })
      })
    },
    // 撤销
    Revoke: _.debounce(
      async function Revoke (id) {
        this.$http({
          url: this.$http.adornUrl('warehouse/whtransfercomp/revoke'),
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
          this.dataListLoading = false
        })
      },
      1000,
      {
        leading: true,
        trailing: false
      }
    ),

    // 确认
    confirm: _.debounce(
      async function confirm (id) {
        this.$http({
          url: this.$http.adornUrl('warehouse/whtransfercomp/confirm'),
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
    )
  }
}
</script>


