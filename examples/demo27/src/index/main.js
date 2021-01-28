import Vue from 'vue'
import App from './App.vue'
import VConsole from 'vconsole'
// import KBoneUI from 'kbone-ui' // 引入完整 kbone-ui
import KBoneUI from 'kbone-ui/wx-components' // 只引入内置组件

KBoneUI.register({
  style: {
    'wx-input': `.green {color: green;}`, // 注入给 placeholder-class 使用
    'wx-textarea': `.green {color: green;}`, // 注入给 placeholder-class 使用
  }
})

new VConsole()

new Vue({
  el: '#app',
  render: h => h(App)
})
