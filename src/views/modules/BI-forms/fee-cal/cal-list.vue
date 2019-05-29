<template>
  <div class="cal-list">
    <el-row>
      <h1>费用计算器</h1>
    </el-row>
    <el-row :gutter="20">
      <el-col :span="6"
              style="position: relative;border-top:2px solid #00c0ef">
        <div class="title">计算信息</div>
        <el-form ref="dataForm"
                 :model="dataForm"
                 label-width="80px">
          <el-form-item label="国家">
            <select-all v-model="dataForm.country"
                        :listDataOption="countryOptions"
                        data-value="id"
                        data-label="name"></select-all>
          </el-form-item>
          <!-- <el-form-item label="长度单位">
            cm
          </el-form-item> -->
          <el-form-item label="长"
                        class="h28">
            <el-input v-model="dataForm.prod_length">
              <template slot="append">cm</template>
            </el-input>
          </el-form-item>
          <el-form-item label="宽"
                        class="h28">
            <el-input v-model="dataForm.prod_wide">
              <template slot="append">cm</template>
            </el-input>
          </el-form-item>
          <el-form-item label="高"
                        class="h28">
            <el-input v-model="dataForm.prod_height">
              <template slot="append">cm</template>
            </el-input>
          </el-form-item>
          <!-- <el-form-item label="重量单位"> -->

          <!-- </el-form-item> -->
          <el-form-item label="重量"
                        class="h28">
            <el-input v-model="dataForm.weight">
              <template slot="append">kg</template>
            </el-input>
          </el-form-item>
          <el-form-item label="采购价"
                        class="h28">
            <el-input v-model="dataForm.purchase_fee">
              <template slot="prepend">CNY</template>
            </el-input>
          </el-form-item>
          <el-form-item label="销售价"
                        class="h28">
            <el-input v-model="dataForm.sell_price ">
              <template slot="prepend">当前币种</template>
            </el-input>
          </el-form-item>
          <el-form-item label="FBA佣金"
                        class="h28">
            <el-input v-model="dataForm.seller_fees_amount">
              <template slot="append">%</template>
            </el-input>
          </el-form-item>
          <el-form-item label="广告费"
                        class="h28">
            <el-input v-model="dataForm.amz_ad_fee">
              <template slot="append">%</template>
            </el-input>
          </el-form-item>
          <el-form-item label="退款"
                        class="h28">
            <el-input v-model="dataForm.refund_amount">
              <template slot="append">%</template>
            </el-input>
          </el-form-item>
          <el-form-item label="固定成本"
                        class="h28">
            <el-input v-model="dataForm.fixed_cost">
              <template slot="append">%</template>
            </el-input>
          </el-form-item>
        </el-form>
        <div class="btn">
          <el-button type="primary"
                     @click="calculatorHander()">计算</el-button>
        </div>
      </el-col>
      <el-col :span="8"
              style="border-top:2px solid #dd4b39"
              :offset="1">
        <div class="title">费用明细</div>
        <div class="classifyTitle">汇率: {{dataList.exchange_rate}}</div>
        <table border="1"
               class="gridtable">
          <tr>
            <th>费用</th>
            <th>当地币种</th>
            <th>占比</th>
          </tr>
          <tr>
            <td>销售价</td>
            <td>{{dataList.sell_price}}</td>
            <td>{{dataList.sell_price_percent}}</td>
          </tr>
          <tr>
            <td>采购价</td>
            <td>{{dataList.purchase_fee}}</td>
            <td>{{dataList.purchase_fee_percent}}</td>
          </tr>
          <tr>
            <td>空运头程</td>
            <td>{{dataList.air_first}}</td>
            <td>{{dataList.air_first_percent}}</td>
          </tr>
          <tr>
            <td>海运头程</td>
            <td>{{dataList.see_first}}</td>
            <td>{{dataList.see_first_percent}}</td>
          </tr>
          <tr>
            <td>FBA仓储费</td>
            <td>{{dataList.fba_store_fee}}</td>
            <td>{{dataList.fba_store_fee_percent}}</td>
          </tr>
          <tr>
            <td>FBA运费</td>
            <td>{{dataList.fba_amount}}</td>
            <td>{{dataList.fba_amount_percent}}</td>
          </tr>
          <tr>
            <td>FBA佣金</td>
            <td>{{dataList.seller_fees_amount}}</td>
            <td>{{dataList.seller_fees_amount_percent}}</td>
          </tr>
          <tr>
            <td>广告费</td>
            <td>{{dataList.amz_ad_fee}}</td>
            <td>{{dataList.amz_ad_fee_percent}}</td>
          </tr>
          <tr>
            <td>退款</td>
            <td>{{dataList.refund_amount}}</td>
            <td>{{dataList.refund_amount_percent}}</td>
          </tr>
          <tr>
            <td>固定成本</td>
            <td>{{dataList.fixed_cost}}</td>
            <td>{{dataList.fixed_cost_percent}}</td>
          </tr>
          <tr>
            <td>空运毛利</td>
            <td>{{dataList.air_first_gross_margin}}</td>
            <td>{{dataList.air_first_gross_margin_percent}}</td>
          </tr>
          <tr>
            <td>海运毛利</td>
            <td>{{dataList.see_first_gross_margin}}</td>
            <td>{{dataList.see_first_gross_margin_percent}}</td>
          </tr>
          <!-- <tr v-for="index in rowCount"
              :key="index">
            <td class="column">{{ tableData[index-1].key }}</td>
            <td class="column">{{ tableData[index-1].value }}</td>
            <td class="column">{{ tableData[index-1].ratio }}</td>
          </tr> -->
        </table>
      </el-col>
      <el-col :span="8"
              style="border-top:2px solid #00a65a"
              :offset="1">
        <div class="title">产品规格</div>
        <div class="classifyTitle">FBA</div>
        <div>
          <p>尺寸段</p>
          <p>{{dataList.prod_standard}}</p>
        </div>
        <div>
          <p>尺寸（最长边、次长边、最短边、长度+周长）</p>
          <!-- <table border="1">
            <tr>
              <th>最长边</th>
              <th>次长边</th>
              <th>最短边</th>
              <th>长度+周长</th>
            </tr>
            <tr>
              <td>{{dataList.fba_max_second_min[0]}}</td>
              <td>{{dataList.fba_max_second_min[1]}}</td>
              <td>{{dataList.fba_max_second_min[2]}}</td>
              <td>{{dataList.fba_max_second_min[3]}}</td>
            </tr>
          </table> -->
          <!-- <p>{{dataList.fba_max_second_min[0]}},{{dataList.fba_max_second_min[1]}},{{dataList.fba_max_second_min[2]}},{{dataList.fba_max_second_min[3]}}</p> -->
          <p>{{dataList.fba_max_second_min}}</p>
        </div>
        <div>
          <p>计费重量</p>
          <p>{{dataList.fba_max_weight}}</p>
        </div>
        <div>
          <p>重量</p>
          <p>{{dataList.weight}}</p>
        </div>
        <div>
          <p>体积重</p>
          <p>{{dataList.fba_volume_weight}}</p>
        </div>
        <div class="classifyTitle">头程</div>
        <div>
          <p>体积</p>
          <p>{{dataList.first_volume}}</p>
        </div>
        <div>
          <p>计费重量</p>
          <p>{{dataList.first_volume_weight}}</p>
        </div>
        <div>
          <p>海运每立方米费用</p>
          <p>{{dataList.see_first_fee}}</p>
        </div>
        <div>
          <p>空运每KG费用</p>
          <p>{{dataList.air_first_fee}}</p>
        </div>
        <div>
          <p>空运税费%</p>
          <p>-</p>
        </div>
      </el-col>
    </el-row>
    <!-- <div> -->
    <div v-if="false">
      <el-row :gutter="20">
        <el-col>
          <div class="title brt">头程计算公式</div>
        </el-col>
        <el-col :span="10">
          <p class="classifyTitle">空运</p>
          <p>计费重量：取 实重 和 体积重（长 * 宽 * 高 / 6000）的最大值</p>
          <p>每公斤费用：美国（40元），加拿大（33元），欧洲（40元），日本（17元）</p>
          <p>税金：（采购价 * 30% / 7）* 24%</p>
          <p class="colordd4b39">头程 = 计费重量 * 每公斤费用 + 税金</p>
        </el-col>
        <el-col :span="10">
          <p class="classifyTitle">海运</p>
          <p>产品体积：长 * 宽 * 高 / 1000000（单位：立方米）</p>
          <p>每立方米费用：美国（1200元），加拿大（1600元），欧洲（1500元），日本（1700元）</p>
          <p class="colordd4b39">头程 = 产品体积 * 每立方米费用</p>
        </el-col>
      </el-row>
      <el-row>
        <el-tabs v-model="activeName"
                 @tab-click="handleClick">
          <el-tab-pane label="美国"
                       name="USA">
            <tabs-USA></tabs-USA>
          </el-tab-pane>
          <el-tab-pane label="加拿大"
                       name="Canada">
            <tabs-Canada></tabs-Canada>
          </el-tab-pane>
          <el-tab-pane label="欧洲"
                       name="Europe">
            <tabs-Europe></tabs-Europe>
          </el-tab-pane>
          <el-tab-pane label="日本"
                       name="Japan">
            <tabs-Japan></tabs-Japan>
          </el-tab-pane>
          <el-tab-pane label="澳洲"
                       name="Australia">
            <tabs-Australia></tabs-Australia>
          </el-tab-pane>
        </el-tabs>
      </el-row>
    </div>
  </div>
