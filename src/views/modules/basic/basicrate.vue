<!--内部转移单价列表-->
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
        <el-button type="primary"
                   @click="add('','canAdd')"
                   v-if="isAuth('basic:exchangerate:save')"><i class="iconfont erp-icon-xinzeng"></i>新增</el-button>
        <!-- <el-button type="danger"
                   style="margin-bottom:0px;"
                   @click="del()"
                   :disabled="dataListSelections.length <= 0"
        v-if="isAuth('basic:exchangerate:delete')">批量删除</el-button>-->
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
      <el-table-column prop="exchangeRateTypeName"
                       label="汇率类型"></el-table-column>
      <el-table-column prop="originalCurrencyName"
                       label="原币"></el-table-column>
      <el-table-column prop="localCurrencyName"
                       label="本位币"></el-table-column>
      <el-table-column prop="exchangeRate"
                       label="直接汇率"
                       sortable></el-table-column>
      <el-table-column prop="effectiveDate"
                       label="生效日期"
                       sortable></el-table-column>
      <el-table-column prop="expirationDate"
                       label="失效日期"
                       sortable></el-table-column>
      <el-table-column prop="addUserName"
                       label="创建人"></el-table-column>
      <el-table-column prop="addTime"
                       label="创建时间"
                       sortable></el-table-column>
      <el-table-column fixed="right"
                       width="80"
                       label="操作">
        <template slot-scope="scope">
          <el-button type="primary"
                     size="small"
                     circle
                     title="编辑"
                     @click="editor(scope.row.id,'canEdit')"
                     v-if="isAuth('basic:exchangerate:update')">
            <i class="iconfont erp-icon-bianji"></i>
          </el-button>
          <!-- <el-button type="danger"
                     size="small"
                     circle
                     @click="del(scope.row.id)"
          v-if="isAuth('basic:exchangerate:delete')"><i class="iconfont erp-icon-shanchu"></i></el-button>-->
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页 -->
    <el-row>
      <pagination-all v-model="paginationData"
                      @paginationChangeHandle="getDataList"></pagination-all>
    </el-row>
    <!-- 弹窗, 新增 / 修改 -->
    <basicrateAddUpdate ref="addOrUpdate"
                        @refreshDataList="getDataList"></basicrateAddUpdate>
  </div>
</template>
<script>
// 搜索
import erpSearchPanel from '@/components/erp-search-panel'
// 分页
import paginationAll from '@/components/erp-pagination/pagination-all'
import basicrateAddUpdate from './basicrate-add-update'
import { initData } from '@/mixins/initData.js'
import { basicRateList } from '@/api/basic/basic.js'

export default {
  mixins: [initData],
  components: {
    erpSearchPanel,
    paginationAll,
    basicrateAddUpdate
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
          label: '汇率类型',
          value: 'exchangeRateType',
          inputType: 'el-select',
          httpUrl: 'basicData/queryDataDict2List',
          requestParams: { dataDictKey: 'EXCHANGE_RETE_TYPE' },
          dataSource: 'fontMaps',
          title: 'exchangeRateType',
          dataValue: 'key',
          dataLabel: 'value',
          placeholder: '汇率类型'
        },
        {
          label: '原币',
          value: 'originalCurrency',
          inputType: 'el-select',
          httpUrl: 'basicData/queryAllCurrency',
          dataSource: 'currencyList',
          title: 'originalCurrency',
          dataValue: 'code',
          dataLabel: 'name',
          placeholder: '原币'
        },
        {
          label: '本位币',
          value: 'localCurrency',
          inputType: 'el-select',
          httpUrl: 'basicData/queryAllCurrency',
          dataSource: 'currencyList',
          title: 'localCurrency',
          dataValue: 'code',
          dataLabel: 'name',
          placeholder: '本位币'
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
    //   获取数据列表
    getDataList (val) {
      if (val) {
        this.paginationData.currPage = val
      }
      this.dataListLoading = true
      let requestData = Object.assign({}, this.paginationData, this.searchData === undefined ? {} : this.searchData)
      basicRateList(requestData).then(data => {
        this.dataList = data.pageList.dataList
        this.paginationData.totalCount = data.pageList.page.totalCount
        this.dataListLoading = false
      }).catch(e => {
        this.dataList = []
        this.paginationData.totalCount = 0
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
    // 删除
    // del (id) {
    //   var ids = id
    //     ? [id]
    //     : this.dataListSelections.map(item => {
    //       return item.id
    //     })
    //   this.$confirm(
    //     `确定要${id ? '删除' : '批量删除'}所选择的数据信息吗？`,
    //     '提示',
    //     {
    //       confirmButtonText: '确定',
    //       cancelButtonText: '取消',
    //       type: 'warning'
    //     }
    //   ).then(() => {
    //     this.$http({
    //       url: this.$http.adornUrl('basic/exchangerate/delete'),
    //       method: 'delete',
    //       data: ids
    //     }).then(({ data }) => {
    //       if (data && data.code === 0) {
    //         this.getDataList(1)
    //         this.$notify.success({
    //           message: '删除成功',
    //           duration: 5000
    //         })
    //       } else {
    //         this.$notify.error({
    //           title: '错误',
    //           message: data.msg,
    //           duration: 5000
    //         })
    //       }
    //     })
    //   })
    // }
  }
}
</script>
