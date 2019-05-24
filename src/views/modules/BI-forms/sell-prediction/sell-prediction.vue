<template>
  <div class="sell-prediction">
    <el-row>
      月份: <el-date-picker v-model="searchMonth"
                      type="month"
                      placeholder="选择月">
      </el-date-picker>
      <div class="div-row-right fr">
        <el-button type="primary">小组管理</el-button>
      </div>
    </el-row>
    <el-row>
      各组进度(2018-2 本月剩余17天) <el-tag color="#5F5DA8">单位: 万</el-tag>
      <div class="div-row-right fr">
        最新更新:
      </div>
    </el-row>
    <el-table :data="tableData"
              :span-method="arraySpanMethod"
              @cell-mouse-enter="cellMouseEnterHander"
              @cell-mouse-leave="cellMouseLeaveHander">
      <el-table-column prop="date"
                       label="小组"
                       width="100px">
      </el-table-column>
      <el-table-column label="销售额">
        <el-table-column prop="name">
          <template slot="header"
                    slot-scope="scope">
            <el-tag color="#01AB5D">本月</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="name">
          <template slot="header"
                    slot-scope="scope">
            <el-tag color="#DC4B32">上月</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="name">
          <template slot="header"
                    slot-scope="scope">
            <el-tag color="#F19220">环比</el-tag>
          </template>
        </el-table-column>
      </el-table-column>
      <el-table-column label="毛利">
        <el-table-column prop="name">
          <template slot="header"
                    slot-scope="scope">
            <el-tag color="#01AB5D">本月</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="name">
          <template slot="header"
                    slot-scope="scope">
            <el-tag color="#DC4B32">上月</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="name">
          <template slot="header"
                    slot-scope="scope">
            <el-tag color="#F19220">环比</el-tag>
          </template>
          <template slot-scope="scope">
            <div>
              <span v-show="scope.row.isName">1{{scope.row.name}}</span>
              <span v-show="!scope.row.isName">2{{scope.row.name}}</span>
            </div>
          </template>
        </el-table-column>
      </el-table-column>
      <el-table-column>
        <template slot="header"
                  slot-scope="scope">
          目标(
          <radio-all v-model="radio"
                     :radioListData="radioListData"
                     textColor="#ffffff"
                     fill="#E01664"
                     @change="radioSsearch"></radio-all>
          )
        </template>
        <el-table-column prop="name">
          <template slot="header"
                    slot-scope="scope">
            <el-tag color="#02BEF2">基础</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="name">
          <template slot="header"
                    slot-scope="scope">
            <el-tag color="#F19220">挑战</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="name"
                         label="目标差值">
        </el-table-column>
        <el-table-column prop="name"
                         label="差值日均">
        </el-table-column>
        <el-table-column prop="name"
                         label="进度"
                         width="250px">
          <template slot-scope="scope">
            <div class="schedule">
              <div class="challenges"></div>
              <div class="basis"></div>
              <div class="present"></div>
              <div class="predict "></div>
            </div>
          </template>
        </el-table-column>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
import radioAll from '@/components/erp-radio/radio-all'
export default {
  components: {
    radioAll
  },
  data () {
    return {
      searchMonth: '',
      tableData: [],
      radioListData: [{
        key: '01',
        value: '按销售额'
      }, {
        key: '02',
        value: '按毛利'
      }],
      radio: ''
    }
  },
  created () {
    this.tableData = [{
        date: 'NAIPO'
      }, {
        date: 'NAIPO-X组',
        name: '王小虎',
        province: '上海',
        city: '普陀区',
        address: '上海市普陀区金沙江路 1518 弄',
        zip: 200333
      }, {
        date: 'NAIPO-D组',
        name: '王小虎',
        province: '上海',
        city: '普陀区',
        address: '上海市普陀区金沙江路 1518 弄',
        zip: 200333
      }, {
        date: '2016-05-01',
        name: '王小虎',
        province: '上海',
        city: '普陀区',
        address: '上海市普陀区金沙江路 1518 弄',
        zip: 200333
      }, {
        date: '2016-05-08',
        name: '王小虎',
        province: '上海',
        city: '普陀区',
        address: '上海市普陀区金沙江路 1518 弄',
        zip: 200333
      }, {
        date: '2016-05-06',
        name: '王小虎',
        province: '上海',
        city: '普陀区',
        address: '上海市普陀区金沙江路 1518 弄',
        zip: 200333
      }, {
        date: '2016-05-07',
        name: '王小虎',
        province: '上海',
        city: '普陀区',
        address: '上海市普陀区金沙江路 1518 弄',
        zip: 200333
      }]
    this.getDataList()
  },
  methods: {
    // 请求数据列表
    getDataList () {
      this.radio = this.radioListData[0].key
    },

    // 合并table单元格
    arraySpanMethod ({ row, column, rowIndex, columnIndex }) {
      // console.log('row', row)
      // console.log('column', column)
      // console.log('rowIndex', rowIndex)
      // console.log('columnIndex', columnIndex)
      if (rowIndex === 0) {
        if (columnIndex === 0) {
          return {
            rowspan: 1,
            colspan: 12
          }
        } else if (columnIndex !== 0) {
          return {
            rowspan: 0,
            colspan: 0
          }
        }
      }
    },

    // 鼠标移入事件-控制hover
    cellMouseEnterHander (row, column, cell, event) {
      console.log('row', row)
      console.log('column', column)
      console.log('cell', cell)
      console.log('event', event)
      this.$set(row, 'isName', true)
    },

    // 鼠标移出事件-控制hover
    cellMouseLeaveHander (row, column, cell, event) {
      this.$set(row, 'isName', false)
    },

    // 单选change
    radioSsearch (val) {
      console.log('单选', val)
    }
  }
}
</script>

<style lang="scss">
.sell-prediction {
  .el-tag {
    color: #fff;
  }
}
</style>

<style lang="scss" scoped>
.sell-prediction {
  padding-top: 10px;
}
.schedule {
  height: 20px;
  position: relative;
  > .challenges {
    position: absolute;
    top: 0;
    left: 0;
    z-index: 101;
    height: 100%;
    width: 100%;
    background-color: #f39c11;
  }
  > .basis {
    position: absolute;
    z-index: 102;
    height: 100%;
    width: 80%;
    background-color: #03c0ea;
  }
  > .present {
    position: absolute;
    z-index: 103;
    height: 100%;
    width: 20%;
    background-color: #00a75c;
  }
  > .predict {
    position: absolute;
    z-index: 100;
    height: 120%;
    width: 70%;
    background-color: #c75140;
  }
}
</style>

