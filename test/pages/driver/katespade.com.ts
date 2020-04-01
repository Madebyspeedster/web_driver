import BaseDriver from './_base';

export default class KatespadeDriver extends BaseDriver {
  constructor() {
    super({
      homepageUrl: 'https://katespade.com',
      driverTimeout: 60 * 1000,
      modalSelector: '.bx-close',
      activateSearchSelector: 'a[role="search"]',
      searchInputSelector: '#q',
      seed: 'cameron street marybeth', // TODO: should be one word
      searchIconSelector: '#q-submit',
      seedSelector: 'a.name-link',
      addToCartBtnSelector: '#add-to-cart',
      cartSeedQtySelector: '.minicart-quantity',
      cartBtnSelector: '#mini-cart',
      totalSelector: '#cart-mini-summary .order-total .order-value',
    });
  }
}
