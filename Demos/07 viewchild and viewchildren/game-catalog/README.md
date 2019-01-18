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

## In this demo we are going to work with ViewChild

### Step 1. On game-list.component.html we are going to stablish a reference against the element that we want to handle.

```diff game-list.component.html
-<input type='text'
+<input type='text' #filterElement
  [(ngModel)]='listFilter' />
```

```diff game-list.component.ts
...
imageWidth: number = 50;
imageMargin: number = 2;
errorMessage: string;
+
+@ViewChild('filterElement') filterElementRef; 
+
filteredGames: IGame[];
games: IGame[];
...
```
* This way filterElementRef will contain a reference to the input element so we can access the element's properties or call its methods.

### Step 2. But when is this reference assign to? Let's change constructor and a have a look what is going on there.

```diff game-list.componnet.ts
@ViewChild('filterElement') filterElementRef;

filteredGames: IGame[];
games: IGame[];

constructor(private gameService: GameService) { 
+ console.log(this.filterElementRef);
}
```
* If we open the developer tools we will find out that is undefined.

* It is undefined because component's lifecycle
  1. Component Construction and Initialization -> (constructor() / ngOnInit())
  2. View Initialization and Rendering -> (ngAfterViewInit())

* When the component it is initialized the view is not rendered yet so the reference will be undefined.

### Step 3. Move to ngAfterViewInit life cycle hook

```diff game-list.component.ts
-import { Component, OnInit, ViewChild } from '@angular/core';
+import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { IGame } from '../game.model';
import { GameService } from '../game.service';

@Component({
  selector: 'app-game-list',
  templateUrl: './game-list.component.html',
  styleUrls: ['./game-list.component.css']
})
-export class GameListComponent implements OnInit {
+export class GameListComponent implements OnInit, AfterViewInit {
  showImage: boolean;

  imageWidth = 50;
  imageMargin = 2;

  @ViewChild('filterElement') filterElementRef;

  ...

  constructor(private gameService: GameService) {
-    console.log(this.filterElementRef);
  }

+ ngAfterViewInit(): void {
+   console.log(this.filterElementRef);
+ }

  ngOnInit() {
    this.gameService.getGames().subscribe(
      (games: IGame[]) => {
        this.games = games;
        this.performFilter(this.listFilter);
      }
    );
  }

  ....

}

```
* If we run this now we will find out that the element is not longer undefined.

### Step 4. For last we are going to give focus to the input element.

```diff game-list.component.ts
-import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
+import { Component, OnInit, ViewChild, AfterViewInit, ElementRef } from '@angular/core';
import { IGame } from '../game.model';
import { GameService } from '../game.service';

@Component({
  selector: 'app-game-list',
  templateUrl: './game-list.component.html',
  styleUrls: ['./game-list.component.css']
})
export class GameListComponent implements OnInit, AfterViewInit {
  showImage: boolean;

  imageWidth = 50;
  imageMargin = 2;

- @ViewChild('filterElement') filterElementRef;
+ @ViewChild('filterElement') filterElementRef: ElementRef;

  filteredGames: IGame[];
  games: IGame[];
  ....

  constructor(private gameService: GameService) {}

  ngAfterViewInit(): void {
-   console.log(this.filterElementRef);
+   this.filterElementRef.nativeElement.focus();
  }

....
}

```

### Bear on mind...

*  There are a few considerations we need to keep in mind when working with ViewChild to access a native element. 

* If we use nativeElement, we are directly accessing the DOM, or Document Object Model. The DOM is the set of data structures that manage the HTML elements for display in the browser. 

* This means that we are tightly coupled to the browser and may not be able to use server-side rendering or web workers. One way we can protect our code from this issue is to check for the existence of the native element before accessing its properties or methods using code like this. We first check for the native element and only proceed if the value is not null or undefined. 

* In addition, using nativeElement can pose a security threat, especially when accessing its innerHtml property. It can make an application more vulnerable to cross-site scripting, XSS, attacks. If these considerations are not relevant to your application, then you can freely use ViewChild to access the native element.

### Step 5. Now lets have a look into `ViewChildren` 

```diff game-list.component.html
```diff product-list.component.html
<!-- Filter by the Title   -->
<div class='row'>
    <div class='col-md-2'>Filter by:</div>
    <div class='col-md-4'>
        <input type='text' #filterElement
                [(ngModel)]='listFilter' />
    </div>
