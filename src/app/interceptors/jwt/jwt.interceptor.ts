import { inject } from '@angular/core';
import { HttpInterceptorFn } from '@angular/common/http';
import { KeycloakService } from '../../services/keycloak/keycloak.service';

export const jwtInterceptor: HttpInterceptorFn = (req, next) => {
  const token = inject(KeycloakService).getToken();

  if (token) {
    const cloned = req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`
      }
    });
    return next(cloned);
  }

  return next(req);
};
