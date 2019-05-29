<template>
  <el-dialog :title="title"
             :close-on-click-modal="false"
             :visible.sync="visible"
             @close="$refs['dataForm'].resetFields()"
             width="90%">
    <div>
      <el-form :model="dataForm"
               ref="dataForm"
               label-width="110px"
               :rules="dataRule">
        <!-- 基本信息 -->
        <el-row>
          <el-col :span="6">
            <el-form-item label="入库单号"
                          prop="code">
              <el-input v-model="dataForm.code"
                        disabled></el-input>
            </el-form-item>
            <el-form-item label="仓管员"
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
            <el-form-item label="仓库"
                          prop="warehouseId">
              <select-all v-model="dataForm.warehouseId"
                          :listDataOption="warehouseIdOption"
                          :isDisabled="isDisabled"
                          data-value="id"
                          data-label="name"></select-all>
            </el-form-item>
            <el-form-item label="入库日期"
                          prop="date">
              <el-date-picker v-model="dataForm.date"
                              type="date"
                              @change="formatTime"
                              value-format="yyyy-MM-dd"
                              :disabled="isDisabled"></el-date-picker>
            </el-form-item>

          </el-col>
          <el-col :span="6">
            <el-form-item label="供应商名称"
                          prop="supplierName">
              <el-input v-model="dataForm.supplierName"
                        disabled></el-input>
            </el-form-item>
            <el-form-item label="入库公司"
                          prop="compId">
              <select-seach @change="compNameChange"
                            :isDisabled="true"
                            v-model="dataForm.compId"
                            httpUrl="/sys/organization/select"
                            httpMethod="get"
                            requestParamsKey="orgId"
                            data-label="name"
                            data-value="orgId"
                            data-source="companyList"
                            :listDataOptionStatic="compOptions"></select-seach>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="单据状态"
                          prop="status">
              <select-all v-model="dataForm.status"
                          :listDataOption="dictDocStatusOptions"
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
      </el-form>
      <!-- 入库明细 -->
      <el-form :inline="true"
               :model="dataForm"
               label-width="110px">
        <el-table :data="dataForm.poInstockDetail"
                  stripe
                  border
                  max-height="400"
                  highlight-current-row
                  show-summary
                  :summary-method="getSummaries"
                  v-loading="dataListLoading">
          <el-table-column prop="prodCode"
                           label="产品编码"></el-table-column>
          <el-table-column prop="imageId"
                           label="产品图片"
                           width="120">
            <template slot-scope="scope">
              <tableImg :imageUrl='scope.row.imageUrl'></tableImg>
            </template>
          </el-table-column>
          <el-table-column prop="prodName"
                           label="产品名称"></el-table-column>
          <el-table-column prop="qty"
                           label="本次入库数量">
            <template slot-scope="scope">
              <el-form-item :prop="'poInstockDetail[' + scope.$index + '].qty'"
                            :rules="dataRule.qty"
                            label-width="0px">
                <el-input v-model="scope.row.qty"
                          :disabled="isDisabled"
                          type="Number"
                          @mousewheel.native.prevent></el-input>
              </el-form-item>
            </template>
          </el-table-column>
          <el-table-column prop="inventoryStatus"
                           label="库存状态">
            <template slot-scope="scope">
              <el-form-item label-width="0px">
                <select-all v-model="scope.row.inventoryStatus"
                            :listDataOption="inventoryStatus"
                            :isDisabled="isDisabled"
                            data-value="key"
                            data-label="value"></select-all>
              </el-form-item>
            </template>
          </el-table-column>
          <el-table-column label="备注"
                           prop="remark">
            <template slot-scope="scope">
              <textarea-all v-model="scope.row.remark"
                            :disabled="isDisabled"></textarea-all>
            </template>
          </el-table-column>
          <el-table-column prop="poCode"
                           label="采购订单号"></el-table-column>
          <el-table-column type="index"
                           label="操作"
                           fixed="right"
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
                     :loading="getData"
                     :disabled="controlDisabled"><i class="iconfont erp-icon-baocun"></i>保存</el-button>
          <el-button type="primary"
                     @click="commit()"
                     v-if="isShow"
                     :disabled="controlDisabled"><i class="iconfont erp-icon-queding"></i>确认入库</el-button>
        </el-row>
      </el-form>
    </div>
  </el-dialog>
