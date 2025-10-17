import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import dayjs from 'dayjs/esm';
import Keycloak from 'keycloak-js';

@Injectable({
  providedIn: 'root'
})
export class KeycloakService {
  readonly keycloak: Keycloak;

  private refreshTimeout: any = null;

  url = environment.keycloakUrl;
  realm = environment.keycloakRealm;
  clientId = environment.keycloakClientId;
  tokenRefreshBuffer = environment.tokenRefreshBuffer; // in seconds

  constructor() {
    this.keycloak = new Keycloak({
      url: this.url,
      realm: this.realm,
      clientId: this.clientId
    });

    // Set up token refresh on initialization
    this.setupTokenRefresh();
  }

  async init(): Promise<boolean> {
    const authenticated = await this.keycloak.init({
      onLoad: 'login-required',
      checkLoginIframe: false
    });

    if (authenticated) {
      this.scheduleTokenRefresh();
    }

    return authenticated;
  }

  login(): void {
    this.keycloak.login();
  }

  logout(): void {
    // Clear any pending refresh
    this.clearRefreshTimeout();

    this.keycloak.logout({
      redirectUri: globalThis.location.origin
    });
  }

  /**
   * Refresh the token if it's about to expire
   */
  async refreshToken(): Promise<boolean> {
    try {
      const refreshed = await this.keycloak.updateToken(this.tokenRefreshBuffer);

      if (refreshed) {
        // Reschedule the next refresh
        this.scheduleTokenRefresh();
      } else {
        // console.log('Token not refreshed, still valid');
      }

      return refreshed;
    } catch (error) {
      console.error('Failed to refresh token:', error);
      // If refresh fails, logout the user
      this.logout();
      return false;
    }
  }

  /**
   * Force token refresh regardless of expiration
   */
  async forceRefreshToken(): Promise<boolean> {
    try {
      const refreshed = await this.keycloak.updateToken(-1); // -1 forces refresh

      if (refreshed) {
        this.scheduleTokenRefresh();
      }

      return refreshed;
    } catch (error) {
      console.error('Failed to force refresh token:', error);
      return false;
    }
  }

  /**
   * Schedule automatic token refresh
   */
  private scheduleTokenRefresh(): void {
    // Clear any existing timeout
    this.clearRefreshTimeout();

    if (!this.keycloak.token) {
      return;
    }

    const expiresAt = this.getExpiration();
    if (!expiresAt) {
      return;
    }

    const now = dayjs();
    const expiresIn = expiresAt.diff(now, 'second');

    // Refresh token before expiration, but ensure we don't schedule for negative time
    const refreshIn = Math.max(1, expiresIn - this.tokenRefreshBuffer);

    // console.log(`Token expires in ${expiresIn}s, scheduling refresh in ${refreshIn}s`);

    this.refreshTimeout = setTimeout(() => {
      this.refreshToken();
    }, refreshIn * 1000);
  }

  /**
   * Clear the refresh timeout
   */
  private clearRefreshTimeout(): void {
    if (this.refreshTimeout) {
      clearTimeout(this.refreshTimeout);
      this.refreshTimeout = null;
    }
  }

  /**
   * Set up token refresh listeners
   */
  private setupTokenRefresh(): void {
    // Listen for token expiration
    this.keycloak.onTokenExpired = () => {
      // console.log('Token expired, refreshing...');
      this.refreshToken();
    };

    // Listen for auth success to reschedule refresh
    this.keycloak.onAuthSuccess = () => {
      this.scheduleTokenRefresh();
    };

    // Listen for auth logout to clear refresh
    this.keycloak.onAuthLogout = () => {
      this.clearRefreshTimeout();
    };
  }

  /**
   * Get all realm roles from token
   */
  getRealmRoles(): string[] {
    return this.keycloak.tokenParsed?.realm_access?.roles || [];
  }

  /**
   * Get client-specific roles from token
   */
  getClientRoles(clientId: string = this.clientId): string[] {
    return this.keycloak.tokenParsed?.resource_access?.[clientId]?.roles || [];
  }

  /**
   * Get all roles (realm + client roles)
   */
  getAllRoles(): string[] {
    const realmRoles = this.getRealmRoles();
    const clientRoles = this.getClientRoles();
    return [...realmRoles, ...clientRoles];
  }

  /**
   * Check if user has a specific realm role
   */
  hasRealmRole(role: string): boolean {
    return this.getRealmRoles().includes(role);
  }

  /**
   * Check if user has a specific client role
   */
  hasClientRole(role: string, clientId: string = this.clientId): boolean {
    return this.getClientRoles(clientId).includes(role);
  }

  /**
   * Check if user has any of the specified roles
   */
  hasAnyRole(roles: string[]): boolean {
    const allRoles = this.getAllRoles();
    return roles.some(role => allRoles.includes(role));
  }

  /**
   * Check if user has all of the specified roles
   */
  hasAllRoles(roles: string[]): boolean {
    const allRoles = this.getAllRoles();
    return roles.every(role => allRoles.includes(role));
  }

  /**
   * Get user information from token
   */
  getUserInfo(): any {
    return {
      username: this.keycloak.tokenParsed?.['preferred_username'],
      email: this.keycloak.tokenParsed?.['email'],
      firstName: this.keycloak.tokenParsed?.['given_name'],
      lastName: this.keycloak.tokenParsed?.['family_name'],
      roles: this.getAllRoles(),
      realmRoles: this.getRealmRoles(),
      clientRoles: this.getClientRoles()
    };
  }

  isLoggedIn(): boolean {
    const isValid = dayjs().isBefore(this.getExpiration());
    if (!isValid) {
      this.logout();
    }
    return isValid;
  }

  isLoggedOut(): boolean {
    return !this.isLoggedIn();
  }

  getExpiration(): dayjs.Dayjs | null {
    if (this.keycloak.tokenParsed?.exp) {
      const expiresAt = this.keycloak.tokenParsed.exp;
      return dayjs.unix(expiresAt);
    }
    return null;
  }

  getToken(): string {
    return this.keycloak.token || '';
  }

  /**
   * Get the time until token expiration in seconds
   */
  getTokenExpiresIn(): number {
    const expiration = this.getExpiration();
    if (!expiration) {
      return 0;
    }

    const now = dayjs();
    return expiration.diff(now, 'second');
  }

  /**
   * Check if token needs refresh (within buffer period)
   */
  needsRefresh(): boolean {
    const expiresIn = this.getTokenExpiresIn();
    return expiresIn <= this.tokenRefreshBuffer;
  }
}
