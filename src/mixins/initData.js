export const initData = {
  data: function () {
    return {

      // 分页
      paginationData: {
        currPage: 1,
        pageSize: 10,
        totalCount: 0,
        totalPage: 0
      }
    }
  }
  // methods: {
  // async init (api) {
  //   let data = await this.$fetch.get(api)
  //   this._netData = data
  // }
  // },
  // created () {
  //   this.getDataList()
  // },
  // watch: {
  //   value: {
  //     handler (val, oldVal) {
  //       this.dataForm = this.value
  //       this.$emit('change', this.dataForm)
  //     },
  //     deep: true
  //   },
  //   dataForm: {
  //     handler (val, oldVal) {
  //       this.$emit('input', this.dataForm)
  //     },
  //     deep: true
  //   }
  // }
}

export const ruleData = {
  data: function () {
    return {
      dataRule: {
        // 必填校验:
        isRequired: [{
          required: true,
          message: '必填项',
          trigger: 'blur'
        }],

        // 正整数(非0)
        isPosInteger: [{
          pattern: /^\+?[1-9][0-9]*$/,
          message: '正整数',
          trigger: 'blur'
        }],

        // 非负整数: (正整数和0)
        isNotNegativeInteger: [{
          pattern: /^\d+$/,
          message: '请输入正整数',
          trigger: 'blur'
        }],

        // 非负浮点数(包括小数和0):
        isNotNegativeFloat: [{
          pattern: /^\d+(\.\d+)?$/,
          message: '须正数',
          trigger: 'change'
        }],

        // 正浮点数
        isPositiveFloat: [{
          pattern: /^(([0-9]+\.[0-9]*[1-9][0-9]*)|([0-9]*[1-9][0-9]*\.[0-9]+)|([0-9]*[1-9][0-9]*))$/,
          message: '须正数',
          trigger: 'change'
        }],

        // 空
        isNO: [{
          required: false,
          message: '',
          trigger: 'change'
        }]
      }
    }
  }
}
