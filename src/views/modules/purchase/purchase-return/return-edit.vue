<template>
  <el-dialog :title="!dataForm.id ? '采购退货新增' : isClick ? '采购退货编辑' : '采购退货查看'"
             :close-on-click-modal="false"
             :visible.sync="visible"
             @close="$refs['dataForm'].resetFields()"
             width="90%">
    <el-form :model="dataForm"
             :rules="dataRule"
             ref="dataForm"
             label-width="110px">
      <el-row>
        <el-col :span="6">
          <el-form-item label="退货单号"
                        prop="code">
            <el-input v-model="dataForm.code"
                      disabled
                      placeholder="系统自动带出"></el-input>
          </el-form-item>
          <el-form-item label="退货员"
                        prop="userId">
            <select-seach :isDisabled="isDisabled"
                          v-model="dataForm.userId"
                          httpUrl="list/search/user"
                          data-source="list"
                          title="user"
                          data-value="id"
                          data-label="name"></select-seach>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="退货公司"
                        prop="compId">
            <select-all v-model="dataForm.compId"
                        :listDataOption="compIdOption"
                        :isDisabled="isDisabled || isDisableFromAdd"
                        data-value="orgId"
                        data-label="name"
                        :isSelectChange="true"
                        @selectChange="compIdChange"></select-all>
          </el-form-item>
          <el-form-item label="退货仓库"
                        prop="warehouseId">
            <select-all v-model="dataForm.warehouseId"
                        :listDataOption="warehouseIdOption"
                        :isDisabled="isDisabled || isDisableFromAdd"
                        data-value="id"
                        data-label="name"></select-all>
          </el-form-item>

        </el-col>
        <el-col :span="6">
          <el-form-item label="退货日期"
                        :rules="dataRule.isRequired"
                        prop="date">
            <el-date-picker :disabled="isDisabled"
                            v-model="dataForm.date"
                            type="date"
                            value-format="yyyy-MM-dd"></el-date-picker>
          </el-form-item>
          <el-form-item label="供应商名称"
                        prop="supplierId">
            <select-seach :isDisabled="isDisabled"
                          v-model="dataForm.supplierId"
                          httpUrl="basic/basicsupplier/list-used"
                          data-source="list"
                          title="supplier"
                          data-value="id"
                          data-label="name"></select-seach>
          </el-form-item>

        </el-col>
        <el-col :span="6">
          <el-form-item label="单据状态"
                        prop="status">
            <select-all v-model="dataForm.status"
                        :listDataOption="StatusOptions"
                        :isDisabled="true"
                        data-value="key"
                        data-label="value"></select-all>

          </el-form-item>

          <el-form-item label="备注"
                        prop="remark">
            <textarea-all v-model="dataForm.remark"
                          :disabled="isDisabled"></textarea-all>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-form-item>
          <!-- <el-radio-group v-model="dataForm.mode"
                          :disabled="(isDisabled) ||  Add"> -->
          <el-radio-group v-model="dataForm.mode"
                          :disabled="isDisabled">
            <el-radio :label="0">已入库再退货</el-radio>
            <el-radio :label="1">已收料再退货</el-radio>
          </el-radio-group>
        </el-form-item>
      </el-row>
      <el-row>
        <el-button v-if="isClick"
                   type="text"
                   :disabled="(dataForm.poReturnSource === '01')"
                   @click="addRow">
          <i class="iconfont erp-icon-tianjiamingxi"></i>新增明细行</el-button>
      </el-row>
      <!-- 退货明细 -->
      <el-row>
        <el-table :data="dataForm.poReturnDetail"
                  stripe
                  border
                  highlight-current-row
                  :cell-style="cellStyle"
                  show-summary
                  fit
                  max-height="400"
                  id="table__one"
                  class="tableInfo"
                  :summary-method="getSummaries"
                  v-loading="dataListLoading"
                  @selection-change="selectionChangeHandle">
          <el-table-column prop="prodCode"
                           label="产品编码"></el-table-column>
          <el-table-column prop="imageUrl"
                           label="产品图片"
                           width="120px;">
            <template slot-scope="scope">
              <tableImg :imageUrl='scope.row.imageUrl'></tableImg>
            </template>
          </el-table-column>
          <el-table-column prop="prodName"
                           label="产品名称"></el-table-column>
          <el-table-column prop="specifications"
                           label="规格型号"></el-table-column>
          <el-table-column prop="qty"
                           label="退货数量">
            <template slot-scope="scope">
              <el-form-item :prop="'poReturnDetail[' + scope.$index + '].qty'"
                            :rules="dataRule.isNatural"
                            label-width="0px">
                <el-input v-model="scope.row.qty"
                          type="Number"
                          @mousewheel.native.prevent
                          :disabled="isDisabled"></el-input>
              </el-form-item>
            </template>
          </el-table-column>
          <el-table-column prop="dictInventoryStatus"
                           label="库存状态">
            <template slot-scope="scope">
              <el-form-item label-width="0px">
                <select-all v-model="scope.row.dictInventoryStatus"
                            :listDataOption="dictInventoryStatusOptions"
                            data-value="key"
                            :isDisabled="isDisabled"
                            data-label="value"></select-all>
              </el-form-item>
            </template>
          </el-table-column>
          <el-table-column prop="remark"
                           label="备注">
            <template slot-scope="scope">
              <textarea-all v-model="scope.row.remark"
                            :disabled="isDisabled"></textarea-all>
            </template>
          </el-table-column>
          <el-table-column label="来源">
            <template slot-scope="scope">
              <div>来源类型:<span>{{dataForm.poReturnSourceName}}</span></div>
              <div v-if="type !== 'canAdd'">上游单号:<span>{{scope.row.poCode}}</span></div>
            </template>
          </el-table-column>

          <el-table-column v-if="isClick"
                           width="80"
                           fixed="right"
                           label="操作">
            <template slot-scope="scope">
              <el-button type="danger"
                         size="small"
                         circle
                         title="删除"
                         @click="deleteHandle(scope)">
                <i class="iconfont erp-icon-shanchu"></i>
              </el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-row>
    </el-form>
    <span slot="footer">
      <el-button @click="visible = false"><i class="iconfont erp-icon-quxiao"></i>取消</el-button>
      <el-button v-if="isClick"
                 type="primary"
                 @click="dataFormSubmit()"><i class="iconfont erp-icon-baocun"></i>保存</el-button>
      <el-button v-if="isClick"
                 type="primary"
                 @click="onReturn()"><i class="iconfont erp-icon-queding"></i>确认退货</el-button>
    </span>
    <!-- 添加明细 -->
    <add-details ref="addDetails"
                 @addDetailsList="addList"></add-details>
  </el-dialog>
