<template>
  <div>
    <el-upload action="https://jsonplaceholder.typicode.com/posts/"
               list-type="picture-card"
               :on-preview="handlePictureCardPreview"
               :on-remove="handleRemove">
      <i class="el-icon-plus"></i>
    </el-upload>
    <el-dialog :visible.sync="dialogVisible"
               v-if="dialogVisible">
      <img width="100%"
           :src="dialogImageUrl"
           alt="">
      <el-checkbox v-model="checked">备选项</el-checkbox>

    </el-dialog>

    <div>
      <h3>产品图像风格指南</h3>
      <p>
        在您修正列表之前，缺少主图片的列表不会显示在产品列表中，且无法进行平台刊登功能。
        <br>选择清晰，信息丰富且具有吸引力的图片。
        <br>以下为亚马逊后台图片必须符合以下要求：
        <br>产品必须填写至少85％的图像。 图片只能显示出售产品，很少或没有道具，没有标志，水印或插图。 图片只能包含属于产品一部分的文字。
        <br>主图像必须具有纯白色背景，必须是照片（不是图纸），并且不得包含排除的配件。
        <br>最长边上的图像必须至少有1000个像素，最短边上至少500个像素才能进行缩放。
        <br>最长边上的图像不得超过10000像素。
        <br>JPEG是首选的图像格式，但您也可以使用TIFF和GIF文件。
      </p>
    </div>
    <span slot="footer"
          class="dialog-footer">
      <!-- <el-button @click="visible = false">取消</el-button> -->
      <el-button type="primary"
                 @click="dataFormSubmit()"><i class="iconfont erp-icon-baocun"></i>保存</el-button>
    </span>
  </div>
</template>

<script>
export default {
  name: 'upPicture',
  data () {
    return {
      checked: false,
      // 上传图片
      dialogImageUrl: '',
      dialogVisible: false,
      // 上传图片end
      visible: false,
      dataForm: {
        id: 0
      },
      dataRule: {
      }
    }
  },
  methods: {
    // 删除图片
    handleRemove (file, fileList) {
    },
    // 点击图片
    handlePictureCardPreview (file) {
      this.dialogImageUrl = file.url
      this.dialogVisible = true
    }
  }
}
</script>
