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
import { CategoryService } from '../category.service';

@Component({
  selector: 'app-category-form',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    RouterModule,
    TranslateModule,
    ZorroModule,
  ],
  templateUrl: './category-form.component.html',
  styleUrl: './category-form.component.scss'
})
export class CategoryFormComponent implements OnInit {
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

      this.categoryService.createCategory(formData)
        .pipe(takeUntil(this.destroy$))
        .subscribe({
          next: (res) => {
            this.alertService.showAlert(
              'success',
              this.translate.instant('CATEGORY.NEW_RECORD_CREATED'),
              []
            );
            this.router.navigate(['/category']);
          },
          error: (err) => {
            this.alertService.showAlert(
              'error',
              err.error?.message ?? this.translate.instant('CATEGORY.FAILED_TO_CREATE'),
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
