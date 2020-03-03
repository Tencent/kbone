import Vue from 'vue'
import App from './App.vue'
import {Button} from 'element-ui';

export default function createApp() {
  const container = document.createElement('div')
  container.id = 'app'
  document.body.appendChild(container)

  Vue.use(Button)

  return new Vue({
    el: '#app',
    render: h => h(App)
  })
}
