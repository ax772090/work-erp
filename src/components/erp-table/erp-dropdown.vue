<template>
  <el-dropdown :show-timeout="20" @command="handleCommand">
    <span class="el-dropdown-link" v-text="dropDownData.label">
      <i class="el-icon-arrow-down el-icon--right"></i>
    </span>
    <el-dropdown-menu slot="dropdown">
        <el-dropdown-item v-for="(item,index) in dropDownData.items" :command='item.func' v-text="item.label" :key="index"></el-dropdown-item>
    </el-dropdown-menu>
  </el-dropdown>
</template>

<script>
export default {
    props:['dropDownData'],
    methods:{
        handleCommand(command){
            this.$emit(command.func,command.rowId)
        }
    }
}
</script>

