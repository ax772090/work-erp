<template>
  <el-dialog title="付款来源选择"
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
                 @click="addList()"
                 :disabled="dataListSelections.length <= 0">
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
      searchOptions: [
        {
          label: '单据类型',
          value: 'docType',
          inputType: 'el-select',

          httpUrl: 'basicData/queryDataDict2List',
          requestParams: { dataDictKey: 'PAYABLE_TYPE' },
          dataSource: 'fontMaps',
          title: 'docType',
          dataValue: 'key',
          dataLabel: 'value',
          placeholder: '单据类型'
        },
        {
          label: '采购合同号',
          value: 'contractCode',
          inputType: 'el-input'
        },
        {
          label: '单据编号',
          value: 'code',
          inputType: 'el-input'
        },
        {
          label: '单据日期',
          value: 'dateRange',
          inputType: 'el-daterangeArr'
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
          label: '入库类型',
          value: 'sourceType',
          inputType: 'el-select',

          httpUrl: 'basicData/queryDataDict2List',
          requestParams: { dataDictKey: 'WH_INSTOCK_TYPE' },
          dataSource: 'fontMaps',
          title: 'sourceTypeList',
          dataValue: 'key',
          dataLabel: 'value',
          placeholder: '入库类型'
        }
      ],
      dataTable: {
        dataListLoading: false, // 加载中动画
        stripe: true, // 创建带斑马纹的表格
        border: true,
        hasSelect: true, // 有无复选框选中功能
        maxHeight: '500',
        tr: [{
          label: '应付类型',
          prop: 'docTypeName',
          width: '80px'
          // show: 'template' // show有三种值：false隐藏当前列，true常规表格列，template自定义表格列
        }, {
          label: '入库类型',
          prop: 'sourceTypeName',
          width: '80px',
          show: true
        }, {
          label: '采购合同号',
          prop: 'contractCode',
          minWidth: '120px',
          show: true
        }, {
          label: '应付公司',
          prop: 'compName',
          width: '200px',
          show: true
        }, {
          label: '应付单号',
          prop: 'code',
          width: '100px',
          show: true
        }, {
          label: '应付日期',
          prop: 'payableDate',
          width: '80px'
          // show: 'template' // show有三种值：false隐藏当前列，true常规表格列，template自定义表格列
        }, {
          label: '产品编码',
          prop: 'prodCode',
          width: '70px',
          show: true
        }, {
          label: '产品名称',
          prop: 'prodName',
          width: '200px',
          show: true
        }, {
          label: '数量',
          prop: 'qty',
          width: '50px',
          show: true
        }, {
          label: '单价',
          prop: 'price',
          width: '80px',
          show: true
        }, {
          label: '总金额',
          prop: 'totalAmount',
          width: '100px',
          show: true
        }, {
          label: '已付款金额',
          prop: 'paidAmount',
          width: '80px',
          show: true
        }, {
          label: '申请中金额',
          prop: 'requestAmount',
          width: '80px',
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
        url: this.$http.adornUrl(`fin/finpopayment/getpaymentinfo`),
        method: 'post',
        data: Object.assign({}, this.paginationData, this.searchData === undefined ? {} : this.searchData, this.filter)
      }).then(({ data }) => {
        if (data && data.code === 0) {
          this.dataTable.data = data.pageList.dataList
          this.paginationData = data.pageList.page
        } else {
          this.dataTable.data = []
          this.paginationData.totalCount = 0
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