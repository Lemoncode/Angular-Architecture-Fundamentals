# I18nExample

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

# In this demo we are going to serve multiple langauges depending on URL parameters

* We start from previous demo code.

#### Add support for server side rendering

* https://github.com/angular/angular-cli/wiki/stories-universal-rendering

### Step 1. Install dependencies

```bash
$ npm install --save @angular/platform-server @nguniversal/module-map-ngfactory-loader express @nguniversal/express-engine
$ npm install --save-dev ts-loader webpack-cli
```

### Step 2. Prepare app for Universal Rendering

#### `src/app/app.module.ts`

```typescript
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { TemplatesComponent } from './templates/templates.component';

@NgModule({
  declarations: [
    AppComponent,
    TemplatesComponent
  ],
  imports: [
    BrowserModule.withServerTransition({ appId: 'my-App' })
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }

```

#### `src/app/app.server.module.ts`

```typescript
import {NgModule} from '@angular/core';
import {ServerModule} from '@angular/platform-server';
import {ModuleMapLoaderModule} from '@nguniversal/module-map-ngfactory-loader';

import {AppModule} from './app.module';
import {AppComponent} from './app.component';

@NgModule({
  imports: [
    // The AppServerModule should import your AppModule followed
    // by the ServerModule from @angular/platform-server.
    AppModule,
    ServerModule,
    ModuleMapLoaderModule // <-- *Important* to have lazy-loaded routes work
  ],
  // Since the bootstrapped component is not inherited from your
  // imported AppModule, it needs to be repeated here.
  bootstrap: [AppComponent],
})
export class AppServerModule {}

```

### Step 3. Cretae a server "main" file and tsconfig to build it

#### src/main.server.ts

```typescript
export { AppServerModule } from './app/app.server.module';
```

#### src/tsconfig.server.json

```json
{
  "extends": "../tsconfig.json",
  "compilerOptions": {
    "outDir": "../out-tsc/app",
    "baseUrl": "./",
    // Set the module format to "commonjs":
    "module": "commonjs",
    "types": []
  },
  "exclude": [
    "test.ts",
    "**/*.spec.ts"
  ],
  // Add "angularCompilerOptions" with the AppServerModule you wrote
  // set as the "entryModule".
  "angularCompilerOptions": {
    "entryModule": "app/app.server.module#AppServerModule"
  }
}

```

### Step 4. Create a new target in angular.json

```json
"architect": {
  "build": { ... }
  "server": {
    "builder": "@angular-devkit/build-angular:server",
    "options": {
      "outputPath": "dist/i18nExample-server",
      "main": "src/main.server.ts",
      "tsConfig": "src/tsconfig.server.json"
    }
  }
}
```

* Modify configurations/productions in `angular.json` to align with node server.

```diff
"production-es": {
              "fileReplacements": [
                {
                  "replace": "src/environments/environment.ts",
                  "with": "src/environments/environment.prod.ts"
                }
              ],
              "optimization": true,
              "outputHashing": "all",
              "sourceMap": false,
              "extractCss": true,
              "namedChunks": false,
              "aot": true,
              "extractLicenses": true,
              "vendorChunk": false,
              "buildOptimizer": true,
+             "outputPath": "dist/i18nExample/es/",
              "baseHref": "/es/",
              "i18nFile": "src/locale/messages.es.xlf",
              "i18nFormat": "xlf",
              "i18nLocale": "es",
              "i18nMissingTranslation": "error"
            },
            "production-en": {
              "fileReplacements": [
                {
                  "replace": "src/environments/environment.ts",
                  "with": "src/environments/environment.prod.ts"
                }
              ],
              "optimization": true,
              "outputHashing": "all",
              "sourceMap": false,
              "extractCss": true,
              "namedChunks": false,
              "aot": true,
              "extractLicenses": true,
              "vendorChunk": false,
              "buildOptimizer": true,
+             "outputPath": "dist/i18nExample/en/",
              "baseHref": "/en/",
              "i18nFile": "src/locale/messages.en.xlf",
              "i18nFormat": "xlf",
              "i18nLocale": "en",
              "i18nMissingTranslation": "error"
            }
```

#### Building the bundle

```bash
$ ng run i18nExample:server
```

### Step 5. Setting up an Express Server to run Universal bundles

#### ./server.ts

```typescript
import 'zone.js/dist/zone-node';
import 'reflect-metadata';

import { enableProdMode } from '@angular/core';
import { ngExpressEngine } from '@nguniversal/express-engine';

import * as express from 'express';
import { join } from 'path';

import { provideModuleMap } from '@nguniversal/module-map-ngfactory-loader';

enableProdMode();

const app = express();

const PORT = process.env.PORT || 4000;
const DIST_FOLDER = join(process.cwd(), 'dist');

const { AppServerModuleNgFactory, LAZY_MODULE_MAP } = require('./dist/i18nExample-server/main');

app.engine('html', ngExpressEngine({
  bootstrap: AppServerModuleNgFactory,
  providers: [
    provideModuleMap(LAZY_MODULE_MAP),
  ],
}))

app.set('view engine', 'html');
app.set('views', join(DIST_FOLDER, 'i18nExample'));

app.get('*.*', express.static(join(DIST_FOLDER, 'i18nExample')));

app.get('*', (req, res) => {
  console.log('request url: ', req.url);
  const supportedLocales = ['en', 'es'];
  const defaultLocale = 'en';
  const matches = req.url.match(/^\/([a-z]{2}(?:-[A-Z]{2})?)\//);
  const locale = (matches && supportedLocales.indexOf(matches[1]) !== - 1) ? matches[1] : defaultLocale;
  console.log('locale resolve: ', locale);
  res.render(`${locale}/index`, {req});
});

app.listen(PORT, () => {
  console.log(`Node server listening on http://localhost:${PORT}`);
});

```


### Step 6. Setup a webpack config to handle this Node server.ts file and serve your application

#### ./webpack.server.config.js

```javascript
const path = require('path');
const webpack = require('webpack');

module.exports = {
  mode: 'none',
  entry: {
    server: './server.ts',
  },
  target: 'node',
  resolve: { extensions: ['.ts', '.js'] },
  optimization: {
    minimize: false
  },
  output: {
    // Puts the output at the root of the dist folder
    path: path.join(__dirname, 'dist'),
    filename: '[name].js'
  },
  module: {
    rules: [
      { test: /\.ts$/, loader: 'ts-loader' },
      {
        // Mark files inside `@angular/core` as using SystemJS style dynamic imports.
        // Removing this will cause deprecation warnings to appear.
        test: /(\\|\/)@angular(\\|\/)core(\\|\/).+\.js$/,
        parser: { system: true },
      },
    ]
  },
  plugins: [
    new webpack.ContextReplacementPlugin(
      // fixes WARNING Critical dependency: the request of a dependency is an expression
      /(.+)?angular(\\|\/)core(.+)?/,
      path.join(__dirname, 'src'), // location of your src
      {} // a map of your routes
    ),
    new webpack.ContextReplacementPlugin(
      // fixes WARNING Critical dependency: the request of a dependency is an expression
      /(.+)?express(\\|\/)(.+)?/,
      path.join(__dirname, 'src'),
      {}
    )
  ]
}

```

### Step 7. Modify package.json scripts as follows:

```json
"scripts": {
    ...
    "build:ssr": "ng build --prod --configuration=production-es && ng build --prod --configuration=production-en",
    "serve:ssr": "node dist/server.js",
    "webpack:server": "webpack --config webpack.server.config.js"
  },
```

* To test: 

```important
http://localhost:4000/es/
```
