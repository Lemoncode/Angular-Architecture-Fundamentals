## In this demo we are going to add a basic support to ngrx. Install the packages, and create the core of redux pattern (reducer).

### Installing ngrx store

* The store is runtime only, so the state is not retained if the users refreshes the page or after the user exits the application.

* The state is much easier to manage if it is arranged to a logical structure. Because Angular applications are often organized into features modules, it makes sense to layout the state by feature as well:

```javascript
{
  app: {
    hideWelcome: true,
  },
  products: {
    showCode: true,
    currentVideoConsole: {...},
    videoConsoles: [...]
  }
  ...
}
```

* The pieces of state are use called slices.

### Step 1. Install `@ngrx/store`

```bash 
$ npm i @ngrx/store -S
```

* Current version: `"@ngrx/store": "^6.1.0"`

```bash
$ npm i @ngrx/store@6.1.0 -S
```

### Feature module State Composition

* This technique allow us to build our reducers from our feature modules.

1. To use it, we begin by initializing our root application state in the root AppModule, just as we saw previously. 

```typescript
import { StoreModule } from '@ngrx/store'

@NgModule({
  imports: [
    BrowserModule,
    RouterModule.forRoot(appRoutes),
    ...
    StoreModule.forRoot(reducer)
  ]
})
export class AppModule
```

2. Then when we initialize each features state using `StoreModule.forFeature`

```typescript
import { StoreModule } from '@ngrx/store'

@NgModule({
  imports: [
    SharedModule,
    RouterModule.forChild(productRoutes),
    ...
    StoreModule.forFeature('videoconsoles', reducer)
  ]
  declarations: [...],
  providers: [...]
})
export class ProductModule
```

### Step 2. Install at the root app level.

```diff app.module.ts
...
/* Feature Modules */
import { UserModule } from './user/user.module';

/*NgRx*/
+import { StoreModule } from '@ngrx/store';

@NgModule({
  declarations: [
    AppComponent,
    MenuComponent,
    WelcomeComponent,
    ShellComponent,
    PageNotFoundComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    HttpClientInMemoryWebApiModule.forRoot(AppData),
+   StoreModule.forRoot({}), // [1]
    CoreModule,
    UserModule,
    AppRoutingModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }

```

1. We do not have defined any reducer yet so we feed it as an empty object.

### Step 3. We initialized on the feature modules.

* The feature modules where we are going to start to work with is `video-consoles`

#### src/app/video-consoles/video-consoles.module.ts

```diff
...
+/*NgRx*/
+import { StoreModule } from '@ngrx/store';

const routes: Routes = [
  { path: '', component: VideoConsoleBoardComponent }
];

@NgModule({
  imports: [
    SharedModule,
    RouterModule.forChild(routes),
+   StoreModule.forFeature('videoconsoles', {}), // [1]
  ],
  declarations: [
    VideoConsoleEditComponent,
    VideoConsoleListComponent,
    VideoConsoleBoardComponent
  ],
  providers: [
    VideoConsoleService
  ]
})
export class VideoConsolesModule { }

```

1. Name of reducer as first argument, the second is the reducer or the set of reducers.

### Step 4. The first thing we ask ourselves where we place reducers and actions, we have divided our application into feature modules, has sense to create a folder inside, that holds the actions and reducers.

<pre>
src/
├── app/
    ├── home/
    └── video-consoles/
        └── state/    
             └── video-consoles.reducer.ts
</pre>

```typescript
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

### Step 5. Now instead of passing an empty reducer to feature store module, we pass our reducer.

#### src/app/video-consoles/video-consoles.module.ts

```diff 
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { SharedModule } from '../shared/shared.module';


import { VideoConsoleService } from './video-console.service';
import { VideoConsoleEditComponent } from './video-console-edit/video-console-edit.component';
import { VideoConsoleListComponent } from './video-console-list/video-console-list.component';
import { VideoConsoleBoardComponent } from './video-console-board/video-console-board.component';

/*NgRx*/
import { StoreModule } from '@ngrx/store';
+import { reducer } from './state/video-consoles.reducer';

const routes: Routes = [
  { path: '', component: VideoConsoleBoardComponent }
];

@NgModule({
  imports: [
    SharedModule,
    RouterModule.forChild(routes),
-   StoreModule.forFeature('videoconsoles', {}),
+   StoreModule.forFeature('videoconsoles', reducer),
  ],
  declarations: [
    VideoConsoleEditComponent,
    VideoConsoleListComponent,
    VideoConsoleBoardComponent
  ],
  providers: [
    VideoConsoleService
  ]
})
export class VideoConsolesModule { }

```
* Test that app compiles and start.
* We don't connect redux state yet so nothing has to change in our app.
