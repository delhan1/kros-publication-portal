import { Injectable } from '@angular/core';
import { delay, of, throwError } from 'rxjs';
import { PostsApi } from '../abstract/posts.api';
import { Post } from '../../models/posts.model';
import { postsMockDb } from './posts.mock.db';
import { HttpErrorResponse } from '@angular/common/http';

@Injectable()
export class PostsMockService implements PostsApi {
  private db = postsMockDb;

  getPosts(page: number, perPage: number) {
    const start = (page - 1) * perPage;
    const end = start + perPage;
    return of(this.db.slice(start, end)).pipe(delay(300));
  }

  getPostsByUser(userId: number, page: number, perPage: number) {
    const start = (page - 1) * perPage;
    const end = start + perPage;
    return of(this.db.filter((p) => p.user_id === userId).slice(start, end)).pipe(delay(300));
  }

  getPost(id: number) {
    const post = this.db.find((p) => p.id === id);
    if (!post) {
      return throwError(
        () =>
          new HttpErrorResponse({
            status: 404,
            statusText: 'Mock error',
          }),
      ).pipe(delay(400));
    }
    return of(post ?? null).pipe(delay(200));
  }

  createPost(userId: number, post: Partial<Post>) {
    const newPost: Post = {
      id: this.generateId(this.db),
      user_id: userId,
      title: post.title ?? '',
      body: post.body ?? '',
      created_at: new Date().toISOString(),
    };

    this.db.unshift(newPost);
    return of(newPost).pipe(delay(300));
  }

  updatePost(post: Partial<Post>) {
    const newPost: Post = {
      id: post.id ?? 1,
      user_id: post.user_id ?? 1,
      title: post.title ?? '',
      body: post.body ?? '',
      created_at: new Date().toISOString(),
    };

    this.db.unshift(newPost);
    return of(newPost).pipe(delay(300));
  }

  deletePost(id: number) {
    this.db = this.db.filter((p) => p.id !== id);
    return of(void 0).pipe(delay(200));
  }

  private generateId(collection: { id: number }[]) {
    return Math.max(...collection.map((i) => i.id)) + 1;
  }
}
