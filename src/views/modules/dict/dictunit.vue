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
        <el-button v-if="isAuth('dict:dictunit:save')"
                   type="primary"
                   @click="addOrUpdateHandle('','canAdd')">
          <i class="iconfont erp-icon-xinzeng"></i>新增
        </el-button>
        <!-- <el-button
          v-if="isAuth('dict:dictunit:delete')"
          type="danger"
          @click="deleteHandle()"
          :disabled="dataListSelections.length <= 0"
        >
          <i class="iconfont el-icon--left erp-icon-shanchu"></i>批量删除
        </el-button>-->
        <!-- <el-button type="primary" @click="getDataList()"><i class="iconfont el-icon--left el-icon-erp-ERP_gengxin"></i>刷新</el-button> -->
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
    </el-form>
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
      <el-table-column prop="code"
                       label="单位编码"
                       sortable></el-table-column>
      <el-table-column prop="name"
                       label="单位名称"></el-table-column>
      <el-table-column prop="accuracy"
                       label="单位精度"
                       sortable></el-table-column>
      <el-table-column prop="remarks"
                       label="备注"></el-table-column>
      <el-table-column prop="bUsed"
                       label="是否使用">
        <template slot-scope="scope">
          <el-tag v-if="scope.row.bUsed == false"
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
            <i class="iconfont erp-icon-bianji"></i>
          </el-button>
          <!-- <el-button type="danger" size="small" circle @click="deleteHandle(scope.row.id)">
            <i class="iconfont erp-icon-shanchu"></i>
          </el-button>-->
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
import AddOrUpdate from './dictunit-add-or-update'
// 分页
import paginationAll from '@/components/erp-pagination/pagination-all'
import { initData } from '@/mixins/initData.js'
import { dictUnitList, dictUnitActiveOrDis } from '@/api/basic/basic.js'

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
          label: '计量单位名称',
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
    activeOrDis: _.debounce(
      async function activeOrDis (status) {
        let ListSelects = []
        for (let i = 0; i < this.dataListSelections.length; i++) {
          ListSelects.push(this.dataListSelections[i].id)
        }
        dictUnitActiveOrDis({
          activeOrNot: status,
          ids: ListSelects
        }).then(data => {
          this.getDataList()
          this.notifySuccess('操作成功')
        }).catch(e => {
          this.notifyError(e.data.msg)
        })
      }, 1000, {
        leading: true,
        trailing: false
      }
    ),

    // 获取数据列表
    getDataList (val) {
      if (val != undefined) {
        this.paginationData.currPage = val
      }
      this.dataListLoading = true
      let requestData = Object.assign({}, this.paginationData, this.searchData === undefined ? {} : this.searchData)
      dictUnitList(requestData).then((data) => {
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
    addOrUpdateHandle (id, type) {
      this.addOrUpdateVisible = true
      this.$nextTick(() => {
        this.$refs.addOrUpdate.init(id, type)
      })
    }
    // 删除
    // deleteHandle (id) {
    //   var ids = id
    //     ? [id]
    //     : this.dataListSelections.map(item => {
    //       return item.id
    //     })
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
    //       url: this.$http.adornUrl('dict/dictunit/delete'),
    //       method: 'delete',
    //       data: this.$http.adornData(ids, false)
    //     }).then(({ data }) => {
    //       if (data && data.code === 0) {
    //         this.getDataList(1)
    //         this.$notify.success({
    //           title: '成功',
    //           message: '操作成功',
    //           duration: 500
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