</template>
<script>
import selectSeach from '@/components/erp-select/select-seach'
import selectAll from '@/components/erp-select/select-all'
import { dateFormatter } from '@/utils/index.js'
// 引入图片
import tableImg from '@/components/list-table/table-img'
// 备注组件
import textareaAll from '@/components/erp-input/textarea-all'
import _ from 'lodash'
export default {
  components: {
    selectSeach,
    selectAll,
    tableImg,
    textareaAll
  },
  name: 'storageEditor',
  props: ['value'], // 接受外部v-model传入的值
  data () {
    return {
      title: '',
      isShow: true,
      getData: false,
      isDisabled: false,
      controlDisabled: false,
      dataListLoading: false,
      isInventoryStatus: false,
      visible: false,
      warehouseIdOption: [], // 仓库
      type: '',
      remarks: '',
      inputNum: '', // 本次入库数量
      compId: [], // 入库公司
      compOptions: [],
      index: '',
      // 仓管员
      userOptions: [],
      // 基本信息
      dataForm: {
        status: '01',
        code: '',
        warehouseId: '',
        warehouseName: '',
        compName: '',
        userName: '',
        date: '',
        remarks: '',
        userId: '',
        id: '',
        poInstockDetail: []
      },
      // 单据状态
      dictDocStatusOptions: [],
      inventoryStatus: [], // 库存状态
      // 入库明细
      storageList: [],
      dataRule: {
        warehouseId: [{ required: true, message: '必填项', trigger: 'blur' }],
        supplierName: [{ required: true, message: '必填项', trigger: 'blur' }],
        compId: [{ required: true, message: '必填项', trigger: 'blur' }],
        date: [{ required: true, message: '必填项', trigger: 'blur' }],
        qty: [
          { required: true, message: '正整数', trigger: 'change' },
          {
            transform: Number,
            type: 'integer',
            message: '正整数',
            trigger: 'change'
          }
        ]
      }
    }
  },
  created () {
    this.$http.get(this.$http.adornUrl('basicData/queryDataDict2List'), { params: { dataDictKey: 'APPROVAL_STATUS' } }).then(({ data }) => { this.dictDocStatusOptions = data.fontMaps })
    this.$http.get(this.$http.adornUrl('basicData/queryDataDict2List'), { params: { dataDictKey: 'WAREHOUSE_INVENTORY_STATUS' } }).then(({ data }) => { this.inventoryStatus = data.fontMaps })
  },
  methods: {
    // 搜索建议框
    querySearchAsync (queryString, cb) {
      var restaurants = this.restaurants
      clearTimeout(this.timeout)
      this.timeout = setTimeout(() => {
        // 请求
        this.$http({
          url: this.$http.adornUrl('basicData/queryAllUser'),
          method: 'get',
          params: {
            orgNameOrId: queryString
          }
        }).then(({ data }) => {
          restaurants = data.list
          cb(restaurants)
        })
      }, 500 * Math.random())
    },

    // 获取采购入库的详情
    storageDetailData () {
      this.$http.get(this.$http.adornUrl(`/warehouse/whinstockpo/info/${this.dataForm.id}`))
        .then(({ data }) => {
          if (data && data.code === 0) {
            this.dataForm = data.poInstockDto
            this.storageList = data.poInstockDto.poInstockDetail
          }
        })
    },

    compNameChange (value, num) {
      this.$http.get(this.$http.adornUrl('list/combobox/warehouse-comp'), {
        params: { compId: value }
      })
        .then(({ data }) => {
          this.warehouseIdOption = data.list
        })
      this.isCompId = false
    },

    // 初始化
    init (id, type, modules) {
      this.dataForm.id = id
      this.$nextTick(() => {
        // 判断是否存在type，如果存在就是查看，不可编辑
        if (type === 'receiveList') {
          this.dataForm.userId = sessionStorage.getItem('userId')
          this.title = '采购入库单新增'
          this.isDisabled = false
          this.isShow = true
          this.visible = true
          this.dataForm = modules
          this.dataForm.date = dateFormatter(new Date(), false)
          this.storageList = modules.poInstockDetail
          this.isInventoryStatus = true
          this.type = 'add' // 类型为新增
          this.dataForm.userId = sessionStorage.getItem('userId')
          if (this.dataForm.date == null) {
            this.dataForm.date = new Date()
          }
        }
        if (type === 'canCheck' && this.dataForm.id) {
          this.title = '采购入库单查看'
          this.initCheck(id)
        }
        if (type === 'canEdit' && this.dataForm.id) {
          this.title = '采购入库单编辑'
          this.initEdit(id)
        }
      })
    },

    // 查看
    initCheck (id) {
      this.isShow = false
      this.visible = true
      this.isDisabled = true
      this.isInventoryStatus = false
      this.type = 'search' // 类型为查看
      this.getDataList(id)
    },

    // 编辑
    initEdit (id) {
      this.getDataList(id)
      this.type = 'edior' // 类型为编辑
      this.isShow = true
      this.visible = true
      this.isDisabled = false
      this.isInventoryStatus = true
    },

    // 数据调用
    getDataList (id) {
      this.$http({
        url: this.$http.adornUrl(`warehouse/whinstockpo/info/${id}`),
        method: 'get'
      }).then(({ data }) => {
        if (data && data.code === 0) {
          this.dataForm = data.poInstockDto
          this.storageList = data.poInstockDto.poInstockDetail
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
              this.$emit('refreshDataList')
              this.visible = false
              this.$notify({
                type: 'success',
                title: '提示',
                message: '操作成功',
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
        }
      })
    },

    // 入库时间
    formatTime (time) {
      this.dataForm.date = time // date是绑定的值
    },

    // 确认入库
    commit: _.debounce(
      async function commit () {
        this.$refs['dataForm'].validate(valid => {
          if (valid) {
            this.storageList.forEach(element => {
              if (element.qty == null) {
                element.qty = 0
              }
            })
            // 判断每一行的输入本次入库数量是否大于0
            if (this.dataForm.poInstockDetail) {
              for (let i = 0; i < this.dataForm.poInstockDetail.length; i++) {
                if (
                  !/^[1-9]\d*$/.test(this.dataForm.poInstockDetail[i].qty) &&
                  this.dataForm.poInstockDetail[i].qty != null
                ) {
                  this.$notify.error({
                    title: '错误',
                    message: '本次入库数量请输入正整数',
                    duration: 5000
                  })
                  return
                } else {
                  this.controlDisabled = false
                }
              }
            }
            this.control = false
            this.dataListLoading = true
            this.$http({
              url: this.$http.adornUrl('warehouse/whinstockpo/saveandconfirm'),
              method: 'post',
              data: this.dataForm
            }).then(({ data }) => {
              if (data && data.code === 0) {
                this.$notify.success({
                  dangerouslyUseHTMLString: true,
                  title: '成功',
                  message: `采购入库单[单号：${data.entity.code}保存并确认成功]，可在采购入库列表进行查看。</br><span>${data.entity.yfCodes.length > 0 ? '成功生成采购应付单:' + data.entity.yfCodes.join('</br>') : ''}</span>`,
                  // message: `确认成功,编码为:${data.entity.code}`,
                  duration: 5000
                })
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
        })
      }, 1000, {
        leading: true,
        trailing: false
      }
    ),

    // 保存
    save: _.debounce(
      async function save () {
        this.$refs['dataForm'].validate(valid => {
          if (valid) {
            // 判断每一行的输入本次入库数量是否大于0
            if (this.dataForm.poInstockDetail) {
              for (let i = 0; i < this.dataForm.poInstockDetail.length; i++) {
                if (
                  !/^[1-9]\d*$/.test(this.dataForm.poInstockDetail[i].qty) &&
                  this.dataForm.poInstockDetail[i].qty != null
                ) {
                  this.$notify.error({
                    title: '错误',
                    message: '本次入库数量请输入正整数',
                    duration: 5000
                  })
                  return
                } else {
                  this.controlDisabled = false
                }
              }
            }
            
            // 新增页面
            this.$http({
              url: this.$http.adornUrl(`warehouse/whinstockpo/${this.type == 'add' ? 'save' : 'update'}`),
              method: 'post',
              data: this.dataForm
            }).then(({ data }) => {
              if (data && data.code === 0) {
                this.$notify({
                  type: 'success',
                  title: '提示',
                  message: this.type == 'add' ? `采购入库单[单号：${
                    data.entity.code
                    }保存成功]，可在采购入库列表进行查看或编辑。` : `编码${data.entity.code}保存成功`,
                  duration: 5000
                })
                this.dataForm.code = data.poInstockCode
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
      }, 1000, {
        leading: true,
        trailing: false
      }
    ),

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
          if (index == 3) {
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
      if (this.dataForm.poInstockDetail.length == 1) {
        this.$confirm('至少存一条入库明细', {
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
          this.dataForm.poInstockDetail.splice(scope.$index, 1)
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
    }
  }
}
</script>
