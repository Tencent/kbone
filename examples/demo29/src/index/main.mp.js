import Vue from 'vue'
import App from './App.vue'

export default function createApp() {
  const container = document.createElement('div')
  container.id = 'app'
  document.body.appendChild(container)


  return new Vue({
    el: '#app',
    render: h => h(App)
  })
}
