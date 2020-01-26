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
