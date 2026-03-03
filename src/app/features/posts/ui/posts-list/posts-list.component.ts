import { Component, effect, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { MatProgressSpinner } from '@angular/material/progress-spinner';
import { TranslatePipe } from '@ngx-translate/core';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { DatePipe } from '@angular/common';
import { CdkFixedSizeVirtualScroll, CdkVirtualScrollViewport } from '@angular/cdk/scrolling';
import { MatInputModule } from '@angular/material/input';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { catchError, debounceTime, distinctUntilChanged, EMPTY, first, map, switchMap, tap, throwError } from 'rxjs';
import { toSignal } from '@angular/core/rxjs-interop';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import {
  PostsModifyDialogComponent,
  PostsModifyDialogData,
  PostsModifyDialogResultData,
} from '../posts-modify-dialog/posts-modify-dialog.component';
import { SnackbarService } from '../../../../shared/ui/info-snackbar/snackbar.service';
import { Post } from '../../models/posts.model';
import { MatRipple } from '@angular/material/core';
import { AuthStore } from '../../../../core/auth/auth.store';
import { PostsTestDataService } from '../../data-access/posts-test.data';
import { PostsLayoutService } from '../../data-access/posts-layout.service';

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
    MatFormFieldModule,
    MatAutocompleteModule,
    ReactiveFormsModule,
    MatInputModule,
    MatIconModule,
    MatRipple,
  ],
  templateUrl: './posts-list.component.html',
  styleUrl: './posts-list.component.scss',
})
export class PostsListComponent {
  readonly postsLayoutService = inject(PostsLayoutService);
  readonly postsDataService = inject(PostsTestDataService);
  readonly authStore = inject(AuthStore);

  private dialog = inject(MatDialog);
  private snackBar = inject(SnackbarService);

  readonly filterControl = new FormControl<number | null>(null);

  readonly debouncedFilter = toSignal(
    this.filterControl.valueChanges.pipe(
      debounceTime(600),
      distinctUntilChanged(),
      map((value) => Number(value) ?? null),
    ),
    { initialValue: null },
  );

  constructor() {
    effect(() => {
      const id = this.debouncedFilter();
      this.postsDataService.setAuthorFilter(id ?? null);
    });
  }

  onScrolledIndexChange(index: number) {
    const posts = this.postsDataService.postsVm();
    const buffer = 5;
    if (index + buffer >= posts.length && !this.postsDataService.listLoading() && !this.postsDataService.listError()) {
      this.postsDataService.onScrollDown();
    }
  }

  /**
   * Opens dialog for creating post.
   */
  public openAddPostDialog(): void {
    const dialogData: PostsModifyDialogData = {
      titleKey: 'posts.create',
      confirmKey: 'common.create',
    };
    const dialogRef: MatDialogRef<PostsModifyDialogComponent> = this.dialog.open(PostsModifyDialogComponent, {
      width: '500px',
      data: dialogData,
    });

    dialogRef
      .afterClosed()
      .pipe(
        first(),
        switchMap((result: PostsModifyDialogResultData) => {
          if (result) {
            const post: Partial<Post> = {
              title: result.title,
              body: result.body,
            };
            return this.postsDataService.createPost(post).pipe(map(() => post.title as string));
          } else {
            return EMPTY;
          }
        }),
        tap((title) => this.snackBar.showInfoMessage('posts.info.created', { value: title })),
        catchError((err) => {
          this.snackBar.showInfoMessage('errors.unexpectedErrorOccurred');
          console.error('err', err);
          return throwError(err);
        }),
      )
      .subscribe();
  }

  showDetail() {
    this.postsLayoutService.setView('detail');
  }
}
