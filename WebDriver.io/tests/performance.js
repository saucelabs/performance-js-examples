const assert = require('assert')

describe('Performance Testing', () => {
    before(() => {
        browser.url('https://www.saucedemo.com')

        const username = process.env.PERF_USERNAME || 'standard_user'
        $('[data-test="username"]').setValue(username)
        $('[data-test="password"]').setValue('secret_sauce')
        $('.btn_action').click()
    })

    it('should be within performance budget', () => {
        const performanceLog = browser.execute('sauce:log', { type: 'sauce:performance' })
        /**
         * Sample performanceLog
         *  {
                load: 754,
                speedIndex: 652,
                firstInteractive: 856,
                firstVisualChange: 483,
                lastVisualChange: 967,
                firstMeaningfulPaint: 319,
                firstCPUIdle: 856,
                timeToFirstByte: 121,
                firstPaint: 319,
                estimatedInputLatency: 17,
                firstContentfulPaint: 319,
                totalBlockingTime: 76,
                score: 0.99,
                domContentLoaded: 238,
                cumulativeLayoutShift: 0,
                serverResponseTime: 121,
                largestContentfulPaint: 960
            }
         */

        const performanceBudget = {
            'load': { 'min': 100, 'max': 1000 },
            'firstContentfulPaint': { 'min': 100, 'max': 1000 },
            'largestContentfulPaint': { 'min': 100 , 'max': 1000 },
            'firstInteractive': { 'min': 100 , 'max': 1000 },
            'speedIndex': { 'min': 100 , 'max': 1000 },
            'score': { 'min': 0.9, 'max': 1 }
        }

        const failedMetrics = {}
        Object.entries(performanceBudget).forEach(([ metric, budget ]) => {
            const value = performanceLog[metric];
            if (value < budget.min || value > budget.max) {
                failedMetrics[metric] = {
                    value,
                    budget
                }
            }
        })

        assert.equal(
            Object.keys(failedMetrics).length, 0,
            `Following metrics are out of budget ${JSON.stringify(failedMetrics, null, 4)}`
        )
    })

    /**
     * The custom command will return 'pass' if the test falls within the predicted baseline
     * or 'fail'  if the performance metric falls outside the predicted baseline.
     * customers can decide how strict they want to be in failing tests by setting thier own
     * failure points.
     */
    it('(sauce:performance) custom command should assert pageload and speedIndex has not regressed', () => {
        const output = browser.execute('sauce:performance', {
            name: 'WebdriverIO Performance Example',
            metrics: ['speedIndex', 'load'],
        })
        const { result, details } = output
        return assert.equal(
            result, 'pass',
            `Regression detected for metrics ${JSON.stringify(details, null, 4)}`,
        )
    })
})
