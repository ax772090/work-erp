<template>
  <el-dialog :visible.sync="visible"
             title="销售出库查看"
             :close-on-click-modal="false"
             width="90%"
             append-to-body>
    <el-form :model="dataForm"
             ref='dataForm'
             label-width='80px'
             :rules="dataRule">
      <el-row>
        <el-col :span="6">
          <el-form-item label="出库单号"
                        prop="code">
            <el-input v-model="dataForm.code"
                      disabled
                      placeholder="系统自动生成"></el-input>
          </el-form-item>
          <el-form-item label="库存公司"
                        prop="compId">
                        <select-all v-model="dataForm.compId"
                        :isDisabled="true"
                        :listDataOption="CompIdOptions"
                        data-value="id"
                        data-label="name"></select-all>
          </el-form-item>
          <el-form-item label="出库日期"
                        prop="shippedDate">
            <el-input v-model="dataForm.shippedDate"
                      disabled
                      placeholder="系统自动生成"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="仓管员"
                        prop="adminId">
            <select-seach :isDisabled="true"
                          v-model='dataForm.adminId'
                          httpUrl='/list/search/user'
                          httpMethod='get'
                          requestParamsKey='name'
                          dataLabel='name'
                          dataValue='id'
                          dataSource='list'>
            </select-seach>
          </el-form-item>
          <el-form-item label="仓库"
                        prop="fromWarehouseId">
                        <select-all v-model="dataForm.fromWarehouseId"
                        :isDisabled="true"
                        :listDataOption="WarehouseIdOptions"
                        data-value="id"
                        data-label="name"></select-all>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="客户"
                        prop="toCompId">
            <select-seach :isDisabled="true"
                          v-model='dataForm.toCompId'
                          httpUrl='/list/search/customer'
                          httpMethod='get'
                          requestParamsKey='idOrName'
                          dataLabel='name'
                          dataValue='id'
                          dataSource='list'>
            </select-seach>
          </el-form-item>
          <el-form-item label="业务类型"
                        prop="dictBizStatus">
                        <select-all v-model="dataForm.dictBizStatus"
                        :isDisabled="true"
                        :listDataOption="dictBizStatusOption"
                        data-value="key"
                        data-label="value"></select-all>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="单据状态"
                        prop="dictDocStatus">
                        <select-all v-model="dataForm.dictDocStatus"
                        :isDisabled="true"
                        :listDataOption="dictDocStatusOption"
                        data-value="key"
                        data-label="value"></select-all>
          </el-form-item>
          <el-form-item label="备注"
                        prop="remark">
            <textarea-all v-model="dataForm.remark"
                          disabled></textarea-all>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-table :data='dataForm.dataList'
                  stripe
                  border
                  max-height="400"
                  highlight-current-row
                  v-loading='dataListLoading'
                  show-summary
                  :summary-method="getSummaries">
          <el-table-column prop='url'
                           label='产品图片'
                           width="120">
            <template slot-scope="scope">
              <tableImg :imageUrl='scope.row.url'></tableImg>
            </template>
          </el-table-column>
          <el-table-column prop='code'
                           label='产品编码'></el-table-column>
          <el-table-column prop='nameCh'
                           label='产品名称'></el-table-column>
          <el-table-column prop='unitName'
                           label='单位'></el-table-column>
          <el-table-column prop='dictInventoryStatusValue'
                           label='库存状态'>
          </el-table-column>
          <el-table-column prop='qty'
                           label='出库数量'>
          </el-table-column>
          <el-table-column prop='price'
                           label='单价'></el-table-column>
          <el-table-column prop='totalAmount'
                           label='总金额'></el-table-column>
          <el-table-column prop='noTaxAmount'
                           label='不含税金额'></el-table-column>
          <el-table-column prop='tax'
                           label='税率'></el-table-column>
        </el-table>
      </el-row>
    </el-form>
    <span slot="footer"
          class="dialog-footer">
      <el-button @click="visible=false"><i class="iconfont erp-icon-quxiao"></i>取消</el-button>
    </span>
  </el-dialog>
