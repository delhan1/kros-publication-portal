import { computed, effect, inject, Injectable, Signal, signal } from '@angular/core';
import { PostsService } from './posts.service';
import { rxResource } from '@angular/core/rxjs-interop';
import { UsersService } from './users.service';
import { catchError, finalize, first, forkJoin, map, of, switchMap, tap, throwError } from 'rxjs';
import { User } from '../models/users.model';
import { Post, PostUser } from '../models/posts.model';
import { AuthStore } from '../../../core/auth/auth.store';
import { AuthRequiredError } from '../../../core/auth/errors/auth-required.error';

@Injectable()
export class PostsDataService {
  private postsApi = inject(PostsService);
  private usersApi = inject(UsersService);
  private authStore = inject(AuthStore);
  private usersMap = signal<Record<number, User | null>>({}); // null in case of non-existing user
  private page = signal(1); // start with 1
  private perPage = 10; // number of posts per page
  private loadingUsers = new Set<number>();
  private detailResolved = signal(false);
  private refreshTick = signal(0);
  private usersLoading = signal(false);
  private posts = signal<Post[]>([]);

  // readonly posts = signal<Post[]>([]);
  readonly authorFilter = signal<number | null>(null);
  readonly selectedPostId = signal<number | null>(null);
  private loadingSelectedPost = signal<Record<number, boolean>>({});

  private shouldFetchSelectedPost = computed(() => {
    const id = this.selectedPostId();
    if (!id) return false;

    const postsPage = this.postsResource.value();
    if (!postsPage) return false; // počkáme na page

    const exists = this.posts().some(p => p.id === id);
    const isLoading = this.loadingSelectedPost()[id] === true;

    return !exists && !isLoading;
  });
  
  /*** RESOURCES ***/
  private selectedPostResource = rxResource({
    params: () => this.shouldFetchSelectedPost() ? this.selectedPostId() : null,
    stream: ({ params: id }) => {
      if (!id) return of(null);

      this.loadingSelectedPost.update(prev => ({ ...prev, [id]: true }));

      return this.postsApi.getPost(id).pipe(
        tap(() => console.log('GET POST', id)),
        finalize(() => {
          this.loadingSelectedPost.update(prev => ({ ...prev, [id]: false }));
        })
      );
    },
  });

  private usersResource = rxResource({
    params: () => {
      const required = this.requiredUserIds();
      const users = this.usersMap();

      const missing = required.filter((id) => users[id] === undefined);

      return missing.length ? missing.join(',') : null;
    },
    stream: ({ params }) => {
      if (!params) return of([]);

      const ids = params.split(',').map(Number);

      return forkJoin(
        ids.map((id) =>
          this.usersApi.getUser(id).pipe(
            tap((user) => console.log('GET USER', id)),
            map((user) => ({ id, user })),
            catchError(() => {
              console.log('GET USER ERROR', id);
              return of({ id, user: null });
            }),
          ),
        ),
      );
    },
  });
  // readonly postsResource = rxResource({
  //   params: () => ({
  //     page: this.page(),
  //     authorId: this.authorFilter(),
  //   }),
  //   stream: ({ params }) => {
  //     if (params.authorId) {
  //       return this.postsApi.getPostsByUser(params.authorId, params.page, this.perPage);
  //     }
  //
  //     return this.postsApi.getPosts(params.page, this.perPage);
  //   },
  // });
  //
  // readonly postDetailResource = rxResource({
  //   params: () => {
  //     const id = this.selectedPostId();
  //     // const postsPage = this.postsResource.value();
  //     //
  //     if (!id) return null;
  //     //
  //     // // ak ešte nemáme page data, nevieme rozhodnúť
  //     // if (!postsPage) return null;
  //     //
  //     // // 🔥 kontrola priamo proti page výsledku
  //     // const existsInPage = postsPage.some(p => p.id === id);
  //     // if (existsInPage) return null;
  //
  //     return id;
  //   },
  //   stream: ({ params: id }) => {
  //     return id ? this.postsApi.getPost(id).pipe(catchError(() => of(null))) : of(null);
  //   },
  // });
  //
  // readonly usersBatchResource = rxResource({
  //   params: () => {
  //     const ids = this.missingUserIds();
  //     return ids.length ? ids.join(',') : null;
  //   },
  //   stream: ({ params }) => {
  //     if (!params) {
  //       return of([]);
  //     }
  //
  //     const ids = params.split(',').map(Number);
  //
  //     if (!ids.length) {
  //       return of([]);
  //     }
  //
  //     return forkJoin(
  //       ids.map((id) =>
  //         this.usersApi.getUser(id).pipe(
  //           first(),
  //           map((user) => ({ id, user })),
  //           catchError(() => of({ id, user: null })),
  //         ),
  //       ),
  //     );
  //   },
  // });

