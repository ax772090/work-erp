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

      <!-- <el-form-item> -->
      <!-- <el-button v-if="isAuth('dict:dictcountry:save')" type="primary" @click="addOrUpdateHandle()"><i class="iconfont el-icon--left el-icon-erp-numpickerplus"></i>新增</el-button> -->
      <!-- <el-button v-if="isAuth('dict:dictcountry:delete')" type="danger" @click="deleteHandle()" :disabled="dataListSelections.length <= 0"><i class="iconfont el-icon--left erp-icon-shanchu"></i>批量删除</el-button> -->
      <!-- <el-button type="primary"><i class="iconfont el-icon--left el-icon-erp-icon"></i>树形展示</el-button> -->
      <!-- <el-button type="primary" @click="getDataList()"><i class="iconfont el-icon--left el-icon-erp-ERP_gengxin"></i>刷新</el-button> -->
      <!-- <el-button type="primary" @click="activeOrDis(status=false)"><i class="iconfont el-icon--left el-icon-erp-jinyong2"></i>禁用</el-button> -->
      <!-- <el-button type="primary" @click="activeOrDis(status=true)"><i class="iconfont el-icon--left el-icon-erp-jinyong2"></i>启用</el-button> -->
      <!-- </el-form-item> -->
    </el-form>
    <!-- @selection-change="selectionChangeHandle" -->
    <el-table :data="dataList"
              v-loading="dataListLoading"
              stripe>
      <el-table-column prop="nameEn"
                       header-align="center"
                       align="center"
                       label="英文名称"></el-table-column>
      <el-table-column prop="nameCn"
                       header-align="center"
                       align="center"
                       label="中文名称"></el-table-column>
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
import AddOrUpdate from './dictcountry-add-or-update'
import paginationAll from '@/components/erp-pagination/pagination-all'
import { initData } from '@/mixins/initData.js'
import { dictCountryList } from '@/api/basic/basic.js'
export default {
  mixins: [initData],
  components: {
    erpSearchPanel,
    AddOrUpdate,
    paginationAll
  },
  data () {
    return {
      // 数据过滤器
      searchData: {},
      // 下拉
      searchOptions: [
        {
          label: '国家',
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
    // 禁用功能
    // activeOrDis (status) {
    //   let ListSelects = []
    //   for (let i = 0; i < this.dataListSelections.length; i++) {
    //     ListSelects.push(this.dataListSelections[i].id)
    //   }
    //   this.$http({
    //     url: this.$http.adornUrl('dict/dictcountry/activeOrDis/'),
    //     method: 'post',
    //     data: this.$http.adornData(
    //       {
    //         activeOrNot: status,
    //         ids: ListSelects
    //       },
    //       false
    //     )
    //   }).then(({ data }) => {
    //     this.getDataList()
    //   })
    // },
    // 获取数据列表
    getDataList (val) {
      if (val) {
        this.paginationData.currPage = val
      }
      this.dataListLoading = true
      let requestData = Object.assign({}, this.paginationData, this.searchData === undefined ? {} : this.searchData)
      dictCountryList(requestData).then((data) => {
        this.dataList = data.pageList.dataList
        this.paginationData.totalCount = data.pageList.page.totalCount
        this.dataListLoading = false
      }).catch(() => {
        this.dataList = []
        this.paginationData.totalCount = 0
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
    }
    // 删除
    // deleteHandle (id) {
    //   var ids = id
    //     ? [id]
    //     : this.dataListSelections.map(item => {
    //         return item.id
    //       })
    //   this.$confirm(
    //     `确定要${id ? '删除' : '批量删除'}所选择的数据信息吗？`,
    //     '提示',
    //     {
    //       confirmButtonText: '确定',
    //       cancelButtonText: '取消',
    //       type: 'warning'
    //     }
    //   ).then(() => {
    //     this.$http({
    //       url: this.$http.adornUrl('dict/dictcountry/delete'),
    //       method: 'delete',
    //       data: this.$http.adornData(ids, false)
    //     }).then(({ data }) => {
    //       if (data && data.code === 0) {
    //         this.getDataList(1)
    //         this.$notify.success({
    //           title: '成功',
    //           message: '操作成功',
    //           duration: 5000
    //         })
    //       } else {
    //         this.$notify.error({
    //           title: '错误',
    //           message: data.msg,
    //           duration: 5000
    //         })
    //       }
    //     })
    //   })
    // }
  }
}
</script>
