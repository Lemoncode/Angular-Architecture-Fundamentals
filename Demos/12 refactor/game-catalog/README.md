## Now lets make a refactor so we can display a list of games and its detail aside.

### Step 1. Create a new folder `app/games/game-summary`

### Step 2. Create components from shell terminal.

```bash
$ ng g c games/game-summary/game-summary --flat --inline-style --module=games --spec false
```
```bash
$ ng g c games/game-summary/game-summary-list --flat --inline-style --module=games --spec false
```
```bash
$ ng g c games/game-summary/game-summary-detail --flat --inline-style --module=games --spec false
```

### Step 3. Create `game-summary-list` component.

```html
<div class='panel panel-primary' *ngIf='games?.length'>
  <div class='panel-body'>
    <div class='list-group'>
      <button type='button'
              class='list-group-item'
              *ngFor='let game of games'>
        {{ game.name }} ({{ game.code }})
      </button>
    </div>
  </div>
</div>


```

```typescript
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
  selectedGame: IGame | null;

  constructor(private gameService: GameService) { }

  ngOnInit() {
    this.gameService.getGames().subscribe(
      (games: IGame[]) => {
        this.games = games;
      }
    );
  }

}

```

### Step 4. Create `game-summary-detail` component.

```html
<div class='panel panel-primary' *ngIf='game'>
  <div class='panel-heading'>
      Game Detail: {{game.name}}
  </div>

  <div class='panel-body'>
      <div class='row'>
          <div class='col-md-6'>
              <div class='row'>
                  <div class='col-md-3'>Name:</div>
                  <div class='col-md-6'>{{game.name}}</div>
              </div>
              <div class='row'>
                  <div class='col-md-3'>Code:</div>
                  <div class='col-md-6'>{{game.code}}</div>
              </div>
              <div class='row'>
                  <div class='col-md-3'>Description:</div>
                  <div class='col-md-6'>{{game.description}}</div>
              </div>
              <div class='row'>
                  <div class='col-md-3'>Availability:</div>
                  <div class='col-md-6'>{{game.release}}</div>
              </div>
              <div class='row'>
                  <div class='col-md-3'>Price:</div>
                  <div class='col-md-6'>{{game.price|currency:'USD':'symbol'}}</div>
              </div>
              <div class='row'>
                  <div class='col-md-3'>Rating:</div>
                  <div class='col-md-6'>{{game.rating}}</div>
              </div>
          </div>

          <div class='col-md-6'>
              <img *ngIf='game.imageUrl'
                   class='center-block img-responsive'
                   [style.width.px]='200'
                   [style.margin.px]='2'
                   [src]='game.imageUrl'
                   [title]='game.name'>
          </div>
      </div>
  </div>

  <div class='panel-footer'>
      <a class="btn btn-primary" style="width:80px" [routerLink]="['/games', game.id, 'edit']">
          Edit
      </a>
  </div>
</div>

```

```typescript
import { Component, OnInit } from '@angular/core';
import { IGame } from '../game.model';
import { GameService } from '../game.service';

@Component({
  selector: 'app-game-summary-detail',
  templateUrl: './game-summary-detail.component.html',
  styles: []
})
export class GameSummaryDetailComponent implements OnInit {

  constructor(private gameService: GameService) { }

  ngOnInit() {
  }

}

```

### Step 5. Create `game-summary` component.

```html
<div class='row' *ngIf='monthCount'>
    <div class='col-4'>
        <h4>
            Number of months on the market: {{ monthCount }}
        </h4>
    </div>
</div>
<div class='row'>
    <div class='col-4'>
        <app-game-summary-list></app-game-summary-list>
    </div>
    <div class='col-8'>
        <app-game-summary-detail></app-game-summary-detail>
    </div>
</div>
```

```typescript
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-game-summary',
  templateUrl: './game-summary.component.html',
  styles: []
})
export class GameSummaryComponent implements OnInit {
  monthCount: number;
  constructor() { }

  ngOnInit() {
  }

}

```

### Step 6. Create a new route for game summary

```diff games.module.ts
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { SharedModule } from '../shared/shared.module';

import { GameListComponent } from './game-list/game-list.component';

import { GameService } from './game.service';
import { GameEditComponent } from './game-edit/game-edit.component';
import { GameDetailsComponent } from './game-details/game-details.component';

import { GameParameterService } from './game-parameter.service';
import { GameSummaryComponent } from './game-summary/game-summary.component';
import { GameSummaryListComponent } from './game-summary/game-summary-list.component';
import { GameSummaryDetailComponent } from './game-summary/game-summary-detail.component';

@NgModule({
  imports: [
    SharedModule,
    RouterModule.forChild([
      { path: '', component: GameListComponent },
+     { path: 'summary', component: GameSummaryComponent },
      { path: ':id', component: GameDetailsComponent },
      {
        path: ':id/edit',
        // TODO: Implement guard canDeactivate
        component: GameEditComponent
      }
    ]),
  ],
  declarations: [
    GameListComponent,
    GameEditComponent,
    GameDetailsComponent,
    GameSummaryComponent,
    GameSummaryListComponent,
    GameSummaryDetailComponent
  ],
  providers: [
    GameService,
    GameParameterService
  ]
})
export class GamesModule { }

```

### Step 7. Create a new entry in `menu.component.html`

```diff html
<nav class="navbar navbar-expand-sm bg-light navbar-light">
  <ul class="navbar-nav nav-full-width">
    <li routerLinkActive="active">
        <a routerLink='/welcome'>Home</a>
    </li>
    <li routerLinkActive="active" [routerLinkActiveOptions]="{ exact: true }">
        <a routerLink='/games'>Game List</a>
    </li>
+   <li routerLinkActive="active" [routerLinkActiveOptions]="{ exact: true }">
+       <a routerLink='/games/summary'>Game Summary List</a>
+   </li>
    <li routerLinkActive="active" [routerLinkActiveOptions]="{ exact: true }">
        <a [routerLink]="['/games', 0, 'edit']">Add Game</a>
    </li>
  </ul>
  <ul class="navbar-nav nav-end">
      <li *ngIf="isLoggedIn">
          <a routerLink='/login'>Welcome {{ userName }}</a>
      </li>
      <li *ngIf="!isLoggedIn">
          <a routerLink='/login'>Log In</a>
      </li>
      <li *ngIf="isLoggedIn">
          <a (click)="logOut()" style="cursor: pointer">Log Out</a>
      </li>
  </ul>
</nav>

```
