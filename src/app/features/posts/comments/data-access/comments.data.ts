import { inject, Injectable, signal } from '@angular/core';
import { rxResource } from '@angular/core/rxjs-interop';
import { delay, tap } from 'rxjs';
import { CommentsService } from './comments.service';

@Injectable()
export class CommentsDataService {
  readonly selectedPostId = signal<number>(0);

  private commentsApi = inject(CommentsService);
  private page = signal(1); // start with 1
  private perPage = 10; // number of posts per page
  private refreshTick = signal(0);

  /*** RESOURCES ***/
  readonly commentsResource = rxResource({
    params: () => ({ postId: this.selectedPostId(), page: this.page(), refresh: this.refreshTick() }),
    stream: ({ params: { postId, page } }) => this.commentsApi.getComments(postId, page, this.perPage),
  });

  deleteComment(id: number) {
    return this.commentsApi.deleteComment(id).pipe(
      tap(() => {
        // trigger refetch
        this.refreshTick.update(v => v + 1);
      })
    );
  }

  onScrollDown() {
    this.page.set(this.page() + 1);
  }
}
