<!-- 订单利润报表 -->
<template>
  <div class="mod-config">
    <el-form :model="dataForm"
             :rules="dataRule"
             ref="dataForm"
             @keyup.enter.native="getDataList()">
      <el-row>
        <el-form-item label="月份"
                      prop="yearMonth">
          <el-date-picker v-model="dataForm.yearMonth"
                          type="month"
                          value-format="yyyy-MM"
                          placeholder="选择月"></el-date-picker>
        </el-form-item>
      </el-row>
      <el-row>
        <erp-search-panel v-model="searchData"
                          :searchOptions="searchOptions"
                          @search="getDataList(1)"
                          :isResetHandle="true"
                          @resetHandle="resetHandle('dataForm')"></erp-search-panel>
      </el-row>
      <el-row>
        <el-button @click="recalculation()"
                   class="fl"
                   v-if="isAuth('fin:finsettledata:recalculation')"
                   type="primary">重算</el-button>
        <el-button @click="pigeonhole()"
                   class="fl"
                   type="primary">归档</el-button>
        <el-button @click="download()"
                   v-if="isAuth('fin:finsettledata:exportSettleData')"
                   class="fr"
                   type="primary"><i class="iconfont erp-icon-xiazai"></i>下载</el-button>
      </el-row>
    </el-form>
    <el-table stripe
              border
              class="headerTable"
              v-loading="dataListLoading"
              highlight-current-row
              max-height="800"
              :header-cell-style='tableHeaderColor'
              :data="dataList"
              @selection-change="selectionChangeHandle">
      <el-table-column type="selection"
                       align="center"
                       width="50">
      </el-table-column>
      <el-table-column prop="settleMonth"
                       label="结算月份"></el-table-column>
      <el-table-column prop="settleTime"
                       width="90"
                       label="结算时间"></el-table-column>
      <el-table-column prop="platform"
                       label="平台"></el-table-column>
      <el-table-column prop="sellerName"
                       width="120"
                       label="账号"></el-table-column>
      <el-table-column prop="channelName"
                       width="100"
                       label="店铺"></el-table-column>
      <el-table-column prop="market"
                       label="国家"></el-table-column>
      <el-table-column prop="settleType"
                       width="120"
                       label="结算类型"></el-table-column>
      <el-table-column prop="feeType"
                       label="费用类型"></el-table-column>
      <el-table-column prop="deliveryType"
                       label="发货类型"></el-table-column>
      <el-table-column prop="saleChannelName"
                       label="销售方"></el-table-column>
      <el-table-column prop="fulfillmentChannel"
                       label="配送渠道"></el-table-column>
      <el-table-column prop="amazonOrderId"
                       width="160"
                       label="平台订单号"></el-table-column>
      <el-table-column prop="sellerOrderId"
                       width="160"
                       label="seller_order_id"></el-table-column>
      <el-table-column prop="currency"
                       width="80"
                       label="币别"></el-table-column>
      <el-table-column prop="oriAmount"
                       label="原币金额"></el-table-column>
      <el-table-column prop="exchangeRate"
                       width="80"
                       label="汇率"></el-table-column>
      <el-table-column prop="sellerUser"
                       width="100"
                       label="产品销售员"></el-table-column>
      <el-table-column prop="directorName"
                       width="80"
                       label="销售主管"></el-table-column>
      <el-table-column prop="sellerSku"
                       width="100"
                       label="seller SKU"></el-table-column>
      <el-table-column prop="prodCode"
                       width="120"
                       label="自定义SKU"></el-table-column>
      <el-table-column prop="prodName"
                       width="140"
                       label="中文名称"></el-table-column>
      <el-table-column prop="firstCategory"
                       width="100"
                       label="一级分类"></el-table-column>
      <el-table-column prop="category"
                       width="100"
                       label="产品分类"></el-table-column>
      <el-table-column prop="qty"
                       width="80"
                       label="数量"></el-table-column>
      <el-table-column label="平台收入（原币）"
                       style="color">
        <el-table-column prop="oriInProd"
                         label="产品收入"
                         width="80">
        </el-table-column>
        <el-table-column prop="oriInShip"
                         label="运费收入"
                         width="80">
        </el-table-column>
        <el-table-column prop="oriInRefund"
                         label="退款金额"
                         width="80">
        </el-table-column>
        <el-table-column prop="oriInPacket"
                         label="包装收入"
                         width="80">
        </el-table-column>
        <el-table-column prop="oriInPromotion"
                         label="促销折扣"
                         width="80">
        </el-table-column>
      </el-table-column>
      <el-table-column label="平台支出（原币）"
                       style="color">
        <el-table-column prop="oriOutCommission"
                         label="佣金费"
                         width="80">
        </el-table-column>
        <el-table-column prop="oriOutFba"
                         label="FBA费用"
                         width="80">
        </el-table-column>
        <el-table-column prop="oriOutStorage"
                         label="仓储费"
                         width="80">
        </el-table-column>
        <el-table-column prop="oriOutSeckill"
                         label="秒杀"
                         width="80">
        </el-table-column>
        <el-table-column prop="oriOutAds"
                         label="广告费"
                         width="80">
        </el-table-column>
        <el-table-column prop="oriOutOther"
                         label="其他交易费用"
                         width="100">
        </el-table-column>
      </el-table-column>
      <el-table-column label="平台收入（人民币）">
        <el-table-column prop="cnyInProd"
                         label="产品收入"
                         width="80">
        </el-table-column>
        <el-table-column prop="cnyInShip"
                         label="运费收入"
                         width="80">
        </el-table-column>
        <el-table-column prop="cnyInRefund"
                         label="退款金额"
                         width="80">
        </el-table-column>
        <el-table-column prop="cnyInPacket"
                         label="包装收入"
                         width="80">
        </el-table-column>
        <el-table-column prop="cnyInPromotion"
                         label="促销折扣"
                         width="80">
        </el-table-column>
      </el-table-column>
      <el-table-column label="平台支出（人民币）"
                       style="color">
        <el-table-column prop="cnyOutCommission"
                         label="佣金费"
                         width="80">
        </el-table-column>
        <el-table-column prop="cnyOutFba"
                         label="FBA费用"
                         width="80">
        </el-table-column>
        <el-table-column prop="cnyOutStorage"
                         label="仓储费"
                         width="80">
        </el-table-column>
        <el-table-column prop="cnyOutSeckill"
                         label="秒杀"
                         width="80">
        </el-table-column>
        <el-table-column prop="cnyOutAds"
                         label="广告费"
                         width="80">
        </el-table-column>
        <el-table-column prop="cnyOutOther"
                         label="其他交易费用"
                         width="100">
        </el-table-column>
      </el-table-column>
      <el-table-column label="其他（人民币）">
        <el-table-column prop="otherPur"
                         label="采购成本"
                         width="80">
        </el-table-column>
        <el-table-column prop="otherCheck"
                         label="测评费"
                         width="80">
        </el-table-column>
        <el-table-column prop="otherWh"
                         label="海外仓费用"
                         width="100">
        </el-table-column>
        <el-table-column prop="otherFillment"
                         label="头程运费"
                         width="80">
        </el-table-column>
        <el-table-column prop="otherVat"
                         label="VAT税费"
                         width="80">
        </el-table-column>
        <el-table-column prop="otherIncidental"
                         label="其他销售费用"
                         width="100">
        </el-table-column>
      </el-table-column>
      <el-table-column prop="cnyTotal"
                       width="100"
                       label="销售毛利润"></el-table-column>
    </el-table>
    <!-- 分页 -->
    <el-row>
      <pagination-all v-model="paginationData"
                      @paginationChangeHandle="getDataList"></pagination-all>
    </el-row>
  </div>
