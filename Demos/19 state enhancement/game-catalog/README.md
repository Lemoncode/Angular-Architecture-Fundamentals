## In this demo we are going to type our state and set initial state values

### Step 1. The first question is where we place this interface that will strong type our state. It has sense to define them in the same file as reducers.

```typescript video-consoles.reducer.ts
/*diff*/
import { VideoConsoleModel } from '../video-console.model';

export interface VideoConsoleState {
  showVideoConsoleCode: boolean;
  currentVideoConsole: VideoConsoleModel;
  videoconsoles: VideoConsoleModel[];
}
/*diff*/
export const reducer = (state, action) => {
  switch (action.type) {
    case 'TOGGLE_VIDEO_CONSOLE_CODE':
      console.log(`existing state: ${JSON.stringify(state)}`);
      console.log(`action payload: ${action.payload}`);
      return {
        ...state,
        showVideoConsoleCode: action.payload,
      };

    default:
      return state;
  }
};

```
### Step 2. Next we define the interface for the entire application. Where should we put that? One option is to create a folder directly under our app folder state and inside place `app.state.ts`

```typescript app/state/app.state.ts
import { VideoConsoleState } from '../video-consoles/state/video-consoles.reducer';

export interface State {
  videoconsoles: VideoConsoleState;
  user: any;
}

```
* We have a issue with this code, product module is lazy loaded, that means that we have bundle boundaries that we can't cross and with this statement we have crossed those bounderies:
  - `import { ProductState } from '../products/state/product.reducer';`

* We have to follow another strategy,:

```typescript app
export interface State {
  user: any;
}

```

* Do not import video consoles state directly.

```typescript video-console.reducer.ts
import * as fromRoot from '../../state/app.state';

export interface State extends fromRoot.State {
  videoconsoles: VideoConsoleState;
}
```

* Instead extend State from products module, this way will not cross bundle bounderies.

### Step 3. Lets refactor our code to align with this.

```diff app.state.ts
- import { VideoConsoleState } from '../video-consoles/state/video-consoles.reducer';

export interface State {
- videoconsoles: VideoConsoleState;
  user: any;
}

```

```diff video-consoles.reducer.ts
import { VideoConsoleModel } from '../video-console.model';
+import * as fromRoot from '../../state/app.state';

+export interface State extends fromRoot.State {
+  videoconsoles: VideoConsoleState;
+}

export interface VideoConsoleState {
  showVideoConsoleCode: boolean;
  currentVideoConsole: VideoConsoleModel;
  videoconsoles: VideoConsoleModel[];
}

export const reducer = (state, action) => {
  switch (action.type) {
    case 'TOGGLE_VIDEO_CONSOLE_CODE':
      console.log(`existing state: ${JSON.stringify(state)}`);
      console.log(`action payload: ${action.payload}`);
      return {
        ...state,
        showVideoConsoleCode: action.payload,
      };

    default:
      return state;
  }
};

```

### Step 4. Now with these interfaces we can strongly typing the state.

```diff video-consoles.reducer.ts
import { VideoConsoleModel } from '../video-console.model';
import * as fromRoot from '../../state/app.state';

export interface State extends fromRoot.State {
  videoconsoles: VideoConsoleState;
}

export interface VideoConsoleState {
  showVideoConsoleCode: boolean;
  currentVideoConsole: VideoConsoleModel;
  videoconsoles: VideoConsoleModel[];
}

-export const reducer = (state, action) => {
+export const reducer = (state: VideoConsoleState, action): VideoConsoleState => {
  switch (action.type) {
    case 'TOGGLE_VIDEO_CONSOLE_CODE':
      console.log(`existing state: ${JSON.stringify(state)}`);
      console.log(`action payload: ${action.payload}`);
      return {
        ...state,
        showVideoConsoleCode: action.payload,
      };

    default:
      return state;
  }
};

```

* Add typing to `Store` in `video-console-list.component.ts`

