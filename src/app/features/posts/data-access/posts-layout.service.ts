import { Injectable, signal, computed } from '@angular/core';

export type PostsViewMode = 'list' | 'detail';

@Injectable()
export class PostsLayoutService {
  private viewMode = signal<PostsViewMode>('detail');

  isList = computed(() => this.viewMode() === 'list');
  isDetail = computed(() => this.viewMode() === 'detail');

  setView(mode: PostsViewMode) {
    this.viewMode.set(mode);
  }
}