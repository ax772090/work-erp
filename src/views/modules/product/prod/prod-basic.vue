<template>
  <div>
    <el-form v-bind="$props"
             :model="dataForm"
             :rules="dataRule"
             ref="dataForm"
             label-width="110px"
             :disabled="formDisabled">
      <el-row>
        <el-col :span="8">
          <el-form-item label="产品编码"
                        prop="code">
            <el-input v-model="dataForm.code"
                      :disabled="true"></el-input>
          </el-form-item>
          <el-form-item label="产品名称(中)"
                        prop="nameCh">
            <el-input v-model="dataForm.nameCh"></el-input>
          </el-form-item>
          <el-form-item label="产品名称(英)"
                        prop="nameEn">
            <el-input v-model="dataForm.nameEn"></el-input>
          </el-form-item>
          <el-form-item label="产品分类"
                        prop="categoryId">
            <el-cascader v-model="categoryId"
                         :disabled="(dataForm.id || copyType == 2 || copyType == 1 )?true:false"
                         :options="categoryIdOptions"
                         :props="{value: 'id', label: 'name', children: 'subCategoryNode'}"
                         @change="handleChange()"
                         change-on-select
                         clearable
                         filterable></el-cascader>
          </el-form-item>
          <el-form-item label="品牌"
                        prop="brandId">
            <selectAll v-model="dataForm.brandId"
                       :listDataOption="brandIdOption"
                       data-value="id"
                       data-label="name"></selectAll>
          </el-form-item>
          <el-form-item label="产品单位"
                        prop="unitId">
            <selectAll v-model="dataForm.unitId"
                       :listDataOption="unitIdOption"
                       data-value="id"
                       data-label="name"></selectAll>
          </el-form-item>
          <el-form-item label="产品属性"
                        prop="dictProductProperties">
            <selectAll v-model="computStringArray"
                       :listDataOption="dictProductPropertiesOption"
                       data-value="key"
                       data-label="value"
                       :isMultiple="true"></selectAll>
          </el-form-item>
          <el-form-item label="规格型号"
                        prop="specifications">
            <el-input v-model="dataForm.specifications"></el-input>
          </el-form-item>
          <el-form-item label="产品详细描述"
                        prop="description">
            <textarea-all v-model="dataForm.description"></textarea-all>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="开发人员"
                        prop="devUserId">
            <selectSeach v-model="dataForm.devUserId"
                         httpUrl="list/search/user"
                         requestParamsKey="name"
                         httpMethod="get"
                         data-label="name"
                         data-value="id"
                         data-source="list"></selectSeach>
          </el-form-item>
          <el-form-item label="开发备注"
                        prop="devRemarks">
            <textarea-all v-model="dataForm.devRemarks"></textarea-all>
          </el-form-item>
          <el-form-item label="研发费用"
                        prop="cost">
            <el-input v-model="dataForm.cost"></el-input>
          </el-form-item>
          <el-form-item label="采购人员"
                        prop="purUserId">
            <selectSeach v-model="dataForm.purUserId"
                         httpUrl="list/search/user"
                         requestParamsKey="name"
                         httpMethod="get"
                         data-label="name"
                         data-value="id"
                         data-source="list"></selectSeach>
          </el-form-item>
          <el-form-item label="采购备注"
                        prop="purRemarks">
            <textarea-all v-model="dataForm.purRemarks"></textarea-all>
          </el-form-item>
          <el-form-item label="销售国家"
                        prop="saleCountryId">
            <selectAll v-model="saleCountryId"
                       :listDataOption="saleCountryIdOptions"
                       data-value="id"
                       data-label="name"
                       :isMultiple="true"></selectAll>
          </el-form-item>
          <el-form-item label="销售状态"
                        prop="dictSaleStatus">
            <select-all v-model="dataForm.dictSaleStatus"
                        :listDataOption="dictSaleStatusOptions"
                        data-value="key"
                        data-label="value"></select-all>
          </el-form-item>
          <el-form-item label="UPC"
                        prop="upc">
            <el-input v-model="dataForm.upc"></el-input>
          </el-form-item>
          <el-form-item label="EAN"
                        prop="ean">
            <el-input v-model="dataForm.ean"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="采购成本价"
                        prop="purCostPrice">
            <el-input v-model="dataForm.purCostPrice"></el-input>
          </el-form-item>
          <el-form-item label="采购预计交期"
                        prop="deliveryDays">
            <el-input v-model="dataForm.deliveryDays"></el-input>
          </el-form-item>
          <el-form-item label="是否需要检验"
                        prop="bNeedChecked">
            <el-switch v-model="dataForm.bNeedChecked"
                       active-text="需要检验"
                       inactive-text="无需检验"></el-switch>
          </el-form-item>
          <el-form-item label="是否侵权">
            <el-switch v-model="isInfringement"
                       active-text="有风险"
                       inactive-text="无风险"
                       @change="infringementOptionChange"></el-switch>
          </el-form-item>
          <el-form-item v-show="isInfringement"
                        label="产品侵权风险"
                        prop="infringement">
            <el-checkbox-group v-model="infringementArr">
              <el-checkbox v-for="item in infringementData"
                           :label="item.id"
                           :key="item.id">{{item.name}}</el-checkbox>
            </el-checkbox-group>
          </el-form-item>
          <el-form-item v-show="isInfringement"
                        label="侵权风险详细说明"
                        prop="infringementIllustrate">
            <textarea-all v-model="dataForm.infringementIllustrate"></textarea-all>
          </el-form-item>
          <el-form-item label="是否使用"
                        prop="bUsed">
            <el-switch v-model="dataForm.bUsed"
                       active-text="正常"
                       inactive-text="禁用"></el-switch>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
  </div>
