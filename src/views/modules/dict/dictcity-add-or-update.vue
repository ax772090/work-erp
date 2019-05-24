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
    this.belongCountrySelect()
  },
  methods: {
    // 国家下拉列表
    belongCountrySelect () {
      this.$http({
        url: this.$http.adornUrl('basicData/queryAllCountry'),
        method: 'get',
        params: this.$http.adornParams()
      }).then(({ data }) => {
        this.$nextTick(() => {
          if (data && data.code === 0) {
            this.belongCountryOptions = data.countries
          }
        })
      })
    },
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
          this.$http({
            url: this.$http.adornUrl(`dict/dictcity/info/${this.dataForm.id}`),
            method: 'get',
            params: this.$http.adornParams()
          }).then(({ data }) => {
            if (data && data.code === 0) {
              this.dataForm.belongCountry = data.dictCity.belongCountry
              this.dataForm.name = data.dictCity.name
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
                `dict/dictcity/${!this.dataForm.id ? 'save' : 'update'}`
              ),
              method: !this.dataForm.id ? 'post' : 'put',
              data: this.dataForm
            }).then(({ data }) => {
              if (data && data.code === 0) {
                this.$emit('refreshDataList')
                this.visible = false
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
      },
      1000,
      {
        leading: true,
        trailing: false
      }
    )
  }
}
</script>
