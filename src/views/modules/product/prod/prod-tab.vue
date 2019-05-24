<template>
  <el-dialog :title="dialogTitle"
             :close-on-click-modal="false"
             :visible.sync="visible"
             v-if="visible"
             :before-close="handleClose"
             width="60%"
             @close="$refs['dataForm'].resetFields()">
    <el-form :model="dataForm"
             ref="dataForm">
      <el-tabs v-model="activeName"
               type="border-card"
               @tab-click="elTabsTabClick"
               :before-leave="beforeLeave">
        <el-tab-pane v-if="tabs[0].isAuth"
                     :name="tabs[0].tabname"
                     :disabled="!dataForm.id && maxTabIndex<0">
          <span slot="label">
            <i class="el-icon-date"></i>基本信息
          </span>
          <prod-basic v-model="dataForm.prodBasicEntity"
                      :ref="tabs[0].refname"
                      @nextStep="nextStep"></prod-basic>
        </el-tab-pane>
        <el-tab-pane v-if="tabs[1].isAuth"
                     :name="tabs[1].tabname"
                     :disabled="!dataForm.id && maxTabIndex<1">
          <span slot="label">
            <i class="el-icon-date"></i>规格信息
          </span>
          <prod-skuparams v-model="dataForm.skuParams"
                          :ref="tabs[1].refname"
                          @nextStep="nextStep"></prod-skuparams>
        </el-tab-pane>
        <el-tab-pane v-if="tabs[2].isAuth"
                     :name="tabs[2].tabname"
                     :disabled="!dataForm.id && maxTabIndex<2">
          <span slot="label">
            <i class="el-icon-date"></i>辅助信息
          </span>
          <prod-support v-model="dataForm.prodSupportEntity"
                        :ref="tabs[2].refname"
                        @nextStep="nextStep"></prod-support>
        </el-tab-pane>
        <el-tab-pane v-if="tabs[3].isAuth"
                     :name="tabs[3].tabname"
                     :disabled="!dataForm.id && maxTabIndex<3">
          <span slot="label">
            <i class="el-icon-date"></i>销售相关
          </span>
          <!-- 采购相关 -->
          <prodPriceInfoEntity v-model="dataForm.priceInfoEntity"
                               :ref="tabs[3].refname"
                               @nextStep="nextStep"></prodPriceInfoEntity>
          <!-- 销售相关 -->
          <!-- <prod-saleentity-list v-model= "dataForm.prodSaleEntityList" :ref='tabs[3].children[1].refname' v-if='visible'></prod-saleentity-list> -->
        </el-tab-pane>
        <el-tab-pane v-if="tabs[4].isAuth"
                     :name="tabs[4].tabname"
                     :disabled="!dataForm.id && maxTabIndex<4">
          <span slot="label">
            <i class="el-icon-date"></i>产品图片
          </span>
          <prod-up-picture v-model="dataForm.imageList"
                           :ref="tabs[4].refname"
                           @nextStep="nextStep"></prod-up-picture>
        </el-tab-pane>
        <el-tab-pane v-if="tabs[5].isAuth"
                     :name="tabs[5].tabname"
                     :disabled="!dataForm.id && maxTabIndex<5">
          <span slot="label">
            <i class="el-icon-date"></i>仓库信息
          </span>
          <prod-warehouse v-model="dataForm.prodWarehouseEntity"
                          :ref="tabs[5].refname"
                          @nextStep="nextStep"></prod-warehouse>
        </el-tab-pane>
        <el-tab-pane v-if="tabs[6].isAuth"
                     :name="tabs[6].tabname"
                     :disabled="!dataForm.id && maxTabIndex<6">
          <span slot="label">
            <i class="el-icon-date"></i>报关信息
          </span>
          <prod-customs v-model="dataForm.basicCustomsEntity"
                        :ref="tabs[6].refname"
                        @nextStep="nextStep"></prod-customs>
        </el-tab-pane>
        <el-tab-pane v-if="tabs[7].isAuth"
                     :name="tabs[7].tabname"
                     :disabled="!dataForm.id && maxTabIndex<7">
          <span slot="label">
            <i class="el-icon-date"></i>组合SKU
          </span>
          <prod-items v-model="dataForm.prodItemsEntityList"
                      :ref="tabs[7].refname"
                      @nextStep="nextStep"></prod-items>
        </el-tab-pane>
        <el-tab-pane v-if="tabs[8].isAuth"
                     :name="tabs[8].tabname"
                     :disabled="!dataForm.id && maxTabIndex<8">
          <span slot="label">
            <i class="el-icon-date"></i>产品证书
          </span>
          <prod-cer-accessory v-model="dataForm.cerList"
                              :ref="tabs[8].refname"
                              @nextStep="nextStep"></prod-cer-accessory>
        </el-tab-pane>
      </el-tabs>
    </el-form>
    <span slot="footer"
          class="dialog-footer">
      <el-button @click="cancel('dataForm')"><i class="iconfont erp-icon-quxiao"></i>取消</el-button>
      <!-- <el-button v-if="(activeName != 'prodBasic' && !this.handleType)"
                 type="primary"
      @click="preStep()">上一步</el-button>-->
      <el-button v-if="(!dataForm.id && !this.handleType) || (this.handleType === 'copy')"
                 type="primary"
                 @click="nextStepValidate()">{{activeName == 'prodCerAccessory' ? '一键保存' : '下一步'}}</el-button>
      <el-button v-if="(dataForm.id && !this.handleType)"
                 type="primary"
                 @click="revampSave()"><i class="iconfont erp-icon-baocun"></i>{{activeName == tabnameArr[tabnameArr.length-1] ? '保存' : '保存'}}</el-button>
    </span>
  </el-dialog>
