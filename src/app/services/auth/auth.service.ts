import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { tap } from 'rxjs/operators';
import dayjs from 'dayjs/esm';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  http = inject(HttpClient);
  baseUrl = environment.apiUrl ?? 'http://localhost:8080/api';

  login(data: any) {
    return this.http.post(`${this.baseUrl}/auth/token`, data)
      .pipe(tap((result) => {
        this.setSession(result);
      }));
  }

  private setSession(authResult: any) {
    localStorage.setItem('id_token', authResult.token);
    localStorage.setItem("expires_at", authResult.expiresAt);
  }

  logout() {
    localStorage.removeItem("id_token");
    localStorage.removeItem("expires_at");
  }

  isLoggedIn() {
    const isValid = dayjs().isBefore(this.getExpiration());
    if (!isValid) {
      this.logout();
    }
    return isValid;
  }

  isLoggedOut() {
    return !this.isLoggedIn();
  }

  getExpiration() {
    const expiration = localStorage.getItem('expires_at');
    const expiresAt = expiration ? JSON.parse(expiration) : null;
    return dayjs(expiresAt);
  }

  getToken() {
    const id_token = localStorage.getItem("id_token") ?? null;
    return id_token;
  }
}
