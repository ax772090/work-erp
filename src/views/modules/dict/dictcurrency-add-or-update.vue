<template>
  <el-dialog :title="!dataForm.id ? '币别新增' : '币别修改'"
             :close-on-click-modal="false"
             :visible.sync="visible"
             width="50%"
             :before-close="handleClose">
    <el-form :model="dataForm"
             :rules="dataRule"
             ref="dataForm"
             label-width="150px">
      <el-row>
        <el-col :span="12">
          <el-form-item label="币别代码"
                        prop="code">
            <el-input v-model="dataForm.code"
                      placeholder="币别代码"
                      :disabled="isDisabled"></el-input>
          </el-form-item>
          <el-form-item label="单价精度"
                        prop="uniteAccuracy">
            <el-select v-model="dataForm.uniteAccuracy.value"
                       clearable>
              <el-option v-for="item in dataForm.uniteAccuracy.options"
                         :key="item.key"
                         :label="item.name"
                         :value="item.key"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="货币符号"
                        prop="dictCurrencySymbol">
            <el-select v-model="dataForm.dictCurrencySymbol.value"
                       clearable>
              <el-option v-for="item in dataForm.dictCurrencySymbol.options"
                         :key="item.key"
                         :label="item.value"
                         :value="item.key"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="舍入类型"
                        prop="dictCurrencyRound">
            <el-select v-model="dataForm.dictCurrencyRound.value"
                       clearable>
              <el-option v-for="item in dataForm.dictCurrencyRound.options"
                         :key="item.value"
                         :label="item.name"
                         :value="item.value"></el-option>
            </el-select>
          </el-form-item>

          <el-form-item label="状态"
                        prop="bUsed">
            <el-radio-group v-model="dataForm.bUsed">
              <el-radio :label="false">禁用</el-radio>
              <el-radio :label="true">正常</el-radio>
            </el-radio-group>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="币别名称"
                        prop="name">
            <el-input v-model="dataForm.name"></el-input>
          </el-form-item>
          <el-form-item label="金额精度"
                        prop="moneyAccuracy">
            <el-select v-model="dataForm.moneyAccuracy.value"
                       clearable>
              <el-option v-for="item in dataForm.moneyAccuracy.options"
                         :key="item.key"
                         :label="item.name"
                         :value="item.key"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="是否显示货币符号"
                        prop="displaySymbols">
            <el-radio-group v-model="dataForm.displaySymbols">
              <el-radio :label="false">否</el-radio>
              <el-radio :label="true">是</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="备注"
                        prop="remarks">
            <textarea-all v-model="dataForm.remarks"></textarea-all>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
    <span slot="footer"
          class="dialog-footer">
      <el-button @click="cancel('dataForm')"><i class="iconfont erp-icon-quxiao"></i>取消</el-button>
      <el-button type="primary"
                 @click="dataFormSubmit()"><i class="iconfont erp-icon-queding"></i>确定</el-button>
    </span>
  </el-dialog>
