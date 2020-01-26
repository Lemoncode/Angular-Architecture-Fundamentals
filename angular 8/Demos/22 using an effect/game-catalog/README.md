## In this demo we are going to define an use an effect.


### Step 1. First we have to install the library.

```bash
$ npm i @ngrx/effects -S
```

* In our case

```bash
$ npm i @ngrx/effects@8.6.0 -S
```

### Step 2. Create `video-consoles/state/video-consoles.effects.ts`

__src\app\video-consoles\state\video-consoles.effects.ts__

```typescript
import { Injectable } from '@angular/core';
import { Actions, Effect, ofType } from '@ngrx/effects';

import { VideoConsoleService } from '../video-console.service';
import * as videoConsoleActions from './video-consoles.actions';
import { VideoConsoleModel } from '../video-console.model';

import { mergeMap, map } from 'rxjs/operators';

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
          map((vcs: VideoConsoleModel[]) => (new videoConsoleActions.LoadSuccess(vcs)))
        )
    )
  );
}

```

### Step 3. Now we have to handle this on reducer.

* Just add a new case statement into switch

__src\app\video-consoles\state\video-consoles.reducer.ts__

```diff video-consoles.reducer.ts
....
+case VideoConsoleActionTypes.LoadSuccess:
+      return {
+        ...state,
+        videoconsoles: [...action.payload],
+      };
```

### Step 4. Since the videoconsoles are handle by the state, we no longer need to keep the state into the video-console.service.ts

__game-catalog\src\app\video-consoles\video-console.service.ts__

```diff video-console.service.ts
import { Injectable, Inject } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import { Observable, of, BehaviorSubject } from 'rxjs';
import { tap, map, catchError } from 'rxjs/operators'


import { HTTP_DATA_LOGGER } from '../core/http-data-logger.service';
import { HTTP_ERROR_HANDLER } from '../core/http-error-handler.service';


import { VideoConsoleModel } from './video-console.model';

@Injectable()
export class VideoConsoleService {
  private videoconsolesUrl = 'api/videoconsoles';
- private videoConsoles: VideoConsoleModel[];

  constructor(
    private http: HttpClient,
    @Inject(HTTP_DATA_LOGGER) private logger,
    @Inject(HTTP_ERROR_HANDLER) private errorHandler
  ) { }

  private selectedVideoConsoleSource = new BehaviorSubject<VideoConsoleModel | null>(null);
  selectedVideoConsoleChanges$ = this.selectedVideoConsoleSource.asObservable();

  changeSelectedVideoConsole(selectedVideoConsole: VideoConsoleModel) {
    this.selectedVideoConsoleSource.next(selectedVideoConsole);
  }

  getVideoConsoles(): Observable<VideoConsoleModel[]> {
-   if (this.videoConsoles) {
-     return of(this.videoConsoles);
-   }
    return this.http.get<VideoConsoleModel[]>(this.videoconsolesUrl)
      .pipe(
        tap(this.logger.logJSON),
-       tap(data => this.videoConsoles = data),
        catchError(this.errorHandler.handleError),
      )
  }

  newVideoConsole = (): VideoConsoleModel => ({
    id: 0,
    name: '',
    code: 'new',
    description: '',
    rating: 0
  });

  createVideoConsole(videoConsole: VideoConsoleModel): Observable<VideoConsoleModel> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    videoConsole.id = null;
    return this.http.post<VideoConsoleModel>(
      this.videoconsolesUrl,
      videoConsole,
      { headers }
    ).pipe(
      tap(this.logger.logJSON),
-     tap(data => {
-       this.videoConsoles.push(data);
-     }),
      catchError(this.errorHandler.handleError)
    );
  }

  deleteVideConsole(id: number): Observable<VideoConsoleModel> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    const url = `${this.videoconsolesUrl}/${id}`;
    return this.http.delete<VideoConsoleModel>(
      url,
      { headers }
    ).pipe(
      tap(this.logger.logJSON),
-     tap(_ => {
-       const foundIndex = this.videoConsoles.findIndex(item => item.id === id);
-         if (foundIndex > -1) {
-           this.videoConsoles.splice(foundIndex, 1);
-         }
-     }),
      catchError(this.errorHandler.handleError)
    )
  }

  updateVideoConsole(videoConsole: VideoConsoleModel): Observable<VideoConsoleModel> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    const url = `${this.videoconsolesUrl}/${videoConsole.id}`;
    return this.http.put<VideoConsoleModel>(url, videoConsole, { headers })
      .pipe(
        tap(this.logger.logJSON),
-       tap(() => {
-         const foundIndex = this.videoConsoles.findIndex(item => item.id === videoConsole.id);
-         if (foundIndex > -1) {
-           this.videoConsoles[foundIndex] = videoConsole;
-         }
-       }),
        map(() => videoConsole),
        catchError(this.errorHandler.handleError)
      );
  }
}

```
* We have already break `delete` and `update` operations. But will fix those opertions later.

### Step 5. Effects have to be registered such as another service. Register effects in `app.module.ts`

__src\app\app.module.ts__

```diff app.module.ts
....
/*NgRx*/
import { StoreModule } from '@ngrx/store';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';
+import { EffectsModule } from '@ngrx/effects';

import { environment } from '../environments/environment';

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
    StoreModule.forRoot({}),
+   EffectsModule.forRoot([]),
    StoreDevtoolsModule.instrument({
      name: 'Game Catalog App Devtools',
      maxAge: 25,
      logOnly: environment.production
    }),
    CoreModule,
    UserModule,
    AppRoutingModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }

```
* Register effects in `video-consoles.module.ts`

__src\app\video-consoles\video-consoles.module.ts__

```diff video-consoles.module.ts
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { SharedModule } from '../shared/shared.module';


import { VideoConsoleService } from './video-console.service';
import { VideoConsoleEditComponent } from './video-console-edit/video-console-edit.component';
import { VideoConsoleListComponent } from './video-console-list/video-console-list.component';
import { VideoConsoleBoardComponent } from './video-console-board/video-console-board.component';

/*NgRx*/
import { StoreModule } from '@ngrx/store';
import { reducer } from './state/video-consoles.reducer';
+import { VideoConsoleEffects } from './state/video-consoles.effects';
+import { EffectsModule } from '@ngrx/effects';

const routes: Routes = [
  { path: '', component: VideoConsoleBoardComponent }
];

@NgModule({
  imports: [
    SharedModule,
    RouterModule.forChild(routes),
    StoreModule.forFeature('videoconsoles', reducer),
+   EffectsModule.forFeature([ VideoConsoleEffects ]),
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


### Step 6. Lets wire up video-console-list.component.ts to use the effects.

__src\app\video-consoles\video-console-list\video-console-list.component.ts__

```diff video-console-list.component.ts
...
ngOnInit(): void {
    this.store.pipe(select(fromVideoConsole.getCurrentVideoConsole))
      .subscribe(
        selectedVideoConsole => this.selectedVideoConsole = selectedVideoConsole
      );

-   this.videoConsoleService.getVideoConsoles().subscribe(
-     (videoConsoles: VideoConsoleModel[]) => this.videoConsoles = videoConsoles,
-     (err: any) => this.errorMessage = err.error
-   );
+   this.store.dispatch(new videoConsoleActions.Load());
+   this.store.pipe(select(fromVideoConsole.getVideoConsoles))
+       .subscribe(
+         vcs => this.videoConsoles = vcs
+       );
+
    this.store.pipe(select(fromVideoConsole.getShowVideoConsoleCode))
      .subscribe(
        showVideoConsoleCode => this.displayCode = showVideoConsoleCode,
      );
  }
```

* Lets check that works.
