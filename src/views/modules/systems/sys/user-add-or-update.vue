<template>
  <!-- :before-close='openDialog' -->
  <el-dialog :title="!dataForm.userId ? '用户新增' : '用户修改'"
             :close-on-click-modal="false"
             :visible.sync="visible"
             @close="activeCompany.roleIds=[];dataForm.compRoleMap={};$refs['dataForm'].resetFields();">
    <el-form :model="dataForm"
             :rules="dataRule"
             ref="dataForm"
             @keyup.enter.native="dataFormSubmit()"
             label-width="80px">
      <el-row>
        <el-col :span="12">
          <el-form-item label="账号"
                        prop="userNo">
            <el-input v-model="dataForm.userNo"></el-input>
          </el-form-item>
          <el-form-item label="密码"
                        prop="password">
            <el-input v-model="dataForm.password"
                      type="password"
                      :placeholder="'密码'+(dataForm.userId?',修改密码时输入':'')"></el-input>
          </el-form-item>
          <el-form-item label="邮箱"
                        prop="email">
            <el-input v-model="dataForm.email"></el-input>
          </el-form-item>
          <!-- 公司 -->
          <el-form-item label="公司"
                        prop="compId">
            <select-all v-model="dataForm.compId"
                        :listDataOption="compIdOptions"
                        data-value="orgId"
                        data-label="name"
                        :isSelectChange="true"
                        @selectChange="companyChange"></select-all>
          </el-form-item>
          <!-- 部门 -->
          <el-form-item label="部门"
                        prop="departId">
            <el-cascader v-model="departId"
                         :options="departIdOptions"
                         :props="{value: 'orgId', label: 'name', children: 'subOrgList'}"
                         @change="departChange"
                         change-on-select
                         clearable
                         filterable></el-cascader>
          </el-form-item>

        </el-col>
        <el-col :span="12">
          <el-form-item label="用户名"
                        prop="username">
            <el-input v-model="dataForm.username"></el-input>
          </el-form-item>
          <el-form-item label="确认密码"
                        prop="comfirmPassword">
            <el-input v-model="dataForm.comfirmPassword"
                      type="password"
                      :placeholder="'确认密码'+(dataForm.userId?',修改密码时输入':'')"></el-input>
          </el-form-item>
          <!-- <el-form-item label="密码" prop="password" :class="{ 'is-required': !dataForm.userId }"> -->
          <el-form-item label="手机号"
                        prop="mobile">
            <el-input v-model="dataForm.mobile"></el-input>
          </el-form-item>
          <el-form-item label="状态"
                        prop="status">
            <el-radio-group v-model="dataForm.status">
              <el-radio :label="false">禁用</el-radio>
              <el-radio :label="true">正常</el-radio>
            </el-radio-group>
          </el-form-item>
          <!-- 授权店铺 -->
          <el-form-item label="授权店铺"
                        prop="channelList">
            <el-radio v-model="dataForm.authorizeType"
                      label="ALL">所有店铺</el-radio>
            <el-radio v-model="dataForm.authorizeType"
                      label="SPECIFY">指定店铺</el-radio>
            <el-radio v-model="dataForm.authorizeType"
                      label="NONE">不指定店铺</el-radio>
            <select-all v-model="dataForm.channelList"
                        :listDataOption="saleShopIdOptions"
                        data-value="id"
                        v-if="dataForm.authorizeType == 'SPECIFY'"
                        data-label="name"
                        :isMultiple="true"></select-all>
          </el-form-item>
        </el-col>
      </el-row>
      <!-- 点击公司表格,穿梭框数据变化 -->
      <el-row :gutter="20">
        <el-col :span="8">
          <div class="grid-content bg-purple">
            <el-table :data="companyList"
                      @row-click="getRoleListByCompany"
                      stripe
                      border
                      highlight-current-row>
              <el-table-column align="left"
                               prop="name"
                               label="公司"
                               width="300px">
                <template slot-scope="scope">
                  <el-badge :value="roleCount[scope.row.orgId] "
                            :max="10"
                            class="el-badge-item">
                    <el-radio-group :value="activeCompany.orgId==scope.row.orgId?true:false">
                      <el-radio :label="true">{{scope.row.name}}</el-radio>
                    </el-radio-group>
                  </el-badge>
                </template>
              </el-table-column>
            </el-table>
          </div>
        </el-col>

        <!-- 角色穿梭框 -->
        <el-col :span="16">
          <div class="grid-content bg-purple">
            <div class="t-center">
              <el-transfer :data="roleList"
                           class="t-left"
                           v-model="activeCompany.roleIds"
                           filterable
                           :render-content="dataForm.renderFunc"
                           :titles="['可选择角色', '已选择角色']"
                           :button-texts="['删除角色', '添加角色']"
                           :format="{
                  noChecked: '${total}',
                  hasChecked: '${checked}/${total}'
                }"
                           @change="handleChange"
                           :props="{
                  key: 'roleId',
                  label: 'roleName',
                }"></el-transfer>
            </div>
          </div>
        </el-col>
      </el-row>
    </el-form>
    <span slot="footer"
          class="dialog-footer">
      <el-button @click="cancel('dataForm')">
        <i class="iconfont erp-icon-quxiao"></i>取消</el-button>
      <el-button type="primary"
                 @click="dataFormSubmit()">
        <i class="iconfont erp-icon-queding"></i>确定</el-button>
    </span>
  </el-dialog>
