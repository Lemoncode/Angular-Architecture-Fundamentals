import { Component, OnInit } from '@angular/core';
import { SocketService, Event } from './socket.service';
import { SenderService } from './sender.service';
import { Message } from './message.model';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  messageToSend: string = null;
  messages: string[];

  constructor(
    private socketService: SocketService,
    private senderService: SenderService
  ) { }

  sendMessage() {
    console.log(this.messageToSend);
    if (this.messageToSend) {
      this.senderService.sendMesage(this.mapper())
        .subscribe();
    }
    this.messageToSend = null;
  }

  private mapper = (): Message => ({
    id: Date.now(),
    body: this.messageToSend,
    name: 'Jai',
    socketId: this.socketService.socketId
  })

  onMessageToSend($event) {
    this.messageToSend = $event.target.value;
  }

  ngOnInit(): void {
    try {
      this.socketService.initSocket();
    } catch (error) {
      console.log(error);
    }

    this.socketService.onEvent(Event.CONNECT)
      .subscribe((r) => console.log(r));

    this.socketService.onMessage()
      .subscribe((data) => console.log(data));

    this.socketService.onMessages()
      .subscribe((data) => console.log(data));
  }
}
