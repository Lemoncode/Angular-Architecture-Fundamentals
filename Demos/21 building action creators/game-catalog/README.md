## In this demo we are going to create action creators.

### Benefits od strongly typed actions

* Prevents hard to find errors
* Improves the tooling experience
* Documents the set of valid actions

### Strongly Typing with Action Createors

* There are other ways to typed actions as function creators.
* Use action creators implies these steps

1. Define the action types as named constants.
2. Build the action creators.
3. Define a union type for those action creators.

### Step 1. The first thing that we have to ask ourselelves is where we place the actions. Lets create a new file inside the video-consoles/state folder and name it video-consoles.actions.ts

```typescript video-console.actions.ts
import { Action } from '@ngrx/store';

export enum VideoConsoleActionTypes {
  ToggleVideoConsoleCode = '[Video Console] Toggle Video Console Code'
}

export class ToggleVideoConsoleCode implements Action {
  readonly type = VideoConsoleActionTypes.ToggleVideoConsoleCode;

  constructor(public payload: boolean) {}
}

export type VideoConsoleActions = ToggleVideoConsoleCode;

```
* At this point the action creator is not very exiciting.

### Step 2. Lets define more actions.

```typescript video-console.actions.ts
import { Action } from '@ngrx/store';
/*diff*/
import { VideoConsoleModel } from '../video-console.model';
/*diff*/

export enum VideoConsoleActionTypes {
  ToggleVideoConsoleCode = '[Video Console] Toggle Video Console Code',
  /*diff*/
  SetCurrentVideoConsole = '[Video Console] Set current Video Console',
  ClearCurrentVideoConsole = '[Video Console] Clear current Video Console',
  InitializeCurrentVideoConsole = '[Video Console] Initialize current Vodeo Console',
  /*diff*/
}

export class ToggleVideoConsoleCode implements Action {
  readonly type = VideoConsoleActionTypes.ToggleVideoConsoleCode;

  constructor(public payload: boolean) { }
}
/*diff*/
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

export type VideoConsoleActions = ToggleVideoConsoleCode |
  SetCurrentVideoConsole |
  ClearCurrentVideoConsole |
  InitializeCurrentVideoConsole;
/*diff*/
```

### Step 3. Now we can change our reducer to use the actions.

```diff video-console.reducer.ts
import { VideoConsoleModel } from '../video-console.model';
import * as fromRoot from '../../state/app.state';
import { createFeatureSelector, createSelector, State } from '@ngrx/store';
+import { VideoConsoleActionTypes } from './video-consoles.actions';


export interface State extends fromRoot.State {
  videoconsoles: VideoConsoleState;
}

export interface VideoConsoleState {
  showVideoConsoleCode: boolean;
  currentVideoConsole: VideoConsoleModel;
  videoconsoles: VideoConsoleModel[];
}

const initialState: VideoConsoleState = {
  showVideoConsoleCode: true,
  currentVideoConsole: null,
  videoconsoles: [],
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

export const reducer = (state: VideoConsoleState = initialState, action): VideoConsoleState => {
  switch (action.type) {
-   case 'TOGGLE_VIDEO_CONSOLE_CODE':
-     console.log(`existing state: ${JSON.stringify(state)}`);
-     console.log(`action payload: ${action.payload}`);
+   case VideoConsoleActionTypes.ToggleVideoConsoleCode:
+     return {
+       ...state,
+       showVideoConsoleCode: action.payload,
+     };
+   case VideoConsoleActionTypes.SetCurrentVideoConsole:
+     return {
+       ...state,
+       currentVideoConsole: { ...action.payload }
+     }
+
+   case VideoConsoleActionTypes.ClearCurrentVideoConsole:
+     return {
+       ...state,
+       currentVideoConsole: null
+     }
+ 
+  case VideoConsoleActionTypes.InitializeCurrentVideoConsole:
+     return {
+       ...state,
+       currentVideoConsole: {
+       id: 0,
+       name: '',
+       code: 'new',
+       description: '',
+       rating: 0,
+     }
+    }
    default:
      return state;
  }
};

```

### Step 4. We can update the video-console-list.component.ts as well.

