## In this demo we are going to make an update of a video console.

### Step 1. Right now we're handling the videoConsole to be updated in two properties of our state, `videoConsoles` and `currentvideoConsole`, if we update the videoConsole we have to make changes in both places. If we change currentvideoConsole by currentvideoConsoleId, we can handle this with a better approach.

```diff video-console.reducer.ts
import { VideoConsoleModel } from '../video-console.model';
import * as fromRoot from '../../state/app.state';
import { createFeatureSelector, createSelector, State } from '@ngrx/store';
import { VideoConsoleActionTypes } from './video-consoles.actions';


export interface State extends fromRoot.State {
  videoconsoles: VideoConsoleState;
}

export interface VideoConsoleState {
  showVideoConsoleCode: boolean;
- currentVideoConsole: VideoConsoleModel;
+ currentVideoConsoleId: number | null;
  videoconsoles: VideoConsoleModel[];
  error: string;
}

const initialState: VideoConsoleState = {
  showVideoConsoleCode: true,
- currentVideoConsole: null,
+ currentVideoConsoleId: null,
  videoconsoles: [],
  error: '',
}

const getVideoConsoleFeatureState = createFeatureSelector<VideoConsoleState>('videoconsoles');

export const getShowVideoConsoleCode = createSelector(
  getVideoConsoleFeatureState,
  state => state.showVideoConsoleCode,
);

export const getCurrentVideoConsoleId = createSelector(
  getVideoConsoleFeatureState,
  state => state.currentVideoConsoleId
);

- export const getCurrentVideoConsole = createSelector(
-   getVideoConsoleFeatureState,
-   state => state.currentVideoConsole,
- );

+export const getCurrentVideoConsole = createSelector(
+  getVideoConsoleFeatureState,
+  getCurrentVideoConsoleId,
+  (state, videoConsoleId) => {
+    if (videoConsoleId === 0) {
+      return {
+        id: 0,
+        name: '',
+        code: 'new',
+        description: '',
+        rating: 0,
+      };
+    } else {
+      return videoConsoleId ? state.videoconsoles.find(p => p.id === videoConsoleId) : null;
+    }
+  }
+);
+
export const getVideoConsoles = createSelector(
  getVideoConsoleFeatureState,
  state => state.videoconsoles,
);

export const getError = createSelector(
  getVideoConsoleFeatureState,
  state => state.error
);

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
-       currentVideoConsole: { ...action.payload }
+       currentVideoConsoleId: action.payload.id
      };

    case VideoConsoleActionTypes.ClearCurrentVideoConsole:
      return {
        ...state,
-       currentVideoConsole: null
+       currentVideoConsoleId: null
      };

    case VideoConsoleActionTypes.InitializeCurrentVideoConsole:
      return {
        ...state,
-       currentVideoConsole: {
-         id: 0,
-         name: '',
-         code: 'new',
-         description: '',
-         rating: 0,
-       }
+       currentVideoConsoleId: 0
      };

    case VideoConsoleActionTypes.LoadSuccess:
      return {
        ...state,
        videoconsoles: [...action.payload],
        error: '',
      };

    case VideoConsoleActionTypes.LoadFailed:
      return {
        ...state,
        videoconsoles: [],
        error: action.payload
      };

    default:
      return state;
  }
};

```

* Now lets see if still works

* Save it's not working yet. 

### Step 2. Now we are going to define our strongly typed actions to update a video console.

