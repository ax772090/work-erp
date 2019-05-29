<template>
  <el-dialog :title="!dataForm.id ? '客户新增' : isClick === true ? '客户编辑' : '客户查看'"
             :close-on-click-modal="false"
             :visible.sync="visible"
             append-to-body
             width="50%"
             :before-close="handleClose"
             @close="$refs['dataForm'].resetFields()">
    <el-form :model="dataForm"
             :rules="dataRule"
             ref="dataForm"
             label-width="110px">
      <el-row>
        <el-col :span="12">
          <el-form-item label="来源平台"
                        prop="dictPlatformType">
            <select-all v-model="dataForm.dictPlatformType"
                        :listDataOption="dictPlatformTypeOptions"
                        data-value="key"
                        data-label="value"></select-all>
          </el-form-item>
          <el-form-item label="客户编码"
                        prop="code">
            <el-input v-model="dataForm.code"
                      :disabled="isDisabled"></el-input>
          </el-form-item>
          <el-form-item label="客户名称"
                        prop="name">
            <el-input v-model="dataForm.name"></el-input>
          </el-form-item>
          <el-form-item label="发票类型"
                        prop="dictInvoiceType">
            <select-all v-model="dataForm.dictInvoiceType"
                        :listDataOption="dictInvoiceTypeOptions"
                        data-value="key"
                        data-label="value"></select-all>
          </el-form-item>
          <el-form-item label="客户类型"
                        prop="dictCustomerType">
            <select-all v-model="dataForm.dictCustomerType"
                        :listDataOption="dictCustomerTypeOptions"
                        data-value="key"
                        data-label="value"></select-all>
          </el-form-item>
          <el-form-item label="客户等级"
                        prop="dictCustomerLevel">
            <select-all v-model="dataForm.dictCustomerLevel"
                        :listDataOption="dictCustomerLevelOptions"
                        data-value="key"
                        data-label="value"
                        placeholder="请选择客户等级"></select-all>
          </el-form-item>
          <el-form-item label="对应结算公司"
                        prop="ownerCompId">
            <select-all v-model="dataForm.ownerCompId"
                        :listDataOption="compIdOption"
                        data-value="orgId"
                        data-label="name"></select-all>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="所在国家"
                        prop="dictCountryId">
            <select-all v-model="dataForm.dictCountryId"
                        :listDataOption="dictCountryOptions"
                        data-value="id"
                        data-label="nameCn"
                        :isSelectChange="true"
                        @selectChange="dictCountryIdChange"
                        placeholder="请选择所在国家"></select-all>
          </el-form-item>
          <el-form-item label="城市"
                        prop="dictCityId">
            <select-all v-model="dataForm.dictCityId"
                        :listDataOption="dictCityOptions"
                        data-value="id"
                        data-label="name"></select-all>
          </el-form-item>
          <el-form-item label="地区"
                        prop="district">
            <el-input v-model="dataForm.district"></el-input>
          </el-form-item>
          <el-form-item label="邮政编码"
                        prop="postCode">
            <el-input v-model="dataForm.postCode"></el-input>
          </el-form-item>
          <el-form-item label="联系人"
                        prop="recipient">
            <el-input v-model="dataForm.recipient"></el-input>
          </el-form-item>
          <el-form-item label="邮箱"
                        prop="email">
            <el-input v-model="dataForm.email"></el-input>
          </el-form-item>
          <el-form-item label="联系电话"
                        prop="phone">
            <el-input v-model="dataForm.phone"></el-input>
          </el-form-item>
          <el-form-item label="详细地址"
                        prop="address">
            <textarea-all v-model="dataForm.address"></textarea-all>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
    <div slot="footer"
         class="dialog-footer">
      <el-button @click="visible = false"><i class="iconfont erp-icon-quxiao"></i>取消</el-button>
      <el-button type="primary"
                 @click="save()"
                 :disabled="isSave"><i class="iconfont erp-icon-baocun"></i>保存</el-button>
    </div>
  </el-dialog>
