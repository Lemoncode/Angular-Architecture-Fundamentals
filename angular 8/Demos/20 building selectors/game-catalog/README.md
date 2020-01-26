## In this demo we are going to work with `selectors` topics.

* If we have a look to the current subscription on `video-console-list.component.ts`, we can notice some drawbacks.

```typescript
this.store.pipe(
      select('videoconsoles') // [1]
    ).subscribe(
      (vcs) => { // [3]
       this.displayCode = vcs.showVideoConsoleCode; // [2]
      }
    );
```
1. Hard-coded string. This is brittle, whenever the state naming changes, will break.
2. Knows the store structure. This is a problem because whenever we change the state structure will break.
3. Watches for any changes. Obviously this is an overkill.

### Selectors

* Is a reusable query of our store.
* Selectors allow us to keep one copy of the state in the store, but project it into different shapes, making it easier to access by our components and services. Our components use the selector to select state from our store, adding a level of abstraction between our stores structure and our components.

### Selectors benefits

1. Provide a strongly typed API
2. Decouple the store from the components
3. Encapsulate complex data transformations
4. Reusable
5. Memoized (cached)

### NgRx provides two type of selectors

```typescript
const getVideoConsoleFeatureState = createFeatureSelector<VideoConsoleState>('videoconsoles');
```
* This type, returns a slice of the state.

```typescript
const getShowVideoConsoleCode = createSelector(
  getVideoConsoleFeatureState,
  state => state.showVideoConsoleCode,
);
```
* By composing selectors, we can go into the state tree and retrieve any part that we want.
* The selectors must be pure functions.

### Step 1. We are going to place our selectors into the reducer file.

__src\app\video-consoles\state\video-consoles.reducer.ts__

```diff video-console.reducer.ts
import { VideoConsoleModel } from '../video-console.model';
import * as fromRoot from '../../state/app.state';
+import { createFeatureSelector, createSelector } from '@ngrx/store';

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

+const getVideoConsoleFeatureState = createFeatureSelector<VideoConsoleState>('videoconsoles');
+
+export const getShowVideoConsoleCode = createSelector(
+ getVideoConsoleFeatureState,
+ state => state.showVideoConsoleCode,
+);
....
```

### Step 2. Add selectors for current video-console and array of video-consoles.

* Propose as `challange` to students.

__src\app\video-consoles\state\video-consoles.reducer.ts__

```diff video-console.reducer.ts
import { VideoConsoleModel } from '../video-console.model';
import * as fromRoot from '../../state/app.state';
import { createFeatureSelector, createSelector, State } from '@ngrx/store';

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

+export const getCurrentVideoConsole = createSelector(
+ getVideoConsoleFeatureState,
+  state => state.currentVideoConsole,
+);
+
+export const getVideoConsoles = createSelector(
+ getVideoConsoleFeatureState,
+ state => state.videoconsoles,
+);
...
```

### Step 3. Now lets use one of these new selectors.

__src\app\video-consoles\video-console-list\video-console-list.component.ts__

```diff
ngOnInit(): void {
    this.sub = this.videoConsoleService.selectedVideoConsoleChanges$.subscribe(
      selectedVideoConsole => this.selectedVideoConsole = selectedVideoConsole
    );

    this.videoConsoleService.getVideoConsoles().subscribe(
      (videoConsoles: VideoConsoleModel[]) => this.videoConsoles = videoConsoles,
      (err: any) => this.errorMessage = err.error
    );

-   this.store.pipe(
-     select('videoconsoles')
-   ).subscribe(
-     (vcs) => {
-       this.displayCode = vcs.showVideoConsoleCode;
-     }
-   );
+   this.store.pipe(select(fromVideoConsole.getShowVideoConsoleCode))
+     .subscribe(
+       showVideoConsoleCode => this.displayCode = showVideoConsoleCode,
+     );
  }
```

### Step 4. Composing selectors.

* Selectors are composable.

