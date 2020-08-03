<template>
  <div class="cnt">
    <Header></Header>
    <a href="/a">回到首页</a>
    <button @click="onClickJump">回到首页</button>
    <Footer></Footer>
  </div>
</template>

<script>
import * as Vue from 'vue'
import Header from '../common/Header.vue'
import Footer from '../common/Footer.vue'

export default {
  components: {
    Header,
    Footer
  },
  setup() {
    Vue.onMounted(() => {
      console.log('page2 mounted')
    })

    Vue.onUnmounted(() => {
      console.log('page2 unmounted')
    })

    return {
      onClickJump() {
        window.location.href = '/a'
      },
    }
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
