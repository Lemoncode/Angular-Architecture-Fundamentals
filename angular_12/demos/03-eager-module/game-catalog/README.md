# GameCatalog

This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 6.0.8.

## Development server

Run `ng serve` for a dev server. Navigate to `http://localhost:4200/`. The app will automatically reload if you change any of the source files.

## Code scaffolding

Run `ng generate component component-name` to generate a new component. You can also use `ng generate directive|pipe|service|class|guard|interface|enum|module`.

## Build

Run `ng build` to build the project. The build artifacts will be stored in the `dist/` directory. Use the `--prod` flag for a production build.

## Running unit tests

Run `ng test` to execute the unit tests via [Karma](https://karma-runner.github.io).

## Running end-to-end tests

Run `ng e2e` to execute the end-to-end tests via [Protractor](http://www.protractortest.org/).

## Further help

To get more help on the Angular CLI use `ng help` or go check out the [Angular CLI README](https://github.com/angular/angular-cli/blob/master/README.md).

## In this demo we are going to create a eager module. In Angular basically exists two types of feature modules the eager modules and lazy modules. The main difference between them is the way the framework is going to deal with its load. Eager modules are loaded with main module, so they are ready on app bootstrapping.

* We must place singleton services into core module, we can discuss if `auth.service` and `auth-guard.service` must be there instead in user modules, but since is an eager module, and will load with `app.module`, we will get just an instance of each service so it's fine to have this way.  

> https://medium.com/@lifei.8886196/eager-loading-lazy-loading-and-pre-loading-in-angular-2-what-when-and-how-798bd107090c

### Step 1. Create `user` model.

Create __src/app/user/user.model.ts__

```typescript
export interface UserModel {
  id: number;
  userName: string;
  isAdmin: boolean;
}
```

### Step 2. Create `auth` service.

```bash
$ ng g s user/auth --flat --skip-tests
```

```typescript auth.service.ts
import { Injectable } from '@angular/core';

import { UserModel } from './user.model';

@Injectable()
export class AuthService {
  currentUser: UserModel | null;
  redirectUrl: string;

  constructor() { }

  isLoggedIn(): boolean {
    return !!this.currentUser;
  }

  login(userName: string, password: string): void {
    // TODO: Implement backend service
    this.currentUser = {
      id: 34,
      isAdmin: false,
      userName: userName,
    };
  }

  logout(): void {
    this.currentUser = null;
  }
}

```

### Step 3. Create `auth-guard` service.

```bash
$ ng g s user/auth-guard --skip-tests
```

```typescript auth-guard.serevice.ts
import { Injectable } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
  Router,
  CanActivate
} from '@angular/router';

import { AuthService } from './auth.service';

@Injectable()
export class AuthGuardService implements CanActivate {
  constructor(
    private authService: AuthService,
    private router: Router
  ) { }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean  {
    return this.checkLoggedIn(state.url);
  }

  checkLoggedIn(url: string): boolean {
    if(this.authService.isLoggedIn()) {
      return true;
    }

    this.authService.redirectUrl = url;
    this.router.navigate(['/login']);
    return false;
  }
}

```

### Step 4. Update shared module

Since there are common angular functionality that will be consumed in other modules this is the right place to re export this functionality. 

__src/app/shared/shared.module.ts__

```diff
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
+import { FormsModule } from '@angular/forms';

@NgModule({
  imports: [
    CommonModule,
+   FormsModule
  ],
  declarations: [],
  exports: [
+   CommonModule,
+   FormsModule
  ]
})
export class SharedModule { }

```

### Step 5. Update user module

Now we can import the shared module and bring all its export features.

```diff
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
+import { SharedModule } from '../shared/shared.module';

@NgModule({
  declarations: [],
  imports: [
-   CommonModule,
+   SharedModule
  ]
})
export class UserModule { }

```

### Step 6. Now we can build the login component.

```bash
ng g c user/login --flat --module user --skip-tests 
```

```html 
<!-- login.component.html -->
<div class='container'>
  <div class="panel-heading">
    {{pageTitle}}
  </div>
  <form class="form-horizontal" novalidate (ngSubmit)="login(loginForm)" #loginForm="ngForm" autocomplete="off">
    <fieldset>
      <div class="form-group" [ngClass]="{'has-error': (userNameVar.touched ||
                              userNameVar.dirty) &&
                              !userNameVar.valid }">
        <label class="col-md-2 control-label" for="userNameId">User Name</label>

        <div class="col-md-8">
          <input class="form-control" id="userNameId" type="text" placeholder="User Name (required)" required ngModel
            name="userName" #userNameVar="ngModel" />
          <span class="help-block" *ngIf="(userNameVar.touched ||
                                               userNameVar.dirty) &&
                                               userNameVar.errors">
            <span *ngIf="userNameVar.errors.required">
              User name is required.
            </span>
          </span>
        </div>
      </div>

      <div class="form-group" [ngClass]="{'has-error': (passwordVar.touched ||
                              passwordVar.dirty) &&
                              !passwordVar.valid }">
        <label class="col-md-2 control-label" for="passwordId">Password</label>

        <div class="col-md-8">
          <input class="form-control" id="passwordId" type="password" placeholder="Password (required)" required
            ngModel name="password" #passwordVar="ngModel" />
          <span class="help-block" *ngIf="(passwordVar.touched ||
                                               passwordVar.dirty) &&
                                               passwordVar.errors">
            <span *ngIf="passwordVar.errors.required">
              Password is required.
            </span>
          </span>
        </div>
      </div>

      <div class="form-group">
        <div class="col-md-4 col-md-offset-2">
          <span>
            <button class="btn btn-primary" type="submit" style="width:80px;margin-right:10px" [disabled]="!loginForm.valid">
              Log In
            </button>
          </span>
          <span>
            <a class="btn btn-default" (click)="cancel()">
              Cancel
            </a>
          </span>
        </div>
      </div>
    </fieldset>
  </form>
  <div class="has-error" *ngIf="errorMessage">{{errorMessage}}</div>
</div>

```

```typescript login.component.ts
import { Component } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';

import { AuthService } from './auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  errorMessage: string;
  pageTitle = 'Log In';

  constructor(
    private authService: AuthService,
    private router: Router
  ) {
  }

  cancel(): void {
    this.router.navigate(['welcome']);
  }

  login(loginForm: NgForm): void {
    if (loginForm && loginForm.valid) {
      const { userName, password} = loginForm.form.value;
      // TODO: Implement as async / await
      this.authService.login(userName, password);

      if (this.authService.redirectUrl) {
        this.router.navigateByUrl(this.authService.redirectUrl);
      } else {
        // TODO: Navigate to games
      }
    }
  }

}

```

### Step 7. Now it's time to create routes for user.module.ts.

```typescript user.module.ts
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { LoginComponent } from './login.component';
import { AuthService } from './auth.service';
import { AuthGuardService } from './auth-guard.service';

import { SharedModule } from '../shared/shared.module';

@NgModule({
  imports: [
    SharedModule,
    RouterModule.forChild([ // [1]
      { path: 'login', component: LoginComponent }
    ])
  ],
  declarations: [LoginComponent],
  providers: [
    AuthService,
    AuthGuardService
  ]
})
export class UserModule { }

```

1. We are not creating a routing module, since this module has only one root seems to be an overkill.

### Step 8. For last we have to update app.module.ts

```diff app.module.ts
+import { UserModule } from './user/user.module';

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
+   UserModule,
    AppRoutingModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
```
* Lets see if works. Use `http://localhost:4200/login` and check that we move to `login`. Later we will update the navigation menu.

> Add login.component.css
