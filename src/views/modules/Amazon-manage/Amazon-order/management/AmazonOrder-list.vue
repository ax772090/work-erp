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
                      data-value="id"
                      :isSelectChange="true"
                      @selectChange="channelIdExchange"
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
      <el-row>
        <el-form-item label="配送类型"
                      prop="fulfillmentChannel">
          <el-radio-group v-model="dataForm.fulfillmentChannel"
                          @change="filterDelivery">
            <el-radio-button label="01">卖家配送</el-radio-button>
            <el-radio-button label="02">亚马逊配送</el-radio-button>
          </el-radio-group>
        </el-form-item>
        <el-form-item class="fr">
          <label>
            最近一次更新时间:
            <span>{{lastUpdataTime}}</span>
          </label>
        </el-form-item>
      </el-row>
    </el-form>
    <!-- 表格 -->
    <el-table :data="dataForm.amazonOrderList"
              stripe
              border
              highlight-current-row
              :span-method="objectSpanMethod"
              v-loading="dataListLoading"
              element-loading-text="拼命加载中">
      <el-table-column align="left"
                       fixed
                       label="销售公司"
                       min-width="60">
        <template slot-scope="scope">
          <div class="table-column-flex">
            <div>
              <label>销售公司：</label>
              <span>{{scope.row.compName}}</span>
            </div>
            <div>
              <label>销售店铺：</label>
              <span>{{scope.row.channelName}}</span>
            </div>
          </div>
        </template>
      </el-table-column>
      <el-table-column align="left"
                       label="订单"
                       prop="channelName"
                       min-width="70">
        <template slot-scope="scope">
          <div class="table-column-flex">
            <div>
              <span class="business-order-span"
                    v-show="scope.row.isBusinessOrder">企业买家</span>
              <span class="prime-div"
                    v-show="scope.row.isPrime">
                <i class="el-icon-check"></i>
                <span>prime</span>
              </span>
            </div>
            <div>
              <label>订单编号：</label>
              <a @click="addOrUpdateHandle(scope.row.id)"
                 class="a-click-hover">{{scope.row.amazonOrderId}}</a>
            </div>
            <div>
              <label>订单日期：</label>
              <span>{{scope.row.orderDate}}</span>
            </div>
          </div>
        </template>
</el-table-column>
<el-table-column label="账号"
                 prop="sellerName"
                 align="left"></el-table-column>
<el-table-column align="left"
                 label="渠道"
                 min-width="50">
  <template slot-scope="scope">
  <div class="table-column-flex">
    <div>
      <label>销售渠道：</label>
      <span>{{scope.row.salesChannel}}</span>
    </div>
    <div>
      <label>配送渠道：</label>
      <span>{{scope.row.fulfillmentChannel}}</span>
    </div>
  </div>
</template>
</el-table-column>
<el-table-column label="订单详情"
                 prop="channelName"
                 min-width="120">
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
      <span>{{scope.row.qty}}</span>
    </div>
  </div>
</template>
</el-table-column>
<el-table-column align="left"
                 label="配送"
                 prop="channelName">
  <template slot-scope="scope">
  <div class="table-column-flex">
    <div>
      <label>配送方式：</label>
      <span>{{scope.row.shipmentServiceLevelCategory}}</span>
    </div>
    <div>
      <label>预计发货日期：</label>
      <span>{{scope.row.estimatedShipDate}}</span>
    </div>
    <div>
      <label>配送日期：</label>
      <span>{{scope.row.fulfillmentDate}}</span>
    </div>
  </div>
</template>
</el-table-column>
<el-table-column label="状态"
                 prop="orderStatus"
                 width="80"></el-table-column>
<el-table-column fixed="right"
                 label="操作"
                 width="110">
  <template slot-scope="scope">
  <el-dropdown :show-timeout="20">
    <span class="el-dropdown-link">
      操作
      <i class="el-icon-arrow-down el-icon--right"></i>
    </span>
    <el-dropdown-menu slot="dropdown"
                      v-if="isShow">
      <el-dropdown-item command="addOrUpdateHandle"
                        :disabled="true">转FBA发货</el-dropdown-item>
      <el-dropdown-item command="submitHandle"
                        :disabled="true">打印装箱标签</el-dropdown-item>
      <!-- 勿删-有用 -->
      <!-- <el-dropdown-item command="selfShipmentHandle"
                                @click.native="selfShipmentHandle(scope.row.id)"
                                v-if="isAuth('mws:listorder:whshipment')"
                                :disabled="!(scope.row.orderStatus === '待发货')">自发货出库</el-dropdown-item> -->
    </el-dropdown-menu>
    <el-dropdown-menu slot="dropdown"
                      v-if="!isShow">
      <el-dropdown-item command="addOrUpdateHandle">暂无操作</el-dropdown-item>
    </el-dropdown-menu>
  </el-dropdown>
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
<!-- 自发货出库 -->
<!-- 弹窗, 查看 -->
<salesRelease-search ref="salesReleaseSearch"
                     @refreshDataList="getDataList"></salesRelease-search>
</div>
</template>
<script>
// 详情页面
import OrderDetaile from './AmazonOrder-detail'
// 搜索
import erpSearchPanel from '@/components/erp-search-panel'
// 分页
import paginationAll from '@/components/erp-pagination/pagination-all'
// 销售出库（自发货出库）
import salesReleaseSearch from '@/views/modules/warehouse/FBA-voucher/sales-release/salesRelease-search'
import selectAll from '@/components/erp-select/select-all'

