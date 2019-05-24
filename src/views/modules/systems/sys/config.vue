<template>
  <div class="mod-config">
    <el-form :inline="true"
             :model="dataForm"
             @keyup.enter.native="getDataList(1)">
      <el-form-item>
        <el-input v-model="dataForm.paramKey"
                  placeholder="参数名"
                  clearable></el-input>
      </el-form-item>
      <el-form-item>
        <el-button @click="getDataList(1)">查询</el-button>
        <el-button type="primary"
                   @click="addOrUpdateHandle()"><i class="iconfont erp-icon-xinzeng"></i>新增</el-button>
        <el-button type="danger"
                   @click="deleteHandle()"
                   :disabled="dataListSelections.length <= 0"><i class="iconfont erp-icon-shanchu"></i>批量删除</el-button>
      </el-form-item>
    </el-form>
    <el-table :data="dataList"
              stripe
              border
              highlight-current-row
              v-loading="dataListLoading"
              @selection-change="selectionChangeHandle">
      <el-table-column type="selection"
                       align="center"
                       header-align="center"
                       width="50"></el-table-column>
      <el-table-column prop="id"
                       width="180"
                       label="ID"></el-table-column>
      <el-table-column prop="paramKey"
                       label="参数名"></el-table-column>
      <el-table-column prop="paramValue"
                       label="参数值"></el-table-column>
      <el-table-column prop="remark"
                       label="备注"></el-table-column>
      <el-table-column fixed="right"
                       width="150"
                       label="操作">
        <template slot-scope="scope">
          <el-button type="primary"
                     size="small"
                     title="编辑"
                     circle
                     @click="addOrUpdateHandle(scope.row.id)">
            <i class="iconfont erp-icon-bianji"></i>
          </el-button>
          <el-button type="primary"
                     size="small"
                     title="删除"
                     circle
                     @click="deleteHandle(scope.row.id)">
            <i class="iconfont erp-icon-shanchu"></i>
          </el-button>
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
  </div>
</template>

<script>
import AddOrUpdate from './config-add-or-update'
import paginationAll from '@/components/erp-pagination/pagination-all'
import { initData } from '@/mixins/initData.js'
export default {
  mixins: [initData],
  components: {
    AddOrUpdate,
    paginationAll
  },
  data () {
    return {
      dataForm: {
        paramKey: ''
      },
      dataList: [],
      dataListLoading: false,
      dataListSelections: [],
      addOrUpdateVisible: false
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
        url: this.$http.adornUrl('sys/config/list'),
        method: 'get',
        params: this.$http.adornParams({
          currPage: this.paginationData.currPage,
          pageSize: this.paginationData.pageSize,
          paramKey: this.dataForm.paramKey
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
    deleteHandle (id) {
      var ids = id
        ? [id]
        : this.dataListSelections.map(item => {
          return item.id
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
            url: this.$http.adornUrl('sys/config/delete'),
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
    }
  }
}
</script>
