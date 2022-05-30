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

## In this demo we are going to work with child components

* Pretty much any piece of a view can be built as a child component


### Step 1. Build a child component 

Let's build a child component so we have something to communicate with.

```bash 
ng g c shared/criteria --module=shared --skip-tests
```

__src/app/shared/shared.module.ts__

```diff
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CriteriaComponent } from './criteria/criteria.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule
  ],
  declarations: [CriteriaComponent],
  exports: [
    CommonModule,
    FormsModule,
+   CriteriaComponent
  ]
})
export class SharedModule { }

```
* This SharedModule then imports CommonModule and FormsModule so that our shared components have access to common Angular directives, such as `ngIf`, and `form directives`, such as _ngModel_ for two-way binding. 

* It declares our shared components, and it exports components and the two imported modules so they are shared with any module that imports this _SharedModule_.

### Step 2. Creating Criteria Template 

Lets creat the criteria template

* Remove from `game-list.component.html` this chunck of code. 

__src/app/games/game-list/game-list.component.html__

```diff
<div class='panel-body'>
-  <!-- Filter by the Title   -->
-  <div class='row'>
-      <div class='col-md-2'>Filter by:</div>
-      <div class='col-md-4'>
-          <input type='text' #filterElement
-                  [(ngModel)]='listFilter' />
-      </div>
-  </div>
-  <div class='row' [hidden]='!listFilter'>
-      <div class='col-md-10'>
-          <h3>Filtered by: {{listFilter}} </h3>
-      </div>
-  </div>
```

* And place it in `criteria.component.html`

__src/app/shared/criteria/criteria.component.html__

```html
<div class='row'>
    <div class='col-md-2'>Filter by:</div>
    <div class='col-md-4'>
        <input type='text' #filterElement
                [(ngModel)]='listFilter' />
    </div>
</div>
<div class='row' [hidden]='!listFilter'>
    <div class='col-md-10'>
        <h3>Filtered by: {{listFilter}} </h3>
    </div>
</div>

```
* Modify `criteria.component.ts`. If we still want to set focus to that element, we can cut the ViewChild property from the _GameListComponent_ and paste it into the _CriteriaComponent_.

__src/app/games/game-list/game-list.component.ts__

```diff
import { Component, OnInit, ViewChild, AfterViewInit, ElementRef, QueryList, ViewChildren } from '@angular/core';
import { NgModel } from '@angular/forms';

import { GameModel } from '../game.model';
import { GameService } from '../game.service';

@Component({
  selector: 'app-game-list',
  templateUrl: './game-list.component.html',
  styleUrls: ['./game-list.component.css']
})
- export class GameListComponent implements OnInit, AfterViewInit {
+export class GameListComponent implements OnInit {
  showImage: boolean;
- listFilter: string = '';
  imageWidth = 50;
  imageMargin = 2;

- @ViewChild('filterElement') filterElementRef: ElementRef;
- @ViewChild(NgModel) filterInput: NgModel;

  filteredGames: GameModel[];
  games: GameModel[];

  constructor(private gameService: GameService) {}

- ngAfterViewInit(): void {
-   this.filterElementRef.nativeElement.focus();
-   this.filterInput.valueChanges.subscribe(
-     () => {
-       console.log(this.listFilter);
-       this.performFilter(this.listFilter);
-     }
-   );
- }

  ngOnInit() {
    this.gameService.getGames().subscribe(
      (games: GameModel[]) => {
        this.games = games;
-       this.performFilter(this.listFilter);
+       this.performFilter(); // 1
      }
    );
  }
....

}

```
1. Remove by now then we will handle it, init to empty string by default to avoid typing issues.

__src/app/shared/criteria/criteria.component.ts__

```typescript
import { Component, OnInit, AfterViewInit, ViewChild, ElementRef } from '@angular/core';

@Component({
  selector: 'app-criteria',
  templateUrl: './criteria.component.html',
  styleUrls: ['./criteria.component.css']
})
export class CriteriaComponent implements OnInit, AfterViewInit {
  listFilter: string;
  @ViewChild('filterElement') filterElementRef!: ElementRef;

  constructor() { }

  ngAfterViewInit(): void {
    if (this.filterElementRef) {
      this.filterElementRef.nativeElement.focus();
    }
  }

  ngOnInit() {
  }

}

```
* Let's check it out in the browser. Click on Product List, and open the console. It is good to see that there are no errors, but it also has no Filter by input element.

### Step 3. Adding the child component 

We need to nest our new CriteriaComponent into our ProductList parent component to get back that functionality.

__src/app/games/game-list/game-list.component.html__

```diff 
<div class='panel-body'>
        <!-- Filter by the Title   -->
+   <div class="row">
+     <app-criteria class="col-md-10"></app-criteria>
+   </div>
```

* Now our criteria filter is encapsulated, we have to stablish a new communication between parent and child component.

