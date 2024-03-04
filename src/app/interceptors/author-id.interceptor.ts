import { HttpHeaders, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { finalize } from 'rxjs';
import { SpinnerService } from '../services/spinner.service';

export const authorIdInterceptor: HttpInterceptorFn = (req, next) => {
  const spinner = inject(SpinnerService);

  if (!req.url.includes('/bp/products/verification')) {
    spinner.active.set(true);
  }

  const headers = new HttpHeaders().set('authorId', '333');
  const request = req.clone({ headers });

  return next(request).pipe(
    finalize(() => {
      spinner.active.set(false);
    })
  );
};
