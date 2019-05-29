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
        <el-button v-if="isAuth('prod:prodbasic:save')"
                   type="primary"
                   @click="prodTabHandle()">
          <i class="iconfont erp-icon-xinzeng"></i>产品新增
        </el-button>
        <el-button v-if="isAuth('prod:prodbasic:updatestatus')"
                   type="primary"
                   @click="listStatusModificationHandle()"
                   :disabled="dataListSelections.length <= 0"><i class="iconfont erp-icon-xiugai"></i>批量修改</el-button>
        <el-button v-if="isAuth('prod:prodbasic:import')"
                   type="primary"
                   @click="ImportHandle()"><i class="iconfont erp-icon-daoru"></i>产品导入</el-button>
        <el-button v-if="isAuth('prod:prodbasic:export')"
                   type="primary"
                   @click="exportHandle()"><i class="iconfont erp-icon-daochu"></i>产品导出</el-button>
        <el-button v-if="isAuth('prod:prodbasic:importItems')"
                   type="primary"
                   @click="skuImportHandle()"><i class="iconfont erp-icon-daoru"></i>组合sku导入</el-button>
        <el-button v-if="isAuth('prod:prodbasic:exportItems')"
                   type="primary"
                   @click="skuexportHandle()"><i class="iconfont erp-icon-daochu"></i>组合sku导出</el-button>
      </el-row>
    </el-form>
    <el-table :data="dataList"
              v-loading="dataListLoading"
              stripe
              border
              highlight-current-row
              @selection-change="selectionChangeHandle">
      <el-table-column type="selection"
                       align="center"
                       header-align="center"
                       width="50"></el-table-column>
      <el-table-column prop="prodCode"
                       label="产品情况"
                       width="140">
        <template slot-scope="scope">
          <div>图片信息:
            <el-tag v-if="scope.row.imageId === null || scope.row.imageId === ''"
                    size="small"
                    type="danger">未上传</el-tag>
            <el-tag v-else
                    size="small">已上传</el-tag>
          </div>
          <div>仓库信息:
            <el-tag v-if="scope.row.warehouseId === 0 || scope.row.warehouseId === ''"
                    size="small"
                    type="danger">未维护</el-tag>
            <el-tag v-else
                    size="small">已维护</el-tag>
          </div>
          <div>组 合 sku:
            <el-tag v-if="scope.row.items === 0 || scope.row.items === ''"
                    size="small"
                    type="danger">未指定</el-tag>
            <el-tag v-else
                    size="small">已指定</el-tag>
          </div>
        </template>
      </el-table-column>
      <el-table-column prop="imageUrl"
                       label="产品图片"
                       width="120">
        <template slot-scope="scope">
          <tableImg :imageUrl='scope.row.imageUrl'></tableImg>
        </template>
      </el-table-column>
      <el-table-column prop="prodCode"
                       label="自定义SKU">
        <template slot-scope="scope">
          <a @click="prodTabHandle(scope.row.id, '1')"
             class="a-click-hover">{{scope.row.prodCode}}</a>
        </template>
      </el-table-column>
      <el-table-column prop="nameCh"
                       label="产品名称"></el-table-column>
      <el-table-column prop="specifications"
                       label="规格型号"></el-table-column>
      <el-table-column prop="brandName"
                       label="所属品牌"></el-table-column>
      <el-table-column prop="categoryName"
                       label="产品分类"></el-table-column>
      <!-- <el-table-column prop="upc"
                       label="UPC"></el-table-column>
      <el-table-column prop="ean"
                       label="EAN"></el-table-column> -->
      <el-table-column prop="bAssemble"
                       label="是否组合产品">
        <template slot-scope="scope">
          <el-tag v-if="scope.row.bAssemble == false"
                  size="small"
                  type="danger">否</el-tag>
          <el-tag v-else
                  size="small">是</el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="propertiesName"
                       label="产品属性"></el-table-column>
      <el-table-column prop="saleStatus"
                       label="销售状态"></el-table-column>
      <el-table-column prop="purCostPrice"
                       label="采购成本"></el-table-column>
      <el-table-column prop="deliveryDays"
                       label="采购预计交期"></el-table-column>
      <el-table-column prop="bUsed"
                       label="是否使用">
        <template slot-scope="scope">
          <el-tag v-if="scope.row.bUsed === false"
                  size="small"
                  type="danger">禁用</el-tag>
          <el-tag v-else
                  size="small">正常</el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="userName"
                       label="开发人员"></el-table-column>
      <el-table-column prop="addTime"
                       sortable
                       label="创建时间"></el-table-column>
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
              <el-dropdown-item v-if="isAuth('prod:prodbasic:update')"
                                @click.native="prodTabHandle(scope.row.id)">编辑</el-dropdown-item>
              <el-dropdown-item v-if="isAuth('prod:prodbasic:copy')"
                                @click.native="CopyHandle(scope.row.id)">复制</el-dropdown-item>
              <el-dropdown-item v-if="isAuth('prod:prodbasic:delete')"
                                @click.native="deleteHandle(scope.row.id)">删除</el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </template>
      </el-table-column>
    </el-table>
    <el-row>
      <pagination-all v-model="paginationData"
                      @paginationChangeHandle="getDataList()"></pagination-all>
    </el-row>
    <!-- 弹窗, 新增 / 修改 -->
    <prod-tab v-if="prodTabVisible"
              ref="prodTab"
              @refreshDataList="getDataList()"></prod-tab>
    <xlsImport ref="xlsImport"
               @refreshDataList="getDataList"
               title="导入"></xlsImport>
    <xls-export ref="xlsExport"
                title="数据导出"
                @refreshDataList="getDataList"></xls-export>
    <list-status-modification v-if="listStatusModificationVisible"
                              ref="listStatusModification"
                              @refreshDataList="getDataList()"></list-status-modification>
    <!-- 产品复制 -->
    <prod-copy title="产品复制"
               ref="prodCopy"
               @prodSubmit="prodCopySubmit"></prod-copy>
  </div>
