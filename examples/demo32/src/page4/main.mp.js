import Vue from 'vue'
import Router from 'vue-router'
import App from './App.vue'
import Layout from './components/Layout.vue'
import Normal from './components/Normal.vue'
import AAA from './components/AAA.vue'
import BBB from './components/BBB.vue'

export default function createApp() {
  const container = document.createElement('div')
  container.id = 'app'
  document.body.appendChild(container)

  Vue.use(Router)

  const router = new Router({
    mode: 'history', // 是否使用 history api
    routes: [{
      path: '/spa',
      component: Layout,
      children: [
        {path: '', component: Normal},
        {path: 'a', component: AAA},
        {path: 'b', component: BBB},
      ]
    }]
  })

  return new Vue({
    el: '#app',
    router,
    render: h => h(App)
  })
}
