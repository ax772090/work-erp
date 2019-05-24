<template>
  <div class="mod-config">
    <el-form :inline="true"
             :model="dataForm"
             @keyup.enter.native="getDataList()">
      <el-row>
        <erp-search-panel v-model="searchData"
                          :searchOptions="searchOptions"
                          @search="getDataList(1)"></erp-search-panel>
      </el-row>
      <el-row>
        <el-button type="primary"
                   v-if="isAuth('prod:proddevbasic:save')"
                   @click="addOrEditProductDev('', 'canAdd')">新品开发</el-button>
        <el-button type="danger"
                   v-if="isAuth('prod:proddevbasic:delete')"
                   :disabled="isDeleteProductDev"
                   @click="deleteProductDev()"><i class="iconfont erp-icon-shanchu"></i>删除</el-button>
        <!-- <el-button type="primary"
                   :disabled="isbatchReview"
                   v-if="isAuth('proddev:activiti:approval')"
                   @click="batchReview()"><i class="iconfont erp-icon-piliangshenhe"></i>批量审核</el-button> -->
      </el-row>
    </el-form>
    <el-table :data="dataList"
              stripe
              border
              highlight-current-row
              v-loading="dataListLoading"
              @selection-change="selectionChangeHandle">
      <el-table-column fixed
                       align="center"
                       type="selection"
                       header-align="center"
                       width="50"></el-table-column>
      <el-table-column prop="prodCode"
                       sortable
                       label="单据编号">
        <template slot-scope="scope">
          <a @click="addOrEditProductDev(scope.row.id, 'canCheck', scope.row)"
             class="a-click-hover">{{scope.row.prodCode}}</a>
        </template>

      </el-table-column>
      <el-table-column prop="imageId"
                       label="产品图片"
                       width="120">
        <template slot-scope="scope">
          <tableImg :imageUrl='scope.row.imageUrl'></tableImg>
        </template>
      </el-table-column>
      <!-- 引入图片 -->
      <el-table-column prop="nameCh"
                       label="产品名称"></el-table-column>
      <el-table-column prop="sourceName"
                       label="所属来源"></el-table-column>
      <el-table-column prop="brandName"
                       label="所属品牌"></el-table-column>
      <el-table-column prop="specifications"
                       label="规格型号"></el-table-column>
      <el-table-column prop="categoryName"
                       label="产品分类"></el-table-column>
      <el-table-column prop="bAssemble"
                       label="是否组合产品">
        <template slot-scope="scope">
          <el-tag v-if="scope.row.bAssemble == false"
                  size="small"
                  type="danger">否</el-tag>
          <el-tag v-else
                  size="small">是</el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="statusName"
                       label="数据状态">
        <template slot-scope="scope">
          <a @click="approveDetailHandle(scope.row.id,scope.row)"
             class="a-click-hover">{{scope.row.statusName}}</a>
          <div v-if="scope.row.status == '02'">({{scope.row.nodeName}})</div>
        </template>
      </el-table-column>
      <el-table-column prop="addTime"
                       sortable
                       label="创建时间"></el-table-column>
      <el-table-column prop="userName"
                       label="开发人员"></el-table-column>
      <el-table-column prop="devRemarks"
                       label="开发备注"></el-table-column>
      <el-table-column prop="description"
                       label="产品详细描述"></el-table-column>
      <el-table-column fixed="right"
                       width="80"
                       label="操作">
        <template slot-scope="scope">
          <el-dropdown :show-timeout="20">
            <span class="el-dropdown-link">
              操作
              <i class="el-icon-arrow-down el-icon--right"></i>
            </span>
            <el-dropdown-menu slot="dropdown">
              <!-- 未审核,审核中,已审核,已撤销 -->
              <el-dropdown-item command="addOrEditProductDev"
                                v-if="isAuth('prod:proddevbasic:update')"
                                :disabled="!(scope.row.status === '01' || scope.row.status === '04')"
                                @click.native="addOrEditProductDev(scope.row.id, 'canEdit', scope.row)">编辑</el-dropdown-item>
              <el-dropdown-item command="submitProductDev"
                                v-if="isAuth('prod:proddevbasic:submit')"
                                :disabled="!(scope.row.status === '01' || scope.row.status === '04')"
                                @click.native="submitProductDev(scope.row)">提交</el-dropdown-item>
              <el-dropdown-item command="approveProductDev"
                                v-if="isAuth('prod:proddevbasic:approval')"
                                :disabled="!(scope.row.status === '02')"
                                @click.native="addOrEditProductDev(scope.row.id, 'canApproval', scope.row)">审核</el-dropdown-item>
              <!-- @click.native="approveProductDev(scope.row.id, 'canApproval', scope.row)">审核</el-dropdown-item> -->
              <el-dropdown-item command="revocationProductDev"
                                v-if="isAuth('prod:proddevbasic:revoke')"
                                :disabled="!(scope.row.status === '03')"
                                @click.native="revocationProductDev(scope.row.id, 'canUndone', scope.row)">撤销</el-dropdown-item>
              <el-dropdown-item command="deleteProductDev"
                                v-if="isAuth('prod:proddevbasic:delete')"
                                :disabled="!(scope.row.status === '01' || scope.row.status === '04')"
                                @click.native="deleteProductDev(scope.row.id)">删除</el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页 -->
    <el-row>
      <pagination-all v-model="paginationData"
                      @paginationChangeHandle="getDataList()"></pagination-all>
    </el-row>
    <!-- 弹窗, 新增 / 修改 -->
    <proddev-tabs v-if="proddevTabVisible"
                  ref="proddevTabs"
                  @refreshDataList="getDataList()"></proddev-tabs>
    <!-- 审核弹窗 -->
    <approval ref="approval"
              @approval="getDataList()"></approval>
    <!-- 审核弹窗(新) -->
    <approval-dialog ref="approvalDialog"
                     @approval="getDataList()"></approval-dialog>
    <!-- 弹窗, 审批详情 -->
    <approval-detaile v-if="approvalDetaileVisible"
                      ref="approvalDetaile"></approval-detaile>
  </div>
