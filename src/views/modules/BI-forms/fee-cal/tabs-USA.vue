<!-- 美国 -->
<template>
  <div>
    <p class="classifyTitle">尺寸段</p>
    <p>包装后的商品的最大重量和尺寸，对于重量不超过1磅 / 0.45KG的标准尺寸商品，以及特殊超大件商品，亚马逊将采用商品重量。对于所有其他商品，亚马逊将采用单件商品重量与体积重量中的较大者。</p>
    <p>体积重量等于商品体积（长 * 宽 * 高 立方英寸）除以 <span class="colordd4b39">139</span>。</p>
    <p>在计算大件商品的体积重量时，采用<span class="colordd4b39">最小2英寸的宽度和高度（2019年2月19日起）</span>。</p>

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
      <el-table-column prop="perimeter"
                       label="长度 + 周长"> </el-table-column>
    </el-table>
    <p class="classifyTitle">配送费</p>
    <el-table :data="deliveringData"
              stripe
              :span-method="objectSpanMethod">
      <el-table-column label="">
        <el-table-column prop="intermediateDimension"
                         label="尺寸分段"> </el-table-column>
        <el-table-column prop="dispatchedWeight"
                         label="发货重量"> </el-table-column>
        <el-table-column prop="packetWeight"
                         label="包装重量"> </el-table-column>
      </el-table-column>
      <el-table-column label="2019 年 2 月 19 日之前">
        <el-table-column prop="beforeDistributionCosts"
                         label="每件商品的配送费用"> </el-table-column>
      </el-table-column>
      <el-table-column label="2019 年 2 月 19 日之后">
        <el-table-column prop="afterDistributionCosts"
                         label="每件商品的配送费用"> </el-table-column>
      </el-table-column>
    </el-table>

    <p>1.如果是服装商品，每件商品应额外支付 $0.40</p>
    <p>2.如果是含锂电池的商品，每件商品应额外支付 $0.11</p>
    <h2>出库配送重量</h2>
    <p>每件商品均需计算出库配送重量，计算方式是包装重量加上商品重量或体积重量，取商品重量和体积重量之间的较大值。每件商品的总重按向上取整方式取值（单位：磅）。然后，根据以上列出的数值，使用出库配送重量来计算配送费用。</p>
    <el-table :data="distributionData"
              stripe>
      <el-table-column prop="intermediateDimensionAndType"
                       label="商品尺寸分段和分类"> </el-table-column>
      <el-table-column prop="packetWeight"
                       label="包装重量"> </el-table-column>
      <el-table-column prop="dispatchedWeight"
                       label="出库配送重量"> </el-table-column>
    </el-table>
    <h2>仓储费（系统按照淡季计算）</h2>
    <p>产品体积：长 * 宽 * 高 * 0.000035315（单位：立方厘米转立方英尺）</p>
    <el-table :data="storageChargesData"
              stripe>
      <el-table-column prop="months"
                       label=""> </el-table-column>
      <el-table-column prop="standardSize"
                       label="标准尺寸"> </el-table-column>
      <el-table-column prop="majorPossessionsSize"
                       label="大件尺寸"> </el-table-column>
    </el-table>
    <P>仓储费 = 产品体积 * 尺寸的每立方英尺费用</P>
  </div>
