# In this demo we are going to use server side rendering

### Step 1. Create the app

```bash
$ ng new universalApp --routing
```

### Step 2. Generate universal code and update NgModules

```bash
$ ng generate universal --client-project universalApp

# New Render Engine
$ npm install @nguniversal/express-engine

# If using lazy loading
$ npm install @nguniversal/module-map-ngfactory-loader
```

* The browser app module should have the following imports in `src/app/app.module`:

```diff app.module.ts
-import { BrowserModule } from '@angular/platform-browser';
+import { BrowserModule, BrowserTransferStateModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule.withServerTransition({ appId: 'serverApp' }),
+   BrowserTransferStateModule,
    AppRoutingModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }

```

* Update the `src/app/app.server.module.ts` with the following code:

```diff app.server.module.ts
import { NgModule } from '@angular/core';
-import { ServerModule } from '@angular/platform-server';
+import { ServerModule, ServerTransferStateModule } from '@angular/platform-server';
+import { ModuleMapLoaderModule } from '@nguniversal/module-map-ngfactory-loader';

import { AppModule } from './app.module';
import { AppComponent } from './app.component';

@NgModule({
  imports: [
    AppModule,
    ServerModule,
+   ServerTransferStateModule,
+   ModuleMapLoaderModule
  ],
  bootstrap: [AppComponent],
})
export class AppServerModule {}

```

### Step 3. Create an Express Server

```bash
$ npm install --save-dev express webpack ts-loader
```

* Create `server.ts` in the project root.

```typescript
// These are important and needed before anything else
import 'zone.js/dist/zone-node';
import 'reflect-metadata';

import { enableProdMode } from '@angular/core';

import * as express from 'express';
import { ngExpressEngine } from '@nguniversal/express-engine';
import { provideModuleMap } from '@nguniversal/module-map-ngfactory-loader';

import { join } from 'path';

const PORT = process.env.PORT || 4000;
const DIST_FOLDER = join(process.cwd(), 'dist');
const APP_NAME = 'universalApp';

const {
  AppServerModuleNgFactory,
  LAZY_MODULE_MAP
} = require(`./dist/${APP_NAME}-server/main`);

enableProdMode();

const app = express();

// Set the engine
app.engine(
  'html',
  ngExpressEngine({
    bootstrap: AppServerModuleNgFactory,
    providers: [provideModuleMap(LAZY_MODULE_MAP)]
  })
);

app.set('view engine', 'html');

app.get('/**/*', (req, res) => {
  res.render(join(DIST_FOLDER, APP_NAME, 'index'), {
    req,
    res
  });
});

app.set('view engine', 'html');
app.set('views', join(DIST_FOLDER, APP_NAME));

// Static Assets
app.get('*.*', express.static(join(DIST_FOLDER, APP_NAME)));

// Point all routes to Universal
app.get('*', (req, res) => {
  res.render('index', { req });
});

// Start Express Server
app.listen(PORT, () => {
  console.log(`Node Express server listening on http://localhost:${PORT}`);
});

```
### Step 4. Create a Webpack Config to Compile the server

* Create `webpack.server.config.js` in the project root.

```javascript
const path = require('path');
const webpack = require('webpack');

const APP_NAME = 'universalApp';

module.exports = {
  entry: { server: './server.ts' },
  resolve: { extensions: ['.js', '.ts'] },
  mode: 'none',
  target: 'node',
  externals: [/(node_modules|main\..*\.js)/],
  output: {
    path: path.join(__dirname, `dist/${APP_NAME}`),
    filename: '[name].js'
  },
  module: {
    rules: [
      { test: /\.ts$/, loader: 'ts-loader' },
      {
        test: /(\\|\/)@angular(\\|\/)core(\\|\/).+\.js$/,
        parser: { system: true }
      }
    ]
  },
  plugins: [
    new webpack.ContextReplacementPlugin(
      /(.+)?angular(\\|\/)core(.+)?/,
      path.join(__dirname, 'src'), // location of your src
      {} // a map of your routes
    ),
    new webpack.ContextReplacementPlugin(
      /(.+)?express(\\|\/)(.+)?/,
      path.join(__dirname, 'src'),
      {}
    )
  ]
};
```

### Step 5. Build scripts

* Update `package.json`

```json
"scripts": {
  // ... omitted
  "build:ssr": "ng build --prod && ng run universalApp:server && npm run webpack:server",
  "serve:ssr": "node dist/universalApp/server.js",
  "webpack:server": "webpack --config webpack.server.config.js"
},
```
