import {Component, OnDestroy, OnInit} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {Subject} from 'rxjs';
import { TranslatePipe } from '@ngx-translate/core';

@Component({
  selector: 'app-error',
  imports: [TranslatePipe],
  templateUrl: './error.component.html',
})
export class ErrorComponent implements OnInit, OnDestroy {
  public error404: boolean = false;
  public destroy$: Subject<boolean> = new Subject<boolean>();

  public constructor(private route: ActivatedRoute) {}

  public ngOnInit() {
    this.route.data.subscribe((routeData) => {
      if (routeData['error404']) {
        this.error404 = routeData['error404'];
      }
    });
  }

  public ngOnDestroy(): void {
    this.destroy$.next(true);
    this.destroy$.unsubscribe();
  }
}
