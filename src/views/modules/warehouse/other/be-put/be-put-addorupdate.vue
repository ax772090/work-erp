<template>
  <el-dialog :title="!dataForm.id ? '其他出库新增' : isClick === true ? '其他出库编辑' : '其他出库查看'"
             :close-on-click-modal="false"
             :visible.sync="visible"
             @close="$refs['dataForm'].resetFields()"
             width='90%'>
    <el-form :model="dataForm"
             :rules="dataRule"
             ref="dataForm"
             label-width="110px">
      <el-row>
        <el-col :span="6">
          <el-form-item label="出库单号"
                        prop="code">
            <el-input v-model="dataForm.code"
                      :disabled='true'
                      placeholder="系统自动生成"></el-input>
          </el-form-item>
          <el-form-item label="仓管员"
                        prop="warehouseUserId">
            <select-seach v-model='dataForm.warehouseUserId'
                          httpUrl='list/search/user'
                          httpMethod='get'
                          dataLabel='name'
                          dataValue='id'
                          dataSource='list'
                          :isDisabled='isDisabled'></select-seach>
          </el-form-item>
          <el-form-item label="出库原因"
                        prop="reason">
            <textarea-all :disabled='isDisabled'
                          v-model="dataForm.reason"></textarea-all>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="出库日期"
                        prop="outstockDate">
            <el-date-picker v-model="dataForm.outstockDate"
                            type="date"
                            value-format="yyyy-MM-dd"
                            :disabled='isDisabled'>
            </el-date-picker>
          </el-form-item>
          <el-form-item label="库存公司"
                        prop="compId">
            <select-all v-model="dataForm.compId"
                        :listDataOption="compIdOption"
                        data-value="orgId"
                        data-label="name"
                        :isDisabled="isDisabled || isDisableFromAdd"
                        :isSelectChange="true"
                        @selectChange="compIdChange"></select-all>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="部门"
                        prop="deptId">
            <el-cascader v-model="deptId"
                         :options="deptIdOption"
                         :props="{value: 'orgId', label: 'name', children: 'subOrgList'}"
                         @change="departChange"
                         change-on-select
                         :disabled='isDisabled'
                         clearable
                         filterable></el-cascader>
          </el-form-item>
          <el-form-item label="仓库"
                        prop="warehouseId">
            <select-all v-model="dataForm.warehouseId"
                        :listDataOption="warehouseIdOption"
                        data-value="id"
                        :isDisabled="isDisabled || isDisableFromAdd"
                        data-label="name"></select-all>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="单据状态"
                        prop="dictDocStatus">
            <select-all v-model="dataForm.dictDocStatus"
                        :listDataOption="dictDocStatusOption"
                        :isDisabled="true"
                        data-value="key"
                        data-label="value"></select-all>
          </el-form-item>
          <el-form-item label="出库类型"
                        prop="dictOutstockType">
            <select-all v-model="dataForm.dictOutstockType"
                        :listDataOption="dictOutstockTypeOption"
                        data-value="key"
                        :isDisabled="true"
                        data-label="value"></select-all>
          </el-form-item>
        </el-col>
      </el-row>

      <!-- ============================== 其他出库明细 ============================== -->
      <el-button type="text"
                 v-if='isClick'
                 :disabled='isDisabled'
                 @click="addHandle()">
        <i class="iconfont erp-icon-tianjiamingxi"></i>添加明细行</el-button>
      <el-table :data="dataForm.whOutstockDetail"
                stripe
                border
                highlight-current-row
                max-height="400"
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
        <el-table-column prop="dictInventoryStatusName"
                         label="库存状态"></el-table-column>
        <el-table-column prop="outQty"
                         label="出库数量">
          <template slot-scope="scope">
            <el-form-item :prop="'whOutstockDetail.' + scope.$index + '.outQty'"
                          :rules='dataRule.isNatural'
                          label-width="0px">
              <el-input v-model="scope.row.outQty"
                        type="Number"
                        @mousewheel.native.prevent
                        :disabled='isDisabled'
                        placeholder="出库数量"></el-input>
            </el-form-item>
          </template>
        </el-table-column>
        <el-table-column prop="remark"
                         label="备注">
          <template slot-scope="scope">
            <textarea-all v-model="scope.row.remark"
                          :disabled='isDisabled'></textarea-all>
          </template>
        </el-table-column>
        <el-table-column fixed="right"
                         width="80"
                         label="操作"
                         v-if='isClick'>
          <template slot-scope="scope">
            <el-button type="danger"
                       size="small"
                       title="删除"
                       circle
                       @click="deleteHandle(scope)"
                       :disabled='isDisabled'><i class="iconfont erp-icon-shanchu"></i></el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-form>
    <span slot="footer">
      <el-button @click="visible = false"><i class="iconfont erp-icon-quxiao"></i>取消</el-button>
      <el-button type="primary"
                 v-if="(isAuth('warehouse:whoutstock:save') || isAuth('warehouse:whoutstock:update')) && isClick"
                 @click="dataFormSubmit()"><i class="iconfont erp-icon-baocun"></i>保存</el-button>
      <el-button type="primary"
                 v-if="isAuth('warehouse:whoutstock:saveandconfirm') && isClick"
                 @click="confirmOrder()"><i class="iconfont erp-icon-queding"></i>确认出库</el-button>
    </span>
    <!-- 添加明细 -->
    <add-details ref="addDetails"
                 @addDetailsList="addList"></add-details>
  </el-dialog>
