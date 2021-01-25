import Vue from 'vue'
import App from './App.vue'
import KBoneUI from 'kbone-ui'

KBoneUI.register({
  components: 'all',
  style: {
    'mp-badge': `.blue {background: blue;}`,
    'mp-loading': `.demo0 {height: 60px; background: white;} .demo1 {height: 60px; background: rgba(0,0,0,.1);}`,
    'mp-searchbar': `.searchbar-result {margin-top: 0;font-size: 14px;} .searchbar-result:before {display: none;}`
  }
})

new Vue({
  el: '#app',
  render: h => h(App)
})
