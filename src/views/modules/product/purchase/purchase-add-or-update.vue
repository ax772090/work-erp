 <template>
  <el-dialog :title="!dataForm.id ? '采购价目新增' : '采购价目修改'"
             :close-on-click-modal="false"
             :visible.sync="visible"
             v-if="visible"
             :before-close="handleClose"
             width="50%">
    <el-form :model="dataForm"
             :rules="dataRule"
             ref="dataForm"
             label-width="110px">
      <el-row>
        <el-col :span="12">
          <el-form-item label="供应商名称"
                        prop="supplierId">
            <select-seach v-model="dataForm.supplierId"
                          httpUrl="basic/basicsupplier/list-used"
                          requestParamsKey="name"
                          httpMethod="get"
                          data-label="name"
                          data-value="id"
                          data-source="list"
                          :isSelectChange="selectchange"
                          @selectChange="supplierIdChange"></select-seach>
          </el-form-item>
          <el-form-item label="供应商编码"
                        prop="supplierCode">
            <el-input v-model="dataForm.supplierCode"
                      disabled
                      placeholder=""></el-input>
          </el-form-item>
          <el-form-item label="定价员"
                        prop="pricingUser">
            <select-seach v-model="dataForm.pricingUser"
                          httpUrl="/list/search/user"
                          httpMethod="get"
                          requestParamsKey="name"
                          data-label="name"
                          data-value="id"
                          data-source="list"
                          :listDataOptionStatic="userOptions"></select-seach>
          </el-form-item>
          <el-form-item label=""
                        prop="bFirstChoice">
            <el-checkbox v-model="dataForm.bFirstChoice"
                         label="首选供应商"></el-checkbox>
          </el-form-item>
          <el-form-item label="采购公司"
                        prop="compId">
            <select-all v-model="dataForm.compId"
                        :listDataOption="compIdOptions"
                        data-value="id"
                        data-label="name"></select-all>
          </el-form-item>
          <el-form-item label="采购交期(天)"
                        prop="purchaseDeliverytime">
            <el-input v-model="dataForm.purchaseDeliverytime"
                      type="Number"
                      @mousewheel.native.prevent></el-input>
          </el-form-item>
          <el-form-item label="最小订货量"
                        prop="minQty">
            <el-input v-model="dataForm.minQty"
                      type="Number"
                      @mousewheel.native.prevent></el-input>
          </el-form-item>
          <el-form-item label="优先级"
                        prop="priority">
            <el-input v-model="dataForm.priority"
                      type="Number"
                      @mousewheel.native.prevent
                      placeholder=""></el-input>
          </el-form-item>
          <el-form-item label="备注"
                        prop="remark">
            <textarea-all v-model="dataForm.remark"></textarea-all>
          </el-form-item>
          <el-form-item label="状态"
                        prop="bUsed">
            <el-radio-group v-model="dataForm.bUsed">
              <el-radio :label="true">正常</el-radio>
              <el-radio :label="false">禁用</el-radio>
            </el-radio-group>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="产品编码"
                        prop="prodId">
            <select-seach v-model="dataForm.prodId"
                          httpUrl="/prod/prodbasic/queryForComplete"
                          httpMethod="get"
                          requestParamsKey="code"
                          data-label-right='name_ch'
                          :showName='true'
                          data-label="code"
                          data-value="id"
                          data-source="list"
                          isSelectChange="true"
                          @selectChange="codeValue"></select-seach>
          </el-form-item>
          <el-form-item label="产品名称"
                        prop="prodName">
            <el-input v-model="dataForm.prodName"
                      disabled></el-input>
          </el-form-item>
          <el-form-item label="规格型号"
                        prop="specifications">
            <el-input v-model="dataForm.specifications"
                      disabled></el-input>
          </el-form-item>
          <el-form-item label=""
                        prop="bIncludeTax">
            <el-checkbox v-model="dataForm.bIncludeTax"
                         @change="bIncludeTaxChange">是否含税</el-checkbox>
          </el-form-item>
          <el-form-item label="结算币别"
                        prop="currencyId">
            <select-all v-model="dataForm.currencyId"
                        :listDataOption="currencyIdOptions"
                        data-value="id"
                        data-label="name"></select-all>
          </el-form-item>
          <el-form-item label="税率"
                        prop="taxRate"
                        ref='taxRateRef'
                        :rules="dataForm.bIncludeTax?dataRule.taxRate:[{required:false,trigger: 'change'}]">
            <el-input v-model="dataForm.taxRate"
                      type="Number"
                      :disabled="!dataForm.bIncludeTax"
                      @mousewheel.native.prevent></el-input>
          </el-form-item>
          <el-form-item label="单价"
                        prop="price"
                        :rules="dataRule.price">
            <!-- <el-tooltip :content="message"
                        placement="right"> -->
            <el-input v-model="dataForm.price"
                      type="Number"
                      @mousewheel.native.prevent
                      :placeholder="message"></el-input>
            <!-- </el-tooltip> -->
          </el-form-item>
          <el-form-item label="生效日期"
                        prop="effectiveDate">
            <el-date-picker v-model="dataForm.effectiveDate"
                            type="date"
                            value-format="yyyy-MM-dd"></el-date-picker>
          </el-form-item>
          <el-form-item label="失效日期"
                        prop="expirationDate">
            <el-date-picker v-model="dataForm.expirationDate"
                            type="date"
                            value-format="yyyy-MM-dd"></el-date-picker>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
    <span slot="footer"
          class="dialog-footer">
      <el-button @click="cancel('dataForm')"><i class="iconfont erp-icon-quxiao"></i>取消</el-button>
      <el-button type="primary"
                 @click="dataFormSubmit()"><i class="iconfont erp-icon-baocun"></i>保存</el-button>
    </span>
  </el-dialog>
