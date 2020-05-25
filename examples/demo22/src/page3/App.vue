<template>
  <div class="cnt">
    <Header></Header>
    <a href="/page4" target="_blank">跳转页面4</a>
    <button @click="onClickBack">回到上一页</button>
    <button @click="sendPage1">发布消息给首页</button>
    <button @click="sendPage2">发布消息给页面2</button>
    <div>count: {{count}} - {{say && say.word || ''}} name: {{info.name || ''}}</div>
    <Storage name="3"></Storage>
    <div>{{list.join(', ')}}</div>
    <Footer></Footer>
  </div>
</template>

<script>
import {mapState} from 'vuex'
import Header from '../common/Header.vue'
import Footer from '../common/Footer.vue'
import Storage from '../common/Storage.vue'

export default {
  name: 'App',
  components: {
    Header,
    Footer,
    Storage,
  },
  computed: {
    ...mapState(['count', 'say', 'info', 'list'])
  },
  mounted() {
    window.$$subscribe('polling', count => console.log('页面3收到来自首页的轮询消息 --> ' + count))
    window.$$subscribe('page23', data => console.log('页面3收到来自页面4的消息', data))
  },
  methods: {
    onClickBack() {
      if (process.env.isMiniprogram) {
        wx.navigateBack()
      }
    },

    sendPage1() {
      window.$$publish('page1', {from: '页面3', to: '首页'})
    },

    sendPage2() {
      window.$$publish('page2', {from: '页面3', to: '页面2'})
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
