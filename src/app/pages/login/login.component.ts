import { Component, OnDestroy, inject } from '@angular/core';
import {
  NonNullableFormBuilder,
  ReactiveFormsModule,
  Validators
} from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';
import { ZorroModule } from './../../zorro.module';
import { BrandingComponent } from './../../components/branding/branding.component';
import { AlertBasicComponent } from '../../components/alert-basic/alert-basic.component';
import { AlertService } from '../../services/alert/alert.service';
import { AuthService } from '../../services/auth/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    RouterModule,
    ZorroModule,
    BrandingComponent,
    AlertBasicComponent,
  ],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnDestroy {
  passwordVisible = false;
  password?: string;
  alertData: any;

  readonly authService = inject(AuthService);
  readonly router = inject(Router);
  readonly fb = inject(NonNullableFormBuilder);
  private readonly destroy$ = new Subject<void>();

  validateForm = this.fb.group({
    username: this.fb.control('', [Validators.required]),
    password: this.fb.control('', [Validators.required]),
  });

  constructor(
    readonly alertService: AlertService
  ) {
    this.alertService.alert$
      .pipe(takeUntil(this.destroy$))
      .subscribe(data => {
        this.alertData = data;
        // Dismiss alert
        if (data) {
          setTimeout(() => {
            this.alertData = null;
          }, 5000); // 5000 milliseconds = 5 seconds
        }
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  submitForm(): void {
    if (this.validateForm.valid) {
      this.authService.login(this.validateForm.value)
        .pipe(takeUntil(this.destroy$))
        .subscribe({
          next: (data) => {
            if (this.authService.isLoggedIn()) {
              this.router.navigate(['/welcome']);
            }
          },
          error: (err) => {
            this.alertService.showAlert(
              'error',
              err.error?.details ?? 'Invalid username or password',
              []
            );
          }
        });
    } else {
      Object.values(this.validateForm.controls).forEach(control => {
        if (control.invalid) {
          control.markAsDirty();
          control.updateValueAndValidity({ onlySelf: true });
        }
      });
    }
  }
}