</template>
<script>
import selectSeach from '@/components/erp-select/select-seach'
import selectAll from '@/components/erp-select/select-all'
// 备注组件
import textareaAll from '@/components/erp-input/textarea-all'

export default {
  components: {
    selectSeach,
    selectAll,
    textareaAll
  },
  data () {
    var validateInteger = (rule, value, callback) => {
      var startNum = parseInt(this.dataForm.effectiveDate.replace(/-/g, ''), 10)
      var endNum = parseInt(value.replace(/-/g, ''), 10)
      if (startNum > endNum) {
        callback(new Error('失效日期不能小于生效日期'))
      } else if (!endNum) {
        callback(new Error('请选择失效日期'))
      } else {
        callback()
      }
    }
    var validpriceInteger = (rule, value, callback) => {
      if (!/^([1-9]\d*(.\d*[1-9])?)|(0.\d*[1-9])$/.test(value)) {
        callback(new Error('单价请输入大于0的数字'))
      } else {
        callback()
      }
    }
    const betweenInt = (min, max) => (rule, value, callback) => {
      const isBetween = value >= min && value <= max
      const isInt = /^0[1-9]$|^[1-9][0-9]?$|^00?\.(?:0[1-9]|[1-9][0-9]?)$|^(?:0[1-9]|[1-9][0-9]?)\.[0-9]$/.test(
        value
      )
      if (value && !(isBetween && isInt)) {
        callback(new Error(`${min}到${max}的两位小数`))
      } else {
        callback()
      }
    }
    return {
      // 采购公司
      compIdOptions: [],
      selectchange: false,
      message: '请输入不含税单价',
      currencyIdOptions: [],
      visible: false,
      // 定价员
      userOptions: [],
      dataForm: {
        id: '',
        supplierId: '',
        prodId: '',
        prodName: '',
        minQty: '',
        pricingUser: '',
        remark: '',
        code: '',
        priority: 1,
        taxRate: '',
        supplierCode: '',
        purchaseDeliverytime: '',
        specifications: '',
        currencyId: '',
        bUsed: true,
        bFirstChoice: true,
        bIncludeTax: false
      },
      dataRule: {
        price: [
          { required: true, message: '必填项', trigger: 'change' }, // 销售单价
          { validator: validpriceInteger, trigger: 'change' }
        ],
        minQty: [
          { pattern: /^[+]{0,1}(\d+)$/, message: '大于等于0的整数', trigger: 'change' }
        ],
        priority: [
          { pattern: /^[1-9]$/, message: '1-9的整数', trigger: 'change' }
        ],
        currencyId: [
          { required: true, message: '必填项', trigger: 'change' }
        ],
        supplierId: [
          { required: true, message: '必填项', trigger: 'change' }
        ],
        prodId: [
          { required: true, message: '必填项', trigger: 'change' }
        ],
        compId: [
          { required: true, message: '必填项', trigger: 'change' }
        ],
        taxRate: [
          { required: true, message: '必填项', trigger: 'blur' },
          { validator: betweenInt(0.01, 0.99), trigger: 'change' }
        ],
        purchaseDeliverytime: [{ required: true, message: '必填项', trigger: 'change' },
        { pattern: /^[1-9]\d*$/, message: '正整数', trigger: 'change' }],
        effectiveDate: [
          { required: true, message: '必填项', trigger: 'change' } // 生效日期
        ],
        expirationDate: [
          { required: true, message: '必填项', trigger: 'change' }, // 失效日期
          { validator: validateInteger, trigger: 'change' }
        ]
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
      //   this.dataForm = {}
      this.visible = false
    },
    // 弹窗关闭之前
    handleClose (done) {
      this.clearCache('dataForm')
      done()
    },
    getDataUrl () {
      // 币别
      this.$http
        .get(this.$http.adornUrl('basicData/queryAllCurrency'))
        .then(({ data }) => {
          this.currencyIdOptions = data.currencyList
        })
      // 公司
      this.$http
        .get(this.$http.adornUrl('list/combobox/company'))
        .then(({
          data
        }) => {
          this.compIdOptions = data.list
        })
    },
    init (id, type) {
      // Object.assign(this.$data, this.$options.data())
      this.visible = true
      this.getDataUrl()
      this.dataForm.id = id
      if (type === 'canAdd') {
        this.selectchange = true
        this.dataForm.pricingUser = sessionStorage.getItem('userId')
      }
      if (type === 'canEdit' && this.dataForm.id) {
        this.initEdit(id)
      }
    },
    // 编辑
    initEdit (id) {
      this.selectchange = false
      this.$nextTick(() => {
        this.$refs['dataForm'].resetFields()
        this.getDataList(id)
      })
    },
    // 调用数据
    getDataList (id) {
      this.$http({
        url: this.$http.adornUrl(
          `prod/prodpurchase/info/${id}`
        ),
        method: 'get',
        params: this.$http.adornParams()
      }).then(({ data }) => {
        if (data && data.code === 0) {
          this.dataForm = data.prodPurchase
        } else {
          this.$notify.error({
            title: '错误',
            message: data.msg,
            duration: 5000
          })
        }
      })
    },
    // 供应商名称
    supplierIdChange (obj, type) {
      // if (type) {
      //   this.$nextTick(() => {
      //     this.dataForm.currencyId = this.dataForm.currencyId
      //     this.dataForm.taxRate = this.dataForm.taxRate
      //     // this.dataForm.supplierCode = obj.code
      //   })
      // } else {
      this.$nextTick(() => {
        this.dataForm.currencyId = obj.currencyId
        this.dataForm.taxRate = obj.taxRate
        this.dataForm.supplierCode = obj.code
        this.dataForm.bIncludeTax = !!obj.bIncludeTax
      })
      // }
    },
    // 是否含税复选框
    bIncludeTaxChange (val) {
      if (val) {

      } else {
        this.dataForm.taxRate = ''
        this.$refs['taxRateRef'].resetField()
      }
    },
    // 改变产品编码带出产品名称
    codeValue (value) {
      // this.dataForm.prodCode = value.code
      this.$nextTick(() => {
        this.dataForm.prodName = value.name_ch
        this.dataForm.specifications = value.specifications
      })
      // if (this.dataForm.prodName) {
      //   this.iscode = true
      // } else {
      //   this.iscode = false
      // }
      // this.dataForm.prodId = value.id
    },
    // 表单提交
    dataFormSubmit: _.debounce(
      async function dataFormSubmit () {
        this.$refs['dataForm'].validate(valid => {
          if (valid) {
            if (!this.dataForm.id) {
              this.dataForm.addTime = null
              this.dataForm.addUser = null
              this.dataForm.updTime = null
              this.dataForm.updUser = null
            }
            this.$http({
              url: this.$http.adornUrl(
                `prod/prodpurchase/${!this.dataForm.id ? 'save' : 'update'}`
              ),
              method: !this.dataForm.id ? 'post' : 'put',
              data: this.dataForm
            }).then(({ data }) => {
              if (data && data.code === 0) {
                this.clearCache('dataForm')
                this.$emit('refreshDataList')
                this.$notify.success({
                  title: '成功',
                  message: '操作成功',
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
          } else {
            return false
          }
        })
      }, 1000, {
        leading: true,
        trailing: false
      }
    )
  },
  watch: {
    // 父组件传值给当前子组件 对应 :value=...
    value: {
      handler (val, oldVal) {
        this.searchData = this.value
        // 该行与v-model无关，为的是让父级监听该事件并做其他事
        this.$emit('change', this.searchData)
      },
      // 深度监听，可监听到对象、数组的变化
      deep: true
    },
    // 当前组件变动后，抛出事件
    dataForm: {
      // 深度监听，可监听到对象、数组的变化
      handler (val, oldVal) {
        this.$emit('input', this.dataForm) // 用于出发v-model原始事件，避免父级其他监听
        if (this.dataForm.bIncludeTax) {
          this.message = '请输入含税单价'
        } else {
          this.message = '请输入不含税单价'
        }
      },
      deep: true
    }
  }
}
</script>
