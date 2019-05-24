<template>
  <el-dialog :title="dialogTitle"
             :close-on-click-modal="false"
             :visible.sync="visible"
             @close="$refs['dataForm'].resetFields()"
             width='90%'>
    <el-form :model="dataForm"
             ref="dataForm"
             label-width="110px">
      <el-row>
        <el-col :span="6">
          <el-form-item label="库存公司"
                        prop="compName">{{dataForm.compName}}</el-form-item>
          <el-form-item label="仓库"
                        prop="warehouseName">{{dataForm.warehouseName}}</el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="业务状态"
                        prop="dictBizStatusName">{{dataForm.dictBizStatusName}}</el-form-item>
          <el-form-item label="备注"
                        prop="remark">
            {{dataForm.remark}}
          </el-form-item>

        </el-col>
        <el-col :span="6">
          <el-form-item label="是否完成初始化"
                        prop="bInit">
            <el-tag v-if='dataForm.bInit === true'
                    type="success">是</el-tag>
            <el-tag v-if='dataForm.bInit === false'
                    type="danger">否</el-tag>
          </el-form-item>
        </el-col>
      </el-row>
      <el-table :data="dataForm.whInitInventoryDetail"
                stripe
                border
                max-height="500"
                highlight-current-row
                v-loading="dataListLoading"
                @selection-change="selectionChangeHandle"
                show-summary
                :summary-method="getSummaries">
        <el-table-column type="index"
                         align="center"
                         label="序号"
                         width="50"></el-table-column>
        <el-table-column prop="prodCode"
                         label="产品编码"></el-table-column>
        <el-table-column prop="imageUrl"
                         label="产品图片">
          <template slot-scope="scope">
            <tableImg :imageUrl='scope.row.imageUrl'></tableImg>
          </template>
        </el-table-column>
        <el-table-column prop="prodName"
                         label="产品名称"></el-table-column>
        <el-table-column prop="unitName"
                         label="单位"></el-table-column>
        <el-table-column prop="dictInventoryStatusName"
                         label="库存状态"></el-table-column>
        <el-table-column prop="initQty"
                         label="期初数量"></el-table-column>
      </el-table>
    </el-form>
    <!-- ===================================== 订单详情 =============================================== -->
    <span slot="footer">
      <el-button @click="visible = false"><i class="iconfont erp-icon-quxiao"></i>取消</el-button>
    </span>
  </el-dialog>
</template>
<script>
// 引入图片
import tableImg from '@/components/list-table/table-img'
export default {
  components: {
    tableImg
  },
  data () {
    return {
      dialogTitle: '',
      visible: false,
      dataForm: {
        id: ''
      },
      // ==================== table数据集
      dataListLoading: false,
      // 多选
      dataListSelections: [],
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
    init (id, type, parentData) {
      this.visible = true
      this.dataForm.id = id
      // this.type = type
      // this.dataForm.detailList = []
      // this.$nextTick(() => {
      //   // table采购订单号==>采购订单编辑=>查看
      //   if(type === 'receiveList'){
      //     this.dataForm = parentData
      //     this.isDisabled = false
      //     return
      //   }
      //   if(type === 'isDisabled'){
      //     this.isDisabled = true
      //     this.isClick = false
      //     return
      //   }else{
      //     this.isDisabled = false
      //     this.isClick = true
      //   }
      // })
      this.$nextTick(() => {
        if (type === 'canCheck' && this.dataForm.id) {
          this.dialogTitle = '初始库存列表查看'
          this.initCheck(id)
        }
      })
    },
    initCheck (id) {
      this.dataCall(id)
    },
    // 数据调用
    dataCall (id) {
      this.$http({
        url: this.$http.adornUrl(`warehouse/whinitinventory/info/${id}`),
        method: 'get',
        params: this.$http.adornParams()
      }).then(({ data }) => {
        if (data && data.code === 0) {
          this.dataForm = data.whInitInventoryDto
        }
      })
    },
    // 多选
    selectionChangeHandle (val) {
      this.dataListSelections = val
    },

    // 合计
    getSummaries (param) {
      const { columns, data } = param
      const sums = []
      columns.forEach((column, index) => {
        if (index === 0) {
          sums[index] = '合计'
          return
        }
        const values = data.map(item => Number(item[column.property]))
        if (!values.every(value => isNaN(value))) {
          sums[index] = values.reduce((prev, curr) => {
            const value = Number(curr)
            if (!isNaN(value)) {
              return prev + curr
            } else {
              return prev
            }
          }, 0)
          if (column.property === 'initQty') {
            sums[index] += ''
            // this.dataForm.subtotalAmount = sums[index]
          } else {
            sums[index] = ''
          }
        } else {
          sums[index] = ''
        }
      })
      return sums
    }
  }
}
</script>
