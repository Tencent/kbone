<template>
  <div class="cnt">
    <Header></Header>
    <button @click="onClickBack">回到上一页</button>
    <button @click="sendPage1">发布消息给首页</button>
    <button @click="sendPage23">发布消息给页面2和页面3</button>
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
    window.$$subscribe('polling', count => console.log('页面4收到来自首页的轮询消息 --> ' + count))
  },
  methods: {
    onClickBack() {
      if (process.env.isMiniprogram) {
        wx.navigateBack()
      }
    },

    sendPage1() {
      window.$$publish('page1', {from: '页面4', to: '首页'})
    },

    sendPage23() {
      window.$$publish('page23', {from: '页面4', to: '页面2、页面3'})
    },

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
