import BasePage from './_base';

export default class OutclickPage extends BasePage {
  constructor() {
    super({
      // TODO: use a better pattern
      url: 'https://www.kohls.com/public',
    });
  }

  //TODO: subscribe to this event?
  public async waitForClose(originalTabsNum: number): Promise<boolean> {
    return browser.waitUntil(
      async () => (await BasePage.getInstancesIds()).length === originalTabsNum,
      30 * 10000
    );
  }
}
