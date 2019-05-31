<template>
  <el-dialog :title="dialogTitle"
             :close-on-click-modal="false"
             :visible.sync="formVisible"
             v-if="formVisible"
             width="60%">
    <!-- 审核头 -->
    <approval-new v-model="approvalData"
                  v-if='isApproval'></approval-new>
    <el-tabs v-model="activeName"
             type="border-card"
             @tab-click="elTabClick"
             :before-leave="beforeLeave">
      <el-tab-pane v-if="tabs[0].isAuth"
                   :name="tabs[0].tabname"
                   :disabled="!dataForm.id && maxTabIndex<0">
        <span slot="label">
          <i class="el-icon-date"></i>基本信息
        </span>
        <proddev-basic v-model="dataForm.prodDevBasicEntity"
                       :ref="tabs[0].refname"
                       @change="dataChanged"
                       @nextStep="nextStep"></proddev-basic>
      </el-tab-pane>
      <el-tab-pane v-if="tabs[1].isAuth"
                   :name="tabs[1].tabname"
                   :disabled="!dataForm.id && maxTabIndex<1">
        <span slot="label">
          <i class="el-icon-date"></i>规格信息
        </span>
        <proddev-skuparams v-model="dataForm.skuParams"
                           :ref="tabs[1].refname"
                           @change="dataChanged"
                           @nextStep="nextStep"></proddev-skuparams>
      </el-tab-pane>
      <el-tab-pane v-if="tabs[2].isAuth"
                   :name="tabs[2].tabname"
                   :disabled="!dataForm.id && maxTabIndex<2">
        <span slot="label">
          <i class="el-icon-date"></i>辅助信息
        </span>
        <proddev-support v-model="dataForm.prodDevSupportEntity"
                         :ref="tabs[2].refname"
                         @change="dataChanged"
                         @nextStep="nextStep"></proddev-support>
      </el-tab-pane>
      <el-tab-pane v-if="tabs[3].isAuth"
                   :name="tabs[3].tabname"
                   :disabled="!dataForm.id && maxTabIndex<3">
        <span slot="label">
          <i class="el-icon-date"></i>销售相关
        </span>
        <devPriceInfoEntity v-model="dataForm.devPriceInfoEntity"
                            :ref="tabs[3].refname"
                            @change="dataChanged"
                            @nextStep="nextStep"></devPriceInfoEntity>
      </el-tab-pane>
      <el-tab-pane v-if="tabs[4].isAuth"
                   :name="tabs[4].tabname"
                   :disabled="!dataForm.id && maxTabIndex<4">
        <span slot="label">
          <i class="el-icon-date"></i>报关信息
        </span>
        <proddev-customs v-model="dataForm.basicCustomsEntity"
                         :ref="tabs[4].refname"
                         @change="dataChanged"
                         @nextStep="nextStep"></proddev-customs>
      </el-tab-pane>
      <el-tab-pane v-if="tabs[5].isAuth"
                   :name="tabs[5].tabname"
                   :disabled="!dataForm.id && maxTabIndex<5">
        <span slot="label">
          <i class="el-icon-date"></i>组合SKU
        </span>
        <proddev-items v-model="dataForm.prodDevItemsEntityList"
                       :ref="tabs[5].refname"
                       @change="dataChanged"
                       @nextStep="nextStep"></proddev-items>
      </el-tab-pane>
      <el-tab-pane v-if="tabs[6].isAuth"
                   :name="tabs[6].tabname"
                   :disabled="!dataForm.id && maxTabIndex<6">
        <span slot="label">
          <i class="el-icon-date"></i>产品附件
        </span>
        <proddev-attachments v-model="dataForm.fileIds"
                             :ref="tabs[6].refname"
                             @change="dataChanged"
                             @nextStep="nextStep"></proddev-attachments>
      </el-tab-pane>
      <el-tab-pane v-if="tabs[7].isAuth"
                   :name="tabs[7].tabname"
                   :disabled="!dataForm.id && maxTabIndex<7">
        <span slot="label">
          <i class="el-icon-date"></i>产品证书
        </span>
        <proddev-certificate v-model="dataForm.cerIds"
                             :ref="tabs[7].refname"
                             @change="dataChanged"
                             @nextStep="nextStep"></proddev-certificate>
      </el-tab-pane>
    </el-tabs>
    <span slot="footer">
      <el-button @click="formVisible=false"><i class="iconfont erp-icon-quxiao"></i>取消</el-button>
      <el-button v-if="isAdd"
                 type="primary"
                 @click="nextStepValidate()">{{activeName === tabnameArr[tabnameArr.length-1] ? '一键保存' : '下一步'}}</el-button>
      <el-button v-else-if="isAdd || isEdit || isApproval"
                 type="primary"
                 @click="saveNext()"><i class="iconfont erp-icon-baocun"></i>{{activeName === tabnameArr[tabnameArr.length-1] ? '保存' : '保存'}}</el-button>
      <el-button v-if="isApproval"
                 type="primary"
                 @click="approvalHander()"><i class="iconfont erp-icon-queding"></i>审核</el-button>
    </span>
  </el-dialog>
