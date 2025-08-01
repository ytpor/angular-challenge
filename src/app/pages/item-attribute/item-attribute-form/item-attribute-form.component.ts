import { Component, OnInit, inject } from '@angular/core';
import {
  NonNullableFormBuilder,
  ReactiveFormsModule,
  Validators
} from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
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
export class ItemAttributeFormComponent implements OnInit {
  readonly alertService = inject(AlertService);
  readonly itemAttributeService = inject(ItemAttributeService);
  readonly router = inject(Router);
  readonly fb = inject(NonNullableFormBuilder);
  readonly translate = inject(TranslateService);
  private readonly destroy$ = new Subject<void>();

  pageIndex: number = 1;
  pageSize: number = 10;
  sortField: any = '';
  sortOrder: any = '';

  validateForm = this.fb.group({
    name: this.fb.control('', [Validators.required]),
    description: this.fb.control('', [Validators.required])
  });

  constructor(
    readonly route: ActivatedRoute
  ) { }

  ngOnInit(): void {
    const queryParams = this.route.snapshot.queryParams;
    this.pageIndex = queryParams['pageIndex'] ?? 1;
    this.pageSize = queryParams['pageSize'] ?? 10;
    this.sortField = queryParams['sortField'] ?? '';
    this.sortOrder = queryParams['sortOrder'] ?? '';
  }

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
              this.translate.instant('ITEM_ATTRIBUTE.NEW_RECORD_CREATED'),
              []
            );
            this.router.navigate(['/item-attribute']);
          },
          error: (err) => {
            this.alertService.showAlert(
              'error',
              err.error?.message ?? this.translate.instant('ITEM_ATTRIBUTE.FAILED_TO_CREATE'),
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
  goBack(): void {
    this.router.navigate(['/item-attribute/list'], {
      queryParams: {
        pageIndex: this.pageIndex,
        pageSize: this.pageSize,
        sortField: this.sortField,
        sortOrder: this.sortOrder
      }
    });
  }
}
