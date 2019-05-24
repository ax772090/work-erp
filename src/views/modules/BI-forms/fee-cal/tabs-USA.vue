<!-- 美国 -->
<template>
  <div>
    <p class="classifyTitle">尺寸段</p>
    <p>包装后的商品的最大重量和尺寸，对于重量不超过1磅 / 0.45KG的标准尺寸商品，以及特殊超大件商品，亚马逊将采用商品重量。对于所有其他商品，亚马逊将采用单件商品重量与体积重量中的较大者。</p>
    <p>体积重量等于商品体积（长 * 宽 * 高 立方英寸）除以 <span class="colordd4b39">139</span>。</p>
    <p>在计算大件商品的体积重量时，采用<span class="colordd4b39">最小2英寸的宽度和高度（2019年2月19日起）</span>。</p>
    <table border="1"
           class="gridtable">
      <tr>
        <th>商品尺寸分段</th>
        <th>重量</th>
        <th>最长边</th>
        <th>次长边</th>
        <th>最短边</th>
        <th>长度 + 周长</th>
      </tr>
      <tr v-for="index in prodrowCount"
          :key="index">
        <td class="column">{{ prodsizeData[index-1].keyName }}</td>
        <td class="column">{{ prodsizeData[index-1].weight }}</td>
        <td class="column">{{ prodsizeData[index-1].longestEdge }}</td>
        <td class="column">{{ prodsizeData[index-1].longSide }}</td>
        <td class="column">{{ prodsizeData[index-1].shortestEdge }}</td>
        <td class="column">{{ prodsizeData[index-1].perimeter }}</td>
      </tr>
    </table>
    <p class="classifyTitle">配送费</p>
    <table border="1"
           class="gridtable">
      <tr>
        <th></th>
        <th></th>
        <th></th>
        <th>2019 年 2 月 19 日之前</th>
        <th>2019 年 2 月 19 日及之后</th>
      </tr>
      <tr>
        <th>尺寸分段</th>
        <th>发货重量</th>
        <th>包装重量</th>
        <th>每件商品的配送费用</th>
        <th>每件商品的配送费用</th>
      </tr>
      <tr>
        <td rowspan="2">小号标准尺寸</td>
        <td>1</td>
        <td rowspan="2">2</td>
        <td rowspan="2">3</td>
        <td>4</td>
      </tr>
      <tr>
        <td>5</td>
        <td>6</td>
      </tr>
      <tr>
        <td rowspan="5">大号标准尺寸</td>
        <td>1</td>
        <td rowspan="2">2</td>
        <td rowspan="2">3</td>
        <td>4</td>
      </tr>
      <tr>
        <td>1</td>
        <td>2</td>
      </tr>
      <tr>
        <td>1</td>
        <td>2</td>
        <td>3</td>
        <td>4</td>
      </tr>
      <tr>
        <td>1</td>
        <td>2</td>
        <td>3</td>
        <td>4</td>
      </tr>
      <tr>
        <td>1</td>
        <td>2</td>
        <td>3</td>
        <td>4</td>
      </tr>
    </table>
  </div>
</template>
<script>
export default {
  data () {
    return {
      prodsizeData: [
        { keyName: '小号标准尺寸', weight: '1001', longestEdge: '', longSide: '', shortestEdge: '', perimeter: '' },
        { keyName: '大号标准尺寸', weight: '10', longestEdge: '', longSide: '', shortestEdge: '', perimeter: '' },
        { keyName: '小号大件', weight: '11010110', longestEdge: '', longSide: '', shortestEdge: '', perimeter: '' },
        { keyName: '中号大件', weight: '1029303', longestEdge: '', longSide: '', shortestEdge: '', perimeter: '' },
        { keyName: '大号大件', weight: '29999', longestEdge: '', longSide: '', shortestEdge: '', perimeter: '' },
        { keyName: '特殊大件', weight: '尼古拉斯赵四', longestEdge: '', longSide: '', shortestEdge: '', perimeter: '' }
      ]
    }
  },
  computed: {
    prodrowCount: function () {
      return Math.ceil(this.prodsizeData.length)
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
