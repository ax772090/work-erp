<!-- 销售预报表 -->
<template>
  <div>
    <el-form :inline="true"
             :model="dataForm"
             :rules="dataRules"
             ref="dataForm">
      <el-form-item label="渠道"
                    prop="channelId">
        <select-all v-model="dataForm.channelId"
                    :listDataOption="channelIdOptions"
                    data-value="id"
                    data-label="name"
                    placeholder="渠道"
                    :isMultiple="true"
                    :isSelectChange="true"
                    :collapseTags='true'
                    @selectChange="channelIdExchange"
                    style="width:220px;"></select-all>
      </el-form-item>
      <el-form-item label="日期"
                    prop="dateRange">
        <el-date-picker v-model="dataForm.dateRange"
                        type="daterange"
                        range-separator="-"
                        start-placeholder="开始日期"
                        end-placeholder="结束日期"
                        value-format="yyyy-MM-dd"
                        placeholder="选择日期范围"
                        @change="dateRangeChange">
        </el-date-picker>
      </el-form-item>
      <el-form-item label="">
        <el-radio-group :radioListData='radioOptions'
                        v-model="timeRadio"
                        @change="filterableAll"></el-radio-group>

      </el-form-item>
      <el-form-item>
        <el-button type="primary"
                   @click="submitForm('dataForm')"><i class="iconfont erp-icon-sousuo"></i>搜索</el-button>
        <el-button type="primary"
                   @click="resetForm('dataForm')"><i class="iconfont erp-icon-chongzhi"></i>重置</el-button>
        <el-button type="primary"
                   @click="excelExport"><i class="iconfont erp-icon-xiazai"></i>Excel</el-button>
      </el-form-item>
      <el-row class="mt-10">
        <div class="fl sum-class">总结（{{sumDateRange}}业绩）</div>
        <div class="fr">
          <span class="">最新更新：{{lastSyncTime}}</span>
        </div>
      </el-row>
    </el-form>
    <el-table border
              highlight-current-row
              max-height="800"
              :data="dataList"
              :header-cell-style='headerCellStyle'
              :cell-style='cellStyle'
              v-loading="dataListLoading"
              :summary-method="getSummaries"
              show-summary
              class="table-diy">
      <el-table-column prop="channel_name"
                       label="店铺"
                       sortable
                       width="160px"></el-table-column>
      <el-table-column prop="order_count"
                       label="订单数"
                       sortable></el-table-column>
      <el-table-column prop="shipment_quantity"
                       label="销售量"
                       sortable></el-table-column>
      <el-table-column prop="refund_quantity"
                       label="退货量"
                       sortable>
        <template slot-scope="scope">
          <div>{{scope.row.refund_quantity}}</div>
          <div class="column-per">({{scope.row.refundQtyPer}}%)</div>
        </template>
      </el-table-column>
      <el-table-column prop="sell_amount"
                       label="销售额"
                       sortable
                       width="120px">
      </el-table-column>
      <!-- <el-table-column prop="shipment_amount"
                       label="订单金额"
                       sortable
                       width="120px"></el-table-column> -->
      <el-table-column prop="gross_profit"
                       label="毛利"
                       sortable
                       width="100px">
        <template slot-scope="scope">
          <div>{{scope.row.gross_profit}}</div>
          <div class="column-per">({{scope.row.grossPer}}%)</div>
        </template>
      </el-table-column>
      <el-table-column prop="refund_amount"
                       label="退款金额"
                       sortable
                       width="100px">
        <template slot-scope="scope">
          <div>{{scope.row.refund_amount}}</div>
          <div class="column-per">({{scope.row.refundAmountPer}}%)</div>
        </template>
      </el-table-column>
      <el-table-column prop="purchase_amount"
                       label="采购成本"
                       sortable
                       width="100px">
        <template slot-scope="scope">
          <div>{{scope.row.purchase_amount}}</div>
          <div class="column-per">({{scope.row.purchasePer}}%)</div>
        </template>
      </el-table-column>
      <el-table-column prop="freight_amount"
                       label="头程成本"
                       sortable
                       width="100px">
        <template slot-scope="scope">
          <div>{{scope.row.freight_amount}}</div>
          <div class="column-per">({{scope.row.freightPer}}%)</div>
        </template></el-table-column>
      <!-- <el-table-column prop="promotion_amount"
                       label="促销折扣"
                       sortable
                       width="100px">
        <template slot-scope="scope">
          <div>{{scope.row.promotion_amount}}</div>
          <div class="column-per">({{scope.row.promotionPer}}%)</div>
        </template></el-table-column> -->
      <el-table-column prop="fba_amount"
                       label="FBA费用"
                       sortable
                       width="100px">
        <template slot-scope="scope">
          <div>{{scope.row.fba_amount}}</div>
          <div class="column-per">({{scope.row.fbaPer}}%)</div>
        </template></el-table-column>
      <el-table-column prop="seller_fees_amount"
                       label="佣金费"
                       sortable
                       width="100px">
        <template slot-scope="scope">
          <div>{{scope.row.seller_fees_amount}}</div>
          <div class="column-per">({{scope.row.sellerfeePer}}%)</div>
        </template></el-table-column>
      <el-table-column label="其他费用"
                       prop="others_amount"
                       sortable
                       width="100px">
        <template slot-scope="scope">
          <div>{{scope.row.others_amount}}</div>
          <div class="column-per">({{scope.row.otherPer}}%)</div>
        </template></el-table-column>
      </el-table-column>
      <el-table-column prop="per_service_fee"
                       label="仓租"
                       sortable
                       width="100px">
        <template slot-scope="scope">
          <div>{{scope.row.per_service_fee}}</div>
          <div class="column-per">({{scope.row.perservicePer}}%)</div>
        </template></el-table-column>
      <el-table-column prop="per_deal_fee"
                       label="LD费用"
                       sortable
                       width="100px">
        <template slot-scope="scope">
          <div>{{scope.row.per_deal_fee}}</div>
          <div class="column-per">({{scope.row.perdealPer}}%)</div>
        </template></el-table-column>
      <el-table-column prop="per_amz_ad_fee"
                       label="广告费"
                       sortable
                       width="100px">
        <template slot-scope="scope">
          <div>{{scope.row.per_amz_ad_fee}}</div>
          <div class="column-per">({{scope.row.perAdPer}}%)</div>
        </template></el-table-column>
      <el-table-column prop="platform_assess_fee"
                       label="测评费"
                       sortable
                       width="100px">
        <template slot-scope="scope">
          <div>{{scope.row.platform_assess_fee}}</div>
          <div class="column-per">({{scope.row.assessPer}}%)</div>
        </template></el-table-column>

    </el-table>
    <!-- <el-row>
      <pagination-all v-model="paginationData"
                      @paginationChangeHandle="getDataList"></pagination-all>
    </el-row> -->
  </div>
