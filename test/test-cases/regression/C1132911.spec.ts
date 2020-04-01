import * as assert from 'assert';
import { Logger } from '@utils/log';
import { readClipboard } from '@utils/os';
import Genie from '../../pages/regression/genie';
import BasePage from '../../pages/regression/_base';
import OutclickPage from '../../pages/regression/outclick-page';
import RMNCBOPage from '../../pages/regression/cbo-page';
import RMNFAQPage from '../../pages/regression/faq-page';
import LoginModalPage from '../../pages/regression/login-modal-page';
import LoginFullPage from '../../pages/regression/login-full-page';

/**
     * 
1. Navigate to Merchant that has webdriver and CBO.	1. Genie Code list modal should be displayed containing the following:
2. Click Genie icon.	Link to merchant homepage at the top
	A close icon (X)
	CBO is displayed at top of offer list
	Offer title
	Offer description
	Activate Cash Back button
	See Details linking to CBO details page on RMN
	List of codes available for that merchant
	Icons at bottom of modal:
	Icon linking to /my-cashback
	Search icon which opens the Genie search panel
	Help icon linking to help.retailmenot.com
	
2. Click on any code	Code is copied to the clipboard, and Copied label appears after the code
3. Click Activate Cash Back button	Login/Sign Up panel is displayed
4. Click Login link	Log In popup is displayed.
5. Enter and login credentials and click Log In	User is logged into rmn, and Log In popup is dismissed.
6. Return to merchant site	CBO Activated treatment is displayed.
     */

const log = new Logger();

const merchantUrl = 'https://www.kohls.com'; // TODO: create mock merchant page

