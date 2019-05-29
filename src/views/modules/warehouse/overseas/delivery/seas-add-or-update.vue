<template>
  <el-dialog :title="dialogTitle"
             width="90%"
             top="10vh"
             :close-on-click-modal="false"
             :visible.sync="visible"
             v-if="visible"
             :before-close="handleClose">
    <!-- 审核头 -->
    <approval-new v-model="approvalData"
                  v-if='isShowApproval'></approval-new>
    <el-form :model="dataForm"
             :rules="dataRule"
             ref="dataForm"
             label-width="110px">
      <ElCollapse v-model="activeNames">
        <ElCollapseItem name="1">
          <!-- 基本信息 -->
          <template slot="title">
            <div class="item">基本信息:</div>
          </template>
          <el-row>
            <el-col :span="6">
              <el-form-item label="要货计划单号"
                            prop="code">
                <el-input v-model="dataForm.code"
                          placeholder="未生成"
                          disabled></el-input>
              </el-form-item>
              <el-form-item label="要货平台"
                            prop="dictNeedPlatform">
                <select-all v-model="dataForm.dictNeedPlatform"
                            :listDataOption="dictNeedPlatformOptions"
                            :isDisabled="isDisableFromAdd"
                            data-value="key"
                            data-label="value"
                            :isSelectChange="true"
                            @selectChange="selectChange"></select-all>
              </el-form-item>
              <el-form-item label="要货店铺"
                            prop="channelId">
                <select-all v-model="dataForm.channelId"
                            :listDataOption="channelIdOptions"
                            :isDisabled="isDisableFromAdd"
                            data-value="id"
                            data-label="name"
                            :isSelectChange="true"
                            @selectChange="channelChange"></select-all>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="要求发货日期"
                            prop="planDate">
                <!-- 留着有用 -->
                <!-- <date-Picker-all v-model="dataForm.planDate"
                                 typeName='date'
                                 value-format="yyyy-MM-dd"
                                 placeholder='选择发货日期'
                                 :disabled='disableApprove'></date-Picker-all> -->
                <el-date-picker v-model="dataForm.planDate"
                                type="date"
                                value-format="yyyy-MM-dd"
                                placeholder="选择发货日期"
                                :disabled='disableApprove'></el-date-picker>
              </el-form-item>
              <el-form-item label="销售员"
                            prop="sellerId">
                <select-seach v-model="dataForm.sellerId"
                              httpUrl="list/search/user"
                              requestParamsKey="name"
                              httpMethod="get"
                              data-label="name"
                              data-value="id"
                              data-source="list"
                              :listDataOptionStatic="sellerIdOption"
                              :isDisabled='disableApprove'></select-seach>
              </el-form-item>
              <el-form-item label="业务类型"
                            prop="dictDeliveryPlanType">
                <select-all v-model="dataForm.dictDeliveryPlanType"
                            :listDataOption="deliveryTypeOptions"
                            data-value="key"
                            data-label="value"
                            :isDisabled='disableApprove'></select-all>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="期望到达日期"
                            prop="expectArriveDate">
                <el-date-picker v-model="dataForm.expectArriveDate"
                                type="date"
                                value-format="yyyy-MM-dd"
                                default-time
                                placeholder="选择日期"
                                :disabled='disableApprove'></el-date-picker>
              </el-form-item>
              <el-form-item label="期望物流方式"
                            prop="dictExpectTransit">
                <select-all v-model="dataForm.dictExpectTransit"
                            :listDataOption="dictExpectTransitOptions"
                            data-value="key"
                            data-label="value"
                            :isDisabled='disableApprove'></select-all>
              </el-form-item>
              <el-form-item label="发货类型"
                            prop="shipType">
                <select-all v-model="dataForm.shipType"
                            :listDataOption="shipTypeOptions"
                            data-value="key"
                            data-label="value"
                            :isDisabled="disableApprove"></select-all>
              </el-form-item>

            </el-col>
            <el-col :span="6">
              <el-form-item label="是否含税"
                            prop="bTax">
                <el-switch v-model="dataForm.bTax"
                           active-color="#13ce66"
                           inactive-color="#ff4949"
                           active-text="是"
                           inactive-text="否"
                           :disabled='disableApprove'></el-switch>
              </el-form-item>
              <el-form-item label="单据状态"
                            prop="dictDocStatus">
                <select-all v-model="dataForm.dictDocStatus"
                            :listDataOption="dictDocStatusOptions"
                            :isDisabled="true"
                            data-value="key"
                            data-label="value"></select-all>
              </el-form-item>
              <el-form-item label="备注"
                            prop="remark">
                <textarea-all v-model="dataForm.remark"
                              :disabled="disableApprove"></textarea-all>
              </el-form-item>

            </el-col>
          </el-row>
        </ElCollapseItem>
        <ElCollapseItem name="2">
          <!-- 仓库确认 -->
          <template slot="title">
            <div class="item">仓库确认:</div>
          </template>
          <el-row>
            <el-col :span="6">
              <el-form-item label="发货公司"
                            prop="compId"
                            :rules="this.nodeName === '仓库审核'?dataRule.compId:[{ required: false, message: '选择发货公司', trigger: 'change' }]">
                <select-all v-model="dataForm.compId"
                            :isDisabled="isDisableT02"
                            :listDataOption="compIdOptions"
                            data-value="id"
                            data-label="name"
                            :isSelectChange="true"
                            @selectChange="compNameChange"></select-all>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="计划发货仓库"
                            prop="fromWarehouseId"
                            :rules="this.nodeName === '仓库审核'?dataRule.fromWarehouseId:[{ required: false, message: '选择发货仓库', trigger: 'change' }]">
                <select-all v-model="dataForm.fromWarehouseId"
                            :isDisabled="isDisableT02"
                            :listDataOption="fromWarehouseIdOptions"
                            data-value="id"
                            data-label="name"></select-all>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="目的地仓库"
                            prop="toWarehouseId"
                            :rules="[{ required: false, message: '选择目的地仓库', trigger: 'change' }]">
                <select-all v-model="dataForm.toWarehouseId"
                            :isDisabled="isDisableT02"
                            :listDataOption="toWarehouseIdOptions"
                            data-value="id"
                            data-label="name"></select-all>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="FBAShipmentID"
                            prop="fbaShipmentId"
                            :rules="[{ required: false, message: '输入fbaShipmentId', trigger: 'change' }]">
                <el-input v-model="dataForm.fbaShipmentId"
                          placeholder=""
                          :disabled="isDisableT02"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
        </ElCollapseItem>
      </ElCollapse>
      <div>
        <!-- 要货明细 -->
        <el-row>
          <el-button type="text"
                     v-if="!isDisabled"
                     @click="addSkuHandle()">
            <i class="iconfont erp-icon-tianjiamingxi"></i>添加明细行</el-button>
        </el-row>
        <!-- 表格 -->
        <el-table :data="dataForm.deliveryDetailsList"
                  stripe
                  border
                  highlight-current-row
                  v-loading="dataListLoading"
                  max-height="400"
                  show-summary
                  class="tableInfo"
                  :summary-method="getSummaries">
          <el-table-column label="自定义SKU"
                           width="180">
            <template slot-scope="scope">
              <el-row>
                <el-col :span="20">
                  <el-row>
                    <strong>编码:</strong>
                    <span>{{scope.row.prodCode}}</span>
                  </el-row>
                  <el-row>
                    <strong>名称:</strong>
                    <span>{{scope.row.prodName}}</span>
                  </el-row>
                  <el-row>
                    <strong>单位:</strong>
                    <span>{{scope.row.unitName}}</span>
                  </el-row>
                  <el-row>
                    <strong>规格型号:</strong>
                    <span>{{scope.row.specifications}}</span>
                  </el-row>
                </el-col>
                <!-- 是否组合产品 -->
                <el-col :span="4"
                        v-if='scope.row.bAssemble'>
                  <div class="isCombine"><span>组合</span></div>
                </el-col>
              </el-row>
            </template>
          </el-table-column>
          <el-table-column label="渠道SKU"
                           width="120">
            <template slot-scope="scope">
              <el-row>
                <strong>SKU:</strong>
                <span>{{scope.row.sellSku}}</span>
              </el-row>
              <el-row>
                <strong>ASIN:</strong>
                <span>{{scope.row.asin}}</span>
              </el-row>
              <el-row>
                <strong>FNSKU:</strong>
                <span>{{scope.row.fnsku}}</span>
              </el-row>
            </template>
          </el-table-column>
          <el-table-column prop="stockQty"
                           label="库存数量"
                           width="140">
            <template slot-scope="scope">
              <el-form-item label="现有"
                            :prop="'deliveryDetailsList.' + scope.$index + '.stockQty'"
                            :rules="dataRule.stockQty"
                            label-width="40px">
                <el-input v-model="scope.row.stockQty"
                          placeholder="库存数量"
                          :disabled="isDisabled"
                          type="Number"
                          @mousewheel.native.prevent></el-input>
              </el-form-item>
              <el-form-item label="在途"
                            :prop="'deliveryDetailsList.' + scope.$index + '.wayStock'"
                            :rules="dataRule.wayStock"
                            label-width="40px">
                <el-input v-model="scope.row.wayStock"
                          placeholder="在途数量"
                          :disabled="isDisabled"
                          type="Number"
                          @mousewheel.native.prevent></el-input>
              </el-form-item>
            </template>
          </el-table-column>
          <el-table-column prop="daySale"
                           label="预估销量"
                           width="140">
            <template slot-scope="scope">
              <el-form-item label="日均"
                            :prop="'deliveryDetailsList.' + scope.$index + '.daySale'"
                            :rules="dataRule.daySale"
                            label-width="40px">
                <el-input v-model="scope.row.daySale"
                          placeholder="日均销量"
                          :disabled="isDisabled"
                          type="Number"
                          @mousewheel.native.prevent></el-input>
              </el-form-item>
              <el-form-item label="预估"
                            :prop="'deliveryDetailsList.' + scope.$index + '.estimateQty'"
                            :rules="dataRule.estimateQty"
                            label-width="40px">
                <el-input v-model="scope.row.estimateQty"
                          placeholder="预估销量"
                          :disabled="isDisabled"
                          type="Number"
                          @mousewheel.native.prevent></el-input>
              </el-form-item>
            </template>
          </el-table-column>
          <el-table-column prop="needQty"
                           label="要货数量"
                           width="140">
            <template slot-scope="scope">
              <el-form-item :prop="'deliveryDetailsList.' + scope.$index + '.needQty'"
                            :rules="dataRule.needQty"
                            label-width="0px">
                <el-input v-model="scope.row.needQty"
                          placeholder="要货数量"
                          @input="boxNumHandle(scope.row,'1')"
                          :disabled="isDisabled"
                          type="Number"
                          @mousewheel.native.prevent></el-input>
              </el-form-item>
              <div>验收合格数量：</div>
              <el-form-item label=""
                            :prop="'deliveryDetailsList.' + scope.$index + '.qualifiedQty'"
                            :rules="node === 'T05'?dataRule.qualifyQtyRequire:dataRule.qualifiedQty"
                            label-width="0px">
                <el-input v-model="scope.row.qualifiedQty"
                          placeholder="合格数量"
                          :disabled="node === 'T05'?false:true"
                          type="Number"
                          @mousewheel.native.prevent></el-input>
              </el-form-item>
            </template>
          </el-table-column>
          <el-table-column prop="reason"
                           label="要货原因"
                           width="100">
            <template slot-scope="scope">
              <textarea-all v-model="scope.row.reason"
                            :disabled='isDisabled'></textarea-all>
            </template>
          </el-table-column>
          <el-table-column prop="confirmQty"
                           label="最终确认数量"
                           width="100">
            <template slot-scope="scope">
              <el-form-item :prop="'deliveryDetailsList.' + scope.$index + '.confirmQty'"
                            :rules="dataRule.confirmQty"
                            label-width="0px">
                <el-input v-model="scope.row.confirmQty"
                          placeholder="最终确认数量"
                          :disabled="confirmQtyDisable"
                          type="Number"
                          @mousewheel.native.prevent
                          @input="boxNumHandle(scope.row)"></el-input>
              </el-form-item>
            </template>
          </el-table-column>
          <!-- 物流审核时都可以编辑 -->
          <el-table-column prop="dictConfirmTransit"
                           label="物流方式/产品属性"
                           width="150">
            <template slot-scope="scope">
              <el-form-item :prop="'deliveryDetailsList.' + scope.$index + '.dictConfirmTransit'"
                            label-width="0px"
                            :rules="[{ required: nodeName === '物流审核', message: '选择物流方式', trigger: 'change' }]">
                <select-all v-model="scope.row.dictConfirmTransit"
                            :listDataOption="dictConfirmTransitOptions"
                            :isDisabled="isDisableT03"
                            data-value="key"
                            data-label="value"
                            placeholder="选择物流方式"></select-all>
              </el-form-item>
              <!-- 显示产品属性 -->
              <div>{{scope.row.propertiesName}}</div>
            </template>
          </el-table-column>
          <el-table-column prop="shipPlanDate"
                           label="预计派送日期"
                           width="160">
            <template slot-scope="scope">
              <el-form-item prop="shipPlanDate"
                            label-width="0px">
                <el-date-picker v-model="scope.row.shipPlanDate"
                                type="date"
                                value-format="yyyy-MM-dd"
                                :disabled="isDisableT03"
                                placeholder="选择日期"></el-date-picker>
              </el-form-item>
            </template>
          </el-table-column>
          <el-table-column prop="shipperId"
                           label="承运商"
                           width="100">
            <template slot-scope="scope">
              <el-form-item prop="shipperId"
                            label-width="0px">
                <select-all v-model="scope.row.shipperId"
                            :listDataOption="shipperIdOptions"
                            :isDisabled="true"
                            data-value="id"
                            data-label="name"
                            placeholder="选择物流承运商"></select-all>
              </el-form-item>
            </template>
          </el-table-column>
          <el-table-column prop="daySale"
                           label="单箱数量/箱数"
                           width="140">
            <template slot-scope="scope">
              <el-form-item label="单箱"
                            :prop="'deliveryDetailsList.' + scope.$index + '.outboxQty'"
                            :rules="nodeName === '物流审核'?[ 
              { required: nodeName === '物流审核', message: '必填项', trigger: 'change' },
              { pattern: /^[1-9]\d*$/, message: '正整数', trigger: 'change' }
              ]:[{ required: false, message: '', trigger: 'change' },{ pattern: /^[+]{0,1}(\d+)$/, message: '正整数', trigger: 'change' }]"
                            label-width="50px">
                <el-input v-model="scope.row.outboxQty"
                          @input="boxNumHandle(scope.row)"
                          placeholder="数量"
                          :disabled="isDisableT03"
                          type="Number"
                          @mousewheel.native.prevent></el-input>
              </el-form-item>
              <el-form-item label="箱数"
                            :prop="'deliveryDetailsList.' + scope.$index + '.countOutboxQty'"
                            :rules="nodeName === '物流审核'?[ 
              { required: nodeName === '物流审核', message: '必填项', trigger: 'change' },
              { pattern: /^[1-9]\d*$/, message: '正整数', trigger: 'change' }
              ]:[{ required: false, message: '', trigger: 'change' }]"
                            label-width="50px">
                <el-input v-model="scope.row.countOutboxQty"
                          @input="boxNumHandle(scope.row,'2')"
                          placeholder="总箱数"
                          :disabled="true"
                          type="Number"
                          @mousewheel.native.prevent></el-input>
              </el-form-item>
            </template>
          </el-table-column>
          <el-table-column prop="daySale"
                           label="重量"
                           width="140">
            <template slot-scope="scope">
              <el-form-item label="单箱"
                            :prop="'deliveryDetailsList.' + scope.$index + '.outboxWeight'"
                            :rules="dataRule.outboxWeight"
                            label-width="40px">
                <el-input v-model="scope.row.outboxWeight"
                          @input="boxNumHandle(scope.row,'3')"
                          placeholder="单箱重量"
                          :disabled="isDisableT03"
                          type="Number"
                          @mousewheel.native.prevent></el-input>
              </el-form-item>
              <el-form-item label="总重"
                            :prop="'deliveryDetailsList.' + scope.$index + '.countOutboxWeight'"
                            :rules="dataRule.countOutboxWeight"
                            label-width="40px">
                <el-input v-model="scope.row.countOutboxWeight"
                          placeholder="总重"
                          :disabled="isDisableT03"
                          type="Number"
                          @mousewheel.native.prevent></el-input>
              </el-form-item>
            </template>
          </el-table-column>
          <el-table-column prop="outboxSize"
                           label="单箱体积"
                           width="140">
            <template slot-scope="scope">
              <el-form-item :prop="'deliveryDetailsList.' + scope.$index + '.outboxSize'"
                            :rules="dataRule.outboxSize"
                            label-width="0px">
                <el-input v-model="scope.row.outboxSize"
                          placeholder="单箱体积"
                          :disabled="isDisableT03"></el-input>
              </el-form-item>
            </template>
          </el-table-column>
          <!-- 操作列 -->
          <el-table-column fixed="right"
                           width="120"
                           label="操作">
            <template slot-scope="scope">
              <el-button type="danger"
                         circle
                         title="删除"
                         @click="deleteHandle(scope)"
                         :disabled="isDisabled">
                <i class="iconfont erp-icon-shanchu"></i>
              </el-button>
              <el-button type="primary"
                         circle
                         v-if='scope.row.bAssemble'
                         title="库存情况"
                         @click="stockCheckHandle(scope,'1')">
                <i class="iconfont erp-icon-chakan"></i>
              </el-button>
              <el-button type="success"
                         circle
                         title="打印产品标签"
                         v-if="isAuth('warehouse:whdeliveryplan:getSkuLabel')"
                         @click="printProdLabel(scope.row)">
                <i class="iconfont erp-icon-dayin"></i>
              </el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </el-form>
    <!-- 添加明细 -->
    <add-details ref="addDetails"
                 @addDetailsList="addList"></add-details>
    <!-- 库存情况 -->
    <stock-check ref="stockCheckRef"
                 @continue='continueHandle'></stock-check>
    <!-- 打印产品标签 -->
    <print-prodlabel ref="prodlabel"></print-prodlabel>
    <span slot="footer"
          class="dialog-footer">
      <el-button @click="cancel('dataForm')"><i class="iconfont erp-icon-quxiao"></i>取消</el-button>
      <el-button type="primary"
                 @click="saveOrSubmit('2')"
                 v-if="!isDisabled"><i class="iconfont erp-icon-baocun"></i>保存</el-button>
      <el-button type="primary"
                 @click="saveOrSubmit('3')"
                 v-if="!isDisabled && isAuth('overseas:whdeliveryplan:submit')"><i class="iconfont erp-icon-queding"></i>提交</el-button>
      <el-button type="primary"
                 v-if="isShowApproval"
                 @click="workflowApproval()"><i class="iconfont erp-icon-shenhe"></i>审核</el-button>
    </span>
  </el-dialog>
