## In this demo we're going to create a container component.

#### Step 1. First we're going to refactor our video-consoles folder:

* Create `app/video-consoles/containers` and `app/video-consoles/components`

* Move into components folder `video-console-list` folder.
* Move into cotainers folder `video-console-board` folder.

* Now we have to fix the broken imports `video-consoles.module.ts`

```typescript video-consoles.module.ts
import { VideoConsoleBoardComponent } from './containers/video-console-board/video-console-board.component';
import { VideoConsoleListComponent } from './components/video-console-list/video-console-list.component';
```

### Step 2. `video-console-list` is going to be a presentational component, so first we're going to pull out all that is related with manage data.

__src\app\video-consoles\components\video-console-list\video-console-list.component.ts__

```typescript video-console-list.component.ts
import { Component } from '@angular/core';

@Component({
  selector: 'app-video-console-list',
  templateUrl: './video-console-list.component.html',
  styleUrls: ['./video-console-list.component.css']
})
export class VideoConsoleListComponent {
  
}

```

* And paste into `video-console-board.component.ts`

__src\app\video-consoles\containers\video-console-board\video-console-board.component.ts__

```typescript video-console-board.component.ts
import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { VideoConsoleModel } from '../../video-console.model';
import { Store, select } from '@ngrx/store';
import * as fromVideoConsole from '../../state/video-consoles.reducer';
import * as videoConsoleActions from '../../state/video-consoles.actions';


@Component({
  selector: 'app-video-console-board',
  templateUrl: './video-console-board.component.html'
})
export class VideoConsoleBoardComponent implements OnInit {
  // errorMessage: string;
  errorMessage$: Observable<string>;
  displayCode: boolean;
  videoConsoles$: Observable<VideoConsoleModel[]>;
  selectedVideoConsole: VideoConsoleModel | null;

  constructor(
    private store: Store<fromVideoConsole.State>
  ) { }

  ngOnInit(): void {
    this.store.pipe(select(fromVideoConsole.getCurrentVideoConsole))
      .subscribe(
        selectedVideoConsole => this.selectedVideoConsole = selectedVideoConsole
      );

    this.store.dispatch(new videoConsoleActions.Load());
    this.videoConsoles$ = this.store.pipe(select(fromVideoConsole.getVideoConsoles));
    this.errorMessage$ = this.store.pipe(select(fromVideoConsole.getError));

    this.store.pipe(select(fromVideoConsole.getShowVideoConsoleCode))
      .subscribe(
        showVideoConsoleCode => this.displayCode = showVideoConsoleCode,
      );
  }

  checkChanged(value: boolean): void {
    this.store.dispatch(new videoConsoleActions.ToggleVideoConsoleCode(value));
  }

  newVideoConsole(): void {
    this.store.dispatch(new videoConsoleActions.InitializeCurrentVideoConsole());
  }

  videoConsoleSelected(videoConsole: VideoConsoleModel): void {
    this.store.dispatch(new videoConsoleActions.SetCurrentVideoConsole(videoConsole));
  }
}

```

### Step 3. Now we have a mix of type of properties in our container, we want that everything `observable`

__src\app\video-consoles\containers\video-console-board\video-console-board.component.ts__

```diff video-console-board.component.ts
export class VideoConsoleBoardComponent implements OnInit {
  errorMessage$: Observable<string>;
- displayCode: boolean;
+ displayCode$: Observable<boolean>;
  videoConsoles$: Observable<VideoConsoleModel[]>;
- selectedVideoConsole: VideoConsoleModel | null;
+ selectedVideoConsole$: Observable<VideoConsoleModel>;

  constructor(
    private store: Store<fromVideoConsole.State>
  ) { }
```

### Step 4. Now we can refactor `video-console -board` without subscriptions.

__src\app\video-consoles\containers\video-console-board\video-console-board.component.ts__

```diff product-board.component.ts
...
ngOnInit(): void {
-  this.store.pipe(select(fromVideoConsole.getCurrentVideoConsole))
-    .subscribe(
-      selectedVideoConsole => this.selectedVideoConsole = selectedVideoConsole
-    );

    this.store.dispatch(new videoConsoleActions.Load());
    this.videoConsoles$ = this.store.pipe(select(fromVideoConsole.getVideoConsoles));
    this.errorMessage$ = this.store.pipe(select(fromVideoConsole.getError));
+   this.selectedVideoConsole$ = this.store.pipe(
+     select(fromVideoConsole.getCurrentVideoConsole)
+   );
+   this.displayCode$ = this.store.pipe(
+     select(fromVideoConsole.getShowVideoConsoleCode)
+   );
-  this.store.pipe(select(fromVideoConsole.getShowVideoConsoleCode))
-    .subscribe(
-      showVideoConsoleCode => this.displayCode = showVideoConsoleCode,
-    );
  }
```

### Step 5. Now we can pass down all `data` to presentational component.

__src\app\video-consoles\containers\video-console-board\video-console-board.component.html__

```diff video-console-board.component.html
<div class="row">
  <div class="col-4">
    <app-video-console-list
+   [errorMessage]="errorMessage$ | async"
+   [displayCode]="displayCode$ | async"
+   [videoConsoles]="videoConsoles$ | async"
+   [selectedVideoConsole]="selectedVideoConsole$ | async"
    ></app-video-console-list>
  </div>
  <div class="col-8">
    <app-video-console-edit></app-video-console-edit>
  </div>
</div>
```

* We need to react to the changes on the presentational component.

```diff video-console-board.component.html
<div class="row">
  <div class="col-4">
    <app-video-console-list
    [errorMessage]="errorMessage$ | async"
    [displayCode]="displayCode$ | async"
    [videoConsoles]="videoConsoles$ | async"
    [selectedVideoConsole]="selectedVideoConsole$ | async"
+   (checked)="checkChanged($event)"
+   (initializeNewVideoConsole)="newVideoConsole()"
+   (selected)="videoConsoleSelected($event)"
    ></app-video-console-list>
  </div>
  <div class="col-8">
    <app-video-console-edit></app-video-console-edit>
  </div>
</div>

```
