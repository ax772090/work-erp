 <!-- 初始库存 -->
<template>
  <div>
    <el-row @keyup.enter.native="getDataList()">
      <erp-search-panel v-model="searchData"
                        :searchOptions="searchOptions"
                        @search="getDataList(1)" />
    </el-row>
    <el-row>
      <el-button type="primary"
                 v-if="isAuth('warehouse:whinitinventory:confirminitinventory')"
                 :disabled="isAffirmInitial"
                 @click="affirmInitial()">确认初始库存</el-button>
      <el-button type="primary"
                 v-if="isAuth('warehouse:whoutstock:revoke')"
                 :disabled="isRepealInitial"
                 @click="repealInitial()">撤销确认</el-button>
      <el-button type="primary"
                 v-if="isAuth('warehouse:whinitinventory:completeinit')"
                 @click="finishInitial()">完成库存初始化</el-button>
      <el-button type="danger"
                 v-if="isAuth('warehouse:whinitinventory:delete')"
                 :disabled="isRemoveInitial"
                 @click="removeInitial()"><i class="iconfont erp-icon-shanchu"></i>删除</el-button>
    </el-row>
    <el-row>
      <el-button v-if="isAuth('warehouse:whinitinventory:import')"
                 type="primary"
                 @click="ImportFile()"><i class="iconfont erp-icon-daoru"></i>导入</el-button>
      <el-button v-if="isAuth('warehouse:whinitinventory:export')"
                 type="primary"
                 @click="exportFile()"><i class="iconfont erp-icon-daochu"></i>导出</el-button>
    </el-row>
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
                       label="库存公司"></el-table-column>
      <el-table-column prop="warehouseName"
                       label="仓库"></el-table-column>
      <el-table-column prop="dictBizStatusName"
                       label="业务状态"></el-table-column>
      <el-table-column prop="bInit"
                       label="是否完成初始化">
        <template slot-scope="scope">
          <el-tag v-if="scope.row.bInit === true"
                  type="success">是</el-tag>
          <el-tag v-if="scope.row.bInit === false"
                  type="danger">否</el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="addUserName"
                       label="创建人"></el-table-column>
      <el-table-column prop="addTime"
                       sortable
                       label="创建时间"></el-table-column>
      <el-table-column prop="confirmUserName"
                       label="确认人"></el-table-column>
      <el-table-column prop="confirmTime"
                       sortable
                       label="确认时间"></el-table-column>
      <el-table-column fixed="right"
                       width="80"
                       label="操作">
        <template slot-scope="scope">
          <el-button type="primary"
                     title="查看"
                     circle
                     @click="addOrUpdateHandle(scope.row.id,'canCheck')">
            <i class="iconfont erp-icon-chakan"></i>
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-row>
      <pagination-all v-model="paginationData"
                      @paginationChangeHandle="getDataList"></pagination-all>
    </el-row>
    <initialCheck ref="initialCheck"
                  @refreshDataList="getDataList"></initialCheck>
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
// 查看
import initialCheck from './initial-check'
import xlsImport from '@/components/xls-import/index'
import { initData } from '@/mixins/initData.js'
// 导出弹窗
import xlsExport from '@/components/xls-export/index'
export default {
  mixins: [initData],
  components: {
    erpSearchPanel,
    paginationAll,
    initialCheck,
    xlsImport,
    xlsExport
  },
  data () {
    return {
      dataForm: {},
      // 数据过滤器
      searchData: {},
      // 下拉
      searchOptions: [
        {
          label: '仓库',
          value: 'warehouseId',
          inputType: 'el-select',

          httpUrl: 'list/combobox/warehouse',
          dataSource: 'list',
          title: 'warehouseIdList',
          dataValue: 'id',
          dataLabel: 'name',
          placeholder: '仓库'
        },
        {
          label: '业务状态',
          value: 'dictBizStatus',
          inputType: 'el-select',

          httpUrl: 'basicData/queryDataDict2List',
          requestParams: { dataDictKey: 'BIZ_STATUS' },
          dataSource: 'fontMaps',
          title: 'dictBizStatus',
          dataValue: 'key',
          dataLabel: 'value',
          placeholder: '业务状态'
        },
        {
          label: '库存公司',
          value: 'compId',
          inputType: 'el-select',

          httpUrl: 'sys/organization/select',
          dataSource: 'companyList',
          title: 'compIdList',
          dataValue: 'orgId',
          dataLabel: 'name',
          placeholder: '库存公司'
        }
      ],

      dataList: [],

      dataListLoading: false,
      dataListSelections: [],
      isAffirmInitial: true,
      isRepealInitial: true,
      isRemoveInitial: true
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
        url: this.$http.adornUrl('warehouse/whinitinventory/list'),
        method: 'get',
        params: Object.assign(
          {},
          this.paginationData,
          this.searchData === undefined ? {} : this.searchData
        )
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
      if (!(this.dataListSelections.length > 0)) {
        this.isAffirmInitial = true
        this.isRepealInitial = true
        // this.isFinishInitial = true
        this.isRemoveInitial = true
        return
      } else {
        this.isAffirmInitial = false
        this.isRepealInitial = false
        // this.isFinishInitial = false
        this.isRemoveInitial = false
      }
      for (var i = 0; i < this.dataListSelections.length; i++) {
        // 确认初始库存
        if (
          !(
            this.dataListSelections[i].dictBizStatusName === '待确认' &&
            this.dataListSelections[i].bInit === false
          )
        ) {
          this.isAffirmInitial = true
        }
        // 撤销确认
        if (
          !(
            this.dataListSelections[i].dictBizStatusName === '已确认' &&
            this.dataListSelections[i].bInit === false
          )
        ) {
          this.isRepealInitial = true
        }
        // 删除
        if (
          !(
            this.dataListSelections[i].dictBizStatusName === '待确认' &&
            this.dataListSelections[i].bInit === false
          )
        ) {
          this.isRemoveInitial = true
        }
      }
    },
    // 新增,修改,查看
    addOrUpdateHandle (id, type) {
      this.$nextTick(() => {
        this.$refs.initialCheck.init(id, type)
      })
    },
    // 确认初始库存
    affirmInitial: _.debounce(
      async function affirmInitial (id) {
        var ids = id
          ? [id]
          : this.dataListSelections.map(item => {
            return item.id
          })
        this.$http({
          url: this.$http.adornUrl(
            'warehouse/whinitinventory/confirminitinventory'
          ),
          method: 'post',
          data: ids
        }).then(({ data }) => {
          if (data && data.code === 0) {
            this.getDataList()
            this.$notify.success({
              title: '成功',
              message: '确认初始库存成功',
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

    // 撤销确认
    repealInitial: _.debounce(
      async function repealInitial (id) {
        var ids = id
          ? [id]
          : this.dataListSelections.map(item => {
            return item.id
          })
        this.$http({
          url: this.$http.adornUrl('warehouse/whinitinventory/revoke'),
          method: 'post',
          data: ids
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

    // 完成库存初始化
    finishInitial: _.debounce(
      async function finishInitial () {
        this.$http({
          url: this.$http.adornUrl('warehouse/whinitinventory/completeinit'),
          method: 'post'
          // data: ids
        }).then(({ data }) => {
          if (data && data.code === 0) {
            this.getDataList()
            this.$notify.success({
              title: '成功',
              message: '完成库存初始化成功',
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

    // 删除
    removeInitial: _.debounce(
      async function removeInitial (id) {
        var ids = id
          ? [id]
          : this.dataListSelections.map(item => {
            return item.id
          })
        this.$http({
          url: this.$http.adornUrl('warehouse/whinitinventory/delete'),
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
      },
      1000,
      {
        leading: true,
        trailing: false
      }
    ),

    // 导入
    ImportFile () {
      this.$nextTick(() => {
        this.$refs.xlsImport.init({
          templateUrl: 'basicData/exportModel?fileName=whInitInventory.xlsx',
          importUrl: 'warehouse/whinitinventory/import',
          uploadFailUrl: 'warehouse/whinitinventory/downloadFailed'
        })
      })
    },

    // 导出
    exportFile (id) {
      this.$nextTick(() => {
        this.$refs.xlsExport.init({
          exportUrl: 'warehouse/whinitinventory/export',
          searchData: this.searchData
        })
      })
    }
  }
}
</script>