import { Component } from '@angular/core'
import template from './index.html'
import './index.css'

@Component({
  selector: 'app-root',
  template,
})
export class AppComponent {
  title = 'demo34'
  back(): void {
    window.history.back()
  }
}
