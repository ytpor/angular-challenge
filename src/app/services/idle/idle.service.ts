import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Idle, DEFAULT_INTERRUPTSOURCES } from '@ng-idle/core';
import { AuthService } from '../../services/auth/auth.service';

@Injectable({
  providedIn: 'root'
})
export class IdleService {
  idle_second = Number(import.meta.env.NG_APP_IDLE_SECOND) || 300; // default 5 min
  timeout_second = Number(import.meta.env.NG_APP_TIMEOUT_SECOND) || 5; // default 5 seconds

  constructor(readonly idle: Idle, readonly router: Router, readonly authService: AuthService) {
    this.setupIdleDetection();
  }

  private setupIdleDetection() {
    this.idle.setIdle(this.idle_second);
    this.idle.setTimeout(this.timeout_second);
    // Set the default interrupts (things like clicks, scrolls, touches to the document).
    this.idle.setInterrupts(DEFAULT_INTERRUPTSOURCES);

    this.idle.onTimeout.subscribe(() => {
      console.log('Timed out!');
      this.authService.logout();
      this.router.navigate(['/login']);
    });
  }

  reset() {
    this.idle.watch();
  }
}