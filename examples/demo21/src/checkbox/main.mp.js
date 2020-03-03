import Vue from 'vue'
import App from './App.vue'
import {Checkbox, CheckboxGroup, CheckboxButton} from 'element-ui';

export default function createApp() {
  const container = document.createElement('div')
  container.id = 'app'
  document.body.appendChild(container)

  Vue.use(Checkbox)
  Vue.use(CheckboxGroup)
  Vue.use(CheckboxButton)

  return new Vue({
    el: '#app',
    render: h => h(App)
  })
}
