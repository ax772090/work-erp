<template>
  <div>
    <div class="content">
      <el-tree :data="subOrgLists"
               :props="defaultProps"
               node-key="id"
               default-expand-all
               :expand-on-click-node="true">
        <span class="custom-tree-node"
              slot-scope="{ node, data }">
          <span>{{ node.label }}</span>
          <span class="amrbut">
            <el-button class
                       type="text"
                       size="mini"
                       icon="el-icon-plus"
                       round
                       @click="dialogFormAddbtn(data)">新增</el-button>
            <el-button class
                       type="text"
                       size="mini"
                       icon="el-icon-edit"
                       round
                       @click="dialogFormModifybtn(data)">编辑</el-button>
            <el-button class
                       type="text"
                       size="mini"
                       icon="el-icon-delete"
                       round
                       @click="dialogFormRemovebtn(data)">删除</el-button>
          </span>
        </span>
      </el-tree>
    </div>
    <!-- 添加弹出框 -->
    <el-dialog title="添加"
               :visible.sync="dialogFormAdd"
               v-if="dialogFormAdd"
               width="30%">
      <el-form :model="formup"
               ref="formup"
               :rules="formupRule">
        <el-form-item label="上级部门/公司"
                      :label-width="formLabelWidth">
          <el-select v-model="formup.superiorvalue_name"
                     placeholder="请选择公司或者部门"
                     :disabled="true">
            <el-option v-for="item in formup.parentdata"
                       :key="item.type"
                       :label="item.name"
                       :value="item.type"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="选择添加项"
                      :label-width="formLabelWidth">
          <el-select v-model="formup.org012value"
                     placeholder="添加类型"
                     v-on:change="change">
            <el-option v-for="item in formup.org012"
                       :key="item.key"
                       :label="item.value"
                       :value="item.key"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="名称"
                      prop="chname"
                      :label-width="formLabelWidth">
          <el-input v-model="formup.chname"
                    auto-complete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer"
           class="dialog-footer">
        <el-button @click="dialogFormAddbtn_no">取 消</el-button>
        <el-button type="primary"
                   @click="dialogFormAddbtn_yes">确 定</el-button>
      </div>
    </el-dialog>
    <!-- 修改弹出框 -->
    <el-dialog title="修改"
               :visible.sync="dialogFormModify"
               v-if="dialogFormModify"
               width="30%">
      <el-form :model="formModify"
               ref="formModify"
               :rules="formModifyRule"
               label-width="110px">
        <el-form-item label="名称"
                      prop="name">
          <el-input v-model="formModify.name"
                    auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="上级"
                      prop="parentName">
          <el-popover v-model="isTreeShow"
                      ref="menuListPopover"
                      placement="bottom-start"
                      trigger="click">
            <el-tree :data="subOrgLists"
                     :props="defaultProps"
                     node-key="orgId"
                     ref="upTree"
                     @current-change="currentChangeHander"
                     highlight-current
                     :expand-on-click-node="false"
                     class="tree-update-superior"></el-tree>
          </el-popover>
          <el-input v-model="formModify.parentName"
                    v-popover:menuListPopover
                    :readonly="true"
                    placeholder="点击选择上级"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer"
           class="dialog-footer">
        <el-button @click="dialogFormModifybtn_no"><i class="iconfont erp-icon-quxiao"></i>取 消</el-button>
        <el-button type="primary"
                   @click="dialogFormModifybtn_yes"><i class="iconfont erp-icon-queding"></i>确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
