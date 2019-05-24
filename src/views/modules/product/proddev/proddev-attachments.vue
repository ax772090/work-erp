<template>
  <div>
    <!-- on-preview	点击文件列表中已上传的文件时的钩子	function(file)
    on-remove	文件列表移除文件时的钩子	function(file, fileList)
    on-success	文件上传成功时的钩子	function(response, file, fileList)
    on-error	文件上传失败时的钩子
    before-upload	上传文件之前的钩子，参数为上传的文件，若返回 false 或者返回 Promise 且被 reject，则停止上传。
    http-request	覆盖默认的上传行为，可以自定义上传的实现-->
    <el-row>
      <el-col :span="12">
        <el-upload drag
                   action="string"
                   :file-list="fileList"
                   list-type="text"
                   multiple
                   :on-preview="onPreviewHandle"
                   :on-remove="handleRemove"
                   :on-error="uploadError"
                   :on-success="uploadSuccess"
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
// 产品附件
import { arrRemove } from '@/utils/index.js'
import Bus from '@/components/js/bus.js'

export default {
  name: 'proddevAttachments',
  props: ['value'],
  data () {
    return {
      formDisabled: false,
      // 文件显示
      fileList: [],
      type: '',
      dataForm: {
        // id: '',
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
            url: this.$http.adornUrl(`prod/proddevbasic/info/${this.dataForm.id}/${this.type}`),
            method: 'get',
            params: {}
          }).then(({ data }) => {
            if (data) {
              this.fileList = []
              this.dataForm.picList = []
              for (const element of data.fileList) {
                this.fileList.push({ name: element.name, id: element.id })
                this.dataForm.picList.push(element.id)
              }
            } else {
              this.$notify.error(data.msg)
            }
          })
        }
      })
    },

    // 根据文件id查找文件
    postimage (ids) {
      if (ids) {
        for (var i = 0; i < ids.length; i++) {
          this.$http({
            url: this.$http.adornUrl(`basic/basicattachment/info/${ids[i].id}`),
            method: 'get',
            params: {}
          }).then(({ data }) => {
            if (data) {
              this.fileList = []
            } else {
              this.$notify.error(data.msg)
            }
          })
        }
      }
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
        url: this.$http.adornUrl('basic/basicattachment/save'),
        method: 'post',
        data: data
      }).then(({ data }) => {
        if (data && data.code === 0) {
          this.dataForm.picList.push(data.id)
        } else {
          this.$notify.error({
            title: '失败',
            message: data.msg,
            duration: 5000
          })
        }
      })
    },

    // 删除文件
    handleRemove (file, fileList) {
      console.log('删除的:', file)
      console.log('删除剩余:', fileList)
      this.fileList = fileList
      arrRemove(file.id, this.dataForm.picList)
    },

    // 点击文件
    onPreviewHandle (file) {
      if (file.status === 'ready') {
        this.$notify.error({
          title: '提示',
          message: '预备上传,不能下载',
          duration: 5000
        })
        return
      }
      window.open(
        this.$http.tokens(`basic/basicattachment/download/${file.id}`)
      )
    },

    // 上传前对文件的大小的判断
    beforeAvatarUpload (file) {
      const isLt2M = file.size / 1024 / 1024 < 10
      if (!isLt2M) {
        console.log('上传模板大小不能超过 10MB!')
      }
      return isLt2M
    },

    // 上传成功后的回调
    uploadSuccess (response, file, fileList) {
      console.log('上传文件成功', response)
      console.log('上传文件成功', file)
      console.log('上传文件成功', fileList)
    },

    // 上传错误
    uploadError (response, file, fileList) {
      console.log('上传失败，请重试！')
    },

    // 表单提交
    dataFormSubmit: _.debounce(
      async function dataFormSubmit (id, type) {
        if (!this.dataForm.picList) {
          return
        }
        this.$http({
          url: this.$http.adornUrl('prod/proddevbasic/update'),
          method: 'put',
          data: this.$http.adornData({
            prodId: id,
            type: type,
            fileIds: this.dataForm.picList
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
              title: '失败',
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
