import { Injectable } from '@angular/core';
import { delay, of, throwError } from 'rxjs';
import { UsersApi } from '../abstract/users.api';
import { usersMockDb } from './users.mock.db';
import { HttpErrorResponse } from '@angular/common/http';

@Injectable()
export class UsersMockService implements UsersApi {
  private db = usersMockDb;

  getUser(id: number) {
    const user = this.db.find((u) => u.id === id);
    if (!user) {
      return throwError(
        () =>
          new HttpErrorResponse({
            status: 404,
            statusText: 'Mock error',
          }),
      ).pipe(delay(400));
    }
    return of(user ?? null).pipe(delay(200));
  }
}
