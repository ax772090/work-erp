<template>
  <!-- 暂时功能还有问题 -->
  <!-- 产品分类级联 -->
  <el-cascader v-model="selectVal"
               v-bind="$props"
               :options="listData"
               :props="{value:dataValue,label:dataLabel,children:dataChildren}"
               change-on-select
               clearable
               @change="handleChange"
               filterable>
  </el-cascader>
</template>

<script>
import { Select } from 'element-ui'  // 用于继承Select组件信息

export default {
  name: 'erp-cascader',
  props: {
    ...Select.props, // 这里继承内在组件的props

    httpUrl: { default: '' },
    httpMethod: { default: 'get' },
    requestParams: { default: '' },
    title: { default: '' },
    dataList: { type: Array },
    // 得到数据后拿到的数据体名
    dataSource: { default: '' },
    dataValue: { default: 'id' },
    dataLabel: { default: 'name' },
    dataChildren: { default: 'children' },
    dataDisabled: { default: 'bUsed' },
    // dataDisabled: {
    //   default () {
    //     return false
    //   }
    // },
    // 判断是否选择禁用
    canSelectDisabled: { default: false },
    // propsOptionTemp: {
    //   type: Object,
    //   default() {
    //     return {
    //       children: '',
    //       label: 'name',
    //       value: 'id',
    //     };
    //   }
    // },
    value: {
      type: [Array, String],
      default: () => []
      // default:''
    }    // 接受外部v-model传入的值
  },
  data () {
    return {
      listData: [],
      selectVal: this.value
    }
  },

  mounted () {
    this.getDataList()
  },

  methods: {
    handleChange (value) {
      // this.categoryId = value
      // if (value) {
      //     this.selectVal = this.categoryId[this.categoryId.length - 1]
      // }
    },
    /*
    加载列表数据
    */
    getDataList () {
      this.listData = []
      var tmpObj = {}

      if (this.dataList) {
        this.getSelectOptions(this.dataList)
        return
      }

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
          this.listData = data[this.dataSource]
          this.$emit('listData', this.listData, this.dataValue, this.dataChildren)
        }
      })
    },
    getSelectOptions (list) {

    }
  },

  watch: {
    value: {
      handler (val, oldVal) {
        this.selectVal = this.value
        this.$emit('change', this.selectVal)
      },
      deep: true
    },

    selectVal: {
      handler (val, oldVal) {
        // let selectVal = val[val.length -1]
        this.$emit('input', val)
      },
      deep: true
    },

    requestParams: {
      handler (val, oldVal) {
        this.getDataList()
      },
      deep: true
    }
  }

}
</script>