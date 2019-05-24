<template>
  <div>
    <!-- 装箱清单表单 -->
    <el-form :model="dataForm"
             :rules="dataRule"
             ref="dataForm"
             label-width="110px"
             :disabled="formDisabled">
      <el-row>
        <el-col :span="8">
          <el-form-item label="装箱员"
                        prop="packingUserId">
            <select-seach v-model='dataForm.packingUserId'
                          httpUrl='list/search/user'
                          httpMethod='get'
                          dataLabel='name'
                          dataValue='id'
                          dataSource='list'
                          placeholder='未生成'
                          :listDataOptionStatic='packingUserIdOption'></select-seach>
          </el-form-item>
          <el-form-item label="装箱日期"
                        prop="packingDate">
            <el-date-picker v-model="dataForm.packingDate"
                            type="date"
                            value-format="yyyy-MM-dd"
                            default-time=""
                            placeholder="选择日期">
            </el-date-picker>
          </el-form-item>
          <el-form-item label="FBAShipmentID"
                        prop="fbaShipmentId">
            <el-input v-model="dataForm.fbaShipmentId"
                      placeholder="请输入FBAShipmentID"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="物流承运商"
                        prop="shipperId">
            <select-all v-model="dataForm.shipperId"
                        :listDataOption="shipperIdOptions"
                        :isDisabled="true"
                        data-value="key"
                        data-label="value"
                        placeholder="选择物流承运商"></select-all>
          </el-form-item>
          <el-form-item label="物流跟踪号"
                        prop="trackingNo">
            <el-input v-model="dataForm.trackingNo"
                      placeholder="请输入物流跟踪号"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="物流方式"
                        prop="dictExpectTransit">
            <select-all v-model="dataForm.dictExpectTransit"
                        :listDataOption="dictExpectTransitOptions"
                        :isDisabled="true"
                        data-value="key"
                        data-label="value"
                        placeholder="选择物流方式"></select-all>
          </el-form-item>
          <el-form-item label="预计到达时间"
                        prop="shipArriveDate">
            <el-date-picker v-model="dataForm.shipArriveDate"
                            type="date"
                            value-format="yyyy-MM-dd"
                            placeholder="选择日期">
            </el-date-picker>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>

    <!-- 装箱明细 -->
    <div>
      <el-table :data="dataForm.packingDetailsList"
                border
                v-loading="dataListLoading"
                max-height="400">
        <el-table-column prop="cartonNo"
                         header-align="center"
                         align="center"
                         label="CASE NO箱号"
                         width="100">
          <template slot-scope="scope">
            <el-input v-model="scope.row.cartonNo"
                      placeholder=""
                      :disabled='isDisabled'
                      type="Number"
                      @mousewheel.native.prevent></el-input>
          </template>
        </el-table-column>
        <el-table-column prop="imageUrl"
                         header-align="center"
                         align="center"
                         label="产品图片"
                         width="120">
          <template slot-scope="scope">
            <tableImg :imageUrl='scope.row.imageUrl'></tableImg>

            <!-- <el-popover v-if="scope.row.imageUrl" placement="right" trigger="click">
                            <img :src="$http.adornUrl(scope.row.imageUrl)" class='imglistPopover' alt="产品图片">
                            <img :src="$http.adornUrl(scope.row.imageUrl)" slot="reference" class='imglist' alt="产品图片">
                        </el-popover>
                        <el-tag v-else type="danger" size="small">未上传</el-tag> -->
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
        <el-table-column prop="channelSku"
                         header-align="center"
                         align="center"
                         label="SellSKU"></el-table-column>
        <el-table-column prop="fnSku"
                         header-align="center"
                         align="center"
                         label="FNSKU"
                         width="100"></el-table-column>
        <el-table-column prop="qty"
                         header-align="center"
                         align="center"
                         label="数量(PCS)"
                         width="100"></el-table-column>
        <el-table-column prop="grossHeight"
                         header-align="center"
                         align="center"
                         label="毛重(KG)"
                         width="100"></el-table-column>
        <el-table-column prop="cartonSize"
                         header-align="center"
                         align="center"
                         label="箱子尺寸(cm)"
                         width="100"></el-table-column>
        <el-table-column prop="remark"
                         header-align="center"
                         align="center"
                         label="备注(是否带电/品牌)"
                         width="100">
          <template slot-scope="scope">
            <el-input v-model="scope.row.remark"
                      placeholder=""
                      :disabled='isDisabled'></el-input>
          </template>
        </el-table-column>
        <!-- 操作列 -->
        <el-table-column fixed="right"
                         width="80"
                         label="操作"
                         v-if='isShowFromDel'>
          <template slot-scope="scope">
            <el-button type="danger"
                       size="small"
                       circle
                       @click="deleteHandle(scope.$index)"
                       :disabled='isDisabled'
                       title="删除"><i class="iconfont erp-icon-shanchu"></i></el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
  </div>
</template>

