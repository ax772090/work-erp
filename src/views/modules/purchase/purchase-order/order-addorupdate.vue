<template>
  <el-dialog :title="!dataForm.id ? '采购订单新增' : isClick === true ? '采购订单编辑' : '采购订单查看'"
             :close-on-click-modal="false"
             :visible.sync="visible"
             @close="$refs['dataForm'].resetFields()"
             width="90%">
    <el-form :model="dataForm"
             :rules="dataRule"
             ref="dataForm"
             label-width="110px">
      <el-collapse v-model="activeNames">
        <el-collapse-item name="1">
          <template slot="title">
            <div class="item">基本信息:</div>
          </template>
          <el-row>
            <el-col :span="6">
              <el-form-item label="供应商名称"
                            prop="supplierId"
                            :rules="dataRule.isRequired">
                <select-seach v-model="dataForm.supplierId"
                              httpUrl="basic/basicsupplier/list-used?b_used=true"
                              httpMethod="get"
                              data-label="name"
                              data-value="id"
                              data-source="list"
                              :isSelectChange="selectchange"
                              @selectChange="supplierValue"
                              :listDataOptionStatic="supplierIdOption"
                              :isDisabled="isDisabled"></select-seach>
              </el-form-item>
              <el-form-item label="采购公司"
                            prop="compId"
                            :rules="dataRule.isRequired">
                <select-all v-model="dataForm.compId"
                            :listDataOption="compIdOption"
                            :isDisabled="isDisabled"
                            data-value="orgId"
                            data-label="name"
                            :isSelectChange="true"
                            @selectChange="compIdChange"></select-all>
              </el-form-item>
              <el-form-item label="收货仓库"
                            prop="warehouseId"
                            :rules="dataRule.isRequired">
                <select-all v-model="dataForm.warehouseId"
                            :listDataOption="warehouseIdOption"
                            data-value="id"
                            data-label="name"
                            :isDisabled="isDisabled"></select-all>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="采购订单号"
                            prop="code">
                <el-input v-model="dataForm.code"
                          :disabled="true"
                          placeholder="系统自动生成"></el-input>
              </el-form-item>

              <el-form-item label="采购日期"
                            prop="purDate"
                            :rules="dataRule.isRequired">
                <el-date-picker v-model="dataForm.purDate"
                                type="date"
                                value-format="yyyy-MM-dd"
                                :disabled="isDisabled"
                                @change="pickdateExchange"></el-date-picker>
              </el-form-item>
              <el-form-item label="采购交期"
                            prop="deliveryDays">
                <el-input v-model="dataForm.deliveryDays"
                          type="Number"
                          @mousewheel.native.prevent
                          :disabled="isDisabled"
                          placeholder="单位为天的整数"></el-input>
              </el-form-item>

            </el-col>
            <el-col :span="6">

              <el-form-item label="运输方式"
                            prop="dictTransType">
                <select-all v-model="dataForm.dictTransType"
                            :listDataOption="dictTransTypeOption"
                            data-value="key"
                            data-label="value"
                            :isDisabled="isDisabled"></select-all>
              </el-form-item>
              <el-form-item label="运单跟踪号"
                            prop="trackNo">
                <el-input v-model="dataForm.trackNo"
                          :disabled="isDisabled"
                          placeholder="支持录入多个运单跟踪号,以空格分开"></el-input>

              </el-form-item>
              <el-form-item label="预计交货日期"
                            prop="expectDeliveryDate">
                <el-date-picker v-model="dataForm.expectDeliveryDate"
                                type="date"
                                value-format="yyyy-MM-dd"
                                :disabled="isDisabled"
                                @change="expectDeliveryDateExchange"></el-date-picker>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="业务状态"
                            prop="dictBizStatus">
                <select-all v-model="dataForm.dictBizStatus"
                            :listDataOption="dictBizStatusOption"
                            data-value="key"
                            data-label="value"
                            :isDisabled="true"></select-all>
              </el-form-item>
              <el-form-item label="采购员"
                            prop="userId">
                <select-seach v-model="dataForm.userId"
                              httpUrl="list/search/user"
                              httpMethod="get"
                              data-label="name"
                              data-value="id"
                              data-source="list"
                              :listDataOptionStatic="userIdOption"
                              :isDisabled="isDisabled"></select-seach>
              </el-form-item>
              <el-form-item label="备注"
                            prop="remark">
                <textarea-all v-model="dataForm.remark"
                              :disabled="isDisabled"></textarea-all>
              </el-form-item>
            </el-col>
          </el-row>
        </el-collapse-item>
        <!-- ============================== 财务信息 ============================== -->
        <el-collapse-item name="2">
          <template slot="title">
            <div class="item">财务信息:</div>
          </template>
          <el-row>
            <el-col :span="6">
              <el-form-item label="结算币别"
                            prop="currency"
                            :rules="dataRule.isRequired">
                <select-all v-model="dataForm.currency"
                            :listDataOption="currencyOption"
                            data-value="id"
                            data-label="name"
                            :isDisabled="isDisabled"
                            :isSelectChange="true"
                            @selectChange="currencyExchange"></select-all>
              </el-form-item>
              <el-form-item label="汇率"
                            prop="exchangeRate">
                <el-input v-model="dataForm.exchangeRate"
                          disabled></el-input>
              </el-form-item>
              <el-form-item label="本位币"
                            prop="baseCurrencyId">
                <select-all v-model="dataForm.baseCurrencyId"
                            :listDataOption="baseCurrencyIdOptions"
                            data-value="id"
                            data-label="name"
                            isDisabled></select-all>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="采购合同号"
                            prop="contractCode">
                <el-input v-model="dataForm.contractCode"
                          clearable
                          :disabled="isDisabled"></el-input>
                <el-button type="primary"
                           :disabled="isDisabled"
                           @click="creatContractCode">点击生成合同号</el-button>
              </el-form-item>
              <el-form-item label="是否含税"
                            prop="hasTax"
                            ref="hasTax">
                <el-radio-group v-model="dataForm.hasTax"
                                :disabled="isDisabled">
                  <el-radio :label="true">是</el-radio>
                  <el-radio :label="false">否</el-radio>
                </el-radio-group>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="需预付金额"
                            prop="prepaidAmount">
                <el-input v-model="dataForm.prepaidAmount"
                          type="Number"
                          @mousewheel.native.prevent
                          :disabled="isDisabled"></el-input>
              </el-form-item>
              <el-form-item label="运费金额"
                            prop="transAmount"
                            :rules="dataRule.isNotNegativeFloat">
                <el-input v-model="dataForm.transAmount"
                          type="Number"
                          @mousewheel.native.prevent
                          :disabled="isDisabled"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="产品总金额:"
                            prop="subtotalAmount">
                <!-- 自动计算 自动汇总（表体金额） -->
                {{ dataForm.subtotalAmount }}
              </el-form-item>

              <el-form-item label="下单总金额:"
                            prop="totalAmount">
                <!-- 自动计算 锁定=产品总金额+运费金额-->
                {{ totalAmountComputed }}
              </el-form-item>
            </el-col>
          </el-row>
        </el-collapse-item>
      </el-collapse>
      <!-- ============================== 订单明细 ============================== -->

      <el-button v-if="isClick"
                 type="text"
                 :disabled="isDisabled"
                 @click="addHandle()">
        <i class="iconfont erp-icon-tianjiamingxi"></i>新增明细行</el-button>
      <el-table :data="dataForm.poDetails"
                stripe
                border
                highlight-current-row
                v-loading="dataListLoading"
                @selection-change="selectionChangeHandle"
                show-summary
                max-height="400"
                :summary-method="getSummaries"
                tooltip-effect="dark">
        <el-table-column type="index"
                         align="center"
                         width="50"
                         label="序号"></el-table-column>
        <el-table-column prop="linkSrcCode"
                         label="来源编码"
                         width="180">
          <template slot-scope="scope">
            <el-tooltip placement="right"
                        :content="scope.row.linkSrcCode"
                        class="overflow-hidden">
              <div slot>
                <div class="code-color"
                     enterable
                     placement="right">{{scope.row.linkSrcCode}}</div>
              </div>
            </el-tooltip>
            <div v-if="scope.row.linkSrcType">({{scope.row.linkSrcType}})</div>
          </template>
        </el-table-column>
        <el-table-column prop="nameCh"
                         width="120"
                         label="产品名称"></el-table-column>
        <el-table-column prop="imageUrl"
                         width="120"
                         label="产品图片">
          <template slot-scope="scope">
            <tableImg :imageUrl='scope.row.imageUrl'></tableImg>
          </template>
        </el-table-column>
        <el-table-column prop="prodCode"
                         label="产品编码"></el-table-column>
        <el-table-column prop="specifications"
                         label="规格型号"></el-table-column>
        <el-table-column prop="unitName"
                         label="采购单位"></el-table-column>
        <el-table-column prop="bNeedChecked"
                         label="是否质检">
          <template slot-scope="scope">
            <el-tag v-if="scope.row.bNeedChecked == true"
                    size="small">是</el-tag>
            <el-tag v-else
                    type="danger"
                    size="small">否</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="prodCode"
                         label="采购参考"
                         width="150">
          <template slot-scope="scope">
            <div>累计备货数：{{scope.row.stockQty}}</div>
            <div>累计采购数：{{scope.row.purQty}}</div>
            <div>建议采购：{{scope.row.adviceQty}}</div>
          </template>
        </el-table-column>
        <el-table-column label="是否赠品"
                         prop="bGifts"
                         width="130"
                         ref="bGifts">
          <template slot-scope="scope">
            <el-tooltip content="是否赠品为 '是' 时, 单价为0"
                        effect="light"
                        placement="top-end">
              <el-switch v-model="scope.row.bGifts"
                         active-color="#13ce66"
                         inactive-color="#ff4949"
                         active-text="是"
                         inactive-text="否"
                         :disabled="isDisabled"></el-switch>
            </el-tooltip>
          </template>
        </el-table-column>
        <el-table-column prop="qty"
                         width="100"
                         label="采购数量">
          <template slot-scope="scope">
            <el-form-item :prop="'poDetails[' + scope.$index + '].qty'"
                          :rules="dataRule.isPosInteger"
                          label-width="0px">
              <el-input v-model="scope.row.qty"
                        @input="amount(scope.row)"
                        type="Number"
                        @mousewheel.native.prevent
                        :disabled="isDisabled"></el-input>
            </el-form-item>
          </template>
        </el-table-column>
        <el-table-column prop="price"
                         width="100"
                         label="单价">
          <template slot-scope="scope">
            <el-form-item :prop="'poDetails[' + scope.$index + '].price'"
                          :rules="dataRule.isPositiveFloat"
                          label-width="0px">
              <el-input v-model="scope.row.price"
                        @input="amount(scope.row)"
                        :disabled="isDisabled"
                        type="Number"
                        @mousewheel.native.prevent></el-input>
            </el-form-item>
          </template>
        </el-table-column>
        <el-table-column v-if="dataForm.hasTax"
                         prop="taxRate"
                         label="税率">
          <template slot-scope="scope">
            <el-form-item :prop="'poDetails[' + scope.$index + '].taxRate'"
                          :rules="dataRule.isBetweenInt"
                          label-width="0px">
              <el-input v-model="scope.row.taxRate"
                        :disabled="isDisabledTaxRate"
                        @input="amount(scope.row)"
                        type="Number"
                        @mousewheel.native.prevent></el-input>
            </el-form-item>
          </template>
        </el-table-column>
        <el-table-column prop="amount"
                         label="金额"></el-table-column>
        <el-table-column prop="baseTotalAmount"
                         label="总金额（本位币）"></el-table-column>
        <el-table-column prop="baseNoTaxAmount"
                         label="不含税金额（本位币）"></el-table-column>
        <el-table-column prop="expectDate"
                         label="预计交货日期"
                         width="160px">
          <template slot-scope="scope">
            <el-form-item label-width="0px"
                          :rules="dataRule.isRequired"
                          :prop="'poDetails[' + scope.$index + '].expectDate'">
              <el-date-picker v-model="scope.row.expectDate"
                              type="date"
                              value-format="yyyy-MM-dd"
                              :disabled="isDisabled"></el-date-picker>
            </el-form-item>
          </template>
        </el-table-column>
        <el-table-column prop="prefixSnCode"
                         width="150"
                         label="SN码（前段）"></el-table-column>
        <el-table-column prop="prefixSnCode"
                         width="150"
                         label="关闭情况">
          <template slot-scope="scope">
            <div>关闭数量：{{ scope.row.closeQty }}</div>
            <div>实际采购数量：{{ scope.row.actualQty }}</div>
          </template>
        </el-table-column>
        <el-table-column fixed="right"
                         width="80"
                         label="操作">
          <template slot-scope="scope">
            <el-button title="删除"
                       type="danger"
                       circle
                       v-if="isClick"
                       @click="deleteHandle(scope)"
                       :disabled="isDisabled">
              <i class="iconfont erp-icon-shanchu"></i>
            </el-button>
            <el-button title="查看历史采购记录"
                       type="primary"
                       circle
                       @click="purchaseRecord(scope.row)">
              <i class="iconfont erp-icon-chakanlishi"></i>
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-form>
    <span slot="footer">
      <el-button @click="visible = false"><i class="iconfont erp-icon-quxiao"></i>取消</el-button>
      <el-button v-if="isClick"
                 type="primary"
                 @click="dataFormSubmit()"><i class="iconfont erp-icon-baocun"></i>保存</el-button>
      <el-button v-if="isAuth('pur:poinfo:comfirm') && isClick"
                 type="primary"
                 @click="confirmOrder()"><i class="iconfont erp-icon-queding"></i>确认下单</el-button>
    </span>
    <!-- 添加明细 -->
    <add-details ref="addDetails"
                 @addDetailsList="addList"></add-details>
    <!-- 历史采购记录 -->
    <orderParticularsRecord ref="orderParticularsRecord"
                            @particularsList="addList"></orderParticularsRecord>
  </el-dialog>
