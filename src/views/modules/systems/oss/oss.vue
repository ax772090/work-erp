<template>
  <div class="mod-oss">
    <el-form :inline="true"
             :model="dataForm">
      <el-form-item>
        <el-button type="primary"
                   @click="configHandle()">云存储配置</el-button>
        <el-button type="primary"
                   @click="uploadHandle()">上传文件</el-button>
        <el-button type="danger"
                   @click="deleteHandle()"
                   :disabled="dataListSelections.length <= 0"><i class="iconfont erp-icon-piliangshanchu"></i>批量删除</el-button>
      </el-form-item>
    </el-form>
    <el-table :data="dataList"
              stripe
              border
              highlight-current-row
              v-loading="dataListLoading"
              @selection-change="selectionChangeHandle">
      <el-table-column type="selection"
                       align="center"
                       header-align="center"
                       width="50"></el-table-column>
      <el-table-column prop="id"
                       width="180"
                       label="ID"></el-table-column>
      <el-table-column prop="url"
                       align="center"
                       header-align="center"
                       label="URL地址"></el-table-column>
      <el-table-column prop="createDate"
                       width="180"
                       label="创建时间"></el-table-column>
      <el-table-column fixed="right"
                       width="150"
                       label="操作">
        <template slot-scope="scope">
          <el-button type="text"
                     size="small"
                     @click="deleteHandle(scope.row.id)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-row>
      <pagination-all v-model="paginationData"
                      @paginationChangeHandle="getDataList"></pagination-all>
    </el-row>
    <!-- 弹窗, 云存储配置 -->
    <config v-if="configVisible"
            ref="config"></config>
    <!-- 弹窗, 上传文件 -->
    <upload v-if="uploadVisible"
            ref="upload"
            @refreshDataList="getDataList"></upload>
  </div>
</template>

<script>
import Config from './oss-config';
import Upload from './oss-upload';
import paginationAll from '@/components/erp-pagination/pagination-all';
import { initData } from '@/mixins/initData.js';
export default {
  mixins: [initData],
  components: {
    Config,
    Upload,
    paginationAll
  },
  data () {
    return {
      dataForm: {},
      dataList: [],
      dataListLoading: false,
      dataListSelections: [],
      configVisible: false,
      uploadVisible: false
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
        url: this.$http.adornUrl('sys/oss/list'),
        method: 'get',
        params: this.$http.adornParams({
          currPage: this.paginationData.currPage,
          pageSize: this.paginationData.pageSize
        })
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
    // 云存储配置
    configHandle () {
      this.configVisible = true
      this.$nextTick(() => {
        this.$refs.config.init()
      })
    },
    // 上传文件
    uploadHandle () {
      this.uploadVisible = true
      this.$nextTick(() => {
        this.$refs.upload.init()
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
      )
        .then(() => {
          this.$http({
            url: this.$http.adornUrl('sys/oss/delete'),
            method: 'post',
            data: this.$http.adornData(ids, false)
          }).then(({ data }) => {
            if (data && data.code === 0) {
              this.getDataList(1)
              this.$notify.success({
                title: '成功',
                message: '操作成功',
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
        .catch(() => { })
    }
  }
}
</script>
