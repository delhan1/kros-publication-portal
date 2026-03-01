import { Component, effect, inject, input } from '@angular/core';
import { TranslatePipe } from '@ngx-translate/core';
import { MatCardModule } from '@angular/material/card';
import { MatTooltip } from '@angular/material/tooltip';
import { MatIcon } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { DatePipe } from '@angular/common';
import { CommentsDataService } from '../../data-access/comments.data';
import { MatProgressSpinner } from '@angular/material/progress-spinner';

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

  constructor() {
    effect(() => {
      this.commentsDataStore.selectedPostId.set(this.activePostId());
    });
  }

  /**
   * Opens dialog for deleting comment by provided id.
   * @param id Id of comment.
   * @param name Name of deleted comment.
   */
  public openDeleteCommentDialog(id: number): void {
    
  }
}
