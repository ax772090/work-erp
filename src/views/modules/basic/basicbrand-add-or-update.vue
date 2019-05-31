<template>
  <el-dialog :title="!dataForm.id ? '品牌新增' : '品牌修改'"
             :close-on-click-modal="false"
             :visible.sync="visible"
             :before-close="handleClose"
             width="30%"
             @close="$refs['dataForm'].resetFields()">
    <el-form :model="dataForm"
             :rules="dataRule"
             ref="dataForm"
             label-width="110px">
      <el-form-item label="品牌名称"
                    prop="name">
        <el-input v-model="dataForm.name"
                  placeholder="品牌名称"></el-input>
      </el-form-item>
      <el-form-item label="品牌责任人"
                    prop="inChargeOf">
        <select-seach v-model="dataForm.inChargeOf"
                      httpUrl="list/search/user"
                      requestParamsKey="name"
                      httpMethod="get"
                      data-label="name"
                      data-value="id"
                      data-source="list"></select-seach>
      </el-form-item>
      <el-form-item label="品牌描述"
                    prop="description">
        <textarea-all v-model="dataForm.description"></textarea-all>
      </el-form-item>
      <el-form-item label="状态"
                    prop="bUsed">
        <el-radio-group v-model="dataForm.bUsed">
          <el-radio :label="false">禁用</el-radio>
          <el-radio :label="true">正常</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="品牌logo"
                    prop="logo">
        <el-upload class="avatar-uploader"
                   action="string"
                   :http-request="UploadFile"
                   :show-file-list="false">
          <img v-if="imageUrl"
               :src="imageUrl"
               class="avatar">
          <i v-else
             class="el-icon-plus avatar-uploader-icon"></i>
        </el-upload>
      </el-form-item>
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
import selectSeach from '@/components/erp-select/select-seach'
import selectAll from '@/components/erp-select/select-all'
// 备注组件
import textareaAll from '@/components/erp-input/textarea-all'
import { prodimageSave, basicbrandInfo, basicbrandSave, basicbrandUpdate } from '@/api/basic/basic.js'

export default {
  components: {
    selectSeach,
    selectAll,
    textareaAll
  },
  data () {
    return {
      visible: false,
      inChargeOfOptions: [],
      fileList: [],
      fileList2: [],
      // 图片路径
      imageUrl: '',
      dataForm: {
        id: '',
        name: '',
        logo: '',
        logos: {},
        inChargeOf: '',
        description: '',
        bUsed: true
      },
      dataRule: {
        name: [
          { required: true, message: '品牌名称不能为空', trigger: 'change' }
        ]
      }
    }
  },
  methods: {
    // 关闭清除本次缓存
    clearCache (formName) {
      this.$refs[formName].resetFields()
      this.dataForm.logos = {}
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

    // 上传请求覆盖
    UploadFile (options) {
      let data = new FormData()
      data.append(options.filename, options.file)
      // prodimageSave(data).then((data) => {
      //   this.dataForm.logos = {}
      //   this.dataForm.logos['id'] = data.id
      //   this.dataForm.logos['url'] = data.url
      //   this.imageUrl = this.$http.adornUrl(data.url)
      // }).catch((error) => {
      //   this.notifyError(error.data.msg)
      // })
      this.$http({
        url: this.$http.adornUrl(`prod/prodimage/save`),
        method: 'post',
        data: data
      }).then(({ data }) => {
        if (data && data.code === 0) {
          this.dataForm.logos = {}
          this.dataForm.logos['id'] = data.id
          this.dataForm.logos['url'] = data.url
          this.imageUrl = this.$http.adornUrl(data.url)
        } else {
          this.$notify.error({
            title: '失败',
            message: data.msg,
            duration: 5000
          })
        }
      })
    },

    beforeRemove (file, fileList) {
      return this.$confirm(`确定移除 ${file.name}？`)
    },

    init (id, type) {
      this.dataForm.addTime = ''
      this.dataForm.addUser = ''
      this.dataForm.updTime = ''
      this.dataForm.updUser = ''
      this.dataForm.id = id
      this.visible = true
      this.imageUrl = ''
      this.$nextTick(() => {
        this.$refs['dataForm'].resetFields()
        if (this.dataForm.id) {
          basicbrandInfo(this.dataForm.id, true).then((data) => {
            this.dataForm = data.basicBrand
            if (data.basicBrand.logos.url) {
              this.imageUrl = this.$http.adornUrl(data.basicBrand.logos.url)
            }
          }).catch((error) => {
            this.notifyError(error.data.msg)
          })
          // this.$http({
          //   url: this.$http.adornUrl(`basic/basicbrand/info/${this.dataForm.id}`),
          //   method: 'get',
          //   params: this.$http.adornParams({ id: this.dataForm.id })
          // }).then(({ data }) => {
          //   if (data && data.code === 0) {
          //     this.dataForm = data.basicBrand
          //     if (data.basicBrand.logos.url) {
          //       this.imageUrl = this.$http.adornUrl(data.basicBrand.logos.url)
          //     }
          //   }
          // })
        }
      })
    },
    // 新增/编辑
    basicbrandHttp () {
      // 新增
      if (!this.dataForm.id) {
        basicbrandSave(this.dataForm).then((data) => {
          this.clearCache('dataForm')
          this.$emit('refreshDataList')
          this.visible = false
          this.notifySuccess('操作成功')
        }).catch((error) => {
          this.notifyError(error.data.msg)
        })
      }
      // 编辑
      if (this.dataForm.id) {
        basicbrandUpdate(this.dataForm).then((data) => {
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
            this.basicbrandHttp()
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
.avatar-uploader .el-upload {
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}
.avatar-uploader .el-upload:hover {
  border-color: #409eff;
}
.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 178px;
  height: 178px;
  line-height: 178px;
  text-align: center;
}
.avatar {
  width: 178px;
  height: 178px;
  display: block;
}
</style>