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
      <el-row :gutter="10">
        <el-button type="danger"
                   @click="deleteHandle()"
                   v-if="isAuth('warehouse:whreceivepo:delete')"
                   :disabled="isDeleteHandle"><i class="iconfont erp-icon-piliangshanchu"></i>批量删除</el-button>
      </el-row>
    </el-form>
    <el-table stripe
              border
              highlight-current-row
              :data="dataList"
              v-loading="dataListLoading"
              @expand-change="rowExpand"
              @selection-change="selectionChangeHandle">
      <el-table-column type="selection"
                       header-align="center"
                       align="center"
                       width="50"></el-table-column>
      <el-table-column type="expand"
                       label="展开"
                       header-align="center"
                       align="center"
                       width="50">
        <template slot-scope="scope">
          <el-table :data="scope.row.tableDataExpand">
            <el-table-column prop="prodCode"
                             sortable
                             label="产品编码"></el-table-column>
            <el-table-column prop="prodName"
                             label="产品名称"></el-table-column>
            <el-table-column prop="unit"
                             label="产品单位"></el-table-column>
            <el-table-column prop="poQty"
                             sortable
                             label="采购数量"></el-table-column>
            <el-table-column prop="qty"
                             sortable
                             label="本次收货数量"></el-table-column>
            <el-table-column prop="poCode"
                             sortable
                             label="对应采购订单号"></el-table-column>
          </el-table>
        </template>
      </el-table-column>
      <el-table-column prop="code"
                       sortable
                       width="160"
                       label="收货编号">
        <template slot-scope="scope">
          <a @click="addOrUpdateHandle(scope.row.id, 'canCheck')"
             class="a-click-hover">{{scope.row.code}}</a>
        </template>
      </el-table-column>
      <el-table-column prop="date"
                       sortable
                       width="130"
                       label="收货日期"></el-table-column>
      <el-table-column prop="supplierName"
                       label="供应商名称"></el-table-column>
      <el-table-column prop="warehouseName"
                       width="150"
                       label="收货仓库"></el-table-column>
      <el-table-column prop="dictStatusName"
                       width="100"
                       label="单据状态"></el-table-column>
      <el-table-column prop="updUserName"
                       width="130"
                       label="修改人"></el-table-column>
      <el-table-column prop="updTime"
                       sortable
                       width="180"
                       label="修改时间"></el-table-column>
      <el-table-column prop="confirmUserName"
                       width="130"
                       label="确认人"></el-table-column>
      <el-table-column prop="confirmTime"
                       sortable
                       width="180"
                       label="确认时间"></el-table-column>
      <el-table-column width="80"
                       fixed="right"
                       label="操作">
        <template slot-scope="scope">
          <el-dropdown :show-timeout="20">
            <span class="el-dropdown-link">操作
              <i class="el-icon-arrow-down el-icon--right"></i>
            </span>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item command="update"
                                :disabled="!(scope.row.status == statusOption[0].key)"
                                v-if="isAuth('warehouse:whreceivepo:update')"
                                @click.native="addOrUpdateHandle(scope.row.id,'canEdit')">编辑</el-dropdown-item>
              <el-dropdown-item command="checked"
                                :disabled="!(scope.row.status != statusOption[2].key)"
                                v-if="isAuth('warehouse:whreceivepo:confirm')"
                                @click.native="checkedHandle(scope.row.id)">确认</el-dropdown-item>
              <el-dropdown-item command="uncheck"
                                :disabled="!(scope.row.status != statusOption[0].key)"
                                v-if="isAuth('warehouse:whreceivepo:revoke')"
                                @click.native="unreceiveHandle(scope.row.id)">撤销</el-dropdown-item>
              <el-dropdown-item command="delete"
                                :disabled="!(scope.row.status == statusOption[0].key)"
                                v-if="isAuth('warehouse:whreceivepo:delete')"
                                @click.native="deleteHandle(scope.row.id)">删除</el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页 -->
    <el-row>
      <pagination-all v-model="paginationData"
                      @paginationChangeHandle="getDataList()"></pagination-all>
    </el-row>
    <!-- 弹窗,修改 -->
    <receiveRecordAddorupdate ref="receiveRecordAddorupdate"
                              @refreshDataList="getDataList()"></receiveRecordAddorupdate>
  </div>
</template>