  /*** VIEWMODELS ***/
  readonly postsVm = computed<PostUser[]>(() => {
    const posts = this.posts();
    const users = this.usersMap();

    return posts.map((post) => ({
      ...post,
      author_name: users[post.user_id]?.name ?? 'Unknown',
    }));
  });

  readonly selectedPostVm = computed<PostUser | null>(() => {
    const post = this.selectedPost();
    const users = this.usersMap();

    if (!post) return null;

    return {
      ...post,
      author_name: users[post.user_id]?.name ?? 'Unknown',
    };
  });
  // readonly postsVm = computed(() => {
  //   const users = this.usersMap();
  //   return this.posts().map((post) => ({
  //     ...post,
  //     author_name: users[post.user_id]?.name ?? 'Unknown',
  //   }));
  // });
  //
  // readonly postDetailVm: Signal<PostUser | null> = computed(() => {
  //   const post = this.selectedFromList() ?? this.postDetailResource.value() ?? null;
  //   const users = this.usersMap();
  //
  //   if (!post || !users) return null;
  //
  //   const author = users[post.user_id];
  //
  //   return {
  //     ...post,
  //     author_name: author?.name ?? 'Unknown',
  //     author_email: author?.email ?? null,
  //   };
  // });

  /*** HELPER SIGNALS ***/
  // readonly selectedFromList = computed(() => {
  //   const id = this.selectedPostId();
  //   const posts = this.posts();
  //
  //   if (!id || !posts) return null;
  //
  //   return posts.find((p) => p.id === id) ?? null;
  // });

  private requiredUserIds = computed<number[]>(() => {
    const posts = this.posts();
    const detail = this.selectedPost();

    const ids = new Set<number>();

    posts.forEach((p) => ids.add(p.user_id));
    if (detail) ids.add(detail.user_id);

    return [...ids].sort();
  });

  private postsResource = rxResource({
    params: () => ({
      page: this.page(),
      perPage: this.perPage,
    }),
    stream: ({ params }) =>
      this.postsApi.getPosts(params.page, params.perPage).pipe(tap(() => console.log('GET POSTS'))),
  });

  // 🔹 Selected post computed z už načítaných posts
  private selectedPostFromList = computed<Post | null>(() => {
    const id = this.selectedPostId();
    if (!id) return null;

    return this.posts().find((p) => p.id === id) ?? null;
  });

  readonly selectedPost = computed<Post | null>(() => {
    // 1️⃣ najprv skús z listu
    const fromList = this.selectedPostFromList();
    if (fromList) return fromList;

    // 2️⃣ ak nie je, použij resource
    return this.selectedPostResource.value() ?? null;
  });

  private missingUserIds = computed<number[]>(() => {
    const posts = this.posts();
    const detail = this.selectedPost();
    const users = this.usersMap();

    const allIds = new Set<number>();

    posts.forEach((p) => allIds.add(p.user_id));
    if (detail) allIds.add(detail.user_id);

    return [...allIds].filter((id) => users[id] === undefined);
  });

  // readonly missingUserIds = computed(() => {
  //   const posts = this.posts();
  //   const detail = this.postDetailResource.value();
  //   const users = this.usersMap();
  //
  //   const ids = [...posts.map((p) => p.user_id), ...(detail ? [detail.user_id] : [])];
  //
  //   return [...new Set(ids)].filter((id) => users[id] === undefined);
  // });

