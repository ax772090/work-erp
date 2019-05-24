<template>
  <div class="dateTimePicker">
    <!-- 单选日期时间 -->
    <el-date-picker v-model="dateTimeData"
                    type="datetime"
                    align="right"
                    editable
                    clearable
                    default-time="12:00:00"
                    placeholder="选择日期时间"
                    value-format
                    :picker-options="pickerOptions"
                    @change="changeDateTime"
                    v-bind="$attrs"
                     />
    <!-- 选择日期时间范围 -->
    <el-date-picker v-model="value5"
                    type="datetimerange"
                    align="right"
                    editable
                    clearable
                    range-separator="至"
                    start-placeholder="开始日期"
                    end-placeholder="结束日期"
                    value-format
                    :picker-options="pickerOptions2"
                    @change="changeDateTime"
                    v-bind="$attrs"
                     />
  </div>
</template>

<script>
export default {
  inheritAttrs: false,
  props: {
    value: ''
// dateTimeData: {

// }
  },
  data () {
    return {
      pickerOptions: {
        shortcuts: [{
          text: '今天',
          onClick (picker) {
            picker.$emit('pick', new Date())
          }
        }, {
          text: '昨天',
          onClick (picker) {
            const date = new Date()
            date.setTime(date.getTime() - 3600 * 1000 * 24)
            picker.$emit('pick', date)
          }
        }, {
          text: '一周前',
          onClick (picker) {
            const date = new Date()
            date.setTime(date.getTime() - 3600 * 1000 * 24 * 7)
            picker.$emit('pick', date)
          }
        }]
      },
      pickerOptions2: {
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
      dateTimeData: '',
      value5: ''
    }
  },
  methods: {
    changeDateTime (val) {
    }
  },
  watch: {
    value: {
      handler (val, oldVal) {
        this.dateTimeData = val
      },
      deep: true
    },
    dateTimeData: {
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

