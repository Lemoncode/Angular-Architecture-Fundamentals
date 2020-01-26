## Add video-game-console-module for ngrx refactor.


### Step 1. Before get started with theh new video-consoles module, lets add some new elements to shared module.

* `shared/generic-validator.ts` 

__src\app\shared\generic.validator.ts__

```typescript
import { FormGroup } from '@angular/forms';

// Generic validator for Reactive forms
// Implemented as a class, not a service, so it can retain state for multiple forms.
export class GenericValidator {

  constructor(private validationMessages: { [key: string]: { [key: string]: string } }) {}

  processMessages(container: FormGroup): { [key: string]: string } {
    const messages = {};
    for (const controlKey in container.controls) {
      if (container.controls.hasOwnProperty(controlKey)) {
        const c = container.controls[controlKey];
        // If it is a FormGroup, process its child controls.
        if (c instanceof FormGroup) {
          const childMessages = this.processMessages(c);
          Object.assign(messages, childMessages);
        } else {
          // Only validate if there are validation messages for the control
          if (this.validationMessages[controlKey]) {
            messages[controlKey] = '';
            if ((c.dirty || c.touched) && c.errors) {
              Object.keys(c.errors).map(messageKey => {
                if (this.validationMessages[controlKey][messageKey]) {
                  messages[controlKey] += this.validationMessages[controlKey][messageKey] + ' ';
                }
              });
            }
          }
        }
      }
    }
    return messages;
  }

}

```

* `shared/number.validtor.ts`

__src\app\shared\number.validator.ts__

```typescript number.validator.ts
import { AbstractControl, ValidatorFn } from '@angular/forms';

export class NumberValidators {

    static range(min: number, max: number): ValidatorFn {
        return (c: AbstractControl): { [key: string]: boolean } | null => {
            if (c.value && (isNaN(c.value) || c.value < min || c.value > max)) {
                return { 'range': true };
            }
            return null;
        };
    }
}

```

* Add `ReactieFormsModule` to `shared.module`

__src\app\shared\shared.module.ts__

```diff shared.module.ts
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
-import { FormsModule } from '@angular/forms';
+import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CriteriaComponent } from './criteria/criteria.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
+   ReactiveFormsModule
  ],
  declarations: [CriteriaComponent],
  exports: [
    CommonModule,
    FormsModule,
+   ReactiveFormsModule,
    CriteriaComponent
  ]
})
export class SharedModule { }

```

### Step 2. Create a new  module `video-consoles`.

```bash
$ ng g m video-consoles
```

### Step 3. Create `app/video-consoles/video-console.model.ts`

__src\app\video-consoles\video-console.model.ts__

```typescript
export interface VideoConsoleModel {
  id: number | null;
  name: string;
  code: string;
  description: string;
  rating: number;
  price?: number;
}

```

### Step 4. Create video-console.service.ts

```bash
$ ng g s video-consoles/video-console --skipTests

```

__src\app\video-consoles\video-console.service.ts__

```typescript
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
  private videoConsoles: VideoConsoleModel[];

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
    if (this.videoConsoles) {
      return of(this.videoConsoles);
    }
    return this.http.get<VideoConsoleModel[]>(this.videoconsolesUrl)
      .pipe(
        tap(this.logger.logJSON),
        tap(data => this.videoConsoles = data),
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
      tap(data => {
        this.videoConsoles.push(data);
      }),
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
      tap(_ => {
        const foundIndex = this.videoConsoles.findIndex(item => item.id === id);
          if (foundIndex > -1) {
            this.videoConsoles.splice(foundIndex, 1);
          }
      }),
      catchError(this.errorHandler.handleError)
    )
  }

  updateVideoConsole(videoConsole: VideoConsoleModel): Observable<VideoConsoleModel> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    const url = `${this.videoconsolesUrl}/${videoConsole.id}`;
    return this.http.put<VideoConsoleModel>(url, videoConsole, { headers })
      .pipe(
        tap(this.logger.logJSON),
        tap(() => {
          const foundIndex = this.videoConsoles.findIndex(item => item.id === videoConsole.id);
          if (foundIndex > -1) {
            this.videoConsoles[foundIndex] = videoConsole;
          }
        }),
        map(() => videoConsole),
        catchError(this.errorHandler.handleError)
      );
  }
}

```

* Register service on `video-consoles.module.ts`

__src\app\video-consoles\video-consoles.module.ts__

