<template>
  <div class="outside">
    <ElTabs v-model="activeTabs"
            type="card"
            @tab-click="tabClickHandle">
      <ElTabPane label="付款核销"
                 name="verify">
        <verify-list ref="verify"></verify-list>
      </ElTabPane>
      <ElTabPane label="核销记录"
                 name="cancelVerify">
        <verify-cancel ref="cancelVerify"></verify-cancel>
      </ElTabPane>
    </ElTabs>
  </div>
</template>
<script>
import verifyList from './verify-list'
import verifyCancel from './verify-cancel'
export default {
  components: {
    verifyList,
    verifyCancel
  },
  data () {
    return {
      activeTabs: 'verify'
    }
  },
  mounted () {
    this.$refs[this.activeTabs].init('verify')
  },
  methods: {
    tabClickHandle (tab, event) {
      // if (tab.name === 'evaluateTab') {
      this.$refs[this.activeTabs].init(tab.name)
      // }
    }
  }
}
</script>
<style scoped>
.outside{
  margin-top: 10px;
}
</style>
