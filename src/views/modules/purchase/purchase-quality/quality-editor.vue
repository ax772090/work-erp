<template>
  <el-dialog :title="title"
             :close-on-click-modal="false"
             :visible.sync="visible"
             @close="$refs['dataForm'].resetFields()"
             append-to-body
             width="90%">
    <div>
      <!-- 基本信息 -->
      <el-form :model="dataForm"
               :rules="dataRule"
               ref="dataForm"
               label-width="110px">
        <el-row>
          <el-col :span="6">
            <el-form-item label="检验单号"
                          prop="code">
              <el-input v-model="dataForm.code"
                        disabled></el-input>
            </el-form-item>
            <el-form-item label="检验员"
                          prop="userId">
              <select-seach :isDisabled="isDisabled"
                            v-model="dataForm.userId"
                            httpUrl="/list/search/user"
                            httpMethod="get"
                            requestParamsKey="name"
                            data-label="name"
                            data-value="id"
                            data-source="list"
                            :listDataOptionStatic="userOptions"></select-seach>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="检验日期"
                          prop="date">
              <el-date-picker v-model="dataForm.date"
                              type="date"
                              value-format="yyyy-MM-dd"
                              @change="formatTime"
                              :disabled="isDisabled"></el-date-picker>
            </el-form-item>
            <el-form-item label="备注"
                          prop="remark">
              <textarea-all v-model="dataForm.remark"
                            :disabled="isDisabled"></textarea-all>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="检验状态"
                          prop="status">
              <select-all v-model="dataForm.status"
                          :listDataOption="statusList"
                          :isDisabled="true"
                          data-value="key"
                          data-label="value"></select-all>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="检验公司"
                          prop="compId">
              <select-seach v-model="dataForm.compId"
                            :isDisabled="true"
                            httpUrl="/sys/organization/select"
                            httpMethod="get"
                            requestParamsKey="orgId"
                            data-label="name"
                            data-value="orgId"
                            data-source="companyList"
                            :listDataOptionStatic="compOptions"></select-seach>
            </el-form-item>
          </el-col>
        </el-row>
        <el-table width="100px"
                  :data="dataForm.inspectionDetail"
                  stripe
                  max-height="400"
                  border
                  highlight-current-row
                  show-summary
                  :summary-method="getSummaries"
                  v-loading="dataListLoading">
          <el-table-column prop="supplierName"
                           label="供应商名称"></el-table-column>
          <el-table-column prop="prodCode"
                           label="产品编码"></el-table-column>
          <el-table-column prop="poCode"
                           label="采购订单号"></el-table-column>
          <el-table-column prop="imageId"
                           label="产品图片"
                           width="120">
            <template slot-scope="scope">
              <tableImg :imageUrl='scope.row.imageUrl'></tableImg>

            </template>
          </el-table-column>
          <el-table-column prop="prodName"
                           label="产品名称"></el-table-column>
          <el-table-column prop="specifications"
                           label="规格型号"></el-table-column>
          <el-table-column prop="mode"
                           label="质检方式"
                           min-width="100px;">
            <template slot-scope="scope">
              <el-form-item label-width="0px">
                <select-all v-model="scope.row.mode"
                            :listDataOption="qtyModeList"
                            :isDisabled="isDisabled"
                            data-value="key"
                            data-label="value"></select-all>
              </el-form-item>
            </template>
          </el-table-column>
          <el-table-column prop="qty"
                           label="检验数量">
            <template slot-scope="scope">
              <el-form-item :prop="'inspectionDetail[' + scope.$index + '].qty'"
                            :rules="dataRule.qty"
                            label-width="0px">
                <el-input v-model="scope.row.qty"
                          :disabled="isDisabled"
                          type="Number"
                          @mousewheel.native.prevent></el-input>
              </el-form-item>
            </template>
          </el-table-column>
          <el-table-column prop="defectiveQty"
                           label="不合格数量">
            <template slot-scope="scope">
              <el-form-item :prop="'inspectionDetail[' + scope.$index + '].defectiveQty'"
                            :rules="dataRule.defectiveQty"
                            label-width="0px">
                <el-input v-model="scope.row.defectiveQty"
                          placeholder="0"
                          :disabled="isDisabled"
                          type="Number"
                          @mousewheel.native.prevent></el-input>
              </el-form-item>
            </template>
          </el-table-column>
          <el-table-column prop="qualifiedQty"
                           label="合格数量"></el-table-column>
          <el-table-column prop="defectiveRate"
                           label="次品率%"></el-table-column>
          <el-table-column prop="defectiveStrategy"
                           label="不合格使用决策"
                           min-width="125px;">
            <template slot-scope="scope">
              <el-form-item label-width="0px">
                <select-all v-model="scope.row.defectiveStrategy"
                            :isDisabled="isDisabled"
                            :listDataOption="strategyList"
                            data-value="key"
                            data-label="value"></select-all>
              </el-form-item>
            </template>
          </el-table-column>
          <el-table-column label="备注"
                           prop="remarks">
            <template slot-scope="scope">
              <textarea-all v-model="scope.row.remarks"
                            :disabled="isDisabled"></textarea-all>
            </template>
          </el-table-column>
          <el-table-column type="index"
                           label="操作"
                           width="50"
                           v-if="isShow">
            <template slot-scope="scope">
              <el-button type="danger"
                         size="small"
                         circle
                         title="删除"
                         @click="del(scope)">
                <i class="iconfont erp-icon-shanchu"></i>
              </el-button>
            </template>
          </el-table-column>
        </el-table>
        <el-row type="flex"
                justify="end"
                class="mt-20">
          <el-button @click="visible=false"><i class="iconfont erp-icon-quxiao"></i>取消</el-button>
          <el-button type="primary"
                     @click="save()"
                     v-if="isShow"
                     :disabled="compareNum"><i class="iconfont erp-icon-baocun"></i>保存</el-button>
          <el-button type="primary"
                     @click="commit()"
                     v-if="isShow"
                     :disabled="compareNum"><i class="iconfont erp-icon-queding"></i>质检确认</el-button>
        </el-row>
      </el-form>
    </div>
  </el-dialog>
