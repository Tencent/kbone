import Vue from 'vue'
import App from './App.vue'
import KBoneUI from 'kbone-ui'

KBoneUI.register({
  components: 'all',
  mode: 'open',
  style: {
    'mp-loading': `.demo0 {height: 60px; background: white;} .demo1 {height: 60px; background: rgba(0,0,0,.1);}`,
  }
})

new Vue({
  el: '#app',
  render: h => h(App)
})
