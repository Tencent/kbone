import Vue from 'vue'
import App from './App.vue'
import {Button, ButtonGroup} from 'element-ui';

export default function createApp() {
  const container = document.createElement('div')
  container.id = 'app'
  document.body.appendChild(container)

  Vue.use(Button)
  Vue.use(ButtonGroup)

  return new Vue({
    el: '#app',
    render: h => h(App)
  })
}
