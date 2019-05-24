<template>
  <el-dialog title="头程运费单价"
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
      <el-form-item label="国家"
                    prop="country">
        <select-all v-model="dataForm.country"
                    :listDataOption="countryOptions"
                    data-value="id"
                    data-label="name"></select-all>
      </el-form-item>
      <el-form-item label="自定义SKU"
                    prop="prodCode">
        <select-seach v-model="dataForm.prodCode"
                      httpUrl="/prod/prodbasic/queryForComplete"
                      httpMethod="get"
                      data-label-right='name_ch'
                      :showName='true'
                      requestParamsKey="code"
                      data-label="code"
                      data-value="code"
                      data-source="list"
                      :isSelectChange="true"
                      @selectChange="prodCodeChange"
                      @clearHandle='clearHandle'></select-seach>
      </el-form-item>
      <el-form-item label="产品名称"
                    prop="prodName">
        <el-input v-model="dataForm.prodName"
                  placeholder="由自定义sku带出"
                  :disabled="true"></el-input>
      </el-form-item>
      <el-form-item label="头程单价(人民币)"
                    prop="freightPrice">
        <el-input v-model="dataForm.freightPrice"
                  type="Number"
                  placeholder="请输入负数(保留两位小数)"></el-input>
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
      // 国家
      countryOptions: [],
      keyOptions: [],
      visible: false,
      dataForm: {
        yearMonth: '',
        country: '',
        prodCode: '',
        prodName: '',
        freightPrice: ''
      },
      dataRule: {
        yearMonth: [
          { required: true, message: '必填项', trigger: 'change' }
        ],
        country: [
          { required: true, message: '必填项', trigger: 'change' }
        ],
        prodCode: [
          { required: true, message: '必填项', trigger: 'change' }
        ],
        freightPrice: [
          { required: true, message: '必填项且为负数', trigger: 'blur' },
          { pattern: /^(-(([0-9]+\.\d{1,2})|([0-9]*[1-9][0-9]*\.\d{1,2})|([0-9]*[1-9][0-9]*)))$/, message: '请输入负数(保留两位小数)', trigger: 'blur' }
        ]
      }
    }
  },
  created () {
    this.$http
      .get(this.$http.adornUrl('dict/dictcountry/listcombobox')).then(({
        data
      }) => {
        this.countryOptions = data.list
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
            `fin/platformfee/info/${this.dataForm.id}/headfreight`
          ),
          method: 'get'
        }).then(({ data }) => {
          if (data && data.code === 0) {
            this.dataForm = Object.assign({}, data.mwsfreightFee, { updUserName: null, updTime: null, updUser: null })
          } else {
            this.$notify.error({
              title: '失败',
              message: data.msg,
              duration: 5000
            })
          }
        })
      }
    },
    // 选择中文名或者产品id，带出相应数据
    prodCodeChange (item) {
      console.log(item)

      this.$nextTick(() => {
        this.dataForm.prodName = item.name_ch
      })
    },
    clearHandle () {
      this.dataForm.prodName = ''
    },
    // 表单提交
    dataFormSubmit: _.debounce(
      async function dataFormSubmit () {
        this.$refs['dataForm'].validate(valid => {
          if (valid) {
            this.$http({
              url: this.$http.adornUrl(`fin/platformfee/${!this.dataForm.id ? 'save' : 'update'}`),
              method: !this.dataForm.id ? 'post' : 'put',
              data: {
                feeType: 'headfreight',
                mwsHeadfreightFeeEntity: this.dataForm
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
  // watch: {
  //   // 当前组件变动后，抛出事件
  //   dataForm: {
  //     // 深度监听，可监听到对象、数组的变化
  //     handler (val, oldVal) {
  //       this.$emit('input', this.dataForm) // 用于出发v-model原始事件，避免父级其他监听
  //     },
  //     deep: true
  //   }
  // }
}
</script>

