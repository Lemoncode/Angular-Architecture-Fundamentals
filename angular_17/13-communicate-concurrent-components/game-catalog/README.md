## Communicating concurrent components

When we display multiple components in a view we have to keep state on sync. We can create a bg property service to achieve this but we have a state manager service, so lets use it.

### Step 1. Lets modify game.service.ts to make this possible.

**src/app/games/game.service.ts**

```diff
import { Injectable, Inject } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import { Observable, of } from 'rxjs';
import { tap, map, catchError } from 'rxjs/operators'

import { GameModel } from './game.model';
import { HTTP_DATA_LOGGER } from '../core/http-data-logger.service';
import { HTTP_ERROR_HANDLER } from '../core/http-error-handler.service';

@Injectable()
export class GameService {
  private gamesUrl = 'api/games';
  private games: GameModel[];
+ currentGame!: GameModel | null;

  ...

  deleteGame(id: number): Observable<GameModel> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    const url = `${this.gamesUrl}/${id}`;
    return this.http.delete<GameModel>(url, { headers: headers })
      .pipe(
        tap(this.logger.logJSON),
        tap(data => {
          const foundIndex = this.games.findIndex(item => item.id === id);
          if (foundIndex > -1) {
            this.games.splice(foundIndex, 1);
+           this.currentGame = null;
          }
        }),
        catchError(this.errorHandler)
      );
  }

  private createGame(game: GameModel, headers: HttpHeaders): Observable<GameModel> {
    game.id = null; //NOTE: Due to angular-in-memory-web-api
    return this.http.post<GameModel>(this.gamesUrl, game, { headers: headers })
      .pipe(
        tap(this.logger.logJSON),
-       tap(data => this.games.push(data)),
+       tap(data => {
+         this.games.push(data);
+         this.currentGame = data;
+       }),
        catchError(this.errorHandler)
      );
  }

  ...
}

```

### Step 2. Now we need to set the `currentGame` property when the user clicks on a button in the list view.

**src/app/games/game-summary/game-summary-list.component.html**

```diff
<div class='panel panel-primary' *ngIf='games?.length'>
  <div class='panel-body'>
    <div class='list-group'>
      <button type='button'
              class='list-group-item'
              *ngFor='let game of games'
+             (click)="onSelected(game)">
        {{ game.name }} ({{ game.code }})
      </button>
    </div>
  </div>
</div>

```

**src/app/games/game-summary/game-summary-list.component.ts**

```diff
import { Component, OnInit } from '@angular/core';
import { GameModel } from '../game.model';
import { GameService } from '../game.service';

@Component({
  selector: 'app-game-summary-list',
  templateUrl: './game-summary-list.component.html',
  styles: []
})
export class GameSummaryListComponent implements OnInit {
  ...
+
+ onSelected(game: GameModel): void {
+   this.gameService.currentGame = game;
+ }
+
}

```

### Step 3. Now we have to bound `game-summary-detail.component.ts`

**src/app/games/game-summary/game-summary-detail.component.ts**

```diff
import { Component, OnInit } from '@angular/core';
import { GameModel } from '../game.model';
import { GameService } from '../game.service';

@Component({
  selector: 'app-game-summary-detail',
  templateUrl: './game-summary-detail.component.html',
  styles: []
})
export class GameSummaryDetailComponent implements OnInit {
- game!: GameModel;
+ game = this.gameService.currentGame;
  constructor(private gameService: GameService) { }

  ngOnInit() {
  }

}

```

- This will work? No because it's just executed when the component is initialized.
- We can use instead a getter, this way the Angular's change detection will get the latest value from the service every time it's

### Step 4. We can obtain the change detection using a getter.

```diff game-summary-detail.component.ts
import { Component, OnInit } from '@angular/core';
import { GameModel } from '../game.model';
import { GameService } from '../game.service';

@Component({
  selector: 'app-game-summary-detail',
  templateUrl: './game-summary-detail.component.html',
  styles: []
})
export class GameSummaryDetailComponent implements OnInit {
- game = this.gameService.currentGame;
+ get game(): GameModel | null {
+    return this.gameService.currentGame;
+ }
  constructor(private gameService: GameService) { }

  ngOnInit() {
  }

}

```

- When the user selects a different game from the list of games, the list component sets the currentgame property in the service to the selected game.

- Angular's change detection picks up that the value was changed and reevaluates the binding. The bindings call the getter, which returns the modified currentGame from the service, and the newly selected game's details are displayed.

- All of this works because the property is bound, and change detection provides the change notifications. What if it wasn't bound? Is there a way to still get change notifications?

### Step 5. Changing without bound

