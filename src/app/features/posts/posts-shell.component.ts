import { Component, effect, inject } from '@angular/core';
import { PostsListComponent } from './ui/posts-list/posts-list.component';
import { ActivatedRoute, RouterOutlet } from '@angular/router';
import { PostsDataService } from './data-access/posts.data';
import { toSignal } from '@angular/core/rxjs-interop';
import { map, of } from 'rxjs';

@Component({
  selector: 'app-posts-shell',
  imports: [PostsListComponent, RouterOutlet],
  providers: [PostsDataService],
  templateUrl: './posts-shell.component.html',
  styleUrl: './posts-shell.component.scss',
})
export class PostsShellComponent {
  private route = inject(ActivatedRoute);
  private postsDataService = inject(PostsDataService);

  readonly activePostId = toSignal(
    this.route.firstChild?.paramMap.pipe(map((params) => Number(params.get('id')))) ?? of(null),
    { initialValue: null },
  );

  constructor() {
    effect(() => {
      this.postsDataService.selectedPostId.set(this.activePostId());
    });
  }
}
