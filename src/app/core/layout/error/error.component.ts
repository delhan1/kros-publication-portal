import { Component, DestroyRef, inject, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { TranslatePipe } from '@ngx-translate/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-error',
  imports: [TranslatePipe],
  templateUrl: './error.component.html',
})
export class ErrorComponent implements OnInit {
  public error404: boolean = false;

  private route = inject(ActivatedRoute);
  private destroyRef = inject(DestroyRef);

  public ngOnInit() {
    this.route.data.pipe(takeUntilDestroyed(this.destroyRef)).subscribe((routeData) => {
      if (routeData['error404']) {
        this.error404 = routeData['error404'];
      }
    });
  }
}
