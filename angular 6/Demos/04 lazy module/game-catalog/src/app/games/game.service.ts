import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { Observable } from 'rxjs';

import { IGame } from './game.model';

@Injectable()
export class GameService {
  private gamesUrl = 'api/games';

  constructor(private http: HttpClient) { }

  getGames(): Observable<IGame[]> {
    return this.http.get<IGame[]>(this.gamesUrl);
  }

  // private initializeGame(): IGame {
  //   return {
  //     id: 0,
  //     name: '',
  //     code: '',
  //     category: '',
  //     tags: [],
  //     release: '',
  //     price: 0,
  //     description: '',
  //     rating: 0,
  //     imageUrl: ''
  //   }
  // }
}
