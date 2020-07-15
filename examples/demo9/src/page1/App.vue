<template>
  <div class="cnt">
    <Header></Header>
    <div class="content">page1</div>
    <a href="/b">跳转 tabbar 页面</a>
    <a href="/c" target="_blank">跳转普通页面</a>
    <a href="/d">跳转不存在的页面</a>
    <button @click="setStorage">设置 localStorage</button>
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
    Footer,
  },
  mounted() {
    window.onTabItemTap = data => console.log('onTabItemTap page1: ', data)
    window.addEventListener('storage', evt => console.log('page1 storage', `${evt.key}: ${evt.oldValue} => ${evt.newValue}`))
  },
  methods: {
    setStorage() {
      localStorage.setItem('page1Key', +new Date())
    },
  },
}
</script>

<style>
.cnt {
  margin-top: 20px;
}

a, button, .content {
  display: block;
  width: 100%;
  height: 30px;
  line-height: 30px;
  text-align: center;
  font-size: 20px;
  border: 1px solid #ddd;
}
</style>
