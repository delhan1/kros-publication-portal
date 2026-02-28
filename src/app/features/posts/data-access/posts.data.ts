import { computed, inject, Injectable, signal } from '@angular/core';
import { PostsService } from './posts.service';
import { rxResource } from '@angular/core/rxjs-interop';
import { UsersService } from './users.service';
import { delay, EMPTY } from 'rxjs';

@Injectable()
export class PostsDataService {
  private postsApi = inject(PostsService);
  private usersApi = inject(UsersService);

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
    stream: (id) => {
      if (!id.params) return EMPTY;
      return this.postsApi.getPost(id.params);
    },
  });

  readonly usersResource = rxResource({
    stream: () => this.usersApi.getUsers(),
  });

  /*** VIEWMODELS ***/
  readonly postsVm = computed(() => {
    const posts = this.postsResource.value();
    const users = this.usersResource.value();

    if (!posts || !users) return [];

    const usersMap = new Map(users.map((u) => [u.id, u]));

    return posts.map((post) => ({
      id: post.id,
      title: post.title,
      createdAt: post.created_at,
      authorName: usersMap.get(post.user_id)?.name ?? 'Unknown',
    }));
  });

  readonly postDetailVm = computed(() => {
    const post = this.selectedFromList() ?? this.postDetailResource.value() ?? null;
    const users = this.usersResource.value();

    if (!post || !users) return null;

    const author = users.find((u) => u.id === post.user_id);

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

    return posts.find(p => p.id === id) ?? null;
  });

  readonly loading = computed(() => this.postsResource.isLoading() || this.usersResource.isLoading());

  readonly detailLoading = computed(() => this.postDetailResource.isLoading() || this.usersResource.isLoading());

  readonly error = computed(() => this.postsResource.error() ?? this.usersResource.error());
}
