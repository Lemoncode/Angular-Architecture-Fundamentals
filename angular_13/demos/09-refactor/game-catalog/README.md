## It's time to make a refactor in our app, to fill the gaps in our functionallity. This will help us to demonstrate future concepts.

### Complete game-service

**src/app/games/game.service.ts**

```typescript
import { Injectable, Inject } from "@angular/core";
import { HttpClient, HttpHeaders } from "@angular/common/http";

import { Observable, of } from "rxjs";
import { tap } from "rxjs/operators";

import { GameModel } from "./game.model";
import { HTTP_DATA_LOGGER } from "../core/http-data-logger.service";

@Injectable()
export class GameService {
  private gamesUrl = "api/games";

  constructor(
    private http: HttpClient,
    @Inject(HTTP_DATA_LOGGER) private logger: any
  ) {}

  getGames(): Observable<GameModel[]> {
    return this.http
      .get<GameModel[]>(this.gamesUrl)
      .pipe(tap(this.logger.logJSON));
  }

  getGame(id: number): Observable<GameModel> {
    if (id === 0) {
      return of(this.initializeGame());
    }
    const url = `${this.gamesUrl}/${id}`;
    return this.http.get<GameModel>(url).pipe(tap(this.logger.logJSON));
  }

  saveGame(game: GameModel): Observable<GameModel> {
    const headers = new HttpHeaders({ "Content-Type": "application/json" });
    if (game.id === 0) {
      return this.createGame(game, headers);
    }
    return this.updateGame(game, headers);
  }

  deleteGame(id: number): Observable<GameModel> {
    const headers = new HttpHeaders({ "Content-Type": "application/json" });
    const url = `${this.gamesUrl}/${id}`;
    return this.http
      .delete<GameModel>(url, { headers: headers })
      .pipe(tap(this.logger.logJSON));
  }

  private createGame(
    game: GameModel,
    headers: HttpHeaders
  ): Observable<GameModel> {
    game.id = null; //NOTE: Due to angular-in-memory-web-api
    return this.http
      .post<GameModel>(this.gamesUrl, game, { headers: headers })
      .pipe(tap(this.logger.logJSON));
  }

  private updateGame(
    game: GameModel,
    headers: HttpHeaders
  ): Observable<GameModel> {
    const url = `${this.gamesUrl}/${game.id}`;
    return this.http
      .put<GameModel>(url, game, { headers: headers })
      .pipe(tap(this.logger.logJSON));
  }

  private initializeGame(): GameModel {
    return {
      id: 0,
      name: "",
      code: "",
      category: "",
      tags: [],
      release: "",
      price: 0,
      description: "",
      rating: 0,
      imageUrl: "",
    };
  }
}
```

### Create game-edit component

```bash
ng g c games/game-edit --module=games --skip-tests
```

**src/app/games/game-edit/game-edit.component.html**

