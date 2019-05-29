<template>
  <el-dialog :title="!dataForm.id ? '产品分类新增' : '产品分类修改'"
             :close-on-click-modal="false"
             :visible.sync="visible"
             width="30%"
             @close="$refs['dataForm'].resetFields()">
    <el-form :model="dataForm"
             :rules="dataRule"
             ref="dataForm"
             label-width="110px">
      <el-row>
        <el-form-item label="产品分类名称"
                      prop="name">
          <el-input v-model="dataForm.name"
                    placeholder="产品分类名称"></el-input>
        </el-form-item>
        <el-form-item label="产品分类编码"
                      prop="code">
          <el-input v-model="dataForm.code"></el-input>
        </el-form-item>
        <el-form-item label="上级分类"
                      prop="parentId">
          <el-cascader v-model="parentId"
                       :options="parentIdOptions"
                       :props="{value: 'id', label: 'name', children: 'subCategoryNode'}"
                       change-on-select
                       clearable
                       filterable></el-cascader>
        </el-form-item>
        <el-form-item label="备注"
                      prop="remarks">
          <textarea-all v-model="dataForm.remarks"></textarea-all>
        </el-form-item>
        <el-form-item label="状态"
                      size="mini"
                      prop="bUsed">
          <el-radio-group v-model="dataForm.bUsed">
            <el-radio :label="false">禁用</el-radio>
            <el-radio :label="true">正常</el-radio>
          </el-radio-group>
        </el-form-item>
      </el-row>
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
import selectAll from '@/components/erp-select/select-all'
// 备注组件
import textareaAll from '@/components/erp-input/textarea-all'
import { basicCategoryInfo, basicCategoryTreeList, basicCategorySave, basicCategoryUpdate } from '@/api/basic/basic.js'
export default {
  components: {
    selectAll,
    textareaAll
  },
  data () {
    return {
      visible: false,
      parentIdOptions: [],
      parentId: [],
      dataForm: {
        id: '',
        name: '',
        code: '',
        parentId: '',
        remarks: '',
        bUsed: true
      },
      dataRule: {
        name: [
          { required: true, message: '产品分类名称不能为空', trigger: 'blur' }
        ],
        code: [
          { required: true, message: '产品分类编码不能为空', trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
    // 上级分类
    parentIdSelect () {
      var ids = !this.dataForm.id ? '' : this.dataForm.id
      basicCategoryTreeList({ id: ids }).then((data) => {
        this.parentIdOptions = data.treeList
      })
    },
    init (id, type) {
      this.dataForm.addTime = ''
      this.dataForm.addUser = ''
      this.dataForm.updTime = ''
      this.dataForm.updUser = ''
      this.visible = true
      this.dataForm.id = id
      this.parentIdSelect()
      this.$nextTick(() => {
        this.$refs['dataForm'].resetFields()
        if (this.dataForm.id) {
          basicCategoryInfo(this.dataForm.id, true).then((data) => {
            this.dataForm = data.basicCategory
            this.parentId = data.basicCategory.levelPathNode
          })
        }
      })
    },
    // 表单提交
    dataFormSubmit: _.debounce(
      async function dataFormSubmit () {
        if (this.parentId) {
          this.dataForm.parentId = this.parentId[this.parentId.length - 1]
        }
        this.$refs['dataForm'].validate(valid => {
          if (valid) {
            if (this.dataForm.id) {
              basicCategoryUpdate(this.dataForm).then((data) => {
                this.$emit('refreshDataList')
                this.visible = false
                this.$notify.success({
                  title: '成功',
                  message: '操作成功',
                  duration: 1500
                })
              }).catch((error) => {
                this.$notify.error({
                  title: '错误',
                  message: error.msg,
                  duration: 5000
                })
              })
            }
            if (!this.dataForm.id) {
              basicCategorySave(this.dataForm).then((data) => {
                this.$emit('refreshDataList')
                this.visible = false
                this.$notify.success({
                  title: '成功',
                  message: '操作成功',
                  duration: 1500
                })
              }).catch((error) => {
                this.$notify.error({
                  title: '错误',
                  message: error.msg,
                  duration: 5000
                })
              })
            }
          }
        })
      }, 1000, {
        leading: true,
        trailing: false
      }
    )
  }
}
</script>
