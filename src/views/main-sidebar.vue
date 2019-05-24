<template>
  <aside class="site-sidebar"
         :class="'site-sidebar--' + sidebarLayoutSkin">
    <div class="site-sidebar__inner">
      <el-menu :default-active="menuActiveName || 'home'"
               :collapse="sidebarFold"
               :collapseTransition="false"
               class="site-sidebar__menu">
        <!-- <el-menu-item index="home"> -->
        <!-- <select-all
              v-model="menuName"
              :listDataOption="menuList"
              data-value="menuId"
              data-label="name"
              :isSelectChange="true"
              @selectChange="menuNameChangeHandle"
            ></select-all> -->
        <!-- <el-cascader v-model="menuName"
                     :options="menuList"
                     change-on-select
                     clearable
                     style="width:100%"
                     filterable></el-cascader> -->
        <!-- </el-menu-item> -->
        <el-submenu index="demo">
          <template slot="title">
            <!-- <icon-svg name="shoucang"
                      class="site-sidebar__menu-icon"></icon-svg> -->
            <span>demo</span>
          </template>
          <el-menu-item index="demo-echarts"
                        @click="$router.push({ name: 'demo-echarts' })">
            <!-- <icon-svg name="tubiao"
                      class="site-sidebar__menu-icon"></icon-svg> -->
            <span slot="title">echarts</span>
          </el-menu-item>
          <el-menu-item index="demo-ueditor"
                        @click="$router.push({ name: 'demo-ueditor' })">
            <!-- <icon-svg name="editor"
                      class="site-sidebar__menu-icon"></icon-svg> -->
            <span slot="title">ueditor</span>
          </el-menu-item>
          <el-menu-item index="demo-commoncs" @click="$router.push({ name: 'demo-commoncs' })">
            <icon-svg name="commoncs" class="site-sidebar__menu-icon"></icon-svg>
            <span slot="title">test</span>
          </el-menu-item>
        </el-submenu>
        <sub-menu v-for="menu in menuList"
                  :key="menu.menuId"
                  :menu="menu"
                  :dynamicMenuRoutes="dynamicMenuRoutes">
        </sub-menu>
      </el-menu>
    </div>
  </aside>
</template>

<script>
import SubMenu from './main-sidebar-sub-menu'
import { isURL } from '@/utils/validate'
import selectAll from '@/components/erp-select/select-all'

export default {
  data () {
    return {
      dynamicMenuRoutes: [],
      menuName: []

    }
  },
  components: {
    SubMenu,
    selectAll
  },
  computed: {
    sidebarLayoutSkin: {
      get () { return this.$store.state.common.sidebarLayoutSkin }
    },
    sidebarFold: {
      get () { return this.$store.state.common.sidebarFold }
    },
    menuList: {
      get () { return this.$store.state.common.menuList },
      set (val) { this.$store.commit('common/updateMenuList', val) }
    },
    menuActiveName: {
      get () { return this.$store.state.common.menuActiveName },
      set (val) { this.$store.commit('common/updateMenuActiveName', val) }
    },
    mainTabs: {
      get () { return this.$store.state.common.mainTabs },
      set (val) { this.$store.commit('common/updateMainTabs', val) }
    },
    mainTabsActiveName: {
      get () { return this.$store.state.common.mainTabsActiveName },
      set (val) { this.$store.commit('common/updateMainTabsActiveName', val) }
    }
  },
  watch: {
    $route: 'routeHandle'
  },
  created () {
    this.menuList = JSON.parse(sessionStorage.getItem('menuList') || '[]')
    this.dynamicMenuRoutes = JSON.parse(sessionStorage.getItem('dynamicMenuRoutes') || '[]')
    this.routeHandle(this.$route)
  },
  methods: {
    // 路由操作
    routeHandle (route) {
      if (route.meta.isTab) {
        // tab选中, 不存在先添加
        var tab = this.mainTabs.filter(item => item.name === route.name)[0]
        if (!tab) {
          if (route.meta.isDynamic) {
            route = this.dynamicMenuRoutes.filter(item => item.name === route.name)[0]
            if (!route) {
              return console.error('未能找到可用标签页!')
            }
          }
          tab = {
            menuId: route.meta.menuId || route.name,
            name: route.name,
            title: route.meta.title,
            type: isURL(route.meta.iframeUrl) ? 'iframe' : 'module',
            iframeUrl: route.meta.iframeUrl || ''
          }
          this.mainTabs = this.mainTabs.concat(tab)
        }
        this.menuActiveName = tab.menuId + ''
        this.mainTabsActiveName = tab.name
      }
    },
    // 选择菜单
    menuNameChangeHandle (val) {

    }
  }
}
</script>
