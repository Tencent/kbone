<template>
  <div class="cnt">
    <Header></Header>
    <div class="content">page1</div>
    <a href="/b">跳转 tabbar 页面</a>
    <a href="/c" target="_blank">跳转普通页面</a>
    <a href="/d">跳转不存在的页面</a>
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
  created() {
    window.addEventListener('wxshow', () => {
      if (typeof window.getTabBar === 'function' && window.getTabBar()) {
        window.getTabBar().setData({selected: 0})
      }
    })
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