</template>

<script>
import selectSeach from '@/components/erp-select/select-seach'
import selectAll from '@/components/erp-select/select-all'
import approvalNew from '@/components/workflow/approval-new'
// 添加明细（新组件）
import addDetails from '@/components/add-details/sku-detail'
// 查看库存情况
import stockCheck from './stock-check'
import { getUrl, dateFormatter, clearTaskId } from '@/utils'
// 备注
import textareaAll from '@/components/erp-input/textarea-all.vue'
// 日期组件
import datePickerAll from '@/components/erp-date/datePicker-all'
// 打印产品标签
import printProdlabel from './print-prod-label'
export default {
  components: {
    selectSeach,
    selectAll,
    approvalNew,
    addDetails,
    stockCheck,
    textareaAll,
    datePickerAll,
    printProdlabel
  },
  data () {
    // 不包括0的正整数（并且不是必填）
    var validateInteger = (rule, value, callback) => {
      if (!/^[1-9]\d*$/.test(value) && !!value) {
        callback(new Error('请输入正整数'))
      } else {
        callback()
      }
    }
    // 包括0的正整数（并且不是必填）
    var valiIntegerByZero = (rule, value, callback) => {
      if (!/^[+]{0,1}(\d+)$/.test(value) && !!value) {
        callback(new Error('请输入0或正整数'))
      } else {
        callback()
      }
    }
    return {
      activeNames: ['1', '2'],
      disableApprove: false, // 审核时为true
      type: '',
      node: '', // 节点
      nodeName: '', // 节点名称（固定的不会变）
      isDisableT02: false, // T02和新增，编辑时false
      isDisableT03: true, // 物流审核时设置为false
      confirmQtyDisable: false, // 最终确认数量
      isShowApproval: false, // 审核头是否显示
      shipTypeOptions: [], // 发货类型
      toWarehouseFromChannel: [], // 来自要货店铺对应的仓库
      deliveryTypeOptions: [],
      isDisableFromAdd: false, // 列表里面没有数据时，可选
      submitId: '',
      isDisabled: false, // 查看设置为true
      dialogTitle: '', // dialog标题
      dataListLoading: false,
      visible: false,
      addSkuVisible: false,
      dataForm: {
        id: '',
        code: '',
        inChargeOf: '',
        channelId: '',
        dictDeliveryPlanType: '02', // 业务类型，海外仓调拨默认'01'
        dictExpectTransit: '',
        expectArriveDate: '',
        planDate: dateFormatter(new Date(), false), // 将"2018-11-08T09:07:37.648Z"转换为"2018-11-08"
        sellerId: '',
        remark: '',
        dictNeedPlatform: '01', // 默认亚马逊
        dictNeedPlantform: '',
        dictDocStatus: '01', // 单据状态默认'01'
        dictConfirmTransit: '',
        shipPlanDate: '',
        shipperId: '',
        telphone: '',
        compId: '',
        fromWarehouseId: '',
        toWarehouseId: '',
        fbaShipmentId: '',
        bTax: false, // 是否含税
        dictPickStatus: '01', // 拣货状态，新增未拣01，
        shipType: '02', // 发货类型
        // 要货明细
        deliveryDetailsList: []
      },
      // 销售员搜索数据
      sellerIdOption: [],
      // 要货店铺下拉
      channelIdOptions: [],
      // 期望物流方式
      dictExpectTransitOptions: [],
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
      // 目的地仓库
      toWarehouseIdOptions: [],
      dataRule: {
        fromWarehouseId: [{ required: true, message: '选择发货仓库', trigger: 'change' }],
        compId: [{ required: true, message: '选择发货公司', trigger: 'change' }],
        dictNeedPlatform: [{ required: true, message: '请选择要货平台', trigger: 'change' }],
        dictDeliveryPlanType: [{ required: true, message: '请选择业务类型', trigger: 'change' }],
        shipType: [{ required: true, message: '请选择发货类型', trigger: 'change' }],
        channelId: [{ required: true, message: '要货店铺', trigger: 'change' }],
        sellerId: [{ required: true, message: '请选择销售员', trigger: 'change' }],
        planDate: [{ required: true, message: '选择要货日期', trigger: 'change' }],
        stockQty: [{ validator: valiIntegerByZero, trigger: 'blur' }],
        wayStock: [{ validator: valiIntegerByZero, trigger: 'blur' }],
        daySale: [{ validator: valiIntegerByZero, trigger: 'blur' }],
        estimateQty: [{ validator: valiIntegerByZero, trigger: 'blur' }],
        needQty: [{ validator: validateInteger, trigger: 'blur' }],
        confirmQty: [
          { required: true, message: '必填项', trigger: 'change' },
          { pattern: /^[1-9]\d*$/, message: '正整数', trigger: 'change' }],
        qualifyQtyRequire: [
          { required: true, message: '必填项', trigger: 'change' },
          { pattern: /^[1-9]\d*$/, message: '正整数', trigger: 'change' }
        ],
        qualifiedQty: [
          { required: false, message: '', trigger: 'change' },
          { pattern: /^[+]{0,1}(\d+)$/, message: '正整数', trigger: 'change' }]
      }
    }
  },
  methods: {
    // 统计数量
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
            if (!isNaN(value)) {
              return prev + curr
            } else {
              return prev
            }
          }, 0)
          // 这里写自定义逻辑
          if (column.property === 'needQty' || column.property === 'confirmQty') {
            sums[index] = sums[index]
          } else {
            sums[index] = ''
          }
        } else {
          sums[index] = ''
        }
      })

      return sums
    },
    //   箱数和总重量--自动计算
    boxNumHandle (row, type) {
      //   如果类型为1，则表示是要货数量改变
      // 总重量解决2.3*3 = 6.89的问题
      if (type === '1') {
        //   要货数量赋值给最终确认数量
        row.confirmQty = row.needQty
        // 箱数=最终确认数量/单箱数量
        row.countOutboxQty = Math.ceil(Number(row.confirmQty) / Number(row.outboxQty))
      } else if (Number(row.outboxQty) === 0) {
        row.countOutboxQty = 0
      } else {
        // 箱数=最终确认数量/单箱数量
        row.countOutboxQty = Math.ceil(Number(row.confirmQty) / Number(row.outboxQty))
      }
      // 总重量=箱数*单箱重量
      row.countOutboxWeight = Math.round(Number(row.outboxWeight) * Number(row.countOutboxQty) * 100) / 100
    },
    // 提取公共接口
    initWareHouse (val) {
      return this.$http.get(this.$http.adornUrl('basic/basicchannel/getChannelWarehouse'), {
        params: {
          channelId: val
        }
      })
    },
    initWareHouseComp (val) {
      return this.$http
        .get(this.$http.adornUrl('list/combobox/warehouse-comp'), {
          params: {
            compId: val
          }
        })
    },
    initBasicChannel (val) {
      return this.$http
        .get(this.$http.adornUrl('basic/basicchannel/listcombobox'), {
          params: {
            platformType: val
          }
        })
    },
    // 数组对象去重（针对重复项为id的）
    arrReduce (arr, objTemp) {
      let newArr = []
      let obj = {}
      newArr = [...arr, objTemp].reduce((pre, cur) => {
        obj[cur.id] ? '' : obj[cur.id] = true && pre.push(cur)
        return pre
      }, [])
      return newArr || []
    },
    //   要货店铺改变获取目的地仓库
    channelChange (val, type) {
      if (type) {
        // 编辑的时候直接拿要货店铺指定的目的仓和发货公司下面的仓库的合集
        this.initWareHouse(val).then(({
          data
        }) => {
          if (data && data.list && Object.keys(data.list).length > 0) {
            let temp = {}
            temp = {
              id: data.list.warehouseId,
              name: data.list.name
            }
            this.toWarehouseIdOptions = this.arrReduce(this.toWarehouseIdOptions, temp)
          } else {
            // 如果店铺没有对应的仓库，根据发货公司获取店铺
            this.initWareHouseComp(this.dataForm.compId).then(({
              data
            }) => {
              this.toWarehouseIdOptions = data.list
            })
          }
        })
      } else {
        this.initWareHouse(val).then(({
          data
        }) => {
          //   判断data.list为非空对象
          if (data && data.list && Object.keys(data.list).length > 0) {
            let temp = {}
            temp = {
              id: data.list.warehouseId,
              name: data.list.name
            }
            this.toWarehouseIdOptions = this.arrReduce(this.toWarehouseIdOptions, temp)
            this.dataForm.toWarehouseId = data.list.warehouseId
          } else {
            // 如果店铺没有对应的仓库，即data.list为空对象时，根据发货公司获取店铺
            this.initWareHouseComp(this.dataForm.compId).then(({
              data
            }) => {
              this.dataForm.toWarehouseId = ''
              this.toWarehouseIdOptions = data.list
            })
          }
        })
      }
    },

    // 要货平台下的店铺
    selectChange (value, type) {
      if (type) {
        this.initBasicChannel(value)
          .then(({
            data
          }) => {
            this.channelIdOptions = data.list
          })
      } else {
        this.dataForm.channelId = ''
        this.initBasicChannel(value)
          .then(({
            data
          }) => {
            this.channelIdOptions = data.list
          })
      }
    },
    // 选择公司触发
    compNameChange (value, type) {
      if (type) {
        this.initWareHouseComp(value)
          .then(({
            data
          }) => {
            this.fromWarehouseIdOptions = data.list
            if (this.dataForm.channelId) {
              //   请求要货店铺对应的仓库
              this.initWareHouse(this.dataForm.channelId)
                .then((res) => {
                  if (res.data && res.data.list && Object.keys(res.data.list).length > 0) {
                    let temp = {}
                    temp = {
                      id: res.data.list.warehouseId,
                      name: res.data.list.name
                    }
                    this.toWarehouseIdOptions = this.arrReduce(this.toWarehouseIdOptions, temp)
                  } else {
                    // 如果店铺没有对应的仓库，取发货公司获取的仓库
                    this.toWarehouseIdOptions = data.list
                  }
                })
            } else {
              this.toWarehouseIdOptions = data.list
            }
          })
      } else {
        this.dataForm.fromWarehouseId = ''
        this.dataForm.toWarehouseId = ''
        this.initWareHouseComp(value)
          .then(({
            data
          }) => {
            this.fromWarehouseIdOptions = data.list
            if (this.dataForm.channelId) {
              //   请求要货店铺对应的仓库
              this.initWareHouse(this.dataForm.channelId)
                .then((res) => {
                  if (res.data && res.data.list && Object.keys(res.data.list).length > 0) {
                    let temp = {}
                    temp = {
                      id: res.data.list.warehouseId,
                      name: res.data.list.name
                    }
                    this.toWarehouseIdOptions = this.arrReduce(data.list, temp)
                    this.dataForm.toWarehouseId = res.data.list.warehouseId
                  } else {
                    // 如果店铺没有对应的仓库，取发货公司获取的仓库
                    this.toWarehouseIdOptions = data.list
                  }
                })
            } else {
              this.toWarehouseIdOptions = data.list
            }
          })
      }
    },
    // 关闭清除本次缓存
    clearCache (formName) {
      this.$refs[formName].resetFields()
      this.dataForm.deliveryDetailsList = []
      this.visible = false
    },
    // 弹窗关闭之前
    handleClose (done) {
      this.clearCache('dataForm')
      done()
    },
    // 取消按钮
    cancel (formName) {
      this.clearCache(formName)
    },
    // 删除要货明细
    deleteHandle (scope) {
      // 编辑，组合产品，已组装数量大于0
      if (this.dataForm.id && scope.row.bAssemble && scope.row.assembleQty > 0) {
        this.$notify.warning({
          title: '警告',
          message: `仓库已经组装该产品，不允许删除！如需删除，请先联系仓库撤销或删除对应的产品组装单。`,
          duration: 3000
        })
      } else {
        this.dataForm.deliveryDetailsList.splice(scope.$index, 1)
        // 判断deliveryDetailsList是否为空，如果不为空了，要货平台和要货店铺不可以选择
        if (this.dataForm.deliveryDetailsList.length > 0) {
          this.isDisableFromAdd = true
        } else {
          this.isDisableFromAdd = false
        }
      }
    },
    // 新增产品SKU
    addSkuHandle () {
      // 新增按钮控制权限（校验要货平台和要货店铺是否填写）
      if (!this.dataForm.channelId) {
        this.$notify.error({
          title: '错误',
          message: `请先选择[要货店铺]`,
          duration: 3000
        })
      } else {
        this.addSkuVisible = true
        this.$nextTick(() => {
          this.$refs.addDetails.init(this.dataForm.id, this.dataForm.deliveryDetailsList,
            {
              channelId: this.dataForm.channelId,
              dictSalePlatform: this.dataForm.dictNeedPlatform
            })
        })
      }
    },
    // 子传过来的数据
    async addList (list) {
      let skuId = []
      list.forEach((item, index) => {
        skuId.push(item.id)
      })
      this.dataListLoading = true
      await this.$http({
        url: this.$http.adornUrl(`warehouse/whdeliveryplan/info-prod`),
        method: 'post',
        data: skuId
      }).then(({ data }) => {
        if (data && data.code === 0) {
          list = data.prodInfo || []
          list.forEach((item) => {
            this.$set(item, 'stockQty', '')
            this.$set(item, 'wayStock', '')
            this.$set(item, 'daySale', '')
            this.$set(item, 'estimateQty', '')
            this.$set(item, 'needQty', '')
            this.$set(item, 'qualifiedQty', '')
            this.$set(item, 'confirmQty', '')
            this.$set(item, 'countOutboxQty', '')
            this.$set(item, 'countOutboxWeight', '')
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
      // 添加了数据，禁掉要货平台和要货店铺的选择
      this.isDisableFromAdd = true
      // 目前可以重复添加
      for (const item of list) {
        this.dataForm.deliveryDetailsList.push(item)
      }
    },
    getDataUrl () {
      // 要货平台
      this.$http.get(this.$http.adornUrl('basicData/queryDataDict2List'), { params: { dataDictKey: 'PLANTFORM_TYPE' } }).then(({ data }) => {
        this.dictNeedPlatformOptions = data.fontMaps
      })
      // 单据状态
      this.$http.get(this.$http.adornUrl('basicData/queryDataDict2List'), { params: { dataDictKey: 'APPROVAL_STATUS' } }).then(({ data }) => {
        this.dictDocStatusOptions = data.fontMaps
      })
      // 期望物流方式
      this.$http.get(this.$http.adornUrl('basicData/queryDataDict2List'), { params: { dataDictKey: 'TRANSPORT_MODE' } }).then(({ data }) => {
        this.dictExpectTransitOptions = data.fontMaps
      })
      // 确认物流方式
      this.$http.get(this.$http.adornUrl('basicData/queryDataDict2List'), { params: { dataDictKey: 'TRANSPORT_MODE' } }).then(({ data }) => {
        this.dictConfirmTransitOptions = data.fontMaps
      })
      // 发货公司
      this.$http.get(this.$http.adornUrl('list/combobox/company')).then(({ data }) => {
        this.compIdOptions = data.list
      })
      // 业务类型
      this.$http.get(this.$http.adornUrl('basicData/queryDataDict2List'), { params: { dataDictKey: 'BUSSINESS_TYPE' } }).then(({ data }) => {
        this.deliveryTypeOptions = data.fontMaps
      })
      // 发货类型
      this.$http.get(this.$http.adornUrl('basicData/queryDataDict2List'), { params: { dataDictKey: 'SHIP_TYPE' } }).then(({ data }) => {
        this.shipTypeOptions = data.fontMaps
      })
    },
    init (id, type, row) {
      Object.assign(this.$data, this.$options.data())
      this.visible = true
      this.$nextTick(() => {
        // 这里主要是为了提醒用户需关注该字段信息
        this.$refs['dataForm'].validateField('dictDeliveryPlanType')
        this.$refs['dataForm'].validateField('shipType')
      })
      this.getDataUrl()
      this.dataForm.id = id
      this.dataForm.deliveryDetailsList = []
      this.isDisabled = false
      this.type = type
      this.$nextTick(() => {
        if (type === 'canAdd') {
          this.dialogTitle = '要货计划新增'
          this.initAdd()
        }
        if (type === 'canEdit' && this.dataForm.id) {
          this.dialogTitle = '要货计划修改'
          this.initEdit(id)
        }
        if (type === 'canCheck' && this.dataForm.id) {
          this.dialogTitle = '要货计划查看'
          this.initCheck(id)
        }
        if (type === 'canApproval' && this.dataForm.id) {
          this.dialogTitle = '要货计划审核'
          this.initApproval(id, row)
        }
      })
    },
    initAdd () {
      this.isDisableFromAdd = false
      this.isDisableT03 = false
      this.isShowApproval = false
      this.dataForm.sellerId = sessionStorage.getItem('userId') // 新增默认当前用户为装箱员
      this.selectChange(this.dataForm.dictNeedPlatform)
    },
    initEdit (id) {
      this.isDisableFromAdd = true
      this.isDisableT03 = false
      this.isShowApproval = false
      this.dataCall(id)
    },
    initCheck (id) {
      this.isDisabled = true
      this.isDisableT02 = true
      this.isDisableT03 = true
      this.disableApprove = true
      this.confirmQtyDisable = true
      this.isDisableFromAdd = true
      this.dialogTitle = '要货计划查看'
      this.isShowApproval = false
      this.dataCall(id)
    },
    initApproval (id, row) {
      this.isShowApproval = true // 显示审核头
      this.disableApprove = true
      this.isDisableFromAdd = true
      this.node = row.node
      this.nodeName = row.nodeName
      this.approvalData = {
        node: row.node,
        nodeName: row.nodeName,
        taskId: row.taskId,
        operation: '1',
        businessId: row.id,
        processKey: 'wh_delivery_plan',

        routeUrl: getUrl(),
        code: row.code,
        docName: '要货计划申请单',
        comments: '',
        variablesMap: {}
      }
      // 从之前的三级审核增加到四级审核
      // 如果是节点T01，T02则去掉驳回上一级按钮
      if (this.approvalData.nodeName === '区域负责人审核') {
        this.approvalData.isShowNode2 = false
        this.approvalData.isShowNode3 = true
        // 销售主管审批时
        this.isDisabled = true
        // 最终确认数量可以编辑
        this.confirmQtyDisable = false
        //   物流审核时
        this.isDisableT03 = true
        this.isDisableT02 = true
      } else if (this.approvalData.nodeName === '销售主管审核' || this.approvalData.nodeName === '销售审核') {
        this.approvalData.isShowNode2 = true
        this.approvalData.isShowNode3 = true
        // 销售主管审批时
        this.isDisabled = true
        // 最终确认数量可以编辑
        this.confirmQtyDisable = false
        //   物流审核时
        this.isDisableT03 = true
        this.isDisableT02 = true
      } else if (this.approvalData.nodeName === '仓库审核') {
        this.approvalData.isShowNode2 = true
        this.approvalData.isShowNode3 = true
        this.isDisabled = true
        // 只有T01确认数量才可以编辑，其他都不可
        this.confirmQtyDisable = true
        //   物流审核时
        this.isDisableT03 = true
        this.isDisableT02 = false
      } else if (this.node === 'T04') {
        // T04
        this.approvalData.isShowNode2 = true
        this.approvalData.isShowNode3 = true
        this.isDisabled = true
        this.isDisableT02 = true
        // 只有T01确认数量才可以编辑，其他都不可
        this.confirmQtyDisable = true
        //   物流审核时
        this.isDisableT03 = false
      }
      if (this.node === 'T05') {
        this.approvalData.isShowNode2 = true
        this.approvalData.isShowNode3 = true
        this.isDisabled = true
        this.isDisableT02 = true
        // 只有T01确认数量才可以编辑，其他都不可
        this.confirmQtyDisable = true
        this.isDisableT03 = true
      }
      this.dataCall(id)
    },
    dataCall (id) {
      this.$refs['dataForm'].resetFields()
      this.$http({
        url: this.$http.adornUrl(`warehouse/whdeliveryplan/info/${id}`),
        method: 'get',
        params: this.$http.adornParams({
          id: id
        })
      }).then(({ data }) => {
        if (data && data.code === 0) {
          this.dataForm = data.deliveryPlanInfo.whDeliveryPlanEntity
          this.selectChange(this.dataForm.dictNeedPlatform, id)
          if (this.type === 'canCheck') {
            // 查看时目的仓获取所有仓库数据
            this.$http
              .get(this.$http.adornUrl('basic/basicwarehouse/listcombobox'))
              .then(({ data }) => {
                this.toWarehouseIdOptions = data.list
                this.fromWarehouseIdOptions = data.list
              })
          } else {
            this.compNameChange(this.dataForm.compId, id)
            this.channelChange(this.dataForm.channelId, id)
          }
          data.deliveryPlanInfo.whDeliveryPlanDetailList.forEach(item => {
            this.$set(item, 'unitName', item.prodUnit)
            this.$set(item, 'fnsku', item.fnSku)
          })
          this.dataForm.deliveryDetailsList = data.deliveryPlanInfo.whDeliveryPlanDetailList
        } else {
          this.$notify.error({
            title: '错误',
            message: data.msg,
            duration: 5000
          })
        }
      })
    },
    // 提取公共的部分
    detailHandle () {
      if (this.dataForm.deliveryDetailsList.length <= 0) {
        this.$notify.error({
          title: '错误',
          message: '要货明细至少有一行数据',
          duration: 2000
        })
      } else if (!!this.dataForm.fromWarehouseId && !!this.dataForm.toWarehouseId && this.dataForm.fromWarehouseId === this.dataForm.toWarehouseId) {
        this.$notify.error({
          title: '错误',
          message: '[发货仓]和[目的仓]不能相同',
          duration: 2000
        })
      } else {
        let qtyNum = true // 判断要货数量是否大于0
        for (const item of this.dataForm.deliveryDetailsList) {
          if (item.needQty === undefined || item.needQty <= 0) {
            qtyNum = false
            this.$notify.error({
              title: '错误',
              message: '要货数量必须大于0',
              duration: 2000
            })
            break
          }
        }
        return qtyNum
      }
      return false
    },
    /*
    *库存情况
    *@param val scope
    *@param type 类型 1：操作列查看，2:保存，3：提交
    */
    stockCheckHandle (val, type) {
      if (type === '1') {
        let prodIds = [val.row.prodId]
        this.queryStockInfo(prodIds).then(({ data }) => {
          if (data && data.code === 0) {
            this.$refs.stockCheckRef.init(data.pageList, type)
          }
        })
      }
      if (type === '2' || type === '3') {
        let ids = []
        this.dataForm.deliveryDetailsList.forEach((item, index) => {
          if (item.bAssemble) {
            ids.push(item.prodId)
          }
        })
        if (ids.length > 0) {
          this.queryStockInfo(ids).then(({ data }) => {
            if (data && data.code === 0) {
              this.$refs.stockCheckRef.init(data.pageList, type)
            }
          })
        } else {
          // 如果没有组合产品，则按之前的正常流程进行
          this.continueHandle(type)
        }
      }
    },
    // 子产品库存情况接口
    queryStockInfo (prodId) {
      return this.$http({
        url: this.$http.adornUrl('prod/prodbasic/getAssembleProdInventory'),
        method: 'post',
        data: prodId
      })
    },
    continueHandle (type) {
      if (type === '2') {
        this.dataFormSave()
      }
      if (type === '3') {
        this.dataFormSubmit()
      }
    },

    saveOrSubmit: _.debounce(
      async function saveOrSubmit (type) {
        let temp = this.detailHandle()
        if (temp) {
          this.$refs['dataForm'].validate(valid => {
            if (valid) {
              this.stockCheckHandle('', type)
            } else {
              return false
            }
          })
        }
      }, 1000,
      { leading: true,
        trailing: false }
    ),
    // 保存
    dataFormSave () {
      this.$http({
        url: this.$http.adornUrl(
          `warehouse/whdeliveryplan/${
          !this.dataForm.id ? 'save' : 'update'
          }`
        ),
        method: !this.dataForm.id ? 'post' : 'put',
        data: Object.assign({}, {
          whDeliveryPlanEntity: this.dataForm
        }, {
            whDeliveryPlanDetailList: this.dataForm
              .deliveryDetailsList
          })
      }).then(({
        data
      }) => {
        if (data && data.code === 0) {
          this.$emit('refreshDataList')
          this.clearCache('dataForm')
          this.$notify({
            message: '保存成功',
            type: 'success',
            duration: 1500,
            title: '提示'
          })
        } else {
          this.$notify.error({
            title: '错误',
            message: data.msg,
            duration: 5000
          })
        }
      })
    },
    // 提交
    dataFormSubmit () {
      let flowParams = {
        processKey: 'wh_delivery_plan',
        routeUrl: getUrl(),
        docName: '要货计划申请单'
      }
      this.$http({
        url: this.$http.adornUrl(
          'warehouse/whdeliveryplan/submit'
        ),
        method: 'post',
        data: Object.assign({}, {
          whDeliveryPlanEntity: this.dataForm
        }, {
            whDeliveryPlanDetailList: this.dataForm
              .deliveryDetailsList
          }, {
            flowParams: flowParams
          })
      }).then(({
        data
      }) => {
        if (data && data.code === 0) {
          this.$emit('refreshDataList')
          this.clearCache('dataForm')
          this.$notify({
            title: '提示',
            message: '提交成功',
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
    },

    // 提取审核接口
    approvalUrl () {
      this.approvalData.variablesMap.shipType = this.dataForm.shipType
      return this.$http({
        url: this.$http.adornUrl(`warehouse/whdeliveryplan/approval`),
        method: 'post',
        data: Object.assign({},
          { nodeName: this.nodeName },
          {
            whDeliveryPlanEntity: this.dataForm
          }, {
            whDeliveryPlanDetailList: this.dataForm.deliveryDetailsList
          }, {
            flowParams: this.approvalData
          })
      })
    },

    // 审核按钮
    workflowApproval: _.debounce(
      async function workflowApproval () {
        // 如果审核驳回发起人，不再去校验字段
        if (this.approvalData.operation === '3' || this.approvalData.operation === '2') {
          // 如果审核驳回发起人，不再去校验字段
          this.approvalUrl().then(({ data }) => {
            if (data && data.code === 0) {
              this.clearCache('dataForm')
              // 清除url的taskId
              window.location.href = clearTaskId()
              this.$emit('refreshDataList')
              this.visible = false
              this.$notify({
                message: '操作成功',
                title: '提示',
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
          let temp = this.detailHandle()
          if (temp) {
            this.$refs['dataForm'].validate(valid => {
              if (valid) {
                this.approvalUrl().then(({ data }) => {
                  if (data && data.code === 0) {
                    this.clearCache('dataForm')
                    this.$notify({
                      message: '操作成功',
                      title: '提示',
                      type: 'success',
                      duration: 1500
                    })
                    // 清除url的taskId
                    window.location.href = clearTaskId()
                    this.visible = false
                    this.$emit('refreshDataList')
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
        }
      }, 1000, {
        leading: true,
        trailing: false
      }),
    // 打印产品标签
    printProdLabel (row) {
      if (!row.fbaShipmentId) {
        this.$notify.warning({
          title: '提示',
          message: 'FBAshipment为空，获取不到箱唛信息，无法打印，请先登记FBAshipmentID!',
          duration: 3000
        })
      } else {
        this.$nextTick(() => {
          this.$refs.prodlabel.init(row)
        })
      }
    }
  }
}
</script>

<style scoped>
.item {
  margin-left: 20px;
  font-size: 16px;
  font-weight: 600;
}
.isCombine span {
  position: relative;
  top: 3px;
}
</style>