```typescript
const getVideoConsoleFeatureState = createFeatureSelector<VideoConsoleState>('videoconsoles');

export const getCurrentVideoConsoleId = createSelector(
  getVideoConsoleFeatureState,
  state => state.currentVideoConsole.id
);

export const getCurrentVideoConsole = createSelector(
  getVideoConsoleFeatureState,
  getCurrentVideoConsoleId,
  (state, currentVideoConsoleId) => 
    state.videoconsoles.find(vc => vc.id === currentVideoConsoleId)
);
```
* Why use composition instead creating a new selector? This way increase abstraction and decoupling the selector from the state structural changes.

## Exercise: Type state and create selectors

1. Strongly type the user state
2. Build selectors for maskUserName and currentUser
3. Modify the reducer to use the strongly typed state
4. Modify the login component to use selector

1. Strongly type the user state

* We are going to initialize state as well.

```diff user.reducer.ts
+import { IUser } from '../user';

+export interface UserState {
+  maskUserName: boolean;
+  currentUser: IUser;
+}
+
+const initialState: UserState = {
+  maskUserName: false,
+  currentUser: null,
+};

-export const reducer = (state, action) => {
+export const reducer = (state: UserState = initialState, action): UserState => {  
  switch (action.type) {
    case 'MASK_USER_NAME':
      return {
        ...state,
        maskUserName: action.payload,
      }
    default:
      return state;
  }
};

```

* Now we can update `app/state/app.state.ts`

```diff app.state.ts
+import { UserState } from '../user/state/user.reducer';

export interface State {
- user: any;
+ user: UserState;
}
```

2. Build selectors for maskUserName and currentUser

```diff user.reducer.ts
import { IUser } from '../user';
+import { createFeatureSelector, createSelector } from '@ngrx/store';

export interface UserState {
  maskUserName: boolean;
  currentUser: User;
}

+const getUserFeatureState = createFeatureSelector<UserState>('user');
+
+export const getMaskUserName = createSelector(
+  getUserFeatureState,
+  state => state.maskUserName,
+);
+
+export const getCurrentUser = createSelector(
+  getUserFeatureState,
+  state => state.currentUser,
+);

export const reducer = (state, action) => {
  switch (action.type) {
    case 'MASK_USER_NAME':
      return {
        ...state,
        maskUserName: action.payload,
      }
    default:
      return state;
  }
};

```
3. Modify the reducer to use the strongly typed state

```diff user.reducer.ts
....
-export const reducer = (state, action) => {
+export const reducer = (state: UserState, action): UserState => {
  console.log('state', state);
  console.log('action', action.payload);
  switch (action.type) {
    case 'MASK_USER_NAME':
      return {
        ...state,
        maskUserName: action.payload,
      }
    default:
      return state;
  }
};

```
4. Modify the login component to use selector

```diff login.component.ts
import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';

import { AuthService } from './auth.service';
import { Store, select } from '@ngrx/store';
+import { State } from '../state/app.state';
+import * as fromUser from './state/user.reducer';

@Component({
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  pageTitle = 'Log In';
  errorMessage: string;

  maskUserName: boolean;

  constructor(
-   private store: Store<any>,
+   private store: Store<State>,
    private authService: AuthService,
    private router: Router
  ) {
  }

  ngOnInit(): void {
-   this.store.pipe(
-     select('user')
-   ).subscribe((u) => {
-     if (u) {
-       this.maskUserName = u.maskUserName;
-     }
-   });
+   this.store.pipe(select(fromUser.getMaskUserName))
+     .subscribe(
+       maskUserName => this.maskUserName = maskUserName
+     );
  }

  cancel(): void {
    this.router.navigate(['welcome']);
  }

  checkChanged(value: boolean): void {
    // this.maskUserName = value;
    this.store.dispatch({
      type: 'MASK_USER_NAME',
      payload: value,
    });
  }

  login(loginForm: NgForm): void {
    if (loginForm && loginForm.valid) {
      const userName = loginForm.form.value.userName;
      const password = loginForm.form.value.password;
      this.authService.login(userName, password);

      if (this.authService.redirectUrl) {
        this.router.navigateByUrl(this.authService.redirectUrl);
      } else {
        this.router.navigate(['/products']);
      }
    } else {
      this.errorMessage = 'Please enter a user name and password.';
    }
  }
}

```
* For last check that the app still working.

