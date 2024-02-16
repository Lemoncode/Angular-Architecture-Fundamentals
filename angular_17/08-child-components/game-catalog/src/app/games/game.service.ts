import { Injectable, Inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

import { GameModel } from './game.model';
import { HTTP_DATA_LOGGER } from '../core/http-data-logger.service';

@Injectable()
export class GameService {
  private gamesUrl = 'api/games';

  constructor(
    private http: HttpClient,
    @Inject(HTTP_DATA_LOGGER) private logger: any
  ) {}

  getGames(): Observable<GameModel[]> {
    return this.http
      .get<GameModel[]>(this.gamesUrl)
      .pipe(tap(this.logger.logJSON));
  }
}
