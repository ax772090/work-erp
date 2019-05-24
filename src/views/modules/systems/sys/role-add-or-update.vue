<template>
  <el-dialog :title="!dataForm.id ? '角色新增' : '角色修改'"
             :close-on-click-modal="false"
             :visible.sync="visible"
             @close="$refs['dataForm'].resetFields()"
             width="50%">
    <el-form :model="dataForm"
             :rules="dataRule"
             ref="dataForm"
             label-width="80px">
      <el-form-item label="角色名称"
                    prop="roleName">
        <el-input v-model.trim="dataForm.roleName"
                  placeholder="角色名称"></el-input>
      </el-form-item>
      <el-form-item label="备注"
                    prop="remark">
        <el-input v-model="dataForm.remark"
                  placeholder="备注"></el-input>
      </el-form-item>
      <el-form-item size="mini"
                    label="授权">
        <el-tree :data="menuList"
                 :props="menuListTreeProps"
                 node-key="menuId"
                 ref="menuListTree"
                 show-checkbox
                 :expand-on-click-node="false"
                 @check="checkHandle"
                 @check-change="checkChangeHandle">
          <span class="custom-tree-node"
                slot-scope="{ node, data }">
            <span>{{ node.label }}</span>
            <span class="amrbut">
              <el-radio-group v-if="(data.type === 2) && (data.menuLevel === 10 || data.menuLevel === 20 || data.menuLevel === 30)"
                              v-model="data.menuLevel"
                              ref="radioGroup"
                              size="mini">
                <el-radio :label="10"
                          border>个人</el-radio>
                <el-radio :label="20"
                          border>部门</el-radio>
                <el-radio :label="30"
                          border>公司</el-radio>
              </el-radio-group>
              <!-- <el-checkbox-group v-if="data.type === 2"
                                 v-model="data.menuLevel"
                                 size="mini"
                                 @change="handleCheckedCitiesChange">
                <el-checkbox v-for="item in checkbox"
                             :key="item.id"
                             :label="item.id"
                             border>{{item.Cname}}</el-checkbox>
              </el-checkbox-group> -->
              <div v-if="data.type !== 2">
                <el-button class="buttonType"
                           size="mini"
                           @click="dialogFormRemovebtn(data, node, 10)">个人</el-button>
                <el-button class="buttonType"
                           size="mini"
                           @click="dialogFormRemovebtn(data, node, 20)">部门</el-button>
                <el-button class="buttonType"
                           size="mini"
                           @click="dialogFormRemovebtn(data, node, 30)">公司</el-button>
              </div>

            </span>
          </span>
        </el-tree>
      </el-form-item>
    </el-form>
    <span slot="footer"
          class="dialog-footer">
      <el-button @click="visible = false"><i class="iconfont erp-icon-quxiao"></i>取消</el-button>
      <el-button type="primary"
                 @click="dataFormSubmit()"><i class="iconfont erp-icon-queding"></i>确定</el-button>
    </span>
  </el-dialog>
</template>

