<template>
  <el-dialog :title="!dataForm.id ? '其他出库新增' : isClick === true ? '其他出库编辑' : '其他出库查看'"
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
          <el-form-item label="出库单号"
                        prop="code">
            <el-input v-model="dataForm.code"
                      :disabled="true"
                      placeholder="系统自动生成"></el-input>
          </el-form-item>
          <el-form-item label="仓管员"
                        prop="warehouseUserId">
            <select-seach v-model="dataForm.warehouseUserId"
                          httpUrl="list/search/user"
                          httpMethod="get"
                          data-label="name"
                          data-value="id"
                          data-source="list"
                          placeholder="搜索仓管员"
                          :isDisabled="isDisabled"></select-seach>
          </el-form-item>
          <el-form-item label="出库类型"
                        prop="dictOutstockType">
            <select-all v-model="dataForm.dictOutstockType"
                        :isDisabled="true"
                        :listDataOption="dictOutstockTypeOption"
                        data-value="key"
                        data-label="value"></select-all>
          </el-form-item>

        </el-col>
        <el-col :span="6">

          <el-form-item label="库存公司"
                        prop="compId">
            <select-all v-model="dataForm.compId"
                        :isDisabled="isDisabled"
                        :listDataOption="compIdOption"
                        data-value="orgId"
                        data-label="name"
                        :isSelectChange="true"
                        @selectChange="compIdChange"></select-all>
          </el-form-item>
          <el-form-item label="来源店铺"
                        prop="channelId">
            <select-all v-model="dataForm.channelId"
                        :isDisabled="true"
                        :listDataOption="channelIdOption"
                        data-value="id"
                        data-label="name"></select-all>
          </el-form-item>
          <el-form-item label="出库原因"
                        prop="reason">
            <textarea-all v-model="dataForm.reason"
                          :autosize="[2,4]"
                          :disabled="isDisabled"></textarea-all>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="仓库"
                        prop="warehouseId">
            <select-all v-model="dataForm.warehouseId"
                        :isDisabled="isDisabled"
                        :listDataOption="warehouseIdOption"
                        data-value="id"
                        data-label="name"></select-all>
          </el-form-item>

          <el-form-item label="部门"
                        prop="deptId">
            <selectCascaderall v-model="dataForm.LevelPath"
                               :cascaderListData="departIdOptions"
                               data-value="orgId"
                               data-label="name"
                               data-children="subOrgList"
                               :isDisabled='true'
                               placeholder="部门"></selectCascaderall>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="出库日期"
                        prop="outstockDate">
            <el-date-picker v-model="dataForm.outstockDate"
                            type="date"
                            value-format="yyyy-MM-dd"
                            placeholder="出库日期"
                            :disabled="isDisabled"></el-date-picker>
          </el-form-item>
          <el-form-item label="单据状态"
                        prop="dictDocStatus">
            <select-all v-model="dataForm.dictDocStatus"
                        :isDisabled="true"
                        :listDataOption="dictDocStatusOption"
                        data-value="key"
                        data-label="value"></select-all>
          </el-form-item>
        </el-col>
      </el-row>

      <!-- ============================== 其他出库明细 ============================== -->
      <el-table :data="dataForm.whOutstockDetail"
                stripe
                border
                max-height="450"
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
        <el-table-column prop="dictInventoryStatusName"
                         label="库存状态"></el-table-column>
        <el-table-column prop="outQty"
                         label="出库数量">
          <template slot-scope="scope">
            <el-form-item :prop="'whOutstockDetail.' + scope.$index + '.outQty'"
                          :rules="dataRule.isNatural"
                          label-width="0px">
              <el-input v-model="scope.row.outQty"
                        :disabled="isDisabled"
                        placeholder="出库数量"></el-input>
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
        <el-table-column label="源单号">
          <template slot-scope="scope">
            <div>{{scope.row.sourceCode}}</div>
          </template>
        </el-table-column>
      </el-table>
    </el-form>
    <span slot="footer">
      <el-button @click="visible = false"><i class="iconfont erp-icon-quxiao"></i>取消</el-button>
      <el-button type="primary"
                 v-if="isAuth('warehouse:whinstock:save') && isClick"
                 @click="dataFormSubmit()"><i class="iconfont erp-icon-baocun"></i>保存</el-button>
      <el-button type="primary"
                 v-if="isAuth('warehouse:whinstock:confirm') && isClick"
                 @click="confirmOrder()"><i class="iconfont erp-icon-queding"></i>确认出库</el-button>
    </span>
  </el-dialog>
