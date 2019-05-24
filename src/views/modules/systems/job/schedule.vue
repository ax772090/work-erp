<template>
  <!-- 定时任务 -->
  <div class="mod-schedule">
    <el-form :inline="true"
             :model="dataForm"
             @keyup.enter.native="getDataList(1)">
      <el-form-item>
        <el-input v-model="dataForm.beanName"
                  placeholder="bean名称"
                  clearable></el-input>
      </el-form-item>
      <el-form-item>
        <el-button @click="getDataList(1)"><i class="iconfont erp-icon-sousuo"></i>查询</el-button>
        <el-button v-if="isAuth('sys:schedule:save')"
                   type="primary"
                   @click="addOrUpdateHandle()"><i class="iconfont erp-icon-xinzeng"></i>新增</el-button>
        <el-button v-if="isAuth('sys:schedule:delete')"
                   type="danger"
                   @click="deleteHandle()"
                   :disabled="dataListSelections.length <= 0"><i class="iconfont erp-icon-piliangshanchu"></i>批量删除</el-button>
        <el-button v-if="isAuth('sys:schedule:pause')"
                   type="danger"
                   @click="pauseHandle()"
                   :disabled="dataListSelections.length <= 0">批量暂停</el-button>
        <el-button v-if="isAuth('sys:schedule:resume')"
                   type="danger"
                   @click="resumeHandle()"
                   :disabled="dataListSelections.length <= 0">批量恢复</el-button>
        <el-button v-if="isAuth('sys:schedule:run')"
                   type="danger"
                   @click="runHandle()"
                   :disabled="dataListSelections.length <= 0">批量立即执行</el-button>
        <el-button v-if="isAuth('sys:schedule:log')"
                   type="success"
                   @click="logHandle()">日志列表</el-button>
      </el-form-item>
    </el-form>
    <el-table :data="dataList"
              stripe border highlight-current-row
              v-loading="dataListLoading"
              @selection-change="selectionChangeHandle">
      <el-table-column type="selection"
                       align="center"
                       header-align="center"
                       width="50"></el-table-column>
      <el-table-column prop="jobId"
                       width="180"
                       label="ID"></el-table-column>
      <el-table-column prop="beanName"
                       label="bean名称"></el-table-column>
      <el-table-column prop="methodName"
                       label="方法名称"></el-table-column>
      <el-table-column prop="params"
                       label="参数"></el-table-column>
      <el-table-column prop="cronExpression"
                       label="cron表达式"></el-table-column>
      <el-table-column prop="remark"
                       label="备注"></el-table-column>
      <el-table-column prop="status"
                       label="状态">
        <template slot-scope="scope">
          <el-tag v-if="scope.row.status === 0"
                  size="small">正常</el-tag>
          <el-tag v-else
                  size="small"
                  type="danger">暂停</el-tag>
        </template>
      </el-table-column>
      <el-table-column fixed="right"
                       width="150"
                       label="操作">
        <template slot-scope="scope">
          <el-button v-if="isAuth('sys:schedule:update')"
                     type="text"
                     size="small"
                     @click="addOrUpdateHandle(scope.row.jobId)">修改</el-button>
          <el-button v-if="isAuth('sys:schedule:delete')"
                     type="text"
                     size="small"
                     @click="deleteHandle(scope.row.jobId)">删除</el-button>
          <el-button v-if="isAuth('sys:schedule:pause')"
                     type="text"
                     size="small"
                     @click="pauseHandle(scope.row.jobId)">暂停</el-button>
          <el-button v-if="isAuth('sys:schedule:resume')"
                     type="text"
                     size="small"
                     @click="resumeHandle(scope.row.jobId)">恢复</el-button>
          <el-button v-if="isAuth('sys:schedule:run')"
                     type="text"
                     size="small"
                     @click="runHandle(scope.row.jobId)">立即执行</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-row>
      <pagination-all v-model="paginationData"
                      @paginationChangeHandle="getDataList"></pagination-all>
    </el-row>
    <!-- 弹窗, 新增 / 修改 -->
    <add-or-update v-if="addOrUpdateVisible"
                   ref="addOrUpdate"
                   @refreshDataList="getDataList"></add-or-update>
    <!-- 弹窗, 日志列表 -->
    <log v-if="logVisible"
         ref="log"></log>
  </div>
</template>

