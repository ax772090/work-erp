<template>
  <div>
    <el-dialog :visible.sync="visible"
               :title="title"
               :close-on-click-modal="false"
               append-to-body
               width="90%"
               :before-close="handleClose">
      <el-form :model="dataForm"
               ref="dataForm"
               label-width="80px"
               :rules="dataRule">
        <el-row>
          <el-col :span="6">
            <el-form-item label="组装单号"
                          prop="code"
                          class="el-form-item-copy">
              <el-input v-model="dataForm.code"
                        :disabled="true"
                        placeholder="系统自动生成"></el-input>
            </el-form-item>
            <el-form-item label="库存公司"
                          prop="compId"
                          class="el-form-item-copy">
              <select-all v-model="dataForm.compId"
                          :listDataOption="compIdOptions"
                          :isDisabled="isDisabled"
                          data-value="id"
                          data-label="name"
                          :isSelectChange="true"
                          @selectChange="compNameChange"></select-all>
            </el-form-item>

          </el-col>
          <el-col :span="6">
            <el-form-item label="组装日期"
                          prop="date"
                          :disabled="isDisabled">
              <el-date-picker type="date"
                              v-model="dataForm.date"
                              value-format="yyyy-MM-dd"
                              :disabled="isDisabled"></el-date-picker>
            </el-form-item>
            <el-form-item label="仓库"
                          prop="warehouseId">
              <select-all v-model="dataForm.warehouseId"
                          :listDataOption="warehouseIdOption"
                          :isDisabled="isDisabled"
                          data-value="id"
                          data-label="name"
                          :isSelectChange="true"
                          @selectChange="warehouseChangeHandle"></select-all>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="仓管员"
                          prop="adminId"
                          class="el-form-item-copy">
              <select-seach :isDisabled="isDisabled"
                            v-model="dataForm.adminId"
                            httpUrl="/list/search/user"
                            httpMethod="get"
                            requestParamsKey="name"
                            data-label="name"
                            data-value="id"
                            data-source="list"></select-seach>
            </el-form-item>
            <el-form-item label="单据状态"
                          prop="dictDocStatus">
              <select-all v-model="dataForm.dictDocStatus"
                          :listDataOption="dictDocStatusOptions"
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
        <!-- 明细信息 -->
        <el-row>
          <el-button type="text"
                     @click="addPro()"
                     v-if='!search'><i class="iconfont erp-icon-tianjiamingxi"></i>添加明细行</el-button>
        </el-row>
        <el-table :data="dataForm.whAssembleDetailEntities"
                  stripe
                  border
                  max-height="600"
                  highlight-current-row
                  show-summary
                  :summary-method="getSummaries"
                  v-loading="dataListLoading">
          <el-table-column type="expand"
                           fixed
                           label="展开"
                           width="50">
            <template slot-scope="scope">
              <el-table stripe
                        border
                        highlight-current-row
                        :data="scope.row.tableDataExpand">
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
                <el-table-column prop="name"
                                 label="单位"></el-table-column>
                <el-table-column prop="usedQty"
                                 label="组合用量"></el-table-column>
                <el-table-column prop="qty"
                                 label="现有库存量"></el-table-column>
              </el-table>
            </template>
          </el-table-column>
          <el-table-column prop="prodUrl"
                           label="产品图片"
                           width="120">
            <template slot-scope="scope">
              <tableImg :imageUrl='scope.row.prodUrl'></tableImg>
            </template>
          </el-table-column>
          <el-table-column prop="code"
                           label="产品编码"></el-table-column>
          <el-table-column prop="customsCnName"
                           label="产品名称"></el-table-column>
          <el-table-column prop="specifications"
                           label="规格型号"></el-table-column>
          <el-table-column prop="name"
                           label="单位"></el-table-column>
          <el-table-column prop="srcDeliveryCode"
                           label="要货计划单号"></el-table-column>
          <el-table-column prop="dictInventoryStatusValue"
                           label="库存状态">
            <template slot-scope="scope">
              <el-form-item label-width="0px">
                <select-all v-model="scope.row.dictInventoryStatus"
                            :listDataOption="dictInventoryStatusOptions"
                            :isDisabled="true"
                            data-value="key"
                            data-label="value"></select-all>
              </el-form-item>
            </template>
          </el-table-column>
          <el-table-column prop="assembleQty"
                           label="组合数量">
            <template slot-scope="scope">
              <el-form-item :prop="'whAssembleDetailEntities[' + scope.$index + '].assembleQty'"
                            :rules="dataRule.assembleQty"
                            label-width="0px">
                <el-input v-model="scope.row.assembleQty"
                          type="Number"
                          @mousewheel.native.prevent
                          placeholder="组合数量"
                          :disabled="isDisabled"></el-input>
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
          <el-table-column width="80"
                           fixed="right"
                           label="操作">
            <template slot-scope="scope">
              <el-button type="danger"
                         size="small"
                         circle
                         title="删除"
                         @click="deleteHandle(scope)"
                         :disabled="isDelete">
                <i class="iconfont erp-icon-shanchu"></i>
              </el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-form>
      <span slot="footer"
            class="dialog-footer">
        <el-button @click.native="cancel('dataForm')"><i class="iconfont erp-icon-quxiao"></i>取消</el-button>
        <el-button type="primary"
                   @click="save()"
                   :disabled="controlDisabled"
                   v-if='!controlDisabled'><i class="iconfont erp-icon-baocun"></i>保存</el-button>
        <el-button type="primary"
                   @click="commit()"
                   :disabled="controlDisabled"
                   v-if='!controlDisabled'><i class="iconfont erp-icon-queding"></i>确认组合</el-button>
      </span>
    </el-dialog>
    <!-- 添加明细 -->
    <add-details ref="addDetails"
                 @addDetailsList="addList"></add-details>
  </div>
