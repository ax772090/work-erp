<template>
  <el-dialog :title="dialogTitle"
             :close-on-click-modal="false"
             :visible.sync="visible"
             @close="$refs['dataForm'].resetFields()"
             width="90%">
    <!-- 审核头 -->
    <approval-new v-model="approvalData"
                  v-if='isShowApproval'></approval-new>
    <el-form :model="dataForm"
             :rules="dataRule"
             ref="dataForm"
             label-width="110px">
      <el-row>
        <el-col :span="6">
          <el-form-item label="库存公司"
                        prop="compId">
            <select-all v-model="dataForm.docInfo.compId"
                        :listDataOption="compIdOption"
                        data-value="orgId"
                        data-label="name"
                        :isDisabled="isDisabled"></select-all>
          </el-form-item>
          <!-- <el-form-item label="盘点单号" prop="code">{{dataForm.docInfo.code}}</el-form-item> -->
          <el-form-item label="盘点单号"
                        prop="code">
            <el-input v-model="dataForm.docInfo.code"
                      disabled></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="盘点日期"
                        :rules="dataRule.isRequired"
                        prop="docInfo.stocktakingDate">
            <el-date-picker v-model="dataForm.docInfo.stocktakingDate"
                            type="date"
                            value-format="yyyy-MM-dd"
                            :disabled="isDisabled"></el-date-picker>
          </el-form-item>
          <el-form-item label="盘点员"
                        prop="stockUserId">
            <select-seach v-model="dataForm.docInfo.stockUserId"
                          httpUrl="list/search/user"
                          httpMethod="get"
                          data-label="name"
                          data-value="id"
                          data-source="list"
                          :isDisabled="isDisabled"></select-seach>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="单据状态"
                        prop="dictDocStatus">
            <select-all v-model="dataForm.docInfo.dictDocStatus"
                        :listDataOption="dictDocStatusOption"
                        data-value="key"
                        data-label="value"
                        :isDisabled="true"></select-all>
          </el-form-item>
          <el-form-item label="备注"
                        prop="remark">
            <textarea-all v-model="dataForm.docInfo.remark"
                          :disabled="isDisabled"></textarea-all>
          </el-form-item>
        </el-col>
      </el-row>
      <!-- ============================== 盘点明细 ============================== -->
      <el-table :data="dataForm.docDetail"
                stripe
                border
                highlight-current-row
                max-height="500"
                v-loading="dataListLoading"
                @selection-change="selectionChangeHandle"
                show-summary
                :summary-method="getSummaries">
        <el-table-column type="index"
                         width="50"
                         label="序号"
                         align="center"></el-table-column>
        <el-table-column prop="prodImageUrl"
                         label="产品图片">
          <template slot-scope="scope">
            <tableImg :imageUrl='scope.row.prodImageUrl'></tableImg>
          </template>
        </el-table-column>
        <el-table-column prop="prodCode"
                         label="产品编码"></el-table-column>
        <el-table-column prop="prodName"
                         label="产品名称"></el-table-column>
        <el-table-column prop="specifications"
                         label="规格型号"></el-table-column>
        <el-table-column prop="prodUnitName"
                         label="单位"></el-table-column>
        <el-table-column prop="warehouseName"
                         label="仓库"></el-table-column>
        <el-table-column prop="dictInventoryStatusName"
                         label="库存状态"></el-table-column>
        <el-table-column prop="sysInventoryQty"
                         label="系统库存数"></el-table-column>
        <el-table-column prop="stocktakingQty"
                         label="盘点数量">
          <template slot-scope="scope">
            <el-form-item :prop="'docDetail[' + scope.$index + '].stocktakingQty'"
                          :rules="dataRule.isInteger"
                          label-width="0px">
              <el-input v-model="scope.row.stocktakingQty"
                        type="Number"
                        @mousewheel.native.prevent
                        :disabled="isDisabled"
                        @input="diffQty(scope.row)"
                        placeholder="盘点数量"></el-input>
            </el-form-item>
          </template>
        </el-table-column>
        <el-table-column prop="diffQty"
                         label="差异数量"></el-table-column>
        <el-table-column prop="remark"
                         label="备注">
          <template slot-scope="scope">
            <textarea-all v-model="scope.row.remark"
                          :disabled="isDisabled"></textarea-all>
          </template>
        </el-table-column>
      </el-table>
    </el-form>
    <span slot="footer"
          class="dialog-footer">
      <el-button @click="visible = false"><i class="iconfont erp-icon-quxiao"></i>取消</el-button>
      <el-button v-if="(isClick && (isAuth('warehouse:whstocktaking:save') || isAuth('warehouse:whstocktaking:update')))"
                 type="primary"
                 @click="dataFormSubmit()"><i class="iconfont erp-icon-baocun"></i>保存</el-button>
      <el-button v-if="(isClick && isAuth('warehouse:whstocktaking:submit'))"
                 type="primary"
                 @click="processSubmit()"><i class="iconfont erp-icon-queding"></i>提交</el-button>
      <el-button type="primary"
                 :disabled="!isShowApproval"
                 v-if="isShowApproval"
                 @click="workflowApproval()">审核</el-button>
    </span>
  </el-dialog>
