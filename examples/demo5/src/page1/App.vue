<template>
  <div class="cnt">
    <Header></Header>
    <p>当前 url：{{url}}</p>
    <a href="/b">当前页跳转</a>
    <a href="/c" target="_blank">新开页面跳转</a>
    <button @click="onClickJump">当前页跳转</button>
    <button @click="onClickOpen">新开页面跳转</button>
    <button @click="onClickSpa">打开 spa 页面</button>
    <button @click="onClickPromiseReject">promise reject 模拟</button>
    <a href="/waterfall">前往瀑布流页面</a>
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
    window.addEventListener('wxload', query => console.log('page1 wxload', query))
    window.addEventListener('wxshow', () => console.log('page1 wxshow'))
    window.addEventListener('wxready', () => console.log('page1 wxready'))
    window.addEventListener('wxhide', () => console.log('page1 wxhide'))
    window.addEventListener('wxunload', () => console.log('page1 wxunload'))

    document.addEventListener('visibilitychange', () => {
      console.log('page1 visibilityState: ', document.visibilityState)
      console.log('page1 hidden: ', document.hidden)
    })

    window.onShareAppMessage = () => {
      return {
        title: 'kbone-demo',
        // path: '/a', // 当前页面
        // path: 'https://test.miniprogram.com/a', // 当前页面的完整 url
        path: '/b', // 其他页面
        // path: 'https://test.miniprogram.com/b', // 其他页面的完整 url
        // miniprogramPath: `/pages/page2/index?type=share&targeturl=${encodeURIComponent('/b')}`, // 自己组装分享页面路由
      }
    }

    window.onShareTimeline = () => {
      return {
        title: 'kbone-demo',
      }
    }

    window.onAddToFavorites = () => {
      return {
        title: 'kbone-demo',
      }
    }

    window.addEventListener('resize', () => console.log('window resize：addEventListener'))
    window.onresize = () => console.log('window resize：onresize')
  },
  mounted() {
    // cookie
    console.log('before set cookie', document.cookie)
    document.cookie = `time=${+new Date()}; expires=Wed Jan 01 2220 00:00:00 GMT+0800; path=/`
    console.log('after set cookie', document.cookie)
  },
  methods: {
    onClickJump() {
      window.location.href = '/b'
    },

    onClickOpen() {
      window.open('/c')
    },

    onClickSpa() {
      window.open('/spa')
    },

    onClickPromiseReject() {
      // 未处理的 promise reject
      (new Promise(resolve => {
        throw new Error('err')
      })).then(() => {})
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