export default {
  data () {
    return {
      isTreeShow: false,
      defaultProps: {
        children: 'subOrgList',
        label: 'name'
      },
      // tree数据体
      subOrgLists: [],
      // orgListsss: "",
      // 判断是否弹窗
      dialogFormAdd: false,
      dialogFormModify: false,
      dialogFormRemove: false,
      // 保存当前列的数据以及保存输入的数据
      formup: {
        dialogFormAddbtn_text: '', // 数据传递
        chname: '',
        name: '',
        type: '',
        // 默认值和默认value
        superiorvalue_name: '',
        superiorvalue_value: '',
        // 判断是选择公司还是...
        org012: '',
        org012value: ''
      },
      formModify: {
        dialogFormModifybtn_text: '', // 数据传递
        name: '',
        select: '',
        type: '',
        parentName: '',
        modifyParentId: ''
      },
      FormRemove: {
        dialogFormRemovebtn_text: '', // 数据传递
        name: '',
        select: '',
        type: ''
      },
      formLabelWidth: '120px',
      value2: '',

      formupRule: {
        isRequired: [{ required: true, message: '必填项', trigger: 'blur' }],
        chname: [{ required: true, message: '必填项', trigger: 'blur' }]
      },
      formModifyRule: {
        isRequired: [{ required: true, message: '必填项', trigger: 'blur' }],
        name: [{ required: true, message: '必填项', trigger: 'blur' }]
      }
    }
  },
  mounted () {
    this.getDataList()
  },
  methods: {
    // 添加弹出框
    dialogFormAddbtn (data) {
      this.formup.org012 = ''
      this.formup.dialogFormAddbtn_text = data
      this.dialogFormAdd = true
      this.formup.chname = ''
      // 默认选择第一个
      this.formup.superiorvalue_name = this.formup.dialogFormAddbtn_text.name
      // 添加的是公司还是部门
      this.$http({
        url: this.$http.adornUrl('sys/organization/querySubType'),
        method: 'post',
        params: this.$http.adornParams({ type: data.type }, false)
      }).then(({ data }) => {
        if (data && data.code === 0) {
          this.formup.org012 = data.map
        }
      })
    },

    // 添加弹出框--确定
    dialogFormAddbtn_yes () {
      this.$refs.formup.validate(valid => {
        if (valid) {
          let dialogFormAddbtn_yes_data = this.formup.dialogFormAddbtn_text
          let parentId = this.formup.dialogFormAddbtn_text.parentId
          let orgIds = this.formup.dialogFormAddbtn_text.orgId
          let chname = this.formup.chname
          let type = this.superiorvalue_value

          this.$http({
            url: this.$http.adornUrl('sys/organization/save'),
            method: 'post',
            data: this.$http.adornData({
              parentId: orgIds,
              name: chname,
              type: type
            })
          }).then(({ data }) => {
            if (data && data.code === 0) {
              this.getDataList()
              this.$emit('refreshDataList')
              this.visible = false
              this.dialogFormAdd = false
              this.$notify.success({
                title: '成功',
                message: '添加成功',
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
        }
      })
    },

    // 添加弹出框--取消
    dialogFormAddbtn_no () {
      this.dialogFormAdd = false
    },

    // 修改弹出框
    dialogFormModifybtn (data) {
      this.formModify.dialogFormModifybtn_text = data
      this.formModify.name = data.name
      this.formModify.modifyParentId = data.parentId
      this.dialogFormModify = true
      this.$nextTick(() => {
        this.formModify.parentName = this.$refs.upTree.getNode(data.parentId).data.name// 获取父级名
      })
    },

    // 数据变化时
    currentChangeHander (data, node) {
      this.formModify.parentName = data.name// 获取父级名
      this.formModify.modifyParentId = data.orgId
      this.isTreeShow = true
    },

    // 修改弹出框--确定
    dialogFormModifybtn_yes: _.debounce(
      async function dialogFormModifybtn_yes () {
        this.$refs.formModify.validate(valid => {
          if (valid) {
            this.$http({
              url: this.$http.adornUrl('sys/organization/update'),
              method: 'post',
              data: this.$http.adornData({
                // parentId: this.formModify.dialogFormModifybtn_text.parentId,
                parentId: this.formModify.modifyParentId,
                orgId: this.formModify.dialogFormModifybtn_text.orgId,
                name: this.formModify.name
                // type: 1,
                // type: this.formModify.dialogFormModifybtn_text.type,
              })
            }).then(({ data }) => {
              if (data && data.code === 0) {
                this.getDataList()
                this.$emit('refreshDataList')
                this.visible = false
                this.dialogFormModify = false
                this.$notify.success({
                  title: '成功',
                  message: '修改成功',
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
          }
        })
      }, 1000, {
        leading: true,
        trailing: false
      }
    ),

    // 修改弹出框--取消
    dialogFormModifybtn_no () {
      this.dialogFormModify = false
    },

    // 删除弹出框
    dialogFormRemovebtn (data) {
      this.FormRemove.dialogFormRemovebtn_text = data
      this.$confirm('此操作将永久删除, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        // 删除成功
        this.dialogFormRemovebtn_yes()
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        })
      })
      // this.dialogFormRemove = true;
      // let remove_text = this.FormRemove.dialogFormRemovebtn_text
    },

    // 删除弹出框--确定
    dialogFormRemovebtn_yes: _.debounce(
      async function dialogFormRemovebtn_yes () {
        let remove_text = this.FormRemove.dialogFormRemovebtn_text
        if ((remove_text.subOrgList && remove_text.subOrgList.length <= 0) || (remove_text.orgId && remove_text.orgId !== 0)) {
          this.$http({
            url: this.$http.adornUrl('sys/organization/delete'),
            method: 'post',
            params: this.$http.adornParams({
              orgIds: remove_text.orgId
            })
          }).then(({ data }) => {
            if (data && data.code === 0) {
              this.getDataList()
              this.$emit('refreshDataList')
              this.visible = false
              this.dialogFormRemove = false
              this.$notify.success({
                title: '成功',
                message: '删除成功',
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
        } else {
          alert('1.不能删除根节点,2.当前节点还存在子节点,无法删除')
        }
      }, 1000, {
        leading: true,
        trailing: false
      }
    ),

    // 删除弹出框--取消
    dialogFormRemovebtn_no () {
      this.dialogFormRemove = false
    },

    // 当页面加载完结构，获得列表数据
    getDataList () {
      this.$http({
        url: this.$http.adornUrl('sys/organization/list'),
        method: 'get',
        params: this.$http.adornParams({
          // 'hehe': "hehe"
        })
      }).then(({ data }) => {
        if (data && data.code === 0) {
          this.subOrgLists = data.orgList
        }
      })
    },
    // 添加弹出框中,选择公司结构后拿到的值
    change (data) {
      this.superiorvalue_value = data
    }
  }
}
</script>

<style scoped>
/* 外壳 */
.custom-tree-node {
  width: 100%;
  height: 30px;
  line-height: 30px;
}
/* 三个按钮的span */
.amrbut {
  float: right;
}
.content {
  width: 40%;
  min-width: 600px;
}
</style>

<style>
.tree-update-superior.el-tree--highlight-current
  .el-tree-node.is-current
  > .el-tree-node__content {
  background-color: #ffffcc;
}
</style>
