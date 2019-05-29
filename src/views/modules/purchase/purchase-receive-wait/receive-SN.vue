<template>
  <el-dialog title="SN码登记"
             :close-on-click-modal="false"
             :visible.sync="visible"
             @close="$refs['dataForm'].resetFields()"
             append-to-body
             width="30%">
    <div class="content">
      <el-form :model="dataForm"
               :rules="dataRule"
               ref="dataForm"
               label-width="110px">
        <el-row>
          <el-form-item label="产品名称"
                        prop="proName">
            <el-input v-model="dataForm.proName"
                      disabled></el-input>
          </el-form-item>
          <el-form-item label="SN前端码"
                        :rules="dataRule.isRequired"
                        prop="prefixSnCode">
            <el-input v-model="dataForm.prefixSnCode"
                      disabled></el-input>
          </el-form-item>
          <el-form-item label="生产日期码段"
                        :disabled="isPrefixSnCode"
                        :rules="dataRule.isRequired"
                        prop="DateCode">
            <el-input v-model.trim="dataForm.DateCode"
                      :disabled="isDisabled"></el-input>
          </el-form-item>
          <el-form-item label="SN码"
                        :rules="dataRule.isRequired"
                        prop="snCode">
            <el-input v-model="dataForm.snCode"
                      disabled></el-input>
          </el-form-item>
          <el-form-item label="数量"
                        prop="qty">
            <el-input v-model="dataForm.qty"
                      type="Number"
                      @mousewheel.native.prevent
                      :disabled="isDisabled"></el-input>
          </el-form-item>
          <el-form-item label="生产日期"
                        prop="produceDate">
            <el-date-picker v-model="dataForm.produceDate"
                            type="date"
                            value-format="yyyy-MM-dd"
                            :disabled="isDisabled"></el-date-picker>
          </el-form-item>
        </el-row>
        <div class="dialog-footer">
          <el-button @click="visible = false"><i class="iconfont erp-icon-quxiao"></i>取消</el-button>
          <el-button type="primary"
                     @click="save()"><i class="iconfont erp-icon-baocun"></i>保存</el-button>
        </div>
      </el-form>
    </div>
  </el-dialog>
</template>
<script>
import { dateFormatter } from '@/utils/index.js'
import _ from 'lodash'
export default {
  data () {
    // 数量校验
    var validQty = (rule, value, callback) => {
      if (
        !/^[1-9]\d*$/.test(value) &&
        value != null
      ) {
        callback(new Error('请输入大于0的整数'))
      } else {
        callback()
        // if (value > this.dataForm.poQty) {
        //   callback(new Error(`最大输入数量为${this.dataForm.poQty}`));
        // } else {
        //   callback();
        // }
      }
    }
    return {
      id: '', // 保存成功后返回的id
      visible: false,
      isDisabled: false,
      isPrefixSnCode: false,
      dataForm: {
        proName: '',
        DateCode: '',
        snCode: '',
        qty: '',   // 数量
        prefixSnCode: '',
        produceDate: '',
        poInfoId: '',  // 采购订单Id
        poDetailId: '',  // 采购订单明细ID
        prodId: '', // 产品ID
        poQty: 0  // 采购数量
      },
      dataRule: {
        isRequired: [
          { required: true, message: '必填项', trigger: 'blur' }
        ],
        qty: [
          { required: true, message: '必填项', trigger: 'blur' },
          { validator: validQty, trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
    init (row) {
      this.dataForm.snCode = ''
      this.dataForm.produceDate = dateFormatter(new Date(), false)
      this.dataForm.proName = row.prodName    // 产品名称
      this.dataForm.prefixSnCode = row.prefixSnCode  // SN前端码
      this.dataForm.poInfoId = row.poId  // 采购订单ID
      this.dataForm.poDetailId = row.poDetailId  // 采购订单明细ID
      this.dataForm.prodId = row.prodId  // 产品ID
      this.dataForm.poQty = row.poQty  // 采购数量
      this.$http({
        url: this.$http.adornUrl(
          `pur/posncode/query?id=${row.poDetailId}`
        ),
        method: 'get',
        data: this.$http.adornData({})
      }).then(({ data }) => {
        if (data && data.code === 0) {
          if (this.dataForm.poQty - data.poSncode > 0) {
            this.visible = true
          } else {
            this.visible = false
            this.$notify.error({
              title: '错误',
              message: '采购数量已登记完',
              duration: 5000
            })
            this.$emit('refreshDataList')
          }
        } else {
          this.$notify.error({
            title: '错误',
            message: data.msg,
            duration: 5000
          })
        }
      })
    },

    // 保存
    save: _.debounce(
      async function save () {
        this.$refs['dataForm'].validate(valid => {
          if (valid) {
            this.$http({
              url: this.$http.adornUrl('pur/posncode/save'),
              method: 'post',
              data: this.dataForm
            }).then(({ data }) => {
              if (data && data.code === 0) {
                this.$notify({
                  type: 'success',
                  title: '提示',
                  message: `保存成功`,
                  duration: 5000
                })
                this.visible = false
                this.$emit('refreshDataList')
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
  },
  watch: {
    // 当前组件变动后，抛出事件
    dataForm: {
      // 深度监听，可监听到对象、数组的变化
      handler (val, oldVal) {
        if (!this.dataForm.prefixSnCode) {
          this.isPrefixSnCode = true
        } else {
          this.isPrefixSnCode = false
          this.dataForm.snCode = this.dataForm.prefixSnCode + this.dataForm.DateCode
        }
      },
      deep: true
    }
  }
}
</script>
<style scoped>
.dialog-footer {
  text-align: right;
  margin-bottom: 10px;
}
.content {
  height: auto;
}
</style>