### Step 4. Feeding child component 

Lets start by passing data to a child component. Lets manage display the criteria filter using a flag from parent.

__src/app/shared/criteria/criteria.component.ts__

```diff criteria.component.ts
import {
  Component,
  OnInit,
  ViewChild,
  ElementRef,
  AfterViewInit,
+ Input
} from '@angular/core';

@Component({
  selector: 'app-criteria',
  templateUrl: './criteria.component.html',
  styleUrls: ['./criteria.component.css']
})
export class CriteriaComponent implements OnInit, AfterViewInit {
  listFilter: string;
  @ViewChild('filterElement') filterElementRef: ElementRef;
+ @Input() displayDetail!: boolean;

  constructor() { }
...

}

```
__src/app/shared/criteria/criteria.component.html__

```diff criteria.component.html
<div class='row'>
  <div class='col-md-2'>Filter by:</div>
  <div class='col-md-4'>
      <input type='text' #filterElement
             [(ngModel)]='listFilter' />
  </div>
</div>
-<div class='row' [hidden]='!listFilter'>
+<div class='row' *ngIf='displayDetail'>
  <div class='col-md-10'>
      <h3>Filtered by: {{listFilter}} </h3>
  </div>
</div>

```
* Now in the parent component we are going to add a property that manages this flag.

__src/app/games/game-list/game-list.component.ts__

```diff
+includeDetail = true;
```

__src/app/games/game-list/game-list.component.html__

```diff
<div class="row">
- <app-criteria class="col-md-10"></app-criteria>
+ <app-criteria [displayDetail]="includeDetail" class="col-md-10"></app-criteria>
</div>
```

### Step 5. Displaying filtered length 

We want to display the number of hits. So what we can do:

__src/app/shared/criteria/criteria.component.ts__

```diff
+@Input() hitCount!: number;
```

__src/app/shared/criteria/criteria.component.html__

```diff
<div class='row' *ngIf='displayDetail'>
  <div class='col-md-10'>
      <h3>
        Filtered by: {{listFilter}}
+       Hits: {{hitCount}}
      </h3>
  </div>
</div>
```

* Now we have to modify our parent template compenent

__src/app/games/game-list/game-list.component.html__

```diff
<div class="row">
- <app-criteria [displayDetail]="includeDetail" class="col-md-10"></app-criteria>
+ <app-criteria [displayDetail]="includeDetail" [hitCount]="filteredGames?.length!" class="col-md-10"></app-criteria>
</div>
```

### Step 6. Giving Feedback to User on Filtering Length 

We want to display a message depending on hit numbers. We can be notifyed be changes using get/set. But there is another technique that we can use `onChanges`

* Here in the _CriteriaComponent_, our goal is to monitor the _hitCount_ property and to display a different message if the value provided by the parent component is 0.

__src/app/shared/criteria/criteria.component.ts__

```typescript
import {
  Component,
  OnInit,
  ViewChild,
  ElementRef,
  AfterViewInit,
  Input,
  OnChanges, /*diff*/
  SimpleChanges /*diff*/
} from '@angular/core';

@Component({
  selector: 'app-criteria',
  templateUrl: './criteria.component.html',
  styleUrls: ['./criteria.component.css']
})
export class CriteriaComponent implements OnInit, AfterViewInit, OnChanges { /*diff*/
  listFilter: string;
  @ViewChild('filterElement') filterElementRef: ElementRef;
  @Input() displayDetail: boolean;
  @Input() hitCount: number;
  hitMessage: string;

  constructor() { }

  ngAfterViewInit(): void {
    if (this.filterElementRef) {
      this.filterElementRef.nativeElement.focus();
    }
  }

  /*diff*/
  ngOnChanges(changes: SimpleChanges):void {
    if (changes['hitCount'] && !changes['hitCount'].currentValue) {
      this.hitMessage = 'No matches found';
    } else {
      this.hitMessage = `Hits: ${this.hitCount}`;
    }
  }
  /*diff*/

  ngOnInit() {
  }

}

```

__src/app/shared/criteria/criteria.component.html__

```diff criteria.component.html
<div class='row' *ngIf='displayDetail'>
  <div class='col-md-10'>
      <h3>
        Filtered by: {{listFilter}}
-       Hits: {{hitCount}}
+       {{hitMessage}}
      </h3>
  </div>
</div>
```

### Step 7. Where is the filtering value? 

To filter our list of games, the GameListComponent needs the Filter by value, but only the child component has the user-entered value from the Filter by box.

* The parent _GameListComponent_ needs to get that value from the child component.

__src/app/games/game-list/game-list.component.html__

```diff game-list.component.html
<div class="row">
-  <app-criteria [displayDetail]="includeDetail" [hitCount]="filteredProducts?.length" class="col-md-10"></app-criteria>
+  <app-criteria #filterCriteria [displayDetail]="includeDetail" [hitCount]="filteredGames?.length!" class="col-md-10"></app-criteria>
</div>
+{{ filterCriteria.listFilter }}
```
* What will happen with this line of code: `{{ filterCriteria.listFilter }}`? It will work? Yeah, because we have access to methods and properties of child component. 