One technique we can use is a timer. We can set a repeating timer, and every time the interval elapses, we can check for a new value. We'll use the timer from RxJS, which emits items periodically at a specified interval.

```diff game-summary-detail.component.ts
import { Component, OnInit } from '@angular/core';
import { GameModel } from '../game.model';
import { GameService } from '../game.service';
+import { timer } from 'rxjs';

@Component({
 selector: 'app-game-summary-detail',
 templateUrl: './game-summary-detail.component.html',
 styles: []
})
export class GameSummaryDetailComponent implements OnInit {

- get game(): GameModel {
+ get g(): GameModel {
   return this.gameService.currentGame;
 }

 constructor(private gameService: GameService) { }

 ngOnInit() {
+    timer(0, 1000).subscribe(
+      () => console.log(this.g)
+    );
 }

}

```

- The first argument to the timer is the delay. We want to start the timer immediately, so we specify 0. The second argument is the timer interval. We want to check the value every second, so we set it to 1000 ms.

- This timer is an observable, so we subscribe to start the timer. Every second this code emits an item, and the function defined within the subscribe is executed. In this case, we call the getter to get the latest value of the service property and log it.

- Using a timer means we are not really reacting to a property change, but rather polling for a change.

- Let's check it out in the browser. This technique can be used when we want a value that is not bind. There are better options than this.

- Remove the changes

```diff game-summary-detail.component.ts
import { Component, OnInit } from '@angular/core';
import { GameModel } from '../game.model';
import { GameService } from '../game.service';
- import { timer } from 'rxjs';

@Component({
  selector: 'app-game-summary-detail',
  templateUrl: './game-summary-detail.component.html',
  styles: []
})
export class GameSummaryDetailComponent implements OnInit {

- get g(): GameModel {
+ get game(): GameModel {
    return this.gameService.currentGame;
  }

  constructor(private gameService: GameService) { }

  ngOnInit() {
-    timer(0, 1000).subscribe(
-      () => console.log(this.g)
-    );
  }

}

```

## Service Notification

- In the prior section, we looked at how to use a service as an intermediary to communicate the selected game from the list component to the detail component. We achieved this communication by defining a property in a service, setting that property when the user selects a game from the list, and defining a getter to get the value from the service. When the user selects a game from the list, the list component sets the currentgame property in the service. When the detail component needs that value, it pulls it from the service. If the user selects a different game, the list component changes the property value in the service, but the component is not aware of that change until it pulls that value. Luckily for us, if the getter property is bound in the template, change detection re-evaluates the binding and calls the getter, which re-gets the value appropriately, but that is only true if the value is bound.

- Instead of waiting for a component to ask for new state, especially if the value is not bound, the service can broadcast a notification. This basically pushes the change to any component subscribing to those notifications.

- Let's walk through how a notification would work. Here we have our list of games.

- The user performs an action, such as clicking a button to select an item. The template uses event binding to catch that event and calls a method in the component.

```html
<button
  type="button"
  *ngFor="let game of games"
  (click)="onSelected(game)"
></button>
```

```typescript
onSelected(game: GameModel) {
  this.gameService.changeSelectedGame(game);
}
```

- Instead of setting a service property as we did in the prior sectionn, the component calls a method in the service notifying it of the change. The service then broadcasts a notification.

```typescript Service
changeSelectedGame(selectedgame: GameModel) {
  // Broadcast the notification
}
```

- Any component or service can listen for that notification and respond accordingly.

```typescript Component or Service
// Listen for and respond to the notification
```

- So, how does the service broadcast this notification? The first technique that may come to mind is to use an EventEmitter because we basically want to emit an event. Earlier, we used an EventEmitter with an Output decorator in a child component so it could send notifications to its parent. In this example, we send out a notification every time the user changes the Filter by value. But the Output decorator technique shown here only allows communication between a child and its parent.

```typescript Child Component
export class CriteriaComponent {
  @Output() valueChange: EventEmitter<string> = new EventEmitter<string>();

  private _listFilter: string;
  get listFilter(): string {
    return this._listFilter;
  }

  set listFilter(value: string) {
    this._listFilter = value;
    this.valueChange.emit(value);
  }
}
```

```html
<pm-criteria
  [displayDetail]="includeDetail"
  (valueChange)="onValueChange($event)"
></pm-criteria>
```

- We could set up something similar that doesn't use the Output decorator, but best practices discourage use of the EventEmitter except with an output property, as shown here. And it's recommended that no code subscribe to an EventEmitter, meaning there is no way to get event notifications except through event binding in a template.

- So, using an EventEmitter to broadcast notifications from our service is not a recommended option. A better choice for service notifications is to use a subject or a variant of a subject, such as BehaviorSubject.
