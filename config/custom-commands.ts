import { Logger } from '../utils/log';

const log = new Logger();

enum elementClickConditions {
  'clickable' = 'waitForClickable',
  'displayed' = 'waitForDisplayed',
  'enabled' = 'waitForEnabled',
  'existing' = 'waitForexist',
}

//TODO: make this click optional if necessary
export const elementCommands = {
  // `this` is return value of $(selector)
  waitAndClick: async function(
    this: WebdriverIO.Element,
    condition: string,
    delayMs = 5 * 1000,
    optional = false
  ): Promise<boolean> {
    let success = true;
    try {
      let selector = this.selector;
      if (typeof selector === 'function') {
        selector = 'SHADOW ELEMENT';
      }
      log.info(
        `Waiting for element ('${selector}') to be ${condition} within ${delayMs /
          1000} sec.`
      );

      await this.scrollIntoView({
        behavior: 'smooth',
        block: 'nearest',
        inline: 'nearest',
      });
      const action: string = elementClickConditions[condition];
      if (condition === 'clickable') {
        await this[action]({ timeout: delayMs });
      } else {
        await this[action](delayMs);
      }
      await this.click();
    } catch (e) {
      if (!optional) {
        log.error(e.message);
        success = false;
      }
    }
    log.debug(`Waiting and click ${success ? 'SUCCESS' : 'FAIL'}.`);
    return success;
  },
};

export const browserCommands = {
  multiClick: async function(
    this: WebdriverIO.BrowserObject,
    selector: string,
    all?: boolean,
    optional?: boolean
  ): Promise<boolean> {
    // this is the browser object

    //TODO: watch for changes after click to determine if success???
    // https://www.pingshiuanchua.com/blog/post/error-handling-in-selenium-on-python

    // native click
    try {
      log.info('Trying native click');
      if (all) {
        // TODO: wrap this in a method, FIX!
        // this.findElements('css selector', selector).forEach(element =>
        //   element.waitAndClick()
        // );
      } else {
        const element = await this.$(selector);
        await element.waitAndClick('clickable');
      }
      log.info('Succedded native click');
      return true;
    } catch {
      log.warn('Native click failed');
    }

    // jquery click
    // try {
    //   log.info("Trying jquery click");
    //   (this as Browser).executeAsync(`
    //     $('${selector}').click()
    //   `);
    //   this.executeAsync(done => {
    //     $("${selector}").click();
    //     done();
    //   });
    //   log.info("Succedded jquery click");
    //   return true;
    // } catch {
    //   log.warn("Jquery click failed");
    // }

    // programmatic click
    try {
      // TODO: check and refactor
      log.info('Trying javascript click');
      if (all) {
        await this.executeAsync(done => {
          (document.querySelectorAll(selector) as NodeListOf<
            HTMLElement
          >).forEach(element => element.click());
          done();
        });
      } else {
        await this.executeAsync(done => {
          (document.querySelector(selector) as HTMLElement).click();
          done();
        });
      }
      log.info('Succedded javascript click');
      return true;
    } catch {
      log.warn('Javascript click failed');
    }

    return false;
  },
};