```diff
import { NgModule } from '@angular/core';
+import { SharedModule } from '../shared/shared.module';
-import { CommonModule } from '@angular/common';

+import { VideoConsoleService } from './video-console.service';

@NgModule({
  imports: [
-   CommonModule
+   SharedModule
  ],
  declarations: [],
  providers: [
+   VideoConsoleService
  ]
})
export class VideoConsolesModule { }

```

### Step 5. Create `video-console-edit.component`

```bash
$ ng g c video-consoles/video-console-edit --module=video-consoles --skipTests
```

__src\app\video-consoles\video-console-edit\video-console-edit.component.html__

```html
<div class="card" *ngIf="videoConsole">
  <div class="card-body">
    <form novalidate (ngSubmit)="saveVideoConsole()" [formGroup]="videoConsoleForm">
      <fieldset>
        <div class="form-group row">
          <label class="col-md-3 col-form-label" for="videoConsoleNameId">videoConsole Name</label>

          <div class="col-md-9">
            <input [ngClass]="{'is-invalid': displayMessage.videoConsoleName }"
                   class="form-control"
                   id="videoConsoleNameId"
                   type="text"
                   placeholder="Name (required)"
                   formControlName="videoConsoleName"
                   (blur)="blur()" />
            <span class="invalid-feedback" *ngIf="displayMessage.videoConsoleName">
              {{displayMessage.videoConsoleName}}
            </span>
          </div>
        </div>

        <div class="form-group row">
          <label class="col-md-3 col-form-label" for="videoConsoleCodeId">videoConsole Code</label>

          <div class="col-md-9">
            <input [ngClass]="{'is-invalid': displayMessage.videoConsoleCode}"
                   class="form-control"
                   id="videoConsoleCodeId"
                   type="text"
                   placeholder="Code (required)"
                   formControlName="videoConsoleCode"
                   (blur)="blur()" />
            <span class="invalid-feedback" *ngIf="displayMessage.videoConsoleCode">
              {{displayMessage.videoConsoleCode}}
            </span>
          </div>
        </div>

        <div class="form-group row">
          <label class="col-md-3 col-form-label" for="ratingId">Rating (1-5)</label>

          <div class="col-md-9">
            <input [ngClass]="{'is-invalid': displayMessage.rating}"
                   class="form-control"
                   id="ratingId"
                   type="text"
                   placeholder="Rating"
                   formControlName="rating" />
            <span class="invalid-feedback" *ngIf="displayMessage.rating">
              {{displayMessage.rating}}
            </span>
          </div>
        </div>

        <div class="form-group row">
          <label class="col-md-3 col-form-label" for="descriptionId">Description</label>

          <div class="col-md-9">
            <textarea [ngClass]="{'is-invalid': displayMessage.description}"
                      class="form-control"
                      id="descriptionId"
                      placeholder="Description"
                      rows=3
                      formControlName="description">
            </textarea>
            <span class="invalid-feedback" *ngIf="displayMessage.description">
              {{ displayMessage.description}}
            </span>
          </div>
        </div>

        <div class="form-group">
          <div class="col-md-10 col-md-offset-2">
            <span>
              <button class="btn btn-primary" type="submit" style="width:80px;margin-right:10px" [disabled]="!videoConsoleForm.valid || !videoConsoleForm.dirty">
                Save
              </button>
            </span>
            <span>
              <button class="btn btn-light" type="button" style="width:80px;margin-right:10px" (click)="cancelEdit()">
                Cancel
              </button>
            </span>
            <span>
              <button class="btn btn-light" type="button" style="width:80px" (click)="deletevideoConsole()">
                Delete
              </button>
            </span>
          </div>
        </div>
      </fieldset>
    </form>
  </div>
</div>
<div *ngIf="errorMessage" class="alert alert-danger">
  Error: {{ errorMessage }}
</div>

```

__src\app\video-consoles\video-console-edit\video-console-edit.component.ts__

```typescript
import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

import { VideoConsoleModel } from '../video-console.model';

import { Subscription } from 'rxjs';

import { GenericValidator } from '../../shared/generic.validator';
import { NumberValidators } from '../../shared/number.validator';
import { VideoConsoleService } from '../video-console.service';


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

    this.sub = this.videoConsoleService.selectedVideoConsoleChanges$
      .subscribe(
        (selectedVideoConsole) => this.displayVideoConsole(selectedVideoConsole)
      );

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
          () => this.videoConsoleService.changeSelectedVideoConsole(null),
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
            (vc) => this.videoConsoleService.changeSelectedVideoConsole(vc),
            (err: any) => this.errorMessage = err.error,
          );
      } else {
        this.videoConsoleService.updateVideoConsole(vc)
          .subscribe(
            (vc) => this.videoConsoleService.changeSelectedVideoConsole(vc),
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


### Step 6. Create `video-console-list.component`

```bash
$ ng g c video-consoles/video-console-list --module=video-consoles --skipTests
```

__src\app\video-consoles\video-console-list\video-console-list.component.html__

```html
<div class="card">
  <div class="card-body" *ngIf="videoConsoles?.length">
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
<div *ngIf="errorMessage" class="alert alert-danger">
  Error: {{ errorMessage }}