```diff video-console-list.component.ts
...
+import * as videoConsoleActions from '../state/video-consoles.actions';

@Component({
  selector: 'app-video-console-list',
  templateUrl: './video-console-list.component.html',
  styleUrls: ['./video-console-list.component.css']
})
export class VideoConsoleListComponent implements OnInit, OnDestroy {
...
  checkChanged(value: boolean): void {
-   this.store.dispatch({
-     type: 'TOGGLE_VIDEO_CONSOLE_CODE',
-     payload: value,
-   });
+   this.store.dispatch(new videoConsoleActions.ToggleVideoConsoleCode(value));
  }
...
}

```

### Step 5. Now that we have this infraestructure set up, we can start communicate components using actions and selectors. Lets start by changing the selected video console.

```diff video-console-list.component.ts
videoConsoleSelected(videoConsole: VideoConsoleModel): void {
-   this.videoConsoleService.changeSelectedVideoConsole(videoConsole);
+   this.store.dispatch(new videoConsoleActions.SetCurrentVideoConsole(videoConsole));
  }
```

* Previously were being retrieved by a service.

### Step 6. When the user press add relies on a service, lets use store instead

```diff video-console-list.component.ts
newVideoConsole(): void {
-   this.videoConsoleService.changeSelectedVideoConsole(this.videoConsoleService.newVideoConsole());
+    this.store.dispatch(new videoConsoleActions.InitializeCurrentVideoConsole());
  }
```

### Step 7. Now we want to receive the notifications from the store instead from the service.

```diff video-console-list.component.ts
ngOnInit(): void {
-   this.sub = this.videoConsoleService.selectedVideoConsoleChanges$.subscribe(
-     selectedVideoConsole => this.selectedVideoConsole = selectedVideoConsole
-   );

+   this.store.pipe(select(fromVideoConsole.getCurrentVideoConsole))
+     .subscribe(
+       selectedVideoConsole => this.selectedVideoConsole = selectedVideoConsole
+     );

    this.videoConsoleService.getVideoConsoles().subscribe(
      (videoConsoles: VideoConsoleModel[]) => this.videoConsoles = videoConsoles,
      (err: any) => this.errorMessage = err.error
    );

    this.store.pipe(select(fromVideoConsole.getShowVideoConsoleCode))
      .subscribe(
        showVideoConsoleCode => this.displayCode = showVideoConsoleCode,
      );
  }
```

### Step 8. We also want to communicate with the edit video console component. Currently this component is not yet communicated with the store. Lets solve this.

