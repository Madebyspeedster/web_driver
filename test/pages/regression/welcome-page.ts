import BasePage from './_base';

export default class GenieWelcomePage extends BasePage {
  constructor() {
    super({
      // TODO: use a better pattern
      url: 'https://www.retailmenot.com/genie/welcome',
    });
  }
}