</template>
<script>
import selectAll from '@/components/erp-select/select-all'
import selectSeach from '@/components/erp-select/select-seach'
import { isNumber } from '@/utils/validate.js'
import { dateFormatter } from '@/utils/index.js'
import { log, types } from 'util'
// 备注组件
import textareaAll from '@/components/erp-input/textarea-all'
// 引入图片
import tableImg from '@/components/list-table/table-img'
import _ from 'lodash'
export default {
  components: {
    selectAll,
    selectSeach,
    tableImg,
    textareaAll
  },
  name: 'qualityEditor',
  props: ['value', 'receiveData'], // 接受外部v-model传入的值    //采购订单带过来的数据
  data () {
    // var validQty = (rule, value, callback) => {
    //   let subString = rule.field.split('[')[1]
    //   let valueIndex = subString.split(']')[0]

    //   if (!/^[1-9]\d*$/.test(value) && value != null) {
    //     callback(new Error('输入大于0的整数'))
    //   } else if (value > this.dataForm.inspectionDetail[valueIndex].waitQualityQty) {
    //     callback(new Error(`最大数量为${this.dataForm.inspectionDetail[valueIndex].waitQualityQty}`))
    //   } else {
    //     callback()
    //   }
    // }
    return {
      isShow: true,
      title: '',
      isDisabled: false,
      dataListLoading: false,
      compareNum: false,
      visible: false,
      type: '',
      remarks: '',
      // 检验员
      userOptions: [],
      statusList: [], // 检验状态
      compOptions: [], // 检验公司
      date: '', // 将"2018-11-08T09:07:37.648Z"转换为"2018-11-08"
      // 基本信息
      dataForm: {
        // id: '',
        code: '',
        warehouseName: '',
        compName: '',
        userName: '',
        date: '',
        prodLength: '',
        inboxLength: '',
        remarks: '',
        status: '',
        date: '',
        id: '',
        inspectionDetail: []
      },
      // 质检方式
      qtyModeList: [],
      // 不合格使用决策
      strategyList: [],
      poinstockDetail: {},
      // 质检明细
      storageList: [],
      dataRule: {
        date: [
          { required: true, message: '检验日期不能为空', trigger: 'blur' }
        ],
        userName: [
          { required: true, message: '检验员不能为空', trigger: 'blur' }
        ],
        qty: [
          { required: true, message: '正整数', trigger: 'blur' },
          {
            transform: Number,
            type: 'integer',
            message: '正整数',
            trigger: 'change'
          }
        ],
        defectiveQty: [
          { required: true, message: '请输入整数', trigger: 'change' },
          {
            transform: Number,
            type: 'integer',
            message: '整数',
            trigger: 'change'
          }
        ],
        userId: [{ required: true, message: '必填项', trigger: 'change' }]
      },
      // 表数据
      dataList: []
    }
  },
  methods: {
    // 查询数据字典(不合格使用决策)
    queryDataDict2List (dataDictKey) {
      this.$http({
        url: this.$http.adornUrl('basicData/queryDataDict2List'),
        method: 'get',
        params: this.$http.adornParams({
          dataDictKey: dataDictKey
        })
      }).then(({ data }) => {
        if (data && data.code === 0) {
          if (dataDictKey == 'DEFECTIVE_STRATEGY') {
            this.strategyList = data.fontMaps
          } else if (dataDictKey == 'INSPECTION_TYPE') {
            this.qtyModeList = data.fontMaps
          } else if (dataDictKey == 'INSPECTION_BIZ_STATUS') {
            this.statusList = data.fontMaps
          }
        }
      })
    },
    // 检验日期
    formatTime (time) {
      this.dataForm.date = time // date是绑定的值
    },
    // 初始化
    init (id, type, data) {
      this.dataForm.id = id
      let dataDictKey
      this.queryDataDict2List((dataDictKey = 'DEFECTIVE_STRATEGY'))
      this.queryDataDict2List((dataDictKey = 'INSPECTION_TYPE'))
      this.queryDataDict2List((dataDictKey = 'INSPECTION_BIZ_STATUS'))
      this.$nextTick(() => {
        if (type === 'receiveList') {
          this.title = '采购质检单新增'
          this.initAdd(data)
        }
        if (type === 'canCheck' && this.dataForm.id) {
          this.title = '采购质检单查看'
          this.initCheck(id)
        }
        if (type === 'canEdit' && this.dataForm.id) {
          this.title = '采购质检单编辑'
          this.initEdit(id)
        }
      })
    },
    // 采购跟踪操作=》新增
    initAdd (data) {
      this.type = 'add'
      this.isShow = true
      this.visible = true
      this.isDisabled = false
      this.dataForm = data.inspectionDto
      this.dataForm.userId = sessionStorage.getItem('userId') // 新增默认当前用户
      this.dataForm.date = dateFormatter(new Date(), false)
      if (this.dataForm.inspectionDetail) {
        this.dataForm.inspectionDetail.forEach(element => {
          if (element.qualifiedQty == null) {
            element.qualifiedQty = 0
          } else if (element.defectiveQty == null) {
            element.defectiveQty = 0
          } else if (element.receiveQty == null) {
            element.receiveQty = 0
          }
          element.qty = ''
          element.qualifiedQty = 0
          element.defectiveQty = 0
        })
      }
      if (this.dataForm.date == null) {
        this.dataForm.date = new Date()
      }
      this.storageList = data.inspectionDto.inspectionDetail
      this.dataForm.userName = ''
    },

    // 查看
    initCheck (id) {
      this.getDataList(id)
      this.type = 'search'
      this.isShow = false
      this.visible = true
      this.isDisabled = true
    },

    // 编辑
    initEdit (id) {
      this.getDataList(id)
      this.type = 'editor'
      this.isShow = true
      this.visible = true
      this.isDisabled = false
    },

    // 数据调用
    getDataList (id) {
      this.$http({
        url: this.$http.adornUrl(
          `qc/qcinspection/info/${id}`
        ),
        method: 'get'
      }).then(({ data }) => {
        if (data && data.code === 0) {
          this.dataForm = data.inspectionDto
          this.storageList = data.inspectionDto.inspectionDetail
          let dataList = data.inspectionDto.inspectionDetail
          for (let i = 0; i < dataList.length; i++) {
            dataList[i].qty = dataList[i].qty
          }
        }
      })
    },
    // 表单提交
    dataFormSubmit (id, type) {
      this.$refs['dataForm'].validate(valid => {
        if (valid) {
          this.$http({
            url: this.$http.adornUrl('prod/prodbasic/update'),
            method: 'put',
            data: {
              prodId: id,
              type: type,
              prodSupportEntity: this.dataForm
            }
          }).then(({ data }) => {
            if (data && data.code === 0) {
              this.$notify({
                type: 'success',
                title: '提示',
                message: '操作成功',
                duration: 3000
              })
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
        }
      })
    },
    // 确认质检
    commit: _.debounce(
      async function commit () {
        this.$refs['dataForm'].validate(valid => {
          if (valid) {
            if (this.storageList) {
              for (let i = 0; i < this.storageList.length; i++) {
                if (
                  !/^[1-9]\d*$/.test(this.storageList[i].qty) &&
                  this.storageList[i].qty != null
                ) {
                  this.$notify.error({
                    title: '错误',
                    message: '检验数量请输入正整数',
                    duration: 5000
                  })
                  return
                }
                if (this.storageList[i].qty < 0) {
                  this.$notify.error({
                    title: '错误',
                    message: '检验数量请输入正整数',
                    duration: 5000
                  })
                  return
                }
                if (this.storageList[i].defectiveQty < 0) {
                  this.$notify.error({
                    title: '错误',
                    message: '不合格数量请输入大于或等于0的整数',
                    duration: 5000
                  })
                  return
                }
                if (
                  Number(this.storageList[i].qty) <
                  Number(this.storageList[i].defectiveQty)
                ) {
                  this.$notify.error({
                    title: '错误',
                    message: '不合格数量应小于检验数量',
                    duration: 5000
                  })
                  return
                }
              }
              this.control = false
              this.dataListLoading = true
              this.$http({
                url: this.$http.adornUrl('qc/qcinspection/saveandconfirm'),
                method: 'post',
                data: this.dataForm
              }).then(({ data }) => {
                if (data && data.code === 0) {
                  if (!this.dataForm.id) {
                    this.$notify({
                      type: 'success',
                      title: '提示',
                      message: `采购质检[单号：${
                        data.entity.code
                        }]保存并确认成功，可在采购质检列表进行查看。`,
                      duration: 5000
                    })
                  } else {
                    this.$notify({
                      type: 'success',
                      title: '提示',
                      message: `${
                        !this.dataForm.id ? '新增' : '修改'
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
      },
      1000,
      {
        leading: true,
        trailing: false
      }
    ),
    // 保存
    save: _.debounce(
      async function save () {
        this.$refs['dataForm'].validate(valid => {
          if (valid) {
            if (this.dataForm.inspectionDetail) {
              for (let i = 0; i < this.dataForm.inspectionDetail.length; i++) {
                if (
                  !/^[1-9]\d*$/.test(this.dataForm.inspectionDetail[i].qty) &&
                  this.dataForm.inspectionDetail[i].qty != null
                ) {
                  this.$notify.error({
                    title: '错误',
                    message: '检验数量请输入正整数',
                    duration: 5000
                  })
                  return
                }
                if (Number(this.dataForm.inspectionDetail[i].qty) < 0) {
                  this.$notify.error({
                    title: '错误',
                    message: '检验数量请输入正整数',
                    duration: 5000
                  })
                  return
                }
                if (
                  Number(this.dataForm.inspectionDetail[i].defectiveQty) < 0
                ) {
                  this.$notify.error({
                    title: '错误',
                    message: '不合格数量请输入大于或等于0的整数',
                    duration: 5000
                  })
                  return
                }

                if (
                  Number(this.dataForm.inspectionDetail[i].qty) <
                  Number(this.dataForm.inspectionDetail[i].defectiveQty)
                ) {
                  this.$notify.error({
                    title: '错误',
                    message: '不合格数量应小于检验数量',
                    duration: 5000
                  })
                  return
                }
              }
              this.$http({
                url: this.$http.adornUrl(`qc/qcinspection/${this.type == 'add' ? 'save' : 'update'}`),
                method: 'post',
                data: this.$http.adornData(this.dataForm, false)
              }).then(({ data }) => {
                if (data && data.code === 0) {
                  this.$notify({
                    type: 'success',
                    title: '提示',
                    message: this.type == 'add' ? `采购质检单[单号：${
                      data.entity.code
                      }]保存成功，可在采购质检列表进行查看或编辑。` : `编号${data.entity.code}保存成功`,
                    duration: 5000
                  })
                  this.dataForm.code = data.qcInspectionCode
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
            }
          }
        })
      },
      1000,
      {
        leading: true,
        trailing: false
      }
    ),

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
          if (index === 8 || index === 7 || index === 9) {
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

    // 删除
    del (scope) {
      if (this.storageList.length == 1) {
        this.$confirm('至少存一条检验结果', {
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
          this.storageList.splice(scope.$index, 1)
        })
      }
    }
  },
  watch: {
    // 初始外部用v-model传的值
    value: {
      // 深度监听，可监听到对象、数组的变化
      handler (val, oldVal) {
        this.dataForm = this.value
        this.$emit('change', this.dataForm)
      },
      deep: true
    },

    // 当前组件变动后，抛出事件
    dataForm: {
      // 深度监听，可监听到对象、数组的变化
      handler (val, oldVal) {
        this.$emit('input', this.dataForm) // 用于出发v-model原始事件，避免父级其他监听
      },
      deep: true
    },
    storageList: {
      handler (val, oldVal) {
        for (let i = 0; i < val.length; i++) {
          if (val[i].defectiveQty == 0) {
            val[i].qualifiedQty = val[i].qty
          } else {
            val[i].qualifiedQty =
              Number(val[i].qty) - Number(val[i].defectiveQty)
          }
          // 不合格数为0，则不合格率为0
          if (val[i].defectiveQty == 0) {
            val[i].defectiveRate = 0
          } else {
            let num = (Number(val[i].defectiveQty) / Number(val[i].qty)) * 100
            val[i].defectiveRate = Math.round(num * 100) / 100
          }
        }
      },
      deep: true
    }
  }
}
</script>
