<template>
  <el-dialog title="测评费维护"
             :close-on-click-modal="false"
             :visible.sync="visible"
             :before-close="handleClose"
             width="30%">
    <el-form :model="dataForm"
             :rules="dataRule"
             ref="dataForm"
             label-width="130px">
      <el-form-item label="年/月"
                    prop="yearMonth">
        <el-date-picker v-model="dataForm.yearMonth"
                        type="month"
                        value-format="yyyy-MM"
                        placeholder="选择月">
        </el-date-picker>
      </el-form-item>
      <el-form-item label="店铺"
                    prop="channelId">
        <select-all v-model="dataForm.channelId"
                    :listDataOption="channelIdOptions"
                    data-value="id"
                    data-label="name"
                    :isSelectChange="true"
                    @selectChange="selectChange"></select-all>
      </el-form-item>
      <el-form-item label="SellerSKU"
                    prop="sellersku">
        <select-all v-model="dataForm.sellersku"
                    :listDataOption="sellerskuOptions"
                    data-value="sellersku"
                    data-label="sellersku"></select-all>
        <!-- <el-input v-model="dataForm.sellersku"
                  placeholder=""></el-input> -->
      </el-form-item>
      <el-form-item label="总金额(人民币)"
                    prop="amount">
        <el-input v-model="dataForm.amount"
                  type="Number"
                  placeholder="请输入负数"></el-input>
      </el-form-item>
    </el-form>
    <span slot="footer"
          class="dialog-footer">
      <el-button @click="cancel('dataForm')">取消</el-button>
      <el-button type="primary"
                 @click="dataFormSubmit()">保存</el-button>
    </span>
  </el-dialog>
</template>
<script>
import selectSeach from '@/components/erp-select/select-seach'
import selectAll from '@/components/erp-select/select-all'
export default {
  components: {
    selectSeach,
    selectAll
  },
  data () {
    return {
      sellerskuOptions: [],
      // 店铺下拉
      channelIdOptions: [],
      keyOptions: [],
      visible: false,
      dataForm: {
        yearMonth: '',
        channelId: '',
        sellersku: '',
        amount: ''
      },
      dataRule: {
        yearMonth: [
          { required: true, message: '必填项', trigger: 'change' }
        ],
        channelId: [
          { required: true, message: '必填项', trigger: 'change' }
        ],
        sellersku: [
          { required: true, message: '必填项', trigger: 'blur' }
        ],
        amount: [
          { required: true, message: '必填项且为负数', trigger: 'blur' },
          { pattern: /^(-[0-9]+(\.[0-9]+)?)$/, message: '必须为负数', trigger: 'blur' }
        ]
      }
    }
  },
  created () {
    this.$http
      .get(this.$http.adornUrl('basic/basicchannel/listcombobox'), {
        params: {
          platformType: ''
        }
      }).then(({
        data
      }) => {
        this.channelIdOptions = data.list
      })
  },
  methods: {
    // 关闭清除本次缓存
    clearCache (formName) {
      this.$refs[formName].resetFields()
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

    init (id) {
      this.visible = true
      this.dataForm.id = id
      this.dataForm.addTime = null
      this.dataForm.addUser = null
      this.dataForm.addUserName = null
      if (this.dataForm.id) {
        this.$http({
          url: this.$http.adornUrl(
            `fin/platformfee/info/${this.dataForm.id}/assess`
          ),
          method: 'get'
        }).then(({ data }) => {
          if (data && data.code === 0) {
            this.dataForm = Object.assign({}, data.mwsAssessFee, { updUserName: null, updTime: null, updUser: null })
          } else {
            this.$notify.error({
              title: '失败',
              message: data.msg,
              duration: 5000
            })
          }
        })
      }
      // this.$nextTick(() => {
      //
      // })
    },
    selectChange (id) {
      this.$nextTick(() => {
        this.dataForm.sellersku = ''
      })
      if (!id) {
        this.sellerskuOptions = []
      } else {
        this.$http
          .get(this.$http.adornUrl('prod/prodchannelsku/queryForComplete'), { params: { code: id } }).then(({
            data
          }) => {
            this.sellerskuOptions = data.list
          })
      }
    },
    // 表单提交
    dataFormSubmit: _.debounce(
      async function dataFormSubmit () {
        this.$refs['dataForm'].validate(valid => {
          if (valid) {
            // if (this.dataForm.sku || this.dataForm.sellersku) {
            this.$http({
              url: this.$http.adornUrl(
                `fin/platformfee/${!this.dataForm.id ? 'save' : 'update'}`
              ),
              method: !this.dataForm.id ? 'post' : 'put',
              data: {
                feeType: 'assess',
                mwsAssessFeeEntity: this.dataForm
              }
            }).then(({ data }) => {
              if (data && data.code === 0) {
                this.$refs['dataForm'].resetFields()
                this.$emit('refreshDataList')
                this.visible = false
                this.$notify.success({
                  title: '成功',
                  message: '操作成功',
                  duration: 1500
                })
              } else {
                this.$notify.error({
                  title: '失败',
                  message: data.msg,
                  duration: 5000
                })
              }
            })
            // } else {
            //   this.$notify.info({
            //     title: '提示',
            //     message: `自定义SKU和SellerSKU必须至少有一个必填`,
            //     duration: 3000
            //   })
            // }
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

