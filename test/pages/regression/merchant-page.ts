import BasePage from './_base';

export default class MerchantTestPage extends BasePage {
  constructor() {
    super({
      // TODO: use a better pattern
      url: 'https://www.kohls.com/',
    });
  }
}
