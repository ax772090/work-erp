<!-- 销售listing分析 -->
<template>
  <div>
    <el-form :inline="true"
             :model="dataForm"
             ref="dataForm">
      <el-form-item label="查看">
        <select-all v-model="dataForm.check"
                    :listDataOption="orderTypeOptions"
                    data-value="key"
                    data-label="value"
                    placeholder="关注"
                    class="fiter-class"></select-all>
      </el-form-item>
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
                    class="fiter-class"></select-all>
      </el-form-item>
      <el-form-item label="小组">
        <select-all v-model="dataForm.group"
                    :listDataOption="orderTypeOptions"
                    data-value="key"
                    data-label="value"
                    placeholder="小组"
                    class="fiter-class"></select-all>
      </el-form-item>
      <el-form-item label="负责人">
        <select-all v-model="dataForm.leader"
                    :listDataOption="orderTypeOptions"
                    data-value="key"
                    data-label="value"
                    placeholder="小组"
                    class="fiter-class"></select-all>
      </el-form-item>
      <el-form-item label="分类">
        <select-all v-model="dataForm.classify"
                    :listDataOption="orderTypeOptions"
                    data-value="key"
                    data-label="value"
                    placeholder="分类"
                    class="fiter-class"></select-all>
      </el-form-item>
      <el-form-item label="SKU">
        <el-input v-model="dataForm.sku"
                  placeholder=""
                  class="fiter-class"></el-input>
      </el-form-item>
      <el-form-item label="产品名称">
        <el-input v-model="dataForm.prodName"
                  placeholder=""
                  class="fiter-class"></el-input>
      </el-form-item>
      <el-form-item label="状态">
        <select-all v-model="dataForm.state"
                    :listDataOption="orderTypeOptions"
                    data-value="key"
                    data-label="value"
                    placeholder="状态"
                    class="fiter-class"></select-all>
      </el-form-item>
      <el-form-item label="">
        <el-button type="primary"
                   @click="submitForm('dataForm')"><i class="iconfont erp-icon-sousuo"></i>搜索</el-button>
        <el-button type="primary"
                   @click="resetForm('dataForm')"><i class="iconfont erp-icon-chongzhi"></i>重置</el-button>
        <el-button type="primary"
                   @click="excelExport"><i class="iconfont erp-icon-xiazai"></i>Excel</el-button>
      </el-form-item>
    </el-form>
    <el-table stripe
              border
              highlight-current-row
              :header-cell-class-name="headCellName"
              :cell-class-name='cellClassDiy'
              max-height="800"
              :data="dataList"
              v-loading="dataListLoading">
      <el-table-column prop="type"
                       label="关注"></el-table-column>
      <el-table-column prop="channelName"
                       label="渠道"></el-table-column>
      <el-table-column prop="group"
                       label="小组"></el-table-column>
      <el-table-column prop="class"
                       label="分类"></el-table-column>
      <el-table-column prop="prodName"
                       label="产品名称"></el-table-column>
      <el-table-column prop="sku"
                       label="E登SKU"></el-table-column>
      <el-table-column prop="amount"
                       label="负责人"></el-table-column>
      <el-table-column prop="fba"
                       label="FBA可售库存">
        <template slot-scope="scope">
          <el-popover placement="top"
                      trigger="hover"
                      width='200'>
            <p class="">{{scope.row.prodName}}</p>
            <!-- <p style="text-align: left"> -->
            <el-row class="row-color-fba">
              <el-col :span="8">
                <div>可售</div>
              </el-col>
              <el-col :span="8">
                <div>不可售</div>
              </el-col>
              <el-col :span="8">
                <div>预留</div>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="8">
                <span>975</span>
              </el-col>
              <el-col :span="8">
                <span>0</span>
              </el-col>
              <el-col :span="8">
                <span>0</span>
              </el-col>
            </el-row>
            <!-- </p> -->
            <div slot="reference"
                 class="fba-column">{{scope.row.fba}}</div>
          </el-popover>
        </template>
      </el-table-column>
      <el-table-column prop="price"
                       label="售价"
                       align='center'>
        <template slot-scope="scope">
          <el-popover placement="top"
                      trigger="click"
                      width='300'
                      v-model="visiblePrice[scope.$index]">
            <p>请输入数值</p>
            <el-row>
              <el-input v-model="scope.row.price"
                        size="small"
                        placeholder=""
                        clearable
                        style='width:150px;'></el-input>
              <el-button type="primary"
                         icon="el-icon-check"
                         circle
                         @click="okHandle(scope.$index)"></el-button>
              <el-button icon="el-icon-close"
                         circle
                         @click="cancelPriceHandle(scope.$index)"></el-button>
            </el-row>
            <div slot="reference">
              <a class="a-click-hover">{{scope.row.price}}</a>
            </div>
          </el-popover>
        </template>
      </el-table-column>
      <el-table-column prop="pretax"
                       label="预测毛利率">
        <template slot-scope="scope">
          <div class='overflow-hidden'>
            <span>{{scope.row.pretax}}</span>
            <span class="ml-10 fr"
                  style="cursor: pointer;"><i class="iconfont erp-icon-xiazai"
                 @click="calculatorClick(scope.row)"></i></span>
          </div>
        </template>
      </el-table-column>
      <el-table-column prop="pretax"
                       label="退款率"></el-table-column>
      <el-table-column prop="pretax"
                       label="退货率"></el-table-column>
      <el-table-column prop="pretax"
                       label="采购"></el-table-column>
      <el-table-column prop="pretax"
                       label="头程"></el-table-column>
      <el-table-column prop="pretax"
                       label="运费"></el-table-column>
      <el-table-column prop="pretax"
                       label="广告"></el-table-column>
      <el-table-column prop="pretax"
                       label="仓租"></el-table-column>
      <el-table-column prop="pretax"
                       label="7天日均"></el-table-column>
      <el-table-column prop="pretax"
                       label="15天日均"></el-table-column>
      <el-table-column prop="aveDay28"
                       label="28天日均">
        <template slot-scope="scope">
          <el-popover placement="top"
                      trigger="click"
                      width='200'>
            <p class="">{{scope.row.prodName}}</p>
            <!-- <p style="text-align: left"> -->
            <el-row class="row-color-fba">
              <el-col :span="8">
                <div>可售</div>
              </el-col>
              <el-col :span="8">
                <div>不可售</div>
              </el-col>
              <el-col :span="8">
                <div>预留</div>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="8">
                <span>975</span>
              </el-col>
              <el-col :span="8">
                <span>0</span>
              </el-col>
              <el-col :span="8">
                <span>0</span>
              </el-col>
            </el-row>
            <!-- </p> -->
            <div slot="reference"
                 class="aveday-column">{{scope.row.fba}}</div>
          </el-popover>
        </template>
      </el-table-column>
      <el-table-column prop="pretax"
                       label="当前销售额"></el-table-column>
      <el-table-column prop="pretax"
                       label="本月目标/天"></el-table-column>
      <el-table-column prop="pretax"
                       label="可贡献销售额/元"></el-table-column>
    </el-table>
    <el-row>
      <pagination-all v-model="paginationData"
                      @paginationChangeHandle="getDataList"></pagination-all>
    </el-row>

    <xls-export ref="xlsExport"
                title="数据导出"
                @refreshDataList="getDataList"></xls-export>
    <!-- 计算器 -->
    <cal-dialog ref="calDialog"></cal-dialog>
  </div>
