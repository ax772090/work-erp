<template>
  <div>
    <el-form :inline="true"
             :model="dataForm"
             @keyup.enter.native="getDataList()">
      <el-row>
        <erp-search-panel v-model="searchData"
                          :searchOptions="searchOptions"
                          @search="getDataList(1)"
                          :isResetHandle="true"
                          @resetHandle="resetHandle()"></erp-search-panel>
      </el-row>
      <el-row>
        <el-button type="primary"
                   v-if="isAuth('warehouse:purchasewhreturnpo:save')"
                   @click="editHandle('','canAdd')"><i class="iconfont erp-icon-xinzeng"></i>新增</el-button>
        <el-button type="primary"
                   v-if="isAuth('warehouse:whreturnpo:generatepayable')"
                   :disabled="isAddProPayment"
                   @click="addProPayment()"><i class="iconfont erp-icon-xinzeng"></i>批量生成应付单</el-button>
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
                       align="center"
                       width="50"></el-table-column>
      <el-table-column type="expand"
                       label="展开"
                       width="50">
        <template slot-scope="scope">
          <el-table :data="scope.row.tableDataExpand">
            <el-table-column prop="prodCode"
                             label="产品编码"></el-table-column>
            <el-table-column prop="prodName"
                             label="产品名称"></el-table-column>
            <el-table-column prop="qty"
                             sortable
                             label="退货数量"></el-table-column>
            <el-table-column prop="inventoryStatusName"
                             label="库存状态"></el-table-column>
            <el-table-column prop="remark"
                             label="备注"></el-table-column>
          </el-table>
        </template>
      </el-table-column>
      <el-table-column prop="code"
                       label="退货单编号"
                       width="160"
                       sortable>
        <template slot-scope="scope">
          <a @click="editHandle(scope.row.id, 'canCheck')"
             class="a-click-hover">{{scope.row.code}}</a>
        </template>
      </el-table-column>
      <el-table-column prop="supplierName"
                       label="供应商名称"></el-table-column>
      <el-table-column prop="date"
                       label="退货日期"
                       width="130"
                       sortable></el-table-column>
      <el-table-column prop="warehouseName"
                       width="150"
                       label="退货仓库"></el-table-column>
      <el-table-column prop="dictStatusName"
                       width="120"
                       label="单据状态"></el-table-column>
      <el-table-column prop="updUserName"
                       width="130"
                       label="修改人"></el-table-column>
      <el-table-column prop="updTime"
                       label="修改时间"
                       width="200"
                       sortable></el-table-column>
      <el-table-column prop="confirmUserName"
                       width="130"
                       label="确认人"></el-table-column>
      <el-table-column prop="confirmTime"
                       label="确认时间"
                       width="200"
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
              <el-dropdown-item v-if="isAuth('warehouse:whreturnpo:update')"
                                command="update"
                                :disabled="!(scope.row.status !== statusOption[2].key)"
                                @click.native="editHandle(scope.row.id,'canEdit')">编辑</el-dropdown-item>
              <el-dropdown-item v-if="isAuth('warehouse:whreturnpo:confirm')"
                                :disabled="!(scope.row.status === statusOption[0].key || scope.row.status === statusOption[3].key)"
                                command="checked"
                                @click.native="checkedHandle(scope.row.id)">确认退货</el-dropdown-item>
              <el-dropdown-item v-if="isAuth('warehouse:whreturnpo:revoke')"
                                :disabled="!(scope.row.status === statusOption[2].key)"
                                command="uncheck"
                                @click.native="revocation(scope.row.id)">撤销退货</el-dropdown-item>
              <el-dropdown-item v-if="isAuth('warehouse:whreturnpo:delete')"
                                :disabled="!(scope.row.status === statusOption[0].key || scope.row.status === statusOption[3].key)"
                                command="delete"
                                @click.native="deleteHandle(scope.row.id)">删除</el-dropdown-item>
              <el-dropdown-item v-if="isAuth('warehouse:whreturnpo:print')"
                                command="delete"
                                @click.native="print(scope.row.id)">打印</el-dropdown-item>
              <el-dropdown-item command="print"
                                v-if="isAuth('warehouse:whreturnpo:generatepayable')"
                                :disabled="!(scope.row.status !== statusOption[2].key || scope.row.mode === 0)"
                                @click.native="addProPayment(scope.row.id)">生成应付单号</el-dropdown-item>
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
    <return-edit v-if="returnEdit"
                 ref="returnEdit"
                 @refreshDataList="getDataList"></return-edit>
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
import returnEdit from './return-edit'
import print from './return-print'
import { initData } from '@/mixins/initData.js'
export default {
  mixins: [initData],
  components: {
    erpSearchPanel,
    paginationAll,
    returnEdit,
    print
  },
  data () {
    return {
      // 数据过滤器
      searchData: {},
      // 时间过滤
      expectDate: '',
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
      searchOptions: [{
        label: '退货单号',
        value: 'code',
        inputType: 'el-input'
      }, {
        label: '供应商',
        value: 'supplierId',
        inputType: 'el-select-remote',
        httpUrl: 'basic/basicsupplier/list-used?b_used=true',
        queryKey: 'name',
        dataSource: 'list',
        title: 'supplierIdList',
        dataValue: 'id',
        dataLabel: 'name',
        placeholder: '供应商'
      }, {
        label: '退货日期',
        value: 'planDate,planDateEnd',
        inputType: 'el-daterange'
      }, {
        label: '产品名称',
        value: 'prodName',
        inputType: 'el-input'
      }, {
        label: '产品编码',
        value: 'prodCode',
        inputType: 'el-input'
      }, {
        label: '采购订单号',
        value: 'poCode',
        inputType: 'el-input'
      }, {
        label: '退货员',
        value: 'userId',
        inputType: 'el-select-remote',

        httpUrl: '/list/search/user',
        queryKey: 'name',
        dataSource: 'list',
        title: 'userId',
        dataValue: 'id',
        dataLabel: 'name',
        placeholder: '退货员'
      }, {
        label: '退货仓库',
        value: 'warehouseId',
        inputType: 'el-select',

        httpUrl: 'list/combobox/warehouse',
        dataSource: 'list',
        title: 'warehouseIdList',
        dataValue: 'id',
        dataLabel: 'name',
        placeholder: '退货仓库'
      }, {
        label: '单据状态',
        value: 'status',
        inputType: 'el-select',

        httpUrl: 'basicData/queryDataDict2List',
        requestParams: { dataDictKey: 'APPROVAL_STATUS' },
        dataSource: 'fontMaps',
        title: 'statusList',
        dataValue: 'key',
        dataLabel: 'value',
        placeholder: '单据状态'
      }],
      dataForm: {},
      dataList: [],
      dataListLoading: false,
      dataListSelections: [],
      isAddProPayment: true,
      returnEdit: false,
      tableDataExpand: [] // 展开行
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
        url: this.$http.adornUrl(`warehouse/whreturnpo/info/${mainData.id}`),
        method: 'get'
      }).then(({ data }) => {
        if (data && data.code === 0) {
          this.$set(mainData, 'tableDataExpand', data.poReturnDto.poReturnDetail)
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
    getDataList (val, searchObj) {
      if (val) {
        this.paginationData.currPage = val
      }
      let searchValue
      if (this.searchData) {
        searchValue = Object.assign({}, searchValue, this.searchData)
      }
      this.dataListLoading = true
      this.$http({
        url: this.$http.adornUrl('warehouse/whreturnpo/list'),
        method: 'get',
        params: Object.assign({}, this.paginationData, searchValue)
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
    editHandle (id, type) {
      this.returnEdit = true
      this.$nextTick(() => {
        this.$refs.returnEdit.init(id, type)
      })
    },

    // 确认退货
    checkedHandle: _.debounce(
      async function checkedHandle (id) {
        this.$http({
          url: this.$http.adornUrl('warehouse/whreturnpo/confirm'),
          method: 'post',
          data: id
        }).then(({ data }) => {
          if (data && data.code === 0) {
            this.getDataList()
            this.$notify.success({
              dangerouslyUseHTMLString: true,
              message: `确认退货成功,编码为: ${data.entity.code}</br> ${data.entity.yfCodes.length > 0 ? '成功生成采购应付单:' + data.entity.yfCodes.join('</br>') : '无法生成应付单，原因：1.已成功生成；2.不存在订单关联关系；'} `,
              duration: 5000
            })
          } else {
            this.$notify.error({
              title: '警告',
              message: data.msg,
              duration: 5000
            })
          }
          this.dataListLoading = false
        })
      }, 1000, {
        leading: true,
        trailing: false
      }
    ),

    // 撤销退货
    revocation: _.debounce(
      async function revocation (id) {
        this.$confirm('确认要撤销吗？', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.$http({
            url: this.$http.adornUrl('warehouse/whreturnpo/revoke'),
            method: 'post',
            data: id
          }).then(({ data }) => {
            if (data && data.code === 0) {
              this.getDataList()
              this.$notify.success({
                dangerouslyUseHTMLString: true,
                message: `撤销退货成功</br>${data.entity.yfCodes.length > 0 ? '成功删除下游应付单:' + data.entity.yfCodes.join('</br>') : ''}`,
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
      }, 1000, {
        leading: true,
        trailing: false
      }
    ),

    // 删除
    deleteHandle (id) {
      let ids = [id]
      this.$confirm('确认要删除此行吗？', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$http({
          url: this.$http.adornUrl('warehouse/whreturnpo/delete'),
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

    // 打印
    print (id) {
      this.$http({
        url: this.$http.adornUrl(`warehouse/whreturnpo/print/${id}`),
        method: 'get'
      }).then(({ data }) => {
        if (data && data.code === 0) {
          this.$refs.print.init(data)
        }
      })
    },

    resetHandle () {
      this.expectDate = ''
    },

    // 选择日期进行搜索
    changeDate (dateVal) {
      this.getDataList(1)
    },

    // 生成应付单
    addProPayment (id) {
      var ids = id ? [id] : this.dataListSelections.map(item => { return item.id })
      this.$confirm(`确定要${id ? '生成应付单' : '批量生成应付单'}吗？`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$http({
          url: this.$http.adornUrl('warehouse/whreturnpo/generatepayable'),
          method: 'post',
          data: this.$http.adornData(ids, false)
        }).then(({ data }) => {
          if (data && data.code === 0) {
            this.getDataList()
            this.$notify.success({
              dangerouslyUseHTMLString: true,
              title: '成功',
              message: `${data.yfCodes.length <= 0 ? '无法生成应付单，原因：1.已成功生成；2.不存在订单关联关系；' : '生成的应付单号为: ' + data.yfCodes.join('</br>')}`,
              duration: 5000
            })
          } else {
            this.$notify.error(data.msg)
          }
        })
      })
    },

    // 多选
    selectionChangeHandle (val) {
      this.dataListSelections = val
      if (this.dataListSelections.length <= 0) {
        this.isAddProPayment = true
        return
      } else {
        this.isAddProPayment = false
      }
      for (const item of this.dataListSelections) {
        // mode标识符: 是否是已收料再退货类型的单据
        if (!(item.status === this.statusOption[2].key) || item.mode === 1) {
          this.isAddProPayment = true
        }
      }
    }
  }
}
</script>

