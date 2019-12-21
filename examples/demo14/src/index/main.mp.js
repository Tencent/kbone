import Vue from 'vue'
import Router from 'vue-router'
import I18n from 'vue-i18n'
import App from './App.vue'
import AAA from './AAA.vue'
import BBB from './BBB.vue'

export default function createApp() {
  const container = document.createElement('div')
  container.id = 'app'
  document.body.appendChild(container)

  Vue.use(Router)
  Vue.use(I18n)

  const router = new Router({
    mode: 'history', // 是否使用 history api
    routes: [
      { path: '/test/aaa', component: AAA },
      { path: '/test/bbb', component: BBB }
    ]
  })

  const i18n = new I18n({
    locale: 'zh',
    messages: {
      en: {
        hello: 'hello world'
      },
      zh: {
        hello: '你好世界'
      },
    },
  })

  return new Vue({
    el: '#app',
    router,
    i18n,
    render: h => h(App)
  })
}
