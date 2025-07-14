import { Component, OnInit, OnDestroy, inject } from '@angular/core';
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
import { CategoryService } from '../category.service';

@Component({
  selector: 'app-category-detail',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    RouterModule,
    TranslateModule,
    ZorroModule,
  ],
  templateUrl: './category-detail.component.html',
  styleUrl: './category-detail.component.scss'
})
export class CategoryDetailComponent implements OnInit, OnDestroy {
  categoryId!: number;

  readonly alertService = inject(AlertService);
  readonly categoryService = inject(CategoryService);
  readonly router = inject(Router);
  readonly fb = inject(NonNullableFormBuilder);
  readonly translate = inject(TranslateService);
  private readonly destroy$ = new Subject<void>();

  validateForm = this.fb.group({
    name: this.fb.control('', [Validators.required]),
    description: this.fb.control('', [Validators.required])
  });

  constructor(
    readonly route: ActivatedRoute
  ) { }

  ngOnInit(): void {
    this.categoryId = +this.route.snapshot.paramMap.get('id')!;
    if (this.categoryId) {
      this.loadCategory(this.categoryId);
    }
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  loadCategory(id: number): void {
    this.categoryService.getCategory(id)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (data) => {
          this.validateForm.patchValue({
            name: data.name,
            description: data.description
          });
        },
        error: (err) => {
          this.alertService.showAlert(
            'error',
            err.error?.message ?? 'Category not found',
            err.error?.details ?? []
          );
          this.router.navigate(['/category/list']);
        }
      });
  }

  submitForm(): void {
    if (this.validateForm.valid) {
      const formValue = this.validateForm.value;
      this.categoryService.updateCategory({
        id: this.categoryId,
        ...formValue
      })
        .pipe(takeUntil(this.destroy$))
        .subscribe({
          next: () => {
            this.alertService.showAlert(
              'success',
              this.translate.instant('CATEGORY.RECORD_UPDATED'),
              []
            );
            this.router.navigate(['/category/list']);
          },
          error: (err) => {
            this.alertService.showAlert(
              'error',
              err.error?.message ?? this.translate.instant('CATEGORY.FAILED_TO_UPDATE'),
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
}
