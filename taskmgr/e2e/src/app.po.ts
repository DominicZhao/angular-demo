import { browser, by, element } from 'protractor';

export class AppPage {
  navigateTo() {
    return browser.get('/');
  }

  getParagraphText() {
    return element(by.css('app-root mat-drawer-container')).getText();
  }

  fillInfo() {
    element(by.id('mat-input-0')).sendKeys('dev');
    element(by.id('mat-input-1')).sendKeys('dev');
    element(by.buttonText('登录')).click();
    return browser.takeScreenshot();
  }
}
