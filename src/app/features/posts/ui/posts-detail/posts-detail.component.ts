import { Component, inject } from '@angular/core';
import { DatePipe } from '@angular/common';
import { MatButton } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatProgressSpinner } from '@angular/material/progress-spinner';
import { PostsDataService } from '../../data-access/posts.data';

@Component({
  selector: 'app-posts-detail',
  imports: [DatePipe, MatButton, MatCardModule, MatProgressSpinner],
  templateUrl: './posts-detail.component.html',
  styleUrl: './posts-detail.component.scss',
})
export class PostsDetailComponent {
  readonly postsDataService = inject(PostsDataService);
}
