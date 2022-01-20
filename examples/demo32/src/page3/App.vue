<template>
  <div class="cnt">
    <Header></Header>
    <button @click="page1">页面 1</button>
    <button @click="page2">页面 2</button>
    <button @click="page4">页面 4</button>
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
    window.addEventListener('wxload', query => console.log('page3 wxload', query))
    window.addEventListener('wxshow', () => console.log('page3 wxshow'))
    window.addEventListener('wxready', () => console.log('page3 wxready'))
    window.addEventListener('wxhide', () => console.log('page3 wxhide'))
    window.addEventListener('wxunload', () => console.log('page3 wxunload'))
  },
  methods: {
    page1() {
      wx.switchTab({
        url: '/pages/index/index',
      })
    },

    page2() {
      wx.switchTab({
        url: '/pages/index2/index',
      })
    },

    page4() {
      wx.navigateTo({
        url: `/pages/index4/index?type=open&targeturl=${encodeURIComponent('/spa/b')}`,
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
