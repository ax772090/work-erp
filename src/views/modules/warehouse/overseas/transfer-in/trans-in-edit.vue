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
      <el-row>
        <el-col :span="6">
          <el-form-item label="单号"
                        prop="code">
            <el-input v-model="dataForm.code"
                      placeholder="未生成"
                      disabled></el-input>
          </el-form-item>
          <el-form-item label="仓管员"
                        prop="adminId">
            <select-seach v-model="dataForm.adminId"
                          httpUrl="list/search/user"
                          httpMethod="get"
                          data-label="name"
                          data-value="id"
                          data-source="list"
                          placeholder="搜索"
                          :listDataOptionStatic="adminIdOption"></select-seach>
          </el-form-item>

        </el-col>
        <el-col :span="6">
          <el-form-item label="入库日期"
                        prop="date">
            <el-date-picker v-model="dataForm.date"
                            type="date"
                            value-format="yyyy-MM-dd"
                            placeholder="选择日期"></el-date-picker>
          </el-form-item>
          <el-form-item label="签收仓库"
                        prop="warehouseId">
            <select-all v-model="dataForm.warehouseId"
                        :listDataOption="warehouseIdOptions"
                        :isDisabled="true"
                        data-value="id"
                        data-label="name"
                        placeholder="选择仓库"></select-all>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="库存公司"
                        prop="compId">
            <select-all v-model="dataForm.compId"
                        :listDataOption="compIdOptions"
                        :isDisabled="true"
                        data-value="id"
                        data-label="name"
                        placeholder="选择仓库"></select-all>
          </el-form-item>
          <el-form-item label="单据状态"
                        prop="dictDocStatus">
            <select-all v-model="dataForm.dictDocStatus"
                        :listDataOption="dictDocStatusOptions"
                        :isDisabled="true"
                        data-value="key"
                        data-label="value"
                        placeholder="选择仓库"></select-all>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="备注"
                        prop="remark">
            <textarea-all v-model="dataForm.remark"></textarea-all>
          </el-form-item>
        </el-col>
      </el-row>
      <div>
        <!-- 调入明细 -->
        <el-table :data="dataForm.transferInDetailList"
                  stripe
                  border
                  max-height="500"
                  highlight-current-row
                  v-loading="dataListLoading"
                  show-summary
                  :summary-method="getSummaries">
          <el-table-column prop="imageUrl"
                           label="产品图片"
                           width="120">
            <template slot-scope="scope">
              <tableImg :imageUrl='scope.row.imageUrl'></tableImg>
            </template>
          </el-table-column>
          <el-table-column prop="prodCode"
                           label="产品编码"></el-table-column>
          <el-table-column prop="prodName"
                           label="产品名称"></el-table-column>
          <el-table-column prop="qualifiedQty"
                           label="签收合格数量">
            <template slot-scope="scope">
              <el-form-item :prop="'transferInDetailList[' + scope.$index + '].qualifiedQty'"
                            :rules="dataRule.qualifiedQty"
                            label-width="0px">
                <el-input v-model="scope.row.qualifiedQty"
                          placeholder="签收合格数量"
                          :disabled="isDisabled"
                          type="Number"
                          @mousewheel.native.prevent></el-input>
              </el-form-item>
            </template>
          </el-table-column>
          <el-table-column prop="defectiveQty"
                           label="破损数量">
            <template slot-scope="scope">
              <el-form-item :prop="'transferInDetailList[' + scope.$index + '].defectiveQty'"
                            :rules="dataRule.defectiveQty"
                            label-width="0px">
                <el-input v-model="scope.row.defectiveQty"
                          placeholder="破损数量"
                          :disabled="isDisabled"
                          type="Number"
                          @mousewheel.native.prevent></el-input>
              </el-form-item>
            </template>
          </el-table-column>
          <el-table-column label="破损入库仓"
                           prop="defectiveWarehouseId">
            <template slot-scope="scope">
              <el-form-item :prop="'transferInDetailList[' + scope.$index + '].defectiveWarehouseId'"
                            :rules="dataRule.defectiveWarehouseId"
                            label-width="0px">
                <select-all v-model="scope.row.defectiveWarehouseId"
                            :listDataOption="defectiveWarehouseIdOptions"
                            data-value="id"
                            data-label="name"
                            placeholder="破损入库仓"></select-all>
              </el-form-item>
            </template>
          </el-table-column>
          <el-table-column label="破损入库状态"
                           prop="defectiveStatus">
            <template slot-scope="scope">
              <el-form-item :prop="'transferInDetailList[' + scope.$index + '].defectiveStatus'"
                            label-width="0px">
                <select-all v-model="scope.row.defectiveStatus"
                            :listDataOption="defectiveStatusOptions"
                            data-value="key"
                            data-label="value"
                            placeholder="破损入库状态"></select-all>
              </el-form-item>
            </template>
          </el-table-column>
          <el-table-column label="备注"
                           prop="remark">
            <template slot-scope="scope">
              <el-form-item label-width="0px">
                <el-input v-model="scope.row.remark"
                          placeholder
                          :disabled="isDisabled"></el-input>
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
    <span slot="footer"
          class="dialog-footer">
      <el-button @click="visible = false"><i class="iconfont erp-icon-quxiao"></i>取消</el-button>
      <el-button type="primary"
                 @click="dataFormSave()"
                 v-if="!isDisabled"><i class="iconfont erp-icon-baocun"></i>保存</el-button>
      <el-button type="primary"
                 @click="dataConfirm()"
                 v-if="!isDisabled"><i class="iconfont erp-icon-queding"></i>确认签收</el-button>
    </span>
  </el-dialog>
