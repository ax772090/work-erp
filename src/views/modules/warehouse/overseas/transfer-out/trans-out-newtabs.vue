<template>
  <el-dialog :title="dialogTitle"
             width="70%"
             :close-on-click-modal="false"
             :visible.sync="visible"
             v-if="visible"
             :before-close="handleClose">
    <el-tabs v-model="activeName"
             type="border-card"
             @tab-click="elTabsTabClick">
      <el-tab-pane :name="tabs[0].tabname"
                   lazy>
        <span slot="label">
          <i class="el-icon-date"></i>库存调出
        </span>
        <transfer-out-detail v-model="dataForm.transferOutDetail"
                             :ref="tabs[0].refname"
                             @validate="validateObj"
                             v-if="visible"></transfer-out-detail>
      </el-tab-pane>
      <el-tab-pane :name="tabs[1].tabname"
                   lazy
                   :disabled="packingDisabled">
        <span slot="label">
          <i class="el-icon-date"></i>装箱清单
        </span>
        <packing-detail v-model="dataForm.packingDetail"
                        :ref="tabs[1].refname"
                        v-if="visible"></packing-detail>
      </el-tab-pane>
    </el-tabs>
    <span slot="footer"
          class="dialog-footer">
      <el-button @click="cancel('dataForm')"><i class="iconfont erp-icon-quxiao"></i>取消</el-button>
      <el-button v-if="(activeName == 'transferOutDetail') && isShowBtn"
                 type="primary"
                 @click="nextStepValidate()"
                 :disabled="nextStepDisabled">下一步</el-button>
      <el-button v-if="(activeName == 'packingDetail') && isShowBtn"
                 type="primary"
                 @click="preStep()">上一步</el-button>
      <el-button v-if="(activeName == 'packingDetail') && !isDisabled"
                 type="primary"
                 @click="dataFormSave()"><i class="iconfont erp-icon-baocun"></i>保存</el-button>
      <el-button v-if="(activeName == 'packingDetail') && !isDisabled"
                 type="primary"
                 @click="dataFormSubmit()"><i class="iconfont erp-icon-queding"></i>确认调出</el-button>
    </span>
  </el-dialog>
</template>

