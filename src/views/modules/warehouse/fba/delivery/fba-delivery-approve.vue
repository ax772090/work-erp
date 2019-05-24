<template>
  <el-dialog title="审批"
             width="90%"
             :close-on-click-modal="false"
             :visible.sync="visible"
             v-if="visible"
             :before-close="handleClose">
    <el-form :model="dataForm"
             :rules="dataRule"
             ref="dataForm"
             label-width="110px">
      <!-- 审批流程 -->
      <el-badge class="item">审批选项:</el-badge>
      <el-row>
        <el-col :span="12">
          <el-form-item label>
            <el-radio-group v-model="dataForm.radio">
              <div>
                <el-radio :label="1">审批通过</el-radio>
              </div>
              <div class="mt-20"
                   v-if="isShowNode2">
                <el-radio :label="2">驳回上一级</el-radio>
              </div>
              <div class="mt-20"
                   v-if="isShowNode3">
                <el-radio :label="3">驳回发起人</el-radio>
              </div>
            </el-radio-group>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="下一步审批人"
                        prop="approveName">
            <span></span>
          </el-form-item>
          <el-form-item label="审批意见"
                        prop="comments">
            <textarea-all v-model="dataForm.comments"
                          :autosize="[2,4]"></textarea-all>
          </el-form-item>
        </el-col>
      </el-row>

      <!-- 基本信息 -->
      <el-badge class="item">基本信息:</el-badge>
      <el-row>
        <el-col :span="8">
          <el-form-item label="要货计划单号"
                        prop="code">
            <el-input v-model="dataForm.code"
                      placeholder="新增不需要手动输入"
                      disabled></el-input>
          </el-form-item>
          <el-form-item label="要货店铺"
                        prop="channelId">
            <select-all v-model="dataForm.channelId"
                        :listDataOption="channelIdOptions"
                        :isDisabled="true"
                        data-value="id"
                        data-label="name"
                        placeholder="要货店铺"></select-all>
          </el-form-item>
          <el-form-item label="期望物流方式"
                        prop="dictExpectTransit">
            <select-all v-model="dataForm.dictExpectTransit"
                        :listDataOption="dictExpectTransitOptions"
                        :isDisabled="true"
                        data-value="key"
                        data-label="value"
                        placeholder="选择物流方式"></select-all>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="计划日期"
                        prop="planDate">
            <el-date-picker v-model="dataForm.planDate"
                            type="date"
                            value-format="yyyy-MM-dd"
                            placeholder="选择要货日期"
                            disabled></el-date-picker>
          </el-form-item>
          <el-form-item label="销售员"
                        prop="sellerId">
            <select-seach v-model="dataForm.sellerId"
                          httpUrl="list/search/user"
                          httpMethod="get"
                          data-label="name"
                          data-value="id"
                          data-source="list"
                          placeholder="搜索"
                          :listDataOptionStatic="sellerIdOption"
                          :isDisabled="true"></select-seach>
          </el-form-item>
          <el-form-item label="期望到达日期"
                        prop="expectArriveDate">
            <el-date-picker v-model="dataForm.expectArriveDate"
                            type="date"
                            value-format="yyyy-MM-dd"
                            default-time
                            placeholder="选择日期"
                            disabled></el-date-picker>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="单据状态"
                        prop="dictDocStatus">
            <select-all v-model="dataForm.dictDocStatus"
                        :listDataOption="dictDocStatusOptions"
                        :isDisabled="true"
                        data-value="key"
                        data-label="value"
                        placeholder="单据状态"></select-all>
          </el-form-item>
          <el-form-item label="要货平台"
                        prop="dictNeedPlatform">
            <select-all v-model="dataForm.dictNeedPlatform"
                        :listDataOption="dictNeedPlatformOptions"
                        :isDisabled="true"
                        data-value="key"
                        data-label="value"
                        placeholder="请选择要货平台"></select-all>
          </el-form-item>
          <el-form-item label="备注"
                        prop="remark">
            <textarea-all v-model="dataForm.remark"
                          disabled></textarea-all>
          </el-form-item>
        </el-col>
      </el-row>
      <!-- 物流确认 -->
      <el-badge class="item">物流确认:</el-badge>
      <el-row>
        <el-col :span="8">
          <el-form-item label="确认物流方式"
                        prop="dictConfirmTransit"
                        :rules="this.node === 'T03'?dataRule.dictConfirmTransit:[{ required: false, message: '选择物流方式', trigger: 'change' }]">
            <select-all v-model="dataForm.dictConfirmTransit"
                        :listDataOption="dictConfirmTransitOptions"
                        :isDisabled="this.node === 'T03'?false:true"
                        data-value="key"
                        data-label="value"
                        placeholder="选择物流方式"></select-all>
          </el-form-item>
          <el-form-item label="预计派送日期"
                        prop="shipPlanDate"
                        :rules="this.node === 'T03'?dataRule.shipPlanDate:[{ required: false, message: '选择派送日期', trigger: 'change' }]">
            <el-date-picker v-model="dataForm.shipPlanDate"
                            type="date"
                            value-format="yyyy-MM-dd"
                            :disabled="this.node === 'T03'?false:true"></el-date-picker>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="物流承运商"
                        prop="shipperId">
            <select-all v-model="dataForm.shipperId"
                        :listDataOption="shipperIdOptions"
                        :isDisabled="true"
                        data-value="id"
                        data-label="name"
                        placeholder="选择物流承运商"></select-all>
          </el-form-item>
          <el-form-item label="联系电话"
                        prop="telphone">
            <el-input v-model="dataForm.telphone"
                      :disabled="this.node === 'T03'?false:true"
                      placeholder></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <!-- 仓库确认 -->
      <el-badge class="item">仓库确认:</el-badge>
      <el-row>
        <el-col :span="8">
          <el-form-item label="发货公司"
                        prop="compId"
                        :rules="this.node === 'T02'?dataRule.compId:[{ required: false, message: '选择发货公司', trigger: 'change' }]">
            <select-all v-model="dataForm.compId"
                        :listDataOption="compIdOptions"
                        :isDisabled="this.node === 'T02'?false:true"
                        data-value="id"
                        data-label="name"
                        :isSelectChange="true"
                        @selectChange="compNameChange"
                        placeholder="选择发货公司"></select-all>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="计划发货仓库"
                        prop="fromWarehouseId"
                        :rules="this.node === 'T02'?dataRule.fromWarehouseId:[{ required: false, message: '选择发货仓库', trigger: 'change' }]">
            <el-select v-model="dataForm.fromWarehouseId"
                       placeholder
                       :disabled="this.node === 'T02'?false:true"
                       @change="fromWarehouseChange"
                       filterable>
              <el-option v-for="item in fromWarehouseIdOptions"
                         :key="item.id"
                         :label="item.name"
                         :value="item.id"
                         :disabled="item.disabled"></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="目的地仓库"
                        prop="toWarehouseId">
            <el-select v-model="dataForm.toWarehouseId"
                       placeholder
                       :disabled="this.node === 'T02'?false:true"
                       @change="toWarehouseChange"
                       filterable>
              <el-option v-for="item in toWarehouseIdOptions"
                         :key="item.id"
                         :label="item.name"
                         :value="item.id"
                         :disabled="item.disabled"></el-option>
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>
      <div>
        <!-- 要货明细 -->
        <el-badge class="item">要货明细:</el-badge>
        <!-- 新增SKU -->
        <el-row class="row_mb_5">
          <el-col :span="24">
            <el-button type="primary"
                       size="mini"
                       @click="addSkuHandle()"
                       v-show="isShowAddBtn">
              <i class="iconfont el-icon--left el-icon-erp-numpickerplus"></i>新增
            </el-button>
          </el-col>
        </el-row>
        <!-- 表格 -->
        <el-table :data="dataForm.deliveryDetailsList"
                  border
                  v-loading="dataListLoading">
          <el-table-column fixed
                           prop="channelName"
                           header-align="center"
                           align="center"
                           label="店铺名称"></el-table-column>
          <el-table-column prop="imageUrl"
                           header-align="center"
                           align="center"
                           label="产品图片"
                           width="80">
            <template slot-scope="scope">
              <tableImg :imageUrl='scope.row.imageUrl'></tableImg>
            </template>
          </el-table-column>
          <el-table-column prop="prodCode"
                           header-align="center"
                           align="center"
                           label="产品编码"></el-table-column>
          <el-table-column prop="prodName"
                           header-align="center"
                           align="center"
                           label="产品名称"></el-table-column>
          <el-table-column prop="unitName"
                           header-align="center"
                           align="center"
                           label="单位"
                           width="50"></el-table-column>
          <el-table-column prop="sellerSkuId"
                           header-align="center"
                           align="center"
                           label="ASIN"></el-table-column>
          <el-table-column prop="channelSku"
                           header-align="center"
                           align="center"
                           label="SKU"></el-table-column>
          <el-table-column prop="fnsku"
                           header-align="center"
                           align="center"
                           label="FNSKU"></el-table-column>
          <el-table-column prop="stockQty"
                           header-align="center"
                           align="center"
                           label="库存数量"
                           width="80">
            <template slot-scope="scope">
              <el-form-item :prop="'deliveryDetailsList.' + scope.$index + '.stockQty'"
                            :rules="dataRule.stockQty"
                            label-width="0px">
                <el-input v-model="scope.row.wayStock"
                          placeholder="库存数量"
                          :disabled="isDisabled"
                          type="Number"
                          @mousewheel.native.prevent></el-input>
              </el-form-item>
            </template>
          </el-table-column>
          <el-table-column prop="wayStock"
                           header-align="center"
                           align="center"
                           label="在途数量"
                           width="80">
            <template slot-scope="scope">
              <el-form-item :prop="'deliveryDetailsList.' + scope.$index + '.wayStock'"
                            :rules="dataRule.wayStock"
                            label-width="0px">
                <el-input v-model="scope.row.wayStock"
                          placeholder="在途数量"
                          :disabled="isDisabled"
                          type="Number"
                          @mousewheel.native.prevent></el-input>
              </el-form-item>
            </template>
          </el-table-column>
          <el-table-column prop="daySale"
                           header-align="center"
                           align="center"
                           label="日均销量"
                           width="80">
            <template slot-scope="scope">
              <el-form-item :prop="'deliveryDetailsList.' + scope.$index + '.daySale'"
                            :rules="dataRule.daySale"
                            label-width="0px">
                <el-input v-model="scope.row.daySale"
                          placeholder="日均销量"
                          :disabled="isDisabled"
                          type="Number"
                          @mousewheel.native.prevent></el-input>
              </el-form-item>
            </template>
          </el-table-column>
          <el-table-column prop="estimateQty"
                           header-align="center"
                           align="center"
                           label="预估销量"
                           width="80">
            <template slot-scope="scope">
              <el-form-item :prop="'deliveryDetailsList.' + scope.$index + '.estimateQty'"
                            :rules="dataRule.estimateQty"
                            label-width="0px">
                <el-input v-model="scope.row.estimateQty"
                          placeholder="预估销量"
                          :disabled="isDisabled"
                          type="Number"
                          @mousewheel.native.prevent></el-input>
              </el-form-item>
            </template>
          </el-table-column>
          <el-table-column prop="needQty"
                           header-align="center"
                           align="center"
                           label="要货数量"
                           width="80">
            <template slot-scope="scope">
              <el-form-item :prop="'deliveryDetailsList.' + scope.$index + '.needQty'"
                            :rules="dataRule.needQty"
                            label-width="0px">
                <el-input v-model="scope.row.needQty"
                          placeholder="要货数量"
                          :disabled="isDisabled"
                          type="Number"
                          @mousewheel.native.prevent></el-input>
              </el-form-item>
            </template>
          </el-table-column>
          <el-table-column prop="reason"
                           header-align="center"
                           align="center"
                           label="要货原因"
                           width="100">
            <template slot-scope="scope">
              <textarea-all v-model="scope.row.reason"
                            :disabled="isDisabled"></textarea-all>
            </template>
          </el-table-column>
          <el-table-column prop="confirmQty"
                           header-align="center"
                           align="center"
                           label="最终确认数量"
                           width="80">
            <template slot-scope="scope">
              <el-form-item :prop="'deliveryDetailsList.' + scope.$index + '.confirmQty'"
                            :rules="dataRule.confirmQty"
                            label-width="0px">
                <el-input v-model="scope.row.confirmQty"
                          placeholder="最终确认数量"
                          type="Number"
                          @mousewheel.native.prevent
                          :disabled="confirmQtyDisable"></el-input>
              </el-form-item>
            </template>
          </el-table-column>
          <!-- 操作列 -->
          <el-table-column fixed="right"
                           width="80"
                           label="操作">
            <template slot-scope="scope">
              <el-button type="danger"
                         size="small"
                         circle
                         @click="deleteHandle(scope.$index)"
                         disabled>
                <i class="iconfont erp-icon-shanchu"></i>
              </el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </el-form>
    <span slot="footer"
          class="dialog-footer">
      <el-button @click="cancel('dataForm')"><i class="iconfont erp-icon-quxiao"></i>取消</el-button>
      <!-- <el-button type="primary" @click="dataFormSubmit()">保存</el-button> -->
      <el-button type="primary"
                 @click="dataFormSubmit()">审核</el-button>
    </span>
  </el-dialog>