+   <div class='col-md-2'>Filter name:</div>
+   <div class='col-md-4'>
+       <input type='text' #nameElement
+               [(ngModel)]='listFilter' />
+       
+   </div>
</div>
```

```diff game-list.component.ts
-import { Component, OnInit, ViewChild, AfterViewInit, ElementRef, QueryList, ViewChildren } from '@angular/core';
+import { NgModel } from '@angular/forms';

import { IGame } from '../game.model';
import { GameService } from '../game.service';

@Component({
  selector: 'app-game-list',
  templateUrl: './game-list.component.html',
  styleUrls: ['./game-list.component.css']
})
export class GameListComponent implements OnInit, AfterViewInit {
  showImage: boolean;

  imageWidth = 50;
  imageMargin = 2;

  @ViewChild('filterElement') filterElementRef: ElementRef;
+ @ViewChildren('filterElement, nameElement')
+ inputElementRefs: QueryList<ElementRef>;

  filteredGames: IGame[];
  games: IGame[];

  private _listFilter: string;

  get listFilter(): string {
    return this._listFilter;
  }

  set listFilter(value: string) {
    this._listFilter = value;
    this.performFilter(this.listFilter);
  }

  constructor(private gameService: GameService) {}

  ngAfterViewInit(): void {
    // console.log(this.filterElementRef);
    this.filterElementRef.nativeElement.focus();
+   console.log(this.inputElementRefs);
  }
...

}

```

* Now we can check out in console what is going on there.

### Step 6. Now lets change it to `NgModel`, that will the same input elements access.

```diff
+import { NgModel } from '@angular/forms';
....
- @ViewChildren('filterElement, nameElement')
+@ViewChildren(NgModel)
inputElementRefs: QueryList<ElementRef>;
```

* Now we can check out in console what is going on there.

### Step 7. We can use ViewChild decorator to get notifications when user makes changes.

```diff game-list.component.html
<div class='row'>
    <div class='col-md-2'>Filter by:</div>
    <div class='col-md-4'>
        <input type='text' #filterElement
                [(ngModel)]='listFilter' />
    </div>
-   <div class='col-md-2'>Filter name:</div>
-   <div class='col-md-4'>
-       <input type='text' #nameElement
-               [(ngModel)]='listFilter' />
-    </div>
</div>
```

```diff game-list.component.ts
import { Component, OnInit, ViewChild, AfterViewInit, ElementRef, QueryList, ViewChildren } from '@angular/core';
import { NgModel } from '@angular/forms';

import { IGame } from '../game.model';
import { GameService } from '../game.service';

@Component({
  selector: 'app-game-list',
  templateUrl: './game-list.component.html',
  styleUrls: ['./game-list.component.css']
})
export class GameListComponent implements OnInit, AfterViewInit {
  showImage: boolean;
+ listFilter: string;
  imageWidth = 50;
  imageMargin = 2;

  @ViewChild('filterElement') filterElementRef: ElementRef;
- @ViewChildren(NgModel)
- inputElementRefs: QueryList<ElementRef>;

  filteredGames: IGame[];
  games: IGame[];

- private _listFilter: string;

- get listFilter(): string {
-   return this._listFilter;
- }

- set listFilter(value: string) {
-   this._listFilter = value;
-   this.performFilter(this.listFilter);
- }

  constructor(private gameService: GameService) {}

  ngAfterViewInit(): void {
    this.filterElementRef.nativeElement.focus();
-   console.log(this.inputElementRefs);
  }

...
}

```

### Step 8. We create @ViewChild with a reference to the `NgModel` directive.

```diff product-list.component.ts
...
@ViewChild('filterElement') filterElementRef: ElementRef;
+@ViewChild(NgModel) filterInput: NgModel;
...
```
* The difference between both, is that in the first case we can access the native element
* The second case we are getting access to the ngModel data structures. We are not accessing the native element.

### Step 9. 

```diff product-list.component.ts
ngAfterViewInit(): void {
  this.filterElementRef.nativeElement.focus();
+ this.filterInput.valueChanges.subscribe(
+   () => this.performFilter(this.listFilter)
+ );
}
```

* Now we can check if the filter is working again.
