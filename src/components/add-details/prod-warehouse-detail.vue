<template>
  <el-dialog title="选择产品及仓库库存"
             :close-on-click-modal="false"
             :visible.sync="visible"
             @close="$refs['dataForm'].resetFields()"
             :append-to-body="true"
             width="60%">
    <el-form :inline="true"
             :model="dataForm"
             ref="dataForm"
             @keyup.enter.native="getDataList()">
      <el-row>
        <erp-search-panel v-model="searchData"
                          :searchOptions="searchOptions"
                          @search="getDataList(1)" />
      </el-row>
      <!-- 表格组件 -->
      <erp-table :table="dataTable"
                 @onHandleSelectionChange="selectionChangeHandle">
        <template slot-scope="scope"
                  slot="imageUrl">
          <el-popover v-if="scope.obj.row.imageUrl"
                      placement="right"
                      trigger="click">
            <img :src="$http.adornUrl(scope.obj.row.imageUrl)"
                 class="imglistPopover"
                 alt="产品图片">
            <img :src="$http.adornUrl(scope.obj.row.imageUrl)"
                 slot="reference"
                 class="imglist"
                 alt="产品图片">
          </el-popover>
          <el-tag v-else
                  type="danger"
                  size="small">未上传</el-tag>
        </template>
      </erp-table>
    </el-form>
    <!-- 分页 -->
    <el-row>
      <pagination-all v-model="paginationData"
                      @paginationChangeHandle="getDataList"></pagination-all>
    </el-row>
    <span slot="footer"
          class="dialog-footer">
      <el-button @click="visible = false">
        <i class="iconfont erp-icon-quxiao"></i>
        取消</el-button>
      <el-button type="primary"
                 @click="addList()"
                 :disabled="dataListSelections.length <= 0">
        <i class="iconfont erp-icon-queding"></i>确定</el-button>
    </span>
  </el-dialog>
</template>
<script>
// 搜索
import erpSearchPanel from '@/components/erp-search-panel'
// 分页
import paginationAll from '@/components/erp-pagination/pagination-all'
// 表格
import erpTable from '@/components/erp-table/table-usually'
import { initData } from '@/mixins/initData.js'
export default {
  mixins: [
    initData
  ],
  components: {
    erpSearchPanel,
    paginationAll,
    erpTable
  },
  data () {
    return {
      visible: false,
      // 数据过滤器
      searchData: {},
      // 下拉
      searchOptions: [{
        label: '产品名称',
        value: 'prodName',
        inputType: 'el-input'
      }, {
        label: '产品编码',
        value: 'prodCode',
        inputType: 'el-input'
      },
      {
          label: '规格型号',
          value: 'specifications',
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
        }
      ],
      dataTable: {
        dataListLoading: false, // 加载中动画
        stripe: true, // 创建带斑马纹的表格
        border: true,
        hasSelect: true, // 有无复选框选中功能
        maxHeight: '500',
        tr: [
          // 表头数据 —— className:列的class名
          {
            label: '产品图片',
            prop: 'imageUrl',
            show: 'template' // show有三种值：false隐藏当前列，true常规表格列，template自定义表格列
          },
          {
            label: '产品编码',
            prop: 'prodCode',
            show: true
          },
          {
            label: '产品名称',
            prop: 'prodName',
            show: true
          },
          {
            label: '规格型号',
            prop: 'specifications',
            show: true
          },
          {
            label: '品牌',
            prop: 'brandName',
            show: true
          },
          {
            label: '产品分类',
            prop: 'categoryName',
            show: true
          },
          {
            label: '仓库',
            prop: 'warehouseName',
            show: true
          },
          {
            label: '库存状态',
            prop: 'statusName',
            show: true
          },
          {
            label: '库存数量',
            prop: 'qty',
            show: true
          }

        ],
        data: [] // 表格数据
      },
      dataForm: {},
      // 原有的数据
      parentData: [],
      // 当前组件数据
      dataList: [],
      dataListSelections: []
    }
  },
  methods: {
    init (id, parentList, filter) {
      this.searchData = {}
      if (parentList.length > 0) {
        this.parentData = parentList
      }
      this.filter = filter || {}
      this.visible = true

      this.getDataList(1)
    },

    // 获取数据列表
    getDataList (num) {
      if (num) {
        this.paginationData.currPage = num
      }
      this.dataTable.dataListLoading = true
      this.$http({
        url: this.$http.adornUrl(`warehouse/whreturnpo/whprodList`),
        method: 'get',
        params: Object.assign({}, this.paginationData, this.searchData === undefined ? {} : this.searchData, this.filter)
      }).then(({ data }) => {
        if (data && data.code === 0) {
          this.dataTable.data = data.pageList.dataList
          this.paginationData = data.pageList.page
        } else {
          this.dataTable.data = []
          this.paginationData = 0
        }
        this.dataTable.dataListLoading = false
      })
    },

    // 当点击多选时
    selectionChangeHandle (selection) {
      this.dataListSelections = selection
    },

    // 确定新增
    addList: _.debounce(
      async function addList () {
        if (this.dataListSelections.length > 0) {
          this.$emit('addDetailsList', this.dataListSelections)
          this.visible = false
        }
      }, 1000, {
        leading: true,
        trailing: false
      })
  }
}
</script>