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
        backgroundColor: '#ffffff',
        color: ['#37A2DA', '#FF9F7F'],
        tooltip: {},
        xAxis: {
          show: false
        },
        yAxis: {
          show: false
        },
        radar: {
          // shape: 'circle',
          indicator: [{
            name: '食品',
            max: 500
          }, {
            name: '玩具',
            max: 500
          }, {
            name: '服饰',
            max: 500
          }, {
            name: '绘本',
            max: 500
          }, {
            name: '医疗',
            max: 500
          }, {
            name: '门票',
            max: 500
          }]
        },
        series: [{
          name: '预算 vs 开销',
          type: 'radar',
          data: [{
            value: [430, 340, 500, 300, 490, 400],
            name: '预算'
          }, {
            value: [300, 430, 150, 300, 420, 250],
            name: '开销'
          }]
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
