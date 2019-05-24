<!-- 采购入库单(内部交易)（主表） -->
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
    </el-form>
    <el-table :data="dataList"
              max-height="800"
              stripe
              border
              highlight-current-row
              v-loading="dataListLoading">
      <el-table-column prop="code"
                       sortable
                       width="160"
                       label="入库单号">
        <template slot-scope="scope">
          <a @click="search(scope.row.id,'canCheck')"
             class="a-click-hover">
            {{scope.row.code}}
          </a>
        </template>
      </el-table-column>
      <el-table-column prop="date"
                       label="入库日期"
                       width="140"
                       sortable>
      </el-table-column>
      <el-table-column prop="url"
                       width="130"
                       label="产品图片">
        <template slot-scope="scope">
          <tableImg :imageUrl='scope.row.url'></tableImg>
        </template>
      </el-table-column>
      <el-table-column prop="prodName"
                       label="产品名称">
      </el-table-column>
      <el-table-column prop="whName"
                       width="160"
                       label="仓库">
      </el-table-column>
      <el-table-column prop="qty"
                       width="130"
                       label="入库数量"
                       sortable>
      </el-table-column>
      <el-table-column prop="updName"
                       width="150"
                       label="创建人">
      </el-table-column>
      <el-table-column prop="updTime"
                       width="200"
                       label="创建时间"
                       sortable>
      </el-table-column>
    </el-table>
    <!-- 分页 -->
    <el-row>
      <pagination-all v-model="paginationData"
                      @paginationChangeHandle='getDataList'></pagination-all>
    </el-row>
    <!-- 弹窗, 新增 / 修改 -->
    <search ref="search"
            @refreshDataList="getDataList"></search>
  </div>
</template>
<script>
// 搜索
import erpSearchPanel from '@/components/erp-search-panel'
// 分页
import paginationAll from '@/components/erp-pagination/pagination-all'
import search from './search'
import { initData } from '@/mixins/initData.js'
// 引入图片
import tableImg from '@/components/list-table/table-img'
export default {
  mixins: [
    initData
  ],
  components: {
    erpSearchPanel,
    paginationAll,
    search,
    tableImg
  },
  data () {
    return {
      isShow: true,
      searchData: {},
      // 下拉
      searchOptions: [
        {
          label: '入库单号',
          value: 'inCode',
          inputType: 'el-input'
        },
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
          label: '产品名称',
          value: 'prodName',
          inputType: 'el-input'
        },
        {
          label: '产品编码',
          value: 'prodCode',
          inputType: 'el-input'
        },
        {
          label: '入库日期',
          value: 'dateRange',
          inputType: 'el-daterangeArr'
        },
        {
          label: '调拨单号',
          value: 'remark',
          inputType: 'el-input'
        }
      ],
      // 是否禁用
      searchTF: true,
      // 发送批量禁用启用的数据
      searchTFs: {},
      dataForm: {},
      dataList: [],
      dateValue: '', // 时间
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
    // 获取数据列表
    getDataList (val) {
      if (val) {
        this.paginationData.currPage = val
      }
      this.dataListLoading = true
      this.$http({
        url: this.$http.adornUrl('warehouse/whinstockpo/innerList'),
        method: 'post',
        data:
          this.searchData == undefined
            ? this.paginationData
            : Object.assign({}, this.paginationData, this.searchData)
      }).then(({ data }) => {
        if (data && data.code === 0) {
          this.dataList = data.pageList.dataList
          this.paginationData.totalCount = data.pageList.page.totalCount
        } else {
          // this.dataList = [];
          this.paginationData.totalCount = 0
        }
        this.dataListLoading = false
      })
    },

    // 选择日期进行搜索
    getResult () {
      if (this.dateValue) {
        this.$http({
          url: this.$http.adornUrl('warehouse/whinstockpo/innerList'),
          method: 'get',
          params: Object.assign({}, this.paginationData, {
            planDate: this.dateValue[0],
            planDateEnd: this.dateValue[1]
          })
        }).then(({ data }) => {
          if (data && data.code === 0) {
            this.$notify({
              title: '提示',
              message: '操作成功',
              type: 'success',
              duration: 1500
            })
            this.dataList = data.pageList.dataList
            this.paginationData.totalCount = data.pageList.page.totalCount
          } else {
            this.$notify.error({
              title: '错误',
              message: data.msg,
              duration: 5000
            })
          }
        })
      }
    },
    // 采购入库单查看
    search (id, type) {
      this.editorVisible = true
      this.$nextTick(() => {
        this.$refs.search.init(id, type)
      })
    }
  }
}
</script>