</template>
<script>
import selectAll from '@/components/erp-select/select-all'
import selectSeach from '@/components/erp-select/select-seach'
// 备注组件
import textareaAll from '@/components/erp-input/textarea-all'
import Bus from '@/components/js/bus.js'
import { isNull } from '@/utils'

export default {
  props: ['value'],
  components: {
    selectAll,
    selectSeach,
    textareaAll
  },
  data () {
    return {
      isCheck: false,
      brandIdOption: [], // 品牌
      unitIdOption: [], // 产品单位
      formDisabled: false,
      prodResourceFilter: { dataDictKey: 'PRODUCT_RESOURCE' },
      prodPropertiesFilter: { dataDictKey: 'PRODUCT_PROPERTIES' },
      // 销售状态
      dictSaleStatusOptions: [],
      // 销售国家
      saleCountryIdOptions: [],
      // saleCountryId: [], // 数据转换
      // 产品分类
      categoryIdOptions: [],
      categoryId: [], // 数据转换
      infringementData: [
        {
          id: '01',
          name: '品牌侵权'
        },
        {
          id: '02',
          name: '外观侵权'
        },
        {
          id: '03',
          name: '内容结构侵权'
        },
        {
          id: '04',
          name: '专利侵权'
        },
        {
          id: '05',
          name: '软件著作侵权'
        },
        {
          id: '06',
          name: '其他侵权'
        }
      ],
      // 是否侵权
      isInfringement: false,
      // 数据格式需要转换下
      infringementArr: [],
      dictProductPropertiesOption: [],
      // dictProductProperties: [], // 处理数据
      type: '',
      copyType: '',
      dataForm: {
        code: '',
        nameCh: '',
        nameEn: '',
        specifications: '',
        brandId: '',
        dictProductProperties: '',
        cost: '',
        saleCountryId: '',
        unitId: '',
        categoryId: '',
        upc: '',
        ean: '',
        purCostPrice: '',
        deliveryDays: '',
        dictSaleStatus: '',
        bNeedChecked: true,

        devUserId: '',
        devRemarks: '',
        purUserId: '',
        purRemarks: '',
        description: '',
        infringement: '',
        infringementIllustrate: '',
        bUsed: true
      },
      dataRule: {
        nameCh: [{ required: true, message: '必填项', trigger: 'blur' }],
        unitId: [{ required: true, message: '必填项', trigger: 'change' }],
        categoryId: [{ required: true, message: '必填项', trigger: 'change' }],
        compId: [{ required: true, message: '必填项', trigger: 'blur' }],
        isPositive: [{
          pattern: /^\d+(?=\.{0,1}\d+$|$)/,
          message: '须正数',
          trigger: 'blur'
        }],
        specifications: [{ required: true, message: '必填项', trigger: 'blur' }],
        devUserId: [{ required: true, message: '必填项', trigger: 'blur' }]
      }
    }
  },
  created () {
    // 销售国家
    this.$http.get(this.$http.adornUrl('dict/dictcountry/listcombobox')).then(({ data }) => { this.saleCountryIdOptions = data.list })
    this.$http.get(this.$http.adornUrl('basicData/queryDataDict2List'), { params: { dataDictKey: 'SALE_STATUS' } }).then(({ data }) => { this.dictSaleStatusOptions = data.fontMaps })
    this.$http.get(this.$http.adornUrl('basicData/queryDataDict2List'), { params: { dataDictKey: 'PRODUCT_PROPERTIES' } }).then(({ data }) => { this.dictProductPropertiesOption = data.fontMaps })
    // 品牌
    this.$http.get(this.$http.adornUrl('basic/basicbrand/listcombobox')).then(({ data }) => { this.brandIdOption = data.list })
    // 产品单位
    this.$http.get(this.$http.adornUrl('dict/dictunit/listcombobox')).then(({ data }) => { this.unitIdOption = data.list })
  },
  computed: {
    computStringArray: {
      get () {
        if (this.dataForm.dictProductProperties) {
          return this.dataForm.dictProductProperties.split(',')
        } else {
          return []
        }
      },
      set (comput) {
        this.$set(this.dataForm, 'dictProductProperties', comput.join(','))
      }
    },
    saleCountryId: {
      get () {
        if (this.dataForm.saleCountryId) {
          return this.dataForm.saleCountryId.split(',')
        } else {
          return []
        }
      },
      set (comput) {
        this.$set(this.dataForm, 'saleCountryId', comput.join(','))
      }
    }
  },
  methods: {
    init (id, type, handleType, dataForm) {
      // 1
      this.dataForm.code = ''
      this.dataForm.addTime = ''
      this.dataForm.addUser = ''
      this.dataForm.updTime = ''
      this.dataForm.updUser = ''

      this.isCheck = false
      this.dataForm.prodId = id
      this.type = type
      this.copyType = ''
      this.parentIdSelect()

      // 新增
      if (!this.dataForm.prodId) {
        this.dataForm.devUserId = sessionStorage.getItem('userId')
      }

      // 查看
      if (handleType === '1') {
        this.formDisabled = true
        this.isCheck = true
      } else if (handleType === 'copy') {
        this.dataForm = dataForm.prodBasicEntity
        this.copyType = dataForm.prodBasicEntity.copiedType
        this.categoryId =
          dataForm.prodBasicEntity.basicCategoryEntity.levelPathNode
        if (isNull(dataForm.prodBasicEntity.infringement)) {
          this.isInfringement = true
          this.$nextTick(() => {
            this.infringementArr = dataForm.prodBasicEntity.infringement.split(',')
          })
        }
      }
      this.$nextTick(() => {
        if (this.dataForm.prodId) {
          this.$http({
            url: this.$http.adornUrl(`prod/prodbasic/info/${this.dataForm.prodId}/${this.type}`),
            method: 'get',
            params: this.$http.adornParams({}, false)
          }).then(({ data }) => {
            if (data && data.code === 0) {
              this.dataForm = data.prodBasicEntity
              this.categoryId =
                data.prodBasicEntity.basicCategoryEntity.levelPathNode
              if (isNull(data.prodBasicEntity.infringement)) {
                this.isInfringement = true
                this.$nextTick(() => {
                  this.infringementArr = data.prodBasicEntity.infringement.split(',')
                })
              }
            } else {
              this.$notify.error(data.msg)
            }
          })
        }
      })
    },

    // 拿到基础资料产品分类的数据
    parentIdSelect () {
      var ids = !this.dataForm.prodId ? '' : this.dataForm.prodId
      this.$http({
        url: this.$http.adornUrl('basic/basiccategory/treeList'),
        method: 'get',
        params: { id: ids }
      }).then(({ data }) => {
        if (data && data.code === 0) {
          this.categoryIdOptions = data.treeList || []
        }
      })
    },

    // 产品分类触发
    handleChange (value) {
      this.dataForm.categoryId = this.categoryId[this.categoryId.length - 1]
    },

    // 清除是否侵权数据
    infringementOptionChange (val) {
      this.dataForm.infringementArr = []
      this.dataForm.infringement = ''
    },

    dataFormSubmitValidate (id, type) {
      this.$http({
        url: this.$http.adornUrl('prod/prodbasic/update'),
        method: 'put',
        data: {
          prodId: id,
          type: type,
          prodBasicEntity: this.dataForm
        }
      }).then(({ data }) => {
        if (data && data.code === 0) {
          Bus.$emit('prodTabChildren')
          this.$notify.success({
            message: '保存成功',
            duration: 5000
          })
        } else {
          this.$notify.error({
            message: data.msg,
            duration: 5000
          })
        }
      })
    },

    // 表单提交
    dataFormSubmit: _.debounce(
      async function dataFormSubmit (id, type) {
        this.$refs['dataForm'].validate(valid => {
          if (valid) {
            this.$http({
              url: this.$http.adornUrl('prod/prodbasic/checkProdName'),
              method: 'post',
              data: {
                prodId: id,
                type: type,
                prodBasicEntity: this.dataForm
              }
            }).then(({ data }) => {
              if (data && data.code === 0) {
                if (data.exist) {
                  this.$confirm('产品名称已存在，是否继续？', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                  }).then(() => {
                    this.dataFormSubmitValidate(id, type)
                  })
                } else {
                  this.dataFormSubmitValidate(id, type)
                }
              }
            })
          }
        })
      }, 1000, {
        leading: true,
        trailing: false
      }
    ),

    // 校验
    validate () {
      return new Promise((resolve, reject) => {
        if (this.isCheck) {
          resolve(true)
          return
        }
        this.$refs['dataForm'].validate(valid => {
          if (valid) {
            resolve(valid)
          } else {
            reject(valid)
          }
        })
      })
    }
    // validate () {
    //   this.$refs['dataForm'].validate(valid => {
    //     if (valid) {
    //       this.$emit('nextStep')
    //     }
    //   })
    // }
  },
  watch: {
    value: {
      handler (val, oldVal) {
        this.dataForm = this.value
        this.$emit('change', this.dataForm)
      },
      deep: true
    },
    dataForm: {
      handler (val, oldVal) {
        this.$emit('input', this.dataForm)
      },
      deep: true
    },
    infringementArr: {
      handler (val, oldVal) {
        this.$set(
          this.dataForm,
          'infringement',
          this.infringementArr.join(',')
        )
      },
      deep: true
    }
  }
}
</script>