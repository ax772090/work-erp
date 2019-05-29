 <!-- 采购订单（从表） -->
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
                          @resetHandle="resetHandle()"></erp-search-panel>
      </el-row>
      <el-row>
        <span>业务状态:</span>
        <el-radio-group :radioListData='typeRadioList'
                        v-model="filterableAllValue"
                        @change="filterableAll"></el-radio-group>
      </el-row>
      <el-row>
        <span>采购类型:</span>
        <el-radio-group :radioListData='purchaseRadioList'
                        v-model="ProcurementType"
                        @change="checkedChange"></el-radio-group>
      </el-row>
      <el-row>
        <el-button v-if="isAuth('pur:poinfo:save')"
                   type="primary"
                   @click="addOrUpdateHandle('','canAdd')"><i class="iconfont erp-icon-xinzeng"></i>新增</el-button>
        <el-button type="primary"
                   @click="Export()"><i class="iconfont erp-icon-daochu"></i>导出</el-button>
      </el-row>
    </el-form>
    <el-table :data="dataList"
              v-loading="dataListLoading"
              stripe
              border
              highlight-current-row
              @select="selectionChangeHandle"
              @expand-change="rowExpand">
      <el-table-column type="selection"
                       align="center"
                       header-align="center"
                       width="50"></el-table-column>
      <el-table-column type="expand"
                       label="展开"
                       align="center"
                       header-align="center"
                       width="50">
        <template slot-scope="scope">
          <el-table :data="scope.row.tableDataExpand">
            <el-table-column prop="prodCode"
                             label="产品编码"></el-table-column>
            <el-table-column prop="nameCh"
                             label="产品名称"></el-table-column>
            <el-table-column prop="specifications"
                             label="规格型号"></el-table-column>
            <el-table-column prop="unitName"
                             label="产品单位"></el-table-column>
            <el-table-column prop="qty"
                             sortable
                             label="采购数量"></el-table-column>
            <el-table-column prop="price"
                             sortable
                             label="采购单价"></el-table-column>
            <el-table-column prop="amount"
                             sortable
                             label="采购金额"></el-table-column>
            <el-table-column prop="expectDate"
                             sortable
                             label="预计交货日期"></el-table-column>
            <el-table-column prop="closeQty"
                             sortable
                             label="关闭数量"></el-table-column>
            <el-table-column prop="actualQty"
                             sortable
                             label="实际采购数量"></el-table-column>
          </el-table>
        </template>
      </el-table-column>
      <el-table-column prop="code"
                       sortable
                       width="160"
                       label="采购订单号">
        <template slot-scope="scope">
          <a @click="addOrUpdateHandle(scope.row.id, 'canCheck')"
             class="a-click-hover">{{scope.row.code}}</a>
        </template>
      </el-table-column>
      <el-table-column prop="contractCode"
                       sortable
                       width="150"
                       label="合同号"></el-table-column>
      <el-table-column prop="purCompName"
                       label="采购公司"></el-table-column>
      <el-table-column prop="supplierName"
                       label="供应商"></el-table-column>
      <el-table-column prop="purUserName"
                       width="130"
                       label="采购员"></el-table-column>
      <el-table-column prop="warehouseName"
                       width="150"
                       label="收料仓库"></el-table-column>
      <el-table-column prop="currencyName"
                       width="120"
                       label="结算币别"></el-table-column>
      <el-table-column prop="totalAmount"
                       sortable
                       width="120"
                       label="下单总金额"></el-table-column>
      <el-table-column prop="dictBizStatusValue"
                       width="120"
                       label="业务状态"></el-table-column>
      <el-table-column fixed="right"
                       width="80"
                       label="操作">
        <template slot-scope="scope">
          <el-dropdown :show-timeout="20">
            <span class="el-dropdown-link">
              操作
              <i class="el-icon-arrow-down el-icon--right"></i>
            </span>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item v-if="isAuth('pur:poinfo:update')"
                                :disabled="!(scope.row.dictBizStatus === dictBizStatusOption[0].key)"
                                command="addOrUpdateHandle"
                                @click.native="addOrUpdateHandle(scope.row.id, 'canEdit')">编辑</el-dropdown-item>
              <el-dropdown-item v-if="isAuth('pur:poinfo:comfirm')"
                                :disabled="!(scope.row.dictBizStatus === dictBizStatusOption[0].key)"
                                command="confirmOrder"
                                @click.native="confirmOrder(scope.row.id)">订单确认</el-dropdown-item>
              <!-- <el-dropdown-item v-if="isAuth('pur:popayment:pay')"
                                :disabled="!(scope.row.dictBizStatus !== dictBizStatusOption[0].key)"
                                command="purchase"
                                @click.native="purchase(scope.row.id)">采购付款</el-dropdown-item> -->
              <!-- <el-dropdown-item v-if="isAuth('pur:poinfo:close')"
                                :disabled="!(scope.row.dictBizStatus === '02')"
                                command="manualClosed"
                                @click.native="manualClosed(scope.row.id)">手工关闭</el-dropdown-item> -->
              <el-dropdown-item v-if="isAuth('pur:poinfo:printContract')"
                                command="printContract"
                                @click.native="printContract(scope.row)">打印采购合同</el-dropdown-item>
              <el-dropdown-item v-if="isAuth('pur:poinfo:contractDownload')"
                                command="contractDownload"
                                @click.native="printDownload(scope.row.id)">下载采购合同</el-dropdown-item>
              <el-dropdown-item v-if="isAuth('pur:poinfo:revoke')"
                                :disabled="!(scope.row.dictBizStatus === dictBizStatusOption[1].key)"
                                command="operation"
                                @click.native="operation(scope.row.id)">撤销确认</el-dropdown-item>
              <el-dropdown-item v-if="isAuth('pur:poinfo:delete')"
                                :disabled="!(scope.row.dictBizStatus === dictBizStatusOption[0].key)"
                                command="deleteConditional"
                                @click.native="deleteConditional(scope.row)">删除</el-dropdown-item>
              <el-dropdown-item v-if="isAuth('pur:poinfo:delete')"
                                :disabled="!(scope.row.dictBizStatus === dictBizStatusOption[1].key)"
                                command="actionQuality"
                                @click.native="actionQuality(scope.row.id)">开始驻厂质检</el-dropdown-item>
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
    <add-or-update ref="addOrUpdate"
                   @refreshDataList="getDataList"></add-or-update>
    <popaymentAddOrUpdate ref="popaymentAddOrUpdate"
                          @refreshDataList="getDataList"></popaymentAddOrUpdate>

    <printTrue ref="printTrue"
               @refreshDataList="getDataList"></printTrue>
    <printFalse ref="printFalse"
                @refreshDataList="getDataList"></printFalse>
    <!-- 手工关闭 -->
    <orderClose ref="orderClose"
                @refreshDataList="getDataList"></orderClose>
  </div>
