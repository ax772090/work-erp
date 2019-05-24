<template>
  <el-radio-group v-model="radio"
                  @change="radioHanler"
                  :text-color="textColor"
                  :fill="fill">
    <el-radio-button v-for="(item, index) in radioListData"
                     :key="index"
                     :label="item[radioKey]">{{item[radioKeyName]}}</el-radio-button>
  </el-radio-group>
</template>
<script>
// <radio-all v-model="radio"
//     :radioListData="radioListData"
//     @change="radioSsearch"></radio-all>
export default {
  props: {
    value: {
      type: String,
      default: ''
    },
    radioListData: {
      required: true,
      type: Array,
      default: function () {
        return {}
      }
    },
    radioKey: {
      type: String,
      default: 'key'
    },
    radioKeyName: {
      type: String,
      default: 'value'
    },
    textColor: {
      type: String,
      default: ''
    },
    fill: {
      type: String,
      default: ''
    }
  },
  data () {
    return {
      radio: this.value
    }
  },
  methods: {
    radioHanler () {
      this.$emit('change', this.radio)
    }
  },
  watch: {
    value: {
      handler (val, oldVal) {
        this.radio = val
        // this.$emit('change', this.radio)
      },
      deep: true
    },
    radio: {
      handler (val, oldVal) {
        this.$emit('input', this.radio)
      },
      deep: true
    }
  }
}
</script>
