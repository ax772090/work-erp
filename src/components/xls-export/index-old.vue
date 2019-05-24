<template>
  <div>
    <!-- on-preview	点击文件列表中已上传的文件时的钩子	function(file)
    :before-remove='beforeRemove' 删除前
    on-remove	文件列表移除文件时的钩子	function(file, fileList)
    on-success	文件上传成功时的钩子	function(response, file, fileList)
    on-error	文件上传失败时的钩子
    before-upload	上传文件之前的钩子，参数为上传的文件，若返回 false 或者返回 Promise 且被 reject，则停止上传。
    http-request	覆盖默认的上传行为，可以自定义上传的实现 -->
    <el-upload drag
               action='string'
               :file-list="fileList"
               list-type="text"
               multiple
               :on-preview="handlePictureCardPreview"
               :before-remove='beforeRemove'
               :on-remove="handleRemove"
               :on-error="uploadError"
               :on-success="uploadSuccess"
               :before-upload="beforeAvatarUpload"
               :http-request="uploadFilePic">
      <i class="el-icon-upload"></i>
      <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
      <div slot="tip"
           class="el-upload__tip">只能上传'xls'、'xlsx'文件，且固定模板</div>
    </el-upload>
  </div>
</template>

<script>
// 产品证书
export default {
  name: 'upPicture',
  props: ['value'],

  data () {
    return {
      visible: false,
      // 上传图片end
      // 图片显示
      fileList: [],
      type: '',
      dataForm: {

        picList: []
      },

      dataRule: {}
    }
  },
  methods: {
    init (id, type) {
      this.dataForm.id = id
      this.type = type
      this.visible = true
      this.$nextTick(() => {
        if (this.dataForm.id) {
          this.$http({
            url: this.$http.adornUrl(`prod/prodbasic/info/${this.dataForm.id}/${this.type}`),
            method: 'get',
            params: this.$http.adornParams({}, false)
          }).then(({ data }) => {
            if (data && data.code === 0) {
              this.fileList = []
              data.cerIds.forEach(element => {
                this.dataForm.picList.push(element.id)
                this.fileList.push({
                  name: element.name,
                  url: element.url,
                  id: element.id
                })
              })
            }
          })
        }
      })
    },

    // 可以自定义上传的实现
    uploadFilePic (options) {
      let data = new FormData()
      data.append(options.filename, options.file)
      this.$http({
        url: this.$http.adornUrl('prod/prodcertificates/save'),
        method: 'post',
        data: data
      }).then(({ data }) => {
        if (data && data.code === 0) {
          this.dataForm.picList.push(data.id)
          //   this.picListId.push(data.id)
        }
      })
    },

    // 删除前==>清除picList,方便保存
    beforeRemove (file, fileList) {
      return this.$confirm(`确定移除 ${file.name}？`).then(() => {
        this.dataForm.picList.forEach((element, index) => {
          if (element == file.id) {
            this.dataForm.picList.splice(index, 1)
          }
        })
      })
    },

    // 删除图片
    handleRemove (file, fileList) {
      console.log(file)
      console.log(fileList)
    },

    // 点击图片=>直接下载
    handlePictureCardPreview (file) {
      window.open(
        this.$http.tokens(`prod/prodcertificates/download/${file.id}`)
      )
    },

    // 上传文件之前的钩子，参数为上传的文件，若返回 false 或者返回 Promise 且被 reject，则停止上传
    beforeAvatarUpload (file) { },

    // 上传成功后的回调
    uploadSuccess (response, file, fileList) {
      // this.importFileUrl = this.$http.adornUrl(`prod/prodimage/save?token=${this.$cookie.get('token')}`)
      console.log('上传文件成功', response)
      console.log('上传文件成功', file)
      console.log('上传文件成功', fileList)
    },

    // 上传错误
    uploadError (response, file, fileList) {
      console.log('上传失败，请重试！')
    },

    // 表单提交
    dataFormSubmit (id, type) {
      this.$http({
        url: this.$http.adornUrl('prod/prodbasic/update'),
        method: 'put',
        data: {
          prodId: id,
          type: type,
          cerIds: this.dataForm.picList
        }
      }).then(({ data }) => {
        if (data && data.code === 0) {
          this.$message({
            message: '操作成功',
            type: 'success',
            duration: 500,
            onClose: () => {
              this.visible = false
            }
          })
        } else {
          this.$message.error(data.msg)
        }
      })
    }
  }
}
</script>
