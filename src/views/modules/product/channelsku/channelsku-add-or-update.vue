<template>
  <el-dialog :title="!dataForm.id ? '渠道SKU新增' : '渠道SKU修改'"
             :close-on-click-modal="false"
             :visible.sync="visible"
             :before-close="handleClose"
             @close="$refs['dataForm'].resetFields()">
    <el-form :model="dataForm"
             :rules="dataRule"
             ref="dataForm"
             label-width="110px">
      <el-row>
        <el-col :span="12">
          <el-form-item label="销售平台"
                        prop="dictSalePlatform">
            <select-all v-model="dataForm.dictSalePlatform"
                        :listDataOption="dictSalePlatformOptions"
                        data-value="key"
                        data-label="value"
                        placeholder="销售平台"
                        :isSelectChange="true"
                        @selectChange="selectChange"></select-all>
          </el-form-item>
          <el-form-item label="ASIN"
                        prop="asin">
            <el-input v-model.trim="dataForm.asin"
                      :disabled="isUpdate"
                      placeholder="店铺商品Id"></el-input>
          </el-form-item>
          <el-form-item label="产品编码"
                        prop="prodId">
            <select-seach :isDisabled="isUpdate"
                          v-model="dataForm.prodId"
                          httpUrl="/prod/prodbasic/queryForComplete"
                          httpMethod="get"
                          data-label-right='name_ch'
                          :showName='true'
                          requestParamsKey="code"
                          data-label="code"
                          data-value="id"
                          data-source="list"
                          :isSelectChange="true"
                          @selectChange="prodCodeChange"></select-seach>
          </el-form-item>
          <el-form-item label="销售人员"
                        prop="saleUserId">
            <select-seach v-model="dataForm.saleUserId"
                          httpUrl="/list/search/user"
                          httpMethod="get"
                          requestParamsKey="name"
                          data-label="name"
                          data-value="id"
                          data-source="list"
                          :listDataOptionStatic="userOptions"></select-seach>
          </el-form-item>
          <el-form-item label="FNSKU"
                        prop="fnsku">
            <el-input v-model.trim="dataForm.fnsku"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="渠道来源"
                        prop="channelId">
            <select-all v-model="dataForm.channelId"
                        :listDataOption="channelIdOptions"
                        :isDisabled="isUpdate"
                        data-value="id"
                        data-label="name"></select-all>
          </el-form-item>
          <el-form-item label="SellSKU"
                        prop="channelSku">
            <el-input v-model.trim="dataForm.channelSku"
                      :disabled="isUpdate"
                      placeholder="店铺商品名称"></el-input>
          </el-form-item>
          <el-form-item label="产品中文名"
                        prop="nameCh">
            <el-input v-model="dataForm.nameCh"
                      :disabled="true"></el-input>
          </el-form-item>
          <el-form-item label="销售类型"
                        prop="dictSaleType">
            <select-all v-model="dataForm.dictSaleType"
                        :listDataOption="dictSaleTypeOptions"
                        :isDisabled="isUpdate"
                        data-value="key"
                        data-label="value"></select-all>
          </el-form-item>
          <el-form-item label="配送方式">
            <el-radio-group v-model="dataForm.shippingMethod">
              <el-radio label="01">自配送</el-radio>
              <el-radio label="02">平台配送</el-radio>
            </el-radio-group>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
    <span slot="footer"
          class="dialog-footer">
      <el-button @click="cancel('dataForm')"><i class="iconfont erp-icon-quxiao"></i>取消</el-button>
      <el-button type="primary"
                 @click="dataFormSubmit()"><i class="iconfont erp-icon-queding"></i>确定</el-button>
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
      visible: false,
      isUpdate: false,
      // 销售品台
      dictSalePlatformOptions: [],
      // 渠道来源
      channelIdOptions: [],
      // 销售人员
      userOptions: [],
      // 销售类型
      dictSaleTypeOptions: [],

      // 产品列表
      prodDataList: [],
      // 产品编码
      idsData: {},
      dataForm: {
        id: '',
        dictSalePlatform: '01',
        channelId: '',
        channelSku: '',
        asin: '',
        prodId: '',
        code: '',
        fnsku: '',
        saleUserId: '',
        dictSaleType: '',
        upc: '',
        ean: '',
        nameCh: '',
        // 配送方式
        shippingMethod: '02'
      },
      dataRule: {
        channelId: [
          { required: true, message: '渠道来源不能为空', trigger: 'change' }
        ],
        channelSku: [
          { required: true, message: '店铺商品名称不能为空', trigger: 'blur' }
        ],
        asin: [
          { required: true, message: '店铺商品Id不能为空', trigger: 'blur' }
        ],
        prodId: [
          { required: true, message: '必填项', trigger: 'change' }
        ],
        saleUserId: [
          { required: true, message: '必填项', trigger: 'change' }
        ],
        nameCh: [
          { required: true, message: '必填项', trigger: 'change' }
        ]
      }
    }
  },
  methods: {
    // 要货平台下的店铺
    selectChange (value, type) {
      if (type) {
        this.$http
          .get(this.$http.adornUrl('basic/basicchannel/listcombobox'), {
            params: { platformType: value }
          })
          .then(({ data }) => {
            this.channelIdOptions = data.list
          })
      } else {
        this.dataForm.channelId = ''
        this.$http
          .get(this.$http.adornUrl('basic/basicchannel/listcombobox'), {
            params: { platformType: value }
          })
          .then(({ data }) => {
            this.channelIdOptions = data.list
          })
      }
    },
    // 取消按钮
    cancel (formName) {
      this.clearCache(formName)
    },
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
    init (id, type) {
      this.visible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].resetFields()
      })
      // 销售平台
      this.queryDataDict2List('PLANTFORM_TYPE')
      if (id === undefined) {
        this.dataForm.shippingMethod = '02'
        this.prodDataList = []
        // 渠道来源
        this.selectChange(this.dataForm.dictSalePlatform)
      }
      // 销售类型
      this.queryDataDict2List('SALE_TYPE')
      this.dataForm.id = id
      this.isUpdate = false
      this.dataForm.prodId = ''
      this.dataForm.prodCode = ''
      this.dataForm.nameCh = ''
      if (id) {
        this.$nextTick(() => {
          if (this.dataForm.id) {
            this.$http({
              url: this.$http.adornUrl(
                `prod/prodchannelsku/info/${this.dataForm.id}`
              ),
              method: 'get',
              params: this.$http.adornParams()
            }).then(({ data }) => {
              if (data && data.code === 0) {
                this.dataForm = data.prodChannelSku
                this.dataForm.prodId = data.prodChannelSku.prodId
                this.$set(this.dataForm, 'nameCh', data.prodChannelSku.prodName)
                this.selectChange(this.dataForm.dictSalePlatform, id)
              }
            })
          }
        })
      }
    },

    // 查数据字典--销售类型
    queryDataDict2List (dictionaries) {
      this.$http({
        url: this.$http.adornUrl('basicData/queryDataDict2List'),
        method: 'get',
        params: this.$http.adornParams({
          dataDictKey: dictionaries
        }, false)
      }).then(({ data }) => {
        if (data && data.code === 0) {
          if (dictionaries === 'SALE_TYPE') {
            this.dictSaleTypeOptions = data.fontMaps
          } else if (dictionaries === 'PLANTFORM_TYPE') {
            this.dictSalePlatformOptions = data.fontMaps
          }
        }
      })
    },

    // 选择中文名或者产品id，带出相应数据
    prodCodeChange (val) {
      console.log('aa', val)

      this.$nextTick(() => {
        this.dataForm.code = val.code
        this.dataForm.nameCh = val.name_ch
        this.dataForm.prodId = val.id
      })
    },
    // 表单提交
    dataFormSubmit: _.debounce(
      async function dataFormSubmit () {
        this.$refs['dataForm'].validate(valid => {
          if (valid) {
            if (!this.dataForm.id) {
              this.dataForm.addTime = ''
              this.dataForm.addUser = ''
              this.dataForm.updTime = ''
              this.dataForm.updUser = ''
            }
            this.$http({
              url: this.$http.adornUrl(
                `prod/prodchannelsku/${!this.dataForm.id ? 'save' : 'update'}`
              ),
              method: !this.dataForm.id ? 'post' : 'put',
              data: this.dataForm
            }).then(({ data }) => {
              if (data && data.code === 0) {
                this.clearCache('dataForm')
                this.$emit('refreshDataList')
                this.$notify.success({
                  title: '成功',
                  message: '操作成功',
                  duration: 5000
                })
              } else {
                this.$notify.error({
                  title: '错误',
                  message: data.msg,
                  duration: 5000
                })
              }
            })
          } else {
            return false
          }
        })
      }, 1000, {
        leading: true,
        trailing: false
      }
    )
  },
  watch: {
    // 当前组件变动后，抛出事件
    dataForm: {
      // 深度监听，可监听到对象、数组的变化
      handler (val, oldVal) {
        this.$emit('input', this.dataForm) // 用于出发v-model原始事件，避免父级其他监听
      },
      deep: true
    }
  }
}
</script>