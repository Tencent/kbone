import Vue from 'vue'
import App from './App.vue'
import KBoneUI from 'kbone-ui'

KBoneUI.register({
  components: 'all',
  style: {
    'wx-input': `.green {color: green;}`, // 注入给 placeholder-class 使用
    'wx-textarea': `.green {color: green;}`, // 注入给 placeholder-class 使用
  }
})

new Vue({
  el: '#app',
  render: h => h(App)
})
