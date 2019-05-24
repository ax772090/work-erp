<template>
  <el-dialog title="手工关闭（销单）"
             :close-on-click-modal="false"
             :visible.sync="visible"
             :append-to-body="true"
             width="70%">
    <el-form :model="dataForm"
             :rules="dataRule"
             ref="dataForm"
             label-width="110px">
      <el-table :data="dataForm.poDetails"
                border
                stripe
                highlight-current-row
                v-loading="dataListLoading">
        <el-table-column prop="code"
                         label="产品编码"></el-table-column>
        <el-table-column prop="prodName"
                         label="产品名称"></el-table-column>
        <el-table-column prop="poQty"
                         label="采购数量"></el-table-column>
        <el-table-column prop="closeQty"
                         label="关闭数量">
          <template slot-scope="scope">
            <el-form-item :prop="'poDetails[' + scope.$index + '].closeQty'"
                          :rules="dataRule.isRequired"
                          label-width="0px">
              <el-input v-model="scope.row.closeQty"
                        type="Number"
                        @input="realityQtyNum(scope.row)"
                        @mousewheel.native.prevent></el-input>
            </el-form-item>
          </template>
        </el-table-column>
        <el-table-column prop="receiveqty"
                         label="实际采购数量">
        </el-table-column>
      </el-table>
    </el-form>
    <span slot="footer">
      <el-button @click="visible = false"><i class="iconfont erp-icon-quxiao"></i>取消</el-button>
      <el-button type="primary"
                 @click="dataFormSubmit()"><i class="iconfont erp-icon-queding"></i>确定</el-button>
    </span>
  </el-dialog>
</template>
<script>
export default {
  data () {
    // 手工关闭数量校验
    var validQty = (rule, value, callback) => {
      let subString = rule.field.split('[')[1]
      let valueIndex = subString.split(']')[0]
      if (!/^[1-9]\d*$/.test(value) && value != null) {
        callback(new Error('请输入正整数'))
      } else if (value > this.dataForm.poDetails[valueIndex].waitQty) {
        callback(new Error(`最大关闭数量为${this.dataForm.poDetails[valueIndex].waitQty}`))
      } else {
        callback()
      }
    }
    return {
      visible: false,
      dataListLoading: false,
      dataForm: {
        poDetails: []
      },
      dataRule: {
        isRequired: [
          { required: true, message: '必填项', trigger: 'blur' },
          { validator: validQty, trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
    init (datalist) {
      this.dataForm.poDetails = []
      this.visible = true
      this.$nextTick(() => {
        this.dataForm.poDetails.push(datalist)
        for (const item of this.dataForm.poDetails) {
          this.$set(item, 'closeQty', '')
          item.receiveqty = item.poQty
        }
      })
    },
    // 动态计算实际采购数量--------  采购数量-关闭数量=实际采购数量
    realityQtyNum (row) {
      row.receiveqty = row.poQty - row.closeQty
    },
    // 确定
    dataFormSubmit: _.debounce(
      async function dataFormSubmit () {
        this.$refs['dataForm'].validate(valid => {
          if (valid) {
            let dataArr = []
            for (let i = 0; i < this.dataForm.poDetails.length; i++) {
            dataArr.push({ id: this.dataForm.poDetails[i].poDetailId, closeQty: Number(this.dataForm.poDetails[i].closeQty) })
            }
            this.$http({
              url: this.$http.adornUrl('warehouse/whreceivepo/purClose'),
              method: 'post',
              data: dataArr
            }).then(({ data }) => {
              if (data && data.code === 0) {
                this.$emit('refreshDataList')
                this.visible = false
                this.$notify.success({
                  title: '成功',
                  message: '手工关闭成功',
                  duration: 5000
                })
              } else {
                this.$notify.error({
                  title: '失败',
                  message: data.msg
                })
              }
              this.dataListLoading = false
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