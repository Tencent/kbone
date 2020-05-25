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
          text: 'K 线图'
        },
        xAxis: {
          data: ['10:00', '10:30', '11:00', '11:30', '13:00', '13:30', '14:00']
        },
        yAxis: {},
        series: [{
          type: 'k',
          data: [
            [100, 200, 40, 250],
            [80, 90, 66, 100],
            [90, 40, 33, 110],
            [50, 60, 40, 80],
            [200, 180, 160, 200],
            [100, 200, 40, 250],
            [80, 90, 66, 100]
          ],
          itemStyle: {
            normal: {
              color: '#ff0000',
              color0: '#00ff00',
              borderWidth: 1,
              opacity: 1,
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
