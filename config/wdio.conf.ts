require('tsconfig-paths/register'); // for aliases to work

import { browserCommands, elementCommands } from './custom-commands';
import * as WebdriverIO from 'webdriverio'; // needed for goog:* preferences
import { Logger } from '@utils/log';
import { exec } from 'child_process';
import fs from 'fs';

const log = new Logger();

const config: WebdriverIO.Config = {
  runner: 'local',
  path: '/',

  // specs to run
  specs: ['./test/**/*spec.ts'],
  suites: {
    driver: ['./test/test-cases/driver/driver-non-spa.spec.ts'],
    regression: ['./test/test-cases/regression/C1132911.spec.ts'],
  },

  // browsers setup
  maxInstances: 10,
  capabilities: [
    {
      maxInstances: 1,
      browserName: 'chrome',
      'goog:chromeOptions': {
        useAutomationExtension: false,
        args: [
          // '--load-extension=genie-stage-toggle',
          '--headless', // TODO: this wont allow extension to run
        ],
      },
      'goog:loggingPrefs': {
        browser: 'ALL',
      },
    },
  ],

  // logging
  outputDir: './output/logs',
  logLevels: {
    webdriver: 'debug',
    webdriverio: 'debug',
    '@wdio/applitools-service': 'info',
    '@wdio/local-runner': 'info',
  },
  coloredLogs: true,

  // test framework
  bail: 1,
  waitforTimeout: 10000,
  connectionRetryTimeout: 30000,
  connectionRetryCount: 3, // retry failed commands
  services: ['chromedriver'],
  framework: 'mocha',
  reporters: ['spec'],
  mochaOpts: {
    ui: 'bdd',
    timeout: 60 * 1000,
    require: ['tsconfig-paths/register'], // for TS aliases
  },

  // hooks
  onPrepare: function(config, capabilities) {
    // do some local cleaning before test
    // exec(`cd output/screenshots && rm -r *`);
    // exec(`cd output/logs && rm -r *`);

    // log config for debug purposes
    log.info(JSON.stringify(config, undefined, 2));
  },
  beforeSession: function(config, capabilities, specs) {},
  before: function(capabilities, specs) {
    fs.mkdirSync(`./output/screenshots/${browser.sessionId}`); // screenshots dir

    Object.entries(browserCommands).forEach(([name, command]) => {
      browser.addCommand(name, command);
    });

    Object.entries(elementCommands).forEach(([name, command]) => {
      browser.addCommand(name, command, true);
    });
  },
  beforeCommand: async function(commandName, args) {
    await browser.pause(50); // tests stability
  },
  beforeSuite: function(suite) {},
  onComplete: function(exitCode, config, capabilities, results) {
    // TODO: sed-clean log
    // grep genie-extension:info wdio-0-0-browser.log | sed -e 's/chrome-extension:\/\/hamicmopfekomiligdpfikijcpkkmhmd\/built\/vendors.bundle.js [0-9]\+:[0-9]\+//g' | sed 's/%c//g' | sed 's/\\"/"/g' | sed 's/\\\\"/"/g' > wdio-0-0-browser-clean.log
  },
};

export { config };
