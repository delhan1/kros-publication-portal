import { computed, effect, inject, Injectable, signal } from '@angular/core';
import { PostsService } from './posts.service';
import { rxResource } from '@angular/core/rxjs-interop';
import { UsersService } from './users.service';
import { catchError, delay, EMPTY, first, forkJoin, map, of } from 'rxjs';
import { User } from '../models/users.model';

@Injectable()
export class PostsDataService {
  private postsApi = inject(PostsService);
  private usersApi = inject(UsersService);
  private usersMap = signal<Record<number, User | null>>({}); // null in case of non-existing user

  readonly selectedPostId = signal<number | null>(null);

  /*** RESOURCES ***/
  readonly postsResource = rxResource({
    stream: () => this.postsApi.getPosts().pipe(delay(5000)),
  });

  readonly postDetailResource = rxResource({
    params: () => {
      const id = this.selectedPostId();
      const fromList = this.selectedFromList();

      if (!id) return null;
      if (fromList !== null) return null;
      if (this.postsResource.isLoading()) return null;

      return id;
    },
    stream: ({ params: id }) => {
      return id ? this.postsApi.getPost(id) : of(null);
    },
  });

  readonly usersBatchResource = rxResource({
    params: () => {
      const ids = this.missingUserIds();
      return ids.length ? ids : null;
    },
    stream: ({ params: ids }) => {
      return ids?.length
        ? forkJoin(
            ids.map((id) =>
              this.usersApi.getUser(id).pipe(
                map((user) => ({ id, user })),
                catchError(() => of({ id, user: null })),
              ),
            ),
          )
        : of([]);
    },
  });

  /*** VIEWMODELS ***/
  readonly postsVm = computed(() => {
    const posts = this.postsResource.value();
    const users = this.usersMap();

    if (!posts || !users) return [];

    return posts.map((post) => ({
      id: post.id,
      title: post.title,
      createdAt: post.created_at,
      authorName: users[post.user_id]?.name ?? 'Unknown',
    }));
  });

  readonly postDetailVm = computed(() => {
    const post = this.selectedFromList() ?? this.postDetailResource.value() ?? null;
    const users = this.usersMap();

    if (!post || !users) return null;

    const author = users[post.user_id];

    return {
      id: post.id,
      title: post.title,
      body: post.body,
      createdAt: post.created_at,
      authorName: author?.name ?? 'Unknown',
      authorEmail: author?.email ?? null,
    };
  });

  /*** HELPER SIGNALS ***/
  readonly selectedFromList = computed(() => {
    const id = this.selectedPostId();
    const posts = this.postsResource.value();

    if (!id || !posts) return null;

    return posts.find((p) => p.id === id) ?? null;
  });

  readonly missingUserIds = computed(() => {
    const posts = this.postsResource.value() ?? [];
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
      const posts = this.postsResource.value() ?? [];
      const detail = this.postDetailResource.value();

      const allUserIds = new Set<number>();

      posts.forEach((p) => allUserIds.add(p.user_id));
      if (detail) allUserIds.add(detail.user_id);

      const users = this.usersMap();

      const missingIds = [...allUserIds].filter((id) => users[id] === undefined);

      if (!missingIds.length) return;

      forkJoin(
        missingIds.map((id) =>
          this.usersApi.getUser(id).pipe(
            map((user) => ({ id, user })),
            catchError(() => of({ id, user: null })),
          ),
        ),
      )
        .pipe(first())
        .subscribe((results) => {
          this.usersMap.update((prev) => {
            const updated = { ...prev };
            results.forEach(({ id, user }) => {
              updated[id] = user;
            });
            return updated;
          });
        });
    });
  }
}
