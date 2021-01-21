import Vue from 'vue'
import App from './App.vue'
import * as kbone from 'kbone-tool'

// relations 不支持跨自定义组件，得在逻辑层解决
kbone.weui.useForm()

export default function createApp() {
  const container = document.createElement('div')
  container.id = 'app'
  document.body.appendChild(container)

  return new Vue({
    el: '#app',
    render: h => h(App)
  })
}
