<template>
  <el-dialog :title="!dataForm.id ? '仓库新增' : '仓库修改'"
             :close-on-click-modal="false"
             :visible.sync="visible"
             width="50%"
             @close="$refs['dataForm'].resetFields()">
    <el-form :model="dataForm"
             :rules="dataRule"
             ref="dataForm"
             label-width="130px">
      <el-row>
        <el-col :span="12">
          <el-form-item label="仓库代码"
                        prop="code">
            <el-input v-model="dataForm.code"></el-input>
          </el-form-item>
          <el-form-item label="仓库名称"
                        prop="name">
            <el-input v-model="dataForm.name"></el-input>
          </el-form-item>
          <el-form-item label="备货天数"
                        prop="stockDays">
            <el-input v-model="dataForm.stockDays"
                      type="Number"
                      @mousewheel.native.prevent></el-input>
          </el-form-item>
          <el-form-item label="仓库属性"
                        prop="dictWarehousePropertires">
            <select-all v-model="dataForm.dictWarehousePropertires"
                        :listDataOption="dictWarehouseOptions"
                        data-value="key"
                        data-label="value"
                        :isSelectChange="true"
                        @selectChange="warehouseChange"></select-all>
          </el-form-item>
          <el-form-item label="第三方仓存储类型"
                        prop="thirdProperties">
            <el-input v-model="dataForm.thirdProperties"
                      :disabled="thirdIsDisabled"></el-input>
          </el-form-item>
          <el-form-item label="对应店铺"
                        prop="channelId">
            <select-all v-model="dataForm.channelId"
                        :listDataOption="channelIdOptions"
                        :isDisabled="isDisabledFBA"
                        data-value="id"
                        data-label="name"></select-all>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="所在国家"
                        prop="country">
            <select-all v-model="dataForm.country"
                        :listDataOption="countryOptions"
                        data-value="id"
                        data-label="nameCn"
                        :isSelectChange="true"
                        @selectChange="countryChange"></select-all>
          </el-form-item>
          <el-form-item label="所在城市"
                        prop="area">
            <select-all v-model="dataForm.area"
                        :listDataOption="areaOptions"
                        data-value="id"
                        data-label="name"></select-all>
          </el-form-item>
          <el-form-item label="备注"
                        prop="remarks">
            <textarea-all v-model="dataForm.remarks"></textarea-all>
          </el-form-item>
          <el-form-item label="所属公司"
                        prop="compId">
            <select-all v-model="dataForm.compId"
                        :listDataOption='companyList'
                        dataValue='orgId'
                        dataLabel='name'
                        placeholder=""></select-all>
          </el-form-item>
          <el-form-item label="状态"
                        prop="bUsed">
            <el-radio-group v-model="dataForm.bUsed">
              <el-radio :label="false">禁用</el-radio>
              <el-radio :label="true">正常</el-radio>
            </el-radio-group>
          </el-form-item>
        </el-col>

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
      if (!/^[1-9]\d*$/.test(value) && !!value) {
        callback(new Error('请输入正整数'))
      } else {
        callback()
      }
    }
    return {
      channelIdOptions: [], // 对应店铺
      dictWarehouseOptions: [], // 仓库属性
      companyList: [],  // 所属公司
      //   第三方仓
      thirdIsDisabled: true,
      // 对应店铺-FBA
      isDisabledFBA: true,
      visible: false,
      cityFilter: {
        countryId: ''
      },
      areaOptions: [],
      countryOptions: [], // 所在国家
      dataForm: {
        id: '',
        code: '',
        name: '',
        stockDays: '',
        // 仓库属性
        dictWarehousePropertires: '',
        // 供应商
        supplier: '',
        // 第三方仓存储类型
        thirdProperties: '',
        // 所在国家
        country: '',
        // 所在城市
        area: '',
        remarks: '',
        // 库存状态类型
        dictStockStatus: '',
        bUsed: true,
        compId: '',
        //   是否FBA仓
        // bFba:false,
        // 对应店铺
        channelId: '',
        // companies: '',

        // 选择框
        checkList: [],
        isOne: false // 第一次加载的判断
      },
      dataRule: {
        code: [
          { required: true, message: '仓库代码不能为空', trigger: 'blur' }
        ],
        name: [
          { required: true, message: '仓库名称不能为空', trigger: 'blur' }
        ],
        country: [
          { required: true, message: '所在国家不能为空', trigger: 'change' }
        ],
        compId: [
          { required: true, message: '所属公司不能为空', trigger: 'change' }
        ],
        stockDays: [{ validator: validateInteger, trigger: 'blur' }]
      }
    }
  },
  created () {
    // 对应店铺
    this.$http
      .get(this.$http.adornUrl('basic/basicchannel/listcombobox'))
      .then(({ data }) => {
        this.channelIdOptions = data.list
      })
    // 所在国家
    this.$http
      .get(this.$http.adornUrl('/basicData/queryAllCountry'))
      .then(({ data }) => {
        this.countryOptions = data.countries
      })
    // 所属公司
    this.$http.get(this.$http.adornUrl('/sys/organization/select')).then(({ data }) => { this.companyList = data.companyList })
    this.getDataUrl()
  },
  methods: {
    warehouseChange (value) {
      if (value === 'THIRD') {
        this.thirdIsDisabled = false
        this.isDisabledFBA = true
        this.dataForm.channelId = ''
      } else if (value === 'FBA') {
        this.isDisabledFBA = false
        this.thirdIsDisabled = true
        this.dataForm.thirdProperties = ''
      } else {
        this.thirdIsDisabled = true
        this.isDisabledFBA = true
        this.dataForm.thirdProperties = ''
        this.dataForm.channelId = ''
      }
    },
    // 城市
    areaOptionsSelect (val, type) {
      if (!this.dataForm.country) {
        console.log('没有选择国家')
        return
      }
      this.$http({
        url: this.$http.adornUrl('basicData/queryCityByCountry'),
        method: 'get',
        params: this.$http.adornParams(
          {
            countryId: val
          },
          false
        )
      }).then(({ data }) => {
        this.areaOptions = data.cities
      })
    },
    // 选择国家的时候
    countryChange (val) {
      this.$nextTick(() => {
        this.dataForm.area = ''
        if (!this.dataForm.id) {
        }
        if (!this.dataForm.id || this.isOne) {
          console.log('没有清空area数据')
        } else {
          this.isOne = false
        }
        this.areaOptionsSelect(val)
      })
    },
    getDataUrl () {
      // 仓库属性
      this.$http
        .get(this.$http.adornUrl('basicData/queryDataDict2List'), {
          params: { dataDictKey: 'WAREHOUSE_PROPERTIRES' }
        })
        .then(({ data }) => {
          this.dictWarehouseOptions = data.fontMaps
        })
    },
    init (id, type) {
      this.dataForm.addTime = ''
      this.dataForm.addUser = ''
      this.dataForm.updTime = ''
      this.dataForm.updUser = ''
      this.dataForm.id = id
      this.visible = true
      this.isOne = true
      this.areaOptions = []
      this.$nextTick(() => {
        this.$refs['dataForm'].resetFields()
        if (id) {
          this.$http({
            url: this.$http.adornUrl(`basic/basicwarehouse/info/${id}`),
            method: 'get',
            params: this.$http.adornParams({}, false)
          }).then(({ data }) => {
            if (data && data.code === 0) {
              this.dataForm = data.basicWarehouse
              this.areaOptionsSelect(this.dataForm.country)
              this.warehouseChange(this.dataForm.dictWarehousePropertires)
            }
          })
        } else {
          this.warehouseChange()
        }
      })
    },
    // 表单提交
    dataFormSubmit: _.debounce(
      async function dataFormSubmit () {
        this.$refs['dataForm'].validate(valid => {
          if (valid) {
            this.$http({
              url: this.$http.adornUrl(
                `basic/basicwarehouse/${!this.dataForm.id ? 'save' : 'update'}`
              ),
              method: `${!this.dataForm.id ? 'post' : 'put'}`,
              data: this.$http.adornData(this.dataForm)
            }).then(({ data }) => {
              if (data && data.code === 0) {
                this.$emit('refreshDataList')
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
