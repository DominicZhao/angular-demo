import { AppPage } from './app.po';
import { createWriteStream } from 'fs';

function writeScreenShot(data, filename) {
  const stream = createWriteStream(filename);
  stream.write(new Buffer(data, 'base64'));
  stream.end();
}

describe('workspace-project App', () => {
  let page: AppPage;

  beforeEach(() => {
    page = new AppPage();
  });

  it('should display welcome message', () => {
    page.navigateTo();
    // expect(page.getParagraphText()).toEqual('Welcome to taskmgr!');
    page.fillInfo().then(result => writeScreenShot(result, 'sc001.jpg'));
    expect(page.getParagraphText()).toContain('企业级协作平台');
  });
});
