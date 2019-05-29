<template>
  <el-dialog :title="title"
             :close-on-click-modal="false"
             :visible.sync="visible"
             @close="$refs['dataForm'].resetFields()"
             width="90%">
    <el-form :model="dataForm"
             ref="dataForm"
             label-width="110px"
             :rules="dataRule">
      <el-row>
        <el-col :span="6">
          <el-form-item label="收货编码"
                        prop="code">
            <el-input v-model="dataForm.code"
                      disabled></el-input>
          </el-form-item>
          <el-form-item label="收货仓库"
                        prop="warehouseId">
            <select-all v-model="dataForm.warehouseId"
                        :listDataOption="warehouseOptions"
                        :isDisabled="isDisabled"
                        data-value="id"
                        data-label="name"></select-all>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="收货日期"
                        prop="date">
            <el-date-picker v-model="dataForm.date"
                            type="date"
                            value-format="yyyy-MM-dd"
                            :disabled="isDisabled"></el-date-picker>
          </el-form-item>
          <el-form-item label="供应商名称"
                        prop="supplierName">
            <el-input v-model="dataForm.supplierName"
                      :disabled="isSupplierName"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="收货公司"
                        prop="compId">
            <select-seach isDisabled
                          v-model="dataForm.compId"
                          httpUrl="sys/organization/select"
                          httpMethod="get"
                          requestParamsKey="orgId"
                          data-label="name"
                          data-value="orgId"
                          data-source="companyList"
                          :listDataOptionStatic="compOptions"></select-seach>
          </el-form-item>
          <el-form-item label="单据状态"
                        prop="status">
            <select-all v-model="dataForm.status"
                        :listDataOption="statusOptions"
                        :isDisabled="true"
                        data-value="key"
                        data-label="value"></select-all>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="备注"
                        prop="remark">
            <textarea-all v-model="dataForm.remark"
                          :disabled="isDisabled"></textarea-all>
          </el-form-item>
        </el-col>
      </el-row>

      <!-- 采购收货列表 -->
      <el-table :data="dataForm.poReceiveDetail"
                stripe
                border
                max-height="400"
                highlight-current-row
                key='firstTable'
                v-loading="dataListLoading"
                show-summary
                :summary-method="getSummaries"
                @selection-change="selectionChangeHandle">
        <el-table-column prop="imageUrl"
                         label="产品图片"
                         width="120px;">
          <template slot-scope="scope">
            <tableImg :imageUrl='scope.row.imageUrl'></tableImg>

          </template>
        </el-table-column>
        <el-table-column prop="prodCode"
                         label="产品编码"></el-table-column>
        <el-table-column prop="prodName"
                         label="产品名称"></el-table-column>
        <el-table-column prop="unit"
                         label="单位"></el-table-column>
        <el-table-column prop="poQty"
                         label="采购数量"></el-table-column>
        <el-table-column prop="qty"
                         label="本次收货数量">
          <template slot-scope="scope">
            <el-form-item :prop="'poReceiveDetail[' + scope.$index + '].qty'"
                          :rules="dataRule.qty"
                          label-width="0px">
              <el-input v-model="scope.row.qty"
                        type="Number"
                        @mousewheel.native.prevent
                        :disabled="isDisabled"></el-input>
            </el-form-item>
          </template>
        </el-table-column>
        <el-table-column prop="inventoryStatus"
                         label="库存状态"
                         min-width="120px;">
          <template slot-scope="scope">
            <el-form-item label-width="0px">
              <select-all v-model="scope.row.inventoryStatus"
                          :isDisabled="true"
                          :listDataOption="inventoryStatusOptipns"
                          data-value="key"
                          data-label="value"></select-all>
            </el-form-item>
          </template>
        </el-table-column>
        <el-table-column prop="remark"
                         label="备注"
                         min-width="100px;">
          <template slot-scope="scope">
            <textarea-all v-model="scope.row.remark"
                          :disabled="isDisabled"></textarea-all>
          </template>
        </el-table-column>
        <el-table-column prop="poCode"
                         label="采购订单号"
                         :disabled="isDisabled"></el-table-column>
        <el-table-column v-if="isClick"
                         width="50"
                         label="操作"
                         fixed="right">
          <template slot-scope="scope">
            <el-button type="danger"
                       size="small"
                       circle
                       title="删除"
                       @click="deleteHandle(scope)"
                       :disabled="isDisabled">
              <i class="iconfont erp-icon-shanchu"></i>
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-form>
    <span slot="footer">
      <el-button @click="visible = false"><i class="iconfont erp-icon-quxiao"></i>取消</el-button>
      <el-button v-if="isClick"
                 type="primary"
                 @click="onSave()"
                 :disabled="control"><i class="iconfont erp-icon-baocun"></i>保存</el-button>
      <el-button v-if="isClick"
                 type="primary"
                 @click="onReceive()"
                 :disabled="control"><i class="iconfont erp-icon-queding"></i>确认</el-button>
    </span>
  </el-dialog>
