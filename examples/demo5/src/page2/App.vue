<template>
  <div class="cnt">
    <Header></Header>
    <p>当前 url：{{url}}</p>
    <a href="/a">回到首页</a>
    <button @click="onClickJump">回到首页</button>
    <button @click="onClickReLaunch">relaunch</button>
    <button ref="btn" @click="onClickUpdateStyle">设置追加样式</button>
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

    onClickUpdateStyle() {
      const btn = this.$refs.btn
      btn.style.backgroundColor = '#dff1e7'
      btn.style.webkitMask = `url("data:image/svg+xml,%3Csvg width='32' height='32' viewBox='0 0 32 32' xmlns='http://www.w3.org/2000/svg'%3E%3Ctitle%3Eon_dark%3C/title%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Ccircle stroke-opacity='.254' stroke='%23FFF' stroke-width='.5' cx='16' cy='16' r='15.75'/%3E%3Cpath fill='none' d='M4 4h24v24H4z' fill-opacity='0'/%3E%3Cpath fill='%23FFF' d='M15 20.5h2v3h-2z'/%3E%3Cpath d='M20.498 23.09V16.81h3.115c.031 0 .065-.035.065-.088a.1.1 0 0 0-.027-.07l-7.613-7.81c-.023-.025-.053-.025-.076 0l-7.613 7.81a.105.105 0 0 0 0 .14.054.054 0 0 0 .038.018h3.115v6.281c0 .053.034.088.064.088h8.868c.03 0 .064-.035.064-.088z' stroke='%23FFF' stroke-width='1.644'/%3E%3C/g%3E%3C/svg%3E") no-repeat 50% 50%`
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
