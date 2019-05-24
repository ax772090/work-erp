<!-- 澳洲 -->
<template>
  <div>
    <p class="classifyTitle">配送费</p>
    <p>澳洲根据包装箱大小收取固定费用。</p>
    <table>
      <thead border="1"
             class="gridtable">
        <tr>
          <th colspan="4"
              class="bg-orange">标准尺寸</th>
        </tr>
        <th>尺寸（厘米）</th>
        <th>出库配送重量（克）</th>
        <th>正常</th>
        <th>限时折扣</th>
      </thead>
      <tr>
        <td></td>
        <td></td>
        <td></td>
        <td></td>
      </tr>
    </table>
    <p class="classifyTitle">仓储费（系统按照淡季计算）</p>
    <p>产品体积：长 * 宽 * 高 * 0.000001（单位：立方厘米转立方米）</p>
    <table border="1"
           class="gridtable">
      <thead>
        <th></th>
        <th>每月每立方米的费用</th>
      </thead>
      <tr>
        <td>1 月 - 9 月 </td>
        <td></td>
      </tr>
      <tr>
        <td>10 月 - 12 月</td>
        <td></td>
      </tr>
    </table>
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
