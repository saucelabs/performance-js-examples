const SauceLabs = require('saucelabs').default

const username = process.env.SAUCE_USERNAME
const password = process.env.SAUCE_ACCESS_KEY
const saucelabs = new SauceLabs({ username, password })

const capabilities = {
    platform: 'OS X 10.10',
    version: 'latest',
    browserName: 'chrome',
    extendedDebugging: true,
    capturePerformance: true,
    crmuxdriverVersion: 'beta',
    name: 'Protractor Performance Testing',
}

exports.config = {
    sauceUser: username,
    sauceKey: password,
    specs: ['specs/*.js'],
    capabilities,
    baseUrl: 'https://www.saucedemo.com',
    jasmineNodeOpts: {
        timeout: 1000 * 60 * 5,
        defaultTimeoutInterval: 180000,
    },

    onPrepare() {
        browser.waitForAngularEnabled(false)
    },

    onComplete(passed) {
        return browser.getSession().then(
            async (session) => {
                await saucelabs.updateJob(username, session.getId(), { passed });
            },
        )
    },
}
