import { Component, inject } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { ZorroModule } from '../../../zorro.module';
import { NzTableQueryParams } from 'ng-zorro-antd/table';
import { NzModalService } from 'ng-zorro-antd/modal';
import { CategoryService } from '../category.service';
import { Category } from '../category';

@Component({
  selector: 'app-category-list',
  standalone: true,
  imports: [
    RouterModule,
    ZorroModule,
  ],
  templateUrl: './category-list.component.html',
  styleUrl: './category-list.component.scss'
})
export class CategoryListComponent {
  categories: Category[] = [];
  loading = true;
  total = 0;
  pageIndex = 1;
  pageSize = 10;
  search = '';
  sort = 'name';

  router = inject(Router);

  constructor(readonly categoryService: CategoryService, readonly modal: NzModalService) { }

  ngOnInit() {
    this.loadCategories(this.pageIndex, this.pageSize, null, null);
  }

  loadCategories(
    pageIndex: number,
    pageSize: number,
    search: string | null,
    sort: string | null,
  ): void {
    this.loading = true;
    this.categoryService.getCategories(pageIndex, pageSize, search, sort)
      .subscribe(data => {
        this.loading = false;
        this.categories = data.content;
        this.total = data.page.totalElements;
      });
  }

  onQueryParamsChange(params: NzTableQueryParams): void {
    const { pageSize, pageIndex, sort } = params;
    const currentSort = sort.find(item => item.value !== null);
    const sortField = currentSort?.key ?? null;
    let sortOrder = currentSort?.value ?? null;
    sortOrder = this.mapSortOrder(
      sortOrder === 'ascend' || sortOrder === 'descend' ? sortOrder : null
    ); // 'asc', 'desc', or null
    this.loadCategories(pageIndex, pageSize, sortField, sortOrder);
  }

  mapSortOrder(order: 'ascend' | 'descend' | null): 'asc' | 'desc' | null {
    if (order === 'ascend') return 'asc';
    if (order === 'descend') return 'desc';
    return null;
  }

  editCategory(category: Category): void {
    this.router.navigate(['/category/edit', category.id]);
  }

  confirmDelete(category: Category): void {
    this.modal.confirm({
      nzTitle: 'Are you sure you want to delete this category?',
      nzContent: `<b style="color: red;">${category.name}</b> will be permanently removed.`,
      nzOkText: 'Yes',
      nzOkType: 'primary',
      nzOkDanger: true,
      nzOnOk: () => this.deleteCategory(category),
      nzCancelText: 'No',
    });
  }

  deleteCategory(category: Category): void {
    this.categoryService.deleteCategory(category.id).subscribe(() => {
      this.loadCategories(this.pageIndex, this.pageSize, null, null);
    });
  }
}
