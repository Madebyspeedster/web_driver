import * as assert from 'assert';
import _ from 'underscore';
import { Logger } from '@utils/log'; //TODO: need to be an alias
import { parseArg } from '@utils/os';
import BaseDriver from '@driver/_base';
import { toFloat } from '@utils/format';

const driverName = parseArg('merchant');

const log = new Logger();

describe('driver test:', async () => {
  let merchantPage: BaseDriver;
  // TODO: watch for console errors from genie

  before('setup', async () => {
    const MerchantDriver = (await import(`../../pages/driver/${driverName}`))
      .default;
    merchantPage = new MerchantDriver();
    merchantPage.sessionId = browser.sessionId;
  });

  beforeEach('run before each test', async function() {
    const randomPause = _.random(500, 1000);
    log.warn(
      `Pause before ${this.currentTest.title}: ${randomPause / 1000} sec.`
    );
    await browser.pause(randomPause);
    // browser.saveScreenshot(
    //   `./output/screenshots/${browser.sessionId}/${this.currentTest.title}-BEFORE.png`
    // );
  });

  afterEach('run before each test', async function() {
    //END added for sorting
    // browser.saveScreenshot(
    //   `./output/screenshots/${browser.sessionId}/${this.currentTest.title}-END.png`
    // );
  });

  after('show final results', async () => {
    log.info(merchantPage.executionResult);
  });

  it('open homepage', async () => {
    // TODO: make more generalized, all actions should be in the class
    await merchantPage.getHomepage();
  });

  it('close modal', async () => {
    await merchantPage.closeModal();
  });

  it('activate search input', async () => {
    const inputActivated = await merchantPage.activateSearchInput();
    assert.strictEqual(inputActivated, true);
  });

  it('enter seed', async () => {
    await merchantPage.enterSeed();
  });

  it('submit seed', async () => {
    const currentUrl = await merchantPage.getCurrentUrl();
    await merchantPage.submitSeed();
    const newUrl = await merchantPage.getCurrentUrl();
    assert.notEqual(currentUrl, newUrl);
  });

  it('select random seed', async () => {
    const currentUrl = await merchantPage.getCurrentUrl(); //TODO: getters
    await merchantPage.selectSeed();
    const newUrl = await merchantPage.getCurrentUrl();
    assert.notEqual(currentUrl, newUrl);
  });

  it('add seed to cart', async () => {
    await merchantPage.addSeedToCart();
    assert.equal(merchantPage.seedsQtyInCart > 0, true); // TODO: make adequate
  });

  it('go to cart', async () => {
    await merchantPage.goToCart();
    assert.equal(merchantPage.seedsQtyInCart > 0, true); // TODO: make adequate
  });

  it('get page total before testing', async () => {
    await merchantPage.getTotalBeforeTesting();
    assert.equal(merchantPage.totalBeforeTesting > 0, true); // TODO: make adequate

    await browser.pause(500);
    browser.saveScreenshot(
      `./output/screenshots/${browser.sessionId}/${this.currentTest.title}-BEFORE.png`
    );
  });

  // it('start testing', async () => {
  //   await merchantPage.startTesting();
  // });

  // it('end testing', async () => {
  //   await merchantPage.endTesting();
  //   assert.equal(merchantPage.genieDiscount >= 0, true); // TODO: make adequate
  // });

  // it('page & genie discounts match', async () => {
  //   await merchantPage.getTotalAfterTesting(); // TODO: mb do this in class
  //   const pageDiscount =
  //     merchantPage.totalBeforeTesting - merchantPage.totalAfterTesting;

  //   assert.equal(
  //     merchantPage.genieDiscount,
  //     toFloat(pageDiscount),
  //     `Discount mismatch: Genie: ${merchantPage.genieDiscount}, Page: ${pageDiscount}`
  //   );
  // });

  // //TODO: outclick tab

  // it('total did not get worse', async () => {
  //   assert.equal(
  //     merchantPage.totalAfterTesting <= merchantPage.totalBeforeTesting,
  //     true // TODO: make adequate
  //   );
  // });
});
