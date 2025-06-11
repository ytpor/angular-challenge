import { Routes } from '@angular/router';

import { CategoryComponent } from './category/category.component';
import { ItemAttributeComponent } from './item-attribute/item-attribute.component';
import { WelcomeComponent } from './welcome/welcome.component';

export const FullRoutes: Routes = [
  {
    path: '',
    children: [
      {
        path: 'category',
        component: CategoryComponent,
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