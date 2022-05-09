import { Component } from '@angular/core'
import { Router, Event, NavigationEnd } from '@angular/router'
import template from './index.html'
import './index.css'

@Component({
  selector: 'app-bbb',
  template,
})
export class BBBComponent {
  route = ''
  constructor(private router: Router) {
    this.router.events.subscribe((event: Event) => {
      if (event instanceof NavigationEnd) this.route = event.url
    })
  }
}