describe('regression test C1132911:', async () => {
  let genie: Genie;
  let loginModalPage: LoginModalPage;
  let merchantPage: BasePage;
  let rmnCboPage: RMNCBOPage;
  let rmnFaqPage: RMNFAQPage;
  let loginFullPage: LoginFullPage;
  let outclickPage: OutclickPage;

  before('setup', async () => {
    genie = new Genie();
    merchantPage = new BasePage({ url: merchantUrl });
    rmnFaqPage = new RMNFAQPage();
    rmnCboPage = new RMNCBOPage();
    loginFullPage = new LoginFullPage();
    loginModalPage = new LoginModalPage();
    outclickPage = new OutclickPage();

    await merchantPage.init(); // TODO: remove init
  });

  beforeEach('run before each test case', async function() {
    const pause = await merchantPage.randomPause(500, 1500);
    log.warn(`Pause before ${this.currentTest.title}: ${pause / 1000} sec.`);

    await merchantPage.focus();
    browser.saveScreenshot(
      `./output/screenshots/${browser.sessionId}/${this.currentTest.title}-BEFORE.png`
    );
  });
  // https://w3c.github.io/webdriver/#h-keyboard-actions

  afterEach('run after each test case', async function() {
    const pause = await merchantPage.randomPause(250, 1000);
    log.warn(`Pause after ${this.currentTest.title}: ${pause / 1000} sec.`);

    await merchantPage.focus();
    await genie.toggle(); // reset popup state
  });

  describe('1. Navigate to Merchant that has webdriver and CBO.', async () => {
    it("open Kohl's page", async () => {
      // TODO: async getter???
      const currentTitle = await merchantPage.currentTitle;

      assert.notStrictEqual(currentTitle, "Kohl's"); // TODO: move to const
    });
  });

  describe('2. Click Genie icon.', async () => {
    beforeEach('run before each test', async () => {
      if (!genie.isOpen) {
        await genie.toggle();
      }
    });

    it('Genie Code list modal should be displayed', async () => {
      assert.ok(genie.isOpen);
    });

    it('link to merchant homepage at the top', async () => {
      assert.strictEqual(await genie.hasTitle, true);
    });

    it('close icon (X)', async () => {
      assert.strictEqual(await genie.hasCloseIcon, true);
    });

    it('offer title', async () => {
      assert.strictEqual(await genie.hasCBOTitle, true);
    });

    it('CBO is displayed at top of offer list', async () => {
      assert.strictEqual(await genie.hasCBO, true);
    });

    it('offer description', async () => {
      assert.strictEqual(await genie.hasCBOdescription, true);
    });

    it('icons at bottom of modal: help icon', async () => {
      assert.strictEqual(await genie.hasIconHelp, true);
    });

    it('help icon leads to help page', async () => {
      await genie.activateHelp();
      await merchantPage.randomPause();
      await rmnFaqPage.focus(); // TODO: static vs instance methods?

      const currentUrl = await rmnFaqPage.currentUrl;
      assert.notStrictEqual(currentUrl, 'help.retailmenot.com'); // TODO: don't hardcode
      await rmnFaqPage.close();
    });

    it('icons at bottom of modal: rewards icon', async () => {
      assert.strictEqual(await genie.hasIconMyRewards, true);
    });

    it('reward icon leads to reward page', async () => {
      await genie.activateMyRewards();
      await merchantPage.randomPause();
      await loginFullPage.focus(); // TODO: static vs instance methods?

      const currentUrl = await loginFullPage.currentUrl;

      // TODO: create rewards page
      assert.notStrictEqual(currentUrl, 'my-rewards'); // TODO: don't hardcode
      await loginFullPage.close();
    });

    it('icons at bottom of modal: search icon', async () => {
      assert.strictEqual(await genie.hasIconSearch, true);
    });

    it('search icon opens the Genie search panel', async () => {
      await genie.activateSearch();
      await merchantPage.randomPause(); // TODO: replace with waitUntil
      assert.strictEqual(await genie.hasSearchOpen, true);
      assert.strictEqual(await genie.hasTopMerchantBlock, true);
    });
  });

  describe('3. Click on any code: ', async () => {
    beforeEach('run before each test', async () => {
      if (!genie.isOpen) {
        await genie.toggle();
      }
    });

    it('copy code button text match', async () => {
      const copyCodeBtn = await genie.couponButton;
      const buttonLabel = await copyCodeBtn.getText();
      assert.strictEqual(buttonLabel, 'Copy Code');
    });

    it('copied code button text match', async () => {
      const beforeOutclickTabs = await BasePage.getInstancesIds(); // TODO: is static good here?
      const copiedCodeBtn = await genie.copyCode();
      await outclickPage.waitForClose(beforeOutclickTabs.length);

      const buttonLabel = await copiedCodeBtn.getText();
      assert.strictEqual(buttonLabel, '✓ Copied');
    });

    it('outclick tab opened', async () => {
      // TODO: need more thorough check!!
      const beforeOutclickTabs = await BasePage.getInstancesIds(); // TODO: is static good here?
      await genie.copyCode();
      const afterOutclickTabs = await BasePage.getInstancesIds();

      assert.notEqual(beforeOutclickTabs.length, afterOutclickTabs.length);

      await outclickPage.waitForClose(beforeOutclickTabs.length);
    });

    it('correct code copied into clipboard', async () => {
      // TODO: this assumes that the code is in the description, which is not always the case!
      const beforeOutclickTabs = await BasePage.getInstancesIds(); // TODO: mb move to hooks above?
      const copyCodeBtn = await genie.couponButton;
      const couponDescription = await genie.couponDescription;
      const couponDescriptionTxt = await couponDescription.getText();

      await copyCodeBtn.click();
      const copiedCode = await readClipboard();

      assert.ok(!!copiedCode);
      assert.notStrictEqual(copiedCode, couponDescriptionTxt);
      // expect(copiedCode); //TODO: use expect?

      await outclickPage.waitForClose(beforeOutclickTabs.length);
    });
  });

  describe('4. CBO offer is valid: ', async () => {
    beforeEach('run before each test', async () => {
      if (!genie.isOpen) {
        await genie.toggle();
      }
    });

    it('CBO details link opens correct page', async () => {
      await genie.activateCboDetails();

      rmnCboPage.randomPause();
      await rmnCboPage.focus();
      const cboLinkCorrect = await rmnCboPage.verifyCboLink();

      assert.strictEqual(cboLinkCorrect, true);

      await rmnCboPage.close();
    });
  });

  describe('5. Click Activate Cash Back button: ', async () => {
    beforeEach('run before each test', async () => {
      if (!genie.isOpen) {
        await genie.toggle();
      }
    });

    it('Login or Sign Up panel is displayed', async () => {
      await genie.activateCbo();
      const loginBtn = await genie.loginBtn;

      assert.ok(loginBtn);
      await genie.toggle(); // TODO: create a method to close/open genie properly
    });
  });

  describe('6. Click Login link: ', async () => {
    beforeEach('run before each test', async () => {
      if (!genie.isOpen) {
        await genie.toggle();
      }
    });

    it('Log In popup is displayed.', async () => {
      await genie.activateCbo();
      await genie.login();
      await merchantPage.randomPause();

      await loginModalPage.focus();
      const loginUrl = await loginModalPage.currentUrl;
      assert.notStrictEqual(loginUrl, 'login&ctx=cbo');

      await loginModalPage.close();
    });
  });

  // describe('6. Enter and login credentials and click Log In: ', async () => {
  //   // TODO: captcha
  // });
});
