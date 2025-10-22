import { Routes } from '@angular/router';
import { CategoryListComponent } from './category-list/category-list.component';
import { CategoryFormComponent } from './category-form/category-form.component';
import { CategoryDetailComponent } from './category-detail/category-detail.component';
import { CategoryViewComponent } from './category-view/category-view.component';

export const CategoryRoutes: Routes = [
  {
    path: 'category',
    children: [
      {
        path: '',
        pathMatch: 'full',
        redirectTo: 'list'
      },
      {
        path: 'list',
        component: CategoryListComponent,
      },
      {
        path: 'create',
        component: CategoryFormComponent,
      },
      {
        path: 'edit/:id',
        component: CategoryDetailComponent,
      },
      {
        path: 'view/:id',
        component: CategoryViewComponent,
      },
    ],
  },
];