import { HttpInterceptorFn, HttpErrorResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { catchError, throwError } from 'rxjs';

export const errorInterceptor: HttpInterceptorFn = (req, next) => {

  const snackBar = inject(MatSnackBar);
  const router = inject(Router);

  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {

      const showSnack = (msg: string) => {
        snackBar.open(msg, 'OK', {
          duration: 4000,
          horizontalPosition: 'right',
          verticalPosition: 'top',
          panelClass: ['snackbar-error']   // optional custom class
        });
      };

      // Handle "unknown" or network errors
      if (!error.status) {
        console.error('Network Error:', error);
        showSnack('Network error — please check your internet connection.');
        return throwError(() => error);
      }

      switch (error.status) {

        case 400:
          showSnack(error.error?.detail || 'Bad request.');
          break;

        case 401:
          showSnack('Session expired. Please log in again.');
          router.navigate(['/login']);
          break;

        case 403:
          showSnack('You do not have permission to perform this action.');
          break;

        case 404:
          showSnack('The page you are looking for was not found.');
          router.navigate(['/404']);
          break;

        case 409:
          showSnack(error.error?.message || 'Conflict detected.');
          break;

        case 422:
          showSnack('Invalid data provided.');
          break;

        // Handle all 5xx server errors
        case 500:
        case 501:
        case 502:
        case 503:
        case 504:
          showSnack('A server error occurred. Please try again later.');
          break;

        default:
          showSnack(error.message || 'An unexpected error occurred.');
          break;
      }

      return throwError(() => error);
    })
  );
};
