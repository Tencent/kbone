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
      const data = []
      const data2 = []

      for (let i = 0; i < 10; i++) {
        data.push([
          Math.round(Math.random() * 100),
          Math.round(Math.random() * 100),
          Math.round(Math.random() * 40)
        ])
        data2.push([
          Math.round(Math.random() * 100),
          Math.round(Math.random() * 100),
          Math.round(Math.random() * 100)
        ])
      }

      const axisCommon = {
        axisLabel: {
          textStyle: {
            color: '#C8C8C8',
          },
        },
        axisTick: {
          lineStyle: {
            color: '#fff',
          },
        },
        axisLine: {
          lineStyle: {
            color: '#C8C8C8',
          },
        },
        splitLine: {
          lineStyle: {
            color: '#C8C8C8',
            type: 'solid',
          },
        },
      }

      chart.setOption({
        color: ['#FF7070', '#60B6E3'],
        backgroundColor: '#eee',
        xAxis: axisCommon,
        yAxis: axisCommon,
        legend: {
          data: ['aaaa', 'bbbb'],
        },
        visualMap: {
          show: false,
          max: 100,
          inRange: {
            symbolSize: [20, 70]
          }
        },
        series: [{
          type: 'scatter',
          name: 'aaaa',
          data: data
        }, {
          name: 'bbbb',
          type: 'scatter',
          data: data2
        }],
        animationDelay: idx => idx * 50,
        animationEasing: 'elasticOut',
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
