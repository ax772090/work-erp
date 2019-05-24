<!--客户列表-->
<template>
  <div>
    <el-form :inline="true"
             :model="dataForm"
             @keyup.enter.native="getDataList()">
      <el-row>
        <erp-search-panel v-model="searchData"
                          :searchOptions="searchOptions"
                          @search="getDataList(1)"></erp-search-panel>
      </el-row>
      <el-row>
        <el-button type="primary"
                   @click="add('','canAdd')"
                   v-if="isAuth('basic:customer:save')"><i class="iconfont erp-icon-xinzeng"></i>新增</el-button>
      </el-row>
    </el-form>
    <el-table :data="dataList"
              stripe
              border
              highlight-current-row
              v-loading="dataListLoading"
              @selection-change="selectionChangeHandle">
      <el-table-column prop="dictPlatformTypeName"
                       label='来源平台'></el-table-column>
      <el-table-column prop="code"
                       label="客户编号"
                       sortable></el-table-column>
      <el-table-column prop="name"
                       width="200"
                       label="客户名称"></el-table-column>
      <el-table-column prop="dictCustomerTypeName"
                       label="客户类型"></el-table-column>
      <el-table-column prop="dictCustomerLevelName"
                       label="客户等级"></el-table-column>
      <el-table-column prop="dictInvoiceTypeName"
                       label="发票类型"></el-table-column>
      <el-table-column prop="dictCountryName"
                       label="所在国家"></el-table-column>
      <el-table-column prop="recipient"
                       label="联系人"></el-table-column>
      <el-table-column prop="phone"
                       label="联系方式"></el-table-column>
      <el-table-column prop="address"
                       label="详细地址"></el-table-column>
      <el-table-column fixed="right"
                       width="80"
                       label="操作">
        <template slot-scope="scope">
          <el-button type="primary"
                     size="small"
                     circle
                     title="编辑"
                     @click="editor(scope.row.id,'canEdit')"
                     v-if="isAuth('basic:customer:update')"><i class="iconfont erp-icon-bianji"></i></el-button>
          <!-- <el-button type="danger"
                     size="small"
                     circle
                     @click="del(scope.row.id)"
                     v-if="isAuth('basic:customer:delete')"><i class="iconfont erp-icon-shanchu"></i></el-button> -->
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页 -->
    <el-row>
      <pagination-all v-model="paginationData"
                      @paginationChangeHandle='getDataList'></pagination-all>
    </el-row>
    <!-- 弹窗, 新增 / 修改 -->
    <basiccustomerAddUpdate ref="addOrUpdate"
                            @refreshDataList="getDataList"></basiccustomerAddUpdate>
  </div>
</template>
<script>
// 搜索
import erpSearchPanel from '@/components/erp-search-panel'
// 分页
import paginationAll from '@/components/erp-pagination/pagination-all'
import basiccustomerAddUpdate from './basiccustomer-add-update'
import { initData } from '@/mixins/initData.js'
export default {
  mixins: [
    initData
  ],
  components: {
    erpSearchPanel,
    paginationAll,
    basiccustomerAddUpdate
  },
  data () {
    return {
      // 数据过滤器
      searchData: {},
      isDisabled: false,
      isForbid: false,
      // 下拉
      searchOptions: [
        {
          label: '来源平台',
          value: 'dictPlatformType',
          inputType: 'el-select',
          httpUrl: 'basicData/queryDataDict2List',
          requestParams: { dataDictKey: 'PLANTFORM_TYPE' },
          dataSource: 'fontMaps',
          title: 'dictPlatformType',
          dataValue: 'key',
          dataLabel: 'value',
          placeholder: '来源平台'
        },
        {
          label: '客户编号',
          value: 'code',
          inputType: 'el-input'
        },
        {
          label: '客户名称',
          value: 'name',
          inputType: 'el-input'
        },
        {
          label: '客户类型',
          value: 'dictCustomerType',
          inputType: 'el-select',
          httpUrl: 'basicData/queryDataDict2List',
          requestParams: { dataDictKey: 'CUSTOMER_TYPE' },
          dataSource: 'fontMaps',
          title: 'dictCustomerType',
          dataValue: 'key',
          dataLabel: 'value',
          placeholder: '客户类型'
        }
      ],
      dataList: [],
      dataListSelections: [],
      dataListLoading: false, // loading加载
      dataForm: {}
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
        url: this.$http.adornUrl('basic/customer/list'),
        method: 'get',
        params:
          this.searchData == undefined
            ? this.paginationData
            : Object.assign({}, this.paginationData, this.searchData)
      }).then(({ data }) => {
        if (data && data.code === 0) {
          this.dataList = data.pageList.dataList
          this.paginationData.totalCount = data.pageList.page.totalCount
        } else {
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
    add (id, type) {
      this.$nextTick(() => {
        this.$refs.addOrUpdate.init(id, type)
      })
    },
    // 编辑
    editor (id, type) {
      this.$nextTick(() => {
        this.$refs.addOrUpdate.init(id, type)
      })
    }

  }
}
</script>