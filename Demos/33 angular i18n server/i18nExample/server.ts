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