</template>
<script>
import selectSeach from '@/components/erp-select/select-seach'
import selectAll from '@/components/erp-select/select-all'
// 引入图片
import tableImg from '@/components/list-table/table-img'
// 添加明细（新组件）
import addDetails from '@/components/add-details/prod-warehouse-detail'
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
    return {
      isDisableFromAdd: false,
      deptId: [], // 部门数组
      visible: false,
      isDisabled: false,
      isClick: true,
      type: '',
      dataForm: {
        id: '',
        code: '',
        warehouseUserId: '',
        outstockDate: '',
        warehouseId: '',
        compId: '',
        deptId: '',
        reason: '',
        dictDocStatus: '01',
        dictOutstockType: '01',

        whOutstockDetail: []
      },
      // 仓库
      warehouseIdOption: [],
      // 公司
      compIdOption: [],
      // 部门
      deptIdOption: [],
      // 单据状态
      dictDocStatusOption: [],
      // 出库类型
      dictOutstockTypeOption: [],

      // 多选
      dataListSelections: [],
      dataListLoading: false,

      dataRule: {
        compId: [
          { required: true, message: '公司不能为空', trigger: 'change' }
        ],
        outstockDate: [
          { required: true, message: '出库日期不能为空', trigger: 'change' }
        ],
        warehouseId: [
          { required: true, message: '仓库不能为空', trigger: 'change' }
        ],
        reason: [
          { required: true, message: '出库原因不能为空', trigger: 'change' }
        ],
        dictOutstockType: [
          { required: true, message: '出库类型不能为空', trigger: 'change' }
        ],
        isNatural: [
          { required: true, message: '必填项', trigger: 'change' },
          { pattern: /^[1-9]\d*$/, message: '大于零的整数', trigger: 'blur' }
        ]
      }
    }
  },
  created () {
    // 出库类型
    this.$http
      .get(this.$http.adornUrl('basicData/queryDataDict2List'), {
        params: { dataDictKey: 'OUTSTOCK_TYPE' }
      })
      .then(({ data }) => {
        this.dictOutstockTypeOption = data.fontMaps
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
      this.isDisableFromAdd = false
      this.dataForm.warehouseUserId = sessionStorage.getItem('userId')
      this.dataForm.id = id
      this.type = type
      this.dataForm.whOutstockDetail = []
      this.add(id, type)
      this.editorCheck(id, type)
      // this.$nextTick(() => {
      //   if (type === 'isDisabled') {
      //     this.isDisabled = true
      //     this.isDisabledTaxRate = true
      //     this.isClick = false
      //   } else {
      //     // 新增
      //     this.isDisabled = false
      //     this.isDisabledTaxRate = false
      //     this.isClick = true
      //     // // 默认公司
      //     this.dataForm.compId = sessionStorage.getItem('orgId')
      //     this.$nextTick(() => {
      //       this.compIdChange(this.dataForm.compId)
      //     })
      //   }
      // })
      this.$nextTick(() => {
        if (this.dataForm.id) {
          this.isDisableFromAdd = true
          this.$http({
            url: this.$http.adornUrl(`warehouse/whoutstock/info/${this.dataForm.id}`),
            method: 'get',
            params: this.$http.adornParams()
          }).then(({ data }) => {
            if (data && data.code === 0) {
              this.compIdChange(data.WhOutstockDto.compId)
              // 拿到levelpath进行处理
              if (data.WhOutstockDto.levelPath) {
                let levelPathArr = data.WhOutstockDto.levelPath.split('.') || []
                levelPathArr.splice(0, 2)
                this.deptId = levelPathArr
              } else {
                this.deptId = []
              }
              this.dataForm = data.WhOutstockDto
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
        this.isDisabledTaxRate = false
        this.isClick = true
        // // 默认公司
        this.dataForm.compId = sessionStorage.getItem('orgId')
        this.$nextTick(() => {
          this.compIdChange(this.dataForm.compId)
        })
      }
    },
    // 编辑或者查看
    editorCheck (id, type) {
      if (this.dataForm.id && type === 'canCheck') {
        this.isDisabled = true
        this.isDisabledTaxRate = true
        this.isClick = false
      } else if (this.dataForm.id && !type) {
        this.isDisabled = false
        this.isDisabledTaxRate = true
        this.isClick = true
      }
    },

    // 部门触发
    departChange (value) {
      this.dataForm.deptId = value[value.length - 1]
    },

    // 选择公司触发
    compIdChange (value) {
      this.dataForm.warehouseId = ''
      this.dataForm.deptId = ''
      // 仓库
      this.$http
        .get(this.$http.adornUrl('list/combobox/warehouse-comp'), {
          params: { compId: value }
        })
        .then(({ data }) => {
          this.warehouseIdOption = data.list
        })

      // 部门
      this.$http.get(this.$http.adornUrl(`sys/organization/sortSpecifyNodeId`), { params: {
          nodeId: value
        } })
        .then(({ data }) => {
          // this.dataForm.deptId = "";
          this.deptIdOption = data.list
        })
    },

    // 添加=>其他出库明细
    addHandle () {
      if (!this.dataForm.warehouseId || !this.dataForm.compId) {
        this.$notify.error({
          title: '错误',
          message: `请先选择[库存公司]和[仓库]`,
          duration: 3000
        })
      } else {
        this.$nextTick(() => {
          this.$refs.addDetails.init(
            this.dataForm.id,
            this.dataForm.whOutstockDetail,
            { warehouseId: this.dataForm.warehouseId, compId: this.dataForm.compId, kcstatus: '0204' }
          )
        })
      }
    },

    // 多选
    selectionChangeHandle (val) {
      this.dataListSelections = val
    },

    // 删除=>其他出库明细
    deleteHandle (scope) {
      this.dataForm.whOutstockDetail.splice(scope.$index, 1)
      if (this.dataForm.whOutstockDetail.length > 0) {
        this.isDisableFromAdd = true
      } else {
        this.isDisableFromAdd = false
      }
    },

    // 子组件添加的数据
    addList (list) {
      list = list.map(item => {
        return {
          warehouseId: item.id,
          compId: item.compId,
          prodId: item.prodId,
          prodCode: item.prodCode,
          imageUrl: item.imageUrl,
          prodName: item.prodName,
          specifications: item.specifications,
          dictInventoryStatusName: item.dictInventoryStatusName,
          unitName: item.unitName,
          qty: item.qty,
          dictInventoryStatus: item.dictInventoryStatus
        }
      })
      // 添加了数据，禁掉退货公司和退货仓库的选择
      this.isDisableFromAdd = true
      for (const data of list) {
        let isFind = false
        for (const item of this.dataForm.whOutstockDetail) {
          if (
            data.prodId === item.prodId &&
            data.dictInventoryStatus === item.dictInventoryStatus &&
            data.compId === item.compId &&
            data.warehouseId === item.warehouseId
          ) {
            isFind = true
            break
          }
        }
        if (!isFind) {
          this.dataForm.whOutstockDetail.push(data)
        }
      }
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
          if (column.property === 'outQty') {
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

    // 表单提交
    dataFormSubmit: _.debounce(
      async function dataFormSubmit () {
        if (!(this.dataForm.whOutstockDetail.length > 0)) {
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
                `/warehouse/whoutstock/${!this.dataForm.id ? 'save' : 'update'}`
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
                  message: `${!this.dataForm.id ? '新增' : '修改'}成功, 编码为:${
                    data.entity.code
                    }`,
                  duration: 5000
                })
              } else {
                this.$notify({
                  type: 'error',
                  title: '提示',
                  dangerouslyUseHTMLString: true,
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

    // 确认出库
    confirmOrder: _.debounce(
      async function confirmOrder () {
        if (!(this.dataForm.whOutstockDetail.length > 0)) {
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
              url: this.$http.adornUrl('warehouse/whoutstock/saveandconfirm'),
              method: 'post',
              data: this.dataForm
            }).then(({ data }) => {
              if (data && data.code === 0) {
                this.visible = false
                this.$emit('refreshDataList')
                this.$notify({
                  type: 'success',
                  title: '成功',
                  dangerouslyUseHTMLString: true,
                  message: `确认出库成功, 编码为:${data.entity.code}`,
                  duration: 5000
                })
              } else {
                this.$notify({
                  type: 'error',
                  title: '提示',
                  dangerouslyUseHTMLString: true,
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
      })

  }
}
</script>

