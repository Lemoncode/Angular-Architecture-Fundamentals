# GameCatalog

## In this demo we are going to work with ViewChild

### Step 1. Template Variable

On `game-list.component.html` we are going to stablish a reference against the element that we want to handle.

**src/app/games/game-list/game-list.component.html**

```diff
-<input type='text'
+<input type='text' #filterElement
  [(ngModel)]='listFilter' />
```

**src/app/games/game-list/game-list.component.ts**

```diff
...
imageWidth: number = 50;
imageMargin: number = 2;

+
+@ViewChild('filterElement', {static : false}) filterElementRef = null;
+
filteredGames: GameModel[];
games: GameModel[];
...
```

- This way filterElementRef will contain a reference to the input element so we can access the element's properties or call its methods.

> https://angular.io/api/core/ViewChild

### Step 2. Template Reference Populated

But when is this reference assign to? Let's change constructor and a have a look what is going on there.

**src/app/games/game-list/game-list.component.ts**

```diff
@ViewChild('filterElement') filterElementRef;

filteredGames: GameModel[];
games: GameModel[];

constructor(private gameService: GameService) {
+ console.log(this.filterElementRef);
}
```

- If we open the developer tools we will find out that is **null**.

- It is null because component's lifecycle

  1. Component Construction and Initialization -> (constructor() / ngOnInit())
  2. View Initialization and Rendering -> (ngAfterViewInit())

- When the component it is initialized the view is not rendered yet so the reference will be null.

### Step 3. Move to ngAfterViewInit life cycle hook

**src/app/games/game-list/game-list.component.ts**

```diff
-import { Component, OnInit, ViewChild } from '@angular/core';
+import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { GameModel } from '../game.model';
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
      (games: GameModel[]) => {
        this.games = games;
        this.performFilter(this.listFilter);
      }
    );
  }

  ....

}

```

- If we run this now we will find out that the element is not longer null.

### Step 4. Setting Focus

For last we are going to give focus to the input element.

**src/app/games/game-list/game-list.component.ts**

```diff
-import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
+import { Component, OnInit, ViewChild, AfterViewInit, ElementRef } from '@angular/core';
import { GameModel } from '../game.model';
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
+ @ViewChild('filterElement') filterElementRef!: ElementRef;

  filteredGames: GameModel[];
  games: GameModel[];
  ....

  constructor(private gameService: GameService) {}

  ngAfterViewInit(): void {
-   console.log(this.filterElementRef);
+   this.filterElementRef.nativeElement.focus();
  }

....
}

```

### Bear in mind...

- There are a few considerations we need to keep in mind when working with ViewChild to access a native element.

- If we use nativeElement, we are directly accessing the DOM, or Document Object Model. The DOM is the set of data structures that manage the HTML elements for display in the browser.

- This means that we are tightly coupled to the browser and may not be able to use server-side rendering or web workers. One way we can protect our code from this issue is to check for the existence of the native element before accessing its properties or methods using code like this. We first check for the native element and only proceed if the value is not null or undefined.

- In addition, using nativeElement can pose a security threat, especially when accessing its innerHtml property. It can make an application more vulnerable to cross-site scripting, XSS, attacks. If these considerations are not relevant to your application, then you can freely use ViewChild to access the native element.

> How to set focus on element Angular: https://stackoverflow.com/questions/50006888/set-focus-on-input-element

### Step 5. Now lets have a look into `ViewChildren`

**src/app/games/game-list/game-list.component.html**

```diff
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

**src\app\games\game-list\game-list.component.ts**

```diff
-import { Component, OnInit, ViewChild, AfterViewInit, ElementRef } from '@angular/core';
+import { Component, OnInit, ViewChild, AfterViewInit, ElementRef, QueryList, ViewChildren } from '@angular/core';
import { NgModel } from '@angular/forms';
import { GameModel } from '../game.model';
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
+ inputElementRefs!: QueryList<ElementRef>;

  filteredGames: GameModel[];
  games: GameModel[];

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

- Now we can check out in console what is going on there.

### Step 6. Accesing View Children by Directive

Now lets change it to `NgModel`, that will the same input elements access.

**src/app/games/game-list/game-list.component.ts**

```diff
+import { NgModel } from '@angular/forms';
....
- @ViewChildren('filterElement, nameElement')
+@ViewChildren(NgModel)
inputElementRefs: QueryList<ElementRef>;
```

- Now we can check out in console what is going on there.

### Step 7. Getting Notifications from ViewChild

We can use ViewChild decorator to get notifications when user makes changes.

**src/app/games/game-list/game-list.component.html**

```diff
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

**src/app/games/game-list/game-list.component.ts**

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
export class GameListComponent implements OnInit, AfterViewInit {
  showImage: boolean;
+ listFilter: string;
  imageWidth = 50;
  imageMargin = 2;

  @ViewChild('filterElement') filterElementRef: ElementRef;
- @ViewChildren(NgModel)
- inputElementRefs: QueryList<ElementRef>;

  filteredGames: GameModel[];
  games: GameModel[];

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

We create `@ViewChild` with a reference to the `NgModel` directive.

**src/app/games/game-list/game-list.component.ts**

```diff
...
@ViewChild('filterElement') filterElementRef: ElementRef;
+@ViewChild(NgModel) filterInput!: NgModel;
...
```

- The difference between both, is that in the first case we can access the native element
- The second case we are getting access to the ngModel data structures. We are not accessing the native element.

**src\app\games\game-list\game-list.component.ts**

```diff
ngAfterViewInit(): void {
  this.filterElementRef.nativeElement.focus();
+ this.filterInput.valueChanges.subscribe(
+   () => this.performFilter(this.listFilter)
+ );
}
```

This is not really working, _filterInput_ is updated before _listFilter_, if we want that works properly:

```ts
ngAfterViewInit(): void {
  this.filterElementRef.nativeElement.focus();
  this.filterInput.valueChanges.subscribe((value) => {
    this.performFilter(value);
  });
}
```

- Now we can check if the filter is working again.
