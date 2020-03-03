import Vue from 'vue'
import App from './App.vue'
import {Radio, RadioGroup, RadioButton} from 'element-ui';

export default function createApp() {
  const container = document.createElement('div')
  container.id = 'app'
  document.body.appendChild(container)

  Vue.use(Radio)
  Vue.use(RadioGroup)
  Vue.use(RadioButton)

  return new Vue({
    el: '#app',
    render: h => h(App)
  })
}
