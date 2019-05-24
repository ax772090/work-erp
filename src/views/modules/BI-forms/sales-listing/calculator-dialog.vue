<template>
  <div>
    <el-dialog title="毛利率计算"
               width="30%"
               :close-on-click-modal="false"
               :visible.sync="visible">
      <table border="1">
        <thead>
          <th></th>
          <th>原价格</th>
          <th>新价格</th>
        </thead>
        <tbody>
          <tr>
            <td></td>
            <td>
              <el-input v-model="dataForm.soucePrice"
                        placeholder=""
                        class="td-input"></el-input>
            </td>
            <td>
              <el-input v-model="dataForm.newPrice"
                        placeholder=""
                        class="td-input"></el-input>
            </td>
          </tr>
          <tr colspan='3'
              class="tr-title">固定成本</tr>
          <tr v-for="(item) in fixCostData"
              :key="item.key">
            <td >{{ item.key }}</td>
            <td >{{ item.soucePrice }}</td>
            <td >{{ item.newPrice }}</td>
          </tr>
          <tr colspan='3'
              class="tr-title">其他成本</tr>
          <tr v-for="(item) in otherTableData"
              :key="item.key">
            <td >{{ item.key }}</td>
            <td >{{ item.soucePrice }}</td>
            <td >{{ item.newPrice }}</td>
          </tr>
        </tbody>
      </table>
      <span slot="footer"
            class="dialog-footer">
        <el-button @click="visible = false"><i class="iconfont erp-icon-quxiao"></i>取消</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
export default {

  data () {
    return {
      dataForm: {
        soucePrice: '50',
        newPrice: '20'
      },
      visible: false,
      fixCostData: [
        { key: '采购成本', soucePrice: '20', newPrice: '30' },
        { key: '头程成本', soucePrice: '20', newPrice: '30' },
        { key: 'FBA运费', soucePrice: '20', newPrice: '30' },
        { key: '手续费', soucePrice: '20', newPrice: '30' },
        { key: '仓租', soucePrice: '20', newPrice: '30' },
        { key: '站内广告费', soucePrice: '20', newPrice: '30' }
      ],
      otherTableData: [
        { key: '固定成本', soucePrice: '20', newPrice: '30' },
        { key: '退款', soucePrice: '20', newPrice: '30' },
        { key: '毛利率', soucePrice: '20', newPrice: '30' }
      ]
    }
  },
  computed: {
  },
  methods: {
    init (row) {
      this.visible = true
    }
  }
}
</script>
<style scoped lang='scss'>
table {
  width: 100%;
  text-align: right;
  border-collapse: collapse;
  border: 1px solid #dcdfe6;
  tr {
    line-height: 25px;
  }
  th {
    padding: 5px 0;
    border-color: #dcdfe6;
  }
  td {
    padding: 5px 0;
    border-color: #dcdfe6;
  }
}
.tr-title {
  text-align: left;
  font-size: 16px;
  font-weight: 600;
}
.td-input {
  // width: 100px;
}
</style>

