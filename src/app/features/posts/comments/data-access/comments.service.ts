import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { environment } from '../../../../../environments/environment';
import { Comment } from '../models/comments.model';
import { CommentsApi } from './abstract/comments.api';

@Injectable({
  providedIn: 'root',
})
export class CommentsService implements CommentsApi {
  public constructor(private httpClient: HttpClient) {}

  /**
   * Gets all comments.
   * @param postId Post ID.
   * @return {Observable} of comments.
   */
  public getComments(postId: number): Observable<Comment[]> {
    return this.httpClient.get<Comment[]>(`${environment.api}/posts/${postId}/comments`);
  }

  /**
   * Creates comment.
   * @param postId Post ID.
   * @param comment Comment to create.
   * @return {Observable} of Comment.
   */
  public createComment(postId: number, comment: Partial<Comment>): Observable<Comment> {
    return this.httpClient.post<Comment>(`${environment.api}/posts/${postId}/comments`, comment);
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
