<template>
  <div>
    <el-popover placement="bottom"
                trigger="click">
      <slot name="content"></slot>
      <el-button slot="reference" :type="buttomType" :class="buttomClass">{{buttomName}}</el-button>
    </el-popover>
  </div>
</template>

<script>
// &nbsp;<b class="iconfont erp-icon-tianjiamingxi"></b>
export default {
  props: {
    buttomType: {
      type: String,
      default: 'text'
    },
    buttomClass: {
      type: String,
      default: ''
    },
    buttomName: {
      type: String,
      default: ''
    }
  },
  data () {
    return {

    }
  }
}
</script>

<style lang="sass" scoped>

</style>

