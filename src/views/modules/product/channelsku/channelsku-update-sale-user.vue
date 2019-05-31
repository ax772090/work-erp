<template>
  <el-dialog :title="!dataForm.id ? '批量修改销售人员' : '批量修改销售人员'"
             :close-on-click-modal="false"
             width="30%"
             @close="$refs['dataForm'].resetFields()"
             :visible.sync="visible">
    <el-form :model="dataForm"
             ref="dataForm"
             label-width="110px">
      <el-form-item label="销售人员"
                    prop="saleUserId">
        <el-select v-model="saleUserId"
                   filterable
                   remote
                   :remote-method="userQuerySearch"
                   :loading="userLoading"
                   @change="saleUserChange">
          <el-option v-for="item in userOptions"
                     :key="item.id"
                     :label="item.name"
                     :value="item.id"></el-option>
        </el-select>
      </el-form-item>
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
import { listSearchUser } from '@/api/common/common.api'
export default {
  data () {
    return {
      visible: false,
      // 是否正在远程搜索=>销售人员
      userLoading: false,
      // 销售人员
      userOptions: [],
      // 销售人员
      // saleUserIdOptions: '',
      ids: [],
      saleUserId: '',
      dataForm: {}
    }
  },
  methods: {
    init (datas) {
      Object.assign(this.$data, this.$options.data())
      this.saleUserId = ''
      this.userOptions = []
      // 提取ids数组
      for (var i = 0; i < datas.length; i++) {
        this.ids.push(datas[i].id)
      }
      this.visible = true
    },

    saleUserChange (val) {
      this.dataForm = {}
      this.$set(this.dataForm, val, this.ids)
    },

    // 搜索建议框=>销售人员
    userQuerySearch (queryString) {
      clearTimeout(this.timeout)
      this.timeout = setTimeout(() => {
        listSearchUser({
          name: queryString
        }).then(data => {
          this.userOptions = data.list
        })
      }, 500 * Math.random())
    },

    // 表单提交
    dataFormSubmit: _.debounce(
      async function dataFormSubmit () {
        this.$refs['dataForm'].validate(valid => {
          if (valid) {
            this.$http({
              url: this.$http.adornUrl('prod/prodchannelsku/updatestatus'),
              method: 'put',
              data: this.$http.adornData(this.dataForm, false)
            }).then(({ data }) => {
              if (data && data.code === 0) {
                this.$emit('refreshDataList')
                this.visible = false
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
