import Vue from 'vue'
import App from './App.vue'
import {Container, Header, Main, Footer, aside} from 'element-ui';

export default function createApp() {
  const container = document.createElement('div')
  container.id = 'app'
  document.body.appendChild(container)

  Vue.use(Container)
  Vue.use(Header)
  Vue.use(Main)
  Vue.use(Footer)
  Vue.use(aside)
  
  return new Vue({
    el: '#app',
    render: h => h(App)
  })
}