```diff video-console-list.component.ts
import { Component, OnInit, OnDestroy } from '@angular/core';

import { VideoConsoleModel } from '../video-console.model';

import { Subscription } from 'rxjs';
import { VideoConsoleService } from '../video-console.service';

import { Store, select } from '@ngrx/store';

+import * as fromVideoConsole from '../state/video-consoles.reducer';

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
  sub: Subscription;

  constructor(
-   private store: Store<any>,
+   private store: Store<fromVideoConsole.State>,
    private videoConsoleService: VideoConsoleService
  ) { }

  ngOnInit(): void {
    this.sub = this.videoConsoleService.selectedVideoConsoleChanges$.subscribe(
      selectedVideoConsole => this.selectedVideoConsole = selectedVideoConsole
    );

    this.videoConsoleService.getVideoConsoles().subscribe(
      (videoConsoles: VideoConsoleModel[]) => this.videoConsoles = videoConsoles,
      (err: any) => this.errorMessage = err.error
    );

    this.store.pipe(
      select('videoconsoles')
    ).subscribe(
      (vcs) => {
        if (vcs) {
          this.displayCode = vcs.showVideoConsoleCode;
        }
      }
    );
  }

  ngOnDestroy(): void {
    this.sub.unsubscribe();
  }

  checkChanged(value: boolean): void {
    this.store.dispatch({
      type: 'TOGGLE_VIDEO_CONSOLE_CODE',
      payload: value,
    });
  }

  newVideoConsole(): void {
    this.videoConsoleService.changeSelectedVideoConsole(this.videoConsoleService.newVideoConsole());
  }

  videoConsoleSelected(videoConsole: VideoConsoleModel): void {
    this.videoConsoleService.changeSelectedVideoConsole(videoConsole);
  }
}

```

### Step 5. Remind that when our state get started is undefined. Lets solve this. It has sense to initialize the state in the same file where the reducer is placed, in this case `video-consoles.reducer.ts`

```diff video-consoles.reducer.ts
import { VideoConsoleModel } from '../video-console.model';
import * as fromRoot from '../../state/app.state';

export interface State extends fromRoot.State {
  videoconsoles: VideoConsoleState;
}

export interface VideoConsoleState {
  showVideoConsoleCode: boolean;
  currentVideoConsole: VideoConsoleModel;
  videoconsoles: VideoConsoleModel[];
}

+const initialState: VideoConsoleState = {
+  showVideoConsoleCode: true,
+  currentVideoConsole: null,
+  videoconsoles: [],
+}

-export const reducer = (state: VideoConsoleState, action): VideoConsoleState => {
+export const reducer = (state: VideoConsoleState = initialState, action): VideoConsoleState => {
  switch (action.type) {
    case 'TOGGLE_VIDEO_CONSOLE_CODE':
      console.log(`existing state: ${JSON.stringify(state)}`);
      console.log(`action payload: ${action.payload}`);
      return {
        ...state,
        showVideoConsoleCode: action.payload,
      };

    default:
      return state;
  }
};

```

* This way we avoid that our initial state get up as undefined.
* Making this make the app predictable.

### Step 6. Because our app is predicatble, we don't need to check any more if the state is defined in video-console-list.component.ts

```diff video-console-list.component.ts
ngOnInit(): void {
    this.sub = this.videoConsoleService.selectedVideoConsoleChanges$.subscribe(
      selectedVideoConsole => this.selectedVideoConsole = selectedVideoConsole
    );

    this.videoConsoleService.getVideoConsoles().subscribe(
      (videoConsoles: VideoConsoleModel[]) => this.videoConsoles = videoConsoles,
      (err: any) => this.errorMessage = err.error
    );

    this.store.pipe(
      select('videoconsoles')
    ).subscribe(
      (vcs) => {
-       if (vcs) {
-         this.displayCode = vcs.showVideoConsoleCode;
-       }
+       this.displayCode = vcs.showVideoConsoleCode;
      }
    );
  }
```

* Test app.
