<template>
  <div class="panel">
    <div class="chart-with-img" v-for="chart in charts" :key="chart.id">
      <img :src="chart.icon" mode="aspectFit" @click="open(chart)" />
      {{chart.name}}
    </div>
  </div>
</template>

<script>
export default {
  name: 'App',
  data() {
    return {
      charts: [
        {id: 'bar', name: '柱状图', icon: require(`../images/bar.png`)},
        {id: 'scatter', name: '散点图', icon: require(`../images/scatter.png`)},
        {id: 'pie', name: '饼图', icon: require(`../images/pie.png`)},
        {id: 'line', name: '折线图', icon: require(`../images/line.png`)},
        {id: 'funnel', name: '漏斗图', icon: require(`../images/funnel.png`)},
        {id: 'gauge', name: '仪表盘', icon: require(`../images/gauge.png`)},
        {id: 'k', name: 'K 线图', icon: require(`../images/k.png`)},
        {id: 'radar', name: '雷达图', icon: require(`../images/radar.png`)},
        {id: 'heatmap', name: '热力图', icon: require(`../images/heatmap.png`)},
        {id: 'tree', name: '树图', icon: require(`../images/tree.png`)},
        {id: 'treemap', name: '矩形树图', icon: require(`../images/treemap.png`)},
        {id: 'sunburst', name: '旭日图', icon: require(`../images/sunburst.png`)},
        {id: 'map', name: '地图', icon: require(`../images/map.png`)},
        {id: 'graph', name: '关系图', icon: require(`../images/graph.png`)},
        {id: 'boxplot', name: '箱型图', icon: require(`../images/boxplot.png`)},
        {id: 'parallel', name: '平行坐标图', icon: require(`../images/parallel.png`)},
        {id: 'sankey', name: '桑基图', icon: require(`../images/sankey.png`)},
        {id: 'themeRiver', name: '主题河流图', icon: require(`../images/themeRiver.png`)}
      ],
    }
  },
  methods: {
    open(chart) {
      window.open(`/${chart.id}`);
    },
  },
}
</script>

<style>
.panel {
  display: block;
  margin-top: 10px;
}

.panel .chart-with-img {
  display: inline-block;
  width: 25%;
  margin: 10px 4%;
  text-align: center;
}

.chart-with-img image {
  box-sizing: border-box;
  width: 100%;
  height: 100px; 
  padding: 20px;
  background-color: #f3f3f3;
  border: 1px solid #eee;
  display: block;
  margin: 0 auto;
  margin-bottom: 10px;
}
</style>
