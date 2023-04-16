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

## In this demo we are going to register some services into core module.

> Reference: https://angular.io/guide/dependency-injection-in-action

* CoreModule should definitely contain your singleton services, single-instance components, and export any third-party modules needed in AppModule.

* NOTE: The services that we are going to create right now are stateless so they can be registered into shared module. We will refactor this in future demos.

### Step 1. Log In Memory Web API 

Since we are using `angular-in-memory-web-api`, there is no network stuff happening, this is because is using interceptors under the hood. So, to notice what is going on we are going to create a logger service.

Create __src/app/core/http-data-logger.service.ts__

```bash
ng g s core/http-data-logger --skip-tests
```

* Update `http-data-logger.service.ts`

```typescript 
import { InjectionToken } from '@angular/core';

export const HTTP_DATA_LOGGER = new InjectionToken<string>('HttpDataLogger');

export const logJSON = (data: any) => console.log(JSON.stringify(data));

```

> Injection Token Use Cases: https://stackoverflow.com/questions/58206223/injection-tokens-in-angular

### Step 2. Now we are going to register into core module providers.

* Update `core.module.ts`

```typescript 
import {
  NgModule
} from '@angular/core';
import { CommonModule } from '@angular/common';

import { HTTP_DATA_LOGGER, logJSON } from './http-data-logger.service';

@NgModule({
  imports: [
    CommonModule
  ],
  declarations: [],
  providers: [
    {
      provide: HTTP_DATA_LOGGER,
      useValue: {
        logJSON
      }
    }
  ]
})
export class CoreModule { }

```
### Step 3. To use this service in our application we have to import the core module, into app module.

* Update `app.module.ts`

```diff 
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';

import { AppRoutingModule } from './app-routing.module';

// Imports for in-memory web-api
import { HttpClientInMemoryWebApiModule } from 'angular-in-memory-web-api';
import { GameData } from './games/game-data';

import { AppComponent } from './app.component';
import { MenuComponent } from './home/menu.component';
import { WelcomeComponent } from './home/welcome.component';
import { ShellComponent } from './home/shell.component';
import { PageNotFoundComponent } from './home/page-not-found.component';

+import { CoreModule } from './core/core.module';

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
    HttpClientInMemoryWebApiModule.forRoot(GameData),
+   CoreModule,
    UserModule,
    AppRoutingModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }

```
### Step 4. Now we can consume it.

* Update `game.service.ts`

```diff 
-import { Injectable } from '@angular/core';
+import { Injectable, Inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { Observable } from 'rxjs';
+import { tap } from 'rxjs/operators'

import { GameModel } from './game.model';
+import { HTTP_DATA_LOGGER } from '../core/http-data-logger.service';

@Injectable()
export class GameService {
  private gamesUrl = 'api/games';

  constructor(
    private http: HttpClient,
+   @Inject(HTTP_DATA_LOGGER) private logger: any
    ) { }

  getGames(): Observable<GameModel[]> {
    return this.http.get<GameModel[]>(this.gamesUrl)
+     .pipe(
+       tap(this.logger.logJSON)
+     );
  }
}

```
