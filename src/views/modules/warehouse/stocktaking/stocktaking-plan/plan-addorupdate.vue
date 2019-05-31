<template>
  <el-dialog :title="!dataForm.id ? '盘点方案(新增)' : isClick === true ? '盘点方案(修改)' : '盘点方案(查看)'"
             :close-on-click-modal="false"
             :visible.sync="visible"
             width="30%"
             @close="$refs['dataForm'].resetFields()">
    <el-form :model="dataForm"
             :rules="dataRule"
             ref="dataForm"
             label-width="110px">
      <el-form-item label="盘点表分表维度"
                    prop="dimension">
        <el-radio-group :disabled="isDisabled"
                        v-model="dataForm.dimension">
          <el-radio label="01">按库存状态分表</el-radio>
          <el-radio label="02">按仓库+库存状态分表</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="库存公司"
                    prop="compId">
        <select-all v-model="dataForm.compId"
                    :listDataOption="compIdOption"
                    :isDisabled="isDisabled"
                    data-value="orgId"
                    data-label="name"
                    :isSelectChange="true"
                    @selectChange="compIdChange"></select-all>
      </el-form-item>
      <el-form-item label="指定仓库范围"
                    prop="warehouseIds">
        <select-all v-model="dataForm.warehouseIds"
                    :listDataOption="warehouseIdsOption"
                    :isDisabled="isDisabled"
                    data-value="id"
                    data-label="name"></select-all>
      </el-form-item>
      <el-form-item label="指定产品范围"
                    prop="rangeConfig">
        <el-radio-group :disabled="isDisabled"
                        v-model="dataForm.rangeConfig">
          <el-radio label="1">无分类</el-radio>
          <el-radio label="2">按产品分类</el-radio>
          <el-radio label="3">按具体产品</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item v-if="dataForm.rangeConfig === '2'"
                    label="按产品分类"
                    prop="categoryIds">
        <el-cascader v-model="categoryIds"
                     :options="categoryIdsOption"
                     :props="{value: 'id', label: 'name', children: 'subCategoryNode'}"
                     change-on-select
                     @change="handleChange"
                     :disabled="isDisabled"
                     clearable
                     filterable></el-cascader>
      </el-form-item>
      <el-form-item v-if="dataForm.rangeConfig === '3'"
                    label="按具体产品"
                    prop="prodIds">
        <select-seach v-model="prodIds"
                      httpUrl="prod/prodbasic/queryForComplete"
                      httpMethod="get"
                      requestParamsKey="code"
                      data-label="code"
                      data-label-right='name_ch'
                      :showName='true'
                      data-value="id"
                      data-source="list"
                      placeholder="请输入产品编码"
                      :isMultiple="true"
                      :isDisabled="isDisabled"></select-seach>
      </el-form-item>
    </el-form>
    <span slot="footer"
          class="dialog-footer">
      <el-button @click="visible = false"><i class="iconfont erp-icon-quxiao"></i>取消</el-button>
      <el-button v-if="isClick && (isAuth('warehouse:whstocktakingplan:save') || isAuth('warehouse:whstocktakingplan:update'))"
                 type="primary"
                 @click="dataFormSubmit()"><i class="iconfont erp-icon-baocun"></i>保存</el-button>
      <el-button v-if="isClick && (isAuth('warehouse:whstocktakingplan:confirm'))"
                 type="primary"
                 @click="createStocktaking()"><i class="iconfont erp-icon-queding"></i>生成盘点单</el-button>
    </span>
  </el-dialog>
</template>
<script>
import selectSeach from '@/components/erp-select/select-seach'
import selectAll from '@/components/erp-select/select-all'
import { hasTypeOf } from '@/utils'

