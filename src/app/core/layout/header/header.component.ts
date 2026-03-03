import { Component, inject, OnInit } from '@angular/core';
import { DateAdapter, MatNativeDateModule } from '@angular/material/core';
import { Router } from '@angular/router';
import { TranslatePipe, TranslateService } from '@ngx-translate/core';
import { MatSlideToggle } from '@angular/material/slide-toggle';
import { MatTooltip } from '@angular/material/tooltip';
import { MatMenu, MatMenuItem, MatMenuTrigger } from '@angular/material/menu';
import { MatIconModule } from '@angular/material/icon';
import { UpperCasePipe } from '@angular/common';
import { LANGUAGES } from '../../i18n/lang.constants';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatButtonModule } from '@angular/material/button';
import { AuthService } from '../../auth/auth.service';
import { AuthStore } from '../../auth/auth.store';
import { LoginDialogComponent, LoginDialogResultData } from '../../auth/login-dialog/login-dialog.component';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { catchError, EMPTY, first, switchMap, tap, throwError } from 'rxjs';
import { SnackbarService } from '../../../shared/ui/info-snackbar/snackbar.service';
import {
  ConfirmActionDialogComponent,
  ConfirmActionDialogData
} from '../../../shared/ui/confirm-action-dialog/confirm-action-dialog.component';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  imports: [
    MatSlideToggle,
    MatTooltip,
    TranslatePipe,
    MatMenuTrigger,
    MatIconModule,
    MatMenu,
    UpperCasePipe,
    MatDatepickerModule,
    MatNativeDateModule,
    MatButtonModule,
    MatMenuItem,
  ],
  styleUrls: [],
})
export class AppHeaderComponent implements OnInit {
  public languages: string[] = LANGUAGES;
  public selectedLang = 'en';
  public darkTheme: boolean = false;
  
  public authService = inject(AuthService);
  public authStore = inject(AuthStore);
  private translateService = inject(TranslateService);
  private adapter = inject(DateAdapter<Date>);
  private dialog = inject(MatDialog);
  private snackBar = inject(SnackbarService);

  public ngOnInit() {
    this.selectedLang = this.translateService.getCurrentLang();
  }

  /**
   * Changes language in application and stores choice in browser's local storage.
   * @param languageKey Language key.
   */
  public changeLanguage(languageKey: string): void {
    this.selectedLang = languageKey;
    localStorage.setItem('locale', languageKey);
    this.translateService.use(languageKey);
    this.adapter.setLocale(languageKey);
  }

  /**
   * Opens dialog for login.
   */
  public openLoginDialog(): void {
    const dialogRef: MatDialogRef<LoginDialogComponent> = this.dialog.open(LoginDialogComponent, {
      width: '500px',
    });

    dialogRef
      .afterClosed()
      .pipe(
        first(),
        switchMap((result: LoginDialogResultData) => {
          if (result) {
            return this.authService.loginById(+result.id);
          } else {
            return EMPTY;
          }
        }),
        tap(() => this.snackBar.showInfoMessage('login.info.loggedIn')),
        catchError((err) => {
          if (err.status === 404) {
            this.snackBar.showInfoMessage('errors.userNotFound');  
          } else {
            this.snackBar.showInfoMessage('errors.unexpectedErrorOccurred');
          }
          console.error('err', err);
          return throwError(err);
        }),
      )
      .subscribe();
  }

  openLogoutDialog() {
    const dialogData: ConfirmActionDialogData = {
      color: 'warn',
      titleKey: 'login.dialog.title',
      messageKey: 'login.dialog.message',
      confirmKey: 'login.logout',
    };
    const dialogRef: MatDialogRef<ConfirmActionDialogComponent> = this.dialog.open(ConfirmActionDialogComponent, {
      data: dialogData,
    });

    dialogRef
      .afterClosed()
      .pipe(
        first(),
        tap((result) => {
          if (result === 'confirm') {
            this.authService.logout();
            this.snackBar.showInfoMessage('login.info.loggedOut');
          }
        }),
        catchError((err) => {
          this.snackBar.showInfoMessage('errors.unexpectedErrorOccurred');
          console.error('err', err);
          return throwError(err);
        }),
      )
      .subscribe();
  }
}
