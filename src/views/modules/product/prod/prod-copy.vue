<template>
  <div>
    <!-- -------------------产品复制弹出框------------------ -->
    <el-dialog :title="title"
               :visible.sync="copyVisible"
               width="20%"
               :close-on-click-modal="false">
      <el-radio-group v-model="dataForm.operation">
        <div class="mt-20">
          <el-radio label="0">产品复制</el-radio>
        </div>
        <div class="mt-10">
          <el-radio label="1">添加变体 (颜色或规格必须变动)</el-radio>
        </div>
        <div class="mt-10">
          <el-radio label="2">产品升级</el-radio>
        </div>
      </el-radio-group>
      <span slot="footer"
            class="dialog-footer">
        <el-button @click="copyVisible = false"><i class="iconfont erp-icon-quxiao"></i>取消</el-button>
        <el-button type="primary"
                   @click="submitHandle"><i class="iconfont erp-icon-queding"></i>确定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  props: {
    title: {
      default: '产品复制'
    }
  },

  data () {
    return {
      copyVisible: false,
      dataForm: {
        operation: '0'
      },
      copyProdId: ''
    }
  },
  methods: {
    init (id) {
      Object.assign(this.$data, this.$options.data())
      this.copyVisible = true
      this.copyProdId = id
    },
    submitHandle () {
      this.$emit('prodSubmit', {id: this.copyProdId, copyType: this.dataForm.operation})
      this.copyVisible = false
    }
  }
}
</script>
