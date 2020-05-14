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
import geoJson from './mapData.js'

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
      echarts.registerMap('henan', geoJson);
      chart.setOption({
        tooltip: {
          trigger: 'item'
        },
        visualMap: {
          min: 0,
          max: 100,
          left: 'left',
          top: 'bottom',
          text: ['高', '低'], // 文本，默认为数值文本
          calculable: true
        },
        toolbox: {
          show: true,
          orient: 'vertical',
          left: 'right',
          top: 'center',
          feature: {
            dataView: {readOnly: false},
            restore: {},
            saveAsImage: {}
          }
        },
        series: [{
          type: 'map',
          mapType: 'henan',
          label: {
            normal: {
              show: true
            },
            emphasis: {
              textStyle: {
                color: '#fff'
              }
            }
          },
          itemStyle: {
            normal: {
              borderColor: '#389BB7',
              areaColor: '#fff',
            },
            emphasis: {
              areaColor: '#389BB7',
              borderWidth: 0
            }
          },
          animation: false,
          data: [
            {name: '郑州市', value: 100},
            {name: '洛阳市', value: 10},
            {name: '开封市', value: 20},
            {name: '信阳市', value: 30},
            {name: '驻马店市', value: 40},
            {name: '南阳市', value: 41},
            {name: '周口市', value: 15},
            {name: '许昌市', value: 25},
            {name: '平顶山市', value: 35},
            {name: '新乡市', value: 35},
            {name: '漯河市', value: 35},
            {name: '商丘市', value: 35},
            {name: '三门峡市', value: 35},
            {name: '济源市', value: 35},
            {name: '焦作市', value: 35},
            {name: '安阳市', value: 35},
            {name: '鹤壁市', value: 35},
            {name: '濮阳市', value: 35},
            {name: '开封市', value: 4}
          ]
        }],
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
