<template>
  <el-dialog width="60%"
             :title="!dataForm.id ? '新增' : '修改'"
             :close-on-click-modal="false"
             :visible.sync="innervisible"
             v-if="innervisible"
             append-to-body>
    <el-form :model="dataForm"
             ref="dataForm"
             @keyup.enter.native="getDataList()"
             label-width="110px">
      <el-row>
        <erp-search-panel v-model="searchData"
                          :searchOptions="searchOptions"
                          @search="getDataList(1)" />
      </el-row>
      <el-row>
        <div class="grid-content">
          <el-button type="primary"
                     @click="selectAdd()"><i class="iconfont el-icon--left el-icon-erp-numpickerplus"></i>批量添加</el-button>
        </div>
      </el-row>
    </el-form>
    <el-row>
      <el-table :data="dataList"
                ref='table'
                border
                max-height="450"
                v-loading="dataListLoading"
                @selection-change="selectionChangeHandle">
        <el-table-column type="selection"
                         header-align="center"
                         align="center"
                         width="50"></el-table-column>
        <el-table-column prop="prodCode"
                         header-align="center"
                         align="center"
                         label="自定义SKU"></el-table-column>
        <el-table-column prop="nameCh"
                         header-align="center"
                         align="center"
                         label="产品名称"></el-table-column>
        <el-table-column prop="imageUrl"
                         header-align="center"
                         align="center"
                         label="产品图片">
          <template slot-scope="scope">
            <tableImg :imageUrl='scope.row.imageUrl'></tableImg>

          </template>
        </el-table-column>
      </el-table>
    </el-row>
    <el-row>
      <pagination-all v-model="paginationData"
                      @paginationChangeHandle='getDataList'></pagination-all>
    </el-row>
    <span slot="footer"
          class="dialog-footer">
      <el-button @click="innervisible = false"><i class="iconfont erp-icon-quxiao"></i>取消</el-button>
      <el-button type="primary"
                 @click="selectAdd()"><i class="iconfont erp-icon-queding"></i>确定</el-button>
    </span>
  </el-dialog>
</template>
<script>
// 搜索
import erpSearchPanel from '@/components/erp-search-panel'
// 分页
import paginationAll from '@/components/erp-pagination/pagination-all'
import { initData } from '@/mixins/initData.js'
// 引入图片
import tableImg from '@/components/list-table/table-img'
export default {
  mixins: [
    initData
  ],
  name: 'proddevitemsbrowser',
  components: {
    erpSearchPanel,
    paginationAll,
    tableImg
  },
  data () {
    return {
      innervisible: false,
      // 数据过滤器
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
        // {
        //   label: '产品分类',
        //   value: 'categoryId',
        //   inputType: 'el-select',

        //   httpUrl: '/basic/basiccategory/listcombobox',
        //   dataSource: 'list',
        //   title: 'categoryList',
        //   dataValue: 'id',
        //   dataLabel: 'name',
        //   placeholder: '所属分类'
        // },
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

      // 父传来的数据,当修改时不能添加相同数据等校验
      childrenData: [],
      dataListSelections: [],
      dataList: [],
      dataForm: {
        id: ''
      },
      dataListLoading: false
    }
  },
  methods: {
    init (id, childrenData) {
      this.dataForm.id = id
      this.childrenData = childrenData
      this.innervisible = true
      this.$nextTick(() => {
        this.getDataList()
      })
    },

    // 获取数据列表
    getDataList (val) {
      if (val) {
        this.paginationData.currPage = val
      }
      this.dataListLoading = true
      this.$http({
        url: this.$http.adornUrl('prod/prodbasic/list'),
        method: 'post',
        data: Object.assign({}, this.paginationData, this.searchData === undefined ? {} : this.searchData)
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

    // 当点击多选时
    selectionChangeHandle (selection) {
      this.dataListSelections = selection
    },

    // 确定
    selectAdd () {
      var mapData = []
      if (this.dataListSelections.length > 0) {
        mapData = this.dataListSelections.map(item => {
          return {
            subProdId: item.id,
            usedQty: item.usedQty,
            prodId: this.dataForm.id,
            remarks: item.remarks,
            prodCode: item.prodCode,
            nameCh: item.nameCh,
            imageUrl: item.imageUrl,
            unitName: item.unitName
          }
        })
      }
      this.$emit('selectAddArr', mapData)
      this.innervisible = false
    }
  }
}
</script>