</template>

<script>
import selectSeach from '@/components/erp-select/select-seach'
import selectAll from '@/components/erp-select/select-all'
// 引入图片
import tableImg from '@/components/list-table/table-img'
import { getUrl, getRequest, clearTaskId } from '@/utils'
import { dateFormatter } from '@/utils/index.js'
// 备注
import textareaAll from '@/components/erp-input/textarea-all.vue'
export default {
  components: {
    selectSeach,
    selectAll,
    tableImg,
    textareaAll
  },
  data () {
    // 包括0的正整数（并且不是必填）
    var valiIntegerByZero = (rule, value, callback) => {
      if (!/^[+]{0,1}(\d+)$/.test(value) && !!value) {
        callback(new Error('请输入0或正整数'))
      } else {
        callback()
      }
    }
    var validateGtInteger = (rule, value, callback) => {
      if (!/^[1-9]\d*$/.test(value)) {
        callback(new Error('请输入正整数'))
      } else {
        callback()
      }
    }
    return {
      confirmQtyDisable: false, // 最终确认数量
      isShowNode2: true, // 驳回上一级是否显示
      isShowNode3: true, // 驳回发起人
      isDisabled: false,
      skuDataList: [], // sku一览表数据
      // 审批单选
      taskId: '',
      isShowAddBtn: true,
      // deliveryDetailsList: [],
      dataListLoading: false,
      visible: false,
      addSkuVisible: false,
      node: '', // 节点
      dataForm: {
        radio: 1, // 默认选择审批通过
        id: '',
        code: '',
        inChargeOf: '',
        planDate: '',
        channelId: '',
        dictDeliveryPlanType: '02', // 业务类型，海外仓调拨默认'01'
        dictExpectTransit: '',
        expectArriveDate: '',
        planDate: dateFormatter(new Date(), false),
        sellerId: '',
        remark: '',
        dictNeedPlantform: '',
        dictDocStatus: '01', // 单据状态默认'01'
        dictConfirmTransit: '',
        shipPlanDate: '',
        shipperId: '',
        telphone: '',
        compId: '',
        fromWarehouseId: '',
        toWarehouseId: '',

        // 审批意见
        comments: '',
        // 要货明细
        deliveryDetailsList: []
      },
      // 销售员搜索数据
      sellerIdOption: [],
      // 要货店铺下拉
      channelIdOptions: [],
      // 期望物流方式
      dictExpectTransitOptions: [],
      // 销售员
      // sellerIdOptions: [],
      // 要货平台
      dictNeedPlatformOptions: [],
      // 单据状态
      dictDocStatusOptions: [],
      // 确认物流方式
      dictConfirmTransitOptions: [],
      // 物流承运商
      shipperIdOptions: [],
      // 发货公司
      compIdOptions: [],
      // 计划发货仓库
      fromWarehouseIdOptions: [],
      // 目的地发货
      toWarehouseIdOptions: [],
      dataRule: {
        channelId: [
          { required: true, message: '要货店铺', trigger: 'change' }
        ],
        shipPlanDate: [
          { required: true, message: '预计派送日期', trigger: 'change' }
        ],
        dictNeedPlatform: [
          { required: true, message: '请选择要货平台', trigger: 'change' }
        ],
        planDate: [
          { required: true, message: '选择要货日期', trigger: 'change' }
        ],
        dictConfirmTransit: [
          { required: true, message: '选择物流方式', trigger: 'change' }
        ],
        compId: [
          { required: true, message: '选择发货公司', trigger: 'change' }
        ],
        fromWarehouseId: [
          { required: true, message: '选择发货仓库', trigger: 'change' }
        ],
        stockQty: [{ validator: valiIntegerByZero, trigger: 'blur' }],
        wayStock: [{ validator: valiIntegerByZero, trigger: 'blur' }],
        daySale: [{ validator: valiIntegerByZero, trigger: 'blur' }],
        estimateQty: [{ validator: valiIntegerByZero, trigger: 'blur' }],
        needQty: [{ validator: validateGtInteger, trigger: 'blur' }],
        confirmQty: [
          { required: true, message: '不能为空', trigger: 'blur' },
          // { transform: Number, type: 'integer', message: "请输入正整数", trigger: "blur" },
          { validator: validateGtInteger, trigger: 'blur' }
        ]
        // comments: [{ required: true, message: '请填写审批意见', trigger: 'blur' }],
      }
    }
  },
  methods: {
    //   要货店铺改变获取目的地仓库
    channelChange (val) {
      this.$http.get(this.$http.adornUrl('basic/basicchannel/getChannelWarehouse'), {
        params: { channelId: val }
      }).then(({ data }) => {
        if (data && data.list) {
          this.toWarehouseIdOptions.push({ id: data.list.warehouseId, name: data.list.name })
          this.dataForm.toWarehouseId = data.list.warehouseId
        } else {
          // 方案一
          this.dataForm.toWarehouseId = ''
          this.toWarehouseIdOptions = []
          // 方案二
        }
      })
    },
    // 发货仓库改变
    fromWarehouseChange (value) {
      //   this.toWarehouseIdOptions.forEach(item => {
      //     item.id === value || item.id === this.dataForm.toWarehouseId
      //       ? (item.disabled = true)
      //       : (item.disabled = false);
      //   });
    },
    // 目的地仓库改变
    toWarehouseChange (value) {
      //   this.fromWarehouseIdOptions.forEach(item => {
      //     item.id === value || item.id === this.dataForm.fromWarehouseId
      //       ? (item.disabled = true)
      //       : (item.disabled = false);
      //   });
    },
    // 要货平台下的店铺
    selectChange (value) {
      this.$http
        .get(this.$http.adornUrl('basic/basicchannel/listcombobox'), {
          params: { platformType: value }
        })
        .then(({ data }) => {
          this.channelIdOptions = data.list
        })
    },
    // 选择公司触发
    compNameChange (value, type) {
      if (type) {
        this.$http
          .get(this.$http.adornUrl('list/combobox/warehouse-comp'), {
            params: { compId: value }
          })
          .then(({ data }) => {
            this.fromWarehouseIdOptions = data.list
            // this.toWarehouseIdOptions = data.list;
            // if (this.dataForm.fromWarehouseId) {
            //   this.fromWarehouseChange(this.dataForm.fromWarehouseId);
            // } else if (this.dataForm.toWarehouseId) {
            //   this.toWarehouseChange(this.dataForm.toWarehouseId);
            // }
            // 当前版本逻辑
            this.fromWarehouseIdOptions.forEach(item => {
              item.id === this.dataForm.toWarehouseId
                ? (item.disabled = true)
                : (item.disabled = false)
            })
          })
      } else {
        this.dataForm.fromWarehouseId = ''
        // this.dataForm.toWarehouseId = "";
        this.$http
          .get(this.$http.adornUrl('list/combobox/warehouse-comp'), {
            params: { compId: value }
          })
          .then(({ data }) => {
            this.fromWarehouseIdOptions = data.list
            // this.toWarehouseIdOptions = data.list;
            // 当前版本逻辑
            this.fromWarehouseIdOptions.forEach(item => {
              item.id === this.dataForm.toWarehouseId
                ? (item.disabled = true)
                : (item.disabled = false)
            })
          })
      }
    },
    // 关闭清除本次缓存
    clearCache (formName) {
      this.$nextTick(() => {
        // this.$refs[formName].resetFields()
        // this.dataForm.deliveryDetailsList = []
      })
    },
    // 弹窗关闭之前
    handleClose (done) {
      this.clearCache('dataForm')
      this.dataForm.radio = 1
      done()
    },
    // 取消按钮
    cancel (formName) {
      this.clearCache(formName)
      this.dataForm.radio = 1
      this.visible = false
    },
    // 删除要货明细
    deleteHandle (index) {
      this.dataForm.deliveryDetailsList.splice(index, 1)
    },
    getDataUrl () {
      // 销售员
      // this.$http.get(this.$http.adornUrl('list/search/user')).then(({ data }) => { this.sellerIdOptions = data.list })
      // 要货店铺
      // this.$http.get(this.$http.adornUrl('list/combobox/channel')).then(({ data }) => { this.channelIdOptions = data.list })
      // 要货平台
      this.$http
        .get(this.$http.adornUrl('basicData/queryDataDict2List'), {
          params: { dataDictKey: 'PLANTFORM_TYPE' }
        })
        .then(({ data }) => {
          this.dictNeedPlatformOptions = data.fontMaps
        })
      // 期望物流方式
      this.$http
        .get(this.$http.adornUrl('basicData/queryDataDict2List'), {
          params: { dataDictKey: 'TRANSPORT_MODE' }
        })
        .then(({ data }) => {
          this.dictExpectTransitOptions = data.fontMaps
        })
      // 确认物流方式
      this.$http
        .get(this.$http.adornUrl('basicData/queryDataDict2List'), {
          params: { dataDictKey: 'TRANSPORT_MODE' }
        })
        .then(({ data }) => {
          this.dictConfirmTransitOptions = data.fontMaps
        })
      // 发货公司
      this.$http
        .get(this.$http.adornUrl('list/combobox/company'))
        .then(({ data }) => {
          this.compIdOptions = data.list
        })
      // 单据状态
      this.$http
        .get(this.$http.adornUrl('basicData/queryDataDict2List'), {
          params: { dataDictKey: 'APPROVAL_STATUS' }
        })
        .then(({ data }) => {
          this.dictDocStatusOptions = data.fontMaps
        })
      // 计划发货仓库
      // this.$http.get(this.$http.adornUrl('list/combobox/warehouse')).then(({ data }) => { this.fromWarehouseIdOptions = data.list })
      // 目的地仓库
      // this.$http.get(this.$http.adornUrl('list/combobox/warehouse')).then(({ data }) => { this.toWarehouseIdOptions = data.list })
    },
    init (id, row) {
      Object.assign(this.$data, this.$options.data())
      this.visible = true
      this.isShowAddBtn = false
      this.getDataUrl()
      this.dataForm.id = id
      this.dataForm.deliveryDetailsList = []
      this.taskId = row.taskId
      this.node = row.node
      this.dataForm.radio = 1
      // 如果是节点1，则去掉驳回上一级按钮
      if (this.node === 'T01' || this.node === null) {
        this.isShowNode2 = false
        this.isShowNode3 = true
        // 销售主管审批时
        this.isDisabled = true
        // 最终确认数量可以编辑
        this.confirmQtyDisable = false
      } else if (this.node === 'T02') {
        this.isShowNode2 = true
        this.isShowNode3 = true
        this.isDisabled = true
        // 只有T01确认数量才可以编辑，其他都不可
        this.confirmQtyDisable = true
      } else {
        this.isShowNode2 = false
        this.isShowNode3 = false
        this.isDisabled = true
        // 只有T01确认数量才可以编辑，其他都不可
        this.confirmQtyDisable = true
      }
      if (id) {
        this.$nextTick(() => {
          this.$refs['dataForm'].resetFields()
          if (this.dataForm.id) {
            this.$http({
              url: this.$http.adornUrl(`warehouse/whdeliveryplan/info/${id}`),
              method: 'get'
            }).then(({ data }) => {
              if (data && data.code === 0) {
                this.dataForm = Object.assign(
                  {},
                  this.dataForm,
                  data.deliveryPlanInfo.whDeliveryPlanEntity
                )
                this.selectChange(this.dataForm.dictNeedPlatform)
                this.compNameChange(this.dataForm.compId, id)
                this.channelChange(this.dataForm.channelId)

                data.deliveryPlanInfo.whDeliveryPlanDetailList.forEach(item => {
                  this.$set(item, 'unitName', item.prodUnit)
                  this.$set(item, 'fnsku', item.fnSku)
                })
                this.dataForm.deliveryDetailsList =
                  data.deliveryPlanInfo.whDeliveryPlanDetailList

                // 搜索建议框数据
                // this.sellerIdOption = []
                // this.sellerIdOption.push({ id: data.deliveryPlanInfo.whDeliveryPlanEntity.sellerId, name: data.deliveryPlanInfo.whDeliveryPlanEntity.sellerId })
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
      }
    },
    // 审核提交
    dataFormSubmit: _.debounce(
      async function dataFormSubmit () {
        // 如果审核驳回发起人，不再去校验字段
        if (this.dataForm.radio === 3 || this.dataForm.radio === 2) {
          this.$http({
            url: this.$http.adornUrl(`activiti/approval`),
            method: 'put',
            data: {
              taskId: this.taskId,
              operation: this.dataForm.radio,
              businessId: this.dataForm.id,
              processKey: 'wh_delivery_plan',

              routeUrl: getUrl(),
              code: this.dataForm.code,
              docName: '要货计划申请单',
              comments: this.dataForm.comments,
              variablesMap: {}
            } // Object.assign({}, { whDeliveryPlanEntity: this.dataForm }, { whDeliveryPlanDetailList: this.dataForm.deliveryDetailsList })
          }).then(({ data }) => {
            if (data && data.code === 0) {
              //清除url的taskId
              window.location.href = clearTaskId()
              this.visible = false
              this.$emit('refreshDataList')
              this.clearCache('dataForm')
              this.$notify({
                title: '成功',
                message: '操作成功',
                type: 'success',
                duration: 1500
              })
            } else {
              this.$notify.error({
                title: '错误',
                message: data.msg,
                duration: 5000
              })
            }
          })
        } else {
          // if (this.radio === 1 || (this.node === 'T02' && this.radio === 2)) {
          this.$refs['dataForm'].validate(valid => {
            if (valid) {
              // 先去update数据，更新成功后去审核
              this.$http({
                url: this.$http.adornUrl(
                  `warehouse/whdeliveryplan/${
                  !this.dataForm.id ? 'save' : 'update'
                  }`
                ),
                method: !this.dataForm.id ? 'post' : 'put',
                data: Object.assign(
                  {},
                  { whDeliveryPlanEntity: this.dataForm },
                  {
                    whDeliveryPlanDetailList: this.dataForm.deliveryDetailsList
                  }
                )
              }).then(({ data }) => {
                if (data && data.code === 0) {
                  this.$http({
                    url: this.$http.adornUrl(`activiti/approval`),
                    method: 'put',
                    data: {
                      taskId: this.taskId,
                      operation: this.dataForm.radio,
                      businessId: this.dataForm.id,
                      processKey: 'wh_delivery_plan',

                      routeUrl: getUrl(),
                      code: this.dataForm.code,
                      docName: '要货计划申请单',
                      comments: this.dataForm.comments,
                      variablesMap: {}
                    } // Object.assign({}, { whDeliveryPlanEntity: this.dataForm }, { whDeliveryPlanDetailList: this.dataForm.deliveryDetailsList })
                  }).then(({ data }) => {
                    if (data && data.code === 0) {
                      //清除url的taskId
                      window.location.href = clearTaskId()
                      this.visible = false
                      this.$emit('refreshDataList')
                      this.clearCache('dataForm')
                      this.$notify({
                        title: '成功',
                        message: '操作成功',
                        type: 'success',
                        duration: 1500
                      })
                    } else {
                      this.$notify.error({
                        title: '错误',
                        message: data.msg,
                        duration: 5000
                      })
                    }
                  })
                } else {
                  this.$notify.error({
                    title: '错误',
                    message: data.msg,
                    duration: 5000
                  })
                }
              })
            } else {
              return false
            }
          })
        }
      },
      1000,
      {
        leading: true,
        trailing: false
      }
    )
  }
}
</script>

