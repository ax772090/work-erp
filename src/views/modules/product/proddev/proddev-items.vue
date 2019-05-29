<template>
  <div>
    <el-form :model="dataForm"
             :rules="dataRule"
             ref="dataForm"
             label-width="110px"
             :disabled="formDisabled">
      <el-row :span="24">
        <div class="grid-content bg-purple-light">
          <el-button type="warning"
                     @click="AddNewProd()"><i class="iconfont erp-icon-tianjiamingxi"></i>新增明细行</el-button>
        </div>
      </el-row>
      <el-table :data="dataForm.tableData"
                border
                v-loading="dataListLoading"
                @selection-change="selectionChangeHandle">
        <el-table-column type="selection"
                         header-align="center"
                         align="center"
                         width="50"></el-table-column>
        <el-table-column prop="prodCode"
                         header-align="center"
                         align="center"
                         label="产品编号"></el-table-column>
        <el-table-column prop="nameCh"
                         header-align="center"
                         align="center"
                         label="产品名称"></el-table-column>
        <el-table-column prop="imageUrl"
                         header-align="center"
                         align="center"
                         label="产品图片">
          <template slot-scope="scope">
            <tableImg :imageUrl='scope.row.imageUrl'></tableImg>

          </template>
        </el-table-column>
        <el-table-column prop="usedQty"
                         header-align="center"
                         align="center"
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
                         header-align="center"
                         align="center"
                         label="库存单位"></el-table-column>
        <el-table-column prop="remarks"
                         header-align="center"
                         align="center"
                         label="备注">
          <template slot-scope="scope">
            <textarea-all v-model="scope.row.remarks"></textarea-all>
          </template>
        </el-table-column>
        <el-table-column fixed="right"
                         header-align="center"
                         align="center"
                         width="80"
                         label="操作">
          <template slot-scope="scope">
            <el-button type="danger"
                       circle
                       title="删除"
                       @click="deleteHandle(scope)"><i class="iconfont erp-icon-shanchu"></i></el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-form>
    <proddev-items-browser @selectAddArr="selectAddArr"
                           v-if="proddevItemsBrowserVisible"
                           ref="proddevItemsBrowser"></proddev-items-browser>
  </div>
</template>

<script>
import proddevItemsBrowser from './proddev-items-browser'
import Bus from '@/components/js/bus.js'
// 引入图片
import tableImg from '@/components/list-table/table-img'
// 备注组件
import textareaAll from '@/components/erp-input/textarea-all'
export default {
  props: ['value'],
  components: {
    proddevItemsBrowser,
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
      proddevItemsBrowserVisible: false,
      dataRule: {
        isRequiredAndisInteger: [
          { required: true, message: '必填项', trigger: 'change' },
          { pattern: /^[1-9]\d*$/, message: '大于零的整数', trigger: 'change' }
        ]
      }
    }
  },

  methods: {
    init (id, type, handleType) {
      if (handleType === 'canCheck') {
        this.formDisabled = true
      }
      // 审核
      if (handleType === 'canApproval') {
        this.formDisabled = true
      }
      // 7
      this.dataForm.id = id
      this.type = type
      this.$nextTick(() => {
        if (this.dataForm.id) {
          this.$http({
            url: this.$http.adornUrl(
              `/prod/proddevbasic/info/${this.dataForm.id}/${this.type}`
            ),
            method: 'get',
            params: this.$http.adornParams({}, false)
          }).then(({ data }) => {
            if (data && data.code === 0) {
              // this.dataForm.tableData = data.prodDevItemsEntityList
              this.dataForm.tableData = data.prodDevItemsEntityList.map(o => {
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
    },

    // 新增行
    AddNewProd () {
      this.proddevItemsBrowserVisible = true
      this.$nextTick(() => {
        this.$refs.proddevItemsBrowser.init(
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
              url: this.$http.adornUrl('prod/proddevbasic/update'),
              method: 'put',
              data: this.$http.adornData(
                {
                  prodId: id,
                  type: type,
                  prodDevItemsEntityList: this.dataForm.tableData
                },
                false
              )
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
    // childrenData: {
    //   handler (val, oldVal) {
    //     this.dataForm.tableData = []
    //     for (var i = 0; i < this.childrenData.length; i++) {
    //       var obj = {}
    //       this.$set(obj, 'subProdId', this.childrenData[i].subProdId)
    //       this.$set(obj, 'usedQty', this.childrenData[i].usedQty)
    //       this.$set(obj, 'prodId', this.dataForm.id)
    //       this.$set(obj, 'remarks', this.childrenData[i].remarks)
    //       this.dataForm.tableData.push(obj)
    //     }
    //   },
    //   deep: true
    // }
  }
}
</script>
<style scoped>
.item {
  margin-bottom: 20px;
  margin-left: 50px;
  font-size: 16px;
  font-weight: 600;
}

.floatright {
  float: right;
}

.el-select {
  width: 100%;
}

.imglist {
  cursor: pointer;
  width: 100px;
}
.imglistPopover {
  max-width: 600px;
}
</style>