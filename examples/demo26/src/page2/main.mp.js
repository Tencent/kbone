import * as Vue from 'vue'
import App from './App.vue'

export default function createApp() {
  const container = document.createElement('div')
  container.id = 'app'
  document.body.appendChild(container)

  const app = Vue.createApp(App)
  app.mount('#app')
  return app
}
