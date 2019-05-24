export const initNet = {
  data: function () {
    return {
      paginationData: {
        currPage: 1,
        pageSize: 10,
        totalCount: 0,
        totalPage: 0
      }
    }
  },
  methods: {
    async init (api) {
      let data = await this.$fetch.get(api)
      this._netData = data
    }
  }
}

export const ClearDataMixin = {
  created () {
    this.defaultData = JSON.parse(JSON.stringify(this.$data))
  },
  methods: {
    resetData () {
      this.$data = Object.assign(this.$data, this.defaultData)
    }
  }
}

// var ClearDataMixin = Vue.mixin({
// 	created() {
//     	this.defaultData = JSON.parse(JSON.stringify(this.$data))
//     },
//     methods: {
//     	resetData() {
//         	this.$data = Object.assign(this.$data, this.defaultData)
//         }
//     }
// })
