import BasePage from './_base';

const config = {
  login: 'd1921436@urhen.com',
  password: 'd1921436@urhen.com',
  loginInput: 'input[type="email"]',
  passwordInput: 'input[type="password"]',
  submitBtn: 'button[type="submit"]',
};

export default class MerchantTestPage extends BasePage {
  constructor() {
    super({
      // TODO: use a better pattern
      url: 'https://secure.rmnstage.com/accounts/login?returnTo=%2Fmy-rewards',
    });
  }

  //   public async login(): Promise<void> {
  //     // TODO: must be simpler + captcha check
  //     await this.input(config.loginInput, config.login);
  //     await this.input(config.passwordInput, config.password);

  //     await this.click(config.submitBtn);
  //   }

  public async focus(): Promise<void> {
    return super.focus(/log in/i); //TODO: focus all pages by regex?
  }
}
