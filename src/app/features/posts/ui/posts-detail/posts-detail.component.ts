import { Component, inject } from '@angular/core';
import { DatePipe } from '@angular/common';
import { MatButton } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatProgressSpinner } from '@angular/material/progress-spinner';
import { PostsDataService } from '../../data-access/posts.data';
import { CommentsListComponent } from '../../comments/ui/comments-list/comments-list.component';
import { MatDivider } from '@angular/material/list';
import { TranslatePipe } from '@ngx-translate/core';

@Component({
  selector: 'app-posts-detail',
  imports: [DatePipe, MatButton, MatCardModule, MatProgressSpinner, CommentsListComponent, MatDivider, TranslatePipe],
  templateUrl: './posts-detail.component.html',
  styleUrl: './posts-detail.component.scss',
})
export class PostsDetailComponent {
  readonly postsDataService = inject(PostsDataService);
}
