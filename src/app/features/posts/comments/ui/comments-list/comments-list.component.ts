import { Component, effect, inject, input } from '@angular/core';
import { TranslatePipe } from '@ngx-translate/core';
import { MatCardModule } from '@angular/material/card';
import { MatTooltip } from '@angular/material/tooltip';
import { MatIcon } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { DatePipe } from '@angular/common';
import { CommentsDataService } from '../../data-access/comments.data';
import { MatProgressSpinner } from '@angular/material/progress-spinner';
import {
  ConfirmActionDialogComponent,
  ConfirmActionDialogData,
} from '../../../../../shared/ui/confirm-action-dialog/confirm-action-dialog.component';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { catchError, EMPTY, first, switchMap, tap, throwError } from 'rxjs';
import { SnackbarService } from '../../../../../shared/ui/info-snackbar/snackbar.service';
import {
  CommentsAddDialogComponent,
  CreateDialogResultData,
} from '../comments-add-dialog/comments-add-dialog.component';
import { Comment } from '../../models/comments.model';

@Component({
  selector: 'app-comments-list',
  imports: [TranslatePipe, MatCardModule, MatTooltip, MatIcon, MatButtonModule, DatePipe, MatProgressSpinner],
  providers: [CommentsDataService],
  templateUrl: './comments-list.component.html',
  styleUrl: './comments-list.component.scss',
})
export class CommentsListComponent {
  activePostId = input.required<number>();

  commentsDataStore = inject(CommentsDataService);
  private dialog = inject(MatDialog);
  private snackBar = inject(SnackbarService);

  constructor() {
    effect(() => {
      this.commentsDataStore.selectedPostId.set(this.activePostId());
    });
  }

  /**
   * Opens dialog for deleting comment by provided id.
   * @param id Id of comment.
   */
  public openDeleteCommentDialog(id: number): void {
    const dialogData: ConfirmActionDialogData = {
      color: 'warn',
      titleKey: 'comments.dialog.title',
      messageKey: 'comments.dialog.message',
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
            return this.commentsDataStore.deleteComment(id);
          } else {
            return EMPTY;
          }
        }),
        tap(() => this.snackBar.showInfoMessage('comments.info.deleted')),
        catchError((err) => {
          this.snackBar.showInfoMessage('errors.unexpectedErrorOccurred');
          console.error('err', err);
          return throwError(err);
        }),
      )
      .subscribe();
  }

  /**
   * Opens dialog for creating comment.
   */
  public openAddCommentDialog(): void {
    const dialogRef: MatDialogRef<CommentsAddDialogComponent> = this.dialog.open(CommentsAddDialogComponent, {
      width: '500px',
    });

    let commentName: string = '';
    dialogRef
      .afterClosed()
      .pipe(
        first(),
        switchMap((result: CreateDialogResultData) => {
          if (result) {
            const comment: Partial<Comment> = {
              body: result.body,
            };
            return this.commentsDataStore.createComment(comment);
          } else {
            return EMPTY;
          }
        }),
        tap(() => this.snackBar.showInfoMessage('comments.info.created', { value: commentName })),
        catchError((err) => {
          this.snackBar.showInfoMessage('errors.unexpectedErrorOccurred');
          console.error('err', err);
          return throwError(err);
        }),
      )
      .subscribe();
  }
}
