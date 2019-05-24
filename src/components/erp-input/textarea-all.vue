<template>
  <!-- <div> -->
    <el-input :type="type"
              :value="currentValue"
              @input="handleInput"
              :autosize="compautosize"
              v-bind="$attrs"
              clearable>
    </el-input>
  <!-- </div> -->
</template>
<script>
// 使用:
// <cs v-model="textData"
//     :autosize="[2, 10]"
//     :disabled="false"
//     placeholder="显示提示文字"></cs>
export default {
  inheritAttrs: false,
  props: {
    type: {
      default: 'textarea'
    },
    autosize: {
      type: [Object, Array],
      default: function () {
        return {
          minRows: 1,
          maxRows: 3
        }
      }
    },
    value: [String, Number]
    // placeholder: {
    //   default: '请输入内容'
    // },

    // disabled: {
    //   type: Boolean,
    //   default: function () {
    //     return false
    //   }
    // }
  },

  data () {
    return {
      currentValue: this.value === undefined || this.value === null ? '' : this.value
    }
  },
  computed: {
    compautosize: {
      get () {
        return { minRows: this.autosize[0] || 1, maxRows: this.autosize[1] || 3 }
      },
      set () { }
    }
  },
  methods: {
    handleInput (val) {
      this.$emit('input', val)
    }
  },
  watch: {
    value (val, oldVal) {
      this.currentValue = val
      this.$emit('change', val)
    }
  }
  // watch: {
  //   value: {
  //     handler (val, oldVal) {
  //       this.textData = this.value
  //       this.$emit('change', this.textData)
  //     },
  //     deep: true
  //   },
  //   textData: {
  //     handler (val, oldVal) {
  //       this.$emit('input', val)
  //     },
  //     deep: true
  //   }
  // }
}
</script>