```diff video-console.actions.ts
import { Action } from '@ngrx/store';

import { VideoConsoleModel } from '../video-console.model';


export enum VideoConsoleActionTypes {
  ToggleVideoConsoleCode = '[Video Console] Toggle Video Console Code',
  SetCurrentVideoConsole = '[Video Console] Set current Video Console',
  ClearCurrentVideoConsole = '[Video Console] Clear current Video Console',
  InitializeCurrentVideoConsole = '[Video Console] Initialize current Vodeo Console',
  Load = '[Video Console] Load',
  LoadSuccess = '[Video Console] Load Success',
  LoadFailed = '[Video Console] Load Failed',
+ UpdateVideoConsole = '[VideoConsole] Update Video Console',
+ UpdateVideoConsoleSuccess = '[VideoConsole] Update Video Console Success',
+ UpdateVideoConsoleFailed = '[VideoConsole] Update Video Console Failed',
}

export class ToggleVideoConsoleCode implements Action {
  readonly type = VideoConsoleActionTypes.ToggleVideoConsoleCode;

  constructor(public payload: boolean) { }
}

export class SetCurrentVideoConsole implements Action {
  readonly type = VideoConsoleActionTypes.SetCurrentVideoConsole

  constructor(public payload: VideoConsoleModel) { }
}

export class ClearCurrentVideoConsole implements Action {
  readonly type = VideoConsoleActionTypes.ClearCurrentVideoConsole
}

export class InitializeCurrentVideoConsole implements Action {
  readonly type = VideoConsoleActionTypes.InitializeCurrentVideoConsole
}

export class Load implements Action {
  readonly type = VideoConsoleActionTypes.Load;
}

export class LoadSuccess implements Action {
  readonly type = VideoConsoleActionTypes.LoadSuccess;

  constructor(public payload: VideoConsoleModel[]) { }
}

export class LoadFailed implements Action {
  readonly type = VideoConsoleActionTypes.LoadFailed;

  constructor(public payload: string) { }
}

+export class UpdateVideoConsole implements Action {
+  readonly type = VideoConsoleActionTypes.UpdateVideoConsole;
+
+  constructor(public payload: VideoConsoleModel) { }
+}
+
+export class UpdateVideoConsoleSuccess implements Action {
+  readonly type = VideoConsoleActionTypes.UpdateVideoConsoleSuccess;
+
+  constructor(public payload: VideoConsoleModel) { }
+}
+
+export class UpdateVideoConsoleFailed implements Action {
+  readonly type = VideoConsoleActionTypes.UpdateVideoConsoleFailed;
+
+  constructor(public payload: string) { }
+}
+
+
export type VideoConsoleActions = ToggleVideoConsoleCode |
  SetCurrentVideoConsole |
  ClearCurrentVideoConsole |
  InitializeCurrentVideoConsole |
  Load |
  LoadSuccess |
  LoadFailed |
+ UpdateVideoConsole |
+ UpdateVideoConsoleSuccess |
+ UpdateVideoConsoleFailed;

```

### Step 3. With this we are ready to dispatch an action. 

* In Angular there are two types of form template driven and reactive. The temaplate driven goes against the redux way. Use reactive instead.

```diff video-console-edit.component.ts
....
saveVideoConsole(): void {
    if (this.videoConsoleForm.valid && this.videoConsoleForm.dirty) {
      const vc = this.map(this.videoConsoleForm.value, this.videoConsole.id);

      if (vc.id === 0) {
        this.videoConsoleService.createVideoConsole(vc)
          .subscribe(
            (vc) => this.store.dispatch(new videoConsoleActions.SetCurrentVideoConsole(vc)),
            (err: any) => this.errorMessage = err.error,
          );
      } else {
-      this.videoConsoleService.updateVideoConsole(vc)
-        .subscribe(
-          (vc) => this.store.dispatch(new videoConsoleActions.SetCurrentVideoConsole(vc)),
-          (err: any) => this.errorMessage = err.error,
-        );
+       this.store.dispatch(new videoConsoleActions.UpdateVideoConsole(vc));
      }
    } else {
      this.errorMessage = 'Please correct the validation errors'
    }
  }
```

### Step 4.  Now we have to build the `effect` to handle update.

```diff video-consoles.effects.ts
import { Injectable } from '@angular/core';
import { Actions, Effect, ofType } from '@ngrx/effects';

import { VideoConsoleService } from '../video-console.service';
import * as videoConsoleActions from './video-consoles.actions';
import { VideoConsoleModel } from '../video-console.model';

import { mergeMap, map, catchError } from 'rxjs/operators';
import { of } from 'rxjs';

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
          catchError(err => of(new videoConsoleActions.LoadFailed(err)))
        )
    )
  );
+
+  @Effect()
+  updateVideoConsole$ = this.actions$.pipe(
+    ofType(videoConsoleActions.VideoConsoleActionTypes.UpdateVideoConsole),
+    map((action: videoConsoleActions.UpdateVideoConsole) => action.payload),
+    mergeMap((vc: VideoConsoleModel) => this.videoConsoleService.updateVideoConsole(vc).pipe( // [1]
+      map(vc => (new videoConsoleActions.UpdateVideoConsoleSuccess(vc))),
+      catchError(err => of(new videoConsoleActions.UpdateVideoConsoleFailed(err)))
+    ))
+  );
}

```
1. Using mergeMap we are avoiding nested observables, the previous map returns an observable, so this way we avoid an inner subscription.

