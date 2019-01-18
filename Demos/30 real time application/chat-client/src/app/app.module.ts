import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';

import { AppComponent } from './app.component';

import { SocketService } from './socket.service';
import { SenderService } from './sender.service';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule
  ],
  providers: [
    SocketService,
    SenderService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
