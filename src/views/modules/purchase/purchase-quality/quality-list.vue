<!-- 采购质检（主表） -->
<template>
  <div class="mod-config">
    <el-form :inline="true"
             :model="dataForm"
             @keyup.enter.native="getDataList()">
      <el-row>
        <erp-search-panel v-model="searchData"
                          :searchOptions="searchOptions"
                          @search="getDataList(1)"
                          :isResetHandle="true"
                          @resetHandle="resetHandle()" />
      </el-row>
      <el-row>
        <label>业务状态:</label>
        <el-radio-group :radioListData='statusList'
                        v-model="status"
                        @change="qualityAll"></el-radio-group>
      </el-row>
      <el-row>
        <el-button type="danger"
                   @click="deleteHandle()"
                   v-if="isAuth('qc:qcinspection:delete')"
                   :disabled="isDeleteHandle">
          <i class="iconfont erp-icon-shanchu"></i>删除
        </el-button>
      </el-row>
    </el-form>

    <el-table stripe
              border
              highlight-current-row
              max-height="800"
              :data="dataList"
              v-loading="dataListLoading"
              @expand-change="rowExpand"
              @selection-change="selectionChangeHandle">
      <el-table-column type="selection"
                       width="50"
                       align="center"
                       header-align="center"></el-table-column>
      <el-table-column type="expand"
                       fixed
                       label="展开"
                       width="50"
                       align="center"
                       header-align="center">
        <template slot-scope="scope">
          <el-table :data="scope.row.tableDataExpand">
            <el-table-column prop="poCode"
                             label="采购订单号"
                             sortable></el-table-column>
            <el-table-column prop="supplierName"
                             label="供应商名称"></el-table-column>
            <el-table-column prop="prodCode"
                             label="产品编码"></el-table-column>
            <el-table-column prop="prodName"
                             label="产品名称"></el-table-column>
            <el-table-column prop="qty"
                             label="质检数量"
                             sortable></el-table-column>
            <el-table-column prop="qualifiedQty"
                             label="合格数量"
                             sortable></el-table-column>
            <el-table-column prop="defectiveQty"
                             label="不合格数量"
                             sortable></el-table-column>
            <el-table-column prop="defectiveStrategyName"
                             label="不合格使用决策"></el-table-column>
          </el-table>
        </template>
      </el-table-column>
      <el-table-column label="检验单号"
                       prop="code"
                       @click.native="seacher(id)"
                       id="table"
                       sortable>
        <template slot-scope="scope">
          <a @click="seacher(scope.row.id,'canCheck')"
             class="a-click-hover">{{scope.row.code}}</a>
        </template>
      </el-table-column>
      <el-table-column label="业务状态"
                       prop="statusName"></el-table-column>
      <el-table-column label="质检日期"
                       prop="date"
                       sortable></el-table-column>
      <el-table-column label="质检员"
                       prop="userName"></el-table-column>
      <el-table-column label="确认人"
                       prop="confirmUserName"
                       sortable></el-table-column>
      <el-table-column label="确认时间"
                       prop="confirmTime"
                       sortable></el-table-column>
      <el-table-column fixed="right"
                       header-align="center"
                       width="80"
                       label="操作">
        <template slot-scope="scope">
          <el-dropdown :show-timeout="20">
            <span class="el-dropdown-link">操作
              <i class="el-icon-arrow-down el-icon--right"></i>
            </span>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item :disabled="!(scope.row.status == statusOption[1].key)"
                                v-if="isAuth('qc:qcinspection:update')"
                                command="update"
                                @click.native="addOrEditProductDev(scope.row.id,'canEdit')">编辑</el-dropdown-item>
              <el-dropdown-item :disabled="!(scope.row.status == statusOption[1].key)"
                                v-if="isAuth('qc:qcinspection:inspectionConfirm')"
                                command="confirm"
                                @click.native="qualityConfirm(scope.row.id)">质检确认</el-dropdown-item>
              <el-dropdown-item :disabled="!(scope.row.status == statusOption[0].key)"
                                v-if="isAuth('qc:qcinspection:revoke')"
                                command="revoke"
                                @click.native="qualityRevoke(scope.row.id)">撤销确认</el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页 -->
    <el-row>
      <pagination-all v-model="paginationData"
                      @paginationChangeHandle="getDataList"></pagination-all>
    </el-row>
    <!-- 弹窗, 新增 / 修改 -->
    <quality-editor ref="qualityEditor"
                    @refreshDataList="getDataList"></quality-editor>
  </div>
