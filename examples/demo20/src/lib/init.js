import { createApp } from 'vue'
import components from '@/components'

const initApp = (view) => {
  const app = createApp(view)
  app.use(components)
  app.mount('#app')
  return app
}

export default (view) => {
  if (process.env.isMiniprogram) {
    return function () {
      const container = document.createElement('div')
      container.id = 'app'
      document.body.appendChild(container)
      const app = initApp(view)
      // 监听wxunload事件，取消app挂载
      window.addEventListener('wxunload', () => app.unmount('#app'))
    }
  } else {
    const app = initApp(view)
    // 监听beforeunload事件，取消app挂载
    window.addEventListener('beforeunload', () => app.unmount('#app'))
  }
}
