import BasePage from './_base';

export default class LoginModalPage extends BasePage {
  constructor() {
    super({
      url:
        'https://secure.rmnstage.com/accounts/login?returnTo=https%3A%2F%2Fwww.rmnstage.com%2Fgenie%2Flogin&ctx=cbo',
    });
  }

  public async focus(): Promise<void> {
    await super.focus(/login&ctx=cbo/i);
  }
}
