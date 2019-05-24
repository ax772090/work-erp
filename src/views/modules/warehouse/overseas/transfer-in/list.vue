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
        <el-button v-if="isAuth('warehouse:whtransferin:saveandconfirm')"
                   type="primary"
                   @click="addOrUpdateHandle()"
                   :disabled="isTransferInHandle"><i class="iconfont el-icon--left el-icon-erp-numpickerplus"></i>到货签收</el-button>
      </el-row>
    </el-form>

    <el-table :data="dataList"
              max-height="800"
              stripe
              border
              highlight-current-row
              v-loading="dataListLoading"
              @selection-change="selectionChangeHandle"
              :default-sort="{prop: 'code', order: 'descending'}">
      <el-table-column type="selection"
                       header-align="center"
                       align="center"
                       width="50"></el-table-column>
      <el-table-column prop="code"
                       label="调出单号"
                       width="160"
                       sortable
                       :show-overflow-tooltip="true"></el-table-column>
      <el-table-column prop="date"
                       width="130"
                       label="调出日期"
                       sortable></el-table-column>
      <el-table-column prop="fromWarehouse"
                       width="150"
                       label="调出仓库"></el-table-column>
      <el-table-column prop="toWarehouse"
                       width="150"
                       label="调入仓库"></el-table-column>
      <el-table-column prop="prodCode"
                       label="产品编码"
                       width="160"
                       sortable></el-table-column>
      <el-table-column prop="imageUrl"
                       width="120"
                       label="产品图片">
        <template slot-scope="scope">
          <tableImg :imageUrl='scope.row.imageUrl'></tableImg>
        </template>
      </el-table-column>
      <el-table-column prop="prodName"
                       label="产品名称"></el-table-column>
      <el-table-column prop="unReceiveQty"
                       label="待签收数量"
                       width="120"
                       sortable></el-table-column>
      <el-table-column prop="qualifiedQty"
                       width="140"
                       label="已签收合格数量"
                       sortable></el-table-column>
      <el-table-column prop="damagedQty"
                       width="140"
                       label="已签收破损数量"
                       sortable></el-table-column>
    </el-table>
    <el-row>
      <pagination-all v-model="paginationData"
                      @paginationChangeHandle='getDataList'></pagination-all>
    </el-row>

    <!-- 弹窗, 到货签收 -->
    <trans-in-edit v-if="addOrUpdateVisible"
                   ref="addOrUpdate"
                   @refreshDataList="getDataList"></trans-in-edit>
  </div>
</template>

<script>
// 搜索
import erpSearchPanel from '@/components/erp-search-panel'
import transInEdit from './trans-in-edit'
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
    transInEdit,
    paginationAll,
    tableImg
  },
  data () {
    return {
      isTransferInHandle: true, // 到货签收控制
      // 数据过滤器
      searchData: {},

      // 下拉
      searchOptions: [
        {
          label: '产品名称',
          value: 'prodName',
          inputType: 'el-input'
        },
        {
          label: '产品编码',
          value: 'prodCode',
          inputType: 'el-input'
        },
        {
          label: '调出单号',
          value: 'code',
          inputType: 'el-input'
        },
        {
          label: '调出日期',
          value: 'startDate,endDate',
          inputType: 'el-daterange'
        },
        {
          label: '调出仓库',
          value: 'toWarehouseId',
          inputType: 'el-select',

          httpUrl: '/list/combobox/warehouse',
          dataSource: 'list',
          title: 'toWarehouseId',
          dataValue: 'id',
          dataLabel: 'name',
          placeholder: '调出仓库'
        },
        {
          label: '调入仓库',
          value: 'inWarehouseId',
          inputType: 'el-select',

          httpUrl: '/list/combobox/warehouse',
          dataSource: 'list',
          title: 'inWarehouseId',
          dataValue: 'id',
          dataLabel: 'name',
          placeholder: '调入仓库'
        }
      ],

      // 发送批量禁用启用的数据
      searchTFs: {},
      dataForm: {},
      dataList: [],
      dataListLoading: false,
      dataListSelections: [],
      addOrUpdateVisible: false,
      businessType: '01'
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
    // 获取数据列表
    getDataList (val) {
      if (val != undefined) {
        this.paginationData.currPage = val
      }
      this.dataListLoading = true
      this.$http({
        url: this.$http.adornUrl('warehouse/whtransferin/list'),
        method: 'post',
        data: Object.assign({}, this.paginationData, this.searchData == undefined ? {} : this.searchData)
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
      if (this.dataListSelections.length <= 0) {
        this.isTransferInHandle = true
      } else if (this.dataListSelections.length === 1) {
        this.isTransferInHandle = false
      } else {
        // 判断每一个数组元素的调入仓库是否和第一个相同，如果每个都相同，签收按钮才可以用
        this.dataListSelections.every((item, index, arr) => {
          return (arr[0].toWarehouseId === arr[index].toWarehouseId) && (arr[0].compId === arr[index].compId)
        }) ? this.isTransferInHandle = false : this.isTransferInHandle = true
        // 下面这种形式可以提示需要什么条件才能让到货签收按钮可用（备用）
        //     this.dataListSelections.forEach((item, index, arr) => {
        //         if((arr[0].toWarehouseId === arr[index].toWarehouseId) && (arr[0].compId === arr[index].compId)){
        //             this.isTransferInHandle = false
        //         }else{
        //             this.$message.error('请选择[同公司]下[调入仓库]相同的单据')
        //            this.isTransferInHandle = true
        //         }
        //   })
      }
    },
    // 到货签收
    addOrUpdateHandle (id) {
      let ids = []
      // id空表示到货签收
      if (id === undefined) {
        this.dataListSelections.forEach((item) => {
          ids.push(item.id)
        })
      } else {
        ids = id
      }
      this.addOrUpdateVisible = true
      this.$nextTick(() => {
        this.$refs.addOrUpdate.init(ids, 'transferin')
      })
    }
  }
}
</script>