</template>
<script>
export default {
  data () {
    return {
      prodsizeData: [{
        keyName: '小号标准尺寸',
        weight: '12 盎司 / 0.34KG',
        longestEdge: '15 英寸 / 38.1CM',
        longSide: '12 英寸 / 30.48CM',
        shortestEdge: '0.75 英寸 / 1.9CM',
        perimeter: '不适用'
      }, {
        keyName: '大号标准尺寸',
        weight: '20 磅 / 9.07KG',
        longestEdge: '18 英寸 / 45.72CM',
        longSide: '14 英寸 / 35.56CM',
        shortestEdge: '8 英寸 / 20.32CM',
        perimeter: '不适用'
      }, {
        keyName: '小号大件',
        weight: '70 磅 / 31.75KG',
        longestEdge: '60 英寸 / 152.4CM',
        longSide: '30 英寸 / 76.2CM',
        shortestEdge: '不适用',
        perimeter: '130 英寸 / 330.2CM'
      }, {
        keyName: '中号大件',
        weight: '150 磅 / 68.04KG',
        longestEdge: '108 英寸 / 274.32CM',
        longSide: '不适用',
        shortestEdge: '不适用',
        perimeter: '130 英寸 / 330.2CM'
      }, {
        keyName: '大号大件',
        weight: '150 磅 / 68.04KG',
        longestEdge: '108 英寸 / 274.32CM',
        longSide: '不适用',
        shortestEdge: '不适用',
        perimeter: '165 英寸 / 419.1CM'
      }, {
        keyName: '特殊大件',
        weight: '大于150 磅 / 大于68.04KG',
        longestEdge: '大于108 英寸 / 大于457.2CM',
        longSide: '不适用',
        shortestEdge: '不适用',
        perimeter: '大于165 英寸 / 大于419.1CM'
      }
      ],
      // 配送费
      deliveringData: [{
        intermediateDimension: '小号标准尺寸',
        dispatchedWeight: '不超过 10 盎司',
        packetWeight: '4 盎司',
        beforeDistributionCosts: '$2.41',
        afterDistributionCosts: '$2.41'
      }, {
        intermediateDimension: '小号标准尺寸',
        dispatchedWeight: '大于 10 盎司，小于 16 盎司',
        packetWeight: '4 盎司',
        beforeDistributionCosts: '$2.41',
        afterDistributionCosts: '$2.48'
      }, {
        intermediateDimension: '大号标准尺寸',
        dispatchedWeight: '不超过 10 盎司',
        packetWeight: '4 盎司',
        beforeDistributionCosts: '$3.19',
        afterDistributionCosts: '$3.19'
      }, {
        intermediateDimension: '大号标准尺寸',
        dispatchedWeight: '大于 10 盎司，小于 16 盎司',
        packetWeight: '4 盎司',
        beforeDistributionCosts: '$3.19',
        afterDistributionCosts: '$3.28'
      }, {
        intermediateDimension: '大号标准尺寸',
        dispatchedWeight: '1 至 2 磅',
        packetWeight: '4 盎司',
        beforeDistributionCosts: '$4.71',
        afterDistributionCosts: '$4.76'
      }, {
        intermediateDimension: '大号标准尺寸',
        dispatchedWeight: '2 至 3 磅',
        packetWeight: '4 盎司',
        beforeDistributionCosts: '$5.09',
        afterDistributionCosts: '$5.26'
      }, {
        intermediateDimension: '大号标准尺寸',
        dispatchedWeight: '3 至 20 磅',
        packetWeight: '4 盎司',
        beforeDistributionCosts: '$5.09 + 超出首重（3 磅）的部分 $0.38/磅',
        afterDistributionCosts: '$5.26 + 超出首重（3 磅）的部分 $0.38/磅'
      }, {
        intermediateDimension: '小号大件',
        dispatchedWeight: '不超过 70 磅',
        packetWeight: '1 磅',
        beforeDistributionCosts: '$8.13 + 超出首重（2 磅）的部分 $0.38/磅',
        afterDistributionCosts: '$8.26 + 超出首重（2 磅）的部分 $0.38/磅'
      }, {
        intermediateDimension: '中号大件',
        dispatchedWeight: '不超过 150 磅',
        packetWeight: '1 磅',
        beforeDistributionCosts: '$9.44 + 超出首重（2 磅）的部分 $0.38/磅',
        afterDistributionCosts: '$9.79 + 超出首重（2 磅）的部分 $0.39/磅'
      }, {
        intermediateDimension: '大号大件',
        dispatchedWeight: '不超过 150 磅',
        packetWeight: '1 磅',
        beforeDistributionCosts: '$73.18 + 超出首重（90 磅）的部分 $0.79/磅',
        afterDistributionCosts: '$75.78 + 超出首重（90 磅）的部分 $0.79/磅'
      }, {
        intermediateDimension: '特殊大件',
        dispatchedWeight: '--',
        packetWeight: '1 磅',
        beforeDistributionCosts: '$137.32 + 超出首重（90 磅）的部分 $0.91/磅',
        afterDistributionCosts: '$137.32 + 超出首重（90 磅）的部分 $0.91/磅'
      }],
      distributionData: [{
        intermediateDimensionAndType: '标准尺寸（小于等于 1 磅）',
        packetWeight: '4 盎司 （0.25 磅',
        dispatchedWeight: '商品重量 + 包装重量 （总重量数值向上取整到最接近的整数磅数）'
      }, {
        intermediateDimensionAndType: '标准尺寸（大于 1 磅）',
        packetWeight: '4 盎司 （0.25 磅',
        dispatchedWeight: '商品重量 和体积重量之间的较大值 + 包装重量 （总重量数值向上取整到最接近的整数磅数）'
      }, {
        intermediateDimensionAndType: '大件商品',
        packetWeight: '16 盎司（1.00 磅）',
        dispatchedWeight: '商品重量 和体积重量之间的较大值 + 包装重量 （总重量数值向上取整到最接近的整数磅数）'
      }, {
        intermediateDimensionAndType: '特殊大件',
        packetWeight: '16 盎司（1.00 磅）',
        dispatchedWeight: '商品重量 和体积重量之间的较大值 + 包装重量 （总重量数值向上取整到最接近的整数磅数）'
      }],
      storageChargesData: [{
        months: '1 月 - 9 月',
        standardSize: '0.69 美元',
        majorPossessionsSize: '0.48 美元'
      }, {
        months: '10 月 - 12 月',
        standardSize: '2.4 美元',
        majorPossessionsSize: '1.2 美元'
      }]
    }
  },
  computed: {
    prodrowCount: function () {
      return Math.ceil(this.prodsizeData.length)
    }
  },
  methods: {
    objectSpanMethod ({ row, column, rowIndex, columnIndex }) {
      console.log(rowIndex)
      console.log(columnIndex)
      if (columnIndex === 0) {
        if (rowIndex === 0) {
          return [2, 1]
        } else if (rowIndex === 1) {
          return [0, 0]
        }
        if (rowIndex === 2) {
          return [5, 1]
        } else if (rowIndex >= 3 && rowIndex <= 6) {
          return [0, 0]
        }
      } else if (columnIndex === 2) {
        if (rowIndex === 0) {
          return [2, 1]
        } else if (rowIndex === 1) {
          return [0, 0]
        }
        if (rowIndex === 2) {
          return [2, 1]
        } else if (rowIndex >= 3 && rowIndex <= 4) {
          return [0, 0]
        }
      } else if (columnIndex === 3) {
        if (rowIndex === 0) {
          return [2, 1]
        } else if (rowIndex === 1) {
          return [0, 0]
        }
        if (rowIndex === 2) {
          return [2, 1]
        } else if (rowIndex >= 3 && rowIndex <= 4) {
          return [0, 0]
        }
      }
      // else if (columnIndex === 1) {
      //   if (rowIndex === 0 || rowIndex === 1) {
      //     return [0, 0]
      //   }
      // }
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
