# GameCatalog

This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 6.0.8.

## Development server

Run `ng serve` for a dev server. Navigate to `http://localhost:4200/`. The app will automatically reload if you change any of the source files.

## Code scaffolding

Run `ng generate component component-name` to generate a new component. You can also use `ng generate directive|pipe|service|class|guard|interface|enum|module`.

## Build

Run `ng build` to build the project. The build artifacts will be stored in the `dist/` directory. Use the `--prod` flag for a production build.

## Running unit tests

Run `ng test` to execute the unit tests via [Karma](https://karma-runner.github.io).

## Running end-to-end tests

Run `ng e2e` to execute the end-to-end tests via [Protractor](http://www.protractortest.org/).

## Further help

To get more help on the Angular CLI use `ng help` or go check out the [Angular CLI README](https://github.com/angular/angular-cli/blob/master/README.md).

## In this demo we are going to create a lazy module. Lazy modules are loaded on demand, is a great technique to manage the weight of our applications.

* This is a `feature` module, `games`.

### Step 1. The main part by now of this module it's going to be a game list. We are going to implement a full CRUD around games. But before we can start, when we're developing our applications, in many of them we have to consume a backend, there are many options to use a fake data, in this case we are going to use `angular-in-memory-web-api`, it is a great library that allow us create a data base in memory, and use http client module.


```bash 
$ npm i angular-in-memory-web-api -D
```

* Create a game model

__src\app\games\game.model.ts__

```typescript
export interface IGame {
  id: number | null;
  name: string;
  code: string;
  category: string;
  tags?: string[];
  release: string;
  price: number;
  description: string;
  rating: number;
  imageUrl: string;
}

```
* Create mock data `app/games/game-data.ts`

```typescript
import { InMemoryDbService } from 'angular-in-memory-web-api';

import { IGame } from './game.model';

export class GameData implements InMemoryDbService {
  createDb() {
    const games: IGame[] = [
      {
        'id': 234,
        'name': 'Super Mario Bros',
        'code': 'PLA-0',
        'release': '13 September 1985',
        'description': 'Platform game for all family',
        'price': 99.99,
        'category': 'platforms',
        'rating': 4.3,
        'imageUrl': 'https://vignette.wikia.nocookie.net/videojuego/images/e/e2/Super_Mario_Bros..jpg/revision/latest?cb=20080402052328'
      },
      {
        'id': 24,
        'name': 'Legend of Zelda',
        'code': 'QU-0',
        'release': '21 February 1986',
        'description': 'Adventure game for all family',
        'price': 89.79,
        'category': 'quest',
        'rating': 4.7,
        'imageUrl': 'http://omegacenter.es/blog/wp-content/uploads/2015/12/zelda12.png'
      },
      {
        'id': 44,
        'name': 'Sonic',
        'code': 'PLA-1',
        'release': '23 June 1991',
        'description': 'Speed and fun',
        'price': 96.67,
        'category': 'platforms',
        'rating': 4.7,
        'imageUrl': 'https://cdn.arstechnica.net/wp-content/uploads/2018/07/sonicmaniaplus-logo.jpg'
      },
    ];

    return { games };
  }
}

```
* We have to modify `app.module.ts` to initialize `angular-in-memory-web`

```diff app.module.ts
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
+import { HttpClientModule } from '@angular/common/http';

import { AppRoutingModule } from './app-routing.module';

+// Imports for in-memory web-api
+import { HttpClientInMemoryWebApiModule } from 'angular-in-memory-web-api';
+import { GameData } from './games/game-data';

import { AppComponent } from './app.component';
import { MenuComponent } from './home/menu.component';
import { WelcomeComponent } from './home/welcome.component';
import { ShellComponent } from './home/shell.component';
import { PageNotFoundComponent } from './home/page-not-found.component';

/* Feature Modules */
import { UserModule } from './user/user.module';

@NgModule({
  declarations: [
    AppComponent,
    MenuComponent,
    WelcomeComponent,
    ShellComponent,
    PageNotFoundComponent
  ],
  imports: [
    BrowserModule,
+   HttpClientModule,
+   HttpClientInMemoryWebApiModule.forRoot(GameData),
    UserModule,
    AppRoutingModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }

```
### Step 2. Now we are going to create a service to manage our fake data.

* Discuss if this could be inejected in core module.

```bash
$ ng g s games/game --flat --module=games --spec false
```
* Ensure service is registered on module.

```typescript game.module.ts
import { NgModule } from '@angular/core';

import { SharedModule } from '../shared/shared.module';

import { GameListComponent } from './game-list/game-list.component';

import { GameService } from './game.service';

@NgModule({
  imports: [
    SharedModule
  ],
  declarations: [GameListComponent],
  providers: [
    GameService
  ]
})
export class GamesModule { }

```

```typescript app/games/game.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { Observable } from 'rxjs';

import { IGame } from './game.model';

@Injectable()
export class GameService {
  private gamesUrl = 'api/games';

  constructor(private http: HttpClient) { }

  getGames(): Observable<IGame[]> {
    return this.http.get<IGame[]>(this.gamesUrl);
  }
}

```

### Step 3. Now we are going to create game-list component.

```bash
$ ng g c games/game-list --spec false
```

__game-catalog\src\app\games\game-list\game-list.component.html__

```html
<div class='panel panel-primary'>
  <!-- <div class='panel-heading'>
      {{pageTitle}}
  </div> -->

  <div>
      <!-- Filter by the Title   -->
      <div class='row'>
          <div class='col-md-2'>Filter by:</div>
          <div class='col-md-4'>
              <input type='text'
                     [(ngModel)]='listFilter' />
          </div>
      </div>
      <div class='row' [hidden]='!listFilter'>
          <div class='col-md-10'>
              <h3>Filtered by: {{listFilter}} </h3>
          </div>
      </div>

      <div class='table-responsive'>
          <table class='table'
                  *ngIf='games && games.length'>
              <thead>
                  <tr>
                      <th>
                          <button class='btn btn-primary'
                              (click)='toggleImage()'>
                              {{showImage ? 'Hide' : 'Show'}} Image
                          </button>
                      </th>
                      <th>Game</th>
                      <th>Code</th>
                      <th>Available</th>
                      <th>Price</th>
                      <th></th>
                  </tr>
              </thead>
              <tbody>
                  <tr *ngFor='let game of filteredGames'>
                      <td>
                          <img *ngIf='showImage && game.imageUrl'
                               [src]='game.imageUrl'
                               [title]='game.name'
                               [style.width.px]='imageWidth'
                               [style.margin.px]='imageMargin'>
                      </td>
                      <td>{{ game.name }}</td>
                      <td>{{ game.code }}</td>
                      <td>{{ game.release }}</td>
                      <td>{{ game.price | currency:'USD':'symbol':'1.2-2'}}</td>
                  </tr>
              </tbody>
          </table>
      </div>
  </div>
</div>

```

__game-catalog\src\app\games\game-list\game-list.component.ts__
```typescript
import { Component, OnInit } from '@angular/core';
import { IGame } from '../game.model';
import { GameService } from '../game.service';

@Component({
  selector: 'app-game-list',
  templateUrl: './game-list.component.html',
  styleUrls: ['./game-list.component.css']
})
export class GameListComponent implements OnInit {
  listFilter: string;
  showImage: boolean;

  imageWidth = 50;
  imageMargin = 2;

  filteredGames: IGame[];
  games: IGame[];

  constructor(private gameService: GameService) { }

  ngOnInit() {
    this.gameService.getGames().subscribe(
      (games: IGame[]) => {
        this.games = games;
        this.performFilter(this.listFilter);
      }
    );
  }

  toggleImage(): void {
    this.showImage = !this.showImage;
  }

  performFilter(filterBy?: string): void {
    if (filterBy) {
      this.filteredGames = this.games
        .filter(
          (g: IGame) =>
          g.name.toLocaleLowerCase()
            .indexOf(filterBy.toLocaleLowerCase()) !== -1
        );
    } else {
      this.filteredGames = this.games;
    }
  }

}

```
### Step 4. This module it's going to be lazy loaded. To achive this first we are going to define module's routes. Bear in mind that we can do this in a separate route module, just for simplicity, lets use the game module.

```diff game.module.ts
import { NgModule } from '@angular/core';
+import { RouterModule } from '@angular/router';

import { SharedModule } from '../shared/shared.module';

import { GameListComponent } from './game-list/game-list.component';

import { GameService } from './game.service';

@NgModule({
  imports: [
    SharedModule,
+   RouterModule.forChild([
+     { path: '', component: GameListComponent }
+   ]),
  ],
  declarations: [GameListComponent],
  providers: [
    GameService
  ]
})
export class GamesModule { }

```
### Step 5. For last we have to register our module in `app.module`, since this is a lazy loaded module, the way is 'imported', it is a quite different.

```diff app-routing.module.ts
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ShellComponent } from './home/shell.component';
import { WelcomeComponent } from './home/welcome.component';
import { PageNotFoundComponent } from './home/page-not-found.component';

@NgModule({
  imports: [
    RouterModule.forRoot([
      {
        path: '',
        component: ShellComponent,
        children: [
          { path: 'welcome', component: WelcomeComponent },
+          { path: 'games', loadChildren: './games/games.module#GamesModule' },
          { path: '', redirectTo: 'welcome', pathMatch: 'full' },
        ]
      },
      { path: '**', component: PageNotFoundComponent }
    ])
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }

```
* Lets see if works.
