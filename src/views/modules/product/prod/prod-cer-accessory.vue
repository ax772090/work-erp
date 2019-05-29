<template>
  <div>
    <el-row>
      <el-col :span="12">
        <el-upload drag
                   action="string"
                   :file-list="dataForm.fileList"
                   list-type="text"
                   multiple
                   :on-preview="handlePictureCardPreview"
                   :before-remove="beforeRemove"
                   :on-remove="handleRemove"
                   :before-upload="beforeAvatarUpload"
                   :http-request="uploadFilePic"
                   :disabled="isDisabled">
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
import Bus from '@/components/js/bus.js'
export default {
  props: ['value'],

  data () {
    return {
      isDisabled: false,
      checked: false,
      // 文件显示
      fileList: [],
      visible: false,
      type: '',
      dataForm: {
        fileList: []
      },

      dataRule: {}
    }
  },
  methods: {
    init (id, type, handleType, dataForm) {
      // 8
      this.dataForm.id = id
      this.type = type
      this.visible = true
      if (handleType === '1') {
        this.isDisabled = true
      } else if (handleType === 'copy') {
        // this.dataForm.picList = dataForm.cerList
        this.dataForm.fileList = []
        dataForm.cerList.forEach(element => {
          this.dataForm.fileList.push({
            name: element.name,
            url: element.url,
            id: element.id
          })
        })
      }
      this.$nextTick(() => {
        if (this.dataForm.id) {
          this.$http({
            url: this.$http.adornUrl(
              `/prod/prodbasic/info/${this.dataForm.id}/${this.type}`
            ),
            method: 'get',
            params: this.$http.adornParams({}, false)
          }).then(({ data }) => {
            if (data && data.code === 0) {
              //   this.dataForm.picList = data.cerList
              this.dataForm.fileList = []
              data.cerList.forEach(element => {
                // this.dataForm.picList.push(element.id)
                this.dataForm.fileList.push({
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
      if (!this.isAuth('prod:prodcertificates:save')) {
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
          //   this.dataForm.picList.push(data.id)
          this.dataForm.fileList.push({
            id: data.id,
            name: data.name,
            url: this.$http.adornUrl(data.url)
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

    // 删除前==>清除picList,方便保存
    beforeRemove (file, fileList) {
      return this.$confirm(`确定移除 ${file.name}？`).then(() => {
        this.dataForm.fileList = fileList
        // this.dataForm.picList.forEach((element, index) => {
        //   if (element === file.id) {
        //     this.dataForm.picList.splice(index, 1)
        //   }
        // })
      })
    },

    // 删除文件
    handleRemove (file, fileList) {
      this.dataForm.fileList = fileList
    },

    // 点击文件=>直接下载
    handlePictureCardPreview (file) {
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

    // 上传前对文件的大小的判断
    beforeAvatarUpload (file) { },

    // 表单提交
    dataFormSubmit: _.debounce(
      async function dataFormSubmit (id, type) {
        this.$http({
          url: this.$http.adornUrl('prod/prodbasic/update'),
          method: 'put',
          data: {
            prodId: id,
            type: type,
            cerList: this.dataForm.fileList
          }
        }).then(({ data }) => {
          if (data && data.code === 0) {
            Bus.$emit('prodTabChildren')
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
    // validate (activeName) {
    //   this.$emit('nextStep', activeName)
    // }
    validate () {
      return new Promise((resolve, reject) => {
        // this.$refs['dataForm'].validate((valid) => {
        // if (valid) {
        resolve(true)
        // } else {
        // reject(valid)
        // }
        // })
      })
    }
  },
  watch: {
    value: {
      handler (val, oldVal) {
        this.dataForm.fileList = this.value
        this.$emit('change', this.dataForm.fileList)
      },
      deep: true
    },
    dataForm: {
      handler (val, oldVal) {
        this.$emit('input', this.dataForm.fileList)
      },
      deep: true
    }
  }
}
</script>
