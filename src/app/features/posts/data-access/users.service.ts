import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { User } from '../models/users.model';

@Injectable({
  providedIn: 'root',
})
export class UsersService {
  public constructor(private httpClient: HttpClient) {}

  /**
   * Gets all users.
   * @return {Observable} of users.
   */
  public getUsers(): Observable<User[]> {
    return this.httpClient.get<User[]>(`${environment.api}/users`);
  }

  /**
   * Gets user by id.
   * @param id Id of user.
   * @return {Observable} of users.
   */
  public getUser(id: number): Observable<User> {
    return this.httpClient.get<User>(`${environment.api}/users/${id}`);
  }
  //
  // /**
  //  * Gets count of likes by user id.
  //  * @param userId Id of user.
  //  * @return {Observable} of like count.
  //  */
  // public getUserLikeCount(userId: number): Observable<number> {
  //   return this.httpClient.get<number>(`${API_SERVER}/user/${userId}/like/count`);
  // }
  //
  // /**
  //  * Gets count of comments by user id.
  //  * @param userId
  //  * @return {Observable} of comments count.
  //  */
  // public getUserCommentCount(userId: number): Observable<number> {
  //   return this.httpClient.get<number>(`${API_SERVER}/user/${userId}/comment/count`);
  // }
  //
  // /**
  //  * Creates user.
  //  * @param user User to create.
  //  * @return {Observable} of void.
  //  */
  // public createUser(user: User): Observable<void> {
  //   return this.httpClient.put<void>(`${API_SERVER}/user`, user);
  // }
  //
  // /**
  //  * Updates user.
  //  * @param user User to update.
  //  * @return {Observable} of void.
  //  */
  // public updateUser(user: User): Observable<void> {
  //   return this.httpClient.put<void>(`${API_SERVER}/user/${user.id}`, user);
  // }
  //
  // /**
  //  * Creates comment of user specified by id.
  //  * @param userId Id of user.
  //  * @param comment Comment to create.
  //  * @return {Observable} of void.
  //  */
  // public createUserComment(userId: number, comment: Comment): Observable<void> {
  //   return this.httpClient.put<void>(`${API_SERVER}/user/${userId}/comment`, comment);
  // }
  //
  // /**
  //  * Deletes user by id.
  //  * @param id Id of user.
  //  * @return {Observable} of void.
  //  */
  // public deleteUser(id: number): Observable<void> {
  //   return this.httpClient.delete<void>(`${API_SERVER}/user/${id}`);
  // }
  //
  // /**
  //  * Deletes comment by id.
  //  * @param id Id of comment.
  //  * @return {Observable} of void.
  //  */
  // public deleteComment(id: number): Observable<void> {
  //   return this.httpClient.delete<void>(`${API_SERVER}/comment/${id}`);
  // }
}
