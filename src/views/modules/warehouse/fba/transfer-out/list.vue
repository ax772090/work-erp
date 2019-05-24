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
    </el-form>

    <el-table :data="dataList"
              v-loading="dataListLoading"
              @expand-change="rowExpand"
              @selection-change="selectionChangeHandle">
      <el-table-column type="expand"
                       header-align="center"
                       align="center"
                       label="展开"
                       width="50">
        <template slot-scope="scope">
          <el-table :data="scope.row.tableDataExpand">
            <el-table-column prop="imageUrl"
                             label="产品图片"
                             width="120">
              <template slot-scope="scope">
                <tableImg :imageUrl='scope.row.imageUrl'></tableImg>
              </template>
            </el-table-column>
            <el-table-column prop="prodCode"
                             label="产品编码"></el-table-column>
            <el-table-column prop="prodName"
                             label="产品名称"></el-table-column>
            <el-table-column prop="fromWarehouseId"
                             label="调出仓库">
              <template slot-scope="scope">
                <el-select v-model="scope.row.fromWarehouseId"
                           placeholder="请选择调出仓库"
                           disabled>
                  <el-option v-for="item in fromWarehouseIdOptions"
                             :key="item.id"
                             :label="item.name"
                             :value="item.id">
                  </el-option>
                </el-select>
              </template>
            </el-table-column>
            <el-table-column prop="qty"
                             sortable
                             label="调出数量"></el-table-column>
            <el-table-column prop="toWarehouseId"
                             label="调入仓库">
              <template slot-scope="scope">
                <el-select v-model="scope.row.toWarehouseId"
                           placeholder="请选择调入仓库"
                           disabled>
                  <el-option v-for="item in toWarehouseIdOptions"
                             :key="item.id"
                             :label="item.name"
                             :value="item.id">
                  </el-option>
                </el-select>
              </template>
            </el-table-column>
          </el-table>
        </template>
      </el-table-column>
      <el-table-column prop="code"
                       label="调出单号"
                       @click.native="addOrUpdateHandle(id)"
                       sortable
                       width="150"
                       :show-overflow-tooltip='true'>
        <template slot-scope="scope">
          <a @click="addOrUpdateHandle(scope.row.id,'canCheck')"
             class="a-click-hover">
            {{scope.row.code}}
          </a>
        </template>
      </el-table-column>
      <el-table-column prop="date"
                       sortable
                       label="调出日期"></el-table-column>
      <el-table-column prop="admin"
                       label="仓管员"></el-table-column>
      <el-table-column prop="fromWarehouse"
                       :show-overflow-tooltip='true'
                       label="调出仓库"></el-table-column>
      <el-table-column prop="docStatus"
                       label="单据状态"></el-table-column>
      <el-table-column prop="updUser"
                       label="修改人"></el-table-column>
      <el-table-column prop="updTime"
                       sortable
                       :show-overflow-tooltip='true'
                       label="修改时间"></el-table-column>
      <el-table-column prop="confirmUser"
                       label="确认人"></el-table-column>
      <el-table-column prop="confirmTime"
                       sortable
                       :show-overflow-tooltip='true'
                       label="确认时间"></el-table-column>
      <el-table-column fixed="right"
                       width="80"
                       label="操作">
        <template slot-scope="scope">
          <el-dropdown :show-timeout='20'>
            <span class="el-dropdown-link">
              操作<i class="el-icon-arrow-down el-icon--right"></i>
            </span>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item command='addOrUpdateHandle'
                                @click.native='addOrUpdateHandle(scope.row.id,"canEdit")'
                                v-if="isAuth('fba:whtransferout:update')"
                                :disabled="!(scope.row.dictDocStatus === '01' || scope.row.dictDocStatus == '04')">编辑</el-dropdown-item>
              <el-dropdown-item command='deleteHandle'
                                @click.native='deleteHandle(scope.row.id)'
                                v-if="isAuth('fba:whtransferout:delete')"
                                :disabled="!(scope.row.dictDocStatus === '01')">删除</el-dropdown-item>
              <el-dropdown-item command='printHandle'
                                @click.native='printHandle(scope.row.id)'
                                disabled>打印</el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </template>
      </el-table-column>
    </el-table>
    <el-row>
      <pagination-all v-model="paginationData"
                      @paginationChangeHandle='getDataList'></pagination-all>
    </el-row>

    <!-- 弹窗, 新增 / 修改 -->
    <trans-out-newtabs v-if="transOutNewtabsVisible"
                       ref="transOutNewtabs"
                       @refreshDataList="getDataList"></trans-out-newtabs>
  </div>
</template>

