<template>
  <div class="mod-config">
    <el-form :inline="true"
             :model="dataForm"
             @keyup.enter.native="getDataList()">
      <el-row>
        <erp-search-panel v-model="searchData"
                          :searchOptions="searchOptions"
                          @search="getDataList(1)" />
      </el-row>
      <el-row>
        <el-button v-if="isAuth('basic:basiccolor:save')"
                   type="primary"
                   @click="addOrUpdateHandle('','canAdd')">
          <i class="iconfont el-icon--left el-icon-erp-numpickerplus"></i>新增
        </el-button>
        <!-- <el-button
          v-if="isAuth('basic:basiccolor:delete')"
          type="danger"
          @click="deleteHandle()"
          :disabled="dataListSelections.length <= 0"
        >
          <i class="iconfont el-icon--left erp-icon-shanchu"></i>批量删除
        </el-button> -->
        <el-button type="primary">
          <i class="iconfont el-icon--left el-icon-erp-icon"></i>树形展示
        </el-button>
        <!-- <el-button type="primary" @click="getDataList()"><i class="iconfont el-icon--left el-icon-erp-ERP_gengxin"></i>刷新</el-button> -->
        <el-button type="primary"
                   @click="activeOrDis(status=false)">
          <i class="iconfont el-icon--left el-icon-erp-jinyong2"></i>禁用
        </el-button>
        <el-button type="primary"
                   @click="activeOrDis(status=true)">
          <i class="iconfont el-icon--left el-icon-erp-jinyong2"></i>启用
        </el-button>
      </el-row>
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
                       label="id"></el-table-column>
      <el-table-column prop="code"
                       label="颜色编码"></el-table-column>
      <el-table-column prop="color"
                       label="颜色"></el-table-column>
      <el-table-column prop="addUser"
                       label="创建人"></el-table-column>
      <el-table-column prop="addTime"
                       label="创建时间"
                       sortable></el-table-column>
      <el-table-column prop="bused"
                       label="是否使用">
        <template slot-scope="scope">
          <el-tag v-if="scope.row.bused == false"
                  size="small"
                  type="danger">禁用</el-tag>
          <el-tag v-else
                  size="small">正常</el-tag>
        </template>
      </el-table-column>
      <el-table-column fixed="right"
                       width="80"
                       label="操作">
        <template slot-scope="scope">
          <el-button type="primary"
                     size="small"
                     circle
                     title="编辑"
                     @click="addOrUpdateHandle(scope.row.id,'canEdit')">
            <i class="iconfont el-icon-erp-edit"></i>
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页 -->
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
// 搜索
import erpSearchPanel from '@/components/erp-search-panel'
// 分页
import paginationAll from '@/components/erp-pagination/pagination-all'
import AddOrUpdate from './basiccolor-add-or-update'
import { initData } from '@/mixins/initData.js'
export default {
  mixins: [initData],
  components: {
    erpSearchPanel,
    paginationAll,
    AddOrUpdate
  },
  data () {
    return {
      // 数据过滤器
      searchData: {},
      // 下拉
      searchOptions: [
        {
          label: '分类名称',
          value: 'name',
          inputType: 'el-input'
        },
        {
          label: '分类上级',
          value: 'parent_id',
          inputType: 'el-input'
        }
      ],

      // 是否禁用
      searchTF: true,
      // 发送批量禁用启用的数据
      searchTFs: {},
      dataForm: {
        key: ''
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
    // 禁用功能
    activeOrDis: _.debounce(
      async function activeOrDis (status) {
        let ListSelects = []
        for (let i = 0; i < this.dataListSelections.length; i++) {
          ListSelects.push(this.dataListSelections[i].id)
        }
        this.$http({
          url: this.$http.adornUrl('basic/basiccolor/activeOrDis/'),
          method: 'post',
          data: this.$http.adornData(
            {
              activeOrNot: status,
              ids: ListSelects
            },
            false
          )
        }).then(({ data }) => {
          this.getDataList()
        })
      }, 1000, {
        leading: true,
        trailing: false
      }
    ),

    // 获取数据列表
    getDataList (val) {
      if (val) {
        this.paginationData.currPage = val
      }
      this.dataListLoading = true
      this.$http({
        url: this.$http.adornUrl('basic/basiccolor/list'),
        method: 'get',
        params:
          this.searchData == undefined
            ? this.paginationData
            : Object.assign({}, this.paginationData, this.searchData)
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
    addOrUpdateHandle (id, type) {
      this.addOrUpdateVisible = true
      this.$nextTick(() => {
        this.$refs.addOrUpdate.init(id, type)
      })
    }
    // 删除
    // deleteHandle(id) {
    //   var ids = id
    //     ? [id]
    //     : this.dataListSelections.map(item => {
    //         return item.id;
    //       });
    //   this.$confirm(
    //     `确定要${id ? "删除" : "批量删除"}所选择的数据信息吗？`,
    //     "提示",
    //     {
    //       confirmButtonText: "确定",
    //       cancelButtonText: "取消",
    //       type: "warning"
    //     }
    //   ).then(() => {
    //     this.$http({
    //       url: this.$http.adornUrl("basic/basiccolor/delete"),
    //       method: "delete",
    //       data: this.$http.adornData(ids, false)
    //     }).then(({ data }) => {
    //       if (data && data.code === 0) {
    //         this.$message({
    //           message: "操作成功",
    //           type: "success",
    //           duration: 1500,
    //           onClose: () => {
    //             this.getDataList(1);
    //           }
    //         });
    //       } else {
    //         this.$message.error(data.msg);
    //       }
    //     });
    //   });
    // }
  }
}
</script>
