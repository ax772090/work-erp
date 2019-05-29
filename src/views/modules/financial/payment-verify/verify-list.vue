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
          <el-form-item label="付款金额"
                        ref="prePayAmount"
                        prop="prePayAmount">
            <el-input v-model="dataForm.prePayAmount"
                      type="Number"
                      placeholder=""
                      :disabled="true"></el-input>
          </el-form-item>
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
          <el-form-item label="应付金额"
                        ref="verifyMoney"
                        prop="verifyMoney">
            <el-input v-model="dataForm.verifyMoney"
                      placeholder=""
                      :disabled="true"></el-input>
          </el-form-item>
          <!-- <el-form-item label="预付款单号"
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
          </el-form-item> -->
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
        <div class="item">选择付款数据</div>
      </el-row>
      <el-form :model="paymentFilterForm"
               :inline="true"
               ref="paymentFilterForm">
        <el-row>
          <!-- <el-form-item label=""
                        prop="verifyType">
            <select-all v-model="paymentFilterForm.verifyType"
                        :listDataOption="verifyTypeOption"
                        data-value="key"
                        data-label="value"
                        placeholder='选择付款类型'
                        :isSelectChange="true"
                        @selectChange='paymentFilterChange'></select-all>
          </el-form-item> -->
          <el-form-item label=""
                        prop="dateRange">
            <el-date-picker v-model="paymentFilterForm.dateRange"
                            type="daterange"
                            range-separator="-"
                            start-placeholder="开始日期"
                            end-placeholder="结束日期"
                            value-format="yyyy-MM-dd"
                            placeholder="选择日期范围"
                            @change="paymentFilterChange"
                            style="width:250px;">
            </el-date-picker>
          </el-form-item>
          <el-form-item label=""
                        prop="payCode">
            <el-input v-model="paymentFilterForm.payCode"
                      placeholder="输入付款单号"
                      clearable
                      @change="paymentFilterChange"
                      style="width:180px;"></el-input>
          </el-form-item>
          <el-form-item>
            <el-button type="primary"
                       @click="submitForm('paymentFilterForm')"><i class="iconfont erp-icon-sousuo"></i>搜索</el-button>
            <el-button type="primary"
                       @click="resetForm('paymentFilterForm')"><i class="iconfont erp-icon-chongzhi"></i>重置</el-button>
          </el-form-item>

        </el-row>
      </el-form>
      <el-table stripe
                border
                max-height="400"
                highlight-current-row
                :data="dataForm.paymentDataList"
                v-loading="paymentLoading"
                element-loading-text="拼命加载中">
        <el-table-column header-align="center"
                         align="center"
                         width="50">
          <template slot-scope="scope">
            <el-radio v-model="radio"
                      :label="scope.$index"
                      @change.native='radioChange(scope.$index,scope.row)'>&nbsp;</el-radio>
          </template>
        </el-table-column>
        <!-- <el-table-column type="selection"
                         header-align="center"
                         align="center"
                         width="50"></el-table-column> -->
        <el-table-column prop="code"
                         label="付款单号"
                         sortable></el-table-column>
        <el-table-column prop="payDate"
                         label="付款日期"
                         sortable></el-table-column>
        <el-table-column prop="supplierName"
                         label="供应商"></el-table-column>
        <el-table-column prop="compName"
                         label="付款公司"></el-table-column>
        <el-table-column prop="paymentModeName"
                         label="付款方式"></el-table-column>
        <el-table-column prop="currencyName"
                         label="结算币种"></el-table-column>
        <el-table-column prop="payAmout"
                         label="付款金额"
                         sortable></el-table-column>
        <el-table-column prop="verifiedAmount"
                         label="已核销金额"
                         sortable></el-table-column>
        <el-table-column prop="remarks"
                         label="付款用途"></el-table-column>
        <el-table-column prop="contractCode"
                         label="采购合同号"
                         sortable></el-table-column>
        <el-table-column prop="paymentVerifyAmount"
                         label="本次核销金额">
          <template slot-scope="scope">
            <el-form-item :prop="'paymentDataList[' + scope.$index + ']paymentVerifyAmount'"
                          :rules="dataRule.paymentVerifyAmount"
                          label-width="0px">
              <el-input v-model="scope.row.paymentVerifyAmount"
                        @input="paymentVerifyMoney(scope.row)"
                        type="Number"
                        @mousewheel.native.prevent></el-input>
            </el-form-item>
          </template>
        </el-table-column>
      </el-table>
      <el-row>
        <pagination-all v-model="paymentPgtData"
                        @paginationChangeHandle="getPaymentList"></pagination-all>
      </el-row>
      <div class="line"><span></span></div>
      <el-row>
        <div class="item">选择应付数据</div>
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
                max-height="400"
                highlight-current-row
                :data="dataForm.payDataList"
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
        <el-table-column prop="specifications"
                         label="规格型号"></el-table-column>
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
            <el-form-item :prop="'payDataList[' + scope.$index + ']verifyAmount'"
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
      <el-row>
        <pagination-all v-model="paginationData"
                        @paginationChangeHandle="getDataList"></pagination-all>
      </el-row>
    </el-form>
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
      let row = this.dataForm.payDataList[valueIndex]
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
    // 付款
    var validPaymentQty = (rule, value, callback) => {
      let subString = rule.field.split('[')[1]
      let valueIndex = subString.split(']')[0]
      let row = this.dataForm.paymentDataList[valueIndex]
      // 不允许超过（付款金额-已核销金额）
      let maxAmount = (Number(row.payAmout) * 100 - Number(row.verifiedAmount) * 100) / 100
      // if (maxAmount < 0) {
      //   if (Number(row.paymentVerifyAmount) < maxAmount) {
      //     callback(new Error(`不允许小于${maxAmount}`))
      //   } else {
      //     callback()
      //   }
      // } else {
      if (Number(row.paymentVerifyAmount) > maxAmount) {
        callback(new Error(`不允许超过${maxAmount}`))
      } else {
        callback()
      }
      // }
    }
    return {
      radioObj: {},
      radio: '',
      verifyTip: '此操作将不可逆，请确认是否进行核销？',
      paymentListSelected: [],
      payListSelected: [],
      orderTypeOptions: [],
      prePayDisable: true,
      currencyIdOptions: [],
      dataListLoading: false,
      paymentLoading: false,
      searchData: {},
      searchFilterData: {},
      compIdOption: [],
      dataForm: {
        verifyDate: dateFormatter(new Date(), false), // 将"2018-11-08T09:07:37.648Z"转换为"2018-11-08",
        supplier: '',
        compId: '',
        currency: '',
        prePayAmount: '',
        verifyMoney: '',
        payDataList: [], // 应付
        paymentDataList: []// 付款
      },
      paymentFilterForm: {
        dateRange: [],
        payCode: ''
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
        prePayAmount: [{ required: true, message: '必填项', trigger: 'change' }],
        verifyMoney: [{ required: true, message: '必填项', trigger: 'change' }],
        verifyAmount: [
          { validator: validQty, trigger: 'blur' }
        ],
        paymentVerifyAmount: [
          { validator: validPaymentQty, trigger: 'blur' }
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
      },
      // 分页
      paymentPgtData: {
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
    // this.$http.get(this.$http.adornUrl('basicData/queryDataDict2List'), {
    //   params: {
    //     dataDictKey: 'FIN_VERIFY_TYPE'
    //   }
    // }).then(({
    //   data
    // }) => {
    //   for (const item of data.fontMaps) {
    //     if (item.key === 'PAYMENT') {
    //       this.$set(item, 'bUsed', false)
    //     } else {
    //       this.$set(item, 'bUsed', true)
    //     }
    //   }
    //   this.verifyTypeOption = data.fontMaps
    // })
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
  methods: {
    init (tabName) {
      // this.searchData = searchData
      // 默认公司
      this.dataForm.compId = sessionStorage.getItem('orgId')
    },
    // 付款数据单选
    radioChange (index, row) {
      console.log('radio', row)
      this.radioObj = row || {}
      if (row && row.paymentVerifyAmount) {
        this.dataForm.prePayAmount = Number(row.paymentVerifyAmount) * 100 / 100
      } else {
        this.dataForm.prePayAmount = ''
      }
      // this.paymentListSelected = val
      // if (this.paymentListSelected.length <= 0) {
      //   this.dataForm.prePayAmount = ''
      // } else {
      //   let verifyTemp = 0
      //   for (const item of this.paymentListSelected) {
      //     verifyTemp += Number(item.paymentVerifyAmount) * 100
      //   }
      //   this.dataForm.prePayAmount = verifyTemp / 100
      // }
    },
    // 应付数据多选
    selectionChangeHandle (val) {
      this.payListSelected = val
      if (this.payListSelected.length <= 0) {
        this.dataForm.verifyMoney = ''
      } else {
        // this.verifyCancelDis = false
        let verifyTemp = 0
        for (const item of this.payListSelected) {
          verifyTemp += Number(item.verifyAmount) * 100
        }
        this.dataForm.verifyMoney = verifyTemp / 100
      }
    },
    // 获取付款数据列表
    getPaymentList (val) {
      if (val !== undefined) {
        this.paymentPgtData.currPage = val
      }
      this.paymentLoading = true
      this.$http({
        url: this.$http.adornUrl('fin/paymentverifyrecord/verifyPaymentList'),
        method: 'post',
        data: Object.assign({},
          this.paymentPgtData,
          this.dataForm,
          this.paymentFilterForm
        )
      }).then(({
        data
      }) => {
        if (data && data.code === 0) {
          let dataTemp = []
          dataTemp = data.pageList.dataList.slice(0)
          // 这里计算默认本次核销金额
          dataTemp.forEach((item, index) => {
            let temp = 0
            temp = (Number(item.payAmout) * 100 - Number(item.verifiedAmount) * 100) / 100
            this.$set(item, 'paymentVerifyAmount', temp)
          })
          this.dataForm.paymentDataList = dataTemp
          this.paymentPgtData.totalCount = dataTemp.length
        } else {
          this.dataForm.paymentDataList = []
          this.paymentPgtData.totalCount = 0
          this.$notify.error({
            title: '错误',
            message: data.msg,
            duration: 5000
          })
        }
        this.paymentLoading = false
      })
    },
    // 获取应付数据列表
    getDataList (val) {
      if (val !== undefined) {
        this.paginationData.currPage = val
      }
      this.dataListLoading = true
      this.$http({
        url: this.$http.adornUrl('fin/paymentverifyrecord/verifyPayableList'),
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
          this.dataForm.payDataList = dataTemp
          this.paginationData.totalCount = dataTemp.length
        } else {
          this.dataForm.payDataList = []
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
    clearValidate (formName) {
      this.$refs[formName].clearValidate()
    },
    // 校验
    requireChange (val) {
      console.log('aaa', val)

      this.dataForm.prePayAmount = ''
      this.dataForm.verifyMoney = ''
      this.radio = ''
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate(['prePayAmount', 'verifyMoney'])
      })
      if (this.dataForm.compId && this.dataForm.supplier && this.dataForm.currency) {
        this.getDataList(1)
        this.getPaymentList(1)
      } else {
        this.$notify.warning({
          title: '提示',
          message: '[结算公司]、[供应商]、[结算币别]必填',
          duration: 3000
        })
      }
    },
    // 过滤条件改变
    filterFormChange (val) {
      this.getDataList(1)
    },
    // 付款过滤数据改变
    paymentFilterChange (val) {
      this.getPaymentList(1)
    },
    // 核销类型
    // verifyTypeChange (val) {
    //   this.dataForm.prePayCode = ''
    //   this.dataForm.prePayAmount = ''
    //   if (val === 'PRE_PAY') {
    //     this.prePayDisable = false
    //   } else {
    //     this.prePayDisable = true
    //   }
    // },
    // clearHandle () {
    //   this.dataForm.prePayAmount = ''
    // },
    // 预付款单号
    // prePayCodeChange (item) {
    //   console.log(item)// ['aa','bb']
    //   // let mountTemp = 0
    //   // for (const valItem of val) {
    //   //   for (const item of this.prePayCodeArray) {
    //   //     if (valItem === item.key) {
    //   //       mountTemp += Number(item.money)
    //   //     }
    //   //   }
    //   // }
    //   this.dataForm.prePayAmount = item.prePayAmount || 0
    // },
    verifyMoneyHandle (row) {
      console.log('row', row)
      if (this.payListSelected.length > 0) {
        let verifyTemp = 0
        for (const item of this.payListSelected) {
          verifyTemp += Number(item.verifyAmount) * 100
        }
        this.dataForm.verifyMoney = verifyTemp / 100
      }
    },
    // 付款
    paymentVerifyMoney (row) {
      console.log('payment-row', row)
      if (row && row.paymentVerifyAmount && this.radioObj.id === row.id) {
        this.dataForm.prePayAmount = Number(row.paymentVerifyAmount) * 100 / 100
      }
      // else {
      //   this.dataForm.prePayAmount = ''
      // }
      // if (this.paymentListSelected.length > 0) {
      //   let verifyTemp = 0
      //   for (const item of this.paymentListSelected) {
      //     verifyTemp += Number(item.paymentVerifyAmount) * 100
      //   }
      //   this.dataForm.prePayAmount = verifyTemp / 100
      // }
    },
    // 核销
    verifyHandle (formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          // 判断是否选择了核销明细
          if (this.payListSelected.length <= 0) {
            this.$notify.warning({
              title: '提示',
              message: '请选择核销明细数据',
              duration: 3000
            })
          } else if (Number(this.dataForm.verifyMoney) !== Number(this.dataForm.prePayAmount)) {
            this.$notify.warning({
              title: '提示',
              message: '[付款金额]和[应付金额]必须相等',
              duration: 3000
            })
          } else {
            this.$http({
              url: this.$http.adornUrl(
                'fin/paymentverifyrecord/verify'
              ),
              method: 'post',
              data: Object.assign({}, this.dataForm, {
                entitys: this.payListSelected,
                payment: this.radioObj
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
                this.$refs['paymentFilterForm'].resetFields()
                this.dataForm.payDataList = []
                this.dataForm.paymentDataList = []
                this.radioObj = {}
                this.radio = ''
              } else {
                this.$notify.error({
                  title: '错误',
                  message: data.msg,
                  duration: 5000
                })
              }
            })
          }
        } else {
          return false
        }
      })
    },
    submitForm (formName) {
      if (this.dataForm.compId && this.dataForm.supplier && this.dataForm.currency) {
        this.getListByForm(formName)
      } else {
        this.$notify.warning({
          title: '提示',
          message: '[结算公司]、[供应商]、[结算币别]必填',
          duration: 3000
        })
      }
    },
    resetForm (formName) {
      this.$refs[formName].resetFields()
      this.getListByForm(formName)
    },
    getListByForm (formName) {
      if (formName === 'filterForm') {
        this.getDataList(1)
      }
      if (formName === 'paymentFilterForm') {
        this.getPaymentList(1)
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
