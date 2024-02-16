# Game Catalog

## Property Bag Pattern

In this demo we are going to manage state through the simplest way possible, we are going to use property bag state.

### Step 1. To create the service we are going to use the CLI.

```bash
ng g s games/game-parameter --skip-tests
```

- Do not forget to register the service in games module.

- Update `games.module.ts`

```diff
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

- Update `game-parameter.service.ts`

```typescript 
import { Injectable } from "@angular/core";

@Injectable()
export class GameParameterService {
  showImage!: boolean;
  filterBy!: string;

  constructor() {}
}
```

### Step 3. Use in game-list.component.ts the new created service.

- Inject the service.
- Create get / set for showImage
- Set the filter value -> `onValueChange`

**src/app/games/game-list/game-list.component.ts**

```typescript game-list.component.ts
import {
  Component,
  OnInit,
  ViewChild,
  AfterViewInit,
  ElementRef,
  QueryList,
  ViewChildren,
} from "@angular/core";
import { NgModel } from "@angular/forms";

import { GameModel } from "../game.model";
import { GameService } from "../game.service";
import { CriteriaComponent } from "src/app/shared/criteria/criteria.component";
import { GameParameterService } from "../game-parameter.service";

@Component({
  selector: "app-game-list",
  templateUrl: "./game-list.component.html",
  styleUrls: ["./game-list.component.css"],
})
// export class GameListComponent implements OnInit, AfterViewInit {
export class GameListComponent implements OnInit, AfterViewInit {
  // showImage: boolean;
  includeDetail: boolean = true;
  imageWidth = 50;
  imageMargin = 2;

  @ViewChild(CriteriaComponent) filterComponent: CriteriaComponent;
  parentListFilter: string;
  filteredGames: GameModel[];
  games: GameModel[];

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
    this.gameService.getGames().subscribe((games: GameModel[]) => {
      this.games = games;
      /*diff*/
      this.filterComponent.listFilter = this.gameParameterService.filterBy;
      // this.performFilter(this.parentListFilter);
      /*diff*/
    });
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
      this.filteredGames = this.games.filter(
        (g: GameModel) =>
          g.name.toLocaleLowerCase().indexOf(filterBy.toLocaleLowerCase()) !==
          -1
      );
    } else {
      this.filteredGames = this.games;
    }
  }
}
```

- Check if works. Navigate to other components, and watch if state persists.