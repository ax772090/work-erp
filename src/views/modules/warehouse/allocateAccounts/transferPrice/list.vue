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
                   v-if="isAuth('warehouse:basictransferpricing:save')"><i class="iconfont erp-icon-xinzeng"></i>新增</el-button>
        <el-button type="primary"
                   @click="isForbidden(status=false)"
                   :disabled="dataListSelections.length <= 0"
                   v-if="isAuth('warehouse:basictransferpricing:activeOrDis')"><i class="iconfont erp-icon-jinyong"></i>禁用</el-button>
        <el-button type="primary"
                   @click="isForbidden(status=true)"
                   :disabled="dataListSelections.length <= 0"
                   v-if="isAuth('warehouse:basictransferpricing:activeOrDis')"><i class="iconfont erp-icon-qiyong"></i>启用</el-button>
        <el-button type="primary"
                   @click="priceImport()"
                   v-if="isAuth('warehouse:basictransferpricing:import')"><i class="iconfont erp-icon-daoru"></i>导入</el-button>
        <el-button type="primary"
                   @click="priceExport()"
                   v-if="isAuth('warehouse:basictransferpricing:export')"><i class="iconfont erp-icon-daochu"></i>导出</el-button>
      </el-row>
    </el-form>
    <el-table :data="dataList"
              stripe
              border
              highlight-current-row
              max-height="800"
              v-loading="dataListLoading"
              @selection-change="selectionChangeHandle">
      <el-table-column type="selection"
                       header-align="center"
                       align="center"
                       width="50"></el-table-column>
      <el-table-column prop="compName"
                       width="200"
                       label="销售公司">
      </el-table-column>
      <el-table-column prop="prodCode"
                       label="产品编码"
                       width="120"
                       sortable>
        <template slot-scope="scope">
          <a @click="search(scope,'canCheck')"
             class="a-click-hover">{{scope.row.prodCode}}</a>
        </template>
      </el-table-column>
      <el-table-column prop="prodName"
                       label="产品名称">
      </el-table-column>
      <el-table-column prop="specifications"
                       label="规格型号"></el-table-column>
      <el-table-column prop="currencyName"
                       width="100"
                       label="结算币种">
      </el-table-column>
      <el-table-column prop="price"
                       width="100"
                       label="结算单价"
                       sortable>
      </el-table-column>
      <el-table-column prop="bTax"
                       width="80"
                       label="是否含税">
        <template slot-scope="scope">
          <el-tag v-if="scope.row.bTax == false"
                  size="small"
                  type="danger">否</el-tag>
          <el-tag v-else
                  size="small">是</el-tag>
        </template>
      </el-table-column>
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
      <el-table-column prop="startDate"
                       label="生效日期"
                       width="130"
                       sortable>
      </el-table-column>
      <el-table-column prop="endDate"
                       label="失效日期"
                       width="130"
                       sortable>
      </el-table-column>
      <el-table-column prop="updUser"
                       width="130"
                       label="创建人">
      </el-table-column>
      <el-table-column prop="updTime"
                       width="180"
                       label="创建时间"
                       sortable>
      </el-table-column>
      <el-table-column fixed="right"
                       width="80"
                       label="操作">
        <template slot-scope="scope">
          <el-button type="primary"
                     circle
                     size="small"
                     title="编辑"
                     v-if="isAuth('warehouse:basictransferpricing:update')"
                     @click="Editor(scope,'canEdit')">
            <i class="iconfont erp-icon-bianji"></i></el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页 -->
    <el-row>
      <pagination-all v-model="paginationData"
                      @paginationChangeHandle='getDataList'></pagination-all>
    </el-row>
    <!-- 弹窗, 新增 / 修改 -->
    <AddOrUpdate ref="addOrUpdate"
                 @refreshDataList="getDataList"></AddOrUpdate>
    <xlsImport ref="xlsImport"
               @refreshDataList="getDataList"
               title='导入'></xlsImport>
    <xls-export ref="xlsExport"
                title="数据导出"
                @refreshDataList="getDataList"></xls-export>
  </div>
