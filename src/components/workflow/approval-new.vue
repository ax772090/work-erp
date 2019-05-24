<template>
  <div>
    <el-form :model="approvalData"
             :rules="dataRule"
             ref="approvalData"
             @keyup.enter.native="approvalDataSubmit()"
             label-width="110px">
      <el-row>
        <el-col :span="12">
          <el-form-item label>
            <el-radio-group v-model="approvalData.operation">
              <div>
                <el-radio label="1">审批通过</el-radio>
              </div>
              <div class="mgTop"
                   v-if="approvalData.isShowNode2 || !(approvalData.node === 'T01')">
                <el-radio label="2">驳回上一级</el-radio>
              </div>
              <div class="mgTop"
                   v-if="approvalData.isShowNode3">
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
  </div>
</template>
<script>
// 备注组件
import textareaAll from '@/components/erp-input/textarea-all'
export default {
  components: {
    textareaAll
  },
  props: {
    value: {
      value: Array,
      default: () => []
    }
  },
  data () {
    return {
      visible: false,
      approvalData: Object.assign({}, { isShowNode2: true, isShowNode3: true }, this.value),
      dataRule: {
        // name: [{ required: true, message: '品牌名称不能为空', trigger: 'change' }]
      }
    }
  },
  methods: {

  },
  watch: {
    value: {
      handler (val, oldVal) {
        console.log('shuju ', val)
        this.approvalData = val
        this.$emit('change', val)
      },
      deep: true
    },

    approvalData: {
      handler (val, oldVal) {
        this.$emit('input', val)
      },
      deep: true
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