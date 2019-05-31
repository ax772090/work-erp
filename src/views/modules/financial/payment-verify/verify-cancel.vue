<!-- 核销记录 -->
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
        <el-button v-if="isAuth('fin:paymentverifyrecord:reverseVerify')"
                   type="primary"
                   @click="verifyCancelHandle()"
                   :disabled="verifyCancelDis"><i class="iconfont erp-icon-shenhe"></i>反核销
        </el-button>
      </el-row>
    </el-form>
    <el-table stripe
              border
              highlight-current-row
              max-height="800"
              :data="dataList"
              @selection-change="selectionChangeHandle"
              v-loading="dataListLoading">
      <el-table-column type="selection"
                       header-align="center"
                       align="center"
                       width="50"></el-table-column>
      <el-table-column prop="verifyCode"
                       label="核销凭证号"
                       sortable></el-table-column>
      <el-table-column prop="verifyType"
                       label="核销类型"></el-table-column>
      <el-table-column prop="prePayCode"
                       label="付款单号"
                       sortable></el-table-column>
      <el-table-column prop="supplierName"
                       label="供应商"></el-table-column>
      <el-table-column prop="currency"
                       label="结算币别"></el-table-column>
      <el-table-column prop="verifyDate"
                       label="核销日期"
                       sortable></el-table-column>
      <el-table-column prop="tradingType"
                       label="入库类型"></el-table-column>
      <el-table-column prop="paymentType"
                       label="应付类型"></el-table-column>
      <el-table-column prop="docCode"
                       label="应付单号"
                       sortable></el-table-column>
      <el-table-column prop="prodCode"
                       label="产品编码"
                       sortable></el-table-column>
      <el-table-column prop="prodName"
                       label="产品名称"></el-table-column>
      <el-table-column prop="qty"
                       label="数量"
                       sortable></el-table-column>
      <el-table-column prop="price"
                       label="单价"
                       sortable></el-table-column>
      <el-table-column prop="totalAmount"
                       label="总金额"
                       sortable></el-table-column>
      <el-table-column prop="verifyAmount"
                       label="已核销金额"
                       sortable></el-table-column>
    </el-table>
    <el-row>
      <pagination-all v-model="paginationData"
                      @paginationChangeHandle="getDataList"></pagination-all>
    </el-row>
  </div>
</template>

