<template>
  <div>
    <el-form :inline="true"
             :model="dataForm"
             ref="dataForm"
             :disabled="formDisabled">
      <div>
        <el-row>
          <el-button type="primary"
                     @click="sellNewAddList()">
            <i class="iconfont el-icon--left el-icon-erp-numpickerplus"></i>新增明细行
          </el-button>
        </el-row>
        <el-table :data="dataForm.prodDevSaleEntityList"
                  border>
          <el-table-column type="index"
                           label="序号"
                           width="50"></el-table-column>
          <el-table-column prop="channelId"
                           label="销售店铺">
            <template slot-scope="scope">
              <el-form-item :prop="'prodDevSaleEntityList[' + scope.$index + '].channelId'"
                            :rules="dataRule.channelId">
                <select-all v-model="scope.row.channelId"
                            :listDataOption="channelIdOptions"
                            data-value="id"
                            data-label="name"></select-all>
              </el-form-item>
            </template>
          </el-table-column>
          <el-table-column prop="currencyId"
                           label="币别">
            <template slot-scope="scope">
              <select-all v-model="scope.row.currencyId"
                          :listDataOption="currencyIdOptions"
                          data-value="id"
                          data-label="name"></select-all>
            </template>
          </el-table-column>
          <el-table-column prop="suggestPrice"
                           label="最低销售价">
            <template slot-scope="scope">
              <el-input v-model="scope.row.suggestPrice"
                        type="number"
                        @mousewheel.native.prevent></el-input>
            </template>
          </el-table-column>
          <el-table-column fixed="right"
                           min-width="80"
                           label="操作">
            <template slot-scope="scope">
              <el-button type="danger"
                         circle
                         title="删除"
                         @click="saledeleteHandle(scope)">
                <i class="iconfont erp-icon-shanchu"></i>
              </el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </el-form>
  </div>
</template>

<script>
import selectSeach from '@/components/erp-select/select-seach'
import selectAll from '@/components/erp-select/select-all'
import Bus from '@/components/js/bus.js'

export default {
  props: ['value'],
  components: {
    selectSeach,
    selectAll
  },
  data () {
    const validatechannelId = (rule, value, cb) => {
      if (this.dataForm.prodDevSaleEntityList.length > 0) {
        let isFalse = 0
        for (const item of this.dataForm.prodDevSaleEntityList) {
          if (value === item.channelId) {
            isFalse++
          }
        }
        if (isFalse > 1) {
          cb(new Error('销售店铺重复'))
        } else {
          cb()
        }
      } else {
        cb()
      }
    }
    return {
      formDisabled: false,
      // 结算币别也是销售相关的币别
      currencyIdOptions: [],
      // 销售站点
      channelIdOptions: [],
      type: '',
      dataForm: {
        prodId: '',
        // 销售相关数据
        prodDevSaleEntityList: []
      },
      dataRule: {
        channelId: [{ validator: validatechannelId, trigger: 'change' }]
      }
    }
  },
  created () {
    // 结算币别
    this.$http.get(this.$http.adornUrl('basicData/queryAllCurrency')).then(({ data }) => { this.currencyIdOptions = data.currencyList })
    // 销售店铺
    this.$http.get(this.$http.adornUrl('basic/basicchannel/listcombobox')).then(({ data }) => { this.channelIdOptions = data.list })
  },
  methods: {
    init (id, type, handleType) { // 4
      this.dataForm.prodDevSaleEntityList = []
      if (handleType === 'canCheck') {
        this.formDisabled = true
      }
      // 审核
      if (handleType === 'canApproval') {
        this.formDisabled = true
      }
      this.dataForm.prodId = id
      this.type = type
      this.$nextTick(() => {
        if (this.dataForm.prodId) {
          this.$http({
            url: this.$http.adornUrl(`/prod/proddevbasic/info/${this.dataForm.prodId}/${this.type}`),
            method: 'get',
            params: this.$http.adornParams({}, false)
          }).then(({ data }) => {
            if (data && data.code === 0) {
              this.dataForm = data.devPriceInfoEntity
            }
          })
        }
      })
    },

    // 销售相关新增行
    sellNewAddList () {
      this.dataForm.prodDevSaleEntityList.push({})
    },

    // 销售相关删除行
    saledeleteHandle (scope) {
      this.dataForm.prodDevSaleEntityList.splice(scope.$index, 1)
    },

    // 表单提交
    dataFormSubmit: _.debounce(
      async function dataFormSubmit (id, type) {
        this.$refs['dataForm'].validate(valid => {
          if (valid) {
            this.$http({
              url: this.$http.adornUrl('prod/proddevbasic/update'),
              method: 'put',
              data: this.$http.adornData({
                prodId: id,
                type: type,
                devPriceInfoEntity: this.dataForm
              })
            }).then(({ data }) => {
              if (data && data.code === 0) {
                Bus.$emit('prodDevTabsChildren')
                // this.$emit('nextStep')
                this.$notify.success({
                  message: '保存成功',
                  duration: 5000
                })
              } else {
                this.$notify.error({
                  message: data.msg,
                  duration: 5000
                })
              }
            })
          }
        })
      }, 1000, {
        leading: true,
        trailing: false
      }
    ),

    // 校验
    validate () {
      return new Promise((resolve, reject) => {
        this.$refs['dataForm'].validate(valid => {
          if (valid) {
            resolve(valid)
          } else {
            reject(valid)
          }
        })
      })
    }
  },
  watch: {
    value: {
      handler (val, oldVal) {
        this.dataForm = this.value
      },
      deep: true
    },
    dataForm: {
      handler (val, oldVal) {
        this.$emit('input', this.dataForm)
      },
      deep: true
    }
  }
}
</script>