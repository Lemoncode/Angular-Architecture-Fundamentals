# GameCatalog

## In this demo we are going to create the main route module. Is a common technique to split our the routes into a new module. With this we honor the SRP and improve maintanibility.

### Step 1. Create `app-routing.module.ts`

```bash
ng g m app-routing --flat
```

Edit as follows **src/app/app-routing.module.ts**

```typescript
import { NgModule } from "@angular/core";
import { RouterModule } from "@angular/router";
import { ShellComponent } from "./home/shell.component";
import { WelcomeComponent } from "./home/welcome.component";
import { PageNotFoundComponent } from "./home/page-not-found.component";

@NgModule({
  imports: [
    RouterModule.forRoot([
      // [2]
      {
        path: "",
        component: ShellComponent,
        children: [
          // [3]
          { path: "welcome", component: WelcomeComponent },
          { path: "", redirectTo: "welcome", pathMatch: "full" },
        ],
      },
      { path: "**", component: PageNotFoundComponent }, // [4]
    ]),
  ],
  exports: [RouterModule], // [1]
})
export class AppRoutingModule {}
```

1. We just want to import `RouterModule` once, so we import here and then exports again, so all directives, services, pipes... will be available on module that imports `app-routing.module.ts`.
2. We just one an instance for routing, but we have to deal with different configs per module, so we have to use `forRoot`.
3. Shell component hosts its own `router-outlet`, so that's why we are using `children` routes here.
4. At the root level we have a wilcard, so when no route matches a not found page will be displayed.

### Step 2. Now we have to change our `app.module.ts` to consume the `app-routing.module.ts`

```diff app.module.ts
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
-import { RouterModule } from '@angular/router';

+import { AppRoutingModule } from './app-routing.module';

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
-   RouterModule.forRoot([
-     {
-       path: '',
-       component: ShellComponent,
-       children: [
-         { path: 'welcome', component: WelcomeComponent },
-         { path: '', redirectTo: 'welcome', pathMatch: 'full' }
-       ]
-     }
-   ]),
+   AppRoutingModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }

```

- Lets see if works.