<script>
import { treeDataTranslate } from '@/utils'
export default {
  data () {
    return {
      visible: false,
      menuList: [],
      menuIdArr: [], // 勾选数组
      menuListTreeProps: {
        label: 'name',
        children: 'children'
      },
      checkbox: [{
        id: '111',
        Cname: '个人',
        menuLevel: 10
      }, {
        id: '222',
        Cname: '部门',
        menuLevel: 20
      }, {
        id: '333',
        Cname: '公司',
        menuLevel: 30
      }],
      dataForm: {
        id: '',
        roleName: '',
        remark: '',
        aaa: []
      },
      dataRule: {
        roleName: [
          { required: true, message: '角色名称不能为空', trigger: 'blur' }
        ]
      },
      tempKey: -666666 // 临时key, 用于解决tree半选中状态项不能传给后台接口问题. # 待优化
    }
  },
  methods: {
    init (id) {
      this.dataForm.id = id
      if (this.dataForm.id) {
        this.menuList = []
        this.menuIdArr = []
        this.menuRoleData = {}
        this.$http({
          url: this.$http.adornUrl(`sys/role/info/${this.dataForm.id}`),
          method: 'get',
          params: this.$http.adornParams()
        }).then(({ data }) => {
          if (data && data.code === 0) {
            this.menuRoleData = data// 为了解决下一步初始化数据后数据被清空
            // this.dataForm.roleName = data.role.roleName
            // this.dataForm.remark = data.role.remark
            this.menuIdArr = this.menuRoleData.menu
            this.menuList = treeDataTranslate(this.menuRoleData.menu, 'menuId')
          }
        }).then(() => {
          this.visible = true
          this.$nextTick(() => {
            this.$refs['dataForm'].resetFields()
            this.$refs.menuListTree.setCheckedKeys([])
          })
          this.$nextTick(() => {
            for (const item of this.menuIdArr) {
              if (item.menuLevel) {
                this.menuIdArr.push(item.menuId)
              }
            }
            this.$refs.menuListTree.setCheckedKeys(this.menuIdArr)// 勾选
          })
        }).then(() => {
          this.dataForm.roleName = this.menuRoleData.role.roleName
          this.dataForm.remark = this.menuRoleData.role.remark
        })
      } else {
        // 新增
        this.$http({
          url: this.$http.adornUrl('sys/menu/list'),
          method: 'get',
          params: this.$http.adornParams()
        }).then(({ data }) => {
          this.menuList = treeDataTranslate(data, 'menuId')
        }).then(() => {
          this.visible = true
          this.$nextTick(() => {
            this.$refs.menuListTree.setCheckedNodes([])
          })
        })
      }
    },

    // 当复选框被点击的时候触发
    checkHandle (present, list) {
      // present.menuLevel = 10
      // this.$refs.menuListTree.setCheckedKeys(list.checkedKeys)// 勾选
    },

    judgeChildren (present, isPresent) {
      if (present.hasOwnProperty('children')) {
        present.menuLevel = null
        for (const item of present.children) {
          this.judgeChildren(item, isPresent)
        }
      } else {
        if (isPresent) {
          if (present.menuLevel === 10 || present.menuLevel === 20 || present.menuLevel === 30) { // 原因:
          } else {
            present.menuLevel = 10
          }
        } else {
          present.menuLevel = null
        }
      }
    },

    // 节点选中状态发生变化时的回调
    checkChangeHandle (present, isPresent, isChildren) {
      if (!isChildren) { // 当最后一个子节点改变后悔影响当前父节点,会在执行一次checkChangeHandle,这里主要隔离
        this.judgeChildren(present, isPresent)
      }
    },

    // // 多选改单选
    // handleCheckedCitiesChange (value) {
    //   if (value.length > 1) {
    //     value.splice(0, 1)
    //   }
    // },

    // data数据处理
    typeChildrenData (data, type) {
      if (data.hasOwnProperty('children')) {
        data.menuLevel = null
        for (const item of data.children) {
          this.typeChildrenData(item, type)
        }
      } else {
        data.menuLevel = type
      }
    },

    // node数据处理
    typeChildrenNode (node, type) {
      if (node.hasOwnProperty('childNodes')) {
        node.checked = true
        for (const item of node.childNodes) {
          this.typeChildrenNode(item, type)
        }
      } else {
        // node.checked = true
      }
    },

    dialogFormRemovebtn (data, node, type) {
      this.typeChildrenData(data, type)
      this.$refs.menuListTree.setChecked(data, true, true)
    },

    // 表单提交
    dataFormSubmit () {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          this.$http({
            url: this.$http.adornUrl(`sys/role/${!this.dataForm.id ? 'save' : 'update'}`),
            method: 'post',
            data: this.$http.adornData({
              'roleId': this.dataForm.id,
              'roleName': this.dataForm.roleName,
              'remark': this.dataForm.remark,
              // 'menuList': this.$refs.menuListTree.getCheckedNodes()
              'menuList': [].concat(this.$refs.menuListTree.getCheckedNodes(), [], this.$refs.menuListTree.getHalfCheckedNodes())
              // 'menuIdList': this.$refs.menuListTree.getCheckedKeys()
              // 'menuIdList': [].concat(this.$refs.menuListTree.getCheckedKeys(), [this.tempKey], this.$refs.menuListTree.getHalfCheckedKeys())
            })
          }).then(({ data }) => {
            if (data && data.code === 0) {
              this.$emit('refreshDataList')
              this.visible = false
              this.$notify.success({
                message: '操作成功',
                duration: 5000
              })
            } else {
              this.$notify.error({
                title: '错误',
                message: '保存失败,' + data.msg,
                duration: 5000
              })
            }
          })
        }
      })
    }
  }
}
</script>
<style scoped>
/* 中部 */
.el-dialog__body {
  overflow: hidden;
}
.custom-tree-node {
  width: 100%;
  height: 30px;
  line-height: 30px;
}
.amrbut {
  float: right;
}
.buttonType {
  /* 73x28 */
  width: 70px;
}
</style>
