<template>
  <div>
    <!-- 固定时间点 -->
    <el-time-select v-if="typeName === 'timeSelect'"
                    v-model="dateValue"
                    clearable
                    :value-format='valueFormat'
                    :disabled='isDisabled'
                    :default-value='defaultValue'
                    :picker-options="pickerOptions"
                    placeholder="选择时间">
    </el-time-select>

    <!-- 任意时间点 -->
    <!-- arrow-control: 打开arrow-control属性则通过界面上的箭头进行选择 -->
    <el-time-picker v-if="typeName === 'timeSelectRange'"
                    v-model="dateValue"
                    :disabled='isDisabled'
                    clearable
                    :is-range='isRange'
                    :value-format='valueFormat'
                    :default-value='defaultValue'
                    :picker-options="pickerOptions"
                    :arrow-control='isArrowControl'
                    placeholder="任意时间点">
    </el-time-picker>

    <!-- 任意时间范围 -->
    <el-time-picker v-if="typeName === 'timePickerRange'"
                    is-range
                    :arrow-control='isArrowControl'
                    v-model="dateValue"
                    :disabled='isDisabled'
                    :default-value='defaultValue'
                    clearable
                    :value-format='valueFormat'
                    range-separator="至"
                    start-placeholder="开始时间"
                    end-placeholder="结束时间"
                    placeholder="选择时间范围">
    </el-time-picker>
  </div>
</template>
<script>
/**
 * 时间的使用方法:
<timePicker-all
  v-model="dateValue"
  :pickerOptions='pickerOptions'
  :typeName='typeName'
  :arrow-control='isArrowControl'
  :disabled='isDisabled'
  >
</timePicker-all>
 *
 */
export default {
  name: 'time-picker-all',
  props: {
    // 接受外部v-model传入的值
    value: { default: '' },
    // 类型==>1.固定时间点 2.任意时间点 3.固定时间范围 4.任意时间范围
    typeName: { default: 'timeSelect' },
    // 数据格式
    valueFormat: { default: 'HH:mm:ss' },
    // 是否禁用
    isDisabled: { default: false },
    //是否显示箭头
    isArrowControl: { default: false },
    //默认显示时间
    defaultValue: {
      type: [Date, String],
      default: ''
    },
    pickerOptions: {
      type: Object,
      default: {}
    }
  },
  data () {
    return {

      dateValue: ''
    };
  },
  watch: {
    value: {
      handler (val, oldVal) {
        console.log('时间', this.value);

        this.dateValue = this.value
        this.$emit('change', this.dateValue)
      },
      deep: true,
      immediate: true
    },
    // 子传父
    dateValue: {
      handler (val, oldVal) {
        this.$emit('input', this.dateValue)
      },
      deep: true
    }
  }
}
</script>