</template>
<script>
// 新增行
import selectSeach from '@/components/erp-select/select-seach'
import selectAll from '@/components/erp-select/select-all'
import { dateFormatter } from '@/utils/index.js'
import { ruleData } from '@/mixins/initData.js'
// 添加明细（新组件）
import addDetails from '@/components/add-details/prod-warehouse-detail'
import _ from 'lodash'
// 引入图片
import tableImg from '@/components/list-table/table-img'
// 备注组件
import textareaAll from '@/components/erp-input/textarea-all'
export default {
  mixins: [ruleData],
  components: {
    selectSeach,
    selectAll,
    addDetails,
    tableImg,
    textareaAll
  },

  data () {
    return {
      visible: false,
      isClick: true,
      isDisabled: false,
      isDisableFromAdd: false,
      Add: true,
      type: '',
      // 退货仓库
      warehouseIdOption: [],
      // 单据状态
      StatusOptions: [],
      // 库存状态
      dictInventoryStatusOptions: [],
      // 采购公司
      compIdOption: [],
      dataForm: {
        id: '',
        code: '',
        userId: '',
        warehouseId: '',
        date: '',
        supplierId: '',
        compId: '',
        companyName: '',
        remarks: '',
        status: '01',
        mode: 1,
        // 表数据
        poReturnDetail: [],
        poReturnSource: '02'
      },
      dataListLoading: false,
      // 多选
      dataListSelections: [],
      dataRule: {
        warehouseId: [
          { required: true, message: '退货仓库不能为空', trigger: 'blur' }
        ],
        supplierId: [
          { required: true, message: '供应商不能为空', trigger: 'blur' }
        ],
        compId: [
          { required: true, message: '退货公司不能为空', trigger: 'blur' }
        ],
        isNatural: [
          { required: true, message: '必填项', trigger: 'blur' },
          { pattern: /^[1-9]\d*$/, message: '大于零的整数', trigger: 'change' }
        ]
      }
    }
  },
  created () {
    this.$http
      .get(this.$http.adornUrl('sys/organization/select'))
      .then(({ data }) => {
        this.compIdOption = data.companyList
      })
    this.$http
      .get(this.$http.adornUrl('basicData/queryDataDict2List'), {
        params: { dataDictKey: 'APPROVAL_STATUS' }
      })
      .then(({ data }) => {
        this.StatusOptions = data.fontMaps
      })
    this.$http
      .get(this.$http.adornUrl('basicData/queryDataDict2List'), {
        params: { dataDictKey: 'WAREHOUSE_INVENTORY_STATUS' }
      })
      .then(({ data }) => {
        this.dictInventoryStatusOptions = data.fontMaps
      })
  },
  methods: {
    init (id, type, parentData) {
      this.dataForm.code = ''
      this.dataForm.addTime = ''
      this.dataForm.addUser = ''
      this.dataForm.updTime = ''
      this.dataForm.updUser = ''
      this.dataForm.confirmUser = null
      this.dataForm.confirmUserName = null
      this.dataForm.confirmTime = null
      this.dataForm.userId = sessionStorage.getItem('userId')
      this.dataForm.poReturnSourceName = ''
      this.isDisableFromAdd = false
      // this.$http.get(this.$http.adornUrl('list/combobox/warehouse-comp'), {params: {compId: this.dataForm.compName}}).then(({data}) => {this.warehouseIdOption = data.list})
      this.visible = true
      this.dataForm.id = id
      this.dataForm.poReturnDetail = []
      this.Add = true
      this.$nextTick(() => {
        if (type === 'receiveList') {
          this.isDisabled = false
          this.dataForm = parentData.poReturnDto
          this.Add = true
          this.dataForm.date = dateFormatter(new Date(), false)
          if (this.dataForm.date == null) {
            this.dataForm.date = new Date()
          }
          this.$nextTick(() => {
            this.compIdChange(this.dataForm.compId, 'receiveList')
          })
          this.dataForm.userId = sessionStorage.getItem('userId')
          return
        }
        if (type === 'canCheck') {
          this.isDisabled = true
          this.isClick = false
        } else {
          // 直接新增
          if (type === 'canAdd') {
            this.type = 'canAdd'
            this.dataForm.userId = sessionStorage.getItem('userId')
          }
          // 新增
          this.isDisabled = false
          this.isClick = true
          this.dataForm.poReturnSource = '02'
          this.dataForm.mode = 0
          // 默认公司
          this.dataForm.compId = sessionStorage.getItem('orgId')
          this.$nextTick(() => {
            this.compIdChange(this.dataForm.compId)
          })
        }
      })
      if (this.dataForm.id) {
        this.isDisableFromAdd = true
        if (id) {
          this.$http({
            url: this.$http.adornUrl(`warehouse/whreturnpo/info/${id}`),
            method: 'get'
            // data: id
          }).then(({ data }) => {
            if (data && data.code === 0) {
              this.compIdChange(data.poReturnDto.compId)
              this.dataForm = data.poReturnDto
              if (this.dataForm.poReturnSource && this.dataForm.poReturnSource === '02') {
                this.type = 'canAdd'
              } else {
                this.type = ''
              }
            }
          })
        }
      }
    },

    // 选择公司触发
    compIdChange (value, type) {
      if (!(type === 'receiveList')) {
        this.dataForm.warehouseId = ''
      }
      this.$http
        .get(this.$http.adornUrl('list/combobox/warehouse-comp'), {
          params: { compId: value }
        })
        .then(({ data }) => {
          this.warehouseIdOption = data.list
        })
    },

    // 增加行
    addRow () {
      if (!this.dataForm.warehouseId || !this.dataForm.compId) {
        this.$notify.error({
          title: '错误',
          message: `请先选择[退货公司]和[退货仓库]`,
          duration: 3000
        })
      } else {
        this.$nextTick(() => {
          this.$refs.addDetails.init(
            this.id,
            this.dataForm.poReturnDetail,
            {
              warehouseId: this.dataForm.warehouseId,
              compId: this.dataForm.compId,
              kcstatus: 1
            }
          )
        })
      }
    },

    // 确认退货
    onReturn: _.debounce(
      async function onReturn () {
        if (!(this.dataForm.poReturnDetail.length > 0)) {
          this.$notify.error({
            title: '错误',
            message: `明细不能为空`,
            duration: 5000
          })
          return
        }
        this.$refs['dataForm'].validate(valid => {
          if (valid) {
            this.$http({
              url: this.$http.adornUrl(`warehouse/whreturnpo/saveandconfirm`),
              method: 'post',
              data: this.dataForm
            }).then(({ data }) => {
              if (data && data.code === 0) {
                this.visible = false
                this.$emit('refreshDataList')
                this.$notify.success({
                  dangerouslyUseHTMLString: true,
                  title: '成功',
                  message: `确认退货成功,编码为: ${data.entity.code} , </br> ${data.entity.yfCodes.length > 0 ? '成功生成采购应付单:' + data.entity.yfCodes.join('</br>') : ''} `,
                  duration: 5000
                })
              } else {
                this.$notify.error({
                  title: '警告',
                  message: data.msg,
                  duration: 5000
                })
              }
            })
          }
        })
      },
      1000,
      {
        leading: true,
        trailing: false
      }
    ),
    dataFormSubmit: _.debounce(
      async function dataFormSubmit () {
        if (!(this.dataForm.poReturnDetail.length > 0)) {
          this.$notify.error({
            title: '错误',
            message: `明细不能为空`,
            duration: 5000
          })
          return
        }
        this.$refs['dataForm'].validate(valid => {
          if (valid) {
            this.$http({
              url: this.$http.adornUrl(
                `warehouse/whreturnpo/${!this.dataForm.id ? 'save' : 'update'}`
              ),
              method: !this.dataForm.id ? 'post' : 'post',
              data: this.dataForm
            }).then(({ data }) => {
              if (data && data.code === 0) {
                this.$emit('refreshDataList')
                this.visible = false
                this.$notify.success({
                  title: '提示',
                  message: `保存成功, 编码为:${data.entity.code}`,
                  duration: 5000
                })
                this.dataForm.code = data.poReturnCode
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
      1000,
      {
        leading: true,
        trailing: false
      }
    ),
    // 多选
    selectionChangeHandle (val) {
      this.dataListSelections = val
    },
    // 总计
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
          if (index == 4) {
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

    // 子组件添加的数据
    addList (list) {
      list = list.map(item => {
        return {
          id: item.id,
          prodId: item.prodId,
          prodCode: item.prodCode,
          imageUrl: item.imageUrl,
          prodName: item.prodName,
          specifications: item.specifications,
          qty: item.qty,
          dictInventoryStatus: item.dictInventoryStatus
        }
      })
      // 添加了数据，禁掉退货公司和退货仓库的选择
      this.isDisableFromAdd = true
      for (const data of list) {
        let isFind = false
        for (const item of this.dataForm.poReturnDetail) {
          if (data.id === item.id) {
            isFind = true
            break
          }
        }
        if (!isFind) {
          this.dataForm.poReturnDetail.push(data)
        }
      }
    },

    // 删除
    deleteHandle (scope) {
      this.dataForm.poReturnDetail.splice(scope.$index, 1)
      if (this.dataForm.poReturnDetail.length > 0) {
        this.isDisableFromAdd = true
      } else {
        this.isDisableFromAdd = false
      }
    },
    // 改变表格里面的样式
    cellStyle ({ row, column, rowIndex, columnIndex }) {
      // column.align= ''
      // column.headerAlign= ''
      if (columnIndex === 0) {
        // 指定坐标
        return 'height:100%'
      }
      if (columnIndex === 9) {
        // 指定坐标
        return 'text-align:center'
      }
    }
  }
}
</script>

