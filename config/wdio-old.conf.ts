import { browserCommands, elementCommands } from './custom-commands';
import * as WebdriverIO from 'webdriverio'; //TODO: works without it, why is it needed???
import fs from 'fs';

// https://github.com/webdriverio/webdriverio

//TODO: this should be dynamically configurable
const config: WebdriverIO.Config = {
  runner: 'local',
  path: '/',
  // which specs to run
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
      // http://www.assertselenium.com/java/list-of-chrome-driver-command-line-arguments/
      // https://peter.sh/experiments/chromium-command-line-switches/
      browserName: 'chrome',
      'goog:chromeOptions': {
        excludeSwitches: [
          'enable-automation',
          'disable-infobars',
          'disable-popup-blocking',
        ],
        useAutomationExtension: false,
        args: [
          '--load-extension=genie-extension-unpacked',
          // '--user-data-dir=/home/ttepl/.config/google-chrome',
          // '--profile-directory=Profile 2',
        ],

        // to run chrome headless the following flags are required
        // (see https://developers.google.com/web/updates/2017/04/headless-chrome)
        // args: ['--headless', '--disable-gpu'],
        prefs: {
          // TODO: this should work with the experimentalOptions!!!
          // https://github.com/dinuduke/Selenium-chrome-firefox-tips
          // https://src.chromium.org/viewvc/chrome/trunk/src/chrome/common/pref_names.cc?view=markup
          // https://cloud.google.com/docs/chrome-enterprise/policies/
          'profile.managed_default_content_settings.popups': 1,
          'profile.managed_default_content_settings.notifications': 1,
          'profile.default_content_setting_values.notifications': 1,
          'profile.default_content_settings.popups': 1,
        },
      },

      screenshotOnReject: true, // TODO: why unrecognized?
      // If outputDir is provided WebdriverIO can capture driver session logs
      // it is possible to configure which logTypes to include/exclude.
      // excludeDriverLogs: ['*'], // pass '*' to exclude all driver session logs
      // excludeDriverLogs: ['bugreport', 'server'],
    },
  ],
  outputDir: './output/logs',

  // Level of logging verbosity: trace | debug | info | warn | error | silent
  // logLevel: 'warn', // TODO: Allure, investigate

  // Set specific log levels per logger
  // loggers:
  // - webdriver, webdriverio
  // - @wdio/applitools-service, @wdio/browserstack-service, @wdio/devtools-service, @wdio/sauce-service
  // - @wdio/mocha-framework, @wdio/jasmine-framework
  // - @wdio/local-runner, @wdio/lambda-runner
  // - @wdio/sumologic-reporter
  // - @wdio/cli, @wdio/config, @wdio/sync, @wdio/utils
  // Level of logging verbosity: trace | debug | info | warn | error | silent
  logLevels: {
    webdriver: 'debug',
    webdriverio: 'debug',
    '@wdio/applitools-service': 'info',
    '@wdio/local-runner': 'info',
  },
  coloredLogs: true,
  //
  // If you only want to run your tests until a specific amount of tests have failed use
  // bail (default is 0 - don't bail, run all tests).
  bail: 1, //TODO: subject to discuss
  baseUrl: 'http://localhost',
  // Default timeout for all waitFor* commands.
  waitforTimeout: 10000,
  connectionRetryTimeout: 30000,
  connectionRetryCount: 5, // retry failed commands
  // TODO: visual regression?
  // https://webdriver.io/blog/2019/05/18/visual-regression-for-v5.html
  services: ['chromedriver'],
  // see also: https://webdriver.io/docs/frameworks.html
  framework: 'mocha',
  // The number of times to retry the entire specfile when it fails as a whole
  // specFileRetries: 1, //TODO: subject to discuss
  // Test reporter for stdout.
  reporters: ['spec'],
  // See the full list of options at http://mochajs.org/
  mochaOpts: {
    ui: 'bdd',
    timeout: 600000, // browser.debug()
    require: ['tsconfig-paths/register'], // for TS aliases
  },
  // Hooks
  /**
   * Gets executed once before all workers get launched.
   * @param {Object} config wdio configuration object
   * @param {Array.<Object>} capabilities list of capabilities details
   */
  onPrepare: function(config, capabilities) {},
  /**
   * Gets executed just before initialising the webdriver session and test framework. It allows you
   * to manipulate configurations depending on the capability or spec.
   * @param {Object} config wdio configuration object
   * @param {Array.<Object>} capabilities list of capabilities details
   * @param {Array.<String>} specs List of spec file paths that are to be run
   */
  beforeSession: function(config, capabilities, specs) {
    // import('expect-webdriverio');
  },
  /**
   * Gets executed before test execution begins. At this point you can access to all global
   * variables like `browser`. It is the perfect place to define custom commands.
   * @param {Array.<Object>} capabilities list of capabilities details
   * @param {Array.<String>} specs List of spec file paths that are to be run
   */
  before: function(capabilities, specs) {
    // create dir for screenshots
    fs.mkdirSync(`./output/screenshots/${browser.sessionId}`);

    Object.entries(browserCommands).forEach(([name, command]) => {
      browser.addCommand(name, command);
    });

    Object.entries(elementCommands).forEach(([name, command]) => {
      browser.addCommand(name, command, true);
    });
  },
  /**
   * Runs before a WebdriverIO command gets executed.
   * @param {String} commandName hook command name
   * @param {Array} args arguments that command would receive
   */
  beforeCommand: async function(commandName, args) {
    await browser.pause(25); // some stability in tests,  this will run before each command
  },
  /**
   * Hook that gets executed before the suite starts
   * @param {Object} suite suite details
   */
  beforeSuite: function(suite) {},
  /**
   * Function to be executed before a test (in Mocha/Jasmine) starts.
   */
  // beforeTest: function (test, context) {
  // },
  /**
   * Hook that gets executed _before_ a hook within the suite starts (e.g. runs before calling
   * beforeEach in Mocha)
   */
  // beforeHook: function (test, context) {
  // },
  /**
   * Hook that gets executed _after_ a hook within the suite starts (e.g. runs after calling
   * afterEach in Mocha)
   */
  // afterHook: function (test, context, { error, result, duration, passed, retries }) {
  // },
  /**
   * Function to be executed after a test (in Mocha/Jasmine).
   */
  // afterTest: function(test, context, { error, result, duration, passed, retries }) {
  // },

  /**
   * Hook that gets executed after the suite has ended
   * @param {Object} suite suite details
   */
  // afterSuite: function (suite) {
  // },
  /**
   * Runs after a WebdriverIO command gets executed
   * @param {String} commandName hook command name
   * @param {Array} args arguments that command would receive
   * @param {Number} result 0 - command success, 1 - command error
   * @param {Object} error error object if any
   */
  // afterCommand: function (commandName, args, result, error) {
  // },
  /**
   * Gets executed after all tests are done. You still have access to all global variables from
   * the test.
   * @param {Number} result 0 - test pass, 1 - test fail
   * @param {Array.<Object>} capabilities list of capabilities details
   * @param {Array.<String>} specs List of spec file paths that ran
   */
  // after: function (result, capabilities, specs) {
  // },
  /**
   * Gets executed right after terminating the webdriver session.
   * @param {Object} config wdio configuration object
   * @param {Array.<Object>} capabilities list of capabilities details
   * @param {Array.<String>} specs List of spec file paths that ran
   */
  // afterSession: function (config, capabilities, specs) {
  // },
  /**
   * Gets executed after all workers got shut down and the process is about to exit. An error
   * thrown in the onComplete hook will result in the test run failing.
   * @param {Object} exitCode 0 - success, 1 - fail
   * @param {Object} config wdio configuration object
   * @param {Array.<Object>} capabilities list of capabilities details
   * @param {<Object>} results object containing test results
   */
  onComplete: function(exitCode, config, capabilities, results) {
    //TODO: get the result out of the container here
  },
  /**
   * Gets executed when a refresh happens.
   * @param {String} oldSessionId session ID of the old session
   * @param {String} newSessionId session ID of the new session
   */
  //onReload: function(oldSessionId, newSessionId) {
  //}
};

export { config };
