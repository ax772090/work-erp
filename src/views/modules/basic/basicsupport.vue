<template>
  <!-- 辅助资料 -->
  <el-container>
    <el-aside width="250px"
              class="tree_content">
      <el-row>
        <el-button type="text"
                   size="mini"
                   icon="el-icon-plus"
                   round
                   v-if="isAuth('prod:prodskurules:save')"
                   @click="addTypeHandle('','canAdd')">新增</el-button>
      </el-row>
      <el-tree :data="treeData"
               :props="defaultProps"
               default-expand-all
               node-key="id"
               ref="tree"
               :expand-on-click-node="false"
               @node-click="handleNodeClick">
        <span class="custom-tree-node"
              slot-scope="{ node, data }">
          <span>{{ node.label }}</span>
          <span v-if="data.type != '1'">
            <el-button type="text"
                       size="mini"
                       icon="el-icon-edit"
                       round
                       v-if="isAuth('prod:prodskurules:update')"
                       @click="addTypeHandle(data,'canEdit')">编辑</el-button>
            <el-button type="text"
                       size="mini"
                       icon="el-icon-delete"
                       round
                       v-if="isAuth('prod:prodskurules:delete')"
                       @click="deleteTypeHandle(data)">删除</el-button>
          </span>
        </span>
      </el-tree>
      <!-- 新增辅助类型弹窗 -->
      <el-dialog :title="!this.addSupTypeForm.id?'辅助类型新增':'辅助类型编辑'"
                 width="30%"
                 :visible.sync="addSupTypeVisible"
                 :before-close="handleClose"
                 v-if="supTypeDialog">
        <el-form :model="addSupTypeForm"
                 :rules="addSupTypeRule"
                 ref="addSupTypeForm"
                 label-width="110px">
          <el-form-item label="辅助类型编码"
                        prop="key">
            <el-input v-model="addSupTypeForm.key"
                      placeholder=""></el-input>
          </el-form-item>

          <el-form-item label="辅助类型分类"
                        prop="name">
            <el-input v-model="addSupTypeForm.name"
                      placeholder=""></el-input>
          </el-form-item>
          <el-form-item label="">
            <el-checkbox label="1"
                         v-model="addSupTypeForm.bChecked">新品开发按照此类型生成产品</el-checkbox><br>
            <el-checkbox label="2"
                         v-model="addSupTypeForm.bAddname">是否将值加入产品的中文名中</el-checkbox>
          </el-form-item>
          <el-form-item label="生成SKU的排序"
                        prop="orderIndex">
            <el-input v-model="addSupTypeForm.orderIndex"
                      type="Number"
                      @mousewheel.native.prevent
                      placeholder=""></el-input>
          </el-form-item>
        </el-form>
        <div slot="footer"
             class="dialog-footer">
          <el-button @click="cancel('addSupTypeForm')">取消</el-button>
          <el-button type="primary"
                     @click="saveSupType()">保存</el-button>
        </div>
      </el-dialog>

    </el-aside>
    <el-main>
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
            <el-button v-if="isAuth('prod:prodskuparams:save')"
                       type="primary"
                       @click="addOrUpdateHandle()">
              <i class="iconfont erp-icon-xinzeng"></i>新增
            </el-button>
            <el-button v-if="isAuth('prod:prodskuparams:delete')"
                       type="danger"
                       :disabled="delSupInfoDis"
                       @click="deleteSupHandle()">
              <i class="iconfont erp-icon-shanchu"></i>删除
            </el-button>
          </el-row>
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
          <el-table-column prop="key"
                           label="辅助类型"></el-table-column>
          <el-table-column prop="code"
                           label="编码"
                           sortable></el-table-column>
          <el-table-column prop="name"
                           label="名称"></el-table-column>
          <el-table-column prop="addUser"
                           label="创建人"></el-table-column>
          <el-table-column prop="addTime"
                           label="创建时间"
                           sortable></el-table-column>
          <el-table-column fixed="right"
                           width="80"
                           label="操作">
            <template slot-scope="scope">
              <el-button type="primary"
                         circle
                         v-if="isAuth('prod:prodskuparams:update')"
                         title="编辑"
                         @click="addOrUpdateHandle(scope.row.id)">
                <i class="iconfont erp-icon-bianji"></i>
              </el-button>
              <el-button type="danger"
                         circle
                         v-if="isAuth('prod:prodskuparams:delete')"
                         title="删除"
                         @click="deleteSupHandle(scope.row.id)">
                <i class="iconfont erp-icon-shanchu"></i>
              </el-button>
            </template>
          </el-table-column>
        </el-table>
        <el-row>
          <pagination-all v-model="paginationData"
                          @paginationChangeHandle="getDataList"></pagination-all>
        </el-row>
        <add-or-update v-if="addOrUpdateVisible"
                       ref="addOrUpdate"
                       @refreshDataList="getDataList(1)"></add-or-update>
      </div>

    </el-main>
  </el-container>
