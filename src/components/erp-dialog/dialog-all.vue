<template>
  <div>
    <el-dialog :title="dialogData.title"
               :visible.sync="dialogData.visible"
               :width="dialogData.width"
               close-on-press-escape
               :modal-append-to-body='dialogData.modalAppendBody'
               :show-close='dialogData.isShowclose'
               :before-close="beforeCloseHandle"
               @close="handleClose">
      <slot name="dialogbody"></slot>
      <span slot="footer">
        <slot name="dialogfooter">
          <el-button type="primary"
               @click="qwe">主要按钮</el-button>
        </slot>
      </span>
    </el-dialog>
  </div>
</template>
<script>
export default {
  props: {
    dialogData: {
      required: true,
      type: Object,
      default: function () {
        return {
          visible: false,
          title: '提示',
          width: '30%',
          isShowclose: true,
          modalAppendBody: false,
          maxHeight: ''
        }
      }
    }
  },
  data () {
    return {
      // dialogVisible: false
    }
  },
  methods: {
    qwe () {
      this.dialogData.title = 'xiugai'
    },
    beforeCloseHandle () {
      this.dialogData.visible = false
    },
    handleClose () {
      this.$emit('close')
    }
  },
  watch: {
    dialogData: function (val) {
      this.$emit('update:dialogData', val)
    }
  }
}
</script>

