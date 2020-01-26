import { Injectable } from '@angular/core';

import * as socketIo from 'socket.io-client';
import { Observable } from 'rxjs';
import { Message } from './message.model';

// Socket.io events
export enum Event {
  CONNECT = 'connect',
  DISCONNECT = 'disconnect'
}

@Injectable({
  providedIn: 'root'
})
export class SocketService {
  private socket;
  private url = 'http://localhost:3001/chat';
  public socketId: string;

  public initSocket(): void {
    this.socket = socketIo(this.url);
  }

  public onEvent(event: Event): Observable<any> {
    return new Observable<Event>(observer => {
      this.socket.on(event, () => {
        this.socketId = this.socket.id;
        observer.next();
      });
    });
  }

  public onMessage(): Observable<Message> {
    return new Observable<Message>(observer => {
      this.socket.on('message', (data: Message) => observer.next(data));
    });
  }

  public onMessages(): Observable<Message[]> {
    return new Observable<Message[]>(observer => {
      this.socket.on('messages', (data: Message[]) => observer.next(data));
    });
  }

}
