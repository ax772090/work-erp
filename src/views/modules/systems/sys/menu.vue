<template>
  <div class="mod-menu">
    <el-form :inline="true"
             :model="dataForm">
      <el-form-item>
        <el-button v-if="isAuth('sys:menu:save')"
                   type="primary"
                   @click="addOrUpdateHandle()"><i class="iconfont erp-icon-xinzeng"></i>新增</el-button>
      </el-form-item>
    </el-form>
    <el-table :data="dataList"
              stripe
              border
              highlight-current-row>
      <!-- <el-table-column
        prop="menuId"
        width="180"
        label="ID">
      </el-table-column>-->
      <table-tree-column prop="name"
                         treeKey="menuId"
                         width="180"
                         label="名称"></table-tree-column>
      <el-table-column prop="parentName"
                       width="180"
                       label="上级菜单"></el-table-column>
      <el-table-column label="图标">
        <template slot-scope="scope">
          <!-- <icon-svg :name="scope.row.icon || ''"></icon-svg> -->
          <i :class="'iconfont ' + scope.row.icon"></i>
        </template>
      </el-table-column>
      <el-table-column prop="type"
                       label="类型">
        <template slot-scope="scope">
          <el-tag v-if="scope.row.type === 0"
                  size="small">目录</el-tag>
          <el-tag v-else-if="scope.row.type === 1"
                  size="small"
                  type="success">菜单</el-tag>
          <el-tag v-else-if="scope.row.type === 2"
                  size="small"
                  type="info">按钮</el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="orderNum"
                       label="排序号"></el-table-column>
      <el-table-column prop="url"
                       width="150"
                       :show-overflow-tooltip="true"
                       label="菜单URL"></el-table-column>
      <el-table-column prop="perms"
                       width="150"
                       :show-overflow-tooltip="true"
                       label="授权标识"></el-table-column>
      <el-table-column fixed="right"
                       width="150"
                       label="操作">
        <template slot-scope="scope">
          <el-button v-if="isAuth('sys:menu:update')"
                     type="primary"
                     size="small"
                     circle
                     title="编辑"
                     @click="addOrUpdateHandle(scope.row.menuId)">
            <i class="iconfont erp-icon-bianji"></i>
          </el-button>
          <el-button v-if="isAuth('sys:menu:delete')"
                     type="danger"
                     size="small"
                     title="删除"
                     circle
                     @click="deleteHandle(scope.row.menuId)">
            <i class="iconfont erp-icon-shanchu"></i>
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 弹窗, 新增 / 修改 -->
    <add-or-update v-if="addOrUpdateVisible"
                   ref="addOrUpdate"
                   @refreshDataList="getDataList"></add-or-update>
  </div>
</template>

<script>
import TableTreeColumn from '@/components/table-tree-column'
import AddOrUpdate from './menu-add-or-update'
import { treeDataTranslate } from '@/utils'
export default {
  data () {
    return {
      dataForm: {},
      dataList: [],
      dataListLoading: false,
      addOrUpdateVisible: false
    }
  },
  components: {
    TableTreeColumn,
    AddOrUpdate
  },
  created () {
    this.getDataList()
  },
  methods: {
    // 获取数据列表
    getDataList () {
      this.dataListLoading = true
      this.$http({
        url: this.$http.adornUrl('sys/menu/list'),
        method: 'get',
        params: this.$http.adornParams()
      }).then(({ data }) => {
        this.dataList = treeDataTranslate(data, 'menuId')
        this.dataListLoading = false
      })
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
      this.$confirm(`确定要进行删除操作吗?`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          this.$http({
            url: this.$http.adornUrl(`sys/menu/delete/${id}`),
            method: 'post',
            data: this.$http.adornData()
          }).then(({ data }) => {
            if (data && data.code === 0) {
              this.getDataList(1)
              this.$notify({
                title: '提示',
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
    }
  }
}
</script>
