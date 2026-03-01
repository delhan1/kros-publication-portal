import { Component, effect, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { MatProgressSpinner } from '@angular/material/progress-spinner';
import { TranslatePipe } from '@ngx-translate/core';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { PostsDataService } from '../../data-access/posts.data';
import { DatePipe } from '@angular/common';
import { CdkFixedSizeVirtualScroll, CdkVirtualScrollViewport } from '@angular/cdk/scrolling';
import { MatFormField, MatInput } from '@angular/material/input';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { debounceTime, distinctUntilChanged, map } from 'rxjs';
import { toSignal } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-posts-list',
  imports: [
    MatProgressSpinner,
    TranslatePipe,
    MatCardModule,
    MatButtonModule,
    DatePipe,
    RouterLink,
    CdkVirtualScrollViewport,
    CdkFixedSizeVirtualScroll,
    MatFormField,
    MatAutocompleteModule,
    ReactiveFormsModule,
    MatInput,
  ],
  templateUrl: './posts-list.component.html',
  styleUrl: './posts-list.component.scss',
})
export class PostsListComponent {
  readonly data = inject(PostsDataService);

  filterControl = new FormControl<number | null>(null);

  readonly debouncedFilter = toSignal(
    this.filterControl.valueChanges.pipe(
      debounceTime(600),
      distinctUntilChanged(),
      map(value => value ?? null)
    ),
    { initialValue: null }
  );

  constructor() {
    effect(() => {
      const id = this.debouncedFilter();
      this.data.setAuthorFilter(id ?? null);
    });
  }

  onScrolledIndexChange(index: number) {
    const posts = this.data.postsVm();
    const buffer = 5; // počet položiek pred koncom, pri ktorých sa načíta ďalšia stránka
    if (index + buffer >= posts.length && !this.data.loading()) {
      this.data.onScrollDown();
    }
  }
}
