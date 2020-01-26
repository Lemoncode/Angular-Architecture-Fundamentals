## In this demo we're going to wire up the presentational component to presentational component.

### Step 1. Add inputs to video-console-list component


```diff video-console-list.component.ts
-import { Component } from '@angular/core';
+import { Component, Input } from '@angular/core';
+import { VideoConsoleModel } from '../../video-console.model';

@Component({
  selector: 'app-video-console-list',
  templateUrl: './video-console-list.component.html',
  styleUrls: ['./video-console-list.component.css']
})
export class VideoConsoleListComponent {
+ @Input() errorMessage: string;
+ @Input() displayCode: boolean;
+ @Input() videoConsoles: VideoConsoleModel[];
+ @Input() selectedVideoConsole: VideoConsoleModel;
}

```
### Step 2. Add output for the events that we want to pass.

```diff video-console-list.componnet.ts
-import { Component, Input } from '@angular/core';
+import { Component, Input, Output, EventEmitter } from '@angular/core';
import { VideoConsoleModel } from '../video-console.model';


@Component({
  selector: 'app-video-console-list',
  templateUrl: './video-console-list.component.html',
  styleUrls: ['./video-console-list.component.css']
})
export class VideoConsoleListComponent {
  @Input() errorMessage: string;
  @Input() displayCode: boolean;
  @Input() videoConsoles: VideoConsoleModel[];
  @Input() selectedVideoConsole: VideoConsoleModel;
+ @Output() checked = new EventEmitter<boolean>();
+ @Output() initializeNewVideoConsole = new EventEmitter<void>();
+ @Output() selected = new EventEmitter<VideoConsoleModel>();
}

```
### Step 3. Now we have to emit these events

```typescript video-console-list.component.ts
import { Component, Input, Output, EventEmitter } from '@angular/core';
import { VideoConsoleModel } from '../video-console.model';


@Component({
  selector: 'app-video-console-list',
  templateUrl: './video-console-list.component.html',
  styleUrls: ['./video-console-list.component.css']
})
export class VideoConsoleListComponent {
  @Input() errorMessage: string;
  @Input() displayCode: boolean;
  @Input() videoConsoles: VideoConsoleModel[];
  @Input() selectedVideoConsole: VideoConsoleModel;
  @Output() checked = new EventEmitter<boolean>();
  @Output() initializeNewVideoConsole = new EventEmitter<void>();
  @Output() selected = new EventEmitter<VideoConsoleModel>();

  /*diff*/
  checkChanged(value: boolean): void {
    this.checked.emit(value);
  }

  newVideoConsole(): void {
    this.initializeNewVideoConsole.emit();
  }

  videoConsoleSelected(videoconsole: VideoConsoleModel): void {
    this.selected.emit(videoconsole);
  }
  /*diff*/
}

```

### Step 4. Now we have to remove the async pipes from our html

```diff video-console-list.component.html
<div class="card">
- <div class="card-body" *ngIf="videoConsoles$ | async as videoConsoles">
+ <div class="card-body" *ngIf="videoConsoles">
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
-<div *ngIf="errorMessage$ | async as errorMessage" class="alert alert-danger">
+<div *ngIf="errorMessage" class="alert alert-danger">
  Error: {{ errorMessage }}
</div>

```

* Check that everything is working.
