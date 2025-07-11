import { Routes } from '@angular/router';
import { WelcomeComponent } from './welcome/welcome.component';

export const FullRoutes: Routes = [
  {
    path: '',
    children: [
      {
        path: '',
        loadChildren: () =>
          import('./category/category.routes').then(
            (m) => m.CategoryRoutes
          ),
      },
      {
        path: '',
        loadChildren: () =>
          import('./item-attribute/item-attribute.routes').then(
            (m) => m.ItemAttributeRoutes
          ),
      },
      {
        path: 'welcome',
        component: WelcomeComponent,
      },
    ],
  },
];