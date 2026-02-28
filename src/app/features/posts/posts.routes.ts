import { Routes } from '@angular/router';
import { PostsShellComponent } from './posts-shell.component';
import { PostsDetailComponent } from './ui/posts-detail/posts-detail.component';
import { PostsEmptyPlaceholderComponent } from './ui/posts-empty-placeholder/posts-empty-placeholder.component';

export const postsRoutes: Routes = [
  {
    path: '',
    component: PostsShellComponent,
    children: [
      {
        path: '',
        component: PostsEmptyPlaceholderComponent,
      },
      {
        path: ':id',
        component: PostsDetailComponent,
      },
    ],
  },
];