</template>
<script>
import selectSeach from '@/components/erp-select/select-seach'
import selectAll from '@/components/erp-select/select-all'

// 引入图片
import tableImg from '@/components/list-table/table-img'
// 备注
import textareaAll from '@/components/erp-input/textarea-all.vue'
export default {
  components: {
    selectSeach,
    selectAll,
    tableImg,
    textareaAll
  },
  data () {
    return {
      isDisabled: false,
      isShow: true,
      dataListLoading: false, // loading加载
      visible: false,
      storageList: [],
      dataForm: {
        dataList: [],
        id: ''
      },
      dictInventoryStatusOptions: [], // 库存状态
      CompIdOptions: [], // 库存公司
      WarehouseIdOptions: [], // 仓库
      dictDocStatusOption: [], // 单据状态
      dictBizStatusOption: [],  // 业务状态
      dataRule: {
        userId: [{ required: true, message: '必填项', trigger: 'change' }], // 仓管员
        compId: [{ required: true, message: '必填项', trigger: 'change' }], // 库存公司
        WarehouseId: [{ required: true, message: '必填项', trigger: 'change' }], // 仓库
        admin: [{ required: true, message: '必填项', trigger: 'change' }], // 客户
        date: [{ required: true, message: '必填项', trigger: 'change' }] // 出库日期
      }
    }
  },
  created () {
    this.getDataUrl()
  },
  methods: {
    getDataUrl () {
      // 库存公司
      this.$http
        .get(this.$http.adornUrl('list/combobox/company'))
        .then(({ data }) => {
          this.CompIdOptions = data.list
        })
      // 仓库
      this.$http
        .get(this.$http.adornUrl('list/combobox/warehouse'))
        .then(({ data }) => {
          this.WarehouseIdOptions = data.list
        })
      // 单据状态
      this.$http
        .get(this.$http.adornUrl('basicData/queryDataDict2List'), {
          params: { dataDictKey: 'APPROVAL_STATUS' }
        })
        .then(({ data }) => {
          this.dictDocStatusOption = data.fontMaps
        })
      // 业务状态
      this.$http
        .get(this.$http.adornUrl('basicData/queryDataDict2List'), {
          params: { dataDictKey: 'TRANS_OUT_BIZ_TYPE' }
        })
        .then(({ data }) => {
          this.dictBizStatusOption = data.fontMaps
        })
    },
    // 初始化
    init (id, type) {
      this.dataForm.id = id
      this.visible = true
      this.$nextTick(() => {
        if (type === 'canCheck') {
          this.initCheck(id)
        }
      })
    },
    initCheck (id) {
      this.$http({
          url: this.$http.adornUrl(
            `warehouse/whtransfersale/info/${id}`
          ),
          method: 'get'
        }).then(({ data }) => {
          if (data && data.code === 0) {
            this.$nextTick(() => {
              for (const item of data.whTransferSale.detailEntities) {
                this.$set(item, 'code', item.prodBasicEntity.code)
                this.$set(item, 'nameCh', item.prodBasicEntity.nameCh)
                this.$set(item, 'unitName', item.prodBasicEntity.dictUnitEntity.name)
              }
              this.dataForm = data.whTransferSale
              this.dataForm.dataList = data.whTransferSale.detailEntities
              this.storageList = this.dataForm.dataList
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
          if (index == 8 || index == 5 || index == 7) {
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
    storageList: {
      handler (val, oldVal) {
        for (var i = 0; i < val.length; i++) {
          if (val[i].qty === null) {
            val[i].qty = 0
          } else {
            val[i].totalAmount = (val[i].price * val[i].qty).toFixed(2)
            val[i].noTaxAmount = (
              val[i].totalAmount /
              (1 + val[i].tax)
            ).toFixed(2)
          }
        }
      },
      deep: true
    }
  }
}
</script>
