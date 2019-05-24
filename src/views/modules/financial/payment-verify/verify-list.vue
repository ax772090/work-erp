<!-- 付款核销 -->
<template>
  <div>
    <el-form :model="dataForm"
             :rules="dataRule"
             label-width="90px"
             ref="dataForm">
      <el-row>
        <el-col :span="6">
          <el-form-item label="核销日期"
                        prop="verifyDate">
            <el-date-picker v-model="dataForm.verifyDate"
                            type="date"
                            value-format="yyyy-MM-dd"
                            placeholder="年/月/日"></el-date-picker>
          </el-form-item>
          <el-form-item label="核销类型"
                        prop="verifyType">
            <select-all v-model="dataForm.verifyType"
                        :listDataOption="verifyTypeOption"
                        data-value="key"
                        data-label="value"
                        placeholder='选择核销类型'
                        :isSelectChange="true"
                        @selectChange='verifyTypeChange'></select-all>
          </el-form-item>
          <!-- <el-form-item label="">
            <el-tooltip :content="verifyTip"
                        placement="bottom"
                        effect="dark">
              <el-button type="primary"
                         @click="verifyHandle('dataForm')"
                         v-if="isAuth('fin:paymentverifyrecord:verify')"><i class="iconfont erp-icon-shenhe"></i>核销</el-button>
            </el-tooltip>
          </el-form-item> -->
        </el-col>
        <el-col :span="6">
          <el-form-item label="结算公司"
                        prop="compId">
            <select-all v-model="dataForm.compId"
                        :listDataOption="compIdOption"
                        data-value="orgId"
                        data-label="name"
                        placeholder='选择结算公司'
                        :isSelectChange="true"
                        @selectChange="requireChange"></select-all>
          </el-form-item>
          <el-form-item label="预付款单号"
                        prop="prePayCode">
            <select-seach v-model="dataForm.prePayCode"
                          httpUrl="fin/finpopayment/queryForComplete"
                          requestParamsKey="code"
                          httpMethod="get"
                          data-label="prePayCode"
                          data-value="prePayCode"
                          data-source="list"
                          placeholder='搜索单号'
                          :isDisabled='prePayDisable'
                          :isSelectChange="true"
                          @selectChange="prePayCodeChange"
                          @clearHandle='clearHandle'></select-seach>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="供应商"
                        prop="supplier">
            <select-seach v-model="dataForm.supplier"
                          httpUrl="basic/basicsupplier/list-used?b_used=true"
                          httpMethod="get"
                          data-label="name"
                          data-value="id"
                          data-source="list"
                          placeholder='选择供应商'
                          isSelectChange="true"
                          @selectChange="requireChange"></select-seach>
          </el-form-item>
          <el-form-item label="付款金额"
                        prop="prePayAmount">
            <el-input v-model="dataForm.prePayAmount"
                      type="Number"
                      placeholder="录入已付款金额"
                      :disabled="payAmountDis"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="结算币种"
                        prop="currency">
            <select-all v-model="dataForm.currency"
                        :listDataOption="currencyIdOptions"
                        data-value="id"
                        data-label="name"
                        placeholder="选择结算币种"
                        :isSelectChange="true"
                        @selectChange="requireChange"></select-all>
          </el-form-item>
          <el-form-item label="核销金额"
                        prop="verifyMoney">
            <el-input v-model="dataForm.verifyMoney"
                      placeholder=""
                      :disabled="true"></el-input>
          </el-form-item>
          <el-form-item label="">
            <el-tooltip :content="verifyTip"
                        placement="bottom"
                        effect="dark">
              <el-button type="primary"
                         @click="verifyHandle('dataForm')"
                         v-if="isAuth('fin:paymentverifyrecord:verify')"><i class="iconfont erp-icon-shenhe"></i>核销</el-button>
            </el-tooltip>
          </el-form-item>
        </el-col>
      </el-row>
      <div class="line"><span></span></div>
      <el-row>
        <div class="item">选择核销明细数据</div>
      </el-row>
      <el-form :model="filterForm"
               :inline="true"
               ref="filterForm">
        <el-row>
          <el-form-item label=""
                        prop="tradingType">
            <select-all v-model="filterForm.tradingType"
                        :listDataOption="orderTypeOptions"
                        data-value="key"
                        data-label="value"
                        placeholder="选择来源单据"
                        :isSelectChange="true"
                        @selectChange="filterFormChange"
                        style="width:150px;"></select-all>
          </el-form-item>
          <el-form-item label=""
                        prop="dateRange">
            <el-date-picker v-model="filterForm.dateRange"
                            type="daterange"
                            range-separator="-"
                            start-placeholder="开始日期"
                            end-placeholder="结束日期"
                            value-format="yyyy-MM-dd"
                            placeholder="选择日期范围"
                            @change="filterFormChange"
                            style="width:250px;">
            </el-date-picker>
          </el-form-item>
          <el-form-item label=""
                        prop="contractCode">
            <el-input v-model="filterForm.contractCode"
                      placeholder="输入合同号"
                      clearable
                      @change="filterFormChange"
                      style="width:180px;"></el-input>
          </el-form-item>
          <el-form-item label=""
                        prop="prodId">
            <select-seach v-model="filterForm.prodId"
                          httpUrl="/prod/prodbasic/queryForComplete"
                          httpMethod="get"
                          requestParamsKey="code"
                          data-label="code"
                          data-value="id"
                          data-label-right='name_ch'
                          placeholder="输入产品编码/名称"
                          data-source="list"
                          :showName='true'
                          isSelectChange="true"
                          @selectChange="filterFormChange"
                          style="width:180px;"></select-seach>
          </el-form-item>
          <el-form-item>
            <el-button type="primary"
                       @click="submitForm('filterForm')"><i class="iconfont erp-icon-sousuo"></i>搜索</el-button>
            <el-button type="primary"
                       @click="resetForm('filterForm')"><i class="iconfont erp-icon-chongzhi"></i>重置</el-button>
          </el-form-item>

        </el-row>
      </el-form>
      <el-table stripe
                border
                highlight-current-row
                :data="dataForm.dataList"
                v-loading="dataListLoading"
                @selection-change="selectionChangeHandle"
                element-loading-text="拼命加载中">
        <el-table-column type="selection"
                         header-align="center"
                         align="center"
                         width="50"></el-table-column>
        <el-table-column prop="docTypeName"
                         label="来源单据"></el-table-column>
        <el-table-column prop="docCode"
                         label="单据编号"
                         sortable></el-table-column>
        <el-table-column prop="contractCode"
                         label="采购合同号"
                         sortable></el-table-column>
        <el-table-column prop="payableDate"
                         label="应付日期"
                         sortable></el-table-column>
        <el-table-column prop="supplierName"
                         label="供应商"></el-table-column>
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
        <el-table-column prop="taxRate"
                         label="税率"
                         sortable></el-table-column>
        <el-table-column prop="totalAmount"
                         label="总金额"
                         sortable></el-table-column>
        <el-table-column prop="requestAmount"
                         label="付款中"
                         sortable></el-table-column>
        <el-table-column prop="paidAmount"
                         label="已付款"
                         sortable></el-table-column>
        <el-table-column prop="verifyAmount"
                         label="本次核销金额">
          <template slot-scope="scope">
            <el-form-item :prop="'dataList[' + scope.$index + ']verifyAmount'"
                          :rules="dataRule.verifyAmount"
                          label-width="0px">
              <el-input v-model="scope.row.verifyAmount"
                        @input="verifyMoneyHandle(scope.row)"
                        type="Number"
                        @mousewheel.native.prevent></el-input>
            </el-form-item>
          </template>
        </el-table-column>
      </el-table>
    </el-form>
    <el-row>
      <pagination-all v-model="paginationData"
                      @paginationChangeHandle="getDataList"></pagination-all>
    </el-row>
  </div>