export default {
  components: {
    OrderDetaile,
    erpSearchPanel,
    paginationAll,
    salesReleaseSearch,
    selectAll
  },
  data () {
    return {
      //   spanArr: [], //合并行使用
      fulfillmentChannelSelect: 'MFN', // 亚马逊配送 (AFN) 或卖家自行配送 (MFN)
      orderDetaileVisible: false,
      isShow: true,
      dataListLoading: false,
      channelIdOptions: [],
      lastUpdataTime: '',
      dataForm: {
        channelId: '',
        orderDate: '',
        fulfillmentChannel: '01',
        amazonOrderList: []
      },
      dataRule: {
        channelId: [
          { required: true, message: '必填项', trigger: 'change' }
        ],
        orderDate: [
          { required: true, message: '请选择日期', trigger: 'change' }
        ]
      },
      // 数据过滤器
      searchData: {},

      // 下拉
      searchOptions: [
        {
          label: '订单日期',
          value: 'startDate,endDate',
          inputType: 'el-daterange'
        },
        {
          label: '配送日期',
          value: 'fulfillmentStartDate,fulfillmentEndDate',
          inputType: 'el-daterange'
        },
        {
          label: '订单编号',
          value: 'amazonOrderId',
          inputType: 'el-input'
        },
        {
          label: 'SKU',
          value: 'sku',
          inputType: 'el-input'
        },
        {
          label: '状态',
          value: 'orderStatus',
          inputType: 'el-select',

          httpUrl: '/basicData/queryDataDict2List',
          requestParams: { dataDictKey: 'FBA_ORDER_STATUS' },
          dataSource: 'fontMaps',
          title: 'orderStatus',
          dataValue: 'key',
          dataLabel: 'value',
          placeholder: '订单状态'
        },
        {
          label: '订单类型',
          value: 'isBusinessOrder',
          inputType: 'el-select',
          dataList: [{
            key: '1',
            value: 'B2B'
          }, {
            key: '0',
            value: 'B2C'
          }],
          title: 'isBusinessOrder',
          dataValue: 'key',
          dataLabel: 'value',
          placeholder: '订单类型'
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
    // this.getDataList();
  },
  methods: {
    getDataUrl () {
      this.$http
        .get(this.$http.adornUrl('list/combobox/ownChannel'), {
          params: { platformType: '' }
        })
        .then(({ data }) => {
          this.channelIdOptions = data.list
        })
    },
    //   配送类型
    filterDelivery (type) {
      if (type === '01') {
        this.isShow = true
        this.fulfillmentChannelSelect = 'MFN'
      } else {
        this.isShow = false
        this.fulfillmentChannelSelect = 'AFN'
      }
      this.getDataList(1)
    },
    // 新增 / 修改 /查看
    addOrUpdateHandle (id) {
      this.orderDetaileVisible = true
      this.$nextTick(() => {
        this.$refs.orderDetaile.init(id)
      })
    },
    // 获取数据列表
    getDataList (val) {
      //   有必填字段，先校验
      this.$refs['dataForm'].validate(valid => {
        if (valid) {
          this.$set(this.searchData, 'channelId', this.dataForm.channelId)
          if (val !== undefined) {
            this.paginationData.currPage = val
          }
          this.dataListLoading = true
          this.$http({
            url: this.$http.adornUrl(`mws/listorder/list`),
            method: 'get',
            params: Object.assign(
              {},
              this.paginationData,
              this.searchData === undefined ? {} : this.searchData,
              { fulfillmentChannel: this.fulfillmentChannelSelect }
            )
          }).then(({ data }) => {
            if (data && data.code === 0) {
              this.dataForm.amazonOrderList = data.pageList.dataList
              this.paginationData.totalCount = data.pageList.page.totalCount
              // 对后台返回的数据进行合并处理
              this.getSpanArr(this.dataForm.amazonOrderList)
              //   最近一次更新时间
              this.lastUpdataTime = data.lastUpdateTime
            } else {
              this.dataList = []
              this.paginationData.totalCount = 0
              this.lastUpdataTime = ''
              this.$notify.error({
                title: '错误',
                showClose: true,
                message: data.msg
              })
            }
            this.dataListLoading = false
          })
        } else {
          return false
        }
      })
    },
    channelIdExchange () {
      this.getDataList(1)
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
          if (data[i].amazonOrderId === data[i - 1].amazonOrderId) {
            this.spanArr[this.pos] += 1
            this.spanArr.push(0)
          } else {
            this.spanArr.push(1)
            this.pos = i
          }
        }
      }
    },

    // 自发货出库
    selfShipmentHandle: _.debounce(
      async function selfShipmentHandle (id) {
        this.$http({
          url: this.$http.adornUrl(`mws/listorder/whshipment/${id}`),
          method: 'get'
        }).then(({ data }) => {
          if (data && data.code === 0) {
            let selfShipmentList = data
            this.$refs.salesReleaseSearch.init(
              id,
              selfShipmentList,
              'amazonOrder'
            )
          } else {
            this.$notify.error({
              title: '错误',
              message: data.msg,
              duration: 5000
            })
          }
        })
      }, 1000, {
        leading: true,
        trailing: false
      }
    ),

    // 合并单元格
    objectSpanMethod ({ row, column, rowIndex, columnIndex }) {
      if (columnIndex !== 4) {
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
<style scoped>
/* 这是这个页面需要的样式，不要删除 */
.business-order-span {
  background-color: rgb(137, 132, 132);
  border-radius: 6px;
  color: white;
}
.prime-div {
  background-color: #f5f7fa;
  border-radius: 6px;
  margin-left: 5px;
}
.el-icon-check {
  font-weight: bold;
  color: #e5a334;
}
.prime-div span {
  font-size: 16px;
  color: #5a8ecb;
}
</style>


