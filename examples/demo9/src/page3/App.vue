<template>
  <div class="cnt">
    <Header></Header>
    <div class="content">page3</div>
    <a href="/a">跳转 tabbar 页面</a>
    <a href="/d" target="_blank">跳转不存在的页面</a>
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
}
</script>

<style>
.cnt {
  margin-top: 20px;
}

a, .content {
  display: block;
  width: 100%;
  height: 30px;
  line-height: 30px;
  text-align: center;
  font-size: 20px;
  border: 1px solid #ddd;
}
</style>
