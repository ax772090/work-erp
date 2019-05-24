<!--待组装清单-->
<template>
  <div>
    <el-form :inline="true"
             :model="dataForm"
             @keyup.enter.native="getDataList()">
      <el-row>
        <erp-search-panel v-model="searchData"
                          :searchOptions="searchOptions"
                          @search="getDataList(1)" />
      </el-row>
      <el-row>
        <el-button v-if="isAuth('warehouse:whassembleInventory:save')"
                   type="primary"
                   :disabled='isDisabled || dataListSelections.length <= 0'
                   @click="Editor()">产品一键组合</el-button>
        <el-button type="primary"
                   v-if="isAuth('warehouse:whassemble:download')"
                   @click="download()"
                   :disabled="dataListSelections.length <= 0"><i class="iconfont erp-icon-xiazai"></i>下载</el-button>
      </el-row>
    </el-form>

    <el-table :data="dataList"
              stripe
              border
              highlight-current-row
              max-height="800"
              v-loading="dataListLoading"
              @selection-change="selectionChangeHandle">
      <el-table-column type="selection"
                       header-align="center"
                       align="center"
                       width="50"> </el-table-column>
      <el-table-column prop="code"
                       label="要货计划单号"
                       width="180"
                       sortable>
      </el-table-column>
      <el-table-column prop="needPlatform"
                       width="150"
                       label="要货平台">
      </el-table-column>
      <el-table-column prop="channelName"
                       width="200"
                       label="要货店铺">
      </el-table-column>
      <el-table-column prop="warehouseName"
                       width="150"
                       label="计划发货仓库">
      </el-table-column>
      <el-table-column prop="prodCode"
                       width="200"
                       label="产品编码">
      </el-table-column>
      <el-table-column prop="prodName"
                       label="产品名称">
      </el-table-column>
      <el-table-column prop="specifications"
                       label="规格型号"></el-table-column>
      <el-table-column prop="waitQty"
                       width="150"
                       label="待组装数量"
                       sortable>
      </el-table-column>
    </el-table>
    <!-- 分页 -->
    <el-row>
      <pagination-all v-model="paginationData"
                      @paginationChangeHandle='getDataList'></pagination-all>
    </el-row>
    <!-- 弹窗, 新增 / 修改 -->
    <AddOrUpdate v-if="addOrUpdateVisible"
                 ref="addOrUpdate"
                 @refreshDataList="getDataList"></AddOrUpdate>
  </div>
</template>
<script>
// 搜索
import erpSearchPanel from '@/components/erp-search-panel'
// 分页
import paginationAll from '@/components/erp-pagination/pagination-all'
import AddOrUpdate from '../compositeProduct/add'
import { initData } from '@/mixins/initData.js'
export default {
  mixins: [
    initData
  ],
  components: {
    erpSearchPanel,
    paginationAll,
    AddOrUpdate
  },
  data () {
    return {
      // 数据过滤器
      searchData: {},
      isDisabled: false,
      // 下拉
      idList: [], // 选中的id
      deliveryWarehouseId: [], // 选中的仓库id
      compId: [], // 公司ID
      searchOptions: [
        {
          label: '要货平台',
          value: 'platform',
          inputType: 'el-select',
          httpUrl: 'basicData/queryDataDict2List',
          requestParams: { dataDictKey: 'PLANTFORM_TYPE' },
          dataSource: 'fontMaps',
          dataValue: 'key',
          dataLabel: 'value',
          placeholder: '要货平台'
        },
        {
          label: '产品编码',
          value: 'code',
          inputType: 'el-input'
        },
        {
          label: '产品名称',
          value: 'name',
          inputType: 'el-input'
        },
        {
          label: '要货计划单号',
          value: 'planCode',
          inputType: 'el-input'
        },
        {
          label: '要货店铺',
          value: 'channelId',
          inputType: 'el-select',
          httpUrl: 'basic/basicchannel/listcombobox',
          dataSource: 'list',
          dataValue: 'id',
          dataLabel: 'name',
          placeholder: '要货店铺'
        },
        {
          label: '计划发货仓库',
          value: 'warehouseId',
          inputType: 'el-select',
          httpUrl: 'list/combobox/warehouse',
          dataSource: 'list',
          title: 'warehouseIdList',
          dataValue: 'id',
          dataLabel: 'name',
          placeholder: '计划发货仓库'
        }
      ],
      addOrUpdateVisible: false,
      dataListSelections: [],
      dataList: [],
      dataListLoading: false, // loading加载
      dataForm: {}
    }
  },
  created () {
    this.getDataList()
  },
  methods: {
    // 获取数据列表
    getDataList (val) {
      if (val) {
        this.paginationData.currPage = val
      }
      this.dataListLoading = true
      this.$http({
        url: this.$http.adornUrl('warehouse/whassemble/waitList'),
        methods: 'get',
        params:
          this.searchData === undefined
            ? this.paginationData
            : Object.assign({}, this.paginationData, this.searchData)
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
      if (this.dataListSelections.length === 0) {
        this.isDisabled = true
      } else if (this.dataListSelections.length === 1) {
        this.isDisabled = false
      }
      // 判断每一个数组元素的调入仓库是否和第一个相同，如果每个都相同，产品一键组合按钮才可以用
      this.dataListSelections.every((item, index, arr) => {
        return (
          arr[0].warehouseName === arr[index].warehouseName
        )
      })
        ? (this.isDisabled = false)
        : (this.isDisabled = true)
    },
    // 产品一键组合
    Editor (id) { // 'warehouse:whassemble:addProdConfirm'
      var ids = this.dataListSelections.map(item => {
        return item.id
      })
      var deliveryWarehouseId = this.dataListSelections.map(item => {
        return item.warehouseId
      })
      var compId = this.dataListSelections.map(item => {
        return item.compId
      })
      this.idList = ids
      this.deliveryWarehouseId = deliveryWarehouseId
      this.compId = compId
      this.$confirm(
        `确定要${id ? '组合' : '一键组合'}所选择的数据信息吗？${
        id ? '[id=' + ids.join(',') + ']' : ''
        }`,
        '提示',
        {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }
      ).then(() => {
        this.$nextTick(() => {
          this.addOrUpdateVisible = true
          this.initEdit()
        })
      })
    },
    // 下载
    download (id) {
      var ids = id || this.dataListSelections.map(item => {
        return item.id
      })
      if (Array.isArray(ids)) {
        ids = ids.join(',')
      }

      window.open(
        this.$http.tokens(`warehouse/whassemble/download`, { 'ids': ids })
      )
    },
    initEdit () {
      this.$nextTick(() => {
        this.$refs.addOrUpdate.init(
          this.idList,
          'inventoryAdd',
          this.deliveryWarehouseId,
          this.compId
        )
      })
    }
  }
}
</script>