```diff video-console-edit.component.ts
import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

import { VideoConsoleModel } from '../video-console.model';

import { Subscription } from 'rxjs';

import { GenericValidator } from '../../shared/generic-validator';
import { NumberValidators } from '../../shared/number.validator';
import { VideoConsoleService } from '../video-console.service';

+/*NgRx*/
+import { Store, select } from '@ngrx/store';
+import * as fromVideoConsole from '../state/video-consoles.reducer';
+import * as videoConsoleActions from '../state/video-consoles.actions';


@Component({
  selector: 'app-video-console-edit',
  templateUrl: './video-console-edit.component.html',
  styleUrls: ['./video-console-edit.component.css']
})
export class VideoConsoleEditComponent implements OnInit, OnDestroy {
  errorMessage = '';
  videoConsoleForm: FormGroup;
  videoConsole: VideoConsoleModel | null;
  sub: Subscription;

  displayMessage: { [key: string]: string } = {};
  private validationMessages: { [key: string]: { [key: string]: string } };
  private genericValidator: GenericValidator;

  constructor(
+   private store: Store<fromVideoConsole.State>,
    private fb: FormBuilder,
    private videoConsoleService: VideoConsoleService
  ) {
    this.validationMessages = {
      videoConsoleName: {
        required: 'Name is required',
        minLength: 'Three or more characters',
        maxLength: 'No bigger than fifty characters',
      },
      videoConsoleCode: {
        required: 'Code is required',
      },
      rating: {
        range: 'Rate between 1 and 5'
      }
    };

    this.genericValidator = new GenericValidator(this.validationMessages);
  }

  ngOnInit(): void {
    this.videoConsoleForm = this.fb.group({
      videoConsoleName: ['', [Validators.required,
      Validators.minLength(3),
      Validators.maxLength(50)]],
      videoConsoleCode: ['', Validators.required],
      rating: ['', NumberValidators.range(1, 5)],
      description: ''
    });

-   this.sub = this.videoConsoleService.selectedVideoConsoleChanges$
-     .subscribe(
-       (selectedVideoConsole) => this.displayVideoConsole(selectedVideoConsole)
-     );
+   this.store.pipe(select(fromVideoConsole.getCurrentVideoConsole))
+     .subscribe(
+       currentVideoConsole => this.displayVideoConsole(currentVideoConsole)
+     );

    this.videoConsoleForm.valueChanges
        .subscribe(
          (value) => this.displayMessage = this.genericValidator.processMessages(this.videoConsoleForm)
        );
  }

  ngOnDestroy(): void {
    this.sub.unsubscribe();
  }

  blur(): void {
    this.displayMessage = this.genericValidator.processMessages(this.videoConsoleForm);
  }

  displayVideoConsole(videoConsole: VideoConsoleModel | null): void {
    this.videoConsole = videoConsole;
    if (this.videoConsole) {
      this.videoConsoleForm.reset();
      this.videoConsoleForm.patchValue({
        videoConsoleName: this.videoConsole.name,
        videoConsoleCode: this.videoConsole.code,
        rating: this.videoConsole.rating,
        description: this.videoConsole.description,
      })
    }
  }

  cancelEdit(): void {
    this.displayVideoConsole(this.videoConsole);
  }

  deleteVideoConsole(): void {
    if (this.videoConsole && this.videoConsole.id) {
      this.videoConsoleService.deleteVideConsole(this.videoConsole.id)
        .subscribe(
-         () => this.videoConsoleService.changeSelectedVideoConsole(null),
+         () => this.store.dispatch(new videoConsoleActions.ClearCurrentVideoConsole()),
          (err: any) => this.errorMessage = err.error
        )
    } else {
      this.videoConsoleService.changeSelectedVideoConsole(null);
    }
  }

  saveVideoConsole(): void {
    if (this.videoConsoleForm.valid && this.videoConsoleForm.dirty) {
      const vc = this.map(this.videoConsoleForm.value, this.videoConsole.id);

      if (vc.id === 0) {
        this.videoConsoleService.createVideoConsole(vc)
          .subscribe(
-           (vc) => this.videoConsoleService.changeSelectedVideoConsole(vc),
+           (vc) => this.store.dispatch(new videoConsoleActions.SetCurrentVideoConsole(vc)),
            (err: any) => this.errorMessage = err.error,
          );
      } else {
        this.videoConsoleService.updateVideoConsole(vc)
          .subscribe(
-           (vc) => this.videoConsoleService.changeSelectedVideoConsole(vc),
+           (vc) => this.store.dispatch(new videoConsoleActions.SetCurrentVideoConsole(vc)),
            (err: any) => this.errorMessage = err.error,
          );
      }
    } else {
      this.errorMessage = 'Please correct the validation errors'
    }
  }

  private map = (formValues: any, id: number): VideoConsoleModel => ({
    id: id,
    name: formValues.videoConsoleName,
    code: formValues.videoConsoleCode,
    rating: formValues.rating,
    description: formValues.description,
  });
}

```

* Now we can test if the application it's working

### Step 9. Now lets have a look in more complex operations such load data. This kind of operations implies multiple steps. Lets modify `video-console.actions.ts` with new actions to achieve the goal of load data.

```diff video-console.actions.ts
import { Action } from '@ngrx/store';

import { VideoConsoleModel } from '../video-console.model';


export enum VideoConsoleActionTypes {
  ToggleVideoConsoleCode = '[Video Console] Toggle Video Console Code',
  SetCurrentVideoConsole = '[Video Console] Set current Video Console',
  ClearCurrentVideoConsole = '[Video Console] Clear current Video Console',
  InitializeCurrentVideoConsole = '[Video Console] Initialize current Vodeo Console',
+ Load = '[Video Console] Load',
+ LoadSuccess = '[Video Console] Load Success',
+ LoadFailed = '[Video Console] Load Failed'
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

+export class Load implements Action {
+  readonly type = VideoConsoleActionTypes.Load;
+}
+
+export class LoadSuccess implements Action {
+  readonly type = VideoConsoleActionTypes.LoadSuccess;
+
+  constructor(public payload: VideoConsoleModel[]) {}
+}
+
+export class LoadFailed implements Action {
+  readonly type = VideoConsoleActionTypes.LoadFailed;
+
+  constructor(public payload: string) {}
+}

export type VideoConsoleActions = ToggleVideoConsoleCode |
  SetCurrentVideoConsole |
  ClearCurrentVideoConsole |
  InitializeCurrentVideoConsole |
+  Load |
+  LoadSuccess |
+  LoadFailed ;

```
