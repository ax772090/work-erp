<template>
  <div>
    <!-- drag 是否启用拖拽上传-->
    <!-- multiple 是否支持多选文件 -->
    <!-- :action="importFileUrl"  必选参数，上传的地址   -->
    <!-- list-type="listType" 文件列表的类型 -->
    <!-- :file-list="fileList" 上传的文件列表, 例如: [{name: 'food.jpg', url: 'https://xxx.cdn.com/xxx.jpg'}] -->
    <!-- :data="upLoadData" 上传时附带的额外参数 -->
    <!-- on-preview	点击文件列表中已上传的文件时的钩子	function(file) -->
    <!-- on-remove	文件列表移除文件时的钩子	function(file, fileList) -->
    <!-- on-success	文件上传成功时的钩子	function(response, file, fileList) -->
    <!-- on-error	文件上传失败时的钩子 -->
    <!-- before-upload	上传文件之前的钩子，参数为上传的文件，若返回 false 或者返回 Promise 且被 reject，则停止上传。 -->
    <!-- http-request	覆盖默认的上传行为，可以自定义上传的实现 -->
    <el-upload drag
               multiple
               :action="getSaveUrl"
               :list-type="listType"
               :file-list="fileList"
               :data="upLoadData"
               :on-preview="handlePictureCardPreview"
               :on-remove="handleRemove"
               :on-error="uploadError"
               :on-success="uploadSuccess"
               :before-upload="beforeAvatarUpload"
               :http-request="uploadFilePic">
      <i class="el-icon-upload"></i>
      <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
      <div slot="tip"
           class="el-upload__tip">只能上传'jpg'、'jpeg'、'gif'、'png'、'bmp'文件，且不超过2M</div>
    </el-upload>
  </div>
</template>

<script>
export default {
  name: 'uploadDragging',
  props: {
    value: { dafault: 'no v-model' },
    // 上传地址
    getSaveUrl: { dafault: '' },
    // 图片id
    // Imgid: {dafault: ''},
    // 根据图片id请求的url
    // getImgUrl: {dafault: 'text'},
    // 文件列表类型
    listType: { dafault: 'text' },
    // 上传的文件列表
    fileList: { datault: '' },
    // 上传时附带的额外参数
    upLoadData: { dafault: '' },

    handlePictureCardPreview: {},
    handleRemove: {},
    uploadError: {},
    uploadSuccess: {},
    beforeAvatarUpload: {},
    uploadFilePic: {}
  },
  data () {
    return {
      checked: false,
      // 地址
      // getSaveUrl: "",
      // 上传时附带的额外参数
      upLoadData: {
        cpyId: '123456',
        occurTime: '2018-08'
      },
      // 上传图片
      // dialogImageUrl: '',
      dialogVisible: false,
      // 上传图片end
      // 图片显示
      fileList: [],
      visible: false,
      type: '',
      dataForm: {
        // id: '',
        picList: []
      }
    }
  },
  mounted () {
    // this.restaurants = this.loadAll();
  },
  methods: {
    // init(id, type) {
    //   // 8
    //   this.importFileUrl = this.$http.adornUrl(this.getSaveUrl);
    //   this.dataForm.id = id;
    //   this.type = type;
    //   this.visible = true;
    //   this.$nextTick(() => {
    //     if (this.dataForm.id) {
    //       getQueryData(`/prod/proddevbasic/info/${this.dataForm.id}/${this.type}`)
    //       .then(data => {
    //         this.dataForm.picList = data.fileIds;
    //         this.postimage();
    //       })
    //     }
    //   });
    // },

    // // 根据图片id查找图片
    // postimage() {
    //   this.fileList = [];
    //   if (this.dataForm.picList) {
    //     for (var i = 0; i < this.dataForm.picList.length; i++) {
    //       getImgData(`/basic/basicattachment/info/url/`, this.dataForm.picList[i])
    //       .then(res => {
    //         this.fileList.push({name: this.dataForm.picList[i] + "文件名id",url: res.data});
    //       }).carch(error => {console.log(error)})
    //     }
    //   }
    // },

    // 可以自定义上传的实现
    uploadFilePic (options) {
      let data = new FormData()
      data.append(options.filename, options.file)
      postData('basic/basicattachment/save', data)
        .then(data => {
          this.dataForm.picList.push(data.id)
        }).catch(error => { console.log(error) })
    },

    // 上传前对文件的大小的判断
    // 上传文件之前的钩子，参数为上传的文件，若返回 false 或者返回 Promise 且被 reject，则停止上传
    beforeAvatarUpload (file) {
      // const extension1 = file.name.split('.')[1] === 'xls'
      // const extension2 = file.name.split('.')[1] === 'xlsx'
      // const extension3 = file.name.split('.')[1] === 'doc'
      // const extension4 = file.name.split('.')[1] === 'docx'
      const extension1 = file.name.split('.')[1] === 'jpg'
      const extension2 = file.name.split('.')[1] === 'jpeg'
      const extension3 = file.name.split('.')[1] === 'gif'
      const extension4 = file.name.split('.')[1] === 'png'

      const extension5 = file.name.split('.')[1] === 'bmp'
      const isLt2M = file.size / 1024 / 1024 < 10
      if (!extension1 && !extension2 && !extension3 && !extension4 && !extension5) {
        console.log('上传模板只能是 jpg、jpeg、gif、png、bmp 格式!')
      }
      if (!isLt2M) {
        console.log('上传模板大小不能超过 10MB!')
      }
      return extension1 || extension2 || extension3 || extension4 || extension5 && isLt2M
    },

    // 上传成功后的回调
    uploadSuccess (response, file, fileList) {
      console.log('上传文件成功', '参数1' + response, '参数2' + file, '参数3' + fileList)
    },
    // 上传错误
    uploadError (response, file, fileList) {
      console.log('上传失败，请重试！', '参数1' + response, '参数2' + file, '参数3' + fileList)
    },
    // 删除图片
    handleRemove (file, fileList) {
      console.log('删除图片按钮', '参数1' + file, '参数2' + fileList)
    },
    // 点击图片
    handlePictureCardPreview (file) {
      this.dialogVisible = true
      console.log('点击图片或文件按钮', '参数1' + file)
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
