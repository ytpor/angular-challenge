import { Routes } from '@angular/router';
import { BlankComponent } from './layouts/blank/blank.component';
import { FullComponent } from './layouts/full/full.component';
import { authGuard } from './guards/auth/auth.guard';
import { NotFoundComponent } from './components/not-found/not-found.component';

export const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    redirectTo: '/login'
  },
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
        canActivate: [authGuard],
        loadChildren: () =>
          import('./pages/full.routes').then(
            (m) => m.FullRoutes
          ),
      },
    ],
  },
  {
    path: '**',
    component: NotFoundComponent,
  },
];
