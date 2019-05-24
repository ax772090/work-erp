<template>
  <div>
    <el-form :inline="true"
             :model="dataForm"
             :rules="dataRule"
             ref="dataForm"
             @keyup.enter.native="getDataList()"
             class="demo-form-inline">
      <el-row>
        <el-form-item label="店铺名称"
                      prop="channelId">
          <select-all v-model="dataForm.channelId"
                      :listDataOption="channelIdOptions"
                      :isSelectChange="true"
                      @selectChange="channelIdExchange"
                      data-value="id"
                      data-label="name"
                      placeholder="选择店铺"></select-all>
        </el-form-item>
      </el-row>
      <el-row>
        <erp-search-panel :searchOptions="searchOptions"
                          @search="getDataList(1)"
                          v-model="searchData"
                          :isResetHandle="true"
                          @resetHandle="resetHandle('dataForm')" />
      </el-row>
    </el-form>
    <!-- 表格 -->
    <el-table :data="dataForm.multiChanelOrderList"
              stripe
              border
              highlight-current-row
              :span-method="objectSpanMethod"
              v-loading="dataListLoading">
      <el-table-column align="left"
                       fixed
                       label="销售公司"
                       prop="compName"
                       min-width="50"></el-table-column>
      <el-table-column align="left"
                       label="账号"
                       prop="sellerName"></el-table-column>
      <el-table-column align="left"
                       label="订单"
                       min-width="70">
        <template slot-scope="scope">
          <div class="table-column-flex">
            <div>
              <label>发货店铺：</label>
              <span>{{scope.row.channelName}}</span>
            </div>
            <div>
              <label>源平台订单号：</label>
              <span>{{scope.row.sellerFulfillmentOrderId}}</span>
            </div>
            <div>
              <label>订单编号：</label>
              <a @click="addOrUpdateHandle(scope.row.sellerFulfillmentOrderId,'check')"
                 class="a-click-hover">{{scope.row.displayableOrderId}}</a>
            </div>
            <div>
              <label>订单日期：</label>
              <span>{{scope.row.receivedDate}}</span>
            </div>
          </div>
        </template>
      </el-table-column>
      <!-- <el-table-column   label="订单日期" prop="receivedDate"></el-table-column> -->
      <el-table-column label="订单详情"
                       min-width="100">
        <template slot-scope="scope">
          <div class="table-row-flex">
            <div>
              <strong>SKU：</strong>
              <span>{{scope.row.sku}}</span>
            </div>
            <div>
              <strong>ASIN：</strong>
              <span>{{scope.row.asin}}</span>
            </div>
            <div>
              <strong>数量：</strong>
              <span>{{scope.row.quantity}}</span>
            </div>
          </div>
        </template>
      </el-table-column>
      <el-table-column align="left"
                       label="配送">
        <template slot-scope="scope">
          <div class="table-column-flex">
            <div>
              <label>配送方式：</label>
              <span>{{scope.row.shippingSpeedCategory}}</span>
            </div>
            <div>
              <label>预计发货日期：</label>
              <span>{{scope.row.estimatedShipDateTime}}</span>
            </div>
            <div>
              <label>配送时间：</label>
              <span>{{scope.row.estimatedArrivalDateTime}}</span>
            </div>
          </div>
        </template>
      </el-table-column>
      <el-table-column align="left"
                       label="状态"
                       prop="orderStatus">
        <template slot-scope="scope">
          <div class="table-column-flex">
            <div>
              <label>同步Amazon状态：</label>
              <span>{{scope.row.bSync?'同步成功':'同步失败'}}</span>
            </div>
            <div>
              <label>配送状态：</label>
              <span>{{scope.row.fulfillmentOrderStatus}}</span>
            </div>
          </div>
        </template>
      </el-table-column>
    </el-table>

    <el-row>
      <pagination-all @paginationChangeHandle="getDataList"
                      v-model="paginationData"></pagination-all>
    </el-row>
    <!-- 弹窗, 新增 / 修改 -->
    <order-detaile v-if="orderDetaileVisible"
                   ref="orderDetaile"
                   @refreshDataList="getDataList"></order-detaile>
  </div>
</template>
<script>
// 详情页面
import OrderDetaile from './multiChannel-addEdit'
// 搜索
import erpSearchPanel from '@/components/erp-search-panel'
// 分页
import paginationAll from '@/components/erp-pagination/pagination-all'
import selectAll from '@/components/erp-select/select-all'

