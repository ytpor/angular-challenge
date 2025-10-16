import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import dayjs from 'dayjs/esm';
import Keycloak from 'keycloak-js';

@Injectable({
  providedIn: 'root'
})
export class KeycloakService {
  readonly keycloak: Keycloak;

  // Refresh token 5 minutes before expiration (in seconds)
  private readonly TOKEN_REFRESH_BUFFER = 300;
  private refreshTimeout: any = null;

  url = environment.keycloakUrl;
  realm = environment.keycloakRealm;
  clientId = environment.keycloakClientId;

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
      redirectUri: window.location.origin
    });
  }

  /**
   * Refresh the token if it's about to expire
   */
  async refreshToken(): Promise<boolean> {
    try {
      const refreshed = await this.keycloak.updateToken(this.TOKEN_REFRESH_BUFFER);

      if (refreshed) {
        // Reschedule the next refresh
        this.scheduleTokenRefresh();
      } else {
        console.log('Token not refreshed, still valid');
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

    // Refresh token 5 minutes before expiration, but not more frequently than every 30 seconds
    const refreshIn = Math.max(30, expiresIn - this.TOKEN_REFRESH_BUFFER);

    // console.log(`Scheduling token refresh in ${refreshIn} seconds`);

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
    return expiresIn <= this.TOKEN_REFRESH_BUFFER;
  }
}