export default {
  components: {
    selectSeach,
    selectAll
  },

  data () {
    return {
      visible: false,
      isDisabled: false,
      isClick: true,
      // 公司
      compIdOption: [],
      // 收货仓库
      warehouseIdsOption: [],
      categoryIdsOption: [],
      categoryIds: [], // 数据处理
      prodIds: [], // 数据处理
      dataForm: {
        id: '',
        dimension: '01',
        compId: '',
        warehouseIds: '',
        rangeConfig: '1',
        categoryIds: '',
        prodIds: ''
      },

      dataRule: {
        compId: [
          { required: true, message: '库存公司不能为空', trigger: 'blur' }
        ],
        name: [{ required: true, message: '品牌名称不能为空', trigger: 'blur' }]
      }
    }
  },
  created () {
    this.$http.get(this.$http.adornUrl('sys/organization/select')).then(({ data }) => { this.compIdOption = data.companyList })
    this.$http.get(this.$http.adornUrl('basic/basiccategory/treeList'), { params: { id: this.dataForm.categoryIds || '' } }).then(({ data }) => { this.categoryIdsOption = data.treeList || [] })
  },
  methods: {
    init (id, type) {
      hasTypeOf(this.dataForm)
      this.dataForm.dimension = '01'
      this.dataForm.rangeConfig = '1'
      this.visible = true
      this.dataForm.id = id
      this.add(id, type)
      this.editorCheck(id, type)
      this.$nextTick(() => {
        if (this.dataForm.id) {
          this.$http({
            url: this.$http.adornUrl(`warehouse/whstocktakingplan/info/${this.dataForm.id}`),
            method: 'get'
          }).then(({ data }) => {
            if (data && data.code === 0) {
              this.compIdChange(data.whStocktakingPlan.compId)
              data.whStocktakingPlan.rangeConfig = data.whStocktakingPlan.rangeConfig + ''
              if (data.whStocktakingPlan.categoryIds) {
                this.categoryIds = data.levelPath.split('.')
              }
              if (data.whStocktakingPlan.prodIds) {
                this.prodIds = data.whStocktakingPlan.prodIds.split(',')
              }
              this.dataForm = data.whStocktakingPlan
            }
          })
        }
      })
    },
    // 新增
    add (id, type) {
      if (!id) {
        // 新增
        this.isDisabled = false
        this.isClick = true
        this.categoryIds = []
        this.prodIds = []
        // 默认公司
        this.dataForm.compId = sessionStorage.getItem('orgId')
        this.$nextTick(() => {
          this.compIdChange(this.dataForm.compId)
        })
      }
    },
    // 编辑或者查看
    editorCheck (id, type) {
      // 查看
      if (id && type === 'isDisabled') {
        this.isDisabled = true
        this.isClick = false
        return
      }
      // 编辑
      if (id && !type) {
        this.isDisabled = false
        this.isClick = true
      }
    },
    // 选择公司触发
    compIdChange (value) {
      this.$http.get(this.$http.adornUrl('list/combobox/warehouse-comp'), { params: { compId: value } }).then(({ data }) => { this.warehouseIdsOption = data.list })
      this.dataForm.warehouseIds = ''
    },

    handleChange (value) {
      this.dataForm.categoryIds = value[value.length - 1]
    },

    // 生成盘点单
    createStocktaking: _.debounce(
      async function createStocktaking () {
        if (this.dataForm.rangeConfig === '1') {
          this.dataForm.categoryIds = ''
          this.categoryIds = []
          this.dataForm.prodIds = ''
          this.prodIds = []
        } else if (this.dataForm.rangeConfig === '2') {
          this.dataForm.prodIds = ''
          this.prodIds = []
        } else if (this.dataForm.rangeConfig === '3') {
          this.dataForm.prodIds = this.prodIds.join(',')
          this.dataForm.categoryIds = ''
          this.categoryIds = []
        }
        this.$refs['dataForm'].validate(valid => {
          if (valid) {
            this.$http({
              url: this.$http.adornUrl(`warehouse/whstocktakingplan/confirm`),
              method: 'post',
              data: this.dataForm
            }).then(({ data }) => {
              if (data && data.code === 0) {
                this.$emit('refreshDataList')
                this.visible = false
                this.$notify.success({
                  title: '成功',
                  message: `生成盘点单成功, ${data.codeList.join('<br/>')}`,
                  duration: 5000,
                  dangerouslyUseHTMLString: true
                })
              } else {
                this.$notify.error({
                  title: '失败',
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

    // 表单提交
    dataFormSubmit: _.debounce(
      async function dataFormSubmit () {
        if (this.dataForm.rangeConfig === '1') {
          this.categoryIds = []
          this.dataForm.categoryIds = ''
          this.dataForm.prodIds = ''
          this.prodIds = []
        } else if (this.dataForm.rangeConfig === '2') {
          this.dataForm.prodIds = ''
          this.prodIds = []
        } else if (this.dataForm.rangeConfig === '3') {
          this.dataForm.prodIds = this.prodIds.join(',')
          this.dataForm.categoryIds = ''
          this.categoryIds = []
        }
        this.$refs['dataForm'].validate(valid => {
          if (valid) {
            this.$http({
              url: this.$http.adornUrl(`warehouse/whstocktakingplan/${!this.dataForm.id ? 'save' : 'save'}`),
              method: !this.dataForm.id ? 'post' : 'post',
              data: this.dataForm
            }).then(({ data }) => {
              if (data && data.code === 0) {
                this.visible = false
                this.$emit('refreshDataList')
                this.$notify.success({
                  title: '成功',
                  message: '保存成功',
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