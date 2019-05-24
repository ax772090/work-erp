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
        <el-button v-if="isAuth('basic:basicchannel:save')"
                   type="primary"
                   @click="addOrUpdateHandle('','canAdd')">
          <i class="iconfont erp-icon-xinzeng"></i>新增
        </el-button>
        <!-- <el-button v-if="isAuth('basic:basicchannel:delete')"
                   type="danger"
                   @click="deleteHandle()"
        :disabled="dataListSelections.length <= 0"><i class="iconfont el-icon--left erp-icon-shanchu"></i>批量删除</el-button>-->
        <!-- <el-button type="primary" @click="getDataList()"><i class="iconfont el-icon--left el-icon-erp-ERP_gengxin"></i>刷新</el-button> -->
        <el-button v-if="isAuth('basic:basicchannel:activeOrDis')"
                   type="primary"
                   @click="activeOrDis(status=false)">
          <i class="iconfont erp-icon-jinyong"></i>禁用
        </el-button>
        <el-button v-if="isAuth('basic:basicchannel:activeOrDis')"
                   type="primary"
                   @click="activeOrDis(status=true)">
          <i class="iconfont erp-icon-qiyong"></i>启用
        </el-button>
      </el-row>
    </el-form>
    <el-table :data="dataList"
              v-loading="dataListLoading"
              stripe
              border
              highlight-current-row
              @selection-change="selectionChangeHandle">
      <el-table-column type="selection"
                       align="center"
                       header-align="center"
                       width="50"></el-table-column>
      <el-table-column prop="code"
                       label="店铺编号"
                       sortable></el-table-column>
      <el-table-column prop="name"
                       label="店铺名称"></el-table-column>
      <el-table-column prop="dictPlantformTypeName"
                       label="平台"></el-table-column>
      <el-table-column prop="supportEmail"
                       label="客服邮箱"></el-table-column>
      <el-table-column prop="inChargeOfName"
                       label="店铺负责人"></el-table-column>
      <el-table-column prop="addUserName"
                       label="创建人"></el-table-column>
      <el-table-column prop="addTime"
                       label="创建时间"
                       sortable></el-table-column>
      <el-table-column prop="bUsed"
                       label="是否使用">
        <template slot-scope="scope">
          <el-tag v-if="scope.row.bUsed == false"
                  size="small"
                  type="danger">禁用</el-tag>
          <el-tag v-else
                  size="small">正常</el-tag>
        </template>
      </el-table-column>
      <el-table-column fixed="right"
                       width="80"
                       label="操作">
        <template slot-scope="scope">
          <el-dropdown :show-timeout="20">
            <span class="el-dropdown-link">操作
              <i class="el-icon-arrow-down el-icon--right"></i>
            </span>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item command="addOrUpdateHandle"
                                @click.native="addOrUpdateHandle(scope.row.id,'canEdit')">编辑</el-dropdown-item>
              <el-dropdown-item command="eMailHandle"
                                @click.native="eMailHandle(scope.row.id)"
                                :disabled="true">邮箱设置</el-dropdown-item>
              <!-- <el-dropdown-item command="deleteHandle" @click.native="deleteHandle(scope.row.id)">删除</el-dropdown-item> -->
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
    <add-or-update v-if="addOrUpdateVisible"
                   ref="addOrUpdate"
                   @refreshDataList="getDataList"></add-or-update>
  </div>
</template>
<script>
// 搜索
import erpSearchPanel from '@/components/erp-search-panel'
// 分页
import paginationAll from '@/components/erp-pagination/pagination-all'
import AddOrUpdate from './basicchannel-add-or-update'
import { initData } from '@/mixins/initData.js'
export default {
  mixins: [initData],
  components: {
    erpSearchPanel,
    paginationAll,
    AddOrUpdate
  },
  data () {
    return {
      // 数据过滤器
      searchData: {},
      // 下拉
      searchOptions: [
        {
          label: '店铺名称',
          value: 'name',
          inputType: 'el-input'
        },
        {
          label: '隶属平台',
          value: 'dict_plantform_type',
          inputType: 'el-select',
          httpUrl: 'basicData/queryDataDict2List',
          requestParams: { dataDictKey: 'PLANTFORM_TYPE' },
          dataSource: 'fontMaps',
          dataValue: 'key',
          dataLabel: 'value',
          placeholder: '隶属平台'
        }
      ],

      // 是否禁用
      searchTF: true,
      // 发送批量禁用启用的数据
      searchTFs: {},
      dataForm: {
        key: ''
      },
      dataList: [],

      dataListLoading: false,
      dataListSelections: [],
      addOrUpdateVisible: false
    }
  },

  created () {
    this.getDataList()
  },
  methods: {
    // 获取数据列表
    getDataList (val) {
      if (val !== undefined) {
        this.paginationData.currPage = val
      }
      this.dataListLoading = true
      this.$http({
        url: this.$http.adornUrl('basic/basicchannel/list'),
        method: 'get',
        params: Object.assign(
          {},
          this.paginationData,
          this.searchData === undefined ? {} : this.searchData
        )
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

    // 禁用功能
    activeOrDis: _.debounce(
      async function activeOrDis (status) {
        let ListSelects = []
        for (let i = 0; i < this.dataListSelections.length; i++) {
          ListSelects.push(this.dataListSelections[i].id)
        }
        this.$http({
          url: this.$http.adornUrl('basic/basicchannel/activeOrDis/'),
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
      },
      1000,
      {
        leading: true,
        trailing: false
      }
    ),

    // 新增 / 修改
    addOrUpdateHandle (id, type) {
      this.addOrUpdateVisible = true
      this.$nextTick(() => {
        this.$refs.addOrUpdate.init(id, type)
      })
    },

    // 邮箱设置
    eMailHandle (id) {
      console.log('邮箱设置界面')
    }

    // 删除
    // deleteHandle(id) {
    //   var ids = id
    //     ? [id]
    //     : this.dataListSelections.map(item => {
    //         return item.id;
    //       });
    //   this.$confirm(
    //     `确定要${id ? "删除" : "批量删除"}所选择的数据信息吗？`,
    //     "提示",
    //     {
    //       confirmButtonText: "确定",
    //       cancelButtonText: "取消",
    //       type: "warning"
    //     }
    //   ).then(() => {
    //     this.$http({
    //       url: this.$http.adornUrl("basic/basicchannel/delete"),
    //       method: "delete",
    //       data: this.$http.adornData(ids, false)
    //     }).then(({ data }) => {
    //       if (data && data.code === 0) {
    //         this.$message({
    //           message: "操作成功",
    //           type: "success",
    //           duration: 1500,
    //           onClose: () => {
    //             this.getDataList(1);
    //           }
    //         });
    //       } else {
    //         this.$message.error(data.msg);
    //       }
    //     });
    //   });
    // }
  }
}
</script>

