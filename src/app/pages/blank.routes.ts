import { Routes } from '@angular/router';

import { LoginComponent } from './login/login.component';
import { loginGuard } from '../guards/login/login.guard';

export const BlankRoutes: Routes = [
  {
    path: '',
    children: [
      {
        path: 'login',
        canActivate: [loginGuard],
        component: LoginComponent,
      },
    ],
  },
];