### Step 5. Now we have to process the success and failed actions.

> Create demo mutable vs immutable

```diff video-consoles.reducer.ts
import { VideoConsoleModel } from '../video-console.model';
import * as fromRoot from '../../state/app.state';
import { createFeatureSelector, createSelector, State } from '@ngrx/store';
import { VideoConsoleActionTypes } from './video-consoles.actions';


export interface State extends fromRoot.State {
  videoconsoles: VideoConsoleState;
}

export interface VideoConsoleState {
  showVideoConsoleCode: boolean;
  //  currentVideoConsole: VideoConsoleModel;
  currentVideoConsoleId: number | null;
  videoconsoles: VideoConsoleModel[];
  error: string;
}

const initialState: VideoConsoleState = {
  showVideoConsoleCode: true,
  // currentVideoConsole: null,
  currentVideoConsoleId: null,
  videoconsoles: [],
  error: '',
}

const getVideoConsoleFeatureState = createFeatureSelector<VideoConsoleState>('videoconsoles');

export const getShowVideoConsoleCode = createSelector(
  getVideoConsoleFeatureState,
  state => state.showVideoConsoleCode,
);

export const getCurrentVideoConsoleId = createSelector(
  getVideoConsoleFeatureState,
  state => state.currentVideoConsoleId
);

// export const getCurrentVideoConsole = createSelector(
//   getVideoConsoleFeatureState,
//   state => state.currentVideoConsole,
// );

export const getCurrentVideoConsole = createSelector(
  getVideoConsoleFeatureState,
  getCurrentVideoConsoleId,
  (state, videoConsoleId) => {
    if (videoConsoleId === 0) {
      return {
        id: 0,
        name: '',
        code: 'new',
        description: '',
        rating: 0,
      };
    } else {
      return videoConsoleId ? state.videoconsoles.find(p => p.id === videoConsoleId) : null;
    }
  }
);


export const getVideoConsoles = createSelector(
  getVideoConsoleFeatureState,
  state => state.videoconsoles,
);

export const getError = createSelector(
  getVideoConsoleFeatureState,
  state => state.error
);

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
        // currentVideoConsole: { ...action.payload }
        currentVideoConsoleId: action.payload.id
      };

    case VideoConsoleActionTypes.ClearCurrentVideoConsole:
      return {
        ...state,
        // currentVideoConsole: null
        currentVideoConsoleId: null
      };

    case VideoConsoleActionTypes.InitializeCurrentVideoConsole:
      return {
        ...state,
        currentVideoConsoleId: 0
      };

    case VideoConsoleActionTypes.LoadSuccess:
      return {
        ...state,
        videoconsoles: [...action.payload],
        error: '',
      };

    case VideoConsoleActionTypes.LoadFailed:
      return {
        ...state,
        videoconsoles: [],
        error: action.payload
      };

+   case VideoConsoleActionTypes.UpdateVideoConsoleSuccess:
+     const updatedVideoConsoles = state.videoconsoles.map(
+       vc => action.payload.id === vc.id ? action.payload : vc
+     );
+     return {
+       ...state,
+       videoconsoles: updatedVideoConsoles,
+        currentVideoConsoleId: action.payload.id,
+        error: '',
+      };
+
+    case VideoConsoleActionTypes.UpdateVideoConsoleFailed:
+      return {
+        ...state,
+        error: action.payload
+      }
+
    default:
      return state;
  }
};

```

## In this exercise we are going to create the save and delete operations for a video console.

* Identify the state and actions

* Define a state interface and selectors

* Build action creators

* Dispatch an action to kick off the operation

* Build the effect to process that action and dispatch the success and fail actions in the reducer

