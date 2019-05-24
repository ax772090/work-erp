<template>
  <div>
    <el-checkbox v-if="canCheckAll"
                 :indeterminate="isIndeterminate"
                 v-model="checkAll"
                 @change="handleCheckAllChange">全选</el-checkbox>
    <div v-if="canCheckAll"
         style="line"></div>
    <el-checkbox-group v-model="checkedCities"
                       @change="handleCheckedCitiesChange">
      <el-checkbox v-for="city in citiesData"
                   :label="city"
                   :key="city">{{city}}</el-checkbox>
    </el-checkbox-group>
  </div>
</template>

<script>
/**
 * 目前组件只适用数组的形式,不适用复杂数组
 * 使用:
 *
 *
 *
 *
 */
export default {
  props: {
    // 多选数据,默认[],非复杂数组类型[{},{}]
    citiesData: {
      type: Array,
      default: function () {
        return []
      }
    },
    // 传入的数据是[{},{}]还是[],不同数据处理方式不同
    canCitiesData: {
      type: Boolean,
      default: function () {
        return false
      }
    },
    // 判断是否多选
    canCheckAll: {
      type: Boolean,
      default: function () {
        return false
      }
    }
  },
  data () {
    return {
      // 全选时候,不确定状态样式
      isIndeterminate: false,
      // 当前是否选择全选
      checkAll: false
    }
  },
  modules: {
    handleCheckAllChange (checkAll) {
      this.checkedCities = checkAll ? this.citiesData : []
      this.isIndeterminate = false
    },
    handleCheckedCitiesChange (city) {
      let checkedCount = city.length
      // 如果一个一个选择,选择所有的后,'所有'这个选项将打钩
      this.checkAll = checkedCount === this.cities.length
      // 如果一个一个选择,选择'部分'的后,'所有'这个选项将变横杠
      this.isIndeterminate = checkedCount > 0 && checkedCount < this.cities.length
    }
  },
  watch: {
    checkedCities (val) {

    }
  }
}
</script>

<style lang="sass" scoped>
.line
  margin: 15px 0
</style>
