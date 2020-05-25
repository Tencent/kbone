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
      const data1 = {
        name: 'root',
        children: [{
          name: 'a',
          children: [{
            name: 'a1',
          }, {
            name: 'a2',
          }, {
            name: 'a3',
          }, {
            name: 'a4',
          }]
        }, {
          name: 'b',
          children: [{
            name: 'b1',
          }, {
            name: 'b2',
          }, {
            name: 'b3',
          }, {
            name: 'b4',
          }]
        }, {
          name: 'c',
          children: [{
            name: 'c1',
          }]
        }, {
          name: 'd',
          children: [{
            name: 'd1',
          }]
        }]
      }

      chart.setOption({
        series: [{
          type: 'tree',
          initialTreeDepth: -1,
          name: 'tree1',
          data: [data1],
          top: '5%',
          left: '20%',
          bottom: '2%',
          right: '15%',
          symbolSize: 10,
          symbol: 'circle',
          label: {
            normal: {
              position: 'left',
              verticalAlign: 'middle',
              align: 'right',
              color: 'black'
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
