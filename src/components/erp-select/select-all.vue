<template>
  <el-select v-model="selectVal"
             :placeholder="placeholder"
             :clearable="isClearable"
             filterable
             :collapse-tags='collapseTags'
             :multiple='isMultiple'
             :disabled='isDisabled'
             :filter-method="selectFilter"
             @change='selectChange'
             @visible-change='selectvisibleChange'
             @focus="selectFocus()">
    <el-option v-for="item in listData"
               :key="item[dataValue]"
               :label="item[dataLabel]"
               :value="item[dataValue]"
               :disabled="bUsedHander(item)">
    </el-option>
  </el-select>
</template>
<script>
/**
 * 使用:没有多选的情况
<select-all
  v-model="dataForm.saleCountryId"
  listDataOption='{}'
  dataValue='id'
  dataLabel='name'
  :isSelectChange='true'
  @selectChange="selectChange"
  placeholder="选择销售国家"
/>
 *
 */
// import { Select } from 'element-ui';  //用于继承Select组件信息
import { getFirstLetter } from '@/utils/pinyinUtils.js'

export default {
  // name: 'selectAll',
  props: {
    // ...Select.props, // 这里继承内在组件的props

    // 数据体
    listDataOption: { default: '' },
    // 得到数据后的key
    dataValue: { default: 'id' },
    // 得到数据后的name
    dataLabel: { default: 'name' },
    // 提示文字
    placeholder: { default: '可搜索' },
    // 接受外部v-model传入的值// 选择后的数据
    value: { default: '' },
    event: 'change',
    // 是否禁用
    size: { default: 'mini' },
    isDisabled: { default: false },
    isMultiple: { default: false },
    isClearable: { default: true },
    // 是否使用@change
    isSelectChange: { default: false },
    // 是否使用@change并且返回整条数据
    isSelectItemChange: { default: false },
    // 联动时用到（如：发货仓和目的仓）
    linkDisable: { default: '' },
    // 判断是否选择不禁用
    canSelectDisabled: { default: false },
    // 多选时是否将选中值按文字的形式展示
    collapseTags: {default: false}
  },
  data () {
    return {
      selectVal: '',
      listData: this.listDataOption,
      isSelectVisible: false,
      bUsed: true
    }
  },
  methods: {
    /**
    * 过滤选项
    */
    selectFilter (val) {
      if (val && val.trim() !== '') { // val存在
        this.listData = this.listDataOption.filter((item) => {
          if (!!~item[this.dataValue].indexOf(val) || !!~item[this.dataLabel].toUpperCase().indexOf(val.toUpperCase()) || !!~getFirstLetter(item[this.dataLabel]).indexOf(val)) {
            return true
          }
        })
      } else { // val为空时，还原数组
        this.listData = this.listDataOption
      }
    },
    // 当获得焦点的时候
    selectFocus () {
      // this.selectVal = ''
      this.listData = this.listDataOption
    },
    selectChange (value) {
      this.$nextTick(() => {
        // 是否使用@change并且返回整条数据
        if (this.isSelectItemChange && this.isSelectVisible) {
          for (const item of this.listData) {
            if (item[this.dataValue] === value) {
              this.$emit('selectChange', item)
              return
            }
          }
        }
        // 是否使用@change
        if (this.isSelectChange && this.isSelectVisible) {
          this.$emit('selectChange', value)
        }
      })
    },
    // 为了解决第一次不触发,容易造成清空别的地方的数据,
    selectvisibleChange (val) {
      this.isSelectVisible = true
    },
    // 判断选择项是否有bUsed
    bUsedHander (item) {
      if (this.canSelectDisabled) {
        return false
      }
      if (item && item.hasOwnProperty('bUsed')) {
        if (this.linkDisable && this.linkDisable === item[this.dataValue]) {
          return true
        }
        return !item.bUsed
      } else {
        return false
      }
    }
  },
  watch: {
    value: {
      handler (val, oldVal) {
        // this.selectVal=this.value;
        this.selectVal = val
        this.$emit('change', this.selectVal)
      },
      deep: true,
      immediate: true
    },
    selectVal: {
      handler (val, oldVal) {
        // 为空时
        if (!val) {
          this.selectFilter(val)
        }
        this.$emit('input', this.selectVal)
      },
      deep: true
    },
    listDataOption: {
      handler (val, oldVal) {
        this.listData = val
      },
      deep: true
    }
  }

}
</script>