<template>
  <el-dialog :title="!dataForm.id ? '计量单位新增' : '计量单位修改'"
             :close-on-click-modal="false"
             :visible.sync="visible"
             width="30%"
             @close="$refs['dataForm'].resetFields()">
    <el-form :model="dataForm"
             :rules="dataRule"
             ref="dataForm"
             label-width="110px">
      <el-row>
        <el-col :span="24">
          <el-form-item label="单位编码"
                        prop="code">
            <el-input v-model="dataForm.code"
                      placeholder="单位编码"></el-input>
          </el-form-item>
          <el-form-item label="单位名称"
                        prop="name">
            <el-input v-model="dataForm.name"></el-input>
          </el-form-item>
          <el-form-item label="单位精度"
                        prop="accuracy">
            <el-input v-model="dataForm.accuracy"></el-input>
          </el-form-item>
          <el-form-item label="舍入类型"
                        prop="dictCurrencyRound">
            <select-all v-model="dataForm.dictCurrencyRound"
                        :listDataOption="dictCurrencyRoundOptions"
                        data-value="key"
                        data-label="value"></select-all>
          </el-form-item>
          <el-form-item label="备注"
                        prop="remarks">
            <textarea-all v-model="dataForm.remarks"></textarea-all>
          </el-form-item>
          <el-form-item label="状态"
                        prop="bUsed">
            <el-radio-group v-model="dataForm.bUsed">
              <el-radio :label="false">禁用</el-radio>
              <el-radio :label="true">正常</el-radio>
            </el-radio-group>
          </el-form-item>

        </el-col>
      </el-row>
    </el-form>
    <span slot="footer"
          class="dialog-footer">
      <el-button @click="visible = false"><i class="iconfont erp-icon-quxiao"></i>取消</el-button>
      <el-button type="primary"
                 @click="dataFormSubmit()"><i class="iconfont erp-icon-queding"></i>确定</el-button>
    </span>
  </el-dialog>
</template>

<script>
import selectAll from '@/components/erp-select/select-all'
// 备注组件
import textareaAll from '@/components/erp-input/textarea-all'
import { dictCurrencyRound } from '@/api/common/common.api'
import { dictUnitInfo, dictUnitSave, dictUnitUpdate } from '@/api/basic/basic.js'

export default {
  components: {
    selectAll,
    textareaAll
  },
  data () {
    var validateAccuracy = (rule, value, callback) => {
      if (/^[+]{0,1}(\d+)$/.test(value) || !value) {
        callback()
      } else {
        callback(new Error('单位精度只能为正整数'))
      }
    }
    return {
      visible: false,
      dictCurrencyRoundOptions: [],
      dataForm: {
        id: '',
        code: '',
        name: '',
        accuracy: '',
        dictCurrencyRound: '',
        remarks: '',
        bUsed: true
      },
      dataRule: {
        code: [
          { required: true, message: '单位编码不能为空', trigger: 'blur' }
        ],
        name: [
          { required: true, message: '单位名称不能为空', trigger: 'blur' }
        ],
        accuracy: [
          {
            validator: validateAccuracy,
            trigger: 'blur'
          }
        ]
      }
    }
  },
  created () {
    // 四舍五入
    dictCurrencyRound().then(data => { this.dictCurrencyRoundOptions = data.fontMaps })
  },
  methods: {
    init (id, type) {
      this.dataForm.addTime = ''
      this.dataForm.addUser = ''
      this.dataForm.updTime = ''
      this.dataForm.updUser = ''
      this.dataForm.id = id
      this.visible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].resetFields()
        if (this.dataForm.id) {
          dictUnitInfo(this.dataForm.id, true).then(data => {
            this.dataForm = data.dictUnit
          }).catch(e => {
            this.notifyError(e.data.msg)
          })
        }
      })
    },
    // 新增/编辑
    dictunitHttp () {
      // 新增
      if (!this.dataForm.id) {
        dictUnitSave(this.dataForm).then((data) => {
          this.$emit('refreshDataList')
          this.visible = false
          this.notifySuccess('操作成功')
        }).catch((error) => {
          this.notifyError(error.data.msg)
        })
      }
      // 编辑
      if (this.dataForm.id) {
        dictUnitUpdate(this.dataForm).then((data) => {
          this.$emit('refreshDataList')
          this.visible = false
          this.notifySuccess('操作成功')
        }).catch((error) => {
          this.notifyError(error.data.msg)
        })
      }
    },
    // 表单提交
    dataFormSubmit: _.debounce(
      async function dataFormSubmit () {
        this.$refs['dataForm'].validate(valid => {
          if (valid) {
            this.dictunitHttp()
          } else {
            return false
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
