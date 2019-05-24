<template>
  <div>
    <el-upload action="string"
               accept=".jpg, .jpeg, .png, .tiff, .gif"
               :file-list="dataForm.fileList"
               list-type="picture-card"
               multiple
               :on-preview="handlePictureCardPreview"
               :on-remove="handleRemove"
               :before-upload="beforeAvatarUpload"
               :http-request="uploadFilePic"
               :disabled="isDisabled">
      <i class="el-icon-plus"></i>
    </el-upload>
    <el-dialog :visible.sync="innerDialogVisible"
               append-to-body>
      <img width="100%"
           :src="dialogImageUrl"
           alt>
    </el-dialog>
    <div>
      <h3>产品图像风格指南</h3>
      <p>在您修正列表之前，缺少主图片的列表不会显示在产品列表中，且无法进行平台刊登功能。
        <br>选择清晰，信息丰富且具有吸引力的图片。
        <br>以下为亚马逊后台图片必须符合以下要求：
        <br>产品必须填写至少85％的图像。 图片只能显示出售产品，很少或没有道具，没有标志，水印或插图。 图片只能包含属于产品一部分的文字。
        <br>主图像必须具有纯白色背景，必须是照片（不是图纸），并且不得包含排除的配件。
        <br>最长边上的图像必须至少有1000个像素，最短边上至少500个像素才能进行缩放。
        <br>最长边上的图像不得超过10000像素。
      </p>
    </div>
  </div>
</template>

<script>
// 产品列表的图片
import { arrRemove } from '@/utils/index.js'
import Bus from '@/components/js/bus.js'

export default {
  props: ['value'],
  data () {
    return {
      isDisabled: false,
      checked: false,
      // 上传图片
      dialogImageUrl: '',
      innerDialogVisible: false,
      // 图片显示
      //   fileList: [],
      type: '',
      dataForm: {
        // id: '',
        fileList: []
      },
      dataRule: {}
    }
  },
  methods: {
    init (id, type, handleType, dataForm) { // 8
      this.dataForm.id = id
      this.type = type
      if (handleType === '1') {
        this.isDisabled = true
      } else if (handleType === 'copy') {
        // this.dataForm.picList = dataForm.imageList
        this.dataForm.fileList = []
        for (const item of dataForm.imageList) {
          this.dataForm.fileList.push({
            id: item.id,
            name: item.name,
            url: this.$http.adornUrl(item.url)
          })
        }
      }
      this.$nextTick(() => {
        if (this.dataForm.id) {
          this.$http({
            url: this.$http.adornUrl(`prod/prodbasic/info/${this.dataForm.id}/${this.type}`),
            method: 'get'
          }).then(({ data }) => {
            if (data && data.code === 0) {
              //   this.dataForm.picList = data.imageList
              this.dataForm.fileList = []
              for (const item of data.imageList) {
                this.dataForm.fileList.push({
                  id: item.id,
                  name: item.name,
                  url: this.$http.adornUrl(item.url)
                })
              }
              // this.postimage()
            }
          })
        }
      })
    },

    // 根据图片id查找图片
    async postimage () {
      this.dataForm.fileList = []
      if (this.dataForm.picList) {
        for (var i = 0; i < this.dataForm.picList.length; i++) {
          await this.$http
            .ajaxErp('get', `/prod/prodimage/info/${this.dataForm.picList[i]}`)
            .then(({ data }) => {
              this.dataForm.fileList.push({
                id: this.dataForm.picList[i],
                name: data.name,
                url: this.$http.adornUrl(data.url)
              })
            })
            .catch(error => {
              console.log(error)
            })
        }
      }
    },

    // 文件上传=>覆盖
    uploadFilePic (options) {
      let data = new FormData()
      data.append(options.filename, options.file)
      this.$http({
        url: this.$http.adornUrl(`prod/prodimage/save`),
        method: 'post',
        data: data
      }).then(({ data }) => {
        if (data && data.code === 0) {
          this.dataForm.fileList.push({
            id: data.id,
            name: data.name,
            url: this.$http.adornUrl(data.url)
          })
          //   this.dataForm.picList.push({ id: data.id, name: data.name, url: this.$http.adornUrl(data.url) })
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
      this.dataForm.fileList = fileList
    },

    // 点击图片
    handlePictureCardPreview (file) {
      this.dialogImageUrl = file.url
      this.innerDialogVisible = true
    },

    // 上传前对文件的大小的判断
    beforeAvatarUpload (file) {
      // 1 KB = 1024B // 1M = 1024KB
      console.log(file)
      const isLt2M = file.size / 1024 < 300
      if (!isLt2M) {
        console.log('上传图片大小不能超过 300kb!')
        this.$notify.error({
          title: '失败',
          message: '上传图片大小不能超过 300kb!',
          duration: 5000
        })
      }
      return isLt2M
    },

    // 表单提交
    dataFormSubmit: _.debounce(
      async function dataFormSubmit (id, type) {
        this.$http({
          url: this.$http.adornUrl('prod/prodbasic/update'),
          method: 'put',
          data: {
            prodId: id,
            type: type,
            //   imageList: this.fileList
            imageList: this.dataForm.fileList
          }
        }).then(({ data }) => {
          if (data && data.code === 0) {
            Bus.$emit('prodTabChildren')
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
      },
      1000,
      {
        leading: true,
        trailing: false
      }
    ),

    // // 校验
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
        // this.dataForm.picList = this.value
        // this.$emit('change', this.dataForm.picList)
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
