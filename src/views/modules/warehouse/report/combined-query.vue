<!-- 组合品可组装数查询（主表） -->
<template>
  <div class="mod-config">
    <el-form :rules="dataRule"
             :inline="true"
             :model="dataForm"
             ref="dataForm">
      <el-row>
        <el-form-item label="仓库"
                      prop="whId">
          <select-all v-model="dataForm.whId"
                      :listDataOption="WarehouseIdOptions"
                      data-value="id"
                      data-label="name"></select-all>
        </el-form-item>
      </el-row>
      <el-row>
        <select-seach v-model="dataForm.prodId"
                      httpUrl="/prod/prodbasic/queryForComplete?bAssemble=true"
                      httpMethod="get"
                      requestParamsKey="code"
                      data-label="code"
                      data-value="id"
                      data-label-right='name_ch'
                      placeholder="请输入产品编码/产品名称"
                      data-source="list"
                      :showName='true'
                      isSelectChange="true"
                      @selectChange="codeValue"></select-seach>
        <el-button type="primary"
                   @click="getDataList">
          <i class="iconfont erp-icon-sousuo"></i>搜索
        </el-button>
        <el-button type="primary"
                   @click="reset">
          <i class="iconfont erp-icon-chongzhi"></i>重置
        </el-button>
      </el-row>
      <el-row>
        <span>
          编码为
          <span class="underline">&nbsp;&nbsp;{{dataForm.prodId?dataForm.code:''}}&nbsp;&nbsp;</span>的
          <span class="underline">&nbsp;&nbsp;{{dataForm.prodId?dataForm.prodName:''}}&nbsp;&nbsp;</span>的组合产品及系统库存情况如下：
        </span>
      </el-row>
      <el-table :data="dataList"
                stripe
                border
                highlight-current-row
                max-height="800"
                v-loading="dataListLoading">
        <el-table-column prop="code"
                         sortable
                         label="子项产品编码"></el-table-column>
        <el-table-column prop="nameCh"
                         label="子项产品名称"></el-table-column>
        <el-table-column prop="specifications"
                         label="规格型号"></el-table-column>
        <el-table-column prop="usedQty"
                         label="组合用量"
                         sortable></el-table-column>
        <el-table-column prop="waitQty"
                         label="待检数量"
                         sortable></el-table-column>
        <el-table-column prop="avalibleQty"
                         label="可用数量"
                         sortable></el-table-column>
      </el-table>
      <p class="p-20">
        则可组合成
        <span>&nbsp;&nbsp;{{dataForm.prodId?dataForm.prodName:''}}&nbsp;&nbsp;</span>
      </p>
      <p class="p-200">可用库存数：&nbsp;&nbsp;{{availableStock}}</p>
    </el-form>
  </div>
</template>
<script>
// 分页
import paginationAll from '@/components/erp-pagination/pagination-all'
import selectSeach from '@/components/erp-select/select-seach'
import selectAll from '@/components/erp-select/select-all'
import { initData } from '@/mixins/initData.js'
export default {
  mixins: [initData],
  components: {
    paginationAll,
    selectSeach,
    selectAll
  },

  data () {
    return {
      dataForm: {
        prodId: '',
        whId: ''
      },
      dataList: [],
      WarehouseIdOptions: [], // 仓库
      dataListLoading: false,
      dataRule: {
        whId: [
          {
            required: true,
            message: '请选择仓库',
            trigger: 'change'
          }
        ],
        prodId: [
          {
            required: true,
            message: '请选择产品编码或产品名称',
            trigger: 'change'
          }
        ]
      }
    }
  },
  created () {
    // 仓库
    this.$http
      .get(this.$http.adornUrl('list/combobox/warehouse'))
      .then(({ data }) => {
        this.WarehouseIdOptions = data.list
      })
  },
  methods: {
    // 选择产品编码带出产品名称
    codeValue (value) {
      this.dataForm.code = value.code
      this.dataForm.prodName = value.name_ch
    },

    // 获取数据列表
    getDataList () {
      //   有必填字段，先校验
      this.$refs['dataForm'].validate(valid => {
        if (valid) {
          this.dataListLoading = true
          this.$http({
            url: this.$http.adornUrl(
              'warehouse/whassemble/queryAvalibleAssemble'
            ),
            method: 'post',
            data: Object.assign({}, this.dataForm)
          }).then(({ data }) => {
            if (data && data.code === 0) {
              if (data.pageList) {
                this.dataList = data.pageList
                for (const row of this.dataList) {
                  this.$set(row, 'detail', [])
                }
              } else {
                // this.dataList = [];
              }
            }
            this.dataListLoading = false
          })
        }
      })
    },
    // 重置
    reset () {
      this.dataForm.prodId = ''
    }
  },
  // 动态计算可用库存数
  computed: {
    availableStock () {
      if (this.dataList.length > 0) {
        let arr = []
        for (let i = 0; i < this.dataList.length; i++) {
          // 可用数量/组合数量
          arr.push(this.dataList[i].avalibleQty / this.dataList[i].usedQty)
        }
        // 升序排列
        arr.sort(function (a, b) {
          return a - b
        })
        // 向下取整，取最小值
        return Math.floor(arr[0])
      } else {
        return ''
      }
    }
  }
}
</script>
<style lang='scss' scoped>
.p-20 {
  padding: 20px 300px 0 0;
  text-align: right;
  span {
    color: #409eff;
    text-decoration: underline;
  }
}
.p-200 {
  text-align: right;
  padding: 0 200px 0px 0;
}
.underline {
  color: #409eff;
  text-decoration: underline;
}
</style>


