<template>
  <el-dialog :title="!dataForm.id ? '库存状态转换单新增' : isClick ? '库存状态转换单编辑' : '库存状态转换单查看'"
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
          <el-form-item label="单号"
                        prop="code">
            <el-input v-model="dataForm.code"
                      disabled
                      placeholder="系统自动带出"></el-input>
          </el-form-item>
          <el-form-item label="库存公司"
                        prop="compId">
            <select-all v-model="dataForm.compId"
                        :listDataOption="compIdOption"
                        data-value="orgId"
                        data-label="name"
                        :isDisabled="isDisabled || (dataForm.whConvertInventoryDetailList.length > 0)"
                        :isSelectChange="true"
                        @selectChange="compIdChange"></select-all>
          </el-form-item>

        </el-col>
        <el-col :span="6">

          <el-form-item label="始发仓库"
                        prop="warehouseId">
            <select-all v-model="dataForm.warehouseId"
                        :listDataOption="warehouseIdOption"
                        data-value="id"
                        data-label="name"
                        :isDisabled="isDisabled || (dataForm.whConvertInventoryDetailList.length > 0)"
                        :isSelectChange="true"
                        @selectChange="warehouseIdChange"></select-all>
          </el-form-item>
          <el-form-item label="目的仓库"
                        prop="toWarehouseId">
            <select-all v-model="dataForm.toWarehouseId"
                        :listDataOption="toWarehouseIdOption"
                        data-value="id"
                        data-label="name"
                        :isDisabled="isDisabled"></select-all>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="单据状态"
                        prop="dictDocStatus">
            <select-all v-model="dataForm.dictDocStatus"
                        :listDataOption="dictDocStatusOptions"
                        data-value="key"
                        data-label="value"
                        :isDisabled="true"></select-all>
          </el-form-item>
          <el-form-item label="备注"
                        prop="remark">
            <textarea-all v-model="dataForm.remark"
                          :disabled="isDisabled"></textarea-all>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="日期"
                        prop="date">
            <el-date-picker :disabled="isDisabled"
                            v-model="dataForm.date"
                            type="date"
                            value-format="yyyy-MM-dd"></el-date-picker>
          </el-form-item>
          <el-form-item label="仓管员"
                        prop="warehouseUserId">
            <select-seach :isDisabled="isDisabled"
                          v-model="dataForm.warehouseUserId"
                          httpUrl="list/search/user"
                          data-source="list"
                          title="user"
                          data-value="id"
                          data-label="name"></select-seach>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-button v-if="isClick"
                   type="text"
                   @click="addRow"><i class="iconfont erp-icon-tianjiamingxi"></i>添加明细行</el-button>
      </el-row>
      <el-row>
        <el-table :data="dataForm.whConvertInventoryDetailList"
                  stripe
                  border
                  highlight-current-row
                  v-loading="dataListLoading"
                  @selection-change="selectionChangeHandle"
                  show-summary
                  :summary-method="getSummaries">
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
          <el-table-column prop="statusBeforeName"
                           label="始发仓库存状态"></el-table-column>
          <el-table-column prop="statusAfter"
                           label="目的仓库存状态">
            <template slot-scope="scope">
              <el-form-item :prop="'whConvertInventoryDetailList[' + scope.$index + '].statusAfter'"
                            :rules="dataRule.statusAfter"
                            label-width="0px">
                <select-all v-model="scope.row.statusAfter"
                            :listDataOption="statusAfterOptions"
                            data-value="key"
                            data-label="value"
                            :isDisabled="isDisabled"
                            placeholder="目的仓库存状态"></select-all>
              </el-form-item>
            </template>
          </el-table-column>
          <el-table-column prop="convQty"
                           label="转换数量">
            <template slot-scope="scope">
              <el-form-item :prop="'whConvertInventoryDetailList[' + scope.$index + '].convQty'"
                            :rules="dataRule.isNatural"
                            label-width="0px">
                <el-input v-model="scope.row.convQty"
                          type="Number"
                          @mousewheel.native.prevent
                          placeholder="转换数量"
                          :disabled="isDisabled"></el-input>
              </el-form-item>
            </template>
          </el-table-column>
          <el-table-column prop="reason"
                           label="转换原因">
            <template slot-scope="scope">
              <textarea-all v-model="scope.row.reason"
                            :disabled="isDisabled"></textarea-all>
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
                 @click="switchingConfirm()"><i class="iconfont erp-icon-queding"></i>确认转换</el-button>
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
// 添加明细（新组件）
import addDetails from '@/components/add-details/prod-warehouse-detail'
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

  data () {
    return {
      visible: false,
      isClick: true,
      isDisabled: false,
      // 库存公司
      compIdOption: [],
      // 始发仓库
      warehouseIdOption: [],
      // 目的仓库
      toWarehouseIdOption: [],
      // 单据状态
      dictDocStatusOptions: [],
      // 转换后库存状态
      statusAfterOptions: [],

      dataForm: {
        id: '',
        code: '',
        warehouseUserId: '',
        compId: '',
        date: '',
        warehouseId: '',
        toWarehouseId: '',
        dictDocStatus: '01',
        remark: '',
        whConvertInventoryDetailList: []
      },

      dataListLoading: false,
      // 多选
      dataListSelections: [],

      // 分页
      paginationData: {
        currPage: 1,
        pageSize: 10,
        totalCount: 0,
        totalPage: 0
      },
      dataRule: {
        date: [{ required: true, message: '日期不能为空', trigger: 'change' }],
        remark: [{ required: true, message: '备注不能为空', trigger: 'change' }],
        warehouseId: [
          { required: true, message: '仓库不能为空', trigger: 'change' }
        ],
        toWarehouseId: [
          { required: true, message: '仓库不能为空', trigger: 'change' }
        ],
        isNatural: [
          { required: true, message: '必填项', trigger: 'change' },
          { pattern: /^[1-9]\d*$/, message: '大于零的整数', trigger: 'blur' }
        ],
        statusAfter: [
          { required: true, message: '必填项', trigger: 'change' }
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
    // this.$http.get(this.$http.adornUrl('list/combobox/warehouse-comp'), {params: {compId: this.dataForm.compName}}).then(({data}) => {this.warehouseIdOption = data.list})
    this.$http
      .get(this.$http.adornUrl('basicData/queryDataDict2List'), {
        params: { dataDictKey: 'WAREHOUSE_INVENTORY_STATUS' }
      })
      .then(({ data }) => {
        this.statusAfterOptions = data.fontMaps
      })
    this.$http
      .get(this.$http.adornUrl('basicData/queryDataDict2List'), {
        params: { dataDictKey: 'APPROVAL_STATUS' }
      })
      .then(({ data }) => {
        this.dictDocStatusOptions = data.fontMaps
      })
  },
  methods: {
    init (id, type, parentData) {
      this.dataForm.code = ''
      this.dataForm.addTime = ''
      this.dataForm.addUser = ''
      this.dataForm.updTime = ''
      this.dataForm.updUser = ''
      this.dataForm.confirmTime = ''
      this.dataForm.confirmUser = ''
      this.dataForm.warehouseUserId = sessionStorage.getItem('userId')
      this.visible = true
      this.dataForm.id = id
      this.add(id, type)
      this.editorCheck(id, type)
      // this.$nextTick(() => {
      //   if (type === 'isDisabled') {
      //     this.isDisabled = true
      //     this.isClick = false
      //   } else {
      //     // 新增
      //     this.isDisabled = false
      //     this.isClick = true
      //     this.dataForm.whConvertInventoryDetailList = []
      //     this.dataForm.userId = ''
      //     // 默认公司
      //     this.dataForm.compId = sessionStorage.getItem('orgId')
      //     this.$nextTick(() => {
      //       this.compIdChange(this.dataForm.compId)
      //     })
      //   }
      // })
      if (this.dataForm.id) {
        this.$http({
          url: this.$http.adornUrl(`warehouse/whconvertinventory/info/${id}`),
          method: 'get'
        }).then(({ data }) => {
          if (data && data.code === 0) {
            this.compIdChange(data.whConvertInventoryEntity.compId)
            this.dataForm = data.whConvertInventoryEntity
            // this.dataForm.whConvertInventoryDetailList = data.whConvertInventoryEntity.whConvertInventoryDetailList;
          }
        })
      }
    },
    // 新增
    add (id, type) {
      if (!id) {
        // 新增
        this.isDisabled = false
        this.isClick = true
        this.dataForm.whConvertInventoryDetailList = []
        this.dataForm.userId = ''
        // 默认公司
        this.dataForm.compId = sessionStorage.getItem('orgId')
        this.$nextTick(() => {
          this.compIdChange(this.dataForm.compId)
        })
      }
    },
    // 查看或者编辑
    editorCheck (id, type) {
      // 查看
      if (id && type === 'isDisabled') {
        this.isDisabled = true
        this.isClick = false
        return
      }
      // 编辑
      if (id && !type) {
        this.isDisabled = false
        this.isClick = true
      }
    },
    // 选择公司触发
    compIdChange (value) {
      this.dataForm.warehouseId = ''
      this.$http
        .get(this.$http.adornUrl('list/combobox/warehouse-comp'), {
          params: { compId: value }
        })
        .then(({ data }) => {
          this.warehouseIdOption = data.list
          this.toWarehouseIdOption = data.list
        })
    },

    warehouseIdChange (value) {
      this.dataForm.toWarehouseId = value
    },

    // 增加行
    addRow () {
      this.$nextTick(() => {
        if (this.dataForm.compId && this.dataForm.warehouseId) {
          this.$refs.addDetails.init(
            this.dataForm.id,
            this.dataForm.whConvertInventoryDetailList,
            {
              warehouseId: this.dataForm.warehouseId,
              compId: this.dataForm.compId
            }
          )
        } else {
          this.$notify.error({
            title: '错误',
            message: `请先选择[库存公司]和[始发仓库]`,
            duration: 3000
          })
        }
      })
    },

    // 确认转换
    switchingConfirm: _.debounce(
      async function switchingConfirm () {
        if (!(this.dataForm.whConvertInventoryDetailList.length > 0)) {
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
                'warehouse/whconvertinventory/saveandconfirm'
              ),
              method: 'post',
              data: this.dataForm
            }).then(({ data }) => {
              if (data && data.code === 0) {
                this.visible = false
                this.$emit('refreshDataList')
                this.$notify.success({
                  title: '成功',
                  message: `确认转换成功:编码为${data.entity.code}`,
                  duration: 5000
                })
              } else {
                this.$notify.error({
                  title: '提示',
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

    // 保存
    dataFormSubmit: _.debounce(
      async function dataFormSubmit () {
        if (!(this.dataForm.whConvertInventoryDetailList.length > 0)) {
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
                `warehouse/whconvertinventory/${
                !this.dataForm.id ? 'save' : 'update'
                }`
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
                  title: '提示',
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
          statusBefore: item.dictInventoryStatus, // 目的仓库id
          statusBeforeName: item.dictInventoryStatusName,
          convQty: item.qty // 转换数量
        }
      })
      for (const data of list) {
        let isFind = false
        for (const item of this.dataForm.whConvertInventoryDetailList) {
          if (data.id === item.id) {
            isFind = true
            break
          }
        }
        if (!isFind) {
          this.dataForm.whConvertInventoryDetailList.push(data)
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
          if (column.property === 'convQty') {
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
    // 删除
    deleteHandle (scope) {
      this.dataForm.whConvertInventoryDetailList.splice(scope.$index, 1)
    }
  },
  beforeDestroy () {
    this.$refs['dataForm'].resetFields()
  }
}
</script>
