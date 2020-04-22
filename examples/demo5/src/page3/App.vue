<template>
  <div class="cnt">
    <Header></Header>
    <p>当前 url：{{url}}</p>
    <button @click="onClickBack">回到上一页</button>
    <button @click="onClickClose">关闭当前窗口</button>
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
  data() {
    return {
      url: location.href,
    }
  },
  created() {
    window.addEventListener('wxload', query => console.log('page3 wxload', query))
    window.addEventListener('wxshow', () => console.log('page3 wxshow'))
    window.addEventListener('wxready', () => console.log('page3 wxready'))
    window.addEventListener('wxhide', () => console.log('page3 wxhide'))
    window.addEventListener('wxunload', () => console.log('page3 wxunload'))

    document.addEventListener('visibilitychange', () => {
      console.log('page3 visibilityState: ', document.visibilityState)
      console.log('page3 hidden: ', document.hidden)
    })

    window.onShareAppMessage = () => {
      return {
        title: 'kbone-demo',
        path: '/a',
      }
    }
  },
  methods: {
    onClickBack() {
      if (process.env.isMiniprogram) {
        wx.navigateBack()
      }
    },

    onClickClose() {
      window.close()
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
