import { inject, Injectable } from '@angular/core';
import { delay, of } from 'rxjs';
import { Comment } from '../../models/comments.model';
import { CommentsApi } from '../abstract/comments.api';
import { commentsMockDb } from './comments.mock.db';
import { AuthStore } from '../../../../../core/auth/auth.store';

@Injectable()
export class CommentsMockService implements CommentsApi {
  private db = commentsMockDb;
  private authStore = inject(AuthStore);

  getComments(postId: number) {
    return of(this.db.filter((c) => c.post_id === postId)).pipe(delay(300));
  }

  createComment(postId: number, comment: Partial<Comment>) {
    const currentUser = this.authStore.currentUser();
    
    const newComment: Comment = {
      id: this.generateId(this.db),
      post_id: postId,
      user_id: currentUser?.id ?? 1,
      body: comment.body ?? '',
      created_at: new Date().toISOString(),
      email: currentUser?.email ?? '',
      name: currentUser?.name ?? '',
    };

    this.db.push(newComment);
    return of(newComment).pipe(delay(200));
  }

  deleteComment(id: number) {
    this.db = this.db.filter((c) => c.id !== id);
    return of(void 0).pipe(delay(200));
  }
  

  private generateId(collection: { id: number }[]) {
    return Math.max(...collection.map((i) => i.id)) + 1;
  }
}
