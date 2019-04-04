import { Component } from '@angular/core';

import { OverlayContainer } from '@angular/cdk/overlay';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'taskmgr';

  public darkTheme = false;

  constructor(
    private oc: OverlayContainer
  ) {
  }

  switchTheme(dark) {
    this.darkTheme = dark;
    if (dark) {
      this.oc.getContainerElement().classList.add('taskmgr-dark-theme');
    }
  }
}
