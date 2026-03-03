import { Component, effect, inject } from '@angular/core';
import { PostsListComponent } from './ui/posts-list/posts-list.component';
import { ActivatedRoute, NavigationEnd, Router, RouterOutlet } from '@angular/router';
import { toSignal } from '@angular/core/rxjs-interop';
import { filter, map, startWith } from 'rxjs';
import { PostsTestDataService } from './data-access/posts-test.data';
import { PostsLayoutService } from './data-access/posts-layout.service';

@Component({
  selector: 'app-posts-shell',
  imports: [PostsListComponent, RouterOutlet],
  providers: [PostsTestDataService, PostsLayoutService],
  templateUrl: './posts-shell.component.html',
  styleUrl: './posts-shell.component.scss',
})
export class PostsShellComponent {
  readonly postsLayoutService = inject(PostsLayoutService);
  
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private postsDataService = inject(PostsTestDataService);

  readonly activePostId = toSignal(
    this.router.events.pipe(
      filter((e) => e instanceof NavigationEnd),
      startWith(null),
      map(() => {
        const child = this.route.firstChild;
        const id = child?.snapshot.paramMap.get('id');
        return id ? Number(id) : null;
      }),
    ),
    { initialValue: null },
  );

  constructor() {
    effect(() => {
      this.postsDataService.selectedPostId.set(this.activePostId());
      if (!this.activePostId()) {
        this.postsLayoutService.setView('list');
      }
    });
  }
}
