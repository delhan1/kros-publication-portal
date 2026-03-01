import { Component, inject } from '@angular/core';
import { DatePipe } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatProgressSpinner } from '@angular/material/progress-spinner';
import { PostsDataService } from '../../data-access/posts.data';
import { CommentsListComponent } from '../../comments/ui/comments-list/comments-list.component';
import { MatDivider } from '@angular/material/list';
import { TranslatePipe } from '@ngx-translate/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { MatTooltip } from '@angular/material/tooltip';
import {
  ConfirmActionDialogComponent,
  ConfirmActionDialogData,
} from '../../../../shared/ui/confirm-action-dialog/confirm-action-dialog.component';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { catchError, EMPTY, first, switchMap, tap, throwError } from 'rxjs';
import { SnackbarService } from '../../../../shared/ui/info-snackbar/snackbar.service';

@Component({
  selector: 'app-posts-detail',
  imports: [
    DatePipe,
    MatCardModule,
    MatProgressSpinner,
    CommentsListComponent,
    MatDivider,
    TranslatePipe,
    MatButtonModule,
    MatIcon,
    MatTooltip,
  ],
  templateUrl: './posts-detail.component.html',
  styleUrl: './posts-detail.component.scss',
})
export class PostsDetailComponent {
  readonly postsDataService = inject(PostsDataService);

  private dialog = inject(MatDialog);
  private snackBar = inject(SnackbarService);

  /**
   * Opens dialog for deleting post by provided id.
   * @param id Id of post.
   * @param title Title of post.
   */
  openDeletePostDialog(id: number, title: string): void {
    const dialogData: ConfirmActionDialogData = {
      value: title,
      color: 'warn',
      titleKey: 'posts.dialog.title',
      messageKey: 'posts.dialog.message',
      confirmKey: 'common.delete',
    };
    const dialogRef: MatDialogRef<ConfirmActionDialogComponent> = this.dialog.open(ConfirmActionDialogComponent, {
      data: dialogData,
    });

    dialogRef
      .afterClosed()
      .pipe(
        first(),
        switchMap((result) => {
          if (result === 'confirm') {
            return this.postsDataService.deletePost(id);
          } else {
            return EMPTY;
          }
        }),
        tap(() => this.snackBar.showInfoMessage('posts.info.deleted', { value: title })),
        catchError((err) => {
          this.snackBar.showInfoMessage('errors.unexpectedErrorOccurred');
          console.error('err', err);
          return throwError(err);
        }),
      )
      .subscribe();
  }
}