</template>
<script>
// 搜索
import erpSearchPanel from '@/components/erp-search-panel'
// 分页
import paginationAll from '@/components/erp-pagination/pagination-all'
import qualityEditor from './quality-editor'
import { initData } from '@/mixins/initData.js'
// 引入radio组件
import elRadioGroup from '@/components/erp-radio/radio-all'
export default {
  mixins: [initData],
  components: {
    erpSearchPanel,
    paginationAll,
    qualityEditor,
    elRadioGroup
  },
  data () {
    return {
      isclick: false,
      status: '',
      isDeleteHandle: false, // 删除控制
      searchData: {},
      statusList: [],   // 检验状态
      statusOption: [{
        key: '01',
        value: '质检完成'
      }, {
        key: '02',
        value: '质检开始'
      }],
      // 下拉
      searchOptions: [
        {
          label: '采购订单号',
          value: 'poCode',
          inputType: 'el-input'
        },
        {
          label: '产品编码',
          value: 'prodCode',
          inputType: 'el-input'
        },
        {
          label: '产品名称',
          value: 'prodName',
          inputType: 'el-input'
        },
        {
          label: '质检单号',
          value: 'code',
          inputType: 'el-input'
        },
        {
          label: '质检员',
          value: 'userId',
          inputType: 'el-select-remote',
          httpUrl: '/list/search/user',
          queryKey: 'name',
          dataSource: 'list',
          title: 'devUserList',
          dataValue: 'id',
          dataLabel: 'name',
          placeholder: '质检员'
        }
      ],
      dataForm: {
        id: '',
        code: '',
        dictBizStatusValue: '',
        detpName: '',
        userName: '',
        channelName: '',
        sellerSkuId: '',
        channelSku: '',
        prodCode: '',
        nameCh: '',
        warehouseName: '',
        allStock: '',
        expectDate: ''
      },
      tableData: [],
      dataList: [],
      dataListLoading: false,
      dataListSelections: [],
      editorVisible: false,
      tableDataExpand: [] // 展开行
    }
  },

  created () {
    this.getDataList()
    this.selectionChangeHandle([])
    // 检验状态
    this.$http
      .get(this.$http.adornUrl('basicData/queryDataDict2List'), {
        params: { dataDictKey: 'INSPECTION_BIZ_STATUS' }
      })
      .then(({ data }) => {
        this.statusList = data.fontMaps
        this.statusList.unshift({ key: '', value: '全部' })
      })
  },
  methods: {
    // 展开行
    rowExpand (row) {
      this.getDetailData(row)
    },
    // 获取展开行数据新
    getDetailData (mainData) {
      this.$http({
        url: this.$http.adornUrl(`qc/qcinspection/info/${mainData.id}`),
        method: 'get'
      }).then(({ data }) => {
        if (data && data.code === 0) {
          this.$set(
            mainData,
            'tableDataExpand',
            data.inspectionDto.inspectionDetail
          )
        } else {
          this.$notify.error({
            title: '错误',
            message: data.msg,
            duration: 5000
          })
        }
      })
    },
    // 编辑
    addOrEditProductDev (id, type) {
      this.$nextTick(() => {
        this.$refs.qualityEditor.init(id, type)
      })
      this.editorVisible = true
    },

    // 获取数据列表
    getDataList (val) {
      if (val) {
        this.paginationData.currPage = val
      }
      let searchValue
      if (this.searchData) {
        searchValue = Object.assign({}, searchValue, this.searchData)
      }

      if (this.status) {
        searchValue = Object.assign({}, searchValue, { status: this.status })
      }

      this.dataListLoading = true
      this.$http({
        url: this.$http.adornUrl('qc/qcinspection/list'),
        method: 'get',
        params: Object.assign({}, this.paginationData, searchValue)
      }).then(({ data }) => {
        if (data && data.code === 0) {
          this.dataList = data.pageList.dataList
          this.paginationData.totalCount = data.pageList.page.totalCount
          // 初始化，防止点击展开行立马收缩起来
          for (let i = 0; i < this.dataList.length; i++) {
            this.$set(this.dataList[i], 'tableDataExpand', [])
          }
        } else {
          this.paginationData.totalCount = 0
        }
        this.dataListLoading = false
      })
    },

    // 采购质检单查看
    seacher (id, type) {
      this.editorVisible = true
      this.$nextTick(() => {
        this.$refs.qualityEditor.init(id, type)
      })
    },
    // 多选
    selectionChangeHandle (val) {
      this.dataListSelections = val
      if (this.dataListSelections.length <= 0) {
        this.isDeleteHandle = true
        return
      } else {
        this.isDeleteHandle = false
      }
      for (var i = 0; i < this.dataListSelections.length; i++) {
        // 删除
        if (!(this.dataListSelections[i].statusName === '质检开始')) {
          this.isDeleteHandle = true
        }
      }
    },
    // 删除
    deleteHandle (id) {
      var ids = id
        ? [id]
        : this.dataListSelections.map(item => {
          return item.id
        })
      this.$confirm(
        `确定要${id ? '删除' : '批量删除'}所选择的数据信息吗？${
        id ? '[id=' + ids.join(',') + ']' : ''
        }`,
        '提示',
        {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }
      ).then(() => {
        this.$http({
          url: this.$http.adornUrl('qc/qcinspection/delete'),
          method: 'delete',
          data: this.$http.adornData(ids, false)
        }).then(({ data }) => {
          if (data && data.code === 0) {
            this.getDataList(1)
            this.$notify.success({
              title: '成功',
              message: '删除成功',
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
    },

    qualityAll (value) {
      this.status = value
      this.getDataList(1)
    },

    resetHandle () {
      this.status = ''
    },

    // 质检确认
    qualityConfirm: _.debounce(
      async function qualityConfirm (id) {
        this.$http({
          url: this.$http.adornUrl('qc/qcinspection/inspectionConfirm'),
          method: 'post',
          data: id
        }).then(({ data }) => {
          if (data && data.code === 0) {
            this.getDataList()
            this.$notify.success({
              title: '成功',
              message: '确认成功',
              duration: 5000
            })
          } else {
            this.$notify.error({
              title: '错误',
              message: data.msg,
              duration: 5000
            })
          }
          this.dataListLoading = false
        })
      }, 1000, {
        leading: true,
        trailing: false
      }
    ),

    // 质检撤销
    qualityRevoke: _.debounce(
      async function qualityRevoke (id) {
        this.$http({
          url: this.$http.adornUrl('qc/qcinspection/revoke'),
          method: 'post',
          data: id
        }).then(({ data }) => {
          if (data && data.code === 0) {
            this.getDataList()
            this.$notify.success({
              title: '成功',
              message: '撤销成功',
              duration: 5000
            })
          } else {
            this.$notify.error({
              title: '错误',
              message: data.msg,
              duration: 5000
            })
            this.paginationData.totalCount = 0
          }
          this.dataListLoading = false
        })
      }, 1000, {
        leading: true,
        trailing: false
      }
    )
  }
}
</script>

