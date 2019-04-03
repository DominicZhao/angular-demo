import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'taskmgr';

  public darkTheme = false;

  switchTheme(dark) {
    this.darkTheme = dark;
  }
}
