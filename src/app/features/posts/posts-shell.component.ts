import { Component } from '@angular/core';
import { PostsListComponent } from './ui/posts-list/posts-list.component';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-posts-shell',
  imports: [PostsListComponent, RouterOutlet],
  templateUrl: './posts-shell.component.html',
  styleUrl: './posts-shell.component.scss',
})
export class PostsShellComponent {}
