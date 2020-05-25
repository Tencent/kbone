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
        color: ['#37a2da'],
        parallelAxis: [
          {dim: 0, name: 'Price'},
          {dim: 1, name: 'Net Weight'},
          {dim: 2, name: 'Amount'},
          {dim: 3, name: 'Score', type: 'category', data: ['Excellent', 'Good', 'OK', 'Bad']}
        ],
        parallel: {
          left: 40,
          right: 80,
          top: 50,
          bottom: 20,
          parallelAxisDefault: {
            axisLine: {
              lineStyle: {
                color: '#999'
              }
            },
            axisLabel: {
              color: '#666'
            },
            nameTextStyle: {
              color: '#666'
            }
          }
        },
        series: {
          type: 'parallel',
          lineStyle: {
            width: 4
          },
          data: [
            [12.99, 100, 82, 'Good'],
            [9.99, 80, 77, 'OK'],
            [20, 120, 60, 'Excellent'],
            [3.2, 40, 70, 'OK']
          ]
        }
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
