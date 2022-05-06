import { NgModule } from '@angular/core'
import { BrowserModule } from '@angular/platform-browser'
import { APP_BASE_HREF } from '@angular/common'

import { AppRoutingModule } from './app-routing.module'
import { AppComponent } from './app.component'

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule
  ],
  providers: [{ provide: APP_BASE_HREF, useValue: '' }],
  bootstrap: [AppComponent]
})
export class AppModule { }
