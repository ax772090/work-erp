<template>
  <div>
    <!-- 
      type="daterange"
      align="right"                        向右边对齐
      unlink-panels                        属性解除联动
      clearable                            可清除
      range-separator="至"
      start-placeholder="开始日期"
      end-placeholder="结束日期"
      default-value                        默认时间
      format="yyyy MM DD HH:MM:SS"         显示的时间格式
      value-format="yyyy-MM-dd"            值得格式
      :picker-options="pickerOptions"      快捷选择时间段
      -->
    <el-date-picker v-model="dateValue"
                    :type="typeName"
                    :align="align"
                    unlink-panels
                    clearable
                    :disabled='disabled'
                    :placeholder='placeholder'
                    :range-separator="rangeSeparator"
                    :start-placeholder="startPlaceholder"
                    :end-placeholder="endPlaceholder"
                    :format="format"
                    :value-format="valueFormat"
                    picker-options="pickerOptions"
                    @change='dateChange'>
    </el-date-picker>

  </div>
</template>
<script>
export default {
  name: 'date-picker-all',
  props: {
    // 接受外部v-model传入的值
    value: { default: '' },
    // 类型
    typeName: { type: String, default: 'date' }, // year/month/date/dates/ week/datetime/datetimerange/ daterange/monthrange
    // 显示在输入框中的格式
    format: { type: String, default: 'yyyy-MM-dd' },
    // 对齐方式
    align: { type: String, default: 'left' },
    // 数据格式
    valueFormat: { type: String, default: '' },
    // 非范围选择时的占位内容
    placeholder: { type: String, default: '' },
    // 提示文字
    rangeSeparator: { default: '至' },
    startPlaceholder: { default: '开始日期' },
    endPlaceholder: { type: String, default: '结束日期' },
    // 禁用
    disabled: { type: Boolean, default: false }
  },
  data () {
    return {
      pickerOptions: {
        shortcuts: [{
          text: '最近一周',
          onClick (picker) {
            const end = new Date()
            const start = new Date()
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 7)
            picker.$emit('pick', [start, end])
          }
        }, {
          text: '最近一个月',
          onClick (picker) {
            const end = new Date()
            const start = new Date()
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 30)
            picker.$emit('pick', [start, end])
          }
        }, {
          text: '最近三个月',
          onClick (picker) {
            const end = new Date()
            const start = new Date()
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 90)
            picker.$emit('pick', [start, end])
          }
        }]
      },
      dateValue: ''
    }
  },
  methods: {
    // 选择日期
    dateChange (value) {
    }
  },
  watch: {
    value: {
      handler (val, oldVal) {
        this.dateValue = val
        this.$emit('change', val)
      },
      deep: true,
      immediate: true
    },
    // 子传父
    dateValue: {
      handler (val, oldVal) {
        this.$emit('input', val)
      },
      deep: true
    }
  }
}
</script>
<style scoped>
</style>

