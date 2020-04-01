// import { Element } from WebdriverIO;
import elementConditions from '@const/elementConditions';

//TODO: create separate entities for buttons, wrappers , cbo, etc

const genieSettings = {
  container: '#__genieContainer',
  wrapper: '#rmnGenieWrappingDiv',
  applySavingsBtn: '.qa-apply-savings-button',
  goToCheckoutBtn: '.qa-go-to-checkout',
  totalSavings: '.qa-codes-amount',
  openEvent: 'toggle-genie',
};

const merchantHeader = {
  title: '.header-merchant', // Target
  closeIcon: '.bbb-close-button', // svg TODO: visual comparison?
};

const cbo = {
  wrapper: '.cbo-ui',
  title: '.primary-text', // N% cashback
  description: '.secondary-text div', //TODO: qa-selector?
  detailsLnk: '.secondary-text a', // Just activate to earn rewards. //TODO: qa-selector?
  activateBtn: '.qa-cbo-activate-button',
  loginBtn: '.qa-cbo-login-button',
};

const codes = {
  wrapper: '.codes-wrapper',
  couponWrapper: '.card',
  couponDescription: '.card-content',
  copyCodeBtn: '.qa-code-button',
  copyCodeBtnTxt: 'Copy Code',
  copiedCodeBtnTxt: '✓ Copied',
};

const footer = {
  wrapper: 'footer',
  iconRewards: '.footer-profile',
  iconSearch: '.footer-search',
  iconHelp: '.footer-faq',
};

const search = {
  wrapper: '.merchant-search-container',
  searchInput: '.search-form',
  merchantsSearchResults: '.merchant-search-results',
  merchantBlock: '.merchant-block',
};

// TODO: parse possible genie errors from console
export default class Genie {
  private state;
  constructor() {
    this.state = {
      // TODO: smth similar to displayView???
      isOpen: false,
    };
  }

  public get isOpen(): boolean {
    return this.state.isOpen;
  }

  public get hasTitle(): Promise<boolean> {
    return this.checkState(merchantHeader.title, elementConditions.viewport);
  }

  public get hasCloseIcon(): Promise<boolean> {
    return this.checkState(
      merchantHeader.closeIcon,
      elementConditions.viewport
    );
  }

  public get hasCBOTitle(): Promise<boolean> {
    return this.checkState(cbo.title, elementConditions.viewport);
  }

  public get hasCBOdescription(): Promise<boolean> {
    return this.checkState(cbo.wrapper, elementConditions.viewport);
  }

  public get hasCBO(): Promise<boolean> {
    return this.checkState(cbo.wrapper, elementConditions.viewport);
  }

  public get hasSearchOpen(): Promise<boolean> {
    return this.checkState(search.wrapper, elementConditions.viewport);
  }

  public get hasTopMerchantBlock(): Promise<boolean> {
    return this.checkState(search.merchantBlock, elementConditions.viewport);
  }

  public get hasIconHelp(): Promise<boolean> {
    return this.checkState(footer.iconHelp, elementConditions.viewport);
  }

  public get hasIconSearch(): Promise<boolean> {
    return this.checkState(footer.iconSearch, elementConditions.viewport);
  }

  public get hasIconMyRewards(): Promise<boolean> {
    return this.checkState(footer.iconRewards, elementConditions.viewport);
  }

  public get couponButton(): Promise<WebdriverIO.Element> {
    //TODO: this will return first code btn found, randomize!
    return this.find(codes.copyCodeBtn);
  }

  public get couponDescription(): Promise<WebdriverIO.Element> {
    //TODO: this will return first code edscription found, randomize!
    return this.find(codes.couponDescription, codes.couponWrapper);
  }

  public get loginBtn(): Promise<WebdriverIO.Element> {
    //TODO: this will return first code edscription found, randomize!
    return this.find(cbo.loginBtn);
  }

  private async click(
    selector: string,
    condition: elementConditions = elementConditions.clickable
  ): Promise<WebdriverIO.Element> {
    const element = await this.find(selector);
    if (element[condition]()) {
      await element.click(); // TODO: make custom
      return element;
    }
    throw new Error(
      `Genie Click: element doesn't satisfy condition ${condition}`
    );
  }

  public async toggle(): Promise<boolean> {
    const genieDispatchEventStatus = await browser.execute(
      eventName => document.dispatchEvent(new CustomEvent(eventName)), // chrome scope
      genieSettings.openEvent // test scope
    );
    this.state.isOpen = await (await this.find(genieSettings.wrapper))[
      elementConditions.viewport
    ]();
    return genieDispatchEventStatus;
  }

  public async activateCbo(): Promise<WebdriverIO.Element> {
    return this.click(cbo.activateBtn);
  }

  public async activateCboDetails(): Promise<WebdriverIO.Element> {
    return this.click(cbo.detailsLnk);
  }

  public async login(): Promise<WebdriverIO.Element> {
    return this.click(cbo.loginBtn);
  }

  public async activateHelp(): Promise<WebdriverIO.Element> {
    return this.click(footer.iconHelp);
  }

  public async activateMyRewards(): Promise<WebdriverIO.Element> {
    return this.click(footer.iconRewards);
  }

  public async activateSearch(): Promise<WebdriverIO.Element> {
    return this.click(footer.iconSearch);
  }

  public async copyCode(): Promise<WebdriverIO.Element> {
    const element = await this.click(
      codes.copyCodeBtn,
      elementConditions.clickable
    );
    return element;
  }

  // public async login(): Promise<void> {
  //LOGIN WITH GOOGLE TODO: captcha??? Use predefined profile?
  //   return this.click(cbo.loginBtn);
  // }

  public async find(
    selector: string,
    parentSelector?: string
  ): Promise<WebdriverIO.Element> {
    if (parentSelector) {
      const parent = await this.find(parentSelector);
      return parent.$(selector);
    }
    return (await $(genieSettings.container)).shadow$(selector);
  }

  public async checkState(
    selector: string,
    condition: elementConditions
  ): Promise<boolean> {
    const genieElement = await this.find(selector);
    const conditionState = await genieElement[condition]();
    return conditionState;
  }
}