</template>

<script>
// 分页
import paginationAll from '@/components/erp-pagination/pagination-all'
import selectSeach from '@/components/erp-select/select-seach'
import selectAll from '@/components/erp-select/select-all'
import { isNumber } from '@/utils/validate.js'
import { dateFormatter } from '@/utils/index.js'
// 引入图片
import tableImg from '@/components/list-table/table-img'
// 备注组件
import textareaAll from '@/components/erp-input/textarea-all'
import _ from 'lodash'
export default {
  components: {
    paginationAll,
    selectSeach,
    selectAll,
    tableImg,
    textareaAll
  },
  data () {
    var validQty = (rule, value, callback) => {
      let subString = rule.field.split('[')[1]
      let valueIndex = subString.split(']')[0]
      if (this.dataForm.poReceiveDetail[valueIndex].returnQty) {
        var Qtyvalue =
          Number(this.dataForm.poReceiveDetail[valueIndex].poQty) -
          Number(this.dataForm.poReceiveDetail[valueIndex].receiveQty) +
          Number(this.dataForm.poReceiveDetail[valueIndex].returnQty)
      } else {
        var Qtyvalue =
          Number(this.dataForm.poReceiveDetail[valueIndex].poQty) -
          Number(this.dataForm.poReceiveDetail[valueIndex].receiveQty)
      }
      if (!/^[1-9]\d*$/.test(value) && value != null) {
        callback(new Error('输入大于0的整数'))
      } else if (value > Qtyvalue) {
        callback(new Error(`最大数量为${Qtyvalue}`))
      } else {
        callback()
      }
    }
    return {
      compOptions: [],
      control: false,
      title: '',
      type: '',
      warehouseOptions: [], // 收货仓库
      inventoryStatusOptipns: [], // 库存状态
      visible: false,
      isSupplierName: false,
      // 单据状态
      statusOptions: [],
      isClick: true,
      isDisabled: false,
      id: '',
      dataForm: {
        code: '系统自动生成',
        date: '', // 将"2018-11-08T09:07:37.648Z"转换为"2018-11-08"
        warehouseName: '',
        supplierName: '',
        status: '01',
        remarks: '',
        poReceiveDetail: []
      },
      poReceiveList: [], // 收货明细
      dataRule: {
        qty: [
          { required: true, message: '请输入正整数', trigger: 'blur' },
          { validator: validQty, trigger: 'blur' },
          {
            transform: Number,
            type: 'integer',
            message: '请输入正整数',
            trigger: 'change'
          }
        ],
        warehouseId: [{ required: true, message: '必填项', trigger: 'blur' }],
        date: [{ required: true, message: '必填项', trigger: 'blur' }],
        supplierName: [{ required: true, message: '必填项', trigger: 'blur' }]
      },
      dataListLoading: false,
      dataListSelections: [],
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
    this.$http
      .get(this.$http.adornUrl('basicData/queryDataDict2List'), {
        params: { dataDictKey: 'APPROVAL_STATUS' }
      })
      .then(({ data }) => {
        this.statusOptions = data.fontMaps
      })

    // 库存状态
    this.$http
      .get(this.$http.adornUrl('basicData/queryDataDict2List'), {
        params: { dataDictKey: 'WAREHOUSE_INVENTORY_STATUS' }
      })
      .then(({ data }) => {
        this.inventoryStatusOptipns = data.fontMaps
      })
  },
  methods: {
    // 批量收货
    init (id, type, parentData) {
      this.visible = true
      this.dataForm.id = id
      this.$nextTick(() => {
        if (type === 'receiveList') {
          this.title = '收货详情单新增'
          this.initAdd(parentData)
        }
        if (type === 'canCheck' && this.dataForm.id) {
          this.title = '收货详细单查看'
          this.initCheck(id)
        }
        if (type === 'canEdit' && this.dataForm.id) {
          this.title = '收货详细单编辑'
          this.initEdit(id)
        }
      })
    },
    // 新增
    initAdd (parentData) {
      this.type = 'add'
      this.dataForm = parentData
      this.isSupplierName = true
      this.isDisabled = false
      // 收货仓库
      this.$http
        .get(this.$http.adornUrl('list/combobox/warehouse-comp'), {
          params: { compId: this.dataForm.compId }
        })
        .then(({ data }) => {
          this.warehouseOptions = data.list
        })
      this.dataForm.date = dateFormatter(new Date(), false)
    },

    // 查看
    initCheck (id) {
      this.getDataList(id)
      this.type = 'search'
      this.isDisabled = true
      this.isSupplierName = true
      this.isClick = false
    },

    // 编辑
    initEdit (id) {
      this.getDataList(id)
      this.type = 'editor'
      this.isSupplierName = true
      this.isDisabled = false
      this.isClick = true
    },

    // 数据调用
    getDataList (id) {
      this.$http({
        url: this.$http.adornUrl(`warehouse/whreceivepo/info/${id}`),
        method: 'get'
      }).then(({ data }) => {
        if (data && data.code === 0) {
          this.dataForm = data.poReceiveDto
          let list = data.poReceiveDto.poReceiveDetail
          for (let i = 0; i < list.length; i++) {
            list[i].inventoryStatus = '01'
          }
          // this.poReceiveList = this.dataForm.poReceiveDetail;
          this.$http
            .get(this.$http.adornUrl('list/combobox/warehouse-comp'), {
              params: { compId: this.dataForm.compId }
            })
            .then(({ data }) => {
              this.warehouseOptions = data.list
            })
        }
      })
    },
    // 合计
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
          if (index == 5) {
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
    // 确认
    onReceive: _.debounce(
      async function onReceive () {
        this.$refs['dataForm'].validate(valid => {
          if (valid) {
            if (this.dataForm.poReceiveDetail) {
              for (let i = 0; i < this.dataForm.poReceiveDetail.length; i++) {
                if (this.dataForm.poReceiveDetail[i].qty < 1) {
                  this.$notify.error({
                    title: '错误',
                    message: '请输入正整数',
                    duration: 1500
                  })
                  this.control = true
                  return
                } else if (
                  !/^[1-9]\d*$/.test(this.dataForm.poReceiveDetail[i].qty) &&
                  this.dataForm.poReceiveDetail[i].qty != null
                ) {
                  this.$notify.error({
                    title: '错误',
                    message: '请输入正整数',
                    duration: 1500
                  })
                  return
                }
              }
              this.control = false
              this.dataListLoading = true
              this.$http({
                url: this.$http.adornUrl(
                  'warehouse/whreceivepo/saveandconfirm'
                ),
                method: 'post',
                data: this.dataForm
              }).then(({ data }) => {
                if (data && data.code === 0) {
                  if (!this.dataForm.id) {
                    this.$notify({
                      type: 'success',
                      title: '提示',
                      message: `收货记录[单号：${
                        data.entity.code
                        }]保存并确认成功，可在收货记录列表进行查看。`,
                      duration: 5000
                    })
                  } else {
                    this.$notify({
                      type: 'success',
                      title: '提示',
                      message: `${
                        !this.dataForm.id ? '新增' : '确认'
                        }成功, 编码为:${data.entity.code}`,
                      duration: 5000
                    })
                  }
                  this.dataListLoading = false
                  this.visible = false
                  this.$emit('refreshDataList')
                } else {
                  this.dataListLoading = false
                  this.$notify.error({
                    title: '错误',
                    message: data.msg,
                    duration: 5000
                  })
                }
              })
            }
          }
        })
      }, 1000, {
        leading: true,
        trailing: false
      }
    ),

    // 保存
    onSave: _.debounce(
      async function onSave () {
        this.$refs['dataForm'].validate(valid => {
          if (valid) {
            this.dataForm.poReceiveDetail.forEach(element => {
              if (element.qty < 1) {
                this.$notify.error({
                  title: '错误',
                  message: '请输入正整数',
                  duration: 1500
                })
                this.control = true
              } else {
                this.control = false
              }
            })
            // 新增
            if (this.type === 'add') {
              this.$http({
                url: this.$http.adornUrl('warehouse/whreceivepo/save'),
                method: 'post',
                data: this.dataForm
              }).then(({ data }) => {
                if (data && data.code === 0) {
                  this.visible = false
                  this.$emit('refreshDataList')
                  this.$notify({
                    type: 'success',
                    title: '提示',
                    message: `收货记录[单号：${
                      data.entity.code
                      }]保存成功，可在收货记录列表进行查看或编辑。`,
                    duration: 5000
                  })
                  this.dataForm.code = data.poReceiveCode

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
              // 编辑
            } else {
              this.$http({
                url: this.$http.adornUrl('warehouse/whreceivepo/update'),
                method: 'post',
                data: this.dataForm
              }).then(({ data }) => {
                if (data && data.code === 0) {
                  this.visible = false
                  this.$emit('refreshDataList')
                  this.$notify({
                    type: 'success',
                    title: '提示',
                    message: `单号${data.entity.code}保存成功`,
                    duration: 5000
                  })
                  this.dataForm.code = data.poReceiveCode
                } else {
                  this.$notify.error({
                    title: '错误',
                    message: data.msg,
                    duration: 5000
                  })
                }
              })
            }
          }
        })
      }, 1000, {
        leading: true,
        trailing: false
      }
    ),

    // 删除
    deleteHandle (scope) {
      if (this.dataForm.poReceiveDetail.length === 1) {
        this.$confirm('至少存一条收货明细', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        })
      } else {
        this.$confirm('确认要删除此行吗？', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.dataForm.poReceiveDetail.splice(scope.$index, 1)
        })
      }
    },

    // 多选
    selectionChangeHandle (val) {
      this.dataListSelections = val
    }
  }
}
</script>

