import Vue from 'vue'
import App from './App.vue'
import {Input, Select, Button, Row, Col, Autocomplete} from 'element-ui';

export default function createApp() {
  const container = document.createElement('div')
  container.id = 'app'
  document.body.appendChild(container)

  Vue.use(Input)
  Vue.use(Select)
  Vue.use(Button)
  Vue.use(Row)
  Vue.use(Col)
  Vue.use(Autocomplete)

  return new Vue({
    el: '#app',
    render: h => h(App)
  })
}
