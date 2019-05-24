<template>
  <div>
    <el-row>
    </el-row>
    <el-row>
      <el-input v-model="searchData.roleName"
                placeholder="角色名称"
                clearable
                @keyup.enter.native="getDataList(1)"></el-input>
      <el-button @click="getDataList(1)">查询</el-button>
    </el-row>
    <el-row>
      <el-button v-if="isAuth('sys:role:save')"
                 type="primary"
                 @click="addOrUpdateHandle()">
        <i class="iconfont erp-icon-xinzeng"></i>新增</el-button>
      <el-button v-if="isAuth('sys:role:delete')"
                 type="danger"
                 @click="deleteHandle()"
                 :disabled="dataListSelections.length <= 0"><i class="iconfont erp-icon-shanchu"></i>批量删除</el-button>
    </el-row>
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
      <el-table-column prop="roleName"
                       label="角色名称"></el-table-column>
      <el-table-column prop="remark"
                       label="备注"></el-table-column>
      <el-table-column prop="createTime"
                       width="180"
                       label="创建时间"></el-table-column>
      <el-table-column fixed="right"
                       width="225"
                       label="操作">
        <template slot-scope="scope">
          <el-button v-if="isAuth('sys:role:update')"
                     type="primary"
                     size="small"
                     title="编辑"
                     circle
                     @click="addOrUpdateHandle(scope.row.roleId)">
            <i class="iconfont erp-icon-bianji"></i>
          </el-button>
          <el-button v-if="isAuth('sys:role:save')"
                     type="primary"
                     size="small"
                     circle
                     title="复制角色"
                     @click="copyHandle(scope.row.roleId)">
            <i class="iconfont erp-icon-fuzhi"></i>
          </el-button>
          <el-button v-if="isAuth('sys:role:delete')"
                     type="danger"
                     size="small"
                     circle
                     title="删除"
                     @click="deleteHandle(scope.row.roleId)">
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
import AddOrUpdate from './role-add-or-update'
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
      searchData: {
        roleName: ''
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
        url: this.$http.adornUrl('sys/role/list'),
        method: 'get',
        params: this.$http.adornParams({
          currPage: this.paginationData.currPage,
          pageSize: this.paginationData.pageSize,
          roleName: this.searchData.roleName
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

    /**
     * 复制角色
     */
    copyHandle (id) {
      this.$http({
        url: this.$http.adornUrl(`sys/role/copy/${id}`),
        method: 'get',
        params: this.$http.adornParams()
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
    },

    // 删除
    deleteHandle (id) {
      var ids = id
        ? [id]
        : this.dataListSelections.map(item => {
          return item.roleId
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
            url: this.$http.adornUrl('sys/role/delete'),
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
