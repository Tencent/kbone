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
        color: ['#37A2DA', '#32C5E9', '#67E0E3', '#91F2DE', '#FFDB5C', '#FF9F7F'],
        title: {
          text: 'Graph 简单示例'
        },
        tooltip: {},
        animationDurationUpdate: 1500,
        animationEasingUpdate: 'quinticInOut',
        series: [{
          type: 'graph',
          layout: 'none',
          symbolSize: 50,
          roam: true,
          label: {
            normal: {
              show: true
            }
          },
          // edgeSymbol: ['circle', 'arrow'],
          // edgeSymbolSize: [4, 10],
          edgeLabel: {
            normal: {
              textStyle: {
                fontSize: 20
              }
            }
          },
          data: [{
            name: '节点1',
            x: 300,
            y: 300,
            itemStyle: {
              color: '#37A2DA'
            }
          }, {
            name: '节点2',
            x: 800,
            y: 300,
            itemStyle: {
              color: '#32C5E9'
            }
          }, {
            name: '节点3',
            x: 550,
            y: 100,
            itemStyle: {
              color: '#9FE6B8'
            }
          }, {
            name: '节点4',
            x: 550,
            y: 500,
            itemStyle: {
              color: '#FF9F7F'
            }
          }],
          // links: [],
          links: [{
            source: 0,
            target: 1,
            symbolSize: [5, 20],
            label: {
              normal: {
                show: true
              }
            },
            lineStyle: {
              normal: {
                width: 4,
                curveness: 0.2
              }
            }
          }, {
            source: '节点2',
            target: '节点1',
            label: {
              normal: {
                show: true
              }
            },
            lineStyle: {
              normal: { curveness: 0.2 }
            }
          }, {
            source: '节点1',
            target: '节点3'
          }, {
            source: '节点2',
            target: '节点3'
          }, {
            source: '节点2',
            target: '节点4'
          }, {
            source: '节点1',
            target: '节点4'
          }],
          lineStyle: {
            normal: {
              opacity: 0.9,
              width: 2,
              curveness: 0
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
