import { computed, effect, inject, Injectable, Signal, signal } from '@angular/core';
import { rxResource } from '@angular/core/rxjs-interop';
import { catchError, forkJoin, map, of, tap, throwError } from 'rxjs';
import { User } from '../models/users.model';
import { Post, PostUser } from '../models/posts.model';
import { AuthStore } from '../../../core/auth/auth.store';
import { AuthRequiredError } from '../../../core/auth/errors/auth-required.error';
import { PostsApi } from './abstract/posts.api';
import { UsersApi } from './abstract/users.api';

@Injectable()
export class PostsTestDataService {
  readonly authorFilter = signal<number | null>(null);
  readonly selectedPostId = signal<number | null>(null);
  readonly posts = signal<Post[]>([]);

  private postsApi = inject(PostsApi);
  private usersApi = inject(UsersApi);
  private authStore = inject(AuthStore);
  private usersMap = signal<Record<number, User | null>>({}); // null in case of non-existing user
  private page = signal(1); // start with 1
  private perPage = 8; // number of posts per page
  private missingUserIds = signal<number[]>([]);

  /*** RESOURCES ***/
  readonly postDetailResource = rxResource({
    params: () => this.selectedPostId(),
    stream: ({ params: id }) => {
      if (!id) return of(null);

      const cached = this.posts().find((p) => p.id === id);
      if (cached) return of(cached);

      return this.postsApi.getPost(id).pipe(
        tap(() => console.log('GET POST', id)),
        catchError(() => of(null)),
      );
    },
  });

  readonly postsResource = rxResource({
    params: () => ({
      page: this.page(),
      authorId: this.authorFilter(),
    }),
    stream: ({ params }) => {
      return (
        params.authorId
          ? this.postsApi.getPostsByUser(params.authorId, params.page, this.perPage)
          : this.postsApi.getPosts(params.page, this.perPage)
      ).pipe(
        tap((posts: Post[]) => {
          console.log('GET POSTS', posts);
          const users = this.usersMap();
          const allIds = new Set<number>();

          posts.forEach((p) => allIds.add(p.user_id));

          this.missingUserIds.set([...allIds].filter((id) => users[id] === undefined));
        }),
      );
    },
  });

  private usersResource = rxResource({
    params: () => this.missingUserIds(),
    stream: ({ params }) => {
      if (!params) return of([]);

      return forkJoin(
        params.map((id) =>
          this.usersApi.getUser(id).pipe(
            tap((user) => console.log('GET USER', id)),
            map((user) => ({ id, user })),
            catchError(() => {
              console.log('GET USER ERROR', id);
              return of({ id, user: null });
            }),
          ),
        ),
      ).pipe(
        tap((users) => {
          this.usersMap.update((prev) => {
            const updated = { ...prev };

            users.forEach(({ id, user }) => {
              updated[id] = user;
            });

            return updated;
          });
        }),
      );
    },
  });

  /*** VIEWMODELS ***/
  readonly postDetailVm: Signal<PostUser | null> = computed(() => {
    const post = this.selectedPost();
    if (!post) return null;

    const author = this.usersMap()[post.user_id];

    return {
      ...post,
      author_name: author?.name ?? 'Unknown',
      author_email: author?.email ?? null,
    };
  });

  readonly selectedPost = computed<Post | null>(() => {
    const id = this.selectedPostId();
    if (!id) return null;

    // vždy preferuj cache
    const fromCache = this.posts().find((p) => p.id === id);
    if (fromCache) return fromCache;

    // fallback na resource
    return this.postDetailResource.value() ?? null;
  });

  readonly postsVm = computed<PostUser[]>(() => {
    const posts = this.posts();
    const users = this.usersMap();

    return posts.map((post) => ({
      ...post,
      author_name: users[post.user_id]?.name ?? 'Unknown',
    }));
  });

  readonly listLoading = computed(() => this.postsResource.isLoading() || this.usersResource.isLoading());
  readonly detailLoading = computed(() => this.postDetailResource.isLoading() || this.usersResource.isLoading());

  readonly listError = computed(() => this.postsResource.error());
  readonly detailError = computed(() => this.postDetailResource.error());

  constructor() {
    effect(() => {
      const newPage = this.postsResource.value();
      if (!newPage) return;

      this.posts.update((prev) => {
        const existingIds = new Set(prev.map((p) => p.id));
        const filtered = newPage.filter((p) => !existingIds.has(p.id));
        return [...prev, ...filtered];
      });
    });
    // add non-existing post to list of posts
    effect(() => {
      const detail = this.postDetailResource.value();
      if (!detail) return;

      this.posts.update((prev) => {
        const exists = prev.some((p) => p.id === detail.id);
        if (exists) return prev;

        return [detail, ...prev];
      });
    });
  }

  createPost(post: Partial<Post>) {
    const user = this.authStore.currentUser();
    if (!user) {
      return throwError(() => new AuthRequiredError());
    }

    return this.postsApi.createPost(user.id, post).pipe(tap((p) => this.posts.update((prev) => [p, ...prev])));
  }

  updatePost(post: Partial<Post>) {
    return this.postsApi
      .updatePost(post)
      .pipe(
        tap((updatedPost) => this.posts.update((prev) => prev.map((p) => (p.id === updatedPost.id ? updatedPost : p)))),
      );
  }

  deletePost(id: number) {
    return this.postsApi.deletePost(id).pipe(tap(() => this.posts.update((prev) => prev.filter((p) => p.id !== id))));
  }

  setAuthorFilter(id: number | null) {
    this.authorFilter.set(id);
    this.page.set(1);
    this.posts.set([]);
  }

  onScrollDown() {
    this.page.set(this.page() + 1);
  }
}