</template>
<script>
// 备注组件
import textareaAll from '@/components/erp-input/textarea-all'
export default {
  components: {
    textareaAll
  },
  data () {
    return {
      visible: false,
      isDisabled: false,
      dataForm: {
        id: '',
        code: '',
        name: '',
        // 单价精度下拉
        uniteAccuracy: {
          options: [
            {
              key: '1',
              name: '1'
            },
            {
              key: '2',
              name: '2'
            },
            {
              key: '3',
              name: '3'
            },
            {
              key: '4',
              name: '4'
            },
            {
              key: '5',
              name: '5'
            },
            {
              key: '6',
              name: '6'
            },
            {
              key: '7',
              name: '7'
            },
            {
              key: '8',
              name: '8'
            }
          ],
          value: ''
        },

        // 金额精度下拉
        moneyAccuracy: {
          options: [
            {
              key: '1',
              name: '1'
            },
            {
              key: '2',
              name: '2'
            },
            {
              key: '3',
              name: '3'
            },
            {
              key: '4',
              name: '4'
            }
          ],
          value: ''
        },
        // 货币符号
        dictCurrencySymbol: {
          options: '',
          value: ''
        },

        // 四舍五入
        dictCurrencyRound: {
          options: '',
          value: ''
        },
        remarks: '',
        bUsed: true,
        displaySymbols: true
      },
      dataRule: {
        code: [
          { required: true, message: '币别代码不能为空', trigger: 'blur' }
        ],
        name: [{ required: true, message: '币别名称不能为空', trigger: 'blur' }]
      }
    }
  },
  created () {
    // 四舍五入
    this.queryDataDict2List('CURRENCY_ROUND')
    // 货币符号
    this.queryDataDict2List('CURRENCY_SYMBOL')
  },
  methods: {
    // 关闭清除本次缓存
    clearCache (formName) {
      this.$refs[formName].resetFields()
      this.dataForm.uniteAccuracy.value = ''
      this.dataForm.moneyAccuracy.value = ''
      this.dataForm.dictCurrencySymbol.value = ''
      this.dataForm.dictCurrencyRound.value = ''
      this.visible = false
    },
    // 弹窗关闭之前
    handleClose (done) {
      this.clearCache('dataForm')
      done()
    },
    // 取消按钮
    cancel (formName) {
      this.clearCache(formName)
    },
    // 查数据字典
    queryDataDict2List (dictionaries) {
      this.$http({
        url: this.$http.adornUrl('basicData/queryDataDict2List'),
        method: 'get',
        params: this.$http.adornParams({
          dataDictKey: dictionaries
        })
      }).then(({ data }) => {
        if (data && data.code === 0) {
          // 四舍五入
          if (dictionaries == 'CURRENCY_ROUND') {
            this.dataForm.dictCurrencyRound.options = data.fontMaps
            // 货币符号
          } else if (dictionaries == 'CURRENCY_SYMBOL') {
            this.dataForm.dictCurrencySymbol.options = data.fontMaps
          }
        }
      })
    },
    init (id, type) {
      this.dataForm.addTime = ''
      this.dataForm.addUser = ''
      this.dataForm.updTime = ''
      this.dataForm.updUser = ''
      this.visible = true
      this.dataForm.displaySymbols = true
      this.dataForm.id = id
      this.isDisabled = false
      this.$nextTick(() => {
        this.$refs['dataForm'].resetFields()
        if (this.dataForm.id) {
          this.isDisabled = true
          this.$http({
            url: this.$http.adornUrl(
              `/dict/dictcurrency/info/${this.dataForm.id}`
            ),
            method: 'get',
            params: this.$http.adornParams()
          }).then(({ data }) => {
            if (data && data.code === 0) {
              this.dataForm.code = data.dictCurrency.code
              this.dataForm.name = data.dictCurrency.name
              this.dataForm.uniteAccuracy.value =
                data.dictCurrency.uniteAccuracy
              this.dataForm.moneyAccuracy.value =
                data.dictCurrency.moneyAccuracy
              this.dataForm.dictCurrencySymbol.value =
                data.dictCurrency.dictCurrencySymbol
              this.dataForm.displaySymbols = data.dictCurrency.displaySymbols
              this.dataForm.dictCurrencyRound.value =
                data.dictCurrency.dictCurrencyRound
              this.dataForm.remarks = data.dictCurrency.remarks
              this.dataForm.bUsed = data.dictCurrency.bUsed
            }
          })
        }
      })
    },
    // 表单提交
    dataFormSubmit: _.debounce(
      async function dataFormSubmit () {
        this.$refs['dataForm'].validate(valid => {
          if (valid) {
            this.$http({
              url: this.$http.adornUrl(
                `/dict/dictcurrency/${!this.dataForm.id ? 'save' : 'update'}`
              ),
              method: !this.dataForm.id ? 'post' : 'put',
              data: this.$http.adornData(
                {
                  id: this.dataForm.id,
                  code: this.dataForm.code,
                  name: this.dataForm.name,
                  uniteAccuracy: this.dataForm.uniteAccuracy.value,
                  moneyAccuracy: this.dataForm.moneyAccuracy.value,
                  dictCurrencySymbol: this.dataForm.dictCurrencySymbol.value,
                  displaySymbols: this.dataForm.displaySymbols == true ? 1 : 0,
                  dictCurrencyRound: this.dataForm.dictCurrencyRound.value,
                  // 'rate': this.dataForm.rate,
                  remarks: this.dataForm.remarks,
                  bUsed: this.dataForm.bUsed
                },
                false
              )
            }).then(({ data }) => {
              if (data && data.code === 0) {
                this.clearCache('dataForm')
                this.$emit('refreshDataList')
                this.$notify.success({
                  title: '成功',
                  message: '操作成功',
                  duration: 5000
                })
              } else {
                this.$notify.error({
                  title: '错误',
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
    )
  }
}
</script>
