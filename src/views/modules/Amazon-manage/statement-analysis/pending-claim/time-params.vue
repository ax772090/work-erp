<template>
  <el-dialog title="时间参数设置"
             :close-on-click-modal="false"
             :visible.sync="visible"
             width="20%">
    <el-form :model="dataForm"
             ref="dataForm">
      <div>已退款还未退货
        <el-input v-model="dataForm.COMPENSATE_REFUND_DATE"
                  type="Number"
                  @mousewheel.native.prevent></el-input>天，需设置索赔提醒
      </div>
      <div>距FBAShipment最近一次入库
        <el-input v-model="dataForm.COMPENSATE_RECEIPT_DATE"
                  type="Number"
                  @mousewheel.native.prevent></el-input>天
      </div>
      <div>还未全部入库，需要设置索赔提醒</div>
    </el-form>
    <span slot="footer"
          class="dialog-footer">
      <el-button @click="visible = false"><i class="iconfont erp-icon-quxiao"></i>取消</el-button>
      <el-button type="primary"
                 @click="save"><i class="iconfont erp-icon-baocun"></i>保存</el-button>
    </span>
  </el-dialog>
</template>
<script>
export default {
  data () {
    return {
      visible: false,
      dataForm: {
        COMPENSATE_REFUND_DATE: '',
        COMPENSATE_RECEIPT_DATE: ''
      }
    }
  },
  methods: {
    init () {
      this.visible = true
      this.dataForm = {
        COMPENSATE_REFUND_DATE: '',
        COMPENSATE_RECEIPT_DATE: ''
      }
      // 请求数据
      this.$http({
        url: this.$http.adornUrl(`sys/config/getValueByKey`),
        method: 'post',
        data: ['COMPENSATE_REFUND_DATE', 'COMPENSATE_RECEIPT_DATE']
      }).then(({ data }) => {
        if (data && data.code === 0) {
          this.dataForm = data.timeData
        } else {
          this.$notify.error({
            title: '错误',
            message: data.msg,
            duration: 5000
          })
        }
      })
    },
    save: _.debounce(
      async function save () {
        this.$http({
          url: this.$http.adornUrl(`sys/config/updateValueByKey`),
          method: 'get',
          params: this.dataForm
        }).then(({ data }) => {
          if (data && data.code === 0) {
            this.visible = false
            this.$notify({
              message: '参数设置成功',
              title: '提示',
              type: 'success',
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
<style scoped>
.el-input {
  width: 50px;
}
</style>

