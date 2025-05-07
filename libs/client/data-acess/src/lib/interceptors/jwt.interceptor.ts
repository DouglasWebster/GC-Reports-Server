import {
  HttpHandlerFn,
  HttpInterceptorFn,
  HttpRequest,
} from '@angular/common/http';
import { inject } from '@angular/core';
import { map, switchMap } from 'rxjs';
import { AuthService } from '../auth/auth.service';

export const jwtInterceptor: HttpInterceptorFn = (
  req: HttpRequest<unknown>,
  next: HttpHandlerFn
) => {
  const authService = inject(AuthService);
  return authService.accessToken$.pipe(
    map((token) => {
      if (token) {
        req = req.clone({
          url: req.url,
          setHeaders: {
            Authorization: `Bearer ${token}`,
          },
        });
      }
      return req;
    }),
    switchMap((req) => next(req))
  );
};
