import { computed, Injectable, signal } from '@angular/core';
import { User } from '../../features/posts/models/users.model';

@Injectable({ providedIn: 'root' })
export class AuthStore {
  private _currentUser = signal<User | null>(null);

  readonly currentUser = this._currentUser.asReadonly();
  readonly isLoggedIn = computed(() => !!this._currentUser());

  login(user: User) {
    this._currentUser.set(user);
    localStorage.setItem('currentUser', JSON.stringify(user));
  }

  logout() {
    this._currentUser.set(null);
    localStorage.removeItem('currentUser');
  }

  restore() {
    const stored = localStorage.getItem('currentUser');
    if (stored) {
      this._currentUser.set(JSON.parse(stored));
    }
  }
}