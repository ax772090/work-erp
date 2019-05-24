<template>
  <transition name="fade">
    <router-view></router-view>
  </transition>
</template>

<script>
export default {
  created () {
    // this.disableDevMode();

  },

  methods: {
    disableDevMode () {
      this.$nextTick(() => {
        // 禁用右键
        document.oncontextmenu = new Function('event.returnValue=false')
        // 禁用选择
        document.onselectstart = new Function('event.returnValue=false')

        // 在本网页的任何键盘敲击事件都是无效操作 （防止F12和shift+ctrl+i调起开发者工具）
        document.onkeydown = function () {
          var e = window.event || arguments[0]
          if (e.keyCode == 123) {
            return false
          } else if ((e.ctrlKey) && (e.shiftKey) && (e.keyCode == 73)) {
            return false
          }
        }

        // 如果用户在工具栏调起开发者工具，那么判断浏览器的可视高度和可视宽度是否有改变，如有改变则关闭本页面
        var h = window.innerHeight, w = window.innerWidth
        document.onresize = function () {
          if (h != window.innerHeight || w != window.innerWidth) {
            this.alertDisableDevMode()
            window.close()
            window.location = 'about:blank'
          }
        }

        // 只要修改页面元素我就重新加载一次数据,让你无法修改页面元素（不支持IE9以下浏览器）
        if (window.addEventListener) {
          window.addEventListener('DOMCharacterDataModified', function () { window.location.reload() }, true)
          window.addEventListener('DOMAttributeNameChanged', function () { window.location.reload() }, true)
          window.addEventListener('DOMElementNameChanged', function () { window.location.reload() }, true)
        }
      })
    },

    alertDisableDevMode () {
      this.$message.error('开发者模式已被禁用，如有需要,请联系开发人员')
    }

  }
}
</script>
