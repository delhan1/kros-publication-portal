import { computed, effect, inject, Injectable, signal } from '@angular/core';
import { rxResource } from '@angular/core/rxjs-interop';
import { tap, throwError } from 'rxjs';
import { Comment } from '../models/comments.model';
import { CommentsApi } from './abstract/comments.api';

@Injectable()
export class CommentsDataService {
  readonly selectedPostId = signal<number | null>(null);

  private commentsList = signal<Comment[]>([]); // local management
  private commentsApi = inject(CommentsApi);

  /*** RESOURCES ***/
  readonly commentsResource = rxResource({
    params: () => ({ postId: this.selectedPostId() }),
    stream: ({ params: { postId } }) => {
      if (!postId) {
        return throwError(() => new Error('No post selected'));
      }

      return this.commentsApi.getComments(postId).pipe(tap(() => console.log('GET COMMENTS')));
    },
  });

  readonly commentsVm = computed(() => {
    if (this.commentsResource.error()) return [];
    return this.commentsList() ?? [];
  });


  constructor() {
    effect(() => {
      const resourceComments = this.commentsResource.value() ?? [];
      this.commentsList.set(resourceComments);
    });
  }

  createComment(comment: Partial<Comment>) {
    const postId = this.selectedPostId();

    if (!postId) {
      return throwError(() => new Error('No post selected'));
    }
    return this.commentsApi
      .createComment(postId, comment)
      .pipe(tap((c) => this.commentsList.update((prev) => [c, ...prev])));
  }

  deleteComment(id: number) {
    return this.commentsApi
      .deleteComment(id)
      .pipe(tap(() => this.commentsList.update((prev) => prev.filter((c) => c.id !== id))));
  }
}
