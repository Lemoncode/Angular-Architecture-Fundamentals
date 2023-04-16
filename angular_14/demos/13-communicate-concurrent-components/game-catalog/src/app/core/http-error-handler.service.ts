import { InjectionToken } from '@angular/core';

export const HTTP_ERROR_HANDLER = new InjectionToken<string>(
  'HttpErrorHandler'
);

export const handleError = (err: any) => {
  let errorMessage: string;
  if (err.error instanceof Error) {
    errorMessage = `An error ocurred: ${err.error.message}`;
  } else {
    errorMessage = `Backend returned code ${err.status}, body was: ${err.error}`;
  }
  throw new Error(errorMessage);
};
