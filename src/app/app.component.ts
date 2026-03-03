import { Component, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { AuthStore } from './core/auth/auth.store';
import { LANGUAGES } from './core/i18n/lang.constants';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class App {
  private authStore = inject(AuthStore);
  private translateService = inject(TranslateService);
  
  constructor() {
    this.authStore.restore();
    const language = localStorage.getItem('locale');
    let defaultLanguage: string = 'en';
    
    if (language && LANGUAGES.includes(language)) {
      defaultLanguage = language;
    }

    this.translateService.use(defaultLanguage);
  }
}
