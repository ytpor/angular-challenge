import { Routes } from '@angular/router';
import { ItemAttributeComponent } from './item-attribute/item-attribute.component';
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
        path: 'item-attribute',
        component: ItemAttributeComponent,
      },
      {
        path: 'welcome',
        component: WelcomeComponent,
      },
    ],
  },
];