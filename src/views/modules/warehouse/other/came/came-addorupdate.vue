<template>
  <el-dialog :title="!dataForm.id ? '其他入库新增' : isClick === true ? '其他入库编辑' : '其他入库查看'"
             :close-on-click-modal="false"
             :visible.sync="visible"
             @close="$refs['dataForm'].resetFields()"
             width="90%">
    <el-form :model="dataForm"
             :rules="dataRule"
             ref="dataForm"
             label-width="110px">
      <template slot="title">
        <div class="item">基本信息:</div>
      </template>
      <el-row>
        <el-col :span="6">
          <el-form-item label="入库类型"
                        prop="dictInstockType">
            <el-select v-model="dataForm.dictInstockType"
                       placeholder="入库类型"
                       :disabled="isDisabled">
              <el-option v-for="item in dictInstockTypeOption"
                         :key="item.key"
                         :label="item.value"
                         :value="item.key"
                         :disabled="item.key === '02'"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="仓管员"
                        prop="warehouseUserId">
            <select-seach v-model="dataForm.warehouseUserId"
                          httpUrl="list/search/user"
                          httpMethod="get"
                          data-label="name"
                          data-value="id"
                          data-source="list"
                          :isDisabled="isDisabled"></select-seach>
          </el-form-item>
          <el-form-item label="库存公司"
                        prop="compId">
            <select-all v-model="dataForm.compId"
                        :listDataOption='compIdOption'
                        dataValue='orgId'
                        dataLabel='name'
                        :isDisabled="isDisabled"
                        :isSelectChange="true"
                        @selectChange="compIdChange"></select-all>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="入库单号"
                        prop="code">
            <el-input v-model="dataForm.code"
                      :disabled="true"
                      placeholder="系统自动生成"></el-input>
          </el-form-item>
          <el-form-item label="入库日期"
                        prop="instockDate">
            <el-date-picker v-model="dataForm.instockDate"
                            type="date"
                            value-format="yyyy-MM-dd"
                            :disabled="isDisabled"></el-date-picker>
          </el-form-item>

          <el-form-item label="仓库"
                        prop="warehouseId">
            <select-all v-model="dataForm.warehouseId"
                        :listDataOption='warehouseIdOption'
                        dataValue='id'
                        :isDisabled="isDisabled"
                        dataLabel='name'></select-all>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="供应商名称"
                        prop="supplierId">
            <select-seach v-model="dataForm.supplierId"
                          httpUrl="basic/basicsupplier/list-used?b_used=true"
                          httpMethod="get"
                          data-label="name"
                          data-value="id"
                          data-source="list"
                          :isDisabled="isDisabled"></select-seach>
          </el-form-item>
          <el-form-item label="采购订单号"
                        prop="purCode">
            <el-input v-model="dataForm.purCode"
                      :disabled="isDisabled"></el-input>
          </el-form-item>

        </el-col>
        <el-col :span="6">
          <el-form-item label="单据状态"
                        prop="dictDocStatus">
            <el-select v-model="dataForm.dictDocStatus"
                       :disabled="true">
              <el-option v-for="item in dictDocStatusOption"
                         :key="item.key"
                         :label="item.value"
                         :value="item.key"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="备注"
                        prop="remark">
            <textarea-all v-model="dataForm.remark"
                          :disabled="isDisabled"></textarea-all>
          </el-form-item>
        </el-col>
      </el-row>
      <!-- ============================== 其他入库明细 ============================== -->
      <el-button v-if="isClick"
                 type="text"
                 class="mb-10"
                 :disabled="isDisabled"
                 @click="addHandle()"><i class="iconfont erp-icon-tianjiamingxi"></i>添加明细行</el-button>
      <el-table :data="dataForm.whInstockDetail"
                stripe
                border
                max-height="400"
                highlight-current-row
                v-loading="dataListLoading"
                @selection-change="selectionChangeHandle"
                show-summary
                :summary-method="getSummaries">
        <el-table-column prop="imageUrl"
                         label="产品图片">
          <template slot-scope="scope">
            <tableImg :imageUrl='scope.row.imageUrl'></tableImg>
          </template>
        </el-table-column>
        <el-table-column prop="prodCode"
                         label="产品编码"></el-table-column>
        <el-table-column prop="prodName"
                         label="产品名称"></el-table-column>
        <el-table-column prop="specifications"
                         label="规格型号"></el-table-column>
        <el-table-column prop="unitName"
                         label="单位"></el-table-column>
        <el-table-column prop="inQty"
                         label="入库数量">
          <template slot-scope="scope">
            <el-form-item :prop="'whInstockDetail[' + scope.$index + '].inQty'"
                          :rules="dataRule.isNatural"
                          label-width="0px">
              <el-input v-model="scope.row.inQty"
                        type="Number"
                        @mousewheel.native.prevent
                        :disabled="isDisabled"
                        placeholder="入库数量"></el-input>
            </el-form-item>
          </template>
        </el-table-column>
        <el-table-column prop="dictInventoryStatus"
                         label="库存状态">
          <template slot-scope="scope">
            <el-form-item label-width="0px">
              <el-select v-model="scope.row.dictInventoryStatus"
                         :disabled="isDisabled"
                         placeholder="库存状态">
                <el-option v-for="item in dictInventoryStatusOption"
                           :key="item.key"
                           :label="item.value"
                           :value="item.key"></el-option>
              </el-select>
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
        <el-table-column fixed="right"
                         width="80"
                         label="操作"
                         v-if="isClick">
          <template slot-scope="scope">
            <el-button type="danger"
                       size="small"
                       title="删除"
                       circle
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
      <el-button v-if="isClick && isAuth('warehouse:whinstock:update')"
                 type="primary"
                 @click="dataFormSubmit()"><i class="iconfont erp-icon-baocun"></i>保存</el-button>
      <el-button v-if="isAuth('warehouse:whinstock:saveandconfirm') && isClick"
                 type="primary"
                 @click="comeConfirm()"><i class="iconfont erp-icon-queding"></i>确认入库</el-button>
    </span>
    <!-- 添加明细 -->
    <add-details ref="addDetails"
                 @addDetailsList="addList"></add-details>
    <!-- 历史采购记录 -->
  </el-dialog>