```html game-edit.component.html
<div class="container">
  <h3>{{ pageTitle }}</h3>
  <form class="form-horizontal" novalidate (ngSubmit)="saveGame()">
    <fieldset *ngIf="game">
      <div
        class="form-group"
        [ngClass]="{
          'has-error':
            (gameNameVar.touched || gameNameVar.dirty || game.id !== 0) &&
            !gameNameVar.valid
        }"
      >
        <label class="col-md-2 control-label" for="gameNameId">Game Name</label>

        <div class="col-md-8">
          <input
            class="form-control"
            id="gameNameId"
            type="text"
            placeholder="Name (required)"
            required
            minlength="3"
            [(ngModel)]="game.name"
            name="gameName"
            #gameNameVar="ngModel"
          />
          <span
            class="help-block"
            *ngIf="
              (gameNameVar.touched || gameNameVar.dirty || game.id !== 0) &&
              gameNameVar.errors
            "
          >
            <span *ngIf="gameNameVar.errors?.['required']">
              Game name is required.
            </span>
            <span *ngIf="gameNameVar.errors?.['minlength']">
              Game name must be at least three characters.
            </span>
          </span>
        </div>
      </div>

      <div
        class="form-group"
        [ngClass]="{
          'has-error':
            (gameCodeVar.touched || gameCodeVar.dirty || game.id !== 0) &&
            !gameCodeVar.valid
        }"
      >
        <label class="col-md-2 control-label" for="gameCodeId">Game Code</label>

        <div class="col-md-8">
          <input
            class="form-control"
            id="gameCodeId"
            type="text"
            placeholder="Code (required)"
            required
            [(ngModel)]="game.code"
            name="gameCode"
            #gameCodeVar="ngModel"
          />
          <span
            class="help-block"
            *ngIf="
              (gameCodeVar.touched || gameCodeVar.dirty || game.id !== 0) &&
              gameCodeVar.errors
            "
          >
            <span *ngIf="gameCodeVar.errors?.['required']">
              Game code is required.
            </span>
          </span>
        </div>
      </div>

      <div class="form-group">
        <label class="col-md-2 control-label" for="descriptionId"
          >Description</label
        >

        <div class="col-md-8">
          <textarea
            class="form-control"
            id="descriptionId"
            placeholder="Description"
            rows="3"
            [(ngModel)]="game.description"
            name="description"
          >
          </textarea>
        </div>
      </div>

      <div class="has-error" *ngIf="errorMessage">{{ errorMessage }}</div>

      <div class="form-group">
        <div class="col-md-4 col-md-offset-2">
          <span>
            <button
              class="btn btn-primary"
              type="submit"
              style="width: 80px; margin-right: 10px"
              [disabled]="!editForm.valid"
            >
              Save
            </button>
          </span>
          <span>
            <a class="btn btn-default" style="width: 80px" (click)="cancel()">
              Cancel
            </a>
          </span>
          <span>
            <a
              class="btn btn-default"
              style="width: 80px"
              (click)="deleteGame()"
            >
              Delete
            </a>
          </span>
        </div>
      </div>
    </fieldset>
  </form>
</div>
```

**src/app/games/game-edit/game-edit.component.ts**

```typescript
import { Component, OnInit, ViewChild } from "@angular/core";
import { Router, ActivatedRoute } from "@angular/router";
import { NgForm } from "@angular/forms";

import { GameModel } from "../game.model";
import { GameService } from "../game.service";

interface IIndexable {
  [key: string]: any;
}

@Component({
  selector: "app-game-edit",
  templateUrl: "./game-edit.component.html",
  styleUrls: ["./game-edit.component.css"],
})
export class GameEditComponent implements OnInit {
  @ViewChild(NgForm, { static: false }) editForm!: NgForm;
  pageTitle = "Game Edit";
  errorMessage!: string;
  private originalGame!: GameModel;
  game!: GameModel;

  get isDirty(): boolean {
    return this.editForm.dirty ? true : false;
  }

  constructor(
    private gameService: GameService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.route.params.subscribe((params) => {
      const id = +params["id"];
      this.getGame(id);
    });
  }

  // TODO: Declare as private??
  getGame(id: number): void {
    this.gameService
      .getGame(id)
      .subscribe((game) => this.onGameRetrieved(game));
  }

  // TODO: Declare as private??
  onGameRetrieved(game: GameModel): void {
    // Reset back to pristine
    // this.editForm.reset();

    // Display data in form
    // Use copy to allow cancel
    this.originalGame = game;
    this.game = { ...game };

    this.pageTitle =
      this.game.id === 0 ? "Add game" : `Edit game: ${this.game.name}`;
  }

  cancel(): void {
    this.router.navigate(["/games"]);
  }

  deleteGame(): void {
    if (this.game.id) {
      // TODO: Implement guard
      this.gameService
        .deleteGame(this.game.id)
        .subscribe(() => this.onSaveComplete());
    } else {
      this.onSaveComplete();
    }
  }

  saveGame(): void {
    if (this.editForm.valid) {
      this.gameService.saveGame(this.game).subscribe(() => {
        // Assign changes from copy
        Object.keys(this.game).forEach(
          (key) =>
            ((this.originalGame as IIndexable)[key] = (this.game as IIndexable)[
              key
            ])
        );
        this.onSaveComplete();
      });
    } else {
      this.errorMessage = "Please correct the validation errors.";
    }
  }

  onSaveComplete(): void {
    // Reset back to pristine
    this.editForm.reset(this.editForm.value);
    // Navigate back to the product list
    this.router.navigate(["/games"]);
  }
}
```

