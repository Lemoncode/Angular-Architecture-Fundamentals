## Subject

* A key purpose of a subject is to send out notifications. We can use a subject anywhere in our applications, but often encapsulate them in a service. 

* But what is a subject? A subject is a special type of observable that can multicast a value or event to multiple subscribers. Any component or service that subscribes to the subject's observable will receive notifications.
* A subject is also an observer. An observer allows us to push new data into an observable sequence. 

* Any component or other service can feed new values into the subject using its next method. The new value is then multicast to all subscribers. This sounds like just what we need if we want to use a service as an intermediary to pass notifications between our components. 

* But let's step back a moment and remember that our application works perfectly fine without a subject. Since the detail template is binding to the currentgame property, Angular's change detection handles change notifications for us. Then why modify our code to use a subject? There may be situations where you can't use binding and you need explicit notifications from a service.

### Step 1. Move to game.service.ts and add a subject.

```diff game.service.ts
import { Injectable, Inject } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

-import { Observable, of } from 'rxjs';
+import { Observable, of, Subject } from 'rxjs';
import { tap, map, catchError } from 'rxjs/operators'

import { IGame } from './game.model';
import { HTTP_DATA_LOGGER } from '../core/http-data-logger.service';
import { HTTP_ERROR_HANDLER } from '../core/http-error-handler.service';

@Injectable()
export class GameService {
  private gamesUrl = 'api/games';
  private games: IGame[];
- currentGame: IGame | null;
+ private selectedGameSource = new Subject<IGame | null>();
+ selectedGameChange$ = this.selectedGameSource.asObservable();

  

  constructor(
    private http: HttpClient,
    @Inject(HTTP_DATA_LOGGER) private logger,
    @Inject(HTTP_ERROR_HANDLER) private errorHandler
  ) { }
+
+ changeSelectedGame(selectedGame: IGame | null) : void {
+  this.selectedGameSource.next(selectedGame);
+ }

....
```

### Step 2. We have some errors so lets fix them

```diff game.service.ts
....

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
-           this.currentGame = null;
+           this.changeSelectedGame(null);
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
-         this.currentGame = data;
+         this.changeSelectedGame(data);
        }),
        catchError(this.errorHandler)
      );
  }

```

### Step 3. Now in our `game-summary-list.component.ts` we can use the new service to expose when a game is selected.

```diff game-summary-list.component.ts
onSelected(game: IGame): void {
- this.gameService.currentGame = game;
+ this.gameService.changeSelectedGame(game);
}
```

### Step 4. Now `game-summary-detail.component.ts` can subscribe to receive the changes on the selected game.

```diff game-summary-detail.component.ts
import { Component, OnInit } from '@angular/core';
import { IGame } from '../game.model';
import { GameService } from '../game.service';

@Component({
  selector: 'app-game-summary-detail',
  templateUrl: './game-summary-detail.component.html',
  styles: []
})
export class GameSummaryDetailComponent implements OnInit {

- get game(): IGame {
-   return this.gameService.currentGame;
- }
+ game: IGame | null;

  constructor(private gameService: GameService) { }

  ngOnInit() {
+   this.gameService.selectedGameChange$
+     .subscribe((selectedGame) => this.game = selectedGame);
  }

}

```

### Step 5. Now it's time to add another subscription, in this case on `game-summary.component.ts`. It has a varaible that shows how many months a game has been on market currently it's not bound  to anything. Lets fix that with a subscription.

> Have a look into:  https://blog.rangle.io/rxjs-where-is-the-if-else-operator/

```typescript game-summary.component.ts
import { Component, OnInit } from '@angular/core';
import { map } from 'rxjs/operators';
import { GameService } from '../game.service';

@Component({
  selector: 'app-game-summary',
  templateUrl: './game-summary.component.html',
  styles: []
})
export class GameSummaryComponent implements OnInit {
  monthCount: number;
  constructor(private gameService: GameService) { }
  dateRangeToMonths = (start: Date, end: Date = new Date()) => (
    end.getMonth() - start.getMonth() +
    (12 * (end.getFullYear() - start.getFullYear()))
  );

  ngOnInit() {
    this.gameService.selectedGameChange$
      .pipe(
        map((selectedGame) => {
          const { release } = selectedGame;
          if (release) {
            return this.dateRangeToMonths(new Date(release));
          }
          return 0;
        })
      )
      .subscribe((mc) => this.monthCount = mc);
  }

}

```
* If we go on edit and cancel, we loose or selection, what is going on? If we pick another element on list works again.

