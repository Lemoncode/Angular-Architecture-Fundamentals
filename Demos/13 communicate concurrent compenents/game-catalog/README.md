### When we display multiple components in a view we have to keep it state in sync. We can create a bg property service to achieve this but we have a state manager service, so lets use it. 

### Step 1. Lets modify game.service.ts to make this possible.

```diff game.service.ts
import { Injectable, Inject } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import { Observable, of } from 'rxjs';
import { tap, map, catchError } from 'rxjs/operators'

import { IGame } from './game.model';
import { HTTP_DATA_LOGGER } from '../core/http-data-logger.service';
import { HTTP_ERROR_HANDLER } from '../core/http-error-handler.service';

@Injectable()
export class GameService {
  private gamesUrl = 'api/games';
  private games: IGame[];
+ currentGame: IGame | null;

  ...

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
+           this.currentGame = null;
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

```diff game-summary-list.component.html
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
  ...
+
+ onSelected(game: IGame): void {
+   this.gameService.currentGame = game;
+ }
+
}

```
### Step 3. Now we have to bound `game-summary-detail.component.ts`

```diff game-summary-detail.component
import { Component, OnInit } from '@angular/core';
import { IGame } from '../game.model';
import { GameService } from '../game.service';

@Component({
  selector: 'app-game-summary-detail',
  templateUrl: './game-summary-detail.component.html',
  styles: []
})
export class GameSummaryDetailComponent implements OnInit {
+ game = this.gameService.currentGame;
  constructor(private gameService: GameService) { }

  ngOnInit() {
  }

}

```

* This will work? No because it's just executed when the component is initialized.
* We can use instead a getter, this way the Angular's change detection will get the latest value from the service every time it's

### Step 4. We can obtain the change detection using a getter.

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
- game = this.gameService.currentGame;
+ get game(): IGame {
+    return this.gameService.currentGame;
+ }
  constructor(private gameService: GameService) { }

  ngOnInit() {
  }

}

```
* When the user selects a different product from the list of products, the list component sets the currentProduct property in the service to the selected product. 

* Angular's change detection picks up that the value was changed and reevaluates the binding. The bindings call the getter, which returns the modified currentProduct from the service, and the newly selected product's details are displayed. 

* All of this works because the property is bound, and change detection provides the change notifications. What if it wasn't bound? Is there a way to still get change notifications? 


 ### Step 5. One technique we can use is a timer. We can set a repeating timer, and every time the interval elapses, we can check for a new value. We'll use the timer from RxJS, which emits items periodically at a specified interval. 

 ```diff game-summary-detail.component.ts
 import { Component, OnInit } from '@angular/core';
import { IGame } from '../game.model';
import { GameService } from '../game.service';
+import { timer } from 'rxjs';

@Component({
  selector: 'app-game-summary-detail',
  templateUrl: './game-summary-detail.component.html',
  styles: []
})
export class GameSummaryDetailComponent implements OnInit {

- get game(): IGame {
+ get g(): IGame {
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

 * The first argument to the timer is the delay. We want to start the timer immediately, so we specify 0. The second argument is the timer interval. We want to check the value every second, so we set it to 1000 ms. 
 
 * This timer is an observable, so we subscribe to start the timer. Every second this code emits an item, and the function defined within the subscribe is executed. In this case, we call the getter to get the latest value of the service property and log it. 
 
 * Using a timer means we are not really reacting to a property change, but rather polling for a change. 
 
 
 * Let's check it out in the browser. This technique can be used when we want a value that is not bind. There are better options than this.

 * Remove the changes

```diff game-summary-detail.component.ts
import { Component, OnInit } from '@angular/core';
import { IGame } from '../game.model';
import { GameService } from '../game.service';
- import { timer } from 'rxjs';

@Component({
  selector: 'app-game-summary-detail',
  templateUrl: './game-summary-detail.component.html',
  styles: []
})
export class GameSummaryDetailComponent implements OnInit {

- get g(): IGame {
+ get game(): IGame {
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

* In the prior module, we looked at how to use a service as an intermediary to communicate the selected product from the list component to the detail component. We achieved this communication by defining a property in a service, setting that property when the user selects a product from the list, and defining a getter to get the value from the service. When the user selects a product from the list, the list component sets the currentProduct property in the service. When the detail component needs that value, it pulls it from the service. If the user selects a different product, the list component changes the property value in the service, but the component is not aware of that change until it pulls that value. Luckily for us, if the getter property is bound in the template, change detection re-evaluates the binding and calls the getter, which re-gets the value appropriately, but that is only true if the value is bound. 

* Instead of waiting for a component to ask for new state, especially if the value is not bound, the service can broadcast a notification. This basically pushes the change to any component subscribing to those notifications. 

* Let's walk through how a notification would work. Here we have our list of products. 

* The user performs an action, such as clicking a button to select an item. The template uses event binding to catch that event and calls a method in the component. 

```html
<button type="button"
  *ngFor="let product of products"
  (click)="onSelected(product)">
</button>
```
```typescript
onSelected(product: IProduct) {
  this.productService.changeSelectedProduct(product);
}
```

* Instead of setting a service property as we did in the prior module, the component calls a method in the service notifying it of the change. The service then broadcasts a notification. 

```typescript Service
changeSelectedProduct(selectedProduct: IProduct) {
  // Broadcast the notification
}
```

* Any component or service can listen for that notification and respond accordingly.
```typescript Component or Service
// Listen for and respond to the notification
```
*  So, how does the service broadcast this notification? The first technique that may come to mind is to use an EventEmitter because we basically want to emit an event. Earlier in this course, we used an EventEmitter with an Output decorator in a child component so it could send notifications to its parent. In this example, we send out a notification every time the user changes the Filter by value. But the Output decorator technique shown here only allows communication between a child and its parent.

```typescript Child Component
export class CriteriaComponent {
  @Output() valueChange: EventEmitter<string> = new EventEmitter<string>();

  private _listFilter: string;
  get listFilter(): string {
    return this._listFilter
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
(valueChange)="onValueChange($event)"></pm-criteria>
```

* We could set up something similar that doesn't use the Output decorator, but best practices discourage use of the EventEmitter except with an output property, as shown here. And it's recommended that no code subscribe to an EventEmitter, meaning there is no way to get event notifications except through event binding in a template. 

* So, using an EventEmitter to broadcast notifications from our service is not a recommended option. A better choice for service notifications is to use a subject or a variant of a subject, such as BehaviorSubject. 

