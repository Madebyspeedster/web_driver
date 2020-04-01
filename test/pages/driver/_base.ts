import _ from 'underscore';
import { toFloat, toInt } from '../../../utils/format'; //TODO: need to be an alias
import { Logger } from '../../../utils/log'; //TODO: need to be an alias
import { genieSelectors } from '../../../config/genie'; //TODO: need to be an alias

//TODO: need logic to retry click if not successful
//TODO: need multiple click logic

const log = new Logger();

//TODO: rethink over obligatory n optional selectors
interface DriverConfig {
  [key: string]: string | number;
  homepageUrl: string;
  driverTimeout: number;
  modalSelector?: string;
  activateSearchSelector?: string;
  searchInputSelector: string;
  searchIconSelector: string; // not needed on all websites
  seed: string;
  seedSelector: string;
  addToCartBtnSelector: string;
  cartSeedQtySelector: string;
  cartBtnSelector: string;
  totalSelector: string;
}

interface DriverExecutionValues {
  sessionId: string;
  homePageUrl: string;
  seedsUrl: string;
  selectedSeedUrl: string;
  cartUrl: string;
  seedsQtyInCart: number;
  totalBeforeTesting: number;
  totalAfterTesting: number;
  genieDiscount: number;
}

export default class BaseDriver {
  constructor(conf: DriverConfig) {
    this.testData = conf;
  }

  protected testData: DriverConfig = {
    homepageUrl: '',
    driverTimeout: -1,
    modalSelector: '',
    activateSearchSelector: '',
    searchInputSelector: '',
    seed: '',
    searchIconSelector: '',
    seedSelector: '',
    addToCartBtnSelector: '',
    cartSeedQtySelector: '.',
    cartBtnSelector: '',
    totalSelector: '',
  };

  private executionValues: DriverExecutionValues = {
    sessionId: '',
    homePageUrl: '',
    seedsUrl: '',
    selectedSeedUrl: '',
    cartUrl: '',
    seedsQtyInCart: NaN,
    totalBeforeTesting: NaN,
    totalAfterTesting: NaN,
    genieDiscount: NaN,
  };

  //TODO: Move getters to parent
  public get seedsQtyInCart(): number {
    return this.executionValues.seedsQtyInCart;
  }

  public get totalBeforeTesting(): number {
    return this.executionValues.totalBeforeTesting;
  }

  public get totalAfterTesting(): number {
    return this.executionValues.totalAfterTesting;
  }

  public get genieDiscount(): number {
    return this.executionValues.genieDiscount;
  }

  public get executionResult(): object {
    return this.executionValues;
  }

  public set cartUrl(url: string) {
    this.executionValues.cartUrl = url;
  }

  public set sessionId(id: string) {
    // TODO: validate?
    this.executionValues.sessionId = id;
  }

  private async getSeedQty(): Promise<number> {
    try {
      const seedEl = await browser.$(this.testData.cartSeedQtySelector);
      const seedQty = await seedEl.getText();
      return toInt(seedQty);
    } catch (e) {
      log.debug('Failed to parse cart seeds qty');
      log.error(e);
      return 0;
    }
  }

  public async getCurrentUrl(): Promise<string> {
    return browser.getUrl();
  }

  public async getHomepage(): Promise<void> {
    browser.url(this.testData.homepageUrl);
    this.executionValues.homePageUrl = await this.getCurrentUrl();
  }

  public async closeModal(): Promise<void> {
    const modal = await browser.$(this.testData.modalSelector);
    await modal.waitAndClick('clickable', 30000);
  }

  public async activateSearchInput(): Promise<boolean> {
    // return browser.multiClick(this.testData.activateSearchSelector);
    const searchElement = await browser.$(this.testData.activateSearchSelector);
    return searchElement.waitAndClick('clickable', 5000);
  }

  public async enterSeed(): Promise<void> {
    const input = await browser.$(this.testData.searchInputSelector);
    return input.setValue(this.testData.seed);
  }

  public async submitSeed(): Promise<boolean> {
    const searchIcon = await browser.$(this.testData.searchIconSelector);
    return searchIcon.waitAndClick('enabled');
  }

