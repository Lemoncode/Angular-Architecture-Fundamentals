import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable, Inject } from '@angular/core';
import { Observable, of } from 'rxjs';
import { tap, map, catchError } from 'rxjs/operators';
import { GameModel } from './game.model';
import { HTTP_DATA_LOGGER } from '../core/http-data-logger.service';
import { HTTP_ERROR_HANDLER } from '../core/http-error-handler.service';

@Injectable()
export class GameService {
  private gamesUrl = 'api/games';
  private games!: GameModel[];

  constructor(
    private http: HttpClient,
    @Inject(HTTP_DATA_LOGGER) private logger: any,
    @Inject(HTTP_ERROR_HANDLER) private errorHandler: any
  ) {}

  getGames(): Observable<GameModel[]> {
    if (this.games) {
      return of(this.games);
    }
    return this.http.get<GameModel[]>(this.gamesUrl).pipe(
      tap(this.logger.logJSON),
      map((data) => {
        this.games = data;
        return data;
      }),
      catchError(this.errorHandler)
    );
  }

  getGame(id: number): Observable<GameModel> {
    if (id === 0) {
      return of(this.initializeGame());
    }
    if (this.games) {
      const foundIten = this.games.find((i) => i.id === id);
      if (foundIten) {
        return of(foundIten);
      }
    }
    const url = `${this.gamesUrl}/${id}`;
    return this.http
      .get<GameModel>(url)
      .pipe(tap(this.logger.logJSON), catchError(this.errorHandler));
  }

  deleteGame(id: number): Observable<GameModel> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    const url = `${this.gamesUrl}/${id}`;
    return this.http.delete<GameModel>(url, { headers: headers }).pipe(
      tap(this.logger.logJSON),
      tap((data) => {
        const foundIndex = this.games.findIndex(i => i.id === id);
        if (foundIndex > -1) {
          this.games.splice(foundIndex, 1);
        }
      }),
      catchError(this.errorHandler)
    );
  }

  saveGame(game: GameModel): Observable<GameModel> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    if (game.id === 0) {
      return this.createGame(game, headers);
    }
    return this.updateGame(game, headers);
  }

  private createGame(
    game: GameModel,
    headers: HttpHeaders
  ): Observable<GameModel> {
    game.id = null; //NOTE: Due to angular-in-memory-web-api
    return this.http
      .post<GameModel>(this.gamesUrl, game, { headers: headers })
      .pipe(
        tap(this.logger.logJSON),
        tap((data) => this.games.push(data)),
        catchError(this.errorHandler)
      );
  }

  private updateGame(
    game: GameModel,
    headers: HttpHeaders
  ): Observable<GameModel> {
    const url = `${this.gamesUrl}/${game.id}`;
    return this.http
      .put<GameModel>(url, game, { headers: headers })
      .pipe(tap(this.logger.logJSON), catchError(this.errorHandler));
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
      imageUrl: '',
    };
  }
}
