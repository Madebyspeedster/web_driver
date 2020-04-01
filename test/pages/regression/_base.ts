import _ from 'underscore';
import { Logger } from '@utils/log';
import elementConditions from '@const/elementConditions';

const log = new Logger();

//TODO: need logic to retry click if not successful
//TODO: need multiple click logic

interface PageConfig {
  [key: string]: string; //TODO: improve
  url: string;
}

export default class BasePage {
  constructor(conf: PageConfig) {
    this.pageConfig = conf;
  }

  protected pageConfig: PageConfig = {
    url: '',
  };

  public get currentUrl(): Promise<string> {
    // TODO: getter which returns promise???
    return browser.getUrl();
  }

  public get currentTitle(): Promise<string> {
    return browser.getTitle();
  }

  public async init(): Promise<void> {
    return browser.url(this.pageConfig.url);
  }

  public async focus(criteria?: string | RegExp): Promise<void> {
    return browser.switchWindow(criteria || this.pageConfig.url); // TODO: window title?
  }

  public async close(): Promise<void> {
    // TODO: close PARTICULAR window, not currently active
    await this.focus();
    return browser.closeWindow();
  }

  public async randomPause(
    minMs: number = 1000,
    maxMs: number = 2500
  ): Promise<number> {
    const randomPause = _.random(minMs, maxMs); // TODO: make configurable
    await browser.pause(randomPause);
    return randomPause;
  }

  // TODO: move to custom commands?
  protected async click(selector: string): Promise<boolean> {
    const element = await browser.$(selector);
    return element.waitAndClick('clickable');
  }

  // TODO: move to custom commands?
  protected async input(selector: string, val: string): Promise<void> {
    const element = await browser.$(selector);
    await element.waitAndClick('clickable');
    return element.setValue(val);
  }

  public static async getInstancesIds(): Promise<string[]> {
    return browser.getWindowHandles();
  }
}
