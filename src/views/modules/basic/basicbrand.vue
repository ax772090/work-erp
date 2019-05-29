<template>
  <div>
    <el-row>
      <erp-search-panel v-model="searchData"
                        :searchOptions="searchOptions"
                        @search="getDataList(1)"></erp-search-panel>
    </el-row>
    <el-row>
      <el-button v-if="isAuth('basic:basicbrand:save')"
                 type="primary"
                 @click="addOrUpdateHandle('','canAdd')">
        <i class="iconfont erp-icon-xinzeng"></i>新增
      </el-button>
      <!-- <el-button
          v-if="isAuth('basic:basicbrand:delete')"
          type="danger"
          @click="deleteHandle()"
          :disabled="dataListSelections.length <= 0">
          <i class="iconfont erp-icon-piliangshanchu"></i>批量删除
        </el-button>-->
      <el-button type="primary"
                 @click="activeOrDis(status=false)"
                 :disabled="dataListSelections.length <= 0">
        <i class="iconfont erp-icon-jinyong"></i>禁用
      </el-button>
      <el-button type="primary"
                 @click="activeOrDis(status=true)"
                 :disabled="dataListSelections.length <= 0">
        <i class="iconfont erp-icon-qiyong"></i>启用
      </el-button>
    </el-row>
    <el-table :data="dataList"
              v-loading="dataListLoading"
              stripe
              border
              highlight-current-row
              @selection-change="selectionChangeHandle">
      <el-table-column type="selection"
                       align="center"
                       header-align="center"
                       width="50"></el-table-column>
      <el-table-column prop="name"
                       label="品牌名称">
      </el-table-column>
      <el-table-column prop="logo"
                       label="品牌logo">
        <template slot-scope="scope">
          <tableImg :imageUrl='scope.row.logos.url'></tableImg>
        </template>
      </el-table-column>
      <el-table-column prop="addUserEntity.username"
                       label="创建人">
      </el-table-column>
      <el-table-column prop="addTime"
                       label="创建时间"></el-table-column>
      <el-table-column prop="bUsed"
                       label="是否使用">
        <template slot-scope="scope">
          <el-tag :type="scope.row.bUsed === false ? 'danger' : '' ">{{scope.row.bUsed === false ? '禁用' : '正常'}}</el-tag>
        </template>
      </el-table-column>
      <el-table-column fixed="right"
                       width="80"
                       label="操作">
        <template slot-scope="scope">
          <el-button type="primary"
                     circle
                     title="编辑"
                     @click="addOrUpdateHandle(scope.row.id,'canEdit')">
            <i class="iconfont erp-icon-bianji"></i>
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
// 搜索
import erpSearchPanel from '@/components/erp-search-panel'
// 分页
import paginationAll from '@/components/erp-pagination/pagination-all'
// 引入图片
import tableImg from '@/components/list-table/table-img'

import AddOrUpdate from './basicbrand-add-or-update'
import { initData } from '@/mixins/initData.js'

export default {
  mixins: [initData],
  components: {
    erpSearchPanel,
    paginationAll,
    tableImg,
    AddOrUpdate
  },
  data () {
    return {
      // 数据过滤器
      searchData: {},
      headerSearch: '',
      // 下拉
      searchOptions: [
        {
          label: '品牌名称',
          value: 'name',
          inputType: 'el-input'
        }
      ],

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
    // 获取数据列表
    getDataList (val) {
      if (val !== undefined) {
        this.paginationData.currPage = val
      }
      this.dataListLoading = true
      this.$http({
        url: this.$http.adornUrl('basic/basicbrand/list'),
        method: 'get',
        params: this.searchData === undefined ? this.paginationData : Object.assign({}, this.paginationData, this.searchData)
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
    },

    // 禁用功能
    activeOrDis: _.debounce(
      async function activeOrDis (status) {
        let ListSelects = []
        for (let i = 0; i < this.dataListSelections.length; i++) {
          ListSelects.push(this.dataListSelections[i].id)
        }
        this.$http({
          url: this.$http.adornUrl('basic/basicbrand/activeOrDis/'),
          method: 'post',
          data: this.$http.adornData(
            {
              activeOrNot: status,
              ids: ListSelects
            },
            false
          )
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
      }, 1000, {
        leading: true,
        trailing: false
      }
    )

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
    //       url: this.$http.adornUrl("basic/basicbrand/delete"),
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
