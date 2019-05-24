 <!-- 采购付款新增 -->
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
        <div class="grid-content">
          <el-button type="primary"
                     :disabled="isDeleteHandle"
                     v-if="isAuth('pur:popayment:confirm')"
                     @click="selectPayment()">
            <i class="iconfont el-icon--left el-icon-erp-numpickerplus"></i>批量付款
          </el-button>
        </div>
      </el-row>
    </el-form>
    <el-table :data="dataList"
              stripe
              border
              highlight-current-row
              v-loading="dataListLoading"
              @selection-change="selectionChangeHandle">
      <el-table-column type="selection"
                       align="center"
                       header-align="center"
                       width="50"></el-table-column>
      <el-table-column prop="code"
                       sortable
                       width="160"
                       label="付款单号">
        <template slot-scope="scope">
          <a @click="addOrUpdateHandle(scope.row.id,'canCheck')"
             class="a-click-hover">{{scope.row.code}}</a>
        </template>
      </el-table-column>
      <el-table-column prop="payTypeValue"
                       label="付款类型"
                       width="150"></el-table-column>
      <el-table-column prop="supplierName"
                       label="供应商名称"></el-table-column>
      <el-table-column prop="payDate"
                       label="付款日期"
                       width="160"
                       sortable></el-table-column>
      <el-table-column prop="purCode"
                       width="200"
                       label="采购订单号"
                       sortable></el-table-column>
      <el-table-column prop="totalAmount"
                       label="订单金额"
                       width="130"
                       sortable></el-table-column>
      <el-table-column prop="requestAmount"
                       width="130"
                       label="本次申请金额"
                       sortable></el-table-column>
      <el-table-column prop="paidAmount"
                       width="130"
                       label="确认付款金额"
                       sortable></el-table-column>
      <el-table-column prop="docStatusValue"
                       label="单据状态"
                       width="130"></el-table-column>
      <el-table-column fixed="right"
                       width="80"
                       label="操作"
                       sortable>
        <template slot-scope="scope">
          <el-dropdown :show-timeout="20">
            <span class="el-dropdown-link">操作
              <i class="el-icon-arrow-down el-icon--right"></i>
            </span>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item @click.native="Editor(scope.row.id,'canEdit')"
                                :disabled="!(scope.row.dictDocStatus === dictDocStatusOption[0].key)"
                                v-if="isAuth('pur:popayment:update')">编辑</el-dropdown-item>
              <el-dropdown-item @click.native="deleteHandle(scope.row.id)"
                                :disabled="!(scope.row.dictDocStatus === dictDocStatusOption[0].key)"
                                v-if="isAuth('pur:popayment:delete')">删除</el-dropdown-item>
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
    <AddOrUpdate v-if="addOrUpdateVisible"
                 ref="addOrUpdate"
                 @refreshDataList="getDataList"></AddOrUpdate>
  </div>
</template>
<script>
// 搜索
import erpSearchPanel from '@/components/erp-search-panel'
// 分页
import paginationAll from '@/components/erp-pagination/pagination-all'
import AddOrUpdate from './popayment-add-or-update'
import { initData } from '@/mixins/initData.js'
export default {
  mixins: [initData],
  components: {
    erpSearchPanel,
    paginationAll,
    AddOrUpdate
  },
  data () {
    return {
      isDeleteHandle: true, // 批量删除控制
      // 数据过滤器
      searchData: {},
      dictDocStatusOption: [{
        key: '01',
        value: '未审核'
      }, {
        key: '02',
        value: '审核中'
      }],
      // 下拉
      searchOptions: [
        {
          label: '付款单号',
          value: 'code',
          inputType: 'el-input'
        },
        {
          label: '采购订单号',
          value: 'poCode',
          inputType: 'el-input'
        },
        {
          label: '付款类型',
          value: 'payTypeValue',
          inputType: 'el-select',
          httpUrl: 'basicData/queryDataDict2List',
          requestParams: { dataDictKey: 'PUR_PAY_TYPE' },
          dataSource: 'fontMaps',
          title: 'status',
          dataValue: 'key',
          dataLabel: 'value',
          placeholder: '付款类型'
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
          label: '付款日期',
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
      // dataList: [],
      dataList: [],
      dataListLoading: false,
      dataListSelections: [],
      addOrUpdateVisible: false
    }
  },

  created () {
    this.getDataList()
  },
  methods: {
    // 禁用功能
    activeOrDis (status) {
      let ListSelects = []
      for (let i = 0; i < this.dataListSelections.length; i++) {
        ListSelects.push(this.dataListSelections[i].id)
      }
      this.$http({
        url: this.$http.adornUrl('pur/popayment/activeOrDis/'),
        method: 'post',
        data: this.$http.adornData(
          {
            activeOrNot: status,
            ids: ListSelects
          },
          false
        )
      }).then(({ data }) => {
        this.getDataList()
      })
    },
    // 获取数据列表
    getDataList (val) {
      if (val) {
        this.paginationData.currPage = val
      }
      this.dataListLoading = true
      this.$http({
        url: this.$http.adornUrl('pur/popayment/list'),
        method: 'post',
        data:
          this.searchData === undefined
            ? this.paginationData
            : Object.assign({}, this.paginationData, this.searchData)
      }).then(({ data }) => {
        if (data && data.code === 0) {
          this.dataList = data.pageList.dataList
          this.paginationData.totalCount = data.pageList.page.totalCount
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
        return
      }
      let isDelStatus = this.dataListSelections.every(item => {
        return item.docStatusValue === '未审核'
      })
      this.isDeleteHandle = !isDelStatus
    },
    // 查看
    addOrUpdateHandle (id, type) {
      this.addOrUpdateVisible = true
      this.$nextTick(() => {
        this.$refs.addOrUpdate.init(id, type)
      })
    },
    // 编辑
    Editor (id, type) {
      this.addOrUpdateVisible = true
      this.$nextTick(() => {
        this.$refs.addOrUpdate.init(id, type)
      })
    },
    // 批量付款
    selectPayment: _.debounce(
      async function selectPayment (id) {
        var ids = id
          ? [id]
          : this.dataListSelections.map(item => {
            return item.id
          })
        this.$confirm(
          `确定要${id ? '付款' : '批量付款'}所选择的数据信息吗？`,
          '提示',
          {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }
        ).then(() => {
          this.$http({
            url: this.$http.adornUrl('pur/popayment/confirm'),
            method: 'post',
            data: ids
          }).then(({ data }) => {
            if (data && data.code === 0) {
              this.getDataList(1)
              this.$notify({
                type: 'success',
                message: '提示',
                message: '确认付款成功',
                duration: 3000
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
      { leading: true, trailing: false }
    ),

    // 删除
    deleteHandle (id) {
      let ids = [id]
      this.$confirm('确定要删除此行吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$http({
          url: this.$http.adornUrl('pur/popayment/delete'),
          method: 'delete',
          data: ids
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