</template>
<script>
// 搜索
import erpSearchPanel from '@/components/erp-search-panel'
// 分页
import paginationAll from '@/components/erp-pagination/pagination-all'
import prodTab from './prod-tab'
import xlsImport from '@/components/xls-import/index'
// 批量修改状态
import listStatusModification from './list-status-modification'
import Bus from '@/components/js/bus.js'
import { initData } from '@/mixins/initData.js'
// 导出弹窗
import xlsExport from '@/components/xls-export/index'
// 引入图片
import tableImg from '@/components/list-table/table-img'
// 产品复制弹窗
import prodCopy from './prod-copy'
export default {
  mixins: [initData],
  components: {
    erpSearchPanel,
    paginationAll,
    prodTab,
    xlsImport,
    xlsExport,
    listStatusModification,
    prodCopy,
    tableImg
  },
  data () {
    return {
      // 搜索=>数据过滤器
      searchData: {},
      // 过滤选项
      searchOptions: [
        {
          label: '产品名称',
          value: 'nameCh',
          inputType: 'el-input'
        },
        {
          label: '产品分类',
          value: 'categoryId',
          inputType: 'el-cascader',
          httpUrl: 'basic/basiccategory/treeList',
          requestParams: { id: '' },
          dataSource: 'treeList',
          title: 'categoryList',
          dataValue: 'id',
          dataLabel: 'name',
          dataChildren: 'subCategoryNode',
          placeholder: '所属分类'
        },
        {
          label: '产品编号',
          value: 'code',
          inputType: 'el-input'
        },
        {
          label: '所属品牌',
          value: 'brandId',
          inputType: 'el-select',
          httpUrl: '/basic/basicbrand/listcombobox',
          dataSource: 'list',
          title: 'brandList',
          dataValue: 'id',
          dataLabel: 'name',
          placeholder: '所属品牌'
        },
        {
          label: '开发人员',
          value: 'devUserId',
          inputType: 'el-select-remote',

          httpUrl: '/list/search/user',
          queryKey: 'name',
          dataSource: 'list',
          title: 'devUserList',
          dataValue: 'id',
          dataLabel: 'name',
          placeholder: '开发人员'
        },
        {
          label: '是否是组合产品',
          value: 'bAssemble',
          inputType: 'el-select',

          dataList: [{ id: true, name: '是' }, { id: false, name: '否' }],
          title: 'bAssemble',
          dataValue: 'id',
          dataLabel: 'name',
          placeholder: '所在国家'
        },
        {
          label: '规格型号',
          value: 'specifications',
          inputType: 'el-input'
        },
        {
          label: 'UPC',
          value: 'upc',
          inputType: 'el-input'
        },
        {
          label: '销售状态',
          value: 'saleStatus',
          inputType: 'el-select',

          httpUrl: '/basicData/queryDataDict2List',
          requestParams: { dataDictKey: 'SALE_STATUS' },
          dataSource: 'fontMaps',
          title: 'devUserList',
          dataValue: 'key',
          dataLabel: 'value',
          placeholder: '销售状态'
        }
      ],
      dataForm: {},
      dataList: [],
      dataListLoading: false,
      dataListSelections: [],
      prodTabVisible: false,
      // 导入导出
      xlsImportVisible: false,
      // 批量修改
      listStatusModificationVisible: false
    }
  },

  created () {
    this.getDataList()
  },
  mounted () {
    Bus.$on('prodTabChildren', msg => {
      this.getDataList()
    })
  },
  methods: {
    getDataList (num) {
      if (num) {
        this.paginationData.currPage = num
      }
      this.dataListLoading = true
      this.$http({
        url: this.$http.adornUrl('prod/prodbasic/list'),
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

    // 禁用功能
    activeOrDis: _.debounce(
      async function activeOrDis (status) {
        let ListSelects = []
        for (let i = 0; i < this.dataListSelections.length; i++) {
          ListSelects.push(this.dataListSelections[i].id)
        }
        this.$http({
          url: this.$http.adornUrl('basic/basicbrand/activeOrDis/'),
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
            this.getDataList()
            this.$notify.success({
              title: '成功',
              message: '禁用成功',
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
      }, 1000, {
        leading: true,
        trailing: false
      }
    ),

    // 批量修改状态
    listStatusModificationHandle () {
      let status = []
      for (let i = 0; i < this.dataListSelections.length; i++) {
        status.push(this.dataListSelections[i].id)
      }
      this.listStatusModificationVisible = true
      this.$nextTick(() => {
        this.$refs.listStatusModification.init(status)
      })
    },

    // 新增 / 修改/查看（handleType:'1'）
    prodTabHandle (id, handleType) {
      this.prodTabVisible = true
      this.$nextTick(() => {
        this.$refs.prodTab.init(id, handleType)
      })
    },

    // 复制按钮
    CopyHandle: _.debounce(
      async function CopyHandle (id) {
        this.$refs.prodCopy.init(id)
      }, 1000, {
        leading: true,
        trailing: false
      }
    ),
    prodCopySubmit ({ id, copyType }) {
      this.$http({
        url: this.$http.adornUrl(`prod/prodbasic/copy/${id}/${copyType}`),
        method: 'get'
      }).then(({ data }) => {
        if (data && data.code === 0) {
          this.dataForm = data
          this.dataForm.basicCustomsEntity = data.prodBasicEntity

          this.prodTabVisible = true
          this.$nextTick(() => {
            this.$refs.prodTab.init('', 'copy', this.dataForm, copyType)
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
    // 产品导入
    ImportHandle () {
      this.xlsImportVisible = true
      this.$nextTick(() => {
        this.$refs.xlsImport.init({
          templateUrl: 'basicData/exportModel?fileName=prodbasic.xlsx',
          importUrl: 'prod/prodbasic/import',
          uploadFailUrl: 'prod/prodbasic/downloadFailed'
        })
      })
    },

    // 产品导出
    exportHandle (url) {
      this.$nextTick(() => {
        this.$refs.xlsExport.init({
          exportUrl: 'prod/prodbasic/export',
          searchData: this.searchData
        })
      })
    },

    // 组合sku导入
    skuImportHandle () {
      this.xlsImportVisible = true
      this.$nextTick(() => {
        this.$refs.xlsImport.init({
          templateUrl: 'basicData/exportModel?fileName=proditems.xlsx',
          importUrl: 'prod/prodbasic/importItems',
          uploadFailUrl: 'prod/prodbasic/downloadItemsFailed',
          isDisabled: true
        })
      })
    },

    // 组合sku导出
    skuexportHandle (url) {
      this.$nextTick(() => {
        this.$refs.xlsExport.init({
          exportUrl: 'prod/prodbasic/exportItems',
          searchData: this.searchData
        })
      })
    },

    // 多选
    selectionChangeHandle (val) {
      this.dataListSelections = val
    },

    // 删除
    deleteHandle (id) {
      var ids = id
        ? [id]
        : this.dataListSelections.map(item => {
          return item.id
        })
      this.$confirm(
        `确定要${id ? '删除' : '批量删除'}所选择的产品信息吗？`,
        '提示',
        {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }
      ).then(() => {
        this.$http({
          url: this.$http.adornUrl('prod/prodbasic/delete'),
          method: 'delete',
          data: this.$http.adornData(ids, false)
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