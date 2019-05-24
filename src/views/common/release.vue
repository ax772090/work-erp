<template>
  <div>
    <dialogAll :dialogData="dialogData"
               @close='closeHandle'>
      <template slot="dialogbody">
        <el-timeline>
          <el-timeline-item v-for="(item,index) in dataList"
                            :key="index"
                            :timestamp='item.lastUpdTime'
                            placement='top'>
            <el-card>
              <h4>{{item.topic}}</h4>
              <div v-html="item.content"></div>
            </el-card>
          </el-timeline-item>
        </el-timeline>
      </template>
      <template slot="dialogfooter">
        <el-button type="primary"
                   @click="handerYes">确定</el-button>
      </template>
    </dialogAll>
  </div>
</template>

<script>
import dialogAll from '@/components/erp-dialog/dialog-all'
export default {
  components: {
    dialogAll
  },
  data () {
    return {
      dataList: [],
      topic: '',
      dialogData: {
        visible: false,
        title: '系统版本更新说明',
        width: '40%',
        isShowclose: true,
        modalAppendBody: false
      }
    }
  },
  methods: {
    init (list) {
      this.dialogData.visible = true
      this.topic = ''
      // 由于数据太少，目前先展示最新版本的信息，而不显示上个版本的信息
      this.dataList = list.slice(0, 1)
      this.topic = list[0].topic
      // this.dataList = list
    },
    closeHandle () {
      console.log('closeDialog')
      this.$emit('closeDialog')
    },
    handerYes () {
      this.$http({
        url: this.$http.adornUrl('sys/messagenotified/save'),
        method: 'get',
        params: {
          topic: this.topic
        }
      }).then(({ data }) => {
        if (data && data.code === 0) {
          this.dialogData.visible = false
          this.$emit('closeDialog')
        } else {
          this.$notify.error({
            title: '版本更新',
            message: data.msg,
            duration: 2000
          })
        }
      })
    }
  }
}
</script>

<style scoped>
.el-timeline{
  padding: 0;
}
</style>
