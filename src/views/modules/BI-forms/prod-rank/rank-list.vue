<!-- 单品排名 -->
<template>
  <div>
    <el-form :model="searchForm"
             :rules="dataRule"
             ref="searchForm"
             label-width="80px">
      <h3>
        单品排名（ 2019-4 ）
      </h3>
      <el-row>
        <el-form-item label="搜索：">
          <el-input v-model="search"></el-input>
        </el-form-item>
      </el-row>
      <el-row>
        <el-button type="primary"
                   @click="exportFile()"
                   v-if="isAuth('mws:mwsrptallorders:export')"><i class="iconfont erp-icon-daochu"></i>Excel</el-button>
        <div class="fr">最近一次更新时间:{{lastUpdateTime}}</div>
      </el-row>
    </el-form>
    <el-table stripe
              border
              highlight-current-row
              max-height="800"
              :data="dataList"
              v-loading="dataListLoading">
      <el-table-column prop="amazonOrderId"
                       sortable
                       label="明细"></el-table-column>
      <el-table-column prop="merchantOrderId"
                       label="渠道"
                       sortable
                       :show-overflow-tooltip="true"></el-table-column>
      <el-table-column prop="sellerName"
                       sortable
                       width="100"
                       label="销售小组"></el-table-column>
      <el-table-column prop="purchaseDate"
                       sortable
                       label="销售"></el-table-column>
      <el-table-column prop="lastUpdatedDate"
                       sortable
                       label="开发"></el-table-column>
      <el-table-column prop="orderStatus"
                       sortable
                       label="产品名"></el-table-column>
      <el-table-column prop="fulfillmentChannel"
                       sortable
                       width="100"
                       label="E登SKU"></el-table-column>
      <el-table-column prop="salesChannel"
                       sortable
                       width="100"
                       label="平均单价"></el-table-column>
      <el-table-column prop="shipServiceLevel"
                       width="100"
                       sortable
                       label="可售周转"></el-table-column>
      <el-table-column prop="productName"
                       label="FBA库存"
                       width="100"
                       sortable
                       :show-overflow-tooltip="true"></el-table-column>
      <el-table-column prop="sku"
                       width="120"
                       sortable
                       label="中转仓库存"></el-table-column>
      <el-table-column prop="asin"
                       width="100"
                       sortable
                       label="昨天销量"></el-table-column>
      <el-table-column prop="itemStatus"
                       width="100"
                       sortable
                       label="总销量"></el-table-column>
      <el-table-column prop="quantity"
                       sortable
                       label="退货量"></el-table-column>
      <el-table-column prop="currency"
                       sortable
                       width="100"
                       label="订单金额"></el-table-column>
      <el-table-column prop="itemPrice"
                       sortable
                       label="毛利"></el-table-column>
      <el-table-column prop="itemTax"
                       sortable
                       width="100"
                       label="退款金额"></el-table-column>
      <el-table-column prop="shippingPrice"
                       sortable
                       width="100"
                       label="采购成本"></el-table-column>
      <el-table-column prop="shippingTax"
                       sortable
                       width="100"
                       label="头程成本"></el-table-column>
      <el-table-column prop="giftWrapPrice"
                       sortable
                       label="手续费"></el-table-column>
      <el-table-column prop="promotionIds"
                       sortable
                       label="运费"></el-table-column>
      <el-table-column prop="itemPromotionDiscount"
                       sortable
                       label="转运费">
      </el-table-column>
      <el-table-column prop="shipPromotionDiscount"
                       sortable
                       width="100"
                       label="仓租">
      </el-table-column>
      <el-table-column prop="shipCity"
                       sortable
                       label="广告费"></el-table-column>
      <el-table-column prop="shipState"
                       width="120"
                       sortable
                       label="AMS广告费"></el-table-column>
      <el-table-column prop="shipPostalCode"
                       sortable
                       width="100"
                       label="LD费用"></el-table-column>
      <el-table-column prop="shipCountry"
                       sortable
                       label="测评费"></el-table-column>
      <el-table-column prop="shipCountry"
                       sortable
                       label="税金"></el-table-column>
      <el-table-column prop="shipCountry"
                       sortable
                       width="100"
                       label="物料赔偿"></el-table-column>
      <el-table-column prop="shipCountry"
                       sortable
                       width="100"
                       label="固定成本"></el-table-column>
      <el-table-column prop="shipCountry"
                       sortable
                       label="毛利%"></el-table-column>
    </el-table>
    <!-- 分页 -->
    <el-row>
      <pagination-all v-model="paginationData"
                      @paginationChangeHandle="getDataList"></pagination-all>
    </el-row>
    <!-- <div class="box">
      <div class="item1"
           :style="{width:progress1+'%'}"></div>
      <div class="item2" :style="{width:progress+'%'}">{{progress}}%</div>
      <div class="item3" :style="{width:progress2+'%'}"></div>
    <div class="item4" :style="{width:progress4+'%'}"></div>
    </div> -->
  </div>
