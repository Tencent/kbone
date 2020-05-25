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
        tooltip: {
          trigger: 'item',
          formatter: '{a} <br/>{b} : {c}%'
        },
        legend: {
          orient: 'vertical',
          left: 10,
          data: ['展现', '点击', '访问', '咨询', '订单']
        },
        calculable: true,
        series: [{
          name: '漏斗图',
          type: 'funnel',
          width: '40%',
          height: '45%',
          left: '5%',
          top: '50%',
          data: [
            {value: 100, name: '展现'},
            {value: 80, name: '点击'},
            {value: 60, name: '访问'},
            {value: 30, name: '咨询'},
            {value: 10, name: '订单'}
          ]
        }, {
          name: '金字塔',
          type: 'funnel',
          width: '40%',
          height: '45%',
          left: '5%',
          top: '5%',
          sort: 'ascending',
          data: [
            {value: 60, name: '访问'},
            {value: 30, name: '咨询'},
            {value: 10, name: '订单'},
            {value: 80, name: '点击'},
            {value: 100, name: '展现'}
          ]
        }, {
          name: '漏斗图',
          type: 'funnel',
          width: '40%',
          height: '45%',
          left: '55%',
          top: '5%',
          label: {
            normal: {
              position: 'left'
            }
          },
          data: [
            {value: 60, name: '访问'},
            {value: 30, name: '咨询'},
            {value: 10, name: '订单'},
            {value: 80, name: '点击'},
            {value: 100, name: '展现'}
          ]
        }, {
          name: '金字塔',
          type: 'funnel',
          width: '40%',
          height: '45%',
          left: '55%',
          top: '50%',
          sort: 'ascending',
          label: {
            normal: {
              position: 'left'
            }
          },
          data: [
            {value: 60, name: '访问'},
            {value: 30, name: '咨询'},
            {value: 10, name: '订单'},
            {value: 80, name: '点击'},
            {value: 100, name: '展现'}
          ]
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
