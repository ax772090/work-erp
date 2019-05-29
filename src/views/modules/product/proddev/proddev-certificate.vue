<template>
  <div>
    <el-row>
      <el-col :span="12">
        <el-upload drag
                   action="string"
                   :file-list="fileList"
                   list-type="text"
                   multiple
                   :on-preview="handlePreview"
                   :on-remove="handleRemove"
                   :before-upload="beforeAvatarUpload"
                   :http-request="uploadFilePic"
                   :disabled="formDisabled">
          <i class="el-icon-upload"></i>
          <div class="el-upload__text">将文件拖到此处，或
            <em>点击上传</em>
          </div>
        </el-upload>
      </el-col>
    </el-row>
  </div>
</template>

<script>
// 产品证书

import { arrRemove } from '@/utils/index.js'
import Bus from '@/components/js/bus.js'

export default {
  name: 'proddevCertificate',
  props: ['value'],

  data () {
    return {
      formDisabled: false,
      dialogVisible: false,
      // 图片显示
      fileList: [],
      type: '',
      dataForm: {
        picList: []
      }
    }
  },
  methods: {
    init (id, type, handleType) {
      // 8
      if (handleType === 'canCheck') {
        this.formDisabled = true
      }
      // 审核
      if (handleType === 'canApproval') {
        this.formDisabled = true
      }
      this.dataForm.id = id
      this.type = type
      this.$nextTick(() => {
        if (this.dataForm.id) {
          this.$http({
            url: this.$http.adornUrl(
              `prod/proddevbasic/info/${this.dataForm.id}/${this.type}`
            ),
            method: 'get',
            params: this.$http.adornParams({}, false)
          }).then(({ data }) => {
            if (data && data.code === 0) {
              this.fileList = []
              data.cerList.forEach(element => {
                this.fileList.push({ name: element.name, id: element.id })
                this.dataForm.picList.push(element.id)
              })
            }
          })
        }
      })
    },

    // 校验
    verifyAll () {
      console.log('无校验')
    },

    // 点击文件名时触发下载
    handlePreview (file) {
      if (file.status === 'ready') {
        this.$notify.error({
          title: '提示',
          message: '预备上传,不能下载',
          duration: 5000
        })
        return
      }
      window.open(
        this.$http.tokens(`prod/prodcertificates/download/${file.id}`)
      )
    },

    // 可以自定义上传的实现
    uploadFilePic (options) {
      if (!this.isAuth('proddev:prodcertificates:save')) {
        this.$notify.error({
          title: '失败',
          message: '没有上传权限',
          duration: 5000
        })
        return
      }

      let data = new FormData()
      data.append(options.filename, options.file)
      this.$http({
        url: this.$http.adornUrl('prod/prodcertificates/save'),
        method: 'post',
        data: data
      }).then(({ data }) => {
        if (data && data.code === 0) {
          this.dataForm.picList.push(data.id)
          this.$notify({
            message: '操作成功',
            type: 'success',
            duration: 500
          })
        } else {
          this.$notify.error({
            title: '失败',
            message: data.msg,
            duration: 5000
          })
        }
      })
    },

    // 删除图片
    handleRemove (file, fileList) {
      this.fileList = fileList
      arrRemove(file.id, this.dataForm.picList)
    },

    // 上传前对文件的大小的判断
    beforeAvatarUpload (file) {
      const isLt2M = file.size / 1024 / 1024 < 10
      if (!isLt2M) {
        console.log('上传模板大小不能超过 10MB!')
      }
      return isLt2M
    },

    // 表单提交
    dataFormSubmit: _.debounce(
      async function dataFormSubmit (id, type) {
        if (!this.dataForm.picList) {
          console.log('保存不成功', this.dataForm.picList)
          return
        }
        this.$http({
          url: this.$http.adornUrl('prod/proddevbasic/update'),
          method: 'put',
          data: this.$http.adornData({
            prodId: id,
            type: type,
            cerIds: this.dataForm.picList
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
      }, 1000, {
        leading: true,
        trailing: false
      }
    ),

    // 校验
    validate () {
      return new Promise((resolve, reject) => {
        resolve(true)
      })
    }
  },
  watch: {
    value: {
      handler (val, oldVal) {
        this.dataForm.picList = this.value
        this.$emit('change', this.dataForm.picList)
      },
      deep: true
    },
    dataForm: {
      handler (val, oldVal) {
        this.$emit('input', this.dataForm.picList)
      },
      deep: true
    }
  }
}
</script>
