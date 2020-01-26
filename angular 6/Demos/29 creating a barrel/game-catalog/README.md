## In this demo we're going to create a barrel to organize our code.

### Barrel

* A way to rollup exports from several modules into a single convenience module.The barrel itself is a module file that re-exports selected exports of other modules.

* index.ts , becasuse by default is going to look systems as nodejs.

### Step 1. Create a new file `video-consoles/state/index.ts`

```typescript
import { VideoConsoleModel } from '../video-console.model';
import * as fromRoot from '../../state/app.state';
import { createFeatureSelector, createSelector, State } from '@ngrx/store';
import { VideoConsoleState } from './video-consoles.reducer';


export interface State extends fromRoot.State {
  videoconsoles: VideoConsoleState;
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

```

### Step 3. Modify video-console.reducer.ts

```typescript
import { VideoConsoleActionTypes } from './video-consoles.actions';
import { VideoConsoleModel } from '../video-console.model';

export interface VideoConsoleState {
  showVideoConsoleCode: boolean;
  currentVideoConsoleId: number | null;
  videoconsoles: VideoConsoleModel[];
  error: string;
}

const initialState: VideoConsoleState = {
  showVideoConsoleCode: true,
  currentVideoConsoleId: null,
  videoconsoles: [],
  error: '',
}


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
        currentVideoConsoleId: action.payload.id
      };

    case VideoConsoleActionTypes.ClearCurrentVideoConsole:
      return {
        ...state,
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

    case VideoConsoleActionTypes.UpdateVideoConsoleSuccess:
      const updatedVideoConsoles = state.videoconsoles.map(
        vc => action.payload.id === vc.id ? action.payload : vc
      );
      return {
        ...state,
        videoconsoles: updatedVideoConsoles,
        currentVideoConsoleId: action.payload.id,
        error: '',
      };

    case VideoConsoleActionTypes.UpdateVideoConsoleFailed:
      return {
        ...state,
        error: action.payload
      }

    default:
      return state;
  }
};

```

### Step 3. Change the references in our components

```diff video-console-board.component.ts
-import * as fromVideoConsole from '../state/video-consoles.reducer';
+import * as fromVideoConsole from '../state';
```

```diff video-console-edit.component.ts
-import * as fromVideoConsole from '../state/video-consoles.reducer';
+import * as fromVideoConsole from '../state';
```

### Exercise: Presentational component

* Move VideoConsole Edit comoponent into the components folder

* Change the import file paths

* Remove the injected store

* Pass all store state properties in as inputs

* Move all dispatched actions to the VideoConsoleBoard, called via emitted events

* Add an OnChanges life cycle hook to listen for and call the patch form method on changes.
