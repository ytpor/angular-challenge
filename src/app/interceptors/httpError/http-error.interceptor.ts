// http-error.interceptor.ts
import { HttpInterceptorFn, HttpErrorResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { catchError, throwError } from 'rxjs';
import { AlertService } from '../../services/alert/alert.service';

export const httpErrorInterceptor: HttpInterceptorFn = (req, next) => {
  const alertService = inject(AlertService);

  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {
      // Simple fallback messages in interceptor
      let errorMessage = 'An error occurred';
      switch (error.status) {
        case 0: errorMessage = 'Network error'; break;
        case 403: errorMessage = 'Access denied'; break;
        case 404: errorMessage = 'Resource not found'; break;
        case 500: errorMessage = 'Server error'; break;
      }

      alertService.showAlert('error', errorMessage, []);
      return throwError(() => error);
    })
  );
};
