<template>
  <div class="commoncs">
    <div id="wx_qrcode">

    </div>
  </div>
</template>

<script>
// import dialogAll from '@/components/erp-dialog/dialog-all'
// import datetimetickerAll from '@/components/erp-date/dateTimePicker-all'
export default {
  // components: {
  //   dialogAll,
  //   datetimetickerAll
  // },
  data () {
    return {
      dateTimeData: ''
    }
  },
  created () {

  },
  methods: {
    handeraaaaaaa () {
      this.dialogData.visible = true
    }
  },
  mounted () {
    window.WwLogin({
      'id': 'wx_qrcode',
      'appid': 'wwdbabbc550839b04a',
      'scope': '',
      'redirect_uri': 'www.baidu.com',
      'state': '',
      'href': 'www.baidu.com',
      'state': '',
      'style': ''
    })
  }
}
</script>
<style scoped>
/* .commoncs {
  padding: 40px 0;
  height: 800px;
} */
</style>
