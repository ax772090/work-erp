<template>
  <el-dialog :title="!dataForm.id ? '渠道新增' : '渠道修改'"
             width="50%"
             :close-on-click-modal="false"
             :visible.sync="visible"
             :before-close="handleClose">
    <el-form :model="dataForm"
             :rules="dataRule"
             ref="dataForm"
             label-width="130px">
      <el-row>
        <el-col :span="12">
          <el-form-item label="销售公司"
                        prop="compId">
            <select-all v-model="dataForm.compId"
                        :listDataOption="compIdOptions"
                        data-value="id"
                        data-label="name"></select-all>
          </el-form-item>
          <el-form-item label="店铺代码"
                        prop="code">
            <el-input v-model="dataForm.code"></el-input>
          </el-form-item>
          <el-form-item label="SellerID"
                        prop="sellerId">
            <el-input v-model="dataForm.sellerId"></el-input>
          </el-form-item>
          <el-form-item label="店铺名称"
                        prop="name">
            <el-input v-model="dataForm.name"></el-input>
          </el-form-item>
          <el-form-item label="指定仓库"
                        prop="warehouseId">
            <div class="form-item-row">
              <select-all v-model="dataForm.warehouseId"
                          :listDataOption="warehouseIdOptions"
                          data-value="id"
                          data-label="name"></select-all>
              <question-icon :messages="messages"></question-icon>
            </div>
          </el-form-item>
          <el-form-item label="隶属平台"
                        prop="dictPlantformType">
            <select-all v-model="dataForm.dictPlantformType"
                        :listDataOption="dictPlantformTypeOptions"
                        data-value="key"
                        data-label="value"></select-all>
          </el-form-item>
          <el-form-item label="选择市场"
                        prop="market"
                        :rules="dataForm.dictPlantformType === '01'?[{ required: true, message: '市场不能为空', trigger: 'change' }]:[{ required: false, message: '', trigger: 'change' }]">
            <select-all v-model="dataForm.market"
                        :listDataOption="marketOptions"
                        data-value="id"
                        data-label="displayName"
                        :isSelectChange="true"
                        @selectChange="marketChangeHandle"></select-all>
            <el-button @click="authUrlFn()"
                       class="a-click-hover"
                       type="text"
                       :disabled="true">登录Amazon完成授权</el-button>
          </el-form-item>
          <el-form-item label="所属国家"
                        prop="countryId">
            <select-all v-model="dataForm.countryId"
                        :listDataOption="belongCountryOptions"
                        data-value="id"
                        data-label="nameCn"></select-all>
          </el-form-item>

        </el-col>
        <el-col :span="12">
          <el-form-item label="授权的开发者账号"
                        prop="depAccount">
            <el-input v-model="dataForm.depAccount"
                      :disabled="true"></el-input>
          </el-form-item>
          <el-form-item label="开发者账号昵称"
                        prop="depName">
            <el-input v-model="dataForm.depName"
                      :disabled="true"></el-input>
          </el-form-item>
          <el-form-item label="主账号邮箱"
                        prop="mainEmail">
            <el-input v-model="dataForm.mainEmail"></el-input>
          </el-form-item>
          <el-form-item label=""
                        prop="copyChecked">
            <el-checkbox v-model="dataForm.copyChecked"
                         @change="supportEmailChange">同主账号邮箱</el-checkbox>
          </el-form-item>
          <el-form-item label="客服邮箱"
                        prop="supportEmail">
            <el-input v-model="dataForm.supportEmail"
                      :disabled="emailDisabled"></el-input>
          </el-form-item>
          <el-form-item label="授权token"
                        prop="mwsToken">
            <el-input type="password"
                      v-model="dataForm.mwsToken"></el-input>
          </el-form-item>
          <el-form-item label="店铺负责人"
                        prop="inChargeOf">
            <select-seach v-model="dataForm.inChargeOf"
                          httpUrl="list/search/user"
                          requestParamsKey="name"
                          httpMethod="get"
                          data-label="name"
                          data-value="id"
                          data-source="list"></select-seach>
          </el-form-item>
          <el-form-item label="备注"
                        prop="remarks">
            <textarea-all v-model="dataForm.remarks"></textarea-all>
          </el-form-item>
          <el-form-item label="状态"
                        prop="bUsed">
            <el-radio-group v-model="dataForm.bUsed">
              <el-radio :label="true">正常</el-radio>
              <el-radio :label="false">禁用</el-radio>
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
// 备注组件
import textareaAll from '@/components/erp-input/textarea-all'
import { basicChannelSave, basicChannelUpdate, basicChannelInfo } from '@/api/basic/basic'
import { listComboboxCompany, basecBasicwarehouseQuerywhbyproperty, dictPlantformType, basicdataQueryallcountry, mwsdatamwsauthorize } from '@/api/common/common.api'
export default {
  components: {
    selectSeach,
    selectAll,
    textareaAll
  },
  data () {
    return {
      emailDisabled: false,
      // 授权地址
      authUrlMarket: '',
      // 销售公司
      compIdOptions: [],
      // 仓库
      warehouseIdOptions: [],
      // 隶属平台
      dictPlantformTypeOptions: [],
      // 所属国家
      belongCountryOptions: [],
      // 市场
      marketOptions: [],
      visible: false,
      messages:
        '针对亚马逊：以店铺为单位建立一个对应的仓库,本地需要记录有授权的店铺的出入库信息及库存',
      dataForm: {
        marketPlaceId: '',
        sellerId: '',
        compId: '',
        market: '',
        warehouseId: '',
        countryId: '',
        depAccount: '',
        depName: '',
        mainEmail: '',
        mwsToken: null,
        inChargeOf: '',
        id: '',
        code: '',
        name: '',
        dictPlantformType: '',
        remarks: '',
        bUsed: true,
        // 同上
        copyChecked: false
      },
      dataRule: {
        sellerId: [
          { required: true, message: '必填项', trigger: 'blur' }
        ],
        code: [
          { required: true, message: '店铺代码不能为空', trigger: 'blur' }
        ],
        name: [
          { required: true, message: '店铺名称不能为空', trigger: 'blur' }
        ],
        dictPlantformType: [
          { required: true, message: '平台不能为空', trigger: 'change' }
        ],
        countryId: [
          { required: true, message: '必填项', trigger: 'change' }
        ]
      }
    }
  },
  created () {
    // 销售公司
    listComboboxCompany().then(data => { this.compIdOptions = data.list })
    // 仓库过滤
    basecBasicwarehouseQuerywhbyproperty({ property: 'FBA' }).then(data => { this.warehouseIdOptions = data.list })
    // 隶属平台
    dictPlantformType().then(data => { this.dictPlantformTypeOptions = data.fontMaps })
    // 国家
    basicdataQueryallcountry().then(data => { this.belongCountryOptions = data.countries })
    // 市场
    mwsdatamwsauthorize().then(data => { this.marketOptions = data.mwsAuthorize })
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

    // 授权
    authUrlFn () {
      window.open(`http://3.sellingexpress.net:9011/ERP/WebPages/SystemMange/AmazonMWSGenerateAuthUrl.aspx?MarketPlaceName=${this.authUrlMarket}`)
    },

    // 市场改变
    marketChangeHandle (val) {
      for (const item of this.marketOptions) {
        if (item.id === val) {
          this.dataForm.depAccount = item.depAccount
          this.authUrlMarket = item.displayName
          this.dataForm.depName = item.depName
          this.dataForm.accessKey = item.accessKey
          this.dataForm.secretKey = item.secretKey
          this.dataForm.marketPlaceId = item.marketPlaceId
          break
        }
      }
    },

    // 同上
    supportEmailChange (val) {
      this.$nextTick(() => {
        if (val) {
          this.dataForm.supportEmail = this.dataForm.mainEmail
          this.emailDisabled = true
        } else {
          this.emailDisabled = false
        }
      })
    },
    init (id, type) {
      this.dataForm.addTime = ''
      this.dataForm.addUser = ''
      this.dataForm.updTime = ''
      this.dataForm.updUser = ''
      this.emailDisabled = false
      // 初始化清掉缓存
      this.dataForm = {
        compId: '',
        marketPlaceId: '',
        market: '',
        warehouseId: '',
        countryId: '',
        sellerId: '',
        depAccount: '',
        depName: '',
        mainEmail: '',
        mwsToken: null,
        inChargeOf: '',
        code: '',
        name: '',
        dictPlantformType: '',
        remarks: '',
        bUsed: true,
        // 同上
        copyChecked: false
      }
      this.visible = true
      this.dataForm.id = id
      this.$nextTick(() => {
        this.$refs['dataForm'].resetFields()
        if (this.dataForm.id) {
          basicChannelInfo(this.dataForm.id, true).then((data) => {
            this.dataForm = data.basicChannel
          }).catch((error) => {
            this.$notify.error({
              title: '错误',
              message: error.msg,
              duration: 5000
            })
          })
        }
      })
    },

    // 新增/编辑
    basicchannelHttp () {
      // 新增
      if (!this.dataForm.id) {
        basicChannelSave(this.dataForm).then((data) => {
          this.$emit('refreshDataList')
          this.visible = false
          this.$notify.success({
            title: '成功',
            message: '操作成功',
            duration: 1500
          })
        }).catch((error) => {
          this.$notify.error({
            title: '错误',
            message: error.msg,
            duration: 5000
          })
        })
      }

      // 编辑
      if (this.dataForm.id) {
        basicChannelUpdate(this.dataForm).then((data) => {
          this.$emit('refreshDataList')
          this.visible = false
          this.$notify.success({
            title: '成功',
            message: '操作成功',
            duration: 1500
          })
        }).catch((error) => {
          this.$notify.error({
            title: '错误',
            message: error.msg,
            duration: 5000
          })
        })
      }
    },

    // 表单提交
    dataFormSubmit: _.debounce(
      async function dataFormSubmit () {
        this.$refs['dataForm'].validate(valid => {
          if (valid) {
            // 验证邮箱格式
            if (this.dataForm.mainEmail) {
              var filter = /^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/
              if (!filter.test(this.dataForm.mainEmail.trim())) {
                this.$notify.error({
                  title: '错误',
                  message: '主账号邮箱格式错误',
                  duration: 5000
                })
                return
              }
            };
            if (this.dataForm.supportEmail) {
              var filter = /^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/
              if (!filter.test(this.dataForm.supportEmail.trim())) {
                this.$notify.error({
                  title: '错误',
                  message: '客服邮箱格式错误',
                  duration: 5000
                })
                return
              }
            };
            if (!this.dataForm.mwsToken) {
              this.$confirm(`建议输入[授权Token],确定该账号没有token吗？`, '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
              }).then(() => {
                this.basicchannelHttp()
              }).catch(() => {
              })
            } else {
              this.basicchannelHttp()
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
