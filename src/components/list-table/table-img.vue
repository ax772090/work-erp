<template>
  <div>
    <el-popover v-if="imageUrl"
                placement="right"
                trigger="click">
      <img :src="$http.adornUrl(imageUrl)"
           class="imglistPopover"
           alt="产品图片">
      <img :src="$http.adornUrl(imageUrl)"
           slot="reference"
           class="imglist"
           alt="产品图片">
    </el-popover>
    <el-tag v-else
            type="danger"
            size="small">未上传</el-tag>
  </div>
</template>
<script>
export default {
  props: {
    imageUrl: { default: '' },
    imgAlt: { default: '产品图片' },
    elseText: { default: '未上传' }
  },
  data () {
    return {

    }
  }
}
</script>
