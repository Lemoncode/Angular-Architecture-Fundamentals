# APM

This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 1.5.0.

## Development server

Run `ng serve` for a dev server. Navigate to `http://localhost:4200/`. The app will automatically reload if you change any of the source files.

## Code scaffolding

Run `ng generate component component-name` to generate a new component. You can also use `ng generate directive|pipe|service|class|guard|interface|enum|module`.

## Build

Run `ng build` to build the project. The build artifacts will be stored in the `dist/` directory. Use the `-prod` flag for a production build.

## Running unit tests

Run `ng test` to execute the unit tests via [Karma](https://karma-runner.github.io).

## Running end-to-end tests

Run `ng e2e` to execute the end-to-end tests via [Protractor](http://www.protractortest.org/).

## Further help

To get more help on the Angular CLI use `ng help` or go check out the [Angular CLI README](https://github.com/angular/angular-cli/blob/master/README.md).


## In this demo we are going to manage state through the simplest way possible, we are going to use property bag state.

### Step 1. To create the service we are going to use the CLI. 

```bash
$ ng g s games/game-parameter --module=games --spec false 
```
* Do not forget to register the service in games module.

```diff games.module.ts
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { SharedModule } from '../shared/shared.module';

import { GameListComponent } from './game-list/game-list.component';

import { GameService } from './game.service';
import { GameEditComponent } from './game-edit/game-edit.component';
import { GameDetailsComponent } from './game-details/game-details.component';

+import { GameParameterService } from './game-parameter.service';

@NgModule({
  imports: [
    SharedModule,
    RouterModule.forChild([
      { path: '', component: GameListComponent },
      { path: ':id', component: GameDetailsComponent},
      {
        path: ':id/edit',
        // TODO: Implement guard canDeactivate
        component: GameEditComponent
      }
    ]),
  ],
  declarations: [GameListComponent, GameEditComponent, GameDetailsComponent],
  providers: [
    GameService,
+   GameParameterService
  ]
})
export class GamesModule { }

```

### Step 2. Now lets register the properties that we want to track.

```typescript game-parameter.service.ts
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class GameParameterService {
  showImage: boolean;
  filterBy: string;

  constructor() { }
}
```

### Step 3. Use in game-list.component.ts the new created service.

* Inject the service.
* Create get / set for showImage
* Set the filter value -> `onValueChange`

```typescript game-list.component.ts
import { Component, OnInit, ViewChild, AfterViewInit, ElementRef, QueryList, ViewChildren } from '@angular/core';
import { NgModel } from '@angular/forms';

import { IGame } from '../game.model';
import { GameService } from '../game.service';
import { CriteriaComponent } from 'src/app/shared/criteria/criteria.component';
import { GameParameterService } from '../game-parameter.service';

@Component({
  selector: 'app-game-list',
  templateUrl: './game-list.component.html',
  styleUrls: ['./game-list.component.css']
})
// export class GameListComponent implements OnInit, AfterViewInit {
export class GameListComponent implements OnInit, AfterViewInit {
  // showImage: boolean;
  includeDetail: boolean = true;
  imageWidth = 50;
  imageMargin = 2;

  @ViewChild(CriteriaComponent)filterComponent: CriteriaComponent;
  parentListFilter: string;
  filteredGames: IGame[];
  games: IGame[];

  /*diff*/
  get showImage(): boolean {
    return this.gameParameterService.showImage;
  }

  set showImage(value: boolean) {
    this.gameParameterService.showImage = value;
  }
  /*diff*/

  /*diff*/
  constructor(
    private gameService: GameService,
    private gameParameterService: GameParameterService
    ) {}
  /*diff*/

  ngAfterViewInit(): void {
    this.parentListFilter = this.filterComponent.listFilter;
  }

  ngOnInit() {
    this.gameService.getGames().subscribe(
      (games: IGame[]) => {
        this.games = games;
        /*diff*/
        this.filterComponent.listFilter = this.gameParameterService.filterBy;
        // this.performFilter(this.parentListFilter);
        /*diff*/
      }
    );
  }

  onValueChange(value: string): void {
    this.performFilter(value);
    /*diff*/
    this.gameParameterService.filterBy = value;
    /*diff*/
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
* Check if works. Navigate to other components, and watch if state persists.