</template>

<script>
// 基础资料
import prodBasic from './prod-basic'
// 规格
import prodSkuparams from './prod-skuparams'
// 辅助信息
import prodSupport from './prod-support'
// 价格信息
import prodPriceInfoEntity from './prod-priceinfo'
// 产品图片
import prodUpPicture from './prod-up-picture'
// 仓库信息
import prodWarehouse from './prod-warehouse'
// 报关
import prodCustoms from './prod-customs'
// 组合sku
import prodItems from './prod-items'
// 证书---附件
import prodCerAccessory from './prod-cer-accessory'
export default {
  components: {
    prodBasic,
    prodSkuparams,
    prodSupport,
    prodPriceInfoEntity,
    prodUpPicture,
    prodWarehouse,
    prodCustoms,
    prodItems,
    prodCerAccessory
  },
  data () {
    return {
      dialogTitle: '',
      handleType: '',
      visible: false,

      isBeforeLeave: true,
      activeName: 'prodBasic',
      maxTabIndex: 0,
      tabs: [{
        tabname: 'prodBasic',
        refname: 'prodBasic',
        type: '1',
        updateType: '1',
        isAuth: true
      }, {
        tabname: 'prodSkuparams',
        refname: 'prodSkuparams',
        type: '2',
        updateType: '2',
        isAuth: true
      }, {
        tabname: 'prodSupport',
        refname: 'prodSupport',
        type: '3',
        updateType: '3',
        isAuth: true
      }, {
        tabname: 'priceInfoEntity',
        refname: 'priceInfoEntity',
        type: '4',
        updateType: '4',
        isAuth: this.isAuth('prod:prodsale:info')
      }, {
        tabname: 'prodUpPicture',
        refname: 'prodUpPicture',
        type: '8',
        updateType: '8',
        isAuth: true
      }, {
        tabname: 'prodWarehouse',
        refname: 'prodWarehouse',
        type: '6',
        updateType: '6',
        isAuth: true
      }, {
        tabname: 'prodCustoms',
        refname: 'prodCustoms',
        type: '1',
        updateType: '11',
        isAuth: true
      }, {
        tabname: 'prodItems',
        refname: 'prodItems',
        type: '7',
        updateType: '7',
        isAuth: true
      }, {
        tabname: 'prodCerAccessory',
        refname: 'prodCerAccessory',
        type: '10',
        updateType: '10',
        isAuth: this.isAuth('prod:prodcertificates:info')
      }],
      dataForm: {
        id: '',
        type: '',
        prodBasicEntity: {},
        skuParams: {},
        prodSupportEntity: {},
        priceInfoEntity: {
          // 采购相关数据
          // prodPurchaseEntityList: [],
          // 销售相关
          prodSaleEntityList: []
        },
        imageIds: [],
        // 新方式
        imageList: [],

        prodWarehouseEntity: {},
        basicCustomsEntity: {}, // 已通过赋值的方式解决
        prodItemsEntityList: [],
        cerIds: [],
        // 新方式
        cerList: []

        // 少一个
        // cerList: [],
        // imageList: [],
      },
      // 提取数据的type
      refTypeArr: [],
      // 提取数据的updateType
      refupdateTypeArr: [],
      // 提取数据的refname
      refnameArr: [],
      // 提取数据的tabname
      tabnameArr: []
    }
  },
  mounted () {
    this.dataProcessing()
  },
  methods: {
    init (id, handleType, Fdata) {
      Object.assign(this.$data, this.$options.data)
      this.dataForm.imageList = []
      this.dataForm.cerList = []
      // this.dataForm = {}
      this.visible = true
      this.activeName = 'prodBasic'
      this.dataForm.id = id
      this.maxTabIndex = 0
      this.handleType = handleType
      if (handleType === '1') {
        this.dialogTitle = '产品查看'
      } else if (!this.dataForm.id || handleType === 'copy') {
        this.dialogTitle = '产品新增'
        this.dataFormTemp = Fdata
        for (const element of this.tabs) {
          element.isAuth = true
        }
      } else {
        this.dialogTitle = '产品修改'
      }
      this.$nextTick(() => {
        this.activeName = this.tabnameArr[0] // prodBasic
        this.activeName = 'prodBasic'
        this.dataProcessing()
        this.triggerChildren(id, this.handleType)
      })
    },

    // 请求init
    triggerChildren (id, handleType) {
      this.$nextTick(() => {
        if (this.tabnameArr.indexOf(this.activeName) === -1) {
          console.log('没有refnameArr数据或者refTypeArr数据')
          return
        }
        this.$refs[this.activeName].init(
          id,
          this.refTypeArr[this.refnameArr.indexOf(this.activeName)],
          handleType,
          this.dataFormTemp
        )
      })
    },

    // 关闭清除本次缓存
    clearCache (formName) {
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

    // 处理数据,提出数据
    dataProcessing () {
      this.refTypeArr = []
      this.refupdateTypeArr = []
      this.refnameArr = []
      this.tabnameArr = []
      this.tabs.forEach(element => {
        if (element.isAuth) {
          this.refTypeArr.push(element.type)
          this.refupdateTypeArr.push(element.updateType)
          this.refnameArr.push(element.refname)
          this.tabnameArr.push(element.tabname)
        }
      })
    },

    // 点击顶部tab时
    elTabsTabClick (tab, event) {
      this.$nextTick(() => {
        if (this.dataForm.id) {
          this.triggerChildren(this.dataForm.id, this.handleType)
        }
      })
    },

    // 编辑时切换tab控制
    beforeLeaveGetData (tab, event) {
      this.$nextTick(() => {
        if (this.dataForm.id) {
          this.triggerChildren(this.dataForm.id, this.handleType)
        }
      })
    },

    beforeLeave (activeName, oldActiveName) {
      if (!oldActiveName || oldActiveName === '0') {
        // this.beforeLeaveGetData()
        return true
      }
      let validatePromice = this.$refs[oldActiveName].validate()
      validatePromice
        .then(data => {
          // this.beforeLeaveGetData()
          return data
        })
        .catch(error => {
          // this.beforeLeaveGetData()// 去掉这句可以解决报错去查一次的问题,加上则出现如果是导入数据,价格信息无数据的情况,就会导致每个数据都没有价格信息的情况
          return error
        })
      return validatePromice
    },

    // 上一步
    preStep () {
      for (let i = 0; i < this.tabnameArr.length; i++) {
        if (
          this.activeName.toLowerCase() === this.tabnameArr[i].toLowerCase() &&
          i !== 0 &&
          i < this.tabnameArr.length
        ) {
          this.activeName = this.tabnameArr[i - 1]
          this.triggerChildren(this.dataForm.id)
          return
        }
      }
    },

    // 下一步之前先去校验
    nextStepValidate () {
      this.$nextTick(() => {
        let validatePromice = this.$refs[this.activeName].validate()
        validatePromice
          .then(data => {
            if (data) {
              this.nextStep()
            }
          })
          .catch(error => {
            console.log('校验不通过', error)
          })
        return validatePromice
      })
    },

    // 下一步
    nextStep () {
      if (
        !this.dataForm.id &&
        this.activeName === this.tabnameArr[this.tabnameArr.length - 1]
      ) {
        this.saveAllValidate()
        return
      }
      for (let j = 0; j < this.tabnameArr.length - 1; j++) {
        if (
          this.activeName.toLowerCase() === this.tabnameArr[j].toLowerCase()
        ) {
          this.activeName = this.tabnameArr[j + 1]
          this.triggerChildren(this.dataForm.id, this.handleType)
          let nextTab = this.tabnameArr[j + 1]
          if (nextTab) {
            this.activeName = nextTab
            this.maxTabIndex =
              this.maxTabIndex > j + 1 ? this.maxTabIndex : j + 1
            break
          }
          return
        }
      }
    },

    // 保存前校验
    saveAllValidate () {
      this.$http({
        url: this.$http.adornUrl('prod/prodbasic/checkProdName'),
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
    saveAll () {
      this.$http({
        url: this.$http.adornUrl('prod/prodbasic/save'),
        method: 'post',
        data: this.dataForm
      }).then(({ data }) => {
        if (data && data.code === 0) {
          this.visible = false
          this.$emit('refreshDataList', 1)
          this.$notify.success({
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
    },

    // 修改保存，下一步
    revampSave () {
      this.$nextTick(() => {
        this.$refs[this.activeName].dataFormSubmit(
          this.dataForm.id,
          this.refupdateTypeArr[this.refnameArr.indexOf(this.activeName)]
        )
        if (this.activeName === this.tabnameArr[this.tabnameArr.length - 1]) {
          this.visible = false
        }
        // this.nextStep()
      })
    }
  }
}
</script>
<style scoped>
.el-tabs--border-card > .el-tabs__header .el-tabs__item.is-disabled {
  color: #909399 !important;
}
.is-disabled {
  color: #909399 !important;
}
</style>