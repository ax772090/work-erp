<!-- 丢失货件 -->
<template>
  <div>
    <el-table stripe
              border
              highlight-current-row
              max-height="800"
              :data="dataList"
              v-loading="dataListLoading">
      <el-table-column prop="channelName"
                       label="店铺"></el-table-column>
      <el-table-column prop="type"
                       label="索赔类型"></el-table-column>
      <el-table-column prop="FBAShipmentID"
                       label="FBAShipmentID"></el-table-column>
      <el-table-column prop="shippedDate"
                       label="发货日期"></el-table-column>
      <el-table-column prop="fnsku"
                       label="FNSKU"></el-table-column>
      <el-table-column prop="asin"
                       label="ASIN"></el-table-column>
      <el-table-column prop="totalQuantity"
                       label="总数量"></el-table-column>
      <el-table-column prop="receivedQuantity"
                       label="入库数量"></el-table-column>
      <el-table-column prop="lossQuantity"
                       label="缺失数量"></el-table-column>
      <el-table-column prop="receivedDate"
                       label="最后入库时间"></el-table-column>
      <el-table-column fixed="right"
                       label="操作"
                       width="110">
        <template slot-scope="scope">
          <el-dropdown :show-timeout="20">
            <span class="el-dropdown-link">
              操作
              <i class="el-icon-arrow-down el-icon--right"></i>
            </span>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item command="ignoreHandle"
                                @click.native="ignoreHandle(scope.row.FBAShipmentID)"
                                v-if="isAuth('mws:reportinventoryreceiptsdata:ignoreCompensateReceiptData')">忽略</el-dropdown-item>
              <el-dropdown-item command="selfShipmentHandle"
                                @click.native="selfShipmentHandle(scope.row.id)"
                                v-if="isAuth('mws:listorder:whshipment')"
                                :disabled="true">发起索赔申请</el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </template>
      </el-table-column>
    </el-table>
    <el-row>
      <pagination-all v-model="paginationData"
                      @paginationChangeHandle="getDataList"></pagination-all>
    </el-row>
  </div>
</template>

<script>
import paginationAll from '@/components/erp-pagination/pagination-all'
export default {
  components: {
    paginationAll
  },
  props: ['value'],
  data () {
    return {
      dataListLoading: false,
      dataList: [],
      dataRule: {},
      // 分页
      paginationData: {
        // 当前页数
        currPage: 1,
        // 一页显示的条数
        pageSize: 10,
        // 总条数
        totalCount: 0,
        // 总页数
        totalPage: 0
      }
    }
  },
  methods: {
    init (searchData) {
      this.searchData = searchData
      this.getDataList()
    },
    // 获取数据列表
    getDataList (val) {
      if (val != undefined) {
        this.paginationData.currPage = val
      }
      this.dataListLoading = true
      this.$http({
        url: this.$http.adornUrl('mws/reportinventoryreceiptsdata/compensateReceiptData'),
        method: 'get',
        params: Object.assign({},
          this.paginationData,
          this.searchData == undefined ? {} : this.searchData
        )
      }).then(({
        data
      }) => {
        if (data && data.code === 0) {
          this.dataList = data.pageList.dataList
          this.paginationData.totalCount = data.pageList.page.totalCount
        } else {
          this.dataList = []
          this.paginationData.totalCount = 0
          this.$notify.error({
            title: '错误',
            message: data.msg,
            duration: 5000
          })
        }
        this.dataListLoading = false
      })
    },
    //   忽略
    ignoreHandle (FBAShipmentID) {
      this.$http({
        url: this.$http.adornUrl(`mws/reportinventoryreceiptsdata/ignoreCompensateReceiptData`),
        method: 'get',
        params: {
          id: FBAShipmentID,
          type: 'COMPENSATE_RECEIPT_DATE'
        }
      }).then(({
        data
      }) => {
        if (data && data.code === 0) {
          //   成功后刷新列表数据
          this.$emit('refreshList')
          this.$notify({
            title: '提示',
            message: '操作成功',
            type: 'success',
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
    }
  },
  watch: {
    value: {
      handler (val, oldVal) {
        this.dataForm = this.value
        this.$emit('change', this.dataForm)
      },
      deep: true
    },
    dataForm: {
      handler (val, oldVal) {
        this.$emit('input', this.dataForm)
      },
      deep: true
    }
  }
}
</script>
