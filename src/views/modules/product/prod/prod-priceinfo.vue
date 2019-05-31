<template>
  <div>
    <el-form :inline="true"
             :model="dataForm"
             ref="dataForm"
             :rules="dataRule"
             :disabled="formDisabled">
      <div>
        <el-row>
          <el-button type="primary"
                     @click="sellNewAddList()">
            <i class="iconfont el-icon--left erp-icon-tianjiamingxi"></i>新增明细行
          </el-button>
        </el-row>
        <el-table :data="dataForm.prodSaleEntityList"
                  border
                  v-loading="dataListLoading">
          <el-table-column type="index"
                           label="序号"
                           width="50"></el-table-column>
          <el-table-column prop="channelId"
                           label="销售店铺"
                           min-width="250px">
            <template slot-scope="scope">
              <el-form-item :prop="'prodSaleEntityList[' + scope.$index + '].channelId'"
                            :rules="dataRule.channelId"
                            label-width="0px">
                <select-all v-model="scope.row.channelId"
                            :listDataOption="channelIdOptions"
                            data-value="id"
                            data-label="name"></select-all>
                <!-- <el-select v-model="scope.row.channelId">
                  <el-option v-for="item in channelIdOptions"
                             :key="item.id"
                             :label="item.name"
                             :value="item.id"></el-option>
                </el-select> -->
              </el-form-item>
            </template>
          </el-table-column>
          <el-table-column prop="currencyId"
                           label="币别"
                           min-width="250px">
            <template slot-scope="scope">
              <select-all v-model="scope.row.currencyId"
                          :listDataOption="currencyIdOptions"
                          data-value="id"
                          data-label="name"></select-all>
              <!-- <el-select v-model="scope.row.currencyId">
                <el-option v-for="item in currencyIdOptions"
                           :key="item.id"
                           :label="item.name"
                           :value="item.id"></el-option>
              </el-select> -->
            </template>
          </el-table-column>
          <el-table-column prop="suggestPrice"
                           label="最低销售价"
                           min-width="250px">
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
                         size="small"
                         circle
                         title="删除"
                         @click="deleteHandle(scope)">
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
import { basicDataQueryAllCurrency, basicBasicchannelListcombobox } from '@/api/common/common.api'
export default {
  props: ['value'],
  components: {
    selectSeach,
    selectAll
  },
  data () {
    const validatechannelId = (rule, value, cb) => {
      if (this.dataForm.prodSaleEntityList.length > 0) {
        let isFalse = 0
        for (const item of this.dataForm.prodSaleEntityList) {
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
      // 结算币别（没）也是销售相关的币别
      currencyIdOptions: [],
      // 销售店铺
      channelIdOptions: [],
      type: '',
      dataFormCopy: {},
      dataForm: {
        prodId: '',
        // 销售相关
        prodSaleEntityList: []
      },
      dataListLoading: false,
      dataRule: {
        channelId: [{ validator: validatechannelId, trigger: 'change' }]
      }
    }
  },
  created () {
    // 币别
    basicDataQueryAllCurrency().then(data => { this.currencyIdOptions = data.currencyList })
    // 销售站点
    basicBasicchannelListcombobox().then(data => { this.channelIdOptions = data.list })
  },
  methods: {
    init (id, type, handleType, dataForm) { // 4
      this.dataForm.prodSaleEntityList = []
      this.dataFormCopy = {}
      this.dataForm.prodId = id
      this.type = type
      if (handleType === '1') {
        this.formDisabled = true
      } else if (handleType === 'copy') {
        this.dataFormCopy = dataForm.priceInfoEntity
        this.dataForm = dataForm.priceInfoEntity
        for (const item of this.dataForm.prodSaleEntityList) {
          this.$set(item, 'id', '')
        }
      }
      if (id) {
        this.$nextTick(() => {
          if (this.dataForm.prodId) {
            this.$http({
              url: this.$http.adornUrl(
                `prod/prodbasic/info/${this.dataForm.prodId}/${this.type}`
              ),
              method: 'get'
            }).then(({ data }) => {
              if (data && data.code === 0) {
                this.dataFormCopy = data.priceInfoEntity
                this.dataForm = data.priceInfoEntity
              }
            })
          }
        })
      }
    },

    // 销售相关新增行
    sellNewAddList () {
      this.dataForm.prodSaleEntityList.push({})
    },

    // 销售相关删除行
    deleteHandle (scope) {
      this.dataForm.prodSaleEntityList.splice(scope.$index, 1)
    },

    // 表单提交
    dataFormSubmit: _.debounce(
      async function dataFormSubmit (id, type) {
        this.$refs.dataForm.validate(valid => {
          if (valid) {
            this.$http({
              url: this.$http.adornUrl('prod/prodbasic/update'),
              method: 'put',
              data: { prodId: id, type: type, priceInfoEntity: this.dataForm }
            }).then(({ data }) => {
              if (data && data.code === 0) {
                Bus.$emit('prodTabChildren')
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
        this.$emit('change', this.dataForm)
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