</template>
<script>
import selectSeach from '@/components/erp-select/select-seach'
import selectAll from '@/components/erp-select/select-all'
import approvalNew from '@/components/workflow/approval-new'
// 引入图片
import tableImg from '@/components/list-table/table-img'
import { ruleData } from '@/mixins/initData.js'
import { getUrl, getRequest, clearTaskId } from '@/utils'
// 备注
import textareaAll from '@/components/erp-input/textarea-all.vue'
export default {
  mixins: [ruleData],
  components: {
    selectSeach,
    selectAll,
    approvalNew,
    tableImg,
    textareaAll
  },
  data () {
    return {
      dialogTitle: '', // dialog标题
      isShowApproval: false, // 审核头是否显示
      visible: false,
      isClick: true,
      isDisabled: false,
      // 公司
      compIdOption: [],
      // 单据状态
      dictDocStatusOption: [],
      dataForm: {
        docInfo: {
          id: '',
          // taskId: '',
          compId: '',
          code: '',
          stocktakingDate: '',
          stockUserId: '',
          dictDocStatus: '',
          remark: ''
        },
        docDetail: []
      },

      // 多选
      dataListSelections: [],
      dataListLoading: false,
      dataRule: {
        isInteger: [
          { pattern: /^\d+$/, message: '请输入整数', trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
    getDataUrl () {
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
    init (id, type, parentData) {
      this.visible = true
      this.isShowApproval = false
      this.getDataUrl()

      this.dataForm.docInfo.id = id
      this.$nextTick(() => {
        // 查看
        if (type === 'isDisabled') {
          this.dialogTitle = '盘点表查看'
          this.isDisabled = true
          this.isClick = false
        } else if (type === 'approve') {
          this.dialogTitle = '盘点表审核'
          this.isShowApproval = true
          this.isDisabled = true
          this.isClick = false
          this.approvalData = parentData
          if (this.approvalData.node === 'T01') {
            this.approvalData.isShowNode2 = false
            this.approvalData.isShowNode3 = true
          } else {
            this.approvalData.isShowNode2 = true
            this.approvalData.isShowNode3 = true
          }
        } else if (!this.dataForm.docInfo.id) {
          // 新增
          this.dialogTitle = '盘点表新增'
          this.isDisabled = false
          this.isClick = true
        } else {
          this.isDisabled = false
          this.isClick = true
          this.dialogTitle = '盘点表修改'
        }
      })

      this.$nextTick(() => {
        if (this.dataForm.docInfo.id) {
          this.$http({
            url: this.$http.adornUrl(
              `warehouse/whstocktaking/info/${this.dataForm.docInfo.id}`
            ),
            method: 'get'
          }).then(({ data }) => {
            if (data && data.code === 0) {
              this.dataForm.docInfo = data.docInfo
              this.dataForm.docDetail = data.docDetail
            }
          })
        }
      })
    },

    // 多选
    selectionChangeHandle (val) {
      this.dataListSelections = val
    },

    diffQty (row) {
      row.diffQty = Number(row.stocktakingQty) - Number(row.sysInventoryQty)
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
          if (
            column.property === 'sysInventoryQty' ||
            column.property === 'stocktakingQty'
          ) {
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

    // 保存
    dataFormSubmit: _.debounce(
      async function dataFormSubmit () {
        this.$refs['dataForm'].validate(valid => {
          if (valid) {
            this.$http({
              url: this.$http.adornUrl('warehouse/whstocktaking/save'),
              method: 'post',
              data: this.dataForm
            }).then(({ data }) => {
              if (data && data.code === 0) {
                this.visible = false
                this.$emit('refreshDataList')
                this.$notify.success({
                  title: '提示',
                  message: `保存成功`,
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

    // 提交
    processSubmit: _.debounce(
      async function processSubmit () {
        this.$refs['dataForm'].validate(valid => {
          if (valid) {
            this.$http({
              url: this.$http.adornUrl('warehouse/whstocktaking/saveAndSubmit'),
              method: 'post',
              data: Object.assign({}, this.dataForm, { flowParams:
                {
                  businessId: this.dataForm.docInfo.id,
                  routeUrl: getUrl(),
                  code: this.dataForm.docInfo.code,
                  docName: '盘点单'
                }
              })
            }).then(({ data }) => {
              if (data && data.code === 0) {
                this.visible = false
                this.$emit('refreshDataList')
                this.$notify.success({
                  title: '成功',
                  message: `提交成功`,
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

    // 审核接口
    initApproval () {
      return this.$http({
        url: this.$http.adornUrl(`activiti/approval`),
        method: 'put',
        data: this.approvalData
      })
    },

    // 审核
    workflowApproval: _.debounce(
      async function workflowApproval () {
        this.$refs['dataForm'].validate(valid => {
          if (valid) {
            this.initApproval().then(({ data }) => {
              if (data && data.code === 0) {
                // 清除url的taskId
                window.location.href = clearTaskId()
                this.$emit('refreshDataList')
                this.visible = false
                this.$notify.success({
                  title: '成功',
                  message: `审核成功`,
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
    )
  }
}
</script>
