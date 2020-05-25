import Vue from 'vue'
import Router from 'vue-router'
import App from './App.vue'
import AAA from './AAA.vue'
import BBB from './BBB.vue'
import CCC from './CCC.vue'

export default function createApp() {
  const container = document.createElement('div')
  container.id = 'app'
  document.body.appendChild(container)

  Vue.use(Router)

  const router = new Router({
    mode: 'hash',
    routes: [
      {path: '/aaa', component: AAA},
      {path: '/bbb', component: BBB},
      {path: '/ccc', component: CCC},
    ]
  })

  return new Vue({
    el: '#app',
    router,
    render: h => h(App)
  })
}
