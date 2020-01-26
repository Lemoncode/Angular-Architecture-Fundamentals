## In this demo we are going to handle exceptions.

### Step 1. First we need to handle the error inside the effects.

__src\app\video-consoles\state\video-consoles.effects.ts__

```diff video-console.effects.ts
import { Injectable } from '@angular/core';
import { Actions, Effect, ofType } from '@ngrx/effects';

import { VideoConsoleService } from '../video-console.service';
import * as videoConsoleActions from './video-consoles.actions';
import { VideoConsoleModel } from '../video-console.model';

-import { mergeMap, map } from 'rxjs/operators';
+import { mergeMap, map, catchError } from 'rxjs/operators';
+import { of } from 'rxjs';

@Injectable()
export class VideoConsoleEffects {
  constructor(
    private actions$: Actions,
    private videoConsoleService: VideoConsoleService
  ){}


  @Effect()
  loadVideoConsoles$ = this.actions$.pipe(
    ofType(videoConsoleActions.VideoConsoleActionTypes.Load),
    mergeMap((action: videoConsoleActions.Load) =>
      this.videoConsoleService.getVideoConsoles()
        .pipe(
          map((vcs: VideoConsoleModel[]) => (new videoConsoleActions.LoadSuccess(vcs))),
+         catchError(err => of(new videoConsoleActions.LoadFailed(err))) // [1]
        )
    )
  )
}

```

1. `of`: Emit variable amount of values in a sequence and then emits a complete notification.

### Step 2. Now we can update our `video-console.reducer.ts`

__src\app\video-consoles\state\video-consoles.reducer.ts__

```diff
import { VideoConsoleModel } from '../video-console.model';
import * as fromRoot from '../../state/app.state';
import { createFeatureSelector, createSelector, State } from '@ngrx/store';
import { VideoConsoleActionTypes } from './video-consoles.actions';


export interface State extends fromRoot.State {
  videoconsoles: VideoConsoleState;
}

export interface VideoConsoleState {
  showVideoConsoleCode: boolean;
  currentVideoConsole: VideoConsoleModel;
  videoconsoles: VideoConsoleModel[];
+ error: string;
}

const initialState: VideoConsoleState = {
  showVideoConsoleCode: true,
  currentVideoConsole: null,
  videoconsoles: [],
+ error: '',
}

const getVideoConsoleFeatureState = createFeatureSelector<VideoConsoleState>('videoconsoles');

export const getShowVideoConsoleCode = createSelector(
  getVideoConsoleFeatureState,
  state => state.showVideoConsoleCode,
);

export const getCurrentVideoConsole = createSelector(
  getVideoConsoleFeatureState,
  state => state.currentVideoConsole,
);

export const getVideoConsoles = createSelector(
  getVideoConsoleFeatureState,
  state => state.videoconsoles,
);

+export const getError = createSelector(
+  getVideoConsoleFeatureState,
+  state => state.error
+);

export const reducer = (state: VideoConsoleState = initialState, action): VideoConsoleState => {
  switch (action.type) {
    case VideoConsoleActionTypes.ToggleVideoConsoleCode:
      return {
        ...state,
        showVideoConsoleCode: action.payload,
      };
    case VideoConsoleActionTypes.SetCurrentVideoConsole:
      return {
        ...state,
        currentVideoConsole: { ...action.payload }
      };

    case VideoConsoleActionTypes.ClearCurrentVideoConsole:
      return {
        ...state,
        currentVideoConsole: null
      };

    case VideoConsoleActionTypes.InitializeCurrentVideoConsole:
      return {
        ...state,
        currentVideoConsole: {
          id: 0,
          name: '',
          code: 'new',
          description: '',
          rating: 0,
        }
      };

    case VideoConsoleActionTypes.LoadSuccess:
      return {
        ...state,
        videoconsoles: [...action.payload],
+       error: '',
      };

+   case VideoConsoleActionTypes.LoadFailed:
+     return {
+       ...state,
+       videoconsoles: [],
+       error: action.payload
+     };

    default:
      return state;
  }
};

```

### Step 3. If we want to notify the user we have to modify video-console list component.

__src\app\video-consoles\video-console-list\video-console-list.component.ts__

```diff video-console-list.component.ts
....
@Component({
  selector: 'app-video-console-list',
  templateUrl: './video-console-list.component.html',
  styleUrls: ['./video-console-list.component.css']
})
export class VideoConsoleListComponent implements OnInit {
- errorMessage: string;
+ errorMessage$: Observable<string>;
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
+   this.errorMessage$ = this.store.pipe(select(fromVideoConsole.getError));

    this.store.pipe(select(fromVideoConsole.getShowVideoConsoleCode))
      .subscribe(
        showVideoConsoleCode => this.displayCode = showVideoConsoleCode,
      );
  }
....
}

```

__src\app\video-consoles\video-console-list\video-console-list.component.html__

```diff video-console-list.component.html
-<div *ngIf="errorMessage" class="alert alert-danger">
+<div *ngIf="errorMessage$ | async as errorMessage" class="alert alert-danger">
  Error: {{ errorMessage }}
</div>
```

* Change url on __src\app\video-consoles\video-console.service.ts__ to watch an error.