export default {
  components: {
    OrderDetaile,
    erpSearchPanel,
    paginationAll,
    selectAll
  },
  data () {
    return {
      orderDetaileVisible: false,
      isShow: true,
      dataListLoading: false,
      channelIdOptions: [],
      dataForm: {
        channelId: '',
        orderDate: '',
        updataTime: '',
        multiChanelOrderList: []
      },
      dataRule: {
        channelId: [
          { required: true, message: '必填项', trigger: 'change' }
        ]
      },
      // 数据过滤器
      searchData: {},

      // 下拉
      searchOptions: [
        // {
        //   label: '发货店铺',
        //   value: 'channelId',
        //   inputType: 'el-select',
        //   httpUrl: 'basic/basicchannel/listcombobox',
        //   dataSource: 'list',
        //   dataValue: 'id',
        //   dataLabel: 'name',
        //   placeholder: '店铺'
        // },
        {
          label: '订单日期',
          value: 'startDate,endDate',
          inputType: 'el-daterange'
        },
        {
          label: '源订单编号',
          value: 'sellerFulfillmentOrderId',
          inputType: 'el-input'
        },
        {
          label: '订单编号',
          value: 'displayableOrderId',
          inputType: 'el-input'
        },
        {
          label: '配送状态',
          value: 'fulfillmentOrderStatus',
          inputType: 'el-select',

          httpUrl: '/basicData/queryDataDict2List',
          requestParams: { dataDictKey: 'FBA_FULFILLMENT_STATUS' },
          dataSource: 'fontMaps',
          title: 'fulfillmentOrderStatus',
          dataValue: 'key',
          dataLabel: 'value',
          placeholder: '配送状态'
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
  created () {
    this.getDataUrl()
    // this.getDataList()
  },
  methods: {
    getDataUrl () {
      this.$http
        .get(this.$http.adornUrl(`list/combobox/ownChannel`), {
          params: { platformType: '' }
        })
        .then(({ data }) => {
          this.channelIdOptions = data.list
        })
    },
    // 新增 / 修改 /查看
    addOrUpdateHandle (id, type) {
      this.orderDetaileVisible = true
      this.$nextTick(() => {
        this.$refs.orderDetaile.init(id, type)
      })
    },
    // 获取数据列表
    getDataList (val) {
      //   有必填字段，先校验
      this.$refs['dataForm'].validate(valid => {
        if (valid) {
          this.$set(this.searchData, 'channelId', this.dataForm.channelId)
          if (val != undefined) {
            this.paginationData.currPage = val
          }
          this.dataListLoading = true
          this.$http({
            url: this.$http.adornUrl(`mws/fulfillmentlistorder/list`),
            method: 'get',
            params: Object.assign(
              {},
              this.paginationData,
              this.searchData == undefined ? {} : this.searchData
            )
          }).then(({ data }) => {
            if (data && data.code === 0) {
              this.dataForm.multiChanelOrderList = data.pageList.dataList
              this.paginationData.totalCount = data.pageList.page.totalCount
              // 对后台返回的数据进行合并处理
              this.getSpanArr(this.dataForm.multiChanelOrderList)
            } else {
              this.dataForm.multiChanelOrderList = []
              this.paginationData.totalCount = 0
            }
            this.dataListLoading = false
          })
        } else {
          return false
        }
      })
    },
    resetHandle (formName) {
      this.$refs[formName].resetFields()
    },
    getSpanArr (data) {
      this.spanArr = []
      for (var i = 0; i < data.length; i++) {
        if (i === 0) {
          this.spanArr.push(1)
          this.pos = 0
        } else {
          // 判断当前元素与上一个元素是否相同
          if (
            data[i].sellerFulfillmentOrderId ===
            data[i - 1].sellerFulfillmentOrderId
          ) {
            this.spanArr[this.pos] += 1
            this.spanArr.push(0)
          } else {
            this.spanArr.push(1)
            this.pos = i
          }
        }
      }
    },
    channelIdExchange () {
      this.getDataList(1)
    },
    // 合并单元格
    objectSpanMethod ({ row, column, rowIndex, columnIndex }) {
      if (columnIndex != 2) {
        // 这里添加处理逻辑Todo
        const _row = this.spanArr[rowIndex]
        const _col = _row > 0 ? 1 : 0
        return {
          rowspan: _row,
          colspan: _col
        }
      }
    }
  }
}
</script>