<script>
// 搜索
import erpSearchPanel from '@/components/erp-search-panel'
// 分页
import paginationAll from '@/components/erp-pagination/pagination-all'
// 收货编辑弹框
import receiveRecordAddorupdate from './receive-record-addorupdate'
import { initData } from '@/mixins/initData.js'
export default {
  mixins: [initData],
  components: {
    erpSearchPanel,
    paginationAll,
    receiveRecordAddorupdate
  },
  data () {
    return {
      // 数据过滤器
      searchData: {},
      isDeleteHandle: true,
      statusOption: [{
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
          label: '收货日期',
          value: 'dateRange',
          inputType: 'el-daterangeArr'
        },
        {
          label: '采购订单号',
          value: 'poCode',
          inputType: 'el-input'
        },
        {
          label: '供应商名称',
          value: 'supplierId',
          inputType: 'el-select-remote',
          httpUrl: 'basic/basicsupplier/list-used?b_used=true',
          queryKey: 'name',
          dataSource: 'list',
          title: 'supplierIdList',
          dataValue: 'id',
          dataLabel: 'name',
          placeholder: '供应商'
        },
        {
          label: '收货仓库',
          value: 'warehouseId',
          inputType: 'el-select',

          httpUrl: 'list/combobox/warehouse',
          dataSource: 'list',
          title: 'warehouseNameList',
          dataValue: 'id',
          dataLabel: 'name',
          placeholder: '收货仓库'
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
        }
      ],
      dataForm: {},
      dataList: [],
      tableDataExpand: [], // 展开行
      dataListLoading: false,
      dataListSelections: []
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
    getDetailData (mainData) {
      this.$http({
        url: this.$http.adornUrl(`warehouse/whreceivepo/info/${mainData.id}`),
        method: 'get'
      }).then(({ data }) => {
        if (data && data.code === 0) {
          this.$set(
            mainData,
            'tableDataExpand',
            data.poReceiveDto.poReceiveDetail
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
    getDataList (val) {
      if (val !== undefined) {
        this.paginationData.currPage = val
      }
      this.dataListLoading = true
      this.$http({
        url: this.$http.adornUrl('warehouse/whreceivepo/list'),
        method: 'post',
        data:
          this.searchData === undefined
            ? this.paginationData
            : Object.assign({}, this.paginationData, this.searchData)
      }).then(({ data }) => {
        if (data && data.code === 0) {
          this.dataList = data.pageList.dataList
          this.paginationData.totalCount = data.pageList.page.totalCount
          // 初始化，防止点击展开行立马收缩起来
          for (let i = 0; i < this.dataList.length; i++) {
            this.$set(this.dataList[i], 'tableDataExpand', [])
          }
        } else {
          this.dataList = []
          this.paginationData.totalCount = 0
        }
        this.dataListLoading = false
      })
    },
    // 编辑
    addOrUpdateHandle (id, type) {
      this.$nextTick(() => {
        this.$refs.receiveRecordAddorupdate.init(id, type)
      })
    },

    // 确认收货
    checkedHandle: _.debounce(
      async function checkedHandle (id) {
        this.$http({
          url: this.$http.adornUrl('warehouse/whreceivepo/confirm'),
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
        })
      },
      1000,
      {
        leading: true,
        trailing: false
      }
    ),

    // 撤销收货
    unreceiveHandle: _.debounce(
      async function unreceiveHandle (id) {
        this.$confirm(
          `确定要${id ? '撤销' : '批量撤销'}所选择的数据信息吗？`,
          '提示',
          {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }
        ).then(() => {
          this.$http({
            url: this.$http.adornUrl('warehouse/whreceivepo/revoke'),
            method: 'post',
            data: id
          }).then(({ data }) => {
            if (data && data.code === 0) {
              this.getDataList()
              this.$notify.success({
                title: '成功',
                message: '撤销收货成功',
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
      1000,
      {
        leading: true,
        trailing: false
      }
    ),
    // 打印
    // unreceiveHandle(id) {},

    // 删除
    deleteHandle (id) {
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
          url: this.$http.adornUrl('warehouse/whreceivepo/delete'),
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
    },

    // 多选
    selectionChangeHandle (val) {
      this.dataListSelections = val
      if (this.dataListSelections.length <= 0) {
        this.isDeleteHandle = true
        return
      }
      this.dataListSelections.every(item => {
        return (
          item.dictStatusName === '未审核' || item.dictStatusName === '已撤销'
        )
      })
        ? (this.isDeleteHandle = false)
        : (this.isDeleteHandle = true)
    }
  }
}
</script>
