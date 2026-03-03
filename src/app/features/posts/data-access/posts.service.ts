import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { map, Observable, of } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { Post } from '../models/posts.model';
import { PostsApi } from './abstract/posts.api';

@Injectable({
  providedIn: 'root',
})
export class PostsService implements PostsApi {
  public constructor(private httpClient: HttpClient) {}

  /**
   * Gets all posts.
   * @param page Page number.
   * @param perPage Number of posts per page.
   * @return {Observable} of posts.
   */
  public getPosts(page: number, perPage: number): Observable<Post[]> {
    const params = new HttpParams().set('page', page).set('per_page', perPage);

    return this.httpClient.get<Post[]>(`${environment.api}/posts`, { params });
  }

  /**
   * Gets all posts.
   * @param userId
   * @param page Page number.
   * @param perPage Number of posts per page.
   * @return {Observable} of posts.
   */
  public getPostsByUser(userId: number, page: number, perPage: number): Observable<Post[]> {
    const params = new HttpParams().set('page', page).set('per_page', perPage);

    return this.httpClient.get<Post[]>(`${environment.api}/users/${userId}/posts`, { params });
  }

  /**
   * Gets post by id.
   * @param id Id of post.
   * @return {Observable} of posts.
   */
  public getPost(id: number): Observable<Post> {
    return this.httpClient.get<Post>(`${environment.api}/posts/${id}`);
  }

  /**
   * Creates post.
   * @param userId User ID.
   * @param post Post to create.
   * @return {Observable} of Post.
   */
  public createPost(userId: number, post: Partial<Post>): Observable<Post> {
    return this.httpClient.post<Post>(`${environment.api}/users/${userId}/posts`, post);
  }

  /**
   * Updates post.
   * @param post Post to update.
   * @return {Observable} of Post.
   */
  public updatePost(post: Partial<Post>): Observable<Post> {
    return this.httpClient.put<Post>(`${environment.api}/posts/${post.id}`, post);
  }

  /**
   * Deletes post by id.
   * @param id Id of post.
   * @return {Observable} of void.
   */
  public deletePost(id: number): Observable<void> {
    return this.httpClient.delete<void>(`${environment.api}/posts/${id}`);
  }
}
