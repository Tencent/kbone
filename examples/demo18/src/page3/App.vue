<template>
  <div class="cnt">
    <Header></Header>
    <button @click="onClickBack">回到上一页</button>
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
    console.log('cookie [page3]：', document.cookie)
  },
  methods: {
    onClickBack() {
      if (process.env.isMiniprogram) {
        wx.navigateBack()
      }
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
