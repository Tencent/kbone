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
      const item1 = {
        color: '#F54F4A'
      }
      const item2 = {
        color: '#FF8C75'
      }
      const item3 = {
        color: '#FFB499'
      }
      const data = [{
        children: [{
          value: 5,
          children: [{
            value: 1,
            itemStyle: item1
          }, {
            value: 2
          }, {
            value: 1
          }],
          itemStyle: item1
        }, {
          value: 10,
          children: [{
            value: 6,
            itemStyle: item3
          }, {
            value: 2,
            itemStyle: item3
          }, {
            value: 1
          }],
          itemStyle: item1
        }],
        itemStyle: item1
      }, {
        value: 9,
        children: [{
          value: 4,
          children: [{
            value: 2,
            itemStyle: item2
          }],
          itemStyle: item1
        }, {
          children: [{
            value: 3
          }],
          itemStyle: item3
        }],
        itemStyle: item2
      }, {
        value: 7,
        children: [{
          children: [{
            value: 1,
            itemStyle: item3
          }, {
            value: 3,
            itemStyle: item2
          }, {
            value: 2,
            itemStyle: item1
          }],
          itemStyle: item3
        }],
        itemStyle: item1
      }, {
        children: [{
          value: 6,
          children: [{
            value: 1,
            itemStyle: item2
          }, {
            value: 2,
            itemStyle: item1
          }, {
            value: 1,
            itemStyle: item3
          }],
          itemStyle: item3
        }, {
          value: 3,
          children: [{
            value: 1,
          }, {
            value: 1,
            itemStyle: item2
          }, {
            value: 1
          }],
          itemStyle: item3
        }],
        itemStyle: item1
      }]
      chart.setOption({
        series: {
          radius: ['15%', '80%'],
          type: 'sunburst',
          sort: null,
          highlightPolicy: 'ancestor',
          data: data,
          label: {
            rotate: 'radial'
          },
          levels: [],
          itemStyle: {
            color: '#ddd',
            borderWidth: 2
          }
        },
        silent: true
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
