<template>
  <div class="cnt">
    <Header></Header>
    <a href="/b">当前页跳转</a>
    <a href="/c" target="_blank">新开页面跳转</a>
    <button @click="onClickJump">当前页跳转</button>
    <button @click="onClickOpen">新开页面跳转</button>
    <div class="split"></div>
    <wx-button class="button" open-type="chooseAvatar" @chooseavatar="log('onChooseAvatar', $event.detail)">获取用户头像</wx-button>
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
  methods: {
    onClickJump() {
      window.location.href = '/b'
    },

    onClickOpen() {
      window.open('/c')
    },

    log(text, arg) {
      console.log(text, arg)
    },
  },
}
</script>

<style>
.cnt {
  margin-top: 20px;
}
a, button, .button {
  display: block;
  width: 100%;
  height: 30px;
  line-height: 30px;
  text-align: center;
  font-size: 20px;
  border: 1px solid #ddd;
}
.split {
  height: 20px;
}
</style>
