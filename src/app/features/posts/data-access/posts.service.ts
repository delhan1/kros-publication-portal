import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { Post } from '../models/posts.model';

@Injectable({
  providedIn: 'root',
})
export class PostsService {
  public constructor(private httpClient: HttpClient) {}

  /**
   * Gets all posts.
   * @param page Page number.
   * @param perPage Number of posts per page.
   * @return {Observable} of posts.
   */
  public getPosts(page: number, perPage: number): Observable<Post[]> {
    const params = new HttpParams()
      .set('page', page)
      .set('per_page', perPage);

    return this.httpClient.get<Post[]>(
      `${environment.api}/posts`,
      { params }
    );
  }

  /**
   * Gets post by id.
   * @param id Id of post.
   * @return {Observable} of posts.
   */
  public getPost(id: number): Observable<Post> {
    return this.httpClient.get<Post>(`${environment.api}/posts/${id}`);
  }
  //
  // /**
  //  * Gets count of likes by post id.
  //  * @param postId Id of post.
  //  * @return {Observable} of like count.
  //  */
  // public getPostLikeCount(postId: number): Observable<number> {
  //   return this.httpClient.get<number>(`${API_SERVER}/post/${postId}/like/count`);
  // }
  //
  // /**
  //  * Gets count of comments by post id.
  //  * @param postId
  //  * @return {Observable} of comments count.
  //  */
  // public getPostCommentCount(postId: number): Observable<number> {
  //   return this.httpClient.get<number>(`${API_SERVER}/post/${postId}/comment/count`);
  // }
  //
  // /**
  //  * Creates post.
  //  * @param post Post to create.
  //  * @return {Observable} of void.
  //  */
  // public createPost(post: Post): Observable<void> {
  //   return this.httpClient.put<void>(`${API_SERVER}/post`, post);
  // }
  //
  // /**
  //  * Updates post.
  //  * @param post Post to update.
  //  * @return {Observable} of void.
  //  */
  // public updatePost(post: Post): Observable<void> {
  //   return this.httpClient.put<void>(`${API_SERVER}/post/${post.id}`, post);
  // }
  //
  // /**
  //  * Creates comment of post specified by id.
  //  * @param postId Id of post.
  //  * @param comment Comment to create.
  //  * @return {Observable} of void.
  //  */
  // public createPostComment(postId: number, comment: Comment): Observable<void> {
  //   return this.httpClient.put<void>(`${API_SERVER}/post/${postId}/comment`, comment);
  // }
  //
  // /**
  //  * Deletes post by id.
  //  * @param id Id of post.
  //  * @return {Observable} of void.
  //  */
  // public deletePost(id: number): Observable<void> {
  //   return this.httpClient.delete<void>(`${API_SERVER}/post/${id}`);
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
