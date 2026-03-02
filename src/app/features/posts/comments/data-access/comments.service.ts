import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { environment } from '../../../../../environments/environment';
import { Comment } from '../models/comments.model';

@Injectable({
  providedIn: 'root',
})
export class CommentsService {
  public constructor(private httpClient: HttpClient) {}

  /**
   * Gets all comments.
   * @param postId Post ID.
   * @param page Page number.
   * @param perPage Number of comments per page.
   * @return {Observable} of comments.
   */
  public getComments(postId: number, page: number, perPage: number): Observable<Comment[]> {
    const params = new HttpParams().set('page', page).set('per_page', perPage);

    return this.httpClient.get<Comment[]>(`${environment.api}/posts/${postId}/comments`, { params });
  }

  /**
   * Creates comment.
   * @param postId Post ID.
   * @param comment Comment to create.
   * @return {Observable} of void.
   */
  public createComment(postId: number, comment: Partial<Comment>): Observable<void> {
    return this.httpClient.post<void>(`${environment.api}/posts/${postId}/comments`, comment);
  }

  /**
   * Deletes comment by id.
   * @param id Id of comment.
   * @return {Observable} of void.
   */
  public deleteComment(id: number): Observable<void> {
    return this.httpClient.delete<void>(`${environment.api}/comments/${id}`);
  }
}
