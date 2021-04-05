import { Inject, Injectable } from '@angular/core';
import { NGXLogger } from 'ngx-logger';
import { BehaviorSubject } from 'rxjs';
import { DOCUMENT } from '@angular/common';
import { THEME, THEME_DEFAULT, THEME_LIST, THEME_STORAGE_KEY } from '../../../tokens';

@Injectable({
  providedIn: 'root'
})
export class ThemeService {

  constructor(
    private logger: NGXLogger,
    @Inject(DOCUMENT) private document: Document,
    @Inject(THEME) private theme: BehaviorSubject<string>,
    @Inject(THEME_LIST) private themeList: Record<string, string>,
    @Inject(THEME_DEFAULT) private defaultTheme: string,
    @Inject(THEME_STORAGE_KEY) private storageKey: string,
  ) {
    this.theme = new BehaviorSubject<string>(this.defaultTheme);

    this.theme.subscribe(value => {
      if (!value) {
        return;
      }

      const htmlEl = this.document.documentElement;
      htmlEl.dataset.theme = this.themeList[value];
    });
  }

  setTheme(key: string): void {
    // eslint-disable-next-line no-prototype-builtins
    if (!this.themeList.hasOwnProperty(key)) {
      this.logger.warn(`Trying to set an inexistent theme: "${key}" in ${JSON.stringify(this.themeList)}`);
      return;
    }

    // Guardamos el tema en el `storage`
    // para poder recuperarlo posteriormente.
    localStorage.setItem(this.storageKey, key);

    this.theme.next(key);
  }

  getTheme(): string {
    return this.theme.getValue();
  }

  loadTheme(): void {
    let theme = localStorage.getItem(this.storageKey);

    // eslint-disable-next-line no-prototype-builtins
    if (!this.themeList.hasOwnProperty(theme)) {
      localStorage.removeItem(this.storageKey);
      theme = this.defaultTheme;
    }

    this.setTheme(theme);
  }
}
