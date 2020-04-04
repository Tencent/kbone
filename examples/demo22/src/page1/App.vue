<template>
  <div class="cnt">
    <Header></Header>
    <a href="/page2" target="_blank">跳转页面2</a>
    <a href="/page3" target="_blank">跳转页面3</a>
    <a href="/page4" target="_blank">跳转页面4</a>
    <Footer></Footer>
  </div>
</template>

<script>
import Header from '../common/Header.vue'
import Footer from '../common/Footer.vue'

export default {
  name: 'App',
  components: {
    Header,
    Footer
  },
  mounted() {
    let count = 0
    setInterval(() => {
      console.log('开始发送轮询消息，10s一次')
      window.$$publish('polling', ++count)
    }, 10000)
    window.$$subscribe('page1', data => console.log('首页收到来自其他页面的消息', data))
  },
  methods: {},
}
</script>

<style>
.cnt {
  margin-top: 20px;
}
a {
  display: block;
  width: 100%;
  height: 30px;
  line-height: 30px;
  text-align: center;
  font-size: 20px;
  border: 1px solid #ddd;
}
</style>
