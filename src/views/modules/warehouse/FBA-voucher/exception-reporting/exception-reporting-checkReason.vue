<template>
  <el-dialog :title="`生成${type}`"
             :close-on-click-modal='false'
             :visible.sync='visible'
             @close="$refs['dataForm'].resetFields()"
             width='50%'>
    <el-form :model='dataForm'
             ref='dataForm'
             label-width='110px'>

      <el-row>
        <el-table :data='dataForm.reasonList'
                  stripe
                  border
                  max-height="450"
                  highlight-current-row
                  v-loading='dataListLoading'>
          <el-table-column prop='reportData'
                           width="250"
                           label='数据ID'></el-table-column>
          <el-table-column prop='failReason'
                           label='失败原因'>
            <template slot-scope="scope">
              <div>
                {{scope.row.failReason ? scope.row.failReason : '无'}}
              </div>
            </template>

          </el-table-column>
        </el-table>
      </el-row>
    </el-form>
    <span slot="footer">
      <el-button @click='visible = false'><i class="iconfont erp-icon-quxiao"></i>取消</el-button>
    </span>
  </el-dialog>
</template>
<script>
export default {
  data () {
    return {
      visible: false,
      isClick: true,
      isDisabled: false,
      type: '',
      dataForm: {
        id: '',
        reasonList: []
      },
      dataListLoading: false
    }
  },
  methods: {
    init (id, type) {
      this.visible = true
      this.dataForm.id = id
      this.type = type
      // 如果后台返回的生成结果是null，默认生成成功
      if (!this.type) {
        this.type = '成功'
      }
      this.dataCallInfo(id)
    },
    dataCallInfo (id) {
      this.$http({
        url: this.$http.adornUrl(`warehouse/whabnormalrpttotrading/info/${id}`),
        method: 'get'
      }).then(({ data }) => {
        if (data && data.code === 0) {
          this.dataForm = data
          this.dataForm.reasonList = data.reasonList
        }
      })
    }
  }
}
</script>
