import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { TruncatePipe } from '../../../pipes/truncate.pipe';
import { ZorroModule } from '../../../zorro.module';
import { NzTableQueryParams } from 'ng-zorro-antd/table';
import { NzModalService } from 'ng-zorro-antd/modal';
import { AlertService } from '../../../services/alert/alert.service';
import { CategoryService } from '../category.service';
import { Category } from '../category';

@Component({
  selector: 'app-category-list',
  standalone: true,
  imports: [
    RouterModule,
    TranslateModule,
    ZorroModule,
    TruncatePipe,
  ],
  templateUrl: './category-list.component.html',
  styleUrl: './category-list.component.scss'
})
export class CategoryListComponent implements OnInit, OnDestroy {
  categories: Category[] = [];
  loading: boolean = true;
  total: number = 0;
  pageIndex: number = 1;
  pageSize: number = 10;
  sortField: any = '';
  sortOrder: any = '';

  private readonly destroy$ = new Subject<void>();

  constructor(
    readonly alertService: AlertService,
    readonly categoryService: CategoryService,
    readonly modal: NzModalService,
    readonly route: ActivatedRoute,
    readonly router: Router,
    readonly translate: TranslateService
  ) { }

  ngOnInit() {
    const queryParams = this.router.parseUrl(this.router.url).queryParams;
    this.pageIndex = queryParams['pageIndex'] ?? 1;
    this.pageSize = queryParams['pageSize'] ?? 10;
    this.sortField = queryParams['sortField'] ?? '';
    this.sortOrder = queryParams['sortOrder'] ?? '';
    this.loadCategories(this.pageIndex, this.pageSize, this.sortField, this.sortOrder);
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  loadCategories(
    pageIndex: number,
    pageSize: number,
    sortField: string | null,
    sortOrder: string | null,
  ): void {
    this.loading = true;
    this.categoryService.getCategories(pageIndex, pageSize, sortField, sortOrder)
      .pipe(takeUntil(this.destroy$))
      .subscribe(data => {
        this.loading = false;
        this.categories = data.content;
        this.total = data.page.totalElements;
      });
  }

  onQueryParamsChange(params: NzTableQueryParams): void {
    const queryParams = this.router.parseUrl(this.router.url).queryParams;
    const { pageSize, pageIndex, sort } = params;
    const currentSort = sort.find(item => item.value !== null);
    const sortField = currentSort?.key ?? (queryParams['sortField'] ?? null);
    let sortOrder = currentSort?.value ?? (queryParams['sortOrder'] ?? null);
    sortOrder = this.mapSortOrder(
      sortOrder === 'ascend' || sortOrder === 'descend' || sortOrder === 'asc' || sortOrder === 'desc' ? sortOrder : null
    ); // 'asc', 'desc', or null

    this.pageIndex = pageIndex;
    this.pageSize = pageSize;
    this.sortField = sortField;
    this.sortOrder = sortOrder;

    this.loadCategories(pageIndex, pageSize, sortField, sortOrder);
  }

  mapSortOrder(order: 'ascend' | 'descend' | 'asc' | 'desc' | null): 'asc' | 'desc' | null {
    if (order === 'asc') return 'asc';
    if (order === 'ascend') return 'asc';
    if (order === 'desc') return 'desc';
    if (order === 'descend') return 'desc';
    return null;
  }

  addCategory(): void {
    this.router.navigate(['/category/create'], {
      queryParams: {
        pageIndex: this.pageIndex,
        pageSize: this.pageSize,
        sortField: this.sortField,
        sortOrder: this.sortOrder
      }
    });
  }

  editCategory(category: Category): void {
    this.router.navigate(['/category/edit', category.id], {
      queryParams: {
        pageIndex: this.pageIndex,
        pageSize: this.pageSize,
        sortField: this.sortField,
        sortOrder: this.sortOrder
      }
    });
  }

  confirmDelete(category: Category): void {
    const title = this.translate.instant('CATEGORY.DELETE_CONFIRM_TITLE');
    const content = this.translate.instant('CATEGORY.DELETE_CONFIRM_CONTENT');
    const okText = this.translate.instant('COMMON.YES');
    const cancelText = this.translate.instant('COMMON.NO');
    this.modal.confirm({
      nzTitle: title,
      nzContent: `<strong>${category.name}</strong> ` + content,
      nzOkText: okText,
      nzOkType: 'primary',
      nzOkDanger: true,
      nzOnOk: () => this.deleteCategory(category),
      nzCancelText: cancelText,
    });
  }

  deleteCategory(category: Category): void {
    this.categoryService.deleteCategory(category.id)
      .pipe(takeUntil(this.destroy$))
      .subscribe(() => {
        this.loadCategories(this.pageIndex, this.pageSize, this.sortField, this.sortOrder);
      });

    const message = this.translate.instant('CATEGORY.RECORD_DELETED');
    this.alertService.showAlert(
      'success',
      `'${category.name}' ` + message,
      []
    );
  }
}
