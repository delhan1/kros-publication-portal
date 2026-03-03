import { inject, Injectable } from '@angular/core';
import { AuthStore } from './auth.store';
import { tap } from 'rxjs';
import { UsersApi } from '../../features/posts/data-access/abstract/users.api';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private usersApi = inject(UsersApi);
  private authStore = inject(AuthStore);

  loginById(id: number) {
    return this.usersApi.getUser(id).pipe(
      tap((user) => {
        this.authStore.login(user);
      }),
    );
  }

  logout() {
    this.authStore.logout();
  }
}
