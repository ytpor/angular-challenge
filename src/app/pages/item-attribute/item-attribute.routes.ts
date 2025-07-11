import { Routes } from '@angular/router';

import { ItemAttributeListComponent } from './item-attribute-list/item-attribute-list.component';
import { ItemAttributeFormComponent } from './item-attribute-form/item-attribute-form.component';
import { ItemAttributeDetailComponent } from './item-attribute-detail/item-attribute-detail.component';

export const ItemAttributeRoutes: Routes = [
  {
    path: 'item-attribute',
    children: [
      {
        path: '',
        pathMatch: 'full',
        redirectTo: 'list'
      },
      {
        path: 'list',
        component: ItemAttributeListComponent,
      },
      {
        path: 'create',
        component: ItemAttributeFormComponent,
      },
      {
        path: 'edit/:id',
        component: ItemAttributeDetailComponent,
      },
    ],
  },
];