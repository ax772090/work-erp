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
        <el-button v-if="isAuth('basic:basicsupplier:save')"
                   type="primary"
                   @click="addOrUpdateHandle('','canAdd')">
          <i class="iconfont erp-icon-xinzeng"></i>新增
        </el-button>
        <!-- <el-button
          v-if="isAuth('basic:basicsupplier:delete')"
          type="danger"
          @click="deleteHandle()"
          :disabled="dataListSelections.length <= 0"
        >
          <i class="iconfont el-icon--left erp-icon-shanchu"></i>批量删除
        </el-button>-->
        <!-- <el-button type="primary" @click="getDataList()"><i class="iconfont el-icon--left el-icon-erp-ERP_gengxin"></i>刷新</el-button> -->
        <el-button type="primary"
                   @click="activeOrDis(status=false)"
                   :disabled="dataListSelections.length <= 0">
          <i class="iconfont erp-icon-jinyong"></i>禁用
        </el-button>
        <el-button type="primary"
                   @click="activeOrDis(status=true)"
                   :disabled="dataListSelections.length <= 0">
          <i class="iconfont erp-icon-qiyong"></i>启用
        </el-button>
        <!-- <el-button type="primary" ><i class="iconfont el-icon--left el-icon-erp-daoru"></i>导入</el-button> -->
        <!-- <el-button type="primary" ><i class="iconfont el-icon--left el-icon-erp-tubiao105"></i>导出</el-button> -->
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
                       label="供应商编码"
                       width="120"
                       sortable></el-table-column>
      <el-table-column prop="name"
                       label="供应商名称"></el-table-column>
      <el-table-column prop="dictPurchaseType"
                       width="100"
                       label="采购类型"></el-table-column>
      <el-table-column prop="usedInvoice"
                       width="80"
                       label="是否开票">
        <template slot-scope="scope">
          <el-tag v-if="scope.row.usedInvoice == false"
                  size="small"
                  type="danger">否</el-tag>
          <el-tag v-else
                  size="small">是</el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="dictInvoiceType"
                       width="100"
                       label="发票类型"></el-table-column>
      <el-table-column prop="currencyName"
                       width="100"
                       label="币别名称"></el-table-column>
      <el-table-column prop="accountPeriodNum"
                       width="100"
                       label="账期"
                       sortable></el-table-column>
      <el-table-column prop="dictSupplierStatus"
                       width="100"
                       label="状态"></el-table-column>
      <el-table-column prop="contact"
                       width="100"
                       label="联系人"></el-table-column>
      <el-table-column prop="contactPhone"
                       width="150"
                       label="联系电话"></el-table-column>
      <el-table-column prop="shippingAddress"
                       width="150"
                       label="发货地址"></el-table-column>
      <el-table-column prop="bUsed"
                       width="80"
                       label="是否使用">
        <template slot-scope="scope">
          <el-tag v-if="scope.row.bUsed == false"
                  size="small"
                  type="danger">禁用</el-tag>
          <el-tag v-else
                  size="small">正常</el-tag>
        </template>
      </el-table-column>
      <el-table-column fixed="right"
                       width="80"
                       label="操作">
        <template slot-scope="scope">
          <el-button type="primary"
                     size="small"
                     circle
                     title="编辑"
                     @click="addOrUpdateHandle(scope.row.id,'canEdit')">
            <i class="iconfont erp-icon-bianji"></i>
          </el-button>
          <!-- <el-button type="danger" size="small" circle @click="deleteHandle(scope.row.id)">
            <i class="iconfont erp-icon-shanchu"></i>
          </el-button>-->
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页 -->
    <el-row>
      <pagination-all v-model="paginationData"
                      @paginationChangeHandle="getDataList"></pagination-all>
    </el-row>
    <!-- 弹窗, 新增 / 修改 -->
    <add-or-update v-if="addOrUpdateVisible"
                   ref="addOrUpdate"
                   @refreshDataList="getDataList"></add-or-update>
  </div>