### Step 8. Using Child Component Reference 

Now we are going to use this reference in the parent component class.

* We have two options, use the template reference variable, or just use the type of child component.
* Remind that the ViewChild reference it's not available after the view initialization.

__src/app/games/game-list/game-list.component.ts__

```typescript
import { Component, OnInit, ViewChild, AfterViewInit, ElementRef, QueryList, ViewChildren } from '@angular/core';
import { NgModel } from '@angular/forms';

import { GameModel } from '../game.model';
import { GameService } from '../game.service';
import { CriteriaComponent } from 'src/app/shared/criteria/criteria.component';

@Component({
  selector: 'app-game-list',
  templateUrl: './game-list.component.html',
  styleUrls: ['./game-list.component.css']
})
// export class GameListComponent implements OnInit, AfterViewInit {
export class GameListComponent implements OnInit, AfterViewInit {
  showImage: boolean;
  includeDetail: boolean = true;
  imageWidth = 50;
  imageMargin = 2;
  /*diff*/
  @ViewChild(CriteriaComponent)filterComponent!: CriteriaComponent;
  parentListFilter = '';
  /*diff*/
  filteredGames: GameModel[];
  games: GameModel[];

  constructor(private gameService: GameService) {}
  /*diff*/
  ngAfterViewInit(): void {
    this.parentListFilter = this.filterComponent.listFilter;
  }
  /*diff*/
  ngOnInit() {
    this.gameService.getGames().subscribe(
      (games: GameModel[]) => {
        this.games = games;
        /*diff*/
        this.performFilter(this.parentListFilter);
        /*diff*/
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
          (g: GameModel) =>
          g.name.toLocaleLowerCase()
            .indexOf(filterBy.toLocaleLowerCase()) !== -1
        );
    } else {
      this.filteredGames = this.games;
    }
  }

}

```
### Step 9. Notifying Parent 

We need a way that the child notifies the parent that a change has ocurred. We are going to use @Output to achieve this.

__src/app/games/game-list/game-list.component.html__

```diff
<div class="row">
  <app-criteria #filterCriteria
    [displayDetail]="includeDetail"
    [hitCount]="filteredGames?.length"
    class="col-md-10">
  </app-criteria>
</div>
-{{filterCriteria.listFilter}}
```

### Step 10. Update Child Component  

Lets modify criteria component so it can emit events.

__src\app\shared\criteria\criteria.component.ts__

```diff criteria.component.ts
import {
  Component,
  OnInit,
  ViewChild,
  ElementRef,
  AfterViewInit,
  Input,
  OnChanges,
  SimpleChanges,
+ EventEmitter,
+ Output
} from '@angular/core';

@Component({
  selector: 'pm-criteria',
  templateUrl: './criteria.component.html',
  styleUrls: ['./criteria.component.css']
})
export class CriteriaComponent implements OnInit, AfterViewInit, OnChanges {
- listFilter: string;
  @ViewChild('filterElement') filterElementRef: ElementRef;
  @Input() displayDetail: boolean;
  @Input() hitCount: number;
  hitMessage: string;
+ @Output() valueChange: EventEmitter<string> = new EventEmitter<string>();

  constructor() { }

....
}

```

### Step 11.  Get Child Template Notification

We want to be notifyed whenever the listFilter value changes. We have different techniques to achieve this, but in this case we are going to use `get / set`.

__src/app/shared/criteria/criteria.component.ts__

```diff criteria.component.ts
@Output() valueChange: EventEmitter<string> = new EventEmitter<string>();
+
+  private _listFilter!: string;
+  get listFilter(): string {
+    return this._listFilter;
+  }
+
+  set listFilter(value: string) {
+    this._listFilter = value;
+    this.valueChange.emit(value);
+  }
```

### Step 12. React on Parent

Now we have to respond to these changes on parent component.

__src/app/games/game-list/game-list.component.html__

```diff
<div class="row">
  <app-criteria
  #filterCriteria
  [displayDetail]="includeDetail"
  [hitCount]="filteredProducts?.length"
+ (valueChange)="onValueChange($event)"
  class="col-md-10">
</app-criteria>
</div>
``` 

__src/app/games/game-list/game-list.component.ts__

```diff game-list.component.ts
ngOnInit() {
    this.gameService.getGames().subscribe(
      (games: GameModel[]) => {
        this.games = games;
        /*diff*/
        this.performFilter(this.parentListFilter);
        /*diff*/
      }
    );
  }

+  onValueChange(value: string): void {
+    this.performFilter(value);
+  }

  toggleImage(): void {
    this.showImage = !this.showImage;
  }
```

* Check on browser if it works.
