import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { catchError, throwError } from 'rxjs';
import { SnackbarService } from '../../shared/ui/info-snackbar/snackbar.service';
import { AuthRequiredError } from '../auth/errors/auth-required.error';

export const errorInterceptor: HttpInterceptorFn = (req, next) => {
  const snackbar = inject(SnackbarService);

  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {

      let messageKey = 'errors.unexpectedErrorOccurred';

      if (error instanceof AuthRequiredError || error.status === 401) {
        messageKey = 'errors.userNotLoggedIn';
      }
      
      if (error.status === 0) {
        messageKey = 'errors.network';
      }

      if (error.status === 404) {
        messageKey = 'errors.404';
      }

      snackbar.showInfoMessage(messageKey);

      return throwError(() => error);
    })
  );
};