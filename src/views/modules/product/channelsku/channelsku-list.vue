 <!-- 渠道sku对照表 -->
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
        <el-button type="primary"
                   v-if="isAuth('prod:prodchannelsku:save')"
                   @click="addOrUpdateHandle('','canAdd')">
          <i class="iconfont erp-icon-xinzeng"></i>新 增
        </el-button>
        <el-button type="primary"
                   v-if="isAuth('prod:prodchannelsku:import')"
                   @click="excelImport()"><i class="iconfont erp-icon-daoru"></i>导入</el-button>
        <el-button type="primary"
                   v-if="isAuth('prod:prodchannelsku:export')"
                   @click="excelExport()"><i class="iconfont erp-icon-daochu"></i>导出</el-button>
        <el-button type="primary"
                   v-if="isAuth('prod:prodchannelsku:updatestatus')"
                   @click="updateSaleUserHandle()"
                   :disabled="dataListSelections.length <= 0"><i class="iconfont erp-icon-bianji"></i>批量设置销售人员</el-button>
        <el-button type="danger"
                   v-if="isAuth('prodBatch:prodchannelsku:delete')"
                   @click="deleteHandle()"
                   :disabled="dataListSelections.length <= 0"><i class="iconfont erp-icon-piliangshanchu"></i>批量删除</el-button>
        <el-badge :value="notifyNum"
                  :max="99"
                  v-if="isAuth('prod:prodchannelsku:download')">
          <el-button type="primary"
                     :disabled="notifyNum <=0"
                     @click="downLoadHandle()"><i class="iconfont erp-icon-xiazai"></i>下载</el-button>
        </el-badge>
      </el-row>
    </el-form>
    <el-table :data="dataList"
              v-loading="dataListLoading"
              stripe
              border
              highlight-current-row
              @selection-change="selectionChangeHandle"
              :default-sort="{prop: 'addTime', order: 'descending'}">
      <el-table-column type="selection"
                       align="center"
                       header-align="center"
                       width="50"></el-table-column>
      <el-table-column prop="channelName"
                       label="渠道来源"></el-table-column>
      <el-table-column prop="channelSku"
                       label="SellSKU"></el-table-column>
      <el-table-column prop="asin"
                       label="ASIN"></el-table-column>
      <el-table-column prop="prodCode"
                       label="产品编码"></el-table-column>
      <el-table-column prop="prodName"
                       label="产品中文名"></el-table-column>
      <el-table-column prop="specifications"
                       label="规格型号"></el-table-column>
      <el-table-column prop="saleUserName"
                       label="销售人员"></el-table-column>
      <el-table-column prop="saleTypeName"
                       label="销售类型"></el-table-column>
      <el-table-column prop="fnsku"
                       label="FNSKU"></el-table-column>
      <el-table-column prop="addUser"
                       label="添加人员"></el-table-column>
      <el-table-column prop="addTime"
                       sortable
                       label="添加时间"></el-table-column>
      <el-table-column fixed="right"
                       width="80"
                       label="操作">
        <template slot-scope="scope">
          <el-button type="primary"
                     circle
                     size="small"
                     title="编辑"
                     v-if="isAuth('prod:prodchannelsku:update')"
                     @click="addOrUpdateHandle(scope.row.id,'canEdit')">
            <i class="iconfont erp-icon-bianji"></i></el-button>
          <el-button type="danger"
                     circle
                     size="small"
                     title="删除"
                     v-if="isAuth('prod:prodchannelsku:delete')"
                     @click="deleteHandle(scope.row.id)">
            <i class="iconfont erp-icon-shanchu"></i></el-button>
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
    <update-sale-user v-if="updateSaleUserVisible"
                      ref="updateSaleUser"
                      @refreshDataList="getDataList"></update-sale-user>
    <xlsImport ref="xlsImport"
               title="导入"
               @refreshDataList="getDataList"></xlsImport>
    <xls-export ref="xlsExport"
                title="数据导出"
                @refreshDataList="getDataList"></xls-export>
  </div>