</template>
<script>
// 搜索
import erpSearchPanel from '@/components/erp-search-panel'
// 分页
import paginationAll from '@/components/erp-pagination/pagination-all'
import AddOrUpdate from './add-update'
import xlsImport from '@/components/xls-import/index'
import { initData } from '@/mixins/initData.js'
// 导出弹窗
import xlsExport from '@/components/xls-export/index'
export default {
  mixins: [
    initData
  ],
  components: {
    erpSearchPanel,
    paginationAll,
    xlsImport,
    xlsExport,
    AddOrUpdate
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
          label: '产品名称',
          value: 'prodName',
          inputType: 'el-input'
        },
        {
          label: '规格型号',
          value: 'specifications',
          inputType: 'el-input'
        },
        {
          label: '产品编码',
          value: 'prodCode',
          inputType: 'el-input'
        },
        {
          label: '是否启用',
          value: 'bUsed',
          inputType: 'el-select',
          httpUrl: 'basicData/queryDataDict2List',
          requestParams: { dataDictKey: 'YES_NO' },
          dataSource: 'fontMaps',
          title: 'bUsed',
          dataValue: 'key',
          dataLabel: 'value',
          placeholder: '是否启用'
        },

        {
          label: '销售公司',
          value: 'saleCompId',
          inputType: 'el-select',
          httpUrl: 'list/combobox/company',
          dataSource: 'list',
          title: 'compName',
          dataValue: 'id',
          dataLabel: 'name',
          placeholder: '销售公司'
        },
        {
          label: '是否含税',
          value: 'bTax',
          inputType: 'el-select',
          httpUrl: 'basicData/queryDataDict2List',
          requestParams: { dataDictKey: 'YES_NO' },
          dataSource: 'fontMaps',
          title: 'bTax',
          dataValue: 'key',
          dataLabel: 'value',
          placeholder: '是否含税'
        }
      ],
      dataList: [],
      dataListSelections: [],
      dataListLoading: false, // loading加载
      dataForm: {
        compName: '',
        prodCode: '',
        prodName: '',
        currencyName: '',
        price: '',
        startDate: '',
        endDate: '',
        updUser: '',
        updTime: ''
      }
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
      this.$http({
        url: this.$http.adornUrl('warehouse/basictransferpricing/list'),
        method: 'get',
        params:
          this.searchData === undefined
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
    // 查看单号详情
    search (scope, type) {
      this.$nextTick(() => {
        this.$refs.addOrUpdate.init(scope.row.id, type)
      })
    },
    // 编辑
    Editor (scope, type) {
      this.$nextTick(() => {
        this.$refs.addOrUpdate.init(scope.row.id, type)
      })
    },
    // 禁用
    isForbidden (status) {
      if (this.dataListSelections.length > 0) {
        let ListSelects = []
        for (let i = 0; i < this.dataListSelections.length; i++) {
          ListSelects.push(this.dataListSelections[i].id)
        }
        this.$http({
          url: this.$http.adornUrl(
            'warehouse/basictransferpricing/activeOrDis'
          ),
          method: 'post',
          data: this.$http.adornData(
            {
              activeOrNot: status,
              ids: ListSelects
            },
            false
          )
        }).then(({ data }) => {
          if (data && data.code === 0) {
            this.$notify({
              title: '成功',
              message: '操作成功',
              type: 'success',
              duration: 2000,
              onClose: () => {
                this.getDataList()
              }
            })
          } else {
            this.$notify.error({
              title: '错误',
              message: data.msg,
              duration: 3000
            })
          }
        })
      }
    },
    // 导入
    priceImport () {
      this.$nextTick(() => {
        this.$refs.xlsImport.init({
          templateUrl: 'basicData/exportModel?fileName=transferpricing.xlsx',
          importUrl: 'warehouse/basictransferpricing/import',
          uploadFailUrl: 'warehouse/basictransferpricing/downloadtransferpricingFailed'
        })
      })
    },
    // 导出
    priceExport () {
      this.$nextTick(() => {
        this.$refs.xlsExport.init({
          exportUrl: 'warehouse/basictransferpricing/export',
          searchData: this.searchData
        })
      })
    }
  }
}
</script>