</div>

```

__src\app\video-consoles\video-console-list\video-console-list.component.ts__

```typescript
import { Component, OnInit, OnDestroy } from '@angular/core';

import { VideoConsoleModel } from '../video-console.model';

import { Subscription } from 'rxjs';
import { VideoConsoleService } from '../video-console.service';

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

  constructor(private videoConsoleService: VideoConsoleService) { }

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
    this.displayCode = value;
  }

  newVideoConsole(): void {
    this.videoConsoleService.changeSelectedVideoConsole(this.videoConsoleService.newVideoConsole());
  }

  videoConsoleSelected(videoConsole: VideoConsoleModel) : void {
    this.videoConsoleService.changeSelectedVideoConsole(videoConsole);
  }
}

```

### Step 7. Create video-console-board.component

```bash
$ ng g c video-consoles/video-console-board --module=video-consoles --skipTests
```

__src\app\video-consoles\video-console-board\video-console-board.component.html__

```html
<div class="row">
  <div class="col-4">
    <app-video-console-list></app-video-console-list>
  </div>
  <div class="col-8">
    <app-video-console-edit></app-video-console-edit>
  </div>
</div>

```
* No need to modify typescript component code.

### Step 8. Create routes for module.

__src\app\video-consoles\video-consoles.module.ts__

```diff vide-consoles.module
import { NgModule } from '@angular/core';
+import { RouterModule, Routes } from '@angular/router';

import { SharedModule } from '../shared/shared.module';


import { VideoConsoleService } from './video-console.service';
import { VideoConsoleEditComponent } from './video-console-edit/video-console-edit.component';
import { VideoConsoleListComponent } from './video-console-list/video-console-list.component';
import { VideoConsoleBoardComponent } from './video-console-board/video-console-board.component';

+const routes: Routes = [
+  { path: '', component: VideoConsoleBoardComponent }
+];

@NgModule({
  imports: [
    SharedModule,
+   RouterModule.forChild(routes)
  ],
  declarations: [VideoConsoleEditComponent, VideoConsoleListComponent, VideoConsoleBoardComponent],
  providers: [
    VideoConsoleService
  ]
})
export class VideoConsolesModule { }

```

### Step 9. Before we go ahead we have to refactor as well our mocked data services. We have to remove `game-data` and create `app-data`.

* Create `app/app-data.ts`

__src\app\app-data.ts__

```typescript
import { InMemoryDbService } from 'angular-in-memory-web-api';

import { GameModel } from './games/game.model';
import { VideoConsoleModel } from './video-consoles/video-console.model';

export class AppData implements InMemoryDbService {
  createDb() {
    const games: GameModel[] = [
      {
        'id': 234,
        'name': 'Super Mario Bros',
        'code': 'PLA-0',
        'release': '13 September 1985',
        'description': 'Platform game for all family',
        'price': 99.99,
        'category': 'platforms',
        'rating': 4.3,
        'imageUrl': 'https://vignette.wikia.nocookie.net/videojuego/images/e/e2/Super_Mario_Bros..jpg/revision/latest?cb=20080402052328'
      },
      {
        'id': 24,
        'name': 'Legend of Zelda',
        'code': 'QU-0',
        'release': '21 February 1986',
        'description': 'Adventure game for all family',
        'price': 89.79,
        'category': 'quest',
        'rating': 4.7,
        'imageUrl': 'http://omegacenter.es/blog/wp-content/uploads/2015/12/zelda12.png'
      },
      {
        'id': 44,
        'name': 'Sonic',
        'code': 'PLA-1',
        'release': '23 June 1991',
        'description': 'Speed and fun',
        'price': 96.67,
        'category': 'platforms',
        'rating': 4.7,
        'imageUrl': 'https://cdn.arstechnica.net/wp-content/uploads/2018/07/sonicmaniaplus-logo.jpg'
      },
    ];

    const videoconsoles: VideoConsoleModel[] = [
      {
        name: 'Nintendo Entertaiment System',
        code: 'NES-0',
        description: 'One of the most retro video console ever',
        id: 1,
        rating: 3,
      },
      {
        name: 'Atari',
        code: 'A-2',
        description: 'Atari forever',
        id: 2,
        rating: 1,
      },
      {
        name: 'Mega Drive',
        code: 'MD',
        description: 'The first 16 bit console?',
        id: 3,
        rating: 4,
      },
    ];
    return {
      games,
      videoconsoles
    };
  }
}

