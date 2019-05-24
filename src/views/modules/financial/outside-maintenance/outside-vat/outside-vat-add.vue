<template>
  <el-dialog title="vat税点维护"
             :close-on-click-modal="false"
             :visible.sync="visible"
             :before-close="handleClose"
             width="30%">
    <el-form :model="dataForm"
             :rules="dataRule"
             ref="dataForm"
             label-width="110px">
      <el-form-item label="年/月"
                    prop="yearMonth">
        <el-date-picker v-model="dataForm.yearMonth"
                        type="month"
                        value-format="yyyy-MM"
                        placeholder="选择月">
        </el-date-picker>
      </el-form-item>
      <!-- <el-form-item label="店铺"
                    prop="channelId">
        <select-all v-model="dataForm.channelId"
                    :listDataOption="channelIdOptions"
                    data-value="id"
                    data-label="name"></select-all>
      </el-form-item> -->
      <el-form-item label="国家"
                    prop="country">
        <select-all v-model="dataForm.country"
                    :listDataOption="countryOptions"
                    data-value="id"
                    data-label="name"></select-all>
      </el-form-item>
      <el-form-item label="税点"
                    prop="taxPoint">
        <el-input v-model="dataForm.taxPoint"
                  placeholder="请输入负数并保留两位小数"></el-input>
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
      // 店铺
      // channelIdOptions: [],
      // 国家
      countryOptions: [],
      keyOptions: [],
      visible: false,
      dataForm: {
        yearMonth: '',
        // channelId: '',
        country: '',
        taxPoint: '',
        amount: ''
      },
      dataRule: {
        yearMonth: [
          { required: true, message: '必填项', trigger: 'change' }
        ],
        // channelId: [
        //   { required: true, message: '必填项', trigger: 'change' }
        // ],
        country: [
          { required: true, message: '必填项', trigger: 'change' }
        ],
        taxPoint: [
          { required: true, message: '必填项', trigger: 'blur' },
          { pattern: /^(-(([0-9]+\.\d{1,2})|([0-9]*[1-9][0-9]*\.\d{1,2})|([0-9]*[1-9][0-9]*)))$/, message: '请输入保留两位小数的负数', trigger: 'blur' }
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
      // this.$http
      // .get(this.$http.adornUrl('basic/basicchannel/listcombobox'), {
      //   params: {
      //     platformType: ''
      //   }
      // }).then(({
      //   data
      // }) => {
      //   this.channelIdOptions = data.list
      // })
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
              `fin/platformfee/info/${this.dataForm.id}/vat`
            ),
            method: 'get'
          }).then(({ data }) => {
            if (data && data.code === 0) {
              this.dataForm = Object.assign({}, data.mwsvatFee, { updUserName: null, updTime: null, updUser: null })
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
    // 表单提交
    dataFormSubmit: _.debounce(
      async function dataFormSubmit () {
        this.$refs['dataForm'].validate(valid => {
          if (valid) {
              this.$http({
                url: this.$http.adornUrl(
                  `fin/platformfee/${!this.dataForm.id ? 'save' : 'update'}`
                ),
                method: !this.dataForm.id ? 'post' : 'put',
                data: {
                  feeType: 'vat',
                  mwsVatFeeEntity: this.dataForm
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
}
</script>

