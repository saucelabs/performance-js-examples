const assert = require('assert')
const { config } = require('../conf.js')

describe('Performance Testing', () => {
    beforeAll(() => {
        browser.get('/')

        element(by.css('[data-test="username"]'))
            .sendKeys(process.env.PERF_USERNAME || 'standard_user')
        element(by.css('[data-test="password"]'))
            .sendKeys('secret_sauce')
        element(by.css('.btn_action')).click()

        browser.get('/inventory.html')
    })

    it('log (sauce:performance) should check speedIndex', async () => {
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
        const performance = await browser.executeScript('sauce:log', { type: 'sauce:performance' })
        metrics.forEach(metric => assert.ok(metric in performance, `${metric} metric is missing`))
    })

    /**
     * The custom command will return 'pass' if the test falls within the predicted baseline
     * or 'fail'  if the performance metric falls outside the predicted baseline.
     * customers can decide how strict they want to be in failing tests by setting thier own
     * failure points.
     */
    it('(sauce:performance) custom command should assert pageload and speedIndex has not regressed', async () => {
        await browser.sleep(5000)

        const output = await browser.executeScript('sauce:performance', {
            name: config.capabilities.name,
            metrics: ['load', 'speedIndex'],
        })

        const { result, details } = output
        assert.equal(
            result, 'pass',
            `Regression detected for metrics ${JSON.stringify(details, null, 4)}`,
        )
    })
})
