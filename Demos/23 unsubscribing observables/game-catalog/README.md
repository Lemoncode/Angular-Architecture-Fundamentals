## In this demo we are going to use different techniques to unsubscribe from observables.

### Step 1. Open video-console-list.component.ts and edit as follows:

```diff video-console-list.component.ts
import { Component, OnInit, OnDestroy } from '@angular/core';

import { VideoConsoleModel } from '../video-console.model';

-import { Subscription } from 'rxjs';
-import { VideoConsoleService } from '../video-console.service';

+import { takeWhile } from 'rxjs/operators';

import { Store, select } from '@ngrx/store';

import * as fromVideoConsole from '../state/video-consoles.reducer';
import * as videoConsoleActions from '../state/video-consoles.actions';

@Component({
  selector: 'app-video-console-list',
  templateUrl: './video-console-list.component.html',
  styleUrls: ['./video-console-list.component.css']
})
export class VideoConsoleListComponent implements OnInit, OnDestroy {
  errorMessage: string;
  displayCode: boolean;
  videoConsoles: VideoConsoleModel[];
  selectedVideoConsole: VideoConsoleModel | null;
- sub: Subscription;
+ componentActive = true;

  constructor(
    private store: Store<fromVideoConsole.State>,
-   private videoConsoleService: VideoConsoleService
  ) { }

  ngOnInit(): void {
    this.store.pipe(select(fromVideoConsole.getCurrentVideoConsole))
      .subscribe(
        selectedVideoConsole => this.selectedVideoConsole = selectedVideoConsole
      );

    this.store.dispatch(new videoConsoleActions.Load());
    this.store.pipe(
      select(fromVideoConsole.getVideoConsoles),
+     takeWhile(() => this.componentActive),
    ).subscribe(
      vcs => this.videoConsoles = vcs
    );

    this.store.pipe(select(fromVideoConsole.getShowVideoConsoleCode))
      .subscribe(
        showVideoConsoleCode => this.displayCode = showVideoConsoleCode,
      );
  }

  ngOnDestroy(): void {
-   this.sub.unsubscribe();
+   this.componentActive = false;
  }
...
}

```
* Lets check that works.

### Step 2. Since we don't need the videoconsoles in our component we ca use `async` pipe.

```diff video-console-list.component.ts
-import { Component, OnInit, OnDestroy } from '@angular/core';
+import { Component, OnInit } from '@angular/core';

import { VideoConsoleModel } from '../video-console.model';

-import { takeWhile } from 'rxjs/operators';
+import { Observable } from 'rxjs';

import { Store, select } from '@ngrx/store';

import * as fromVideoConsole from '../state/video-consoles.reducer';
import * as videoConsoleActions from '../state/video-consoles.actions';

@Component({
  selector: 'app-video-console-list',
  templateUrl: './video-console-list.component.html',
  styleUrls: ['./video-console-list.component.css']
})
-export class VideoConsoleListComponent implements OnInit, OnDestroy {
+export class VideoConsoleListComponent implements OnInit {
  errorMessage: string;
  displayCode: boolean;
- videoConsoles: VideoConsoleModel[];
+ videoConsoles$: Observable<VideoConsoleModel[]>;
  selectedVideoConsole: VideoConsoleModel | null;
- componentActive = true;

  constructor(
    private store: Store<fromVideoConsole.State>
  ) { }

  ngOnInit(): void {
    this.store.pipe(select(fromVideoConsole.getCurrentVideoConsole))
      .subscribe(
        selectedVideoConsole => this.selectedVideoConsole = selectedVideoConsole
      );

    this.store.dispatch(new videoConsoleActions.Load());
-   this.store.pipe(
-     select(fromVideoConsole.getVideoConsoles),
-     takeWhile(() => this.componentActive),
-   ).subscribe(
-     vcs => this.videoConsoles = vcs
-   );
+   this.videoConsoles$ = this.store.pipe(select(fromVideoConsole.getVideoConsoles));

    this.store.pipe(select(fromVideoConsole.getShowVideoConsoleCode))
      .subscribe(
        showVideoConsoleCode => this.displayCode = showVideoConsoleCode,
      );
  }

- ngOnDestroy(): void {
-   this.componentActive = false;
- }
....
}

```

```diff video-console-list.component.html
<div class="card">
- <div class="card-body" *ngIf="videoConsoles?.length">
+ <div class="card-body" *ngIf="videoConsoles$ | async as videoConsoles">
    <div class="list-group">
      <button class="list-group-item list-group-item-action rounded-0"
          *ngFor="let videoConsole of videoConsoles"
          [ngClass]="{'active': videoConsole?.id === selectedVideoConsole?.id}"
          (click)="videoConsoleSelected(videoConsole)">{{ videoConsole.name }}
        <ng-container *ngIf="displayCode">
          ({{ videoConsole.code }})
        </ng-container>
      </button>
    </div>
  </div>

  <div class="card-footer">
    <div class="row">
      <div class="form-check col-md-7">
        <label>
          <input class="form-check-input"
                 type="checkbox"
                 (change)="checkChanged($event.target.checked)"
                 [checked]="displayCode">
          Display Video Console Code
        </label>
      </div>
      <div class="col-md-4 text-right">
        <button class="btn btn-primary" (click)="newVideoConsole()">
          Add
        </button>
      </div>
    </div>
  </div>
</div>
<div *ngIf="errorMessage" class="alert alert-danger">
  Error: {{ errorMessage }}
</div>

```
