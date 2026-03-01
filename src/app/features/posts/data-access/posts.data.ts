import { computed, effect, inject, Injectable, Signal, signal } from '@angular/core';
import { PostsService } from './posts.service';
import { rxResource } from '@angular/core/rxjs-interop';
import { UsersService } from './users.service';
import { catchError, delay, EMPTY, first, forkJoin, map, of } from 'rxjs';
import { User } from '../models/users.model';
import { Post, PostUser } from '../models/posts.model';

@Injectable()
export class PostsDataService {
  private postsApi = inject(PostsService);
  private usersApi = inject(UsersService);
  private usersMap = signal<Record<number, User | null>>({}); // null in case of non-existing user
  private page = signal(1); // start with 1
  private perPage = 10; // number of posts per page
  private loadingUsers = new Set<number>();
  private detailResolved = signal(false);

  readonly posts = signal<Post[]>([]);
  readonly selectedPostId = signal<number | null>(null);

  /*** RESOURCES ***/
  readonly postsResource = rxResource({
    params: () => this.page(),
    stream: ({ params: page }) => this.postsApi.getPosts(page, this.perPage).pipe(delay(3000)),
  });

  readonly postDetailResource = rxResource({
    params: () => {
      const id = this.selectedPostId();
      // const postsPage = this.postsResource.value();
      //
      if (!id) return null;
      //
      // // ak ešte nemáme page data, nevieme rozhodnúť
      // if (!postsPage) return null;
      //
      // // 🔥 kontrola priamo proti page výsledku
      // const existsInPage = postsPage.some(p => p.id === id);
      // if (existsInPage) return null;

      return id;
    },
    stream: ({ params: id }) => {
      return id ? this.postsApi.getPost(id) : of(null);
    },
  });

  readonly usersBatchResource = rxResource({
    params: () => {
      const ids = this.missingUserIds();
      return ids.length ? ids.join(',') : null;
    },
    stream: ({ params }) => {
      if (!params) {
        return of([]);
      }

      const ids = params.split(',').map(Number);

      if (!ids.length) {
        return of([]);
      }

      return forkJoin(
        ids.map((id) =>
          this.usersApi.getUser(id).pipe(
            first(),
            map((user) => ({ id, user })),
            catchError(() => of({ id, user: null })),
          ),
        ),
      );
    },
  });

  /*** VIEWMODELS ***/
  readonly postsVm = computed(() => {
    const users = this.usersMap();
    return this.posts().map(post => ({
      ...post,
      author_name: users[post.user_id]?.name ?? 'Unknown',
    }));
  });

  readonly postDetailVm: Signal<PostUser | null> = computed(() => {
    const post = this.selectedFromList() ?? this.postDetailResource.value() ?? null;
    const users = this.usersMap();

    if (!post || !users) return null;

    const author = users[post.user_id];

    return {
      ...post,
      author_name: author?.name ?? 'Unknown',
      author_email: author?.email ?? null,
    };
  });

  /*** HELPER SIGNALS ***/
  readonly selectedFromList = computed(() => {
    const id = this.selectedPostId();
    const posts = this.posts();

    if (!id || !posts) return null;

    return posts.find((p) => p.id === id) ?? null;
  });

  readonly missingUserIds = computed(() => {
    const posts = this.posts();
    const detail = this.postDetailResource.value();
    const users = this.usersMap();

    const ids = [...posts.map((p) => p.user_id), ...(detail ? [detail.user_id] : [])];

    return [...new Set(ids)].filter((id) => users[id] === undefined);
  });

  readonly loading = computed(() => this.postsResource.isLoading() || this.usersBatchResource.isLoading());

  readonly detailLoading = computed(() => this.postDetailResource.isLoading() || this.usersBatchResource.isLoading());

  readonly error = computed(
    () => this.postsResource.error() ?? this.postDetailResource.error() ?? this.usersBatchResource.error(),
  );

  constructor() {
    effect(() => {
      const newPosts = this.postsResource.value();
      if (!newPosts?.length) return;

      this.posts.update(prev => {
        const existingIds = new Set(prev.map(p => p.id));
        const filtered = newPosts.filter(p => !existingIds.has(p.id));
        return [...prev, ...filtered];
      });
    });

    effect(() => {
      const results = this.usersBatchResource.value();
      if (!results?.length) return;

      this.usersMap.update((prev) => {
        const updated = { ...prev };
        results.forEach(({ id, user }) => {
          updated[id] = user;
        });
        return updated;
      });
    });

    // effect(() => {
    //   const posts = this.posts() ?? [];
    //   const detail = this.postDetailResource.value();
    //
    //   const allUserIds = new Set<number>();
    //
    //   posts.forEach((p) => allUserIds.add(p.user_id));
    //   if (detail) allUserIds.add(detail.user_id);
    //
    //   const users = this.usersMap();
    //
    //   const missingIds = [...allUserIds].filter(
    //     (id) =>
    //       users[id] === undefined &&
    //       !this.loadingUsers.has(id)
    //   );
    //
    //   if (!missingIds.length) return;
    //
    //   missingIds.forEach(id => this.loadingUsers.add(id));
    //
    //   forkJoin(
    //     missingIds.map((id) =>
    //       this.usersApi.getUser(id).pipe(
    //         map((user) => ({ id, user })),
    //         catchError(() => of({ id, user: null })),
    //       ),
    //     ),
    //   )
    //     .pipe(first())
    //     .subscribe((results) => {
    //       this.usersMap.update((prev) => {
    //         const updated = { ...prev };
    //         results.forEach(({ id, user }) => {
    //           updated[id] = user;
    //           this.loadingUsers.delete(id);
    //         });
    //         return updated;
    //       });
    //     });
    // });
  }

  onScrollDown() {
    this.page.set(this.page() + 1);
  }
}