</template>

<script>
import selectSeach from '@/components/erp-select/select-seach'
import selectAll from '@/components/erp-select/select-all'
import { dateFormatter } from '@/utils/index.js'
// 引入图片
import tableImg from '@/components/list-table/table-img'
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
    const valiIntegerByZero = (rule, value, callback) => {
      // 用这种方式主要是为了拿到行数据
      let index = Number(rule.field.indexOf('['))
      let rowIndexValue = Number(rule.field[index + 1])
      let row = this.dataForm.transferInDetailList[rowIndexValue]
      if (!/^[+]{0,1}(\d+)$/.test(value) && value != null) {
        callback(new Error('请输入0或正整数'))
      } else if (
        Number(row.qualifiedQty) + Number(row.defectiveQty) >
        Number(row.unReceiveQty)
      ) {
        this.$notify.error({
          title: '错误',
          message: `签收合格数量${row.qualifiedQty}+破损数量${
            row.defectiveQty
            }不能超过待收数量${row.unReceiveQty}`,
          duration: 4000
        })
      } else {
        callback()
      }
    }
    const validateInteger = (rule, value, callback) => {
      // 用这种方式主要是为了拿到行数据
      let index = Number(rule.field.indexOf('['))
      let rowIndexValue = Number(rule.field[index + 1])
      let row = this.dataForm.transferInDetailList[rowIndexValue]
      if (!/^[1-9]\d*$/.test(value) && value != null) {
        callback(new Error('请输入正整数'))
      } else if (
        Number(row.qualifiedQty) + Number(row.defectiveQty) >
        Number(row.unReceiveQty)
      ) {
        this.$notify.error({
          title: '错误',
          message: `签收合格数量${row.qualifiedQty}+破损数量${
            row.defectiveQty
            }不能超过待收数量${row.unReceiveQty}`,
          duration: 4000
        })
      } else {
        callback()
      }
    }
    const validateDefective = (rule, value, callback) => {
      let index = Number(rule.field.indexOf('['))
      let rowIndexValue = Number(rule.field[index + 1])
      let row = this.dataForm.transferInDetailList[rowIndexValue]
      if (Number(row.defectiveQty) > 0 && !row.defectiveWarehouseId) {
        callback(new Error('必填项'))
      } else {
        callback()
      }
    }
    return {
      defectiveWarehouseIdOptions: [], // 破损入库仓
      defectiveStatusOptions: [], // 破损入库状态
      dialogTitle: '',
      isDisabled: false, // 查看设置为true
      dialogTitle: '', // dialog标题
      formDisabled: false, // 查看时设置为true
      submitId: '', // 保存后返回的用于调出的id
      dataListLoading: false,
      visible: false,
      dataForm: {
        id: '',
        code: '',
        adminId: '',
        remark: '',
        date: dateFormatter(new Date(), false),
        warehouseId: '',
        compId: '',
        dictDocStatus: '01', // 单据状态默认'01'
        // 调入明细
        transferInDetailList: []
      },
      // 签收仓库
      warehouseIdOptions: [],
      // 库存公司
      compIdOptions: [],
      // 单据状态
      dictDocStatusOptions: [],
      // 仓管员
      adminIdOption: [],

      dataRule: {
        qualifiedQty: [
          { required: true, message: '必填项', trigger: 'blur' },
          { validator: validateInteger, trigger: 'blur' }
        ],
        defectiveQty: [
          { required: true, message: '必填项', trigger: 'blur' },
          { validator: valiIntegerByZero, trigger: 'blur' }
        ],
        defectiveWarehouseId: [
          { validator: validateDefective, trigger: 'blur' }
        ],
        date: [{ required: true, message: '请选择日期', trigger: 'change' }]
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
          if (column.property === 'qualifiedQty' || column.property === 'defectiveQty') {
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
    // 选择公司触发
    compNameChange (value) {
      this.$http
        .get(this.$http.adornUrl('list/combobox/warehouse-comp'), {
          params: { compId: value }
        })
        .then(({ data }) => {
          this.defectiveWarehouseIdOptions = data.list
        })
    },
    // 关闭清除本次缓存
    clearCache (formName) {
      this.$nextTick(() => {
        this.$refs[formName].resetFields()
        this.dataForm.transferInDetailList = []
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
      this.visible = false
    },
    // 删除调入明细
    deleteHandle (index) {
      this.dataForm.transferInDetailList.splice(index, 1)
    },
    getDataUrl () {
      // 库存公司
      this.$http.get(this.$http.adornUrl('list/combobox/company')).then(({ data }) => {
        this.compIdOptions = data.list
      })
      // 单据状态
      this.$http.get(this.$http.adornUrl('basicData/queryDataDict2List'), { params: { dataDictKey: 'APPROVAL_STATUS' } }).then(({ data }) => {
        this.dictDocStatusOptions = data.fontMaps
      })
      // 签收仓库
      this.$http.get(this.$http.adornUrl('list/combobox/warehouse')).then(({ data }) => {
        this.warehouseIdOptions = data.list
      })
      // 仓库库存状态
      this.$http.get(this.$http.adornUrl('basicData/queryDataDict2List'), { params: { dataDictKey: 'WAREHOUSE_INVENTORY_STATUS' } }).then(({ data }) => {
        this.defectiveStatusOptions = data.fontMaps
      })
    },
    initDataForm () {
      this.dataForm = {
        id: '',
        code: '',
        adminId: '',
        remark: '',
        date: dateFormatter(new Date(), false),
        warehouseId: '',
        compId: '',
        dictDocStatus: '01', // 单据状态默认'01'
        // 调入明细
        transferInDetailList: []
      }
    },
    init (ids, type) {
      this.initDataForm()// 初始化dataForm
      this.getDataUrl()
      this.dataForm.transferInDetailList = []
      this.isDisabled = false
      this.formDisabled = false
      this.$nextTick(() => {
        if (type === 'transferin') {
          // 上游到货签收
          this.dialogTitle = '收货单新增'
          this.initAdd(ids)
        }
        if (type === 'canEdit') {
          this.dialogTitle = '收货记录修改'
          this.initEdit(ids)
        }
        if (type === 'check') {
          this.dialogTitle = '收货记录查看'
          this.initCheck(ids)
        }
      })
    },
    initAdd (ids) {
      this.dataForm.adminId = sessionStorage.getItem('userId') // 新增默认当前用户为仓管员
      this.dataCallAdd(ids)
    },
    initCheck (ids) {
      this.isDisabled = true
      this.formDisabled = true
      this.dataCallInfo(ids)
    },
    initEdit (ids) {
      this.dataCallInfo(ids)
    },
    dataCallInfo (ids) {
      // 编辑操作
      this.dataForm.id = ids
      this.$nextTick(() => {
        // this.$refs['dataForm'].resetFields()
        if (this.dataForm.id) {
          this.$http({
            url: this.$http.adornUrl(`warehouse/whtransferin/info/${ids}`),
            method: 'get',
            params: this.$http.adornParams({
              id: ids
            })
          }).then(({ data }) => {
            if (data && data.code === 0) {
              this.visible = true
              this.dataForm = data.transferIn
              this.dataForm.transferInDetailList = data.transferInDetail
              this.compNameChange(this.dataForm.compId)
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
    },
    dataCallAdd (ids) {
      this.$http({
        url: this.$http.adornUrl('warehouse/whtransferin/add-info'),
        method: 'post',
        data: ids
      }).then(({ data }) => {
        if (data && data.code === 0) {
          this.visible = true
          this.dataForm = Object.assign({}, this.dataForm, data.transferIn)
          this.compNameChange(this.dataForm.compId)
          data.transferInDetail.forEach(element => {
            this.$set(element, 'qualifiedQty', element.unReceiveQty)
            this.$set(element, 'defectiveQty', 0) // 破损数量默认给0
            this.$set(element, 'defectiveStatus', '04') // 破损入库状态默认‘次品’
            this.$set(element, 'id', '')
            this.$set(element, 'transferInId', '')
          })
          this.dataForm.transferInDetailList = data.transferInDetail
        } else {
          this.$notify.error({
            title: '错误',
            message: data.msg,
            duration: 5000
          })
        }
      })
    },
    // 保存
    dataFormSave: _.debounce(
      async function dataFormSave () {
        // 调入明细不能为空
        if (this.dataForm.transferInDetailList.length <= 0) {
          this.$notify.error({
            title: '错误',
            message: '调入明细至少有一行数据',
            duration: 2000
          })
        } else {
          this.$refs['dataForm'].validate(valid => {
            if (valid) {
              this.$http({
                url: this.$http.adornUrl(
                  `warehouse/whtransferin/${
                  !this.dataForm.id ? 'save' : 'update'
                  }`
                ),
                method: !this.dataForm.id ? 'post' : 'put',
                data: Object.assign(
                  {},
                  { transferInEntity: this.dataForm },
                  { transferInDetailList: this.dataForm.transferInDetailList }
                )
              }).then(({ data }) => {
                if (data && data.code === 0) {
                  this.submitId = data.id
                  this.visible = false
                  this.$emit('refreshDataList')
                  this.$notify({
                    message: '保存成功',
                    title: '提示',
                    type: 'success',
                    duration: 3000

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
      }, 1000, {
        leading: true,
        trailing: false
      }
    ),

    // 确认签收新接口
    dataConfirm: _.debounce(
      async function dataConfirm () {
        // 调入明细不能为空
        if (this.dataForm.transferInDetailList.length <= 0) {
          this.$notify.error({
            title: '错误',
            message: '调入明细至少有一行数据',
            duration: 2000
          })
        } else {
          this.$refs['dataForm'].validate(valid => {
            if (valid) {
              this.$http({
                url: this.$http.adornUrl(
                  `warehouse/whtransferin/saveandconfirm`
                ),
                method: 'post',
                data: Object.assign(
                  {},
                  { transferInEntity: this.dataForm },
                  { transferInDetailList: this.dataForm.transferInDetailList }
                )
              }).then(({ data }) => {
                this.visible = false
                this.$emit('refreshDataList')
                if (data && data.code === 0) {
                  this.$notify({
                    title: '提示',
                    message: '保存成功',
                    type: 'success',
                    duration: 1000
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
      }, 1000, {
        leading: true,
        trailing: false
      }
    )
  }
}
</script>
