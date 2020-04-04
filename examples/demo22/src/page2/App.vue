<template>
  <div class="cnt">
    <Header></Header>
    <a href="/page3" target="_blank">跳转页面3</a>
    <a href="/page4" target="_blank">跳转页面4</a>
    <button @click="onClickBack">回到上一页</button>
    <button @click="sendPage1">发布消息给首页</button>
    <div>count: {{count}} - name: {{data.name || ''}}</div>
    <Footer></Footer>
  </div>
</template>

<script>
import {mapState} from 'vuex'
import Header from '../common/Header.vue'
import Footer from '../common/Footer.vue'

export default {
  name: 'App',
  components: {
    Header,
    Footer
  },
  computed: {
    ...mapState(['count', 'data'])
  },
  mounted() {
    window.$$subscribe('polling', count => console.log('页面2收到来自首页的轮询消息 --> ' + count))
    window.$$subscribe('page2', data => console.log('页面2收到来自页面3的消息', data))
    window.$$subscribe('page23', data => console.log('页面2收到来自页面4的消息', data))
  },
  methods: {
    onClickBack() {
      if (process.env.isMiniprogram) {
        wx.navigateBack()
      }
    },

    sendPage1() {
      window.$$publish('page1', {from: '页面2', to: '首页'})
    },
  },
}
</script>

<style>
.cnt {
  margin-top: 20px;
  text-align: center;
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
