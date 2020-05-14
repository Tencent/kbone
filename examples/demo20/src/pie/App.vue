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
        color: ['#37A2DA', '#32C5E9', '#67E0E3', '#91F2DE', '#FFDB5C', '#FF9F7F'],
        series: [{
          label: {
            normal: {
              fontSize: 14
            }
          },
          type: 'pie',
          center: ['50%', '50%'],
          radius: [0, '60%'],
          data: [{
            value: 55,
            name: '北京'
          }, {
            value: 20,
            name: '武汉'
          }, {
            value: 10,
            name: '杭州'
          }, {
            value: 20,
            name: '广州'
          }, {
            value: 38,
            name: '上海'
          }],
          itemStyle: {
            emphasis: {
              shadowBlur: 10,
              shadowOffsetX: 0,
              shadowColor: 'rgba(0, 2, 2, 0.3)'
            }
          }
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
