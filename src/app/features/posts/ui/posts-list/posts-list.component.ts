import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { MatProgressSpinner } from '@angular/material/progress-spinner';
import { TranslatePipe } from '@ngx-translate/core';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { PostsDataService } from '../../data-access/posts.data';
import { DatePipe } from '@angular/common';
import { CdkFixedSizeVirtualScroll, CdkVirtualScrollViewport } from '@angular/cdk/scrolling';

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
  ],
  templateUrl: './posts-list.component.html',
  styleUrl: './posts-list.component.scss',
})
export class PostsListComponent {
  readonly data = inject(PostsDataService);

  onScrolledIndexChange(index: number) {
    const posts = this.data.postsVm();
    const buffer = 5; // počet položiek pred koncom, pri ktorých sa načíta ďalšia stránka
    if (index + buffer >= posts.length && !this.data.loading()) {
      this.data.onScrollDown();
    }
  }
}