```

* Remove `app/games/game-data` __src\app\games\game-data.ts__

### Step 10. Update app.module.ts

__src\app\app.module.ts__

```diff
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';

import { AppRoutingModule } from './app-routing.module';

// Imports for in-memory web-api
import { HttpClientInMemoryWebApiModule } from 'angular-in-memory-web-api';
-import { GameData } from './games/game-data';
+import { AppData } from './app-data';

import { AppComponent } from './app.component';
import { MenuComponent } from './home/menu.component';
import { WelcomeComponent } from './home/welcome.component';
import { ShellComponent } from './home/shell.component';
import { PageNotFoundComponent } from './home/page-not-found.component';

import { CoreModule } from './core/core.module';

/* Feature Modules */
import { UserModule } from './user/user.module';

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
-   HttpClientInMemoryWebApiModule.forRoot(GameData),
+   HttpClientInMemoryWebApiModule.forRoot(AppData),
    CoreModule,
    UserModule,
    AppRoutingModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }

```

### Step 11. We have to modify `app-routing.module.ts`

__src\app\app-routing.module.ts__

```diff
@NgModule({
  imports: [
    RouterModule.forRoot([
      {
        path: '',
        component: ShellComponent,
        children: [
          { path: 'welcome', component: WelcomeComponent },
          {
            path: 'games',
            loadChildren: () => import('./games/games.module').then(m => m.GamesModule)
          },
+         {
+           path: 'videoconsoles',
+           loadChildren: () => import('./video-consoles/video-consoles.module').then(m => m.VideoConsolesModule)
+         },
          { path: '', redirectTo: 'welcome', pathMatch: 'full' },
        ]
      },
      { path: '**', component: PageNotFoundComponent }
    ])
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
```

### Step 12. For last lets create an entry to navigate to this new route.


__src/app/home/menu.component.html__

```diff
<nav class="navbar navbar-expand-sm bg-light navbar-light">
  <ul class="navbar-nav nav-full-width">
    <li routerLinkActive="active">
        <a routerLink='/welcome'>Home</a>
    </li>
    <li routerLinkActive="active" [routerLinkActiveOptions]="{ exact: true }">
        <a routerLink='/games'>Game List</a>
    </li>
    <li routerLinkActive="active" [routerLinkActiveOptions]="{ exact: true }">
        <a routerLink='/games/summary'>Game Summary List</a>
    </li>
    <li routerLinkActive="active" [routerLinkActiveOptions]="{ exact: true }">
        <a [routerLink]="['/games', 0, 'edit']">Add Game</a>
    </li>
+    <li routerLinkActive="active" [routerLinkActiveOptions]="{ exact: true }">
+      <a routerLink='/videoconsoles'>Video Consoles</a>
+    </li>
  </ul>
  <ul class="navbar-nav nav-end">
      <li *ngIf="isLoggedIn">
          <a routerLink='/login'>Welcome {{ userName }}</a>
      </li>
      <li *ngIf="!isLoggedIn">
          <a routerLink='/login'>Log In</a>
      </li>
      <li *ngIf="isLoggedIn">
          <a (click)="logOut()" style="cursor: pointer">Log Out</a>
      </li>
  </ul>
</nav>

```

### Step 13. Now we are going to add a little change into `src/app/user/login.component`

__src\app\user\login.component.html__

```diff login.component.html
<input class="form-control"
          id="userNameId"
-         type="text"
+         [type]="maaskUserName ? 'password' : 'text'"
          placeholder="User Name (required)"
          required
          ngModel
          name="userName"
          #userNameVar="ngModel" />
```

```diff login.component.html
</form>
+ <div class="row">
+   <div class="form-check col-7">
+     <label>
+       <input class="form-check-input"
+              type="checkbox"
+              (change)="checkChanged($event.target.checked)"
+              [checked]="maskUserName">
+       Mask user name
+     </label>
+   </div>
+ </div>
  <div class="has-error" *ngIf="errorMessage">{{errorMessage}}</div>
```

__src\app\user\login.component.ts__

```diff
....
+ maskUserName: boolean;

  constructor(
    private authService: AuthService,
    private router: Router
  ) {
  }

  cancel(): void {
    this.router.navigate(['welcome']);
  }
+
+ checkChanged(value: boolean): void {
+   this.maskUserName = value;
+ }
  ....
```