</template>

<script>
import { isEmail, isMobile } from '@/utils/validate'
import selectAll from '@/components/erp-select/select-all'

export default {
  components: {
    selectAll
  },

  data () {
    var validatePassword = (rule, value, callback) => {
      if (!this.dataForm.userId && !/\S/.test(value)) {
        callback(new Error('密码不能为空'))
      } else {
        callback()
      }
    }
    var validateComfirmPassword = (rule, value, callback) => {
      if (this.dataForm.password !== value && this.dataForm.password) {
        callback(new Error('确认密码与密码输入不一致'))
      } else {
        callback()
      }
    }
    var validateEmail = (rule, value, callback) => {
      var filter = /^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/
      if (!filter.test(value.trim())) {
        callback(new Error('邮箱格式错误'))
      } else {
        callback()
      }
    }
    var validateMobile = (rule, value, callback) => {
      if (!isMobile(value.trim())) {
        callback(new Error('手机号格式错误'))
      } else {
        callback()
      }
    }

    return {
      // 公式下拉数据体
      compIdOptions: [],
      // 部门下拉数据
      departIdOptions: [],
      // 部门下拉,传入的公司id
      filterDepartment: {
        orgId: ''
      },
      // 是否弹出窗口
      visible: false,

      // 所有待授权公司列表
      companyList: [],

      // 所有角色列表
      roleList: [],

      // 当前被激活的公司
      activeCompany: {
        orgId: '',
        // 已选择的角色ID
        roleIds: []
      },

      // 各公司的选择的角色数量
      roleCount: {},
      // 密码保存保存用
      passwordCopy: '',

      // 授权店铺
      saleShopIdOptions: [],
      // 部门数组
      departId: [],

      // 表单数据
      dataForm: {
        // 当选择修改的时候的id
        userId: '',
        username: '',
        channelList: [],
        // 所有店铺
        authorizeType: '',
        // 判断是否改过密码
        password: '',
        comfirmPassword: '',
        salt: '',
        email: '',
        mobile: '',
        status: true,
        // 选择的角色=>穿梭框
        compRoleMap: {},
        compId: '',
        departId: '',
        renderFunc (h, option) {
          return <span>{option.roleName}</span>
        }
      },
      dataRule: {
        userNo: [
          { required: true, message: '用户账号不能为空', trigger: 'blur' }
        ],
        username: [
          { required: true, message: '用户名不能为空', trigger: 'blur' }
        ],

        password: [{ validator: validatePassword, trigger: 'blur' }],

        comfirmPassword: [
          { message: '密码不能为空', trigger: 'blur' },
          { validator: validateComfirmPassword, trigger: 'blur' }
        ],

        email: [
          { required: true, message: '邮箱不能为空', trigger: 'blur' },
          { validator: validateEmail, trigger: 'blur' }
        ],

        mobile: [
          { required: true, message: '手机号不能为空', trigger: 'blur' },
          { validator: validateMobile, trigger: 'blur' }
        ],

        compId: [],

        departId: [{ required: true, message: '部门不能为空', trigger: 'change' }]
      }
    }
  },
  methods: {
    // 取消按钮
    cancel (formName) {
      this.clearCache(formName)
    },
    // 关闭清除本次缓存
    clearCache (formName) {
      this.$refs[formName].resetFields()
      this.dataForm = {}
      this.searchData = {}
      this.visible = false
    },
    // 弹窗关闭之前
    handleClose (done) {
      this.clearCache('dataForm')
      done()
    },
    // 弹窗的时候调用
    init (id) {
      this.departId = []
      this.dataForm.channelList = []
      this.dataForm.authorizeType = ''
      this.dataForm.comfirmPassword = ''
      this.dataForm.userId = id
      // this.dataForm.status = true;
      this.$nextTick(() => {
        this.visible = true
        // this.$refs['dataForm'].resetFields()
        this.compIdOptionsData()
        this.getProdData()
        this.loadRoleList()
        // 授权店铺
        this.$http
          .get(this.$http.adornUrl('basic/basicchannel/listcombobox'))
          .then(({ data }) => {
            this.saleShopIdOptions = data.list
          })
        // 点击修改查询用户信息
        if (id) {
          this.$http({
            url: this.$http.adornUrl(`sys/user/info/${this.dataForm.userId}`),
            method: 'get',
            params: this.$http.adornParams()
          }).then(({ data }) => {
            if (data && data.code === 0) {
              // this.departIdOptions = data.user.departList;//这里是之前的逻辑
              this.filterDepartment.orgId = data.user.compId // 为了解决修改时候,清空部门数据问题
              this.departIdOptionsData()// 根据公司过滤出部门
              this.dataForm = data.user
              this.$set(this.dataForm, 'comfirmPassword', '')
              if (data.user.levelPath) {
                this.departId = data.user.levelPath.split('.').splice(1)
              } else {
                this.departId = []
              }
              this.dataForm.password = ''
              // this.dataForm.comfirmPassword = ''
              this.dataForm.userId = data.user.userId
              if (this.dataForm.channelList === null) {
                this.dataForm.channelList = []
              }
            }
            // 默认选择第一家公司的角色
            if (this.dataForm.compRoleMap) {
              for (var key in this.dataForm.compRoleMap) {
                if (key === this.companyList[0].orgId) {
                  this.activeCompany.roleIds = this.dataForm.compRoleMap[key]
                }
              }
            } else {
              this.activeCompany.roleIds = [] // 如果没数据就清空缓存
            }
            // 统计各公司被选中的数量
            if (this.companyList) {
              this.companyList.forEach(item => {
                let count = ''
                if (
                  this.dataForm.compRoleMap &&
                  this.dataForm.compRoleMap[item.orgId]
                ) {
                  count = this.dataForm.compRoleMap[item.orgId].length
                }
                this.$set(this.roleCount, item.orgId, count)
                item.roleCount = count
              })
            }
          })
        }
      })
    },
    // 公司下拉
    compIdOptionsData () {
      this.$http
        .get(this.$http.adornUrl(`sys/organization/select`))
        .then(({ data }) => {
          this.filterDepartment.orgId = ''
          this.compIdOptions = data.companyList
        })
    },
    // 部门
    // departIdOptionsData() {
    //   this.$http
    //     .get(
    //       this.$http.adornUrl(
    //         `sys/organization/query?orgId=${this.filterDepartment.orgId}`
    //       )
    //     )
    //     .then(({ data }) => {
    //       this.dataForm.departId = "";
    //       this.departIdOptions = data.departList;
    //     });
    // },
    departIdOptionsData () {
      this.$http.get(this.$http.adornUrl(`sys/organization/sortSpecifyNodeId`), { params: {
          nodeId: this.filterDepartment.orgId
        } })
        .then(({ data }) => {
          // this.dataForm.departId = "";
          this.departIdOptions = data.list
        })
    },
    // 部门触发
    departChange (value) {
      this.dataForm.departId = value[value.length - 1]
    },
    // 加载公司,为选择角色准备数据
    getProdData () {
      this.$http({
        url: this.$http.adornUrl('sys/organization/select'),
        method: 'get'
        // params: this.$http.adornParams({}, false)
      }).then(({ data }) => {
        if (data && data.code === 0) {
          this.companyList = data.companyList

          // 统计各公司被选中的数量
          if (this.companyList) {
            this.companyList.forEach(item => {
              this.$set(this.roleCount, item.orgId, '')
            })
          }

          this.loadRoleList()
          // 4-显示第一家公司对应的角色
          if (this.companyList && this.dataForm.userId) {
            // 这里加上this.dataForm.userId主要解决修改时缓存问题
            this.getRoleListByCompany(this.companyList[0])
          }
          this.activeCompany.orgId = this.companyList[0].orgId // 默认第一家公司id
        }
      })
    },
    // 获取所有角色数据
    loadRoleList () {
      this.$http({
        url: this.$http.adornUrl('sys/role/select'),
        method: 'get',
        params: this.$http.adornParams()
      }).then(({ data }) => {
        if (data && data.code === 0) {
          this.roleList = data.roleList
        }
      })
    },

    // 点击公司列表得到缓存的角色
    getRoleListByCompany (row, event, column) {
      this.activeCompany.orgId = row.orgId // 保存当前公司id,主要是为了保存时候使用
      this.activeCompany.roleIds = []
      if (this.dataForm.compRoleMap) {
        this.activeCompany.roleIds = this.dataForm.compRoleMap[row.orgId]
      }
    },

    // 穿梭框bgin=>当穿梭框选择的时候改变缓存
    handleChange (value, direction, movedKeys) {
      this.dataForm.compRoleMap[this.activeCompany.orgId] = value // 选中的角色ID[]

      // 获取选择角色的数量
      this.companyList.forEach(item => {
        if (item.orgId === this.activeCompany.orgId) {
          this.roleCount[this.activeCompany.orgId] = value ? value.length : ''
        }
      })
    },
    // 公司下拉选中后触发
    companyChange (data) {
      // 注意:判断这个的原因是防止点击修改时候清空部门数据
      if (this.filterDepartment.orgId === data) {
        return
      }
      this.filterDepartment.orgId = data
      this.departId = [] // 改变公司时清空部门绑定数据
      this.departIdOptionsData()
    },

    // 表单提交
    dataFormSubmit: _.debounce(
      async function dataFormSubmit () {
        this.$refs['dataForm'].validate(valid => {
          if (valid) {
            if (
              this.dataForm.authorizeType === 'ALL' ||
              this.dataForm.authorizeType === 'NONE'
            ) {
              this.dataForm.channelList = []
            }
            this.$http({
              url: this.$http.adornUrl(
                `sys/user/${!this.dataForm.userId ? 'save' : 'update'}`
              ),
              method: 'post',
              data: this.$http.adornData(this.dataForm, false)
            }).then(({ data }) => {
              if (data && data.code === 0) {
                this.$emit('refreshDataList')
                this.visible = false
                this.$notify.success({
                  title: '成功',
                  message: '操作成功',
                  duration: 1000
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

    // 点击取消按钮
    cancel () {
      this.visible = false
    }
  }
}
</script>
<style scoped>
.el-badge-item {
  margin-top: 10px;
}
.t-center {
  text-align: center;
}
.t-left{
  text-align: left; 
  display: inline-block
}
</style>
