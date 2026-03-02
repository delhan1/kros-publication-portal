import { inject, Injectable } from '@angular/core';
import { UsersService } from '../../features/posts/data-access/users.service';
import { AuthStore } from './auth.store';
import { tap } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private usersApi = inject(UsersService);
  private authStore = inject(AuthStore);

  loginById(id: number) {
    return this.usersApi.getUser(id).pipe(
      tap(user => {
        this.authStore.login(user);
      })
    );
  }
  
  logout() {
    this.authStore.logout();
  }
}