  readonly listLoading = computed(() => this.postsResource.isLoading() || this.usersResource.isLoading());

  readonly detailLoading = computed(() => this.selectedPostResource.isLoading() || this.usersResource.isLoading());

  readonly listError = computed(() => this.postsResource.error());

  readonly detailError = computed(() => this.selectedPostResource.error());

  constructor() {
    effect(() => {
      const newPosts = this.postsResource.value();
      if (!newPosts?.length) return;

      this.posts.update((prev) => {
        const existingIds = new Set(prev.map((p) => p.id));
        const filtered = newPosts.filter((p) => !existingIds.has(p.id));
        return [...prev, ...filtered];
      });
    });
    effect(() => {
      const detail = this.selectedPostResource.value();
      if (!detail) return;

      this.posts.update((prev) => {
        const exists = prev.some((p) => p.id === detail.id);
        if (exists) return prev;

        return [...prev, detail];
      });
    });

    // effect(() => {
    //   const posts = this.posts();
    //   const detail = this.selectedPost();
    //   const users = this.usersMap();
    //
    //   const allUserIds = new Set<number>();
    //
    //   posts.forEach((p) => allUserIds.add(p.user_id));
    //   if (detail) allUserIds.add(detail.user_id);
    //
    //   const missingIds = [...allUserIds].filter((id) => users[id] === undefined);
    //
    //   if (!missingIds.length) return;
    //
    //   this.usersLoading.set(true);
    //   forkJoin(
    //     missingIds.map((id) =>
    //       this.usersApi.getUser(id).pipe(
    //         tap((user) => {
    //           console.log('GET USER', id);
    //           this.usersMap.update((prev) => ({
    //             ...prev,
    //             [id]: user,
    //           }));
    //         }),
    //         catchError(() => {
    //           console.log('GET USER ERROR', id);
    //           this.usersMap.update((prev) => ({
    //             ...prev,
    //             [id]: null,
    //           }));
    //           return of(null);
    //         }),
    //       ),
    //     ),
    //   )
    //     .pipe(
    //       first(),
    //       finalize(() => this.usersLoading.set(false)),
    //     )
    //     .subscribe();
    // });
    // effect(() => {
    //   const newPosts = this.postsResource.value();
    //   if (!newPosts?.length) return;
    //
    //   this.posts.update((prev) => {
    //     const existingIds = new Set(prev.map((p) => p.id));
    //     const filtered = newPosts.filter((p) => !existingIds.has(p.id));
    //     return [...prev, ...filtered];
    //   });
    // });
    //
    // effect(() => {
    //   const results = this.usersBatchResource.value();
    //   if (!results?.length) return;
    //
    //   this.usersMap.update((prev) => {
    //     const updated = { ...prev };
    //     results.forEach(({ id, user }) => {
    //       updated[id] = user;
    //     });
    //     return updated;
    //   });
    // });
    effect(() => {
      const results = this.usersResource.value();
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

  createPost(post: Partial<Post>) {
    const user = this.authStore.currentUser();
    if (!user) {
      return throwError(() => new AuthRequiredError());
    }

    return this.postsApi.createPost(user.id, post).pipe(
      tap(() => {
        // trigger refetch
        this.refreshTick.update((v) => v + 1);
      }),
    );
  }

  updatePost(post: Partial<Post>) {
    return this.postsApi.updatePost(post).pipe(
      tap(() => {
        // trigger refetch
        this.refreshTick.update((v) => v + 1);
      }),
    );
  }

  deletePost(id: number) {
    return this.postsApi.deletePost(id).pipe(
      tap(() => {
        // trigger refetch
        this.refreshTick.update((v) => v + 1);
      }),
    );
  }

  setAuthorFilter(id: number | null) {
    this.authorFilter.set(id);
    this.page.set(1);
    // this.posts.set([]);
  }

  onScrollDown() {
    this.page.set(this.page() + 1);
  }
}
