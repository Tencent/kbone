<template>
  <div class="cnt">
    <Header></Header>
    <p>当前 url：{{url}}</p>
    <a href="/a">回到首页</a>
    <button @click="onClickJump">回到首页</button>
    <button @click="onClickReLaunch">relaunch</button>
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
    window.addEventListener('wxload', query => console.log('page2 wxload', query))
    window.addEventListener('wxshow', () => console.log('page2 wxshow'))
    window.addEventListener('wxready', () => console.log('page2 wxready'))
    window.addEventListener('wxhide', () => console.log('page2 wxhide'))
    window.addEventListener('wxunload', () => console.log('page2 wxunload'))

    document.addEventListener('visibilitychange', () => {
      console.log('page2 visibilityState: ', document.visibilityState)
      console.log('page2 hidden: ', document.hidden)
    })

    window.onShareAppMessage = () => {
      return {
        title: 'kbone-demo',
        path: '/a',
      }
    }
  },
  methods: {
    onClickJump() {
      window.location.href = '/a'
    },

    onClickReLaunch() {
      wx.reLaunch({
        url: `/pages/page1/index?type=jump&targeturl=${encodeURIComponent('/a')}`,
      })
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
