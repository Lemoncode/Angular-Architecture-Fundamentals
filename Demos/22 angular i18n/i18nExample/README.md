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

# In this demo we are going to work with i18n internationalization

* By default Angular uses the local `en-US`.
* To set app's locale to another value
```console
ng serve --configuration=fr 
```
> Have a look on how to select the output.
> JIT vs AOT, this is important for localize our apps

## i18n pipes

* Angular pipes can help you with internationalization: the DatePipe, CurrencyPipe, DecimalPipe and PercentPipe use locale data to format data based on the LOCALE_ID.

* By default, Angular only contains locale data for en-US. If you set the value of LOCALE_ID to another locale, you must import locale data for that new locale. The CLI imports the locale data for you when you use the parameter --configuration with ng serve and ng build.

* If you want to import locale data for other languages, you can do it manually:

```typescript
import { registerLocaleData } from '@angular/common';
import localeFr from '@angular/common/locales/fr';

// the second parameter 'fr' is optional
registerLocaleData(localeFr, 'fr'); 
```
* There is additional locale in extra.

## Template translations

1. Mark static text messages in your component templates for translation.
2. An Angular i18n tool extracts the marked text into a translation source file. (The Angular CLI will do this for us)
3. A translator (or you) edits that file, translating the extracted text into the target language.
4. The Angular compiler imports the completed translation files, replaces the original messages with the translated text, and generates a new version of the app in the target language.

### Step 1. Mark text with the i18n attribute

* There is an Angular attribute to mark translatable content and it is i18n. You have to place it on every element tag whose fixed text you want to be translated.

* Generate a new component `templates`. It's fine that is created at module level

```console
ng g c templates
```

* Edit `templates.component.html` as follows

```html
<h1 i18n="@@templatesTitle">
  Templates
</h1>
```

* Edit `app.component.html` as follows

```html
<h1 i18n="@@appTitle">
  Welcome to {{ title }}!
</h1>  
```

## Step 2: Create a translation source file

* Once we marked all the texts to be translated, we are able to generate the translation source file using the Angular CLI. To do this we run the following command in a terminal window at the root of our app project:

```bash
ng xi18n --output-path locale
```
* By default, the tool generates a translation file named messages.xlf , if you want to change the format you can use the flag `--i18n-format`.

* This file has a list of trans-unit (translation unit). All the texts that need to be translated will be within the source tag. Let’s see how the `messages.xlf` looks like:

```xml
<?xml version="1.0" encoding="UTF-8" ?>
<xliff version="1.2" xmlns="urn:oasis:names:tc:xliff:document:1.2">
  <file source-language="en" datatype="plaintext" original="ng2.template">
    <body>
      <trans-unit id="appTitle" datatype="html">
        <source>
    Welcome to <x id="INTERPOLATION" equiv-text="{{ title }}"/>!
  </source>
        <context-group purpose="location">
          <context context-type="sourcefile">app/app.component.html</context>
          <context context-type="linenumber">3</context>
        </context-group>
      </trans-unit>
      <trans-unit id="templatesTitle" datatype="html">
        <source>
  Templates
</source>
        <context-group purpose="location">
          <context context-type="sourcefile">app/templates/templates.component.html</context>
          <context context-type="linenumber">4</context>
        </context-group>
      </trans-unit>
    </body>
  </file>
</xliff>

```

* Every time a change is made to the html, either adding or modifying a text, this file must be generated again. 

## Step 3: Translate the extracted text into the target language.

* Create a `locale` folder inside `src` folder.

* Move `messages.xlf` to `locale` folder.

* Now, we have to make one copy of `messages.xlf` for each language that we want our website to be translated to and add the language locale to the end of the file name. For each translation source file, there must be at least one language translation file for the resulting translation.

* In our example we have the following xlf files:

  - `messages.en`: for english translations
  - `messages.es`: for spanish translations
  - `messages`: the base file which was generated in Step 2 and defines all the messages to be translated.

  > In a large translation project, you would send the xlf files to a specific translator who would enter the translations using an XLIFF file editor. Because this angular i18n project is simple and it’s a learning tutorial we will do the translations ourselves using google translate.

  * Our default language will be English, so this file, has not to be translated.

  * Lets translate spanish version. We have to duplicate `source` tag and rename it as `target`. We have to translate all the `trans-unit` nodes in the same way.

