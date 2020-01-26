import { Injectable, Inject } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { tap } from 'rxjs/operators';
import { GameModel } from './game.model';
import { HTTP_DATA_LOGGER } from '../core/http-data-logger.service';

@Injectable()
export class GameService {
  private gamesUrl = 'api/games';

  constructor(
    private http: HttpClient,
    @Inject(HTTP_DATA_LOGGER) private logger
  ) { }

  getGames(): Observable<GameModel[]> {
    return this.http.get<GameModel[]>(this.gamesUrl)
      .pipe(
        tap(this.logger.logJSON)
      );
  }

  getGame(id: number): Observable<GameModel> {
    if(id === 0) {
      return of(this.initializeGame());
    }
    const url = `${this.gamesUrl}/${id}`;
    return this.http.get<GameModel>(url)
      .pipe(
        tap(this.logger.logJSON)
      );
  }

  saveGame(game: GameModel): Observable<GameModel> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    if (game.id === 0) {
      return this.createGame(game, headers);
    }
    return this.updateGame(game, headers);
  }

  deleteGame(id: number): Observable<GameModel> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    const url = `${this.gamesUrl}/${id}`;
    return this.http.delete<GameModel>(url, { headers: headers })
      .pipe(
        tap(this.logger.logJSON)
      );
  }

  private createGame(game: GameModel, headers: HttpHeaders): Observable<GameModel> {
    game.id = null; //NOTE: Due to angular-in-memory-web-api
    return this.http.post<GameModel>(this.gamesUrl, game, { headers: headers })
      .pipe(
        tap(this.logger.logJSON)
      );
  }

  private updateGame(game: GameModel, headers: HttpHeaders): Observable<GameModel> {
    const url = `${this.gamesUrl}/${game.id}`;
    return this.http.put<GameModel>(url, game, { headers: headers })
      .pipe(
        tap(this.logger.logJSON)
      );
  }

  private initializeGame(): GameModel {
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
