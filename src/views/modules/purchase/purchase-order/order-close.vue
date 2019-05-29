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
        <el-table-column prop="nameCh"
                         label="产品名称"></el-table-column>
        <el-table-column prop="qty"
                         label="采购数量"></el-table-column>
        <el-table-column prop="closeQty"
                         label="关闭数量">
          <template slot-scope="scope">
            <el-form-item :prop="'poDetails[' + scope.$index + '].closeQty'"
                          :rules="dataRule.closeQty"
                          label-width="0px">
              <el-input v-model="scope.row.closeQty"
                        type="Number"
                        @mousewheel.native.prevent
                        @input="realityQtyNum(scope.row)"></el-input>
            </el-form-item>
          </template>
        </el-table-column>
        <el-table-column prop="realityQty"
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
      } else if (value > this.dataForm.poDetails[valueIndex].qty) {
        callback(new Error('关闭数量应小于或等于采购数量'))
      } else {
        callback()
      }
    }
    return {
      visible: false,
      dataListLoading: false,
      dataForm: {
        realityQty: 0,
        qty: 0,
        closeQty: 0
      },
      dataList: [],
      dataRule: {
        closeQty: [
          { required: true, message: '请输入整数', trigger: 'change' },
          { validator: validQty, trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
    init (id) {
      this.visible = true
      this.$nextTick(() => {
        if (id) {
          this.$http({
            url: this.$http.adornUrl(`pur/poinfo/info/${id}`),
            method: 'get',
            params: this.$http.adornParams()
          }).then(({ data }) => {
            if (data && data.code === 0) {
              for (let i = 0; i < data.poInfoDto.poDetails.length; i++) {
                this.$set(data.poInfoDto.poDetails[i], 'code', data.poInfoDto.poDetails[i].prodBasicEntity.code)
                this.$set(data.poInfoDto.poDetails[i], 'nameCh', data.poInfoDto.poDetails[i].prodBasicEntity.nameCh)
                this.$set(data.poInfoDto.poDetails[i], 'realityQty', 0)
              }
              this.dataForm = data.poInfoDto
            }
          })
        }
      })
    },
    // 获取数据列表
    getDataList () {
      this.$nextTick(() => {
        let newContent = this.$refs.prints.innerHTML
        document.body.innerHTML = newContent
        window.print()
        window.location.reload()
      })
    },
    // 动态计算实际采购数量--------  采购数量-关闭数量=实际采购数量
    realityQtyNum (row) {
      row.realityQty = row.qty - row.closeQty
    },
    // 确定
    dataFormSubmit: _.debounce(
      async function dataFormSubmit () {
        this.$refs['dataForm'].validate(valid => {
          if (valid) {
            let dataArr = []
            for (let i = 0; i < this.dataForm.poDetails.length; i++) {
              dataArr.push({ id: this.dataForm.poDetails[i].id, closeQty: Number(this.dataForm.poDetails[i].closeQty) })
            }
            this.$http({
              url: this.$http.adornUrl('pur/poinfo/closeById'),
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
      }, 1000, {
        leading: true,
        trailing: false
      }
    )
  },
  watch: {
    'dataForm.poDetails': {
      handler (val, oldval) {
        for (let i = 0; i < val.length; i++) {
          val[i].realityQty = val[i].qty - val[i].closeQty
        }
      },
      deep: true
    }
  }
}
</script>