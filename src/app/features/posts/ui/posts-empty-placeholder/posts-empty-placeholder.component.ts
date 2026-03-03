import { Component } from '@angular/core';
import { TranslatePipe } from '@ngx-translate/core';

@Component({
  selector: 'app-posts-empty-placeholder',
  imports: [TranslatePipe],
  templateUrl: './posts-empty-placeholder.component.html',
  styleUrl: './posts-empty-placeholder.component.scss',
})
export class PostsEmptyPlaceholderComponent {}
