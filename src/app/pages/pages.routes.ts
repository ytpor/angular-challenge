import { Routes } from '@angular/router';

import { LongComponent } from './long/long.component';
import { WelcomeComponent } from './welcome/welcome.component';

export const PagesRoutes: Routes = [
  {
    path: '',
    children: [
      {
        path: 'long',
        component: LongComponent,
      },
      {
        path: 'welcome',
        component: WelcomeComponent,
      },
    ],
  },
];