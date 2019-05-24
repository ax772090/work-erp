<template>
  <el-dialog title="审批流详情"
             :close-on-click-modal="false"
             :visible.sync="visible"
             @close="$refs['approvalData'].resetFields()"
             width="40%">
    <el-form ref="approvalData"
             class="form-height">
      <el-steps direction="vertical"
                :active="detaileList.length-1"
                :space="80"
                v-if='detaileList.length > 0'>
        <sub-step v-for="(item,index) in detaileList"
                  :title="item.approvalUserName"
                  :action='item.agree'
                  :time='item.approvalTime'
                  :description="item.approvalOpinion"
                  :key="index"></sub-step>
      </el-steps>
      <div v-else-if='detaileList.length === 0'
           class="no-data">暂无数据</div>
    </el-form>
    <span slot="footer"
          class="dialog-footer">
      <el-button @click="visible = false">关闭</el-button>
    </span>
  </el-dialog>
</template>
<script>
import SubStep from './step'
export default {
  components: {
    SubStep
  },
  data () {
    return {
      visible: false,
      detaileList: []
    }
  },
  methods: {
    init (id, row) {
      this.visible = true
      this.$http({
        url: this.$http.adornUrl('activiti/getApproveHistory'),
        method: 'get',
        params: {
          businessId: id
        }
      }).then(({
        data
      }) => {
        if (data && data.code === 0) {
          this.detaileList = data.data
        } else {
          this.$notify.error({
            title: '查询审核详情失败',
            message: data.msg,
            duration: 5000
          })
        }
      })
    }
  }
}
</script>

<style scoped>
/* 勿删 */
.form-height {
  max-height: 600px;
  overflow-y: auto;
}
.no-data {
  margin: 0 auto;
  text-align: center;
}
</style>
