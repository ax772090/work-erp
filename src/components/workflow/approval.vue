<template>
  <el-dialog :title="!approvalData.id ? '审核' : '审核'"
             :close-on-click-modal="false"
             :visible.sync="visible"
             @close="$refs['approvalData'].resetFields()">
    <el-form :model="approvalData"
             :rules="dataRule"
             ref="approvalData"
             @keyup.enter.native="approvalDataSubmit()"
             label-width="110px">
      <el-row>
        <el-col :span="12">
          <el-form-item label="">
            <el-radio-group v-model="approvalData.operation">
              <div>
                <el-radio label="1">审批通过</el-radio>
              </div>
              <div class="mgTop">
                <el-radio label="2">驳回上一级</el-radio>
              </div>
              <div class="mgTop">
                <el-radio label="3">驳回发起人</el-radio>
              </div>
            </el-radio-group>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="下一步审批人"
                        prop="approveName">
            <span>{{approvalData.approveName}}</span>
          </el-form-item>
          <el-form-item label="审批意见"
                        prop="remark">
            <textarea-all v-model="approvalData.comments"
                          placeholder="审批意见"></textarea-all>
          </el-form-item>
        </el-col>
      </el-row>

    </el-form>
    <span slot="footer"
          class="dialog-footer">
      <el-button @click="visible = false">取消</el-button>
      <el-button type="primary"
                 @click="approvalDataSubmit()">确定</el-button>
    </span>
  </el-dialog>
</template>
<script>
// 备注组件
import textareaAll from '@/components/erp-input/textarea-all'
export default {
  components: {
    textareaAll
  },
  data () {
    return {
      visible: false,
      approvalData: {
        id: '',
        operation: '1',
        taskId: '',
        // userId: '',
        // 审批消息信息
        routeUrl: '',
        code: '',
        docName: '',
        comments: '',
        /// ////////////////

        variablesMap: {},
        approveName: ''
      },
      dataRule: {
        // name: [{ required: true, message: '品牌名称不能为空', trigger: 'change' }]
      }
    }
  },
  methods: {
    init (obj) {
      this.approvalData = obj
      // this.approvalData.variablesMap.comments = ''
      // this.approvalData.id = obj.id
      // this.approvalData.taskId = obj.taskId
      // this.approvalData.variablesMap.routeUrl = obj.routeUrl
      this.$nextTick(() => {
        this.visible = true
      })
    },

    // 表单提交
    approvalDataSubmit () {
      this.$refs['approvalData'].validate(valid => {
        if (valid) {
          this.$http({
            url: this.$http.adornUrl('activiti/approval'),
            method: 'put',
            data: this.approvalData
          }).then(({ data }) => {
            if (data && data.code === 0) {
              this.visible = false
              this.$emit('approval')
              this.$notify.success({
                message: '审核成功',
                duration: 5000
              })
            } else {
              this.$notify.error({
                title: '审核失败',
                message: data.msg,
                duration: 5000
              })
            }
          })
        }
      })
    }
  }
}
</script>

<style scoped>
.el-form {
  overflow: hidden;
}

.el-slect {
  width: 100%;
}
.mgTop{
  margin-top:20px;
}
</style>