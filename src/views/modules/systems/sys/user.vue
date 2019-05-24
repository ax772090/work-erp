<template>
  <div class="mod-user">
    <el-form :inline="true"
             :model="dataForm"
             @keyup.enter.native="getDataList(1)">
      <el-row>
        <erp-search-panel v-model="dataForm"
                          :searchOptions="searchOptions"
                          selectedOption="userNo"
                          @search="getDataList(1)"></erp-search-panel>
      </el-row>
      <el-row>
        <el-button v-if="isAuth('sys:user:save')"
                   type="primary"
                   @click="addOrUpdateHandle()">
          <i class="iconfont erp-icon-xinzeng"></i>新增</el-button>
        <!-- <el-button v-if="isAuth('sys:user:delete')" type="danger" @click="deleteHandle()" :disabled="dataListSelections.length <= 0">批量删除</el-button> -->
      </el-row>

      <!-- <el-form-item>
        <el-input v-model="dataForm.userName"
                  placeholder="用户名"
                  clearable></el-input>
      </el-form-item>-->
      <!-- <el-form-item>
        <el-button @click="getDataList(1)">查询</el-button>
        <el-button v-if="isAuth('sys:user:save')"
                   type="primary"
                   @click="addOrUpdateHandle()">新增</el-button>
      </el-form-item>-->
    </el-form>
    <el-table :data="dataList"
              v-loading="dataListLoading"
              @selection-change="selectionChangeHandle">
      <!-- <el-table-column type="selection"   width="50"></el-table-column> -->
      <!-- <el-table-column prop="userId"   width="180" label="ID"></el-table-column> -->
      <el-table-column prop="userNo"
                       label="用户账号"></el-table-column>
      <el-table-column prop="username"
                       label="用户名"></el-table-column>
      <el-table-column prop="deptName"
                       label="部门"></el-table-column>
      <el-table-column prop="email"
                       label="邮箱"></el-table-column>
      <el-table-column prop="mobile"
                       label="手机号"></el-table-column>
      <el-table-column prop="status"
                       label="状态">
        <template slot-scope="scope">
          <el-tag v-if="scope.row.status == 0"
                  size="small"
                  type="danger">禁用</el-tag>
          <el-tag v-else
                  size="small">正常</el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="createTime"
                       width="180"
                       label="创建时间"></el-table-column>
      <el-table-column fixed="right"
                       width="150"
                       label="操作">
        <template slot-scope="scope">
          <el-button v-if="isAuth('sys:user:update')"
                     type="primary"
                     title="编辑"
                     icon="el-icon-edit"
                     circle
                     @click="addOrUpdateHandle(scope.row.userId)"></el-button>
          <!-- <el-button v-if="isAuth('sys:user:delete')" type="danger" icon="el-icon-delete" size="mini" circle @click="deleteHandle(scope.row.userId)"></el-button> -->
        </template>
      </el-table-column>
    </el-table>
    <el-row>
      <pagination-all v-model="paginationData"
                      @paginationChangeHandle="getDataList"></pagination-all>
    </el-row>
    <!-- 弹窗, 新增 / 修改 -->
    <add-or-update :roleadd="roleadd"
                   v-if="addOrUpdateVisible"
                   ref="addOrUpdate"
                   @refreshDataList="getDataList"></add-or-update>
  </div>
</template>

<script>
import AddOrUpdate from './user-add-or-update'
import paginationAll from '@/components/erp-pagination/pagination-all'
import { initData } from '@/mixins/initData.js'
import erpSearchPanel from '@/components/erp-search-panel'
export default {
  mixins: [initData],
  components: {
    AddOrUpdate,
    paginationAll,
    erpSearchPanel
  },
  data () {
    return {
      dataForm: {},
      dataList: [],
      dataListLoading: false,
      dataListSelections: [],
      // 默认为false，不弹窗
      addOrUpdateVisible: false,
      // 点击添加按钮得到的数据
      roleadd: [],

      // 过滤选项
      searchOptions: [
        {
          label: '用户账号',
          value: 'userNo',
          inputType: 'el-input'
        },
        {
          label: '用户姓名',
          value: 'userName',
          inputType: 'el-input'
        },
        {
          label: '所属公司',
          value: 'compId',
          inputType: 'el-select',

          httpUrl: 'sys/organization/select',
          dataSource: 'companyList',
          title: 'companyList',
          dataValue: 'orgId',
          dataLabel: 'name',
          placeholder: '所属公司'
        },
        {
          label: '部门',
          value: 'deptId',
          inputType: 'el-cascader',

          httpUrl: 'sys/organization/sortSpecifyNodeId',
          requestParams: { nodeId: sessionStorage.getItem('orgId') },
          dataSource: 'list',
          title: 'deptId',
          dataValue: 'orgId',
          dataLabel: 'name',
          dataChildren: 'subOrgList',
          placeholder: '所属部门'
        }
      ]
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
        url: this.$http.adornUrl('sys/user/list'),
        method: 'get',
        params: Object.assign({}, this.paginationData, this.dataForm)
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
      // 查询角色de按钮
      this.addOrUpdateVisible = true
      // 当为true的时候，可以显示弹窗
      this.$nextTick(() => {
        this.$refs.addOrUpdate.init(id)
      })
    },
    // 删除
    deleteHandle (id) {
      var userIds = id
        ? [id]
        : this.dataListSelections.map(item => {
          return item.userId
        })
      this.$confirm(
        `确定对[id=${userIds.join(',')}]进行[${id ? '删除' : '批量删除'}]操作?`,
        '提示',
        {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }
      )
        .then(() => {
          this.$http({
            url: this.$http.adornUrl('sys/user/delete'),
            method: 'post',
            data: this.$http.adornData(userIds, false)
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