</template>

<script>
// 分页
import paginationAll from '@/components/erp-pagination/pagination-all'
// 引入图片
import tableImg from '@/components/list-table/table-img'
// 搜索
import erpSearchPanel from '@/components/erp-search-panel'
import proddevTabs from './proddev-tabs'
import approval from '@/components/workflow/approval'
// 审批详情
import approvalDetaile from '@/components/workflow/approval-detaile'
import approvalDialog from '@/components/workflow/approval-dialog'
import Bus from '@/components/js/bus.js'
import { initData } from '@/mixins/initData.js'
// 消息中心跳转
import { getUrl, getRequest } from '@/utils'

export default {
  mixins: [initData],
  components: {
    erpSearchPanel,
    proddevTabs,
    paginationAll,
    approval,
    approvalDialog,
    approvalDetaile,
    tableImg
  },

  data () {
    return {
      // 审批详情
      approvalDetaileVisible: false,
      // 数据过滤器
      searchData: {},

      // 过滤选项
      searchOptions: [{
        label: '审核状态',
        value: 'status',
        inputType: 'el-select',

        httpUrl: '/basicData/queryDataDict2List',
        requestParams: { dataDictKey: 'APPROVAL_STATUS' },
        dataSource: 'fontMaps',
        title: '审核状态',
        dataValue: 'key',
        dataLabel: 'value',
        placeholder: '审核状态'
      }, {
        label: '产品名称',
        value: 'nameCh',
        inputType: 'el-input'
      }, {
        label: '产品分类',
        value: 'categoryId',
        inputType: 'el-cascader',

        httpUrl: 'basic/basiccategory/treeList',
        requestParams: { id: '' },
        dataSource: 'treeList',
        title: 'categoryList',
        dataValue: 'id',
        dataLabel: 'name',
        dataChildren: 'subCategoryNode',
        placeholder: '所属分类'
      }, {
        label: '单据编号',
        value: 'code',
        inputType: 'el-input'
      }, {
        label: '所属品牌',
        value: 'brandId',
        inputType: 'el-select',

        httpUrl: '/basic/basicbrand/listcombobox',
        dataSource: 'list',
        title: 'brandList',
        dataValue: 'id',
        dataLabel: 'name',
        placeholder: '所属品牌'
      }, {
        label: '开发人员',
        value: 'devUserId',
        inputType: 'el-select-remote',

        httpUrl: '/list/search/user',
        queryKey: 'name',
        dataSource: 'list',
        title: 'devUserList',
        dataValue: 'id',
        dataLabel: 'name',
        placeholder: '开发人员'
      }, {
        label: '是否是组合产品',
        value: 'bAssemble',
        inputType: 'el-select',

        dataList: [{ id: 1, name: '是' }, { id: 0, name: '否' }],
        title: 'bAssemble',
        dataValue: 'id',
        dataLabel: 'name',
        placeholder: '所在国家'
      }, {
        label: '规格型号',
        value: 'specifications',
        inputType: 'el-input'
      }],

      // 批量修改
      statusModificationVisible: false,
      // 批量删除
      isDeleteProductDev: false,
      // 是否禁用
      searchTF: true,
      // 发送批量禁用启用的数据
      searchTFs: {},
      dataForm: {},

      dataList: [],
      dataListLoading: false,
      dataListSelections: [],
      proddevTabVisible: false,
      request: {},
      isbatchReview: true   // 批量审核
    }
  },

  created () {
    this.request = getRequest()
    if (this.request.taskId) {
      delete this.request['urlPath']
      this.getDataList(1, 'route', this.request)
    } else {
      this.getDataList()
    }

    this.selectionChangeHandle([])
  },
  mounted () {
    Bus.$on('prodDevTabsChildren', msg => {
      this.getDataList()
    })
  },
  methods: {
    getDataList (val, type, searchObj) {
      if (val) {
        this.paginationData.currPage = 1
      }
      let searchValue = {}
      if (type === 'route') {
        searchValue = Object.assign({}, searchObj)
        this.searchData = {}
      }
      this.$http({
        url: this.$http.adornUrl('prod/proddevbasic/list'),
        method: 'post',
        data: Object.assign({}, this.paginationData, this.searchData === undefined ? {} : this.searchData, searchValue)
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

    // 批量修改状态
    statusModificationHandle () {
      let status = []
      for (let i = 0; i < this.dataListSelections.length; i++) {
        status.push(this.dataListSelections[i].id)
      }
      this.statusModificationVisible = true
      this.$nextTick(() => {
        this.$refs.statusModification.init(status)
      })
    },

    // 新增 / 修改
    addOrEditProductDev (id, type, row) {
      this.proddevTabVisible = true
      this.$nextTick(() => {
        this.$refs.proddevTabs.init(id, type, row)
      })
    },

    // 每列的查看
    queryHandleClick (row) {
    },

    // 多选
    selectionChangeHandle (val) {
      this.dataListSelections = val
      if (this.dataListSelections.length <= 0) {
        this.isDeleteProductDev = true
        this.isbatchReview = true
        return
      } else {
        this.isDeleteProductDev = false
      }
      for (var i = 0; i < this.dataListSelections.length; i++) {
        // 批量删除
        if (!(this.dataListSelections[i].status === '01' || this.dataListSelections[i].status === '04')) {
          this.isDeleteProductDev = true
        }
      }
      // 批量审批
      this.dataListSelections.every((item, index, arr) => {
        return (arr[0].node === arr[index].node && arr[index].node)
      }) ? (this.isbatchReview = false)
        : (this.isbatchReview = true)
    },

    // 批量审核
    // batchReview () {
    //   for (let i = 0; i < this.dataListSelections.length; i++) {
    //     this.$set(this.dataListSelections[i], 'code', this.dataListSelections[i].prodCode)
    //     this.$set(this.dataListSelections[i], 'businessId', this.dataListSelections[i].id)
    //     this.$set(this.dataListSelections[i], 'variablesMap', { dictBizStatus: this.dataListSelections[i].dictBizStatus })
    //     this.$set(this.dataListSelections[i], 'routeUrl', getUrl())
    //     this.$set(this.dataListSelections[i], 'docName', '新品开发单')
    //     // delete this.dataListSelections[i].id
    //   }
    //   this.$nextTick(() => {
    //     this.$refs.approvalDialog.init(
    //       this.dataListSelections, 'batchReview')
    //   })
    // },
    // 提交
    submitProductDev: _.debounce(
      async function submitProductDev (row) {
        this.$http({
          url: this.$http.adornUrl('prod/proddevbasic/submit'),
          method: 'post',
          data: {
            businessId: row.id,
            routeUrl: getUrl(),
            code: row.prodCode,
            docName: '新品开发单'
          }
        }).then(({ data }) => {
          if (data && data.code === 0) {
            this.getDataList()
            this.$notify.success({
              message: '提交成功',
              duration: 5000
            })
          } else {
            this.$notify.error({
              message: '提交失败:' + data.msg,
              duration: 5000
            })
          }
        })
      }, 1000, {
        leading: true,
        trailing: false
      }
    ),

    // 审核
    approveProductDev (id, type, row) {
      let isShowNode2 = true
      if (row.node && row.node === 'T01') {
        isShowNode2 = false
      }
      this.$nextTick(() => {
        this.$refs.approvalNew.init(row.id, type, {
          taskId: row.taskId,
          node: row.node,
          processKey: 'prod_dev_basic',
          businessId: row.id,
          operation: '1',

          routeUrl: getUrl(),
          code: row.prodCode,
          docName: '新品开发单',
          comments: '',
          isShowNode2: isShowNode2
        })
      })
    },

    // 审批详情
    approveDetailHandle (id, row) {
      this.approvalDetaileVisible = true
      this.$nextTick(() => {
        this.$refs.approvalDetaile.init(id, row)
      })
    },

    // 撤销
    revocationProductDev: _.debounce(
      async function revocationProductDev (id) {
        this.$http({
          url: this.$http.adornUrl('prod/proddevbasic/revoke'),
          method: 'get',
          params: { id: id }
        }).then(({ data }) => {
          if (data && data.code === 0) {
            this.getDataList()
            this.$notify.success({
              message: '撤销成功',
              duration: 5000
            })
          } else {
            this.$notify.error(data.msg)
          }
        })
      }, 1000, {
        leading: true,
        trailing: false
      }
    ),

    // 删除
    deleteProductDev (id) {
      var ids = id ? [id] : this.dataListSelections.map(item => { return item.id })
      if (ids.length < 1) {
        this.$notify.error('未选择任何记录')
        return
      }
      this.$confirm(`确定要${id ? '删除' : '批量删除'}所选择的新品信息吗？`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }
      ).then(() => {
        this.$http({
          url: this.$http.adornUrl('prod/proddevbasic/delete'),
          method: 'delete',
          data: this.$http.adornData(ids, false)
        }).then(({ data }) => {
          if (data && data.code === 0) {
            this.getDataList(1)
            this.$notify.success({
              message: '删除成功',
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
    },

    getImageUrl (urlPath) {
      if (!urlPath) {
        return ''
      }
      return this.$http.adornUrl(urlPath)
    }
  },
  watch: {
    '$route' (to, from) {
      let urlData = getRequest()
      if (urlData.taskId && urlData.urlPath === '/product-proddev/proddev-list') {
        delete urlData['urlPath']
        this.getDataList(1, 'route', urlData)
      }
    },
    deep: true,
    immediate: true
  }
}
</script>
