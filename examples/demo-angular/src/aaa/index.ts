import { Component } from '@angular/core'
import { Router, Event, NavigationEnd } from '@angular/router'
import template from './index.html'
import './index.css'

@Component({
  selector: 'app-aaa',
  template,
})
export class AAAComponent {
  route = ''
  constructor(private router: Router) {
    this.router.events.subscribe((event: Event) => {
      if (event instanceof NavigationEnd) this.route = event.url
    })
  }
}