<script>
import transferOutDetail from './trans-out-detail'
import packingDetail from './packing-detail'
export default {
  components: {
    transferOutDetail,
    packingDetail
  },
  data () {
    return {
      isShowBtn: true,
      dialogTitle: '',
      isDisabled: false,
      nextStepDisabled: false, // 控制下一步按钮
      submitId: '', // 保存后返回的用于调出的id
      deliveryName: '',
      packingDisabled: true,
      activeName: '',
      tabs: [
        {
          tabname: 'transferOutDetail',
          refname: 'transferOutDetail',
          type: '1'
        },
        {
          tabname: 'packingDetail',
          refname: 'packingDetail',
          type: '2'
        }
      ],
      // dialog是否显示
      visible: false,
      dataForm: {
        id: '',
        // 调出明细
        transferOutDetail: {},
        // 装箱明细
        packingDetail: {}
      }
    }
  },
  methods: {
    // 校验
    validateObj (msg) {
      if (msg.obj) {
        this.nextStep()
      }
    },
    // 点击顶部tab时
    elTabsTabClick (tab, event) {
      if (this.deliveryName === 'check') {
        this.triggerChildren(this.dataForm.id, '', this.deliveryName)
      }
    },
    // 关闭清除本次缓存
    clearCache (formName) {
      this.$nextTick(() => {
        this.visible = false
      })
    },
    // 弹窗关闭之前
    handleClose (done) {
      this.clearCache('dataForm')
      done()
    },
    // 取消按钮
    cancel (formName) {
      this.clearCache(formName)
      this.visible = false
    },
    init (id, name) {
      this.deliveryName = name
      this.visible = true
      this.dataForm.id = id // 这个id是两种值：1、要货计划id；2、修改id(此时的id是保存之后返回的id)
      this.isDisabled = false
      this.packingDisabled = true
      this.isShowBtn = true
      if (id && name === 'check') {
        this.isDisabled = true // 查看是为true
        this.dialogTitle = '库存调出查看'
        this.packingDisabled = false // 查看的时候两个都可以点击
        this.isShowBtn = false // 查看时去掉下一步
      } else if (!this.dataForm.id || !!this.deliveryName) {
        this.dialogTitle = '库存调出新增'
      } else {
        this.dialogTitle = '库存调出修改'
      }
      this.$nextTick(() => {
        this.activeName = this.tabs[0].tabname // transferOutDetail
        this.triggerChildren(id, '', name)
      })
    },
    // 上一步
    preStep () {
      this.activeName = this.tabs[0].tabname // transferOutDetail
    },
    // 下一步之前先去校验
    nextStepValidate () {
      this.$nextTick(() => {
        this.$refs[this.activeName].validate()
      })
    },
    // 下一步
    nextStep () {
      this.$nextTick(() => {
        this.activeName = this.tabs[1].tabname // packingDetail
        this.triggerChildren(
          this.dataForm.id,
          this.dataForm,
          this.deliveryName
        )
      })
    },
    triggerChildren (id, dataForm, name) {
      this.$nextTick(() => {
        this.$refs[this.activeName].init(id, dataForm, name)
      })
    },
    // 保存
    dataFormSave: _.debounce(
      async function dataFormSave () {
        let transferOutDetailsList = this.dataForm.transferOutDetail
          .transferOutDetailsList
        if (transferOutDetailsList.length <= 0) {
          this.$notify.error({
            title: '错误',
            message: '库存调出模块，调出明细不能为空',
            duration: 2000
          })
        } else {
          this.$http({
            url: this.$http.adornUrl(
              `warehouse/whtransferout/${
              !this.dataForm.id || !!this.deliveryName ? 'save' : 'update'
              }`
            ),
            method: !this.dataForm.id || !!this.deliveryName ? 'post' : 'put',
            data: Object.assign(
              {},
              { whTransferOutEntity: this.dataForm.transferOutDetail },
              {
                whTransferOutDetailList: this.dataForm.transferOutDetail
                  .transferOutDetailsList
              },
              { whPackingEntity: this.dataForm.packingDetail },
              {
                whPackingDetailList: this.dataForm.packingDetail
                  .packingDetailsList
              }
            )
          }).then(({ data }) => {
            if (data && data.code === 0) {
              // this.submitId = data.id
              this.$emit('refreshDataList')
              this.clearCache('dataForm')
              this.$notify({
                title: '成功',
                type: 'success',
                message: '保存成功',
                duration: 1500
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
      }, 1000, {
        leading: true,
        trailing: false
      }
    ),

    // 确认调出新接口
    dataFormSubmit: _.debounce(
      async function dataFormSubmit () {
        let transferOutDetailsList = this.dataForm.transferOutDetail
          .transferOutDetailsList
        if (transferOutDetailsList.length <= 0) {
          this.$notify.error({
            title: '错误',
            message: '库存调出模块，调出明细不能为空',
            duration: 2000
          })
        } else {
          this.$http({
            url: this.$http.adornUrl(`warehouse/whtransferout/saveandconfirm`),
            method: 'post',
            data: Object.assign(
              {},
              { whTransferOutEntity: this.dataForm.transferOutDetail },
              {
                whTransferOutDetailList: this.dataForm.transferOutDetail
                  .transferOutDetailsList
              },
              { whPackingEntity: this.dataForm.packingDetail },
              {
                whPackingDetailList: this.dataForm.packingDetail
                  .packingDetailsList
              }
            )
          }).then(({ data }) => {
            if (data && data.code === 0) {
              this.$emit('refreshDataList')
              this.clearCache('dataForm')
              this.$notify({
                title: '成功',
                message: '调出成功',
                duration: 1000,
                type: 'success'
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
      }, 1000, {
        leading: true,
        trailing: false
      }
    )
  }
}
</script>
