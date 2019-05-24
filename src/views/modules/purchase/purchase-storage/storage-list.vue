<!-- 采购入库（主表） -->
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
                          @resetHandle="resetHandle()"></erp-search-panel>
      </el-row>
    </el-form>
    <el-row>
      <el-button v-if="isAuth('warehouse:whinstockpo:generatepayable')"
                 type="primary"
                 @click="addProPayment()"
                 :disabled="isAddProPayment"><i class="iconfont erp-icon-xinzeng"></i>批量生成应付单</el-button>
    </el-row>
    <el-table stripe
              border
              highlight-current-row
              :data="dataList"
              v-loading="dataListLoading"
              max-height="800"
              @expand-change="rowExpand"
              @selection-change="selectionChangeHandle">
      <el-table-column type="selection"
                       align="center"
                       width="50"></el-table-column>
      <el-table-column type="expand"
                       fixed
                       label="展开"
                       width="50">
        <template slot-scope="scope">
          <el-table :data="scope.row.tableDataExpand">
            <el-table-column prop="prodCode"
                             label="产品编码"
                             sortable></el-table-column>
            <el-table-column prop="prodName"
                             label="产品名称"></el-table-column>
            <el-table-column prop="qty"
                             label="入库数量"
                             sortable>
              <template slot-scope="scope">
                <span>{{scope.row.qty == null?0:scope.row.qty}}</span>
              </template>
            </el-table-column>
            <el-table-column prop="poCode"
                             label="采购订单号"
                             sortable></el-table-column>
            <el-table-column prop="contractCode"
                             label="采购合同号"
                             sortable></el-table-column>
            <el-table-column prop="remark"
                             label="备注"></el-table-column>
          </el-table>
        </template>
      </el-table-column>
      <el-table-column label="入库单号"
                       prop="code"
                       width="160"
                       id="table"
                       sortable>
        <template slot-scope="scope">
          <a @click="seacher(scope.row.id,'canCheck')"
             class="a-click-hover">{{scope.row.code}}</a>
        </template>
      </el-table-column>
      <el-table-column label="供应商名称"
                       prop="supplierName"></el-table-column>
      <el-table-column label="入库日期"
                       prop="date"
                       width="130"
                       sortable></el-table-column>
      <el-table-column label="仓库"
                       width="150"
                       prop="warehouseName"></el-table-column>
      <el-table-column label="单据状态"
                       width="120"
                       prop="inventoryStatusName"></el-table-column>
      <el-table-column label="修改人"
                       width="130"
                       prop="updUserName"></el-table-column>
      <el-table-column label="修改时间"
                       width="190"
                       prop="updTime"
                       sortable></el-table-column>
      <el-table-column prop="confirmUserName"
                       width="130"
                       label="确认人"></el-table-column>
      <el-table-column prop="confirmTime"
                       sortable
                       width="190"
                       label="确认时间"></el-table-column>
      <el-table-column fixed="right"
                       width="80"
                       label="操作">
        <template slot-scope="scope">
          <el-dropdown @command="handleCommand"
                       :show-timeout="20">
            <span class="el-dropdown-link">操作
              <i class="el-icon-arrow-down el-icon--right"></i>
            </span>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item :disabled="!(scope.row.status == statusOption[0].key)"
                                v-if="isAuth('warehouse:whinstockpo:update')"
                                command="update"
                                @click.native="addOrEditProductDev(scope.row.id,'canEdit')">编辑</el-dropdown-item>
              <el-dropdown-item :disabled="!(scope.row.status == statusOption[0].key)"
                                v-if="isAuth('warehouse:whinstockpo:confirm')"
                                command="confirm"
                                @click.native="comfirm(scope.row.id,scope.row.code)">确认</el-dropdown-item>
              <el-dropdown-item :disabled="scope.row.status == statusOption[0].key"
                                v-if="isAuth('warehouse:whinstockpo:revoke')"
                                command="unInstock"
                                @click.native="revocation(scope.row.id)">撤销</el-dropdown-item>
              <el-dropdown-item :disabled="!(scope.row.status == statusOption[0].key)"
                                v-if="isAuth('warehouse:whinstockpo:delete')"
                                command="delete"
                                @click.native="deleteStorage(scope.row.id)">删除</el-dropdown-item>
              <el-dropdown-item command="print"
                                v-if="isAuth('warehouse:whinstockpo:billprint')"
                                @click.native="print(scope.row.id,scope.row.addUserName)">打印</el-dropdown-item>
              <el-dropdown-item command="print"
                                v-if="isAuth('warehouse:whinstockpo:generatepayable')"
                                :disabled="!(scope.row.status === statusOption[2].key)"
                                @click.native="addProPayment(scope.row.id)">生成应付单号</el-dropdown-item>
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
    <storage-editor ref="storageEditor"
                    @refreshDataList="getDataList"></storage-editor>
    <!-- 打印 -->
    <print ref="print"
           @refreshDataList="getDataList"></print>
  </div>