<script>
import AddOrUpdate from './schedule-add-or-update'
import Log from './schedule-log'
import paginationAll from '@/components/erp-pagination/pagination-all'
import { initData } from '@/mixins/initData.js'
export default {
  mixins: [initData],
  components: {
    AddOrUpdate,
    Log,
    paginationAll
  },
  data () {
    return {
      dataForm: {
        beanName: ''
      },
      dataList: [],
      dataListLoading: false,
      dataListSelections: [],
      addOrUpdateVisible: false,
      logVisible: false
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
        url: this.$http.adornUrl('sys/schedule/list'),
        method: 'get',
        params: this.$http.adornParams({
          currPage: this.paginationData.currPage,
          pageSize: this.paginationData.pageSize,
          beanName: this.dataForm.beanName
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
    // 多选
    selectionChangeHandle (val) {
      this.dataListSelections = val
    },
    // 新增 / 修改
    addOrUpdateHandle (id) {
      this.addOrUpdateVisible = true
      this.$nextTick(() => {
        this.$refs.addOrUpdate.init(id)
      })
    },
    // 删除
    deleteHandle: _.debounce(
      async function deleteHandle (id) {
        var ids = id
          ? [id]
          : this.dataListSelections.map(item => {
            return item.jobId
          })
        this.$confirm(
          `确定要${id ? '删除' : '批量删除'}所选择的数据信息吗？`,
          '提示',
          {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }
        )
          .then(() => {
            this.$http({
              url: this.$http.adornUrl('sys/schedule/delete'),
              method: 'post',
              data: this.$http.adornData(ids, false)
            }).then(({ data }) => {
              if (data && data.code === 0) {
                this.getDataList(1)
                this.$notify.success({
                  title: '成功',
                  message: '操作成功',
                  duration: 1500
                })
              } else {
                this.$notify.error({
                  title: '错误',
                  message: data.msg,
                  duration: 5000
                })
              }
            })
          })
          .catch(() => { })
      },
      1000,
      {
        leading: true,
        trailing: false
      }
    ),

    // 暂停
    pauseHandle (id) {
      var ids = id
        ? [id]
        : this.dataListSelections.map(item => {
          return item.jobId
        })
      this.$confirm(
        `确定对[id=${ids.join(',')}]进行[${id ? '暂停' : '批量暂停'}]操作?`,
        '提示',
        {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }
      )
        .then(() => {
          this.$http({
            url: this.$http.adornUrl('sys/schedule/pause'),
            method: 'post',
            data: this.$http.adornData(ids, false)
          }).then(({ data }) => {
            if (data && data.code === 0) {
              this.getDataList()
              this.$notify.success({
                title: '成功',
                message: '操作成功',
                duration: 1500
              })
            } else {
              this.$notify.error({
                title: '错误',
                message: data.msg,
                duration: 5000
              })
            }
          })
        })
        .catch(() => { })
    },
    // 恢复
    resumeHandle (id) {
      var ids = id
        ? [id]
        : this.dataListSelections.map(item => {
          return item.jobId
        })
      this.$confirm(
        `确定对[id=${ids.join(',')}]进行[${id ? '恢复' : '批量恢复'}]操作?`,
        '提示',
        {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }
      )
        .then(() => {
          this.$http({
            url: this.$http.adornUrl('sys/schedule/resume'),
            method: 'post',
            data: this.$http.adornData(ids, false)
          }).then(({ data }) => {
            if (data && data.code === 0) {
              this.getDataList()
              this.$notify.success({
                title: '成功',
                message: '操作成功',
                duration: 1500
              })
            } else {
              this.$notify.error({
                title: '错误',
                message: data.msg,
                duration: 5000
              })
            }
          })
        })
        .catch(() => { })
    },
    // 立即执行
    runHandle (id) {
      var ids = id
        ? [id]
        : this.dataListSelections.map(item => {
          return item.jobId
        })
      this.$confirm(
        `确定对[id=${ids.join(',')}]进行[${
        id ? '立即执行' : '批量立即执行'
        }]操作?`,
        '提示',
        {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }
      )
        .then(() => {
          this.$http({
            url: this.$http.adornUrl('sys/schedule/run'),
            method: 'post',
            data: this.$http.adornData(ids, false)
          }).then(({ data }) => {
            if (data && data.code === 0) {
              this.getDataList()
              this.$notify.success({
                title: '成功',
                message: '操作成功',
                type: 'success',
                duration: 1500
              })
            } else {
              this.$notify.error({
                title: '错误',
                message: data.msg,
                duration: 5000
              })
            }
          })
        })
        .catch(() => { })
    },
    // 日志列表
    logHandle () {
      this.logVisible = true
      this.$nextTick(() => {
        this.$refs.log.init()
      })
    }
  }
}
</script>
