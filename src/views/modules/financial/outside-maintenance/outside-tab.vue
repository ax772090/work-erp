<template>
  <div class="outside">
    <ElTabs v-model="activeTabs"
            type="card"
            @tab-click="tabClickHandle">
      <ElTabPane label="测评费用"
                 name="assess">
        <outside-evalu ref="assess"></outside-evalu>
      </ElTabPane>
      <ElTabPane label="海外仓费用"
                 name="overseas">
        <!-- <outside-evalu ref="overseas"></outside-evalu> -->
        <outside-overseas ref="overseas"></outside-overseas>
      </ElTabPane>
      <ElTabPane label="其他销售费用"
                 name="othersell">
        <!-- <outside-evalu ref="othersell"></outside-evalu> -->
        <outside-other ref="othersell"></outside-other>
      </ElTabPane>
      <ElTabPane label="头程运费单价"
                 name="headfreight">
        <!-- <outside-evalu ref="othersell"></outside-evalu> -->
        <head-price ref="headfreight"></head-price>
      </ElTabPane>
      <ElTabPane label="VAT税费"
                 name="vat">
        <!-- <outside-evalu ref="vat"></outside-evalu> -->
        <outside-vat ref="vat"></outside-vat>
      </ElTabPane>
    </ElTabs>
  </div>
</template>
<script>
import outsideEvalu from './outside-evaluate-list'
import outsideOverseas from './outside-overseas/outside-overseas-list'
import headPrice from './head-price/head-price-list'
import outsideOther from './outside-other/outside-other-list'
import outsideVat from './outside-vat/outside-vat-list'
export default {
  components: {
    outsideEvalu,
    outsideOverseas,
    headPrice,
    outsideOther,
    outsideVat
  },
  data () {
    return {
      activeTabs: 'assess'
    }
  },
  mounted () {
    this.$refs[this.activeTabs].init('assess')
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
