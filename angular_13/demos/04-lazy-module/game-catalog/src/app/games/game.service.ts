import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { GameModel } from './game.model';

@Injectable()
export class GameService {
  private gamesUrl = 'api/games';

  constructor(private http: HttpClient) {}

  getGames(): Observable<GameModel[]> {
    return this.http.get<GameModel[]>(this.gamesUrl);
  }
}
