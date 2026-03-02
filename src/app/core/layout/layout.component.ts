import { Component, DestroyRef, inject, OnInit, signal } from '@angular/core';
import { BreakpointObserver, BreakpointState } from '@angular/cdk/layout';
import { MatToolbar } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { AppHeaderComponent } from './header/header.component';
import { MatSidenavModule } from '@angular/material/sidenav';
import { AppSidebarComponent } from './sidebar/sidebar.component';
import { RouterOutlet } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-layout',
  templateUrl: './layout.component.html',
  imports: [
    MatToolbar,
    MatIconModule,
    MatButtonModule,
    AppHeaderComponent,
    AppSidebarComponent,
    RouterOutlet,
    MatSidenavModule,
  ],
  styleUrls: ['./layout.component.scss'],
})
export class LayoutComponent implements OnInit {
  public isMobile = signal(true);

  private bpObserver = inject(BreakpointObserver);
  private destroyRef = inject(DestroyRef);

  public ngOnInit(): void {
    this.bpObserver
      .observe('(min-width: 768px)')
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((bpState: BreakpointState) => {
        this.isMobile.set(!bpState.matches);
      });
  }
}
