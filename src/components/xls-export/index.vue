<template>
  <div>
    <!-- -------------------导出弹出框------------------ -->
    <el-dialog
      :title="title"
      :visible.sync="exportVisible"
      width="20%"
      :close-on-click-modal="false"
    >
      <el-radio-group v-model="dataForm.operation">
        <div>
          <el-radio label="1">按导入模板导出</el-radio>
        </div>
        <div class="mt-20">
          <el-radio label="2">按列表格式导出</el-radio>
        </div>
      </el-radio-group>
      <span slot="footer" class="dialog-footer">
        <!-- <el-button @click="cancel('dataForm')">取消</el-button> -->
        <el-button type="primary" @click="exportHandle">导出</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
// 产品证书
export default {
  props: {
    title: {
      default: '数据导出'
    }
  },

  data () {
    return {
      exportVisible: false,
      dataForm: {
        operation: '1'
      },
      exportUrl: '',
      searchData: {}
    }
  },
  methods: {
    init (obj) {
      Object.assign(this.$data, this.$options.data())
      this.exportVisible = true
      this.exportUrl = obj.exportUrl
      this.searchData = obj.searchData
    },
    exportHandle () {
      this.searchData = Object.assign({}, this.searchData, { exportType: this.dataForm.operation })
      window.open(this.$http.tokens(this.exportUrl, this.searchData))
      this.exportVisible = false
    }
  }
}
</script>
