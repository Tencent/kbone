<template>
  <div class="cnt">
    <Header></Header>
    <a href="/b">当前页跳转</a>
    <a href="/c" target="_blank">新开页面跳转</a>
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
  created() {
    window.addEventListener('wxload', query => console.log('page1 wxload', query))
    window.addEventListener('wxshow', () => console.log('page1 wxshow'))
    window.addEventListener('wxready', () => console.log('page1 wxready'))
    window.addEventListener('wxhide', () => console.log('page1 wxhide'))
    window.addEventListener('wxunload', () => console.log('page1 wxunload'))
  },
  methods: {
    onClickJump() {
      window.location.href = '/b'
    },

    onClickOpen() {
      window.open('/c')
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