</template>
<script>
import selectAll from '@/components/erp-select/select-all'
// 页签美国
import tabsUSA from './tabs-USA'
// 页签加拿大
import tabsCanada from './tabs-canada'
// 页签欧洲
import tabsEurope from './tabs-Europe'
// 页签日本
import tabsJapan from './tabs-Japan'
// 页签澳大利亚
import tabsAustralia from './tabs-Australia'
export default {
  components: {
    tabsUSA,
    tabsCanada,
    tabsEurope,
    tabsJapan,
    tabsAustralia,
    selectAll
  },
  data () {
    return {
      activeName: 'USA',
      dataForm: {
        country: '',
        prod_length: '',
        prod_wide: '',
        prod_height: '',
        weight: '',
        purchase_fee: '',
        sell_price: '',
        seller_fees_amount: '',
        amz_ad_fee: '',
        refund_amount: '',
        fixed_cost: ''
      },
      orderTypeOptions: [],
      channelIdOptions: [],  // 渠道
      tableData: [
        // { key: '销售价', value: 'sell_price', ratio: 'sell_price_percent' },
        // { key: '采购价', value: 'purchase_fee', ratio: 'purchase_fee_percent"' },
        // { key: '空运头程', value: 'air_first', ratio: 'air_first_percent' },
        // { key: '海运头程', value: 'see_first', ratio: 'see_first_percent' },
        // { key: 'FBA仓储费', value: 'fba_store_fee', ratio: 'fba_store_fee_percent' },
        // { key: 'FBA运费', value: 'fba_amount', ratio: 'fba_amount_percent' },
        // { key: 'FBA佣金', value: 'seller_fees_amount', ratio: 'seller_fees_amount_percent' },
        // { key: '广告费', value: 'amz_ad_fee', ratio: 'amz_ad_fee_percent' },
        // { key: '退款', value: 'refund_amount', ratio: 'refund_amount_percent' },
        // { key: '固定成本', value: 'fixed_cost', ratio: 'fixed_cost_percent' },
        // { key: '空运毛利', value: 'air_first_gross_margin', ratio: 'air_first_gross_margin_percent' },
        // { key: '海运毛利', value: 'see_first_gross_margin', ratio: 'see_first_gross_margin_percent' }
      ],
      dataList: {},
      // 国家
      countryOptions: [{
        id: 'AU',
        name: 'AU'
      }, {
        id: 'CA',
        name: 'CA'
      }, {
        id: 'DE',
        name: 'DE'
      }, {
        id: 'ES',
        name: 'ES'
      }, {
        id: 'FR',
        name: 'FR'
      }, {
        id: 'IT',
        name: 'IT'
      }, {
        id: 'UK',
        name: 'UK'
      }, {
        id: 'US',
        name: 'US'
      }, {
        id: 'JP',
        name: 'JP'
      }],
      // [{
      //   name: '销售价',
      //   sell_price: '800',
      //   sell_price_percent: '50%'
      // }, {

      // }, {

      // }]

      form2: {

      }

    }
  },
  created () {
    this.$http.get(this.$http.adornUrl('basic/basicchannel/listcombobox')).then(({ data }) => { this.channelIdOptions = data.list })
  },
  computed: {
    rowCount: function () {
      return Math.ceil(this.tableData.length)
    }
    // prodrowCount: function () {
    //   return Math.ceil(this.prodsizeData.length)
    // }
  },
  methods: {
    calculatorHander () {
      console.log(this.dataForm)
      this.$http({
        url: this.$http.adornUrl('datacenter/api/cost-calculator'),
        method: 'get',
        params: this.dataForm
      }).then(({ data }) => {
        if (data && data.code === 200) {
          this.dataList = data.dataList[0]
        } else {
          this.$notify.error({
            title: '错误',
            message: '计算失败',
            duration: 5000
          })
        }
      })
    },
    handleClick () {

    }
  }
}
</script>
<style lang='scss' scoped>
.title,
.classifyTitle {
  margin-left: 10px;
  font-size: 16px;
  font-weight: 600;
  margin: 10px 0;
}
.classifyTitle {
  font-size: 20px;
}
.title {
  padding: 10px 0;
  border-bottom: 1px solid #dcdfe6;
}
.brt {
  border-top: 2px solid #00a65a;
}
table {
  width: 100%;
  text-align: center;
  border-collapse: collapse;
  border: 1px solid #dcdfe6;
  th {
    padding: 5px 0;
    border-color: #dcdfe6;
  }
  td {
    padding: 5px 0;
    border-color: #dcdfe6;
  }
}
.colordd4b39 {
  color: #dd4b39;
}
.btn {
  width: 100px;
  margin: 10px auto;
  > .el-button {
    width: 100px;
  }
}
.el-input-group__prepend {
  height: 28px !important;
}
</style>
<style lang='scss'>
.cal-list {
  .h28 .el-input__inner {
    height: 30px !important;
  }
  .h28 .el-input-group__append,
  .el-input-group__prepend {
    padding: 0 10px;
    background-color: #fff;
  }
}
</style>