</template>
<script>
// 分页
import paginationAll from '@/components/erp-pagination/pagination-all'
import selectAll from '@/components/erp-select/select-all'
// 表头处理
import { renderHeaderUtil } from '@/utils/index.js'
import { initData } from '@/mixins/initData.js'
export default {
  mixins: [initData],
  components: {
    paginationAll,
    selectAll
  },
  data () {
    return {
      // progress: 30,
      // progress1: 10,
      // progress2: 50,
      // progress4: 0,
      searchData: {},
      searchForm: {
        channelId: '',
        dateRange: []
      },
      searchOptions: [
        {
          label: '订单编号',
          value: 'order',
          inputType: 'el-input'
        },
        {
          label: '自定义订单号',
          value: 'merchantOrderId',
          inputType: 'el-input'
        },
        {
          label: 'sellsku',
          value: 'sku',
          inputType: 'el-input'
        }
      ],
      lastUpdateTime: '',
      // dataList: [{
      //   amazonOrderId: '2016-05-02',
      //   merchantOrderId: '王小虎',
      //   sellerName: '上海市普陀区金沙江路 1518 弄'
      // }, {
      //   amazonOrderId: '2016-05-02',
      //   merchantOrderId: '王小虎',
      //   sellerName: '上海市普陀区金沙江路 1518 弄'
      // }, {
      //   amazonOrderId: '2016-05-02',
      //   merchantOrderId: '王小虎',
      //   sellerName: '上海市普陀区金沙江路 1518 弄'
      // }, {
      //   amazonOrderId: '2016-05-02',
      //   merchantOrderId: '王小虎',
      //   sellerName: '上海市普陀区金沙江路 1518 弄'
      // }],
      otableData: [{
        amazonOrderId: '2016-05-02',
        merchantOrderId: '王小虎',
        sellerName: '上海市普陀区金沙江路 1518 弄'
      }, {
        amazonOrderId: '2016-05-02',
        merchantOrderId: '王小虎',
        sellerName: '上海市普陀区金沙江路 1518 弄'
      }, {
        amazonOrderId: '2016-05-02',
        merchantOrderId: '王小虎',
        sellerName: '上海市普陀区金沙江路 1518 弄'
      }, {
        amazonOrderId: '2016-05-02',
        merchantOrderId: '王小虎',
        sellerName: '上海市普陀区金沙江路 1518 弄'
      }],
      search: '',
      dataListLoading: false,
      dataRule: {
        isRequired: [{ required: true, message: '必填项', trigger: 'change' }],
        dateRange: [{ required: true, message: '必填项', trigger: 'change' }]
      }
    }
  },
  created () {
    // this.progress = 23.5
    // this.progress1 = 10
    // this.progress2 = 20
    // this.progress4 = 50
  },
  computed: {
    // 模糊搜索
    dataList () {
      const search = this.search
      if (search) {
        // filter() 方法创建一个新的数组，新数组中的元素是通过检查指定数组中符合条件的所有元素。
        // 注意： filter() 不会对空数组进行检测。
        // 注意： filter() 不会改变原始数组。
        return this.otableData.filter(data => {
          // some() 方法用于检测数组中的元素是否满足指定条件;
          // some() 方法会依次执行数组的每个元素：
          // 如果有一个元素满足条件，则表达式返回true , 剩余的元素不会再执行检测;
          // 如果没有满足条件的元素，则返回false。
          // 注意： some() 不会对空数组进行检测。
          // 注意： some() 不会改变原始数组。
          return Object.keys(data).some(key => {
            // indexOf() 返回某个指定的字符在某个字符串中首次出现的位置，如果没有找到就返回-1；
            // 该方法对大小写敏感！所以之前需要toLowerCase()方法将所有查询到内容变为小写。
            return String(data[key]).toLowerCase().indexOf(search) > -1
          })
        })
      }
      return this.otableData
    }
  },
  methods: {
    // 获取数据列表
    getDataList (val) {
      this.$refs['searchForm'].validate(valid => {
        if (valid) {
          if (val) {
            this.paginationData.currPage = val
          }
          let dataObj = {}
          if (this.searchForm) {
            dataObj = Object.assign({}, this.searchData, this.searchForm)
          }
          this.dataListLoading = true
          this.$http({
            url: this.$http.adornUrl('mws/mwsrptallorders/list'),
            method: 'post',
            data: Object.assign({}, this.paginationData, dataObj)
          }).then(({ data }) => {
            if (data && data.code === 0) {
              this.lastUpdateTime = data.lastUpdateTime
              this.dataList = data.pageList.dataList
              this.otableData = this.dataList
              this.paginationData.totalCount = data.pageList.page.totalCount
            } else {
              this.dataList = []
              this.paginationData.totalCount = 0
            }
            this.dataListLoading = false
          })
        }
      })
    },

    // 重置
    resetHandle () {
      this.searchData = {}
      this.searchForm = {}
    },
    // 导出
    exportFile () {
      this.$refs['searchForm'].validate(valid => {
        if (valid) {
          let obj = Object.assign({}, this.searchData, this.searchForm)
          this.searchForm.dateRange.join()
          window.open(
            this.$http.tokens(
              'mws/mwsrptallorders/export',
              obj
            )
          )
        }
      })
    },

    // 表头内容过长处理
    renderHeader (h, g) {
      return renderHeaderUtil(h, g)
    }
  }

  // watch: {
  //   search: function (val, oldVal) {
  //     console.log('w', this.otableData)
  //     console.log('wss', val)

  //     this.dataList = this.otableData.filter(item => (~item.indexOf(val)))
  //     console.log('wq', this.dataList)
  //   }
  // }
}
</script>
<style lang="scss" scoped>
.el-form h3 {
  padding-left: 20px;
}
</style>






