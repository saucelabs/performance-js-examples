const path = require('path')

const sauceOptions = {
    'sauce:options': {
        extendedDebugging: true,
        capturePerformance: true,
        build: 'WebdriverIO Performance Example',
        name: 'WebdriverIO Performance Example',
    },
}

/**
 * for more information speicifc log options see
 * https://webdriver.io/docs/configurationfile.html
 */
exports.config = {
    /**
     * ensure to set these environment variables via
     * ```
     * $ export SAUCE_USERNAME=<your Sauce Labs username>
     * $ export SAUCE_ACCESS_KEY=<your Sauce Labs access key>
     * ```
     */
    user: process.env.SAUCE_USERNAME,
    key: process.env.SAUCE_ACCESS_KEY,

    specs: ['./tests/**/*.js'],
    maxInstances: 40,

    capabilities: [{
        browserName: 'chrome',
        platformName: 'macOS 10.13',
        browserVersion: 'latest',
        ...sauceOptions,
    }, {
        browserName: 'chrome',
        platformName: 'macOS 10.14',
        browserVersion: 'latest',
        ...sauceOptions,
    }, {
        browserName: 'chrome',
        platformName: 'Windows 10',
        browserVersion: 'latest',
        ...sauceOptions,
    }, {
        browserName: 'chrome',
        platformName: 'Windows 8.1',
        browserVersion: 'latest',
        ...sauceOptions,
    }, {
        browserName: 'chrome',
        platformName: 'Windows 8',
        browserVersion: 'latest',
        ...sauceOptions,
    }, {
        browserName: 'chrome',
        platformName: 'Windows 7',
        browserVersion: 'latest',
        ...sauceOptions,
    }],

    logLevel: 'trace',
    outputDir: path.join(__dirname, 'logs'),
    coloredLogs: true,
    waitforTimeout: 100000,
    connectionRetryTimeout: 90000,
    connectionRetryCount: 3,
    services: ['sauce'],
    framework: 'mocha',
    reporters: ['dot', 'spec'],
    mochaOpts: {
        ui: 'bdd',
        timeout: 100000,
    },
}
