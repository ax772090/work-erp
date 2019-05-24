<template>
  <div>
    <el-collapse v-model="collapseActiveName">
      <div>
        <search-base v-for="(item,index) in conditionList"
                     :key="item.guid"
                     v-if="index<1"
                     v-model="searchData"
                     :searchOptions="searchOptions"
                     :isExtension="false"
                     :conditionName="item.fieldName"
                     @search="searchHandel"
                     @reset="resetHandel"
                     @childConditionList='getconditionList'
                     class="search-position"/>
      </div>
      <el-collapse-item name="expandColl">
        <div v-for="(item,index) in conditionList"
             :key="item.guid"
             v-if="index>0"
             class="mb-5">
          <search-base v-model="searchData"
                       :searchOptions="searchOptions"
                       :isExtension="true"
                       :conditionName="item.fieldName" />
          <el-button type="danger"
                     size="small"
                     circle
                     title="删除"
                     @click="deleteHandel(index)">
            <i class="iconfont erp-icon-shanchu"></i>
          </el-button>
        </div>
        <!-- <div style="display:inline-block">
          <el-dropdown @command="addCondition">
            <span class="el-dropdown-link">
              <i class="el-icon-circle-plus-outline"></i>添加查询条件
              <i class="el-icon-arrow-down el-icon--right"></i>
            </span>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item
                v-for="item in searchOptions"
                :key="item.value"
                :command="item.value"
              >{{item.label}}</el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </div> -->
      </el-collapse-item>
    </el-collapse>
  </div>
</template>

<script>
import searchBase from '@/components/erp-search-panel/search-base'
import { getUUID } from '@/utils'

export default {
  name: 'erp-search-panel',

  components: {
    searchBase
  },

  // model: {
  //   prop: 'value',
  //   event: 'change'
  // },

  props: {
    searchOptions: {
      type: Array,
      default: []
    },

    selectedOption: { default: '' },
    value: { type: [String, Array, Object], default: '' }, // 接受外部v-model传入的值
    isResetHandle: { default: false }
  },

  data () {
    return {
      searchData: this.value,
      conditionList: [],
      collapseActiveName: ''
    }
  },

  mounted () {
    var conditionNameList = (this.selectedOption === ''
      ? !this.searchOptions
        ? ''
        : this.searchOptions[0].value
      : this.selectedOption
    ).split('|')
    for (const name of conditionNameList) {
      var item = {
        guid: getUUID(),
        fieldName: name
      }

      this.conditionList.push(item)
    }
  },

  computed: {
    /**
     * 判断查询条件是否大于1个，如果大于1则自动展开
     */
    // collapseActiveName: {
    //   get() {
    //     return !this.conditionList || this.conditionList.length <= 1
    //       ? ""
    //       : "expandColl";
    //   },
    //   set(val) {}
    // }
  },

  methods: {
    /**
     * 添加查询条件
     */

    getconditionList (val) {
      if (val) {
        this.collapseActiveName = 'expandColl'
      }
      this.conditionList.push({ guid: getUUID(), fieldName: val })
    },
    /**
     * 删除查询条件
     */
    deleteHandel (idx) {
      let fieldName = this.conditionList[idx].fieldName
      let fieldNames = fieldName.split(',')

      for (const nameKey of fieldNames) {
        if (this.searchData.hasOwnProperty(nameKey)) {
          // this.searchData[nameKey] = ''
          delete this.searchData[nameKey]
        }
      }
      // this.searchData[this.conditionList[idx]] = null
      this.conditionList.splice(idx, 1)
    },

    /**
     * 搜索查询
     */
    searchHandel () {
      this.$emit('search', 1)
    },

    /**
     * 重置查询条件
     */
    resetHandel () {
      this.searchData = {}

      if (this.conditionList.length > 1) {
        this.conditionList.splice(1, this.conditionList.length - 1)
      }

      if (this.isResetHandle) {
        this.$emit('resetHandle')
      }
    }
  },

  watch: {
    /**
     * 监听选择条件的变化
     */
    selectedOption: {
      handler (val, oldVal) {
        if (!oldVal) {
          return
        }
        let fieldNames = oldVal.split(',')
        for (const fieldName of fieldNames) {
          delete this.searchData[fieldName]
        }
      },
      deep: true
    },

    /**
     * 监听父组件传值给当前子组件的值
     */
    value: {
      handler (val, oldVal) {
        this.searchData = this.value
        this.$emit('change', this.searchData)
      },
      deep: true
    },

    /**
     * 监听当前子组件传值给父组的值
     */
    searchData: {
      handler (val, oldVal) {
        // 父级的v-model 默认可以接收该事件,实现将值传递给父级
        this.$emit('input', val)
      },
      deep: true
    }
  }
}
</script>
<style scoped>
/* 折叠动画 */
.foldBox {
  transition: height 1s;
  padding: 10px 0;
}
.search-position{
  position:absolute; max-width: 960px; width: 100%; top: 10px;
}
</style>