</template>
<script>
import selectSeach from '@/components/erp-select/select-seach'
import selectAll from '@/components/erp-select/select-all'
// 引入图片
import tableImg from '@/components/list-table/table-img'
// 添加明细（新组件）
import addDetails from '@/components/add-details/prod-detail.vue'
// 备注
import textareaAll from '@/components/erp-input/textarea-all.vue'
export default {
  components: {
    selectSeach,
    selectAll,
    tableImg,
    addDetails,
    textareaAll
  },
  data () {
    return {
      visible: false,
      isDisabled: false,
      isClick: true,
      type: '',
      dataForm: {
        id: '',
        dictInstockType: '',
        warehouseUserId: '',
        remark: '',
        code: '',
        instockDate: '',
        compId: '',
        warehouseId: '',
        supplierId: '',
        purCode: '',
        dictDocStatus: '01',

        whInstockDetail: []
      },
      // 入库类型
      dictInstockTypeOption: [],
      // 公司
      compIdOption: [],
      // 仓库
      warehouseIdOption: [],
      // 单据状态
      dictDocStatusOption: [],
      // 库存状态
      dictInventoryStatusOption: [],

      // 多选
      dataListSelections: [],
      dataListLoading: false,
      dataRule: {
        dictInstockType: [
          { required: true, message: '入库类型不能为空', trigger: 'change' }
        ],
        remark: [
          { required: true, message: '备注不能为空', trigger: 'change' }
        ],
        compId: [
          { required: true, message: '公司不能为空', trigger: 'change' }
        ],
        instockDate: [
          { required: true, message: '入库日期不能为空', trigger: 'change' }
        ],
        warehouseId: [
          { required: true, message: '仓库不能为空', trigger: 'change' }
        ],
        isNatural: [
          { required: true, message: '必填项', trigger: 'blur' },
          { pattern: /^[1-9]\d*$/, message: '大于零的整数', trigger: 'change' }
        ]
      }
    }
  },
  created () {
    // 出库类型
    this.$http
      .get(this.$http.adornUrl('basicData/queryDataDict2List'), {
        params: { dataDictKey: 'INSTOCK_TYPE' }
      })
      .then(({ data }) => {
        this.dictInstockTypeOption = data.fontMaps
      })
    // 公司
    this.$http
      .get(this.$http.adornUrl('sys/organization/select'))
      .then(({ data }) => {
        this.compIdOption = data.companyList
      })
    // 单据状态
    this.$http
      .get(this.$http.adornUrl('basicData/queryDataDict2List'), {
        params: { dataDictKey: 'APPROVAL_STATUS' }
      })
      .then(({ data }) => {
        this.dictDocStatusOption = data.fontMaps
      })
    // 库存状态
    this.$http
      .get(this.$http.adornUrl('basicData/queryDataDict2List'), {
        params: { dataDictKey: 'WAREHOUSE_INVENTORY_STATUS' }
      })
      .then(({ data }) => {
        this.dictInventoryStatusOption = data.fontMaps
      })
  },
  methods: {
    init (id, type) {
      this.dataForm.code = ''
      this.dataForm.addTime = ''
      this.dataForm.addUser = ''
      this.dataForm.addUserName = ''
      this.dataForm.updTime = ''
      this.dataForm.updUser = ''
      this.dataForm.confirmTime = ''
      this.dataForm.confirmUser = ''
      this.dataForm.confirmUserName = ''
      this.visible = true
      this.dataForm.warehouseUserId = sessionStorage.getItem('userId')
      this.dataForm.id = id
      this.type = type
      this.dataForm.whInstockDetail = []
      this.add(id, type)
      this.editorCheck(id, type)
      // this.$nextTick(() => {
      //   // table采购订单号==>采购订单编辑=>查看
      //   if (type === 'receiveList') {
      //     this.dataForm = parentData
      //     this.isDisabled = false
      //     return
      //   }
      //   if (type === 'isDisabled') {
      //     this.isDisabled = true
      //     this.isClick = false
      //   } else {
      //     // 新增
      //     this.isDisabled = false
      //     this.isClick = true
      //     // 默认公司
      //     this.dataForm.compId = sessionStorage.getItem('orgId')
      //     this.$nextTick(() => {
      //       this.compIdChange(this.dataForm.compId)
      //     })
      //   }
      // })
      this.$nextTick(() => {
        if (this.dataForm.id) {
          this.$http({
            url: this.$http.adornUrl(
              `warehouse/whinstock/info/${this.dataForm.id}`
            ),
            method: 'get',
            params: this.$http.adornParams()
          }).then(({ data }) => {
            if (data && data.code === 0) {
              this.compIdChange(data.whInstockDto.compId)
              this.dataForm = data.whInstockDto
            }
          })
        }
      })
    },
    // 新增
    add (id, type) {
      if (!this.dataForm.id) {
        // 新增
        this.isDisabled = false
        this.isClick = true
        // 默认公司
        this.dataForm.compId = sessionStorage.getItem('orgId')
        this.$nextTick(() => {
          this.compIdChange(this.dataForm.compId)
        })
      }
    },
    // 编辑或者查看
    editorCheck (id, type) {
      if (this.dataForm.id && type === 'isDisabled') {
        this.isDisabled = true
        this.isClick = false
      } else if (this.dataForm.id && !type) {
        this.isDisabled = false
        this.isClick = true
      }
      // this.dataCallInfo(this.dataForm.id)
    },
    // dataCallInfo (id) {
    //   this.$http({
    //     url: this.$http.adornUrl(
    //       `warehouse/whinstock/info/${id}`
    //     ),
    //     method: 'get',
    //     params: this.$http.adornParams()
    //   }).then(({ data }) => {
    //     if (data && data.code === 0) {
    //       this.compIdChange(data.whInstockDto.compId)
    //       this.dataForm = data.whInstockDto
    //     }
    //   })
    // },
    // 选择公司触发
    compIdChange (value) {
      this.dataForm.warehouseId = ''
      // 仓库
      this.$http
        .get(this.$http.adornUrl('list/combobox/warehouse-comp'), {
          params: { compId: value }
        })
        .then(({ data }) => {
          this.warehouseIdOption = data.list
        })
    },

    // 添加=>其他入库明细
    addHandle () {
      this.$nextTick(() => {
        this.$refs.addDetails.init(
          this.dataForm.id,
          this.dataForm.whInstockDetail
          // {warehouseId: this.dataForm.warehouseId, compId: this.dataForm.compId}
        )
      })
    },

    // 多选
    selectionChangeHandle (val) {
      this.dataListSelections = val
    },

    // 删除=>其他入库明细
    deleteHandle (scope) {
      this.dataForm.whInstockDetail.splice(scope.$index, 1)
    },

    // 子组件添加的数据
    addList (list) {
      list = list.map(item => {
        return {
          prodId: item.id,
          prodName: item.nameCh,
          imageUrl: item.imageUrl,
          prodCode: item.prodCode,
          specifications: item.specifications,
          unitName: item.unitName,
          bNeedChecked: item.bNeedChecked,
          price: item.price,
          taxRate: item.taxRate,
          qty: item.qty
        }
      })
      for (const data of list) {
        let isFind = false
        for (const item of this.dataForm.whInstockDetail) {
          if (data.prodId === item.prodId) {
            isFind = true
            break
          }
        }
        if (!isFind) {
          this.dataForm.whInstockDetail.push(data)
        }
      }
    },

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
          if (column.property === 'inQty') {
            sums[index] += ''
            // this.dataForm.subtotalAmount = sums[index]
          } else {
            sums[index] = ''
          }
        } else {
          sums[index] = ''
        }
      })
      return sums
    },

    // 保存
    dataFormSubmit: _.debounce(
      async function dataFormSubmit () {
        if (!(this.dataForm.whInstockDetail.length > 0)) {
          this.$notify.error({
            title: '错误',
            dangerouslyUseHTMLString: true,
            message: `明细不能为空`,
            duration: 5000
          })
          return
        }
        this.$refs['dataForm'].validate(valid => {
          if (valid) {
            this.$http({
              url: this.$http.adornUrl(
                `/warehouse/whinstock/${!this.dataForm.id ? 'save' : 'update'}`
              ),
              method: !this.dataForm.id ? 'post' : 'put',
              data: this.dataForm
            }).then(({ data }) => {
              if (data && data.code === 0) {
                this.$emit('refreshDataList')
                this.visible = false
                this.$notify({
                  type: 'success',
                  title: '提示',
                  dangerouslyUseHTMLString: true,
                  message: `保存成功, 编码为:${data.entity.code}`,
                  duration: 5000
                })
              } else {
                this.$notify.error({
                  title: '提示',
                  dangerouslyUseHTMLString: true,
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

    // 确认入库
    comeConfirm: _.debounce(
      async function comeConfirm () {
        if (!(this.dataForm.whInstockDetail.length > 0)) {
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
              url: this.$http.adornUrl('warehouse/whinstock/saveandconfirm'),
              method: 'post',
              data: this.dataForm
            }).then(({ data }) => {
              if (data && data.code === 0) {
                this.visible = false
                this.$emit('refreshDataList')
                this.$notify.success({
                  title: '成功',
                  dangerouslyUseHTMLString: true,
                  message: `确认入库成功, 编码为:${data.entity.code}`,
                  duration: 5000
                })
              } else {
                this.$notify.error({
                  title: '提示',
                  dangerouslyUseHTMLString: true,
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
    )
  }
}
</script>
