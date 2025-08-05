import { Injectable, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { Idle, DEFAULT_INTERRUPTSOURCES } from '@ng-idle/core';
import { AuthService } from '../../services/auth/auth.service';
import { Subject, takeUntil } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class IdleService implements OnDestroy {
  idle_second = Number(environment.idleSecond) || 300; // default 5 min
  timeout_second = Number(environment.timeoutSecond) || 5; // default 5 seconds

  private readonly destroy$ = new Subject<void>();

  constructor(
    readonly idle: Idle,
    readonly router: Router,
    readonly authService: AuthService
  ) {
    this.setupIdleDetection();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private setupIdleDetection() {
    this.idle.setIdle(this.idle_second);
    this.idle.setTimeout(this.timeout_second);
    // Set the default interrupts (things like clicks, scrolls, touches to the document).
    this.idle.setInterrupts(DEFAULT_INTERRUPTSOURCES);

    this.idle.onTimeout
      .pipe(takeUntil(this.destroy$))
      .subscribe(() => {
        console.log('Timed out!');
        this.authService.logout();
        this.router.navigate(['/login']);
      });
  }

  reset() {
    this.idle.watch();
  }
}