</template>
<script>
import selectSeach from '@/components/erp-select/select-seach'
import selectAll from '@/components/erp-select/select-all'
import orderParticularsRecord from './order-particulars-record'
// 添加明细（新组件）
import addDetails from '@/components/add-details/prod-detail.vue'
import { dateFormatter } from '@/utils/index.js'
// 备注组件
import textareaAll from '@/components/erp-input/textarea-all'

// 引入图片
import tableImg from '@/components/list-table/table-img'
export default {
  components: {
    selectSeach,
    selectAll,
    orderParticularsRecord,
    addDetails,
    tableImg,
    textareaAll
  },
  data () {
    // 税率
    const betweenInt = (min, max) => (rule, value, callback) => {
      const isBetween = value >= min && value <= max
      const isInt = /^0[1-9]$|^[1-9][0-9]?$|^00?\.(?:0[1-9]|[1-9][0-9]?)$|^(?:0[1-9]|[1-9][0-9]?)\.[0-9]$/.test(
        value
      )
      if (value && !(isBetween && isInt)) {
        callback(new Error(`${min}到${max}的两位小数`))
      } else {
        callback()
      }
    }
    // 预付金额
    var validatePrepaidAmount = (rule, value, callback) => {
      if (value > this.totalAmountComputed) {
        callback(new Error('"预付金额" 不允许大于 "下单金额"'))
      } else {
        callback()
      }
    }

    // 单价
    var validPrice = (rule, value, callback) => {
      let subString = rule.field.split('[')[1]
      let valueIndex = subString.split(']')[0]
      if (!this.dataForm.poDetails[valueIndex].bGifts) {
        // 需大于0,保留两位小数
        if (!/(^[1-9](\d+)?(\.\d{1,2})?$)|(^\d\.\d{1,2}$)/.test(value) && value != null) {
          callback(new Error('需大于0,保留两位小数'))
        } else {
          callback()
        }
      } else {
        if (this.dataForm.poDetails[valueIndex].price !== 0) {
          callback(new Error('赠品单价为0'))
        } else {
          callback()
        }
      }
    }
    return {
      baseCurrencyIdOptions: [],  // 本位币
      visible: false,
      isDisabled: false,
      isClick: true,
      activeNames: ['1', '2'], // 默认展开
      // isDisabledHasTax: false,
      isDisabledTaxRate: false, // 税率
      type: '',
      dataForm: {
        id: '',
        supplierId: '',
        userId: '',
        code: '',
        remark: '',
        warehouseId: '',
        purDate: '',
        deliveryDays: '',
        dictBizStatus: '01',
        compId: '',
        expectDeliveryDate: '',
        dictTransType: '',
        trackNo: '',
        exchangeRate: '', // 汇率
        currency: '',
        transAmount: '',
        contractCode: '',
        subtotalAmount: '',
        totalAmount: '',
        prepaidAmount: '',
        payments: '',
        hasTax: '',
        poDetails: []
      },
      selectchange: false,   // 防止查看调接口
      // 供应商
      supplierIdOption: [],
      // 采购员
      userIdOption: [],
      // 收货仓库
      warehouseIdOption: [],
      // 业务状态
      dictBizStatusOption: [],
      // 采购公司
      compIdOption: [],
      // 运输方式
      dictTransTypeOption: [],
      // 结算币别
      currencyOption: [],

      // 多选
      dataListSelections: [],
      dataListLoading: false,
      flag: true,
      dataRule: {
        isRequired: [{ required: true, message: '必填项', trigger: 'blur' }],
        deliveryDays: [
          { pattern: /^\d+$/, message: '正整数', trigger: 'blur' }
        ],
        // 预付金额
        prepaidAmount: [{ validator: validatePrepaidAmount, trigger: 'blur' }],
        isPosInteger: [
          { required: true, message: '必填项', trigger: 'blur' },
          {
            pattern: /^\+?[1-9][0-9]*$/,
            message: '需大于0的整数',
            trigger: 'blur'
          }
        ],
        isPositiveFloat: [
          { required: true, message: '必填项', trigger: 'blur' },
          { validator: validPrice, trigger: 'blur' }
        ],
        exchangeRate: [
          { required: true, message: '必填项', trigger: 'blur' }
        ],
        isNotNegativeFloat: [
          {
            pattern: /^\d+(\.\d+)?$/,
            message: '需大于0,保留两位小数',
            trigger: 'change'
          }
        ],
        hasTax: [
          { required: true, message: '必填项', trigger: 'blur' }
        ],
        isBetweenInt: [{ validator: betweenInt(0.01, 0.99), trigger: 'change' }]
      }
    }
  },
  created () {
    // 采购公司
    this.$http.get(this.$http.adornUrl('sys/organization/select')).then(({ data }) => { this.compIdOption = data.companyList })
    // 业务状态
    this.$http.get(this.$http.adornUrl('basicData/queryDataDict2List'), { params: { dataDictKey: 'PO_INFO_BIZ_STATUS' } }).then(({ data }) => { this.dictBizStatusOption = data.fontMaps })
    // 运输方式
    this.$http.get(this.$http.adornUrl('basicData/queryDataDict2List'), { params: { dataDictKey: 'TRANSPORT_MODE' } }).then(({ data }) => { this.dictTransTypeOption = data.fontMaps })
    // 结算币种
    this.$http.get(this.$http.adornUrl('dict/dictcurrency/listcombobox')).then(({ data }) => { this.currencyOption = data.list; this.baseCurrencyIdOptions = data.list })
  },
  methods: {
    // 选择结算币种
    currencyExchange (val, type) {
      if (type) {
      } else {
        if (val && this.dataForm.purDate && this.dataForm.baseCurrencyId) {
          this.$http({
            url: this.$http.adornUrl('basic/exchangerate/queryAvaliableRate'),
            method: 'post',
            data: {
              original: val,
              base: this.dataForm.baseCurrencyId,
              date: this.dataForm.purDate
            }
          }).then(({ data }) => {
            if (data && data.code === 0) {
              this.dataForm.exchangeRate = data.exchangeRate
              this.$nextTick(() => {
                for (let i = 0; i < this.dataForm.poDetails.length; i++) {
                  if (this.dataForm.poDetails[i].price && this.dataForm.poDetails[i].qty) {
                    this.dataForm.poDetails[i].baseTotalAmount = Math.round(Number(this.dataForm.poDetails[i].price) * Number(this.dataForm.poDetails[i].qty) * Number(this.dataForm.exchangeRate) * 100) / 100
                    this.dataForm.poDetails[i].baseNoTaxAmount = Math.round(((Number(this.dataForm.poDetails[i].price) * Number(this.dataForm.poDetails[i].qty) * Number(this.dataForm.exchangeRate)) / (1 + Number(this.dataForm.poDetails[i].taxRate))) * 100) / 100
                  }
                }
              })
              // 失败
            } else {
              this.dataForm.exchangeRate = ''
              for (let i = 0; i < this.dataForm.poDetails.length; i++) {
                this.dataForm.poDetails[i].baseTotalAmount = 0
                this.dataForm.poDetails[i].baseNoTaxAmount = 0
              }
              this.$notify.error({
                title: '错误',
                message: data.msg,
                duration: 2000
              })
            }
          })
        }
      }
    },
    // 选择采购日期
    pickdateExchange (val, type) {
      if (type) {
      } else {
        if (this.dataForm.currency && val && this.dataForm.baseCurrencyId) {
          this.$http({
            url: this.$http.adornUrl('basic/exchangerate/queryAvaliableRate'),
            method: 'post',
            data: {
              original: this.dataForm.currency,
              base: this.dataForm.baseCurrencyId,
              date: val
            }
          }).then(({ data }) => {
            if (data && data.code === 0) {
              this.dataForm.exchangeRate = data.exchangeRate
              for (let i = 0; i < this.dataForm.poDetails.length; i++) {
                if (this.dataForm.poDetails[i].price && this.dataForm.poDetails[i].qty) {
                  this.dataForm.poDetails[i].baseTotalAmount = Math.round(Number(this.dataForm.poDetails[i].price) * Number(this.dataForm.poDetails[i].qty) * Number(this.dataForm.exchangeRate) * 100) / 100
                  this.dataForm.poDetails[i].baseNoTaxAmount = Math.round(((Number(this.dataForm.poDetails[i].price) * Number(this.dataForm.poDetails[i].qty) * Number(this.dataForm.exchangeRate)) / (1 + Number(this.dataForm.poDetails[i].taxRate))) * 100) / 100                }
              }
              // 失败
            } else {
              this.dataForm.exchangeRate = ''
              for (let i = 0; i < this.dataForm.poDetails.length; i++) {
                this.dataForm.poDetails[i].baseTotalAmount = 0
                this.dataForm.poDetails[i].baseNoTaxAmount = 0
              }
              this.$notify.error({
                title: '错误',
                message: data.msg,
                duration: 2000
              })
            }
          })
        }
      }
    },
    // 选择预计交货日期时，将该日期更新到表体的预计到货日期
    expectDeliveryDateExchange (val) {
      if (val) {
        if (this.dataForm.poDetails) {
          for (let i = 0; i < this.dataForm.poDetails.length; i++) {
            this.dataForm.poDetails[i].expectDate = val
          }
        }
      }
    },
    init (id, type, parentData) {
      this.dataForm.code = ''
      this.dataForm.addTime = ''
      this.dataForm.addUser = ''
      this.dataForm.updTime = ''
      this.dataForm.updUser = ''
      this.dataForm.confirmUser = null
      this.dataForm.confirmTime = null
      this.dataForm.subtotalAmount = ''
      this.dataForm.baseCurrencyId = 'CNY' // 锁定成人民币
      this.visible = true
      // if (!this.dataForm.id) {
      //   // 新增
      //   this.selectchange = true
      // }
      // 新增
      if (type === 'canAdd') {
        this.selectchange = true
      }
      this.dataForm.id = id
      this.type = type
      this.dataForm.poDetails = []
      this.$nextTick(() => {
        // table采购订单号==>采购订单编辑=>查看
        if (type === 'receiveList') {
          this.dataForm = parentData
          this.isDisabled = false
          this.isDisabledTaxRate = false
          return
        }
        // 查看
        if (type === 'canCheck') {
          this.isDisabled = true
          this.isDisabledTaxRate = true
          this.isClick = false
          this.selectchange = false
        } else {
          // 新增
          this.flag = false
          this.isDisabled = false
          this.isDisabledTaxRate = false
          this.isClick = true
          // 默认时间
          this.dataForm.purDate = dateFormatter(new Date(), false)
          // 默认公司
          this.dataForm.compId = sessionStorage.getItem('orgId')
          // 直接新增，采购员默认为当前用户
          this.dataForm.userId = sessionStorage.getItem('userId')
          this.$nextTick(() => {
            this.compIdChange(this.dataForm.compId)
          })
          this.$set(this.dataForm, 'sourceType', -1)
        }
      })
      this.$nextTick(() => {
        if (this.dataForm.id) {
          this.flag = true
          this.selectchange = false
          this.$http({
            url: this.$http.adornUrl(`pur/poinfo/info/${this.dataForm.id}`),
            method: 'get',
            params: this.$http.adornParams()
          }).then(({ data }) => {
            if (data && data.code === 0) {
              this.compIdChange(data.poInfoDto.compId)
              this.currencyExchange('', id)
              this.pickdateExchange('', id)
              for (const item of data.poInfoDto.poDetails) {
                this.$set(item, 'nameCh', item.prodBasicEntity.nameCh)
                this.$set(item, 'imageUrl', item.url)
                this.$set(item, 'prodCode', item.prodBasicEntity.code)
                this.$set(item, 'unitName', !item.prodBasicEntity.dictUnitEntity ? '' : item.prodBasicEntity.dictUnitEntity.name)
                this.$set(item, 'specifications', item.prodBasicEntity.specifications)
              }
              this.dataForm = data.poInfoDto
              this.dataForm.baseCurrencyId = 'CNY' // 锁定成人民币
              this.dataForm.exchangeRate = data.poInfoDto.exchangeRate // 汇率
            }
          })
        }
      })
    },

    // 选择公司触发
    compIdChange (value) {
      this.dataForm.warehouseId = ''
      this.$http
        .get(this.$http.adornUrl('list/combobox/warehouse-comp'), {
          params: { compId: value }
        })
        .then(({ data }) => {
          this.warehouseIdOption = data.list
        })
    },

    // 计算金额
    amount (row) {
      let amountNumber = Number(row.price) * Number(row.qty)
      if (isNaN(amountNumber)) {
        amountNumber = 0
      }
      row.amount = amountNumber.toFixed(2)
      let baseTotal = Math.round(Number(row.price) * Number(row.qty) * Number(this.dataForm.exchangeRate) * 100) / 100
      if (isNaN(baseTotal)) {
        baseTotal = 0
      }
      row.baseTotalAmount = baseTotal
      let baseNoTax =
        Math.round(((Number(row.price) * Number(row.qty) * Number(this.dataForm.exchangeRate)) / (1 + Number(row.taxRate))) * 100) / 100
      if (isNaN(baseNoTax)) {
        baseNoTax = 0
      }
      row.baseNoTaxAmount = baseNoTax
    },
    // tabel方法集
    // 添加=>订单明细
    addHandle () {
      if (this.dataForm.supplierId && this.dataForm.currency && (this.dataForm.hasTax !== '') && this.dataForm.compId) {
        this.$nextTick(() => {
          this.$refs.addDetails.init(
            this.dataForm.id,
            this.dataForm.poDetails
          )
        })
      } else {
        if (!this.dataForm.supplierId) {
          this.$notify.warning({
            title: '提示',
            message: '请先选择供应商',
            duration: 3000
          })
        } else if (!this.dataForm.currency) {
          this.$notify.warning({
            title: '提示',
            message: '请先选择结算币别',
            duration: 3000
          })
        } else if (this.dataForm.hasTax === '') {
          this.$notify.warning({
            title: '提示',
            message: '请先选择是否含税',
            duration: 3000
          })
        } else if (!this.dataForm.compId) {
          this.$notify.warning({
            title: '提示',
            message: '请先选择采购公司',
            duration: 3000
          })
        }
      }
    },

    // 多选
    selectionChangeHandle (val) {
      this.dataListSelections = val
    },

    // 删除=>订单明细
    deleteHandle (scope) {
      this.dataForm.poDetails.splice(scope.$index, 1)
    },

    // 子组件添加的数据
    async addList (list) {
      console.log('list', list)
      let mapData = []
      // 传递数据给后台
      let obj = {
        supplierId: this.dataForm.supplierId,   //   <!--供应商 -->
        currencyId: this.dataForm.currency,   //  <!-- 币种ID -->
        bUsed: '1',       //   <!-- 是否使用-->
        date: this.dataForm.purDate,        // <!-- 生效失效日期 -->
        bIncludeTax: this.dataForm.hasTax,  // 是否含税
        compId: this.dataForm.compId  // 采购公司
      }
      let data = Object.assign({}, { prodList: list }, obj)
      await this.$http({
        url: this.$http.adornUrl('pur/poinfo/caculateInfo'),
        method: 'post',
        data: data
      }).then(({ data }) => {
        if (data && data.code === 0) {
          for (let j = 0; j < list.length; j++) {
            for (let i = 0; i < data.mapList.length; i++) {
              if (data.mapList[i].prodId === list[j].id) {
                this.$set(list[j], 'adviceQty', data.mapList[i].adviceQty)
                this.$set(list[j], 'purQty', data.mapList[i].purQty)
                this.$set(list[j], 'stockQty', data.mapList[i].stockQty)
                this.$set(list[j], 'price', data.mapList[i].price)
                this.$set(list[j], 'taxRate', data.mapList[i].taxRate)
              }
            }
          }
        } else {
          this.$notify.error({
            title: '错误',
            message: data.msg,
            duration: 5000
          })
        }
      })

      mapData = list.map(item => {
        return {
          productId: item.id,
          nameCh: item.nameCh,
          imageUrl: item.imageUrl,
          prodCode: item.prodCode,
          specifications: item.specifications,
          unitName: item.unitName,
          bNeedChecked: item.bNeedChecked,
          price: item.price,
          taxRate: item.taxRate,
          qty: item.qty,
          baseTotalAmount: item.baseTotalAmount,
          baseNoTaxAmount: item.baseNoTaxAmount,
          stockQty: item.stockQty,
          adviceQty: item.adviceQty,
          purQty: item.purQty,
          expectDate: '',
          bGifts: false,
          prefixSnCode: ''
        }
      })

      for (const data of mapData) {
        let isFind = false
        for (const item of this.dataForm.poDetails) {
          if (data.productId === item.productId) {
            isFind = true
            break
          }
        }
        if (!isFind) {
          // 选择预计交货日期时，将该日期更新到表体的预计到货日期
          data.expectDate = this.dataForm.expectDeliveryDate
          this.dataForm.poDetails.push(data)
        }
      }
    },

    // 历史采购记录
    purchaseRecord (row) {
      this.$nextTick(() => {
        this.$refs.orderParticularsRecord.init({
          productId: row.productId,
          imageUrl: row.imageUrl,
          prodCode: row.prodCode,
          nameCh: row.nameCh,
          specifications: row.specifications
        })
      })
    },

    getSummaries (param) {
      const { columns, data } = param
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
            let sum = prev + curr
            if (!isNaN(value)) {
              return sum
            } else {
              return prev
            }
          }, 0)
          if (
            column.property === 'qty' ||
            column.property === 'amount' ||
            column.property === 'baseTotalAmount' ||
            column.property === 'baseNoTaxAmount'
          ) {
            if (column.property === 'qty') {
              sums[index] = sums[index]
            } else {
              sums[index] = sums[index].toFixed(2)
            }
            if (column.property === 'amount') {
              this.dataForm.subtotalAmount = sums[index]
            }
          } else {
            sums[index] = ''
          }
        } else {
          sums[index] = ''
        }
      })
      return sums
    },

    // 点击按钮是否生成合同号
    creatContractCode () {
      // 没有供应商则不能生成合同号
      if (!this.dataForm.supplierId) {
        this.$notify.error({
          title: '错误',
          message: '请先选择供应商',
          duration: 5000
        })
        return
      }
      // 没有是否含税则不能生成合同号
      if (this.dataForm.hasTax === '') {
        this.$notify.error({
          title: '错误',
          message: '请先选择是否含税',
          duration: 5000
        })
        return
      }
      this.$http({
        url: this.$http.adornUrl(
          'pur/poinfo/contractCode'
        ),
        method: 'post',
        data: this.dataForm.hasTax
      }).then(({ data }) => {
        if (data && data.code === 0) {
          this.dataForm.contractCode = data.contractCode
        } else {
          this.$notify.error({
            title: '错误',
            message: data.msg,
            duration: 5000
          })
        }
      })
    },

    // 表单提交
    dataFormSubmit: _.debounce(
      async function dataFormSubmit () {
        if (!(this.dataForm.poDetails.length > 0)) {
          this.$notify.error({
            title: '错误',
            message: `明细不能为空`,
            duration: 5000
          })
          return
        }
        // 选择含税，税率必填
        if (this.dataForm.hasTax) {
          for (let i = 0; i < this.dataForm.poDetails.length; i++) {
            if (!this.dataForm.poDetails[i].taxRate) {
              this.$notify.error({
                title: '错误',
                message: `请输入税率`,
                duration: 5000
              })
              return
            }
          }
        }
        // 如果没有汇率，则重新调接口获取
        if (!this.dataForm.exchangeRate && this.dataForm.currency) {
          this.$http({
            url: this.$http.adornUrl('basic/exchangerate/queryAvaliableRate'),
            method: 'post',
            data: {
              original: this.dataForm.currency,
              base: this.dataForm.baseCurrencyId,
              date: this.dataForm.purDate
            }
          }).then(({ data }) => {
            if (data && data.code === 0) {
              this.dataForm.exchangeRate = data.exchangeRate
            } else {
              this.$notify.error({
                title: '错误',
                message: data.msg,
                duration: 2000
              })
            }
          })
        }

        this.$refs['dataForm'].validate(valid => {
          if (valid) {
            this.$http({
              url: this.$http.adornUrl(
                `pur/poinfo/${!this.dataForm.id ? 'save' : 'update'}`
              ),
              method: !this.dataForm.id ? 'post' : 'put',
              data: this.dataForm
            }).then(({ data }) => {
              if (data && data.code === 0) {
                this.$emit('refreshDataList')
                this.visible = false
                this.$notify({
                  type: 'success',
                  title: '提示',
                  message: `${
                    !this.dataForm.id ? '新增' : '修改'
                    }成功, 编码为:${data.entity.code}`,
                  duration: 5000
                })
              } else {
                this.$notify.error({
                  title: '错误',
                  message: data.msg,
                  duration: 5000
                })
              }
            })
          }
        })
      }, 1000, { leading: true, trailing: false }
    ),

    // 确认下单
    confirmOrder: _.debounce(
      async function confirmOrder () {
        if (!(this.dataForm.poDetails.length > 0)) {
          this.$notify.error({
            title: '错误',
            message: `明细不能为空`,
            duration: 5000
          })
          return
        }
        // 选择含税，税率必填
        if (this.dataForm.hasTax) {
          for (let i = 0; i < this.dataForm.poDetails.length; i++) {
            if (!this.dataForm.poDetails[i].taxRate) {
              this.$notify.error({
                title: '错误',
                message: `请输入税率`,
                duration: 5000
              })
              return
            }
            if (this.dataForm.poDetails[i].bGifts) {
              if (this.dataForm.poDetails[i].price !== 0) {
                this.$notify.error({
                  title: '错误',
                  message: `赠品，单价为0`,
                  duration: 5000
                })
                return
              }
            }
          }
        }
        // 如果没有汇率，则重新调接口获取
        if (!this.dataForm.exchangeRate) {
          this.currencyExchange(this.dataForm.currency)
          return
        }
        this.$refs['dataForm'].validate(valid => {
          if (valid) {
            this.$http({
              url: this.$http.adornUrl(
                `pur/poinfo/confirmOrder`
              ),
              method: 'post',
              data: this.dataForm
            }).then(({ data }) => {
              if (data && data.code === 0) {
                this.visible = false
                this.$emit('refreshDataList')
                this.$notify({
                  type: 'success',
                  title: '提示',
                  message: `确认下单成功, 编码为:${data.entity.code}`,
                  duration: 5000
                })
              } else {
                this.$notify.error({
                  title: '错误',
                  message: data.msg,
                  duration: 5000
                })
              }
            })
          }
        })
      }, 1000, {
        leading: true,
        trailing: false
      }
    ),
    // 改变供应商，获取该供应商是否含税
    supplierValue (value) {
      this.dataForm.currency = value.currencyId
      this.currencyExchange(this.dataForm.currency) // 选择供应商，调汇率的接口
      // // 税率大于0,表示含税
      // if (value.taxRate) {
      //   this.dataForm.hasTax = true
      // // 税率为0,表示不含税
      // } else {
      //   this.dataForm.hasTax = false
      // }
    }
  },
  computed: {
    totalAmountComputed: function () {
      let totalAmount =
        Number(this.dataForm.transAmount) +
        Number(this.dataForm.subtotalAmount)
      totalAmount = totalAmount < 0 || isNaN(totalAmount) ? 0 : totalAmount
      return totalAmount.toFixed(2)
    }
  },
  watch: {
    dataForm: {
      handler (val, oldVal) {
        if (val.hasTax !== true) {
          this.isDisabledTaxRate = true
          val.poDetails.forEach(element => {
            element.taxRate = 0
            if (element.price && element.qty) {
              element.baseNoTaxAmount =
                Math.round(
                  Number(element.price) *
                  Number(element.qty) *
                  Number(this.dataForm.exchangeRate) *
                  100
                ) / 100
            }
            this.$refs['hasTax'].clearValidate()
          })
          return
        } else {
          this.isDisabledTaxRate = false
        }
        if (this.isClick === false) {
          this.isDisabledTaxRate = true
        } else {
          this.isDisabledTaxRate = false
        }
      },
      deep: true
    }
  }
}
</script>
<style scoped>
.item {
  margin-left: 10px;
  font-size: 16px;
  font-weight: 600;
}
.code-color {
  cursor: pointer;
  color: #17b3a3;
}
</style>
<style>
.el-tooltip__popper {
  max-width: 50%;
}
table th.must div:before {
  content: "*";
  color: #ff1818;
}
</style>