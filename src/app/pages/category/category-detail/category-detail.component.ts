import { Component, inject } from '@angular/core';
import {
  NonNullableFormBuilder,
  ReactiveFormsModule,
  Validators
} from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { Subject } from 'rxjs';
import { ZorroModule } from '../../../zorro.module';
import { CategoryService } from '../category.service';

@Component({
  selector: 'app-category-detail',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    RouterModule,
    ZorroModule,
  ],
  templateUrl: './category-detail.component.html',
  styleUrl: './category-detail.component.scss'
})
export class CategoryDetailComponent {
  categoryService = inject(CategoryService);
  router = inject(Router);

  categoryId!: number;

  errorMessage: string | null = null;
  errorDetails: string[] = [];

  readonly fb = inject(NonNullableFormBuilder);
  readonly destroy$ = new Subject<void>();
  validateForm = this.fb.group({
    name: this.fb.control('', [Validators.required]),
    description: this.fb.control('', [Validators.required])
  });

  constructor(readonly route: ActivatedRoute) { }

  ngOnInit(): void {
    this.categoryId = +this.route.snapshot.paramMap.get('id')!;
    if (this.categoryId) {
      this.loadCategory(this.categoryId);
    }
  }

  loadCategory(id: number): void {
    this.categoryService.getCategory(id)
      .subscribe({
        next: (data) => {
          // Patch form with retrieved category data
          this.validateForm.patchValue({
            name: data.name,
            description: data.description
          });
        },
        error: (err) => {
          this.errorMessage = err.error?.message || 'Failed to load category';
          this.errorDetails = err.error?.details || [];
        }
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  submitForm(): void {
    if (this.validateForm.valid) {
      if (this.validateForm.valid) {
        const formValue = this.validateForm.value;
        let request$;

        if (this.categoryId) {
          // Update existing category
          request$ = this.categoryService.updateCategory({
            id: this.categoryId,
            ...formValue
          });
        } else {
          // Create new category
          request$ = this.categoryService.createCategory(formValue);
        }

        request$.subscribe({
          next: () => {
            this.router.navigate(['/category/list']);
          },
          error: (err) => {
            this.errorMessage = err.error?.message || 'An error occurred';
            this.errorDetails = err.error?.details || [];
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
}
