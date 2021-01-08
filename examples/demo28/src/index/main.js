import Vue from 'vue'
import App from './App.vue'
import KBoneUI from 'kbone-ui'

KBoneUI.register({
  components: 'all',
  mode: 'open',
})

new Vue({
  el: '#app',
  render: h => h(App)
})
