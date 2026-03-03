import { ApplicationConfig, provideBrowserGlobalErrorListeners } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { provideTranslateService } from '@ngx-translate/core';
import { provideTranslateHttpLoader } from '@ngx-translate/http-loader';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { authInterceptor } from './core/auth/auth.interceptor';
import { errorInterceptor } from './core/http/error.interceptor';
import { MAT_FORM_FIELD_DEFAULT_OPTIONS } from '@angular/material/form-field';
import { PostsApi } from './features/posts/data-access/abstract/posts.api';
import { environment } from '../environments/environment';
import { PostsService } from './features/posts/data-access/posts.service';
import { PostsMockService } from './features/posts/data-access/mock/posts.mock.service';
import { CommentsApi } from './features/posts/comments/data-access/abstract/comments.api';
import { CommentsMockService } from './features/posts/comments/data-access/mock/comments.mock.service';
import { CommentsService } from './features/posts/comments/data-access/comments.service';
import { UsersMockService } from './features/posts/data-access/mock/users.mock.service';
import { UsersService } from './features/posts/data-access/users.service';
import { UsersApi } from './features/posts/data-access/abstract/users.api';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideRouter(routes),
    provideTranslateService({
      lang: 'en',
      fallbackLang: 'en',
      loader: provideTranslateHttpLoader({
        prefix: './assets/i18n/',
        suffix: '.json',
      }),
    }),
    provideHttpClient(withInterceptors([errorInterceptor, authInterceptor])),
    {
      provide: MAT_FORM_FIELD_DEFAULT_OPTIONS,
      useValue: {
        subscriptSizing: 'dynamic',
      },
    },
    {
      provide: PostsApi,
      useClass: environment.useMockApi ? PostsMockService : PostsService,
    },
    {
      provide: CommentsApi,
      useClass: environment.useMockApi ? CommentsMockService : CommentsService,
    },
    {
      provide: UsersApi,
      useClass: environment.useMockApi ? UsersMockService : UsersService,
    },
  ],
};
