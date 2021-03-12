<template>
  <div class="cnt">
    <Header></Header>
    <a href="/b">当前页跳转</a>
    <a href="/c" target="_blank">新开页面跳转</a>
    <button @click="onClickJump">当前页跳转</button>
    <button @click="onClickOpen">新开页面跳转</button>
    <canvas ref="canvasRef" type="2d" width="300" height="200" @touchstart="log('normal', $event)" @canvastouchstart="log('canvas', $event)"></canvas>
    <Footer></Footer>
  </div>
</template>

<script>
import * as Vue from 'vue'
import Header from '../common/Header.vue'
import Footer from '../common/Footer.vue'

export default {
  components: {
    Header,
    Footer
  },
  setup() {
    const canvasRef = Vue.ref(null)

    Vue.onMounted(() => {
      console.log('page1 mounted')

      // 不要问为什么不用 $$prepare，vue3 把所有挂在 dom 上的东西都加了一层 proxy，导致基于 this 的 weakmap 全都没法用
      const canvas = canvasRef.value
      canvas.$$getNodesRef().then(nodesRef => nodesRef.node(res => {
        const {width, height} = canvas
        const node = res.node

        // 设置 canvas 宽高
        node.width = width
        node.height = height

        const context = node.getContext('2d')

        context.strokeStyle = '#00ff00'
        context.lineWidth = 5
        context.rect(0, 0, 200, 200)
        context.stroke()
        context.strokeStyle = '#ff0000'
        context.lineWidth = 2
        context.moveTo(160, 100)
        context.arc(100, 100, 60, 0, 2 * Math.PI, true)
        context.moveTo(140, 100)
        context.arc(100, 100, 40, 0, Math.PI, false)
        context.moveTo(85, 80)
        context.arc(80, 80, 5, 0, 2 * Math.PI, true)
        context.moveTo(125, 80)
        context.arc(120, 80, 5, 0, 2 * Math.PI, true)
        context.stroke()
      }).exec()).catch(console.error)
    })

    Vue.onUnmounted(() => {
      console.log('page1 unmounted')
    })

    return {
      canvasRef,

      onClickJump() {
        window.location.href = '/b'
      },

      onClickOpen() {
        window.open('/c')
      },

      async log(...args) {
        console.log(...args)
      },
    }
  },
}
</script>

<style>
.cnt {
  margin-top: 20px;
}
a, button {
  display: block;
  width: 100%;
  height: 30px;
  line-height: 30px;
  text-align: center;
  font-size: 20px;
  border: 1px solid #ddd;
}
</style>
