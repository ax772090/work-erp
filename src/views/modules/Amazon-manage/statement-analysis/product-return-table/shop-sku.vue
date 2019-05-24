<!-- 店铺SKU（主表） -->
<template>
  <div>
    <el-form :model="dataForm"
             :rules="dataRule"
             ref="dataForm"
             label-width="110px">
      <el-row>
        <el-table stripe
                  border
                  highlight-current-row
                  max-height="800"
                  :data="dataForm.dataList">
          <el-table-column prop="saleComp"
                           label="销售公司"></el-table-column>
          <el-table-column prop="month"
                           label="月份"></el-table-column>
          <el-table-column prop="country"
                           label="国家"></el-table-column>
          <el-table-column prop="channel"
                           label="店铺"></el-table-column>
          <el-table-column prop="inChargeOf"
                           label="负责人">
          </el-table-column>
          <el-table-column prop="sellerSku"
                           label="卖家SKU"></el-table-column>
          <el-table-column prop="asin"
                           label="ASIN"></el-table-column>
          <el-table-column prop="sku"
                           label="自定义SKU"></el-table-column>
          <el-table-column prop="unit"
                           label="结算币种"></el-table-column>
          <el-table-column prop="saleQty"
                           label="销售总量"></el-table-column>
          <el-table-column prop="saleAmount"
                           label="销售总金额"></el-table-column>
          <el-table-column prop="returnQty"
                           label="退货总量"></el-table-column>
          <el-table-column prop="returnAmount"
                           label="退货总金额"></el-table-column>
          <el-table-column prop="returnRate"
                           label="退货率"></el-table-column>
          <el-table-column prop="refundRate"
                           label="退款率"></el-table-column>
        </el-table>
      </el-row>
      <el-row>
        <pagination-all v-model="paginationData"
                        @paginationChangeHandle="1"></pagination-all>
      </el-row>
    </el-form>
  </div>
</template>

<script>
// 分页
import paginationAll from '@/components/erp-pagination/pagination-all'
export default {
  components: {
    paginationAll
  },
  props: ['value'],
  data () {
    return {
      dataForm: {
        dataList: []
      },
      dataRule: {
      },
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
