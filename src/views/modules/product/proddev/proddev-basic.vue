<template>
  <div>
    <el-form :model="dataForm"
             :rules="dataRule"
             ref="dataForm"
             @keyup.enter.native="verify()"
             label-width="110px"
             :disabled="formDisabled">
      <el-row>
        <el-col :span="8">
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
                         :options="categoryIdOptions"
                         :props="{value: 'id', label: 'name', children: 'subCategoryNode'}"
                         change-on-select
                         @change="handleChange"
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
          <el-form-item label="产品来源"
                        prop="dictProductResource">
            <selectAll v-model="dataForm.dictProductResource"
                       :listDataOption="dictProductResourceOption"
                       data-value="key"
                       data-label="value"></selectAll>
          </el-form-item>
          <el-form-item label="产品属性"
                        prop="dictProductProperties">
            <selectAll v-model="dictProductProperties"
                       :listDataOption="dictProductPropertiesOption"
                       data-value="key"
                       data-label="value"
                       :isMultiple="true"></selectAll>
          </el-form-item>
          <el-form-item label="研发费用"
                        prop="cost">
            <el-input v-model="dataForm.cost"
                      type="Number"
                      @mousewheel.native.prevent></el-input>
          </el-form-item>
          <el-form-item label="规格型号"
                        prop="specifications">
            <el-input v-model="dataForm.specifications"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="开发人员"
                        prop="devUserId">
            <select-seach v-model="dataForm.devUserId"
                          httpUrl="list/search/user"
                          requestParamsKey="name"
                          httpMethod="get"
                          data-label="name"
                          data-value="id"
                          data-source="list"></select-seach>
          </el-form-item>
          <el-form-item label="开发备注"
                        prop="devRemarks">
            <textarea-all v-model="dataForm.devRemarks"></textarea-all>
          </el-form-item>
          <el-form-item label="采购人员"
                        prop="purUserId">
            <select-seach v-model="dataForm.purUserId"
                          httpUrl="list/search/user"
                          requestParamsKey="name"
                          httpMethod="get"
                          data-label="name"
                          data-value="id"
                          data-source="list"></select-seach>
          </el-form-item>
          <el-form-item label="采购备注"
                        prop="purRemarks">
            <textarea-all v-model="dataForm.purRemarks"></textarea-all>
          </el-form-item>
          <el-form-item label="产品详细描述"
                        prop="description">
            <textarea-all v-model="dataForm.description"></textarea-all>
          </el-form-item>
          <el-form-item label="是否需要检验"
                        prop="bNeedChecked">
            <el-switch v-model="dataForm.bNeedChecked"
                       active-text="需要质检"
                       inactive-text="无需质检"></el-switch>
          </el-form-item>
          <el-form-item label="存在侵权风险"
                        prop="isInfringement">
            <el-switch v-model="isInfringement"
                       active-text="有风险"
                       inactive-text="无风险"
                       @change="infringementOptionChange"></el-switch>
            <el-checkbox-group v-show="isInfringement"
                               v-model="infringementArr">
              <el-checkbox v-for="item in infringementData"
                           :label="item.id"
                           :key="item.id">{{item.name}}</el-checkbox>
            </el-checkbox-group>
          </el-form-item>
          <el-form-item v-show="isInfringement"
                        label="侵权风险说明"
                        prop="infringementIllustrate">
            <textarea-all v-model="dataForm.infringementIllustrate"></textarea-all>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="销售国家"
                        prop="saleCountryId">
            <el-select v-model="saleCountryId"
                       multiple
                       filterable>
              <el-option v-for="item in saleCountryIdOptions"
                         :key="item.id"
                         :label="item.name"
                         :value="item.id"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item v-if="formDisabled"
                        label="产品编号"
                        prop="skuNos">
            <textarea-all v-model="skuNos"></textarea-all>
          </el-form-item>
          <el-form-item label="产品图片"
                        class="mt-5"
                        prop>
            <el-upload accept=".jpg, .jpeg, .png"
                       class="avatar-uploader"
                       action="string"
                       :http-request="uploadImageFile"
                       :on-preview="handlePictureCardPreview"
                       :before-upload="beforeAvatarUpload"
                       :show-file-list="false"
                       :on-success="uploadSuccess">
              <img v-if="imageUrl.url"
                   :src="imageUrl.url"
                   class="avatar">
              <i v-else
                 class="el-icon-plus avatar-uploader-icon"></i>
            </el-upload>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
  </div>
</template>
<script>
import selectAll from '@/components/erp-select/select-all'
// 备注组件
import textareaAll from '@/components/erp-input/textarea-all'
import selectSeach from '@/components/erp-select/select-seach'
import { isNull } from '@/utils'
import Bus from '@/components/js/bus.js'

