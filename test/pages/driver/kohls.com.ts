import BaseDriver from './_base';

const bossBtnSelector = '.kas-newpb-viewbag-link_ghr';

export default class KohlsDriver extends BaseDriver {
  constructor() {
    super({
      homepageUrl: 'https://kohls.com',
      driverTimeout: 60 * 1000,
      searchInputSelector: '#search',
      seed: 'watch', // TODO: should be one word
      searchIconSelector: '[name="submit-search"]',
      seedSelector: 'p[rel*="product"]',
      addToCartBtnSelector: '[name="pdp-addtobag"]',
      cartSeedQtySelector: '.mini-cart-header .number-items',
      cartBtnSelector: 'a[href*="shopping_cart"]',
      totalSelector: '#totalcharges',
    });
  }

  async closeModal(): Promise<void> {}

  async activateSearchInput(): Promise<boolean> {
    return true;
  }

  async goToCart(): Promise<void> {
    // this opens modal
    const cartBtn = await browser.$(this.testData.cartBtnSelector);
    await cartBtn.waitAndClick('displayed');

    // this actually goes to cart
    const bossCartBtn = await browser.$(bossBtnSelector);
    await browser.execute(runInBrowser, bossCartBtn); // TODO: move to custom methods
    // TODO: get total from modal

    super.cartUrl = await this.getCurrentUrl();
  }
}

var runInBrowser = function(argument) {
  argument.click();
};
