import { Component, OnInit } from '@angular/core';
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

  public constructor(
    private router: Router,
    private translateService: TranslateService,
    private adapter: DateAdapter<Date>,
  ) {}

  public ngOnInit() {
    this.selectedLang = this.translateService.getCurrentLang();
    // this.themeService.darkTheme$.pipe(take(1)).subscribe((theme) => {
    //   this.darkTheme = theme;
    // });
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
   * Toggles dark theme.
   */
  public toggleDarkTheme(): void {
    this.darkTheme = !this.darkTheme;
    localStorage.setItem('darkTheme', JSON.stringify(this.darkTheme));
    // this.themeService.changeDarkTheme(this.darkTheme);
  }
}
