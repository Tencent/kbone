import Vue from 'vue'
import Router from 'vue-router'
import App from './App.vue'
import AAA from './AAA.vue'
import BBB from './BBB.vue'

export default function createApp() {
  const container = document.createElement('div')
  container.id = 'app'
  document.body.appendChild(container)

  window.onerror = (message, source, lineno, colno, error) => {
    console.log('window.onerror => ', message, source, lineno, colno, error)
  };
  window.addEventListener('error', evt => console.log('window.addEventListener(\'error\') =>', evt))

  Vue.use(Router)

  const router = new Router({
    mode: 'history', // 是否使用 history api
    routes: [
      { path: '/test/aaa', component: AAA },
      { path: '/test/bbb', component: BBB }
    ]
  })

  return new Vue({
    el: '#app',
    router,
    render: h => h(App)
  })
}