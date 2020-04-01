import BaseDriver from './_base';

export default class TargetDriver extends BaseDriver {
  constructor() {
    super({
      homepageUrl: 'https://target.com',
      driverTimeout: 60 * 1000,

      searchInputSelector: '#search',
      searchIconSelector: '[data-test="btnSearch"]',
      seed: 'home furniture storage', // TODO: should be one word
      seedSelector:
        '[data-test="productGridContainer"] [class*="ProductCardImageWrapper"]',
      addToCartBtnSelector: '[data-test="shippingATCButton"]',
      cartSeedQtySelector: '.cartLinkQuantity',
      modalDeclineBtnSelector:
        '[data-test="espModalContent-declineCoverageButton"]',
      cartBtnSelector: '[data-test="addToCartModalViewCartCheckout"]',
      totalSelector: '[data-test="cart-summary-total"] > p:last-child',
    });
  }

  public async closeModal(): Promise<void> {}

  public async activateSearchInput(): Promise<boolean> {
    // TODO: fix this globally
    return true;
  }

  //TODO:  seed qty in cart can't be get because of modal covering it
  public async addSeedToCart(): Promise<void> {
    await super.addSeedToCart();
    try {
      await this.closeModalAfterSeedAdd();
    } catch (e) {
      return; // TODO: optional click to be used here
    }
  }

  private async closeModalAfterSeedAdd(): Promise<boolean> {
    const modal = await browser.$(
      // TODO: replace w wrapper
      this.testData.modalDeclineBtnSelector as string
    );
    return modal.waitAndClick('clickable', 25000, true);
  }
}