<script>
import erpSearchPanel from '@/components/erp-search-panel'
import paginationAll from '@/components/erp-pagination/pagination-all'
export default {
  components: {
    erpSearchPanel,
    paginationAll
  },
  props: ['value'],
  data () {
    return {
      dataForm: {},
      verifyCancelDis: true,
      dataListSelections: [],
      dataListLoading: false,
      dataList: [],
      dataRule: {},
      searchData: {},
      // 下拉
      searchOptions: [
        {
          label: '供应商',
          value: 'supplier',
          inputType: 'el-select-remote',
          httpUrl: 'basic/basicsupplier/list-used?b_used=true',
          queryKey: 'name',
          dataSource: 'list',
          title: 'supplierIdList',
          dataValue: 'id',
          dataLabel: 'name',
          placeholder: '搜索供应商'
        },

        {
          label: '核销日期',
          value: 'dateRange',
          inputType: 'el-daterangeArr'
        },
        {
          label: '核销金额',
          value: 'verifyAmount',
          inputType: 'el-input'
        },
        {
          label: '付款单号',
          value: 'prePayCode',
          inputType: 'el-input'
        },
        {
          label: '核销凭证号',
          value: 'verifyCode',
          inputType: 'el-input'
        },
         {
          label: '核销类型',
          value: 'verifyType',
          inputType: 'el-select',

          httpUrl: '/basicData/queryDataDict2List',
          requestParams: { dataDictKey: 'FIN_VERIFY_TYPE' },
          dataSource: 'fontMaps',
          title: 'verifyType',
          dataValue: 'key',
          dataLabel: 'value',
          placeholder: '核销类型'
        },
         {
          label: '入库类型',
          value: 'tradingType',
          inputType: 'el-select',

          httpUrl: '/basicData/queryDataDict2List',
          requestParams: { dataDictKey: 'WH_INSTOCK_TYPE' },
          dataSource: 'fontMaps',
          title: 'tradingType',
          dataValue: 'key',
          dataLabel: 'value',
          placeholder: '入库类型'
        },
         {
          label: '应付类型',
          value: 'paymentType',
          inputType: 'el-select',

          httpUrl: '/basicData/queryDataDict2List',
          requestParams: { dataDictKey: 'PAYABLE_TYPE' },
          dataSource: 'fontMaps',
          title: 'paymentType',
          dataValue: 'key',
          dataLabel: 'value',
          placeholder: '应付类型'
        },
        {
          label: '应付单号',
          value: 'docCode',
          inputType: 'el-input'
        },
        {
          label: '产品编码/名称',
          value: 'prodId',
          inputType: 'el-select-remote',
          httpUrl: 'prod/prodbasic/queryForComplete',
          queryKey: 'code',
          dataSource: 'list',
          dataValue: 'id',
          dataLabel: 'code',
          dataLabelRight: 'name_ch',
          showName: true
        },
        {
          label: '结算币别',
          value: 'currency',
          inputType: 'el-select',

          httpUrl: 'basicData/queryAllCurrency',
          dataSource: 'currencyList',
          title: 'currency',
          dataValue: 'id',
          dataLabel: 'name',
          placeholder: '结算币别'
        }
      ],
      // 分页
      paginationData: {
        // 当前页数
        currPage: 1,
        // 一页显示的条数
        pageSize: 10,
        // 总条数
        totalCount: 0,
        // 总页数
        totalPage: 0
      }
    }
  },
  methods: {
    init (tabName) {
      // this.searchData = searchData
      this.getDataList(1)
    },
    // 获取数据列表
    getDataList (val) {
      if (val != undefined) {
        this.paginationData.currPage = val
      }
      this.dataListLoading = true
      this.$http({
        url: this.$http.adornUrl('fin/paymentverifyrecord/list'),
        method: 'post',
        data: Object.assign({},
          this.paginationData,
          this.searchData == undefined ? {} : this.searchData
        )
      }).then(({
        data
      }) => {
        if (data && data.code === 0) {
          this.dataList = data.pageList.dataList
          this.paginationData.totalCount = data.pageList.page.totalCount
        } else {
          this.dataList = []
          this.paginationData.totalCount = 0
          this.$notify.error({
            title: '错误',
            message: data.msg,
            duration: 5000
          })
        }
        this.dataListLoading = false
      })
    },
    // 多选
    selectionChangeHandle (val) {
      this.dataListSelections = val
      if (this.dataListSelections.length <= 0) {
        this.verifyCancelDis = true
      } else {
        this.verifyCancelDis = false
      }
    },
    // 反核销处理
    verifyCancelHandle () {
      let ids = this.dataListSelections.map(item => {
        return item.id
      })
      let isVerify = this.dataListSelections.every((item) => {
        return item.type !== 'PAYMENT'
      })

      if (!isVerify) {
        this.$notify.warning({
          title: '警告',
          message: '核销类型为[自动核销]的单据不能进行反核销，请重新选择！',
          duration: 3000
        })
      } else {
        this.$http({
          url: this.$http.adornUrl('fin/paymentverifyrecord/reverseVerify'),
          method: 'post',
          data: ids
        }).then(({ data }) => {
          if (data && data.code === 0) {
            this.getDataList(1)
            this.$notify.success({
              title: '成功',
              message: '反核销成功',
              duration: 3000
            })
          } else {
            this.$notify.error({
              title: '失败',
              message: data.msg,
              duration: 5000
            })
          }
        })
      }
    }
  },
  watch: {
    value: {
      handler (val, oldVal) {
        this.dataForm = this.value
        this.$emit('change', this.dataForm)
      },
      deep: true
    },
    dataForm: {
      handler (val, oldVal) {
        this.$emit('input', this.dataForm)
      },
      deep: true
    }
  }
}
</script>
