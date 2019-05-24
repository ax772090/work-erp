<template>
  <el-dialog title="日志列表"
             :close-on-click-modal="false"
             :visible.sync="visible"
             @close="$refs['dataForm'].resetFields()"
             width="75%">
    <el-form :inline="true"
             :model="dataForm"
             @keyup.enter.native="getDataList(1)">
      <el-form-item>
        <el-input v-model="dataForm.id"
                  placeholder="任务ID"
                  clearable></el-input>
      </el-form-item>
      <el-form-item>
        <el-button @click="getDataList(1)">查询</el-button>
      </el-form-item>
    </el-form>
    <el-table :data="dataList"
              border
              v-loading="dataListLoading"
              height="460">
      <el-table-column prop="logId"
                       header-align="center"
                       align="center"
                       width="80"
                       label="日志ID"></el-table-column>
      <el-table-column prop="jobId"
                       header-align="center"
                       align="center"
                       width="80"
                       label="任务ID"></el-table-column>
      <el-table-column prop="beanName"
                       header-align="center"
                       align="center"
                       label="bean名称"></el-table-column>
      <el-table-column prop="methodName"
                       header-align="center"
                       align="center"
                       label="方法名称"></el-table-column>
      <el-table-column prop="params"
                       header-align="center"
                       align="center"
                       label="参数"></el-table-column>
      <el-table-column prop="status"
                       header-align="center"
                       align="center"
                       label="状态">
        <template slot-scope="scope">
          <el-tag v-if="scope.row.status === 0"
                  size="small">成功</el-tag>
          <el-tag v-else
                  @click.native="showErrorInfo(scope.row.logId)"
                  size="small"
                  type="danger"
                  style="cursor: pointer;">失败</el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="times"
                       header-align="center"
                       align="center"
                       label="耗时(单位: 毫秒)"></el-table-column>
      <el-table-column prop="createTime"
                       header-align="center"
                       align="center"
                       width="180"
                       label="执行时间"></el-table-column>
    </el-table>
    <el-row>
      <pagination-all v-model="paginationData"
                      @paginationChangeHandle="getDataList"></pagination-all>
    </el-row>
  </el-dialog>
</template>

<script>
import paginationAll from '@/components/erp-pagination/pagination-all';
import { initData } from '@/mixins/initData.js';
export default {
  mixins: [initData],
  components: {
    paginationAll
  },
  data () {
    return {
      visible: false,
      dataForm: {
        id: ''
      },
      dataList: [],
      dataListLoading: false
    }
  },
  methods: {
    init () {
      this.visible = true
      this.getDataList()
    },
    // 获取数据列表
    getDataList (val) {
      if (val) {
        this.paginationData.currPage = val
      }
      this.dataListLoading = true
      this.$http({
        url: this.$http.adornUrl('sys/scheduleLog/list'),
        method: 'get',
        params: this.$http.adornParams({
          currPage: this.paginationData.currPage,
          pageSize: this.paginationData.pageSize,
          jobId: this.dataForm.id
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
    },
    // 失败信息
    showErrorInfo: _.debounce(
      async function showErrorInfo (id) {
        this.$http({
          url: this.$http.adornUrl(`sys/scheduleLog/info/${id}`),
          method: 'get',
          params: this.$http.adornParams()
        }).then(({ data }) => {
          if (data && data.code === 0) {
            this.$alert(data.log.error)
          } else {
            this.$notify.error({
              title: '错误',
              message: data.msg,
              duration: 5000
            })
          }
        })
      },
      1000,
      {
        leading: true,
        trailing: false
      }
    )
  }
}
</script>