</template>
<script>
import selectSeach from '@/components/erp-select/select-seach'
import selectAll from '@/components/erp-select/select-all'
import { isEmail, isMobile } from '@/utils/validate'
// 备注
import textareaAll from '@/components/erp-input/textarea-all.vue'
export default {
  components: {
    selectSeach,
    selectAll,
    textareaAll
  },
  data () {
    var validateEmail = (rule, value, callback) => {
      var filter = /^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/
      if (!filter.test(value) && value) {
        callback(new Error('邮箱格式错误'))
      } else {
        callback()
      }
    }

    return {
      visible: false,
      isSave: true,
      isDisabled: false,
      isClick: false,
      exchangeRateTypeOptions: [], // 汇率类型
      dictPlatformTypeOptions: [], // 来源平台
      dictCountryOptions: [], // 所在国家
      compIdOption: [], // 对应结算公司
      dictCityOptions: [], // 城市
      dictCustomerTypeOptions: [], // 客户类型
      dictCustomerLevelOptions: [], // 客户等级
      dictInvoiceTypeOptions: [], // 发票类型
      isOne: false, // 第一次加载的判断
      dataForm: {
        id: '',
        dictPlatformType: '',
        dictCountryId: '',
        dictCityId: '',
        dictInvoiceType: '',
        dictCustomerType: '',
        ownerCompId: ''
      },
      dataRule: {
        code: [
          { required: true, message: '必填项', trigger: 'blur' } // 客户编码
        ],
        name: [
          { required: true, message: '必填项', trigger: 'blur' } // 客户名称
        ],
        email: [
          { required: false, trigger: 'blur' }, // 邮箱
          { validator: validateEmail, trigger: 'blur' } // 邮箱
        ]
      }
    }
  },
  created () {
    // 所在国家
    this.$http
      .get(this.$http.adornUrl('/basicData/queryAllCountry'))
      .then(({ data }) => {
        this.dictCountryOptions = data.countries
      })
    this.$nextTick(() => {
      this.comp() // 对应结算公司
      this.queryDataDict2List('PLANTFORM_TYPE') // 来源平台
      this.queryDataDict2List('CUSTOMER_TYPE') // 客户类型
      this.queryDataDict2List('CUSTOMER_LEVEL') // 客户等级
      this.queryDataDict2List('INVOICE_TYPE') // 发票类型
    })
  },
  methods: {
    // 查询数据字典
    queryDataDict2List (dataDictKey) {
      this.$http({
        url: this.$http.adornUrl('basicData/queryDataDict2List'),
        method: 'get',
        params: this.$http.adornParams({
          dataDictKey: dataDictKey
        })
      }).then(({ data }) => {
        if (data && data.code === 0) {
          if (dataDictKey == 'PLANTFORM_TYPE') {
            this.dictPlatformTypeOptions = data.fontMaps // 来源平台
          } else if (dataDictKey == 'CUSTOMER_TYPE') {
            this.dictCustomerTypeOptions = data.fontMaps // 客户类型
          } else if (dataDictKey == 'CUSTOMER_LEVEL') {
            this.dictCustomerLevelOptions = data.fontMaps // 客户等级
          } else if (dataDictKey == 'INVOICE_TYPE') {
            this.dictInvoiceTypeOptions = data.fontMaps // 发票类型
          }
        }
      })
    },
    // 结算公司
    comp () {
      this.$http
        .get(this.$http.adornUrl('sys/organization/select'))
        .then(({ data }) => {
          this.compIdOption = data.companyList
        })
    },
    // 城市
    areaOptionsSelect (val, type) {
      if (type) {
        this.$http({
          url: this.$http.adornUrl('basicData/queryCityByCountry'),
          method: 'get',
          params: this.$http.adornParams(
            {
              countryId: val
            },
            false
          )
        }).then(({ data }) => {
          this.dictCityOptions = data.cities
        })
      } else {
        this.dataForm.dictCityId = ''
        this.$http({
          url: this.$http.adornUrl('basicData/queryCityByCountry'),
          method: 'get',
          params: this.$http.adornParams(
            {
              countryId: val
            },
            false
          )
        }).then(({ data }) => {
          this.dictCityOptions = data.cities
        })
      }
    },
    // 国家改变
    dictCountryIdChange (val) {
      if (!this.dataForm.id || this.isOne) {
      } else {
        this.isOne = false
      }
      this.areaOptionsSelect(val)
    },
    // 编辑页面
    editor (type) {
      // 编辑时，锁定客户编码
      if (this.dataForm.id && type === 'canEdit') {
        this.isClick = true
        this.isDisabled = true
        this.isSave = false
      }
    },
    // 新增页面
    add () {
      if (!this.dataForm.id) {
        this.isSave = false
        this.isDisabled = false
      }
    },
    // 取消按钮
    cancel (formName) {
      this.clearCache(formName)
    },
    // 关闭清除本次缓存
    clearCache (formName) {
      this.$refs[formName].resetFields()
      this.dataForm = {}
      this.visible = false
    },
    // 弹窗关闭之前
    handleClose (done) {
      this.clearCache('dataForm')
      done()
    },
    init (id, type) {
      this.dataForm.addTime = ''
      this.dataForm.addUser = ''
      this.dataForm.updTime = ''
      this.dataForm.updUser = ''
      this.dictCityOptions = []
      this.isOne = true
      this.visible = true
      this.dataForm.id = id
      this.$nextTick(() => {
        this.editor(type)
        this.add()
      })
      this.$nextTick(() => {
        if (this.dataForm.id) {
          this.$http({
            url: this.$http.adornUrl(`basic/customer/info/${this.dataForm.id}`),
            method: 'get'
          }).then(({ data }) => {
            if (data && data.code === 0) {
              this.dataForm = data.basicCustomer
              this.areaOptionsSelect(this.dataForm.dictCountryId, 'init')
            } else {
              this.$notify.error({
                title: '错误',
                message: data.msg,
                duration: 3000
              })
            }
          })
        }
      })
    },
    // 保存
    save: _.debounce(
      async function save () {
        this.$refs['dataForm'].validate(valid => {
          if (valid) {
            // 编辑时，锁定客户编码，客户名称不做校验;新增时，校验客户名称是否相同
            if (!this.dataForm.id) {
              this.$http({
                url: this.$http.adornUrl('basic/customer/list'),
                method: 'get',
                params: { name: this.dataForm.name }
              }).then(({ data }) => {
                if (data && data.code === 0) {
                  if (data.pageList.dataList.length > 0) {
                    this.$confirm(
                      '存在重复的客户名称，是否继续保存？',
                      '提示',
                      {
                        confirmButtonText: '确定',
                        cancelButtonText: '取消',
                        type: 'warning'
                      }
                    ).then(() => {
                      this.$http({
                        url: this.$http.adornUrl('basic/customer/save'),
                        method: 'post',
                        data: this.dataForm
                      }).then(({ data }) => {
                        if (data && data.code === 0) {
                          this.visible = false
                          this.$notify({
                            type: 'success',
                            title: '提示',
                            message: '新增',
                            duration: 3000
                          })
                          this.$emit('refreshDataList')
                        } else {
                          this.$notify.error({
                            title: '错误',
                            message: data.msg,
                            duration: 3000
                          })
                        }
                      })
                    })
                    // 如果dataList.length = 0，则不存在客户的名称相同，直接可以保存
                  } else {
                    this.$http({
                      url: this.$http.adornUrl('basic/customer/save'),
                      method: 'post',
                      data: this.dataForm
                    }).then(({ data }) => {
                      if (data && data.code === 0) {
                        this.visible = false
                        this.$notify({
                          type: 'success',
                          title: '提示',
                          message: '新增成功',
                          duration: 3000
                        })
                        this.$emit('refreshDataList')
                      } else {
                        this.$notify.error({
                          title: '错误',
                          message: data.msg,
                          duration: 3000
                        })
                      }
                    })
                  }
                  // 请求失败
                } else {
                  this.$notify.error({
                    title: '错误',
                    message: data.msg,
                    duration: 3000
                  })
                }
              })
              // 编辑时不用校验客户的名称是否相同
            } else {
              this.$http({
                url: this.$http.adornUrl('basic/customer/update'),
                method: 'put',
                data: this.dataForm
              }).then(({ data }) => {
                if (data && data.code === 0) {
                  this.visible = false
                  this.$notify({
                    type: 'success',
                    title: '提示',
                    message: '修改成功',
                    duration: 3000
                  })
                  this.$emit('refreshDataList')
                } else {
                  this.$notify.error({
                    title: '错误',
                    message: data.msg,
                    duration: 3000
                  })
                }
              })
            }
          }
        })
      }, 1000, {
        leading: true,
        trailing: false
      }
    )
  }
}
</script>
