import { Component, OnDestroy, OnInit } from '@angular/core';
import { BreakpointObserver, BreakpointState } from '@angular/cdk/layout';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { MatToolbar } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { AppHeaderComponent } from './header/header.component';
import { MatSidenavContainer, MatSidenavModule } from '@angular/material/sidenav';
import { AppSidebarComponent } from './sidebar/sidebar.component';
import { RouterOutlet } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-layout',
  templateUrl: './layout.component.html',
  imports: [
    MatToolbar,
    MatIconModule,
    MatButtonModule,
    AppHeaderComponent,
    MatSidenavContainer,
    AppSidebarComponent,
    RouterOutlet,
    MatSidenavModule,
  ],
  styleUrls: ['./layout.component.scss'],
})
export class LayoutComponent implements OnInit, OnDestroy {
  public menuHidden: boolean = false;
  public title: string = '';
  public destroy$: Subject<boolean> = new Subject<boolean>();

  public constructor(private bpObserver: BreakpointObserver) {}

  public ngOnInit(): void {
    this.bpObserver
      .observe('(min-width: 768px)')
      .pipe(takeUntil(this.destroy$))
      .subscribe((bpState: BreakpointState) => {
        this.menuHidden = !bpState.matches;
      });
  }

  public ngOnDestroy(): void {
    this.destroy$.next(true);
    this.destroy$.unsubscribe();
  }
}
