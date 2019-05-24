<template>
  <el-dialog :title="!dataForm.id ? '新增颜色' : '修改颜色'"
             :close-on-click-modal="false"
             :visible.sync="visible"
             @close="$refs['dataForm'].resetFields()">
    <el-form :model="dataForm"
             :rules="dataRule"
             ref="dataForm"
             label-width="110px">
      <el-form-item label="颜色编码"
                    prop="code">
        <el-input v-model="dataForm.code"></el-input>
      </el-form-item>
      <el-form-item label="颜色"
                    prop="color">
        <el-input v-model="dataForm.color"></el-input>
      </el-form-item>
      <el-form-item label="创建人"
                    prop="addUser">
        <el-input v-model="dataForm.addUser"></el-input>
      </el-form-item>
      <el-form-item label="创建时间"
                    prop="addTime">
        <el-input v-model="dataForm.addTime"></el-input>
      </el-form-item>
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
export default {
  data () {
    return {
      visible: false,
      dataForm: {
        id: '',
        code: '',
        color: '',
        addUser: '',
        addTime: ''
      },
      dataRule: {
        code: [
          { required: true, message: '颜色编码不能为空', trigger: 'blur' }
        ],
        color: [{ required: true, message: '颜色不能为空', trigger: 'blur' }],
        addUser: [
          { required: true, message: '创建人不能为空', trigger: 'blur' }
        ],
        addTime: [
          { required: true, message: '创建时间不能为空', trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
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
          if (dictionaries === 'CURRENCY_ROUND') {
          }
        }
      })
    },
    init (id, type) {
      let dictionaries
      // 四舍五入
      this.queryDataDict2List((dictionaries = 'CURRENCY_ROUND'))
      // 拿到上级分类的数据
      this.$http({
        url: this.$http.adornUrl('basic/basiccategory/queryAllCategory'),
        method: 'get',
        params: this.$http.adornParams()
      }).then(({ data }) => {
        this.dataForm.parentId.options = data
      })

      this.dataForm.id = id || 0
      this.visible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].resetFields()
        if (this.dataForm.id) {
          this.$http({
            url: this.$http.adornUrl(
              `basic/basiccolor/info/${this.dataForm.id}`
            ),
            method: 'get',
            params: this.$http.adornParams()
          }).then(({ data }) => {
            if (data && data.code === 0) {
              this.dataForm.code = data.basiccolor.code
              this.dataForm.color = data.basiccolor.color
              this.dataForm.addUser = data.basiccolor.addUser
              this.dataForm.addTime = data.basiccolor.addTime
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
                `basic/basiccolor/${!this.dataForm.id ? 'save' : 'update'}`
              ),
              method: !this.dataForm.id ? 'post' : 'put',
              data: this.$http.adornData({
                id: this.dataForm.id,
                code: this.dataForm.code || undefined,
                color: this.dataForm.color || undefined,
                addUser: this.dataForm.addUser || undefined,
                addTime: this.dataForm.addTime || undefined
              })
            }).then(({ data }) => {
              if (data && data.code === 0) {
                this.$emit('refreshDataList')
                this.visible = false
                this.$notify.success({
                  title: '成功',
                  message: '操作成功',
                  duration: 1500
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
<style scoped>
.el-form {
  overflow: hidden;
}
@media screen and (max-width: 1300px) {
  .el-dialog {
    width: 70%;
  }
}

@media screen and (min-width: 950px) {
  .el-form-item {
    float: left;
    width: 50%;
  }
}
.el-select {
  width: 100%;
}
</style>