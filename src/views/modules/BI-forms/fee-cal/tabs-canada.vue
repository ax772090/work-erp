<!-- 加拿大 -->
<template>
  <div>
    <p class="classifyTitle">尺寸段</p>
    <p>对于所有其他商品，亚马逊将采用单件商品重量与体积重量中的较大者。</p>
    <p>体积重量等于商品体积（长 * 宽 * 高 立方厘米）除以 5000（自 2018年8月29日起）。</p>
    <p>每件商品均需计算出库发货重量，计算方式是包装重量加上商品重量或体积重量，取商品重量和体积重量之间的较大值。每件商品的总重按四舍五入的方式计算：对于信封装货件，取最接近的 100 克，对于标准尺寸和大件货件，取最接近的 500 克。</p>
    <el-table :data="prodsizeData"
              stripe>
      <el-table-column prop="keyName"
                       label="商品尺寸分段"> </el-table-column>
      <el-table-column prop="weight"
                       label="重量"> </el-table-column>
      <el-table-column prop="longestEdge"
                       label="最长边"> </el-table-column>
      <el-table-column prop="longSide"
                       label="次长边"> </el-table-column>
      <el-table-column prop="shortestEdge"
                       label="最短边"> </el-table-column>
    </el-table>
    <h4>非媒介类配送费</h4>
    <el-table :data="noMediumFeesData"
              stripe>
      <el-table-column prop="intermediateDimension"
                       label="商品尺寸分段"> </el-table-column>
      <el-table-column prop="weight"
                       label="首重"> </el-table-column>
      <el-table-column prop="continuedWeight"
                       label="续重"> </el-table-column>
      <el-table-column prop="special"
                       label="特殊处理费"> </el-table-column>
    </el-table>
    <p class="classifyTitle">仓储费（系统按照淡季计算）</p>
    <p>产品体积：长 * 宽 * 高 * 0.000001（单位：立方厘米转立方米）</p>
    <el-table :data="storageChargeData"
              stripe>
      <el-table-column prop="months"
                       label=""> </el-table-column>
      <el-table-column prop="fee"
                       label="每月每立方米的费用"> </el-table-column>
    </el-table>
    <p class="colordd4b39">仓储费 = 产品体积 * 尺寸的每立方米费用</p>
  </div>
</template>
<script>
export default {
  data () {
    return {
      prodsizeData: [
        { keyName: '信封装商品', weight: '不超过 500 克', longestEdge: '不超过 38 厘米', longSide: '不超过 27 厘米', shortestEdge: '不超过 2 厘米' },
        { keyName: '标准尺寸商品', weight: '不超过 9 千克', longestEdge: '不超过 45 厘米', longSide: '不超过 35 厘米', shortestEdge: '不超过 20 厘米' },
        { keyName: '大件商品', weight: '超过以上任何尺寸的商品为大件商品。', longestEdge: '', longSide: '', shortestEdge: '' }
      ],
      noMediumFeesData: [{
        intermediateDimension: '信封装商品',
        Weight: '首重 100 克: 3.37 加元',
        continuedWeight: '每增加 100 克: 0.20 加元',
        special: '-'
      }, {
        intermediateDimension: '标准尺寸商品',
        Weight: '首重 500 克: 5.48 加元',
        continuedWeight: '每增加 500 克: 0.34 加元',
        special: '-'
      }, {
        intermediateDimension: '大件商品',
        Weight: '首重 500 克: 7.42 加元',
        continuedWeight: '每增加 500 克: 0.36 加元',
        special: '125.00 加元 (大屏幕电视机 或 最长侧超过 270 厘米 或 （周长 + 2 x 高 + 2 x 宽）超过 419 厘米 或 出库配送重量超过 69 千克)'
      }],
      storageChargeData: [
        { months: '1 月 - 9 月', fee: '20 加元' },
        { months: '10 月 - 12 月', fee: '28 加元' }
      ]
    }
  },
  computed: {
    prodrowCount: function () {
      return Math.ceil(this.prodsizeData.length)
    },
    packingFeerowCount: function () {
      return Math.ceil(this.packingFeeData.length)
    },
    storageChargeCount: function () {
      return Math.ceil(this.storageChargeData.length)
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
  padding-bottom: 10px;
  border-bottom: 1px solid #dcdfe6;
}
table {
  width: 100%;
  text-align: left;
  border-collapse: collapse;
  border: 1px solid #dcdfe6;
  th {
    padding: 5px 0 5px 5px;
    border-color: #dcdfe6;
  }
  td {
    padding: 5px 0 5px 5px;
    border-color: #dcdfe6;
  }
}
.colordd4b39 {
  color: #dd4b39;
}
table tr:nth-child(even) {
  background: #f9f9f9;
}
</style>
