<template>
  <el-dialog :title="dialogTitle"
             width="90%"
             :close-on-click-modal="false"
             :visible.sync="visible"
             v-if="visible"
             :before-close="handleClose">
    <el-form :model="dataForm"
             :rules="dataRule"
             ref="dataForm"
             label-width="110px"
             :disabled="formDisabled">
      <!-- 基本信息 -->
      <el-badge class="item">基本信息:</el-badge>
      <el-row>
        <el-col :span="6">
          <el-form-item label="要货计划单号"
                        prop="code">
            <el-input v-model="dataForm.code"
                      placeholder="未生成"
                      disabled></el-input>
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
          <el-form-item label="期望物流方式"
                        prop="dictExpectTransit">
            <select-all v-model="dataForm.dictExpectTransit"
                        :listDataOption="dictExpectTransitOptions"
                        data-value="key"
                        data-label="value"></select-all>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="计划日期"
                        prop="planDate">
            <el-date-picker v-model="dataForm.planDate"
                            type="date"
                            value-format="yyyy-MM-dd"></el-date-picker>
          </el-form-item>
          <el-form-item label="销售员"
                        prop="sellerId">
            <select-seach v-model="dataForm.sellerId"
                          httpUrl="list/search/user"
                          httpMethod="get"
                          data-label="name"
                          data-value="id"
                          data-source="list"
                          :listDataOptionStatic="sellerIdOption"></select-seach>
          </el-form-item>

        </el-col>
        <el-col :span="6">
          <el-form-item label="单据状态"
                        prop="dictDocStatus">
            <select-all v-model="dataForm.dictDocStatus"
                        :listDataOption="dictDocStatusOptions"
                        :isDisabled="true"
                        data-value="key"
                        data-label="value"></select-all>
          </el-form-item>

          <el-form-item label="要货平台"
                        prop="dictNeedPlatform">
            <select-all v-model="dataForm.dictNeedPlatform"
                        :listDataOption="dictNeedPlatformOptions"
                        :isDisabled="true"
                        data-value="key"
                        data-label="value"
                        :isSelectChange="true"
                        @selectChange="selectChange"></select-all>
          </el-form-item>

        </el-col>
        <el-col :span="6">
          <el-form-item label="期望到达日期"
                        prop="expectArriveDate">
            <el-date-picker v-model="dataForm.expectArriveDate"
                            type="date"
                            value-format="yyyy-MM-dd"
                            default-time></el-date-picker>
          </el-form-item>
          <el-form-item label="备注"
                        prop="remark">
            <textarea-all v-model="dataForm.remark"></textarea-all>
          </el-form-item>
        </el-col>
      </el-row>
      <!-- 物流确认 -->
      <el-badge class="item">物流确认:</el-badge>
      <el-row>
        <el-col :span="6">
          <el-form-item label="确认物流方式"
                        prop="dictConfirmTransit">
            <select-all v-model="dataForm.dictConfirmTransit"
                        :listDataOption="dictConfirmTransitOptions"
                        data-value="key"
                        data-label="value"></select-all>
          </el-form-item>

        </el-col>
        <el-col :span="6">
          <el-form-item label="物流承运商"
                        prop="shipperId">
            <select-all v-model="dataForm.shipperId"
                        :listDataOption="shipperIdOptions"
                        :isDisabled="true"
                        data-value="id"
                        data-label="name"></select-all>
          </el-form-item>

        </el-col>
        <el-col :span="6">
          <el-form-item label="预计派送日期"
                        prop="shipPlanDate">
            <el-date-picker v-model="dataForm.shipPlanDate"
                            type="date"
                            value-format="yyyy-MM-dd"></el-date-picker>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="联系电话"
                        prop="telphone">
            <el-input v-model="dataForm.telphone"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <!-- 仓库确认 -->
      <el-badge class="item">仓库确认:</el-badge>
      <el-row>
        <el-col :span="6">
          <el-form-item label="发货公司"
                        prop="compId">
            <select-all v-model="dataForm.compId"
                        :listDataOption="compIdOptions"
                        data-value="id"
                        data-label="name"
                        :isSelectChange="true"
                        @selectChange="compNameChange"></select-all>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="计划发货仓库"
                        prop="fromWarehouseId">
            <el-select v-model="dataForm.fromWarehouseId"
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
        <el-col :span="6">
          <el-form-item label="目的地仓库"
                        prop="toWarehouseId">
            <el-select v-model="dataForm.toWarehouseId"
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
                       v-if="!isDisabled">
              <i class="iconfont erp-icon-xinzeng"></i>新增
            </el-button>
          </el-col>
        </el-row>
        <!-- 表格 -->
        <el-table :data="dataForm.deliveryDetailsList"
                  border
                  v-loading="dataListLoading"
                  max-height="400">
          <el-table-column fixed
                           prop="channelName"
                           header-align="center"
                           align="center"
                           label="店铺名称"></el-table-column>
          <el-table-column prop="imageUrl"
                           header-align="center"
                           align="center"
                           label="产品图片"
                           width="110">
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
                           label="单位"></el-table-column>
          <el-table-column prop="sellerSkuId"
                           header-align="center"
                           align="center"
                           label="ASIN"></el-table-column>
          <el-table-column prop="channelSku"
                           header-align="center"
                           align="center"
                           label="SellSKU"></el-table-column>
          <el-table-column prop="fnsku"
                           header-align="center"
                           align="center"
                           label="FNSKU"></el-table-column>
          <el-table-column prop="stockQty"
                           header-align="center"
                           align="center"
                           label="库存数量"
                           width="100">
            <template slot-scope="scope">
              <el-form-item :prop="'deliveryDetailsList.' + scope.$index + '.stockQty'"
                            :rules="dataRule.stockQty"
                            label-width="0px">
                <el-input v-model="scope.row.stockQty"
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
                           width="100">
            <template slot-scope="scope">
              <el-form-item :prop="'deliveryDetailsList.' + scope.$index + '.wayStock'"
                            :rules="dataRule.wayStock"
                            label-width="0px">
                <el-input v-model="scope.row.wayStock"
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
                           width="100">
            <template slot-scope="scope">
              <el-form-item :prop="'deliveryDetailsList.' + scope.$index + '.daySale'"
                            :rules="dataRule.daySale"
                            label-width="0px">
                <el-input v-model="scope.row.daySale"
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
                           width="100">
            <template slot-scope="scope">
              <el-form-item :prop="'deliveryDetailsList.' + scope.$index + '.estimateQty'"
                            :rules="dataRule.estimateQty"
                            label-width="0px">
                <el-input v-model="scope.row.estimateQty"
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
                           width="100">
            <template slot-scope="scope">
              <el-form-item :prop="'deliveryDetailsList.' + scope.$index + '.needQty'"
                            :rules="dataRule.needQty"
                            label-width="0px">
                <el-input v-model="scope.row.needQty"
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
              <textarea-all :disabled="isDisabled"
                            v-model="scope.row.reason"></textarea-all>
            </template>
          </el-table-column>
          <el-table-column prop="confirmQty"
                           header-align="center"
                           align="center"
                           label="最终确认数量"
                           width="100">
            <template slot-scope="scope">
              <el-form-item :prop="'deliveryDetailsList.' + scope.$index + '.confirmQty'"
                            :rules="dataRule.confirmQty"
                            label-width="0px">
                <el-input v-model="scope.row.confirmQty"
                          :disabled="isDisabled"
                          type="Number"
                          @mousewheel.native.prevent></el-input>
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
                         title="删除"
                         @click="deleteHandle(scope.$index)"
                         :disabled="isDisabled">
                <i class="iconfont erp-icon-shanchu"></i>
              </el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </el-form>
    <!-- 添加明细 -->
    <add-details ref="addDetails"
                 @addDetailsList="addList"></add-details>
    <span slot="footer"
          class="dialog-footer">
      <el-button @click="cancel('dataForm')"><i class="iconfont erp-icon-quxiao"></i>取消</el-button>
      <el-button type="primary"
                 @click="dataFormSave()"
                 v-if="!isDisabled"><i class="iconfont erp-icon-baocun"></i>保存</el-button>
      <el-button type="primary"
                 @click="dataFormSubmit()"
                 v-if="!isDisabled"><i class="iconfont erp-icon-queding"></i>提交</el-button>
    </span>
  </el-dialog>
