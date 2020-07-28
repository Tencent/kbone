<template>
  <div class="cnt">
    <Header></Header>
    <a href="/page2.html">当前页跳转</a>
    <a href="/page3.html" target="_blank">新开页面跳转</a>
    <button @click="onClickJump">当前页跳转</button>
    <button @click="onClickOpen">新开页面跳转</button>
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
    // cookie
    console.log('before set cookie [page1]', document.cookie)
    document.cookie = `time=${+new Date()}; expires=Wed Jan 01 2220 00:00:00 GMT+0800; path=/`
    console.log('after set cookie [page1]', document.cookie)
  },
  methods: {
    onClickJump() {
      window.location.href = '/page2.html'
    },

    onClickOpen() {
      window.open('/page3.html')
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