</template>

<script>
import erpSearchPanel from '@/components/erp-search-panel'
import paginationAll from '@/components/erp-pagination/pagination-all'
import selectAll from '@/components/erp-select/select-all'
import calDialog from './calculator-dialog'

// 导出
import xlsExport from '@/components/xls-export/index'
export default {
  components: {
    erpSearchPanel,
    paginationAll,
    selectAll,
    calDialog,
    xlsExport
  },
  props: ['value'],
  data () {
    return {
      orderTypeOptions: [],
      oldOptions: [],
      channelIdOptions: [],
      visiblePrice: [],
      dataForm: {
        check: '',
        channelId: '',
        group: '',
        leader: '',
        classify: '',
        sku: '',
        prodName: '',
        state: ''
      },
      dataList: [],
      dataListMock: [
        {
          channelName: 'safdsa',
          group: 'fasd',
          class: 'dafd',
          prodName: 'dfasd',
          sku: 'dasf',
          amount: 'wx',
          fba: '50',
          price: '50',
          pretax: '20'

        },
        {
          channelName: 'safdsa',
          group: 'fasd',
          class: 'dafd',
          prodName: 'dfasd',
          sku: 'dasf',
          amount: 'wx',
          fba: '10',
          price: '10',
          pretax: '210'

        }],
      dataListLoading: false,
      // 数据过滤器
      searchData: {},

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
  created () {
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
      this.getDataList(1)
    },
    resetForm (formName) {
      this.$refs[formName].resetFields()
      this.getDataList(1)
    },
    // 获取数据列表
    getDataList (val) {
      if (val != undefined) {
        this.paginationData.currPage = val
      }
      this.dataList = this.dataListMock// data.pageList.dataList

      // this.dataListLoading = true
      // this.$http({
      //   url: this.$http.adornUrl('fin/platformfee/list'),
      //   method: 'post',
      //   params: Object.assign({},
      //     this.paginationData,
      //     this.searchData == undefined ? {} : this.searchData
      //   )
      // }).then(({
      //   data
      // }) => {
      //   if (data && data.code === 0) {
      //     this.dataList = data.pageList.dataList
      //     this.paginationData.totalCount = data.pageList.page.totalCount
      //   } else {
      //     this.dataList = []
      //     this.paginationData.totalCount = 0
      //     this.$notify.error({
      //       title: '错误',
      //       message: data.msg,
      //       duration: 5000
      //     })
      //   }
      //   this.dataListLoading = false
      // })
    },

    channelIdExchange (val) {
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
    headCellName ({ row, column, rowIndex, columnIndex }) {
      if (columnIndex === 7 || columnIndex === 9) {
        return 'head-column-cell'
      }
      return ''
    },
    cellClassDiy ({ row, column, rowIndex, columnIndex }) {
      if (columnIndex === 4 || columnIndex === 5 || columnIndex === 8) {
        return 'head-column-cell'
      }
      return ''
    },

    // 计算器点击
    calculatorClick (row) {
      this.$nextTick(() => {
        this.$refs.calDialog.init(row)
      })
    },
    okHandle (index) {
      this.$set(this.visiblePrice, index, false)
    },
    cancelPriceHandle (index) {
      this.$set(this.visiblePrice, index, false)
    },

    // 导出
    excelExport () {
      this.$nextTick(() => {
        this.$refs.xlsExport.init({
          exportUrl: 'fin/platformfee/export',
          searchData: this.searchData
        })
      })
    }
  }

}
</script>
<style scoped lang='scss'>
.fiter-class {
  width: 140px;
}
p {
  padding: 0;
  margin: 0;
  margin-bottom: 10px;
}
.row-color-fba {
  background-color: #ea9441;
  color: #fff;
}
.fba-column {
  text-align: center;
  width: 50px;
  line-height: 20px;
  border-radius: 10px;
  background-color: #ea9441;
  color: #fff;
}
.aveday-column {
  text-align: center;
  width: 50px;
  line-height: 20px;
  border-radius: 10px;
  background-color: #ea4c41;
  color: #fff;
}
</style>
<style>
.head-column-cell {
  color: #3a84d9 ;
}
</style>

