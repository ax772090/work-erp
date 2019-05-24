<template>
  <el-dialog title="选择采购订单信息"
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
        取消
      </el-button>
      <el-button type="primary"
                 @click="addList()">
        <i class="iconfont erp-icon-queding"></i>
        确定
      </el-button>
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
        label: '采购合同号',
        value: 'contractCode',
        inputType: 'el-input'
      }, {
        label: '采购订单号',
        value: 'poCode',
        inputType: 'el-input'
      }, {
        label: '产品编码',
        value: 'prodCode',
        inputType: 'el-input'
      }],
      dataTable: {
        dataListLoading: false, // 加载中动画
        stripe: true, // 创建带斑马纹的表格
        border: true,
        hasSelect: true, // 有无复选框选中功能
        maxHeight: '500',
        tr: [{
          label: '采购订单',
          prop: 'poCode',
          width: '150px'
          // show: 'template' // show有三种值：false隐藏当前列，true常规表格列，template自定义表格列
        }, {
          label: '采购合同号',
          prop: 'contractCode',
          width: '120px',
          show: true
        }, {
          label: '采购日期',
          prop: 'purDate',
          minWidth: '80px',
          show: true
        }, {
          label: '产品编码',
          prop: 'prodCode',
          width: '150px',
          show: true
        }, {
          label: '产品名称',
          prop: 'prodName',
          width: '',
          show: true
        }, {
          label: '规格型号',
          prop: 'specifications',
          width: '70px'
          // show: 'template' // show有三种值：false隐藏当前列，true常规表格列，template自定义表格列
        }, {
          label: '数量',
          prop: 'qty',
          width: '50px',
          show: true
        }, {
          label: '单价',
          prop: 'price',
          width: '100px',
          show: true
        }, {
          label: '总金额',
          prop: 'baseTotalAmount',
          width: '100px',
          show: true
        }],
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
      console.log('123', parentList)
      if (parentList && parentList.length > 0) {
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
        url: this.$http.adornUrl('fin/finpopayable/getpayableinfo'),
        method: 'post',
        data: Object.assign({}, this.paginationData, this.searchData === undefined ? {} : this.searchData, this.filter)
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
        if (this.dataListSelections && this.dataListSelections.length > 0) {
          this.$emit('addDetailsList', this.dataListSelections)
          this.visible = false
        } else {
          this.$notify.error({
            title: '提示',
            message: '至少选择一项',
            duration: 5000
          })
        }
      }, 1000, {
        leading: true,
        trailing: false
      })
  }
}
</script>