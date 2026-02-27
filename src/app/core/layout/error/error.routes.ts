import {Routes} from '@angular/router';

import {ErrorComponent} from './error.component';

const errorRoutes: Routes = [
  {
    path: '404',
    component: ErrorComponent,
    data: {
      error404: true
    }
  },
  {
    path: '**',
    redirectTo: '/404'
  }
];

export const ErrorState: Routes = [
  {
    path: '',
    children: errorRoutes
  }
];