- Now we have to register the edit route

**src/app/games/games.module.ts**

```diff
@NgModule({
  imports: [
    SharedModule,
    RouterModule.forChild([
      { path: '', component: GameListComponent },
+     {
+       path: ':id/edit',
+       // TODO: Implement guard canDeactivate
+       component: GameEditComponent
      }
    ]),
  ],
  declarations: [GameListComponent, GameEditComponent],
  providers: [
    GameService
  ]
})
export class GamesModule { }
```

- Navigate from game-list to game-edit.

**src/app/games/game-list/game-list.component.html**

```diff
<div class='panel panel-primary'>
  <!-- <div class='panel-heading'>
      {{pageTitle}}
  </div> -->

  <div>
      <div class="row">
        <app-criteria #filterCriteria
         [displayDetail]="includeDetail"
         [hitCount]="filteredGames?.length"
         (valueChange)="onValueChange($event)"
         class="col-md-10">
        </app-criteria>
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
+                     <th>Rating</th>
+                     <th></th>
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
+                     <td>{{ game.rating }}</td>
+                     <td>
+                       <a class="btn" [routerLink]="['/games', game.id, 'edit']">
+                         Edit
+                       </a>
+                     </td>
                  </tr>
              </tbody>
          </table>
      </div>
  </div>
</div>

```

- Check if works

### Create game-details

```bash
ng g c games/game-details --module=games --skip-tests
```

**src/app/games/game-details/game-details.component.html**

```html
<div class="panel panel-primary" *ngIf="game">
  <div class="panel-heading">{{pageTitle + ': ' + game.name}}</div>

  <div class="panel-body">
    <div class="row">
      <div class="col-md-6">
        <div class="row">
          <div class="col-md-3">Name:</div>
          <div class="col-md-6">{{game.name}}</div>
        </div>
        <div class="row">
          <div class="col-md-3">Code:</div>
          <div class="col-md-6">{{game.code | lowercase}}</div>
        </div>
        <div class="row">
          <div class="col-md-3">Description:</div>
          <div class="col-md-6">{{game.description}}</div>
        </div>
        <div class="row">
          <div class="col-md-3">Availability:</div>
          <div class="col-md-6">{{game.release}}</div>
        </div>
        <div class="row">
          <div class="col-md-3">Price:</div>
          <div class="col-md-6">{{game.price|currency:'USD':'symbol'}}</div>
        </div>
        <div class="row">
          <div class="col-md-3">Rating:</div>
          <div class="col-md-6">
            <!-- TODO: Create component for this -->
            {{game.rating}}
          </div>
        </div>
      </div>

      <div class="col-md-6">
        <img
          *ngIf="game.imageUrl"
          class="center-block img-responsive"
          [style.width.px]="200"
          [style.margin.px]="2"
          [src]="game.imageUrl"
          [title]="game.name"
        />
      </div>
    </div>
  </div>

  <div class="panel-footer">
    <a class="btn btn-default" style="width:80px" (click)="onBack()">
      <!-- TODO: Use fontawsome -->
      <i class="glyphicon glyphicon-chevron-left"></i> Back
    </a>
    <a
      class="btn btn-primary"
      style="width:80px"
      [routerLink]="['/games', game.id, 'edit']"
    >
      Edit
    </a>
  </div>
</div>
```

**src/app/games/game-details/game-details.component.ts**

