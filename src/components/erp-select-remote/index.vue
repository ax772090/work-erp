<template>
  <el-select v-bind="$props"
             v-model="selectVal"
             remote>
    <el-option v-for="(item,index) in listData"
               :key="index"
               :label="item['name']"
               :value="item['id']">
    </el-option>
  </el-select>
</template>

<script>
import { Select } from 'element-ui'  // 用于继承Select组件信息

export default {
  name: 'erp-select-remote',
  props: {
    ...Select.props, // 这里继承内在组件的props

    httpUrl: { default: '' },
    httpMethod: { default: 'get' },
    requestParams: { default: '{}' },
    title: { default: '' },
    dataSource: { default: '' },
    dataValue: { default: 'id' },
    dataLabel: { default: 'name' },
    value: { default: '' }    // 接受外部v-model传入的值
  },

  data () {
    return {
      listData: [],
      selectVal: ''
    }
  },

  mounted () {
    this.getDataList()
  },

  methods: {
    /*
    加载列表数据
    */
    getDataList () {
      this.listData = []
      if (this.httpUrl === '') {
        this.selectVal = '{httpUrl}未设置'
      }

      if (this.dataSource === '') {
        this.selectVal = '{dataSource}未设置'
      }

      if (this.httpUrl === '' || this.dataSource === '') {
        return
      }

      this.$http({
        url: this.$http.adornUrl(this.httpUrl),
        method: !this.httpMethod ? 'get' : this.httpMethod,
        params: this.$http.adornParams(this.requestParams)
      }).then(({ data }) => {
        if (data && data.code === 0) {
          this.listData = []
          var tmpObj = {}
          if (!data[this.dataSource]) {
            this.selectVal = '{DataSource}不正确'
          } else {
            data[this.dataSource].forEach(item => {
              let data_value = ''
              let data_label = ''
              if (!item[this.dataValue]) {
                data_label += '{dataValue:' + this.dataValue + '}不正确;'
              } else {
                data_value = item[this.dataValue]
              }

              if (!item[this.dataLabel]) {
                data_label += '{dataLabel:' + this.dataLabel + '}不正确;'
              } else if (data_label === '') {
                data_label = item[this.dataLabel]
              }

              tmpObj = {
                id: data_value,
                name: data_label
              }
              this.listData.push(tmpObj)
            })
          }
        }
      })
    }
  },

  watch: {
    // 父组件传值给当前子组件 对应 :value=...
    value: {
      handler (val, oldVal) {
        this.selectVal = this.value

        // 该行与v-model无关，为的是让父级监听该事件并做其他事
        this.$emit('change', this.selectVal)
      },
      // 深度监听，可监听到对象、数组的变化
      deep: true
    },

    // 用于当前子组件传值给父组
    selectVal: {
      handler (val, oldVal) {
        // 父级的v-model 默认可以接收该事件,实现将值传递给父级
        this.$emit('input', this.selectVal)
      },
      // 深度监听，可监听到对象、数组的变化
      deep: true
    },

    // 当前组件变动后，抛出事件
    requestParams: {// 深度监听，可监听到对象、数组的变化
      handler (val, oldVal) {
        this.getDataList()
      },
      deep: true
    }
  }

}
</script>