</template>
<script>
// 搜索
import erpSearchPanel from '@/components/erp-search-panel'
// 分页
import paginationAll from '@/components/erp-pagination/pagination-all'
import AddOrUpdate from './basicsupport-add-or-update'
import { initData } from '@/mixins/initData.js'
import { prodskurulesList, prodskurulesInfo, prodskurulesDelete, prodskurulesSave, prodskurulesUpdate, prodskuparamsList, prodskuparamsDelete } from '@/api/basic/basic'
export default {
  mixins: [initData],
  components: {
    erpSearchPanel,
    paginationAll,
    AddOrUpdate
  },
  data () {
    return {
      treeData: [{
        id: '1',
        type: '1',
        label: '辅助资料类型',
        children: []
      }],
      defaultProps: {
        children: 'children',
        label: 'label'
      },
      addSupTypeForm: {
        key: '',
        name: '',
        bChecked: false,
        bAddname: false,
        orderIndex: ''
      },
      delSupInfoDis: true,
      addSupTypeRule: {
        key: [
          { required: true, message: '必填项', trigger: 'blur' }
        ],
        name: [
          { required: true, message: '必填项', trigger: 'blur' }
        ],
        orderIndex: [
          { required: true, message: '必填项', trigger: 'blur' },
          { pattern: /^[1-9]\d*$/, message: '正整数', trigger: 'change' }
        ]
      },
      addSupTypeVisible: false,
      supTypeDialog: false,
      // 数据过滤器
      searchData: {},
      // 下拉
      searchOptions: [
        {
          label: '名称',
          value: 'name',
          inputType: 'el-input'
        },
        {
          label: '编码',
          value: 'code',
          inputType: 'el-input'
        }
      ],

      // 是否禁用
      searchTF: true,
      // 发送批量禁用启用的数据
      searchTFs: {},
      dataForm: {
        key: '',
        code: '',
        name: '',
        addUser: '',
        addTime: ''
      },
      dataList: [],

      dataListLoading: false,
      dataListSelections: [],
      addOrUpdateVisible: false
    }
  },

  created () {
    this.getTypeData()
    this.getDataList()
  },
  methods: {
    // 关闭清除本次缓存
    clearCache (formName) {
      this.$refs[formName].resetFields()
      this.addSupTypeVisible = false
    },
    // 弹窗关闭之前
    handleClose (done) {
      this.clearCache('addSupTypeForm')
      done()
    },
    // 取消按钮
    cancel (formName) {
      this.clearCache(formName)
    },
    handleNodeClick (data) {
      if (data && data.key) {
        this.searchData['key'] = data.key
        this.getDataList(1)
      }
    },
    // 新增,编辑辅助类型弹窗
    addTypeHandle (data, type) {
      // Object.assign(this.$data, this.$options.data())
      this.addSupTypeForm = {
        key: '',
        name: '',
        bChecked: false,
        bAddname: false,
        orderIndex: ''
      }
      this.supTypeDialog = true
      this.addSupTypeVisible = true

      if (data) {
        prodskurulesInfo(data.id, true).then((data) => {
          this.addSupTypeForm = Object.assign({}, this.addSupTypeForm, data.prodSkuRules)
        }).catch(e => {
          this.notifyError(e.data.msg)
        })
      }
    },
    // 删除辅助类型
    deleteTypeHandle (data) {
      this.$confirm('确定删除该辅助类型吗?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        // 删除成功
        this.delSupType(data)
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        })
      })
    },
    delSupType (data) {
      let ids = this.$refs.tree.getCurrentKey()
      prodskurulesDelete([ids]).then(data => {
        this.getTypeData()
        this.notifySuccess('操作成功')
      }).catch(e => {
        this.notifyError(e.data.msg)
      })
    },
    // 新增/编辑-辅助类型
    basicsupportHttp () {
      // 新增
      if (!this.addSupTypeForm.id) {
        prodskurulesSave(this.addSupTypeForm).then((data) => {
          this.getTypeData()
          this.clearCache('addSupTypeForm')
          this.addSupTypeVisible = false
          this.notifySuccess('操作成功')
        }).catch((error) => {
          this.notifyError(error.data.msg)
        })
      }
      // 编辑
      if (this.addSupTypeForm.id) {
        prodskurulesUpdate(this.addSupTypeForm).then((data) => {
          this.getTypeData()
          this.clearCache('addSupTypeForm')
          this.addSupTypeVisible = false
          this.notifySuccess('操作成功')
        }).catch((error) => {
          this.notifyError(error.data.msg)
        })
      }
    },
    // 新增、编辑辅助类型的保存
    saveSupType: _.debounce(
      async function saveSupType () {
        this.$refs['addSupTypeForm'].validate((valid) => {
          if (valid) {
            this.basicsupportHttp()
          } else {
            return false
          }
        })
      }, 1000, { leading: true, trailing: false }
    ),
    // 获取辅助类型数据
    getTypeData () {
      prodskurulesList().then(data => {
        data.dataList.forEach(item => {
          this.$set(item, 'label', item.name)
          this.$set(item, 'type', '2')
        })
        this.treeData[0].children = data.dataList
      }).catch(e => {
        this.treeData[0].children = []
      })
    },
    // 获取辅助资料数据列表
    getDataList (val) {
      if (val != undefined) {
        this.paginationData.currPage = val
      }
      this.dataListLoading = true
      let requestData = Object.assign({}, this.paginationData, this.searchData === undefined ? {} : this.searchData)
      prodskuparamsList(requestData).then(data => {
        this.dataList = data.pageList.dataList
        this.paginationData.totalCount = data.pageList.page.totalCount
        this.dataListLoading = false
      }).catch(e => {
        this.dataList = []
        this.paginationData.totalCount = 0
        this.dataListLoading = false
      })
    },
    // 多选
    selectionChangeHandle (val) {
      this.dataListSelections = val
      if (this.dataListSelections.length > 0) {
        this.delSupInfoDis = false
      } else {
        this.delSupInfoDis = true
      }
    },
    // 新增 / 修改
    addOrUpdateHandle (id) {
      this.addOrUpdateVisible = true
      this.$nextTick(() => {
        this.$refs.addOrUpdate.init(id)
      })
    },
    // 删除辅助资料
    deleteSupHandle (id) {
      var ids = id
        ? [id]
        : this.dataListSelections.map(item => {
          return item.id
        })
      this.$confirm(`确定要删除所选择的数据信息吗？`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        prodskuparamsDelete(ids).then(data => {
          this.getDataList(1)
          this.notifySuccess('操作成功')
        }).catch(e => {
          this.notifyError(e.data.msg)
        })
      })
    }
  }
}
</script>
<style scoped>
.el-aside {
  margin-top: 20px;
  /* background-color: #ebeff4; */
  color: #333;
  /* text-align: center;
  line-height: 200px; */
}
.tree_content {
  /* margin-top: 20px;
  margin-left: 10px; */
  border-right: 1px solid #ccc;
  /* background-color: #f5f5f5; */
  min-height: 800px;
}
.el-checkbox + .el-checkbox {
  margin-left: 0px;
}
.custom-tree-node {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 14px;
  padding-right: 8px;
}
</style>

