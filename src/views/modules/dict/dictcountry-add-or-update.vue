<template>
  <el-dialog :title="!dataForm.id ? '新增' : '修改'"
             :close-on-click-modal="false"
             :visible.sync="visible"
             @close="$refs['dataForm'].resetFields()">
    <el-form :model="dataForm"
             :rules="dataRule"
             ref="dataForm"
             label-width="110px">
      <el-form-item label="英文名称"
                    prop="nameEn">
        <el-input v-model="dataForm.nameEn"
                  placeholder="英文名称"></el-input>
      </el-form-item>
      <el-form-item label="中文名称"
                    prop="nameCn">
        <el-input v-model="dataForm.nameCn"></el-input>
      </el-form-item>
      <el-form-item label="二级简码"
                    prop="isoCode2">
        <el-input v-model="dataForm.isoCode2"></el-input>
      </el-form-item>
      <el-form-item label="三级简码"
                    prop="isoCode3">
        <el-input v-model="dataForm.isoCode3"></el-input>
      </el-form-item>
      <el-form-item label="是否属于欧盟(0否，1是)"
                    prop="bBelongEu">
        <el-input v-model="dataForm.bBelongEu"
                  placeholder="是否属于欧盟(0否，1是)"></el-input>
      </el-form-item>
      <el-form-item label="组别(扩展)"
                    prop="groupNo">
        <el-input v-model="dataForm.groupNo"></el-input>
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
        id: 0,
        nameEn: '',
        nameCn: '',
        isoCode2: '',
        isoCode3: '',
        bBelongEu: '',
        groupNo: ''
      },
      dataRule: {
        nameEn: [
          { required: true, message: '英文名称不能为空', trigger: 'blur' }
        ],
        nameCn: [
          { required: true, message: '中文名称不能为空', trigger: 'blur' }
        ],
        isoCode2: [
          { required: true, message: '二级简码不能为空', trigger: 'blur' }
        ],
        isoCode3: [
          { required: true, message: '三级简码不能为空', trigger: 'blur' }
        ],
        bBelongEu: [
          {
            required: true,
            message: '是否属于欧盟(0否，1是)不能为空',
            trigger: 'blur'
          }
        ],
        groupNo: [
          { required: true, message: '组别(扩展)不能为空', trigger: 'blur' }
        ]
      }
    }
  },

  methods: {
    init (id) {
      this.dataForm.bUsed = 1
      this.dataForm.id = id
      this.visible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].resetFields()
        if (this.dataForm.id) {
          this.$http({
            url: this.$http.adornUrl(
              `/dict/dictcountry/info/${this.dataForm.id}`
            ),
            method: 'get',
            params: this.$http.adornParams()
          }).then(({ data }) => {
            if (data && data.code === 0) {
              this.dataForm.nameEn = data.dictcountry.nameEn
              this.dataForm.nameCn = data.dictcountry.nameCn
              this.dataForm.isoCode2 = data.dictcountry.isoCode2
              this.dataForm.isoCode3 = data.dictcountry.isoCode3
              this.dataForm.bBelongEu = data.dictcountry.bBelongEu
              this.dataForm.groupNo = data.dictcountry.groupNo
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
                "/dict/dictcountry/${!this.dataForm.id ? 'save' : 'update'}"
              ),
              method: !this.dataForm.id ? 'post' : 'put',
              data: this.$http.adornData({
                id: this.dataForm.id,
                nameEn: this.dataForm.nameEn,
                nameCn: this.dataForm.nameCn,
                isoCode2: this.dataForm.isoCode2,
                isoCode3: this.dataForm.isoCode3,
                bBelongEu: this.dataForm.bBelongEu,
                groupNo: this.dataForm.groupNo
              })
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
      }, 1000, {
        leading: true,
        trailing: false
      }
    )
  }
}
</script>
<style scoped>
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
</style>