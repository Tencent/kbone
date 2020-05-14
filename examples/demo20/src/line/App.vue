<template>
  <div class="container">
    <canvas
      ref="canvas"
      type="2d"
      :width="width"
      :height="height"
    >
    </canvas>
  </div>
</template>

<script>
import echarts from 'echarts'
import {getChart} from '../chart'

const systemInfo = wx.getSystemInfoSync()

export default {
  name: 'App',
  data() {
    return {
      width: systemInfo.windowWidth,
      height: systemInfo.windowHeight,
    }
  },
  mounted() {
    getChart(this.$refs.canvas, echarts, {
      width: this.width,
      height: this.height,
      devicePixelRatio: systemInfo.devicePixelRatio,
    }).then(this.initChart)
  },
  methods: {
    initChart(chart) {  
      chart.setOption({
        title: {
          text: '测试下面legend的红色区域不应被裁剪',
          left: 'center'
        },
        color: ['#37A2DA', '#67E0E3', '#9FE6B8'],
        legend: {
          data: ['A', 'B', 'C'],
          top: 50,
          left: 'center',
          backgroundColor: 'red',
          z: 100
        },
        grid: {
          containLabel: true
        },
        tooltip: {
          show: true,
          trigger: 'axis'
        },
        xAxis: {
          type: 'category',
          boundaryGap: false,
          data: ['周一', '周二', '周三', '周四', '周五', '周六', '周日'],
          // show: false
        },
        yAxis: {
          x: 'center',
          type: 'value',
          splitLine: {
            lineStyle: {
              type: 'dashed'
            }
          }
          // show: false
        },
        series: [{
          name: 'A',
          type: 'line',
          smooth: true,
          data: [18, 36, 65, 30, 78, 40, 33]
        }, {
          name: 'B',
          type: 'line',
          smooth: true,
          data: [12, 50, 51, 35, 70, 30, 20]
        }, {
          name: 'C',
          type: 'line',
          smooth: true,
          data: [10, 30, 31, 50, 40, 20, 10]
        }]
      })
    }
  },
}
</script>

<style>
.container {
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;

  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-between;
  box-sizing: border-box;
}
</style>