export default {
  name: 'proddevbasic',
  props: ['value'],
  components: {
    selectAll,
    textareaAll,
    selectSeach
  },

  data () {
    return {
      isCheck: false,
      brandIdOption: [], // 品牌
      unitIdOption: [], // 产品单位
      dictProductResourceOption: [], // 产品来源
      skuNos: '',
      formDisabled: false,
      categoryId: [],
      categoryIdOptions: [],
      dialogImageUrl: '',
      //   filterProdResource: {
      //     dataDictKey: 'PRODUCT_RESOURCE'
      //   },

      visible: false,
      isInfringement: false,
      // imageActionUrl: '',
      // imageUpData: {},
      dialogVisible: false,
      // 获得数据需要进一步处理
      infringementArr: [],
      infringementData: [{
        id: '01',
        name: '品牌侵权'
      }, {
        id: '02',
        name: '外观侵权'
      }, {
        id: '03',
        name: '内容结构侵权'
      }, {
        id: '04',
        name: '专利侵权'
      }, {
        id: '05',
        name: '软件著作侵权'
      }, {
        id: '06',
        name: '其他侵权'
      }],
      saleCountryIdOptions: [],
      // fileList: [],
      type: '',
      saleCountryId: [], // 数据转换
      // 图片数据
      imageUrl: {},

      dictProductPropertiesOption: [],
      dictProductProperties: [], // 数据转换
      dataForm: {
        id: '',
        code: '',
        nameCh: '',
        nameEn: '',
        specifications: '',
        brandId: '',
        dictProductResource: '',
        dictProductProperties: '',
        cost: '',
        dictProductPlug: '',
        saleCountryId: '',
        unitId: '',
        categoryId: '',
        devUserId: '',
        devRemarks: '',
        purUserId: '',
        purRemarks: '',
        description: '',
        bNeedChecked: true,
        upc: '',
        ean: '',
        dialogVisible: false,
        compId: '',
        picList: '',
        infringement: '',
        infringementIllustrate: '',
        imageId: ''
      },

      dataRule: {
        nameCh: [{ required: true, message: '必填项', trigger: 'blur' }],
        unitId: [{ required: true, message: '必填项', trigger: 'change' }],
        categoryId: [{ required: true, message: '必填项', trigger: 'change' }],
        specifications: [{ required: true, message: '必填项', trigger: 'blur' }],
        devUserId: [{ required: true, message: '必填项', trigger: 'blur' }]
      }
    }
  },
  created () {
    // 品牌
    this.$http.get(this.$http.adornUrl('basic/basicbrand/listcombobox')).then(({ data }) => { this.brandIdOption = data.list })
    // 产品单位
    this.$http.get(this.$http.adornUrl('dict/dictunit/listcombobox')).then(({ data }) => { this.unitIdOption = data.list })
    // 产品来源
    this.$http.get(this.$http.adornUrl('basicData/queryDataDict2List'), { params: { dataDictKey: 'PRODUCT_RESOURCE' } }).then(({ data }) => { this.dictProductResourceOption = data.fontMaps })
  },
  methods: {
    init (id, type, handleType) {
      this.visible = true
      this.isCheck = false
      this.dataForm.id = id
      this.type = type
      this.parentIdSelect()
      // 销售国家
      this.$http.get(this.$http.adornUrl('dict/dictcountry/listcombobox')).then(({ data }) => { this.saleCountryIdOptions = data.list })
      this.$http.get(this.$http.adornUrl('basicData/queryDataDict2List'), { params: { dataDictKey: 'PRODUCT_PROPERTIES' } }).then(({ data }) => { this.dictProductPropertiesOption = data.fontMaps })
      // 查看
      if (handleType === 'canCheck') {
        this.isCheck = true
        this.formDisabled = true
      }
      // 审核
      if (handleType === 'canApproval') {
        this.formDisabled = true
      }
      // 新增
      if (!this.dataForm.prodId) {
        this.dataForm.devUserId = sessionStorage.getItem('userId')
      }
      this.$nextTick(() => {
        if (this.dataForm.id) {
          this.$http({
            url: this.$http.adornUrl(`prod/proddevbasic/info/${this.dataForm.id}/${this.type}`),
            method: 'get',
            params: this.$http.adornParams()
          }).then(({ data }) => {
            if (data && data.code === 0) {
              this.skuNos = data.skuNos // 产品编号（新添加）
              this.dataForm = data.prodDevBasicEntity
              this.dataForm.imageId = data.imageId
              if (data.prodDevBasicEntity.dictProductProperties) {
                this.dictProductProperties = this.dataForm.dictProductProperties.split(',')
              }
              this.categoryId = data.prodDevBasicEntity.basicCategoryEntity.levelPathNode
              if (data.prodDevBasicEntity.saleCountryId) {
                this.saleCountryId = data.prodDevBasicEntity.saleCountryId.split(',')
              }

              // 判断是否有侵权风险
              if (isNull(data.prodDevBasicEntity.infringement)) {
                this.isInfringement = true
                this.$nextTick(() => {
                  this.infringementArr = data.prodDevBasicEntity.infringement.split(',')
                })
              }

              this.postimage(data.imageId)
            }
          })
        }
      })
    },

    // 拿到基础资料产品分类的数据
    parentIdSelect () {
      var ids = !this.dataForm.id ? '' : this.dataForm.id
      this.$http({
        url: this.$http.adornUrl('basic/basiccategory/treeList'),
        method: 'get',
        params: this.$http.adornParams({ id: ids }, false)
      }).then(({ data }) => {
        this.categoryIdOptions = data.treeList
      })
    },

    handleChange (value) {
      this.dataForm.categoryId = this.categoryId[this.categoryId.length - 1]
    },

    // 根据图片id查找图片
    postimage (id) {
      this.imageUrl = {}
      if (this.dataForm.id) {
        this.$http({
          url: this.$http.adornUrl(`prod/prodimage/info/${id}`),
          method: 'get'
        }).then(({ data }) => {
          if (data && data.code === 0) {
            this.imageUrl = Object.assign({}, this.imageUrl, {
              id: id,
              name: data.name,
              url: this.$http.adornUrl(data.url)
            })
          } else {
            this.imageUrl.url = ''
          }
        }).catch(error => {
          console.log(error)
        })
      }
    },

    // 清除是否侵权数据
    infringementOptionChange (val) {
      if (val) {
        this.infringementArr = []
        this.dataForm.infringementIllustrate = ''
        this.dataForm.infringement = ''
      }
    },

    // 上传前
    beforeAvatarUpload (file) {
      const isLt2M = file.size / 1024 / 1024 < 1024
      if (!isLt2M) {
        console.log('上传模板大小不能超过 1G!')
      }
      return isLt2M
    },

    // 限制图片上传个数
    handleExceed (files, fileList) {
      this.$notify.warning(`新品开发上传产品图片只能为1张`)
    },

    handlePictureCardPreview (file) {
      this.imageUrl = file.url
      this.dialogVisible = true
    },

    // 上传成功后的回调
    uploadSuccess (res, file) {
      this.imageUrl = URL.createObjectURL(file.raw)
    },

    // 上传图像文件
    uploadImageFile (options) {
      let data = new FormData()
      data.append(options.filename, options.file)
      this.$http({
        url: this.$http.adornUrl(`prod/prodimage/save`),
        method: 'post',
        data: data
      }).then(({ data }) => {
        if (data && data.code === 0) {
          this.dataForm.imageId = data.id
          this.imageUrl = {}
          this.imageUrl = Object.assign({}, this.imageUrl, {
            id: data.id,
            name: data.name,
            url: this.$http.adornUrl(data.url)
          })
        } else {
          this.$notify.error({
            title: '失败',
            message: data.msg,
            duration: 5000
          })
        }
      })
    },
    dataFormSubmitValidate (id, type) {
      this.$http({
        url: this.$http.adornUrl('prod/proddevbasic/update'),
        method: 'put',
        data: this.$http.adornData({
          prodId: id,
          type: type,
          imageId: this.dataForm.imageId,
          prodDevBasicEntity: this.dataForm
        })
      }).then(({ data }) => {
        if (data && data.code === 0) {
          Bus.$emit('prodDevTabsChildren')
          // this.$emit('nextStep')
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
              url: this.$http.adornUrl('prod/proddevbasic/checkProdName'),
              method: 'post',
              data: {
                prodId: id,
                type: type,
                imageId: this.dataForm.imageId,
                prodDevBasicEntity: this.dataForm
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

    resetData () {
      this.$nextTick(() => {
        this.$refs['dataForm'].resetFields()
      })
    },
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
    },
    saleCountryId: {
      handler (val, oldVal) {
        this.$set(this.dataForm, 'saleCountryId', this.saleCountryId.join(','))
      },
      deep: true
    },
    dictProductProperties: {
      handler (val, oldVal) {
        this.$set(
          this.dataForm,
          'dictProductProperties',
          this.dictProductProperties.join(',')
        )
      },
      deep: true
    }
  }
}
</script>
<style scoped>
.avatar-uploader .el-upload {
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}
.avatar-uploader .el-upload:hover {
  border-color: #409eff;
}
.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 178px;
  height: 178px;
  line-height: 178px;
  text-align: center;
}
.avatar {
  width: 178px;
  height: 178px;
  display: block;
}
</style>