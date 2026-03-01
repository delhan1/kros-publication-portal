import { inject, Injectable, signal } from '@angular/core';
import { rxResource } from '@angular/core/rxjs-interop';
import { delay } from 'rxjs';
import { CommentsService } from './comments.service';

@Injectable()
export class CommentsDataService {
  readonly selectedPostId = signal<number>(0);

  private commentsApi = inject(CommentsService);
  private page = signal(1); // start with 1
  private perPage = 10; // number of posts per page

  /*** RESOURCES ***/
  readonly commentsResource = rxResource({
    params: () => ({ postId: this.selectedPostId(), page: this.page() }),
    stream: ({ params: { postId, page } }) => this.commentsApi.getComments(postId, page, this.perPage),
  });

  onScrollDown() {
    this.page.set(this.page() + 1);
  }
}