</template>
<script>
// 搜索
import erpSearchPanel from '@/components/erp-search-panel'
// 分页
import paginationAll from '@/components/erp-pagination/pagination-all'
import storageEditor from './storage-editor'
import print from './storage-print'
import { initData } from '@/mixins/initData.js'

export default {
  mixins: [initData],
  components: {
    erpSearchPanel,
    paginationAll,
    storageEditor,
    print
  },
  data () {
    return {
      isShow: true,
      searchData: {},
      dateValue: '', // 时间
      statusOption: [{
        key: '01',
        value: '未审核'
      }, {
        key: '02',
        value: '审核中'
      }, {
        key: '03',
        value: '已审核'
      }, {
        key: '04',
        value: '已撤销'
      }],
      // 下拉
      searchOptions: [
        {
          label: '入库单号',
          value: 'code',
          inputType: 'el-input'
        },
        {
          label: '采购订单号',
          value: 'poCode',
          inputType: 'el-input'
        },
        {
          label: '采购合同号',
          value: 'contractCode',
          inputType: 'el-input'
        },
        {
          label: '入库时间',
          value: 'planDate,planDateEnd',
          inputType: 'el-daterange'
        },
        {
          label: '仓库',
          value: 'warehouseId',
          inputType: 'el-select',
          httpUrl: '/list/combobox/warehouse',
          dataSource: 'list',
          title: 'warehouseName',
          dataValue: 'id',
          dataLabel: 'name',
          placeholder: '仓库'
        },
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
          label: '供应商名称',
          value: 'supplierName',
          inputType: 'el-input'
        },
        {
          label: '单据状态',
          value: 'status',
          inputType: 'el-select',
          httpUrl: 'basicData/queryDataDict2List',
          requestParams: { dataDictKey: 'APPROVAL_STATUS' },
          dataSource: 'fontMaps',
          title: 'status',
          dataValue: 'key',
          dataLabel: 'value',
          placeholder: '单据状态'
        }
      ],
      // 是否禁用
      searchTF: true,
      // 时间过滤
      expectDate: '',
      // 发送批量禁用启用的数据
      searchTFs: {},
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
      tableDataExpand: [], // 展开行
      dataList: [],
      dataListLoading: false,
      // 多行
      dataListSelections: [],
      isAddProPayment: true,
      editorVisible: false
    }
  },

  created () {
    this.getDataList()
  },
  methods: {
    // 展开行
    rowExpand (row) {
      this.getDetailData(row)
    },
    // 获取展开行数据新
    getDetailData (mainData) {
      this.$http({
        url: this.$http.adornUrl(`warehouse/whinstockpo/info/${mainData.id}`),
        method: 'get'
      }).then(({ data }) => {
        if (data && data.code === 0) {
          this.$set(
            mainData,
            'tableDataExpand',
            data.poInstockDto.poInstockDetail
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
        this.$refs.storageEditor.init(id, type)
      })
      this.editorVisible = true
    },
    handleCommand (command) {
      // this.$message("click on item " + command);
    },
    // 获取数据列表
    getDataList (val) {
      if (val) {
        this.paginationData.currPage = val
      }
      this.dataListLoading = true
      this.$http({
        url: this.$http.adornUrl('warehouse/whinstockpo/list'),
        method: 'get',
        params: this.searchData === undefined ? this.paginationData : Object.assign({}, this.paginationData, this.searchData)
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

    // 选择日期进行搜索
    getResult () {
      if (this.dateValue) {
        this.$http({
          url: this.$http.adornUrl('warehouse/whinstockpo/list'),
          method: 'get',
          params: Object.assign({}, this.paginationData, {
            planDate: this.dateValue[0],
            planDateEnd: this.dateValue[1]
          }, this.searchData)
        }).then(({ data }) => {
          if (data && data.code === 0) {
            this.$notify.success({
              title: '成功',
              message: '操作成功',
              duration: 5000
            })
            this.dataList = data.pageList.dataList
            this.paginationData.totalCount = data.pageList.page.totalCount
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

    resetHandle () {
      this.dateValue = ''
    },

    // 采购入库单查看
    seacher (id, type) {
      this.editorVisible = true
      this.$nextTick(() => {
        this.$refs.storageEditor.init(id, type)
      })
    },

    // 删除当前行
    deleteStorage (id) {
      this.$confirm('确认要删除此行吗？', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$http({
          url: this.$http.adornUrl('warehouse/whinstockpo/delete'),
          method: 'delete',
          params: { id: id }
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

    // 确认
    comfirm: _.debounce(
      async function comfirm (id, code) {
        this.$http({
          url: this.$http.adornUrl('warehouse/whinstockpo/confirm'),
          method: 'post',
          data: id
        }).then(({ data }) => {
          if (data && data.code === 0) {
            this.getDataList()
            this.$notify.success({
              dangerouslyUseHTMLString: true,
              title: '成功',
              // message: `确认成功,单号为: ${code}</br>成功生成采购应付单: ${data.entity.yfCodes}`,
              message: `确认成功,单号为: ${code}</br>${data.entity.yfCodes.length <= 0 ? '' : '成功生成采购应付单: ' + data.entity.yfCodes.join('</br>')}`,
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
      },
      1000,
      {
        leading: true,
        trailing: false
      }
    ),

    // 撤销
    revocation (id) {
      this.$confirm('确认要撤销吗？', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$http({
          url: this.$http.adornUrl('warehouse/whinstockpo/revoke'),
          method: 'post',
          data: id
        }).then(({ data }) => {
          if (data && data.code === 0) {
            this.getDataList()
            this.$notify.success({
              dangerouslyUseHTMLString: true,
              title: '成功',
              message: `撤销成功</br>${data.entity.yfCodes.length <= 0 ? '' : '成功删除下游应付单: ' + data.entity.yfCodes.join('</br>')}`,
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
    // 打印
    print (id) {
      this.$http({
        url: this.$http.adornUrl(`warehouse/whinstockpo/billprint/${id}`),
        method: 'get'
      }).then(({ data }) => {
        if (data && data.code === 0) {
          this.$refs.print.init(data)
        }
      })
    },

    // 生成应付单
    addProPayment (id) {
      var ids = id ? [id] : this.dataListSelections.map(item => { return item.id })
      this.$confirm(`确定要${id ? '生成应付单' : '批量生成应付单'}吗？`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$http({
          url: this.$http.adornUrl('warehouse/whinstockpo/generatepayable'),
          method: 'post',
          data: this.$http.adornData(ids, false)
        }).then(({ data }) => {
          if (data && data.code === 0) {
            this.getDataList()
            this.$notify.success({
              dangerouslyUseHTMLString: true,
              title: '成功',
              message: `${data.yfCodes.length <= 0 ? '已生成过应付单' : '生成的应付单号为: ' + data.yfCodes.join('</br>')}`,
              duration: 5000
            })
          } else {
            this.$notify.error(data.msg)
          }
        })
      })
    },
    // 多选
    selectionChangeHandle (val) {
      this.dataListSelections = val
      if (this.dataListSelections.length <= 0) {
        this.isAddProPayment = true
        return
      } else {
        this.isAddProPayment = false
      }
      for (const item of this.dataListSelections) {
        if (!(item.status === this.statusOption[2].key)) {
          this.isAddProPayment = true
        }
      }
    }
  }
}
</script>

