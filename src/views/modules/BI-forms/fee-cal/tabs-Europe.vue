<!-- 欧洲 -->
<template>
  <div>
    <p class="classifyTitle">配送费</p>
    <p>新亚马逊物流配送费用（于 2019 年 4 月 1 日生效）</p>
    <p>欧洲根据包装箱大小收取固定费用。</p>
    <p>亚马逊物流计划不适用于长度超过 150 厘米、重量超过 30 千克或周长超过 3 米的任何商品。</p>
    <table border="1" class="gridtable">
      <thead>
        <tr>
          <th colspan="6" class="bg-orange">标准尺寸</th>
        </tr>
      </thead>
      <tr>
        <td></td>
        <td>UK (£)</td>
        <td>DE3 (€)</td>
        <td>FR (€)</td>
        <td>IT (€)</td>
        <td>ES (€)</td>
      </tr>
      <tr>
         <td colspan="6">小包装箱（≤ 20 x 15 x 1 cm，包装箱重量： 20 g）</td>
      </tr>
    </table>
    <p class="classifyTitle">仓储费（系统按照淡季计算）</p>
    <p>产品体积：长 * 宽 * 高 * 0.000001（单位：立方厘米转立方米）</p>
    <p>产品体积：长 * 宽 * 高 * 0.000035315（单位：立方厘米转立方英尺）</p>
    <table border="1" class="gridtable">
      <thead>
        <th></th>
        <th>英国（每立方英尺）</th>
        <th>德国（每立方米）</th>
        <th>法国（每立方米）</th>
        <th>意大利（每立方米）</th>
        <th>西班牙（每立方米）</th>
      </thead>
      <tr>
        <td>1 月 - 9 月</td>
        <td></td>
        <td></td>
        <td></td>
        <td></td>
        <td></td>
      </tr>
      <tr>
        <td>10 月 - 12 月</td>
        <td></td>
        <td></td>
        <td></td>
        <td></td>
        <td></td>
      </tr>
    </table>
    <p class="colordd4b39">仓储费 = 产品体积 * 尺寸的每立方米费用</p>
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
  table-layout:fixed;
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
.bg-orange{
  background-color: #ff851b;
  color: #fff;
}
</style>
