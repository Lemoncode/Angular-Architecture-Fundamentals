import { Injectable, Inject } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import { Observable, of } from 'rxjs';
import { tap } from 'rxjs/operators'

import { IGame } from './game.model';
import { HTTP_DATA_LOGGER } from '../core/http-data-logger.service';

@Injectable()
export class GameService {
  private gamesUrl = 'api/games';

  constructor(
    private http: HttpClient,
    @Inject(HTTP_DATA_LOGGER) private logger
  ) { }

  getGames(): Observable<IGame[]> {
    return this.http.get<IGame[]>(this.gamesUrl)
      .pipe(
        tap(this.logger.logJSON)
      );
  }

  getGame(id: number): Observable<IGame> {
    if (id === 0) {
      return of(this.initializeGame());
    }
    const url = `${this.gamesUrl}/${id}`;
    return this.http.get<IGame>(url)
      .pipe(
        tap(this.logger.logJSON)
      );
  }

  saveGame(game: IGame): Observable<IGame> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    if (game.id === 0) {
      return this.createGame(game, headers);
    }
    return this.updateGame(game, headers);
  }

  deleteGame(id: number): Observable<IGame> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    const url = `${this.gamesUrl}/${id}`;
    return this.http.delete<IGame>(url, { headers: headers })
      .pipe(
        tap(this.logger.logJSON)
      );
  }

  private createGame(game: IGame, headers: HttpHeaders): Observable<IGame> {
    game.id = null; //NOTE: Due to angular-in-memory-web-api
    return this.http.post<IGame>(this.gamesUrl, game, { headers: headers })
      .pipe(
        tap(this.logger.logJSON)
      );
  }

  private updateGame(game: IGame, headers: HttpHeaders): Observable<IGame> {
    const url = `${this.gamesUrl}/${game.id}`;
    return this.http.put<IGame>(url, game, { headers: headers })
      .pipe(
        tap(this.logger.logJSON)
      );
  }

  private initializeGame(): IGame {
    return {
      id: 0,
      name: '',
      code: '',
      category: '',
      tags: [],
      release: '',
      price: 0,
      description: '',
      rating: 0,
      imageUrl: ''
    }
  }
}
