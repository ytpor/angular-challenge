import { CanActivateFn } from '@angular/router';
import { inject } from '@angular/core';
import { KeycloakService } from '../../services/keycloak/keycloak.service';

export const authGuard: CanActivateFn = async (route, state) => {
  const keycloakService = inject(KeycloakService);

  if (keycloakService.isLoggedIn()) {
        if (keycloakService.needsRefresh()) {
      try {
        await keycloakService.refreshToken();
      } catch (error) {
        console.error('Token refresh failed in auth guard:', error);
        keycloakService.logout();
        return false;
      }
    }
    return true;
  }
  keycloakService.logout();
  return false;
};
