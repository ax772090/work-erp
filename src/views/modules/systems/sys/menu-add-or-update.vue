<template>
  <el-dialog :title="!dataForm.id ? '新增' : '修改'"
             :close-on-click-modal="false"
             :visible.sync="visible"
             @close="$refs['dataForm'].resetFields()"
             width="30%">
    <el-form :model="dataForm"
             :rules="dataRule"
             ref="dataForm"
             label-width="80px">
      <el-form-item label="类型"
                    prop="type">
        <el-radio-group v-model="dataForm.type">
          <el-radio v-for="(type, index) in dataForm.typeList"
                    :label="index"
                    :key="index">{{ type }}</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item :label="dataForm.typeList[dataForm.type] + '名称'"
                    prop="name">
        <el-input v-model="dataForm.name"
                  :placeholder="dataForm.typeList[dataForm.type] + '名称'"></el-input>
      </el-form-item>
      <el-form-item label="上级菜单"
                    prop="parentName">
        <el-popover v-model="qwe"
                    ref="menuListPopover"
                    placement="bottom-start"
                    trigger="click">
          <el-tree :data="menuList"
                   :props="menuListTreeProps"
                   node-key="menuId"
                   ref="menuListTree"
                   @current-change="menuListTreeCurrentChangeHandle"
                   :highlight-current="true"
                   :expand-on-click-node="false"></el-tree>
        </el-popover>
        <el-input v-model="dataForm.parentName"
                  v-popover:menuListPopover
                  :readonly="true"
                  placeholder="点击选择上级菜单"
                  class="menu-list__input"></el-input>
      </el-form-item>
      <el-form-item v-if="dataForm.type === 1"
                    label="菜单路由"
                    prop="url">
        <el-input v-model="dataForm.url"
                  placeholder="菜单路由"></el-input>
      </el-form-item>
      <el-form-item v-if="dataForm.type !== 0"
                    label="授权标识"
                    prop="perms">
        <el-input v-model="dataForm.perms"
                  placeholder="多个用逗号分隔, 如: user:list,user:create"></el-input>
      </el-form-item>
      <el-form-item v-if="dataForm.type !== 2"
                    label="排序号"
                    prop="orderNum">
        <el-input-number v-model="dataForm.orderNum"
                         controls-position="right"
                         :min="0"
                         label="排序号"></el-input-number>
      </el-form-item>
      <el-form-item v-if="dataForm.type !== 2"
                    label="菜单图标"
                    prop="icon">
        <el-row>
          <el-col :span="22">
            <el-popover ref="iconListPopover"
                        placement="bottom-start"
                        trigger="click"
                        popper-class="mod-menu__icon-popover">
              <div class="mod-menu__icon-list">
                <el-button v-for="(item, index) in iconList"
                           :key="index"
                           @click="iconActiveHandle(item.className)"
                           :class="{ 'is-active': item.className === dataForm.icon }">
                  <!-- <icon-svg :name="item"></icon-svg> -->
                   <i :class="'iconfont ' + item.className"></i>
                </el-button>
              </div>
            </el-popover>
            <el-input v-model="dataForm.icon"
                      v-popover:iconListPopover
                      clearable
                      placeholder="菜单图标名称"
                      class="icon-list__input"></el-input>
          </el-col>
          <!-- <el-col :span="2"
                  class="icon-list__tips">
            <el-tooltip placement="top"
                        effect="light">
              <div slot="content">全站推荐使用SVG Sprite, 详细请参考:
                <a href="//github.com/daxiongYang/renren-fast-vue/blob/master/src/icons/index.js"
                   target="_blank">icons/index.js</a>描述
              </div>
              <i class="el-icon-warning"></i>
            </el-tooltip>
          </el-col> -->
        </el-row>
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
import Icon from '@/icons'
export default {
  data () {
    var validateUrl = (rule, value, callback) => {
      if (this.dataForm.type === 1 && !/\S/.test(value)) {
        callback(new Error('菜单URL不能为空'))
      } else {
        callback()
      }
    }
    var validateName = (rule, value, callback) => {
      if (this.dataForm.type === 0 && !/\S/.test(value)) {
        callback(new Error('目录不能为空'))
      } else if (this.dataForm.type === 1 && !/\S/.test(value)) {
        callback(new Error('菜单不能为空'))
      } else if (this.dataForm.type === 2 && !/\S/.test(value)) {
        callback(new Error('按钮不能为空'))
      } else {
        callback()
      }
    }
    return {
      visible: false,
      qwe: false,
      dataForm: {
        id: 0,
        type: 1,
        typeList: ['目录', '菜单', '按钮'],
        name: '',
        parentId: 0,
        parentName: '',
        url: '',
        perms: '',
        orderNum: 0,
        icon: '',
        iconList: []
      },
      dataRule: {
        name: [
          {
            required: true,
            message: '目录/菜单/按钮名称不能为空',
            trigger: 'blur'
          }
          // { validator: validateName, trigger: 'blur' }
        ],
        parentName: [
          { required: true, message: '上级菜单不能为空', trigger: 'change' }
        ],
        url: [
          { required: true, message: '菜单路由不能为空', trigger: 'blur' },
          { validator: validateUrl, trigger: 'blur' }
        ]
      },
      menuList: [],
      menuListTreeProps: {
        label: 'name',
        children: 'children'
      }
    }
  },
  created () {
     var iconData = require('@/assets/icondata/icon.json')
     this.iconList = iconData.iconList
  },
  methods: {
    init (id) {
      this.dataForm.id = id
      this.$http({
        url: this.$http.adornUrl('sys/menu/select'),
        method: 'get',
        params: this.$http.adornParams()
      })
        .then(({ data }) => {
          this.menuList = treeDataTranslate(data.menuList, 'menuId')
        })
        .then(() => {
          this.visible = true
          // this.$nextTick(() => {
          //   this.$refs['dataForm'].resetFields()
          // })
        })
        .then(() => {
          if (!this.dataForm.id) {
            // 新增
            this.menuListTreeSetCurrentNode()
            // 清除新增时的缓存
            this.dataForm.parentName = ''
            this.dataForm.url = ''
            this.dataForm.icon = ''
            this.dataForm.perms = ''
          } else {
            // 修改
            this.$http({
              url: this.$http.adornUrl(`sys/menu/info/${this.dataForm.id}`),
              method: 'get',
              params: this.$http.adornParams()
            }).then(({ data }) => {
              this.dataForm.id = data.menu.menuId
              this.dataForm.type = data.menu.type
              this.dataForm.name = data.menu.name
              this.dataForm.parentId = data.menu.parentId
              this.dataForm.url = data.menu.url
              this.dataForm.perms = data.menu.perms
              this.dataForm.orderNum = data.menu.orderNum
              this.dataForm.icon = data.menu.icon

              this.menuListTreeSetCurrentNode()
            })
          }
        })
    },
    // 菜单树选中
    menuListTreeCurrentChangeHandle (data, node) {
      this.dataForm.parentId = data.menuId
      this.dataForm.parentName = data.name
      if (this.dataForm.parentName !== '一级菜单') {
        this.qwe = false
      }
    },
    // 菜单树设置当前选中节点
    menuListTreeSetCurrentNode () {
      this.$refs.menuListTree.setCurrentKey(this.dataForm.parentId)
      this.dataForm.parentName = (this.$refs.menuListTree.getCurrentNode() ||
        {})['name']
    },
    // 图标选中
    iconActiveHandle (className) {
      this.dataForm.icon = className
    },
    // 表单提交
    dataFormSubmit: _.debounce(
      async function dataFormSubmit () {
        this.$refs['dataForm'].validate(valid => {
          if (valid) {
            this.$http({
              url: this.$http.adornUrl(
                `sys/menu/${!this.dataForm.id ? 'save' : 'update'}`
              ),
              method: 'post',
              data: this.$http.adornData({
                menuId: this.dataForm.id,
                type: this.dataForm.type,
                name: this.dataForm.name,
                parentId: this.dataForm.parentId,
                url: this.dataForm.url,
                perms: this.dataForm.perms,
                orderNum: this.dataForm.orderNum,
                icon: this.dataForm.icon
              })
            }).then(({ data }) => {
              if (data && data.code === 0) {
                this.visible = false
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
          }
        })
      },
      1000,
      {
        leading: true,
        trailing: false
      }
    )
  }
}
</script>

<style lang="scss">
.mod-menu {
  .menu-list__input,
  .icon-list__input {
    > .el-input__inner {
      cursor: pointer;
    }
  }
  &__icon-popover {
    max-width: 370px;
  }
  &__icon-list {
    max-height: 180px;
    padding: 0;
    margin: -8px 0 0 -8px;
    > .el-button {
      padding: 8px;
      margin: 8px 0 0 8px;
      > span {
        display: inline-block;
        vertical-align: middle;
        width: 18px;
        height: 18px;
        font-size: 18px;
      }
    }
  }
  .icon-list__tips {
    font-size: 18px;
    text-align: center;
    color: #e6a23c;
    cursor: pointer;
  }
}
.el-popover.el-popper {
  max-height: 400px;
  overflow-y: auto;
  min-width: 400px;
}
</style>
