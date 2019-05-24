<!-- 日本 -->
<template>
  <div>
    <p class="classifyTitle">尺寸段</p>
    <p class="colordd4b39">2019年2月21日之后取消价格高于 45,000 日元的商品的配送费用豁免。</p>
    <p class="colordd4b39">尺寸超过 200 厘米 或 重量超过 40 千克的商品不能使用亚马逊物流服务。</p>
    <p class="colordd4b39">尺寸不小于 170 厘米 且 最长边不小于 90 厘米的商品不能使用亚马逊物流服务。</p>
    <p>重量是发货商品与包装材料的合计重量。包装材料的重量小件尺寸时规定为50g，标准尺寸时规定为150g。</p>
    <p>在小件尺寸中，如果发货重量超过250g时，则按标准件尺寸收取费用。在标准件尺寸中，超过2kg的　尾数自动加1（例如：发货中所包含的商品重量与包装材料重量（150g）的合计为2.1kg时，则按3kg计算）。</p>
    <table border="1" class="gridtable">
      <thead>
        <th>商品尺寸分段</th>
        <th>重量</th>
        <th>最长边</th>
        <th>次长边</th>
        <th>最短边</th>
      </thead>
      <tr>
        <td>小件商品</td>
        <td></td>
        <td></td>
        <td></td>
        <td></td>
      </tr>
      <tr>
        <td>标准件</td>
        <td></td>
        <td></td>
        <td></td>
        <td></td>
      </tr>
      <tr>
        <td>大件商品</td>
        <td></td>
        <td></td>
        <td></td>
        <td></td>
      </tr>
    </table>
    <p class="classifyTitle">大件商品细分</p>
    <table border="1" class="gridtable">
      <thead>
        <th>商品尺寸分段</th>
        <th>要求</th>
      </thead>
      <tr>
        <td>类别1</td>
        <td></td>
      </tr>
       <tr>
        <td>类别2</td>
        <td></td>
      </tr>
       <tr>
        <td>类别3</td>
        <td></td>
      </tr>
       <tr>
        <td>类别4</td>
        <td></td>
      </tr>
    </table>
    <p class="classifyTitle">配送费(2019 年2月21日生效 )</p>
    <p>表 1. 轻小商品及标准商品</p>
    <table border="1" class="gridtable"></table>
    <p>表 2. 大件</p>
    <table border="1" class="gridtable"></table>
    <p class="classifyTitle">仓储费（系统按照淡季计算，2019年2月1日生效）</p>
    <table border="1" class="gridtable"></table>
  </div>
</template>
<script>
export default {
  data () {
    return {

    }
  }
}
</script>
<style lang="scss" scoped>
.classifyTitle {
  margin-left: 10px;
  font-size: 20px;
  font-weight: 600;
  margin: 10px 0;
}
table {
  width: 100%;
  text-align: left;
  table-layout: fixed;
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
.bg-orange {
  background-color: #ff851b;
  color: #fff;
}
</style>