</template>
<script>
import selectSeach from '@/components/erp-select/select-seach'
import selectAll from '@/components/erp-select/select-all'
// 添加明细（新组件）
import addDetails from '@/components/add-details/prod-detail.vue'

// 表头处理
import { renderHeaderUtil } from '@/utils/index.js'
// 引入图片
import tableImg from '@/components/list-table/table-img'
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
  name: 'addOrUpdate',
  props: ['value'], // 接受外部v-model传入的值
  data () {
    var validateInteger = (rule, value, callback) => {
      let subString = rule.field.split('[')[1]
      let valueIndex = subString.split(']')[0]
      if (!/^[1-9]\d*$/.test(value) && value != null) {
        callback(new Error('正整数'))
      } else if (
        value > this.dataForm.whAssembleDetailEntities[valueIndex].maxNum
      ) {
        callback(
          new Error(
            `最大数量为${
            this.dataForm.whAssembleDetailEntities[valueIndex].maxNum
            }`
          )
        )
      } else {
        callback()
      }
    }
    return {
      title: '',
      isDelete: false,
      type: '',
      id: '',
      isClick: false,
      search: false,
      isCompId: false, // 用来判断是否有库存公司，禁用掉仓库
      isValue: false, // 用来判断库存公司是否为空
      warehouseIdOption: [], // 仓库
      compIdOptions: [], // 库存公司
      deliveryWarehouseId: '', // 保存发货仓库id
      controlDisabled: false,
      compOptions: [],
      isDisabled: false,
      isShow: true,
      dataListLoading: false, // loading加载
      visible: false,
      warehouseOption: [], // 仓库
      dateList: [], // 用来保存whAssembleDetailEntities数组
      dataForm: {
        code: '',
        compId: '',
        warehouseId: '',
        date: '',
        remark: '',
        adminId: '',
        dictDocStatus: '',
        whAssembleDetailEntities: []
      },
      dictInventoryStatusOptions: [], // 库存状态
      dictDocStatusOptions: [], // 单据状态
      dataRule: {
        compId: [
          { required: true, message: '库存公司不能为空', trigger: 'change' }
        ],
        adminId: [
          { required: true, message: '仓管员不能为空', trigger: 'change' }
        ],
        date: [
          { required: true, message: '组装日期不能为空', trigger: 'blur' }
        ],
        warehouseId: [
          { required: true, message: '仓库不能为空', trigger: 'change' }
        ],
        assembleQty: [
          { required: true, message: '正整数', trigger: 'blur' },
          {
            transform: Number,
            type: 'integer',
            message: '正整数',
            trigger: 'change'
          },
          { validator: validateInteger, trigger: 'change' }
        ]
      }
    }
  },
  created () {
    this.getDataUrl()
  },
  methods: {
    getDataUrl () {
      // 库存状态
      this.$http.get(this.$http.adornUrl('basicData/queryDataDict2List'), { params: { dataDictKey: 'WAREHOUSE_INVENTORY_STATUS' } }).then(({ data }) => {
        this.dictInventoryStatusOptions = data.fontMaps
      })
      // 库存公司
      this.$http.get(this.$http.adornUrl('list/combobox/company')).then(({ data }) => {
        this.compIdOptions = data.list
      })
      // 单据状态
      this.$http.get(this.$http.adornUrl('basicData/queryDataDict2List'), { params: { dataDictKey: 'APPROVAL_STATUS' } }).then(({ data }) => {
        this.dictDocStatusOptions = data.fontMaps
      })
    },
    // 表头内容过长处理
    renderHeader (h, g) {
      return renderHeaderUtil(h, g)
    },
    // 库存公司
    compNameChange (value, num) {
      // 判断是否要显示默认值
      if (num != 1) {
        this.dataForm.warehouseId = ''
      }
      this.$http
        .get(this.$http.adornUrl('list/combobox/warehouse-comp'), {
          params: { compId: value }
        })
        .then(({ data }) => {
          this.warehouseIdOption = data.list
        })
      this.isCompId = false
    },
    // 关闭清除本次缓存
    clearCache (formName) {
      this.$refs[formName].resetFields()
      this.dataForm.whAssembleDetailEntities = []
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
    // 初始化
    init (ids, type, deliveryWarehouseId, compId) {
      this.dataForm.addTime = ''
      this.dataForm.addUser = ''
      this.dataForm.updTime = ''
      this.dataForm.updUser = ''
      this.dataForm.confirmTime = ''
      this.dataForm.confirmUser = ''
      this.type = type
      this.dataForm.adminId = sessionStorage.getItem('userId')
      this.visible = true
      this.$nextTick(() => {
        // 从待组装清单跳转过来 => 新增
        if (type === 'inventoryAdd') {
          this.title = '产品组装新增'
          this.initInventoryAdd(ids, deliveryWarehouseId, compId)
        }
        // 查看
        if (type === 'search') {
          this.title = '产品组装单查看'
          this.initSearch(ids)
        }
        // 产品组装的新增（直接新增）
        if (type === 'add') {
          this.title = '产品组装单新增'
          this.initAdd(ids)
        }
        // 产品组装编辑
        if (type === 'editor') {
          this.title = '产品组装单编辑'
          this.initEdit(ids)
        }
      })
    },
    initAdd (ids) {
      this.isDisabled = false
      this.isDelete = false
      this.search = false
      this.dataForm.id = ids
      this.controlDisabled = false
      this.dataForm.dictDocStatus = '01'
      this.dateList = this.dataForm.whAssembleDetailEntities
      if (!this.dataForm.compId) {
        this.isCompId = true
      }
    },
    initEdit (ids) {
      this.isDelete = false
      this.isValue = true
      this.isCompId = true
      this.isDisabled = false
      this.search = false
      this.controlDisabled = false
      this.$http({
        url: this.$http.adornUrl(`warehouse/whassemble/info/${ids}`),
        method: 'get'
      }).then(({ data }) => {
        if (data && data.code === 0) {
          this.dataForm = data.whAssemble
          let dataList = this.dataForm.whAssembleDetailEntities
          for (let i = 0; i < dataList.length; i++) {
            dataList[i].tableDataExpand.forEach(item => {
              this.$set(item, 'name', item.unitName)
            })
          }
          this.$nextTick(() => {
            this.compNameChange(this.dataForm.compId, 1)
            this.isCompId = true
          })
          this.dateList = this.dataForm.whAssembleDetailEntities
        } else {
          this.$notify.error({
            title: '错误',
            message: data.msg,
            duration: 5000
          })
        }
      })
    },
    initSearch (ids) {
      this.isDisabled = true
      this.isDelete = true
      this.search = true
      this.controlDisabled = true
      this.$http({
        url: this.$http.adornUrl(`warehouse/whassemble/info/${ids}`),
        method: 'get'
      }).then(({ data }) => {
        if (data && data.code == 0) {
          this.dataForm = data.whAssemble
          let dataList = this.dataForm.whAssembleDetailEntities
          for (let i = 0; i < dataList.length; i++) {
            dataList[i].tableDataExpand.forEach(item => {
              this.$set(item, 'name', item.unitName)
            })
            this.$nextTick(() => {
              this.compNameChange(this.dataForm.compId, 1)
            })
            this.dateList = this.dataForm.whAssembleDetailEntities
          }
        } else {
          this.$notify.error({
            title: '错误',
            message: data.msg,
            duration: 5000
          })
        }
      })
    },
    initInventoryAdd (ids, deliveryWarehouseId, compId) {
      this.type = 'inventoryAdd'
      this.isDisabled = false
      this.isDisabled = false
      this.search = true
      this.controlDisabled = false
      this.dataForm.compId = compId[0]
      this.dataForm.warehouseId = deliveryWarehouseId[0]
      this.$nextTick(() => {
        this.compNameChange(this.dataForm.compId, 1)
      })
      this.isShow = false
      // 获取数据
      this.$http({
        url: this.$http.adornUrl('warehouse/whassemble/initUnite'),
        method: 'post',
        data: ids
      }).then(({ data }) => {
        if (data && data.code === 0) {
          this.dataForm.whAssembleDetailEntities = data.whAssembleDetailEntities
          // 优化之前的代码
          for (const item of this.dataForm.whAssembleDetailEntities) {
            this.expandChange(item)// 子项明细需要循环遍历生成
            this.$set(item, 'code', item.product.code)// 产品编码
            this.$set(item, 'customsCnName', item.product.nameCh)// 产品名称
            this.$set(item, 'specifications', item.product.specifications)// 规格型号
            this.$set(item, 'name', item.product.dictUnitEntity.name)// 单位
            this.dataForm.dictDocStatus = '01' // 单据状态
            this.$set(item, 'maxNum', item.assembleQty)// 组大组合数量
            this.$set(item, 'dictInventoryStatus', '02')// 库存状态
          }
          this.dateList = this.dataForm.whAssembleDetailEntities
        } else {
          this.$notify.error({
            title: '错误',
            message: data.msg,
            duration: 5000
          })
        }
      })
    },
    // 展开行明细
    async expandChange (mainData) {
      await this.$http({
        url: this.$http.adornUrl(`warehouse/whassemble/querySubInventory`),
        method: 'get',
        params: {
          prodId: mainData.prodId,
          warehouseId: this.dataForm.warehouseId || ''
        }
      }).then(({ data }) => {
        if (data && data.code === 0) {
          for (let i = 0; i < data.assembleProdEntities.length; i++) {
            this.$set(
              data.assembleProdEntities[i],
              'imageUrl',
              data.assembleProdEntities[i].url
            ) // 产品图片
            this.$set(
              data.assembleProdEntities[i],
              'name',
              data.assembleProdEntities[i].dictUnitEntity.name
            )
            // 现有库存量
            this.$set(
              data.assembleProdEntities[i],
              'qty',
              data.assembleProdEntities[i].remainQty
            )
          }
          mainData.tableDataExpand = data.assembleProdEntities
        }
      })
    },
    // 更改仓库，获取子项明细数据
    warehouseChangeHandle (val) {
      this.$http({
        url: this.$http.adornUrl('warehouse/whassemble/changeSelect'),
        method: 'post',
        data: {
          whAssembleDetailEntities: this.dataForm.whAssembleDetailEntities,
          warehouseId: val
        }
      }).then(({ data }) => {
        if (data && data.code === 0) {
          // 遍历明细，改变相应的子项
          this.dataForm.whAssembleDetailEntities = data.whAssembleDetailEntities
        }
      })
    },
    // 删除
    deleteHandle (scope) {
      if (this.type == 'inventoryAdd') {
        if (this.dataForm.whAssembleDetailEntities.length == 1) {
          this.$notify.error({
            title: '提示',
            message: `明细不能为空`,
            duration: 5000
          })
          return
        }
      }
      this.$confirm('确认要删除此行吗？', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.dataForm.whAssembleDetailEntities.splice(scope.$index, 1)
      })
    },
    // 新增
    addPro () {
      this.$nextTick(() => {
        this.visible = true
        if (this.dataForm.warehouseId && this.dataForm.compId) {
          this.$refs.addDetails.init(
            this.dataForm.id,
            this.dataForm.whAssembleDetailEntities,
            { bAssemble: true }
          )
        } else if (!this.dataForm.compId) {
          this.$notify.error({
            title: '提示',
            message: `库存公司不能为空`,
            duration: 5000
          })
        } else if (!this.dataForm.warehouseId) {
          this.$notify.error({
            title: '提示',
            message: `仓库不能为空`,
            duration: 5000
          })
        }
      })
    },
    // 子组件添加的数据
    async addList (list) {
      list.forEach((item) => {
        this.$set(item, 'warehouseId', this.dataForm.warehouseId)
      })
      let obj = {}
      await this.$http({
        url: this.$http.adornUrl('warehouse/whassemble/addProdConfirm'),
        method: 'post',
        data: Object.assign({}, list)
      }).then(({ data }) => {
        if (data && data.code === 0) {
          for (let i = 0; i < data.whAssembleDetailEntities.length; i++) {
            this.$set(
              data.whAssembleDetailEntities[i],
              'prodId',
              data.whAssembleDetailEntities[i].id
            )
          }
          obj = data
        } else {
          this.$notify.error({
            title: '错误',
            message: data.msg,
            duration: 5000
          })
        }
      })
      // 优化代码
      for (const item of obj.whAssembleDetailEntities) {
        for (const item1 of item.subProd) {
          this.$set(item1, 'name', item1.unitName)
        }
        this.$set(item, 'tableDataExpand', item.subProd)
        this.$set(item, 'code', item.prodCode)
        this.$set(item, 'customsCnName', item.nameCh)
        this.$set(item, 'specifications', item.specifications)
        this.$set(item, 'prodUrl', item.imageUrl)
        this.$set(item, 'name', item.unitName)
        this.$set(item, 'dictInventoryStatus', '02')
      }
      for (const data of obj.whAssembleDetailEntities) {
        let isFind = false
        for (const item of this.dataForm.whAssembleDetailEntities) {
          if (data.id === item.id) {
            isFind = true
            break
          }
        }
        if (!isFind) {
          this.dataForm.whAssembleDetailEntities.push(data)
        }
      }
    },
    // 保存
    save: _.debounce(
      async function save () {
        this.$refs['dataForm'].validate(valid => {
          if (valid) {
            if (this.dataForm.whAssembleDetailEntities.length == 0) {
              this.$notify.error({
                title: '提示',
                message: '明细不能为空，请添加产品',
                duration: 5000
              })
            } else {
              for (
                let i = 0;
                i < this.dataForm.whAssembleDetailEntities.length;
                i++
              ) {
                if (this.type == 'add') {
                  delete this.dataForm.whAssembleDetailEntities[i].id
                }
              }
              this.$http({
                url: this.$http.adornUrl(`warehouse/whassemble/${this.type === 'editor' ? 'update' : 'save'}`),
                method: this.type == 'editor' ? 'put' : 'post',
                data: this.dataForm
              }).then(({ data }) => {
                if (data && data.code === 0) {
                  if (this.type === 'add') {
                    this.dataForm.code = data.entity.id
                  }
                  this.$emit('refreshDataList')
                  this.visible = false
                  this.clearCache('dataForm')
                  this.$notify.success({
                    type: 'success',
                    title: '提示',
                    message: '保存成功',
                    duration: 5000
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
          if (index == 8) {
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

    // 确认组合
    commit: _.debounce(
      async function commit () {
        this.$refs['dataForm'].validate(valid => {
          if (valid) {
            if (this.dataForm.whAssembleDetailEntities.length == 0) {
              this.$notify.error({
                title: '错误',
                message: '明细不能为空，请添加产品',
                duration: 3000
              })
            } else {
              for (
                let i = 0;
                i < this.dataForm.whAssembleDetailEntities.length;
                i++
              ) {
                if (this.type == 'add') {
                  delete this.dataForm.whAssembleDetailEntities[i].id
                }
                if (
                  this.dataForm.whAssembleDetailEntities[i].assembleQty == 0
                ) {
                  this.$notify.error({
                    title: '错误',
                    message: '您输入的组合数量应大于0',
                    duration: 1500
                  })
                  this.controlDisabled = true
                  return
                } else if (
                  !this.dataForm.whAssembleDetailEntities[i].assembleQty
                ) {
                  this.$notify.error({
                    title: '错误',
                    message: '请输入组合数量',
                    duration: 1500
                  })
                  this.controlDisabled = true
                  return
                }
              }
              this.$http({
                url: this.$http.adornUrl('warehouse/whassemble/saveandconfirm'),
                method: 'post',
                data: this.dataForm
              }).then(({ data }) => {
                if (data && data.code === 0) {
                  this.$emit('refreshDataList')
                  this.visible = false
                  this.$notify.success({
                    title: '成功',
                    message: '确认成功',
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
          }
        })
      },
      1000,
      {
        leading: true,
        trailing: false
      }
    )
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
    dateList: {
      handler (val, oldVal) {
        if (val.length > 0) {
          this.isCompId = true
          this.isValue = true
        } else {
          this.isCompId = false
          this.isValue = false
        }
      },
      deep: true
    }
  }
}
</script>
