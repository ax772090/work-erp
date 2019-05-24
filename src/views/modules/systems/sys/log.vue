<template>
  <div class="mod-log">
    <el-form :inline="true"
             :model="dataForm"
             @keyup.enter.native="getDataList(1)">
      <el-form-item>
        <el-input v-model="dataForm.key"
                  placeholder="用户名／用户操作"
                  clearable></el-input>
      </el-form-item>
      <el-form-item>
        <el-button @click="getDataList(1)">查询</el-button>
      </el-form-item>
    </el-form>
    <el-table :data="dataList"
              stripe
              border
              highlight-current-row
              v-loading="dataListLoading">
      <el-table-column prop="id"
                       width="180"
                       label="ID"></el-table-column>
      <el-table-column prop="username"
                       width="180"
                       label="用户名"></el-table-column>
      <el-table-column prop="operation"
                       width="180"
                       label="用户操作"></el-table-column>
      <el-table-column prop="method"
                       width="300"
                       :show-overflow-tooltip="true"
                       label="请求方法"></el-table-column>
      <el-table-column prop="params"
                       width="300"
                       :show-overflow-tooltip="true"
                       label="请求参数"></el-table-column>
      <el-table-column prop="time"
                       align="center"
                       label="执行时长(毫秒)"></el-table-column>
      <el-table-column prop="ip"
                       width="150"
                       label="IP地址"></el-table-column>
      <el-table-column prop="createDate"
                       width="180"
                       label="创建时间"></el-table-column>
    </el-table>
    <el-row>
      <pagination-all v-model="paginationData"
                      @paginationChangeHandle='getDataList'></pagination-all>
    </el-row>
  </div>
</template>

<script>
import paginationAll from '@/components/erp-pagination/pagination-all'
import { initData } from '@/mixins/initData.js'
export default {
  mixins: [
    initData
  ],
  components: {
    paginationAll
  },
  data () {
    return {
      dataForm: {
        key: ''
      },
      dataList: [],
      dataListLoading: false,
      selectionDataList: []
    }
  },
  created () {
    this.getDataList()
  },
  methods: {
    // 获取数据列表
    getDataList (val) {
      if (val) {
        this.paginationData.currPage = val
      }
      this.dataListLoading = true
      this.$http({
        url: this.$http.adornUrl('sys/log/list'),
        method: 'get',
        params: this.$http.adornParams({
          'currPage': this.paginationData.currPage,
          'pageSize': this.paginationData.pageSize,
          'key': this.dataForm.key
        })
      }).then(({ data }) => {
        if (data && data.code === 0) {
          this.dataList = data.pageList.dataList
          this.paginationData.totalCount = data.pageList.page.totalCount
        } else {
          this.dataList = []
          this.paginationData.totalCount = 0
        }
        this.dataListLoading = false
      })
    }
  }
}
</script>