</template>
<script>
// 搜索
import erpSearchPanel from '@/components/erp-search-panel'
// 分页
import paginationAll from '@/components/erp-pagination/pagination-all'
import AddOrUpdate from './order-addorupdate'
import printTrue from './order-print-true'
import printFalse from './order-print-false'
import orderClose from './order-close'
import popaymentAddOrUpdate from '../purchase-payment/popayment-add-or-update'
import { initData } from '@/mixins/initData.js'
// 引入radio组件
import elRadioGroup from '@/components/erp-radio/radio-all'
export default {
  mixins: [initData],
  components: {
    erpSearchPanel,
    paginationAll,
    AddOrUpdate,
    printTrue,
    printFalse,
    orderClose,
    popaymentAddOrUpdate,
    elRadioGroup
  },
  data () {
    return {
      typeRadioList: [],
      dictBizStatusOption: [{
        key: '01',
        value: '未下单'
      }, {
        key: '02',
        value: '确认下单'
      }, {
        key: '03',
        value: '完结'
      }],
      purchaseRadioList: [{
        value: '全部',
        key: ''
      }, {
        value: '外部采购',
        key: '0'
      }, {
        value: '内部采购',
        key: '1'
      }],
      checked: false,
      // 数据过滤器
      searchData: {},
      // 时间过滤
      expectDate: '',
      filterableAllValue: '01',
      ProcurementType: '',
      // 下拉
      searchOptions: [{
        label: '采购订单号',
        value: 'code',
        inputType: 'el-input'
      }, {
        label: '合同号',
        value: 'contractCode',
        inputType: 'el-input'
      }, {
        label: '采购日期',
        value: 'planDate,planDateEnd',
        inputType: 'el-daterange'
      }, {
        label: '预计交货日期',
        value: 'expectStart,expectEnd',
        inputType: 'el-daterange'
      }, {
        label: '产品编码',
        value: 'prodCode',
        inputType: 'el-input'
      }, {
        label: '产品名称',
        value: 'prodName',
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
        label: '采购员',
        value: 'purUserId',
        inputType: 'el-select-remote',

        httpUrl: '/list/search/user',
        queryKey: 'name',
        dataSource: 'list',
        title: 'purUserIdList',
        dataValue: 'id',
        dataLabel: 'name',
        placeholder: '采购员'
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
      sourceTpye: '', // 显示内部交易
      tableDataExpand: [], // 展开行
      dataListLoading: false,
      dataListSelections: [],
      searchObj: {}   // 导出时用到的搜索条件
    }
  },

  created () {
    this.getDataList()
    this.getPurchaseStatus()
  },
  methods: {
    getPurchaseStatus () {
      // 采购业务状态
      this.$http.get(this.$http.adornUrl('basicData/queryDataDict2List'), { params: { dataDictKey: 'PO_INFO_BIZ_STATUS' } }).then(({ data }) => {
        this.typeRadioList = data.fontMaps
        this.typeRadioList.unshift({ key: '', value: '全部' })
      })
    },
    // 展开行
    rowExpand (row) {
      this.getDetailData(row)
    },
    // 获取展开行数据新
    getDetailData (mainData) {
      this.$http({
        url: this.$http.adornUrl(`pur/poinfo/info/${mainData.id}`),
        method: 'get'
      }).then(({ data }) => {
        if (data && data.code === 0) {
          for (var i = 0; i < data.poInfoDto.poDetails.length; i++) {
            this.$set(data.poInfoDto.poDetails[i], 'nameCh', data.poInfoDto.poDetails[i].prodBasicEntity.nameCh)
            this.$set(data.poInfoDto.poDetails[i], 'imageUrl', data.poInfoDto.poDetails[i].url)
            this.$set(data.poInfoDto.poDetails[i], 'prodCode', data.poInfoDto.poDetails[i].prodBasicEntity.code)
            this.$set(data.poInfoDto.poDetails[i], 'unitName', data.poInfoDto.poDetails[i].prodBasicEntity.dictUnitEntity.name)
            this.$set(data.poInfoDto.poDetails[i], 'specifications', data.poInfoDto.poDetails[i].prodBasicEntity.specifications)
          }
          this.$set(mainData, 'tableDataExpand', data.poInfoDto.poDetails)
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
    getDataList (val, dateVal) {
      if (val) {
        this.paginationData.currPage = val
      }
      let dataObj = {}
      if (this.expectDate) {
        dataObj = Object.assign({}, dataObj, {
          planDate: this.expectDate[0],
          planDateEnd: this.expectDate[1]
        })
        this.searchObj = dataObj
      }
      if (this.filterableAllValue) {
        dataObj = Object.assign({}, dataObj, {
          dictBizStatus: this.filterableAllValue
        })
        this.searchObj = dataObj
      }
      if (this.searchData) {
        dataObj = Object.assign({}, dataObj, this.searchData)
        this.searchObj = dataObj
      }
      // 显示内部结算订单
      if (this.ProcurementType) {
        dataObj = Object.assign({}, dataObj, { bInner: this.ProcurementType })
        this.searchObj = dataObj
      }
      this.dataListLoading = true
      this.$http({
        url: this.$http.adornUrl('pur/poinfo/list'),
        method: 'get',
        params: Object.assign({}, this.paginationData, dataObj)
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

    // 多选
    selectionChangeHandle (val) {
      this.dataListSelections = val
    },

    // 新增 / 修改
    addOrUpdateHandle (id, type) {
      this.$nextTick(() => {
        this.$refs.addOrUpdate.init(id, type)
      })
    },

    // 导出
    Export () {
      let list = []
      if (this.dataListSelections) {
        for (let i = 0; i < this.dataListSelections.length; i++) {
          list.push(this.dataListSelections[i].id)
        }
      }

      let SearchObj = Object.assign({}, { list: list }, this.searchObj)

      window.open(
        this.$http.tokens(
          'pur/poinfo/exportPoInfoPage',
          SearchObj
        )
      )
    },

    // 删除
    deleteConditional (row) {
      var ids = [row.id]
      if (row.dictBizStatus && row.dictBizStatus !== '01') {
        alert('订单号:  ' + row.code + '  的 "业务状态" 不等于 "正常" , 无法删除')
        return
      }
      this.$confirm(`确定要${row ? '删除' : '批量删除'}所选择的数据信息吗？</br> ${row ? '采购订单单号：' + row.code + '' : ''}`, '提示', {
        confirmButtonText: '确定',
        dangerouslyUseHTMLString: true,
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$http({
          url: this.$http.adornUrl('pur/poinfo/delete'),
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
              title: '失败',
              message: data.msg,
              duration: 5000
            })
          }
        })
      })
    },

    // 开始驻厂质检
    actionQuality: _.debounce(
      async function actionQuality (id) {
        this.$http({
          url: this.$http.adornUrl('warehouse/whreceivepo/residenttest'),
          method: 'post',
          data: this.$http.adornData([id], false)
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
              title: '失败',
              message: data.msg,
              duration: 5000
            })
          }
        })
      }, 1000, { leading: true, trailing: false }
    ),

    // ================================= table方法集 =======================================

    // 确认下单
    confirmOrder: _.debounce(
      async function confirmOrder (id) {
        this.$http({
          url: this.$http.adornUrl('pur/poinfo/confirmById'),
          method: 'post',
          data: id
        }).then(({ data }) => {
          if (data && data.code === 0) {
            this.getDataList()
            this.$notify.success({
              title: '成功',
              message: '确认下单成功',
              duration: 5000
            })
          } else {
            this.$notify.error({
              title: '失败',
              message: data.msg,
              duration: 5000
            })
          }
          this.dataListLoading = false
        })
      }, 1000, { leading: true, trailing: false }
    ),

    // 采购付款
    purchase: _.debounce(
      async function purchase (id) {
        this.$http({
          url: this.$http.adornUrl('pur/popayment/paymentInit'),
          method: 'post',
          data: id
        }).then(({ data }) => {
          if (data && data.code === 0) {
            this.$refs.popaymentAddOrUpdate.init('', 'receiveList', data)
          } else {
            this.$notify.error({
              title: '错误',
              message: data.msg,
              duration: 5000
            })
          }
        })
      }, 1000, { leading: true, trailing: false }
    ),

    // 手工关闭
    manualClosed: _.debounce(
      async function manualClosed (id) {
        this.$nextTick(() => {
          this.$refs.orderClose.init(id)
        })
      }, 1000, { leading: true, trailing: false }
    ),

    // 打印采购合同
    printContract: _.debounce(
      async function printContract (row) {
        let printData = {}
        await this.$http({
          url: this.$http.adornUrl(`pur/poinfo/printContract/${row.id}`),
          method: 'get'
        }).then(({ data }) => {
          if (data && data.code === 0) {
            printData = data
          } else {
            this.$notify.error({
              title: '失败',
              message: '请求数据失败',
              duration: 5000
            })
          }
        })
        if (row.hasTax === true) {
          this.$nextTick(() => {
            this.$refs.printTrue.init(printData)
          })
        } else if (row.hasTax === false) {
          this.$nextTick(() => {
            this.$refs.printFalse.init(printData)
          })
        } else {
          console.log('没有hasTax参数')
        }
      }, 1000, { leading: true, trailing: false }
    ),

    // 下载
    printDownload (id) {
      window.open(this.$http.tokens(`pur/poinfo/contractDownload?id=${id}`))
    },

    // 撤销确认
    operation: _.debounce(
      async function operation (id) {
        this.$http({
          url: this.$http.adornUrl('pur/poinfo/revoke'),
          method: 'post',
          data: id
        }).then(({ data }) => {
          if (data && data.code === 0) {
            this.getDataList()
            this.$notify.success({
              title: '成功',
              message: '撤销确认成功',
              duration: 5000
            })
          } else {
            this.$notify.error({
              title: '失败',
              message: data.msg,
              duration: 5000
            })
          }
          this.dataListLoading = false
        })
      }, 1000, { leading: true, trailing: false }
    ),

    // ==================== 过滤条件 =====================
    resetHandle () {
      this.expectDate = ''
      this.filterableAllValue = '01'
      this.ProcurementType = ''
    },

    // 添加过滤条件的数据列表
    filterable (dateVal) { },

    // 时间段
    filterableDate (dateVal) {
      // this.expectDate
      this.getDataList(1, {
        planDate: dateVal[0],
        planDateEnd: dateVal[1]
      })
    },

    // 全部
    filterableAll (value) {
      // this.filterableAllValue = value
      this.getDataList(1)
    },

    // 显示内部交易
    checkedChange (val) {
      this.getDataList(1)
    }
  }
}
</script>