<script>
import selectSeach from '@/components/erp-select/select-seach'
import selectAll from '@/components/erp-select/select-all'
// 引入图片
import tableImg from '@/components/list-table/table-img'
export default {
  components: {
    selectSeach,
    selectAll,
    tableImg
  },
  data () {
    return {
      isShowFromDel: true, // 从要货计划下来的去掉操作列
      isDisabled: false, // 查看设置为true
      formDisabled: false, // 查看时设置为true
      // packingDetailsList: [],
      dataListLoading: false,
      addProdVisible: false,
      dataForm: {
        id: '',
        transferOutId: '', // 海外仓调出单主键（新增不传）
        packingUserId: '',
        packingDate: '',
        fbaShipmentId: '',
        shipperId: '',
        trackingNo: '',
        dictExpectTransit: '',
        shipArriveDate: '',
        dictDocStatus: '01', // 单据状态
        // 装箱清单
        packingDetailsList: []
      },
      // 物流承运商
      shipperIdOptions: [],
      // 物流方式
      dictExpectTransitOptions: [],
      // 装箱员
      packingUserIdOption: [],
      dataRule: {
        // dictNeedPlatform: [
        //     { required: true, message: '请选择要货平台', trigger: 'change' }
        // ],
        // planDate: [
        //     { required: true, message: '选择要货日期', trigger: 'change' }
        // ],
      }
    }
  },
  methods: {
    // 删除装箱清单
    deleteHandle (index) {
      this.dataForm.packingDetailsList.splice(index, 1)
    },
    getDataUrl () {
      // 物流方式
      this.$http.get(this.$http.adornUrl('basicData/queryDataDict2List'), { params: { dataDictKey: 'TRANSPORT_MODE' } }).then(({ data }) => { this.dictExpectTransitOptions = data.fontMaps })
    },
    init (id, dataForm, name) {
      this.getDataUrl()
      this.dataForm.id = id
      this.dataForm.packingDetailsList = []
      this.formDisabled = false
      this.isDisabled = false
      this.isShowFromDel = false// 目前该操作按钮都要求去掉

      if (id === undefined) { // 库存调拨-新增
        this.initDataForm(dataForm)// 是从下一步进来的，有dataForm
        this.dataForm.packingUserId = sessionStorage.getItem('userId') // 新增默认当前用户为装箱员
      } else if (id && name === 'check') { // 查看
        this.formDisabled = true
        this.isDisabled = true
        // 查看直接调接口
        // this.initList(id)
        if (this.dataForm.id) {
          this.$http({
            url: this.$http.adornUrl(`warehouse/whtransferout/info/${id}`),
            method: 'get',
            params: this.$http.adornParams({}, false)

            // params: {id: id}
          }).then(({ data }) => {
            if (data && data.code === 0) {
              this.dataForm = data.transferPackingInfo.whPackingEntity
              this.dataForm.packingDetailsList = data.transferPackingInfo.whPackingDetailList
            } else {
              // this.$message.error(data.msg)
            }
          })
        }
      } else if (id && name == 'delivery') { // 要货计划下来的新增
        this.initDataForm(dataForm)
        this.dataForm.id = ''
        this.dataForm.packingUserId = sessionStorage.getItem('userId') // 新增默认当前用户为装箱员
        // this.isShowFromDel = false
        // this.dataForm = dataForm.transferOutDetail
        this.$nextTick(() => {
          this.$http({
            url: this.$http.adornUrl(`warehouse/whdeliveryplan/transfer-out/${id}`),
            method: 'get'
            // params: this.$http.adornParams({
            //     id: id
            // })
          }).then(({ data }) => {
            if (data && data.code === 0) {
              this.$set(data.transferout, 'dictExpectTransit', data.transferout.dictConfirmTransit)// 物流方式
              this.$set(data.transferout, 'shipArriveDate', data.transferout.shipPlanDate)// 预计到达日期
              this.dataForm = Object.assign(this.dataForm, data.transferout)

              // this.dataForm = data.transferout
            } else {
              this.$notify.error({
                title: '错误',
                message: data.msg,
                duration: 5000
              })
            }
          })
        })
      } else if (id) {
        // 编辑进来的
        this.initDataForm(dataForm)
        this.initList(id)
      }
    },
    initDataForm (dataForm) {
      // 需要对调出详情添加部分字段
      let arr = dataForm.transferOutDetail.transferOutDetailsList
      arr.forEach(element => {
        this.$set(element, 'unitQty', element.outboxQty)// 单箱数量
        this.$set(element, 'weight', element.outboxWeight)// 单箱重量
        this.$set(element, 'volume', element.outboxSize)// 单箱体积
        this.$set(element, 'flag', true)// 是否重新生成装箱明细
      })
      // 通过箱数生成装箱清单
      this.initPackingDetailList(arr)
    },
    initList (id) {
      this.$nextTick(() => {
        if (this.dataForm.id) {
          this.$http({
            url: this.$http.adornUrl(`warehouse/whtransferout/info/${id}`),
            method: 'get',
            params: this.$http.adornParams({}, false)

            // params: {id: id}
          }).then(({ data }) => {
            if (data && data.code === 0) {
              this.dataForm = Object.assign({}, this.dataForm, data.transferPackingInfo.whPackingEntity)
              // this.dataForm.packingDetailsList = this.packingDetailsList
            } else {
              // this.$message.error(data.msg)
            }
          })
        }
      })
    },
    initPackingDetailList (transferOutDetailsList) {
      // this.$nextTick(() => {

      this.$http({
        url: this.$http.adornUrl(`warehouse/whtransferout/packing-detail`),
        method: 'post',
        data: { dto: transferOutDetailsList }
      }).then(({
        data
      }) => {
        if (data && data.code === 0) {
          // this.packingDetailsList = data.list
          this.dataForm.packingDetailsList = data.list
        } else {
          this.$notify.error({
            title: '错误',
            message: data.msg,
            duration: 5000
          })
        }
      })
      // })
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
