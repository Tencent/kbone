import 'zone.js'
import { enableProdMode } from '@angular/core'
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic'

import { AppModule } from './app.module'

export default function createApp() {
  const container = document.createElement('app-root')
  container.id = 'app'
  document.body.appendChild(container)

  enableProdMode()
  platformBrowserDynamic().bootstrapModule(AppModule)
    .catch(err => console.error(err))
}