<script>
// 搜索
import erpSearchPanel from '@/components/erp-search-panel'
import transOutNewtabs from './trans-out-newtabs'
// 分页
import paginationAll from '@/components/erp-pagination/pagination-all'
// 表头处理
import { renderHeaderUtil } from '@/utils/index.js'
import { initData } from '@/mixins/initData.js'
// 引入图片
import tableImg from '@/components/list-table/table-img'
export default {
  mixins: [
    initData
  ],
  components: {
    erpSearchPanel,
    transOutNewtabs,
    paginationAll,
    tableImg
  },
  data () {
    return {
      isDeleteHandle: true, // 批量删除控制
      // 调出仓库
      fromWarehouseIdOptions: [],
      // 调入仓库
      toWarehouseIdOptions: [],
      // 数据过滤器
      searchData: {},

      // 下拉
      searchOptions: [
        {
          label: '调出单号',
          value: 'code',
          inputType: 'el-input'
        },
        {
          label: '调出日期',
          // value: "date",
          // inputType: "el-date"
          value: 'startDate,endDate',
          inputType: 'el-daterange'
        },
        {
          label: '调出仓库',
          value: 'fromWarehouseId',
          inputType: 'el-select',

          httpUrl: '/list/combobox/warehouse',
          dataSource: 'list',
          title: 'toWarehouseId',
          dataValue: 'id',
          dataLabel: 'name',
          placeholder: '调出仓库'
        },
        {
          label: '单据状态',
          value: 'docStatus',
          inputType: 'el-select',

          httpUrl: '/basicData/queryDataDict2List',
          requestParams: { dataDictKey: 'APPROVAL_STATUS' },
          dataSource: 'fontMaps',
          title: 'docStatus',
          dataValue: 'key',
          dataLabel: 'value',
          placeholder: '单据状态'
        }
      ],
      // 单条数据展开
      tableDataExpand: [],

      // 发送批量禁用启用的数据
      searchTFs: {},
      dataForm: {},
      dataList: [],
      dataListLoading: false,
      dataListSelections: [],
      transOutNewtabsVisible: false,
      businessType: '02'
    }
  },

  created () {
    this.getDataList()
  },
  methods: {
    // 表头内容过长处理
    renderHeader (h, g) {
      return renderHeaderUtil(h, g)
    },
    // 展开行
    rowExpand (row) {
      this.getDetailData(row)
    },
    // 获取展开行数据新
    getDetailData (row) {
      // 调出仓库
      this.$http.get(this.$http.adornUrl('list/combobox/warehouse')).then(({ data }) => {
        this.fromWarehouseIdOptions = data.list
        this.toWarehouseIdOptions = data.list
      })
      this.$http({
        url: this.$http.adornUrl(`warehouse/whtransferout/info/${row.id}`),
        method: 'get'
      }).then(({ data }) => {
        if (data && data.code === 0) {
          const whTransferOutEntity = data.transferPackingInfo.whTransferOutEntity
          const whTransferOutDetailList = data.transferPackingInfo.whTransferOutDetailList
          whTransferOutDetailList.forEach((item) => {
            this.$set(item, 'fromWarehouseId', whTransferOutEntity.fromWarehouseId)
            this.$set(item, 'toWarehouseId', whTransferOutEntity.toWarehouseId)
          })
          this.$set(row, 'tableDataExpand', whTransferOutDetailList)
        } else {
          this.$notify.error({
            title: '错误',
            message: data.msg,
            duration: 5000
          })
        }
      })
    },
    // 获取数据列表
    getDataList (val) {
      if (val != undefined) {
        this.paginationData.currPage = val
      }
      this.dataListLoading = true
      this.$http({
        url: this.$http.adornUrl('warehouse/whtransferout/list'),
        method: 'post',
        data: Object.assign({ businessType: '02' }, this.paginationData, this.searchData == undefined ? {} : this.searchData)
      }).then(({ data }) => {
        if (data && data.code === 0) {
          this.dataList = data.pageList.dataList
          this.paginationData.totalCount = data.pageList.page.totalCount
          this.dataList.forEach((item) => {
            this.$set(item, 'tableDataExpand', [])
          })
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
      if (this.dataListSelections.length <= 0) {
        this.isDeleteHandle = true
        return
      }
      this.dataListSelections.every((item) => {
        return (item.docStatus === '未审核' || item.docStatus === '已撤销')
      }) ? this.isDeleteHandle = false : this.isDeleteHandle = true
    },
    // 编辑
    addOrUpdateHandle (id, type) {
      this.transOutNewtabsVisible = true
      this.$nextTick(() => {
        this.$refs.transOutNewtabs.init(id, type)
      })
    },
    // 删除
    deleteHandle (id) {
      var ids = id ? [id] : this.dataListSelections.map(item => {
        return item.id
      })
      this.$confirm(`确定要删除所选择的数据信息吗？`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$http({
          url: this.$http.adornUrl('warehouse/whtransferout/delete'),
          method: 'delete',
          data: this.$http.adornData(ids, false)
        }).then(({ data }) => {
          if (data && data.code === 0) {
            this.getDataList(1)
            this.$notify({
              message: '操作成功',
              title: '提示',
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
    },
    // 打印-暂无
    printHandle (id) {

    }
  }
}
</script>
