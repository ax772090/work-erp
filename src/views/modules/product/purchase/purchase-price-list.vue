 <!-- 采购价目表 -->
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
                   v-if="isAuth('prod:prodpurchase:save')"
                   @click="addOrUpdateHandle('','canAdd')">
          <i class="iconfont erp-icon-xinzeng"></i>新 增
        </el-button>
        <el-button type="primary"
                   v-if="isAuth('prod:prodpurchase:import')"
                   @click="excelImport()"><i class="iconfont erp-icon-daoru"></i>导入</el-button>
        <el-button type="primary"
                   v-if="isAuth('prod:prodpurchase:export')"
                   @click="excelExport()"><i class="iconfont erp-icon-daochu"></i>导出</el-button>
        <el-button type="primary"
                   @click="activeOrDis(status=false)"
                   v-if="isAuth('prod:prodpurchase:activeOrDis')"
                   :disabled="stopUsed">
          <i class="iconfont erp-icon-jinyong"></i>禁用
        </el-button>
        <el-button type="primary"
                   @click="activeOrDis(status=true)"
                   v-if="isAuth('prod:prodpurchase:activeOrDis')"
                   :disabled="startUsed">
          <i class="iconfont erp-icon-qiyong"></i>启用
        </el-button>
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
      <el-table-column prop="supplierName"
                       label="供应商"></el-table-column>
      <el-table-column prop="compName"
                       label="采购公司"></el-table-column>
      <el-table-column prop="bFirstChoice"
                       width="80"
                       label="是否首选">
        <template slot-scope="scope">
          <el-tag v-if="scope.row.bFirstChoice == false"
                  type="danger">否</el-tag>
          <el-tag v-else>是</el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="prodCode"
                       width="160"
                       label="产品编码"></el-table-column>
      <el-table-column prop="prodName"
                       label="产品名称"></el-table-column>
      <el-table-column prop="specifications"
                       width="100"
                       label="规格型号"></el-table-column>
      <el-table-column prop="unitName"
                       width="80"
                       label="单位"></el-table-column>
      <el-table-column prop="bIncludeTax"
                       width="80"
                       label="是否含税">
        <template slot-scope="scope">
          <el-tag v-if="scope.row.bIncludeTax == false "
                  type="danger">否</el-tag>
          <el-tag v-else>是</el-tag>
        </template></el-table-column>
      <el-table-column prop="taxRate"
                       sortable
                       width="80"
                       label="税率"></el-table-column>
      <el-table-column prop="price"
                       sortable
                       width="80"
                       label="单价"></el-table-column>
      <el-table-column prop="effectiveDate"
                       sortable
                       width="130"
                       label="生效日期"></el-table-column>
      <el-table-column prop="expirationDate"
                       sortable
                       width="130"
                       label="失效日期"></el-table-column>
      <el-table-column prop="bUsed"
                       width="80"
                       label="是否使用">
        <template slot-scope="scope">
          <el-tag v-if="scope.row.bUsed == false"
                  type="danger">禁用</el-tag>
          <el-tag v-else>正常</el-tag>
        </template>
      </el-table-column>
      <el-table-column fixed="right"
                       width="80"
                       label="操作">
        <template slot-scope="scope">
          <el-button type="primary"
                     circle
                     size="small"
                     title="编辑"
                     v-if="isAuth('prod:prodpurchase:update')"
                     @click="addOrUpdateHandle(scope.row.id,'canEdit')">
            <i class="iconfont erp-icon-bianji"></i></el-button>
          <el-button type="danger"
                     circle
                     size="small"
                     title="删除"
                     v-if="isAuth('prod:prodpurchase:delete')"
                     @click="deleteHandle(scope.row.id)">
            <i class="iconfont erp-icon-shanchu"></i></el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-row>
      <pagination-all v-model="paginationData"
                      @paginationChangeHandle="getDataList"></pagination-all>
    </el-row>
    <!-- 弹窗, 新增 / 修改 -->
    <add-or-update v-if="addOrUpdateVisible"
                   ref="addOrUpdate"
                   @refreshDataList="getDataList(1)"></add-or-update>
    <xlsImport ref="xlsImport"
               title="导入"
               @refreshDataList="getDataList"></xlsImport>
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
import AddOrUpdate from './purchase-add-or-update'
// 导入
import xlsImport from '@/components/xls-import/index'
// 导出弹窗
import xlsExport from '@/components/xls-export/index'
import { initData } from '@/mixins/initData.js'
export default {
  mixins: [initData],
  components: {
    erpSearchPanel,
    paginationAll,
    AddOrUpdate,
    xlsImport,
    xlsExport
  },
  data () {
    return {
      stopUsed: true,
      startUsed: true,
      // 数据过滤器
      searchData: {},
      // 下拉
      searchOptions: [
        {
          label: '供应商',
          value: 'supplierId',
          inputType: 'el-select-remote',
          httpUrl: 'basic/basicsupplier/list-used?b_used=true',
          queryKey: 'name',
          dataSource: 'list',
          title: 'supplierId',
          dataValue: 'id',
          dataLabel: 'name'
        },
        {
          label: '采购公司',
          value: 'compId',
          inputType: 'el-select',
          httpUrl: 'list/combobox/company',
          dataSource: 'list',
          title: 'compId',
          dataValue: 'id',
          dataLabel: 'name'
        },
        {
          label: '产品编码',
          value: 'prodCode',
          inputType: 'el-input'
        },
        {
          label: '产品名称',
          value: 'prodName',
          inputType: 'el-input'
        },
        {
          label: '是否使用',
          value: 'bUsed',
          inputType: 'el-select',

          dataList: [{ id: '1', name: '是' }, { id: '0', name: '否' }],
          dataValue: 'id',
          dataLabel: 'name'
        },
        {
          label: '是否含税',
          value: 'bIncludeTax',
          inputType: 'el-select',

          dataList: [{ id: '1', name: '是' }, { id: '0', name: '否' }],
          dataValue: 'id',
          dataLabel: 'name'
        }
      ],

      dataForm: {},
      dataList: [],

      dataListLoading: false,
      dataListSelections: [],
      // 新增组件
      addOrUpdateVisible: false
    }
  },

  created () {
    this.getDataList()
  },
  methods: {
    // 禁用功能
    activeOrDis: _.debounce(
      async function activeOrDis (status) {
        let ListSelects = []
        for (let i = 0; i < this.dataListSelections.length; i++) {
          ListSelects.push(this.dataListSelections[i].id)
        }
        this.$http({
          url: this.$http.adornUrl('prod/prodpurchase/activeOrDis'),
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

    // 获取数据列表
    getDataList (num) {
      if (num) {
        this.paginationData.currPage = num
      }
      this.dataListLoading = true
      this.$http({
        url: this.$http.adornUrl('prod/prodpurchase/list'),
        method: 'post',
        data:
          this.searchData === undefined
            ? this.paginationData
            : Object.assign({}, this.paginationData, { bUsed: '1' }, this.searchData)
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
        this.stopUsed = true
        this.startUsed = true
        return
      }
      let isStartUsed = this.dataListSelections.every((item) => {
        return item.bUsed == true
      })
      let isStopUsed = this.dataListSelections.every((item) => {
        return item.bUsed == false
      })
      if (isStartUsed) {
        this.stopUsed = false
      } else if (isStopUsed) {
        this.startUsed = false
      } else {
        this.stopUsed = true
        this.startUsed = true
      }
      // this.stopUsed = !isStopUsed
      // this.startUsed = !isStartUsed
    },

    // 新增 / 修改
    addOrUpdateHandle (id, type) {
      this.addOrUpdateVisible = true
      this.$nextTick(() => {
        this.$refs.addOrUpdate.init(id, type)
      })
    },

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
          url: this.$http.adornUrl('prod/prodpurchase/delete'),
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
    },
    // 导入
    excelImport () {
      this.$nextTick(() => {
        this.$refs.xlsImport.init({
          templateUrl: 'basicData/exportModel?fileName=prodpurchase.xlsx',
          importUrl: 'prod/prodpurchase/import',
          uploadFailUrl: 'prod/prodpurchase/downloadFailed',
          isDisabled: true
        })
      })
    },

    // 导出
    excelExport () {
      this.$nextTick(() => {
        this.$refs.xlsExport.init({
          exportUrl: 'prod/prodpurchase/export',
          searchData: Object.assign({}, { bUsed: '1' }, this.searchData)
        })
      })
      // window.open(
      //   this.$http.tokens("prod/prodchannelsku/export", this.searchData)
      // );
    }
  }
}
</script>
