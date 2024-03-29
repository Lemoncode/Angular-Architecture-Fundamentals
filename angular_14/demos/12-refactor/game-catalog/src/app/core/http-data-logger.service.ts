import { InjectionToken } from '@angular/core';

export const HTTP_DATA_LOGGER = new InjectionToken<string>('HttpDataLogger');

export const logJSON = (data: any) => console.log(JSON.stringify(data));
