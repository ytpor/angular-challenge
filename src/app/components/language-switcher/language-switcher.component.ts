import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { ZorroModule } from '../../zorro.module';

@Component({
  selector: 'app-language-switcher',
  standalone: true,
  imports: [
    FormsModule,
    TranslateModule,
    ZorroModule,
  ],
  templateUrl: './language-switcher.component.html',
  styleUrl: './language-switcher.component.scss'
})
export class LanguageSwitcherComponent {
  selectedLang: string;

  constructor(
    readonly translate: TranslateService
  ) {
    // Set included languages
    this.translate.addLangs(['en', 'bm']);
    const browserLang = navigator.languages
      ? navigator.languages[0].split('-')[0]
      : navigator.language.split('-')[0];
    const currentLang = localStorage.getItem('lang') ?? '';

    // Get the current browser language, if included set it
    let defaultLang = 'en';

    if (this.translate.getLangs().includes(browserLang)) {
      defaultLang = browserLang;
    }
    if (this.translate.getLangs().includes(currentLang)) {
      defaultLang = currentLang;
    }

    // Set the default and current language
    this.selectedLang = defaultLang;
    this.translate.setDefaultLang(defaultLang);
  }

  switchLanguage(lang: string) {
    this.selectedLang = lang;
    this.translate.use(lang);
    localStorage.setItem('lang', lang);
  }

  getLangLabel(value: string): string {
    let language;
    switch (value) {
      case 'en':
        language = 'English';
        break;
      case 'bm':
      default:
        language = 'Bahasa Malaysia';
        break;
    }
    return language;
  }
}
