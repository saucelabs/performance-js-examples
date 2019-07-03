const assert = require('assert')
const { Builder, By } = require('selenium-webdriver')
const SauceLabs = require('saucelabs')

const username = process.env.SAUCE_USERNAME
const password = process.env.SAUCE_ACCESS_KEY
const saucelabs = new SauceLabs({ username, password })

const server = `http://${username}:${password}@ondemand.saucelabs.com:80/wd/hub`
const capabilities = {
    platform: 'OS X 10.10',
    version: 'latest',
    browserName: 'chrome',
    'sauce:options': {
        extendedDebugging: true,
        capturePerformance: true,
        crmuxdriverVersion: 'beta',
        name: 'Selenium Performance Testing',
    },
}

let driver
let isTestPassed = true

describe('Performance Testing', () => { // eslint-disable-line func-names
    before(async () => {
        driver = await new Builder()
            .withCapabilities(capabilities)
            .usingServer(server)
            .build()
        driver.sessionID = await driver.getSession()
        await driver.get('https://www.saucedemo.com/')

        await driver.findElement(By.css('[data-test="username"]'))
            .sendKeys(process.env.PERF_USERNAME || 'standard_user')
        await driver.findElement(By.css('[data-test="password"]'))
            .sendKeys('secret_sauce')

        await driver.findElement(By.css('.btn_action')).click()
    })

    afterEach(function hook() {
        isTestPassed = isTestPassed && this.currentTest.state === 'passed'
    })

    after(async () => {
        await driver.quit()
        // eslint-disable-next-line no-underscore-dangle
        return saucelabs.updateJob(driver.sessionID.id_, { passed: isTestPassed })
    })

    it('logs (sauce:performance) should check speedIndex', async () => {
        const metrics = [
            'estimatedInputLatency',
            'timeToFirstByte',
            'domContentLoaded',
            'firstVisualChange',
            'firstPaint',
            'firstContentfulPaint',
            'firstMeaningfulPaint',
            'lastVisualChange',
            'firstCPUIdle',
            'firstInteractive',
            'load',
            'speedIndex',
        ]
        const performance = await driver.executeScript('sauce:log', { type: 'sauce:performance' })
        metrics.forEach(metric => assert.ok(metric in performance, `${metric} metric is missing`))
    })

    it('(sauce:performance) custom command should assert pageLoad has not regressed', async () => {
        await driver.sleep(5000)
        const output = await driver.executeScript('sauce:performance', {
            name: capabilities['sauce:options'].name,
            metrics: ['speedIndex', 'load'],
        })

        const { result, details } = output
        return assert.equal(
            result, 'pass',
            `Regression detected for metrics ${JSON.stringify(details, null, 4)}`,
        )
    })
})