</template>
<script>
import selectSeach from '@/components/erp-select/select-seach'
import selectAll from '@/components/erp-select/select-all'
import paginationAll from '@/components/erp-pagination/pagination-all'
import { dateFormatter } from '@/utils'

export default {
  components: {
    selectSeach,
    selectAll,
    paginationAll
  },
  props: ['value'],
  data () {
    var validQty = (rule, value, callback) => {
      let subString = rule.field.split('[')[1]
      let valueIndex = subString.split(']')[0]
      let row = this.dataForm.dataList[valueIndex]
      // 不允许超过（金额-付款中-已付款）
      let maxAmount = (Number(row.totalAmount) * 100 - Number(row.paidAmount) * 100 - Number(row.requestAmount) * 100) / 100
      if (maxAmount < 0) {
        if (Number(row.verifyAmount) < maxAmount) {
          callback(new Error(`不允许小于${maxAmount}`))
        } else {
          callback()
        }
      } else {
        if (Number(row.verifyAmount) > maxAmount) {
          callback(new Error(`不允许超过${maxAmount}`))
        } else {
          callback()
        }
      }
    }
    return {
      verifyTip: '此操作将不可逆，请确认是否进行核销？',
      dataListSelections: [],
      orderTypeOptions: [],
      prePayDisable: true,
      payAmountDis: false,
      verifyTypeOption: [],
      currencyIdOptions: [],
      dataListLoading: false,
      searchData: {},
      searchFilterData: {},
      compIdOption: [],
      dataForm: {
        verifyDate: dateFormatter(new Date(), false), // 将"2018-11-08T09:07:37.648Z"转换为"2018-11-08",
        supplier: '',
        compId: '',
        currency: '',
        verifyType: '',
        prePayCode: '',
        prePayAmount: '',
        verifyMoney: '',
        dataList: []
      },
      filterForm: {
        tradingType: '',
        dateRange: [],
        contractCode: '',
        prodId: ''
      },
      dataRule: {
        compId: [{ required: true, message: '必填项', trigger: 'change' }],
        supplier: [{ required: true, message: '必填项', trigger: 'change' }],
        currency: [{ required: true, message: '必填项', trigger: 'change' }],
        verifyType: [{ required: true, message: '必填项', trigger: 'change' }],
        prePayAmount: [{ required: true, message: '必填项', trigger: 'change' }],
        verifyAmount: [
          { validator: validQty, trigger: 'blur' }
        ]
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
  created () {
    // 结算币种
    this.$http
      .get(this.$http.adornUrl('/basicData/queryAllCurrency'))
      .then(({ data }) => {
        this.currencyIdOptions = data.currencyList
      })
    // 结算公司
    this.$http
      .get(this.$http.adornUrl('sys/organization/select'))
      .then(({ data }) => {
        this.compIdOption = data.companyList
      })
    // 核销类型
    this.$http.get(this.$http.adornUrl('basicData/queryDataDict2List'), {
      params: {
        dataDictKey: 'FIN_VERIFY_TYPE'
      }
    }).then(({
      data
    }) => {
      for (const item of data.fontMaps) {
        if (item.key === 'PAYMENT') {
          this.$set(item, 'bUsed', false)
        } else {
          this.$set(item, 'bUsed', true)
        }
      }
      this.verifyTypeOption = data.fontMaps
    })
    // 来源单据类型
    this.$http.get(this.$http.adornUrl('basicData/queryDataDict2List'), {
      params: {
        dataDictKey: 'WH_INSTOCK_TYPE'
      }
    }).then(({
      data
    }) => {
      this.orderTypeOptions = data.fontMaps
      this.orderTypeOptions.push({ key: '', value: '所有单据' })
    })
  },
  // computed: {
  //   prePayCodeArray: {
  //     get () {
  //       return []
  //     },
  //     set (val) {
  //       this.$set(this.dataForm, 'prePayCode', val.join(','))
  //     }
  //   }
  // },
  methods: {
    init (tabName) {
      // this.searchData = searchData
      // 默认公司
      this.dataForm.compId = sessionStorage.getItem('orgId')
      // this.getDataList(1)
    },
    // 多选
    selectionChangeHandle (val) {
      this.dataListSelections = val
      if (this.dataListSelections.length <= 0) {
        this.dataForm.verifyMoney = ''
      } else {
        // this.verifyCancelDis = false
        let verifyTemp = 0
        for (const item of this.dataListSelections) {
          verifyTemp += Number(item.verifyAmount) * 100
        }
        this.dataForm.verifyMoney = verifyTemp / 100
      }
    },
    // 获取数据列表
    getDataList (val) {
      if (val !== undefined) {
        this.paginationData.currPage = val
      }
      this.dataListLoading = true
      this.$http({
        url: this.$http.adornUrl('fin/paymentverifyrecord/verifylist'),
        method: 'post',
        data: Object.assign({},
          this.paginationData,
          // this.searchData == undefined ? {} : this.searchData,
          this.dataForm,
          this.filterForm
        )
      }).then(({
        data
      }) => {
        if (data && data.code === 0) {
          let dataTemp = []
          dataTemp = data.pageList.dataList.slice(0)
          let i = dataTemp.length
          while (i--) {
            let temp = 0
            temp = (Number(dataTemp[i].totalAmount) * 100 - Number(dataTemp[i].requestAmount) * 100 - Number(dataTemp[i].paidAmount) * 100) / 100
            this.$set(dataTemp[i], 'verifyAmount', temp)
            // 如果为0，表示已核销，不显示该数据
            if (temp === 0) {
              dataTemp.splice(i, 1)
            }
          }
          // 这里计算默认本次核销金额
          // dataTemp.forEach((item, index) => {
          //   let temp = 0
          //   temp = (Number(item.totalAmount) * 100 - Number(item.requestAmount) * 100 - Number(item.paidAmount) * 100) / 100
          //   this.$set(item, 'verifyAmount', temp)
          //   // 如果为0，表示已核销，不显示该数据
          //   if (temp === 0) {
          //     dataTemp.splice(index, 1)
          //   }
          // })
          this.dataForm.dataList = dataTemp
          this.paginationData.totalCount = dataTemp.length
        } else {
          this.dataForm.dataList = []
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
    // 校验
    requireChange (val) {
      if (this.dataForm.compId && this.dataForm.supplier && this.dataForm.currency) {
        this.getDataList(1)
      } else {
        this.$notify.warning({
          title: '提示',
          message: '[结算公司]、[供应商]、[结算币别]必填',
          duration: 3000
        })
      }
    },
    // 供应商
    supplierChange (val) {

    },
    // 结算币别
    currencyChange (val) {

    },
    // 过滤条件改变
    filterFormChange (val) {
      this.getDataList(1)
    },
    // 单据来源
    // orderTypeChange (val) {
    //   this.$set(this.filterForm, 'tradingType', this.filterForm.tradingType)
    //   this.getDataList(1)
    // },
    // // 日期
    // dataRangeChange (val) {
    //   console.log('日期', val)
    //   this.$set(this.filterForm, 'dateRange', this.filterForm.dateRange)
    //   this.getDataList(1)
    // },
    // // 合同号
    // contractCodeChange (val) {
    //   console.log('合同号', val)
    //   this.$set(this.filterForm, 'contractCode', this.filterForm.contractCode)
    //   this.getDataList(1)
    // },
    // // 产品id
    // prodChange (val) {
    //   this.$set(this.filterForm, 'prodId', this.filterForm.prodId)
    //   this.getDataList(1)
    // },
    // 核销类型
    verifyTypeChange (val) {
      this.dataForm.prePayCode = ''
      this.dataForm.prePayAmount = ''
      if (val === 'PRE_PAY') {
        this.prePayDisable = false
        this.payAmountDis = true
      } else {
        this.prePayDisable = true
        this.payAmountDis = false
      }
    },
    clearHandle () {
      this.dataForm.prePayAmount = ''
    },
    // 预付款单号
    prePayCodeChange (item) {
      console.log(item)// ['aa','bb']
      // let mountTemp = 0
      // for (const valItem of val) {
      //   for (const item of this.prePayCodeArray) {
      //     if (valItem === item.key) {
      //       mountTemp += Number(item.money)
      //     }
      //   }
      // }
      this.dataForm.prePayAmount = item.prePayAmount || 0
    },
    verifyMoneyHandle (row) {
      console.log('row', row)
      if (this.dataListSelections.length > 0) {
        let verifyTemp = 0
        for (const item of this.dataListSelections) {
          verifyTemp += Number(item.verifyAmount) * 100
        }
        this.dataForm.verifyMoney = verifyTemp / 100
      }
    },
    // 核销
    verifyHandle (formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          // 判断是否选择了核销明细
          if (this.dataListSelections.length <= 0) {
            this.$notify.warning({
              title: '提示',
              message: '请选择核销明细数据',
              duration: 3000
            })
          } else if (Number(this.dataForm.verifyMoney) !== Number(this.dataForm.prePayAmount)) {
            this.$notify.warning({
              title: '提示',
              message: '[核销金额]和[付款金额]必须相等',
              duration: 3000
            })
          } else {
            this.$http({
              url: this.$http.adornUrl(
                'fin/paymentverifyrecord/verify'
              ),
              method: 'post',
              data: Object.assign({}, this.dataForm, {
                entitys: this.dataListSelections
              })
            }).then(({
              data
            }) => {
              if (data && data.code === 0) {
                // this.clearCache('dataForm')
                this.$notify.success({
                  title: '成功',
                  message: `核销成功，生成核销ID为:${data.verifyCode}，记录在核销记录里`,
                  duration: 3000
                })
                // 成功之后清空页面字段值
                this.$refs['dataForm'].resetFields()
                this.$refs['filterForm'].resetFields()
                this.dataForm.dataList = []
              } else {
                this.$notify.error({
                  title: '错误',
                  message: data.msg,
                  duration: 5000
                })
              }
            })
            // this.getDataList(1)
          }
        } else {
          return false
        }
      })
    },
    submitForm (formName) {
      if (this.dataForm.compId && this.dataForm.supplier && this.dataForm.currency) {
        this.getDataList(1)
      } else {
        this.$notify.warning({
          title: '提示',
          message: '[结算公司]、[供应商]、[结算币别]必填',
          duration: 3000
        })
      }
      // this.$refs[formName].validate((valid) => {
      //   if (valid) {
      //     this.getDataList(1)
      //   } else {
      //     return false
      //   }
      // })
    },
    resetForm (formName) {
      this.$refs[formName].resetFields()
      this.getDataList(1)
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
<style scoped>
/* 勿删 */
.item {
  font-size: 16px;
  font-weight: 600;
  margin-top: 20px;
}
.line {
  height: 1px;
  border-top: 1px solid #ddd;
}
</style>
