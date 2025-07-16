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

  selectedFile: File | null = null;
  categoryData: any = null;
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
    this.categoryId = +this.route.snapshot.paramMap.get('id')!;
    if (this.categoryId) {
      this.loadCategory(this.categoryId);
    }
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  onFileChange(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.selectedFile = input.files[0];
    } else {
      this.selectedFile = null;
    }
  }

  loadCategory(id: number): void {
    this.categoryService.getCategory(id)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (data) => {
          this.categoryData = data;
          this.validateForm.patchValue({
            name: data.name,
            description: data.description
          });
        },
        error: (err) => {
          this.alertService.showAlert(
            'error',
            err.error?.message ?? this.translate.instant('CATEGORY.RECORD_NOT_FOUND'),
            err.error?.details ?? []
          );
          this.router.navigate(['/category/list']);
        }
      });
  }

  submitForm(): void {
    if (this.validateForm.valid) {
      const formData = new FormData();
      const data = {
        name: this.validateForm.value.name ?? '',
        description: this.validateForm.value.description ?? ''
      };
      formData.append('data', JSON.stringify(data));
      if (this.selectedFile) {
        formData.append('file', this.selectedFile);
      }

      this.categoryService.updateCategory(this.categoryId, formData)
        .pipe(takeUntil(this.destroy$))
        .subscribe({
          next: () => {
            this.loadCategory(this.categoryId);
            this.alertService.showAlert(
              'success',
              this.translate.instant('CATEGORY.RECORD_UPDATED'),
              []
            );
            this.router.navigate(['/category/edit', this.categoryId]);
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

  goBack(): void {
    this.router.navigate(['/category/list'], {
      queryParams: {
        pageIndex: this.pageIndex,
        pageSize: this.pageSize,
        sortField: this.sortField,
        sortOrder: this.sortOrder
      }
    });
  }
}