```diff
<?xml version="1.0" encoding="UTF-8" ?>
<xliff version="1.2" xmlns="urn:oasis:names:tc:xliff:document:1.2">
  <file source-language="en" datatype="plaintext" original="ng2.template">
    <body>
      <trans-unit id="appTitle" datatype="html">
        <source>Welcome to <x id="INTERPOLATION" equiv-text="{{ title }}"/>!</source>
+       <target>Bienvenido a <x id="INTERPOLATION" equiv-text="{{ title }}"/>!</target>
        <context-group purpose="location">
          <context context-type="sourcefile">app/app.component.html</context>
          <context context-type="linenumber">3</context>
        </context-group>
      </trans-unit>
      <trans-unit id="templatesTitle" datatype="html">
        <source>Templates</source>
+       <target>Plantillas</target>
        <context-group purpose="location">
          <context context-type="sourcefile">app/templates/templates.component.html</context>
          <context context-type="linenumber">4</context>
        </context-group>
      </trans-unit>
    </body>
  </file>
</xliff>

```

# Step 4: Use the completed translation file into your angular application.


* To merge the translated text into the component templates we need to compile the app with the completed translation file. In order to do this we need to provide the Angular compiler with the following translation-specific pieces of information: the path to the translation file, the translation file format and the locale of the file, `es` or `en` for instance.

* We will compile this angular multilingual website example with AOT because we want to show you how to create a `production ready multi language angular application`. The AOT (Ahead-of-Time) compiler is part of a build process that produces a small, fast, ready-to-run application package.

* When internationalization is done with the AOT compiler, we must pre-build a separate application package for each language and serve the appropriate package based on either server-side language detection or url parameters. 

* We will serve the appropriate package based on url parameters.

* So, we now need to tell the AOT compiler how to use our translation configuration and we will do this in the angular.json file.

* We add into the `angular.json` file the `production-es` and `production-en` build configurations and also the serve configurations which will run the build.

* We need to create a build configuration for each language we want to localize.

* You should also direct the output to a locale-specific folder to keep it separate from other locale versions of your app, by setting the outputPath configuration option.

```json
{
  "$schema": "./node_modules/@angular/cli/lib/config/schema.json",
  "version": 1,
  "newProjectRoot": "projects",
  "projects": {
    "i18n-example": {
      "root": "",
      "sourceRoot": "src",
      "projectType": "application",
      "prefix": "app",
      "schematics": {},
      "architect": {
        "build": {
          ....
          "configurations": {
            "production": {
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
              "buildOptimizer": true
            },
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
              "outputPath": "dist/browser/es/",
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
              "outputPath": "dist/browser/en/",
              "baseHref": "/en/",
              "i18nFile": "src/locale/messages.en.xlf",
              "i18nFormat": "xlf",
              "i18nLocale": "en",
              "i18nMissingTranslation": "error"
            }
          }
        },
        "serve": {
          "builder": "@angular-devkit/build-angular:dev-server",
          "options": {
            "browserTarget": "i18n-example:build"
          },
          "configurations": {
            "production": {
              "browserTarget": "i18n-example:build:production"
            },
            "es": {
              "browserTarget": "i18n-example:build:production-es"
            },
            "en": {
              "browserTarget": "i18n-example:build:production-en"
            }
          }
        },
        ...
      }
    },
    "i18n-example-e2e": {
      "root": "e2e/",
      "projectType": "application",
      "architect": {
        "e2e": {
          "builder": "@angular-devkit/build-angular:protractor",
          "options": {
            "protractorConfig": "e2e/protractor.conf.js",
            "devServerTarget": "i18n-example:serve"
          },
          "configurations": {
            "production": {
              "devServerTarget": "i18n-example:serve:production"
            }
          }
        },
        "lint": {
          "builder": "@angular-devkit/build-angular:tslint",
          "options": {
            "tsConfig": "e2e/tsconfig.e2e.json",
            "exclude": [
              "**/node_modules/**"
            ]
          }
        }
      }
    }
  },
  "defaultProject": "i18n-example"
}

```
* Configuration summary:

  - `"outputPath": "dist/browser/es/"`: the output folder for your Spanish project
  - `"baseHref": "/es/"`: the base url param for your spanish version of your app
  - `"i18nFile": "src/locale/messages.es.xlf"`: the path to the translation file.
  - `"i18nFormat": "xlf"`: the format of the translation file.
  - `"i18nLocale": "es"`: the locale id

* Now time to try it:

```console
ng serve --configuration=es
```
