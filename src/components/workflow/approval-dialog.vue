<template>
  <el-dialog :title="!type ? '审核' : '批量审核'"
             :close-on-click-modal="false"
             :visible.sync="visible">
    <approval-new v-model="dataForm.approvalData"></approval-new>
    <span slot="footer"
          class="dialog-footer">
      <el-button @click="visible = false">取消</el-button>
      <el-button type="primary"
                 @click="approvalDataSubmit()">确定</el-button>
    </span>
  </el-dialog>
</template>
<script>
import approvalNew from './approval-new';
export default {
  components: {
    approvalNew
  },
  data () {
    return {
      visible: false,
      dataForm: {
        approvalData: {},
        resultdata: []
      },
      dataRule: {
        // name: [{ required: true, message: '品牌名称不能为空', trigger: 'change' }]
      },
      type: ''
    }
  },
  created () {
    this.initDataForm()
  },
  methods: {
    initDataForm () {
      this.dataForm = {
        approvalData: {
          id: '',
          operation: '1',
          taskId: '',
          routeUrl: '',
          code: '',
          docName: '',
          comments: '',
          variablesMap: {},
          approveName: '',
          isShowNode2: true,
          isShowNode3: true
        }
      }
    },
    init (obj, type) {
      this.initDataForm()
      this.type = ''   // 清除缓存
      if (type) {
        this.type = type

        this.resultdata = obj
      } else {
        this.dataForm.approvalData = Object.assign(
          {},
          this.dataForm.approvalData,
          obj
        )
      }
      ;
      this.$nextTick(() => {
        this.visible = true
      })
    },

    // 表单提交
    approvalDataSubmit () {
      //   this.$refs['approvalData'].validate(valid => {
      //     if (valid) {
      if (this.type) {
        for (let i = 0; i < this.resultdata.length; i++) {
          this.$set(this.resultdata[i], 'operation', this.dataForm.approvalData.operation)
          this.$set(this.resultdata[i], 'comments', this.dataForm.approvalData.comments)
        }
        this.$http({
          url: this.$http.adornUrl('activiti/batchApproval'),
          method: 'put',
          data: this.resultdata
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
      } else {
        this.$http({
          url: this.$http.adornUrl('activiti/approval'),
          method: 'put',
          data: this.dataForm.approvalData
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
      //     }
      //   })
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
</style>