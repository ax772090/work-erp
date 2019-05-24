<template>
  <el-dialog :title='`${data}年${prodName}${title}`'
             center
             v-if="visible"
             :close-on-click-modal="false"
             :visible.sync="visible"
             :append-to-body="true"
             width="70%">
    <div class="mod-demo-echarts"
         v-loading="dataListLoading">
      <el-row :gutter="20">
        <el-col :span="24">
          <div id="J_chartLineBox"
               class="chart-box"></div>
        </el-col>
      </el-row>
    </div>
  </el-dialog>

</template>

<script>
import echarts from 'echarts'
export default {
  data () {
    return {
      chartLine: null,
      visible: false,
      dataListLoading: false,
      data: '2019',
      prodName: '洗牙器欧规',
      title: '销量走势图',
      dataList: [],
      option: {
        'tooltip': {
          'trigger': 'axis'
        },
        'legend': {
          'data': []
        },
        'grid': {
          'left': '3%',
          'bottom': '3%',
          'containLabel': true
        },
        'toolbox': {
          'feature': {
            'saveAsImage': {}
          }
        },
        'xAxis': {
          'type': 'category',
          'boundaryGap': false,
          'data': []
        },
        'yAxis': {
          'type': 'value'
        },
        'series': []
      }
    }
  },
  activated () {
    // 由于给echart添加了resize事件, 在组件激活时需要重新resize绘画一次, 否则出现空白bug
    if (this.chartLine) {
      this.chartLine.resize()
    }
  },
  methods: {
    init (url) {
      this.visible = true;
      this.$nextTick(() => {
        this.initChartLine(url)
      })
    },
    // 折线图
    initChartLine (url) {
      this.dataListLoading = true
      this.$http({
        url: this.$http.adornUrl(url),
        method: 'post',
        data: Object.assign({})
      }).then(({ data }) => {
        if (data && data.code === 0) {
          this.dataList = data.pageList.dataList
          this.chartLine = echarts.init(document.getElementById('J_chartLineBox'))
          //设置数值
          this.option.series = [{
            'name': '邮件营销',
            'type': 'line',
            'stack': '总量',
            'data': [120, 132, 101, 134, 90, 230, 210]
          },
          {
            'name': '联盟广告',
            'type': 'line',
            'stack': '总量',
            'data': [220, 182, 191, 234, 290, 330, 310]
          },
          {
            'name': '视频广告',
            'type': 'line',
            'stack': '总量',
            'data': [150, 232, 201, 154, 190, 330, 410]
          },
          {
            'name': '直接访问',
            'type': 'line',
            'stack': '总量',
            'data': [320, 332, 301, 334, 390, 330, 320]
          },
          {
            'name': '搜索引擎',
            'type': 'line',
            'stack': '总量',
            'data': [820, 932, 901, 934, 1290, 1330, 1320]
          }]
          // 折线的标题
          this.option.legend.data = ['邮件营销', '联盟广告', '视频广告', '直接访问', '搜索引擎']
          // 设置X坐标的值
          this.option.xAxis.data = ['周一', '周二', '周三', '周四', '周五', '周六', '周日']
          this.chartLine.setOption(this.option, true)
          window.addEventListener('resize', () => {
            this.chartLine.resize()
          })
          this.dataListLoading = false

        } else {
          this.option = {}
        }
      })
    },
  },
  //在Chart.vue中加入watch
  watch: {
    //观察option的变化
    option: {
      handler(newVal, oldVal) {
        if (this.chartLine) {
          if (newVal) {
            this.chartLine.setOption(newVal);
          } else {
            this.chartLine.setOption(oldVal);
          }
        } else {
            this.initChartLine();
        }
      },
      deep: true //对象内部属性的监听，关键。
    }
  }
}
</script>

<style lang="scss" scoped>
.mod-demo-echarts {
  > .el-alert {
    margin-bottom: 10px;
  }
  > .el-row {
    margin-top: -10px;
    margin-bottom: -10px;
    .el-col {
      padding-top: 10px;
      padding-bottom: 10px;
    }
  }
  .chart-box {
    min-height: 400px;
  }
  .el-dialog .el-dialog__header {
    text-align: center !important;
  }
  #J_chartLineBox{
    min-width: 500px; 
    height:500px
  }
}
</style>
