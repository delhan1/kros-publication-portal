import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { User } from '../models/users.model';
import { UsersApi } from './abstract/users.api';

@Injectable({
  providedIn: 'root',
})
export class UsersService implements UsersApi {
  public constructor(private httpClient: HttpClient) {}

  /**
   * Gets user by id.
   * @param id Id of user.
   * @return {Observable} of users.
   */
  public getUser(id: number): Observable<User> {
    return this.httpClient.get<User>(`${environment.api}/users/${id}`);
  }
}
