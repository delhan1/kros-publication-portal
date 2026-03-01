import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
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
   * Gets comment by id.
   * @param id Id of comment.
   * @return {Observable} of comments.
   */
  public getComment(id: number): Observable<Comment> {
    return this.httpClient.get<Comment>(`${environment.api}/comments/${id}`);
  }
  //
  // /**
  //  * Gets count of likes by comment id.
  //  * @param commentId Id of comment.
  //  * @return {Observable} of like count.
  //  */
  // public getCommentLikeCount(commentId: number): Observable<number> {
  //   return this.httpClient.get<number>(`${API_SERVER}/comment/${commentId}/like/count`);
  // }
  //
  // /**
  //  * Gets count of comments by comment id.
  //  * @param commentId
  //  * @return {Observable} of comments count.
  //  */
  // public getCommentCommentCount(commentId: number): Observable<number> {
  //   return this.httpClient.get<number>(`${API_SERVER}/comment/${commentId}/comment/count`);
  // }
  //
  // /**
  //  * Creates comment.
  //  * @param comment Comment to create.
  //  * @return {Observable} of void.
  //  */
  // public createComment(comment: Comment): Observable<void> {
  //   return this.httpClient.put<void>(`${API_SERVER}/comment`, comment);
  // }
  //
  // /**
  //  * Updates comment.
  //  * @param comment Comment to update.
  //  * @return {Observable} of void.
  //  */
  // public updateComment(comment: Comment): Observable<void> {
  //   return this.httpClient.put<void>(`${API_SERVER}/comment/${comment.id}`, comment);
  // }
  //
  // /**
  //  * Creates comment of comment specified by id.
  //  * @param commentId Id of comment.
  //  * @param comment Comment to create.
  //  * @return {Observable} of void.
  //  */
  // public createCommentComment(commentId: number, comment: Comment): Observable<void> {
  //   return this.httpClient.put<void>(`${API_SERVER}/comment/${commentId}/comment`, comment);
  // }
  //
  /**
   * Deletes comment by id.
   * @param id Id of comment.
   * @return {Observable} of void.
   */
  public deleteComment(id: number): Observable<void> {
    return this.httpClient.delete<void>(`${environment.api}/comments/${id}`);
  }
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