* The edit page is initialized and displayed. When the user completes or cancels the edit, the edit page is destroyed, and the game shell page again appears, but with no game detail. 

* Throughout this process, our service Subject still retains the last selected game. When the game shell and game shell detail components are initialized, they again subscribe to the selectedGameChanges$ observable. The problem is they don't receive a notification of the last set value, so they won't know about a selected game until the user picks another one. How do we fix that? How about a different kind of subject? We've just gone through the code for using a subject. We used it to provide notifications from our service to any component that subscribes, but what if we need slightly different functionality? Luckily for us, there are several variants of Subject available to us. 

* One such variant is a BehaviorSubject. A BehaviorSubject works like a subject except for two key features. 

* It requires an initial value, and it always provides the current value on any new subscription.

### Step 6. Modify game.service.ts to use BehaviorSubject instead Subject.

```diff game.service.ts
import { Injectable, Inject } from '@angular/core';
...
-import { Observable, of, Subject } from 'rxjs';
+import { Observable, of, BehaviorSubject } from 'rxjs';
....
@Injectable()
export class GameService {
  private gamesUrl = 'api/games';
  private games: IGame[];
- private selectedGameSource = new Subject<IGame | null>();
+ private selectedGameSource = new BehaviorSubject<IGame | null>(null);
  selectedGameChange$ = this.selectedGameSource.asObservable();
....
```
* This little change fix our broken application.

### Step 7. The list is not reflecting the element that is selected, lets fix this as well.

```diff game-summary-list.component.ts
import { Component, OnInit } from '@angular/core';
import { IGame } from '../game.model';
import { GameService } from '../game.service';

@Component({
  selector: 'app-game-summary-list',
  templateUrl: './game-summary-list.component.html',
  styles: []
})
export class GameSummaryListComponent implements OnInit {
  games: IGame[];
+ selectedGame: IGame | null;

  constructor(private gameService: GameService) { }

  ngOnInit() {
    this.gameService.getGames().subscribe(
      (games: IGame[]) => {
        this.games = games;
      }
    );
+
+   this.gameService.selectedGameChange$
+     .subscribe((sg) => this.selectedGame = sg);
  }

  onSelected(game: IGame): void {
    this.gameService.changeSelectedGame(game);
  }

}

```
```diff game-summary-list.component.html
<div class='panel panel-primary' *ngIf='games?.length'>
  <div class='panel-body'>
    <div class='list-group'>
      <button type='button'
              class='list-group-item'
              *ngFor='let game of games'
+             [ngClass]="{'active': game?.id === selectedGame?.id}"
              (click)="onSelected(game)">
        {{ game.name }} ({{ game.code }})
      </button>
    </div>
  </div>
</div>

```
### Step 8. Now it's time to clean up subscriptions.

```diff game-summary-detail.component.ts
-import { Component, OnInit } from '@angular/core';
+import { Component, OnInit, OnDestroy } from '@angular/core';
import { IGame } from '../game.model';
import { GameService } from '../game.service';
+import { Subscription } from 'rxjs';

@Component({
  selector: 'app-game-summary-detail',
  templateUrl: './game-summary-detail.component.html',
  styles: []
})
export class GameSummaryDetailComponent implements OnInit, OnDestroy {
  game: IGame | null;
+ sub: Subscription;

  constructor(private gameService: GameService) { }

  ngOnInit() {
-   this.gameService.selectedGameChange$
-     .subscribe((selectedGame) => this.game = selectedGame);
+   this.sub = this.gameService.selectedGameChange$
+   .subscribe((selectedGame) => this.game = selectedGame);
  }
+
+ ngOnDestroy(): void {
+   this.sub.unsubscribe();
+ }

}

```