  public async selectSeed(random: boolean = true): Promise<void> {
    this.executionValues.seedsUrl = await this.getCurrentUrl();
    const seeds = await browser.$$(this.testData.seedSelector);
    if (seeds.length === 0) {
      // TODO: do smth if no seeds found. Retry cycle?
    }

    if (random) {
      const randomSeed = seeds[_.random(0, seeds.length - 1)]; //TODO: rewrite
      await randomSeed.waitAndClick('displayed');
    } else {
      await seeds[0].waitAndClick('displayed');
    }
  }

  public async waitForUrlChange(
    // TODO: move to utils/custom commands
    oldUrl: string,
    timeout: number = 30 * 1000
  ): Promise<boolean> {
    return browser.waitUntil(
      async () => oldUrl !== (await this.getCurrentUrl()),
      timeout
    );
  }

  public async waitForSeedQtyToChange(
    // TODO: move to utils/custom commands
    oldSeedQty: number,
    timeout: number = 30 * 1000
  ): Promise<boolean> {
    return browser.waitUntil(
      async () => oldSeedQty !== (await this.getSeedQty()),
      timeout
    );
  }

  public async addSeedToCart(): Promise<void> {
    const currentSeedQty = await this.getSeedQty();
    this.executionValues.selectedSeedUrl = await this.getCurrentUrl();
    const addToCartBtn = await browser.$(this.testData.addToCartBtnSelector);
    await addToCartBtn.waitAndClick('clickable');
    // TODO: figure out a better way to wait for actions after click
    await this.waitForSeedQtyToChange(currentSeedQty);
    this.executionValues.seedsQtyInCart = await this.getSeedQty();
  }

  public async goToCart(): Promise<void> {
    const currentUrl = await this.getCurrentUrl();
    const cartBtn = await browser.$(this.testData.cartBtnSelector);
    await cartBtn.waitAndClick('displayed');
    await this.waitForUrlChange(currentUrl);
    this.executionValues.cartUrl = await this.getCurrentUrl();
  }

  public async getTotalBeforeTesting(): Promise<void> {
    const totalSelector = await browser.$(this.testData.totalSelector);
    await totalSelector.waitForDisplayed();
    this.executionValues.totalBeforeTesting = await this.getTotalFromPage();
  }

  public async startTesting(): Promise<void> {
    const genieApplySavingsBtn = await this.genieGet(
      genieSelectors.applySavingsBtnSelector
    );
    await genieApplySavingsBtn.waitAndClick('clickable');
  }

  public async endTesting(): Promise<void> {
    const genieGoToCheckoutBtn = await this.genieGet(
      genieSelectors.goToCheckoutBtnSelector,
      this.testData.driverTimeout
    );
    this.executionValues.genieDiscount = await this.getDiscountFromGenie();

    await genieGoToCheckoutBtn.waitAndClick('clickable');
  }

  public async getTotalAfterTesting(): Promise<void> {
    this.executionValues.totalAfterTesting = await this.getTotalFromPage();
  }

  private async getTotalFromPage(): Promise<number> {
    const pageTotalElem = await browser.$(this.testData.totalSelector);
    const elemDisplayed = await pageTotalElem.isDisplayed();

    const pageTotalText = await pageTotalElem.getText();
    return toFloat(pageTotalText);
  }

  private async getDiscountFromGenie(): Promise<number> {
    // discount can be present or not
    try {
      const genieDiscountElem = await this.genieGet(
        genieSelectors.totalSavingsSelector,
        10 * 1000 // animation delays the discoun to be visible
      );
      const genieDiscountText = await genieDiscountElem.getText();
      return toFloat(genieDiscountText);
    } catch (e) {
      return 0;
    }
  }

  private async genieGet(
    selector: string,
    timeout: number = 10 * 1000
  ): Promise<WebdriverIO.Element> {
    // TODO: add similar method to get elements from page
    const genieContainer = await $(genieSelectors.containerSelector);
    // await genieContainer.moveTo(); // background modals can steal focus
    const requestedElement = await genieContainer.shadow$(selector);
    await requestedElement.waitForClickable({ timeout });
    return requestedElement;
  }
}
