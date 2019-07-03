const assert = require('assert')

describe('Performance Testing', () => {
    const { title } = this

    before(() => {
        browser.url('https://www.saucedemo.com')

        const username = process.env.PERF_USERNAME || 'standard_user'
        $('[data-test="username"]').setValue(username)
        $('[data-test="password"]').setValue('secret_sauce')
        $('.btn_action').click()
    })

    it('logs (sauce:performance) should check if all metrics were captured', () => {
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
        const performance = browser.execute('sauce:log', { type: 'sauce:performance' })
        metrics.forEach(metric => assert.ok(metric in performance, `${metric} metric is missing`))
    })

    /**
     * The custom command will return 'pass' if the test falls within the predicted baseline
     * or 'fail'  if the performance metric falls outside the predicted baseline.
     * customers can decide how strict they want to be in failing tests by setting thier own
     * failure points.
     */
    it('(sauce:performance) custom command should assert pageload and speedIndex has not regressed', () => {
        const output = browser.execute('sauce:performance', {
            name: title,
            metrics: ['speedIndex', 'load'],
        })
        const { result, details } = output
        return assert.equal(
            result, 'pass',
            `Regression detected for metrics ${JSON.stringify(details, null, 4)}`,
        )
    })
})
