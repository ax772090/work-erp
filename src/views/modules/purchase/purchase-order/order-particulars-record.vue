<template>
  <el-dialog title="查看历史采购记录"
             :close-on-click-modal="false"
             :visible.sync="visible"
             :append-to-body="true"
             width='70%'>
    <el-row>
      <el-col :span="3">
        <tableImg :imageUrl='dataObj.imageUrl'></tableImg>

      </el-col>
      <el-col :span="21">
        <div>产品编码:{{dataObj.prodCode}}</div>
        <div>产品名称:{{dataObj.nameCh}}</div>
        <div>规格型号:{{dataObj.specifications}}</div>
      </el-col>
    </el-row>
    <el-table :data="dataList"
              ref='table'
              border
              v-loading="dataListLoading">
      <el-table-column type="index"
                       header-align="center"
                       align="center"
                       label="序号"
                       width="50"></el-table-column>
      <el-table-column prop="purDate"
                       header-align="center"
                       align="center"
                       label="采购时间"></el-table-column>
      <el-table-column prop="purchaserName"
                       header-align="center"
                       align="center"
                       label="采购员"></el-table-column>
      <el-table-column prop="supplierName"
                       header-align="center"
                       align="center"
                       label="供应商"></el-table-column>
      <el-table-column prop="code"
                       header-align="center"
                       align="center"
                       label="采购订单号"></el-table-column>
      <el-table-column prop="hasTax"
                       header-align="center"
                       align="center"
                       label="是否含税">
        <template slot-scope="scope">
          <el-tag v-if='scope.row.hasTax === true'
                  size="small">是</el-tag>
          <el-tag v-else
                  type="danger"
                  size="small">否</el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="price"
                       header-align="center"
                       align="center"
                       label="单价"> </el-table-column>
      <el-table-column prop="qty"
                       header-align="center"
                       align="center"
                       label="采购数量"> </el-table-column>
      <el-table-column prop="deliveryDays"
                       header-align="center"
                       align="center"
                       label="产品交期(天)"> </el-table-column>
      <el-table-column prop="closeQty"
                       header-align="center"
                       align="center"
                       label="关闭数量"> </el-table-column>
      <el-table-column prop="actualQty"
                       header-align="center"
                       align="center"
                       label="实际采购数量"> </el-table-column>
    </el-table>
    <!-- 分页 -->
    <el-row>
      <pagination-all v-model="paginationData"
                      @paginationChangeHandle='getDataList'></pagination-all>
    </el-row>
    <span slot="footer"
          class="dialog-footer">
      <el-button @click="visible = false"><i class="iconfont erp-icon-quxiao"></i>取消</el-button>
    </span>
  </el-dialog>
</template>
<script>
// 搜索
import erpSearchPanel from '@/components/erp-search-panel'
// 分页
import paginationAll from '@/components/erp-pagination/pagination-all'
import { initData } from '@/mixins/initData.js'
// 引入图片
import tableImg from '@/components/list-table/table-img'
export default {
  mixins: [initData],
  components: {
    erpSearchPanel,
    paginationAll,
    tableImg
  },
  data () {
    return {
      visible: false,
      dataObj: {},
      dataList: [],
      dataListLoading: false
    }
  },
  methods: {
    init (dataObj) {
      this.visible = true
      this.dataObj = dataObj
      this.getDataList()
    },
    // 获取数据列表
    getDataList () {
      this.dataListLoading = true
      this.$http({
        url: this.$http.adornUrl('pur/poinfo/queryPurHisByProductId'),
        method: 'post',
        data: Object.assign({}, this.paginationData, { productId: this.dataObj.productId })
      }).then(({ data }) => {
        if (data && data.code === 0) {
          this.dataList = data.pageList.dataList
          this.paginationData = data.pageList.page
        } else {
          this.dataList = []
          this.paginationData = 0
        }
        this.dataListLoading = false
      })
    }
  }
}
</script>