</template>
<script>
// 基本信息
import proddevBasic from './proddev-basic'
// 规格信息
import proddevSkuparams from './proddev-skuparams'
// 辅助信息
import proddevSupport from './proddev-support'
// 价格信息
import devPriceInfoEntity from './proddev-priceinfo'
// 报关信息
import proddevCustoms from './proddev-customs'
// 组合信息
import proddevItems from './proddev-items'
// 附件信息
import proddevAttachments from './proddev-attachments'
// 证书信息
import proddevCertificate from './proddev-certificate'
import approvalNew from '@/components/workflow/approval-new'
// import { isEmail, isMobile } from '@/utils/validate'
// 消息中心跳转
import { getUrl, getRequest, hasTypeOf } from '@/utils'
export default {
  name: 'proddev-Tabs',
  props: ['value'],

  components: {
    proddevBasic,
    proddevSkuparams,
    proddevSupport,
    devPriceInfoEntity,
    proddevCustoms,
    proddevItems,
    proddevAttachments,
    proddevCertificate,
    approvalNew
  },

  data () {
    return {
      dialogTitle: '',
      handleType: '',
      isApproval: false,
      isCheck: false,
      isAdd: false,
      isEdit: false,
      formVisible: false,
      // 1基本信息,2规格信息,3辅助信息,4/5价格信息,7组合sku,8图片,9附件,10证书
      tabs: [{
        tabname: 'proddevBasic',
        refname: 'proddevBasic',
        updateType: '1',
        type: '1',
        isAuth: true
      }, {
        tabname: 'proddevskuParams',
        refname: 'proddevskuParams',
        updateType: '2',
        type: '2',
        isAuth: true
      }, {
        tabname: 'proddevSupport',
        refname: 'proddevSupport',
        updateType: '3',
        type: '3',
        isAuth: true
      }, {
        tabname: 'devPriceInfoEntity',
        refname: 'devPriceInfoEntity',
        updateType: '4',
        type: '4',
        isAuth: this.isAuth('proddev:prodsale:info')
      }, {
        tabname: 'proddevCustoms',
        refname: 'proddevCustoms',
        updateType: '1',
        type: '1',
        isAuth: true
      }, {
        tabname: 'proddevItems',
        refname: 'proddevItems',
        updateType: '7',
        type: '7',
        isAuth: true
      }, {
        tabname: 'proddevAttachments',
        refname: 'proddevAttachments',
        updateType: '9',
        type: '9',
        isAuth: this.isAuth('proddev:basicattachment:info')
      }, {
        tabname: 'proddevcertificate',
        refname: 'proddevcertificate',
        updateType: '10',
        type: '10',
        isAuth: this.isAuth('proddev:prodcertificates:info')
      }
      ],

      refs: [
        'proddevBasic',
        'proddevskuParams',
        'proddevSupport',
        // 价格信息
        'devPriceInfoEntity',

        'proddevCustoms',
        'proddevItems',
        'proddevAttachments',
        'proddevcertificate'
      ],
      activeName: 'proddevBasic',
      maxTabIndex: 0,

      // 当前页数据
      curFormData: {},

      dataForm: {
        id: '',
        // 基本信息
        prodDevBasicEntity: {},
        // 规格
        skuParams: {},
        // 辅助信息
        prodDevSupportEntity: {},
        // 价格信息
        devPriceInfoEntity: {
          // 采购相关数据
          prodDevPurchaseEntityList: [],
          // 销售相关数据
          prodDevSaleEntityList: []
        },
        // 产品图片
        imageId: '',
        // 附件
        fileIds: [],
        // 证书
        cerIds: [],
        // 报关信息
        basicCustomsEntity: {},
        // 组合sku
        prodDevItemsEntityList: []
      },
      // 当前行数据
      rowList: {},
      // 审核数据
      approvalData: {},
      // 提取数据的tabname
      tabnameArr: [],
      // 提取死数据的其中type
      refTypeArr: [],
      // 提取数据的updateType
      refupdateTypeArr: [],
      // 提取数据的其中name
      refnameArr: []
    }
  },
  created () {
    this.activeName = 'proddevBasic'
  },
  mounted () {
    this.dataProcessing()
  },
  methods: {
    // 初始化
    init (id, type, row) {
      this.activeName = 'proddevBasic'
      this.rowList = row
      this.formVisible = true
      this.maxTabIndex = 0
      this.dataForm.id = id
      this.handleType = type
      this.isApproval = false
      this.isCheck = false
      this.isAdd = false
      this.isEdit = false
      this.$nextTick(() => {
        this.activeName = 'proddevBasic'
        this.dataProcessing()
        this.prodbasicAddOrUpsHandle(this.dataForm.id, this.handleType)
      })

      // 新增
      if (type === 'canAdd') {
        hasTypeOf(this.dataForm)
        this.dialogTitle = '新品开发立项(新增)'
        this.isAdd = true
        for (const element of this.tabs) {
          element.isAuth = true
        }
      }

      // 编辑
      if (type === 'canEdit') {
        this.dialogTitle = '新品开发立项(修改)'
        this.isEdit = true
      }

      // 查看
      if (type === 'canCheck') {
        this.dialogTitle = '新品开发立项(查看)'
        this.isCheck = true
      }

      // 审核
      if (type === 'canApproval') {
        this.dialogTitle = '新品开发立项(审核)'
        this.isApproval = true
        let isShowNode2 = true
        if (row.node && row.node === 'T01') {
          isShowNode2 = false
        }
        this.approvalData = {
          taskId: row.taskId,
          node: row.node,
          processKey: 'prod_dev_basic',
          businessId: row.id,
          operation: '1',

          routeUrl: getUrl(),
          code: row.prodCode,
          docName: '新品开发单',
          comments: '',
          isShowNode2: isShowNode2
        }
      }
    },

    // 处理数据,提出数据
    dataProcessing () {
      this.tabnameArr = []
      this.refTypeArr = []
      this.refnameArr = []
      this.refupdateTypeArr = []
      for (var i = 0; i < this.tabs.length; i++) {
        // if (this.tabs[i].hasOwnProperty('type')) {
        if (this.tabs[i].isAuth) {
          this.tabnameArr.push(this.tabs[i].tabname)
          this.refTypeArr.push(this.tabs[i].type)
          this.refnameArr.push(this.tabs[i].refname)
          this.refupdateTypeArr.push(this.tabs[i].updateType)
        }
      }
    },

    // 保存并且下一步
    saveNext () {
      this.$nextTick(() => {
        this.$refs[this.activeName].dataFormSubmit(this.dataForm.id, this.refupdateTypeArr[this.refnameArr.indexOf(this.activeName)])
        if (this.activeName === this.tabnameArr[this.tabnameArr.length - 1]) {
          this.formVisible = false
        }
      })
    },

    // 上一步
    preStep () {
      for (var index = 0; index < this.tabnameArr.length; index++) {
        if (this.tabnameArr[index].toLowerCase() === this.activeName.toLowerCase() && this.activeName.toLowerCase !== 'proddevBasic') {
          let preTab = this.tabnameArr[index - 1]
          if (preTab) {
            this.activeName = preTab
            this.prodbasicAddOrUpsHandle(this.dataForm.id)
            break
          }
        }
      }
    },

    // 下一步之前先去校验
    nextStepValidate () {
      this.$nextTick(() => {
        let validatePromice = this.$refs[this.activeName].validate()
        validatePromice.then(data => {
          if (data) {
            this.nextStep()
          }
        }).catch(error => {
          console.log('校验不通过', error)
        })
        return validatePromice
      })
    },

    // 下一步
    nextStep () {
      // 新增最后
      if (
        !this.dataForm.id &&
        this.activeName === this.tabnameArr[this.tabnameArr.length - 1]
      ) {
        this.saveAllValidate()
        return
      }
      // 修改最后
      if (
        this.dataForm.id &&
        this.activeName === this.tabnameArr[this.tabnameArr.length - 1]
      ) {
        this.formVisible = false
        this.$emit('refreshDataList')
        return
      }
      for (var index = 0; index < this.tabnameArr.length; index++) {
        if (
          this.tabnameArr[index].toLowerCase() === this.activeName.toLowerCase()
        ) {
          this.activeName = this.tabnameArr[index + 1]
          this.prodbasicAddOrUpsHandle(this.dataForm.id)
          let nextTab = this.tabnameArr[index + 1]
          if (nextTab) {
            this.activeName = nextTab
            this.maxTabIndex =
              this.maxTabIndex > index + 1 ? this.maxTabIndex : index + 1
            break
          }
        }
      }
    },

    // 单页保存
    save () {
      let nameRef = this.activeName
      this.$refs[nameRef].dataFormSubmit(
        this.dataForm.id,
        this.refTypeArr[this.refnameArr.indexOf(nameRef)]
      )
      this.$emit('refreshDataList')
    },
    saveAllValidate () {
      this.$http({
        url: this.$http.adornUrl('prod/proddevbasic/checkProdName'),
        method: 'post',
        data: this.dataForm
      }).then(({ data }) => {
        if (data && data.code === 0) {
          if (data.exist) {
            this.$confirm('产品名称已存在，是否继续？', '提示', {
              confirmButtonText: '确定',
              cancelButtonText: '取消',
              type: 'warning'
            }).then(() => {
              this.saveAll()
            })
          } else {
            this.saveAll()
          }
        }
      })
    },

    // 保存全部
    saveAll: _.debounce(
      async function saveAll () {
        this.$http({
          url: this.$http.adornUrl('prod/proddevbasic/save'),
          method: 'post',
          data: this.$http.adornData(this.dataForm, false)
        }).then(({ data }) => {
          if (data && data.code === 0) {
            this.formVisible = false
            this.$emit('refreshDataList')
            this.$notify.success({
              title: '成功',
              message: '保存成功',
              duration: 5000
            })
          } else {
            this.$notify.error({
              title: '错误',
              message: '保存失败,' + data.msg,
              duration: 5000
            })
          }
        })
      }, 1000, {
        leading: true,
        trailing: false
      }
    ),

    // 审核按钮==>
    approvalHander () {
      let validatePromice = this.$refs[this.tabs[4].refname].validate()
      validatePromice.then(data => {
        if (data) {
          // 校验通过请求接口
          this.$http({
            url: this.$http.adornUrl('prod/proddevbasic/approval'),
            method: 'post',
            data: Object.assign({}, this.dataForm, { flowParams: this.approvalData })
          }).then(({ data }) => {
            if (data && data.code === 0) {
              this.$emit('refreshDataList')
              this.formVisible = false
              this.$notify.success({
                title: '成功',
                message: `审核成功`,
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
        }
      }).catch(error => {
        console.log(error)
        // return error
      })
    },

    // Tab点击
    elTabClick (tab, event) {
      console.log('成功切换tab')
    },

    // 编辑时数据请求控制
    beforeLeaveGetData () {
      if (this.dataForm.id) {
        this.prodbasicAddOrUpsHandle(this.dataForm.id, this.handleType)
      }
    },

    // Tab点击之前
    beforeLeave (activeName, oldActiveName) {
      if (!oldActiveName || oldActiveName === '0') {
        this.beforeLeaveGetData()
        return true
      }
      let validatePromice = this.$refs[oldActiveName].validate()
      validatePromice.then(data => {
        this.beforeLeaveGetData()
        return data
      }).catch(error => {
        this.beforeLeaveGetData()
        return error
      })
      return validatePromice
    },

    // 数据变动
    dataChanged (val) {
      this.curFormData = val
    },

    prodbasicAddOrUpsHandle (id, handleType) {
      this.$nextTick(() => {
        let nameRef = this.activeName
        if (this.refnameArr.indexOf(nameRef) === -1) {
          return
        }
        this.$refs[this.activeName].init(this.dataForm.id, this.refupdateTypeArr[this.refnameArr.indexOf(this.activeName)], handleType, this.rowList)
      })
    }
  },
  computed: {
    imageId () {
      return this.dataForm.prodDevBasicEntity
    }
  },
  watch: {
    imageId: {
      handler (val, oldVal) {
        this.dataForm.imageId = val.imageId
      },
      deep: true
    }
  }
}
</script>