</template>
<script>
import selectSeach from '@/components/erp-select/select-seach'
import selectAll from '@/components/erp-select/select-all'
// 引入图片
import tableImg from '@/components/list-table/table-img'
import selectCascaderall from '@/components/erp-select/select-cascaderall'
// 备注
import textareaAll from '@/components/erp-input/textarea-all.vue'
export default {
  components: {
    selectSeach,
    selectAll,
    selectCascaderall,
    tableImg,
    textareaAll
  },
  data () {
    return {
      visible: false,
      isDisabled: false,
      isClick: true,
      type: '',
      departIdOptions: [],
      dataForm: {
        id: '',
        code: '',
        warehouseUserId: '',
        outstockDate: '',
        compId: '',
        warehouseId: '',
        deptId: '',
        reason: '',
        channelId: '',
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
      // 来源店铺
      channelIdOption: [],

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
    this.getDataUrl()
  },
  methods: {
    getDataUrl () {
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
      // 来源店铺
      this.$http
        .get(this.$http.adornUrl('basic/basicchannel/listcombobox'))
        .then(({ data }) => {
          this.channelIdOption = data.list
        })
    },
    init (id, type, parentData) {
      this.visible = true
      this.dataForm.id = id
      this.type = type
      this.dataForm.whOutstockDetail = []
      this.$nextTick(() => {
        if (type === 'canCheck') {
          this.initCheck(id)
        } else {
          this.initAdd()
        }
      })
      // this.$nextTick(() => {
      //   if (this.dataForm.id) {
      //     this.$http({
      //       url: this.$http.adornUrl(
      //         `warehouse/whoutstock/info/${this.dataForm.id}`
      //       ),
      //       method: 'get',
      //       params: this.$http.adornParams()
      //     }).then(({ data }) => {
      //       if (data && data.code === 0) {
      //         this.compIdChange(data.WhOutstockDto.compId)
      //         this.dataForm = data.WhOutstockDto
      //       }
      //     })
      //   }
      // })
    },
    initAdd () {
      // 新增
      this.isDisabled = false
      this.isDisabledTaxRate = false
      this.isClick = true
      // // 默认公司
      this.dataForm.compId = sessionStorage.getItem('orgId')
      this.$nextTick(() => {
        this.compIdChange(this.dataForm.compId)
      })
    },
    initCheck (id) {
      this.isDisabled = true
      this.isDisabledTaxRate = true
      this.isClick = false
      this.dataCallInfo(id)
    },
    dataCallInfo (id) {
      this.$http({
        url: this.$http.adornUrl(
          `warehouse/whoutstock/info/${id}`
        ),
        method: 'get',
        params: this.$http.adornParams()
      }).then(({ data }) => {
        if (data && data.code === 0) {
          this.compIdChange(data.WhOutstockDto.compId)
          this.dataForm = data.WhOutstockDto
        }
      })
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
      this.$http
        .get(this.$http.adornUrl('sys/organization/query'), {
          params: { orgId: value }
        })
        .then(({ data }) => {
          this.deptIdOption = data.departList
        })
    },

    // 添加=>其他出库明细
    addHandle () {
      this.$nextTick(() => {
        this.$refs.elseParticularsAdd.init(
          this.dataForm.id,
          this.dataForm.whOutstockDetail,
          {
            warehouseId: this.dataForm.warehouseId,
            compId: this.dataForm.compId
          }
        )
      })
    },

    // 多选
    selectionChangeHandle (val) {
      this.dataListSelections = val
    },

    // 删除=>其他出库明细
    deleteHandle (scope) {
      this.dataForm.whOutstockDetail.splice(scope.$index, 1)
    },

    // 子组件添加的数据
    addList (list) {
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
                  message: `${
                    !this.dataForm.id ? '新增' : '修改'
                    }成功, 编码为:${data.entity.code}`,
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
      },
      1000,
      {
        leading: true,
        trailing: false
      }
    ),

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
