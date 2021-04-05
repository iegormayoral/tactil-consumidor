import { Component, Inject, OnInit } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { LANG, LANG_LIST } from '../../../tokens';
import { LangService } from '../../services';
import { Lang } from '../../services/lang/classes/GetLangs';

@Component({
  selector: 'app-lang-selector',
  templateUrl: './lang-selector.component.html',
  styleUrls: ['./lang-selector.component.scss']
})
export class LangSelectorComponent implements OnInit {

  public lang: Lang;
  public langList: Lang[];
  public opened = false;

  constructor(
    private langService: LangService,
    @Inject(LANG) public _lang: BehaviorSubject<Lang>,
    @Inject(LANG_LIST) public _langList: BehaviorSubject<Lang[]>,
  ) {
    this.lang = _lang.getValue();
  }

  ngOnInit(): void {
    this._lang.subscribe(value => {
      this.lang = value;
    });

    this._langList.subscribe(value => {
      this.langList = value;
    });
  }

  open(): void {
    this.opened = true;
  }

  close(): void {
    this.opened = false;
  }

  selectLang(lang: Lang): void {
    this.langService.setLang(lang);

    this.close();
  }

}
