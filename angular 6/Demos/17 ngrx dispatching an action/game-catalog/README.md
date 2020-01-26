## In this demo we are going to dispatch an action. We want to update the state of show video console code by dispatching an action. We are going to read from store the state in the component

### Step 1. So lets inject the store into `video-consoles-list.component.ts`

```diff video-consoles-list.component.ts
import { Component, OnInit, OnDestroy } from '@angular/core';

import { VideoConsoleModel } from '../video-console.model';

import { Subscription } from 'rxjs';
import { VideoConsoleService } from '../video-console.service';

+import { Store } from '@ngrx/store';

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
+   private store: Store<any>,
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
  }

  ngOnDestroy(): void {
    this.sub.unsubscribe();
  }

  checkChanged(value: boolean): void {
-   this.displayCode = value;
+   this.store.dispatch({
+     type: 'TOGGLE_VIDEO_CONSOLE_CODE',
+     payload: value,
+   });
  }

  newVideoConsole(): void {
    this.videoConsoleService.changeSelectedVideoConsole(this.videoConsoleService.newVideoConsole());
  }

  videoConsoleSelected(videoConsole: VideoConsoleModel): void {
    this.videoConsoleService.changeSelectedVideoConsole(videoConsole);
  }
}

```

* We have set a console.log in our reducer, so if we dispatch an action must be log in console.
* The existing state is undefined, that is ok because we do not have defined yet.
* payload toggles from false to true if we click multiple times.

### Step 2. We want notifications whenever the `videoconsoles` state changes.

```typescript
ngOnInit(): void {
    this.sub = this.videoConsoleService.selectedVideoConsoleChanges$.subscribe(
      selectedVideoConsole => this.selectedVideoConsole = selectedVideoConsole
    );

    this.videoConsoleService.getVideoConsoles().subscribe(
      (videoConsoles: VideoConsoleModel[]) => this.videoConsoles = videoConsoles,
      (err: any) => this.errorMessage = err.error
    );

    this.store.pipe(
      select('videoconsoles') // [1]
    ).subscribe( // [2]
      (vcs) => {
        if (vcs) { // [3]
          this.displayCode = vcs.showVideoConsoleCode; // [4]
        }
      }
    );
  }
```

1. The name of slice of state.
2. We want then subscribe to receive change notifications.
3. When is first executed, its slice of state is undefined, so here we wait untill this slice of state is defined.
4. For last we set the local value to state value.

* When we are using observables, we have to unsubscribe to these observables, is the same with the store, we will do it later.

* For last we can try on browser if this code is working.

## Exercise: Retain mask user name

1. Initialize the store in the user module
2. Define the state (maskUserName) and action (MASK_USER_NAMES)
3. Create the reducer function
4. Dispatch and action
5. Subscribe to the user slice of state


1. Initialize the store

```diff user.module.ts
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { SharedModule } from '../shared/shared.module';

import { LoginComponent } from './login.component';

+/* NgRx */
+import { StoreModule } from '@ngrx/store';

@NgModule({
  imports: [
    SharedModule,
+   StoreModule.forFeature('user', {}),
    RouterModule.forChild([
      { path: 'login', component: LoginComponent }
    ])
  ],
  declarations: [
    LoginComponent
  ]
})
export class UserModule { }

```

2. Define the state

```typescript
{
  action: 'MASK_USER_NAME',
  payload: value
}

{
  users: {
    maskUserName: true
  }
}
```

3. Create the reducer function

* Crete the state folder, and place inside user.reducer.ts file

```typescript user.reducer.ts
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

* Now we have to update user module with reducer.

```diff user.module.ts
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { SharedModule } from '../shared/shared.module';

import { LoginComponent } from './login.component';

/* NgRx */
import { StoreModule } from '@ngrx/store';
+import { reducer } from './state/user.reducer';

@NgModule({
  imports: [
    SharedModule,
+   StoreModule.forFeature('users', reducer),
    RouterModule.forChild([
      { path: 'login', component: LoginComponent }
    ])
  ],
  declarations: [
    LoginComponent
  ]
})
export class UserModule { }

```

4. Dispatch an action.

* To dispatch an action we have to inject the store and then dispatch that action.


```diff login.component.ts
import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';

import { AuthService } from './auth.service';

+ /*NgRx*/
+import { Store } from '@ngrx/store';

@Component({
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  pageTitle = 'Log In';
  errorMessage: string;

  maskUserName: boolean;

  constructor(
+    private store: Store<any>,
    private authService: AuthService,
    private router: Router
  ) {
  }

  ngOnInit(): void {

  }

  cancel(): void {
    this.router.navigate(['welcome']);
  }

  checkChanged(value: boolean): void {
    this.maskUserName = value;
+   this.store.dispatch({
+     type: 'MASK_USER_NAME',
+     payload: value,
+   });
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
* Now we can check if the action is already dispatched.

5. Subscribe to the user slice of the state

```diff login.component.ts
-import { Component } from '@angular/core';
+import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';

import { AuthService } from './auth.service';

/*NgRx*/
+import { Store, select } from '@ngrx/store';

@Component({
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
-export class LoginComponent {
+export class LoginComponent implements OnInit {
  pageTitle = 'Log In';
  errorMessage: string;

  maskUserName: boolean;

  constructor(
    private store: Store<any>,
    private authService: AuthService,
    private router: Router
  ) {
  }

  ngOnInit(): void {
+    this.store.pipe(
+      select('user')
+    ).subscribe((u) => {
+      if (u) {
+        this.maskUserName = u.maskUserName;
+      }
+    });
  }

  cancel(): void {
    this.router.navigate(['welcome']);
  }

  checkChanged(value: boolean): void {
-   this.maskUserName = value;
+   this.store.dispatch({
+     type: 'MASK_USER_NAME',
+     payload: value,
+   });
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

* At this point must be working with ngrx.