</template>
<script>
// 搜索
import erpSearchPanel from '@/components/erp-search-panel'
import selectAll from '@/components/erp-select/select-all'
// 分页
import paginationAll from '@/components/erp-pagination/pagination-all'
// 表头处理
import { renderHeaderUtil } from '@/utils/index.js'
import { initData } from '@/mixins/initData.js'
export default {
  mixins: [initData],
  components: {
    erpSearchPanel,
    paginationAll,
    selectAll
  },
  data () {
    return {
      dataForm: {
        yearMonth: ''  // 月份
      },
      // 数据过滤器
      searchData: {},
      accountOptions: [], // 店铺账号
      // 下拉
      searchOptions: [
        {
          label: '店铺',
          value: 'channelId',
          inputType: 'el-select',
          httpUrl: 'list/combobox/ownChannel',
          dataSource: 'list',
          dataValue: 'id',
          dataLabel: 'name',
          placeholder: '店铺'
        },
        {
          label: '账号',
          value: 'sellerId',
          inputType: 'el-select',
          httpUrl: 'basic/basicseller/listcombobox',
          dataSource: 'list',
          dataValue: 'sellerId',
          dataLabel: 'name',
          placeholder: '账号'
        },
        {
          label: '结算类型',
          value: 'settleType',
          inputType: 'el-select',
          dataValue: 'settleType',
          dataList: [{
            settleType: 'refundEvent'
          }, {
            settleType: 'shipmentEvent'
          }, {
            settleType: 'chargebackEvent'
          }, {
            settleType: 'guaranteeClaimEvent'
          }, {
            settleType: 'Adjustment'
          }, {
            settleType: 'Service fee'
          }, {
            settleType: 'Coupon'
          }, {
            settleType: 'Product Advertising'
          }, {
            settleType: 'ReviewEnrollment'
          }, {
            settleType: 'listing Deal'
          }],
          dataLabel: 'settleType',
          placeholder: '结算类型'
        },
        {
          label: '平台订单号',
          value: 'amazonOrderId',
          inputType: 'el-input'
        },
        {
          label: '渠道SKU',
          value: 'sellerSku',
          inputType: 'el-input'
        },
        {
          label: '自定义SKU',
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
          label: '产品分类',
          value: 'categoryId',
          inputType: 'el-cascader',
          httpUrl: 'basic/basiccategory/treeList',
          requestParams: { id: '' },
          dataSource: 'treeList',
          title: 'categoryList',
          dataValue: 'id',
          dataLabel: 'name',
          dataChildren: 'subCategoryNode',
          placeholder: '所属分类'
        }
      ],
      dataList: [],
      dataListLoading: false,
      dataListSelections: [],
      editorVisible: false,
      dataRule: {
        yearMonth: [{
          required: true,
          message: '必填项',
          trigger: 'change'
        }]
      }
    }
  },

  created () {
    this.getDataUrl()
  },
  methods: {
    // 表头内容过长处理
    renderHeader (h, g) {
      return renderHeaderUtil(h, g)
    },
    // 获取数据列表
    getDataList (val) {
      // 有必填字段，先校验
      this.$refs['dataForm'].validate(valid => {
        if (valid) {
          if (val) {
            this.paginationData.currPage = val
          }
          this.$set(this.searchData, 'yearMonth', this.dataForm.yearMonth)
          console.log('ss', this.searchData)
          this.dataListLoading = true
          this.$http({
            url: this.$http.adornUrl('fin/finsettledata/list'),
            method: 'get',
            params:
              this.searchData === undefined
                ? this.paginationData
                : Object.assign({}, this.paginationData, this.searchData)
          }).then(({ data }) => {
            if (data && data.code === 0) {
              this.dataList = data.pageList.dataList
              this.paginationData.totalCount = data.pageList.page.totalCount
            } else {
              this.dataList = []
              this.paginationData.totalCount = 0
            }
            this.dataListLoading = false
          })
        } else {
          return false
        }
      })
    },
    // 修改table header的背景色
    tableHeaderColor ({ row, column, rowIndex, columnIndex }) {
      if (rowIndex === 0 && (columnIndex === 29 || columnIndex === 25 || columnIndex === 26 || columnIndex === 27 || columnIndex === 28)) {
        return 'background-color: #E4E4E4;color: #17b3a3;padding:4px 5px'
      } else {
        return 'background:#E4E4E4;color:#000;padding:4px 5px'
      }
    },
    resetHandle (formName) {
      this.$refs[formName].resetFields()
    },
    getDataUrl () {
      // 店铺账号
      this.$http
        .get(this.$http.adornUrl('list/combobox/ownChannel'), {
          params: { platformType: '' }
        })
        .then(({ data }) => {
          this.accountOptions = data.list
        })
    },
    // 多选
    selectionChangeHandle (val) {
      this.dataListSelections = val
    },
    // 重算
    recalculation () {
      // 有必填字段，先校验
      this.$refs['dataForm'].validate(valid => {
        if (valid) {
          let ids = []
          for (const item of this.dataListSelections) {
            ids.push(item.id)
          }
          Object.assign(this.searchData, { ids: ids })
          if (this.dataForm) {
            Object.assign(this.searchData, this.dataForm)
          }
          this.$http({
            url: this.$http.adornUrl('fin/finsettledata/checkInProcess'),
            method: 'get',
            params: this.searchData
          }).then(({ data }) => {
            if (data && data.code === 0) {
              this.$confirm(`是否需要对${this.dataForm.yearMonth}的数据进行重算?`, '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
              }).then(() => {
                this.$http({
                  url: this.$http.adornUrl('fin/finsettledata/recalculation'),
                  method: 'post',
                  data: this.searchData
                }).then(({ data }) => {
                  if (data && data.code === 0) {
                    this.$notify({
                      title: '提示',
                      type: 'success',
                      message: '重算预计需要5分钟',
                      duration: 3000
                    })
                  } else {
                    this.$notify.error({
                      title: '错误',
                      message: data.msg,
                      duration: 5000
                    })
                  }
                  this.dataListLoading = false
                })
              }).catch(() => {
                this.$message({
                  type: 'warning',
                  message: '已取消重算'
                })
              })
            } else {
              this.$notify.error({
                title: '错误',
                message: data.msg,
                duration: 5000
              })
            }
            this.dataListLoading = false
          })
        } else {
          return false
        }
      })
    },
    // 归档
    pigeonhole () {
      // 有必填字段，先校验
      this.$refs['dataForm'].validate(valid => {
        if (valid) {
          this.$confirm(`是否需要对${this.dataForm.yearMonth}的数据进行归档，归档之后则不能再进行重算?`, '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            this.$http({
              url: this.$http.adornUrl('fin/finsettledata/file'),
              method: 'get',
              params: this.searchData
            }).then(({ data }) => {
              if (data && data.code === 0) {
                 this.$notify({
                  type: 'success',
                  message: '归档成功',
                  duration: 5000
                })
              } else {
                this.$notify.error({
                  title: '错误',
                  message: data.msg,
                  duration: 5000
                })
              }
              this.dataListLoading = false
            })
          }).catch(() => {
            this.$message({
              type: 'warning',
              message: '已取消归档'
            })
          })
        }
      })
    },
    download () {
      // 有必填字段，先校验
      this.$refs['dataForm'].validate(valid => {
        if (valid) {
          this.$set(this.searchData, 'yearMonth', this.dataForm.yearMonth)
          window.open(
            this.$http.tokens(
              'fin/finsettledata/exportSettleData', this.searchData
            )
          )
        }
      })
    }
  }
}
</script>
<style lang="scss" scoped>
.color {
  color: #17b3a3;
}
</style>



