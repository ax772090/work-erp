<template>
  <el-dialog title="采购入库单查看"
             :close-on-click-modal="false"
             :visible.sync="visible"
             @close="$refs['dataForm'].resetFields()"
             width='90%'>
    <el-form :model="dataForm"
             ref="dataForm"
             label-width="100px">
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
            <select-seach :isDisabled="true"
                          v-model='dataForm.userId'
                          httpUrl='/list/search/user'
                          httpMethod='get'
                          requestParamsKey='name'
                          dataLabel='name'
                          dataValue='id'
                          dataSource='list'
                          :listDataOptionStatic='userOptions'>
            </select-seach>
          </el-form-item>
          <el-form-item label="备注"
                        prop="remark">
            <textarea-all v-model="dataForm.remark"
                          disabled></textarea-all>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="仓库"
                        prop="warehouseName">
            <el-input v-model="dataForm.warehouseName"
                      disabled></el-input>
          </el-form-item>
          <el-form-item label="入库日期"
                        prop="date">
            <el-date-picker v-model="dataForm.date"
                            type="date"
                            value-format="yyyy-MM-dd"
                            disabled></el-date-picker>
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
            <select-seach :isDisabled='true'
                          v-model='dataForm.compId'
                          httpUrl='/sys/organization/select'
                          httpMethod='get'
                          requestParamsKey='orgId'
                          dataLabel='name'
                          dataValue='orgId'
                          dataSource='companyList'
                          :listDataOptionStatic='compOptions'>
            </select-seach>
          </el-form-item>

        </el-col>
        <el-col :span="6">
          <el-form-item label="单据状态"
                        prop="status">
            <select-all v-model="dataForm.status"
                        :listDataOption="dictDocStatusOptions"
                        data-value="key"
                        data-label="value"
                        :isDisabled="true"></select-all>
            <!-- <el-select v-model="dataForm.status"
                       :disabled='true'>
              <el-option v-for="item in dictDocStatusOptions"
                         :key="item.key"
                         :label="item.value"
                         :value="item.key"></el-option>
            </el-select> -->
          </el-form-item>
          <el-form-item prop="internalTradoc">
            <el-checkbox v-model="dataForm.internalTradoc"
                         disabled>
              是否内部交易单据
            </el-checkbox>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
    <el-table :data="dataForm.poInstockDetail"
              stripe
              border
              highlight-current-row
              max-height="400"
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
                       label="入库数量">
      </el-table-column>
      <el-table-column prop="inventoryStatus"
                       label="库存状态">
        <template slot-scope="scope">
          <select-all v-model="scope.row.inventoryStatus"
                      :listDataOption="inventoryStatus"
                      data-value="key"
                      data-label="value"
                      :isDisabled="true"></select-all>
          <!-- <el-select v-model="scope.row.inventoryStatus"
                     disabled>
            <el-option v-for="item in inventoryStatus"
                       :key="item.key"
                       :label="item.value"
                       :value="item.key">
            </el-option>
          </el-select> -->
        </template>
      </el-table-column>
      <el-table-column label="备注"
                       prop="remark">
        <template slot-scope="scope">
          <textarea-all disabled
                        v-model="scope.row.remark"></textarea-all>
        </template>
      </el-table-column>
      <el-table-column prop="poPrice"
                       label="单价"></el-table-column>
      <el-table-column prop="totalAmount"
                       label="总金额">
        <template slot-scope="scope">
          <span>
            {{ scope.row.totalAmount }}
          </span>
        </template>
      </el-table-column>
      <el-table-column prop="noTaxAmount"
                       label="不含税金额">
        <template slot-scope="scope">
          <span>
            {{ scope.row.noTaxAmount }}
          </span>
        </template>
      </el-table-column>
      <el-table-column prop="tax"
                       label="税率"></el-table-column>
    </el-table>
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
  name: 'search',
  props: ['value'], // 接受外部v-model传入的值
  data () {
    return {
      isShow: true,
      isDisabled: false,
      controlDisabled: false,
      dataListLoading: false,
      visible: false,
      checked: false,
      type: '',
      compId: [], // 入库公司
      compOptions: [],
      index: '',
      // 仓管员
      userOptions: [],
      WarehouseIdOptions: [], // 仓库
      storageList: [],
      // 基本信息
      dataForm: {
        poInstockDetail: [

        ]
      },
      // 单据状态
      dictDocStatusOptions: [],
      inventoryStatus: [] // 库存状态
    }
  },
  created () {
    this.getDataUrl()
  },
  methods: {
    getDataUrl () {
      this.$http.get(this.$http.adornUrl('basicData/queryDataDict2List'), { params: { dataDictKey: 'APPROVAL_STATUS' } }).then(({ data }) => {
        this.dictDocStatusOptions = data.fontMaps
      })
      this.$http.get(this.$http.adornUrl('basicData/queryDataDict2List'), { params: { dataDictKey: 'WAREHOUSE_INVENTORY_STATUS' } }).then(({ data }) => {
        this.inventoryStatus = data.fontMaps
      })
    },
    // 获取采购入库的详情
    storageDetailData () {
      this.$http
        .get(
          this.$http.adornUrl(
            `/warehouse/whinstockpo/info/${this.dataForm.id}`
          )
        )
        .then(({ data }) => {
          if (data && data.code === 0) {
            this.dataForm = data.poInstockDto
          }
        })
    },
    // 初始化
    init (id, type, modules) {
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
          `warehouse/whinstockpo/info/${id}`
        ),
        method: 'get'
      }).then(({ data }) => {
        if (data && data.code === 0) {
          this.dataForm = data.poInstockDto
          this.storageList = data.poInstockDto.poInstockDetail
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
          if (index === 8 || index === 3 || index === 7) {
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
            val[i].totalAmount = (val[i].poPrice * val[i].qty).toFixed(2)
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