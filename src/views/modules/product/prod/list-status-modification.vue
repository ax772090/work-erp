<template>
  <el-dialog width="30%"
             :title="'批量修改'"
             :close-on-click-modal="false"
             :visible.sync="visible"
             @close="$refs['dataForm'].resetFields()">
    <div>
      <el-row>
        <el-col :span="8">
          <select-all v-model="selectedOption"
                      :listDataOption="searchOptions"
                      data-value="value"
                      data-label="label"
                      :isClearable="false"
                      :isSelectItemChange="true"
                      @selectChange="sellStatusChange"></select-all>
        </el-col>
        <el-col :span="16">
          <!-- 远程查询方式 -->
          <select-seach v-for="(item, index) in searchOptions"
                        :key="index"
                        v-if="(item.value === selectedOption) && (item.inputType === 'el-select-remote')"
                        v-model="searchData[selectedOption]"
                        :httpUrl='item.httpUrl'
                        :requestParams='item.requestParams'
                        :dataSource='item.dataSource'
                        :dataValue='item.dataValue'
                        :dataLabel='item.dataLabel'
                        :placeholder="'输入'+item.placeholder">
            <i slot="suffix"
               class="iconfont el-input__icon el-icon-erp-sousuo1"></i>
          </select-seach>
          <selectAll v-for="(item, index) in searchOptions"
                     :key="index"
                     v-if="(item.value === selectedOption) && (item.inputType === 'el-select')"
                     v-model="searchData[selectedOption]"
                     :listDataOption="selectOption"
                     :data-value="item.dataValue"
                     :data-label="item.dataLabel"></selectAll>
          <el-input v-for="(item, index) in searchOptions"
                    :key="index"
                    v-if="(item.value === selectedOption) && (item.inputType === 'el-input')"
                    v-model="searchData[selectedOption]"
                    clearable
                    :placeHolder="'输入'+item.label"></el-input>
        </el-col>
      </el-row>
    </div>
    <span slot="footer"
          class="dialog-footer">
      <el-button @click="visible = false"><i class="iconfont erp-icon-quxiao"></i>取消</el-button>
      <el-button type="primary"
                 @click="dataFormSubmit()"><i class="iconfont erp-icon-queding"></i>确定</el-button>
    </span>
  </el-dialog>
</template>
<script>
import selectAll from '@/components/erp-select/select-all'
import selectSeach from '@/components/erp-select/select-seach'
export default {
  components: {
    selectAll,
    selectSeach
  },
  data () {
    return {
      visible: false,

      selectedOption: '',
      selectOption: [],
      dataForm: {
        ids: ''
      },
      searchOptions: [{
        label: '销售状态',
        value: 'dictSaleStatus',
        inputType: 'el-select',

        httpUrl: 'basicData/queryDataDict2List',
        requestParams: { dataDictKey: 'SALE_STATUS' },
        dataSource: 'fontMaps',
        title: 'brandList',
        dataValue: 'key',
        dataLabel: 'value',
        placeholder: '销售状态'
      }, {
        label: '采购员',
        value: 'purUserId',
        inputType: 'el-select-remote',

        httpUrl: '/list/search/user',
        queryKey: 'name',
        dataSource: 'list',
        title: 'devUserList',
        dataValue: 'id',
        dataLabel: 'name',
        placeholder: '采购员'
      }, {
        label: '采购预计交期',
        value: 'deliveryDays',
        inputType: 'el-input'
      }, {
        label: '采购成本价',
        value: 'purCostPrice',
        inputType: 'el-input'
      }],
      // 拿到的数据
      searchData: {}
    }
  },
  created () {
    // 默认第一个
    if (this.searchOptions) {
      this.selectedOption = this.searchOptions[0].value
      // 第一个是下拉列表则请求
      if (this.searchOptions[0].inputType === 'el-select') {
        this.sellStatusChange(this.searchOptions[0])
      }
    }
  },
  methods: {
    // 下拉选择需要修改的类型时
    sellStatusChange (item) {
      this.searchData = {}
      if (item.inputType === 'el-select') {
        this.$http({
          url: this.$http.adornUrl(item.httpUrl),
          method: 'get',
          params: item.requestParams
        }).then(({ data }) => {
          if (data && data.code === 0) {
            this.selectOption = data[item.dataSource]
            // this.$notify.success({
            //   title: '成功',
            //   message: '操作成功',
            //   duration: 5000
            // })
          } else {
            // this.$notify.error({
            //   title: '错误',
            //   message: data.msg,
            //   duration: 5000
            // })
          }
        })
      }
    },
    init (ids) {
      this.visible = true
      this.dataForm.ids = ids
      this.searchData = {}
    },
    // 表单提交
    dataFormSubmit: _.debounce(
      async function dataFormSubmit () {
        this.$http({
          url: this.$http.adornUrl('prod/prodbasic/updatestatus'),
          method: 'put',
          data: Object.assign({}, { list: this.dataForm.ids }, this.searchData)
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
      }, 1000, {
        leading: true,
        trailing: false
      }
    )
  }
}
</script>