</template>
<script>
// 搜索
import erpSearchPanel from '@/components/erp-search-panel'
// 分页
import paginationAll from '@/components/erp-pagination/pagination-all'
import AddOrUpdate from './channelsku-add-or-update'
import UpdateSaleUser from './channelsku-update-sale-user'
// 导入
import xlsImport from '@/components/xls-import/index'
// 导出弹窗
import xlsExport from '@/components/xls-export/index'
import { initData } from '@/mixins/initData.js'
import { setInterval } from 'timers'
export default {
  mixins: [initData],
  components: {
    erpSearchPanel,
    paginationAll,
    AddOrUpdate,
    UpdateSaleUser,
    xlsImport,
    xlsExport
  },
  data () {
    return {
      notifyNum: '',
      setIntervalTimer: null,
      // 数据过滤器
      searchData: {},
      // 下拉
      searchOptions: [
        {
          label: '渠道来源',
          value: 'channelId',
          inputType: 'el-select',

          httpUrl: '/basic/basicchannel/listcombobox',
          dataSource: 'list',
          title: 'channelId',
          dataValue: 'id',
          dataLabel: 'name',
          placeholder: '渠道来源'
        },
        {
          label: 'SellSKU',
          value: 'channelSku',
          inputType: 'el-input'
        },
        {
          label: 'FNSKU',
          value: 'fnsku',
          inputType: 'el-input'
        },
        {
          label: '产品编码',
          value: 'prodCode',
          inputType: 'el-input'
        },
        {
          label: '产品中文名',
          value: 'prodCnName',
          inputType: 'el-input'
        },
        {
          label: 'ASIN',
          value: 'asin',
          inputType: 'el-input'
        },
        {
          label: '销售员',
          value: 'saleUser',
          inputType: 'el-select-remote',
          httpUrl: '/list/search/user',
          queryKey: 'name',
          dataSource: 'list',
          title: 'saleUser',
          dataValue: 'id',
          dataLabel: 'name',
          placeholder: '销售员'
        },
        {
          label: '销售类型',
          value: 'dictSaleType',
          inputType: 'el-select',

          httpUrl: '/basicData/queryDataDict2List',
          requestParams: { dataDictKey: 'SALE_TYPE' },
          dataSource: 'fontMaps',
          title: 'dictSaleType',
          dataValue: 'key',
          dataLabel: 'value',
          placeholder: '销售类型'
        },
        {
          label: '添加人员',
          value: 'addUser',
          inputType: 'el-select-remote',
          httpUrl: '/list/search/user',
          queryKey: 'name',
          dataSource: 'list',
          title: 'addUser',
          dataValue: 'id',
          dataLabel: 'name',
          placeholder: '添加人员'
        }
      ],
      // 是否禁用
      searchTF: true,
      // 发送批量禁用启用的数据
      searchTFs: {},

      dataForm: {},
      dataList: [],

      dataListLoading: false,
      dataListSelections: [],
      // 新增组件
      addOrUpdateVisible: false,
      // 批量修改组件
      updateSaleUserVisible: false
    }
  },

  created () {
    this.getDataList()
    this.downLoadNum()
    this.setIntervalTimer = setInterval(() => {
      setTimeout(this.downLoadNum(), 0)
    }, 60000)
  },
  methods: {
    // 表头内容过长处理
    renderHeader (h, { column, $index }) {
      let l = column.label.length
      let f = 19 // 每个字大小，其实是每个字的比例值，大概会比字体大小差不多大一点，
      column.minWidth = f * (l + 1) // 字体大小乘个数即长度 ,+2是为了排序图标正常显示,(+1太短)注意不要加px像素，这里minWidth只是一个比例值，不是真正的长度
      // 然后将列标题放在一个div块中，注意块的宽度一定要100%，否则表格显示不完全（这里我去掉了style: { width: '100%' }，添加之后排序图标和文字距离会拉大）
      // return h('div', { class: 'table-head',style: { width: '100%' } }, [column.label])
      return h('div', { class: 'table-head' }, [column.label])
    },
    // 禁用功能
    activeOrDis: _.debounce(
      async function activeOrDis (status) {
        let ListSelects = []
        for (let i = 0; i < this.dataListSelections.length; i++) {
          ListSelects.push(this.dataListSelections[i].id)
        }
        this.$http({
          url: this.$http.adornUrl('prod/prodchannelsku/activeOrDis/'),
          method: 'post',
          data: this.$http.adornData(
            {
              activeOrNot: status,
              ids: ListSelects
            },
            false
          )
        }).then(({ data }) => {
          this.getDataList()
        })
      }, 1000, {
        leading: true,
        trailing: false
      }
    ),

    // 获取数据列表
    getDataList (num) {
      if (num) {
        this.paginationData.currPage = num
      }
      this.dataListLoading = true
      this.$http({
        url: this.$http.adornUrl('prod/prodchannelsku/list'),
        method: 'post',
        data:
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
    },

    // 新增 / 修改
    addOrUpdateHandle (id, type) {
      this.addOrUpdateVisible = true
      this.$nextTick(() => {
        this.$refs.addOrUpdate.init(id, type)
      })
    },

    // 批量修改销售人员
    updateSaleUserHandle () {
      this.updateSaleUserVisible = true
      this.$nextTick(() => {
        this.$refs.updateSaleUser.init(this.dataListSelections)
      })
    },

    // 删除
    deleteHandle (id) {
      var ids = id
        ? [id]
        : this.dataListSelections.map(item => {
          return item.id
        })
      this.$confirm(
        `确定要${id ? '删除' : '批量删除'}所选择的数据信息吗？`,
        '提示',
        {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }
      ).then(() => {
        this.$http({
          url: this.$http.adornUrl('prod/prodchannelsku/delete'),
          method: 'delete',
          data: this.$http.adornData(ids, false)
        }).then(({ data }) => {
          if (data && data.code === 0) {
            this.getDataList(1)
            this.$notify.success({
              title: '成功',
              message: '操作成功',
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
    // 导入
    excelImport () {
      this.$nextTick(() => {
        this.$refs.xlsImport.init({
          templateUrl: 'basicData/exportModel?fileName=prodChannelSku.xlsx',
          importUrl: 'prod/prodchannelsku/import',
          uploadFailUrl: 'prod/prodchannelsku/downloadFailed'
        })
      })
    },

    // 导出
    excelExport () {
      this.$nextTick(() => {
        this.$refs.xlsExport.init({
          exportUrl: 'prod/prodchannelsku/export',
          searchData: this.searchData
        })
      })
    },
    // 查询下载数
    downLoadNum () {
      this.$http({
        url: this.$http.adornUrl('prod/prodchannelsku/querydata'),
        method: 'get'
      }).then(({ data }) => {
        if (data && data.code === 0) {
          if (data.list > 0) {
            this.notifyNum = data.list
          } else {
            this.notifyNum = ''
          }
        }
      })
    },
    // 下载
    downLoadHandle () {
      window.open(
        this.$http.tokens(`prod/prodchannelsku/download`)
      )
    }
  },
  beforeDestroy () {
    // 清除计时器
    clearInterval(this.setIntervalTimer)
  }
}
</script>