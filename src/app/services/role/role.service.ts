import { Injectable } from '@angular/core';
import { KeycloakService } from '../keycloak/keycloak.service';

@Injectable({
  providedIn: 'root'
})
export class RoleService {

  constructor(
    readonly keycloakService: KeycloakService
  ) {}

  // Can access with any required roles
  canAccess(requiredRoles: string[]): boolean {
    return this.keycloakService.hasAnyRole(requiredRoles);
  }

  // Can access with all required roles
  canAccessAll(requiredRoles: string[]): boolean {
    return this.keycloakService.hasAllRoles(requiredRoles);
  }

  getUserRoles() {
    return {
      allRoles: this.keycloakService.getAllRoles(),
      realmRoles: this.keycloakService.getRealmRoles(),
      clientRoles: this.keycloakService.getClientRoles(),
      userInfo: this.keycloakService.getUserInfo()
    };
  }

  isAdmin(): boolean {
    return this.keycloakService.hasAnyRole(['admin']);
  }

  isUser(): boolean {
    return this.keycloakService.hasAnyRole(['user']);
  }
}