```typescript
import { Component, OnInit } from "@angular/core";
import { Router, ActivatedRoute } from "@angular/router";
import { GameModel } from "../game.model";
import { GameService } from "../game.service";

@Component({
  selector: "app-game-details",
  templateUrl: "./game-details.component.html",
  styleUrls: ["./game-details.component.css"],
})
export class GameDetailsComponent implements OnInit {
  pageTitle = "Game Details";
  game!: GameModel;

  constructor(
    private gameService: GameService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    const param = this.route.snapshot.paramMap.get("id");
    if (param) {
      const id = +param;
      this.getGame(id);
    }
  }

  getGame(id: number): void {
    this.gameService.getGame(id).subscribe((game) => (this.game = game));
  }

  onBack(): void {
    this.router.navigate(["/games"]);
  }
}
```

- We have to create the route on games.module

**src/app/games/games.module.ts**

```diff
@NgModule({
  imports: [
    SharedModule,
    RouterModule.forChild([
      { path: '', component: GameListComponent },
+     { path: ':id', component: GameDetailsComponent},
      {
        path: ':id/edit',
        // TODO: Implement guard canDeactivate
        component: GameEditComponent
      }
    ]),
  ],
  declarations: [GameListComponent, GameEditComponent, GameDetailsComponent],
  providers: [
    GameService
  ]
})
```

- Now we have to navigate from game-list

**src/app/games/game-list/game-list.component.html**

```diff
<td>
    <img *ngIf='showImage && game.imageUrl'
          [src]='game.imageUrl'
          [title]='game.name'
          [style.width.px]='imageWidth'
          [style.margin.px]='imageMargin'>
</td>
<td>
- {{ game.name }}
+ <a [routerLink]="['/games', game.id]">
+   {{ game.name }}
+ </a>
</td>
<td>{{ game.code }}</td>
```

### For last we are going to fix our menu bar.

**src/app/home/menu.component.html**

```html
<nav class="navbar navbar-expand-sm bg-light navbar-light">
  <ul class="navbar-nav nav-full-width">
    <li routerLinkActive="active">
      <a routerLink="/welcome">Home</a>
    </li>
    <li routerLinkActive="active" [routerLinkActiveOptions]="{ exact: true }">
      <a routerLink="/games">Game List</a>
    </li>
    <li routerLinkActive="active" [routerLinkActiveOptions]="{ exact: true }">
      <a [routerLink]="['/games', 0, 'edit']">Add Game</a>
    </li>
  </ul>
  <ul class="navbar-nav nav-end">
    <li *ngIf="isLoggedIn">
      <a routerLink="/login">Welcome {{ userName }}</a>
    </li>
    <li *ngIf="!isLoggedIn">
      <a routerLink="/login">Log In</a>
    </li>
    <li *ngIf="isLoggedIn">
      <a (click)="logOut()" style="cursor: pointer">Log Out</a>
    </li>
  </ul>
</nav>
```

```css menu.component.css
.nav-full-width {
  width: 80%;
}

.nav-end {
  margin-left: auto;
}

.navbar-nav > li {
  margin-right: 1rem;
}
```

**src/app/home/menu.component.ts**

```typescript menu.component.ts
import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { AuthService } from "../user/auth.service";

@Component({
  selector: "app-menu",
  templateUrl: "./menu.component.html",
  styleUrls: ["./menu.component.css"],
})
export class MenuComponent implements OnInit {
  get isLoggedIn(): boolean {
    return this.authService.isLoggedIn();
  }

  get userName(): string {
    if (this.authService.currentUser) {
      return this.authService.currentUser.userName;
    }
    return "";
  }

  constructor(private router: Router, private authService: AuthService) {}

  ngOnInit() {}

  logOut(): void {
    this.authService.logout();
    this.router.navigate(["/welcome"]);
  }
}
```

**src/app/user/login.component.ts**

```diff
...
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  ...

  login(loginForm: NgForm): void {
    if (loginForm && loginForm.valid) {
      const { userName, password} = loginForm.form.value;
      // TODO: Implement as async / await
      this.authService.login(userName, password);

      if (this.authService.redirectUrl) {
        this.router.navigateByUrl(this.authService.redirectUrl);
      } else {
+       this.router.navigate(['/games']);
      }
    }
  }

}

```

- Lets see if works
