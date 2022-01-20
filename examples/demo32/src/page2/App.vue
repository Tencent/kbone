<template>
  <div class="cnt">
    <Header></Header>
    <button @click="page1">页面 1</button>
    <button @click="page3">页面 3</button>
    <button @click="page4">页面 4</button>
    <div>
      <div v-for="n in 100" :key="n">滚动项 123456789</div>
    </div>
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
    window.addEventListener('wxload', query => console.log('page2 wxload', query))
    window.addEventListener('wxshow', () => console.log('page2 wxshow'))
    window.addEventListener('wxready', () => console.log('page2 wxready'))
    window.addEventListener('wxhide', () => console.log('page2 wxhide'))
    window.addEventListener('wxunload', () => console.log('page2 wxunload'))
    window.addEventListener('scroll', () => console.log('page2 scroll'))
  },
  methods: {
    page1() {
      wx.switchTab({
        url: '/pages/index/index',
      })
    },

    page3() {
      wx.switchTab({
        url: '/pages/index3/index',
      })
    },

    page4() {
      wx.navigateTo({
        url: `/pages/index4/index?type=open&targeturl=${encodeURIComponent('/spa/a')}`,
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
