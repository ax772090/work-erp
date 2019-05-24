<template>
  <div>
    <el-dialog :visible.sync="visible"
               :title="!dataForm.id ? '跨公司调拨新增' : isClick === true ? '跨公司调拨编辑' : '跨公司调拨查看'"
               :close-on-click-modal="false"
               append-to-body
               width='90%'
               @close="$refs['dataForm'].resetFields()">
      <el-form :model="dataForm"
               ref='dataForm'
               label-width='110px'
               :rules="dataRule">
        <el-row>
          <el-col :span="6">
            <el-form-item label="调拨单号"
                          prop="code"
                          class="el-form-item-copy">
              <el-input v-model="dataForm.code"
                        :disabled="true"
                        placeholder="系统自动生成"></el-input>
            </el-form-item>
            <el-form-item label="调出公司"
                          prop="compId"
                          class="el-form-item-copy">
              <select-all v-model="dataForm.compId"
                          :listDataOption="fromCompIdOptions"
                          data-value="id"
                          data-label="name"
                          :isDisabled="isDisabled || isValue"
                          :isSelectChange="true"
                          @selectChange="fromCompNameChange"></select-all>
            </el-form-item>
            <el-form-item label="调出仓库"
                          prop="warehouseId"
                          class="el-form-item-copy">
              <select-all v-model="dataForm.warehouseId"
                          :listDataOption="fromWarehouseIdOptions"
                          data-value="id"
                          data-label="name"
                          :isDisabled="iscompId || isDisabled"></select-all>
            </el-form-item>
          </el-col>
          <el-col :span="6">

            <el-form-item label="调入公司"
                          prop="toCompId">
              <select-all v-model="dataForm.toCompId"
                          :listDataOption="toCompIdOptions"
                          data-value="id"
                          data-label="name"
                          :isDisabled="istocompId || isDisabled"
                          :isSelectChange="true"
                          @selectChange="toCompNameChange"></select-all>
            </el-form-item>
            <el-form-item label="调入仓库"
                          prop="toWarehouseId">
              <select-all v-model="dataForm.toWarehouseId"
                          :listDataOption="toWarehouseIdOptions"
                          data-value="id"
                          data-label="name"
                          :isDisabled="istoWarehouseId || isDisabled"></select-all>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="单据状态"
                          prop="dictDocStatus">
              <select-all v-model="dataForm.dictDocStatus"
                          :listDataOption="dictDocStatusOption"
                          data-value="key"
                          data-label="value"
                          :isDisabled="true"></select-all>
            </el-form-item>
            <el-form-item label="调拨日期"
                          prop="date">
              <el-date-picker v-model="dataForm.date"
                              type="date"
                              value-format="yyyy-MM-dd"
                              default-time=""
                              :disabled='isDisabled'>
              </el-date-picker>
            </el-form-item>

          </el-col>
          <el-col :span="6">
            <el-form-item label="仓管员"
                          prop="adminId"
                          class="el-form-item-copy">
              <select-seach :isDisabled="isDisabled"
                            v-model='dataForm.adminId'
                            httpUrl='list/search/user'
                            httpMethod='get'
                            requestParamsKey='name'
                            dataLabel='name'
                            dataValue='id'
                            dataSource='list'>
              </select-seach>
            </el-form-item>
            <el-form-item label="备注"
                          prop="remark">
              <el-input :disabled='isDisabled'
                        type='textarea'
                        :autosize='{ minRows: 1, maxRows: 3}'
                        v-model='dataForm.remark'></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-button type="text"
                     v-if="isShow"
                     @click="addPro()">
            <i class="iconfont erp-icon-tianjiamingxi"></i>添加明细行</el-button>
        </el-row>
        <el-row>
          <el-table :data='dataForm.detailList'
                    stripe
                    border
                    highlight-current-row
                    max-height="400"
                    v-loading='dataListLoading'
                    show-summary
                    :summary-method="getSummaries">
            <el-table-column prop='imageUrl'
                             label='产品图片'
                             width="120">
              <template slot-scope="scope">
                <tableImg :imageUrl='scope.row.imageUrl'></tableImg>
              </template>
            </el-table-column>
            <el-table-column prop='prodCode'
                             label='产品编码'></el-table-column>
            <el-table-column prop='prodName'
                             label='产品名称'></el-table-column>
            <el-table-column prop="specifications"
                             label="规格型号"></el-table-column>
            <el-table-column prop='warehouseName'
                             label='调出仓库'></el-table-column>
            <el-table-column prop='qty'
                             label='调出数量'>
              <template slot-scope='scope'>
                <el-form-item :prop="'detailList[' + scope.$index + '].qty'"
                              :rules='dataRule.qty'
                              label-width="0px">
                  <el-input v-model='scope.row.qty'
                            :disabled='isDisabled'
                            type="Number"
                            @mousewheel.native.prevent></el-input>
                </el-form-item>
              </template>
            </el-table-column>
            <el-table-column prop='fromInventoryStatus'
                             label='调出仓库存状态'
                             min-width='100px'>
              <template slot-scope='scope'>
                <el-form-item :prop="'detailList[' + scope.$index + '].fromInventoryStatus'"
                              :rules='dataRule.fromInventoryStatus'
                              label-width="0px">
                  <select-all v-model="scope.row.fromInventoryStatus"
                              :listDataOption="dictInventoryStatusOptions"
                              data-value="key"
                              data-label="value"
                              :isDisabled="true"></select-all>
                </el-form-item>
              </template>
            </el-table-column>
            <el-table-column prop='assembleQty'
                             label='调入数量'></el-table-column>
            <el-table-column prop='toInventoryStatus'
                             label='调入仓库存状态'
                             min-width='100px'>
              <template slot-scope='scope'>
                <el-form-item label-width="0px">
                  <select-all v-model="scope.row.toInventoryStatus"
                              :listDataOption="dictToInventoryStatusOption"
                              data-value="key"
                              data-label="value"
                              :isDisabled="isDisabled"></select-all>
                </el-form-item>
              </template>
            </el-table-column>
            <el-table-column prop='remark'
                             label='备注'>
              <template slot-scope='scope'>
                <el-form-item label-width="0px">
                  <el-input v-model='scope.row.remark'
                            :disabled='isDisabled'></el-input>
                </el-form-item>
              </template>
            </el-table-column>
            <el-table-column width='80'
                             fixed='right'
                             label='操作'>
              <template slot-scope='scope'>
                <el-button type='danger'
                           circle
                           title="删除"
                           @click='deleteHandle(scope)'
                           :disabled="isDel"><i class='iconfont erp-icon-shanchu'></i></el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-row>
      </el-form>
      <span slot="footer"
            class="dialog-footer">
        <el-button @click="visible = false"><i class="iconfont erp-icon-quxiao"></i>取消</el-button>
        <el-button type="primary"
                   @click="save()"
                   v-if="!isSave"
                   :disabled="isSave"><i class="iconfont erp-icon-baocun"></i>保存</el-button>
        <el-button type="primary"
                   @click="commit()"
                   v-if="!isCommit"
                   :disabled="isCommit"><i class="iconfont erp-icon-queding"></i>确认</el-button>
      </span>
    </el-dialog>
    <!-- 添加明细 -->
    <add-details ref="addDetails"
                 @addDetailsList="addList"></add-details>

  </div>
