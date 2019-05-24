<!-- 加拿大 -->
<template>
  <div>
    <p class="classifyTitle">尺寸段</p>
    <p>对于所有其他商品，亚马逊将采用单件商品重量与体积重量中的较大者。</p>
    <p>体积重量等于商品体积（长 * 宽 * 高 立方厘米）除以 5000（自 2018年8月29日起）。</p>
    <p>每件商品均需计算出库发货重量，计算方式是包装重量加上商品重量或体积重量，取商品重量和体积重量之间的较大值。每件商品的总重按四舍五入的方式计算：对于信封装货件，取最接近的 100 克，对于标准尺寸和大件货件，取最接近的 500 克。</p>
    <table border="1"
           class="gridtable">
      <tr>
        <th>商品尺寸分段</th>
        <th>重量</th>
        <th>最长边</th>
        <th>次长边</th>
        <th>最短边</th>
      </tr>
      <tr v-for="index in prodrowCount"
          :key="index">
        <td class="column">{{ prodsizeData[index-1].keyName }}</td>
        <td class="column">{{ prodsizeData[index-1].weight }}</td>
        <td class="column">{{ prodsizeData[index-1].longestEdge }}</td>
        <td class="column">{{ prodsizeData[index-1].longSide }}</td>
        <td class="column">{{ prodsizeData[index-1].shortestEdge }}</td>
      </tr>
    </table>
    <p class="classifyTitle">非媒介类配送费</p>
    <table border="1"
           class="gridtable">
      <tr>
        <th>商品尺寸分段</th>
        <th>首重</th>
        <th>续重</th>
        <th>特殊处理费</th>
      </tr>
      <tr v-for="index in packingFeerowCount"
          :key="index">
        <td class="column">{{ packingFeeData[index-1].keyName }}</td>
        <td class="column">{{ packingFeeData[index-1].firstweight }}</td>
        <td class="column">{{ packingFeeData[index-1].reneweight }}</td>
        <td class="column">{{ packingFeeData[index-1].handlechange }}</td>
      </tr>
    </table>
    <p class="classifyTitle">仓储费（系统按照淡季计算）</p>
    <p>产品体积：长 * 宽 * 高 * 0.000001（单位：立方厘米转立方米）</p>
    <table border="1"
           class="gridtable">
      <tr>
        <th></th>
        <th>每月每立方米的费用</th>
      </tr>
      <tr v-for="index in storageChargeCount"
          :key="index">
        <td class="column" style="width:200px">{{ storageChargeData[index-1].keyName }}</td>
        <td class="column">{{ storageChargeData[index-1].fee }}</td>
      </tr>
    </table>
      <p class="colordd4b39">仓储费 = 产品体积 * 尺寸的每立方米费用</p>
  </div>
</template>
<script>
export default {
  data () {
    return {
      prodsizeData: [
        { keyName: '小号标准尺寸', weight: '1001', longestEdge: '', longSide: '', shortestEdge: '' },
        { keyName: '大号标准尺寸', weight: '10', longestEdge: '', longSide: '', shortestEdge: '' },
        { keyName: '小号大件', weight: '11010110', longestEdge: '', longSide: '', shortestEdge: '' },
        { keyName: '中号大件', weight: '1029303', longestEdge: '', longSide: '', shortestEdge: '' },
        { keyName: '大号大件', weight: '29999', longestEdge: '', longSide: '', shortestEdge: '' },
        { keyName: '特殊大件', weight: '尼古拉斯赵四', longestEdge: '', longSide: '', shortestEdge: '' }
      ],
      packingFeeData: [
        { keyName: '信封装商品', firstweight: '1001', reneweight: '', handlechange: '' },
        { keyName: '标准尺寸商品', firstweight: '10', reneweight: '', handlechange: '' },
        { keyName: '大件商品', firstweight: '11010110', reneweight: '', handlechange: '' }
      ],
      storageChargeData: [
        { keyName: '1 月 - 9 月', fee: '1001' },
        { keyName: '10 月 - 12 月', fee: '1001' }
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
