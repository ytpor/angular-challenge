import { Component, OnInit, OnDestroy, inject } from '@angular/core';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { ZorroModule } from '../../../zorro.module';
import { AlertService } from '../../../services/alert/alert.service';
import { CategoryService } from '../category.service';

@Component({
  selector: 'app-category-view',
  standalone: true,
  imports: [
    RouterModule,
    TranslateModule,
    ZorroModule,
  ],
  templateUrl: './category-view.component.html',
  styleUrl: './category-view.component.scss'
})
export class CategoryViewComponent implements OnInit, OnDestroy {
  categoryId!: number;

  readonly alertService = inject(AlertService);
  readonly categoryService = inject(CategoryService);
  readonly router = inject(Router);
  readonly translate = inject(TranslateService);
  private readonly destroy$ = new Subject<void>();

  categoryData: any = null;
  pageIndex: number = 1;
  pageSize: number = 10;
  sortField: any = '';
  sortOrder: any = '';

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

  loadCategory(id: number): void {
    this.categoryService.getCategory(id)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (data) => {
          this.categoryData = data;
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
