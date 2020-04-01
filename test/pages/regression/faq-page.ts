import BasePage from './_base';

const config = {
  host: 'help.retailmenot.com', // TODO: https check?
  titleSelector: '.contentTitle',
  titleText: 'How Can We Help You?',
  searchInput: '.search-input',
  topicsWrapper: '.cHomePageTopics',
  topicCard: '.topicCard',
};

export default class RMNFAQPage extends BasePage {
  constructor() {
    super({
      url: config.host,
    });
  }

  public async init(): Promise<void> {
    await super.init();
  }
}
