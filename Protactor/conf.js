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
    name: 'Selenium Performance Testing',
}

exports.config = {
    sauceUser: username,
    sauceKey: password,
    specs: ['specs/*.js'],
    capabilities,
    baseUrl: 'https://www.saucedemo.com',
    jasmineNodeOpts: {
        timeout: 1000 * 60 * 5,
    },
    onComplete(passed) {
        return browser.getSession().then(
            session => saucelabs.updateJob(session.getId(), { passed }),
        )
    },
}
