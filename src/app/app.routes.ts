import { Routes } from '@angular/router';
import { BlankComponent } from './layouts/blank/blank.component';
import { FullComponent } from './layouts/full/full.component';

export const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: '/welcome' },
  // {
  //   path: 'welcome',
  //   loadChildren: () =>
  //     import('./pages/welcome/welcome.routes').then(
  //       m => m.WELCOME_ROUTES
  //     )
  // },
  {
    path: '',
    component: BlankComponent,
    children: [
      {
        path: '',
        loadChildren: () =>
          import('./pages/blank.routes').then(
            (m) => m.BlankRoutes
          ),
      },
    ],
  },
  {
    path: '',
    component: FullComponent,
    children: [
      {
        path: '',
        loadChildren: () =>
          import('./pages/full.routes').then(
            (m) => m.FullRoutes
          ),
      },
    ],
  },
];
