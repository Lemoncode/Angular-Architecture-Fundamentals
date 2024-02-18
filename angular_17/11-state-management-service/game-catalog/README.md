# Game Catalog

## In this demo we are going to create a state manager service.

Change `src/app/games/game-edit/game-edit.component.ts` to avoid issues:

```diff
-@ViewChild(NgForm, { static: false }) editForm: NgForm;
+@ViewChild(NgForm, { static: true }) editForm: NgForm;
```

Update `src/app/games/game-list/game-list.component.ts`

```ts
ngAfterViewInit(): void {
  this.filterComponent.listFilter = this.gameParameterService.filterBy;
  this.parentListFilter = this.filterComponent.listFilter;
}

ngOnInit(): void {
  this.gameService.getGames().subscribe((games: GameModel[]) => {
    this.games = games;
    if (this.filterComponent) {
      this.filterComponent.listFilter = this.gameParameterService.filterBy;
    }
  });
}
```

### Step 1. On our http services we are not taking care of handling error. Lets create a new service that will take care of this.

```bash
ng g s core/http-error-handler --skip-tests
```

**src/app/core/http-error-handler.service.ts**

```typescript
import { InjectionToken } from "@angular/core";

export const HTTP_ERROR_HANDLER = new InjectionToken<string>(
  "HttpErrorHandler"
);

export const handleError = (err: any) => {
  let errorMessage: string;
  if (err.error instanceof Error) {
    errorMessage = `An error ocurred: ${err.error.message}`;
  } else {
    errorMessage = `Backend returned code ${err.status}, body was: ${err.error}`;
  }
  throw new Error(errorMessage);
};
```

- Register on `core.module`

```diff core.module.ts
import {
  NgModule
} from '@angular/core';
import { CommonModule } from '@angular/common';

import { HTTP_DATA_LOGGER, logJSON } from './http-data-logger.service';
+import { HTTP_ERROR_HANDLER, handleError } from './http-error-handler.service';

@NgModule({
  imports: [
    CommonModule
  ],
  declarations: [],
  providers: [
    {
      provide: HTTP_DATA_LOGGER,
      useValue: {
        logJSON
      }
    },
+   {
+     provide: HTTP_ERROR_HANDLER,
+     useValue: {
+       handleError
+     }
+   }
  ]
})
export class CoreModule { }

```

### Step 2. Lest change `game.service.ts` to convert into a service that manages state.

**src/app/games/game.service.ts**

```diff game.service.ts
import { Injectable, Inject } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import { Observable, of } from 'rxjs';
-import { tap } from 'rxjs/operators'
+import { tap, map } from 'rxjs/operators'

import { GameModel } from './game.model';
import { HTTP_DATA_LOGGER } from '../core/http-data-logger.service';

@Injectable()
export class GameService {
  private gamesUrl = 'api/games';
+ private games!: GameModel[];

  constructor(
    private http: HttpClient,
    @Inject(HTTP_DATA_LOGGER) private logger
  ) { }

  getGames(): Observable<GameModel[]> {
+   if (this.games) {
+     return of(this.games);
+   }
    return this.http.get<GameModel[]>(this.gamesUrl)
      .pipe(
        tap(this.logger.logJSON),
+       map((data) => {
+         this.games = data;
+         return data;
+        })
      );
  }
...
```

- Lets see if it's working

### Step 3. Now we want to make the same with `getGame`

```diff game.service.ts
getGame(id: number): Observable<GameModel> {
    if (id === 0) {
      return of(this.initializegame());
    }
+   if (this.games) {
+     const foundItem = this.games.find(item => item.id === id);
+     if (foundItem) {
+       return of(foundItem);
+     }
+   }
    const url = `${this.gamesUrl}/${id}`;
    return this.http.get<GameModel>(url)
      .pipe(
        tap(data => console.log('Data: ' + JSON.stringify(data))),
        catchError(this.handleError)
      );
  }
```

### Step 4. For last we want to handle erros so lets go ahead.

```diff game.service.ts
import { Injectable, Inject } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import { Observable, of } from 'rxjs';
-import { tap, map } from 'rxjs/operators'
+import { tap, map, catchError } from 'rxjs/operators'

import { GameModel } from './game.model';
import { HTTP_DATA_LOGGER } from '../core/http-data-logger.service';
+import { HTTP_ERROR_HANDLER } from '../core/http-error-handler.service';

@Injectable()
export class GameService {
  private gamesUrl = 'api/games';
  private games: GameModel[];

  constructor(
    private http: HttpClient,
    @Inject(HTTP_DATA_LOGGER) private logger: any,
+   @Inject(HTTP_ERROR_HANDLER) private errorHandler: any
  ) { }

  getGames(): Observable<GameModel[]> {
    if (this.games) {
      return of(this.games);
    }
    return this.http.get<GameModel[]>(this.gamesUrl)
      .pipe(
        tap(this.logger.logJSON),
        map((data) => {
          this.games = data;
          return data;
        }),
+       catchError(this.errorHandler)
      );
  }

  getGame(id: number): Observable<GameModel> {
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
    return this.http.get<GameModel>(url)
      .pipe(
        tap(this.logger.logJSON),
+       catchError(this.errorHandler)
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
        tap(this.logger.logJSON),
+       catchError(this.errorHandler)
      );
  }

  private createGame(game: GameModel, headers: HttpHeaders): Observable<GameModel> {
    game.id = null; //NOTE: Due to angular-in-memory-web-api
    return this.http.post<GameModel>(this.gamesUrl, game, { headers: headers })
      .pipe(
        tap(this.logger.logJSON),
+       catchError(this.errorHandler)
      );
  }

  private updateGame(game: GameModel, headers: HttpHeaders): Observable<GameModel> {
    const url = `${this.gamesUrl}/${game.id}`;
    return this.http.put<GameModel>(url, game, { headers: headers })
      .pipe(
        tap(this.logger.logJSON),
+       catchError(this.errorHandler)
      );
  }
....
```

- Lets see if works.

- Whenever the user create, delete or update a product, our cache list have to reflect these updates.

- If we edit an element it will work, but if we add a new element not. Why? Because we return the item from our private list of games. We return that item by reference, so when is editing is editing that item in the list. When adding we are returning a new item that is not registered on our private list.

### Step 5.Update private list whenever a new game is added.

```diff game.service.ts
private creategame(game: GameModel, headers: HttpHeaders): Observable<GameModel> {
    game.id = null; // [1]
    return this.http.post<GameModel>(this.gamesUrl, game, { headers: headers })
      .pipe(
        tap(this.logger.logJSON),
+       tap(data => this.games.push(data)),
        catchError(this.handleError)
      );
  }
```

1. This is because or in-memory-web-api

### Step 6. Looking back to our code, we have the same problem with delete.

```diff game.service.ts
deletegame(id: number): Observable<GameModel> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });

    const url = `${this.gamesUrl}/${id}`;
    return this.http.delete<GameModel>(url, { headers: headers })
      .pipe(
        tap(this.logger.logJSON),
+       tap(data => {
+         const foundIndex = this.games.findIndex(item => item.id === id);
+         if (foundIndex > - 1) {
+           this.games.splice(foundIndex, 1);
+         }
+       }),
        catchError(this.handleError),
      );
  }
```
