import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { TemplatesComponent } from './templates/templates.component';

@NgModule({
  declarations: [
    AppComponent,
    TemplatesComponent
  ],
  imports: [
    BrowserModule.withServerTransition({ appId: 'my-App' })
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