</template>
<script>
import { dateFormatter } from '@/utils/index.js'
import selectSeach from '@/components/erp-select/select-seach'
import selectAll from '@/components/erp-select/select-all'
// 引入图片
import tableImg from '@/components/list-table/table-img'
// 添加明细（新组件）
import addDetails from '@/components/add-details/prod-warehouse-detail'
export default {
  components: {
    selectSeach,
    selectAll,
    addDetails,
    tableImg
  },
  data () {
    var validateInteger = (rule, value, callback) => {
      let subString = rule.field.split('[')[1]
      let valueIndex = subString.split(']')[0]

      if (!/^[1-9]\d*$/.test(value) && value != null) {
        callback(new Error('输入大于0的整数'))
      } else if (value > this.dataForm.detailList[valueIndex].defalutQty) {
        callback(
          new Error(
            `最大数量为${this.dataForm.detailList[valueIndex].defalutQty}`
          )
        )
      } else {
        callback()
      }
    }
    return {
      isDisabled: false,
      isClick: false,
      isShow: true,
      dataListLoading: false, // loading加载
      visible: false,
      iscompId: false, // 调出仓库限制
      istoWarehouseId: false, // 调入仓库限制
      isValue: false, // 用来判断库存公司是否为空
      istocompId: false,
      isSave: false,
      isCommit: false,
      isDel: false,
      dateList: [],
      dataForm: {
        detailList: [],
        id: '',
        compId: '',
        toCompId: '',
        date: dateFormatter(new Date(), false),
        dictDocStatus: '01',
        warehouseId: '',
        toWarehouseId: '',
        adminId: ''
      },
      dictInventoryStatusOptions: [], // 调入仓库状态
      toWarehouseIdOptions: [], // 调入仓库
      fromWarehouseIdOptions: [], // 调出仓库
      dictToInventoryStatusOption: [],
      fromCompIdOptions: [], // 调出公司
      toCompIdOptions: [], // 调入公司
      dictDocStatusOption: [], // 单据状态
      dataRule: {
        compId: [{ required: true, message: '必填项', trigger: 'change' }], // 调出公司
        warehouseId: [
          { required: true, message: '必填项', trigger: 'change' } // 调出仓库
        ],
        toWarehouseId: [
          { required: true, message: '必填项', trigger: 'change' } // 调入仓库
        ],
        toCompId: [
          { required: true, message: '必填项', trigger: 'change' } // 调入公司
        ],
        qty: [
          { required: true, message: '必填项', trigger: 'change' },
          { validator: validateInteger, trigger: 'change' }
        ],
        fromInventoryStatus: [
          { required: true, message: '必填项', trigger: 'change' }
        ],
        date: [
          { required: true, message: '必填项', trigger: 'blur' }   // 调拨日期
        ]
      }
    }
  },
  methods: {
    // 选择调出公司触发
    fromCompNameChange (value) {
      if (!value) {
        this.iscompId = true
      } else {
        this.iscompId = false
        this.toCompIdOptions.forEach(item => {
          (item.id === this.dataForm.compId) ? item.disabled = true : item.disabled = false
        })
        if (value === this.dataForm.toCompId) {
          this.dataForm.toCompId = ''
        }
      }
      this.dataForm.warehouseId = ''
      this.$http
        .get(this.$http.adornUrl('list/combobox/warehouse-comp'), {
          params: { compId: value }
        })
        .then(({ data }) => {
          this.fromWarehouseIdOptions = data.list
        })
    },
    // 选择调入公司触发
    toCompNameChange (value) {
      if (!value) {
        this.istoWarehouseId = true
      } else {
        this.istoWarehouseId = false
      }
      this.dataForm.toWarehouseId = ''
      this.$http
        .get(this.$http.adornUrl('list/combobox/warehouse-comp'), {
          params: { compId: value }
        })
        .then(({ data }) => {
          this.toWarehouseIdOptions = data.list
        })
    },
    getDataUrl () {
      // 单据状态
      this.$http
        .get(this.$http.adornUrl('basicData/queryDataDict2List'), {
          params: { dataDictKey: 'APPROVAL_STATUS' }
        })
        .then(({ data }) => {
          this.dictDocStatusOption = data.fontMaps
        })
      // 库存公司
      this.$http
        .get(this.$http.adornUrl('list/combobox/company'))
        .then(({ data }) => {
          this.fromCompIdOptions = data.list
          this.toCompIdOptions = data.list
        })
      // 仓库库存状态
      this.$http
        .get(this.$http.adornUrl('basicData/queryDataDict2List'), {
          params: { dataDictKey: 'WAREHOUSE_INVENTORY_STATUS' }
        })
        .then(({ data }) => {
          this.dictInventoryStatusOptions = data.fontMaps
          this.dictToInventoryStatusOption = data.fontMaps
        })
      // 调入仓库
      this.$http
        .get(this.$http.adornUrl('list/combobox/warehouse'))
        .then(({ data }) => {
          this.toWarehouseIdOptions = data.list
          this.fromWarehouseIdOptions = data.list
        })
    },
    // 初始化
    init (id, type) {
      this.dataForm.addTime = ''
      this.dataForm.addUser = ''
      this.dataForm.updTime = ''
      this.dataForm.updUser = ''
      this.dataForm.confirmTime = ''
      this.dataForm.confirmUser = ''
      this.dataForm.id = id
      this.dataForm.adminId = sessionStorage.getItem('userId')
      // 编辑
      if (type === 'canEdit' && this.dataForm.id) {
        this.initEdit(id)
      }
      if (type === 'canCheck' && this.dataForm.id) {
        this.initCheck(id)
      }
      // 新增
      if (type === 'canAdd') {
        this.initAdd()
      }

      this.$nextTick(() => {
        // 没有选择调出公司，则调出仓库禁用
        if (!this.dataForm.compId) {
          this.iscompId = true
        } else {
          this.iscompId = false
        }
        this.dataForm.id = id
        this.visible = true
      })
    },

    // 新增
    initAdd () {
      this.isDisabled = false
      this.isSave = false
      this.isCommit = false
      this.isValue = false
      this.isDel = false
      this.type = 'add'
      this.isShow = true
      this.dataForm.detailList = []
      this.$nextTick(() => {
        this.getDataUrl()
      })
    },
    // 编辑
    initEdit (id) {
      this.getDataList(id)
      this.isDisabled = false
      this.isClick = true
      this.type = 'editor'
      this.isSave = false
      this.isCommit = false
      this.isDel = false
      this.isShow = true
    },

    // 查看
    initCheck (id) {
      this.getDataList(id)
      this.isDisabled = true
      this.isClick = false
      this.isSave = true
      this.isCommit = true
      this.isDel = true
      this.isShow = false
    },

    // 数据调用
    getDataList (id) {
      this.$http({
        url: this.$http.adornUrl(`warehouse/whtransfercomp/info/${id}`),
        method: 'get'
      }).then(({ data }) => {
        if (data && data.code === 0) {
          this.dataForm = data.whTransferComp
          this.dateList = this.dataForm.detailList
          // 优化代码
          for (const item of this.dataForm.detailList) {
            this.$set(item, 'imageUrl', item.url)
            this.$set(item, 'prodCode', item.prodEntity.code)
            this.$set(item, 'prodName', item.prodEntity.nameCh)
            this.$set(item, 'specifications', item.prodEntity.specifications)
            this.$set(item, 'warehouseName', data.whTransferComp.warehouseEntity.name)
            this.$set(item, 'qty', item.qty)
            this.$set(item, 'dictInventoryStatus', item.fromInventoryStatus)
            this.$set(item, 'assembleQty', item.qty)
          }

          this.$nextTick(() => {
            this.getDataUrl()
          })
        } else {
          this.$notify.error({
            title: '错误',
            message: data.msg,
            duration: 3000
          })
        }
      })
    },
    // 删除
    deleteHandle (scope) {
      this.dataForm.detailList.splice(scope.$index, 1)
    },
    // 新增
    addPro () {
      this.$nextTick(() => {
        // 存在调出公司和调出仓库
        if (this.dataForm.compId && this.dataForm.warehouseId) {
          this.visible = true
          this.$refs.addDetails.init(
            this.dataForm.id,
            this.dataForm.detailList,
            {
              compId: this.dataForm.compId
                ? this.dataForm.compId
                : '',
              warehouseId: this.dataForm.warehouseId,
              status: '02'
            }
          )
        } else if (!this.dataForm.compId) {
          this.$notify.error({
            title: '错误',
            message: '调出公司不能为空',
            duration: 3000
          })
        } else if (!this.dataForm.warehouseId) {
          this.$notify.error({
            title: '错误',
            message: '调出仓库不能为空',
            duration: 3000
          })
        }
      })
    },
    // 子组件添加的数据
    addList (list) {
      list.map((item) => {
        this.$set(item, 'sellerSkuId', item.id)
      })
      // 这句是之前没有替换公共组件的代码逻辑（这里我去掉了，好像没什么用）
      // list = this.dataForm.detailList.concat(list)
      // 过滤掉相同的产品
      for (const data of list) {
        let isFind = false
        for (const item of this.dataForm.detailList) {
          if (data.id === item.id) {
            isFind = true
            break
          }
        }
        if (!isFind) {
          this.dataForm.detailList.push(data)
        }
      }
      for (let i = 0; i < this.dataForm.detailList.length; i++) {
        this.dataForm.detailList[i].assembleQty = this.dataForm.detailList[i].qty
        this.$set(
          this.dataForm.detailList[i],
          'defalutQty',
          this.dataForm.detailList[i].qty
        )
        this.$set(
          this.dataForm.detailList[i],
          'fromInventoryStatus',
          '02'
        )
      }
    },
    // 保存
    save: _.debounce(
      async function save () {
        this.$refs['dataForm'].validate(valid => {
          if (valid) {
            if (this.dataForm.detailList.length === 0) {
              this.$notify.error({
                title: '错误',
                message: '新增产品不能为空',
                duration: 5000
              })
              return
            }
            if (this.dataForm.detailList.length > 0) {
              if (this.dataForm.compId === this.dataForm.toCompId) {
                this.$notify.error({
                  title: '错误',
                  message: '跨公司调拨不允许调入和调出公司相同，请更改调入公司',
                  duration: 5000
                })
                return
              }
            }
            // 编辑保存
            // if (this.type === 'editor') {
            this.$http({
              url: this.$http.adornUrl(`warehouse/whtransfercomp/${this.type === 'editor' ? 'update' : 'save'}`),
              method: this.type == 'editor' ? 'put' : 'post',
              data: this.dataForm
            }).then(({ data }) => {
              if (data && data.code === 0) {
                this.$emit('refreshDataList')
                this.visible = false
                this.$notify({
                  title: '成功',
                  message: '保存成功',
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
          }
        })
      }, 1000, {
        leading: true,
        trailing: false
      }),

    // 确认
    commit: _.debounce(
      async function commit () {
        this.$refs['dataForm'].validate(valid => {
          if (valid) {
            if (this.dataForm.detailList.length === 0) {
              this.$notify.error({
                title: '错误',
                message: '新增产品不能为空',
                duration: 5000
              })
              return
            }
            if (this.dataForm.detailList.length > 0) {
              if (this.dataForm.compId === this.dataForm.toCompId) {
                this.$notify.error({
                  title: '错误',
                  message: '跨公司调拨不允许调入和调出公司相同，请更改调入公司',
                  duration: 5000
                })
                return
              }
            }
            this.$http({
              url: this.$http.adornUrl('warehouse/whtransfercomp/saveandconfirm'),
              method: 'post',
              data: this.dataForm
            }).then(({ data }) => {
              if (data && data.code === 0) {
                this.$emit('refreshDataList')
                this.visible = false
                this.$notify({
                  title: '成功',
                  message: '确认成功',
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
          }
        })
      }, 1000, {
        leading: true,
        trailing: false
      }),

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
          if (index === 5 || index === 7) {
            sums[index] = sums[index]
          } else {
            sums[index] = ''
          }
        } else {
          sums[index] = ''
        }
      })
      return sums
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
    'dataForm.detailList': {
      handler (val, oldVal) {
        // 没有选择调入公司则调入仓库禁用
        if (!this.dataForm.toCompId) {
          this.istoWarehouseId = true
        } else {
          this.istoWarehouseId = false
        }
        if (val.length > 0) {
          this.iscompId = true
          this.isValue = true
          for (let i = 0; i < val.length; i++) {
            val[i].assembleQty = val[i].qty
            val[i].toInventoryStatus = val[i].fromInventoryStatus
          }
        } else {
          this.iscompId = false
          this.isValue = false
        }
      },
      deep: true
    }
  }
}
</script>

