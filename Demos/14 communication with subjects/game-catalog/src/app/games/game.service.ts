import { Injectable, Inject } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import { Observable, of, BehaviorSubject, Subject } from 'rxjs';
import { tap, map, catchError } from 'rxjs/operators'

import { IGame } from './game.model';
import { HTTP_DATA_LOGGER } from '../core/http-data-logger.service';
import { HTTP_ERROR_HANDLER } from '../core/http-error-handler.service';

@Injectable()
export class GameService {
  private gamesUrl = 'api/games';
  private games: IGame[];
  private selectedGameSource = new BehaviorSubject<IGame | null>(null);
  // private selectedGameSource = new Subject<IGame | null>();
  selectedGameChange$ = this.selectedGameSource.asObservable();

  constructor(
    private http: HttpClient,
    @Inject(HTTP_DATA_LOGGER) private logger,
    @Inject(HTTP_ERROR_HANDLER) private errorHandler
  ) { }

  changeSelectedGame(selectedGame: IGame | null) : void {
    this.selectedGameSource.next(selectedGame);
   }

  getGames(): Observable<IGame[]> {
    if (this.games) {
      return of(this.games);
    }
    return this.http.get<IGame[]>(this.gamesUrl)
      .pipe(
        tap(this.logger.logJSON),
        map((data) => {
          this.games = data;
          return data;
        }),
        catchError(this.errorHandler)
      );
  }

  getGame(id: number): Observable<IGame> {
    if (id === 0) {
      return of(this.initializeGame());
    }
    if(this.games) {
      const foundItem = this.games.find(item => item.id === id);
      if (foundItem) {
        return of(foundItem);
      }
    }
    const url = `${this.gamesUrl}/${id}`;
    return this.http.get<IGame>(url)
      .pipe(
        tap(this.logger.logJSON),
        catchError(this.errorHandler)
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
        tap(this.logger.logJSON),
        tap(data => {
          const foundIndex = this.games.findIndex(item => item.id === id);
          if (foundIndex > -1) {
            this.games.splice(foundIndex, 1);
            this.changeSelectedGame(null);
          }
        }),
        catchError(this.errorHandler)
      );
  }

  private createGame(game: IGame, headers: HttpHeaders): Observable<IGame> {
    game.id = null; //NOTE: Due to angular-in-memory-web-api
    return this.http.post<IGame>(this.gamesUrl, game, { headers: headers })
      .pipe(
        tap(this.logger.logJSON),
        // tap(data => this.games.push(data)),
        tap(data => {
          this.games.push(data);
          // this.currentGame = data;
          this.changeSelectedGame(data);
        }),
        catchError(this.errorHandler)
      );
  }

  private updateGame(game: IGame, headers: HttpHeaders): Observable<IGame> {
    const url = `${this.gamesUrl}/${game.id}`;
    return this.http.put<IGame>(url, game, { headers: headers })
      .pipe(
        tap(this.logger.logJSON),
        catchError(this.errorHandler)
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
