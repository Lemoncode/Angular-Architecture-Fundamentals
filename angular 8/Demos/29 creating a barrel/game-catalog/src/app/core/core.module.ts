import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { HTTP_DATA_LOGGER, logJSON } from './http-data-logger.service';
import { HTTP_ERROR_HANDLER, handleError } from './http-error-handler.service';

@NgModule({
  declarations: [],
  imports: [
    CommonModule
  ],
  providers: [
    {
      provide: HTTP_DATA_LOGGER,
      useValue: {
        logJSON,
      }
    },
    {
      provide: HTTP_ERROR_HANDLER,
      useValue: {
        handleError,
      }
    }
  ]
})
export class CoreModule { }