</template>
<script>
import erpSearchPanel from '@/components/erp-search-panel'
import paginationAll from '@/components/erp-pagination/pagination-all'
import selectAll from '@/components/erp-select/select-all'
// 引入radio组件
import elRadioGroup from '@/components/erp-radio/radio-all'
import { getDayStr, getWeekRange, getLastWeek, getMonthRange, getLastMonthRange } from './dateUtil.js'
export default {
  components: {
    erpSearchPanel,
    paginationAll,
    selectAll,
    elRadioGroup
  },
  props: ['value'],
  data () {
    return {
      oldOptions: [],
      radioOptions: [
        { key: '0', value: '昨天' },
        { key: '1', value: '前天' },
        { key: '2', value: '本周' },
        { key: '3', value: '上周' },
        { key: '4', value: '本月' },
        { key: '5', value: '上月' }
      ],
      lastSyncTime: '',
      sumDateRange: '',
      channelIdOptions: [],
      timeRadio: '',
      dataForm: {
        channelId: [],
        dateRange: []
      },
      dataList: [],
      dataListLoading: false,
      // 数据过滤器
      searchData: {},
      dataRules: {
        channelId: [
          { required: true, message: '必填项', trigger: 'change' }
        ],
        dateRange: [
          { required: true, message: '必填项', trigger: 'change' }
        ]
      }

      // 分页
      // paginationData: {
      //   // 当前页数
      //   currPage: 1,
      //   // 一页显示的条数
      //   pageSize: 10,
      //   // 总条数
      //   totalCount: 0,
      //   // 总页数
      //   totalPage: 0
      // }
    }
  },
  created () {
    // console.log('昨天', getDayStr(-1))
    // console.log('前天', getDayStr(-2))
    // console.log('本周', getWeekRange())
    // console.log('上周', getLastWeek())
    // console.log('本月', getMonthRange())
    // console.log('上月', getLastMonthRange())
    this.getDataUrl()
  },
  methods: {
    getDataUrl () {
      this.$http.get(this.$http.adornUrl('list/combobox/ownChannel'), { params: { platformType: '' } }).then(({ data }) => {
        this.channelIdOptions = data.list
        this.channelIdOptions.unshift({ id: 'all', name: '所有选项' })
      })
    },

    submitForm (formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.getDataList(1)
        } else {
          return false
        }
      })
    },
    resetForm (formName) {
      this.$refs[formName].resetFields()
      this.timeRadio = ''
      this.sumDateRange = ''
      this.dataList = []
    },
    // 获取数据列表
    getDataList (val) {
      // if (val != undefined) {
      //   this.paginationData.currPage = val
      // }
      this.searchData = {
        channel_id: this.dataForm.channelId.join(','),
        start_date: this.dataForm.dateRange[0],
        end_date: this.dataForm.dateRange[1]
      }
      this.dataListLoading = true
      this.$http({
        url: this.$http.adornUrl('datacenter/api/seller-report'),
        method: 'get',
        params: Object.assign({}, this.searchData)
      }).then(({ data }) => {
        if (data && data.code === 200) {
          this.lastSyncTime = data.updtime || ''
          for (const item of data.dataList) {
            let itemTemp = this.amountFixed2(item)
            this.$set(itemTemp, 'refundQtyPer', Number(itemTemp.shipment_quantity) === 0 ? 0 : ((Number(itemTemp.refund_quantity) / Number(itemTemp.shipment_quantity)) * 100).toFixed(2))
            this.$set(itemTemp, 'grossPer', Number(itemTemp.shipment_amount) === 0 ? 0 : ((Number(itemTemp.gross_profit) / Number(itemTemp.shipment_amount)) * 100).toFixed(2))
            this.$set(itemTemp, 'refundAmountPer', Number(itemTemp.shipment_amount) === 0 ? 0 : ((Number(itemTemp.refund_amount) / Number(itemTemp.shipment_amount)) * 100).toFixed(2))
            this.$set(itemTemp, 'purchasePer', Number(itemTemp.shipment_amount) === 0 ? 0 : ((Number(itemTemp.purchase_amount) / Number(itemTemp.shipment_amount)) * 100).toFixed(2))
            this.$set(itemTemp, 'freightPer', Number(itemTemp.shipment_amount) === 0 ? 0 : ((Number(itemTemp.freight_amount) / Number(itemTemp.shipment_amount)) * 100).toFixed(2))
            // this.$set(itemTemp, 'promotionPer', Number(itemTemp.shipment_amount) === 0 ? 0 : ((Number(itemTemp.promotion_amount) / Number(itemTemp.shipment_amount)) * 100).toFixed(2))
            this.$set(itemTemp, 'fbaPer', Number(itemTemp.shipment_amount) === 0 ? 0 : ((Number(itemTemp.fba_amount) / Number(itemTemp.shipment_amount)) * 100).toFixed(2))
            this.$set(itemTemp, 'sellerfeePer', Number(itemTemp.shipment_amount) === 0 ? 0 : ((Number(itemTemp.seller_fees_amount) / Number(itemTemp.shipment_amount)) * 100).toFixed(2))
            this.$set(itemTemp, 'otherPer', Number(itemTemp.shipment_amount) === 0 ? 0 : ((Number(itemTemp.others_amount) / Number(itemTemp.shipment_amount)) * 100).toFixed(2))
            this.$set(itemTemp, 'perservicePer', Number(itemTemp.shipment_amount) === 0 ? 0 : ((Number(itemTemp.per_service_fee) / Number(itemTemp.shipment_amount)) * 100).toFixed(2))
            this.$set(itemTemp, 'perdealPer', Number(itemTemp.shipment_amount) === 0 ? 0 : ((Number(itemTemp.per_deal_fee) / Number(itemTemp.shipment_amount)) * 100).toFixed(2))
            this.$set(itemTemp, 'perAdPer', Number(itemTemp.shipment_amount) === 0 ? 0 : ((Number(itemTemp.per_amz_ad_fee) / Number(itemTemp.shipment_amount)) * 100).toFixed(2))
            this.$set(itemTemp, 'assessPer', Number(itemTemp.shipment_amount) === 0 ? 0 : ((Number(itemTemp.platform_assess_fee) / Number(itemTemp.shipment_amount)) * 100).toFixed(2))
          }
          this.dataList = data.dataList
        } else {
          this.dataList = []
          // this.$notify.error({
          //   title: '错误',
          //   message: data.msg,
          //   duration: 5000
          // })
        }
      })
      this.dataListLoading = false
    },
    amountFixed2 (obj) {
      let _obj = obj
      for (const key in obj) {
        if (obj.hasOwnProperty(key) && key !== 'channel_name' && key !== 'order_count' && key !== 'shipment_quantity' && key !== 'refund_quantity') {
          _obj[key] = obj[key].toFixed(2)
        }
      }
      return _obj
    },
    // 导出
    excelExport () {
      this.$refs['dataForm'].validate(valid => {
        if (valid) {
          if (this.dataList.length > 0) {
            this.searchData.export = 1
            window.open(
              this.$http.tokens(
                'datacenter/api/seller-report',
                this.searchData
              )
            )
          } else {
            this.$notify.warning({
              title: '提示',
              message: '暂无可导出数据',
              duration: 5000
            })
          }
        }
      })
    },
    filterableAll (val) {
      const action = {
        '0': getDayStr(-1),
        '1': getDayStr(-2),
        '2': getWeekRange(),
        '3': getLastWeek(),
        '4': getMonthRange(),
        '5': getLastMonthRange()
      }
      let dateTemp = ''
      if (val === '0' || val === '1') {
        dateTemp = action[val]
        this.dataForm.dateRange = [dateTemp, dateTemp]
      } else {
        this.dataForm.dateRange = action[val]
      }
      this.sumDateRangeHandle(this.dataForm.dateRange)
    },
    sumDateRangeHandle (val) {
      if (val) {
        if (val[0] === val[1]) {
          this.sumDateRange = val[0]
        } else {
          this.sumDateRange = val[0] + '~' + val[1]
        }
      } else {
        this.sumDateRange = ''
      }
    },
    channelIdExchange (val) {
      console.log('channelIdExchange:', val)
      let allValues = []
      for (const item of this.channelIdOptions) {
        allValues.push(item.id)
      }
      const oldVal = this.oldOptions.length === 0 ? [] : this.oldOptions[1]
      console.log('oldVal', oldVal)

      // 全部选择
      if (val.includes('all')) {
        this.dataForm.channelId = allValues
      }
      // 取消选择全部  上次有 当前没有 表示取消全选
      if (oldVal.includes('all') && !val.includes('all')) {
        this.dataForm.channelId = []
      }
      // 点击非全部选中  需要排除全部选中 以及 当前点击的选项
      // 新老数据都有全部选中
      if (oldVal.includes('all') && val.includes('all')) {
        const index = val.indexOf('all')
        val.splice(index, 1)// 排除全选选项
        this.dataForm.channelId = val
      }
      // 全选未选 但是其他选项全部选上 则全选选上 上次和当前 都没有全选
      if (!oldVal.includes('all') && !val.includes('all')) {
        if (val.length === allValues.length - 1) {
          this.dataForm.channelId = ['all'].concat(val)
        }
      }
      // 储存当前最后结果 作为下次的老数据
      this.oldOptions[1] = this.dataForm.channelId
      console.log('oldOptions:', this.oldOptions)
    },
    dateRangeChange (val) {
      this.timeRadio = ''
      this.sumDateRangeHandle(val)
    },
    headerCellStyle (data) {
      if (data.columnIndex === 6) {
        return 'color:#e4a421'
      }
    },
    cellStyle (data) {
      if (data.columnIndex === 6) {
        return 'color:#e4a421'
      }
    },
    getColumns (param) {
      const { columns } = param
      this.columns = columns
      return []
    },
    getSummaries (param) {
      const { columns, data } = param
      // 这里单独计算出订单金额的总和，因为需求要去掉订单金额这一列
      let temp = 0
      data.forEach(item => {
        temp += Number(item['shipment_amount'])
      })

      const sums = []
      columns.forEach((column, index) => {
        if (index === 0) {
          sums[index] = '合计'
          return
        }
        const values = data.map(item => Number(item[column.property]))
        if (!values.every(value => isNaN(value))) {
          sums[index] = values.reduce((prev, curr) => {
            const value = Number(curr)
            if (!isNaN(value)) {
              return prev + curr
            } else {
              return prev
            }
          }, 0).toFixed(2)
          sums[index] = sums[index]
        } else {
          sums[index] = 'N/A'
        }
      })

      columns.forEach((column, index) => {
        if (index === 1 || index === 2) {
          sums[index] = parseInt(sums[index], 10)
        }
        if (index === 3) {
          sums[index] = parseInt(sums[index]) + '\n' + '(' + ((sums[index] * 100 / sums[2] * 100) / 100).toFixed(2) + '%)'
        }
        if (index > 4) {
          sums[index] = sums[index] + '\n' + '(' + ((sums[index] * 100 / Number(temp.toFixed(2)) * 100) / 100).toFixed(2) + '%)'
        }
      })

      return sums
    }
  }
}
</script>
<style scoped>
.column-per {
  color: #137af1;
}
.sum-class {
  font-size: 16px;
}
</style>
<style>
.el-table .head-cell-class-6 {
  color: #e4a421;
}
.table-diy .has-gutter td div {
  white-space: pre;
}
.table-diy .has-gutter tr {
  font-size: 14px;
}
/* .table-diy .el-table__footer-wrapper tbody td{
  background-color: #eddec0
} */
</style>

