import BasePage from './_base';
import CBOStatus from '@const/cboStatus';

// TODO: mb move to tests
const config = {
  pathnameRegex: /cashback\/\d\/[A-Z0-9]{26}/, // TODO: https check? Regex correct?
  offerActivation: '.rebate-activation-container',
  offerNotFound: '.container header',
  offerNotFoundStatus: '404—Sorry!',
};

export default class RMNCBOPage extends BasePage {
  private cboState: CBOStatus;

  constructor() {
    super({
      url: 'https://www.rmnstage.com/cashback/2/JS4ACCMRGNBX7OAASYVZVRTGSY', // TODO:
    });
  }

  get cboStatus(): CBOStatus {
    // TODO: maybe not needed
    return this.cboState;
  }

  public async verifyCboLink(): Promise<boolean> {
    const currentUrl = await this.currentUrl; // TODO: meaningless code, rewrite
    return !!currentUrl.match(config.pathnameRegex);
  }

  public async verifyCBOState(): Promise<CBOStatus> {
    const { offerNotFound, offerActivation } = config;
    const offerMissing = await $(offerNotFound);
    const offerExists = await $(offerActivation);
    if (offerExists) {
      this.cboState = CBOStatus.valid;
    } else if (offerMissing) {
      this.cboState = CBOStatus.inValid;
    } else {
      this.cboState = CBOStatus.unknown;
    }
    return this.cboState;
  }

  public async focus(): Promise<void> {
    await super.focus(/cashback/i);
  }
}
