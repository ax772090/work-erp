<template>
  <div>
    <el-form :inline="true"
             :model="dataForm"
             ref="dataForm"
             :rules="dataRule"
             class="demo-form-inline">
      <el-row class="mt-5">
        <el-form-item label="店铺名称"
                      prop="channelId">
          <select-all v-model="dataForm.channelId"
                      :listDataOption="channelIdOptions"
                      data-value="id"
                      data-label="name"
                      placeholder="选择店铺"></select-all>
        </el-form-item>
        <span class="fr">
          <el-button type="primary"
                     @click="paramsSet()"
                     v-if="isAuth('sys:config:getValueByKey')"><i class="iconfont erp-icon-canshushezhi"></i>参数设置</el-button>
          <el-button type="primary"
                     @click="pendingClaimExport()"
                     v-if="isAuth('mws:reportinventoryreceiptsdata:exportCompensateReceiptData')"><i class="iconfont erp-icon-daochu"></i>导出</el-button>

        </span>
      </el-row>
      <el-row @keyup.enter.native="getDataList()">
        <erp-search-panel :searchOptions="searchOptions"
                          selectedOption="amazonOrderId"
                          @search="getDataList(1)"
                          v-model="searchData"
                          :isResetHandle="true"
                          @resetHandle="resetHandle('dataForm')" />
      </el-row>
    </el-form>
    <el-tabs type="border-card"
             v-model="activeTabs"
             @tab-click="handleTabClick">
      <el-tab-pane label="退款未退货"
                   name="refundTab">
        <refund-sku ref="refundTab"
                    @refreshList="getDataList"></refund-sku>
      </el-tab-pane>
      <el-tab-pane label="丢失货件"
                   name="lostShipmentTab">
        <lost-shipment-sku ref="lostShipmentTab"
                           @refreshList="getDataList"></lost-shipment-sku>
      </el-tab-pane>
    </el-tabs>
    <!-- 参数设置 -->
    <params-set ref="paramsSet"
                v-if="paramsSetVisible"></params-set>
  </div>
</template>
<script>
// 退款未退货-sku
import refundSku from './refund-sku'
// 丢失货件-sku
import lostShipmentSku from './lost-shipment-sku'
import selectAll from '@/components/erp-select/select-all'
// 搜索
import erpSearchPanel from '@/components/erp-search-panel'
// 参数设置
import paramsSet from './time-params'
export default {
  components: {
    erpSearchPanel,
    refundSku,
    lostShipmentSku,
    paramsSet,
    selectAll
  },
  data () {
    return {
      tabTypeValue: 'COMPENSATE_REFUND_DATE',
      activeTabs: 'refundTab',
      paramsSetVisible: false,
      dataListLoading: false,
      channelIdOptions: [],
      dataForm: {
        channelId: '',
        sku: '',
        FBAShipmentID: ''
      },
      dataList: [],
      dataRule: {
        channelId: [{
          required: true,
          message: '必填项',
          trigger: 'change'
        }]
      },
      // 数据过滤器
      searchData: {},
      // 下拉
      searchOptions: [{
        label: '订单编号',
        value: 'amazonOrderId',
        inputType: 'el-input'
      }, {
        label: '退款日期',
        value: 'refundStartDate,refundEndDate',
        inputType: 'el-daterange'
      }, {
        label: '付款日期',
        value: 'payStartDate,payEndDate',
        inputType: 'el-daterange'
      }, {
        label: 'FBAShipmentID',
        value: 'FBAShipmentID',
        inputType: 'el-input'
      }, {
        label: 'FNSKU',
        value: 'fnsku',
        inputType: 'el-input'
      }],
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
    handleTabClick (tab, event) {
      if (tab.name === 'refundTab') {
        this.tabTypeValue = 'COMPENSATE_REFUND_DATE'
      } else if (tab.name === 'lostShipmentTab') {
        this.tabTypeValue = 'COMPENSATE_RECEIPT_DATE'
      }
      this.getDataList()
    },
    //   参数设置
    paramsSet () {
      this.paramsSetVisible = true
      this.$nextTick(() => {
        this.$refs.paramsSet.init()
      })
    },
    getDataUrl () {
      this.$http
        .get(this.$http.adornUrl('list/combobox/ownChannel'), {
          params: {
            platformType: ''
          }
        })
        .then(({
          data
        }) => {
          this.channelIdOptions = data.list
        })
    },
    // 获取数据列表
    getDataList (val) {
      // 有必填字段，先校验
      this.$refs['dataForm'].validate(valid => {
        if (valid) {
          this.$set(this.searchData, 'channelId', this.dataForm.channelId)
          this.$set(this.searchData, 'type', this.tabTypeValue)
          this.$nextTick(() => {
            this.$refs[this.activeTabs].init(this.searchData)
          })
        } else {
          return false
        }
      })
    },
    resetHandle (formName) {
      this.$refs[formName].resetFields()
    },
    // 导出
    pendingClaimExport () {
      //   有必填字段，先校验
      this.$refs['dataForm'].validate(valid => {
        if (valid) {
          window.open(
            this.$http.tokens(
              'mws/reportinventoryreceiptsdata/exportCompensateReceiptData',
              this.searchData
            )
          )
        }
      })
    }
  }
}
</script>
