<template>
  <div>
    <el-form :model="dataForm"
             :rules="dataRule"
             ref="dataForm"
             label-width="110px"
             :disabled="formDisabled">
      <el-row>
        <el-col :span="8">
          <el-badge class="item">库存计划:</el-badge>
          <el-form-item class="el-form-item-copy"
                        label="是否启用预警"
                        prop="lockQty">
            <el-checkbox v-model="dataForm.bMinStock">最小库存</el-checkbox>
            <el-checkbox v-model="dataForm.bMaxStock">最大库存</el-checkbox>
          </el-form-item>
          <el-form-item label="最小库存"
                        prop="minQty"
                        :rules="dataRule.isNotNegativeInteger">
            <el-input v-model="dataForm.minQty"
                      type="Number"
                      @mousewheel.native.prevent
                      :disabled="!dataForm.bMinStock"></el-input>
          </el-form-item>
          <el-form-item label="最大库存"
                        prop="maxQty"
                        :rules="dataRule.isNotNegativeInteger">
            <el-input v-model="dataForm.maxQty"
                      type="Number"
                      @mousewheel.native.prevent
                      :disabled="!dataForm.bMaxStock"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-badge class="item">库存控制:</el-badge>
          <el-form-item class="el-form-item-copy"
                        prop="bLock">
            <el-checkbox v-model="dataForm.bLock">可锁库</el-checkbox>
          </el-form-item>
          <el-form-item label="默认仓库"
                        prop="defaultWarehouseId">
            <select-all v-model="dataForm.defaultWarehouseId"
                        :listDataOption="defaultWarehouseIdOptions"
                        data-value="id"
                        data-label="name"></select-all>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-badge class="item">库存管理:</el-badge>
          <el-form-item class="el-form-item-copy"
                        label>
            <el-checkbox v-model="dataForm.bBatckManage">是否启用批号</el-checkbox>
          </el-form-item>
          <el-form-item label="库存单位"
                        prop="unitId">
            <select-all v-model="dataForm.unitId"
                        :listDataOption="unitIdOptions"
                        data-value="id"
                        data-label="name"></select-all>
          </el-form-item>
          <el-form-item class="el-form-item-copy"
                        label
                        prop="bShelfLife">
            <el-checkbox v-model="dataForm.bShelfLife">启用保质期管理</el-checkbox>
          </el-form-item>
          <el-form-item label="保质期单位"
                        prop="shelfLifeUnitId">
            <select-all v-model="dataForm.shelfLifeUnitId"
                        :listDataOption="shelfLifeUnitIdOptions"
                        data-value="key"
                        data-label="value"></select-all>
          </el-form-item>
          <el-form-item label="保质期"
                        prop="shelfLifeNumber"
                        :rules="dataRule.isNotNegativeInteger">
            <el-input v-model="dataForm.shelfLifeNumber"
                      :disabled="!dataForm.bShelfLife"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
  </div>
</template>

<script>
import selectAll from '@/components/erp-select/select-all'
import Bus from '@/components/js/bus.js'
import { basicBasicwarehouseListcombobox, dictDictunitListcombobox, dictDateUnit } from '@/api/common/common.api'
// const cityOptions = ['安全库存', '最小库存', '最大库存']
export default {
  props: ['value'],
  components: {
    selectAll
  },
  data () {
    return {
      formDisabled: false,
      type: '',
      // 多选框end

      dataForm: {
        id: '',
        // 启用安全库存
        radio0: false,
        // 启用最小库存
        bMinStock: false,
        // 启用最大库存
        bMaxStock: false,
        // 是否启用批号
        bBatckManage: false,
        // 启用保质期管理
        bShelfLife: false,
        minQty: '',
        maxQty: '',
        // 库存控制(是否锁定)
        bLock: false,
        // 库存
        defaultWarehouseId: '',
        unitId: '',
        batchCodingRules: '',
        shelfLifeUnitId: '',
        shelfLifeNumber: ''
      },
      // 默认仓库
      defaultWarehouseIdOptions: '',
      // 库存单位
      unitIdOptions: '',
      // 保质期单位
      shelfLifeUnitIdOptions: '',

      dataRule: {
        isNotNegativeInteger: [
          { pattern: /^\d+$/, message: '请输入正整数', trigger: 'blur' }
        ]
      }
    }
  },
  created () {
    // 默认仓库
    basicBasicwarehouseListcombobox().then(data => { this.defaultWarehouseIdOptions = data.list })
    // 库存单位
    dictDictunitListcombobox().then(data => { this.unitIdOptions = data.list })
    // 保质期单位
    dictDateUnit({ dataDictKey: 'DATE_UNIT' }).then(data => { this.shelfLifeUnitIdOptions = data.fontMaps })
  },
  methods: {
    init (id, type, handleType, dataForm) {
      this.dataForm.addTime = ''
      this.dataForm.addUser = ''
      this.dataForm.updTime = ''
      this.dataForm.updUser = ''
      this.dataForm.id = id
      this.type = type
      if (handleType === '1') {
        this.formDisabled = true
      } else if (handleType === 'copy') {
        for (var key in dataForm.prodWarehouseEntity) {
          if (key !== 'prodId' && key !== 'addTime' && key !== 'addUser' && key !== 'updTime' && key !== 'updUser') {
            this.$set(this.dataForm, key, dataForm.prodWarehouseEntity[key])
          }
        }
      }
      if (id) {
        this.$nextTick(() => {
          if (this.dataForm.id) {
            this.$http({
              url: this.$http.adornUrl(
                `prod/prodbasic/info/${this.dataForm.id}/${this.type}`
              ),
              method: 'get',
              params: this.$http.adornParams({}, false)
            }).then(({ data }) => {
              if (data && data.code === 0) {
                for (var key in data.prodWarehouseEntity) {
                  if (key !== 'prodId') {
                    this.$set(
                      this.dataForm,
                      key,
                      data.prodWarehouseEntity[key]
                    )
                  }
                }
              }
            })
          }
        })
      }
    },

    // 选择了就添加到checkedCities(已选数组)
    // handleCheckAllChange (val) {
    //   this.checkedCities = val ? cityOptions : []
    //   this.isIndeterminate = false
    // },

    // 判断是否是全选
    // handleCheckedCitiesChange (value) {
    //   let checkedCount = value.length
    //   this.checkAll = checkedCount === this.cities.length
    //   this.isIndeterminate = checkedCount > 0 && checkedCount < this.cities.length
    // },

    // 表单提交
    dataFormSubmit: _.debounce(
      async function dataFormSubmit (id, type) {
        this.$refs['dataForm'].validate(valid => {
          if (valid) {
            this.$http({
              url: this.$http.adornUrl('prod/prodbasic/update'),
              method: 'put',
              data: {
                prodId: id,
                type: type,
                prodWarehouseEntity: this.dataForm
              }
            }).then(({ data }) => {
              if (data && data.code === 0) {
                Bus.$emit('prodTabChildren')
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

    // // 校验
    // validate (activeName) {
    //   this.$refs['dataForm'].validate(valid => {
    //     if (valid) {
    //       this.$emit('nextStep', activeName)
    //     }
    //   })
    // }
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
<style scoped>
.item {
  margin-bottom: 20px;
  margin-left: 20px;
  font-size: 20px;
  font-weight: 600;
}
</style>