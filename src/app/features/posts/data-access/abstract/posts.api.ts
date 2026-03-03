import { Observable } from 'rxjs';
import { Post } from '../../models/posts.model';

export abstract class PostsApi {
  abstract getPosts(page: number, perPage: number): Observable<Post[]>;
  abstract getPostsByUser(userId: number, page: number, perPage: number): Observable<Post[]>;
  abstract getPost(id: number): Observable<Post>;
  abstract createPost(userId: number, post: Partial<Post>): Observable<Post>;
  abstract updatePost(post: Partial<Post>): Observable<Post>;
  abstract deletePost(id: number): Observable<void>;
}