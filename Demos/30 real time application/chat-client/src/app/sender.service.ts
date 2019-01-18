import { Injectable } from '@angular/core';
import {
  HttpClient,
  HttpHeaders
} from '@angular/common/http';
import { Message } from './message.model';
import { Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class SenderService {
  private url = 'http://localhost:3001/api/messages/write/';

  constructor(private http: HttpClient) { }

  sendMesage(message: Message): Observable<any> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this.http.post<Message>(this.url, message, { headers: headers })
      .pipe(
        catchError((err) => {
           console.log(err);
           return of(err);
        })
      );
    // return fetch(this.url,
    //   {
    //     headers: {
    //       'Accept': 'application/json',
    //       'Content-Type': 'application/json'
    //     },
    //     method: "POST",
    //     body: message as any
    //   })
    //   .then((res) => {
    //     if (res) {
    //       console.log(res);
    //       return res;
    //     }
    //   })
    //   .then((data) => of(data))
    //   .catch((err) => {
    //     throw err;
    //   })
  }
}
