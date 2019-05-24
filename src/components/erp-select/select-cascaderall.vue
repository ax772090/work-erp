<template>
  <div>
    <!-- 产品分类级联 -->
    <!-- v-bind="$props" -->
    <el-cascader v-model="computedSelectVal"
                 :options="cascaderListData1"
                 :props="{ value: dataValue, label: dataLabel, children: dataChildren }"
                 :disabled='isDisabled'
                 change-on-select
                 clearable
                 filterable>
    </el-cascader>
  </div>
</template>

<script>
export default {
  name: 'select-cascaderall',
  props: {
    value: {
      type: [String, Array],
      default: function () {
        return []
      }
    },
    cascaderListData: {
      required: true,
      type: Array,
      default: function () {
        return []
      }
    },
    dataValue: { default: 'id' },
    dataLabel: { default: 'name' },
    dataChildren: { default: 'children' },
    isDisabled: { default: false },
    placeholder: { default: '请选择' }

  },
  data () {
    return {
      selectValArr: '',
      selectVal: ''
    }
  },

  computed: {
    computedSelectVal: {
      get () {
        return this.selectValArr
      },
      set (val) {
        this.selectValArr = val
        this.selectVal = val[val.length - 1]
      }
    },
    cascaderListData1: {
      get () {
        return this.itemRecursion(this.cascaderListData)
      }
    }
  },

  methods: {
    itemRecursion (list) {
      for (const item of list) {
        if (item.hasOwnProperty('bUsed')) {
          item.bUsed = !item.bUsed
          if (item[this.dataChildren]) {
            this.itemRecursion(item)
          }
        } else {
          return list
        }
      }
    },

    getArrayFromStr (value) {
      if (!value) {
        return []
      }
      for (const item1 of this.cascaderListData) {
        let levelPathArr = item1.levelPath.split('.')
        if (levelPathArr.indexOf(value) > -1) {
          return levelPathArr
        }
      }
      return []
    }
  },

  watch: {
    value: {
      handler (val, oldVal) {
        this.selectVal = val
        this.selectValArr = this.getArrayFromStr(val)
        this.$emit('change', this.selectVal)
      },
      deep: true
    },

    selectVal: {
      handler (val, oldVal) {
        this.$emit('input', val)
      },
      deep: true
    }
  }

}
</script>