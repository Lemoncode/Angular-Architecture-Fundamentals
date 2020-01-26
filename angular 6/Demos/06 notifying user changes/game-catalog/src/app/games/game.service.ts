import { Injectable, Inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { Observable } from 'rxjs';
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
}