</template>
<script>
// 搜索
import erpSearchPanel from '@/components/erp-search-panel'
// 分页
import paginationAll from '@/components/erp-pagination/pagination-all'
import AddOrUpdate from './basicsupplier-add-or-update'
import { initData } from '@/mixins/initData.js'
import { basicSupplierList, basicSupplierActiveOrDis } from '@/api/basic/basic.js'
export default {
  mixins: [initData],
  components: {
    erpSearchPanel,
    paginationAll,
    AddOrUpdate
  },
  data () {
    return {
      // 数据过滤器
      searchData: {},
      // 下拉
      searchOptions: [
        {
          label: '供应商名称',
          value: 'name',
          inputType: 'el-input'
        },
        {
          label: '是否开票',
          value: 'usedInvoice',
          inputType: 'el-select',

          dataList: [{ id: 1, name: '是' }, { id: 0, name: '否' }],
          title: 'usedInvoice',
          dataValue: 'id',
          dataLabel: 'name',
          placeholder: '所在国家'
        },
        {
          label: '发票类型',
          value: 'dictInvoiceType',
          inputType: 'el-select',
          httpUrl: 'basicData/queryDataDict2List',
          requestParams: { dataDictKey: 'INVOICE_TYPE' },
          dataSource: 'fontMaps',
          title: 'InvoiceType',
          dataValue: 'key',
          dataLabel: 'value',
          placeholder: '发票类型'
        },
        {
          label: '状态',
          value: 'dictSupplierStatus',
          inputType: 'el-select',
          httpUrl: 'basicData/queryDataDict2List',
          requestParams: { dataDictKey: 'SUPPLIER_STATUS' },
          dataSource: 'fontMaps',
          title: 'SupplierStatus',
          dataValue: 'key',
          dataLabel: 'value',
          placeholder: '状态'
        },
        {
          label: '采购类型',
          value: 'dictPurchaseType',
          inputType: 'el-select',
          httpUrl: 'basicData/queryDataDict2List',
          requestParams: { dataDictKey: 'PURCHASE_TYPE' },
          dataSource: 'fontMaps',
          title: 'PurchaseType',
          dataValue: 'key',
          dataLabel: 'value',
          placeholder: '采购类型'
        }
      ],

      // 是否禁用
      searchTF: true,
      // 发送批量禁用启用的数据
      searchTFs: {},
      dataForm: {
        key: ''
      },
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
    // 禁用启用功能
    activeOrDis: _.debounce(
      async function activeOrDis (status) {
        let ListSelects = []
        for (let i = 0; i < this.dataListSelections.length; i++) {
          ListSelects.push(this.dataListSelections[i].id)
        }
        basicSupplierActiveOrDis({
          activeOrNot: status,
          ids: ListSelects
        }).then(data => {
          this.$emit('refreshDataList')
          this.getDataList()
          this.notifySuccess('操作成功')
        }).catch(e => {
          this.notifyError(e.data.msg)
          this.getDataList()
        })
      }, 1000, {
        leading: true,
        trailing: false
      }
    ),

    // 获取数据列表
    getDataList (val) {
      if (val != undefined) {
        this.paginationData.currPage = val
      }
      this.dataListLoading = true
      let requestData = Object.assign({}, this.paginationData, this.searchData === undefined ? {} : this.searchData)
      basicSupplierList(requestData).then((data) => {
        this.dataList = data.pageList.dataList
        this.paginationData.totalCount = data.pageList.page.totalCount
        this.paginationData.totalPage = data.pageList.page.totalPage
        if (this.paginationData.totalPage < this.paginationData.currPage) {
          this.paginationData.currPage = this.paginationData.totalPage
          this.getDataList()
        }
        this.dataListLoading = false
      }).catch(() => {
        this.dataList = []
        this.paginationData.totalCount = 0
        this.dataListLoading = false
      })
    },

    // 多选
    selectionChangeHandle (val) {
      this.dataListSelections = val
    },
    // 新增 / 修改
    addOrUpdateHandle (id, type) {
      this.addOrUpdateVisible = true
      this.$nextTick(() => {
        this.$refs.addOrUpdate.init(id, type)
      })
    }
  }
}
</script>
