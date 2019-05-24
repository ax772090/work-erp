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
        <el-button v-if="isAuth('dict:dictcity:save')"
                   type="primary"
                   @click="addOrUpdateHandle('','canAdd')">
          <i class="iconfont erp-icon-xinzeng"></i>新增
        </el-button>
        <!-- <el-button v-if="isAuth('dict:dictcity:delete')"
                   type="danger"
                   @click="deleteHandle()"
        :disabled="dataListSelections.length <= 0"><i class="iconfont el-icon--left erp-icon-shanchu"></i>批量删除</el-button>-->
        <!-- <el-button type="primary" @click="getDataList()"><i class="iconfont el-icon--left el-icon-erp-ERP_gengxin"></i>刷新</el-button> -->
        <!-- <el-button type="primary" @click="activeOrDis(status=false)"><i class="iconfont el-icon--left el-icon-erp-jinyong2"></i>禁用</el-button> -->
        <!-- <el-button type="primary" @click="activeOrDis(status=true)"><i class="iconfont el-icon--left el-icon-erp-jinyong2"></i>启用</el-button> -->
        <!-- <el-button type="primary"><i class="iconfont el-icon--left el-icon-erp-ERP_gengxin"></i>导入</el-button>
        <el-button type="primary"><i class="iconfont el-icon--left el-icon-erp-ERP_gengxin"></i>导出</el-button>-->
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
      <el-table-column prop="countryName"
                       label="所属国家"></el-table-column>
      <el-table-column prop="name"
                       label="城市名称"></el-table-column>
      <el-table-column prop="addUser"
                       label="创建人"></el-table-column>
      <el-table-column prop="addTime"
                       label="创建时间"
                       sortable></el-table-column>
      <el-table-column fixed="right"
                       width="80"
                       label="操作">
        <template slot-scope="scope">
          <el-button type="primary"
                     size="small"
                     circle
                     title="编辑"
                     @click="addOrUpdateHandle(scope.row.id,'canEdit')">
            <i class="iconfont erp-icon-bianji"></i>
          </el-button>
          <!-- <el-button type="danger"
                     size="small"
                     circle
          @click="deleteHandle(scope.row.id)"><i class="iconfont erp-icon-shanchu"></i></el-button>-->
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
import AddOrUpdate from './dictcity-add-or-update'
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
          label: '所属国家',
          value: 'belong_country',
          inputType: 'el-input'
        },
        {
          label: '城市名称',
          value: 'name',
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
    // 获取选中的下拉数据
    searchOptionsChange (data) {
      this.searchTF = false
    },
    // 输入搜索内容的获取
    SearchHandleSelect (data) {
    },
    // 禁用功能
    // activeOrDis(status) {
    //   let ListSelects = []
    //   for(let i = 0; i<this.dataListSelections.length; i++){
    //     ListSelects.push(this.dataListSelections[i].id)
    //   }
    //   this.$http({
    //     url: this.$http.adornUrl('dict/dictcity/activeOrDis/'),
    //     method: 'post',
    //     data: this.$http.adornData({
    //       'activeOrNot': status,
    //       'ids': ListSelects,
    //     }, false)
    //   }).then(({data}) => {
    //     this.getDataList()
    //   })
    // },
    // 获取数据列表
    getDataList (val) {
      if (val != undefined) {
        this.paginationData.currPage = val
      }
      this.dataListLoading = true
      this.$http({
        url: this.$http.adornUrl('dict/dictcity/list'),
        method: 'get',
        params:
          this.searchData == undefined
            ? this.paginationData
            : Object.assign({}, this.paginationData, this.searchData)
      }).then(({ data }) => {
        if (data && data.code === 0) {
          // 这里为了解决全部删除第二页数据后，返回到第一页却没有拿到第一页数据的问题
          if (
            data.pageList.dataList.length === 0 &&
            this.paginationData.currPage != 1
          ) {
            this.paginationData.currPage -= 1
            this.getDataList()
          } else {
            this.dataList = data.pageList.dataList
            this.paginationData.totalCount = data.pageList.page.totalCount
          }
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
      ).then(() => {
        this.$http({
          url: this.$http.adornUrl('dict/dictcity/delete'),
          method: 'delete',
          data: this.$http.adornData(ids, false)
        }).then(({ data }) => {
          if (data && data.code === 0) {
            this.getDataList(1)
            this.$notify.success({
              title: '成功',
              message: '操作成功',
              duration: 5000
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
    }
  }
}
</script>