</template>

<script>
import selectSeach from '@/components/erp-select/select-seach'
import selectAll from '@/components/erp-select/select-all'
// 引入图片
import tableImg from '@/components/list-table/table-img'

import { getUrl, getRequest } from '@/utils'
import { dateFormatter } from '@/utils/index.js'
// 添加明细（新组件）
import addDetails from '@/components/add-details/sku-detail'
// 备注
import textareaAll from '@/components/erp-input/textarea-all.vue'
export default {
  components: {
    selectSeach,
    selectAll,
    addDetails,
    tableImg,
    textareaAll
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
      isDisableFromAdd: false, // 列表里面没有数据时，可选
      isDisable: true,
      submitId: '',
      isDisabled: false, // 查看设置为true
      dialogTitle: '', // dialog标题
      formDisabled: false, // 查看时设置为true
      // deliveryDetailsList: [],
      dataListLoading: false,
      visible: false,
      addSkuVisible: false,
      dataForm: {
        id: '',
        code: '',
        inChargeOf: '',
        // planDate: '',
        channelId: '',
        dictDeliveryPlanType: '02', // 业务类型，海外仓调拨默认'01',fba仓默认'02'
        dictExpectTransit: '',
        expectArriveDate: '',
        planDate: dateFormatter(new Date(), false), // 将"2018-11-08T09:07:37.648Z"转换为"2018-11-08"
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
        dictNeedPlatform: '01', // 要货平台默认亚马逊
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
        dictNeedPlatform: [
          { required: true, message: '请选择要货平台', trigger: 'change' }
        ],
        channelId: [
          { required: true, message: '要货店铺', trigger: 'change' }
        ],
        planDate: [
          { required: true, message: '选择要货日期', trigger: 'change' }
        ],
        stockQty: [{ validator: valiIntegerByZero, trigger: 'blur' }],
        wayStock: [{ validator: valiIntegerByZero, trigger: 'blur' }],
        daySale: [{ validator: valiIntegerByZero, trigger: 'blur' }],
        estimateQty: [{ validator: valiIntegerByZero, trigger: 'blur' }],
        needQty: [{ validator: validateInteger, trigger: 'blur' }],
        confirmQty: [{ validator: validateInteger, trigger: 'blur' }]
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
        this.$refs[formName].resetFields()
        this.dataForm.deliveryDetailsList = []
        this.visible = false
      })
    },
    // 弹窗关闭之前
    handleClose (done) {
      this.clearCache('dataForm')
      done()
    },
    // 取消按钮
    cancel (formName) {
      this.clearCache(formName)
      // this.visible = false
    },
    // 删除要货明细
    deleteHandle (index) {
      this.dataForm.deliveryDetailsList.splice(index, 1)
      // 判断deliveryDetailsList是否为空，如果不为空了，要货店铺不可以选择
      if (this.dataForm.deliveryDetailsList.length > 0) {
        this.isDisableFromAdd = true
      } else {
        this.isDisableFromAdd = false
      }
    },
    // 新增产品SKU
    addSkuHandle () {
      // 新增按钮控制权限（要货店铺是否填写）
      if (!this.dataForm.channelId) {
        this.$notify.error({
          title: '错误',
          message: `请先选择[要货店铺]`,
          duration: 3000
        })
      } else {
        this.addSkuVisible = true
        this.$nextTick(() => {
          this.$refs.addDetails.init(
            this.dataForm.id,
            this.dataForm.deliveryDetailsList,
            {
              channelId: this.dataForm.channelId,
              dictSalePlatform: this.dataForm.dictNeedPlatform
            }
          )
        })
      }
    },
    // 子传过来的数据
    async addSkuList (list) {
      let skuId = []
      list.forEach((item, index) => {
        skuId.push(item.id)
      })
      await this.$http({
        url: this.$http.adornUrl(`warehouse/whdeliveryplan/info-prod`),
        method: 'post',
        data: skuId
      }).then(({ data }) => {
        if (data && data.code === 0) {
          list = data.prodInfo
        } else {
          this.$notify.error({
            title: '错误',
            message: data.msg,
            duration: 5000
          })
        }
      })
      // 添加了数据，禁掉要货店铺的选择
      this.isDisableFromAdd = true
      for (const data of list) {
        let isFind = false
        for (const item of this.dataForm.deliveryDetailsList) {
          if (data.channelSkuId === item.channelSkuId) {
            isFind = true
            break
          }
        }
        if (!isFind) {
          this.dataForm.deliveryDetailsList.push(data)
        }
      }
    },
    getDataUrl () {
      // 单据状态
      this.$http
        .get(this.$http.adornUrl('basicData/queryDataDict2List'), {
          params: { dataDictKey: 'APPROVAL_STATUS' }
        })
        .then(({ data }) => {
          this.dictDocStatusOptions = data.fontMaps
        })
      // 销售员
      // this.$http.get(this.$http.adornUrl('list/search/user')).then(({ data }) => { this.sellerIdOptions = data.list })
      // 要货平台
      this.$http
        .get(this.$http.adornUrl('basicData/queryDataDict2List'), {
          params: { dataDictKey: 'PLANTFORM_TYPE' }
        })
        .then(({ data }) => {
          this.dictNeedPlatformOptions = data.fontMaps
        })
      // 要货店铺
      // this.$http.get(this.$http.adornUrl('list/combobox/channel')).then(({ data }) => { this.channelIdOptions = data.list })
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
      // 计划发货仓库
      // this.$http.get(this.$http.adornUrl('list/combobox/warehouse')).then(({ data }) => { this.fromWarehouseIdOptions = data.list })
      // 目的地仓库
      // this.$http.get(this.$http.adornUrl('list/combobox/warehouse')).then(({ data }) => { this.toWarehouseIdOptions = data.list })
    },
    init (id, type) {
      Object.assign(this.$data, this.$options.data())

      this.visible = true
      this.getDataUrl()
      this.dataForm.id = id
      this.dataForm.deliveryDetailsList = []
      this.formDisabled = false
      this.isDisabled = false

      // 查看操作
      if (id && type === 'check') {
        this.formDisabled = true
        this.isDisabled = true
        this.dialogTitle = '要货计划查看'
      } else if (!this.dataForm.id) {
        this.dialogTitle = '要货计划新增'
        this.isDisableFromAdd = false
        this.selectChange(this.dataForm.dictNeedPlatform)
      } else {
        this.dialogTitle = '要货计划修改'
        this.isDisableFromAdd = true
      }
      if (id) {
        this.$nextTick(() => {
          this.$refs['dataForm'].resetFields()
          if (this.dataForm.id) {
            this.$http({
              url: this.$http.adornUrl(`warehouse/whdeliveryplan/info/${id}`),
              method: 'get',
              params: this.$http.adornParams({
                id: id
              })
            }).then(({ data }) => {
              if (data && data.code === 0) {
                this.dataForm = data.deliveryPlanInfo.whDeliveryPlanEntity
                this.selectChange(this.dataForm.dictNeedPlatform)
                this.compNameChange(this.dataForm.compId, id)
                this.channelChange(this.dataForm.channelId)

                data.deliveryPlanInfo.whDeliveryPlanDetailList.forEach(item => {
                  this.$set(item, 'unitName', item.prodUnit)
                  this.$set(item, 'fnsku', item.fnSku)
                })
                this.dataForm.deliveryDetailsList =
                  data.deliveryPlanInfo.whDeliveryPlanDetailList

                // //搜索建议框数据
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
    // 保存
    dataFormSave: _.debounce(
      async function dataFormSave () {
        // 要货明细至少有一行数据
        if (this.dataForm.deliveryDetailsList.length <= 0) {
          this.$notify.error({
            title: '错误',
            message: '要货明细至少有一行数据',
            duration: 2000
          })
        } else {
          let qtyNum = true // 判断要货数量是否大于0
          this.dataForm.deliveryDetailsList.forEach((item, index) => {
            if (item.needQty === undefined || item.needQty <= 0) {
              qtyNum = false
              this.$notify.error({
                title: '错误',
                message: '要货数量必须大于0',
                duration: 2000
              })
              return false
            }
          })
          if (qtyNum) {
            this.$refs['dataForm'].validate(valid => {
              if (valid) {
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
                      whDeliveryPlanDetailList: this.dataForm
                        .deliveryDetailsList
                    }
                  )
                }).then(({ data }) => {
                  if (data && data.code === 0) {
                    // this.submitId = data.id//保存成功后返回的id
                    this.$emit('refreshDataList')
                    this.clearCache('dataForm')
                    this.$notify({
                      title: '成功',
                      message: '保存成功',
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
                return false
              }
            })
          }
        }
      },
      1000,
      {
        leading: true,
        trailing: false
      }
    ),
    // 提交
    dataFormSubmit: _.debounce(
      async function dataFormSubmit () {
        // 1、新增时，直接点击提交，先保存,成功之后按照返回的id提交
        if (this.dataForm.id === undefined) {
          // 要货明细至少有一行数据
          if (this.dataForm.deliveryDetailsList.length <= 0) {
            this.$notify.error({
              title: '错误',
              message: '要货明细至少有一行数据',
              duration: 2000
            })
          } else {
            let qtyNum = true // 判断要货数量是否大于0
            this.dataForm.deliveryDetailsList.forEach((item, index) => {
              if (item.needQty === undefined || item.needQty <= 0) {
                qtyNum = false
                this.$notify.error({
                  title: '错误',
                  message: '要货数量必须大于0',
                  duration: 2000
                })
                return false
              }
            })
            if (qtyNum) {
              this.$refs['dataForm'].validate(valid => {
                if (valid) {
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
                        whDeliveryPlanDetailList: this.dataForm
                          .deliveryDetailsList
                      }
                    )
                  }).then(({ data }) => {
                    if (data && data.code === 0) {
                      let submitId = data.id
                      if (submitId) {
                        this.$http({
                          url: this.$http.adornUrl('activiti/submit'),
                          method: 'post',
                          data: {
                            businessId: submitId,
                            processKey: 'wh_delivery_plan',

                            routeUrl: getUrl(),
                            code: data.code,
                            docName: '要货计划申请单'
                          }
                        }).then(({ data }) => {
                          if (data && data.code === 0) {
                            this.$emit('refreshDataList')
                            this.clearCache('dataForm')
                            this.$notify({
                              title: '成功',
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
                      }
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
        } else if (this.dataForm.id) {
          // 修改的时候，直接点击提交，先保存，
          // 要货明细至少有一行数据
          if (this.dataForm.deliveryDetailsList.length <= 0) {
            this.$notify.error({
              title: '错误',
              message: '要货明细至少有一行数据',
              duration: 2000
            })
          } else {
            let qtyNum = true // 判断要货数量是否大于0
            this.dataForm.deliveryDetailsList.forEach((item, index) => {
              if (item.needQty === undefined || item.needQty <= 0) {
                qtyNum = false
                this.$notify.error({
                  title: '错误',
                  message: '要货数量必须大于0',
                  duration: 2000
                })
                return false
              }
            })
            if (qtyNum) {
              this.$refs['dataForm'].validate(valid => {
                if (valid) {
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
                        whDeliveryPlanDetailList: this.dataForm
                          .deliveryDetailsList
                      }
                    )
                  }).then(({ data }) => {
                    if (data && data.code === 0) {
                      let submitId = data.id
                      if (submitId) {
                        this.$http({
                          url: this.$http.adornUrl('activiti/submit'),
                          method: 'post',
                          data: {
                            businessId: submitId,
                            processKey: 'wh_delivery_plan',

                            routeUrl: getUrl(),
                            code: data.code,
                            docName: '要货计划申请单'
                          }
                        }).then(({ data }) => {
                          if (data && data.code === 0) {
                            this.$emit('refreshDataList')
                            this.clearCache('dataForm')
                            this.$notify({
                              title: '成功',
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
                      } else {
                        this.$http({
                          url: this.$http.adornUrl('activiti/submit'),
                          method: 'post',
                          data: {
                            businessId: this.dataForm.id,
                            processKey: 'wh_delivery_plan',

                            routeUrl: getUrl(),
                            code: this.dataForm.code,
                            docName: '要货计划申请单'
                          }
                        }).then(({ data }) => {
                          if (data && data.code === 0) {
                            this.$emit('refreshDataList')
                            this.clearCache('dataForm')
                            this.$notify({
                              title: '成功',
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
                      }
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
