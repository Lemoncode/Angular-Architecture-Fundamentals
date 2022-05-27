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

## In this demo we are going to create the basic structure of a project following the best practices.

### Step 1. We are going to use `Angular CLI` to start our project. This will seed our app following the best practices.

```bash 
$ ng new game-catalog
```

### Step 2. Now with this on place lets generate the folder structure for our project.

<pre>
project root/
└── src/
    ├── app/
    │   ├── core/
    │   │    ├── core.module.ts
    │   │    ├── exception.service.ts
    │   │    └── user-profile.service.ts
    │   ├── games/
    │   │    ├── game
    │   │    │    └── game.components.ts
    │   │    ├── game-list
    │   │    │    └── game-list.components.ts
    │   │    ├── shared
    │   │    │    ├── game.model.ts
    │   │    │    ├── game.service.ts
    │   │    │    └── game-button.component.ts
    │   │    ├── games.component.model.ts
    │   │    ├── games.module.model.ts
    │   │    └── games-routing.module.model.ts
    │   │    
    │   ├── home/
    │   ├── shared/
    │   │    ├── shared.module.ts
    │   │    ├── start.component.ts
    │   │    └── text-filter.service.ts
    │   ├── user/
    │   │      .....
    │   ├── app.component.ts
    │   ├── app.module.ts
    │   └── app-routing.module.ts
    ├── main.ts
    └── index.html
</pre>

* Inside root folder create the following folders:
  - __home__: These are components related with our landing page. They will load with the main app module. Because they are not going to be reuse across the app we place them in its own folder. We can discuss to move them to its own module, since that they don't belong to a specific domain could be tricky.
  - __core__: All the related services that we want to just inject once in the app.
  - __games__: feature module
    - __shared__: Notice that inside games folder, we have created shared, here we place the common resources for components in module.
  - __shared__: Here we place the reusable app parts.
  - __user__: feature module

* To create the folder structure we are going to use `Angular CLI`

```bash
ng g m core
```

```bash
ng g m games
```

```bash
ng g m user
```

```bash
ng g m shared
```

### Step 3. We are going to add manually the `home` folder, these are the components that will part of root module.

* Create `app/home`

* Inside home create:

```bash
ng g c home/menu --inline-style --flat --skip-tests
```

```bash
 ng g c home/welcome --inline-style --flat --skip-tests
```

```bash
ng g c home/shell --inline-style --flat --skip-tests
```

```bash
ng g c home/page-not-found -s -t --flat --skip-tests
```

### Step 4. Lets add bootstap to have a base of style.

```bash
npm i bootstrap@4.x.x -S
```

* Modify `styles.css` to import bootstrap.

```diff 
+@import "~bootstrap/dist/css/bootstrap.min.css";
```

### Step 5. Add code for welcome.component.ts and welcome.component.html

```html
<div class="jumbotron jumbotron-fluid">
  <div class="container">
    <h1>{{title}}</h1>
    <p>The best site for oldie good games</p>
  </div>
</div>
```

```typescript
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-welcome',
  templateUrl: './welcome.component.html',
  styleUrls: ['./welcome.component.css']
})
export class WelcomeComponent implements OnInit {
  title = 'Game Catalog';
  constructor() { }

  ngOnInit() {
  }

}

```
### Step 6. Place the following code on `page-not-found-component.ts`

```typescript
import { Component } from '@angular/core';

@Component({
  selector: 'app-page-not-found',
  template: `
    <h1>Lose yourself...</h1>
  `,
  styles: []
})
export class PageNotFoundComponent {}

```

### Step 7. Add `menu.component.html` and `menu.component.ts`

```html
<nav class="navbar navbar-expand-sm bg-light navbar-light">
  <ul class="navbar-nav">
    <li class="nav-item active">
      <a class="nav-link" href="#">Home</a>
    </li>
    <li class="nav-item">
      <a class="nav-link" href="#">Game List</a>
    </li>
    <li class="nav-item">
      <a class="nav-link" href="#">Add Game</a>
    </li>
  </ul>
  <ul class="navbar-nav float-right">
    <li class="nav-item">
      <a class="nav-link" href="#">Log in</a>
    </li>
  </ul>
</nav>

```

```typescript
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styles: [`
    .nav-full-width {
      width: 100%;
    }

    .nav-end {
      margin-left: auto;
    }
  `]
})
export class MenuComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }

}

```

### Step 7. Now we place the code for `shell.component.html` and `shell.component.ts`, this is the place where the components are injected into router-outlet

```html
<app-menu></app-menu>

<div class="container">
  <router-outlet></router-outlet>
</div>
```

```typescript
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-shell',
  templateUrl: './shell.component.html',
  styles: []
})
export class ShellComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }

}

```

### Step 8. Our `app.component.html` it's going to be just a route container so we have to modify its html

```html app.component.html
<router-outlet></router-outlet>
```

### Step 9. Now we have to modify our `app.module.ts` with some routing to display the changes that we have done.

```typescript app.module.ts
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { AppComponent } from './app.component';
import { MenuComponent } from './home/menu.component';
import { WelcomeComponent } from './home/welcome.component';
import { ShellComponent } from './home/shell.component';
import { PageNotFoundComponent } from './home/page-not-found.component';

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
    RouterModule.forRoot([
      {
        path: '',
        component: ShellComponent,
        children: [
          { path: 'welcome', component: WelcomeComponent },
          { path: '', redirectTo: 'welcome', pathMatch: 'full' }
        ]
      }
    ]),
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }

```
* Lets see if works.

> Add menu fix css to README.md
