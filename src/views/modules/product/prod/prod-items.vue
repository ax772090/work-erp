<template>
  <div>
    <el-form :model="dataForm"
             :rules="dataRule"
             ref="dataForm"
             label-width="110px"
             :disabled="formDisabled">
      <el-row>
        <el-button type="warning"
                   @click="AddNewProd()"><i class="iconfont erp-icon-tianjiamingxi"></i>新增明细行</el-button>
      </el-row>
      <el-table :data="dataForm.tableData"
                border
                v-loading="dataListLoading"
                @selection-change="selectionChangeHandle">
        <el-table-column type="selection"
                         align="center"
                         header-align="center"
                         width="50"></el-table-column>
        <el-table-column prop="prodCode"
                         label="产品编号"></el-table-column>
        <el-table-column prop="nameCh"
                         label="产品名称"></el-table-column>
        <el-table-column prop="imageUrl"
                         label="产品图片">
          <template slot-scope="scope">
            <tableImg :imageUrl='scope.row.imageUrl'></tableImg>
          </template>
        </el-table-column>
        <el-table-column prop="usedQty"
                         label="组合数量"
                         width="250">
          <template slot-scope="scope">
            <el-form-item :prop="'tableData[' + scope.$index + '].usedQty'"
                          :rules="dataRule.isRequiredAndisInteger"
                          label-width="0px">
              <el-input v-model="scope.row.usedQty"></el-input>
            </el-form-item>
          </template>
        </el-table-column>
        <el-table-column prop="unitName"
                         label="库存单位"></el-table-column>
        <el-table-column prop="remarks"
                         label="备注">
          <template slot-scope="scope">
            <textarea-all v-model="scope.row.remarks"></textarea-all>
          </template>
        </el-table-column>
        <el-table-column fixed="right"
                         width="80"
                         label="操作">
          <template slot-scope="scope">
            <el-button type="danger"
                       size="small"
                       circle
                       title="删除"
                       @click="deleteHandle(scope)"><i class="iconfont erp-icon-shanchu"></i></el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-form>
    <items-add-new-prod @selectAddArr="selectAddArr"
                        v-if="itemsAddNewProdVisible"
                        ref="itemsAddNewProd"></items-add-new-prod>
  </div>
</template>
<script>
import itemsAddNewProd from './items-add-new-prod'
import Bus from '@/components/js/bus.js'
// 引入图片
import tableImg from '@/components/list-table/table-img'
// 备注组件
import textareaAll from '@/components/erp-input/textarea-all'
export default {
  props: ['value'],
  components: {
    itemsAddNewProd,
    tableImg,
    textareaAll
  },
  data () {
    return {
      formDisabled: false,
      type: '',
      dataForm: {
        id: '',
        tableData: []
      },
      // 子传来的数据（多选）
      childrenData: [],
      dataListLoading: false,
      // 新增行弹窗
      itemsAddNewProdVisible: false,
      dataRule: {
        isRequiredAndisInteger: [
          { required: true, message: '必填项', trigger: 'change' },
          { pattern: /^[1-9]\d*$/, message: '大于零的整数', trigger: 'change' }
        ]
      }
    }
  },
created () {},
  methods: {
    init (id, type, handleType, dataForm) {
      // 7
      this.dataForm.id = id
      this.type = type
      if (handleType === '1') {
        this.formDisabled = true
      } else if (handleType === 'copy') {
        this.dataForm.tableData = dataForm.prodItemsEntityList.map(o => {
          return {
            prodId: o.prodId, // 当前产品基本信息主键
            subProdId: o.subProdId, // 成品产品基本信息id
            prodCode: o.prodCode,
            nameCh: o.prodName,
            imageUrl: o.imageUrl,
            unitName: o.unitName,
            usedQty: o.usedQty,
            remarks: o.remarks
          }
        })
      }
      if (id) {
        this.$nextTick(() => {
          if (this.dataForm.id) {
            this.$http({
              url: this.$http.adornUrl(
                `prod/prodbasic/info/${this.dataForm.id}/${this.type}`
              ),
              method: 'get',
              params: this.$http.adornParams({}, false)
            }).then(({ data }) => {
              if (data && data.code === 0) {
                this.dataForm.tableData = data.prodItemsEntityList.map(o => {
                  return {
                    prodId: o.prodId, // 当前产品基本信息主键
                    subProdId: o.subProdId, // 成品产品基本信息id
                    prodCode: o.prodCode,
                    nameCh: o.prodName,
                    imageUrl: o.imageUrl,
                    unitName: o.unitName,
                    usedQty: o.usedQty,
                    remarks: o.remarks
                  }
                })
              }
            })
          }
        })
      }
    },

    // 新增行
    AddNewProd () {
      this.itemsAddNewProdVisible = true
      this.$nextTick(() => {
        this.$refs.itemsAddNewProd.init(
          this.dataForm.id,
          this.dataForm.tableData
        )
      })
    },

    // 删除行
    deleteHandle (scope) {
      this.dataForm.tableData.splice(scope.$index, 1)
    },

    // 多选
    selectionChangeHandle (val) {
      this.dataListSelections = val
    },

    // 子触发的事件
    selectAddArr (list) {
      for (const data of list) {
        let isFind = false
        for (const item of this.dataForm.tableData) {
          if (data.subProdId === item.subProdId) {
            isFind = true
            break
          }
        }
        if (!isFind) {
          this.dataForm.tableData.push(data)
        }
      }
    },

    // 表单提交
    dataFormSubmit: _.debounce(
      async function dataFormSubmit (id, type) {
        this.$refs['dataForm'].validate(valid => {
          if (valid) {
            this.$http({
              url: this.$http.adornUrl('prod/prodbasic/update'),
              method: 'put',
              data: {
                prodId: id,
                type: type,
                prodItemsEntityList: this.dataForm.tableData
              }
            }).then(({ data }) => {
              if (data && data.code === 0) {
                Bus.$emit('prodTabChildren')
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
          }
        })
      },
      1000,
      {
        leading: true,
        trailing: false
      }
    ),

    validate () {
      return new Promise((resolve, reject) => {
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
        this.dataForm.tableData = this.value
        this.$emit('change', this.dataForm.tableData)
      },
      deep: true
    },
    dataForm: {
      handler (val, oldVal) {
        this.$emit('input', this.dataForm.tableData)
      },
      deep: true
    }
  }
}
</script>