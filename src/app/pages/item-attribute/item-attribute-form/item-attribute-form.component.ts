import { Component, inject } from '@angular/core';
import {
  NonNullableFormBuilder,
  ReactiveFormsModule,
  Validators
} from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';
import { TranslateModule } from '@ngx-translate/core';
import { ZorroModule } from '../../../zorro.module';
import { AlertService } from '../../../services/alert/alert.service';
import { ItemAttributeService } from '../item-attribute.service';

@Component({
  selector: 'app-item-attribute-form',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    RouterModule,
    TranslateModule,
    ZorroModule,
  ],
  templateUrl: './item-attribute-form.component.html',
  styleUrl: './item-attribute-form.component.scss'
})
export class ItemAttributeFormComponent {
  readonly alertService = inject(AlertService);
  readonly itemAttributeService = inject(ItemAttributeService);
  readonly router = inject(Router);
  readonly fb = inject(NonNullableFormBuilder);
  private readonly destroy$ = new Subject<void>();

  validateForm = this.fb.group({
    name: this.fb.control('', [Validators.required]),
    description: this.fb.control('', [Validators.required])
  });

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  submitForm(): void {
    if (this.validateForm.valid) {
      this.itemAttributeService.createItemAttribute(this.validateForm.value)
        .pipe(takeUntil(this.destroy$))
        .subscribe({
          next: (res) => {
            this.alertService.showAlert(
              'success',
              'New item attribute created',
              []
            );
            this.router.navigate(['/item-attribute']);
          },
          error: (err) => {
            this.alertService.showAlert(
              'error',
              err.error?.message ?? 'Failed to create a record',
              err.error?.details ?? []
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

  resetForm(e: MouseEvent): void {
    e.preventDefault();
    this.alertService.clearAlert();
    this.validateForm.reset();
  }
}
