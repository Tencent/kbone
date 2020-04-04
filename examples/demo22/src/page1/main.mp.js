import Vue from 'vue'
import {createStore} from '../store'
import App from './App.vue'

export default function createApp() {
  const container = document.createElement('div')
  container.id = 'app'
  document.body.appendChild(container)

  return new Vue({
    el: '#app',
    store: createStore(),
    render: h => h(App)
  })
}
