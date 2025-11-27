import { HttpInterceptorFn } from '@angular/common/http';
import { LoaderService } from '../common/services/loader.service';
import { finalize } from 'rxjs';
import { inject } from '@angular/core';

export const httpLoaderInterceptorInterceptor: HttpInterceptorFn = (req, next) => {
  const loaderService = inject(LoaderService);
  
  // Show loader
  loaderService.show();

  return next(req).pipe(
    finalize(() => {
      // Hide loader when request completes (success or error)
      loaderService.hide();
    })
  );
};
