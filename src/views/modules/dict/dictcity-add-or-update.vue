<template>
  <el-dialog :title="!dataForm.id ? '城市新增' : '城市修改'"
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
          <el-form-item label="所属国家"
                        prop="belongCountry">
            <select-all v-model="dataForm.belongCountry"
                        :listDataOption="belongCountryOptions"
                        data-value="id"
                        data-label="nameCn"></select-all>
          </el-form-item>
          <el-form-item label="城市名称"
                        prop="name">
            <el-input v-model="dataForm.name"></el-input>
          </el-form-item>
          <el-form-item label="备注"
                        prop="remark">
            <textarea-all v-model="dataForm.remark"></textarea-all>
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
import { basicdataQueryallcountry } from '@/api/common/common.api'
import { dictcityInfo, dictcitySave, dictcityUpdate } from '@/api/basic/basic.js'

export default {
  components: {
    selectAll,
    textareaAll
  },
  data () {
    return {
      visible: false,
      belongCountryOptions: [],
      dataForm: {
        id: '',
        belongCountry: '',
        name: '',
        remark: ''
      },
      dataRule: {
        belongCountry: [
          { required: true, message: '所属国家不能为空', trigger: 'change' }
        ],
        name: [{ required: true, message: '城市名称不能为空', trigger: 'blur' }]
      }
    }
  },
  created () {
    // 国家下拉列表
    basicdataQueryallcountry().then(data => { this.belongCountryOptions = data.countries })
  },
  methods: {
    init (id, type) {
      this.dataForm.addTime = ''
      this.dataForm.addUser = ''
      this.dataForm.updTime = ''
      this.dataForm.updUser = ''
      // 拿到上级分类的数据
      this.dataForm.id = id
      this.visible = true
      this.$nextTick(() => {
        if (this.dataForm.id) {
          dictcityInfo(this.dataForm.id, true).then(data => {
            this.dataForm = Object.assign({}, data.dictCity, { updTime: null, updUser: null })
          }).catch(e => {
              this.notifyError(e.data.msg)
            })
        }
      })
    },
    // 新增/编辑
    dictcityHttp () {
      // 新增
      if (!this.dataForm.id) {
        dictcitySave(this.dataForm).then((data) => {
          this.$emit('refreshDataList')
          this.visible = false
          this.notifySuccess('操作成功')
        }).catch((error) => {
          this.notifyError(error.data.msg)
        })
      }
      // 编辑
      if (this.dataForm.id) {
        dictcityUpdate(this.dataForm).then((data) => {
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
            this.dictcityHttp()
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
