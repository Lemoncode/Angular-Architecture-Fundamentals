## Add video-game-console-module for ngrx refactor.


### Step 1. Before get started with theh new video-consoles module, lets add some new elements to shared module.

* `shared/generic-validator.ts` 

```typescript generic-validator.ts
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
$ ng g m video-consoles --spec false
```

### Step 3. Create `app/video-consoles/video-console.model.ts`

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
$ ng g s video-consoles/video-console --module=video-consoles --spec false

```

```typescript video-console.service.ts
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

```diff video-consoles.module.ts
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
$ ng g c video-consoles/video-console-edit --module=video-consoles --spec false
```

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
