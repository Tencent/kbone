import { NgModule } from '@angular/core'
import { BrowserModule } from '@angular/platform-browser'
import { APP_BASE_HREF } from '@angular/common'
import { RouterModule } from '@angular/router'

import { AppComponent } from './app'
import { FooterComponent } from './footer'
import { AAAComponent } from './aaa'
import { BBBComponent } from './bbb'
import { CCCComponent } from './ccc'

@NgModule({
  declarations: [
    AppComponent,
    FooterComponent,
    AAAComponent,
    BBBComponent,
    CCCComponent,
  ],
  imports: [
    BrowserModule,
    RouterModule.forRoot([
      { path: 'aaa', component: AAAComponent },
      { path: 'bbb', component: BBBComponent },
      { path: 'ccc', component: CCCComponent },
    ]),
  ],
  providers: [{ provide: APP_BASE_HREF, useValue: '/' }],
  bootstrap: [AppComponent]
})
export class AppModule { }
