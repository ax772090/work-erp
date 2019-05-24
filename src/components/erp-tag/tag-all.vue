<template>
  <div>
    <el-tag v-for="tag in tags"
            :key="tag.name"
            closable
            disable-transitions>{{tag.name}}</el-tag>
  </div>
</template>

<script>
export default {
  props: {
    closable: {
      type: Boolean,
      default: function () {
        return false
      }
    },
    tagsData: {
      type: Object,
      default: function () {
        return [{ name: '第一个' }, { name: '第二个' }, { name: '第三个' }, { name: '第四个' }]
      }
    }
  },
  data () {
    return {

    }
  },
  computed: {
    tags: {
      get () {
        let listdata = []

        for (const item in this.tagsData) {
          if (this.tagsData.hasOwnProperty(item)) {
            if (this.tagsData[item] !== '') {
              listdata.push({ name: this.tagsData[item] })
            }
          }
        }

        return listdata
      }
    }
  }
}
</script>

<style scoped>
.el-tag {
  margin-right: 5px;
}
</style>

