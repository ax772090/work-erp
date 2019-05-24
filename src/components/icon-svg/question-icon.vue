<template>
  <el-tooltip effect="dark"
              placement="right">
    <!-- 插槽，可提供多行的提示信息 -->
    <div slot="content"
         class="word">
      <!-- <p v-for="(item,index) in messages" :key="index">{{item}}</p> -->
      <p class="breakword">{{messages}}</p>
    </div>
    <i class="el-icon-question"></i>
  </el-tooltip>
</template>
<script>
export default {
  props: {
    messages: { default: '' }
  }
}
</script>
<style scoped>
.word {
  width: 250px;
}
.breakword {
  /* word-break: break-all; */
  white-space: pre-wrap;
  font-size: 14px;
}
.el-icon-question {
  color: #409eff;
  margin-left: 5px;
  font-size: 15px;
}
</style>

