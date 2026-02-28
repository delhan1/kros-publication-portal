import { Component, computed, inject } from '@angular/core';
import { rxResource, toSignal } from '@angular/core/rxjs-interop';
import { map, of } from 'rxjs';
import { ActivatedRoute, ParamMap, RouterLink } from '@angular/router';
import { PostsService } from '../../data-access/posts.service';
import { MatProgressSpinner } from '@angular/material/progress-spinner';
import { TranslatePipe } from '@ngx-translate/core';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { PostsDataService } from '../../data-access/posts.data';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-posts-list',
  imports: [MatProgressSpinner, TranslatePipe, MatCardModule, MatButtonModule, DatePipe, RouterLink],
  templateUrl: './posts-list.component.html',
  styleUrl: './posts-list.component.scss',
})
export class PostsListComponent {
  // private api = inject(PostsService);
  readonly data = inject(PostsDataService);
  private route = inject(ActivatedRoute);
  

  // readonly postsResource = rxResource({
  //   stream: () => this.data.postsVm(),
  // });

  // readonly posts = computed(() => this.postsResource.value() ?? []);
}
