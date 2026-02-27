import { Routes } from '@angular/router';
import { LayoutComponent } from './core/layout/layout.component';
import { ErrorState } from './core/layout/error/error.routes';

export const routes: Routes = [
  {
    path: '',
    component: LayoutComponent,
    children: [],
  },
];
