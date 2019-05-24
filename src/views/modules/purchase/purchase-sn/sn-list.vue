<!-- 采购入库（主表） -->
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
        <el-button type="primary"
                   v-if="isAuth('pur:posncode:export')"
                   :disabled="this.dataList.length <= 0"
                   @click="Export()"><i class="iconfont erp-icon-daochu"></i>导出</el-button>
      </el-row>
    </el-form>

    <el-table stripe
              border
              highlight-current-row
              :data="dataList"
              max-height="800">
      <el-table-column label="SN码"
                       prop="snCode"
                       width="220"
                       id="table"
                       sortable>
      </el-table-column>
      <el-table-column label="产品编码"
                       width="170"
                       prop="prodCode"
                       sortable></el-table-column>
      <el-table-column label="产品名称"
                       prop="prodName"></el-table-column>
      <el-table-column label="供应商"
                       prop="supplierName"></el-table-column>
      <el-table-column label="批次数量"
                       prop="qty"
                       width="100"
                       sortable></el-table-column>
      <el-table-column label="登记人"
                       width="140"
                       prop="addUserName"></el-table-column>
      <el-table-column label="采购订单号"
                       prop="poCode"
                       width="180"
                       sortable></el-table-column>
      <el-table-column fixed="right"
                       width="80"
                       label="操作">
        <template slot-scope="scope">
          <el-button v-if="isAuth('pur:posncode:delete')"
                     type="danger"
                     size="small"
                     circle
                     title="删除"
                     @click="deleteSN(scope.row.id)">
            <i class="iconfont erp-icon-shanchu"></i>
          </el-button>
        </template>

      </el-table-column>
    </el-table>
    <!-- 分页 -->
    <el-row>
      <pagination-all v-model="paginationData"
                      @paginationChangeHandle="getDataList"></pagination-all>
    </el-row>
  </div>
</template>
<script>
// 搜索
import erpSearchPanel from '@/components/erp-search-panel'
// 分页
import paginationAll from '@/components/erp-pagination/pagination-all'
import { initData } from '@/mixins/initData.js'

export default {
  mixins: [initData],
  components: {
    erpSearchPanel,
    paginationAll
  },
  data () {
    return {
      isShow: true,
      searchData: {},
      dateValue: '', // 时间
      // 下拉
      searchOptions: [
        {
          label: 'SN码',
          value: 'snCode',
          inputType: 'el-input'
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
        },
        {
          label: '采购订单号',
          value: 'poCode',
          inputType: 'el-input'
        }
      ],
      // 是否禁用
      searchTF: true,
      // 时间过滤
      expectDate: '',
      // 发送批量禁用启用的数据
      searchTFs: {},
      dataForm: {
      },
      tableDataExpand: [], // 展开行
      dataList: [],
      dataListLoading: false,
      dataListSelections: [],
      editorVisible: false
    }
  },

  created () {
    this.getDataList()
  },
  methods: {
    // 编辑
    addOrEditProductDev (id, status) {
      this.$nextTick(() => {
        this.$refs.storageEditor.init(id)
      })
      this.editorVisible = true
    },
    handleCommand (command) {
      // this.$message("click on item " + command);
    },
    // 获取数据列表
    getDataList (val) {
      if (val) {
        this.paginationData.currPage = val
      }
      this.dataListLoading = true
      this.$http({
        url: this.$http.adornUrl('pur/posncode/list'),
        method: 'get',
        params:
          this.searchData == undefined
            ? this.paginationData
            : Object.assign({}, this.paginationData, this.searchData)
      }).then(({ data }) => {
        if (data && data.code === 0) {
          this.dataList = data.pageList.dataList
          this.paginationData.totalCount = data.pageList.page.totalCount
          // 初始化，防止点击展开行立马收缩起来
          for (let i = 0; i < this.dataList.length; i++) {
            this.$set(this.dataList[i], 'tableDataExpand', [])
          }
        } else {
          this.paginationData.totalCount = 0
        }
        this.dataListLoading = false
      })
    },

    resetHandle () {
      this.dateValue = ''
    },

    // 删除当前行
    deleteSN (id) {
      var ids = id
        ? [id]
        : this.dataListSelections.map(item => {
          return item.id
        })
      this.$confirm('确认要删除此行吗？', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$http({
          url: this.$http.adornUrl('pur/posncode/delete'),
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

    // 导出
    Export () {
      let SearchObj = Object.assign({}, this.searchObj)
      window.open(
        this.$http.tokens(
          'pur/posncode/export',
          SearchObj
        )
      )
    }
  }
}
</script>
